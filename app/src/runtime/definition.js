/** Validate and hydrate a trusted definition without mutating the author's data. */
export function prepareDefinition(input) {
  const d = structuredClone(input);
  const fail = message => { throw new Error(`Invalid map definition: ${message}`); };
  if (typeof d.id !== 'string' || !d.id) fail('id must be a non-empty string');
  // Keys follow the map id: every file:// page shares one storage, so authored keys could collide.
  d.settings.storage = { tour: `${d.id}:tour`, nudge: `${d.id}:nudge`, theme: 'map-viewer:theme' };
  const unique = (items, key, section) => {
    const ids = new Set();
    for (const item of items) {
      if (!item[key] || ids.has(item[key])) fail(`${section}: missing or duplicate ${key} ${item[key]}`);
      ids.add(item[key]);
    }
    return ids;
  };
  const nodes = unique(d.nodes, 'id', 'nodes');
  const edges = unique(d.edges, 'id', 'edges');
  const zones = unique(d.zones, 'id', 'zones');
  const groups = new Set(Object.keys(d.groups));
  const requireRef = (set, id, owner) => { if (!set.has(id)) fail(`${owner}: unknown reference ${id}`); };
  for (const n of d.nodes) {
    requireRef(groups, n.group, `node ${n.id}.group`);
    if (n.zone) requireRef(zones, n.zone, `node ${n.id}.zone`);
    if (n.inside && !d.insides[n.inside]) fail(`node ${n.id}.inside: ${n.inside}`);
    if (n.logo && !d.logos[n.logo]) fail(`node ${n.id}.logo: ${n.logo}`);
    if (!d.roles[n.cat]) fail(`node ${n.id}.cat: ${n.cat}`);
    if (!d.icons[n.icon]) fail(`node ${n.id}.icon: ${n.icon}`);
    if (!d.buildSteps[n.week]) fail(`node ${n.id}.week: ${n.week}`);
  }
  for (const e of d.edges) {
    requireRef(nodes,e.from,`edge ${e.id}.from`); requireRef(nodes,e.to,`edge ${e.id}.to`);
  }
  for (const [id,g] of Object.entries(d.groups)) for (const n of g.members) {
    requireRef(nodes,n,`group ${id}.members`);
    if (d.nodes.find(x=>x.id===n).group!==id) fail(`group ${id}.members: inconsistent node ${n}`);
  }
  for (const b of d.overview) requireRef(groups,b.g,'overview');
  for (const e of d.overviewEdges) {
    requireRef(groups,e.from,`overview edge ${e.id}.from`); requireRef(groups,e.to,`overview edge ${e.id}.to`);
  }
  for (const [id,f] of Object.entries(d.flows)) {
    for (const h of f.hops) {
      requireRef(edges,h.e,`flow ${id}.hops`);
      if (h.breaks) requireRef(nodes,h.breaks,`flow ${id}.breaks`);
      if (h.silent) requireRef(edges,h.silent.e,`flow ${id}.silent`);
    }
    for (const e of f.silent || []) requireRef(edges,e,`flow ${id}.silent`);
  }
  for (const step of d.buildSteps.filter(Boolean)) for (const n of step.nodes) requireRef(nodes,n,`build step ${step.title}`);
  for (const b of d.tour) {
    if (!d.tourChapters[b.ch]) fail(`tour ${b.title}.ch: ${b.ch}`);
    if (b.flow && !d.flows[b.flow]) fail(`tour ${b.title}.flow: ${b.flow}`);
  }
  if (!d.tour.length) fail('tour: at least one step is required');
  const finalBeat = d.tour[d.tour.length - 1];
  if (!finalBeat.flow && !finalBeat.whole) fail('tour: the final step must walk a flow or recap the whole map');
  d.tourChapters.forEach((chapter, index) => {
    const beats = d.tour.filter(beat => beat.ch === index).length;
    if (!beats) fail(`tourChapters[${index}]: must contain at least one tour step`);
    chapter.span = beats;
  });
  for (const g of d.settings.recapOrder) requireRef(groups,g,'settings.recapOrder');
  if (!d.layout) fail('layout is required for authored geometry; automatic layout is not implemented');
  for (const [section,key] of [['nodes','id'],['edges','id'],['zones','id'],['overview','g']]) {
    for (const item of d[section]) {
      const geometry = d.layout[section]?.[item[key]];
      if (!geometry) fail(`layout.${section}.${item[key]} is missing`);
      Object.assign(item, geometry);
    }
  }
  for (const [id,scene] of Object.entries(d.insides)) {
    if (!d.layout.insides[id]) fail(`layout.insides.${id} is missing`);
    Object.assign(scene,d.layout.insides[id]);
  }
  for (const e of d.overviewEdges) if (!d.layout.overviewEdges[e.id]) fail(`layout.overviewEdges.${e.id} is missing`);
  d.insideMarkers = d.layout.insideMarkers;
  return d;
}

/** Authored markup is trusted project content, not user-submitted HTML. */
export function renderShell(template, d) {
  const pageSlots = d.page?.slots || {};
  const description = pageSlots.mapDescription || pageSlots.overviewDescription || d.page.title;
  const slots = {
    completionCount: `Tour complete · ${d.tour.length} steps`,
    completionIntro: 'You have reached the end of this map.',
    completionLessons: '',
    nextToolUrl: '#',
    nextToolLabel: '',
    tourEntry: 'Take the guided tour',
    overviewDescription: pageSlots.mapDescription || description,
    mapDescription: pageSlots.overviewDescription || description,
    legend: Object.entries(d.roles).map(([key, role]) =>
      `<span class="lg"><span class="sw" style="--legend-hue:var(--h-${key})"></span>${role.label}</span>`
    ).join(''),
    ...pageSlots,
    overviewViewBox: '0 0 '+d.layout.viewBoxes.map0.join(' '),
    mapViewBox: '0 0 '+d.layout.viewBoxes.map.join(' '),
  };
  slots.nextToolHidden = slots.nextToolUrl && slots.nextToolLabel ? '' : 'hidden';
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in slots)) throw new Error(`Missing page slot: ${key}`);
    return slots[key];
  });
}

/** Role names and palettes belong to the definition; selectors are shared UI. */
export function roleStyles(d) {
  const hues = theme => Object.entries(d.roles).map(([key,r])=>`--h-${key}:${r[theme]};`).join('');
  const fills = theme => Object.entries(d.roles).map(([key,r])=>`--ml-fill-${key}:${r[theme]};`).join('');
  const aliases = Object.entries(d.settings.appearanceRoles).map(([key,role])=>`--map-${key}:var(--h-${role});--map-${key}-fill:var(--ml-fill-${role});`).join('');
  const vb=d.layout.viewBoxes;
  return `:root{${hues('light')}}
    @media(prefers-color-scheme:dark){:root{${hues('dark')}}}
    :root[data-theme="dark"]{${hues('dark')}}
    :root[data-theme="light"]{${hues('light')}}
    .stagecard{${fills('fillLight')}}
    :root[data-theme="dark"] .stagecard{${fills('fillDark')}}
    @media(prefers-color-scheme:dark){:root:not([data-theme]) .stagecard{${fills('fillDark')}}}
    :root,.stagecard{${aliases}}
    .stagecard{--map-ratio:${vb.map[0]} / ${vb.map[1]};--overview-ratio:${vb.map0[0]} / ${vb.map0[1]};}`;
}
