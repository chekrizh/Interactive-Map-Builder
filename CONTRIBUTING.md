# Contributing

Feedback is the most useful contribution right now. If a map got something wrong, the viewer misbehaved, or you made a map you like, [open an issue](https://github.com/chekrizh/Interactive-Map-Builder/issues/new/choose).

Pull requests are welcome too:

- How the repository is laid out, how to build the viewer and how to release: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
- Bump the version in `plugins/interactive-map/.claude-plugin/plugin.json` and in the Cursor and Codex manifests beside it (`.cursor-plugin/plugin.json`, `plugin.json`). The plugin marketplace only picks up a change with a new version, and a release is published automatically.
- Add a line to [CHANGELOG.md](CHANGELOG.md).
