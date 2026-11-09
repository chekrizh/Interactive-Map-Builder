#!/usr/bin/env python3
"""Fill the single-file template with page content. Python 3 standard library only.

usage: python3 render.py CONTENT.json OUT.html
       python3 render.py - OUT.html  < content.json
Prints the absolute path of OUT.html, or lists what to fix in the content and exits 1.
"""
import json
import pathlib
import sys

TEMPLATE = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'template.html'
PLACEHOLDER = '<script type="application/json" id="page-content"></script>'
FIELDS = {'lang', 'eyebrow', 'title', 'lede', 'sections'}
SECTION_FIELDS = {'heading', 'paragraphs', 'points'}


def problems(content):
    """Return a list of human-readable problems; empty means the content is valid."""
    if not isinstance(content, dict):
        return ['content must be a JSON object']
    found = [f'unknown field: {key}' for key in sorted(content.keys() - FIELDS)]
    for key in ('lang', 'eyebrow', 'lede'):
        if key in content and not isinstance(content[key], str):
            found.append(f'{key} must be a string')
    if not isinstance(content.get('title'), str) or not content['title'].strip():
        found.append('title must be a non-empty string')
    sections = content.get('sections')
    if not isinstance(sections, list) or not sections:
        return found + ['sections must be a non-empty list']
    for i, section in enumerate(sections):
        where = f'sections[{i}]'
        if not isinstance(section, dict):
            found.append(f'{where} must be an object')
            continue
        found += [f'{where}: unknown field {key}' for key in sorted(section.keys() - SECTION_FIELDS)]
        if not isinstance(section.get('heading'), str) or not section['heading'].strip():
            found.append(f'{where}.heading must be a non-empty string')
        for key in ('paragraphs', 'points'):
            items = section.get(key, [])
            if not isinstance(items, list) or not all(isinstance(x, str) and x.strip() for x in items):
                found.append(f'{where}.{key} must be a list of non-empty strings')
        if not section.get('paragraphs') and not section.get('points'):
            found.append(f'{where} needs paragraphs or points')
    return found


def render(template, content):
    if template.count(PLACEHOLDER) != 1:
        raise ValueError('template must contain exactly one empty page-content placeholder')
    # < keeps "</script>" and "<!--" inside the text from closing the tag early.
    payload = json.dumps(content, ensure_ascii=False).replace('<', '\\u003c')
    return template.replace(PLACEHOLDER, PLACEHOLDER.replace('></', f'>{payload}</'))


def main(argv):
    if len(argv) != 3:
        sys.exit(__doc__)
    source = sys.stdin.read() if argv[1] == '-' else pathlib.Path(argv[1]).read_text(encoding='utf-8')
    try:
        content = json.loads(source)
    except json.JSONDecodeError as error:
        sys.exit(f'content is not valid JSON: {error}')
    found = problems(content)
    if found:
        sys.exit('content needs fixing:\n- ' + '\n- '.join(found))
    out = pathlib.Path(argv[2])
    out.write_text(render(TEMPLATE.read_text(encoding='utf-8'), content), encoding='utf-8')
    print(out.resolve())


if __name__ == '__main__':
    main(sys.argv)
