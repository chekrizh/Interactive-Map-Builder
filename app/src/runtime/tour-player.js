/** The guided tour: its entry button, the tour bar and step card, the beats (flow beats edge by
 *  edge, the closing sweep, the ending), the keys while touring, and what happens when the browser
 *  leaves full screen mid-tour. The only writer of tour, tourStepped, cardSwap and cardOut. */
import controls from '../rendering/ml-controls.js';

/* The neighbours' functions the tour calls (through act). */
export const NEEDS = ["showLevel", "setFocus", "setWeek", "unselect", "restoreSelection", "updateDrawerBounds", "applyFsDom", "exitFs", "onEscape",
  "closeInside", "panelIsOpen", "openPanel", "closePanel", "renderL0", "renderOverview", "renderGroup", "renderNode", "renderWeek",
  "clearStory", "stopDot", "playStory", "animateDot", "popBadge", "closeFlowPicker", "tourCamShot", "tourCamFree", "tourCamStop", "tourFit"];

export function createTourplayer({ env, model, scene, state, act }) {
const { document } = env;
const stagecard = document.querySelector(".stagecard");
const tourBtn = document.getElementById("tourBtn");
const tourBtnText = document.getElementById("tourBtnText");
const tourStatus = document.getElementById("tourStatus");
const tourChapters = document.getElementById("tourChapters");
const tourExitBtn = document.getElementById("tourExit");
const tourCard = document.getElementById("tourCard");
const tourEnd = document.getElementById("tourEnd");
const tcEyebrow = document.getElementById("tcEyebrow");
const tcTitle = document.getElementById("tcTitle");
const tcScroll = document.getElementById("tcScroll");
const tcBody = document.getElementById("tcBody");
const tcWhy = document.getElementById("tcWhy");
const tcWhyText = document.getElementById("tcWhyText");
const tcList = document.getElementById("tcList");
const tcHint = document.getElementById("tcHint");
const tcCount = document.getElementById("tcCount");
const tcBack = document.getElementById("tcBack");
const tcNext = document.getElementById("tcNext");
const teTitle = document.getElementById("teTitle");
const beatHue = b => `var(${b.hue || model.TOUR_CHAPTERS[b.ch].hue})`;
const beatHasMotion = b => Boolean(b.flow) || Boolean(b.whole) && !env.reduced;
const hopHue = (s, hop) => model.hue(hop.bad || !s.ok ? s.hue : s.ok);
/* The closing beat (2026-11-01, click-through): each Next lights the
   next stage, using the stage focus Explore already has (the rest of the
   map dims) plus the stage's hue on its components; the Next after the
   last stage goes on to the ending. tour.phase is the stage shown (0 for
   the whole map). Skipped under reduced motion, as before. */
const stageCount = b => b.whole && !env.reduced ? model.SWEEP.length : 0;

/* ?reset=1 forgets the tour's saved step, so it can be tested again from a
   first visit. Every load with the flag resets, so remove it to keep state. */
if (env.param("reset")) {
  try {
    localStorage.removeItem(model.definition.settings.storage.tour);
  } catch (err) {}
}
controls.label(tourExitBtn, env.t("tourExitShort"), "exit");
tourExitBtn.setAttribute("aria-label", env.t("tourExit"));
model.TOUR_CHAPTERS.forEach(c => {
  const li = document.createElement("li");
  li.innerHTML = '<span class="tb-bar"><span class="tb-fill"></span></span><span class="tb-name"></span>';
  li.querySelector(".tb-name").textContent = c.name;
  tourChapters.appendChild(li);
});

function readTour() {
  try {
    const v = JSON.parse(env.store.get(model.definition.settings.storage.tour) || "null");
    return v && typeof v === "object" ? v : {};
  } catch (err) {
    return {};
  }
}

function saveTour(value) {
  env.store.set(model.definition.settings.storage.tour, JSON.stringify(value));
}

/* A tour left mid-way is offered back at its step; a finished one starts over. */
function resumeStep() {
  const s = readTour().step;
  return Number.isInteger(s) && s >= 2 && s <= model.TOUR.length ? s : 0;
}

function refreshTourEntry() {
  const r = resumeStep(),
    done = Boolean(readTour().done);
  tourBtnText.textContent = r ? env.t("tourResume", { step: r }) : env.t("tourEntry");
  env.document.getElementById("tourLabel").textContent = env.t(done ? "tourTitle" : "tourNew");
}

function timeLeft(n) {
  const secs = model.TOUR.slice(n - 1).reduce((t, b) => t + (b.flow ? model.FLOW_BEAT_SECONDS : model.BEAT_SECONDS), 0);
  return secs < 60 ? env.t("tourLessThanMinute") : env.t("tourMinutesLeft", { minutes: Math.round(secs / 60) });
}


function renderTourBar(n) {
  const b = n <= model.TOUR.length ? model.TOUR[n - 1] : null;
  const cur = b ? b.ch : model.TOUR_CHAPTERS.length;
  const pos = b ? model.TOUR.slice(0, n).filter(x => x.ch === cur).length : 0;
  [...tourChapters.children].forEach((li, i) => {
    const fill = li.querySelector(".tb-fill");
    const now = i === cur;
    li.classList.toggle("current", now);
    if (now) li.setAttribute("aria-current", "step");else li.removeAttribute("aria-current");
    fill.style.width = i < cur ? "100%" : now ? pos / model.TOUR_CHAPTERS[i].span * 100 + "%" : "0%";
    fill.style.background = now ? beatHue(b) : "";
  });
  tourStatus.textContent = b ? env.t("tourStatus", { step: n, total: model.TOUR_TOTAL, left: timeLeft(n) }) : env.t("tourComplete");
}

function renderTourCard(n) {
  const b = model.TOUR[n - 1];
  tourCard.style.setProperty("--tc-hue", beatHue(b));
  tcEyebrow.textContent = env.t("tourCardCount", { chapter: model.TOUR_CHAPTERS[b.ch].name, step: n, total: model.TOUR_TOTAL });
  tcTitle.textContent = b.title;
  renderTourText(b);
  tcScroll.scrollTop = 0;
}



/* The changing part of the card. A flow beat's phase (tour.phase) is 0 on
   arrival (summary only), k (1 to the edge count) once Next has played
   edge k (line k shows, with its own number, under the intro), and the
   edge count + 1 once "Why it matters" shows in the line's place. */
/* Card text is rich text, rendered as HTML like the panels; titles stay plain. */
function renderTourText(b) {
  tcBody.replaceChildren(...b.body.map(t => {
    const el = env.document.createElement("p");
    el.innerHTML = t;
    return el;
  }));
  const p = state.tour.phase;
  tcWhy.hidden = !b.why || Boolean(b.flow) && p <= model.edgeCount(b);
  tcWhyText.innerHTML = b.why || "";
  if (!b.flow) {
    /* The closing step's sweep (2026-11-01): each Next lights a stage and
       recaps it in one line under the stage's own name, icon and colour,
       unnumbered and untinted, so it reads as a summary, not a fifth flow. */
    const g = b.recap && p > 0 && p <= stageCount(b) ? model.SWEEP[p - 1] : null;
    if (!g) {
      tcList.hidden = true;
      tcList.replaceChildren();
      return;
    }
    const li = env.document.createElement("li");
    li.className = "recap";
    li.style.setProperty("--recap-hue", model.hue(model.GROUPS[g].huekey));
    const head = env.document.createElement("span");
    head.className = "recap-h";
    head.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${model.ICONS[model.GROUPS[g].icon]}</svg>`;
    head.append(model.TOUR_CHAPTERS.find(c => c.name.toLowerCase().startsWith(g))?.name || model.GROUPS[g].title);
    const text = env.document.createElement("span");
    text.className = "recap-t";
    text.innerHTML = b.recap[g];
    li.append(head, text);
    tcList.replaceChildren(li);
    tcList.hidden = false;
    return;
  }
  const s = model.STORIES[b.flow],
    start = model.beatStart(b),
    total = model.edgeCount(b);
  const walking = p > 0 && p <= total;
  syncBadges(b);
  syncFocus(b);
  if (!walking) {
    tcList.hidden = true;
    tcList.replaceChildren();
    return;
  }
  const hop = s.hops[start + p - 1];
  const li = env.document.createElement("li");
  li.className = "cur";
  const n = env.document.createElement("span");
  n.className = "n";
  n.textContent = String(start + p);
  n.style.setProperty("--n-hue", hopHue(s, hop));
  li.append(n);
  li.insertAdjacentHTML("beforeend", hop.t);
  tcList.replaceChildren(li);
  tcList.hidden = false;
}

function syncBadges(b) {
  const start = model.beatStart(b),
    shown = start + Math.min(state.tour.phase, model.edgeCount(b));
  scene.storyLayer.querySelectorAll("g[data-hop]").forEach(g => {
    const i = Number(g.dataset.hop);
    g.classList.toggle("tpend", i >= shown || i === state.tour.badgeWait);
  });
  /* A two-way edge drawn whole shows both arrowheads; the beat keeps the
     later direction's head hidden until its move is in the card. */
  const s = model.STORIES[b.flow],
    first = {};
  s.hops.forEach((h, i) => {
    if (scene.edgeEls[h.e].def.bidir && first[h.e] === undefined) first[h.e] = i;
  });
  s.hops.slice(0, model.flowEnd(b)).forEach((h, i) => {
    const ee = scene.edgeEls[h.e];
    if (!ee.def.bidir || i === first[h.e] || Boolean(h.rev) === Boolean(s.hops[first[h.e]].rev)) return;
    const attr = h.rev ? "marker-start" : "marker-end";
    if (i < shown) ee.path.setAttribute(attr, "url(#arr-" + (h.bad || !s.ok ? s.hue : s.ok) + ")");else ee.path.removeAttribute(attr);
  });
}


function syncFocus(b) {
  const s = model.STORIES[b.flow],
    end = model.flowEnd(b);
  const onPath = new Set(),
    pathNodes = new Set();
  s.hops.slice(0, end).forEach(h => {
    const d = scene.edgeEls[h.e].def;
    onPath.add(d.id);
    pathNodes.add(d.from);
    pathNodes.add(d.to);
  });
  scene.svg.classList.add("tfocus");
  model.NODES.forEach(n => scene.nodeEls[n.id].g.classList.toggle("dimmed", !pathNodes.has(n.id)));
  model.EDGES.forEach(e => {
    [scene.edgeEls[e.id].path, scene.edgeEls[e.id].label].forEach(x => {
      if (x) x.classList.toggle("dimmed", !onPath.has(e.id));
    });
  });
}

// Keep the current line (or "Why it matters") in view when the card scrolls.
function revealLatest() {
  const b = model.TOUR[state.tour.step - 1];
  if (!b || !b.flow) return;
  const t = state.tour.phase > model.edgeCount(b) ? tcWhy : state.tour.phase > 0 ? tcList.firstElementChild : null;
  if (!t || t.closest("[hidden]")) return;
  const sr = tcScroll.getBoundingClientRect(),
    r = t.getBoundingClientRect();
  const dy = r.top < sr.top ? r.top - sr.top : r.bottom > sr.bottom ? Math.min(r.bottom - sr.bottom, r.top - sr.top) : 0;
  if (dy) tcScroll.scrollTo({
    top: tcScroll.scrollTop + dy,
    behavior: env.reduced ? "auto" : "smooth"
  });
}

/* The controls row: Back and Next (2026-11-01). On a beat with something
   to walk through (the flows, and 9 unless motion is reduced), the
   instruction line and a soft ring on Next show until the visitor's
   first Next within a beat. */

function renderPlayer() {
  const b = model.TOUR[state.tour.step - 1];
  const hint = Boolean(b) && beatHasMotion(b) && !state.tourStepped;
  tcHint.hidden = !hint;
  tcNext.classList.toggle("hint", hint);
  const backHadFocus = env.document.activeElement === tcBack;
  tcBack.disabled = state.tour.step === 1;
  // Step 1 has nothing behind it: Back is hidden, and Next starts the walk (2026-11-01).
  tcBack.hidden = state.tour.step === 1;
  if (backHadFocus && tcBack.disabled) tcNext.focus({
    preventScroll: true
  });
  const last = Boolean(b) && state.tour.step >= model.TOUR.length && !(b.flow && state.tour.phase <= model.edgeCount(b)) && state.tour.phase >= stageCount(b);
  tcNext.textContent = env.t(state.tour.step === 1 ? "tourBegin" : last ? "tourFinish" : "tourNext");
  // One segment per Next in this step (and one for "Why it matters"), filled as the visitor goes.
  const total = !b ? 0 : b.flow ? model.edgeCount(b) + 1 : stageCount(b);
  const done = Math.min(state.tour.phase, total);
  tcCount.replaceChildren(...Array.from({
    length: total
  }, (_, i) => {
    const seg = env.document.createElement("span");
    seg.className = "tc-seg" + (i < done ? " on" : "");
    return seg;
  }));
  if (total) {
    tcCount.setAttribute("role", "progressbar");
    tcCount.setAttribute("aria-label", env.t("tourProgress"));
    tcCount.setAttribute("aria-valuemin", "0");
    tcCount.setAttribute("aria-valuemax", String(total));
    tcCount.setAttribute("aria-valuenow", String(done));
  } else {
    ["role", "aria-label", "aria-valuemin", "aria-valuemax", "aria-valuenow"].forEach(a => tcCount.removeAttribute(a));
  }
}

/* One card height per beat: the height its tallest phase needs, measured
   once when the beat opens (and on resize), so the controls keep their
   place when "Why it matters" appears. Each phase is the intro plus one
   line, so the card fits closely. The CSS max-height caps it; past that,
   .tc-scroll scrolls. */
function sizeTourCard() {
  const b = model.TOUR[state.tour.step - 1];
  if (!b || tourCard.hidden) return;
  const keep = state.tour.phase,
    phases = b.flow ? model.edgeCount(b) + 2 : 1 + stageCount(b);
  tourCard.style.height = "";
  // The card is pinned top and bottom to centre it; measure it unstretched.
  tourCard.style.bottom = "auto";
  let need = 0;
  for (let p = 0; p < phases; p++) {
    state.tour.phase = p;
    renderTourText(b);
    need = Math.max(need, tourCard.offsetHeight - tcScroll.clientHeight + tcScroll.scrollHeight);
  }
  state.tour.phase = keep;
  renderTourText(b);
  tourCard.style.bottom = "";
  tourCard.style.height = Math.ceil(need) + "px";
}

/* Run fn (which changes the card's text) with a slide (2026-11-01): the
   old line (or "Why it matters") slides out and fades over 140 ms, then
   the new one slides in from the side the visitor is heading to (right on
   Next, left on Back) over 280 ms. fn reads the tour's state when it runs,
   so a fast click simply supersedes the swap in flight. On phones or with
   reduced motion, fn just runs. */

function cardChange(fn, dir = 1) {
  const token = ++state.cardSwap;
  if (state.cardOut) {
    state.cardOut.cancel();
    state.cardOut = null;
  }
  if (env.reduced || env.phoneQuery.matches || tourCard.hidden) {
    fn();
    return;
  }
  const easing = getComputedStyle(tourCard).getPropertyValue("--tour-ease").trim() || "ease-out";
  const shown = () => !tcList.hidden && tcList.firstElementChild || (!tcWhy.hidden ? tcWhy : null);
  const enter = () => {
    if (token !== state.cardSwap) return;
    if (state.cardOut) {
      state.cardOut.cancel();
      state.cardOut = null;
    }
    fn();
    const t = shown();
    if (t) env.scope.animate(t, [{
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
  state.cardOut = env.scope.animate(old, [{
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
  state.cardOut.finished.then(enter, () => {});
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
  act.clearStory();
  if (!p) {
    act.setFocus(null);
    return;
  }
  const g = model.SWEEP[p - 1];
  act.setFocus(g);
  model.GROUPS[g].members.forEach(id => {
    const ng = scene.nodeEls[id].g;
    ng.style.setProperty("--story-hue", model.hue(model.GROUPS[g].huekey));
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
  act.playStory(b.flow, {
    quiet: true,
    wide: true,
    from: model.flowEnd(b),
    to: model.flowEnd(b)
  });
  syncBadges(b);
  syncFocus(b);
}
// The current edge on the map (k within the beat, or null for none).
function markEdge(b, k) {
  scene.storyLayer.querySelectorAll("g.tcur").forEach(g => g.classList.remove("tcur"));
  model.EDGES.forEach(e => scene.edgeEls[e.id].path.classList.remove("tcur", "eglow"));
  if (k == null) return;
  const i = model.beatStart(b) + k;
  scene.edgeEls[model.STORIES[b.flow].hops[i].e].path.classList.add("tcur");
  scene.storyLayer.querySelector(`g[data-hop="${i}"]`)?.classList.add("tcur");
}
// Stops a moving dot, leaving the lit path as it is.
function stopEdgeMotion() {
  act.stopDot();
  state.tour.badgeWait = -1;
}
/* Edge k becomes current on the map; then its dot travels it with the
   camera alongside (animate), or the camera holds on it at once.
   Resolves true when the edge landed untouched. */
async function playEdge(b, k, animate) {
  const s = model.STORIES[b.flow],
    i = model.beatStart(b) + k,
    hop = s.hops[i],
    ee = scene.edgeEls[hop.e];
  stopEdgeMotion();
  markEdge(b, k);
  if (!animate || env.reduced) {
    ee.path.classList.add("eglow");
    act.tourCamShot(b, k, true);
    return true;
  }
  const token = state.storyToken;
  // The number lands with the dot, not before it (2026-11-01).
  state.tour.badgeWait = i;
  syncBadges(b);
  await act.tourCamShot(b, k, true);
  if (token !== state.storyToken) return false;
  ee.path.classList.add("eglow");
  await act.animateDot(ee.path, !!hop.rev, hop.bad || !s.ok ? s.hue : s.ok);
  if (token !== state.storyToken) return false;
  state.tour.badgeWait = -1;
  syncBadges(b);
  act.popBadge(scene.storyLayer.querySelector(`g[data-hop="${i}"]`));
  return true;
}
/* One Next: the next edge's line takes the card's line, its badge
   appears, and the edge plays. Then the tour waits; the last edge
   does not end the beat on its own. */
function stepEdge(b) {
  state.tour.phase++;
  cardChange(() => {
    renderTourText(b);
    revealLatest();
  });
  return playEdge(b, state.tour.phase - 1, true);
}
/* The Next after the last edge: no edge current, "Why it matters" in
   the line's place, the camera back to the overview of the lit path. */
function finishBeat(b) {
  stopEdgeMotion();
  markEdge(b, null);
  state.tour.phase = model.edgeCount(b) + 1;
  cardChange(() => {
    renderTourText(b);
    revealLatest();
  });
  act.tourCamShot(b, null, true);
}

// opts.atSummary: entered by Back from the next beat, so a flow beat opens at its end.
function showBeat(n, opts) {
  const b = model.TOUR[n - 1];
  const atSummary = Boolean(opts && opts.atSummary && b.flow);
  stopEdgeMotion();
  // A line swap still in flight belongs to the step being left.
  state.cardSwap++;
  if (state.cardOut) {
    state.cardOut.cancel();
    state.cardOut = null;
  }
  state.tour.step = n;
  state.tour.atEnd = false;
  state.tour.phase = atSummary ? model.edgeCount(b) + 1 : 0;
  saveTour({
    step: n,
    done: Boolean(readTour().done)
  });
  act.clearStory();
  tourEnd.hidden = true;
  tourCard.hidden = false;
  renderTourBar(n);
  renderTourCard(n);
  renderPlayer();
  sizeTourCard();
  act.unselect();
  if (b.level === 0) {
    if (state.level !== 0) act.showLevel(0);
  } else {
    if (state.level !== 1) act.showLevel(1);
    act.setFocus(null);
    act.setWeek(b.week || 0, {
      silent: true,
      quiet: true
    });
  }
  act.updateDrawerBounds();
  act.tourCamFree();
  act.tourFit();
  // Every beat opens still; a flow beat's path is already lit, without this beat's numbers.
  if (b.flow) drawBeatPath(b);
  act.tourCamShot(b, null, true);
}

/* opts.native (a click started it): ask for the browser's real full
   screen on the stagecard, which holds every piece of the tour UI. The
   in-frame fs-fixed stays on underneath, so when the request fails, or
   Esc later leaves native full screen, the tour simply carries on in-frame
   on the same beat. Deep links (?tour=1) have no gesture and stay in-frame. */
function startTour(n, opts) {
  if (state.tour.active) return;
  const wantNative = Boolean(opts && opts.native) && Boolean(stagecard.requestFullscreen);
  const wasNative = env.document.fullscreenElement === stagecard;
  act.closeFlowPicker();
  act.closeInside();
  /* From Explore's own full screen, step out of it first (native full
     screen would keep Esc for itself); leaving the tour mid-way puts the
     in-frame full screen back. */
  const wasFs = state.fsMode;
  // Already in native full screen from Explore: keep it, swap the chrome only.
  if (wasFs && wasNative && wantNative) act.applyFsDom(false);else if (wasFs) act.exitFs();
  state.tour.snap = {
    level: state.level,
    focused: state.focused,
    selected: state.selected,
    week: state.week,
    panelOpen: act.panelIsOpen(),
    wasFs
  };
  state.tour.active = true;
  act.clearStory();
  stagecard.classList.add("touring", "fs-fixed");
  act.applyFsDom(true);
  showBeat(Math.min(Math.max(1, n), model.TOUR.length));
  tcNext.focus({
    preventScroll: true
  });
  if (wantNative && !wasNative) stagecard.requestFullscreen().catch(() => {});
}


function tourNext() {
  if (!state.tour.active || state.tour.atEnd) return;
  const b = model.TOUR[state.tour.step - 1];
  if (b.flow && state.tour.phase <= model.edgeCount(b)) {
    state.tourStepped = true;
    if (state.tour.phase < model.edgeCount(b)) stepEdge(b);else finishBeat(b);
    renderPlayer();
    return;
  }
  if (state.tour.phase < stageCount(b)) {
    state.tourStepped = true;
    state.tour.phase++;
    showStage(state.tour.phase);
    cardChange(() => renderTourText(b));
    renderPlayer();
    return;
  }
  if (state.tour.step >= model.TOUR.length) showEnding();else showBeat(state.tour.step + 1);
}

function tourBack() {
  if (!state.tour.active || state.tour.atEnd) return;
  const b = model.TOUR[state.tour.step - 1];
  if (b.flow && state.tour.phase > 0) {
    stopEdgeMotion();
    state.tour.phase--;
    cardChange(() => {
      renderTourText(b);
      revealLatest();
    }, -1);
    renderPlayer();
    if (state.tour.phase === 0) {
      markEdge(b, null);
      act.tourCamShot(b, null, true);
    } else playEdge(b, state.tour.phase - 1, false);
    return;
  }
  if (!b.flow && state.tour.phase > 0) {
    state.tour.phase--;
    showStage(state.tour.phase);
    cardChange(() => renderTourText(b), -1);
    renderPlayer();
    return;
  }
  if (state.tour.step <= 1) return;
  showBeat(state.tour.step - 1, {
    atSummary: true
  });
}

/* The hand-off to the ending (2026-11-01): the step card fades out,
   the scrim blurs in over the map as it is, and only once the map is
   hidden behind it is it reset to the plain full map. Nothing jumps. */
function showEnding() {
  state.tour.atEnd = true;
  saveTour({
    step: model.TOUR_TOTAL,
    done: true
  });
  renderTourBar(model.TOUR_TOTAL);
  const resetMap = () => {
    if (!state.tour.atEnd) return;
    act.clearStory();
    if (state.level !== 1) act.showLevel(1);
    act.setFocus(null);
    act.setWeek(0, {
      silent: true,
      quiet: true
    });
    act.updateDrawerBounds();
    act.tourFit();
  };
  if (env.reduced) {
    tourCard.hidden = true;
    resetMap();
  } else {
    env.scope.animate(tourCard, [{
      opacity: 1
    }, {
      opacity: 0,
      transform: "translateY(8px)"
    }], {
      duration: 220,
      easing: "ease-in"
    }).finished.then(() => {
      if (state.tour.atEnd) tourCard.hidden = true;
    }, () => {});
    env.setTimeout(resetMap, 650);
  }
  tourEnd.hidden = false;
  tourEnd.scrollTop = 0;
  teTitle.focus({
    preventScroll: true
  });
}

/* Leaving mid-way restores Explore as it was before the tour and keeps the
   step for "Resume". Leaving from the ending ("Back to the map", Esc or
   Exit) lands on the full map instead. */
function exitTour(toFullMap) {
  if (!state.tour.active) return;
  const atEnd = state.tour.atEnd;
  act.clearStory();
  act.tourCamStop();
  if (env.document.fullscreenElement) env.document.exitFullscreen().catch(() => {});
  state.tour.active = false;
  state.tour.atEnd = false;
  tourCard.hidden = true;
  tourEnd.hidden = true;
  stagecard.classList.remove("touring");
  act.applyFsDom(false);
  const snap = state.tour.snap || {};
  state.tour.snap = null;
  act.unselect();
  if (toFullMap || atEnd) {
    act.showLevel(1);
    act.setFocus(null);
    act.setWeek(0, {
      silent: true,
      quiet: true
    });
    act.renderOverview();
    act.openPanel();
  } else if (snap.level !== 1) {
    act.showLevel(0);
    act.renderL0();
    if (snap.panelOpen) act.openPanel();else act.closePanel();
  } else {
    act.showLevel(1);
    act.setWeek(snap.week || 0, {
      silent: true,
      quiet: true
    });
    act.setFocus(snap.focused || null);
    if (snap.selected && scene.nodeEls[snap.selected]) {
      act.restoreSelection(snap.selected);
      act.renderNode(state.selected);
    } else if (snap.focused) act.renderGroup(snap.focused);else if (snap.week > 0) act.renderWeek(snap.week);else act.renderOverview();
    if (snap.panelOpen) act.openPanel();else act.closePanel();
  }
  if (snap.wasFs && !toFullMap && !atEnd) {
    stagecard.classList.add("fs-fixed");
    act.applyFsDom(true);
  }
  refreshTourEntry();
  tourBtn.focus({
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
    if (env.document.fullscreenElement) {
      env.document.exitFullscreen().catch(() => {});
      return;
    }
    if (performance.now() - state.tour.nativeLeftAt < 600) return;
    exitTour(state.tour.atEnd);
    return;
  }
  const typing = ev.target instanceof Element && ev.target.closest("input, textarea, select, [contenteditable]");
  if (typing || state.tour.atEnd) return;
  if (ev.key === "ArrowRight") {
    ev.preventDefault();
    tourNext();
  } else if (ev.key === "ArrowLeft") {
    ev.preventDefault();
    tourBack();
  }
}
/* Stops everything in flight for good (the viewer is being taken down). */
function halt() {
  state.cardSwap++;
  state.tour.active = false;
  state.tour.atEnd = false;
}

env.scope.listen(tourBtn, "click", () => startTour(resumeStep() || 1, {
  native: true
}));
let tourFitFrame = 0;
env.scope.listen(window, "resize", () => {
  if (!state.tour.active) return;
  env.cancelAnimationFrame(tourFitFrame);
  tourFitFrame = env.requestAnimationFrame(() => {
    act.updateDrawerBounds();
    if (!state.tour.atEnd) sizeTourCard();
    act.tourFit();
    if (!state.tour.atEnd) {
      const b = model.TOUR[state.tour.step - 1];
      act.tourCamShot(b, b.flow && state.tour.phase > 0 && state.tour.phase <= model.edgeCount(b) ? state.tour.phase - 1 : null, false);
    }
  });
});
env.scope.listen(tcNext, "click", tourNext);
env.scope.listen(tcBack, "click", tourBack);
env.scope.listen(tourExitBtn, "click", () => exitTour(state.tour.atEnd));
env.scope.listen(document.getElementById("teBack"), "click", () => exitTour(true));
env.scope.listen(document, "fullscreenchange", () => {
  // A tour leaving native full screen keeps running in-frame (fs-fixed).
  if (state.tour.active && !document.fullscreenElement) state.tour.nativeLeftAt = performance.now();
  if (state.tour.active) env.requestAnimationFrame(() => {
    act.updateDrawerBounds();
    if (!state.tour.atEnd) act.tourFit();
  });
  if (document.fullscreenElement === stagecard) {
    if (!state.fsMode) act.applyFsDom(true);
  } else if (state.fsMode && !stagecard.classList.contains("fs-fixed")) act.applyFsDom(false);
});
env.scope.listen(document, "keydown", ev => {
  /* While touring the tour owns the keys (arrows step, Esc exits); otherwise Esc is Explore's. */
  if (state.tour.active) {
    onTourKey(ev);
    return;
  }
  if (ev.key === "Escape") act.onEscape();
});

return { halt, readTour, saveTour, resumeStep, refreshTourEntry, timeLeft, renderTourBar, renderTourCard, renderTourText, syncBadges, syncFocus, revealLatest, renderPlayer, sizeTourCard, cardChange, showStage, drawBeatPath, markEdge, stopEdgeMotion, playEdge, stepEdge, finishBeat, showBeat, startTour, tourNext, tourBack, showEnding, exitTour, onTourKey };
}
