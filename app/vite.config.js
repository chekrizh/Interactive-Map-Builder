import { defineConfig } from 'vite';

// The skill folder is the public dir, so /examples/*.json and /assets/logos/* resolve in dev
// exactly as render.py resolves them: relative to the skill folder.
const skill = '../plugins/interactive-map/skills/interactive-map';

// `npm run build:template` (vite build --mode template) emits the viewer as readable files:
// index.html (the page shell with the empty <script id="map-definition">), viewer.js and
// viewer.css (not minified) and the font. render.py inlines them into ONE self-contained
// HTML file, so nothing is fetched at runtime. Shipping readable source keeps every file in
// the plugin under the plugin scanner's 256 KiB limit and lets a reviewer read the code.
export default defineConfig(({ mode }) => ({
  publicDir: skill,
  ...(mode === 'template' && {
    base: './',
    build: {
      outDir: 'dist-template',
      emptyOutDir: true,
      copyPublicDir: false,
      minify: false,
      assetsInlineLimit: 0, // the font stays a .ttf file; render.py inlines it
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
