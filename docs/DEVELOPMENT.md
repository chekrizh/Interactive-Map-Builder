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
    examples/                       kutt-url-shortener.json (the main example, hand layout),
                                    privatebin-pastebin.json (automatic layout),
                                    healthchecks-cron-monitor.json (automatic, steered by layout.grid),
                                    fastapi-service.json (the smallest complete map; the dev map);
                                    README.md credits each project and its mapped commit
    scripts/render.py               map JSON -> HTML; fills defaults and names from the library
    scripts/defaults.py             what a map may leave out: every interface string (English), settings, timings
    scripts/contract.py             fields the viewer reads, the text contract and the HTML sanitizer
    scripts/find_asset.py           search the library for icon, logo and role names
    scripts/auto_layout.py          lays out whatever the map leaves out of `layout`
    scripts/layout_check.py         redraws the map as the viewer does and reports layout problems
    scripts/metrics.json            Manrope character widths for layout_check.py (tools/build_metrics.js)
    scripts/preview.py, preview.js  screenshots of a rendered map (overview, full map, each flow)
    scripts/claims.py               lists a map's checkable statements with stable ids (the extra check)
  skills/interactive-map-repo/      repo mode: how to read a repository and model it in C4 terms;
                                    verify.md tells the extra check's reviewer what counts as confirmed
app/                                viewer source (Vite): dev server + template build
  src/app.d.ts                      the map format as TypeScript types
  src/runtime/engine.js             wires the viewer modules; each module gets explicit inputs
evals/maps/                         scripts that generate the Kutt and PrivateBin example maps
tests/test_render.py                render.py checks, incl. agreement with the page's own validator
tests/browser_probe.js              opens a map full of hostile text and reports anything that ran
tests/viewer_snapshots.js           screenshots and state after every action, to compare before/after
tools/build_library.py              rebuilds the icon and logo library from upstream packages
tools/build_metrics.js              measures Manrope for layout_check.py
tools/readme_shots.js, readme_gifs.js  capture the README screenshots and GIFs from the example maps
docs/extra-check-experiment.md      how the extra check was measured, and the results
docs/readme/                        images for the README; social-preview.png is uploaded by hand
                                    in Settings -> General -> Social preview
.github/workflows/                  release.yml (tag + release with skill zips), pages.yml (live demo)
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

A change to viewer code that should not change what a reader sees (a refactor) is checked with snapshots: render a map, run `node tests/viewer_snapshots.js page.html before/` on the old build and `... after/` on the new one, then `node tests/viewer_snapshots.js --compare before after`. It walks the same script through every view and reports any frame, state or DOM that differs.

Keep every file in the plugin readable and under 256 KiB (fonts and images aside): Claude's plugin security scan cannot inspect larger or minified files and shows users a warning that the plugin "couldn't be confirmed". `tests/test_render.py` checks the sizes. Rebuild the asset library with `tools/build_library.py`; it splits each section into numbered parts. New maps never need a rebuild. Run the tests with `python3 -m unittest discover tests`; with Node and Playwright installed they also open a map full of hostile text in Chromium and check that none of it runs. When the viewer font changes, rerun `node tools/build_metrics.js`; a test compares the layout check's card widths and label chips with what Chromium draws.

### Release an update

1. Change the viewer in `app/` and run `npm run build:template`, or change the skill files directly.
2. Run `python3 -m unittest discover tests` and `claude plugin validate .`.
3. **Bump `version` in `plugins/interactive-map/.claude-plugin/plugin.json`.** Claude Code users keep their cached copy until this string changes, so a push without a bump reaches nobody.
4. Merge to `main`. Marketplace users get the update on their next update command, or on their own if they enabled auto-update.
5. Nothing else by hand. On a version change `.github/workflows/release.yml` tags `v<version>` and publishes a GitHub release with one zip per skill for Claude apps users (who have to upload them again), and `.github/workflows/pages.yml` re-renders the live demo (the Kutt map) whenever the format skill changes.

When the viewer's look changes, update the README images: render the three real-project examples into one folder and run `node tools/readme_shots.js <that folder> docs/readme`, then `node tools/readme_gifs.js <that folder>/kutt-url-shortener.html docs/readme` for the two GIFs (needs ffmpeg).

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

- **Repositories only.** The skill maps code repositories; its method is still being tuned on real projects. Maps of topics built from a pile of sources or from a research question are planned, not started.
- **Layout is a grid.** `auto_layout.py` places cards on a grid and routes edges as horizontal and vertical runs. It is not a general graph layout: when the result reads badly, a map fixes cells with `layout.grid` or freezes and edits every position (see the `interactive-map` SKILL.md).
- **Text is sanitised at build time, not in the page.** `scripts/contract.py` holds the text contract: labels are plain text (rejected if they carry markup), every other text field keeps a small HTML subset and loses the rest, SVG fields keep drawing elements only, and URLs, colours and ids are checked for their shape. The page trusts what `render.py` wrote, so a definition mounted without `render.py` (the dev server) is not sanitised.
- **Size.** A rendered page is about 310 to 360 KB, of which the font is about 72 KB (a 54 KB WOFF2 file, inlined as base64). A model cannot retype it into a chat artifact, so the client has to show the file itself.
