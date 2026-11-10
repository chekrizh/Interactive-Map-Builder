// Walks a rendered map through one fixed script (overview, groups, every component and close-up,
// build steps, every flow mid-way and at its end, zoom and pan, full screen, the tour forward and
// back, project structure, the help card, dark theme, a phone) and saves, after every action, a
// screenshot plus a record of the viewer state, the DOM and localStorage. The page clock is faked,
// so the same page gives the same files on every run. Used to prove that a change to the viewer's
// code changes nothing a reader can see: snapshot before and after, then compare.
//   node tests/viewer_snapshots.js PAGE.html OUT_DIR
//   node tests/viewer_snapshots.js --compare DIR_A DIR_B
// Needs Playwright with Chromium.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const START = Date.parse('2026-01-05T09:00:00Z');

async function walk(pagePath, out) {
  const { chromium } = require('playwright');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const records = [];
  const errors = [];

  async function session(name, options, script) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    /* CSS transitions and Web Animations run on the real clock, not the faked one; the CSS
       does not change between the runs being compared, so they are switched off here and
       JS-driven motion (rAF, timers) is what gets checked frame by frame. */
    await page.addInitScript(() => {
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        const o = typeof options === 'number' ? { duration: 0 } : { ...options, duration: 0, delay: 0 };
        return animate.call(this, keyframes, o);
      };
      for (const name of ['scrollTo', 'scrollBy', 'scrollIntoView']) {
        const native = Element.prototype[name];
        Element.prototype[name] = function (arg, ...rest) {
          return native.call(this, arg && typeof arg === 'object' ? { ...arg, behavior: 'instant' } : arg, ...rest);
        };
      }
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; scroll-behavior: auto !important; }';
        document.head.appendChild(style);
      });
    });
    await page.clock.install({ time: START - 1000 });
    await page.clock.pauseAt(START);
    await page.goto('file://' + path.resolve(pagePath));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    await page.clock.runFor(500);
    let n = 0;
    const snap = async label => {
      const id = `${name}-${String(++n).padStart(3, '0')}-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
      await page.waitForTimeout(60);
      /* Chromium sometimes re-rasters text a moment after a frame has settled (seen: 600-700
         pixels across a few tour frames, with the same DOM), so a frame is kept only once two
         screenshots in a row agree; after five tries the last one is kept as it is. */
      let shot = await page.screenshot({ animations: 'disabled' });
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(80);
        const again = await page.screenshot({ animations: 'disabled' });
        if (again.equals(shot)) break;
        shot = again;
      }
      fs.writeFileSync(path.join(out, id + '.png'), shot);
      const rec = await page.evaluate(() => {
        const state = window.mapViewer ? window.mapViewer.getState() : null;
        const storage = Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)]));
        return { state, storage, html: document.documentElement.outerHTML };
      });
      rec.dom = crypto.createHash('sha256').update(rec.html).digest('hex');
      fs.writeFileSync(path.join(out, id + '.html'), rec.html);
      delete rec.html;
      records.push({ id, ...rec });
    };
    const settle = () => page.waitForTimeout(150);
    const tick = async ms => { await settle(); await page.clock.runFor(ms); await settle(); };
    const click = async (sel, wait = 400) => {
      const el = await page.$(sel);
      if (!el || !(await el.isVisible())) return false;
      await el.click();
      await tick(wait);
      return true;
    };
    await script({ page, snap, tick, click });
    await context.close();
  }

  const desktop = { viewport: { width: 1440, height: 900 } };

  await session('desk', desktop, async ({ page, snap, tick, click }) => {
    await snap('overview');
    const groups = await page.$$eval('#map0 [data-g]', els => [...new Set(els.map(e => e.dataset.g))]);
    for (const g of groups) {
      await page.click(`#map0 [data-g="${g}"]`, { force: true });
      await tick(700);
      await snap('group-' + g);
    }
    await click('#gofull', 800) || await click('#toL0', 800);
    await snap('full-map');
    const nodes = await page.$$eval('#map [data-node]', els => [...new Set(els.map(e => e.dataset.node))]);
    for (const id of nodes) {
      await page.click(`#map [data-node="${id}"]`, { force: true });
      await tick(500);
      await snap('node-' + id);
      if (await click('#lookInside', 600)) {
        await snap('inside-' + id);
        await page.keyboard.press('Escape');
        await tick(400);
      }
    }
    const weeks = await page.$$eval('#weekSeg button', els => els.map(e => e.dataset.w));
    for (const w of weeks) {
      await page.click(`#weekSeg button[data-w="${w}"]`);
      await tick(700);
      await snap('week-' + w);
    }
    const flows = await page.$$eval('[data-flow]', els => els.map(e => e.dataset.flow));
    for (const f of flows) {
      await page.click('#flowPicker summary');
      await tick(200);
      await snap('picker-' + f);
      await page.click(`[data-flow="${f}"]`);
      await tick(200);
      await click('#playFlow', 0);
      await tick(1100);
      await snap('flow-' + f + '-early');
      await tick(2600);
      await snap('flow-' + f + '-mid');
      await tick(30000);
      await snap('flow-' + f + '-end');
    }
    await page.click('#unfocus').catch(() => {});
    await tick(500);
    await click('#zoomIn', 500);
    await click('#zoomIn', 500);
    await snap('zoom-in');
    const box = await page.locator('.stage-scroll').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 140, box.y + box.height / 2 - 60, { steps: 6 });
    await page.mouse.up();
    await tick(500);
    await snap('pan');
    await page.mouse.wheel(0, 240);
    await tick(500);
    await snap('wheel');
    await click('#zoomFit', 700);
    await snap('fit');
    await click('#panelBtn', 500);
    await snap('panel-toggle');
    await click('#panelBtn', 500);
    if (await click('#fsBtn', 800)) {
      await snap('fullscreen');
      await click('#panelBtn', 500);
      await snap('fullscreen-drawer');
      await page.keyboard.press('Escape');
      await tick(800);
      await snap('fullscreen-exit');
    }
    if (await click('#filesBtn', 600)) {
      await snap('files');
      const file = await page.$('#filesTree button, #filesTree [data-path]');
      if (file) { await file.click(); await tick(500); await snap('files-item'); }
      await click('#filesBack', 500);
      await snap('files-back');
    }
    if (await click('#helpBtn', 400)) {
      await snap('help');
      await page.keyboard.press('Escape');
      await tick(400);
    }
    await click('#themeToggle', 500);
    await snap('dark-full');
    await click('#toL0', 800);
    await snap('dark-overview');
    await click('#themeToggle', 500);
  });

  await session('tour', desktop, async ({ page, snap, tick, click }) => {
    await click('#tourBtn', 900);
    await snap('step-1');
    for (let i = 2; i < 80; i++) {
      if (!(await click('#tcNext', 0))) break;
      await tick(700);
      await snap(`step-${i}-early`);
      await tick(6000);
      await snap(`step-${i}`);
    }
    await snap('ending');
    await click('#teBack', 800);
    await snap('ending-back');
    for (let i = 0; i < 3; i++) {
      await click('#tcBack', 2500);
      await snap('back-' + (i + 1));
    }
    await click('#tourExit', 800);
    await snap('exit');
    await click('#tourBtn', 900);
    await snap('resume');
    await click('#tourExit', 800);
    if (await click('#fsBtn', 800)) {
      await click('#tourBtn', 900);
      await snap('fs-step');
      for (let i = 0; i < 4; i++) {
        await click('#tcNext', 0);
        await tick(500);
        await snap(`fs-step-${i + 2}-early`);
        await tick(6000);
        await snap(`fs-step-${i + 2}`);
      }
      await page.keyboard.press('ArrowRight');
      await tick(6000);
      await snap('fs-key-next');
      await page.keyboard.press('Escape');
      await tick(800);
      await snap('fs-exit');
    }
  });

  await session('phone', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, async ({ page, snap, tick, click }) => {
    await snap('overview');
    await click('#gofull', 800) || await click('#toL0', 800);
    await snap('full-map');
    const first = await page.$('#map [data-node]');
    if (first) { await first.click({ force: true }); await tick(500); await snap('node'); }
    await click('#tourBtn', 900);
    await snap('tour-1');
    for (let i = 2; i < 5; i++) {
      await click('#tcNext', 0);
      await tick(6000);
      await snap('tour-' + i);
    }
  });

  await browser.close();
  fs.writeFileSync(path.join(out, 'records.json'), JSON.stringify({ errors, records }, null, 1));
  console.log(`${records.length} snapshots, ${errors.length} page errors -> ${out}`);
}

/* Chromium is not bit-exact between runs of the same page: a ResizeObserver or font callback can
   land a frame earlier or later and move a camera by 1e-7, and anti-aliasing of blurred shadows
   can shift by a few levels. So numbers may differ by under 0.01 and a screenshot passes when at
   most PIXEL_BUDGET pixels differ by more than PIXEL_LEVEL (seen run to run: under 250 pixels). */
const PIXEL_LEVEL = 8, PIXEL_BUDGET = 400;
/* Frames taken in the middle of a motion ("-early") depend on when a Web Animation or a layout
   callback lands on the real clock, so camera and dot positions move between runs of the same page.
   For those only the structure is compared: the same elements, classes and text, any numbers. */
const NUMBER = /-?\d+(?:\.\d+)?(?:e-?\d+)?/g;
/* Same text, with every number allowed to move by under 0.01. */
function same(x, y, soft = false) {
  if (x === y) return true;
  if (soft) return x.replace(NUMBER, '#') === y.replace(NUMBER, '#');
  if (x.replace(NUMBER, '#') !== y.replace(NUMBER, '#')) return false;
  const p = x.match(NUMBER) || [], q = y.match(NUMBER) || [];
  return p.length === q.length && p.every((v, i) => v === q[i] || Math.abs(Number(v) - Number(q[i])) < 0.01);
}

/* Decodes both PNGs in Chromium (no image library needed) and counts pixels that differ by more
   than PIXEL_LEVEL in any channel. */
async function pixelDiff(page, fileA, fileB) {
  const a = fs.readFileSync(fileA), b = fs.readFileSync(fileB);
  if (a.equals(b)) return 0;
  return page.evaluate(async ([a, b, level]) => {
    const load = async s => createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob());
    const [x, y] = [await load(a), await load(b)];
    if (x.width !== y.width || x.height !== y.height) return Infinity;
    const read = img => {
      const c = new OffscreenCanvas(img.width, img.height), g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      return g.getImageData(0, 0, img.width, img.height).data;
    };
    const p = read(x), q = read(y);
    let count = 0;
    for (let i = 0; i < p.length; i += 4) {
      if (Math.max(Math.abs(p[i] - q[i]), Math.abs(p[i + 1] - q[i + 1]), Math.abs(p[i + 2] - q[i + 2])) > level) count++;
    }
    return count;
  }, [a.toString('base64'), b.toString('base64'), PIXEL_LEVEL]);
}

async function compare(a, b) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const ra = JSON.parse(fs.readFileSync(path.join(a, 'records.json')));
  const rb = JSON.parse(fs.readFileSync(path.join(b, 'records.json')));
  const problems = [], noise = [];
  const ids = new Set([...ra.records.map(r => r.id), ...rb.records.map(r => r.id)]);
  const byId = (r, id) => r.records.find(x => x.id === id);
  for (const id of ids) {
    const x = byId(ra, id), y = byId(rb, id);
    if (!x || !y) { problems.push(`${id}: only in ${x ? 'A' : 'B'}`); continue; }
    const soft = id.endsWith('-early');
    if (!same(JSON.stringify(x.state), JSON.stringify(y.state), soft)) problems.push(`${id}: state differs`);
    if (JSON.stringify(x.storage) !== JSON.stringify(y.storage)) problems.push(`${id}: localStorage differs`);
    /* The page carries the viewer's own code inline; that is what changes, so it is left out. */
    const text = file => fs.readFileSync(file, 'utf8').replace(/<script\b[\s\S]*?<\/script>/g, '<script></script>');
    const ha = text(path.join(a, id + '.html')), hb = text(path.join(b, id + '.html'));
    if (!same(ha, hb, soft)) problems.push(`${id}: DOM differs`);
    const px = await pixelDiff(page, path.join(a, id + '.png'), path.join(b, id + '.png'));
    if (px > PIXEL_BUDGET && !soft) problems.push(`${id}: ${px === Infinity ? 'image size differs' : px + ' pixels differ'}`);
    else if (px && !soft) noise.push(px);
  }
  await browser.close();
  if (JSON.stringify(ra.errors) !== JSON.stringify(rb.errors)) problems.push(`page errors: A ${JSON.stringify(ra.errors)} B ${JSON.stringify(rb.errors)}`);
  console.log(`${ids.size} snapshots compared, ${problems.length} differences` + (noise.length ? ` (${noise.length} with rendering noise, at most ${Math.max(...noise)} pixels)` : ''));
  for (const p of problems) console.log('  ' + p);
  process.exitCode = problems.length ? 1 : 0;
}

if (process.argv[2] === '--compare') compare(process.argv[3], process.argv[4]).catch(e => { console.error(e); process.exit(2); });
else walk(process.argv[2], process.argv[3]).catch(e => { console.error(e); process.exit(2); });
