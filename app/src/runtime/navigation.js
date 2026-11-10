/** Where the reader is: the big picture or the full map, the focused group, the selected
 *  component, the build step, full screen, the theme. The only writer of those fields. Owns the
 *  controls that change them: Back to the big picture, the group chip, the build-step buttons and
 *  their hint, the full-screen button, the light/dark switch. */
import controls from '../rendering/ml-controls.js';

/* The neighbours' functions navigation calls (through act). */
export const NEEDS = ["closeInside", "clearStory", "resetView", "panelIsOpen", "closePanel", "renderL0", "renderOverview", "renderGroup", "renderNode", "renderWeek", "filesIsOpen"];

export function createNavigation({ env, model, scene, state, act }) {
const { document, scope, t } = env;
const { NODES, EDGES, GROUPS, WEEKS } = model;
const { svg0, svg, nodeEls, edgeEls, zoneEls } = scene;
const control = controls;
const stagecard = document.querySelector(".stagecard");
const scroller = document.querySelector(".stage-scroll");
const controlsEl = document.querySelector("section.controls");
const ctrlSlot = document.getElementById("ctrlSlot");
const panelSlot = document.getElementById("panelSlot");
const panel = document.getElementById("panel");
const drawer = document.getElementById("drawer");
const drawerBody = document.getElementById("drawerBody");
const fsBtn = document.getElementById("fsBtn");
const panelBtn = document.getElementById("panelBtn");
const tourBar = document.getElementById("tourBar");
const toL0 = document.getElementById("toL0");
const toL1 = document.getElementById("toL1");
const crumbNote = document.getElementById("crumbNote");
const unfocusBtn = document.getElementById("unfocus");
/* Highlight only while the full map is showing: on the big picture the
   build-order state is inert, so "Full system" must not read as active.
   Called from setWeek and from showLevel, since either can change what
   "active" means. */
function refreshWeekSeg() {
  document.querySelectorAll("#weekSeg button").forEach(b => {
    b.classList.toggle("on", state.level === 1 && Number(b.dataset.w) === state.week);
  });
}

function showLevel(l) {
  state.level = l;
  // The tour opens the full map itself; only an explorer's own visit counts.
  refreshWeekSeg();
  act.closeInside();
  svg0.style.display = l === 0 ? "block" : "none";
  svg.style.display = l === 1 ? "block" : "none";
  /* The legend explains the full map's color roles; on the big picture
     none of those distinctions are drawn yet, so it only confuses. */
  const legend = document.querySelector(".legend");
  legend.style.display = l === 0 ? "none" : "";
  /* On the full map the zoom control sits at the right end of the legend
     bar, where it never covers a card at Fit; the big picture has no
     legend, so there it floats in the canvas corner (2026-11-10). */
  const zoomCtl = document.getElementById("zoomCtl");
  if (l === 0) document.querySelector(".stage-scroll").prepend(zoomCtl);
  else legend.append(zoomCtl);
  /* Reset only once the new level's svg (and the legend, which sets the
     canvas height) is displayed: resetView clamps the pan against the
     active svg's rect, and a display:none svg measures 0x0 at the origin,
     which pinned tx/ty to the centre of the visible area and pushed the
     map off to the bottom right. */
  act.resetView();
  toL0.hidden = l === 0;
  toL1.hidden = l !== 0;
  crumbNote.textContent = t(l === 0 ? "bigPicture" : "fullMap");
  if (l === 0) {
    setFocus(null);
    act.clearStory();
    setWeek(0, {
      silent: true
    });
    unselect();
  }
}

function setFocus(g) {
  state.focused = g;
  NODES.forEach(n => {
    nodeEls[n.id].g.classList.toggle("dimmed", !!g && n.group !== g);
  });
  EDGES.forEach(e => {
    const inG = !!g && nodeEls[e.from].def.group === g && nodeEls[e.to].def.group === g;
    const dim = !!g && !inG;
    edgeEls[e.id].path.classList.toggle("dimmed", dim);
    if (edgeEls[e.id].label) edgeEls[e.id].label.classList.toggle("dimmed", dim);
  });
  unfocusBtn.hidden = !g;
  if (g) {
    control.label(unfocusBtn, GROUPS[g].title, "close");
    unfocusBtn.style.setProperty("--focus-hue", model.hue(GROUPS[g].huekey));
    unfocusBtn.setAttribute("aria-label", t("clearStage", { stage: GROUPS[g].title }));
    unfocusBtn.title = t("showAllStages");
  }
}

function focusGroup(g) {
  if (state.tour.active) return;
  showLevel(1);
  act.clearStory();
  setWeek(0, {
    silent: true
  });
  unselect();
  setFocus(g);
  act.renderGroup(g);
}

// The inspector starts below the actual header, including wrapped controls.
// It grows with content up to the remaining canvas height rather than
// filling the viewport with an empty surface.
function updateDrawerBounds() {
  if (!state.fsMode) return;
  const inset = parseFloat(getComputedStyle(stagecard).getPropertyValue("--drawer-inset"));
  // The tour hides the canvas header; the tour bar is then the header.
  const crumbEl = stagecard.querySelector(".crumbbar");
  const header = (crumbEl.getClientRects().length ? crumbEl : tourBar).getBoundingClientRect();
  const cardTop = stagecard.getBoundingClientRect().top + stagecard.clientTop;
  stagecard.style.setProperty("--drawer-top", header.bottom - cardTop + inset + "px");
  /* The tour's step card sits 20px below the header; its ending covers
     everything under the tour bar. */
  if (state.tour.active) {
    stagecard.style.setProperty("--tour-top", header.bottom - cardTop + 20 + "px");
    stagecard.style.setProperty("--tour-bar-h", tourBar.getBoundingClientRect().bottom - cardTop + "px");
    // The legend below the map: the card is centred above it.
    const sb = stagecard.getBoundingClientRect().bottom - stagecard.clientTop;
    stagecard.style.setProperty("--tour-bottom", sb - scroller.getBoundingClientRect().bottom + 20 + "px");
  }
}

function applyFsDom(on) {
  if (on) {
    state.preFsOpen = act.panelIsOpen();
    state.fsMode = true;
    stagecard.classList.add("fs-card");
    drawerBody.appendChild(panel);
    panel.classList.remove("closed");
    drawer.classList.remove("open");
    stagecard.insertBefore(controlsEl, stagecard.querySelector(".crumbbar"));
    updateDrawerBounds();
    // The two views scale differently, so a normal-view zoom does not carry over.
    if (state.zoom !== 1 || state.tx || state.ty) act.resetView();
    control.label(fsBtn, t("exitFullScreen"), "collapse");
    panelBtn.hidden = false;
  } else {
    state.fsMode = false;
    act.resetView();
    stagecard.classList.remove("fs-card", "fs-fixed");
    panelSlot.after(panel);
    panel.classList.toggle("closed", !state.preFsOpen);
    drawer.classList.remove("open");
    ctrlSlot.before(controlsEl);
    control.label(fsBtn, t("fullScreen"), "expand");
    panelBtn.hidden = state.preFsOpen;
  }
}

function enterFs() {
  const go = () => {
    if (!state.fsMode) applyFsDom(true);
  };
  if (stagecard.requestFullscreen) {
    stagecard.requestFullscreen().then(go).catch(() => {
      stagecard.classList.add("fs-fixed");
      go();
    });
  } else {
    stagecard.classList.add("fs-fixed");
    go();
  }
}

function exitFs() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  applyFsDom(false);
}

/* No component selected, and none drawn as selected; the panel is left as it is. */
function unselect() {
  state.selected = null;
  NODES.forEach(n => nodeEls[n.id].g.classList.remove("sel"));
}

/* After the tour: the component selected before it, drawn as selected again. */
function restoreSelection(id) {
  state.selected = id;
  nodeEls[state.selected].g.classList.add("sel");
}

function clearSelection() {
  unselect();
  if (state.level === 0) act.renderL0();else if (state.focused) act.renderGroup(state.focused);else if (state.week > 0) act.renderWeek(state.week);else act.renderOverview();
}

function selectNode(id) {
  /* The tour's map is for looking, not selecting (keyboard included). */
  if (state.tour.active) return;
  act.clearStory();
  /* Exploring inside a focused stage keeps the rest of the map dimmed;
     clicking outside the stage means the user has navigated away. */
  if (state.focused && nodeEls[id].def.group !== state.focused) setFocus(null);
  state.selected = id;
  NODES.forEach(n => nodeEls[n.id].g.classList.toggle("sel", n.id === id));
  act.renderNode(id);
}

function setWeek(w, opts) {
  state.week = w;
  refreshWeekSeg();
  NODES.forEach(n => {
    const g = nodeEls[n.id].g;
    g.classList.toggle("future", w > 0 && n.step > w);
    g.classList.toggle("justbuilt", w > 0 && n.step === w);
  });
  zoneEls.forEach(z => z.g.classList.toggle("future", w > 0 && z.members.length > 0 && z.members.every(n => n.step > w)));
  EDGES.forEach(e => {
    const fw = nodeEls[e.from].def.step,
      tw = nodeEls[e.to].def.step;
    const fut = w > 0 && Math.max(fw, tw) > w;
    edgeEls[e.id].path.classList.toggle("future", fut);
    if (edgeEls[e.id].label) edgeEls[e.id].label.classList.toggle("future", fut);
  });
  if (!(opts && opts.silent)) {
    if (w > 0) {
      unselect();
      act.renderWeek(w);
    } else if (state.selected) act.renderNode(state.selected);else act.renderOverview();
  }
}

/* ---------------- theme ---------------- */

/* The host passes the theme in ?theme= (the hub, and the lessons with
   theme=light); without it the visitor's stored choice applies. The tool
   has no theme button of its own: the hub's bar carries it (2026-11-02,
   tools live only in the hub). */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  syncThemeLabel();
}
/* The switch says what a click will do, so it follows every change of theme, not only its own. */
function syncThemeLabel() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const rootEl = document.documentElement;
  const dark = rootEl.dataset.theme ? rootEl.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  toggle.setAttribute("aria-label", dark ? t("themeToLight") : t("themeToDark"));
}
/* ---------------- controls ---------------- */

scope.listen(svg, "click", ev => {
  if (state.tour.active) return;
  if (ev.target === svg) {
    if (state.fsMode) act.closePanel();
    clearSelection();
  }
});
scope.listen(toL0, "click", () => {
  showLevel(0);
  act.renderL0();
});
/* The same step as the intro panel's "Open full map", always in reach on the big picture. */
scope.listen(toL1, "click", () => {
  showLevel(1);
  setFocus(null);
  act.renderOverview();
});
scope.listen(unfocusBtn, "click", () => {
  setFocus(null);
  act.renderOverview();
});
if (window.ResizeObserver) {
  const drawerBoundsObserver = new env.ResizeObserver(updateDrawerBounds);
  drawerBoundsObserver.observe(stagecard.querySelector(".crumbbar"));
  drawerBoundsObserver.observe(controlsEl);
  drawerBoundsObserver.observe(tourBar);
}
scope.listen(window, "resize", updateDrawerBounds);
scope.listen(fsBtn, "click", () => {
  state.fsMode ? exitFs() : enterFs();
});

/* The build-step buttons. Hover hint naming each build step; .seg clips overflow, so the hint is
   one fixed element placed under the hovered button. */
const weekSeg = document.getElementById("weekSeg");
const stepTip = document.createElement("div");
stepTip.className = "steptip";
stepTip.hidden = true;
weekSeg.closest(".controls").appendChild(stepTip);
function showStepTip(b) {
  stepTip.textContent = b.dataset.tip;
  stepTip.hidden = false;
  const r = b.getBoundingClientRect(), w = stepTip.offsetWidth;
  stepTip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
  stepTip.style.top = r.bottom + 8 + "px";
}
function hideStepTip() { stepTip.hidden = true; }
WEEKS.map((_, i) => [String(i), i === 0 ? t("fullSystem") : String(i)]).forEach(([v, label]) => {
  const b = document.createElement("button");
  b.dataset.w = v;
  b.textContent = label;
  if (v !== "0" && WEEKS[v]?.title) {
    b.dataset.tip = v + " · " + WEEKS[v].title;
    b.setAttribute("aria-label", t("buildStepAria", { step: b.dataset.tip }));
    for (const ev of ["mouseenter", "focus"]) scope.listen(b, ev, () => showStepTip(b));
    for (const ev of ["mouseleave", "blur", "click"]) scope.listen(b, ev, hideStepTip);
  }
  scope.listen(b, "click", () => {
    if (state.level !== 1) showLevel(1);
    /* The inside overlay covers the map without changing level, so
       showLevel alone won't dismiss it when already on the full map. */
    act.closeInside();
    act.clearStory();
    setFocus(null);
    setWeek(Number(v));
  });
  weekSeg.appendChild(b);
});

/* Light / dark switch (2026-11-09). With no choice the page follows the
   system; a click pins the opposite of what is showing and is remembered
   per browser when storage allows it. */
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  const rootEl = document.documentElement;
  const isDark = () => rootEl.dataset.theme ? rootEl.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = env.store.get("imap-theme");
  if (saved === "dark" || saved === "light") rootEl.dataset.theme = saved;
  syncThemeLabel();
  scope.listen(themeToggle, "click", () => {
    const next = isDark() ? "light" : "dark";
    rootEl.dataset.theme = next;
    env.store.set("imap-theme", next);
    syncThemeLabel();
  });
}
/* A host page can pass the theme in ?theme=light or ?theme=dark; it wins over the stored choice. */
const forcedTheme = env.param("theme");
if (forcedTheme === "dark" || forcedTheme === "light") setTheme(forcedTheme);

/* Esc outside the tour steps back one layer: the close-up, the files view, the full-screen
   drawer, then full screen itself. */
function onEscape() {
  if (!document.getElementById("inside").hidden) act.closeInside();else if (act.filesIsOpen()) document.getElementById("filesBack").click();else if (state.fsMode && drawer.classList.contains("open")) act.closePanel();else if (state.fsMode && stagecard.classList.contains("fs-fixed")) applyFsDom(false);
}
/* Node titles: the concept on top and the tool under it, or the other way round (viewMode). The
   Labels switch that changed viewMode is parked with its markup (see the commented block in the
   controls section); viewMode stays pinned to "concepts", so bringing the switch back is markup
   plus a listener that sets viewMode, calls applyLabels and re-renders the selected node. */
function applyLabels() {
  NODES.forEach(n => {
    const e = nodeEls[n.id];
    e.l1.textContent = state.viewMode === "tools" ? n.tool : n.concept;
    e.l2.textContent = state.viewMode === "tools" ? n.concept : n.tool;
  });
}
control.label(toL0, t("backToBigPicture"), "back");
control.label(toL1, t("openFullMap"), "forward");
control.label(fsBtn, t("fullScreen"), "expand");
return { applyLabels, onEscape, refreshWeekSeg, showLevel, setFocus, focusGroup, updateDrawerBounds, applyFsDom, enterFs, exitFs, clearSelection, selectNode, setWeek, setTheme, unselect, restoreSelection };
}
