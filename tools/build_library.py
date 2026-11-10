"""Rebuild the skill's asset library from upstream icon packages.

    npm pack simple-icons lucide-static @iconify-json/logos   # in a scratch folder, then untar each
    python3 tools/build_library.py <simple-icons/package> <lucide-static/package> <iconify-json-logos/package>

Writes assets/library/logos/ (Simple Icons, CC0-1.0), logos-color/ (gilbarbara/logos,
CC0-1.0) and icons/ (Lucide, ISC) next to their licence files. Each section is split into
numbered parts (001.json, 002.json, ...) of at most PART_BYTES with one item per line, so every
file in the plugin stays readable and under the plugin security scan's 256 KiB limit.

    python3 tools/build_library.py --resplit    # re-split the sections already in the library
"""
import json
import pathlib
import re
import shutil
import sys

OUT = pathlib.Path(__file__).resolve().parent.parent / 'plugins/interactive-map/skills/interactive-map/assets/library'
PART_BYTES = 200 * 1024
SECTIONS = ('logos', 'logos-color', 'icons')


def part_text(source, lines):
    return '{"source": ' + json.dumps(source) + ', "items": {\n' + ',\n'.join(lines) + '\n}}\n'


def write_section(name, source, items):
    """Write one section as numbered parts, one item per line, each part under PART_BYTES."""
    folder = OUT / name
    shutil.rmtree(folder, ignore_errors=True)
    folder.mkdir(parents=True)
    (OUT / f'{name}.json').unlink(missing_ok=True)  # the old single-file layout
    parts, lines, size = [], [], 0
    for key in sorted(items):
        line = json.dumps(key, ensure_ascii=False) + ': ' + json.dumps(items[key], separators=(',', ':'), ensure_ascii=False)
        if lines and size + len(line.encode()) + 2 > PART_BYTES - 200:
            parts.append(lines)
            lines, size = [], 0
        lines.append(line)
        size += len(line.encode()) + 2
    parts.append(lines)
    for number, chunk in enumerate(parts, 1):
        (folder / f'{number:03}.json').write_text(part_text(source, chunk), encoding='utf-8')
    return len(parts)


def logos(pkg):
    data = json.loads((pkg / 'data/simple-icons.json').read_text())
    result = {}
    for item in data:
        svg = (pkg / 'icons' / f"{item['slug']}.svg").read_text()
        path = re.search(r'<path d="([^"]+)"', svg).group(1)
        result[item['slug']] = {'name': item['title'], 'hex': item['hex'], 'path': path}
    return result


def color_logos(pkg):
    """gilbarbara/logos via @iconify-json/logos: full-colour marks, used where Simple Icons has none."""
    data = json.loads((pkg / 'icons.json').read_text())
    W, H = data.get('width', 16), data.get('height', 16)
    result = {}
    for name, icon in data['icons'].items():
        w, h = icon.get('width', W), icon.get('height', H)
        result[name] = {'box': f"{icon.get('left', 0)} {icon.get('top', 0)} {w} {h}", 'body': icon['body']}
    for name, alias in data.get('aliases', {}).items():
        if alias['parent'] in result:
            result[name] = result[alias['parent']]
    return result


def fallback(color, simple):
    """Keep only colour logos for brands Simple Icons lacks: render.py tries Simple Icons first."""
    key = lambda name: re.sub(r'-(icon|wordmark)$', '', name).replace('-', '')
    return {name: v for name, v in color.items() if key(name) not in simple}


def icons(pkg):
    result = {}
    for file in sorted((pkg / 'icons').glob('*.svg')):
        body = re.search(r'<svg[^>]*>(.*)</svg>', file.read_text(), re.S).group(1)
        body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
        result[file.stem] = re.sub(r'\s*\n\s*', '', body).replace(' />', '/>')
    return result


def main(si, lu, gb):
    si, lu, gb = pathlib.Path(si), pathlib.Path(lu), pathlib.Path(gb)
    OUT.mkdir(parents=True, exist_ok=True)
    version = lambda pkg: json.loads((pkg / 'package.json').read_text())['version']
    for name, data, pkg, licence in (('logos', logos(si), si, 'LICENSE.md'), ('icons', icons(lu), lu, 'LICENSE'),
                                     ('logos-color', fallback(color_logos(gb), logos(si)), gb, 'LICENSE')):
        source = f"{json.loads((pkg / 'package.json').read_text())['name']}@{version(pkg)}"
        parts = write_section(name, source, data)
        if (pkg / licence).is_file():
            shutil.copy(pkg / licence, OUT / f'{name}.LICENSE')
        else:  # iconify packages carry the licence in info.json
            info = json.loads((pkg / 'info.json').read_text())
            (OUT / f'{name}.LICENSE').write_text(
                f"{info['name']} by {info['author']['name']} ({info['author'].get('url', '')})\n"
                f"Licence: {info['license']['title']} ({info['license']['spdx']}), {info['license'].get('url', '')}\n"
                "Brand marks remain the trademarks of their owners.\n")
        print(name, len(data), 'items in', parts, 'parts')


def resplit():
    for name in SECTIONS:
        files = sorted((OUT / name).glob('*.json')) or [OUT / f'{name}.json']
        loaded = [json.loads(f.read_text(encoding='utf-8')) for f in files]
        items = {k: v for part in loaded for k, v in part['items'].items()}
        print(name, len(items), 'items in', write_section(name, loaded[0]['source'], items), 'parts')


if __name__ == '__main__':
    resplit() if sys.argv[1:] == ['--resplit'] else main(*sys.argv[1:4])
