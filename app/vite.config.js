import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

// The skill folder is the public dir, so /examples/*.json and /assets/logos/* resolve in dev
// exactly as render.py resolves them: relative to the skill folder.
const skill = '../plugins/interactive-map/skills/interactive-map';

// `npm run build:template` (vite build --mode template) emits the viewer as readable files:
// index.html (the page shell with the empty <script id="map-definition">), viewer.js and
// viewer.css (not minified) and the font. render.py inlines them into ONE self-contained
// HTML file, so nothing is fetched at runtime. Shipping readable source keeps every file in
// the plugin under the plugin scanner's 256 KiB limit and lets a reviewer read the code.
// In dev, /examples/<name>.json is served through render.py --json, so the dev map gets the same
// defaults, library assets and sanitizing as a rendered page.
const renderedExamples = {
  name: 'rendered-examples',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const match = /^\/examples\/([\w-]+)\.json$/.exec((req.url || '').split('?')[0]);
      if (!match) return next();
      try {
        const json = execFileSync('python3', [resolve(skill, 'scripts/render.py'), resolve(skill, 'examples', `${match[1]}.json`), '-', '--json']);
        res.setHeader('Content-Type', 'application/json');
        res.end(json);
      } catch (error) {
        res.statusCode = 500;
        res.end(String(error.stderr || error.message));
      }
    });
  },
};

export default defineConfig(({ mode }) => ({
  publicDir: skill,
  plugins: [renderedExamples],
  ...(mode === 'template' && {
    base: './',
    build: {
      outDir: 'dist-template',
      emptyOutDir: true,
      copyPublicDir: false,
      minify: false,
      assetsInlineLimit: 0, // the font stays a .woff2 file; render.py inlines it
      modulePreload: false,
      rolldownOptions: {
        output: {
          codeSplitting: false,
          entryFileNames: 'viewer.js',
          assetFileNames: (info) => (info.names?.[0] ?? info.name ?? '').endsWith('.css') ? 'viewer.css' : '[name][extname]',
        },
      },
    },
  }),
}));
