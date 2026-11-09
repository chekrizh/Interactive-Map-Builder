/** flow-player: extracted original behavior; dependencies supplied by the instance controller. */
export function createFlowplayer(ctx) {
/* ---------------- stories + weeks ---------------- */

/* storyToken cancels in-flight playback: every await inside playStory
   re-checks it, so starting anything new safely abandons the old flow. */
function clearStory() {
  ctx.storyToken++;
  ctx.storyLayer.innerHTML = "";
  ctx.svg.classList.remove("tfocus"); // the tour's focus pass (syncFocus)
  if (ctx.dot) {
    ctx.dot.remove();
    ctx.dot = null;
  }
  ctx.EDGES.forEach(e => {
    const ee = ctx.edgeEls[e.id];
    ee.path.classList.remove("eactive", "tcur", "eglow");
    ee.path.style.stroke = "";
    ee.path.setAttribute("marker-end", "url(#arr-base)");
    if (e.bidir) ee.path.setAttribute("marker-start", "url(#arr-base)");
  });
  ctx.NODES.forEach(n => {
    const g = ctx.nodeEls[n.id].g;
    g.classList.remove("lit", "broken");
    /* Playback sets this per node so one flow can carry two hues; the
       svg-level value stays as the default underneath it. */
    g.style.removeProperty("--story-hue");
  });
  // Keep the next flow choice when playback is cleared by navigation.
}

function animateDot(pathEl, rev, hueKey) {
  return ctx.scope.cancellable(resolve => {
    const token = ctx.storyToken;
    const L = pathEl.getTotalLength();
    if (ctx.reduced) {
      ctx.setTimeout(resolve, 350);
      return;
    }
    if (!ctx.dot) ctx.dot = ctx.el("circle", {
      r: 5.5
    }, ctx.svg);
    ctx.dot.setAttribute("fill", ctx.hue(hueKey));
    const dur = Math.min(3200, Math.max(1200, L * 5.2));
    const t0 = performance.now();
    function step(t) {
      if (token !== ctx.storyToken) {
        resolve();
        return;
      }
      const k = Math.min(1, (t - t0) / dur);
      const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const at = rev ? L * (1 - ease) : L * ease;
      const pt = pathEl.getPointAtLength(at);
      ctx.dot.setAttribute("cx", pt.x);
      ctx.dot.setAttribute("cy", pt.y);
      if (k < 1) ctx.requestAnimationFrame(step);else resolve();
    }
    ctx.requestAnimationFrame(step);
  });
}


function markSilent(sil) {
  const path = ctx.edgeEls[sil.e].path;
  const mid = path.getPointAtLength(path.getTotalLength() * 0.5);
  const g = ctx.el("g", {}, ctx.storyLayer);
  ctx.el("circle", {
    cx: mid.x,
    cy: mid.y,
    r: 9,
    class: "silent-c"
  }, g);
  ctx.el("path", {
    class: "silent-x",
    d: `M${mid.x - 3.6},${mid.y - 3.6} L${mid.x + 3.6},${mid.y + 3.6}` + ` M${mid.x + 3.6},${mid.y - 3.6} L${mid.x - 3.6},${mid.y + 3.6}`
  }, g);
  ctx.el("text", {
    x: mid.x,
    y: mid.y + 24,
    class: "silent-t"
  }, g).textContent = sil.t;
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
/* A flow's number appears once its dot has landed, with a short pop
   (scale and fade), in Explore's flows and the tour alike (2026-11-01). */

/* opts.quiet is the guided tour's mode: the same animation on the map, but
   no narration panel, no drawer, no change to the Explore flow choice and
   no flow tracking (the tour sends its own step events).
   opts.from / opts.to play one slice of a flow (hops from..to-1, numbered
   as in the full flow); the hops before the slice are drawn already
   landed, lit and badged, with no motion, so a flow split over two tour
   beats continues instead of restarting. opts.wide keeps the tour camera
   still (the tour draws a beat's whole path in the wide view). Each badge
   carries its hop index (data-hop) so the tour can mark the current edge. */
/* A flow's number appears once its dot has landed, with a short pop
   (scale and fade), in Explore's flows and the tour alike (2026-11-01). */
function popBadge(g) {
  if (!g || ctx.reduced) return;
  g.classList.remove("badge-pop");
  void g.getBBox();
  g.classList.add("badge-pop");
}

async function playStory(key, opts) {
  const quiet = Boolean(opts && opts.quiet);
  const wide = Boolean(opts && opts.wide);
  const from = opts && opts.from || 0;
  if (!quiet) ctx.T()?.step("flow", key);
  if (ctx.level !== 1) ctx.showLevel(1);
  ctx.closeInside();
  ctx.clearStory();
  ctx.setFocus(null);
  const token = ctx.storyToken;
  if (ctx.week !== 0) ctx.setWeek(0, {
    silent: true
  });
  ctx.selected = null;
  ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.remove("sel"));
  const s = ctx.STORIES[key];
  ctx.svg.style.setProperty("--story-hue", ctx.hue(s.hue));
  let list = null;
  if (!quiet) {
    ctx.chooseFlow(key);
    ctx.panelHTML(`
        <div class="p-eyebrow">${s.kind === "failure" ? "Failure flow" : "Flow"}</div>
        <h2>${s.title}</h2>
        <p class="p-sub">${s.desc}</p>
        <ol class="steps" id="stepList"></ol>
      `, s.hue);
    ctx.openPanel();
    list = ctx.document.getElementById("stepList");
  }
  const badgeUses = {},
    badgeSeen = {},
    bidirSeen = {};
  s.hops.forEach(h => {
    badgeUses[h.e] = (badgeUses[h.e] || 0) + 1;
  });
  const end = Math.min(s.hops.length, opts && opts.to || s.hops.length);
  for (let i = 0; i < end; i++) {
    if (token !== ctx.storyToken) return;
    const hop = s.hops[i];
    const landed = i < from; // part of an earlier slice: draw it, no motion

    if (ctx.PINNED) {
      const d = ctx.edgeEls[hop.e].def;
      if (ctx.nodeEls[d.from].def.week > ctx.PINNED || ctx.nodeEls[d.to].def.week > ctx.PINNED) break;
    }
    /* One hue per flow, except where a flow turns: a hop marked bad drops
       the healthy hue for the flow's own, which is how the failure flow
       goes from routine blue to alert red at the step where the system
       actually starts being wrong. Flows without an `ok` hue are
       single-hued as before. */
    const hk = hop.bad || !s.ok ? s.hue : s.ok;
    const ee = ctx.edgeEls[hop.e];
    ee.path.classList.add("eactive");
    ee.path.style.stroke = ctx.hue(hk);
    ee.path.style.setProperty("--glow", ctx.hue(hk));
    /* A two-way edge starts with no arrowheads in a flow; each hop adds
       its own, so the return arrow only appears with the move that uses
       it (2026-11-01). */
    if (ee.def.bidir && !bidirSeen[hop.e]) {
      bidirSeen[hop.e] = true;
      ee.path.removeAttribute("marker-start");
      ee.path.removeAttribute("marker-end");
    }
    if (hop.rev && ee.def.bidir) ee.path.setAttribute("marker-start", "url(#arr-" + hk + ")");else ee.path.setAttribute("marker-end", "url(#arr-" + hk + ")");
    if (landed || wide) {/* no camera; a landed hop has no dot either */} else ctx.focusHop(ee.path);
    if (!landed) {
      ee.path.classList.add("eglow");
      await ctx.animateDot(ee.path, !!hop.rev, hk);
      ee.path.classList.remove("eglow");
    }
    if (token !== ctx.storyToken) return;
    const L = ee.path.getTotalLength();
    /* A bidirectional edge can carry two hops of one story (s3_dr:
       reference in, report out). Spread their badges along the path so a
       later number does not land exactly on top of an earlier one. */
    const k = badgeSeen[hop.e] = (badgeSeen[hop.e] || 0) + 1;
    const mid = ee.path.getPointAtLength(L * 0.5 + (k - (badgeUses[hop.e] + 1) / 2) * 26);
    const bg = ctx.el("g", {
      "data-hop": i
    }, ctx.storyLayer);
    bg.style.setProperty("--story-hue", ctx.hue(hk));
    if (!landed) ctx.popBadge(bg);
    ctx.el("circle", {
      cx: mid.x,
      cy: mid.y,
      r: 9,
      class: "badge-c"
    }, bg);
    ctx.el("text", {
      x: mid.x,
      y: mid.y + 3.5,
      class: "badge-t"
    }, bg).textContent = String(i + 1);
    const endNode = hop.rev ? ee.def.from : ee.def.to;
    const eg = ctx.nodeEls[endNode].g;
    eg.style.setProperty("--story-hue", ctx.hue(hk));
    eg.classList.add("lit");
    if (hop.breaks) ctx.nodeEls[hop.breaks].g.classList.add("broken");
    if (hop.silent) ctx.markSilent(hop.silent);
    if (list) {
      const li = ctx.document.createElement("li");
      li.innerHTML = `<span class="n">${i + 1}</span>${hop.t}` + (hop.note ? `<span class="note">${hop.note}</span>` : "");
      li.querySelector(".n").style.background = ctx.hue(hk);
      list.appendChild(li);
      ctx.revealInPanel(li);
    }
    if (!landed) await ctx.scope.cancellable(r => ctx.setTimeout(r, ctx.reduced ? 1400 : 800));
  }
  if (token !== ctx.storyToken) return;
  if (ctx.dot) {
    ctx.dot.remove();
    ctx.dot = null;
  }
  /* The tour holds the camera where the slice ended; its step card says
     what comes next. */
  if (quiet) return;
  if (s.ending) {
    ctx.panelBody.insertAdjacentHTML("beforeend", s.ending);
  } else {
    const note = ctx.document.createElement("p");
    note.className = "p-note";
    note.textContent = ctx.definition.ui.flowComplete;
    ctx.panelBody.appendChild(note);
  }
  ctx.T()?.done("flow", key);
  ctx.T()?.milestone(s.completionMilestone || "flow_complete");
  if (s.markSeenOnComplete) ctx.T()?.seen();
  /* The panel scrolls inside a fixed-height column now, so the ending lands
     below the fold; bring it up the same way each step does. */
  ctx.revealInPanel(ctx.panelBody.lastElementChild);
}

/* ---------------- controls ---------------- */

/* Choosing a flow previews its description. Only Play starts or restarts it;
   the original build buttons remain an independent exploration path. */

function chooseFlow(key, { preview = false } = {}) {
  if (!ctx.flowPicker.querySelector(`[data-flow="${key}"]`)) return;
  ctx.chosenFlow = key;
  ctx.controlsEl.style.setProperty("--flow-hue", ctx.hue(ctx.STORIES[key].hue));
  ctx.document.getElementById("flowSelected").textContent = ctx.STORIES[key].title;
  ctx.flowPicker.querySelectorAll("[data-flow]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.flow === key));
  });
  if (preview) {
    const story = ctx.STORIES[key];
    const label = story.kind === "failure" ? "Failure flow" : "Flow";
    const steps = story.hops.map((hop, index) => `<li><span class="n">${index + 1}</span>${hop.t}${hop.note ? `<span class="note">${hop.note}</span>` : ""}</li>`).join("");
    ctx.panelHTML(`<div class="p-eyebrow">${label}</div><h2>${story.title}</h2><p class="p-sub">${story.desc}</p><ol class="steps">${steps}</ol>`, story.hue);
    ctx.openPanel();
  }
}

function closeFlowPicker(restoreFocus = false) {
  ctx.flowPicker.open = false;
  if (restoreFocus) ctx.flowSummary.focus({
    preventScroll: true
  });
}

function focusFlowOption() {
  const button = ctx.flowPicker.querySelector('[aria-pressed="true"]') || ctx.flowPicker.querySelector("[data-flow]");
  button?.focus({
    preventScroll: true
  });
}
return { clearStory, animateDot, markSilent, popBadge, playStory, chooseFlow, closeFlowPicker, focusFlowOption };
}
