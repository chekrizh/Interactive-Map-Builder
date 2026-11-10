// Opens a rendered map, visits every part (overview, components, close-ups, flows, the tour,
// project structure) and prints what ran: used by test_render.py to check that hostile text
// in a map cannot execute. Needs Playwright; usage: node tests/browser_probe.js PAGE.html
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [], dialogs = [], requests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => { dialogs.push(d.message()); d.dismiss(); });
  page.on('request', r => { if (!/^(file|data):/.test(r.url())) requests.push(r.url()); });
  await page.goto('file://' + process.argv[2]);
  await page.waitForTimeout(500);
  const click = async sel => {
    const el = await page.$(sel);
    if (!el || !(await el.isVisible())) return false;
    await el.click({ force: true }).catch(() => {});
    await page.waitForTimeout(150);
    return true;
  };
  for (const card of await page.$$('#map0 [data-g]')) await card.click({ force: true }).catch(() => {});
  await click('#gofull');
  for (const id of await page.$$eval('#map [data-node]', els => [...new Set(els.map(e => e.dataset.node))])) {
    await page.click(`#map [data-node="${id}"]`, { force: true }).catch(() => {});
    if (await click('#lookInside')) await page.keyboard.press('Escape');
  }
  for (const flow of await page.$$eval('[data-flow]', els => els.map(e => e.dataset.flow))) {
    await page.evaluate(f => document.querySelector(`[data-flow="${f}"]`)?.click(), flow);
    await page.waitForTimeout(1200);
  }
  await click('#tourBtn');
  for (let i = 0; i < 80 && await click('#tcNext'); i++) await page.waitForTimeout(150);
  await click('#filesBtn');
  const found = await page.evaluate(() => ({
    pwned: window.__pwned ?? null,
    handlers: [...document.querySelectorAll('*')].flatMap(e => [...e.attributes])
      .filter(a => /^on/i.test(a.name) || /javascript:/i.test(a.value)).map(a => a.name).length,
    kept: document.querySelectorAll('b.kept').length,
  }));
  console.log(JSON.stringify({ ...found, errors, dialogs, requests }));
  await browser.close();
})();
