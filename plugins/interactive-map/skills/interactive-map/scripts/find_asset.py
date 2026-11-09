#!/usr/bin/env python3
"""Search the asset library for icons, logos and role presets. Python 3 standard library only.

usage: python3 find_asset.py WORD [WORD ...]
Prints the names to use in the map: "icon" values (Lucide), "logo" slugs (Simple Icons)
and role keys for "cat". Matching is case-insensitive on names and logo titles.
"""
import json
import pathlib
import sys

LIBRARY = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'library'


def main(words):
    if not words:
        sys.exit(__doc__)
    words = [w.lower() for w in words]
    hit = lambda *texts: any(w in t.lower() for w in words for t in texts)
    load = lambda name: json.loads((LIBRARY / f'{name}.json').read_text(encoding='utf-8'))['items']
    icons = [k for k in load('icons') if hit(k)]
    logos = [f'{k} ({v["name"]})' for k, v in load('logos').items() if hit(k, v['name'])]
    roles = [f'{k} ({v["label"]})' for k, v in load('roles').items() if hit(k, v['label'])]
    for title, items in (('icons', icons), ('logos', logos), ('roles', roles)):
        print(f'{title}: ' + (', '.join(items[:60]) + (f' … {len(items) - 60} more' if len(items) > 60 else '') if items else 'none'))


if __name__ == '__main__':
    main(sys.argv[1:])
