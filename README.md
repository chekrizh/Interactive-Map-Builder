# Interactive Map Builder: single-file skill prototype

A minimal test of the approach planned for the Interactive-Map-Builder. The app is built once into a self-contained HTML template. A skill then fills that template with JSON content using Python's standard library and returns one HTML file that works without a server: open it from disk, send it as a file, or show it in an agent's browser.

The test skill is `pretty-text`. It takes a user's text, lays it out as JSON, and returns it as a small page that shows one section at a time.

## Layout

```
app/                         page source (Vite): dev server + template build
  index.html                 contains an empty <script type="application/json" id="page-content">
  src/main.js                reads that tag; in dev falls back to src/content.json
  src/style.css              styles; the palette follows the ML System Map
  src/fonts/                 Manrope (SIL Open Font License), inlined into the template
  src/content.json           sample content, in the same format the skill writes
  vite.config.js             --mode template: inlines JS, CSS and the font into one file
.claude-plugin/
  marketplace.json           Claude Code marketplace: lists the plugin below
plugins/pretty-text/         Claude Code plugin
  .claude-plugin/plugin.json plugin name and version (bump it to ship an update)
  skills/pretty-text/        the skill itself, self-contained; Node is not needed here
    SKILL.md
    assets/template.html     built from app/, committed
    scripts/render.py        content JSON -> HTML, Python 3 stdlib only
tests/test_render.py         stdlib checks for render.py
```

## Work on the page

```bash
cd app
npm install
npm run dev              # live page from src/content.json
npm run build:template   # rebuilds plugins/pretty-text/skills/pretty-text/assets/template.html
```

Rebuild the template only when code or styles change. New content never needs a rebuild.

## Try the skill without an agent

```bash
python3 plugins/pretty-text/skills/pretty-text/scripts/render.py app/src/content.json /tmp/pretty-text.html
open /tmp/pretty-text.html
python3 -m unittest discover tests
```

The page opens from `file://` with no server and makes no network requests.

## Install the skill

The skill is the folder `plugins/pretty-text/skills/pretty-text/`. Every client below gets a copy of it; only the Claude Code marketplace can deliver updates.

**Claude Code, through the marketplace (receives updates):**

```
/plugin marketplace add chekrizh/Interactive-Map-Builder
/plugin install pretty-text@interactive-map-builder
```

In a shell, the same is `claude plugin marketplace add chekrizh/Interactive-Map-Builder` and `claude plugin install pretty-text@interactive-map-builder`. The skill then triggers on its own and is also available as `/pretty-text:pretty-text`.

- Update on request: `/plugin marketplace update interactive-map-builder` in a session, or `claude plugin update pretty-text@interactive-map-builder` in a shell.
- Update automatically: `/plugin` → Marketplaces → interactive-map-builder → Enable auto-update. It is off by default for marketplaces like this one.

**Other clients (no updates; install the new copy again):**

- **Claude Code without the marketplace:** `cp -R plugins/pretty-text/skills/pretty-text ~/.claude/skills/`, or into a project's `.claude/skills/`. Start a new session.
- **Claude apps (desktop, web):** `cd plugins/pretty-text/skills && zip -r pretty-text.zip pretty-text`, then upload the zip under Settings → Capabilities → Skills. Code execution must be on.
- **Codex:** copy `plugins/pretty-text/skills/pretty-text` into the skills folder Codex reads (`~/.codex/skills/` at the time of writing).
- **ChatGPT:** upload the same zip where your workspace allows custom skills. This path has not been checked here.

## Release an update

1. Change the page in `app/` and run `npm run build:template`, or change the skill files directly.
2. Run `python3 -m unittest discover tests` and `claude plugin validate .`.
3. Bump `version` in `plugins/pretty-text/.claude-plugin/plugin.json` (for example `0.1.0` → `0.2.0`). Claude Code users keep their cached copy until this string changes, so a push without a bump reaches nobody.
4. Commit and push to `main`. Marketplace users get the update on their next update command, or on their own if they enabled auto-update.
5. Make a new zip for Claude apps and ChatGPT users; they have to upload it again.

Pages that were already generated do not change: each HTML file carries its own copy of the app.

## Test on each device

Use a prompt like "Make this text pretty: …" or "Сделай из этого текста красивую страницу: …", then check:

1. The skill triggers and runs `render.py`. The model must not type the HTML itself.
2. Where the file appears and how it is shown: preview pane, built-in browser, file card, or only a path.
3. The page opens with the title, lede, section card and contents list.
4. The text uses Manrope, not the system font, including Cyrillic.
5. Back, Next, the ← → keys and the contents list switch sections.
6. The theme switch works. After a reload it is remembered where storage is allowed; where storage is blocked, the switch must still work.
7. At phone width there is no horizontal scroll, and the contents list sits under the card.
8. The downloaded file still opens with the network off.

## How this maps to the Interactive-Map-Builder

| Here                         | Interactive-Map-Builder                                            |
| ---------------------------- | ------------------------------------------------------------------ |
| `app/src/content.json`       | `src/maps/<map>.json` (today a JS module that has to be converted) |
| `<script id="page-content">` | `<script id="map-definition">`                                     |
| `render.py`                  | the same script, plus logos turned into `data:` URIs               |
| template ≈ 230 KB            | template ≈ 360 KB                                                  |

## Known limits

- The font is about 214 KB of the template. A model cannot reasonably retype the file into a chat artifact, so the harness has to show the file itself. If that turns out to be the blocker somewhere, subset or drop the font.
- If a template has an empty content tag, the page shows an error instead of sample content.
