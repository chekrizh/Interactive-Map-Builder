#!/usr/bin/env python3
"""Fill the single-file map template with a map definition. Python 3 standard library only.

usage: python3 render.py MAP.json OUT.html [--repo-dir DIR]
       python3 render.py - OUT.html [--repo-dir DIR]  < map.json
       python3 render.py MAP.json - --json  (the checked, filled-in definition, for the viewer's dev server)
Fills in what the map leaves out (interface strings, settings, timings: see defaults.py), checks
that the map holds together (the same rules the page applies before drawing),
applies the text contract (labels are plain text; other text may use a small HTML subset,
anything else is removed), turns /assets/... paths into data: URIs, builds one self-contained
page from the viewer in assets/viewer/ (its script, styles and font inlined, so the page needs
no network) and prints the absolute path of OUT.html.
With --repo-dir, every code reference (path:from-to) and every files entry must exist in that
checkout, and line ranges must fit inside their files.
Geometry the map leaves out of `layout` is computed first (auto_layout.py).
Warnings (fields the viewer ignores, markup that was removed) go to stderr and do not stop the build.
So does the layout check (layout_check.py): the cards, edges and labels as the viewer will draw
them, with problems a reader would see (overlaps, an edge through a card, a covered label) and
notes worth a look (a label that lost its chip).
On problems it lists what to fix and exits with status 1.
"""
import argparse
import base64
import html
import json
import mimetypes
import pathlib
import re
import sys

import auto_layout
import contract
import defaults
import layout_check

SKILL = pathlib.Path(__file__).resolve().parent.parent
ASSETS = SKILL / 'assets'
VIEWER = ASSETS / 'viewer'
PLACEHOLDER = '<script type="application/json" id="map-definition"></script>'
NUMBER = (int, float)
SHAPES = ('component', 'person', 'worker', 'database', 'queue', 'external')
# Sections the viewer reads, with the JSON type each must have (after defaults are filled in).
SECTIONS = {
    'id': str, 'page': dict, 'panels': dict, 'ui': dict, 'roles': dict, 'logos': dict, 'settings': dict,
    'layout': dict, 'nodes': list, 'edges': list, 'zones': list, 'groups': dict, 'overview': list,
    'overviewEdges': list, 'flows': dict, 'buildSteps': list, 'insides': dict, 'icons': dict,
    'tourChapters': list, 'tour': list, 'beatSeconds': NUMBER, 'flowBeatSeconds': NUMBER,
}
PLUGIN = SKILL.parent.parent / '.claude-plugin' / 'plugin.json'



def assets_in(value):
    """Every /assets/... string anywhere in the map."""
    if isinstance(value, dict):
        for item in value.values():
            yield from assets_in(item)
    elif isinstance(value, list):
        for item in value:
            yield from assets_in(item)
    elif isinstance(value, str) and value.startswith('/assets/'):
        yield value


def asset_file(value):
    """The file behind an /assets/... path, only if it really sits inside the skill's assets/."""
    path = (SKILL / value.lstrip('/')).resolve()
    return path if ASSETS in path.parents and path.is_file() else None


LIBRARY = ASSETS / 'library'


def library(name):
    """One library section, e.g. 'logos'. Large sections are split into numbered parts
    (library/logos/001.json, ...) so that every file stays small enough to review."""
    items = {}
    parts = sorted((LIBRARY / name).glob('*.json')) or [LIBRARY / f'{name}.json']
    for path in parts:
        if path.is_file():
            items.update(json.loads(path.read_text(encoding='utf-8'))['items'])
    return items


def svg_uri(svg):
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()


def library_logo(slug, simple, color):
    """A logo entry for the viewer. Simple Icons first: a white mark on a tile in the brand colour
    (a dark mark when the brand colour is very light). gilbarbara/logos in full colour as the fallback."""
    if slug in simple:
        item = simple[slug]
        r, g, b = (int(item['hex'][i:i + 2], 16) for i in (0, 2, 4))
        mark = '#1d2330' if 0.2126 * r + 0.7152 * g + 0.0722 * b > 200 else '#ffffff'
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="{mark}" d="{item["path"]}"/></svg>'
        return {'name': item['name'], 'src': svg_uri(svg), 'size': 20, 'tile': f'#{item["hex"]}'}
    for name in (slug, f'{slug}-icon'):
        if name in color:
            item = color[name]
            svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{item["box"]}">{item["body"]}</svg>'
            return {'name': slug, 'src': svg_uri(svg), 'size': 24}
    return None


def with_library(d):
    """Fill icons, logos and roles the map names but does not define from assets/library.

    Authored entries always win. Icons are Lucide (24px grid, scaled to the viewer's 20px grid),
    logos are Simple Icons slugs (gilbarbara/logos names as a fallback), roles are presets for C4 kinds. Returns a new dict."""
    if not isinstance(d, dict):
        return d
    d = dict(d)
    nodes = [n for n in d.get('nodes', []) if isinstance(n, dict)]
    groups = [g for g in (d.get('groups') or {}).values() if isinstance(g, dict)]
    icons, wanted = dict(d.get('icons') or {}), {x.get('icon') for x in nodes + groups} - {None}
    lib = library('icons') if wanted - set(icons) else {}
    for name in sorted(wanted - set(icons)):
        if name in lib:
            icons[name] = f'<g transform="scale(.8333)">{lib[name]}</g>'
    d['icons'] = icons
    logos, wanted = dict(d.get('logos') or {}), {n.get('logo') for n in nodes} - {None}
    if wanted - set(logos):
        simple, color = library('logos'), library('logos-color')
        for slug in sorted(wanted - set(logos)):
            entry = library_logo(slug, simple, color)
            if entry:
                logos[slug] = entry
    d['logos'] = logos
    roles = dict(d.get('roles') or {})
    used = {n.get('cat') for n in nodes} | {g.get('huekey') for g in groups}
    used |= {z.get('hue') for z in d.get('zones', []) if isinstance(z, dict)}
    used |= {f.get('hue') for f in (d.get('flows') or {}).values() if isinstance(f, dict)}
    used |= set(((d.get('settings') or {}).get('appearanceRoles') or {}).values())
    used.add((d.get('settings') or {}).get('buildRole'))
    lib = library('roles')
    for key in [k for k in lib if k in used and k not in roles]:
        roles[key] = lib[key]
    d['roles'] = roles
    return d


def problems(d):
    """Return what is wrong with the map; empty means it renders. Mirrors prepareDefinition()."""
    if not isinstance(d, dict):
        return ['the map must be a JSON object']
    found = [f'{key} is missing or has the wrong type' for key, kind in SECTIONS.items() if not isinstance(d.get(key), kind)]
    if found:
        return found  # the checks below need every section in place
    if not d['id'].strip():
        found.append('id must be a non-empty string')
    if not isinstance(d['page'].get('title'), str) or not d['page']['title'].strip():
        found.append('page.title must be a non-empty string')

    def listed(section):
        return [item for item in d[section] if isinstance(item, dict)]

    def ids(section, key='id'):
        seen = set()
        for item in d[section]:
            value = item.get(key) if isinstance(item, dict) else None
            if not value or value in seen:
                found.append(f'{section}: missing or duplicate {key} {value!r}')
            seen.add(value)
        return seen

    def ref(known, value, where):
        if value not in known:
            found.append(f'{where}: unknown reference {value!r}')

    nodes, edges, zones, groups = ids('nodes'), ids('edges'), ids('zones'), set(d['groups'])
    group_of = {n.get('id'): n.get('group') for n in listed('nodes')}
    steps = d['buildSteps']
    for n in listed('nodes'):
        nid = n.get('id')
        ref(groups, n.get('group'), f'node {nid}.group')
        if n.get('zone'):
            ref(zones, n['zone'], f'node {nid}.zone')
        for field, section in (('inside', 'insides'), ('logo', 'logos')):
            if n.get(field):
                ref(d[section], n[field], f'node {nid}.{field}')
        ref(d['roles'], n.get('cat'), f'node {nid}.cat')
        ref(d['icons'], n.get('icon'), f'node {nid}.icon')
        if n.get('shape') is not None and n['shape'] not in SHAPES:
            found.append(f'node {nid}.shape: {n["shape"]!r} is not one of {", ".join(SHAPES)}')
        if 'week' in n and 'step' not in n:
            found.append(f'node {nid}.week was renamed: write "step": {n["week"]!r}')
            continue
        step = n.get('step')
        if not (isinstance(step, int) and 0 <= step < len(steps) and steps[step]):
            found.append(f'node {nid}.step: no build step {step!r}')
    for e in listed('edges'):
        ref(nodes, e.get('from'), f'edge {e.get("id")}.from')
        ref(nodes, e.get('to'), f'edge {e.get("id")}.to')
    for gid, g in d['groups'].items():
        for member in g.get('members', []) if isinstance(g, dict) else []:
            ref(nodes, member, f'group {gid}.members')
            if member in group_of and group_of[member] != gid:
                found.append(f'group {gid}.members: node {member} belongs to group {group_of[member]!r}')
    for b in listed('overview'):
        ref(groups, b.get('g'), 'overview')
    for e in listed('overviewEdges'):
        ref(groups, e.get('from'), f'overview edge {e.get("id")}.from')
        ref(groups, e.get('to'), f'overview edge {e.get("id")}.to')
    for fid, f in d['flows'].items():
        f = f if isinstance(f, dict) else {}
        for h in f.get('hops', []):
            ref(edges, h.get('e'), f'flow {fid}.hops')
            if h.get('breaks'):
                ref(nodes, h['breaks'], f'flow {fid}.breaks')
            if h.get('silent'):
                ref(edges, h['silent'].get('e'), f'flow {fid}.silent')
        for e in f.get('silent', []):
            ref(edges, e, f'flow {fid}.silent')
    for step in steps:
        for n in step.get('nodes', []) if isinstance(step, dict) else []:
            ref(nodes, n, f'build step {step.get("title")!r}')
    chapters, tour = d['tourChapters'], listed('tour')
    for b in tour:
        ch = b.get('ch')
        if not (isinstance(ch, int) and 0 <= ch < len(chapters) and chapters[ch]):
            found.append(f'tour {b.get("title")!r}.ch: no chapter {ch!r}')
        if b.get('flow'):
            ref(d['flows'], b['flow'], f'tour {b.get("title")!r}.flow')
    if not tour:
        found.append('tour: at least one step is required')
    elif not tour[-1].get('flow') and not tour[-1].get('whole'):
        found.append('tour: the final step must walk a flow or recap the whole map')
    for index in range(len(chapters)):
        if not any(b.get('ch') == index for b in tour):
            found.append(f'tourChapters[{index}]: must contain at least one tour step')
    for g in d['settings'].get('recapOrder', []):
        ref(groups, g, 'settings.recapOrder')
    for key, role in d['settings'].get('appearanceRoles', {}).items():
        ref(d['roles'], role, f'settings.appearanceRoles.{key}')
    ref(d['roles'], d['settings'].get('buildRole'), 'settings.buildRole')

    layout = d['layout']
    for box in ('map', 'map0'):
        size = layout.get('viewBoxes', {}).get(box)
        if not (isinstance(size, list) and len(size) == 2 and all(isinstance(v, NUMBER) for v in size)):
            found.append(f'layout.viewBoxes.{box} must be [width, height]')
    for section, key in (('nodes', 'id'), ('edges', 'id'), ('zones', 'id'), ('overview', 'g')):
        for item in listed(section):
            if item.get(key) not in layout.get(section, {}):
                found.append(f'layout.{section}.{item.get(key)} is missing')
    for iid, scene in d['insides'].items():
        kind = scene.get('kind') if isinstance(scene, dict) else None
        if kind is None:  # a hand-drawn SVG scene needs its geometry
            if iid not in layout.get('insides', {}):
                found.append(f'layout.insides.{iid} is missing')
        elif kind == 'steps':
            if not (isinstance(scene.get('steps'), list) and scene['steps']
                    and all(isinstance(s, dict) and s.get('t') for s in scene['steps'])):
                found.append(f'insides.{iid}.steps must be a non-empty list of steps, each with "t"')
        elif kind == 'schema':
            if not (isinstance(scene.get('tables'), list) and scene['tables']
                    and all(isinstance(t, dict) and t.get('name') for t in scene['tables'])):
                found.append(f'insides.{iid}.tables must be a non-empty list of tables, each with "name"')
        else:
            found.append(f'insides.{iid}.kind: {kind!r} is not steps or schema')
    files = d.get('files')
    if files is not None:
        entries = files.get('entries') if isinstance(files, dict) else None
        if not (isinstance(entries, list) and entries):
            found.append('files.entries must be a non-empty list of paths')
            entries = []
        node_ids = {n.get('id') for n in listed('nodes')}
        paths = set()
        for i, e in enumerate(entries):
            path = e.get('path') if isinstance(e, dict) else None
            key = path.rstrip('/') if isinstance(path, str) else None
            if not key or path.startswith('/') or '..' in key.split('/') or '//' in path:
                found.append(f'files.entries[{i}].path must be a relative path like "src/" or "src/app.py", got {path!r}')
                continue
            if key in paths:
                found.append(f'files.entries[{i}].path {path!r} is listed twice')
            paths.add(key)
            if not isinstance(e.get('t'), str) or not e['t'].strip():
                found.append(f'files.entries[{i}] ({path}) needs "t": one line on what lives there')
            for n in e.get('nodes') or []:
                if n not in node_ids:
                    found.append(f'files.entries[{i}] ({path}).nodes: unknown node {n!r}')
    source = d.get('source')
    if source is not None and not (isinstance(source, dict) and contract.SAFE_HREF.match(str(source.get('repo', '')))
                                   and str(source['repo']).startswith('https://')):
        found.append('source.repo must be an https:// repository URL')
    for key, logo in d['logos'].items():
        src = logo.get('src') if isinstance(logo, dict) else None
        if not (isinstance(src, str) and (src.startswith('/assets/') or src.startswith('data:image/'))):
            found.append(f'logos.{key}.src must be /assets/logos/<file> from this skill, got {str(src)[:40]!r}')
    # Ids end up in attributes, CSS variables and selectors, so they keep to a safe alphabet.
    for section in contract.ID_LISTS:
        for item in listed(section):
            if isinstance(item.get('id'), str) and not contract.ID.match(item['id']):
                found.append(f'{section}: id {item["id"]!r} may use only letters, digits, "-", "_" and "."')
    for section in contract.ID_MAPS:
        for key in d[section]:
            if not contract.ID.match(key):
                found.append(f'{section}: key {key!r} may use only letters, digits, "-", "_" and "."')
    found += contract.check_text(d)[0]
    for e in listed('overviewEdges'):
        if e.get('id') not in layout.get('overviewEdges', {}):
            found.append(f'layout.overviewEdges.{e.get("id")} is missing')

    logos = ', '.join(sorted(p.name for p in (ASSETS / 'logos').glob('*'))) or 'none'
    for value in sorted(set(assets_in(d))):
        if not asset_file(value):
            found.append(f'{value} is not a file in the skill\'s assets/ (available logos: {logos})')
    return found


def warnings(d):
    """What render.py changes or the viewer ignores: worth fixing, but the page still builds."""
    def note(path):
        key = path.split('.')[-1]
        if path.startswith('panels.') and key in defaults.UI:
            return f'{path} moved to ui.{key}; drop it unless you want different wording'
        if contract.retired(path):
            return f'{path} is no longer used ({contract.retired(path)}); remove it'
        return f'{path} is not read by the viewer and is dropped; remove it or move its content to a field the viewer shows'
    notes = [note(path) for path in contract.unknown_fields(d)]
    return notes + contract.check_text(d)[1]


def repo_problems(d, repo):
    """Code references and files entries that do not match the checkout at repo."""
    repo = pathlib.Path(repo).resolve()
    if not repo.is_dir():
        return [f'--repo-dir {repo} is not a folder']
    found, lines = [], {}

    def inside(rel):
        path = (repo / rel).resolve()
        return path if path == repo or repo in path.parents else None

    for where, pattern, value, _ in contract.walk(d):
        if pattern in contract.CODE_FIELDS and isinstance(value, str):
            match = contract.CODE.match(value)
            if not match:
                continue  # reported by the text check
            rel, start, end = match.group(1), match.group(2), match.group(3) or match.group(2)
            path = inside(rel)
            if not (path and path.is_file()):
                found.append(f'{where}: {rel} is not a file in {repo}')
                continue
            if start:
                if path not in lines:
                    lines[path] = len(path.read_bytes().splitlines())
                first, last, total = int(start), int(end), lines[path]
                if not 1 <= first <= last <= total:
                    found.append(f'{where}: lines {first}-{last} do not fit {rel}, which has {total} lines')
        elif pattern == 'files.entries[].path' and isinstance(value, str):
            path = inside(value.rstrip('/'))
            if not (path and path.exists()):
                found.append(f'{where}: {value} does not exist in {repo}')
            elif value.endswith('/') != path.is_dir():
                found.append(f'{where}: {value} is a {"folder" if path.is_dir() else "file"} in {repo}; '
                             f'{"end" if path.is_dir() else "do not end"} the path with "/"')
    return found


def git_head(repo):
    """The commit a git checkout is on, read from .git without running git; None when unknown."""
    git = repo / '.git'
    try:
        head = (git / 'HEAD').read_text().strip()
        if not head.startswith('ref: '):
            return head
        name = head[5:]
        if (git / name).is_file():
            return (git / name).read_text().strip()
        for line in (git / 'packed-refs').read_text().splitlines():
            if line.endswith(' ' + name):
                return line.split()[0]
    except OSError:
        pass
    return None


def repo_warnings(d, repo):
    """The links point at source.ref; lines checked against a different commit may have moved."""
    ref = (d.get('source') or {}).get('ref') if isinstance(d.get('source'), dict) else None
    if not ref:
        return []
    head = git_head(pathlib.Path(repo))
    if not head or head.startswith(ref) or ref.startswith(head):
        return []
    return [f'source.ref is {ref[:12]} but {repo} is checked out at {head[:12]}: the line ranges were checked against the checkout']


def with_data_uris(value):
    if isinstance(value, dict):
        return {k: with_data_uris(v) for k, v in value.items()}
    if isinstance(value, list):
        return [with_data_uris(v) for v in value]
    if isinstance(value, str) and value.startswith('/assets/'):
        path = asset_file(value)
        mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        return f'data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}'
    return value


def viewer_page():
    """The empty viewer as one HTML file: viewer.js, viewer.css and the font inlined."""
    page = (VIEWER / 'index.html').read_text(encoding='utf-8')
    script = (VIEWER / 'viewer.js').read_text(encoding='utf-8').replace('</script', '<\\/script')
    styles = (VIEWER / 'viewer.css').read_text(encoding='utf-8')
    for font in VIEWER.glob('*.woff2'):
        uri = 'data:font/woff2;base64,' + base64.b64encode(font.read_bytes()).decode()
        styles = styles.replace(f'url("./{font.name}")', f'url("{uri}")')
    for tag, inline in (('<script type="module" crossorigin src="./viewer.js"></script>', f'<script type="module">{script}</script>'),
                        ('<link rel="stylesheet" crossorigin href="./viewer.css">', f'<style>{styles}</style>')):
        if page.count(tag) != 1:
            raise ValueError(f'assets/viewer/index.html must contain {tag} once')
        page = page.replace(tag, inline)
    return page


def plugin_version():
    try:
        return json.loads(PLUGIN.read_text(encoding='utf-8')).get('version', 'unknown')
    except (OSError, ValueError):
        return 'unknown'


def with_layout(d):
    """Geometry the map leaves out, computed by auto_layout.py. A map too broken to lay out
    is returned as it is, so problems() can say what is wrong with it."""
    if not (isinstance(d, dict) and isinstance(d.get('nodes'), list) and isinstance(d.get('edges'), list)):
        return d
    if d.get('layout') is not None and not isinstance(d.get('layout'), dict):
        return d
    try:
        return auto_layout.fill(d)
    except (KeyError, TypeError, ValueError, AttributeError, IndexError):
        return d


def complete(definition):
    """The authored map plus everything render.py fills in: layout, defaults, library assets, interface roles."""
    d = with_layout(definition)
    d = defaults.with_defaults(d)
    d = with_library(d)
    if isinstance(d, dict) and isinstance(d.get('settings'), dict) and isinstance(d.get('roles'), dict):
        d = defaults.with_appearance(d, d['roles'])
        d = with_library(d)  # the interface roles may name a library preset no node uses
    return d


def render(template, definition):
    if template.count(PLACEHOLDER) != 1:
        raise ValueError('template must contain exactly one empty map-definition placeholder')
    # Which plugin built the page, so a map file can be traced back to its viewer.
    template = template.replace('<meta charset="UTF-8">', f'<meta charset="UTF-8"><meta name="generator" content="interactive-map {plugin_version()}">', 1)
    # The page names itself before any script runs, for browser tabs, bookmarks and search results.
    page = definition.get('page', {}) if isinstance(definition, dict) else {}
    head = f'<title>{html.escape(str(page.get("title", "")).strip() or "System Map")}</title>'
    about = (page.get('slots') or {}).get('overviewDescription')
    if isinstance(about, str) and about.strip():
        about = html.unescape(re.sub(r'<[^>]*>', '', about)).strip()  # rich text: keep the words only
        head += f'<meta name="description" content="{html.escape(about)}">'
    template = template.replace('<title>System Map</title>', head, 1)
    # < keeps "</script>" and "<!--" inside authored strings from closing the tag early.
    payload = json.dumps(with_data_uris(definition), ensure_ascii=False).replace('<', '\\u003c')
    return template.replace(PLACEHOLDER, PLACEHOLDER.replace('></', f'>{payload}</'))


def main(argv):
    parser = argparse.ArgumentParser(usage=__doc__.split('\n\n')[1].removeprefix('usage: '))
    parser.add_argument('map')
    parser.add_argument('out')
    parser.add_argument('--repo-dir', help='checkout of the mapped repository; code references must exist in it')
    parser.add_argument('--json', action='store_true', help='write the definition the page would carry, as JSON, instead of the page')
    args = parser.parse_args(argv[1:])
    source = sys.stdin.read() if args.map == '-' else pathlib.Path(args.map).read_text(encoding='utf-8')
    try:
        definition = json.loads(source)
    except json.JSONDecodeError as error:
        sys.exit(f'the map is not valid JSON: {error}')
    definition = complete(definition)
    found = problems(definition)
    if not found and args.repo_dir:
        found = repo_problems(definition, args.repo_dir)
    if found:
        sys.exit('the map needs fixing:\n- ' + '\n- '.join(found))
    notes = warnings(definition) + (repo_warnings(definition, args.repo_dir) if args.repo_dir else [])
    if notes:
        print('warnings (the page was built anyway):\n- ' + '\n- '.join(notes), file=sys.stderr)
    layout_problems, layout_notes = layout_check.check(definition)
    if layout_problems:
        print('layout problems (a reader will see these; move cards or reroute edges):\n- ' + '\n- '.join(layout_problems), file=sys.stderr)
    if layout_notes:
        print('layout notes (look at them in the preview):\n- ' + '\n- '.join(layout_notes), file=sys.stderr)
    definition = contract.check_text(definition)[2]
    if args.json:
        text = json.dumps(with_data_uris(definition), ensure_ascii=False)
        if args.out == '-':
            sys.stdout.write(text)
        else:
            pathlib.Path(args.out).write_text(text, encoding='utf-8')
        return
    out = pathlib.Path(args.out)
    out.write_text(render(viewer_page(), definition), encoding='utf-8')
    print(out.resolve())


if __name__ == '__main__':
    main(sys.argv)
