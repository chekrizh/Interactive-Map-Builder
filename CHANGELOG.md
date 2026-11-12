# Changelog

Versions follow `plugins/interactive-map/.claude-plugin/plugin.json`. Each version change publishes a [GitHub release](https://github.com/chekrizh/Interactive-Map-Builder/releases) with the skill zips.

## 0.7.6 — 2026-11-12

- Plugin manifests for Cursor (`.cursor-plugin/`) and Codex (`plugin.json` and `.agents/plugins/marketplace.json`), beside the Claude Code one, with a test that keeps their versions in step. The README shows how to add the Codex marketplace.
- Automatic layout: a zone that `layout.grid` places in other columns than the zones of its layer keeps its own width. Before, its frame stretched over those zones too (31 overlaps on a test map, 2 after); maps without such a grid lay out exactly as before.
- Three spare colour sets (sky, olive, brown) for a map's own roles, so they no longer copy a preset's colour and look the same in the legend.

## 0.7.5 — 2026-11-11

Clearer skill instructions, from a builder agent's notes on a real run:

- The extra check now runs last, after the layout check, so the text it confirms is the text the reader gets. A layout fix that rewords a claim is rechecked.
- Documented flow hop fields (`rev`, `note`, `bad`, `breaks`), failure flows, how `inside` and `insides` fit together, and the legend label of every role preset.
- Claims confirmed with a note are tightened or the reason to keep them is logged; a self-check finds each quote's line with a search.
- The step 0 question is skipped when the task already carries the user's answer, also for a subagent.
- Card count on the full map and path count in the project structure are guides, not limits.
- `claims.py` includes a flow step's `note`, so the extra check covers it.
- `claims.py` lists close-up captions, and `--changed OLD.json` lists the claims that are new or reworded since an earlier version of the map. The skill says how to split many claims across checkers and that the tour and build order retell checked claims.
- Documented when the automatic layout leaves room for a label chip, why zones sharing columns overlap, and what `preview.py` does not capture.

## 0.7.4 — 2026-11-11

- The credit line in the help card is underlined, so it reads as a link before you hover it.

## 0.7.3 — 2026-11-11

- The help card ends with "Made with Interactive Map Builder", the plugin logo and a link to the repository. `settings.credit: false` hides it.
- The page's `generator` meta tag names the repository.

## 0.7.2 — 2026-11-11

- A feedback form for issues, a changelog and a contributing guide.
- Plugin keywords and homepage; the repository skill's description no longer says "Draft".

## 0.7.1 — 2026-11-11

- A shorter extra-check question at the start.
- The repository tidied for open source: experiment write-up rewritten, example generators moved to `tools/examples/`.

## 0.7.0 — 2026-11-11

- Extra check: an independent pass re-reads the code behind every statement on a drafted map and fixes what does not hold, in up to three rounds. The agent asks before it starts. See [the measurements](docs/extra-check-experiment.md).
- Eight example maps, all checked against the code: Kutt, PrivateBin, Healthchecks, Rivet, Miniflux, Umami, nanoGPT and Lobsters.

## 0.6.5 — 2026-11-10

- Viewer: "Open full map" is a filled button, centred in the intro panel and repeated in the bar on the big picture.

## 0.6.4 — 2026-11-10

- Viewer: "Look inside" is a filled button, like "Play flow".

## 0.6.3 — 2026-11-10

- Pages carry a title and description in their head; the live demo links back to the repository.
- `npx skills add` is the default install.

## 0.6.2 — 2026-11-10

- Repository-only wording, fresh README screenshots and GIFs.
- Automatic releases and the live demo on GitHub Pages.

## 0.6.1 — 2026-11-10

- Viewer engine refactor: no shared context, one owner per state field.

## 0.6.0 — 2026-11-10

- Layout: automatic layout, a layout check, screenshot preview for the agent, and a help card in the viewer.

## 0.5.0 — 2026-11-10

- Simpler map format: defaults filled in by `render.py`, UI strings in one place, old course format removed.

## 0.4.0 — 2026-11-10

- One text contract: map text is sanitised at build time, and `--repo-dir` checks links to code lines.
- Plugin icon.

## 0.3.1 — 2026-11-10

- Every shipped file is readable and under 256 KB, so the plugin security scan can verify the plugin.

## 0.3.0 — 2026-11-10

- Project structure view: an annotated repository tree beside the tour.

## 0.2.0 — 2026-11-10

- New README with a hero GIF and screenshots; MIT license.

## 0.1.x — 2026-11-09

- First versions: the map viewer as the `interactive-map` skill, repository mode with C4 maps, node shapes, an icon and logo library and look-inside scenes.
