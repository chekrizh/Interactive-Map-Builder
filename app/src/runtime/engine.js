import controls from '../rendering/ml-controls.js';
import { createEnv } from './env.js';
import { createModel } from './model.js';
import { createState } from './state.js';
import { createScene } from './scene.js';
import { createPanels, NEEDS as PANELS_NEEDS } from './panels.js';
import { createFlowplayer, NEEDS as FLOW_NEEDS } from './flow-player.js';
import { createCamera } from './camera.js';
import { createTourplayer } from './tour-player.js';
import { createNavigation, NEEDS as NAVIGATION_NEEDS } from './navigation.js';
import { createFilesView, NEEDS as FILES_NEEDS } from './files-view.js';
import { createHelp, NEEDS as HELP_NEEDS } from './help.js';

export async function mountEngine(root, definition) {
  "use strict";

  const env = createEnv(root, definition);
  const model = createModel(definition);
  const state = createState();
  /* Neighbour functions by name. A module gets an `act` holding only the names in its NEEDS;
     each one looks its function up when called, so modules can be created in any order and
     wired afterwards, and a call before wiring fails with a clear error. */
  const wired = {};
  function actFor(who, needs) {
    const act = {};
    for (const name of needs) act[name] = (...args) => {
      if (!wired[name]) throw new Error(`${who}: ${name} is not wired`);
      return wired[name](...args);
    };
    return Object.freeze(act);
  }
  const { scope, document, requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, ResizeObserver, t, reduced, phoneQuery, wideQuery, param, store } = env;
  const { HUES, hue, ICONS, ZONES, NODES, EDGES, GROUPS, L0, STORIES, WEEKS, IMARK, INSIDES, VB, TOUR_CHAPTERS, TOUR, TOUR_TOTAL, BEAT_SECONDS, FLOW_BEAT_SECONDS, SWEEP, PATH_ZOOM_MAX, SHOT_SLACK } = model;
  const context = {
    definition,
    format: env.format,
    t,
    get tourCam() {
      return state.tourCam;
    },
    get BEAT_SECONDS() {
      return BEAT_SECONDS;
    },
    get EDGES() {
      return EDGES;
    },
    get FLOW_BEAT_SECONDS() {
      return FLOW_BEAT_SECONDS;
    },
    get GROUPS() {
      return GROUPS;
    },
    get ICONS() {
      return ICONS;
    },
    get IMARK() {
      return IMARK;
    },
    get INSIDES() {
      return INSIDES;
    },
    get NODES() {
      return NODES;
    },
    get PATH_ZOOM_MAX() {
      return PATH_ZOOM_MAX;
    },
    get SHOT_SLACK() {
      return SHOT_SLACK;
    },
    get STORIES() {
      return STORIES;
    },
    get SWEEP() {
      return SWEEP;
    },
    get TOUR() {
      return TOUR;
    },
    get TOUR_CHAPTERS() {
      return TOUR_CHAPTERS;
    },
    get TOUR_TOTAL() {
      return TOUR_TOTAL;
    },
    get VB() {
      return VB;
    },
    get WEEKS() {
      return WEEKS;
    },
    get activeSvg() {
      return activeSvg;
    },
    get allNodeBoxes() {
      return allNodeBoxes;
    },
    get animateDot() {
      return animateDot;
    },
    get applyFsDom() {
      return applyFsDom;
    },
    get applyPan() {
      return applyPan;
    },
    get beatHasMotion() {
      return beatHasMotion;
    },
    get beatHue() {
      return beatHue;
    },
    get beatShots() {
      return beatShots;
    },
    get beatStart() {
      return beatStart;
    },
    get camFrame() {
      return camFrame;
    },
    get camFree() {
      return camFree;
    },
    get camGeom() {
      return camGeom;
    },
    get camShows() {
      return camShows;
    },
    get camSolve() {
      return camSolve;
    },
    get camTimer() {
      return state.camTimer;
    },
    set camTimer(value) {
      state.camTimer = value;
    },
    get canvas() {
      return canvas;
    },
    get cardChange() {
      return cardChange;
    },
    get cardOut() {
      return state.cardOut;
    },
    set cardOut(value) {
      state.cardOut = value;
    },
    get cardSwap() {
      return state.cardSwap;
    },
    set cardSwap(value) {
      state.cardSwap = value;
    },
    get catName() {
      return catName;
    },
    get chosenFlow() {
      return state.chosenFlow;
    },
    get clampPan() {
      return clampPan;
    },
    get clearStory() {
      return clearStory;
    },
    get clearTimeout() {
      return clearTimeout;
    },
    get stopDot() {
      return stopDot;
    },
    get closeFlowPicker() {
      return closeFlowPicker;
    },
    get closeInside() {
      return closeInside;
    },
    get closePanel() {
      return closePanel;
    },
    get control() {
      return control;
    },
    get controlsEl() {
      return controlsEl;
    },
    get crumbNote() {
      return crumbNote;
    },
    get ctrlSlot() {
      return ctrlSlot;
    },
    get currentView() {
      return currentView;
    },
    get document() {
      return document;
    },
    get dot() {
      return state.dot;
    },
    get drawBeatPath() {
      return drawBeatPath;
    },
    get drawer() {
      return drawer;
    },
    get drawerBody() {
      return drawerBody;
    },
    get drawerOcclusion() {
      return drawerOcclusion;
    },
    get edgeCount() {
      return edgeCount;
    },
    get edgeEls() {
      return edgeEls;
    },
    get edgeLayer() {
      return edgeLayer;
    },
    get el() {
      return el;
    },
    get exitFs() {
      return exitFs;
    },
    get exitTour() {
      return exitTour;
    },
    get exploreNudge() {
      return state.exploreNudge;
    },
    get finishBeat() {
      return finishBeat;
    },
    get fitTarget() {
      return fitTarget;
    },
    get flowEnd() {
      return flowEnd;
    },
    get focusHop() {
      return focusHop;
    },
    get focusPoint() {
      return focusPoint;
    },
    get focused() {
      return state.focused;
    },
    get frameBoxes() {
      return frameBoxes;
    },
    get fsBtn() {
      return fsBtn;
    },
    get fsMode() {
      return state.fsMode;
    },
    get hopBoxes() {
      return hopBoxes;
    },
    get hopHue() {
      return hopHue;
    },
    get hue() {
      return hue;
    },
    get insideBox() {
      return insideBox;
    },
    get level() {
      return state.level;
    },
    get litBoxes() {
      return litBoxes;
    },
    get markEdge() {
      return markEdge;
    },
    get markSilent() {
      return markSilent;
    },
    get nodeBox() {
      return nodeBox;
    },
    get nodeEls() {
      return nodeEls;
    },
    get nodeLayer() {
      return nodeLayer;
    },
    get openInside() {
      return openInside;
    },
    get openPanel() {
      return openPanel;
    },
    get panel() {
      return panel;
    },
    get panelBody() {
      return panelBody;
    },
    get panelBtn() {
      return panelBtn;
    },
    get panelHTML() {
      return panelHTML;
    },
    get panelIsOpen() {
      return panelIsOpen;
    },
    get panelSlot() {
      return panelSlot;
    },
    get param() {
      return param;
    },
    get pathTarget() {
      return pathTarget;
    },
    get phoneQuery() {
      return phoneQuery;
    },
    get placeCamera() {
      return placeCamera;
    },
    get playEdge() {
      return playEdge;
    },
    get playStory() {
      return playStory;
    },
    get popBadge() {
      return popBadge;
    },
    get preFsOpen() {
      return state.preFsOpen;
    },
    get readTour() {
      return readTour;
    },
    get reduced() {
      return reduced;
    },
    get refreshTourEntry() {
      return refreshTourEntry;
    },
    get refreshWeekSeg() {
      return refreshWeekSeg;
    },
    get renderGroup() {
      return renderGroup;
    },
    get renderL0() {
      return renderL0;
    },
    get renderNode() {
      return renderNode;
    },
    get renderOverview() {
      return renderOverview;
    },
    get renderPlayer() {
      return renderPlayer;
    },
    get renderTourBar() {
      return renderTourBar;
    },
    get renderTourCard() {
      return renderTourCard;
    },
    get renderTourText() {
      return renderTourText;
    },
    get renderWeek() {
      return renderWeek;
    },
    get requestAnimationFrame() {
      return requestAnimationFrame;
    },
    get resetView() {
      return resetView;
    },
    get resumeStep() {
      return resumeStep;
    },
    get revealInPanel() {
      return revealInPanel;
    },
    get revealLatest() {
      return revealLatest;
    },
    get saveTour() {
      return saveTour;
    },
    get scope() {
      return scope;
    },
    get scroller() {
      return scroller;
    },
    get selected() {
      return state.selected;
    },
    get setFocus() {
      return setFocus;
    },
    get setTimeout() {
      return setTimeout;
    },
    get setWeek() {
      return setWeek;
    },
    get setZoom() {
      return setZoom;
    },
    get showBeat() {
      return showBeat;
    },
    get showEnding() {
      return showEnding;
    },
    get showLevel() {
      return showLevel;
    },
    get showStage() {
      return showStage;
    },
    get sizeTourCard() {
      return sizeTourCard;
    },
    get stageCount() {
      return stageCount;
    },
    get stagecard() {
      return stagecard;
    },
    get startTour() {
      return startTour;
    },
    get stepEdge() {
      return stepEdge;
    },
    get stopEdgeMotion() {
      return stopEdgeMotion;
    },
    get store() {
      return store;
    },
    get storyLayer() {
      return storyLayer;
    },
    get storyToken() {
      return state.storyToken;
    },
    get selectNode() {
      return selectNode;
    },
    get filesView() {
      return filesView;
    },
    get svg() {
      return svg;
    },
    get svg0() {
      return svg0;
    },
    get syncBadges() {
      return syncBadges;
    },
    get syncFocus() {
      return syncFocus;
    },
    get syncPanelHead() {
      return syncPanelHead;
    },
    get tcBack() {
      return tcBack;
    },
    get tcBody() {
      return tcBody;
    },
    get tcCount() {
      return tcCount;
    },
    get tcEyebrow() {
      return tcEyebrow;
    },
    get tcHint() {
      return tcHint;
    },
    get tcKeys() {
      return tcKeys;
    },
    get tcList() {
      return tcList;
    },
    get tcNext() {
      return tcNext;
    },
    get tcScroll() {
      return tcScroll;
    },
    get tcTitle() {
      return tcTitle;
    },
    get tcWhy() {
      return tcWhy;
    },
    get tcWhyText() {
      return tcWhyText;
    },
    get teTitle() {
      return teTitle;
    },
    get timeLeft() {
      return timeLeft;
    },
    get toL0() {
      return toL0;
    },
    get tour() {
      return state.tour;
    },
    get tourBack() {
      return tourBack;
    },
    get tourBar() {
      return tourBar;
    },
    get tourBtn() {
      return tourBtn;
    },
    get tourBtnText() {
      return tourBtnText;
    },
    get tourCamShot() {
      return tourCamShot;
    },
    get tourCard() {
      return tourCard;
    },
    get tourChapters() {
      return tourChapters;
    },
    get tourEnd() {
      return tourEnd;
    },
    get tourFit() {
      return tourFit;
    },
    get tourNext() {
      return tourNext;
    },
    get tourOcclusion() {
      return tourOcclusion;
    },
    get tourStatus() {
      return tourStatus;
    },
    get tourStepped() {
      return state.tourStepped;
    },
    set tourStepped(value) {
      state.tourStepped = value;
    },
    get tweenCamera() {
      return tweenCamera;
    },
    get tx() {
      return state.tx;
    },
    set tx(value) {
      state.tx = value;
    },
    get ty() {
      return state.ty;
    },
    set ty(value) {
      state.ty = value;
    },
    get unfocusBtn() {
      return unfocusBtn;
    },
    get updateDrawerBounds() {
      return updateDrawerBounds;
    },
    get viewMode() {
      return state.viewMode;
    },
    get week() {
      return state.week;
    },
    get zoneEls() {
      return zoneEls;
    },
    get zoneLayer() {
      return zoneLayer;
    },
    get zoom() {
      return state.zoom;
    },
    set zoom(value) {
      state.zoom = value;
    },
    get unselect() {
      return unselect;
    },
    get restoreSelection() {
      return restoreSelection;
    },
    get zoomCtl() {
      return zoomCtl;
    }
  };
  const cameraModule = createCamera(context);
  const tourplayerModule = createTourplayer(context);
  const panel = document.getElementById("panel");
  const control = controls;
  const scene = await createScene(env, model, {
    openGroup: id => focusGroup(id),
    selectNode: id => selectNode(id)
  });
  const { svg0, svg, el, canvas, zoneLayer, edgeLayer, nodeLayer, storyLayer, zoneEls, edgeEls, nodeEls, nodeBox, allNodeBoxes, hopBoxes } = scene;
  const panelsModule = createPanels({ env, model, scene, state, act: actFor("panels", PANELS_NEEDS) });
  const navigationModule = createNavigation({ env, model, scene, state, act: actFor("navigation", NAVIGATION_NEEDS) });
  const flowplayerModule = createFlowplayer({ env, model, scene, state, act: actFor("flow-player", FLOW_NEEDS) });
  Object.assign(wired, {
    showLevel, selectNode, closeInside, clearStory,
    panelHTML, openPanel, renderL0, renderOverview, renderNode,
    setFocus, updateDrawerBounds, resetView, panelIsOpen, closePanel, renderGroup, renderWeek,
    setWeek, unselect, revealInPanel, focusHop,
    hasFiles: () => Boolean(filesView?.available),
    filesFor: id => filesView.pathsFor(id),
    openFiles: path => filesView.open(path)
  });
  control.label(document.getElementById("toL0"), t("backToBigPicture"), "back");
  control.label(document.getElementById("fsBtn"), t("fullScreen"), "expand");
  control.label(document.getElementById("insideBack"), t("backToMap"), "back");

  /* ---------------- state ---------------- */

  const toL0 = document.getElementById("toL0");
  const crumbNote = document.getElementById("crumbNote");
  const unfocusBtn = document.getElementById("unfocus");
  const insideBox = document.getElementById("inside");
  let filesView = null;

  /* Highlight only while the full map is showing: on the big picture the
     build-order state is inert, so "Full system" must not read as active.
     Called from setWeek and from showLevel, since either can change what
     "active" means. */
  function refreshWeekSeg(...args) {
    return navigationModule.refreshWeekSeg(...args);
  }
  function showLevel(...args) {
    return navigationModule.showLevel(...args);
  }
  function setFocus(...args) {
    return navigationModule.setFocus(...args);
  }
  function focusGroup(...args) {
    return navigationModule.focusGroup(...args);
  }

  /* ---------------- inside overlay ---------------- */
  function openInside(...args) {
    return panelsModule.openInside(...args);
  }
  function closeInside(...args) {
    filesView?.close();
    return panelsModule.closeInside(...args);
  }
  scope.listen(document.getElementById("insideBack"), "click", closeInside);

  /* ---------------- fullscreen + drawer ---------------- */

  const stagecard = document.querySelector(".stagecard");
  const controlsEl = document.querySelector("section.controls");
  const ctrlSlot = document.getElementById("ctrlSlot");
  const panelSlot = document.getElementById("panelSlot");
  const drawer = document.getElementById("drawer");
  const drawerBody = document.getElementById("drawerBody");
  const fsBtn = document.getElementById("fsBtn");
  const panelBtn = document.getElementById("panelBtn");
  const tourBar = document.getElementById("tourBar");
  const tourCard = document.getElementById("tourCard");
  const tourEnd = document.getElementById("tourEnd");

  /* One logical panel, two containers: in normal view it is the page-level
     side card (aside.panel); in fullscreen the same element is reparented
     into the .drawer sidebar, whose visibility is driven by .open. */
  /* In fullscreen the drawer's .open drives visibility and the panel must
     stay un-"closed" inside it; hiding is per-mode, or a reopened drawer
     slides in around a display:none panel and looks empty. */
  /* Closing lives on the panel's own ✕; reopening lives on the crumbbar's
     "Show panel", which only exists while the panel is closed. */
  function openPanel(...args) {
    return panelsModule.openPanel(...args);
  }
  function closePanel(...args) {
    return panelsModule.closePanel(...args);
  }
  function panelIsOpen(...args) {
    return panelsModule.panelIsOpen(...args);
  }

  /* Keep the newest line in view by scrolling the panel's own box. The
     obvious scrollIntoView walks up to the window when the box cannot move
     far enough, and a nudged page slides the map: unwanted anywhere, fatal
     while someone is recording. The scroller differs by mode; in fullscreen
     the panel sits at natural height inside .drawer, which is the box. */
  function revealInPanel(...args) {
    return panelsModule.revealInPanel(...args);
  }
  scope.listen(document.getElementById("drawerClose"), "click", closePanel);
  scope.listen(document.getElementById("panelClose"), "click", closePanel);
  /* The close strip turns opaque only once its card has scrolled. */
  function syncPanelHead(...args) {
    return panelsModule.syncPanelHead(...args);
  }
  [panel, drawer].forEach(box => {
    if (box.querySelector(":scope > .panelhead")) scope.listen(box, "scroll", () => syncPanelHead(box), {
      passive: true
    });
  });
  scope.listen(panelBtn, "click", openPanel);

  /* Native fullscreen only paints the fullscreened element's subtree, so the
     panel (and, on exit, the controls row) must physically move in and out of
     the stagecard; panelSlot / ctrlSlot mark their home positions. The
     explore message moves too, or it would never show in full screen. */
  /* Fullscreen always starts with the drawer closed (the map is the point;
     playing a flow or clicking a node reopens it), and exiting restores the
     page panel to whatever it was before entering. */

  // The inspector starts below the actual header, including wrapped controls.
  // It grows with content up to the remaining canvas height rather than
  // filling the viewport with an empty surface.
  function updateDrawerBounds(...args) {
    return navigationModule.updateDrawerBounds(...args);
  }
  function applyFsDom(...args) {
    return navigationModule.applyFsDom(...args);
  }
  function enterFs(...args) {
    return navigationModule.enterFs(...args);
  }
  function exitFs(...args) {
    return navigationModule.exitFs(...args);
  }
  scope.listen(document, "fullscreenchange", () => {
    // A tour leaving native full screen keeps running in-frame (fs-fixed).
    if (state.tour.active && !document.fullscreenElement) state.tour.nativeLeftAt = performance.now();
    if (state.tour.active) requestAnimationFrame(() => {
      updateDrawerBounds();
      if (!state.tour.atEnd) tourFit();
    });
    if (document.fullscreenElement === stagecard) {
      if (!state.fsMode) applyFsDom(true);
    } else if (state.fsMode && !stagecard.classList.contains("fs-fixed")) applyFsDom(false);
  });
  scope.listen(document, "keydown", ev => {
    /* While touring the tour owns the keys (arrows step, Esc exits). */
    if (state.tour.active) {
      onTourKey(ev);
      return;
    }
    if (ev.key !== "Escape") return;
    if (!insideBox.hidden) closeInside();else if (filesView?.isOpen()) document.getElementById("filesBack").click();else if (state.fsMode && drawer.classList.contains("open")) closePanel();else if (state.fsMode && stagecard.classList.contains("fs-fixed")) applyFsDom(false);
  });

  /* ---------------- pan (hand drag) + zoom ---------------- */

  const scroller = document.querySelector(".stage-scroll");
  // Reserve the inspector's actual width and inset during camera moves.
  // While touring, the step card takes the inspector's place.
  const drawerOcclusion = () => drawer.classList.contains("open") ? drawer.offsetWidth + 2 * parseFloat(getComputedStyle(stagecard).getPropertyValue("--drawer-inset")) : tourOcclusion().x;
  /* What the tour's step card covers: a strip on the right on wider
     screens, the bottom sheet on phones. Zero outside the tour. */
  function tourOcclusion(...args) {
    return cameraModule.tourOcclusion(...args);
  }
  /* Zoom outside full screen: the hub's wide layout only. The lesson embeds
     stay as they are, and narrow screens scroll sideways natively. */
  stagecard.classList.add("zoomable");
  const normalZoom = () => !state.fsMode && wideQuery.matches;
  const activeSvg = () => state.level === 0 ? svg0 : svg;

  /* Pan limits: any point of the map can be brought to the middle of the
     visible area (left of the sidebar when it is open), so a zoomed-in
     corner card can be centred, and no further, so at least a corner of the
     map always stays on screen. Measured from where the map actually sits:
     it is anchored left and centred vertically, so the range is not
     symmetric. The rendered translate is read back from the computed style,
     which keeps this right during the camera's transition too. */
  function clampPan(...args) {
    return cameraModule.clampPan(...args);
  }
  /* Fullscreen flow camera: pan so the given viewBox point sits centered in
     the area left of the sidebar. The .campan class enables a CSS transition
     for these programmatic moves only; a manual drag removes it instantly. */
  function focusPoint(...args) {
    return cameraModule.focusPoint(...args);
  }
  function focusHop(...args) {
    return cameraModule.focusHop(...args);
  }
  function applyPan(...args) {
    return cameraModule.applyPan(...args);
  }

  /* In the normal view, `at` is the screen point that stays put as the map
     scales: the canvas centre for the buttons, the pointer for a pinch. */
  function setZoom(...args) {
    return cameraModule.setZoom(...args);
  }
  function canvasCentre(...args) {
    return cameraModule.canvasCentre(...args);
  }
  function resetView(...args) {
    return cameraModule.resetView(...args);
  }
  scope.listen(document.getElementById("zoomIn"), "click", () => {
    tourCamManual();
    setZoom(state.zoom * 1.25, canvasCentre());
  });
  scope.listen(document.getElementById("zoomOut"), "click", () => {
    tourCamManual();
    setZoom(state.zoom / 1.25, canvasCentre());
  });
  // In the tour, Fit means the tour's wide framing, not zoom 1.
  scope.listen(document.getElementById("zoomFit"), "click", () => {
    if (state.tour.active) tourFit();else resetView();
  });
  scope.listen(scroller, "wheel", e => {
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
  scope.listen(scroller, "pointerdown", e => {
    const canPan = state.fsMode || normalZoom() && state.zoom !== 1;
    if (!canPan || e.button !== 0 || e.target.closest("#zoomCtl")) return;
    panDown = true;
    panMoved = false;
    panX = e.clientX;
    panY = e.clientY;
  });
  scope.listen(scroller, "pointermove", e => {
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
  ["pointerup", "pointercancel"].forEach(t => scope.listen(scroller, t, () => {
    panDown = false;
    scroller.classList.remove("panning");
  }));
  scope.listen(scroller, "click", e => {
    if (e.target.closest("#zoomCtl")) return;
    if (panMoved) {
      e.stopPropagation();
      e.preventDefault();
      panMoved = false;
    }
  }, true);

  /* ---------------- panel rendering ---------------- */

  function applyLabels() {
    NODES.forEach(n => {
      const e = nodeEls[n.id];
      e.l1.textContent = state.viewMode === "tools" ? n.tool : n.concept;
      e.l2.textContent = state.viewMode === "tools" ? n.concept : n.tool;
    });
  }
  function catName(...args) {
    return panelsModule.catName(...args);
  }
  const panelBody = document.getElementById("panelBody");
  function panelHTML(...args) {
    return panelsModule.panelHTML(...args);
  }
  function renderL0(...args) {
    return panelsModule.renderL0(...args);
  }
  function renderOverview(...args) {
    return panelsModule.renderOverview(...args);
  }
  function renderGroup(...args) {
    return panelsModule.renderGroup(...args);
  }
  function renderNode(...args) {
    return panelsModule.renderNode(...args);
  }
  function renderWeek(...args) {
    return panelsModule.renderWeek(...args);
  }

  /* ---------------- stories + weeks ---------------- */

  /* storyToken cancels in-flight playback: every await inside playStory
     re-checks it, so starting anything new safely abandons the old flow. */
  function clearStory(...args) {
    return flowplayerModule.clearStory(...args);
  }
  function clearSelection(...args) {
    return navigationModule.clearSelection(...args);
  }
  function selectNode(...args) {
    return navigationModule.selectNode(...args);
  }
  function setWeek(...args) {
    return navigationModule.setWeek(...args);
  }
  function unselect(...args) {
    return navigationModule.unselect(...args);
  }
  function restoreSelection(...args) {
    return navigationModule.restoreSelection(...args);
  }
  function animateDot(...args) {
    return flowplayerModule.animateDot(...args);
  }


  function markSilent(...args) {
    return flowplayerModule.markSilent(...args);
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
  function stopDot(...args) {
    return flowplayerModule.stopDot(...args);
  }
  function closeFlowPicker(...args) {
    return flowplayerModule.closeFlowPicker(...args);
  }
  function popBadge(...args) {
    return flowplayerModule.popBadge(...args);
  }
  function playStory(...args) {
    return flowplayerModule.playStory(...args);
  }

  /* ---------------- controls ---------------- */

  /* Choosing a flow prepares its next run. Only Play starts or restarts it;
     the original build buttons remain an independent exploration path. */

  /* The Labels switch is parked with its markup (see the commented block in
     the controls section). viewMode stays a real variable pinned to
     "concepts", so every read of it below still works and bringing the
     control back is markup plus this listener, nothing more:
   document.querySelectorAll("#viewSeg button").forEach((b) => {
    b.addEventListener("click", () => {
      viewMode = b.dataset.v;
      document.querySelectorAll("#viewSeg button").forEach((x) => x.classList.toggle("on", x === b));
      applyLabels();
      if (selected) renderNode(selected);
    });
  });
  */

  /* ---------------- guided tour ---------------- */



  /* ?reset=1 forgets the tour's saved step, so it can be tested again from a
     first visit. Every load with the flag resets, so remove it to keep state. */
  if (param("reset")) {
    try {
      localStorage.removeItem(definition.settings.storage.tour);
    } catch (err) {}
  }
  function readTour(...args) {
    return tourplayerModule.readTour(...args);
  }
  function saveTour(...args) {
    return tourplayerModule.saveTour(...args);
  }
  const tourControls = document.getElementById("tourControls");
  const tourBtn = document.getElementById("tourBtn");
  const tourBtnText = document.getElementById("tourBtnText");
  const tourStatus = document.getElementById("tourStatus");
  const tourChapters = document.getElementById("tourChapters");
  const tourExitBtn = document.getElementById("tourExit");
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
  control.label(tourExitBtn, t("tourExitShort"), "exit");
  tourExitBtn.setAttribute("aria-label", t("tourExit"));
  TOUR_CHAPTERS.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = '<span class="tb-bar"><span class="tb-fill"></span></span><span class="tb-name"></span>';
    li.querySelector(".tb-name").textContent = c.name;
    tourChapters.appendChild(li);
  });

  /* A tour left mid-way is offered back at its step; a finished one starts over. */
  function resumeStep(...args) {
    return tourplayerModule.resumeStep(...args);
  }
  function refreshTourEntry(...args) {
    return tourplayerModule.refreshTourEntry(...args);
  }
  /* Files view: the repository tree beside the tour entry, when the map lists files. */
  filesView = createFilesView({ env, model, scene, state, act: actFor("files-view", FILES_NEEDS) });
  /* The "?" card and hover hints on the controls: what each mode is for. */
  createHelp({ env, model, state, act: actFor("help", HELP_NEEDS) });
  scope.listen(tourBtn, "click", () => startTour(resumeStep() || 1, {
    native: true
  }));
  function timeLeft(...args) {
    return tourplayerModule.timeLeft(...args);
  }
  const beatHue = b => `var(${b.hue || TOUR_CHAPTERS[b.ch].hue})`;
  const beatHasMotion = b => Boolean(b.flow) || Boolean(b.whole) && !reduced;


  function renderTourBar(...args) {
    return tourplayerModule.renderTourBar(...args);
  }
  function renderTourCard(...args) {
    return tourplayerModule.renderTourCard(...args);
  }


  const flowEnd = b => b.hops ? b.hops[1] : STORIES[b.flow].hops.length;
  const beatStart = b => b.hops ? b.hops[0] : 0;
  const edgeCount = b => flowEnd(b) - beatStart(b);
  const hopHue = (s, hop) => hue(hop.bad || !s.ok ? s.hue : s.ok);

  /* The changing part of the card. A flow beat's phase (tour.phase) is 0 on
     arrival (summary only), k (1 to the edge count) once Next has played
     edge k (line k shows, with its own number, under the intro), and the
     edge count + 1 once "Why it matters" shows in the line's place. */
  function renderTourText(...args) {
    return tourplayerModule.renderTourText(...args);
  }


  function syncBadges(...args) {
    return tourplayerModule.syncBadges(...args);
  }


  function syncFocus(...args) {
    return tourplayerModule.syncFocus(...args);
  }

  // Keep the current line (or "Why it matters") in view when the card scrolls.
  function revealLatest(...args) {
    return tourplayerModule.revealLatest(...args);
  }

  /* The controls row: Back and Next (2026-11-01). On a beat with something
     to walk through (the flows, and 9 unless motion is reduced), the
     instruction line and a soft ring on Next show until the visitor's
     first Next within a beat. */
  function renderPlayer(...args) {
    return tourplayerModule.renderPlayer(...args);
  }

  /* One card height per beat: the height its tallest phase needs, measured
     once when the beat opens (and on resize), so the controls keep their
     place when "Why it matters" appears. Each phase is the intro plus one
     line, so the card fits closely. The CSS max-height caps it; past that,
     .tc-scroll scrolls. */
  function sizeTourCard(...args) {
    return tourplayerModule.sizeTourCard(...args);
  }

  /* Run fn (which changes the card's text) with a slide (2026-11-01): the
     old line (or "Why it matters") slides out and fades over 140 ms, then
     the new one slides in from the side the visitor is heading to (right on
     Next, left on Back) over 280 ms. fn reads the tour's state when it runs,
     so a fast click simply supersedes the swap in flight. On phones or with
     reduced motion, fn just runs. */
  function cardChange(...args) {
    return tourplayerModule.cardChange(...args);
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
     that edge's shot. state.tourCam.shot is the shot the camera is on (-1 the
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
  function camFrame(...args) {
    return cameraModule.camFrame(...args);
  }

  // Put viewBox point (v.cx, v.cy) at the centre of the visible area, at zoom v.z.
  function placeCamera(...args) {
    return cameraModule.placeCamera(...args);
  }
  function currentView(...args) {
    return cameraModule.currentView(...args);
  }

  /* The zoom and centre that fit a set of viewBox boxes into the visible
     area, mx and my px clear of its sides (24 and 20 by default). */
  function frameBoxes(...args) {
    return cameraModule.frameBoxes(...args);
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
  const zoomCtl = document.getElementById("zoomCtl"),
    tcKeys = tourCard.querySelector(".tc-keys");
  function camGeom(...args) {
    return cameraModule.camGeom(...args);
  }
  function camSolve(...args) {
    return cameraModule.camSolve(...args);
  }

  // Whether every box is fully shown with the camera at t.
  function camShows(...args) {
    return cameraModule.camShows(...args);
  }
  // The nodes lit during a flow beat: its whole path so far, as syncFocus lights it.
  function litBoxes(...args) {
    return cameraModule.litBoxes(...args);
  }
  function fitTarget(...args) {
    return cameraModule.fitTarget(...args);
  }

  // A hop's boxes: its two components, path and label.
  // The overview, the frame of a flow beat's own path.
  function pathTarget(...args) {
    return cameraModule.pathTarget(...args);
  }

  /* The beat's shots, greedy and in order. Each is
     { edges: [k, ...], target }, k the edge's index within the beat and
     target the frame of the shot's boxes at their own best zoom, capped at
     PATH_ZOOM_MAX. Measured on demand, so a resize simply re-measures. */
  function beatShots(...args) {
    return cameraModule.beatShots(...args);
  }
  function tweenCamera(...args) {
    return cameraModule.tweenCamera(...args);
  }
  const camFree = () => state.tour.active && state.fsMode && !reduced && !state.tourCam.manual;
  /* The camera onto edge k's shot (k within the beat), or the overview
     (k null). animate: ease there over 800 ms, or hold when the camera is
     already on (or moving to) that shot; resolves when it arrives.
     Otherwise it is placed at once, as on resize. */
  function tourCamShot(...args) {
    return cameraModule.tourCamShot(...args);
  }
  function tourCamManual(...args) {
    return cameraModule.tourCamManual(...args);
  }

  // The wide framing, immediately. Cancels any camera move in flight.
  function tourFit(...args) {
    return cameraModule.tourFit(...args);
  }
  let tourFitFrame = 0;
  scope.listen(window, "resize", () => {
    if (!state.tour.active) return;
    cancelAnimationFrame(tourFitFrame);
    tourFitFrame = requestAnimationFrame(() => {
      updateDrawerBounds();
      if (!state.tour.atEnd) sizeTourCard();
      tourFit();
      if (!state.tour.atEnd) {
        const b = TOUR[state.tour.step - 1];
        tourCamShot(b, b.flow && state.tour.phase > 0 && state.tour.phase <= edgeCount(b) ? state.tour.phase - 1 : null, false);
      }
    });
  });

  /* The closing beat (2026-11-01, click-through): each Next lights the
     next stage, using the stage focus Explore already has (the rest of the
     map dims) plus the stage's hue on its components; the Next after the
     last stage goes on to the ending. tour.phase is the stage shown (0 for
     the whole map). Skipped under reduced motion, as before. */
  const stageCount = b => b.whole && !reduced ? SWEEP.length : 0;
  function showStage(...args) {
    return tourplayerModule.showStage(...args);
  }

  /* ---- flow beats, edge by edge (2026-10-31, click-through 2026-11-01) ----
     The beat's path is drawn once, landed, through playStory; walking it
     never redraws it. Each Next marks the next edge current (markEdge),
     shows its badge (syncBadges) and the dot travels it with the camera
     alongside. storyToken stops a moving dot, so Back, Next and Exit can
     interrupt at any point. */

  function drawBeatPath(...args) {
    return tourplayerModule.drawBeatPath(...args);
  }

  // The current edge on the map (k within the beat, or null for none).
  function markEdge(...args) {
    return tourplayerModule.markEdge(...args);
  }

  // Stops a moving dot, leaving the lit path as it is.
  function stopEdgeMotion(...args) {
    return tourplayerModule.stopEdgeMotion(...args);
  }

  /* Edge k becomes current on the map; then its dot travels it with the
     camera alongside (animate), or the camera holds on it at once.
     Resolves true when the edge landed untouched. */
  function playEdge(...args) {
    return tourplayerModule.playEdge(...args);
  }

  /* One Next: the next edge's line takes the card's line, its badge
     appears, and the edge plays. Then the tour waits; the last edge
     does not end the beat on its own. */
  function stepEdge(...args) {
    return tourplayerModule.stepEdge(...args);
  }

  /* The Next after the last edge: no edge current, "Why it matters" in
     the line's place, the camera back to the overview of the lit path. */
  function finishBeat(...args) {
    return tourplayerModule.finishBeat(...args);
  }

  // opts.atSummary: entered by Back from the next beat, so a flow beat opens at its end.
  function showBeat(...args) {
    return tourplayerModule.showBeat(...args);
  }

  /* opts.native (a click started it): ask for the browser's real full
     screen on the stagecard, which holds every piece of the tour UI. The
     in-frame fs-fixed stays on underneath, so when the request fails, or
     Esc later leaves native full screen, the tour simply carries on in-frame
     on the same beat. Deep links (?tour=1) have no gesture and stay in-frame. */
  function startTour(...args) {
    return tourplayerModule.startTour(...args);
  }


  function tourNext(...args) {
    return tourplayerModule.tourNext(...args);
  }
  function tourBack(...args) {
    return tourplayerModule.tourBack(...args);
  }

  /* The hand-off to the ending (2026-11-01): the step card fades out,
     the scrim blurs in over the map as it is, and only once the map is
     hidden behind it is it reset to the plain full map. Nothing jumps. */
  function showEnding(...args) {
    return tourplayerModule.showEnding(...args);
  }

  /* Leaving mid-way restores Explore as it was before the tour and keeps the
     step for "Resume". Leaving from the ending ("Back to the map", Esc or
     Exit) lands on the full map instead. */
  function exitTour(...args) {
    return tourplayerModule.exitTour(...args);
  }
  function onTourKey(...args) {
    return tourplayerModule.onTourKey(...args);
  }
  scope.listen(tcNext, "click", tourNext);
  scope.listen(tcBack, "click", tourBack);
  scope.listen(tourExitBtn, "click", () => exitTour(state.tour.atEnd));
  scope.listen(document.getElementById("teBack"), "click", () => exitTour(true));

  /* ---------------- theme ---------------- */

  /* A host page can pass the theme in ?theme=light or ?theme=dark; without it
     the theme switch above restores the visitor's stored choice. */
  function setTheme(...args) {
    return navigationModule.setTheme(...args);
  }

  /* ---------------- init ---------------- */
  applyLabels();
  setWeek(0, {
    silent: true
  });
  showLevel(0);
  renderL0();
  openPanel();
  /* Arriving from the companion page: open the full map with that component
     already selected, rather than at the big picture. */
  const wantNode = param("node");
  if (wantNode && nodeEls[wantNode]) {
    showLevel(1);
    selectNode(wantNode);
  }
  /* ?tour=1 (posts and emails) goes straight into the tour. */
  refreshTourEntry();
  if (param("tour") === "1") startTour(1);
  return {
    selectNode(id) {
      if (!nodeEls[id]) return false;
      showLevel(1);
      selectNode(id);
      return true;
    },
    openStage(id) {
      if (!GROUPS[id]) return false;
      focusGroup(id);
      return true;
    },
    setBuildStep(step) {
      if (!Number.isInteger(step) || step < 0 || step >= WEEKS.length) return false;
      showLevel(1);
      setWeek(step);
      return true;
    },
    playFlow(id) {
      if (!STORIES[id]) return false;
      return playStory(id);
    },
    startTour(step = 1) {
      startTour(Math.max(1, Math.min(TOUR.length, step)));
    },
    resumeTour() {
      startTour(resumeStep() || 1);
    },
    next: tourNext,
    back: tourBack,
    exitTour: () => exitTour(false),
    setZoom(value) {
      tourCamManual();
      setZoom(value, canvasCentre());
    },
    fit: resetView,
    setTheme,
    getState() {
      return {
        level: state.level,
        focused: state.focused,
        selected: state.selected,
        buildStep: state.week,
        flow: state.chosenFlow,
        zoom: state.zoom,
        pan: {
          x: state.tx,
          y: state.ty
        },
        fullscreen: state.fsMode,
        tour: {
          active: state.tour.active,
          step: state.tour.step,
          phase: state.tour.phase,
          complete: state.tour.atEnd
        }
      };
    },
    destroy() {
      state.storyToken++;
      state.cardSwap++;
      state.tourCam.token++;
      state.tour.active = false;
      state.tour.atEnd = false;
      scope.destroy();
      if (document.fullscreenElement === stagecard) document.exitFullscreen().catch(() => {});
      root.replaceChildren();
    }
  };
}
