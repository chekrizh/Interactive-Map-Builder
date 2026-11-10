// Captures the README screenshots in docs/readme/ from the rendered example maps.
//   python3 plugins/interactive-map/skills/interactive-map/scripts/render.py \
//     plugins/interactive-map/skills/interactive-map/examples/<name>.json /tmp/<name>.html   # for each map below
//   node tools/readme_shots.js /tmp docs/readme
// Needs Playwright with Chromium. The two GIFs (hero-flow.gif, drill.gif) are recorded by hand.
const path = require('path');

/* Which map and which view each README image shows. */
const SHOTS = [
  { file: 'overview-light.png', map: 'healthchecks-cron-monitor', theme: 'light', view: 'overview' },
  { file: 'overview-dark.png', map: 'healthchecks-cron-monitor', theme: 'dark', view: 'overview' },
  { file: 'fullmap-light.png', map: 'privatebin-pastebin', theme: 'light', view: 'fullmap' },
  { file: 'inside-steps-light.png', map: 'privatebin-pastebin', theme: 'light', view: 'inside', node: 'crypto' },
  { file: 'inside-schema-dark.png', map: 'healthchecks-cron-monitor', theme: 'dark', view: 'inside', node: 'db' },
  { file: 'tour-light.png', map: 'privatebin-pastebin', theme: 'light', view: 'tour', step: 3 },
  { file: 'build-light.png', map: 'healthchecks-cron-monitor', theme: 'light', view: 'build', step: 2 },
  { file: 'structure-light.png', map: 'healthchecks-cron-monitor', theme: 'light', view: 'structure' }
];

async function capture(browser, pagesDir, outDir, shot) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 800 }, colorScheme: shot.theme });
  const page = await context.newPage();
  page.on('pageerror', e => console.error(`${shot.file}: ${e.message}`));
  await page.goto('file://' + path.resolve(pagesDir, shot.map + '.html') + '#theme=' + shot.theme);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const click = async (selector, wait = 800) => {
    await page.click(selector, { force: true });
    await page.waitForTimeout(wait);
  };
  const openFullMap = async () => {
    if (await page.isVisible('#gofull')) await click('#gofull');
    else await click('#toL0');
  };
  if (shot.view === 'fullmap') await openFullMap();
  if (shot.view === 'inside') {
    await openFullMap();
    await click(`#map [data-node="${shot.node}"]`, 700);
    await click('#lookInside');
  }
  if (shot.view === 'build') await click(`#weekSeg button[data-w="${shot.step}"]`);
  if (shot.view === 'structure') await click('#filesBtn');
  if (shot.view === 'tour') {
    await click('#tourBtn', 1200);
    for (let i = 0; i < shot.step; i++) await click('#tcNext', 2500);
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, shot.file) });
  console.log(path.join(outDir, shot.file));
  await context.close();
}

(async () => {
  const [pagesDir, outDir] = process.argv.slice(2);
  if (!pagesDir || !outDir) {
    console.error('usage: node tools/readme_shots.js PAGES_DIR OUT_DIR');
    process.exit(2);
  }
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  for (const shot of SHOTS) await capture(browser, pagesDir, outDir, shot);
  await browser.close();
})();
