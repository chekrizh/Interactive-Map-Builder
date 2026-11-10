/** tour-player: extracted original behavior; dependencies supplied by the instance controller. */
export function createTourplayer(ctx) {
function readTour() {
  try {
    const v = JSON.parse(ctx.store.get(ctx.definition.settings.storage.tour) || "null");
    return v && typeof v === "object" ? v : {};
  } catch (err) {
    return {};
  }
}

function saveTour(value) {
  ctx.store.set(ctx.definition.settings.storage.tour, JSON.stringify(value));
}

/* A tour left mid-way is offered back at its step; a finished one starts over. */
function resumeStep() {
  const s = ctx.readTour().step;
  return Number.isInteger(s) && s >= 2 && s <= ctx.TOUR.length ? s : 0;
}

function refreshTourEntry() {
  const r = ctx.resumeStep(),
    done = Boolean(ctx.readTour().done);
  ctx.tourBtnText.textContent = r ? ctx.t("tourResume", { step: r }) : ctx.t("tourEntry");
  ctx.document.getElementById("tourLabel").textContent = ctx.t(done ? "tourTitle" : "tourNew");
}

function timeLeft(n) {
  const secs = ctx.TOUR.slice(n - 1).reduce((t, b) => t + (b.flow ? ctx.FLOW_BEAT_SECONDS : ctx.BEAT_SECONDS), 0);
  return secs < 60 ? ctx.t("tourLessThanMinute") : ctx.t("tourMinutesLeft", { minutes: Math.round(secs / 60) });
}


function renderTourBar(n) {
  const b = n <= ctx.TOUR.length ? ctx.TOUR[n - 1] : null;
  const cur = b ? b.ch : ctx.TOUR_CHAPTERS.length;
  const pos = b ? ctx.TOUR.slice(0, n).filter(x => x.ch === cur).length : 0;
  [...ctx.tourChapters.children].forEach((li, i) => {
    const fill = li.querySelector(".tb-fill");
    const now = i === cur;
    li.classList.toggle("current", now);
    if (now) li.setAttribute("aria-current", "step");else li.removeAttribute("aria-current");
    fill.style.width = i < cur ? "100%" : now ? pos / ctx.TOUR_CHAPTERS[i].span * 100 + "%" : "0%";
    fill.style.background = now ? ctx.beatHue(b) : "";
  });
  ctx.tourStatus.textContent = b ? ctx.t("tourStatus", { step: n, total: ctx.TOUR_TOTAL, left: ctx.timeLeft(n) }) : ctx.t("tourComplete");
}

function renderTourCard(n) {
  const b = ctx.TOUR[n - 1];
  ctx.tourCard.style.setProperty("--tc-hue", ctx.beatHue(b));
  ctx.tcEyebrow.textContent = ctx.t("tourCardCount", { chapter: ctx.TOUR_CHAPTERS[b.ch].name, step: n, total: ctx.TOUR_TOTAL });
  ctx.tcTitle.textContent = b.title;
  ctx.renderTourText(b);
  ctx.tcScroll.scrollTop = 0;
}



/* The changing part of the card. A flow beat's phase (tour.phase) is 0 on
   arrival (summary only), k (1 to the edge count) once Next has played
   edge k (line k shows, with its own number, under the intro), and the
   edge count + 1 once "Why it matters" shows in the line's place. */
/* Card text is rich text, rendered as HTML like the panels; titles stay plain. */
function renderTourText(b) {
  ctx.tcBody.replaceChildren(...b.body.map(t => {
    const el = ctx.document.createElement("p");
    el.innerHTML = t;
    return el;
  }));
  const p = ctx.tour.phase;
  ctx.tcWhy.hidden = !b.why || Boolean(b.flow) && p <= ctx.edgeCount(b);
  ctx.tcWhyText.innerHTML = b.why || "";
  if (!b.flow) {
    /* The closing step's sweep (2026-11-01): each Next lights a stage and
       recaps it in one line under the stage's own name, icon and colour,
       unnumbered and untinted, so it reads as a summary, not a fifth flow. */
    const g = b.recap && p > 0 && p <= ctx.stageCount(b) ? ctx.SWEEP[p - 1] : null;
    if (!g) {
      ctx.tcList.hidden = true;
      ctx.tcList.replaceChildren();
      return;
    }
    const li = ctx.document.createElement("li");
    li.className = "recap";
    li.style.setProperty("--recap-hue", ctx.hue(ctx.GROUPS[g].huekey));
    const head = ctx.document.createElement("span");
    head.className = "recap-h";
    head.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ctx.ICONS[ctx.GROUPS[g].icon]}</svg>`;
    head.append(ctx.TOUR_CHAPTERS.find(c => c.name.toLowerCase().startsWith(g))?.name || ctx.GROUPS[g].title);
    const text = ctx.document.createElement("span");
    text.className = "recap-t";
    text.innerHTML = b.recap[g];
    li.append(head, text);
    ctx.tcList.replaceChildren(li);
    ctx.tcList.hidden = false;
    return;
  }
  const s = ctx.STORIES[b.flow],
    start = ctx.beatStart(b),
    total = ctx.edgeCount(b);
  const walking = p > 0 && p <= total;
  ctx.syncBadges(b);
  ctx.syncFocus(b);
  if (!walking) {
    ctx.tcList.hidden = true;
    ctx.tcList.replaceChildren();
    return;
  }
  const hop = s.hops[start + p - 1];
  const li = ctx.document.createElement("li");
  li.className = "cur";
  const n = ctx.document.createElement("span");
  n.className = "n";
  n.textContent = String(start + p);
  n.style.setProperty("--n-hue", ctx.hopHue(s, hop));
  li.append(n);
  li.insertAdjacentHTML("beforeend", hop.t);
  ctx.tcList.replaceChildren(li);
  ctx.tcList.hidden = false;
}

function syncBadges(b) {
  const start = ctx.beatStart(b),
    shown = start + Math.min(ctx.tour.phase, ctx.edgeCount(b));
  ctx.storyLayer.querySelectorAll("g[data-hop]").forEach(g => {
    const i = Number(g.dataset.hop);
    g.classList.toggle("tpend", i >= shown || i === ctx.tour.badgeWait);
  });
  /* A two-way edge drawn whole shows both arrowheads; the beat keeps the
     later direction's head hidden until its move is in the card. */
  const s = ctx.STORIES[b.flow],
    first = {};
  s.hops.forEach((h, i) => {
    if (ctx.edgeEls[h.e].def.bidir && first[h.e] === undefined) first[h.e] = i;
  });
  s.hops.slice(0, ctx.flowEnd(b)).forEach((h, i) => {
    const ee = ctx.edgeEls[h.e];
    if (!ee.def.bidir || i === first[h.e] || Boolean(h.rev) === Boolean(s.hops[first[h.e]].rev)) return;
    const attr = h.rev ? "marker-start" : "marker-end";
    if (i < shown) ee.path.setAttribute(attr, "url(#arr-" + (h.bad || !s.ok ? s.hue : s.ok) + ")");else ee.path.removeAttribute(attr);
  });
}


function syncFocus(b) {
  const s = ctx.STORIES[b.flow],
    end = ctx.flowEnd(b);
  const onPath = new Set(),
    pathNodes = new Set();
  s.hops.slice(0, end).forEach(h => {
    const d = ctx.edgeEls[h.e].def;
    onPath.add(d.id);
    pathNodes.add(d.from);
    pathNodes.add(d.to);
  });
  ctx.svg.classList.add("tfocus");
  ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.toggle("dimmed", !pathNodes.has(n.id)));
  ctx.EDGES.forEach(e => {
    [ctx.edgeEls[e.id].path, ctx.edgeEls[e.id].label].forEach(x => {
      if (x) x.classList.toggle("dimmed", !onPath.has(e.id));
    });
  });
}

// Keep the current line (or "Why it matters") in view when the card scrolls.
function revealLatest() {
  const b = ctx.TOUR[ctx.tour.step - 1];
  if (!b || !b.flow) return;
  const t = ctx.tour.phase > ctx.edgeCount(b) ? ctx.tcWhy : ctx.tour.phase > 0 ? ctx.tcList.firstElementChild : null;
  if (!t || t.closest("[hidden]")) return;
  const sr = ctx.tcScroll.getBoundingClientRect(),
    r = t.getBoundingClientRect();
  const dy = r.top < sr.top ? r.top - sr.top : r.bottom > sr.bottom ? Math.min(r.bottom - sr.bottom, r.top - sr.top) : 0;
  if (dy) ctx.tcScroll.scrollTo({
    top: ctx.tcScroll.scrollTop + dy,
    behavior: ctx.reduced ? "auto" : "smooth"
  });
}

/* The controls row: Back and Next (2026-11-01). On a beat with something
   to walk through (the flows, and 9 unless motion is reduced), the
   instruction line and a soft ring on Next show until the visitor's
   first Next within a beat. */

function renderPlayer() {
  const b = ctx.TOUR[ctx.tour.step - 1];
  const hint = Boolean(b) && ctx.beatHasMotion(b) && !ctx.tourStepped;
  ctx.tcHint.hidden = !hint;
  ctx.tcNext.classList.toggle("hint", hint);
  const backHadFocus = ctx.document.activeElement === ctx.tcBack;
  ctx.tcBack.disabled = ctx.tour.step === 1;
  // Step 1 has nothing behind it: Back is hidden, and Next starts the walk (2026-11-01).
  ctx.tcBack.hidden = ctx.tour.step === 1;
  if (backHadFocus && ctx.tcBack.disabled) ctx.tcNext.focus({
    preventScroll: true
  });
  const last = Boolean(b) && ctx.tour.step >= ctx.TOUR.length && !(b.flow && ctx.tour.phase <= ctx.edgeCount(b)) && ctx.tour.phase >= ctx.stageCount(b);
  ctx.tcNext.textContent = ctx.t(ctx.tour.step === 1 ? "tourBegin" : last ? "tourFinish" : "tourNext");
  // One segment per Next in this step (and one for "Why it matters"), filled as the visitor goes.
  const total = !b ? 0 : b.flow ? ctx.edgeCount(b) + 1 : ctx.stageCount(b);
  const done = Math.min(ctx.tour.phase, total);
  ctx.tcCount.replaceChildren(...Array.from({
    length: total
  }, (_, i) => {
    const seg = ctx.document.createElement("span");
    seg.className = "tc-seg" + (i < done ? " on" : "");
    return seg;
  }));
  if (total) {
    ctx.tcCount.setAttribute("role", "progressbar");
    ctx.tcCount.setAttribute("aria-label", ctx.t("tourProgress"));
    ctx.tcCount.setAttribute("aria-valuemin", "0");
    ctx.tcCount.setAttribute("aria-valuemax", String(total));
    ctx.tcCount.setAttribute("aria-valuenow", String(done));
  } else {
    ["role", "aria-label", "aria-valuemin", "aria-valuemax", "aria-valuenow"].forEach(a => ctx.tcCount.removeAttribute(a));
  }
}

/* One card height per beat: the height its tallest phase needs, measured
   once when the beat opens (and on resize), so the controls keep their
   place when "Why it matters" appears. Each phase is the intro plus one
   line, so the card fits closely. The CSS max-height caps it; past that,
   .tc-scroll scrolls. */
function sizeTourCard() {
  const b = ctx.TOUR[ctx.tour.step - 1];
  if (!b || ctx.tourCard.hidden) return;
  const keep = ctx.tour.phase,
    phases = b.flow ? ctx.edgeCount(b) + 2 : 1 + ctx.stageCount(b);
  ctx.tourCard.style.height = "";
  // The card is pinned top and bottom to centre it; measure it unstretched.
  ctx.tourCard.style.bottom = "auto";
  let need = 0;
  for (let p = 0; p < phases; p++) {
    ctx.tour.phase = p;
    ctx.renderTourText(b);
    need = Math.max(need, ctx.tourCard.offsetHeight - ctx.tcScroll.clientHeight + ctx.tcScroll.scrollHeight);
  }
  ctx.tour.phase = keep;
  ctx.renderTourText(b);
  ctx.tourCard.style.bottom = "";
  ctx.tourCard.style.height = Math.ceil(need) + "px";
}

/* Run fn (which changes the card's text) with a slide (2026-11-01): the
   old line (or "Why it matters") slides out and fades over 140 ms, then
   the new one slides in from the side the visitor is heading to (right on
   Next, left on Back) over 280 ms. fn reads the tour's state when it runs,
   so a fast click simply supersedes the swap in flight. On phones or with
   reduced motion, fn just runs. */

function cardChange(fn, dir = 1) {
  const token = ++ctx.cardSwap;
  if (ctx.cardOut) {
    ctx.cardOut.cancel();
    ctx.cardOut = null;
  }
  if (ctx.reduced || ctx.phoneQuery.matches || ctx.tourCard.hidden) {
    fn();
    return;
  }
  const easing = getComputedStyle(ctx.tourCard).getPropertyValue("--tour-ease").trim() || "ease-out";
  const shown = () => !ctx.tcList.hidden && ctx.tcList.firstElementChild || (!ctx.tcWhy.hidden ? ctx.tcWhy : null);
  const enter = () => {
    if (token !== ctx.cardSwap) return;
    if (ctx.cardOut) {
      ctx.cardOut.cancel();
      ctx.cardOut = null;
    }
    fn();
    const t = shown();
    if (t) ctx.scope.animate(t, [{
      opacity: 0,
      transform: `translateX(${dir * 24}px)`
    }, {
      opacity: 1,
      transform: "none"
    }], {
      duration: 280,
      easing
    });
  };
  const old = shown();
  if (!old) {
    enter();
    return;
  }
  ctx.cardOut = ctx.scope.animate(old, [{
    opacity: 1,
    transform: "none"
  }, {
    opacity: 0,
    transform: `translateX(${-dir * 16}px)`
  }], {
    duration: 140,
    easing: "ease-in",
    fill: "forwards"
  });
  ctx.cardOut.finished.then(enter, () => {});
}

/* ---- tour camera (2026-10-31, camera shots 2026-11-01) ----
   Every beat opens on the wide view: the whole drawing left of the step
   card (below the tour bar; above the sheet on phones). A flow beat then
   eases to the overview, a frame of the beat's whole path (its own edges,
   labels and their components, not hops carried over from an earlier
   beat). Its edges, in order, are split into shots (beatShots): runs of
   consecutive edges that fit the visible area together at the close-up
   zoom ZC, the zoom that frames the step's largest single edge (at most
   PATH_ZOOM_MAX, never below the wide fit), or up to SHOT_SLACK wider; an
   edge the shot before already shows whole joins it. A Next into an edge of the
   current shot only moves the dot; a Next into the first edge of another
   shot eases the camera there first, then plays the dot. "Why it matters"
   and Back to the start ease to the overview; Back onto an edge eases to
   that edge's shot. tour.shot is the shot the camera is on (-1 the
   overview, -2 neither). Every frame fills the visible area left of the
   card with a margin of 10% of that area (at least 48px) on each side,
   then slides or widens a little where needed (camSolve, 2026-11-02) so
   no lit node is half shown or sits under the card, its key hint or the
   zoom control. The camera is driven here by zoom and the viewBox point at the centre
   of the visible area, frame by frame, never through the .campan CSS
   glide, so a fast Next can never measure a map mid-glide. camToken
   cancels a move; a hand zoom or pan (camManual) stops the camera for the
   rest of the beat. Reduced motion: no moves, flow beats stay wide. Zoom
   stays at most PATH_ZOOM_MAX: every drawn size is (viewBox size) x base
   x zoom, where base is the svg's scale at zoom 1, so a node title renders
   at zoom times its size at zoom 1, and capping zoom at 1.6 caps titles
   at 1.6 times that size. */

function showStage(p) {
  ctx.clearStory();
  if (!p) {
    ctx.setFocus(null);
    return;
  }
  const g = ctx.SWEEP[p - 1];
  ctx.setFocus(g);
  ctx.GROUPS[g].members.forEach(id => {
    const ng = ctx.nodeEls[id].g;
    ng.style.setProperty("--story-hue", ctx.hue(ctx.GROUPS[g].huekey));
    ng.classList.add("lit");
  });
}

/* ---- flow beats, edge by edge (2026-10-31, click-through 2026-11-01) ----
   The beat's path is drawn once, landed, through playStory; walking it
   never redraws it. Each Next marks the next edge current (markEdge),
   shows its badge (syncBadges) and the dot travels it with the camera
   alongside. storyToken stops a moving dot, so Back, Next and Exit can
   interrupt at any point. */


/* ---- flow beats, edge by edge (2026-10-31, click-through 2026-11-01) ----
   The beat's path is drawn once, landed, through playStory; walking it
   never redraws it. Each Next marks the next edge current (markEdge),
   shows its badge (syncBadges) and the dot travels it with the camera
   alongside. storyToken stops a moving dot, so Back, Next and Exit can
   interrupt at any point. */

function drawBeatPath(b) {
  ctx.playStory(b.flow, {
    quiet: true,
    wide: true,
    from: ctx.flowEnd(b),
    to: ctx.flowEnd(b)
  });
  ctx.syncBadges(b);
  ctx.syncFocus(b);
}
// The current edge on the map (k within the beat, or null for none).
function markEdge(b, k) {
  ctx.storyLayer.querySelectorAll("g.tcur").forEach(g => g.classList.remove("tcur"));
  ctx.EDGES.forEach(e => ctx.edgeEls[e.id].path.classList.remove("tcur", "eglow"));
  if (k == null) return;
  const i = ctx.beatStart(b) + k;
  ctx.edgeEls[ctx.STORIES[b.flow].hops[i].e].path.classList.add("tcur");
  ctx.storyLayer.querySelector(`g[data-hop="${i}"]`)?.classList.add("tcur");
}
// Stops a moving dot, leaving the lit path as it is.
function stopEdgeMotion() {
  ctx.storyToken++;
  ctx.tour.badgeWait = -1;
  if (ctx.dot) {
    ctx.dot.remove();
    ctx.dot = null;
  }
}
/* Edge k becomes current on the map; then its dot travels it with the
   camera alongside (animate), or the camera holds on it at once.
   Resolves true when the edge landed untouched. */
async function playEdge(b, k, animate) {
  const s = ctx.STORIES[b.flow],
    i = ctx.beatStart(b) + k,
    hop = s.hops[i],
    ee = ctx.edgeEls[hop.e];
  ctx.stopEdgeMotion();
  ctx.markEdge(b, k);
  if (!animate || ctx.reduced) {
    ee.path.classList.add("eglow");
    ctx.tourCamShot(b, k, true);
    return true;
  }
  const token = ctx.storyToken;
  // The number lands with the dot, not before it (2026-11-01).
  ctx.tour.badgeWait = i;
  ctx.syncBadges(b);
  await ctx.tourCamShot(b, k, true);
  if (token !== ctx.storyToken) return false;
  ee.path.classList.add("eglow");
  await ctx.animateDot(ee.path, !!hop.rev, hop.bad || !s.ok ? s.hue : s.ok);
  if (token !== ctx.storyToken) return false;
  ctx.tour.badgeWait = -1;
  ctx.syncBadges(b);
  ctx.popBadge(ctx.storyLayer.querySelector(`g[data-hop="${i}"]`));
  return true;
}
/* One Next: the next edge's line takes the card's line, its badge
   appears, and the edge plays. Then the tour waits; the last edge
   does not end the beat on its own. */
function stepEdge(b) {
  ctx.tour.phase++;
  ctx.cardChange(() => {
    ctx.renderTourText(b);
    ctx.revealLatest();
  });
  return ctx.playEdge(b, ctx.tour.phase - 1, true);
}
/* The Next after the last edge: no edge current, "Why it matters" in
   the line's place, the camera back to the overview of the lit path. */
function finishBeat(b) {
  ctx.stopEdgeMotion();
  ctx.markEdge(b, null);
  ctx.tour.phase = ctx.edgeCount(b) + 1;
  ctx.cardChange(() => {
    ctx.renderTourText(b);
    ctx.revealLatest();
  });
  ctx.tourCamShot(b, null, true);
}

// opts.atSummary: entered by Back from the next beat, so a flow beat opens at its end.
function showBeat(n, opts) {
  const b = ctx.TOUR[n - 1];
  const atSummary = Boolean(opts && opts.atSummary && b.flow);
  ctx.stopEdgeMotion();
  // A line swap still in flight belongs to the step being left.
  ctx.cardSwap++;
  if (ctx.cardOut) {
    ctx.cardOut.cancel();
    ctx.cardOut = null;
  }
  ctx.tour.step = n;
  ctx.tour.atEnd = false;
  ctx.tour.phase = atSummary ? ctx.edgeCount(b) + 1 : 0;
  ctx.saveTour({
    step: n,
    done: Boolean(ctx.readTour().done)
  });
  ctx.clearStory();
  ctx.tourEnd.hidden = true;
  ctx.tourCard.hidden = false;
  ctx.renderTourBar(n);
  ctx.renderTourCard(n);
  ctx.renderPlayer();
  ctx.sizeTourCard();
  ctx.unselect();
  if (b.level === 0) {
    if (ctx.level !== 0) ctx.showLevel(0);
  } else {
    if (ctx.level !== 1) ctx.showLevel(1);
    ctx.setFocus(null);
    ctx.setWeek(b.week || 0, {
      silent: true,
      quiet: true
    });
  }
  ctx.updateDrawerBounds();
  ctx.tourCam.manual = false;
  ctx.tourFit();
  // Every beat opens still; a flow beat's path is already lit, without this beat's numbers.
  if (b.flow) ctx.drawBeatPath(b);
  ctx.tourCamShot(b, null, true);
}

/* opts.native (a click started it): ask for the browser's real full
   screen on the stagecard, which holds every piece of the tour UI. The
   in-frame fs-fixed stays on underneath, so when the request fails, or
   Esc later leaves native full screen, the tour simply carries on in-frame
   on the same beat. Deep links (?tour=1) have no gesture and stay in-frame. */
function startTour(n, opts) {
  if (ctx.tour.active) return;
  const wantNative = Boolean(opts && opts.native) && Boolean(ctx.stagecard.requestFullscreen);
  const wasNative = ctx.document.fullscreenElement === ctx.stagecard;
  if (ctx.exploreNudge) ctx.exploreNudge.hide();
  ctx.closeFlowPicker();
  ctx.closeInside();
  /* From Explore's own full screen, step out of it first (native full
     screen would keep Esc for itself); leaving the tour mid-way puts the
     in-frame full screen back. */
  const wasFs = ctx.fsMode;
  // Already in native full screen from Explore: keep it, swap the chrome only.
  if (wasFs && wasNative && wantNative) ctx.applyFsDom(false);else if (wasFs) ctx.exitFs();
  ctx.tour.snap = {
    level: ctx.level,
    focused: ctx.focused,
    selected: ctx.selected,
    week: ctx.week,
    panelOpen: ctx.panelIsOpen(),
    wasFs
  };
  ctx.tour.active = true;
  ctx.clearStory();
  ctx.stagecard.classList.add("touring", "fs-fixed");
  ctx.applyFsDom(true);
  ctx.showBeat(Math.min(Math.max(1, n), ctx.TOUR.length));
  ctx.tcNext.focus({
    preventScroll: true
  });
  if (wantNative && !wasNative) ctx.stagecard.requestFullscreen().catch(() => {});
}


function tourNext() {
  if (!ctx.tour.active || ctx.tour.atEnd) return;
  const b = ctx.TOUR[ctx.tour.step - 1];
  if (b.flow && ctx.tour.phase <= ctx.edgeCount(b)) {
    ctx.tourStepped = true;
    if (ctx.tour.phase < ctx.edgeCount(b)) ctx.stepEdge(b);else ctx.finishBeat(b);
    ctx.renderPlayer();
    return;
  }
  if (ctx.tour.phase < ctx.stageCount(b)) {
    ctx.tourStepped = true;
    ctx.tour.phase++;
    ctx.showStage(ctx.tour.phase);
    ctx.cardChange(() => ctx.renderTourText(b));
    ctx.renderPlayer();
    return;
  }
  if (ctx.tour.step >= ctx.TOUR.length) ctx.showEnding();else ctx.showBeat(ctx.tour.step + 1);
}

function tourBack() {
  if (!ctx.tour.active || ctx.tour.atEnd) return;
  const b = ctx.TOUR[ctx.tour.step - 1];
  if (b.flow && ctx.tour.phase > 0) {
    ctx.stopEdgeMotion();
    ctx.tour.phase--;
    ctx.cardChange(() => {
      ctx.renderTourText(b);
      ctx.revealLatest();
    }, -1);
    ctx.renderPlayer();
    if (ctx.tour.phase === 0) {
      ctx.markEdge(b, null);
      ctx.tourCamShot(b, null, true);
    } else ctx.playEdge(b, ctx.tour.phase - 1, false);
    return;
  }
  if (!b.flow && ctx.tour.phase > 0) {
    ctx.tour.phase--;
    ctx.showStage(ctx.tour.phase);
    ctx.cardChange(() => ctx.renderTourText(b), -1);
    ctx.renderPlayer();
    return;
  }
  if (ctx.tour.step <= 1) return;
  ctx.showBeat(ctx.tour.step - 1, {
    atSummary: true
  });
}

/* The hand-off to the ending (2026-11-01): the step card fades out,
   the scrim blurs in over the map as it is, and only once the map is
   hidden behind it is it reset to the plain full map. Nothing jumps. */
function showEnding() {
  ctx.tour.atEnd = true;
  ctx.saveTour({
    step: ctx.TOUR_TOTAL,
    done: true
  });
  ctx.renderTourBar(ctx.TOUR_TOTAL);
  const resetMap = () => {
    if (!ctx.tour.atEnd) return;
    ctx.clearStory();
    if (ctx.level !== 1) ctx.showLevel(1);
    ctx.setFocus(null);
    ctx.setWeek(0, {
      silent: true,
      quiet: true
    });
    ctx.updateDrawerBounds();
    ctx.tourFit();
  };
  if (ctx.reduced) {
    ctx.tourCard.hidden = true;
    resetMap();
  } else {
    ctx.scope.animate(ctx.tourCard, [{
      opacity: 1
    }, {
      opacity: 0,
      transform: "translateY(8px)"
    }], {
      duration: 220,
      easing: "ease-in"
    }).finished.then(() => {
      if (ctx.tour.atEnd) ctx.tourCard.hidden = true;
    }, () => {});
    ctx.setTimeout(resetMap, 650);
  }
  ctx.tourEnd.hidden = false;
  ctx.tourEnd.scrollTop = 0;
  ctx.teTitle.focus({
    preventScroll: true
  });
}

/* Leaving mid-way restores Explore as it was before the tour and keeps the
   step for "Resume". Leaving from the ending ("Back to the map", Esc or
   Exit) lands on the full map instead. */
function exitTour(toFullMap) {
  if (!ctx.tour.active) return;
  const atEnd = ctx.tour.atEnd;
  ctx.clearStory();
  ctx.tourCam.token++;
  if (ctx.document.fullscreenElement) ctx.document.exitFullscreen().catch(() => {});
  ctx.tour.active = false;
  ctx.tour.atEnd = false;
  ctx.tourCard.hidden = true;
  ctx.tourEnd.hidden = true;
  ctx.stagecard.classList.remove("touring");
  ctx.applyFsDom(false);
  const snap = ctx.tour.snap || {};
  ctx.tour.snap = null;
  ctx.unselect();
  if (toFullMap || atEnd) {
    ctx.showLevel(1);
    ctx.setFocus(null);
    ctx.setWeek(0, {
      silent: true,
      quiet: true
    });
    ctx.renderOverview();
    ctx.openPanel();
  } else if (snap.level !== 1) {
    ctx.showLevel(0);
    ctx.renderL0();
    if (snap.panelOpen) ctx.openPanel();else ctx.closePanel();
  } else {
    ctx.showLevel(1);
    ctx.setWeek(snap.week || 0, {
      silent: true,
      quiet: true
    });
    ctx.setFocus(snap.focused || null);
    if (snap.selected && ctx.nodeEls[snap.selected]) {
      ctx.restoreSelection(snap.selected);
      ctx.renderNode(ctx.selected);
    } else if (snap.focused) ctx.renderGroup(snap.focused);else if (snap.week > 0) ctx.renderWeek(snap.week);else ctx.renderOverview();
    if (snap.panelOpen) ctx.openPanel();else ctx.closePanel();
  }
  if (snap.wasFs && !toFullMap && !atEnd) {
    ctx.stagecard.classList.add("fs-fixed");
    ctx.applyFsDom(true);
  }
  ctx.refreshTourEntry();
  ctx.tourBtn.focus({
    preventScroll: true
  });
}

function onTourKey(ev) {
  if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey) return;
  if (ev.key === "Escape") {
    ev.preventDefault();
    /* The first Esc only leaves the browser's full screen and the tour
       carries on in-frame; some browsers also hand that same Esc to the
       page, just after the exit, so a very recent exit counts too. */
    if (ctx.document.fullscreenElement) {
      ctx.document.exitFullscreen().catch(() => {});
      return;
    }
    if (performance.now() - ctx.tour.nativeLeftAt < 600) return;
    ctx.exitTour(ctx.tour.atEnd);
    return;
  }
  const typing = ev.target instanceof Element && ev.target.closest("input, textarea, select, [contenteditable]");
  if (typing || ctx.tour.atEnd) return;
  if (ev.key === "ArrowRight") {
    ev.preventDefault();
    ctx.tourNext();
  } else if (ev.key === "ArrowLeft") {
    ev.preventDefault();
    ctx.tourBack();
  }
}
return { readTour, saveTour, resumeStep, refreshTourEntry, timeLeft, renderTourBar, renderTourCard, renderTourText, syncBadges, syncFocus, revealLatest, renderPlayer, sizeTourCard, cardChange, showStage, drawBeatPath, markEdge, stopEdgeMotion, playEdge, stepEdge, finishBeat, showBeat, startTour, tourNext, tourBack, showEnding, exitTour, onTourKey };
}
