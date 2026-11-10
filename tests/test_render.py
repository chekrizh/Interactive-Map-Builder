"""Run: python3 -m unittest discover tests"""
import copy
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SKILL = ROOT / 'plugins' / 'interactive-map' / 'skills' / 'interactive-map'
sys.path.insert(0, str(SKILL / 'scripts'))
import contract  # noqa: E402
import defaults  # noqa: E402
import render  # noqa: E402

EXAMPLES = {p.stem: render.complete(json.loads(p.read_text(encoding='utf-8'))) for p in sorted((SKILL / 'examples').glob('*.json'))}
EXAMPLE = EXAMPLES['fastapi-service']  # the smallest map; broken variants start from it
NODE = shutil.which('node')
PLAYWRIGHT = NODE and subprocess.run([NODE, '-e', 'require.resolve("playwright")'], capture_output=True).returncode == 0


def js_error(definition):
    """What the page's own validator (prepareDefinition) says: '' when it accepts the map."""
    module = (ROOT / 'app' / 'src' / 'runtime' / 'definition.js').as_uri()
    script = (f'import {{ prepareDefinition }} from "{module}"; let s = "";'
              'process.stdin.on("data", c => s += c).on("end", () => {'
              ' try { prepareDefinition(JSON.parse(s)); console.log(""); } catch (e) { console.log(e.message || String(e)); } });')
    run = subprocess.run([NODE, '--input-type=module', '-e', script], input=json.dumps(definition),
                         capture_output=True, text=True, check=True)
    return run.stdout.strip()


def broken(change):
    d = copy.deepcopy(EXAMPLE)
    change(d)
    return d


# Mistakes a model is likely to make; Python and the page must both reject each one.
BROKEN = {
    'edge to unknown node': lambda d: d['edges'][0].update(to='ghost'),
    'node in unknown group': lambda d: d['nodes'][0].update(group='ghost'),
    'duplicate node id': lambda d: d['nodes'].append(dict(d['nodes'][0])),
    'node step without build step': lambda d: d['nodes'][0].update(step=99),
    'node icon not in icons': lambda d: d['nodes'][0].update(icon='ghost'),
    'group lists a node of another group': lambda d: next(iter(d['groups'].values()))['members'].append(d['nodes'][-1]['id']),
    'flow hop on unknown edge': lambda d: next(iter(d['flows'].values()))['hops'][0].update(e='ghost'),
    'node without layout': lambda d: d['layout']['nodes'].pop(d['nodes'][0]['id']),
    'tour step with unknown flow': lambda d: d['tour'][0].update(flow='ghost'),
    'final tour step walks nothing': lambda d: [d['tour'][-1].pop(k, None) for k in ('flow', 'whole')],
    'recap order with unknown group': lambda d: d['settings']['recapOrder'].append('ghost'),
    'missing id': lambda d: d.pop('id'),
    'unknown node shape': lambda d: d['nodes'][0].update(shape='hexagon'),
    'steps scene without steps': lambda d: d['insides'].update(x={'kind': 'steps', 'title': 'x', 'steps': []}),
    'schema scene without tables': lambda d: d['insides'].update(x={'kind': 'schema', 'title': 'x'}),
    'files entry tied to unknown node': lambda d: d.update(files={'entries': [{'path': 'app/', 't': 'x', 'nodes': ['ghost']}]}),
    'files entry listed twice': lambda d: d.update(files={'entries': [{'path': 'app/', 't': 'x'}, {'path': 'app', 't': 'y'}]}),
    'files entry without a note': lambda d: d.update(files={'entries': [{'path': 'app/main.py'}]}),
    'files entry outside the repo': lambda d: d.update(files={'entries': [{'path': '../etc/', 't': 'x'}]}),
    'files without entries': lambda d: d.update(files={'entries': []}),
    'unknown scene kind': lambda d: d['insides'].update(x={'kind': 'movie', 'title': 'x'}),
}

# Text and link mistakes render.py rejects before the page exists (the page trusts its build).
BROKEN_TEXT = {
    'markup in a label': lambda d: d['nodes'][0].update(concept='<img src=x onerror=alert(1)>'),
    'entity in a label': lambda d: d['edges'][0].update(label='R&amp;D'),
    'markup in a tour title': lambda d: d['tour'][0].update(title='<b>Start</b>'),
    'javascript repository link': lambda d: d.update(source={'repo': 'javascript:alert(1)'}),
    'markup in an interface string': lambda d: d['ui'].update(tourNext='<img src=x onerror=alert(1)>'),
    'logo outside the assets': lambda d: d['logos'].update(x={'name': 'x', 'src': 'https://example.com/x.svg'}),
    'colour that escapes its rule': lambda d: next(iter(d['roles'].values())).update(light='red;}*{background:url(//x)'),
    'id with a quote': lambda d: d['edges'].append(dict(d['edges'][0], id='a"b')),
    'role key with a brace': lambda d: d['roles'].update({'x}': {'label': 'x'}}),
    'interface colour from an unknown role': lambda d: d['settings']['appearanceRoles'].update(accent='ghost'),
    'node still using week': lambda d: d['nodes'][0].update(week=d['nodes'][0].pop('step')),
    'code reference with markup': lambda d: d['insides'].update(x={'kind': 'steps', 'title': 'x', 'steps': [{'t': 'x', 'code': '<b>a.py</b>:1'}]}),
}
HOSTILE = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=2</script><a href="javascript:window.__pwned=3">x</a>'


class RenderTest(unittest.TestCase):
    def test_example_maps_are_valid(self):
        for name, example in EXAMPLES.items():
            with self.subTest(name):
                self.assertEqual(render.problems(example), [])

    def test_python_rejects_every_broken_map(self):
        for name, change in BROKEN.items():
            with self.subTest(name):
                self.assertTrue(render.problems(broken(change)))

    def test_python_rejects_unsafe_text_and_links(self):
        for name, change in BROKEN_TEXT.items():
            with self.subTest(name):
                self.assertTrue(render.problems(broken(change)))

    def test_example_maps_have_no_warnings(self):
        for name, example in EXAMPLES.items():
            with self.subTest(name):
                self.assertEqual(render.warnings(example), [])

    def test_unknown_fields_are_reported_once(self):
        d = broken(lambda d: (d['tour'][0].update(moments=[{'hops': [1], 'text': 'x'}]), d['nodes'][0].update(colour='red'),
                              d.update(insideMarkers='')))
        self.assertEqual(contract.unknown_fields(d), ['nodes[0].colour', 'tour[0].moments', 'insideMarkers'])
        self.assertTrue(all('not read by the viewer' in w for w in render.warnings(d)))

    @unittest.skipUnless(NODE, 'node is needed to run the page validator')
    def test_page_validator_agrees(self):
        for name, example in EXAMPLES.items():
            with self.subTest(name):
                self.assertEqual(js_error(example), '')
        for name, change in BROKEN.items():
            with self.subTest(name):
                self.assertTrue(js_error(broken(change)))

    def test_logos_become_data_uris_and_paths_stay_inside_assets(self):
        d = broken(lambda d: d['logos'].update(slack={'name': 'Slack', 'src': '/assets/logos/slack.svg', 'size': 20}))
        self.assertEqual(render.problems(d), [])
        self.assertTrue(render.with_data_uris(d)['logos']['slack']['src'].startswith('data:image/svg+xml;base64,'))
        for bad in ('/assets/logos/ghost.svg', '/assets/../SKILL.md', '/assets/../../../../etc/hosts'):
            with self.subTest(bad):
                d['logos']['slack']['src'] = bad
                self.assertTrue(any(bad in p for p in render.problems(d)))

    def test_markup_in_text_stays_inside_the_json_tag(self):
        d = broken(lambda d: d['page'].update(title='</script><script>alert(1)</script><!--'))
        page = render.render('<body>' + render.PLACEHOLDER + '</body>', d)
        payload = re.search(r'id="map-definition">(.*?)</script>', page).group(1)
        self.assertEqual(json.loads(payload), d)

    def test_rich_text_keeps_the_subset_and_drops_the_rest(self):
        cases = {
            'plain & simple "text"': 'plain & simple "text"',  # no '<': untouched
            '<b>bold</b> and <code>x</code>': '<b>bold</b> and <code>x</code>',
            'a < b, <i>c</i>': 'a &lt; b, <i>c</i>',
            '<script>alert(1)</script>after': 'after',
            '<img src=x onerror=alert(1)>text': 'text',
            '<a href="javascript:alert(1)" onclick="x">link</a>': '<a>link</a>',
            '<a href="https://example.com/?a=1&b=2" target="_blank">ok</a>':
                '<a href="https://example.com/?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">ok</a>',
            '<p style="color:red;background:url(//x)">s</p>': '<p>s</p>',
            '<button type="button" id="gofull" class="panel-action">Go</button>':
                '<button type="button" id="gofull" class="panel-action">Go</button>',
            '<button type="submit" id="tourCard">x</button>': '<button>x</button>',
            '<svg onload=alert(1)><circle/></svg>ok': 'ok',
        }
        for given, expected in cases.items():
            with self.subTest(given):
                self.assertEqual(contract.clean(given)[0], expected)
        self.assertTrue(contract.clean('<img src=x onerror=alert(1)>')[1])

    def test_svg_keeps_drawing_and_drops_scripts_and_outside_references(self):
        given = ('<path d="M0 0h4" stroke-width="2"/><rect x="1" y="1" width="2" height="2" rx=".5"/>'
                 '<use href="#m"/><use href="https://x/y.svg#a"/><image href="https://x/y.png"/>'
                 '<circle onclick="x" r="2" fill="url(https://x)"/><foreignObject><div>x</div></foreignObject>')
        self.assertEqual(contract.clean(given, svg=True)[0],
                         '<path d="M0 0h4" stroke-width="2"/><rect x="1" y="1" width="2" height="2" rx=".5"/>'
                         '<use href="#m"/><use/><circle r="2"/>')

    def test_render_strips_hostile_markup_from_every_rich_field(self):
        d = broken(lambda d: (d['nodes'][0].update(what=HOSTILE), next(iter(d['flows'].values()))['hops'][0].update(t=HOSTILE),
                              d['tour'][0].update(body=[HOSTILE], why=HOSTILE)))
        self.assertEqual(render.problems(d), [])
        cleaned = contract.check_text(d)[2]
        text = json.dumps(cleaned)
        for bad in ('onerror', '<script', 'javascript:', '<img'):
            self.assertNotIn(bad, text)
        self.assertEqual(len(contract.check_text(d)[1]), 4)  # one warning per cleaned field

    @unittest.skipUnless(PLAYWRIGHT, 'node and Playwright are needed to open the page')
    def test_hostile_text_does_not_run_in_the_page(self):
        """Every rich field of the Kutt map gets a payload, every label a quote that tries to leave its attribute."""
        kutt = EXAMPLES['kutt-url-shortener']
        skip = contract.URL_FIELDS | contract.COLOR_FIELDS | contract.CODE_FIELDS | contract.SVG_FIELDS

        def poison(value, path, pattern):
            if ' ' not in value or pattern in skip or pattern.startswith(('layout', 'settings')) or pattern == 'page.title':
                return value  # ids, references and geometry have no spaces
            if pattern in contract.LABELS or pattern.startswith('ui.'):
                return value + ' "q" onmouseover="window.__pwned=4"'
            return value + ' <b class="kept">ok</b>' + HOSTILE + '<svg onload="window.__pwned=5"></svg>'
        d = contract._rebuild(kutt, contract.SCHEMA, '', '', poison)
        d['icons']['user'] = kutt['icons']['user'] + '<foreignObject><img src=x onerror="window.__pwned=6"></foreignObject>'
        self.assertEqual(render.problems(d), [])
        with tempfile.TemporaryDirectory() as tmp:
            page = pathlib.Path(tmp) / 'hostile.html'
            page.write_text(render.render(render.viewer_page(), contract.check_text(d)[2]), encoding='utf-8')
            run = subprocess.run([NODE, str(ROOT / 'tests' / 'browser_probe.js'), str(page)],
                                 capture_output=True, text=True, check=True, timeout=300)
        found = json.loads(run.stdout)
        self.assertEqual((found['pwned'], found['handlers'], found['dialogs'], found['requests'], found['errors']),
                         (None, 0, [], [], []))
        self.assertGreater(found['kept'], 10)  # the allowed markup still renders as HTML

    def test_repo_dir_checks_code_references_and_files(self):
        with tempfile.TemporaryDirectory() as repo:
            (pathlib.Path(repo) / 'src').mkdir()
            (pathlib.Path(repo) / 'src' / 'app.py').write_text('\n'.join(f'line {i}' for i in range(1, 11)) + '\n')

            def with_refs(*codes, files=()):
                steps = [{'t': 'x', 'code': c} for c in codes]
                return broken(lambda d: (d['insides'].update(x={'kind': 'steps', 'title': 'x', 'steps': steps}),
                                         d.update(files={'entries': [{'path': p, 't': 'x'} for p in files]}) if files else None))
            self.assertEqual(render.repo_problems(with_refs('src/app.py', 'src/app.py:3', 'src/app.py:1-10', files=('src/', 'src/app.py')), repo), [])
            for code, words in (('src/app.py:9-11', 'has 10 lines'), ('src/app.py:0-2', 'do not fit'),
                                ('src/app.py:5-3', 'do not fit'), ('src/ghost.py:1', 'is not a file'),
                                ('../outside.py:1', 'is not a file'), ('src:1', 'is not a file')):
                with self.subTest(code):
                    found = render.repo_problems(with_refs(code), repo)
                    self.assertEqual(len(found), 1)
                    self.assertIn(words, found[0])
            for path, words in (('docs/', 'does not exist'), ('src', 'is a folder'), ('src/app.py/', 'is a file')):
                with self.subTest(path):
                    found = render.repo_problems(with_refs(files=(path,)), repo)
                    self.assertEqual(len(found), 1)
                    self.assertIn(words, found[0])

    def test_library_fills_icons_logos_and_roles_the_map_names(self):
        def use_library(d):
            d['nodes'][0].update(icon='database', logo='redis', cat='store')
            d['icons'].pop('client')
            d['groups']['request']['icon'] = 'database'
        d = render.with_library(broken(use_library))
        self.assertEqual(render.problems(d), [])
        self.assertIn('<ellipse', d['icons']['database'])
        self.assertTrue(d['logos']['redis']['src'].startswith('data:image/svg+xml;base64,'))
        self.assertEqual(d['logos']['redis']['tile'], '#FF4438')  # Simple Icons: white mark on brand colour
        self.assertEqual(d['roles']['store']['label'], 'Data store')
        aws = render.with_library(broken(lambda d: d['nodes'][0].update(logo='aws')))['logos']['aws']
        self.assertNotIn('tile', aws)  # not in Simple Icons: full-colour gilbarbara mark
        self.assertEqual(render.with_library(EXAMPLE)['roles'], EXAMPLE['roles'])  # authored entries win

    @unittest.skipUnless(NODE, 'node is needed to run the viewer code')
    def test_files_tree_adds_parents_and_lists_folders_first(self):
        module = (ROOT / 'app' / 'src' / 'runtime' / 'files-view.js').as_uri()
        entries = [{'path': 'server/handlers/links.js', 't': 'x'}, {'path': 'README.md', 't': 'y'}, {'path': 'docs/', 't': 'z'}]
        script = (f'import {{ buildFileTree }} from "{module}";'
                  f'const {{ root, byPath }} = buildFileTree({json.dumps(entries)});'
                  'const walk = n => n.kids.map(k => k.path + (k.dir ? "/" : "") + (k.entry ? "" : " (implied)")).concat(...n.kids.map(walk));'
                  'console.log(JSON.stringify(walk(root)));')
        run = subprocess.run([NODE, '--input-type=module', '-e', script], capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(run.stdout), ['docs/', 'server/ (implied)', 'README.md', 'server/handlers/ (implied)', 'server/handlers/links.js'])

    def test_defaults_fill_everything_but_authored_values_win(self):
        authored = json.loads((SKILL / 'examples' / 'fastapi-service.json').read_text(encoding='utf-8'))
        for key in ('ui', 'settings', 'beatSeconds', 'links'):
            self.assertNotIn(key, authored)  # the smallest example relies on the defaults
        full = render.complete(authored)
        self.assertEqual(set(full['ui']), set(defaults.UI))
        self.assertEqual(full['settings']['recapOrder'], [b['g'] for b in authored['overview']])
        self.assertEqual(full['settings']['appearanceRoles'], {'accent': 'service', 'artifact': 'service', 'error': 'error'})
        self.assertEqual(full['beatSeconds'], defaults.BEAT_SECONDS)
        mine = render.complete(dict(authored, ui={'tourNext': 'Onward'}, beatSeconds=9))
        self.assertEqual((mine['ui']['tourNext'], mine['ui']['tourBack'], mine['beatSeconds']), ('Onward', 'Back', 9))

    def test_retired_fields_say_what_replaced_them(self):
        d = broken(lambda d: (d['panels'].update(decision='Why', course='Note'), d.update(links={'x': '#'})))
        notes = '\n'.join(render.warnings(d))
        self.assertIn('panels.decision moved to ui.decision', notes)
        self.assertIn('panels.course is no longer used', notes)
        self.assertIn('links is no longer used', notes)

    def test_every_ui_string_in_the_viewer_has_a_default(self):
        """Keys the viewer asks for (t("key") in JS, {{ui.key}} in the template) all exist in defaults.UI, and none is unused."""
        src = ROOT / 'app' / 'src'
        code = '\n'.join(p.read_text(encoding='utf-8') for p in src.rglob('*.js'))
        used = set(re.findall(r'\bt\("(\w+)"', code)) | set(re.findall(r'\{\{ui\.(\w+)\}\}', (src / 'template.html').read_text(encoding='utf-8')))
        used |= {'flowEyebrow', 'failureFlowEyebrow', 'tourTitle', 'tourNew', 'tourBegin', 'tourFinish', 'tourNext', 'bigPicture', 'fullMap', 'completionCount'}  # picked by a ternary
        self.assertEqual(used - set(defaults.UI), set())
        self.assertEqual(set(defaults.UI) - used, set())

    def test_page_names_the_plugin_version(self):
        version = json.loads(render.PLUGIN.read_text(encoding='utf-8'))['version']
        page = render.render(render.viewer_page(), EXAMPLE)
        self.assertIn(f'<meta name="generator" content="interactive-map {version}">', page)

    def test_viewer_page_is_self_contained_with_one_empty_placeholder(self):
        page = render.viewer_page()
        self.assertEqual(page.count(render.PLACEHOLDER), 1)
        self.assertNotIn('src="./', page)
        self.assertNotIn('href="./', page)
        self.assertNotIn('url("./', page)
        self.assertIn('data:font/woff2;base64,', page)

    def test_plugin_files_stay_readable_for_the_security_scan(self):
        """The plugin scan holds any non-image, non-font file over 256 KiB as one it couldn't inspect."""
        plugin = ROOT / 'plugins' / 'interactive-map'
        files = [p for p in plugin.rglob('*') if p.is_file()]
        self.assertLessEqual(len(files), 512)
        for path in files:
            if path.suffix in ('.ttf', '.woff2', '.png', '.jpg'):
                continue
            with self.subTest(str(path.relative_to(plugin))):
                self.assertLess(path.stat().st_size, 256 * 1024)


if __name__ == '__main__':
    unittest.main()
