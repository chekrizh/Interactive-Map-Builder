/** The camera: zoom and pan (the buttons, the wheel, a hand drag), the full-screen flow camera
 *  that follows Explore's dot, and the tour's camera (the wide view, a flow beat's overview and
 *  shots). The only writer of zoom, tx, ty, camTimer and tourCam. */

/* The neighbours' functions the camera calls (through act): none, it only moves the map. */
export const NEEDS = [];

export function createCamera({ env, model, scene, state, act }) {
const { document } = env;
const stagecard = document.querySelector(".stagecard");
const scroller = document.querySelector(".stage-scroll");
const drawer = document.getElementById("drawer");
const tourCard = document.getElementById("tourCard");
const tcKeys = tourCard.querySelector(".tc-keys");
const zoomCtl = document.getElementById("zoomCtl");
const activeSvg = () => state.level === 0 ? scene.svg0 : scene.svg;
// Reserve the inspector's actual width and inset during camera moves.
// While touring, the step card takes the inspector's place.
const drawerOcclusion = () => drawer.classList.contains("open") ? drawer.offsetWidth + 2 * parseFloat(getComputedStyle(stagecard).getPropertyValue("--drawer-inset")) : tourOcclusion().x;
const camFree = () => state.tour.active && state.fsMode && !env.reduced && !state.tourCam.manual;
/* What the tour's step card covers: a strip on the right on wider
   screens, the bottom sheet on phones. Zero outside the tour. */
function tourOcclusion() {
  if (!state.tour.active || tourCard.hidden) return {
    x: 0,
    y: 0
  };
  const sr = scroller.getBoundingClientRect(),
    cr = tourCard.getBoundingClientRect();
  if (env.phoneQuery.matches) return {
    x: 0,
    y: Math.max(0, sr.bottom - cr.top)
  };
  return {
    x: Math.max(0, sr.right - cr.left) + 20,
    y: 0
  };
}

/* Pan limits: any point of the map can be brought to the middle of the
   visible area (left of the sidebar when it is open), so a zoomed-in
   corner card can be centred, and no further, so at least a corner of the
   map always stays on screen. Measured from where the map actually sits:
   it is anchored left and centred vertically, so the range is not
   symmetric. The rendered translate is read back from the computed style,
   which keeps this right during the camera's transition too. */
function clampPan() {
  const s = activeSvg();
  const r = s.getBoundingClientRect();
  const sr = scroller.getBoundingClientRect();
  const m = new DOMMatrixReadOnly(getComputedStyle(s).transform === "none" ? undefined : getComputedStyle(s).transform);
  // Bound by the drawn content (environments and cards), not the canvas
  // margin, so the far limit still shows a card, not empty dots.
  let box = r;
  if (s === scene.svg) {
    const a = scene.zoneLayer.getBoundingClientRect(),
      b = scene.nodeLayer.getBoundingClientRect();
    const left = Math.min(a.left, b.left),
      top = Math.min(a.top, b.top);
    box = {
      left,
      top,
      width: Math.max(a.right, b.right) - left,
      height: Math.max(a.bottom, b.bottom) - top
    };
  }
  const baseLeft = box.left - m.e,
    baseTop = box.top - m.f;
  const pad = Math.min(drawerOcclusion(), sr.width * 0.45);
  const vpad = Math.min(tourOcclusion().y, sr.height * 0.6);
  const cx = sr.left + (sr.width - pad) / 2,
    cy = sr.top + (sr.height - vpad) / 2;
  state.tx = Math.min(cx - baseLeft, Math.max(cx - baseLeft - box.width, state.tx));
  state.ty = Math.min(cy - baseTop, Math.max(cy - baseTop - box.height, state.ty));
}

/* Fullscreen flow camera: pan so the given viewBox point sits centered in
   the area left of the sidebar. The .campan class enables a CSS transition
   for these programmatic moves only; a manual drag removes it instantly. */
function focusPoint(vx, vy) {
  if (!state.fsMode) return;
  const s = activeSvg();
  const r = s.getBoundingClientRect();
  const scale = r.width / (s === scene.svg0 ? model.VB.map0[0] : model.VB.map[0]);
  const sr = scroller.getBoundingClientRect();
  const pad = Math.min(drawerOcclusion(), sr.width * 0.45);
  const vpad = Math.min(tourOcclusion().y, sr.height * 0.6);
  const pointX = r.left + vx * scale;
  const pointY = r.top + vy * scale;
  const targetX = sr.left + (sr.width - pad) / 2;
  const targetY = sr.top + (sr.height - vpad) / 2;
  state.tx += targetX - pointX;
  state.ty += targetY - pointY;
  stagecard.classList.add("campan");
  applyPan();
  env.clearTimeout(state.camTimer);
  state.camTimer = env.setTimeout(() => stagecard.classList.remove("campan"), 500);
}

function focusHop(pathEl) {
  if (!state.fsMode) return;
  // The tour drives its own camera (tourCamShot); this is Explore's.
  if (state.tour.active) return;
  const L = pathEl.getTotalLength();
  const m = pathEl.getPointAtLength(L * 0.5);
  focusPoint(m.x, m.y);
}

function applyPan() {
  clampPan();
  stagecard.style.setProperty("--tx", state.tx + "px");
  stagecard.style.setProperty("--ty", state.ty + "px");
}
/* In the normal view, `at` is the screen point that stays put as the map
   scales: the canvas centre for the buttons, the pointer for a pinch. */
function setZoom(z, at) {
  const next = Math.min(6, Math.max(0.5, z));
  if (at && !state.fsMode) {
    const r = activeSvg().getBoundingClientRect(),
      k = 1 - next / state.zoom;
    state.tx += (at.x - r.left) * k;
    state.ty += (at.y - r.top) * k;
  }
  state.zoom = next;
  stagecard.style.setProperty("--zoom", state.zoom);
  stagecard.classList.toggle("zoomed", state.zoom !== 1);
  applyPan();
}

function canvasCentre() {
  const sr = scroller.getBoundingClientRect();
  return {
    x: sr.left + sr.width / 2,
    y: sr.top + sr.height / 2
  };
}

function resetView() {
  state.zoom = 1;
  state.tx = 0;
  state.ty = 0;
  setZoom(1);
}

function camFrame() {
  const s = activeSvg(),
    r = s.getBoundingClientRect(),
    vb = s === scene.svg0 ? model.VB.map0 : model.VB.map;
  const t = getComputedStyle(s).transform;
  const m = new DOMMatrixReadOnly(t === "none" ? undefined : t);
  const sr = scroller.getBoundingClientRect(),
    occ = tourOcclusion();
  return {
    r,
    m,
    scale: r.width / vb[0],
    base: r.width / vb[0] / state.zoom,
    cx: sr.left + (sr.width - occ.x) / 2,
    cy: sr.top + (sr.height - occ.y) / 2,
    w: sr.width - occ.x,
    h: sr.height - occ.y
  };
}
// Put viewBox point (v.cx, v.cy) at the centre of the visible area, at zoom v.z.
function placeCamera(v) {
  state.zoom = Math.min(6, Math.max(0.5, v.z));
  stagecard.style.setProperty("--zoom", state.zoom);
  const f = camFrame();
  state.tx = f.cx - (f.r.left - f.m.e + v.cx * f.scale);
  state.ty = f.cy - (f.r.top - f.m.f + v.cy * f.scale);
  stagecard.style.setProperty("--tx", state.tx + "px");
  stagecard.style.setProperty("--ty", state.ty + "px");
}

function currentView() {
  const f = camFrame();
  return {
    z: state.zoom,
    cx: (f.cx - f.r.left) / f.scale,
    cy: (f.cy - f.r.top) / f.scale
  };
}
/* The zoom and centre that fit a set of viewBox boxes into the visible
   area, mx and my px clear of its sides (24 and 20 by default). */
function frameBoxes(boxes, pad, maxZ, mx = 24, my = 20) {
  const f = camFrame();
  const x0 = Math.min(...boxes.map(b => b.x)) - pad,
    y0 = Math.min(...boxes.map(b => b.y)) - pad;
  const x1 = Math.max(...boxes.map(b => b.x + b.width)) + pad,
    y1 = Math.max(...boxes.map(b => b.y + b.height)) + pad;
  const z = Math.min(maxZ, (f.w - 2 * mx) / ((x1 - x0) * f.base), (f.h - 2 * my) / ((y1 - y0) * f.base));
  return {
    z,
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2
  };
}
/* Safe framing (2026-11-02). The step card's strip is not the only thing
   over the map: the zoom control sits in its lower left. camSolve frames
   the viewBox boxes `must` in the visible area, mx and my px clear of its
   sides, at most at zoom maxZ, so that every `must` box is fully shown,
   clear of the card and the zoom control, and no lit node (`lit`, boxes)
   is half shown: each one is either fully shown or fully hidden (off the
   stage or behind the card). It tries the plain frame and two that step
   around the zoom control (above it, right of it), each also at the floor
   zoom minZ when it falls below it, and takes the closest valid one,
   preferring (within 15% of zoom) one with no node at all, lit or dimmed
   (`all`), under the zoom control. When none is valid it adds the lit
   nodes the closest frame half shows to `must` and tries again, so a
   close-up zooms out just enough to take a neighbour in whole instead of
   cutting it at an edge. */

function camGeom() {
  const f = camFrame(),
    sr = scroller.getBoundingClientRect();
  const stage = {
    l: sr.left,
    t: sr.top,
    r: sr.right,
    b: sr.bottom
  };
  const vis = {
    l: sr.left,
    t: sr.top,
    r: sr.left + f.w,
    b: sr.top + f.h
  };
  const cr = state.tour.active && !tourCard.hidden ? tourCard.getBoundingClientRect() : null;
  const card = cr && {
    l: cr.left,
    t: cr.top,
    r: cr.right,
    b: cr.bottom
  };
  // The key hint under the card is see-through, so it hides nothing, but nothing should sit under it either.
  const kr = cr && getComputedStyle(tcKeys).display !== "none" ? tcKeys.getBoundingClientRect() : null;
  const keys = kr && kr.width ? {
    l: kr.left,
    t: kr.top,
    r: kr.right,
    b: kr.bottom
  } : null;
  const zr = getComputedStyle(zoomCtl).display === "none" ? null : zoomCtl.getBoundingClientRect();
  const res = zr && zr.width ? {
    l: zr.left - 12,
    t: zr.top - 12,
    r: zr.right + 12,
    b: zr.bottom + 12
  } : null;
  const hit = (a, b) => Boolean(b) && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
  const inside = (p, a) => p.l >= a.l - 0.5 && p.r <= a.r + 0.5 && p.t >= a.t - 0.5 && p.b <= a.b + 0.5;
  // A viewBox box on screen with the camera at t ({ z, cx, cy }), as placeCamera puts it.
  const proj = (t, b) => {
    const k = f.base * t.z;
    return {
      l: f.cx + (b.x - t.cx) * k,
      t: f.cy + (b.y - t.cy) * k,
      r: f.cx + (b.x + b.width - t.cx) * k,
      b: f.cy + (b.y + b.height - t.cy) * k
    };
  };
  const shown = p => inside(p, stage) && !hit(p, card) && !hit(p, keys) && !hit(p, res);
  const hidden = p => {
    const q = {
      l: Math.max(p.l, stage.l),
      t: Math.max(p.t, stage.t),
      r: Math.min(p.r, stage.r),
      b: Math.min(p.b, stage.b)
    };
    // Behind the card means 2px inside its edge, so no sliver shows beside it.
    return q.r <= q.l || q.b <= q.t || Boolean(card) && inside(q, {
      l: card.l + 2.5,
      t: card.t + 2.5,
      r: card.r - 2.5,
      b: card.b - 2.5
    });
  };
  return {
    f,
    vis,
    res,
    hit,
    proj,
    shown,
    hidden
  };
}

function camSolve(must, lit, all, maxZ, mx, my, minZ = 0) {
  const G = camGeom(),
    f = G.f;
  const inner = {
    l: G.vis.l + mx,
    t: G.vis.t + my,
    r: G.vis.r - mx,
    b: G.vis.b - my
  };
  // Where a frame may slide to: the visible area, 24 and 20 px clear of its sides.
  const loose = {
    l: G.vis.l + 24,
    t: G.vis.t + 20,
    r: G.vis.r - 24,
    b: G.vis.b - 20
  };
  const icx = (inner.l + inner.r) / 2,
    icy = (inner.t + inner.b) / 2;
  const ext = boxes => ({
    x0: Math.min(...boxes.map(b => b.x)),
    y0: Math.min(...boxes.map(b => b.y)),
    x1: Math.max(...boxes.map(b => b.x + b.width)),
    y1: Math.max(...boxes.map(b => b.y + b.height))
  });
  // The camera that puts the boxes' centre at screen point (sx, sy), at zoom z.
  const at = (e, z, sx, sy) => {
    const k = f.base * z;
    return {
      z,
      cx: (e.x0 + e.x1) / 2 - (sx - f.cx) / k,
      cy: (e.y0 + e.y1) / 2 - (sy - f.cy) / k
    };
  };
  const half = t => lit.filter(b => {
    const p = G.proj(t, b);
    return !G.shown(p) && !G.hidden(p);
  });
  let set = must.slice(),
    first = null;
  for (let round = 0; round < 8; round++) {
    const e = ext(set),
      bw = (e.x1 - e.x0) * f.base,
      bh = (e.y1 - e.y0) * f.base;
    const z0 = Math.min(maxZ, (inner.r - inner.l) / bw, (inner.b - inner.t) / bh);
    if (!first) first = at(e, Math.max(z0, minZ), icx, icy);
    // The best fit, then a little wider at a time; never below minZ.
    const zs = z0 < minZ ? [minZ] : [z0, 0.94, 0.88, 0.82, 0.76, 0.7].map((m, i) => i ? z0 * m : z0).filter(z => z >= minZ);
    let best = null,
      bestScore = -Infinity;
    for (const z of zs) {
      const w = bw * z,
        h = bh * z;
      // The centre may slide anywhere the boxes stay in `loose`; centred in `inner` is preferred.
      const xl = loose.l + w / 2,
        xr = loose.r - w / 2,
        yt = loose.t + h / 2,
        yb = loose.b - h / 2;
      if (xl > xr + 0.5 || yt > yb + 0.5) continue;
      const px = Math.min(xr, Math.max(xl, icx)),
        py = Math.min(yb, Math.max(yt, icy));
      const xs = [px],
        ys = [py];
      for (let i = 0; i <= 8; i++) {
        xs.push(xl + (xr - xl) * i / 8);
        ys.push(yt + (yb - yt) * i / 8);
      }
      for (const sx of xs) for (const sy of ys) {
        const t = at(e, z, sx, sy);
        if (!set.every(b => G.shown(G.proj(t, b))) || half(t).length) continue;
        const score = z * (all.some(b => G.hit(G.proj(t, b), G.res)) ? 0.85 : 1) - Math.hypot(sx - px, sy - py) * 1e-5;
        if (score > bestScore) {
          best = t;
          bestScore = score;
        }
      }
    }
    if (best) return best;
    const grow = half(at(e, Math.max(z0, minZ), icx, icy));
    if (!grow.length) break;
    set = set.concat(grow);
  }
  return first;
}
// Whether every box is fully shown with the camera at t.
function camShows(t, boxes) {
  const G = camGeom();
  return boxes.every(b => G.shown(G.proj(t, b)));
}

// The nodes lit during a flow beat: its whole path so far, as syncFocus lights it.
function litBoxes(b) {
  const ids = new Set();
  model.STORIES[b.flow].hops.slice(0, model.flowEnd(b)).forEach(h => {
    const d = scene.edgeEls[h.e].def;
    ids.add(d.from);
    ids.add(d.to);
  });
  return [...ids].map(scene.nodeBox);
}

function fitTarget() {
  const s = activeSvg();
  if (s === scene.svg) {
    const nodes = scene.allNodeBoxes();
    return camSolve([scene.zoneLayer.getBBox(), scene.edgeLayer.getBBox(), scene.nodeLayer.getBBox()], nodes, nodes, 1.6, 24, 20);
  }
  // The big picture's 2x2 gets the same breathing room as a step's path.
  const f = camFrame(),
    blocks = [...s.querySelectorAll("g.block")].map(g => g.getBBox());
  return camSolve([s.getBBox()], blocks, blocks, 1.6, Math.max(48, f.w * 0.1), Math.max(48, f.h * 0.1));
}
// A hop's boxes: its two components, path and label.

// The overview, the frame of a flow beat's own path.
function pathTarget(b) {
  const s = model.STORIES[b.flow],
    boxes = [];
  for (let i = model.beatStart(b); i < model.flowEnd(b); i++) boxes.push(...scene.hopBoxes(scene.edgeEls[s.hops[i].e]));
  const f = camFrame();
  return camSolve(boxes, litBoxes(b), scene.allNodeBoxes(), model.PATH_ZOOM_MAX, Math.max(48, f.w * 0.1), Math.max(48, f.h * 0.1), state.tourCam.fitZoom);
}
/* The beat's shots, greedy and in order. Each is
   { edges: [k, ...], target }, k the edge's index within the beat and
   target the frame of the shot's boxes at their own best zoom, capped at
   PATH_ZOOM_MAX. Measured on demand, so a resize simply re-measures. */
function beatShots(b) {
  const s = model.STORIES[b.flow],
    f = camFrame(),
    shots = [];
  const mx = Math.max(48, f.w * 0.1),
    my = Math.max(48, f.h * 0.1);
  const fitZ = boxes => frameBoxes(boxes, 0, Infinity, mx, my).z;
  const each = [];
  for (let i = model.beatStart(b); i < model.flowEnd(b); i++) each.push(scene.hopBoxes(scene.edgeEls[s.hops[i].e]));
  if (!each.length) return shots;
  const zc = Math.max(state.tourCam.fitZoom, Math.min(model.PATH_ZOOM_MAX, ...each.map(fitZ)));
  // A shot may run up to SHOT_SLACK wider than ZC (never wider than the wide view) before a new one starts.
  const zMerge = Math.max(state.tourCam.fitZoom, zc * model.SHOT_SLACK) - 1e-6;
  each.forEach((boxes, k) => {
    const cur = shots[shots.length - 1];
    if (cur && fitZ(cur.boxes.concat(boxes)) >= zMerge) {
      cur.edges.push(k);
      cur.boxes.push(...boxes);
    } else shots.push({
      edges: [k],
      boxes: boxes.slice()
    });
  });
  const lit = litBoxes(b),
    all = scene.allNodeBoxes(),
    out = [];
  /* Each shot is framed safely (camSolve). A shot whose boxes the shot
     before already shows whole joins it: the camera stays put. */
  shots.forEach(sh => {
    const prev = out[out.length - 1];
    if (prev && camShows(prev.target, sh.boxes)) {
      prev.edges.push(...sh.edges);
      return;
    }
    out.push({
      edges: sh.edges,
      target: camSolve(sh.boxes, lit, all, model.PATH_ZOOM_MAX, mx, my, state.tourCam.fitZoom)
    });
  });
  return out;
}

function tweenCamera(to, ms) {
  const token = ++state.tourCam.token;
  const from = currentView();
  return env.scope.cancellable(resolve => {
    const t0 = performance.now();
    const step = now => {
      if (token !== state.tourCam.token || !state.tour.active || !state.fsMode) {
        resolve();
        return;
      }
      const k = Math.min(1, (now - t0) / ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      /* 1/zoom (the visible extent) and the centre both move linearly, so
         each visible edge does too: anything framed at both ends of a
         move stays framed throughout it. */
      placeCamera({
        z: 1 / ((1 - e) / from.z + e / to.z),
        cx: from.cx + (to.cx - from.cx) * e,
        cy: from.cy + (to.cy - from.cy) * e
      });
      if (k < 1) env.requestAnimationFrame(step);else resolve();
    };
    env.requestAnimationFrame(step);
  });
}

/* The camera onto edge k's shot (k within the beat), or the overview
   (k null). animate: ease there over 800 ms, or hold when the camera is
   already on (or moving to) that shot; resolves when it arrives.
   Otherwise it is placed at once, as on resize. */
function tourCamShot(b, k, animate) {
  if (!b || !b.flow || !camFree()) return Promise.resolve();
  const shots = beatShots(b);
  const si = k == null ? -1 : shots.findIndex(sh => sh.edges.includes(k));
  if (animate && si === state.tourCam.shot) return state.tourCam.shotMove || Promise.resolve();
  const to = si < 0 ? pathTarget(b) : shots[si].target;
  if (animate) {
    state.tourCam.shotMove = tweenCamera(to, 800);
    state.tourCam.shot = si;
    return state.tourCam.shotMove;
  }
  state.tourCam.token++;
  placeCamera(to);
  state.tourCam.shot = si;
  state.tourCam.shotMove = null;
  return Promise.resolve();
}

function tourCamManual() {
  if (!state.tour.active) return;
  state.tourCam.manual = true;
  state.tourCam.token++;
}
// The wide framing, immediately. Cancels any camera move in flight.
function tourFit() {
  if (!state.fsMode) return;
  state.tourCam.token++;
  env.clearTimeout(state.camTimer);
  stagecard.classList.remove("campan");
  placeCamera(fitTarget());
  state.tourCam.fitZoom = state.zoom;
  state.tourCam.shot = -2;
  state.tourCam.shotMove = null;
}
// A new beat: the camera is free to move again, whatever the hand did on the last one.
function tourCamFree() {
  state.tourCam.manual = false;
}
// Cancels a tour camera move in flight.
function tourCamStop() {
  state.tourCam.token++;
}

/* ---------------- pan (hand drag) + zoom ---------------- */

/* Zoom outside full screen: the hub's wide layout only. The lesson embeds
   stay as they are, and narrow screens scroll sideways natively. */
stagecard.classList.add("zoomable");
const normalZoom = () => !state.fsMode && env.wideQuery.matches;
env.scope.listen(document.getElementById("zoomIn"), "click", () => {
  tourCamManual();
  setZoom(state.zoom * 1.25, canvasCentre());
});
env.scope.listen(document.getElementById("zoomOut"), "click", () => {
  tourCamManual();
  setZoom(state.zoom / 1.25, canvasCentre());
});
// In the tour, Fit means the tour's wide framing, not zoom 1.
env.scope.listen(document.getElementById("zoomFit"), "click", () => {
  if (state.tour.active) tourFit();else resetView();
});
env.scope.listen(scroller, "wheel", e => {
  if (e.target.closest("#zoomCtl")) return;
  /* Normal view: a pinch zooms, and plain scrolling stays the page's. */
  if (!state.fsMode) {
    if (!normalZoom() || !e.ctrlKey) return;
    e.preventDefault();
    setZoom(state.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), {
      x: e.clientX,
      y: e.clientY
    });
    return;
  }
  e.preventDefault();
  tourCamManual();
  if (e.ctrlKey) setZoom(state.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15));else {
    state.tx -= e.deltaX;
    state.ty -= e.deltaY;
    applyPan();
  }
}, {
  passive: false
});
let panDown = false,
  panMoved = false,
  panX = 0,
  panY = 0;
env.scope.listen(scroller, "pointerdown", e => {
  const canPan = state.fsMode || normalZoom() && state.zoom !== 1;
  if (!canPan || e.button !== 0 || e.target.closest("#zoomCtl")) return;
  panDown = true;
  panMoved = false;
  panX = e.clientX;
  panY = e.clientY;
});
env.scope.listen(scroller, "pointermove", e => {
  if (!panDown) return;
  const dx = e.clientX - panX,
    dy = e.clientY - panY;
  if (!panMoved && Math.hypot(dx, dy) < 5) return;
  if (!panMoved) {
    panMoved = true;
    tourCamManual();
    try {
      scroller.setPointerCapture(e.pointerId);
    } catch (err) {}
    scroller.classList.add("panning");
    stagecard.classList.remove("campan");
  }
  e.preventDefault();
  state.tx += dx;
  state.ty += dy;
  applyPan();
  panX = e.clientX;
  panY = e.clientY;
});
["pointerup", "pointercancel"].forEach(t => env.scope.listen(scroller, t, () => {
  panDown = false;
  scroller.classList.remove("panning");
}));
env.scope.listen(scroller, "click", e => {
  if (e.target.closest("#zoomCtl")) return;
  if (panMoved) {
    e.stopPropagation();
    e.preventDefault();
    panMoved = false;
  }
}, true);

return { tourOcclusion, clampPan, focusPoint, focusHop, applyPan, setZoom, canvasCentre, resetView, camFrame, placeCamera, currentView, frameBoxes, camGeom, camSolve, camShows, litBoxes, fitTarget, pathTarget, beatShots, tweenCamera, tourCamShot, tourCamManual, tourCamFree, tourCamStop, tourFit };
}
