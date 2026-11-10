# Developing Interactive Map Builder

Notes for working on the viewer and the skills, releasing updates and testing them.

## Repository layout

```
.claude-plugin/marketplace.json     Claude Code marketplace: lists the plugin below
plugins/interactive-map/
  .claude-plugin/plugin.json        plugin name and version (bump it to ship an update)
  skills/interactive-map/           the format and renderer; self-contained, no Node needed
    SKILL.md
    assets/viewer/                  the viewer (unminified JS, CSS, font), built from app/ and committed;
                                    render.py inlines it into each page
    assets/logos/                   custom logos a map can use as /assets/logos/<file>
    assets/library/                 icons, logos and role presets, split into files under 256 KB
    examples/kutt-url-shortener.json  the main example: a C4 map of a real repo
    examples/fastapi-service.json   the smallest complete map; the dev map
    scripts/render.py               map JSON -> HTML; fills defaults and names from the library
    scripts/defaults.py             what a map may leave out: every interface string (English), settings, timings
    scripts/contract.py             fields the viewer reads, the text contract and the HTML sanitizer
    scripts/find_asset.py           search the library for icon, logo and role names
  skills/interactive-map-repo/      repo mode: how to read a repository and model it in C4 terms
app/                                viewer source (Vite): dev server + template build
  src/app.d.ts                      the map format as TypeScript types
evals/                              scripts that build and check the example maps
tests/test_render.py                render.py checks, incl. agreement with the page's own validator
docs/readme/                        images for the README
```

## Develop the viewer

```bash
cd app
npm install
npm run dev              # examples/fastapi-service.json, live (?map=kutt-url-shortener for Kutt).
                         # Examples are served through render.py --json, so defaults, library
                         # assets and the sanitizer apply exactly as in a rendered page
npm run build:template   # rebuilds plugins/interactive-map/skills/interactive-map/assets/viewer/
```

Rebuild the viewer only when viewer code or styles change.

Keep every file in the plugin readable and under 256 KiB (fonts and images aside): Claude's plugin security scan cannot inspect larger or minified files and shows users a warning that the plugin "couldn't be confirmed". `tests/test_render.py` checks the sizes. Rebuild the asset library with `tools/build_library.py`; it splits each section into numbered parts. New maps never need a rebuild. Run the tests with `python3 -m unittest discover tests`; with Node and Playwright installed they also open a map full of hostile text in Chromium and check that none of it runs.

### Release an update

1. Change the viewer in `app/` and run `npm run build:template`, or change the skill files directly.
2. Run `python3 -m unittest discover tests` and `claude plugin validate .`.
3. **Bump `version` in `plugins/interactive-map/.claude-plugin/plugin.json`.** Claude Code users keep their cached copy until this string changes, so a push without a bump reaches nobody.
4. Merge to `main`. Marketplace users get the update on their next update command, or on their own if they enabled auto-update.
5. Make new zips for Claude apps and ChatGPT users; they have to upload them again.

Pages that were already generated do not change: each HTML file carries its own copy of the viewer and its map.

### Test on each device

Ask for a map, for example "Draw an interactive map of how this repository works", then check:

1. The skill triggers, writes JSON and runs `render.py`. The model must not type the HTML itself.
2. Where the file appears and how it is shown: preview pane, built-in browser, file card, or only a path.
3. The map opens on the big picture; cards open their part, components show their panel, flows play.
4. The build order switch and the guided tour work.
5. Two different maps opened from disk keep separate tour progress.
6. The downloaded file still opens with the network off.

## Known limits

- **Prototype.** Only the repository mode is implemented, and its method is still being tuned. The modes for a pile of sources and for a research question are planned.
- **Geometry is manual.** Every node, edge path, zone and overview card needs exact coordinates; there is no automatic layout yet.
- **Text is sanitised at build time, not in the page.** `scripts/contract.py` holds the text contract: labels are plain text (rejected if they carry markup), every other text field keeps a small HTML subset and loses the rest, SVG fields keep drawing elements only, and URLs, colours and ids are checked for their shape. The page trusts what `render.py` wrote, so a definition mounted without `render.py` (the dev server) is not sanitised.
- **Size.** A rendered page is about 340 KB, of which the font (WOFF2, all glyphs) is about 72 KB. A model cannot retype it into a chat artifact, so the client has to show the file itself.
