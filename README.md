# Interactive Map Builder

An interactive system-map viewer (components, connections, animated flows, build order, guided tour) packaged as a skill. The viewer is built once into a self-contained HTML template. The skill writes a map as JSON, and a Python script with no dependencies puts it into the template. The result is one HTML file that works without a server: open it from disk, send it as a file, or show it in an agent's browser.

## Layout

```
.claude-plugin/marketplace.json     Claude Code marketplace: lists the plugin below
app/                                viewer source (Vite): dev server + template build
  index.html                        contains an empty <script type="application/json" id="map-definition">
  src/main.js                       reads that tag; in dev loads the skill's example map
  src/app.js, src/runtime/, src/rendering/, src/styles/, src/template.html
  src/app.d.ts                      the map format as TypeScript types
  src/assets/fonts/                 Manrope (SIL Open Font License), inlined into the template
  vite.config.js                    public dir = the skill folder; --mode template inlines everything
plugins/interactive-map/
  .claude-plugin/plugin.json        plugin name and version (bump it to ship an update)
  skills/interactive-map/           the skill itself, self-contained; Node is not needed here
    SKILL.md
    assets/template.html            built from app/, committed
    assets/logos/                   logos a map can use as /assets/logos/<file>
    examples/fastapi-service.json   a complete small map; also the dev map
    scripts/render.py               map JSON -> HTML, Python 3 stdlib only
tests/test_render.py                render.py checks, incl. agreement with the page's own validator
```

## Work on the viewer

```bash
cd app
npm install
npm run dev              # the example map, live
npm run build:template   # rebuilds plugins/interactive-map/skills/interactive-map/assets/template.html
```

Rebuild the template only when viewer code or styles change. New maps never need a rebuild.

## Render a map without an agent

```bash
python3 plugins/interactive-map/skills/interactive-map/scripts/render.py \
  plugins/interactive-map/skills/interactive-map/examples/fastapi-service.json /tmp/map.html
open /tmp/map.html
python3 -m unittest discover tests
```

`render.py` applies the same checks the page runs before drawing (IDs, references, build steps, tour, geometry), plus a check that every section the viewer reads is present, and lists all problems at once. Paths such as `/assets/logos/slack.svg` become embedded `data:` URIs. To add a logo, drop the file into `assets/logos/`.

## Install the skill

The skill is the folder `plugins/interactive-map/skills/interactive-map/`. Every client gets a copy of it; only the Claude Code marketplace can deliver updates.

**Claude Code, through the marketplace (receives updates):**

```
/plugin marketplace add chekrizh/Interactive-Map-Builder
/plugin install interactive-map@interactive-map-builder
```

In a shell, the same is `claude plugin marketplace add chekrizh/Interactive-Map-Builder` and `claude plugin install interactive-map@interactive-map-builder`. The skill then triggers on its own and is also available as `/interactive-map:interactive-map`.

- Update on request: `/plugin marketplace update interactive-map-builder` in a session, or `claude plugin update interactive-map@interactive-map-builder` in a shell.
- Update automatically: `/plugin` → Marketplaces → interactive-map-builder → Enable auto-update. It is off by default for marketplaces like this one.

**Other clients (no updates; install the new copy again):**

- **Claude Code without the marketplace:** `cp -R plugins/interactive-map/skills/interactive-map ~/.claude/skills/`. Start a new session.
- **Claude apps (desktop, web):** `cd plugins/interactive-map/skills && zip -r interactive-map.zip interactive-map`, then upload the zip under Settings → Capabilities → Skills. Code execution must be on.
- **Codex:** copy the skill folder into the skills folder Codex reads (`~/.codex/skills/` at the time of writing).
- **ChatGPT:** upload the same zip where your workspace allows custom skills. This path has not been checked here.

## Release an update

1. Change the viewer in `app/` and run `npm run build:template`, or change the skill files directly.
2. Run `python3 -m unittest discover tests` and `claude plugin validate .`.
3. Bump `version` in `plugins/interactive-map/.claude-plugin/plugin.json`. Claude Code users keep their cached copy until this string changes, so a push without a bump reaches nobody.
4. Commit and push to `main`. Marketplace users get the update on their next update command, or on their own if they enabled auto-update.
5. Make a new zip for Claude apps and ChatGPT users; they have to upload it again.

Pages that were already generated do not change: each HTML file carries its own copy of the viewer and its map.

## Test on each device

Ask for a map, for example "Draw an interactive map of how this repository works", then check:

1. The skill triggers, writes JSON and runs `render.py`. The model must not type the HTML itself.
2. Where the file appears and how it is shown: preview pane, built-in browser, file card, or only a path.
3. The map opens on the big picture; stages open, components show their panel, and flows play.
4. The build order switch and the guided tour work.
5. Two different maps opened from disk keep separate tour progress.
6. The downloaded file still opens with the network off.

## Known limits

- **Authored HTML is trusted.** Many text fields are inserted as HTML. `SKILL.md` tells the model not to paste markup from sources it analyses, but nothing sanitises it yet. Add an allowlist sanitiser to `render.py` before wider release.
- **Geometry is manual.** Every node, edge path, zone and overview card needs exact coordinates; there is no automatic layout.
- **Size.** The template is about 340 KB, of which the font is about 214 KB. A model cannot retype it into a chat artifact, so the client has to show the file itself.
- **Browser tests** from the original project (interaction and visual parity) are not ported yet.
