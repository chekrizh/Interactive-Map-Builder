#!/usr/bin/env python3
"""Screenshot a rendered map so you can check it by eye before handing it over.

usage: python3 preview.py MAP.html [OUT_DIR] [--theme light|dark]

Takes the overview, the full map and every flow at its end, saves them as PNG files in
OUT_DIR (default: a folder next to the page named <page>-preview) and prints their paths.
Needs Playwright with Chromium, from Python (`import playwright`) or Node (`require('playwright')`);
it installs nothing. Without either it says so and exits with status 3: rely on render.py's
layout check alone and tell the user the map was not checked by eye.
"""
import argparse
import json
import os
import pathlib
import shutil
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent


def node_playwright():
    """The env that lets `node` load Playwright, or None."""
    node = shutil.which('node')
    if not node:
        return None
    env = dict(os.environ)
    try:
        root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True, timeout=20).stdout.strip()
    except (OSError, subprocess.SubprocessError):
        root = ''
    if root:
        env['NODE_PATH'] = os.pathsep.join(filter(None, [env.get('NODE_PATH'), root]))
    probe = subprocess.run([node, '-e', "require.resolve('playwright')"], env=env, capture_output=True)
    return env if probe.returncode == 0 else None


def with_node(env, page, out, theme):
    run = subprocess.run(['node', str(HERE / 'preview.js'), str(page), str(out), theme],
                         env=env, capture_output=True, text=True, timeout=600)
    if run.returncode:
        sys.exit(f'preview failed: {run.stderr.strip()}')
    return json.loads(run.stdout.strip().splitlines()[-1])


def with_python(page, out, theme):
    """The same steps as preview.js, through Python's Playwright."""
    from playwright.sync_api import sync_playwright
    out.mkdir(parents=True, exist_ok=True)
    shots, errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        tab = browser.new_page(viewport={'width': 1600, 'height': 1000}, reduced_motion='reduce')
        tab.on('pageerror', lambda e: errors.append(str(e)))
        tab.goto(page.as_uri() + '#theme=' + theme)
        tab.wait_for_function('() => window.mapViewer', timeout=15000)
        tab.wait_for_timeout(600)

        def shoot(name):
            path = out / f'{name}.png'
            stage = tab.query_selector('.stagecard')
            (stage or tab).screenshot(path=str(path))
            shots.append(str(path))

        shoot('1-overview')
        tab.click('#gofull', force=True)
        tab.wait_for_timeout(900)
        shoot('2-full-map')
        flows = tab.eval_on_selector_all('[data-flow]', 'els => [...new Set(els.map(e => e.dataset.flow))]')
        for i, flow in enumerate(flows):
            tab.evaluate('id => window.mapViewer.playFlow(id)', flow)
            tab.wait_for_timeout(400)
            shoot(f'{3 + i}-flow-{flow}')
        browser.close()
    return {'shots': shots, 'errors': errors}


def main(argv):
    parser = argparse.ArgumentParser(usage=__doc__.split('\n\n')[1].removeprefix('usage: '))
    parser.add_argument('page')
    parser.add_argument('out', nargs='?')
    parser.add_argument('--theme', choices=('light', 'dark'), default='light')
    args = parser.parse_args(argv[1:])
    page = pathlib.Path(args.page).resolve()
    if not page.is_file():
        sys.exit(f'no such page: {page}')
    out = pathlib.Path(args.out).resolve() if args.out else page.with_name(page.stem + '-preview')
    try:
        import playwright.sync_api  # noqa: F401
        result = with_python(page, out, args.theme)
    except ImportError:
        env = node_playwright()
        if env is None:
            print('no Playwright here (neither Python nor Node can load it); the map was not checked by eye',
                  file=sys.stderr)
            sys.exit(3)
        result = with_node(env, page, out, args.theme)
    for error in result['errors']:
        print(f'page error: {error}', file=sys.stderr)
    print('\n'.join(str(pathlib.Path(s).resolve()) for s in result['shots']))
    if result['errors']:
        sys.exit(1)


if __name__ == '__main__':
    main(sys.argv)
