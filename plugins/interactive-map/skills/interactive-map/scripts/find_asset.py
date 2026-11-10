#!/usr/bin/env python3
"""Search the asset library for icons, logos and role presets. Python 3 standard library only.

usage: python3 find_asset.py WORD [WORD ...]
Prints the names to use in the map: "icon" values (Lucide), "logo" slugs (Simple Icons)
and role keys for "cat". Logos marked "colour fallback" come from gilbarbara/logos
and are used only where Simple Icons has no such slug. Matching is case-insensitive on names and logo titles.
"""
import json
import pathlib
import sys

LIBRARY = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'library'


def library(name):
    """One library section; large ones are split into numbered parts (library/logos/001.json, ...)."""
    items = {}
    for path in sorted((LIBRARY / name).glob('*.json')) or [LIBRARY / f'{name}.json']:
        items.update(json.loads(path.read_text(encoding='utf-8'))['items'])
    return items


def main(words):
    if not words:
        sys.exit(__doc__)
    words = [w.lower() for w in words]
    hit = lambda *texts: any(w in t.lower() for w in words for t in texts)
    icons = [k for k in library('icons') if hit(k)]
    logos = [f'{k} ({v["name"]})' for k, v in library('logos').items() if hit(k, v['name'])]
    logos += [f'{k} (colour fallback)' for k in library('logos-color') if hit(k) and not k.endswith('-wordmark')]
    roles = [f'{k} ({v["label"]})' for k, v in library('roles').items() if hit(k, v['label'])]
    for title, items in (('icons', icons), ('logos', logos), ('roles', roles)):
        print(f'{title}: ' + (', '.join(items[:60]) + (f' … {len(items) - 60} more' if len(items) > 60 else '') if items else 'none'))


if __name__ == '__main__':
    main(sys.argv[1:])
