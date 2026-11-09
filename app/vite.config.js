import { defineConfig } from 'vite';

// The skill folder is the public dir, so /examples/*.json and /assets/logos/* resolve in dev
// exactly as render.py resolves them: relative to the skill folder.
const skill = '../plugins/interactive-map/skills/interactive-map';

// `npm run build:template` (vite build --mode template) emits ONE self-contained HTML file:
// JS, CSS and the font are inlined, nothing is fetched at runtime. The empty
// <script id="map-definition"> stays empty; render.py fills it.
const singleFile = {
  name: 'single-file',
  enforce: 'post',
  generateBundle(_, bundle) {
    const page = bundle['index.html'];
    for (const [name, chunk] of Object.entries(bundle)) {
      const isJs = name.endsWith('.js');
      if (!isJs && !name.endsWith('.css')) continue;
      const tag = isJs
        ? `<script type="module" crossorigin src="./${name}"></script>`
        : `<link rel="stylesheet" crossorigin href="./${name}">`;
      if (!page.source.includes(tag)) throw new Error(`single-file: ${tag} not found in index.html`);
      const inline = isJs
        ? `<script type="module">${chunk.code.replaceAll('</script', '<\\/script')}</script>`
        : `<style>${chunk.source}</style>`;
      page.source = page.source.replace(tag, () => inline);
      delete bundle[name];
    }
  },
};

export default defineConfig(({ mode }) => ({
  publicDir: skill,
  ...(mode === 'template' && {
    base: './',
    plugins: [singleFile],
    build: {
      outDir: 'dist-template',
      copyPublicDir: false,
      assetsInlineLimit: () => true, // font -> data: URI
      modulePreload: false,
      rolldownOptions: { output: { codeSplitting: false } },
    },
  }),
}));
