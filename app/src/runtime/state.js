/** Everything about the viewer that changes while someone reads the map, in one place. Each field
 *  has one owner, the only module that writes it; the others read it at the moment they need it
 *  (never copy a field into a local variable ahead of time) or ask the owner through its functions. */
export function createState() {
  return {
    /* navigation */
    level: 0,            // 0 the big picture, 1 the full map
    focused: null,       // the overview group opened on the full map
    viewMode: "concepts",
    selected: null,      // the selected component id
    week: 0,             // the build step shown
    fsMode: false,
    preFsOpen: true,     // whether the panel was open before full screen

    /* camera */
    zoom: 1,
    tx: 0,
    ty: 0,
    camTimer: null,
    /* The tour camera: token cancels a move, manual is set by a hand zoom or pan and stops
       the camera for the rest of the beat, shot is the shot the camera is on (-1 the overview,
       -2 neither), shotMove the move in flight, fitZoom the wide view's zoom. */
    tourCam: {
      fitZoom: 1,
      token: 0,
      manual: false,
      shot: -2,
      shotMove: null
    },

    /* flow-player */
    storyToken: 0,       // bumped to cancel the flow being played
    dot: null,
    chosenFlow: null,

    /* tour-player */
    tour: {
      active: false,
      step: 1,
      phase: 0,
      atEnd: false,
      snap: null,
      news: null,
      badgeWait: -1,
      nativeLeftAt: -1e9
    },
    tourStepped: false,
    cardSwap: 0,
    cardOut: null
  };
}
