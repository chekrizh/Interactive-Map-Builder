#!/usr/bin/env python3
"""Fill the single-file map template with a map definition. Python 3 standard library only.

usage: python3 render.py MAP.json OUT.html
       python3 render.py - OUT.html  < map.json
Checks that the map holds together (the same rules the page applies before drawing),
turns /assets/... paths into data: URIs, and prints the absolute path of OUT.html.
On problems it lists what to fix and exits with status 1.
"""
import base64
import json
import mimetypes
import pathlib
import sys

SKILL = pathlib.Path(__file__).resolve().parent.parent
ASSETS = SKILL / 'assets'
TEMPLATE = ASSETS / 'template.html'
PLACEHOLDER = '<script type="application/json" id="map-definition"></script>'
NUMBER = (int, float)
SHAPES = ('component', 'person', 'worker', 'database', 'queue', 'external')
# Sections the viewer reads, with the JSON type each must have.
SECTIONS = {
    'id': str, 'page': dict, 'panels': dict, 'ui': dict, 'roles': dict, 'logos': dict, 'settings': dict,
    'layout': dict, 'nodes': list, 'edges': list, 'zones': list, 'groups': dict, 'overview': list,
    'overviewEdges': list, 'flows': dict, 'buildSteps': list, 'insides': dict, 'icons': dict,
    'tourChapters': list, 'tour': list, 'beatSeconds': NUMBER, 'flowBeatSeconds': NUMBER, 'links': dict,
}


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
    path = LIBRARY / f'{name}.json'
    return json.loads(path.read_text(encoding='utf-8'))['items'] if path.is_file() else {}


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
    for name in wanted - set(icons):
        if name in lib:
            icons[name] = f'<g transform="scale(.8333)">{lib[name]}</g>'
    d['icons'] = icons
    logos, wanted = dict(d.get('logos') or {}), {n.get('logo') for n in nodes} - {None}
    if wanted - set(logos):
        simple, color = library('logos'), library('logos-color')
        for slug in wanted - set(logos):
            entry = library_logo(slug, simple, color)
            if entry:
                logos[slug] = entry
    d['logos'] = logos
    roles = dict(d.get('roles') or {})
    used = {n.get('cat') for n in nodes} | {g.get('huekey') for g in groups}
    used |= {z.get('hue') for z in d.get('zones', []) if isinstance(z, dict)}
    used |= {f.get('hue') for f in (d.get('flows') or {}).values() if isinstance(f, dict)}
    used |= set(((d.get('settings') or {}).get('appearanceRoles') or {}).values())
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
        week = n.get('week')
        if not (isinstance(week, int) and 0 <= week < len(steps) and steps[week]):
            found.append(f'node {nid}.week: no build step {week!r}')
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
    if not isinstance(d['settings'].get('appearanceRoles'), dict):
        found.append('settings.appearanceRoles is missing')

    layout = d['layout']
    for box in ('map', 'map0'):
        size = layout.get('viewBoxes', {}).get(box)
        if not (isinstance(size, list) and len(size) == 2 and all(isinstance(v, NUMBER) for v in size)):
            found.append(f'layout.viewBoxes.{box} must be [width, height]')
    for section, key in (('nodes', 'id'), ('edges', 'id'), ('zones', 'id'), ('overview', 'g')):
        for item in listed(section):
            if item.get(key) not in layout.get(section, {}):
                found.append(f'layout.{section}.{item.get(key)} is missing')
    for iid in d['insides']:
        if iid not in layout.get('insides', {}):
            found.append(f'layout.insides.{iid} is missing')
    for e in listed('overviewEdges'):
        if e.get('id') not in layout.get('overviewEdges', {}):
            found.append(f'layout.overviewEdges.{e.get("id")} is missing')

    logos = ', '.join(sorted(p.name for p in (ASSETS / 'logos').glob('*'))) or 'none'
    for value in sorted(set(assets_in(d))):
        if not asset_file(value):
            found.append(f'{value} is not a file in the skill\'s assets/ (available logos: {logos})')
    return found


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


def render(template, definition):
    if template.count(PLACEHOLDER) != 1:
        raise ValueError('template must contain exactly one empty map-definition placeholder')
    # < keeps "</script>" and "<!--" inside authored strings from closing the tag early.
    payload = json.dumps(with_data_uris(definition), ensure_ascii=False).replace('<', '\\u003c')
    return template.replace(PLACEHOLDER, PLACEHOLDER.replace('></', f'>{payload}</'))


def main(argv):
    if len(argv) != 3:
        sys.exit(__doc__)
    source = sys.stdin.read() if argv[1] == '-' else pathlib.Path(argv[1]).read_text(encoding='utf-8')
    try:
        definition = json.loads(source)
    except json.JSONDecodeError as error:
        sys.exit(f'the map is not valid JSON: {error}')
    definition = with_library(definition)
    found = problems(definition)
    if found:
        sys.exit('the map needs fixing:\n- ' + '\n- '.join(found))
    out = pathlib.Path(argv[2])
    out.write_text(render(TEMPLATE.read_text(encoding='utf-8'), definition), encoding='utf-8')
    print(out.resolve())


if __name__ == '__main__':
    main(sys.argv)
