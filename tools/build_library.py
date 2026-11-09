"""Rebuild the skill's asset library from upstream icon packages.

    npm pack simple-icons lucide-static   # in a scratch folder, then untar each
    python3 tools/build_library.py <simple-icons/package> <lucide-static/package>

Writes assets/library/logos.json (Simple Icons, CC0-1.0) and
assets/library/icons.json (Lucide, ISC) next to their licence files.
"""
import json
import pathlib
import re
import shutil
import sys

OUT = pathlib.Path(__file__).resolve().parent.parent / 'plugins/interactive-map/skills/interactive-map/assets/library'


def logos(pkg):
    data = json.loads((pkg / 'data/simple-icons.json').read_text())
    result = {}
    for item in data:
        svg = (pkg / 'icons' / f"{item['slug']}.svg").read_text()
        path = re.search(r'<path d="([^"]+)"', svg).group(1)
        result[item['slug']] = {'name': item['title'], 'hex': item['hex'], 'path': path}
    return result


def icons(pkg):
    result = {}
    for file in sorted((pkg / 'icons').glob('*.svg')):
        body = re.search(r'<svg[^>]*>(.*)</svg>', file.read_text(), re.S).group(1)
        body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
        result[file.stem] = re.sub(r'\s*\n\s*', '', body).replace(' />', '/>')
    return result


def main(si, lu):
    si, lu = pathlib.Path(si), pathlib.Path(lu)
    OUT.mkdir(parents=True, exist_ok=True)
    version = lambda pkg: json.loads((pkg / 'package.json').read_text())['version']
    for name, data, pkg, licence in (('logos', logos(si), si, 'LICENSE.md'), ('icons', icons(lu), lu, 'LICENSE')):
        payload = {'source': f"{json.loads((pkg / 'package.json').read_text())['name']}@{version(pkg)}", 'items': data}
        (OUT / f'{name}.json').write_text(json.dumps(payload, separators=(',', ':'), ensure_ascii=False))
        shutil.copy(pkg / licence, OUT / f'{name}.LICENSE')
        print(name, len(data), (OUT / f'{name}.json').stat().st_size // 1024, 'KB')


if __name__ == '__main__':
    main(*sys.argv[1:3])
