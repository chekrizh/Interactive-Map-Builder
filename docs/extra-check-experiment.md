# The extra check: does it pay off?

The extra check (section 5 of [`interactive-map-repo/SKILL.md`](../plugins/interactive-map/skills/interactive-map-repo/SKILL.md)) re-reads the code behind every statement on a drafted map and fixes what does not hold, in up to three rounds. This note measures how much more accurate it makes a map and what it costs. Measured in November 2026.

## Method

**Repositories.** Five open-source projects of different kinds, none of which the skill had been developed on:

| Repository | Kind | Commit |
|---|---|---|
| [rivet-lab/rivet](https://github.com/rivet-lab/rivet) | Rust command line tool, data pipeline | `9ee7dea` |
| [miniflux/v2](https://github.com/miniflux/v2) | Go web service with background workers | `9447aae` |
| [umami-software/umami](https://github.com/umami-software/umami) | Next.js web analytics | `559e3c6` (v3.4.1) |
| [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) | Machine-learning scripts | `3adf61e` |
| [lobsters/lobsters](https://github.com/lobsters/lobsters) | Rails application | `ccc6610` |

**Two versions of each map.** Each map was built once from scratch without the check (version A). The check was then run on that same map (version B). The build is shared, so any difference in quality or cost comes from the check alone.

**Measuring accuracy without ground truth.** A separate judge checked statements against the code, with the same model under different instructions ([prompt](extra-check-judge-prompt.md)). It saw them shuffled and unlabelled, and it did not know which version a statement came from:

- every statement that differs between A and B, in both versions;
- 30 random statements per map that the two versions share.

The judge also listed important things each map leaves out. Where the judge and the check disagreed, the case was settled by reading the code by hand.

## Results

| Repository | Statements | Wrong in A | Wrong in B | Rounds | Build: min / tokens | Check: min / tokens |
|---|---|---|---|---|---|---|
| rivet | 188 | 11 | 1 | 3 | 8.8 / 251k | 15.1 / 480k |
| miniflux | 166 | 4 | 0 | 2 | 6.8 / 220k | 7.6 / 300k |
| umami | 151 | 5 | 1 | 3 | 6.7 / 200k | 8.1 / 369k |
| nanoGPT | 128 | 0 | 0 | 2 | 8.1 / 175k | 4.6 / 192k |
| lobsters | 187 | 2 | 0 | 3 | 10.0 / 240k | 9.2 / 340k |
| **Total** | **820** | **22 (2.7%)** | **2 (0.2%)** | | **40.4 / 1.09M** | **44.6 / 1.68M** |

- Wrong statements fell from 2.7% to 0.2%.
- High-importance omissions found by the judge fell from 7 to 4.
- None of the 150 sampled shared statements was wrong. By the rule of three, fewer than about 2% of shared statements are likely wrong.
- The check takes about as long again as the build (+110% time) and uses about one and a half times the build's tokens (+155%).

## What we learned

- **Fixes bring new errors.** In three of the five maps a fix was itself wrong, and only a later round caught it. Rounds 2 and 3 are needed.
- **The check is not a guarantee.** A single checker is not perfectly consistent. In one case a statement taken from a README passed the first round and failed the second. In another, a wrong default passed two rounds and only the judge caught it.
- **Panel text escapes the automatic link check.** A file path written in a panel's prose is not a code reference, so `render.py --repo-dir` does not check it. Only a reader catches it.
- **The search for omissions has a blind spot.** It looks for processes, data stores, outside systems and entry points, so it can miss an internal mechanism such as a control loop inside one process.
- **It works without a second agent too.** Where the agent cannot start a separate checker, it can check its own map by the same instructions. On a sixth repository ([httpie/cli](https://github.com/httpie/cli)), this found and fixed 8 wrong statements out of 164 in two rounds. Such a check is less independent, and the skill tells the user when it ran this way.
