/** Flows: playing one on the map (the travelling dot, the step chips, the narration in the panel),
 *  and the flow picker with its Play button. The only writer of storyToken, dot and chosenFlow. */

/* The neighbours' functions the flow player calls (through act). */
export const NEEDS = ["showLevel", "closeInside", "setFocus", "setWeek", "unselect", "panelHTML", "openPanel", "revealInPanel", "focusHop"];

export function createFlowplayer({ env, model, scene, state, act }) {
const { document } = env;
const { NODES, EDGES, STORIES } = model;
const { svg, el, storyLayer, edgeEls, nodeEls } = scene;
const controlsEl = document.querySelector("section.controls");
const panelBody = document.getElementById("panelBody");
const flowPicker = document.getElementById("flowPicker");
const flowSummary = flowPicker.querySelector("summary");
/* ---------------- stories + weeks ---------------- */

/* storyToken cancels in-flight playback: every await inside playStory
   re-checks it, so starting anything new safely abandons the old flow. */
function clearStory() {
  state.storyToken++;
  storyLayer.innerHTML = "";
  svg.classList.remove("tfocus", "flowing"); // the tour's focus pass (syncFocus)
  if (state.dot) {
    state.dot.remove();
    state.dot = null;
  }
  svg.querySelectorAll(".fout, .inchip").forEach(x => x.classList.remove("fout", "inchip"));
  EDGES.forEach(e => {
    const ee = edgeEls[e.id];
    ee.path.classList.remove("eactive", "tcur", "eglow");
    if (ee.start) { ee.start.remove(); ee.start = null; }
    ee.path.style.stroke = "";
    ee.path.setAttribute("marker-end", "url(#arr-base)");
    if (e.bidir) ee.path.setAttribute("marker-start", "url(#arr-base)");
  });
  NODES.forEach(n => {
    const g = nodeEls[n.id].g;
    g.classList.remove("lit", "broken");
    /* Playback sets this per node so one flow can carry two hues; the
       svg-level value stays as the default underneath it. */
    g.style.removeProperty("--story-hue");
  });
  // Keep the next flow choice when playback is cleared by navigation.
}

/* Stops a moving dot and takes it off the map, leaving the lit path as it is. */
function stopDot() {
  state.storyToken++;
  if (state.dot) {
    state.dot.remove();
    state.dot = null;
  }
}

function animateDot(pathEl, rev, hueKey) {
  return env.scope.cancellable(resolve => {
    const token = state.storyToken;
    const L = pathEl.getTotalLength();
    if (env.reduced) {
      env.setTimeout(resolve, 350);
      return;
    }
    /* The travelling dot: a solid core inside a soft halo of the same hue. */
    if (!state.dot) {
      state.dot = el("g", { class: "fdot" }, svg);
      el("circle", { r: 11, class: "fdot-halo" }, state.dot);
      el("circle", { r: 5, class: "fdot-core" }, state.dot);
    }
    state.dot.style.setProperty("--story-hue", model.hue(hueKey));
    const dur = Math.min(3200, Math.max(1200, L * 5.2));
    const t0 = performance.now();
    function step(t) {
      if (token !== state.storyToken) {
        resolve();
        return;
      }
      const k = Math.min(1, (t - t0) / dur);
      const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const at = rev ? L * (1 - ease) : L * ease;
      const pt = pathEl.getPointAtLength(at);
      state.dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      if (k < 1) env.requestAnimationFrame(step);else resolve();
    }
    env.requestAnimationFrame(step);
  });
}


function markSilent(sil) {
  const path = edgeEls[sil.e].path;
  const mid = path.getPointAtLength(path.getTotalLength() * 0.5);
  const g = el("g", {}, storyLayer);
  el("circle", {
    cx: mid.x,
    cy: mid.y,
    r: 9,
    class: "silent-c"
  }, g);
  el("path", {
    class: "silent-x",
    d: `M${mid.x - 3.6},${mid.y - 3.6} L${mid.x + 3.6},${mid.y + 3.6}` + ` M${mid.x + 3.6},${mid.y - 3.6} L${mid.x - 3.6},${mid.y + 3.6}`
  }, g);
  el("text", {
    x: mid.x,
    y: mid.y + 24,
    class: "silent-t"
  }, g).textContent = sil.t;
}

/* A flow's number appears once its dot has landed, with a short pop
   (scale and fade), in Explore's flows and the tour alike (2026-11-01). */
function popBadge(g) {
  if (!g || env.reduced) return;
  g.classList.remove("badge-pop");
  void g.getBBox();
  g.classList.add("badge-pop");
}

/* Where a bare step number (a chip w wide, 20 high) goes on edge ee: the
   free spot along its line nearest the middle, clear of every label still
   shown (faded ones too), every step chip already placed and every card;
   on an edge too short for that, just beside its own label. A flow that
   uses one edge twice used to stack both numbers on the label
   (2026-11-10). */
function chipSpot(ee, w, own) {
  const grow = (b, m) => ({ x: b.x - m, y: b.y - m, width: b.width + 2 * m, height: b.height + 2 * m });
  const hits = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  const shown = id => edgeEls[id].label && !edgeEls[id].label.classList.contains("inchip");
  const busy = EDGES.map(e => e.id).filter(shown).map(id => grow(edgeEls[id].label.getBBox(), 2))
    .concat([...storyLayer.querySelectorAll("g.fchip > .fchip-r")].filter(r => r.parentNode !== own).map(r => grow(r.getBBox(), 2)))
    .concat(NODES.map(n => grow({ x: n.x, y: n.y, width: n.w, height: n.h }, 4)));
  const free = p => !busy.some(b => hits({ x: p.x - w / 2, y: p.y - 10, width: w, height: 20 }, b));
  const L = ee.path.getTotalLength(), lo = w / 2 + 6, hi = L - w / 2 - 12;
  for (let d = 0; d <= L / 2; d += 4) {
    for (const t of d ? [L / 2 - d, L / 2 + d] : [L / 2]) {
      if (t < lo || t > hi) continue;
      const p = ee.path.getPointAtLength(t);
      if (free(p)) return p;
    }
  }
  if (ee.label) {
    const b = ee.label.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const above = cy - b.height / 2 - 13, below = cy + b.height / 2 + 13;
    const right = b.x + b.width + 3 + w / 2, left = b.x - 3 - w / 2;
    const across = [[cx, above], [cx + w + 2, above], [cx, below], [cx + w + 2, below]];
    const along = [[right, cy], [right, cy - 22], [left, cy], [left, cy - 22]];
    const a = ee.path.getPointAtLength(L * 0.45), z = ee.path.getPointAtLength(L * 0.55);
    const spots = Math.abs(z.x - a.x) >= Math.abs(z.y - a.y) ? across.concat(along) : along.concat(across);
    for (const [x, y] of spots) if (free({ x, y })) return { x, y };
  }
  return ee.path.getPointAtLength(L / 2);
}

/* opts.quiet is the guided tour's mode: the same animation on the map, but
   no narration panel, no drawer, no change to the Explore flow choice and
   no flow tracking (the tour sends its own step events).
   opts.from / opts.to play one slice of a flow (hops from..to-1, numbered
   as in the full flow); the hops before the slice are drawn already
   landed, lit and badged, with no motion, so a flow split over two tour
   beats continues instead of restarting. opts.wide keeps the tour camera
   still (the tour draws a beat's whole path in the wide view). Each badge
   carries its hop index (data-hop) so the tour can mark the current edge. */
async function playStory(key, opts) {
  const quiet = Boolean(opts && opts.quiet);
  const wide = Boolean(opts && opts.wide);
  const from = opts && opts.from || 0;
  if (state.level !== 1) act.showLevel(1);
  act.closeInside();
  clearStory();
  act.setFocus(null);
  const token = state.storyToken;
  if (state.week !== 0) act.setWeek(0, {
    silent: true
  });
  act.unselect();
  const s = STORIES[key];
  svg.style.setProperty("--story-hue", model.hue(s.hue));
  let list = null;
  if (!quiet) {
    chooseFlow(key);
    act.panelHTML(`
        <div class="p-eyebrow">${env.t(s.kind === "failure" ? "failureFlowEyebrow" : "flowEyebrow")}</div>
        <h2>${s.title}</h2>
        <p class="p-sub">${s.desc}</p>
        <ol class="steps" id="stepList"></ol>
      `, s.hue);
    act.openPanel();
    list = document.getElementById("stepList");
  }
  const badgeUses = {},
    bidirSeen = {};
  s.hops.forEach(h => {
    badgeUses[h.e] = (badgeUses[h.e] || 0) + 1;
  });
  const end = Math.min(s.hops.length, opts && opts.to || s.hops.length);
  /* Everything the flow never touches steps back, so the path reads on
     its own; each edge's label moves onto its step chip once it lands. */
  const inFlow = new Set(), flowEdges = new Set();
  s.hops.slice(0, end).forEach(h => {
    const d = edgeEls[h.e].def;
    flowEdges.add(h.e); inFlow.add(d.from); inFlow.add(d.to);
  });
  svg.classList.add("flowing");
  NODES.forEach(n => { if (!inFlow.has(n.id)) nodeEls[n.id].g.classList.add("fout"); });
  EDGES.forEach(e => {
    if (flowEdges.has(e.id)) return;
    const ee = edgeEls[e.id];
    ee.path.classList.add("fout");
    ee.label?.classList.add("fout");
  });
  if (s.hops.length) {
    const h0 = s.hops[0], d0 = edgeEls[h0.e].def;
    const first = nodeEls[h0.rev ? d0.to : d0.from].g;
    first.style.setProperty("--story-hue", model.hue(h0.bad || !s.ok ? s.hue : s.ok));
    first.classList.add("lit");
  }
  for (let i = 0; i < end; i++) {
    if (token !== state.storyToken) return;
    const hop = s.hops[i];
    const landed = i < from; // part of an earlier slice: draw it, no motion

    /* One hue per flow, except where a flow turns: a hop marked bad drops
       the healthy hue for the flow's own, which is how the failure flow
       goes from routine blue to alert red at the step where the system
       actually starts being wrong. Flows without an `ok` hue are
       single-hued as before. */
    const hk = hop.bad || !s.ok ? s.hue : s.ok;
    const ee = edgeEls[hop.e];
    ee.path.classList.add("eactive");
    ee.path.style.stroke = model.hue(hk);
    ee.path.style.setProperty("--glow", model.hue(hk));
    /* A two-way edge starts with no arrowheads in a flow; each hop adds
       its own, so the return arrow only appears with the move that uses
       it (2026-11-01). */
    if (ee.def.bidir && !bidirSeen[hop.e]) {
      bidirSeen[hop.e] = true;
      ee.path.removeAttribute("marker-start");
      ee.path.removeAttribute("marker-end");
    }
    if (hop.rev && ee.def.bidir) ee.path.setAttribute("marker-start", "url(#arr-" + hk + ")");else ee.path.setAttribute("marker-end", "url(#arr-" + hk + ")");
    if (!ee.start) {
      const p0 = ee.path.getPointAtLength(hop.rev ? ee.path.getTotalLength() : 0);
      ee.start = el("circle", { cx: p0.x, cy: p0.y, r: 3.2, class: "fstart" }, storyLayer);
      ee.start.style.setProperty("--story-hue", model.hue(hk));
    }
    if (landed || wide) {/* no camera; a landed hop has no dot either */} else act.focusHop(ee.path);
    if (!landed) {
      ee.path.classList.add("eglow");
      await animateDot(ee.path, !!hop.rev, hk);
      ee.path.classList.remove("eglow");
    }
    if (token !== state.storyToken) return;
    /* An edge one flow uses once carries its label on the step chip. One
       it uses more than once (s3_dr: reference in, report out) keeps its
       label and gets bare numbers placed clear of it (chipSpot). */
    const once = badgeUses[hop.e] === 1;
    let mid = once && ee.mid ? ee.mid : null;
    const bg = el("g", {
      "data-hop": i,
      class: "fchip"
    }, storyLayer);
    bg.style.setProperty("--story-hue", model.hue(hk));
    /* A step chip sits on the line: the hop number in a filled disc, then
       the edge's own label, which leaves its usual spot while the flow
       runs. The latest landed step is filled with the flow's hue. */
    const label = once && ee.label ? ee.def.label : "";
    const pill = el("rect", { class: "fchip-r", height: 20, rx: 10 }, bg);
    const disc = el("circle", { r: 7, class: "badge-c" }, bg);
    const num = el("text", { class: "badge-t" }, bg);
    num.textContent = String(i + 1);
    let w = 20;
    let txt = null;
    if (label) {
      txt = el("text", { class: "fchip-t" }, bg);
      txt.textContent = label;
      w = 26 + txt.getComputedTextLength() + 9;
      /* A label that will not fit on a short edge stays where it was and
         the chip keeps only the number. */
      if (w > (mid ? mid.len - 4 : ee.path.getTotalLength() - 28)) {
        txt.remove();
        txt = null;
        w = 20;
        mid = null;
      } else ee.label.classList.add("inchip");
    }
    if (!mid) mid = txt ? ee.path.getPointAtLength(ee.path.getTotalLength() / 2) : chipSpot(ee, w, bg);
    const x0 = mid.x - w / 2;
    pill.setAttribute("x", x0);
    pill.setAttribute("y", mid.y - 10);
    pill.setAttribute("width", w);
    disc.setAttribute("cx", x0 + 10);
    disc.setAttribute("cy", mid.y);
    num.setAttribute("x", x0 + 10);
    num.setAttribute("y", mid.y + 3.4);
    if (txt) {
      txt.setAttribute("x", x0 + 22);
      txt.setAttribute("y", mid.y + 3.4);
    }
    storyLayer.querySelectorAll("g.fchip.now").forEach(g => g.classList.remove("now"));
    bg.classList.add("now");
    if (!landed) popBadge(bg);
    const endNode = hop.rev ? ee.def.from : ee.def.to;
    const eg = nodeEls[endNode].g;
    eg.style.setProperty("--story-hue", model.hue(hk));
    eg.classList.add("lit");
    if (hop.breaks) nodeEls[hop.breaks].g.classList.add("broken");
    if (hop.silent) markSilent(hop.silent);
    if (list) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="n">${i + 1}</span>${hop.t}` + (hop.note ? `<span class="note">${hop.note}</span>` : "");
      li.querySelector(".n").style.background = model.hue(hk);
      list.appendChild(li);
      act.revealInPanel(li);
    }
    if (!landed) await env.scope.cancellable(r => env.setTimeout(r, env.reduced ? 1400 : 800));
  }
  if (token !== state.storyToken) return;
  if (state.dot) {
    state.dot.remove();
    state.dot = null;
  }
  storyLayer.querySelectorAll("g.fchip.now").forEach(g => g.classList.remove("now"));
  /* The tour holds the camera where the slice ended; its step card says
     what comes next. */
  if (quiet) return;
  if (s.ending) {
    panelBody.insertAdjacentHTML("beforeend", s.ending);
  } else {
    const note = document.createElement("p");
    note.className = "p-note";
    note.textContent = env.t("flowComplete");
    panelBody.appendChild(note);
  }
  /* The panel scrolls inside a fixed-height column now, so the ending lands
     below the fold; bring it up the same way each step does. */
  act.revealInPanel(panelBody.lastElementChild);
}

/* ---------------- controls ---------------- */

/* Choosing a flow previews its description. Only Play starts or restarts it;
   the original build buttons remain an independent exploration path. */

function chooseFlow(key, { preview = false } = {}) {
  if (!flowPicker.querySelector(`[data-flow="${key}"]`)) return;
  state.chosenFlow = key;
  controlsEl.style.setProperty("--flow-hue", model.hue(STORIES[key].hue));
  document.getElementById("flowSelected").textContent = STORIES[key].title;
  flowPicker.querySelectorAll("[data-flow]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.flow === key));
  });
  if (preview) {
    const story = STORIES[key];
    const label = env.t(story.kind === "failure" ? "failureFlowEyebrow" : "flowEyebrow");
    const steps = story.hops.map((hop, index) => `<li><span class="n">${index + 1}</span>${hop.t}${hop.note ? `<span class="note">${hop.note}</span>` : ""}</li>`).join("");
    act.panelHTML(`<div class="p-eyebrow">${label}</div><h2>${story.title}</h2><p class="p-sub">${story.desc}</p><ol class="steps">${steps}</ol>`, story.hue);
    act.openPanel();
  }
}

function closeFlowPicker(restoreFocus = false) {
  flowPicker.open = false;
  if (restoreFocus) flowSummary.focus({
    preventScroll: true
  });
}

function focusFlowOption() {
  const button = flowPicker.querySelector('[aria-pressed="true"]') || flowPicker.querySelector("[data-flow]");
  button?.focus({
    preventScroll: true
  });
}
const flowControls = document.getElementById("flowControls");
const storyOptions = document.getElementById("storyOptions");
const failureOptions = document.getElementById("failureOptions");
const playFlowButton = document.getElementById("playFlow");
env.scope.listen(flowPicker, "toggle", () => {
  if (flowPicker.open) env.requestAnimationFrame(() => {
    if (flowPicker.open) focusFlowOption();
  });
});
env.scope.listen(flowPicker, "keydown", event => {
  if (event.key === "Escape" && flowPicker.open) {
    event.preventDefault();
    closeFlowPicker(true);
    return;
  }
  const buttons = [...flowPicker.querySelectorAll("[data-flow]")];
  if (event.target === flowSummary && ["ArrowDown", "ArrowUp"].includes(event.key)) {
    event.preventDefault();
    flowPicker.open = true;
    return;
  }
  const index = buttons.indexOf(document.activeElement);
  if (index < 0 || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].focus();
});
env.scope.listen(flowPicker, "focusout", event => {
  // Safari can blur a button without focusing the clicked option. A null
  // relatedTarget must not close the menu before that option receives click.
  // Pointer presses outside the picker are handled separately below.
  if (event.relatedTarget && !flowPicker.contains(event.relatedTarget)) closeFlowPicker();
});
env.scope.listen(document, "pointerdown", event => {
  if (flowPicker.open && !flowPicker.contains(event.target)) closeFlowPicker();
});
env.scope.listen(playFlowButton, "click", () => {
  if (state.chosenFlow) {
    closeFlowPicker();
    playStory(state.chosenFlow);
  }
});

Object.keys(STORIES).forEach(key => {
  const story = STORIES[key];
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flow-option";
  button.dataset.flow = key;
  button.style.setProperty("--flow-hue", model.hue(story.hue));
  button.setAttribute("aria-pressed", "false");
  button.title = story.desc;
  const marker = document.createElement("span");
  marker.className = "flow-dot";
  marker.setAttribute("aria-hidden", "true");
  button.append(marker, document.createTextNode(story.title));
  env.scope.listen(button, "click", () => {
    chooseFlow(key, { preview: true });
    closeFlowPicker(true);
  });
  (story.kind === "failure" ? failureOptions : storyOptions).appendChild(button);
});
[storyOptions, failureOptions].forEach(group => {
  group.parentElement.hidden = !group.children.length;
});
const firstFlow = flowPicker.querySelector("[data-flow]");
if (firstFlow) chooseFlow(firstFlow.dataset.flow);else flowControls.hidden = true;

return { clearStory, stopDot, animateDot, markSilent, popBadge, playStory, chooseFlow, closeFlowPicker, focusFlowOption };
}
