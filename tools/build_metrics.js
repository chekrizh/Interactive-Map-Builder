// Measures the viewer font (Manrope) in Chromium and writes the advance width of every
// character a map is likely to use, per weight, to scripts/metrics.json. render.py's layout
// check uses the table to size cards and label chips exactly as the viewer does, without a
// browser. Rerun only when the font changes. Usage: node tools/build_metrics.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const skill = path.join(__dirname, '..', 'plugins', 'interactive-map', 'skills', 'interactive-map');
const font = fs.readFileSync(path.join(skill, 'assets', 'viewer', 'Manrope-variable.woff2')).toString('base64');
const ranges = [[0x20, 0x7e], [0xa0, 0x17f], [0x391, 0x3c9], [0x400, 0x45f], [0x2010, 0x2027], [0x2030, 0x203a], [0x2190, 0x21ff], [0x2200, 0x22ff]];
const chars = ranges.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i)));
const weights = [400, 500, 600, 700];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<html><body></body></html>');
  const table = await page.evaluate(async ({ font, chars, weights }) => {
    const face = new FontFace('Manrope', `url(data:font/woff2;base64,${font})`, { weight: '200 800' });
    document.fonts.add(await face.load());
    const ctx = document.createElement('canvas').getContext('2d');
    const out = {};
    for (const w of weights) {
      ctx.font = `${w} 1000px "Manrope"`;
      const fallback = ctx.measureText('n').width;
      out[w] = Object.fromEntries(chars.map(c => [c, Math.round(ctx.measureText(c).width)]));
      out[w].default = Math.round(fallback);
      // A check that the font, not a fallback face, was measured.
      out[w].check = Math.round(ctx.measureText('Manrope 0123').width);
    }
    return out;
  }, { font, chars, weights });
  await browser.close();
  const lines = ['{', '  "note": "Manrope advance widths in thousandths of the font size, per weight. Built by tools/build_metrics.js.",'];
  weights.forEach((w, i) => {
    lines.push(`  "${w}": {`);
    const entries = Object.entries(table[w]);
    entries.forEach(([c, v], j) => lines.push(`    ${JSON.stringify(c)}: ${v}${j < entries.length - 1 ? ',' : ''}`));
    lines.push(`  }${i < weights.length - 1 ? ',' : ''}`);
  });
  lines.push('}');
  fs.writeFileSync(path.join(skill, 'scripts', 'metrics.json'), lines.join('\n') + '\n');
})();
