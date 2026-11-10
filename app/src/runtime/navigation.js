/** navigation: extracted original behavior; dependencies supplied by the instance controller. */
export function createNavigation(ctx) {
/* Highlight only while the full map is showing: on the big picture the
   build-order state is inert, so "Full system" must not read as active.
   Called from setWeek and from showLevel, since either can change what
   "active" means. */
function refreshWeekSeg() {
  ctx.document.querySelectorAll("#weekSeg button").forEach(b => {
    b.classList.toggle("on", ctx.level === 1 && Number(b.dataset.w) === ctx.week);
  });
}

function showLevel(l) {
  ctx.level = l;
  // The tour opens the full map itself; only an explorer's own visit counts.
  ctx.refreshWeekSeg();
  ctx.closeInside();
  ctx.svg0.style.display = l === 0 ? "block" : "none";
  ctx.svg.style.display = l === 1 ? "block" : "none";
  /* The legend explains the full map's color roles; on the big picture
     none of those distinctions are drawn yet, so it only confuses. */
  ctx.document.querySelector(".legend").style.display = l === 0 ? "none" : "";
  /* Reset only once the new level's svg (and the legend, which sets the
     canvas height) is displayed: resetView clamps the pan against the
     active svg's rect, and a display:none svg measures 0x0 at the origin,
     which pinned tx/ty to the centre of the visible area and pushed the
     map off to the bottom right. */
  ctx.resetView();
  ctx.toL0.hidden = l === 0;
  ctx.crumbNote.textContent = ctx.t(l === 0 ? "bigPicture" : "fullMap");
  if (l === 0) {
    ctx.setFocus(null);
    ctx.clearStory();
    ctx.setWeek(0, {
      silent: true
    });
    ctx.selected = null;
    ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.remove("sel"));
  }
}

function setFocus(g) {
  ctx.focused = g;
  ctx.NODES.forEach(n => {
    ctx.nodeEls[n.id].g.classList.toggle("dimmed", !!g && n.group !== g);
  });
  ctx.EDGES.forEach(e => {
    const inG = !!g && ctx.nodeEls[e.from].def.group === g && ctx.nodeEls[e.to].def.group === g;
    const dim = !!g && !inG;
    ctx.edgeEls[e.id].path.classList.toggle("dimmed", dim);
    if (ctx.edgeEls[e.id].label) ctx.edgeEls[e.id].label.classList.toggle("dimmed", dim);
  });
  ctx.unfocusBtn.hidden = !g;
  if (g) {
    ctx.control.label(ctx.unfocusBtn, ctx.GROUPS[g].title, "close");
    ctx.unfocusBtn.style.setProperty("--focus-hue", ctx.hue(ctx.GROUPS[g].huekey));
    ctx.unfocusBtn.setAttribute("aria-label", ctx.t("clearStage", { stage: ctx.GROUPS[g].title }));
    ctx.unfocusBtn.title = ctx.t("showAllStages");
  }
}

function focusGroup(g) {
  if (ctx.tour.active) return;
  ctx.showLevel(1);
  ctx.clearStory();
  ctx.setWeek(0, {
    silent: true
  });
  ctx.selected = null;
  ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.remove("sel"));
  ctx.setFocus(g);
  ctx.renderGroup(g);
}

// The inspector starts below the actual header, including wrapped controls.
// It grows with content up to the remaining canvas height rather than
// filling the viewport with an empty surface.
function updateDrawerBounds() {
  if (!ctx.fsMode) return;
  const inset = parseFloat(getComputedStyle(ctx.stagecard).getPropertyValue("--drawer-inset"));
  // The tour hides the canvas header; the tour bar is then the header.
  const crumbEl = ctx.stagecard.querySelector(".crumbbar");
  const header = (crumbEl.getClientRects().length ? crumbEl : ctx.tourBar).getBoundingClientRect();
  const cardTop = ctx.stagecard.getBoundingClientRect().top + ctx.stagecard.clientTop;
  ctx.stagecard.style.setProperty("--drawer-top", header.bottom - cardTop + inset + "px");
  /* The tour's step card sits 20px below the header; its ending covers
     everything under the tour bar. */
  if (ctx.tour.active) {
    ctx.stagecard.style.setProperty("--tour-top", header.bottom - cardTop + 20 + "px");
    ctx.stagecard.style.setProperty("--tour-bar-h", ctx.tourBar.getBoundingClientRect().bottom - cardTop + "px");
    // The legend below the map: the card is centred above it.
    const sb = ctx.stagecard.getBoundingClientRect().bottom - ctx.stagecard.clientTop;
    ctx.stagecard.style.setProperty("--tour-bottom", sb - ctx.scroller.getBoundingClientRect().bottom + 20 + "px");
  }
}

function applyFsDom(on) {
  if (on) {
    ctx.preFsOpen = ctx.panelIsOpen();
    ctx.fsMode = true;
    ctx.stagecard.classList.add("fs-card");
    ctx.drawerBody.appendChild(ctx.panel);
    ctx.panel.classList.remove("closed");
    ctx.drawer.classList.remove("open");
    ctx.stagecard.insertBefore(ctx.controlsEl, ctx.stagecard.querySelector(".crumbbar"));
    if (ctx.exploreNudge) ctx.exploreNudge.place();
    ctx.updateDrawerBounds();
    // The two views scale differently, so a normal-view zoom does not carry over.
    if (ctx.zoom !== 1 || ctx.tx || ctx.ty) ctx.resetView();
    ctx.control.label(ctx.fsBtn, ctx.t("exitFullScreen"), "collapse");
    ctx.panelBtn.hidden = false;
  } else {
    ctx.fsMode = false;
    ctx.resetView();
    ctx.stagecard.classList.remove("fs-card", "fs-fixed");
    ctx.panelSlot.after(ctx.panel);
    ctx.panel.classList.toggle("closed", !ctx.preFsOpen);
    ctx.drawer.classList.remove("open");
    ctx.ctrlSlot.before(ctx.controlsEl);
    if (ctx.exploreNudge) ctx.exploreNudge.place();
    ctx.control.label(ctx.fsBtn, ctx.t("fullScreen"), "expand");
    ctx.panelBtn.hidden = ctx.preFsOpen;
  }
}

function enterFs() {
  const go = () => {
    if (!ctx.fsMode) ctx.applyFsDom(true);
  };
  if (ctx.stagecard.requestFullscreen) {
    ctx.stagecard.requestFullscreen().then(go).catch(() => {
      ctx.stagecard.classList.add("fs-fixed");
      go();
    });
  } else {
    ctx.stagecard.classList.add("fs-fixed");
    go();
  }
}

function exitFs() {
  if (ctx.document.fullscreenElement) ctx.document.exitFullscreen().catch(() => {});
  ctx.applyFsDom(false);
}

function clearSelection() {
  ctx.selected = null;
  ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.remove("sel"));
  if (ctx.level === 0) ctx.renderL0();else if (ctx.focused) ctx.renderGroup(ctx.focused);else if (ctx.week > 0) ctx.renderWeek(ctx.week);else ctx.renderOverview();
}

function selectNode(id) {
  /* The tour's map is for looking, not selecting (keyboard included). */
  if (ctx.tour.active) return;
  ctx.clearStory();
  /* Exploring inside a focused stage keeps the rest of the map dimmed;
     clicking outside the stage means the user has navigated away. */
  if (ctx.focused && ctx.nodeEls[id].def.group !== ctx.focused) ctx.setFocus(null);
  ctx.selected = id;
  ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.toggle("sel", n.id === id));
  ctx.renderNode(id);
}

function setWeek(w, opts) {
  ctx.week = w;
  ctx.refreshWeekSeg();
  ctx.NODES.forEach(n => {
    const g = ctx.nodeEls[n.id].g;
    g.classList.toggle("future", w > 0 && n.step > w);
    g.classList.toggle("justbuilt", w > 0 && n.step === w);
  });
  ctx.zoneEls.forEach(z => z.g.classList.toggle("future", w > 0 && z.members.length > 0 && z.members.every(n => n.step > w)));
  ctx.EDGES.forEach(e => {
    const fw = ctx.nodeEls[e.from].def.step,
      tw = ctx.nodeEls[e.to].def.step;
    const fut = w > 0 && Math.max(fw, tw) > w;
    ctx.edgeEls[e.id].path.classList.toggle("future", fut);
    if (ctx.edgeEls[e.id].label) ctx.edgeEls[e.id].label.classList.toggle("future", fut);
  });
  if (!(opts && opts.silent)) {
    if (w > 0) {
      ctx.selected = null;
      ctx.NODES.forEach(n => ctx.nodeEls[n.id].g.classList.remove("sel"));
      ctx.renderWeek(w);
    } else if (ctx.selected) ctx.renderNode(ctx.selected);else ctx.renderOverview();
  }
}

/* ---------------- theme ---------------- */

/* The host passes the theme in ?theme= (the hub, and the lessons with
   theme=light); without it the visitor's stored choice applies. The tool
   has no theme button of its own: the hub's bar carries it (2026-11-02,
   tools live only in the hub). */
function setTheme(t) {
  ctx.document.documentElement.dataset.theme = t;
}
return { refreshWeekSeg, showLevel, setFocus, focusGroup, updateDrawerBounds, applyFsDom, enterFs, exitFs, clearSelection, selectNode, setWeek, setTheme };
}
