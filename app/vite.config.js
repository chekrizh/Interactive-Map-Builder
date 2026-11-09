import { defineConfig } from 'vite';

// `npm run build:template` (vite build --mode template) emits ONE self-contained HTML file:
// JS, CSS and the font are inlined, nothing is fetched at runtime. The empty
// <script id="page-content"> stays empty; render.py fills it. `npm run dev` is plain Vite.
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

export default defineConfig(({ mode }) => mode !== 'template' ? {} : {
  base: './',
  plugins: [singleFile],
  build: {
    outDir: 'dist-template',
    assetsInlineLimit: () => true, // font → data: URI
    modulePreload: false,
    rolldownOptions: { output: { codeSplitting: false } },
  },
});
