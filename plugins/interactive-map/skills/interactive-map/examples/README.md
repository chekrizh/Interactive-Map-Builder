# Examples

Three of the maps describe real open-source projects. Each describes its project in our own words and copies none of its code; its code links point to the exact commit it was written from. This project is not affiliated with any of these projects or their authors, and their code stays under their own licences.

| Map | Project | Authors | Licence | Mapped version |
|---|---|---|---|---|
| `kutt-url-shortener.json` | [Kutt](https://github.com/thedevs-network/kutt), a URL shortener | The Devs Network and contributors (© 2020 Kutt) | [MIT](https://github.com/thedevs-network/kutt/blob/029da42b2459693681886665589fd9512d6b473c/LICENSE) | v3.2.6, commit [`029da42`](https://github.com/thedevs-network/kutt/tree/029da42b2459693681886665589fd9512d6b473c) |
| `privatebin-pastebin.json` | [PrivateBin](https://github.com/PrivateBin/PrivateBin), a zero-knowledge pastebin | Sébastien Sauvage (© 2012) and the PrivateBin contributors | [zlib/libpng](https://github.com/PrivateBin/PrivateBin/blob/8a6312e7e666e6b5129de260dbe195b2be21b58e/LICENSE.md) for PrivateBin's own code | 2.1.1, commit [`8a6312e`](https://github.com/PrivateBin/PrivateBin/tree/8a6312e7e666e6b5129de260dbe195b2be21b58e) |
| `healthchecks-cron-monitor.json` | [Healthchecks](https://github.com/healthchecks/healthchecks), a cron job monitoring service | Pēteris Caune and other contributors (© 2015) | [BSD 3-clause](https://github.com/healthchecks/healthchecks/blob/255075ce65ee0997fd9d3b8dd04e4829a87fad5d/LICENSE) | commit [`255075c`](https://github.com/healthchecks/healthchecks/tree/255075ce65ee0997fd9d3b8dd04e4829a87fad5d) |

- `kutt-url-shortener.json` is laid out by hand (`evals/maps/build_kutt.py` generates it).
- `privatebin-pastebin.json` has no `layout`: every position comes from the automatic layout (`evals/maps/build_privatebin.py` generates it).
- `healthchecks-cron-monitor.json` was written as a test of the viewer after the engine refactor (0.6.1), on a repository the viewer was not tuned on. Its layout is automatic, steered by `layout.grid`.
- `fastapi-service.json` is a made-up service written for this project.

Each real-project map also names its authors and licence, with links, in the first panel of the rendered page.
