// Records the two README GIFs from the rendered Kutt example.
//   python3 plugins/interactive-map/skills/interactive-map/scripts/render.py \
//     plugins/interactive-map/skills/interactive-map/examples/kutt-url-shortener.json /tmp/kutt-url-shortener.html
//   node tools/readme_gifs.js /tmp/kutt-url-shortener.html docs/readme
// Needs Playwright with Chromium and ffmpeg. Writes hero-flow.gif (a flow playing on the full
// map) and drill.gif (overview -> a part -> a component -> its code walkthrough).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

/* A visible pointer, since screen recordings do not show the mouse. */
const POINTER = `
  document.addEventListener('DOMContentLoaded', () => {
    const dot = document.createElement('div');
    dot.style.cssText = 'position:fixed;z-index:99999;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;' +
      'background:rgba(99,102,241,.55);border:2px solid rgba(255,255,255,.9);box-shadow:0 1px 4px rgba(0,0,0,.25);' +
      'pointer-events:none;left:-40px;top:-40px;transition:transform .12s';
    document.body.appendChild(dot);
    addEventListener('mousemove', e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', () => { dot.style.transform = 'scale(.7)'; }, true);
    addEventListener('mouseup', () => { dot.style.transform = ''; }, true);
  });`;

async function record(browser, pagePath, size, script, pointer = true) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-gif-'));
  const context = await browser.newContext({ viewport: size, colorScheme: 'light', recordVideo: { dir, size } });
  const page = await context.newPage();
  if (pointer) await page.addInitScript(POINTER);
  const opened = Date.now();
  await page.goto('file://' + path.resolve(pagePath) + '#theme=light');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const start = (Date.now() - opened) / 1000;
  await script(page);
  const video = page.video();
  await context.close();
  return { file: await video.path(), start };
}

/* Glide the pointer to an element, then click it. */
async function clickOn(page, selector, wait) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await target.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
  await page.waitForTimeout(250);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(wait);
}

function toGif(video, start, length, fps, out) {
  const filter = `fps=${fps},split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(start), '-t', String(length), '-i', video,
    '-filter_complex', filter, '-loop', '0', out]);
  console.log(out, Math.round(fs.statSync(out).size / 1024) + ' KB');
}

(async () => {
  const [pagePath, outDir] = process.argv.slice(2);
  if (!pagePath || !outDir) {
    console.error('usage: node tools/readme_gifs.js KUTT_PAGE.html OUT_DIR');
    process.exit(2);
  }
  const { chromium } = require('playwright');
  const browser = await chromium.launch();

  const hero = await record(browser, pagePath, { width: 1280, height: 640 }, async page => {
    await page.click('#gofull', { force: true });
    await page.waitForTimeout(1500);
    await page.click('#playFlow', { force: true });
    await page.waitForTimeout(19000);
  }, false);
  toGif(hero.file, hero.start + 1.3, 18.5, 10, path.join(outDir, 'hero-flow.gif'));

  const drill = await record(browser, pagePath, { width: 1280, height: 640 }, async page => {
    await page.mouse.move(700, 300);
    await page.waitForTimeout(900);
    await clickOn(page, '#map0 g.block[aria-label^="Serve the redirect"]', 1800);
    await clickOn(page, '#map [data-node="redirect"]', 1800);
    await clickOn(page, '#lookInside', 2000);
    await page.mouse.move(420, 400, { steps: 15 });
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 90); await page.waitForTimeout(350); }
    await page.waitForTimeout(1500);
  });
  toGif(drill.file, drill.start, 17, 12, path.join(outDir, 'drill.gif'));

  await browser.close();
})();
