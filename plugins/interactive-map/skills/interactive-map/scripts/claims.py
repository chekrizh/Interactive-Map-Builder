#!/usr/bin/env python3
"""List the factual claims a map makes, one per line, for checking them against the source.

usage: python3 claims.py MAP.json [--json] [--only ID[,ID...]]

Each claim gets a stable id built from the map's own ids, so a checker can return a verdict per
claim and a later round can recheck only the claims that changed:

  node:<id>                  a component exists, what it is built with and what it does
  edge:<id>                  one component talks to another in the way the label says
  flow:<flow>/<n>            step n of a flow happens, in this order
  inside:<scene>/step<n>     step n of a code walkthrough, with its code reference
  inside:<scene>/exit<n>     the early exit of step n
  inside:<scene>/table<n>    a table or cache key, its fields and lifetime
  files:<path>               what a folder or file in the repository holds

The tour, the build order, the overview cards and the start panels retell these claims and are
not listed. Markup is stripped; code references are kept so the checker can open them first.
"""
import argparse
import html
import json
import re
import sys

TAG = re.compile(r'<[^>]+>')


def plain(text):
    """Rich text as one line of plain text."""
    if not isinstance(text, str):
        return ''
    return re.sub(r'\s+', ' ', html.unescape(TAG.sub(' ', text))).strip()


def join(*parts):
    return ' '.join(p for p in (plain(x) for x in parts) if p)


def claims(d):
    """Every checkable claim in map definition d, as dicts with id, kind, text and code."""
    out = []
    nodes = {n['id']: n for n in d.get('nodes', []) if isinstance(n, dict) and 'id' in n}
    edges = {e['id']: e for e in d.get('edges', []) if isinstance(e, dict) and 'id' in e}

    def name(node_id):
        n = nodes.get(node_id)
        return plain(n.get('concept')) if n else node_id

    def add(cid, kind, text, code=None):
        out.append({'id': cid, 'kind': kind, 'text': text, 'code': [c for c in (code or []) if c]})

    for n in nodes.values():
        what = f"{name(n['id'])} ({plain(n.get('tool'))})"
        add(f"node:{n['id']}", 'component',
            join(what + '.', n.get('what'), 'Why: ' + plain(n.get('why')) if n.get('why') else '',
                 'Built with: ' + plain(n.get('tools')) if n.get('tools') else ''))

    for e in edges.values():
        add(f"edge:{e['id']}", 'connection',
            f"{name(e.get('from'))} -> {name(e.get('to'))}: {plain(e.get('label')) or '(no label)'}")

    flows = d.get('flows', {})
    for fid, f in (flows.items() if isinstance(flows, dict) else []):
        for i, hop in enumerate(f.get('hops', []), 1):
            e = edges.get(hop.get('e'), {})
            way = f"{name(e.get('to'))} -> {name(e.get('from'))}" if hop.get('rev') else \
                f"{name(e.get('from'))} -> {name(e.get('to'))}"
            add(f'flow:{fid}/{i}', 'flow step',
                f"Flow \"{plain(f.get('title'))}\", step {i} of {len(f.get('hops', []))} ({way}): {plain(hop.get('t'))}")

    insides = d.get('insides', {})
    for sid, scene in (insides.items() if isinstance(insides, dict) else []):
        where = plain(scene.get('title')) or sid
        for i, s in enumerate(scene.get('steps', []) or [], 1):
            add(f'inside:{sid}/step{i}', 'code step',
                f"{where}, step {i}: {join(s.get('t') + '.' if s.get('t') else '', s.get('d'))}",
                [s.get('code')])
            x = s.get('exit')
            if isinstance(x, dict):
                add(f'inside:{sid}/exit{i}', 'code exit',
                    f"{where}, step {i}: when {plain(x.get('when'))}, {plain(x.get('t'))}",
                    [x.get('code') or s.get('code')])
        for i, t in enumerate(scene.get('tables', []) or [], 1):
            fields = '; '.join(join(f.get('n'), f.get('type'), '-> ' + plain(f.get('ref')) if f.get('ref') else '',
                                    f.get('note')) for f in t.get('fields', []) or [] if isinstance(f, dict))
            add(f'inside:{sid}/table{i}', 'data',
                f"{where}: {join(t.get('name'), '(' + plain(t.get('ttl')) + ')' if t.get('ttl') else '', t.get('note'))}"
                + (f" Fields: {fields}" if fields else ''), [t.get('code')])

    for entry in (d.get('files') or {}).get('entries', []):
        if isinstance(entry, dict) and entry.get('path'):
            tied = ', '.join(name(x) for x in entry.get('nodes', []) or [])
            add(f"files:{entry['path']}", 'repository path',
                join(f"{entry['path']}:", entry.get('t'), entry.get('why'))
                + (f" Implements: {tied}." if tied else ''), [entry['path']])
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument('map')
    p.add_argument('--json', action='store_true', help='print a JSON list instead of text')
    p.add_argument('--only', help='comma-separated claim ids to keep (recheck after a fix)')
    a = p.parse_args()
    d = json.load(sys.stdin if a.map == '-' else open(a.map, encoding='utf-8'))
    found = claims(d)
    if a.only:
        keep = set(a.only.split(','))
        found = [c for c in found if c['id'] in keep]
    if a.json:
        print(json.dumps(found, ensure_ascii=False, indent=1))
        return
    for c in found:
        code = f"  [{', '.join(c['code'])}]" if c['code'] else ''
        print(f"{c['id']}\t{c['text']}{code}")
    print(f'{len(found)} claims', file=sys.stderr)


if __name__ == '__main__':
    main()
