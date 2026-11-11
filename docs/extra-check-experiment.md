# The extra check: experiment (2026-11-11)

Does the repo skill's code check (section 5 of `interactive-map-repo/SKILL.md`: `claims.py`, a fresh checker following `verify.md`, up to three rounds of reflect-and-fix) make maps more accurate, and what does it cost?

**Repos** (fresh, none used before): rivet (Rust CLI, data pipeline), miniflux (Go web service + workers), umami (Next.js analytics), nanoGPT (ML scripts), lobsters (Rails). Commits are in `RUNLOG.md`.

**Design.** Each map was built once from scratch with the check skipped (`mapA.json`). The check loop was then run on it (`mapB.json`), so the build stage is identical and the cost difference is the check alone. The builder agent kept its context and did the reflection and fixes; each check round was a fresh agent.

**Measuring accuracy without ground truth.** A separate blind judge (same model, different instructions, [prompt](extra-check-judge-prompt.md)) got, shuffled and unlabelled, every claim that differs between A and B (both versions) plus 30 random unchanged claims. Errors in unchanged claims are shared by A and B. The judge also listed important gaps in each map's outline (components and flows), labelled X/Y at random. Disagreements between checker and judge were settled by hand.

**Results:**

| repo | claims | wrong in A | wrong in B | rounds | build min / tokens | check min / tokens |
|---|---|---|---|---|---|---|
| rivet | 188 | 11 | 1 | 3 | 8.8 / 251k | 15.1 / 480k |
| miniflux | 166 | 4 | 0 | 2 | 6.8 / 220k | 7.6 / 300k |
| umami | 151 | 5 | 1 | 3 | 6.7 / 200k | 8.1 / 369k |
| nanoGPT | 128 | 0 | 0 | 2 | 8.1 / 175k | 4.6 / 192k |
| lobsters | 187 | 2 | 0 | 3 | 10.0 / 240k | 9.2 / 340k |
| **total** | **820** | **22 (2.7%)** | **2 (0.2%)** | | **40.4 / 1.09M** | **44.6 / 1.68M** |

High-importance gaps the judge found: 7 in A maps, 4 in B maps. Unchanged-claim samples: 0 wrong of 150 (by the rule of three, under ~2% of unchanged claims are likely wrong).

Fix-round token counts are the new tokens only; a resumed builder also re-reads its cached context.

**Lessons**
- Fixes introduce new errors (umami, lobsters, rivet): round 2 caught 5, round 3 caught 2 more.
- The checker is not perfectly consistent: one README-based claim passed round 1 and failed round 2; one wrong default passed two rounds and only the judge caught it.
- Checker notes on loosely-right claims went into its reply, not the JSON, so the author never saw them; `verify.md` now asks for `note`.
- A wrong file path in panel text (`src/pipeline/retry.rs`) is not a code reference, so render.py did not catch it; a cheap deterministic check is possible.
- An end-to-end run on a sixth repository (httpie) with a fresh agent following the skill: it asked the question first, could not start a subagent in that environment, checked its own map by `verify.md` instead and still found and fixed 8 wrong claims out of 164 in two rounds. The skill now asks the agent to say so when it checked its own map.
- The "what is missing" pass looks for processes, stores, outside systems and entry points, so it can miss an internal mechanism, such as a control loop inside one process.
