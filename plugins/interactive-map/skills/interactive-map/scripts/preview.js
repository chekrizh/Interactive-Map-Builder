// Screenshots of a rendered map, for checking it by eye before handing it over: the
// overview, the full map, and every flow at its end. Run through preview.py, which finds
// Playwright; directly: node preview.js PAGE.html OUT_DIR [light|dark]
// Prints one JSON line: {"shots": [paths], "errors": [page errors]}.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [page_, outDir, theme = 'light'] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(page_) + '#theme=' + theme);
  await page.waitForFunction(() => window.mapViewer, null, { timeout: 15000 });
  await page.waitForTimeout(600);
  const shots = [];
  const shoot = async name => {
    const file = path.join(outDir, name + '.png');
    const stage = await page.$('.stagecard');
    await (stage || page).screenshot({ path: file });
    shots.push(file);
  };
  await shoot('1-overview');
  await page.click('#gofull', { force: true }).catch(() => {});
  await page.waitForTimeout(900);
  await shoot('2-full-map');
  const flows = await page.$$eval('[data-flow]', els => [...new Set(els.map(e => e.dataset.flow))]);
  for (const [i, id] of flows.entries()) {
    await page.evaluate(id => window.mapViewer.playFlow(id), id).catch(e => errors.push(String(e)));
    await page.waitForTimeout(400);
    await shoot(`${3 + i}-flow-${id}`);
  }
  await browser.close();
  console.log(JSON.stringify({ shots, errors }));
})().catch(e => { console.error(e.message); process.exit(1); });
