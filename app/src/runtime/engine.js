import { createEnv } from './env.js';
import { createModel } from './model.js';
import { createState } from './state.js';
import { createScene } from './scene.js';
import { createPanels, NEEDS as PANELS_NEEDS } from './panels.js';
import { createFlowplayer, NEEDS as FLOW_NEEDS } from './flow-player.js';
import { createCamera, NEEDS as CAMERA_NEEDS } from './camera.js';
import { createTourplayer, NEEDS as TOUR_NEEDS } from './tour-player.js';
import { createNavigation, NEEDS as NAVIGATION_NEEDS } from './navigation.js';
import { createFilesView, NEEDS as FILES_NEEDS } from './files-view.js';
import { createHelp, NEEDS as HELP_NEEDS } from './help.js';

/** Builds the viewer: the read-only env and model, the one state object, the drawn scene, then the
 *  modules, each given only the neighbours' functions it lists in its NEEDS; then the first view
 *  and the public controller (window.mapViewer). Holds no behaviour of its own. */
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
  const inputs = (who, needs) => ({ env, model, scene, state, act: actFor(who, needs) });

  /* Creation order is the order the modules register their listeners in, which decides who
     hears a shared event first (window resize: navigation, then the tour). Keep it. */
  const scene = await createScene(env, model, {
    openGroup: id => navigation.focusGroup(id),
    selectNode: id => navigation.selectNode(id)
  });
  const panels = createPanels(inputs("panels", PANELS_NEEDS));
  const navigation = createNavigation(inputs("navigation", NAVIGATION_NEEDS));
  const flow = createFlowplayer(inputs("flow-player", FLOW_NEEDS));
  const camera = createCamera(inputs("camera", CAMERA_NEEDS));
  /* Wired before files and help are created: help asks hasFiles while it builds its card. */
  Object.assign(wired, panels, navigation, flow, camera, {
    /* Leaving the close-up also leaves a files view opened from it. */
    closeInside(...args) {
      files.close();
      return panels.closeInside(...args);
    },
    hasFiles: () => files.available,
    filesFor: id => files.pathsFor(id),
    openFiles: path => files.open(path),
    filesIsOpen: () => files.isOpen()
  });

  /* Files view: the repository tree beside the tour entry, when the map lists files. */
  const files = createFilesView(inputs("files-view", FILES_NEEDS));
  /* The "?" card and hover hints on the controls: what each mode is for. */
  createHelp(inputs("help", HELP_NEEDS));
  const tour = createTourplayer(inputs("tour-player", TOUR_NEEDS));

  /* ---------------- first view ---------------- */
  navigation.applyLabels();
  navigation.setWeek(0, {
    silent: true
  });
  navigation.showLevel(0);
  panels.renderL0();
  panels.openPanel();
  /* Arriving from the companion page: open the full map with that component
     already selected, rather than at the big picture. */
  const wantNode = env.param("node");
  if (wantNode && scene.nodeEls[wantNode]) {
    navigation.showLevel(1);
    navigation.selectNode(wantNode);
  }
  /* ?tour=1 (posts and emails) goes straight into the tour. */
  tour.refreshTourEntry();
  if (env.param("tour") === "1") tour.startTour(1);

  const stagecard = env.document.querySelector(".stagecard");
  return {
    selectNode(id) {
      if (!scene.nodeEls[id]) return false;
      navigation.showLevel(1);
      navigation.selectNode(id);
      return true;
    },
    openStage(id) {
      if (!model.GROUPS[id]) return false;
      navigation.focusGroup(id);
      return true;
    },
    setBuildStep(step) {
      if (!Number.isInteger(step) || step < 0 || step >= model.WEEKS.length) return false;
      navigation.showLevel(1);
      navigation.setWeek(step);
      return true;
    },
    playFlow(id) {
      if (!model.STORIES[id]) return false;
      return flow.playStory(id);
    },
    startTour(step = 1) {
      tour.startTour(Math.max(1, Math.min(model.TOUR.length, step)));
    },
    resumeTour() {
      tour.startTour(tour.resumeStep() || 1);
    },
    next: tour.tourNext,
    back: tour.tourBack,
    exitTour: () => tour.exitTour(false),
    setZoom(value) {
      camera.tourCamManual();
      camera.setZoom(value, camera.canvasCentre());
    },
    fit: camera.resetView,
    setTheme: navigation.setTheme,
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
      flow.stopDot();
      tour.halt();
      camera.tourCamStop();
      env.scope.destroy();
      if (env.document.fullscreenElement === stagecard) env.document.exitFullscreen().catch(() => {});
      root.replaceChildren();
    }
  };
}
