/** The map's content as the viewer uses it, taken from the prepared definition. Read only. */
export function createModel(definition) {
  const HUES = Object.fromEntries(Object.keys(definition.roles).map(key => [key, `--h-${key}`]));
  const TOUR = definition.tour;
  return {
    definition,
    HUES,
    hue: k => `var(${HUES[k]})`,
    ICONS: definition.icons,
    ZONES: definition.zones,
    /* Edge labels are PLACED PROGRAMMATICALLY (see placeLabel): centered on
       the longest run of the final snapped path, above a horizontal run,
       beside a vertical one. An edge carries placement fields only as an
       exception, each with its reason:
         lside "below"/"left" flips which side of the run the label sits on,
         ldx/ldy nudge the computed spot, and explicit lx/ly (+ anchor) opt
         out entirely. Add exceptions only for real collisions, never taste. */
    NODES: definition.nodes,
    EDGES: definition.edges,
    /* Level 0: the big picture. */
    GROUPS: definition.groups,
    L0: definition.overview,
    /* Flows and build order. */
    STORIES: definition.flows,
    WEEKS: definition.buildSteps,
    /* Level 2: inside views. A shared arrowhead for inside scenes; a single id is safe
       because only one scene is mounted at a time. */
    IMARK: definition.insideMarkers,
    INSIDES: definition.insides,
    /* viewBox sizes of the two canvases; must match the svg viewBox attrs. */
    VB: definition.layout.viewBoxes,
    /* The guided tour. */
    TOUR_CHAPTERS: definition.tourChapters,
    TOUR,
    TOUR_TOTAL: TOUR.length + 1,
    BEAT_SECONDS: definition.beatSeconds,
    FLOW_BEAT_SECONDS: definition.flowBeatSeconds,
    SWEEP: definition.settings.recapOrder,
    /* Tour camera zoom stays at most PATH_ZOOM_MAX: every drawn size is (viewBox size) x base
       x zoom, where base is the svg's scale at zoom 1, so a node title renders at zoom times
       its size at zoom 1, and capping zoom at 1.6 caps titles at 1.6 times that size. */
    PATH_ZOOM_MAX: 1.6,
    /* Close-ups zoom out a little to keep neighbouring edges in one shot
       (2026-11-02), so the camera moves less within a step. */
    SHOT_SLACK: 0.85
  };
}
