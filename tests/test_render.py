"""Run: python3 -m unittest discover tests"""
import copy
import json
import pathlib
import re
import shutil
import subprocess
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SKILL = ROOT / 'plugins' / 'interactive-map' / 'skills' / 'interactive-map'
sys.path.insert(0, str(SKILL / 'scripts'))
import render  # noqa: E402

EXAMPLES = {p.stem: render.with_library(json.loads(p.read_text(encoding='utf-8'))) for p in sorted((SKILL / 'examples').glob('*.json'))}
EXAMPLE = EXAMPLES['fastapi-service']  # the smallest map; broken variants start from it
NODE = shutil.which('node')


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
    'node week without build step': lambda d: d['nodes'][0].update(week=99),
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


class RenderTest(unittest.TestCase):
    def test_example_maps_are_valid(self):
        for name, example in EXAMPLES.items():
            with self.subTest(name):
                self.assertEqual(render.problems(example), [])

    def test_python_rejects_every_broken_map(self):
        for name, change in BROKEN.items():
            with self.subTest(name):
                self.assertTrue(render.problems(broken(change)))

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

    def test_viewer_page_is_self_contained_with_one_empty_placeholder(self):
        page = render.viewer_page()
        self.assertEqual(page.count(render.PLACEHOLDER), 1)
        self.assertNotIn('src="./', page)
        self.assertNotIn('href="./', page)
        self.assertNotIn('url("./', page)
        self.assertIn('data:font/ttf;base64,', page)

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
