# Examples

Eight of the maps describe real open-source projects. Each describes its project in our own words and copies none of its code; its code links point to the exact commit it was written from. This project is not affiliated with any of these projects or their authors, and their code stays under their own licences.

| Map | Project | Authors | Licence | Mapped version |
|---|---|---|---|---|
| `kutt-url-shortener.json` | [Kutt](https://github.com/thedevs-network/kutt), a URL shortener | The Devs Network and contributors (© 2020 Kutt) | [MIT](https://github.com/thedevs-network/kutt/blob/029da42b2459693681886665589fd9512d6b473c/LICENSE) | v3.2.6, commit [`029da42`](https://github.com/thedevs-network/kutt/tree/029da42b2459693681886665589fd9512d6b473c) |
| `privatebin-pastebin.json` | [PrivateBin](https://github.com/PrivateBin/PrivateBin), a zero-knowledge pastebin | Sébastien Sauvage (© 2012) and the PrivateBin contributors | [zlib/libpng](https://github.com/PrivateBin/PrivateBin/blob/8a6312e7e666e6b5129de260dbe195b2be21b58e/LICENSE.md) for PrivateBin's own code | 2.1.1, commit [`8a6312e`](https://github.com/PrivateBin/PrivateBin/tree/8a6312e7e666e6b5129de260dbe195b2be21b58e) |
| `healthchecks-cron-monitor.json` | [Healthchecks](https://github.com/healthchecks/healthchecks), a cron job monitoring service | Pēteris Caune and other contributors (© 2015) | [BSD 3-clause](https://github.com/healthchecks/healthchecks/blob/255075ce65ee0997fd9d3b8dd04e4829a87fad5d/LICENSE) | commit [`255075c`](https://github.com/healthchecks/healthchecks/tree/255075ce65ee0997fd9d3b8dd04e4829a87fad5d) |
| `rivet-database-extractor.json` | [Rivet](https://github.com/rivet-lab/rivet), a production-database extractor | Rivet Contributors (© 2026) | [MIT](https://github.com/rivet-lab/rivet/blob/9ee7deaf93a3c344778f2434856e4bffc3b23385/LICENSE) | 0.32.2, commit [`9ee7dea`](https://github.com/rivet-lab/rivet/tree/9ee7deaf93a3c344778f2434856e4bffc3b23385) |
| `miniflux-feed-reader.json` | [Miniflux](https://github.com/miniflux/v2), a minimalist feed reader | The Miniflux Authors | [Apache 2.0](https://github.com/miniflux/v2/blob/9447aaeceb98ebdf7c4528b3e96dc5b44b35af5b/LICENSE) | commit [`9447aae`](https://github.com/miniflux/v2/tree/9447aaeceb98ebdf7c4528b3e96dc5b44b35af5b) |
| `umami-web-analytics.json` | [Umami](https://github.com/umami-software/umami), cookie-free website analytics | Umami Software, Inc. and contributors (© 2022) | [MIT](https://github.com/umami-software/umami/blob/559e3c607c23d2c72d9bd4f6481bda428255323c/LICENSE) | v3.4.1, commit [`559e3c6`](https://github.com/umami-software/umami/tree/559e3c607c23d2c72d9bd4f6481bda428255323c) |
| `nanogpt-gpt-trainer.json` | [nanoGPT](https://github.com/karpathy/nanoGPT), a small GPT trainer | Andrej Karpathy and contributors (© 2022) | [MIT](https://github.com/karpathy/nanoGPT/blob/3adf61e154c3fe3fca428ad6bc3818b27a3b8291/LICENSE) | commit [`3adf61e`](https://github.com/karpathy/nanoGPT/tree/3adf61e154c3fe3fca428ad6bc3818b27a3b8291) |
| `lobsters-link-aggregator.json` | [Lobsters](https://github.com/lobsters/lobsters), a link aggregator | joshua stein and contributors (© 2012-2019) | [BSD 3-clause](https://github.com/lobsters/lobsters/blob/ccc6610e097d43c2254b359d7c25fecd34b54fc2/LICENSE) | commit [`ccc6610`](https://github.com/lobsters/lobsters/tree/ccc6610e097d43c2254b359d7c25fecd34b54fc2) |

How each map is laid out:

- `kutt-url-shortener.json`: by hand. `tools/examples/build_kutt.py` in the repository generates it.
- `privatebin-pastebin.json`: no `layout` at all; every position comes from the automatic layout. `tools/examples/build_privatebin.py` generates it.
- `healthchecks-cron-monitor.json`: automatic, steered by `layout.grid`.
- `rivet-database-extractor.json`, `miniflux-feed-reader.json`, `umami-web-analytics.json`, `nanogpt-gpt-trainer.json`, `lobsters-link-aggregator.json`: automatic, steered by `layout.grid`, with zone boxes sized by hand (`layout.zones`). These five were built with the [extra check](../../interactive-map-repo/SKILL.md) on.
- `fastapi-service.json`: a made-up service, the smallest complete map.

Each real-project map also names its authors and licence, with links, in the first panel of the rendered page.
