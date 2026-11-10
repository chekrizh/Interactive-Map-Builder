# Asset library

- `icons/`: Lucide icons (ISC licence, see `icons.LICENSE`), name to inner SVG markup on a 24px grid.
- `logos/`: Simple Icons brand marks (CC0 1.0, see `logos.LICENSE`), slug to name, brand colour and path.
- `logos-color/`: gilbarbara/logos full-colour marks (CC0 1.0, see `logos-color.LICENSE`), only brands Simple Icons lacks.
- Brand marks stay the trademarks of their owners.
- `roles.json`: colour presets for C4 kinds.

Each folder holds numbered parts (`001.json`, `002.json`, ...), one item per line, each under 200 KB; together they form one section. Rebuild icons and logos with `tools/build_library.py` from the repository root.
