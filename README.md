<div align="center">

# Interactive Map Builder

**Deep dives into how a system works: from the big picture down to a line of code, as one interactive map.**

Any model can draw a diagram as an HTML page. This skill is for understanding: it gives the agent a method for studying a repository or a topic and a ready-made viewer built for going deep.<br>
Levels you drill into, animated flows, step-by-step code walkthroughs, a guided tour, and every claim linked to its source. The agent spends its effort on the explanation instead of building the page.

[Features](#features) · [Modes](#three-modes) · [Install](#install) · [How it works](#how-it-works) · [Develop](#develop-the-viewer)

<br>

<img alt="An animated flow on a repository map: a request travels from the visitor through the redirect handler, cache and database, while the side panel explains each step" src="docs/readme/hero-flow.gif" width="100%">

<sub>The flow "Open a short link" on a map of the <a href="https://github.com/thedevs-network/kutt">Kutt</a> URL shortener, made by the skill.</sub>

</div>

---

## Features

- **Overview.** The big picture in a handful of cards: who uses the system, what it is made of, what it depends on. A newcomer takes it in at once.
- **Full map.** Every container and component with labelled connections. Click a card to drill into its part, click a component for what it does and where it lives in the code, open *Look inside* for a code walkthrough or a schema.
- **Main flows.** Animated scenarios such as "a visitor opens a link". The path lights up hop by hop while the panel explains each step.
- **Step-by-step tour.** A guided tour in chapters that walks a newcomer through the whole map in a few minutes.
- **Build order.** Switch from the full system to how it is assembled, one step at a time: what has to exist first and what builds on it.

And on every map: links from each claim to the source (exact lines on GitHub for a repository), light and dark themes, full screen, zoom. The result is **one HTML file that works offline**: open it from disk, send it in a chat, put it on a website.

## Why

Understanding how something works usually means reading a lot and keeping the whole picture in your head. A static diagram helps, but it shows one level at once, does not move, and goes stale the moment it is drawn. This skill gives you the picture you would draw on a whiteboard, with the depth behind it.

It was built for situations like these:

| | |
|---|---|
| **Getting into a codebase** | A team lead opening a team's repo, a new engineer on day one, a reviewer before a design discussion. |
| **Teaching** | A lecture topic as a map you click through live, instead of a diagram redrawn by hand every time. |
| **Writing** | A book chapter or an article with an interactive map next to it. |
| **Learning** | Turn a pile of notes, links or research into something you can actually navigate. |

The viewer is not tied to software: anything with parts, relationships and flows fits, from a microservice to a mortgage.

## Three modes

The skill takes three kinds of input. Each one ends in the same kind of map.

<details open>
<summary><b>1 · Deep dive into a repository</b> &nbsp;·&nbsp; available</summary>

<br>

Point the agent at a codebase. It finds the evidence (deployment files, entry points, routes, queues, dependencies), models the system in [C4](https://c4model.com) terms and picks the flows worth animating: the big picture on the overview, containers and components on the full map, code walkthroughs and schemas inside. Every panel names the files it is based on.

> Draw an interactive map of how this repository works.

</details>

<details>
<summary><b>2 · A pile of sources</b> &nbsp;·&nbsp; planned</summary>

<br>

Links, notes, PDFs, articles, JSON: the agent reads what you give it and maps the topic, with citations in the panels. For book chapters, lectures and anything that is not code.

</details>

<details>
<summary><b>3 · A research question</b> &nbsp;·&nbsp; planned</summary>

<br>

Ask about a topic you do not have sources for. The agent researches it first, then maps what it found as in mode 2.

</details>

## A closer look

**Overview.** The map opens on the big picture.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/readme/overview-dark.png">
  <img alt="The big picture of a repository: six cards, labelled connections and a side panel" src="docs/readme/overview-light.png" width="100%">
</picture>

**Overview → part → component → inside.** Click a card to see its components on the full map, click a component for what it does and where it lives in the code, then open *Look inside*.

<img alt="Clicking from the big picture to a component and into its code walkthrough" src="docs/readme/drill.gif" width="100%">

**Inside a component.** Close-ups the viewer lays out by itself: a code walkthrough with early exits, or a database schema with relations.

<table>
  <tr>
    <td width="50%"><img alt="Step-by-step walkthrough of the redirect handler with links to code lines" src="docs/readme/inside-redirect-light.png"></td>
    <td width="50%"><img alt="Database tables and the relations between them, in the dark theme" src="docs/readme/inside-db-dark.png"></td>
  </tr>
</table>

## Install

**Claude Code, through the marketplace (receives updates):**

```
/plugin marketplace add chekrizh/Interactive-Map-Builder
/plugin install interactive-map@interactive-map-builder
```

Then just ask, for example:

> Draw an interactive map of how this repository works.

The skill triggers on its own. It is also available as `/interactive-map:interactive-map`, and the repository method as `/interactive-map:interactive-map-repo`.

- Update on request: `/plugin marketplace update interactive-map-builder`, or `claude plugin update interactive-map@interactive-map-builder` in a shell.
- Update automatically: `/plugin` → Marketplaces → interactive-map-builder → Enable auto-update. It is off by default for marketplaces like this one.

<details>
<summary><b>Other clients</b> (no automatic updates; install the new copy again)</summary>

<br>

The skills are the folders in `plugins/interactive-map/skills/`.

- **Claude Code without the marketplace:** `cp -R plugins/interactive-map/skills/* ~/.claude/skills/`, then start a new session.
- **Claude apps (desktop, web):** `cd plugins/interactive-map/skills && zip -r interactive-map.zip interactive-map` (and the same for `interactive-map-repo`), then upload each zip under Settings → Capabilities → Skills. Code execution must be on.
- **Codex:** copy the skill folders into the skills folder Codex reads (`~/.codex/skills/` at the time of writing).
- **ChatGPT:** upload the same zips where your workspace allows custom skills. This path has not been checked here.

</details>

## How it works

```
 subject ──► agent designs the map ──► map.json ──► render.py ──► map.html
 (repo, topic)   (skills decide what      (nodes, flows,   (checks it, fills    (viewer + map,
                  goes on the map)         tour, layout)    icons and logos)     works offline)
```

- **Two skills.** `interactive-map-repo` is the method for repositories: find the evidence (deployment files, entry points, contracts), model it in [C4](https://c4model.com) terms (context on the overview, containers and components on the full map) and pick the flows worth animating. `interactive-map` is the format: how to write the map JSON and render it.
- **The agent never writes HTML.** It writes one JSON definition. `render.py` (Python 3, standard library only) validates it with the same checks the page runs, lists every problem at once, and puts it into a prebuilt viewer template.
- **An asset library is built in.** About 2,300 [Lucide](https://lucide.dev) icons, about 3,500 brand logos from [Simple Icons](https://simpleicons.org) and [gilbarbara/logos](https://github.com/gilbarbara/logos), and role presets with tested light and dark colours. A map only names them.
- **The output is self-contained.** Each HTML file carries its own copy of the viewer, the map and the font, so it keeps working when the skill changes.

Render the bundled example yourself:

```bash
python3 plugins/interactive-map/skills/interactive-map/scripts/render.py \
  plugins/interactive-map/skills/interactive-map/examples/kutt-url-shortener.json /tmp/map.html
open /tmp/map.html
```

## Repository layout

```
.claude-plugin/marketplace.json     Claude Code marketplace: lists the plugin below
plugins/interactive-map/
  .claude-plugin/plugin.json        plugin name and version (bump it to ship an update)
  skills/interactive-map/           the format and renderer; self-contained, no Node needed
    SKILL.md
    assets/template.html            the viewer, built from app/ and committed
    assets/logos/                   custom logos a map can use as /assets/logos/<file>
    assets/library/                 icons, logos and role presets
    examples/kutt-url-shortener.json  the main example: a C4 map of a real repo
    examples/fastapi-service.json   the smallest complete map; the dev map
    scripts/render.py               map JSON -> HTML; fills names from the library
    scripts/find_asset.py           search the library for icon, logo and role names
  skills/interactive-map-repo/      repo mode: how to read a repository and model it in C4 terms
app/                                viewer source (Vite): dev server + template build
  src/app.d.ts                      the map format as TypeScript types
evals/                              scripts that build and check the example maps
tests/test_render.py                render.py checks, incl. agreement with the page's own validator
docs/readme/                        images for this README
```

## Develop the viewer

```bash
cd app
npm install
npm run dev              # examples/fastapi-service.json, live. Maps that rely on the library
                         # (the Kutt example) need render.py, which fills icons, logos and roles
npm run build:template   # rebuilds plugins/interactive-map/skills/interactive-map/assets/template.html
```

Rebuild the template only when viewer code or styles change. New maps never need a rebuild. Run the tests with `python3 -m unittest discover tests`.

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
- **Authored HTML is trusted.** Many text fields are inserted as HTML. `SKILL.md` tells the model not to paste markup from sources it analyses, but nothing sanitises it yet.
- **Size.** The template is about 340 KB, of which the font is about 214 KB. A model cannot retype it into a chat artifact, so the client has to show the file itself.
