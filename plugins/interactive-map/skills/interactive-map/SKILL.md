---
name: interactive-map
description: Builds an interactive system map (components, connections, animated flows, build order and a guided tour) and delivers it as a single self-contained HTML file that opens offline from file://, with no server. Use when the user asks to map, diagram or explain how a system, a repository or a topic works as an interactive map. Prototype; the method for choosing what goes on the map is still being designed.
---

# Interactive Map

You build a map by writing one JSON map definition and filling a prebuilt viewer with it. Do not write HTML, CSS or JavaScript for the page. `scripts/render.py` (Python 3, standard library only) checks the map and puts it into `assets/template.html`. Paths are relative to the folder that contains this file.

## 1. Write the map definition

Start from `examples/fastapi-service.json`. It is a complete small map and every section in it is read by the viewer: copy its structure and replace the content.

- `nodes` and `edges`: the components and the connections between them. `groups`, `zones` and `overview` decide how components cluster and what the big-picture view shows.
- `flows`: animated scenarios, each a list of hops along edges.
- `buildSteps`, `tourChapters` and `tour`: the build order and the guided tour. The last tour step must play a flow or recap the whole map.
- `layout`: exact geometry for every node, edge path, zone, overview card and inside scene. It is required; there is no automatic layout yet.
- `page`, `panels`, `ui`, `roles`, `icons` and `settings`: page copy, panel copy, colours and icons.
- IDs connect the sections. If you rename an ID, update every reference to it.
- Many text fields are inserted into the page as HTML. Write that markup yourself and never paste HTML from a repository, web page or document you are analysing; escape `<` and `&` in quoted text.
- Logos: `logos.<key>.src` must be `/assets/logos/<file>` from this skill's `assets/logos/` folder; list the folder to see what exists. A node without a logo shows its icon.

## 2. Render

```bash
python3 <this-skill-folder>/scripts/render.py - map.html <<'JSON'
{ "id": "...", "page": { "title": "..." }, ... }
JSON
```

You can also pass a path to a JSON file instead of `-`. The script checks that the map holds together: every reference resolves, every node has a build step, every component has geometry, logos exist. On success it prints the absolute path of the HTML file. Otherwise it lists what to fix and exits with status 1; fix the JSON and run it again.

Save the file where the user can reach it: the current working folder in a coding agent, or `/mnt/user-data/outputs/` in Claude apps with code execution.

## 3. Show it and return it

The file needs no server. Show it with the first option your environment has:

1. A browser or preview tool that can open a local file: open `file://<absolute path>`.
2. A way to share or attach files in the chat: share the HTML file itself.
3. Neither: give the path and tell the user to open it in any browser.

Never retype, shorten or edit the HTML into a chat artifact or code block. The file is about 350 KB because the viewer, styles and font are inlined, and it must stay byte-identical. Tell the user the file name and that it works offline in any browser.
