// src/template.html?raw
var template_default = "\n\n\n\n<section class=\"controls\" aria-label=\"{{ui.controlsLabel}}\">\n  <div class=\"flow-controls\" id=\"flowControls\">\n    <div class=\"cgroup flow-field\">\n      <div class=\"clabel\" id=\"flowLabel\">{{ui.flowLabel}}</div>\n      <details class=\"flow-picker\" id=\"flowPicker\">\n        <summary aria-labelledby=\"flowLabel flowSelected\"><span class=\"flow-dot\" aria-hidden=\"true\"></span><span id=\"flowSelected\">{{ui.flowChoose}}</span><svg class=\"flow-chevron\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg></summary>\n        <div class=\"flow-menu\" aria-label=\"{{ui.flowMenu}}\">\n          <div class=\"flow-option-group\" role=\"group\" aria-labelledby=\"systemFlowsLabel\"><div class=\"flow-options-label\" id=\"systemFlowsLabel\">{{ui.flowsSystem}}</div><div id=\"storyOptions\"></div></div>\n          <div class=\"flow-option-group\" role=\"group\" aria-labelledby=\"failureFlowsLabel\"><div class=\"flow-options-label\" id=\"failureFlowsLabel\">{{ui.flowsFailure}}</div><div id=\"failureOptions\"></div></div>\n        </div>\n      </details>\n    </div>\n    <button type=\"button\" class=\"flow-play\" id=\"playFlow\"><svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M3 1.5 14 8 3 14.5Z\"/></svg><span>{{ui.flowPlay}}</span></button>\n  </div>\n  <div class=\"cgroup build-controls\">\n    <div class=\"clabel\">{{ui.buildControl}}</div>\n    <div class=\"seg\" id=\"weekSeg\"></div>\n  </div>\n  <div class=\"cgroup tour-controls\" id=\"tourControls\">\n    <div class=\"clabel\" id=\"tourLabel\" hidden>{{ui.tourNew}}</div>\n    <button type=\"button\" class=\"tour-entry\" id=\"tourBtn\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 8.6v6.8l5.6-3.4z\" fill=\"currentColor\"/></svg><span id=\"tourBtnText\">{{ui.tourEntry}}</span></button>\n    <button type=\"button\" class=\"files-entry\" id=\"filesBtn\" aria-pressed=\"false\" hidden><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 4v13a2 2 0 0 0 2 2h3M4 9h5\"/><rect x=\"11\" y=\"6\" width=\"9\" height=\"6\" rx=\"1.5\"/><rect x=\"11\" y=\"15\" width=\"9\" height=\"6\" rx=\"1.5\"/></svg><span id=\"filesBtnText\"></span></button>\n  </div>\n  <button type=\"button\" class=\"help-toggle\" id=\"helpBtn\" aria-expanded=\"false\" aria-controls=\"helpPop\" aria-label=\"{{ui.helpTitle}}\" title=\"{{ui.helpTitle}}\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.6 9.3a2.5 2.5 0 0 1 4.85.85c0 1.65-2.45 2.2-2.45 3.6\"/><path d=\"M12 17h.01\"/></svg></button>\n  <div class=\"help-pop\" id=\"helpPop\" role=\"dialog\" aria-labelledby=\"helpHead\" tabindex=\"-1\" hidden>\n    <div class=\"help-head\" id=\"helpHead\">{{ui.helpTitle}}</div>\n    <ul class=\"help-list\" id=\"helpList\"></ul>\n  </div>\n  <button type=\"button\" class=\"theme-toggle\" id=\"themeToggle\" aria-label=\"{{ui.themeToDark}}\" title=\"{{ui.themeTitle}}\"><svg class=\"ico-moon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/></svg><svg class=\"ico-sun\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\"/></svg></button>\n\n</section>\n<div id=\"ctrlSlot\" hidden></div>\n\n<main class=\"wrap\">\n  <div class=\"stagecard\">\n\n    <div class=\"tourbar\" id=\"tourBar\">\n      <div class=\"tb-text\"><div class=\"tb-eyebrow\">{{ui.tourTitle}}</div><div class=\"tb-status\" id=\"tourStatus\"></div></div>\n      <ol class=\"tb-chapters\" id=\"tourChapters\" aria-label=\"{{ui.tourChapters}}\"></ol>\n      <button type=\"button\" class=\"crumbbtn tb-exit\" id=\"tourExit\">{{ui.tourExit}}</button>\n    </div>\n    <div class=\"crumbbar\">\n      <button class=\"crumbbtn\" id=\"toL0\" hidden>&lsaquo; {{ui.backToBigPicture}}</button>\n      <span class=\"crumbnote\" id=\"crumbNote\">{{ui.bigPicture}}</span>\n      <button class=\"crumbbtn\" id=\"toL1\">{{ui.openFullMap}}</button>\n      <button class=\"crumbbtn\" id=\"unfocus\" hidden></button>\n\n      <button class=\"crumbbtn\" id=\"panelBtn\" hidden>{{ui.showPanel}}</button>\n      <button class=\"crumbbtn\" id=\"fsBtn\">{{ui.fullScreen}}</button>\n    </div>\n    <div class=\"stage-scroll\">\n      <span class=\"zoomctl\" id=\"zoomCtl\" role=\"group\" aria-label=\"{{ui.zoomGroup}}\">\n        <button type=\"button\" class=\"crumbbtn\" id=\"zoomOut\" aria-label=\"{{ui.zoomOut}}\" title=\"{{ui.zoomOut}}\">−</button>\n        <button type=\"button\" class=\"crumbbtn\" id=\"zoomFit\" aria-label=\"{{ui.zoomFitTitle}}\" title=\"{{ui.zoomFitTitle}}\">{{ui.zoomFit}}</button>\n        <button type=\"button\" class=\"crumbbtn\" id=\"zoomIn\" aria-label=\"{{ui.zoomIn}}\" title=\"{{ui.zoomIn}}\">+</button>\n      </span>\n      <svg id=\"map0\" class=\"mapsvg ml-canvas\" viewBox=\"{{overviewViewBox}}\" role=\"img\"\n        aria-label=\"{{overviewDescription}}\"></svg>\n      <svg id=\"map\" class=\"mapsvg ml-canvas\" viewBox=\"{{mapViewBox}}\" role=\"img\" style=\"display:none\"\n        aria-label=\"{{mapDescription}}\"></svg>\n    </div>\n    <div class=\"legend ml-canvas\">{{legend}}</div>\n    <div class=\"inside\" id=\"inside\" hidden>\n      <button class=\"crumbbtn\" id=\"insideBack\">&lsaquo; {{ui.backToMap}}</button>\n      <h2 id=\"insideTitle\"></h2>\n      <p class=\"i-sub\" id=\"insideSub\"></p>\n      <div id=\"insideScene\"></div>\n      <p class=\"i-cap\" id=\"insideCap\"></p>\n    </div>\n    <div class=\"files\" id=\"files\" hidden>\n      <div class=\"crumbbar files-head\">\n        <button class=\"crumbbtn\" id=\"filesBack\">&lsaquo; {{ui.backToMap}}</button>\n        <span class=\"crumbnote\" id=\"filesTitle\"></span>\n      </div>\n      <div class=\"files-body\">\n        <div class=\"ft\" id=\"filesTree\" role=\"tree\" aria-labelledby=\"filesTitle\"></div>\n      </div>\n    </div>\n    <div class=\"drawer\" id=\"drawer\">\n      <div class=\"panelhead\"><button type=\"button\" class=\"crumbbtn drawerclose\" id=\"drawerClose\" aria-label=\"{{ui.closePanel}}\" title=\"{{ui.closePanel}}\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button></div>\n      <div id=\"drawerBody\"></div>\n    </div>\n    <section class=\"tourcard\" id=\"tourCard\" aria-labelledby=\"tcTitle\" hidden>\n      <div class=\"tc-scroll\" id=\"tcScroll\">\n      <div aria-live=\"polite\">\n        <div class=\"tc-eyebrow\"><span class=\"tc-dot\" aria-hidden=\"true\"></span><span id=\"tcEyebrow\"></span></div>\n        <h2 id=\"tcTitle\" tabindex=\"-1\"></h2>\n        <div class=\"tc-body\" id=\"tcBody\"></div>\n        <ol class=\"tc-list\" id=\"tcList\" hidden></ol>\n        <div class=\"tc-why\" id=\"tcWhy\"><div class=\"tc-why-label\">{{ui.why}}</div><p id=\"tcWhyText\"></p></div>\n      </div>\n      </div>\n      <p class=\"tc-hint\" id=\"tcHint\" hidden>{{ui.tourHint}}<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 5v14m-6-6 6 6 6-6\"/></svg></p>\n      <div class=\"tc-foot\">\n        <span class=\"tc-count\" id=\"tcCount\"></span>\n        <button type=\"button\" class=\"tc-back\" id=\"tcBack\">{{ui.tourBack}}</button>\n        <button type=\"button\" class=\"tc-next\" id=\"tcNext\">{{ui.tourNext}}</button>\n      </div>\n      <p class=\"tc-keys\" aria-hidden=\"true\"><kbd>&larr;</kbd> <kbd>&rarr;</kbd> {{ui.tourKeysMove}} <span>&middot;</span> <kbd>Esc</kbd> {{ui.tourKeysExit}}</p>\n    </section>\n    <div class=\"tourend\" id=\"tourEnd\" hidden>\n      <div class=\"tourend-card\" role=\"dialog\" aria-labelledby=\"teTitle\">\n        <div class=\"te-check\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></svg></div>\n        <div class=\"te-eyebrow\">{{ui.completionCount}}</div>\n        <h1 id=\"teTitle\" tabindex=\"-1\">{{ui.tourDone}}</h1>\n        <p class=\"te-lede\">{{completionIntro}}</p>\n        <ul class=\"te-list\">{{completionLessons}}</ul>\n\n        <div class=\"te-links\">\n          <button type=\"button\" id=\"teBack\">{{ui.backToMap}}</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <span id=\"panelSlot\" hidden></span>\n  <aside class=\"panel\" id=\"panel\">\n    <div class=\"panelhead\"><button type=\"button\" class=\"crumbbtn panelclose\" id=\"panelClose\" aria-label=\"{{ui.closePanel}}\" title=\"{{ui.closePanel}}\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button></div>\n    <div id=\"panelBody\"></div>\n  </aside>\n</main>\n";
// src/runtime/lifecycle.js
/** Owns side effects for one mounted tool. No global monkey patches. */
function createLifecycle() {
	let active = true;
	const abort = new AbortController();
	const frames = /* @__PURE__ */ new Set(), timers = /* @__PURE__ */ new Set(), observers = /* @__PURE__ */ new Set(), animations = /* @__PURE__ */ new Set();
	const pending = /* @__PURE__ */ new Set();
	return {
		cancellable(executor) {
			if (!active) return Promise.resolve();
			return new Promise((resolve, reject) => {
				const finish = (value) => {
					pending.delete(finish);
					resolve(value);
				};
				pending.add(finish);
				try {
					executor(finish);
				} catch (error) {
					pending.delete(finish);
					reject(error);
				}
			});
		},
		listen(target, event, listener, options) {
			if (!active) return;
			target.addEventListener(event, listener, {
				...typeof options === "boolean" ? { capture: options } : options,
				signal: abort.signal
			});
		},
		frame(callback) {
			if (!active) return 0;
			const id = requestAnimationFrame((time) => {
				frames.delete(id);
				if (active) callback(time);
			});
			frames.add(id);
			return id;
		},
		cancelFrame(id) {
			cancelAnimationFrame(id);
			frames.delete(id);
		},
		timeout(callback, delay) {
			if (!active) return 0;
			const id = setTimeout(() => {
				timers.delete(id);
				if (active) callback();
			}, delay);
			timers.add(id);
			return id;
		},
		clearTimeout(id) {
			clearTimeout(id);
			timers.delete(id);
		},
		ResizeObserver: class {
			constructor(callback) {
				this.observer = new ResizeObserver((...args) => {
					if (active) callback(...args);
				});
				observers.add(this.observer);
			}
			observe(...args) {
				this.observer.observe(...args);
			}
			disconnect() {
				this.observer.disconnect();
				observers.delete(this.observer);
			}
		},
		animate(element, keyframes, options) {
			const animation = element.animate(keyframes, options);
			animations.add(animation);
			animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
			if (!active) animation.cancel();
			return animation;
		},
		destroy() {
			active = false;
			abort.abort();
			frames.forEach(cancelAnimationFrame);
			timers.forEach(clearTimeout);
			observers.forEach((observer) => observer.disconnect());
			animations.forEach((animation) => animation.cancel());
			pending.forEach((finish) => finish());
			frames.clear();
			timers.clear();
			observers.clear();
			animations.clear();
		}
	};
}
/** Queries are scoped to the mount; browser fullscreen/focus APIs retain the real document. */
function scopedDocument(root) {
	return new Proxy(document, { get(target, name) {
		if (name === "getElementById") return (id) => root.querySelector(`[id="${CSS.escape(id)}"]`);
		if (name === "querySelector") return (selector) => root.querySelector(selector);
		if (name === "querySelectorAll") return (selector) => root.querySelectorAll(selector);
		const value = Reflect.get(target, name, target);
		return typeof value === "function" ? value.bind(target) : value;
	} });
}
// src/runtime/definition.js
/** Validate and hydrate a trusted definition without mutating the author's data. */
function prepareDefinition(input) {
	const d = structuredClone(input);
	const fail = (message) => {
		throw new Error(`Invalid map definition: ${message}`);
	};
	if (typeof d.id !== "string" || !d.id) fail("id must be a non-empty string");
	d.settings.storage = { tour: `${d.id}:tour` };
	const unique = (items, key, section) => {
		const ids = /* @__PURE__ */ new Set();
		for (const item of items) {
			if (!item[key] || ids.has(item[key])) fail(`${section}: missing or duplicate ${key} ${item[key]}`);
			ids.add(item[key]);
		}
		return ids;
	};
	const nodes = unique(d.nodes, "id", "nodes");
	const edges = unique(d.edges, "id", "edges");
	const zones = unique(d.zones, "id", "zones");
	const groups = new Set(Object.keys(d.groups));
	const requireRef = (set, id, owner) => {
		if (!set.has(id)) fail(`${owner}: unknown reference ${id}`);
	};
	for (const n of d.nodes) {
		requireRef(groups, n.group, `node ${n.id}.group`);
		if (n.zone) requireRef(zones, n.zone, `node ${n.id}.zone`);
		if (n.inside && !d.insides[n.inside]) fail(`node ${n.id}.inside: ${n.inside}`);
		if (n.logo && !d.logos[n.logo]) fail(`node ${n.id}.logo: ${n.logo}`);
		if (!d.roles[n.cat]) fail(`node ${n.id}.cat: ${n.cat}`);
		if (!d.icons[n.icon]) fail(`node ${n.id}.icon: ${n.icon}`);
		if (n.shape != null && ![
			"component",
			"person",
			"worker",
			"database",
			"queue",
			"external"
		].includes(n.shape)) fail(`node ${n.id}.shape: ${n.shape}`);
		if (!d.buildSteps[n.step]) fail(`node ${n.id}.step: ${n.step}`);
	}
	for (const e of d.edges) {
		requireRef(nodes, e.from, `edge ${e.id}.from`);
		requireRef(nodes, e.to, `edge ${e.id}.to`);
	}
	for (const [id, g] of Object.entries(d.groups)) for (const n of g.members) {
		requireRef(nodes, n, `group ${id}.members`);
		if (d.nodes.find((x) => x.id === n).group !== id) fail(`group ${id}.members: inconsistent node ${n}`);
	}
	for (const b of d.overview) requireRef(groups, b.g, "overview");
	for (const e of d.overviewEdges) {
		requireRef(groups, e.from, `overview edge ${e.id}.from`);
		requireRef(groups, e.to, `overview edge ${e.id}.to`);
	}
	for (const [id, f] of Object.entries(d.flows)) {
		for (const h of f.hops) {
			requireRef(edges, h.e, `flow ${id}.hops`);
			if (h.breaks) requireRef(nodes, h.breaks, `flow ${id}.breaks`);
			if (h.silent) requireRef(edges, h.silent.e, `flow ${id}.silent`);
		}
		for (const e of f.silent || []) requireRef(edges, e, `flow ${id}.silent`);
	}
	for (const step of d.buildSteps.filter(Boolean)) for (const n of step.nodes) requireRef(nodes, n, `build step ${step.title}`);
	for (const b of d.tour) {
		if (!d.tourChapters[b.ch]) fail(`tour ${b.title}.ch: ${b.ch}`);
		if (b.flow && !d.flows[b.flow]) fail(`tour ${b.title}.flow: ${b.flow}`);
	}
	if (!d.tour.length) fail("tour: at least one step is required");
	const finalBeat = d.tour[d.tour.length - 1];
	if (!finalBeat.flow && !finalBeat.whole) fail("tour: the final step must walk a flow or recap the whole map");
	d.tourChapters.forEach((chapter, index) => {
		const beats = d.tour.filter((beat) => beat.ch === index).length;
		if (!beats) fail(`tourChapters[${index}]: must contain at least one tour step`);
		chapter.span = beats;
	});
	for (const g of d.settings.recapOrder) requireRef(groups, g, "settings.recapOrder");
	if (!d.layout) fail("layout is required for authored geometry; automatic layout is not implemented");
	for (const [section, key] of [
		["nodes", "id"],
		["edges", "id"],
		["zones", "id"],
		["overview", "g"]
	]) for (const item of d[section]) {
		const geometry = d.layout[section]?.[item[key]];
		if (!geometry) fail(`layout.${section}.${item[key]} is missing`);
		Object.assign(item, geometry);
	}
	for (const [id, scene] of Object.entries(d.insides)) {
		if (scene.kind != null) {
			if (scene.kind === "steps" && !(Array.isArray(scene.steps) && scene.steps.length)) fail(`insides.${id}.steps must be a non-empty list`);
			else if (scene.kind === "schema" && !(Array.isArray(scene.tables) && scene.tables.length)) fail(`insides.${id}.tables must be a non-empty list`);
			else if (!["steps", "schema"].includes(scene.kind)) fail(`insides.${id}.kind: ${scene.kind}`);
			scene.source = d.source;
			continue;
		}
		if (!d.layout.insides?.[id]) fail(`layout.insides.${id} is missing`);
		Object.assign(scene, d.layout.insides[id]);
	}
	if (d.files != null) {
		const entries = d.files.entries;
		if (!Array.isArray(entries) || !entries.length) fail("files.entries must be a non-empty list of paths");
		const paths = /* @__PURE__ */ new Set();
		entries.forEach((e, i) => {
			const path = e?.path, key = typeof path === "string" ? path.replace(/\/$/, "") : "";
			if (!key || path.startsWith("/") || path.includes("//") || key.split("/").includes("..")) fail(`files.entries[${i}].path: ${path}`);
			if (paths.has(key)) fail(`files.entries[${i}].path ${path} is listed twice`);
			paths.add(key);
			if (typeof e.t !== "string" || !e.t.trim()) fail(`files.entries[${i}] (${path}) needs t`);
			for (const n of e.nodes || []) requireRef(nodes, n, `files.entries[${i}].nodes`);
		});
	}
	for (const e of d.overviewEdges) if (!d.layout.overviewEdges[e.id]) fail(`layout.overviewEdges.${e.id} is missing`);
	d.insideMarkers = d.layout.insideMarkers;
	return d;
}
/** Authored markup is trusted project content, not user-submitted HTML.
*  {{key}} is a page slot; {{ui.key}} is an interface string from d.ui, always plain text. */
function renderShell(template, d) {
	const pageSlots = d.page?.slots || {};
	const description = pageSlots.mapDescription || pageSlots.overviewDescription || d.page.title;
	const slots = {
		completionIntro: "You have reached the end of this map.",
		completionLessons: "",
		overviewDescription: pageSlots.mapDescription || description,
		mapDescription: pageSlots.overviewDescription || description,
		legend: Object.entries(d.roles).map(([key, role]) => `<span class="lg"><span class="sw" style="--legend-hue:var(--h-${key})"></span>${role.label}</span>`).join(""),
		...pageSlots,
		overviewViewBox: "0 0 " + d.layout.viewBoxes.map0.join(" "),
		mapViewBox: "0 0 " + d.layout.viewBoxes.map.join(" ")
	};
	const text = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
	slots.overviewDescription = text(slots.overviewDescription);
	slots.mapDescription = text(slots.mapDescription);
	const ui = {
		...d.ui,
		completionCount: formatText(d.ui.completionCount, { steps: d.tour.length })
	};
	return template.replace(/\{\{(ui\.)?(\w+)\}\}/g, (_, isUi, key) => {
		const source = isUi ? ui : slots;
		if (!(key in source)) throw new Error(`Missing ${isUi ? "ui string" : "page slot"}: ${key}`);
		return isUi ? text(source[key]) : source[key];
	});
}
/** "{step} of {total}" with values filled in; unknown names become empty. */
function formatText(pattern, values) {
	return String(pattern).replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
/** Role names and palettes belong to the definition; selectors are shared UI. */
function roleStyles(d) {
	const hues = (theme) => Object.entries(d.roles).map(([key, r]) => `--h-${key}:${r[theme]};`).join("");
	const fills = (theme) => Object.entries(d.roles).map(([key, r]) => `--ml-fill-${key}:${r[theme]};`).join("");
	const aliases = Object.entries(d.settings.appearanceRoles).map(([key, role]) => `--map-${key}:var(--h-${role});--map-${key}-fill:var(--ml-fill-${role});`).join("");
	const vb = d.layout.viewBoxes;
	return `:root{${hues("light")}}
    @media(prefers-color-scheme:dark){:root{${hues("dark")}}}
    :root[data-theme="dark"]{${hues("dark")}}
    :root[data-theme="light"]{${hues("light")}}
    .stagecard{${fills("fillLight")}}
    :root[data-theme="dark"] .stagecard{${fills("fillDark")}}
    @media(prefers-color-scheme:dark){:root:not([data-theme]) .stagecard{${fills("fillDark")}}}
    :root,.stagecard{${aliases}}
    .stagecard{--map-ratio:${vb.map[0]} / ${vb.map[1]};--overview-ratio:${vb.map0[0]} / ${vb.map0[1]};}`;
}
// src/runtime/env.js
/** What the page gives every module: the scoped document, listeners and timers that are cleaned
*  up on destroy, interface strings, media queries and storage. Read only. */
function createEnv(root, definition) {
	const scope = createLifecycle();
	return {
		scope,
		document: scopedDocument(root),
		requestAnimationFrame: scope.frame,
		cancelAnimationFrame: scope.cancelFrame,
		setTimeout: scope.timeout,
		clearTimeout: scope.clearTimeout,
		ResizeObserver: scope.ResizeObserver,
		format: formatText,
		t: (key, values = {}) => formatText(definition.ui[key] ?? key, values),
		reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		phoneQuery: window.matchMedia("(max-width: 640px)"),
		wideQuery: window.matchMedia("(min-width: 981px)"),
		param(key) {
			return new URLSearchParams(location.hash.slice(1)).get(key) || new URLSearchParams(location.search).get(key);
		},
		store: {
			get(key) {
				try {
					return localStorage.getItem(key);
				} catch (err) {
					return null;
				}
			},
			set(key, value) {
				try {
					localStorage.setItem(key, value);
				} catch (err) {}
			}
		}
	};
}
// src/runtime/model.js
/** The map's content as the viewer uses it, taken from the prepared definition. Read only. */
function createModel(definition) {
	const HUES = Object.fromEntries(Object.keys(definition.roles).map((key) => [key, `--h-${key}`]));
	const TOUR = definition.tour;
	const STORIES = definition.flows;
	const flowEnd = (b) => b.hops ? b.hops[1] : STORIES[b.flow].hops.length;
	const beatStart = (b) => b.hops ? b.hops[0] : 0;
	return {
		definition,
		HUES,
		hue: (k) => `var(${HUES[k]})`,
		ICONS: definition.icons,
		ZONES: definition.zones,
		NODES: definition.nodes,
		EDGES: definition.edges,
		GROUPS: definition.groups,
		L0: definition.overview,
		STORIES,
		WEEKS: definition.buildSteps,
		IMARK: definition.insideMarkers,
		INSIDES: definition.insides,
		VB: definition.layout.viewBoxes,
		TOUR_CHAPTERS: definition.tourChapters,
		TOUR,
		TOUR_TOTAL: TOUR.length + 1,
		BEAT_SECONDS: definition.beatSeconds,
		FLOW_BEAT_SECONDS: definition.flowBeatSeconds,
		SWEEP: definition.settings.recapOrder,
		PATH_ZOOM_MAX: 1.6,
		SHOT_SLACK: .85,
		flowEnd,
		beatStart,
		edgeCount: (b) => flowEnd(b) - beatStart(b)
	};
}
// src/runtime/state.js
/** Everything about the viewer that changes while someone reads the map, in one place. Each field
*  has one owner, the only module that writes it; the others read it at the moment they need it
*  (never copy a field into a local variable ahead of time) or ask the owner through its functions. */
function createState() {
	return {
		level: 0,
		focused: null,
		viewMode: "concepts",
		selected: null,
		week: 0,
		fsMode: false,
		preFsOpen: true,
		zoom: 1,
		tx: 0,
		ty: 0,
		camTimer: null,
		tourCam: {
			fitZoom: 1,
			token: 0,
			manual: false,
			shot: -2,
			shotMove: null
		},
		storyToken: 0,
		dot: null,
		chosenFlow: null,
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
// src/rendering/ml-canvas.js
var font = "\"Manrope\", system-ui, sans-serif";
var setRole = (group, role) => {
	group.style.color = `var(--h-${role})`;
	group.style.setProperty("--ml-node-fill", `var(--ml-fill-${role})`);
};
var element = (tag, attrs, parent) => {
	const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
	Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
	parent.appendChild(node);
	return node;
};
var SHAPES = [
	"component",
	"person",
	"worker",
	"database",
	"queue",
	"external"
];
function card(parent, { x, y, width, height, overview = false, shape }) {
	if (overview) return element("rect", {
		x,
		y,
		width,
		height,
		class: "brect"
	}, parent);
	const kind = SHAPES.includes(shape) ? shape : "component";
	parent.classList.add("shape-" + kind);
	if (kind === "worker") for (const off of [10, 5]) element("rect", {
		x: x + off,
		y: y + off,
		width,
		height,
		class: "nstack"
	}, parent);
	if (kind === "database") {
		const ry = 9, r = x + width, b = y + height;
		const body = element("path", {
			class: "nrect",
			d: `M${x},${y + ry} A${width / 2},${ry} 0 0 1 ${r},${y + ry} V${b - ry} A${width / 2},${ry} 0 0 1 ${x},${b - ry} Z`
		}, parent);
		element("path", {
			class: "ncap",
			d: `M${x},${y + ry} A${width / 2},${ry} 0 0 0 ${r},${y + ry}`
		}, parent);
		return body;
	}
	if (kind === "queue") {
		const rx = 13, rr = height / 2, r = x + width - rx;
		const body = element("path", {
			class: "nrect",
			d: `M${x + rr},${y} H${r} A${rx},${rr} 0 0 1 ${r},${y + height} H${x + rr} A${rr},${rr} 0 0 1 ${x + rr},${y} Z`
		}, parent);
		element("ellipse", {
			class: "ncap",
			cx: r,
			cy: y + rr,
			rx,
			ry: rr
		}, parent);
		return body;
	}
	const attrs = {
		x,
		y,
		width,
		height,
		class: "nrect"
	};
	if (kind === "person") attrs.rx = attrs.ry = height / 2;
	return element("rect", attrs, parent);
}
function iconTile(parent, x, y, size, markup) {
	const tile = element("rect", {
		x,
		y,
		width: size,
		height: size,
		rx: size / 2,
		class: "nicon-tile",
		"aria-hidden": "true"
	}, parent);
	const inset = (size - 22) / 2;
	const icon = element("g", {
		transform: `translate(${x + inset},${y + inset}) scale(1.1)`,
		class: "nicon",
		stroke: "currentColor",
		"aria-hidden": "true"
	}, parent);
	icon.innerHTML = markup;
	return {
		tile,
		icon
	};
}
function brandTile(parent, x, y, size, fallbackMarkup, logo) {
	const { tile, icon } = iconTile(parent, x, y, size, fallbackMarkup);
	tile.classList.add("logo-tile");
	if (logo.tile) {
		tile.style.fill = logo.tile;
		tile.classList.add("brand-tile");
	}
	const inset = (size - logo.size) / 2;
	const image = element("image", {
		x: x + inset,
		y: y + inset,
		width: logo.size,
		height: logo.size,
		preserveAspectRatio: "xMidYMid meet",
		class: "nlogo",
		visibility: "hidden",
		"aria-hidden": "true"
	}, parent);
	image.addEventListener("load", () => {
		image.dataset.loaded = "true";
		image.removeAttribute("visibility");
		icon.setAttribute("visibility", "hidden");
	});
	image.addEventListener("error", () => {
		image.remove();
		icon.removeAttribute("visibility");
	});
	image.setAttribute("href", logo.src);
}
function roundPath(path, radius = 16) {
	const points = [...path.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map((m) => ({
		x: +m[1],
		y: +m[2]
	}));
	if (points.length < 2) return path;
	let d = `M${points[0].x},${points[0].y}`;
	for (let i = 1; i < points.length - 1; i++) {
		const [a, b, c] = [
			points[i - 1],
			points[i],
			points[i + 1]
		];
		const ab = Math.hypot(b.x - a.x, b.y - a.y), bc = Math.hypot(c.x - b.x, c.y - b.y);
		if (!ab || !bc) continue;
		const r = Math.min(radius, ab / 2, bc / 2);
		d += ` L${b.x + (a.x - b.x) * r / ab},${b.y + (a.y - b.y) * r / ab} Q${b.x},${b.y} ${b.x + (c.x - b.x) * r / bc},${b.y + (c.y - b.y) * r / bc}`;
	}
	const end = points.at(-1);
	return d + ` L${end.x},${end.y}`;
}
function prepareLayout(nodes, edges, zones, scale = {
	x: 1,
	y: 1
}) {
	const sx = scale.x, sy = scale.y;
	const ctx = document.createElement("canvas").getContext("2d");
	ctx.font = `600 13.5px ${font}`;
	nodes.forEach((n) => {
		n.original = {
			x: n.x * sx,
			y: n.y * sy,
			w: n.w * sx,
			h: n.h * sy
		};
		n.w = Math.max(168, Math.ceil(Math.max(ctx.measureText(n.tool).width, ctx.measureText(n.concept).width) + 76)) + (n.shape === "queue" ? 26 : 0);
		n.h = 72;
		n.x = n.original.x + n.original.w / 2 - n.w / 2;
		n.y = n.original.y + n.original.h / 2 - n.h / 2;
	});
	zones.forEach((z) => {
		z.x *= sx;
		z.y *= sy;
		z.w *= sx;
		z.h *= sy;
	});
	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
	edges.forEach((e) => {
		const points = [...e.d.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map((m) => ({
			x: +m[1] * sx,
			y: +m[2] * sy
		}));
		const snap = (idx, id) => {
			const n = byId[id], o = n.original, p = points[idx], old = { ...p };
			const side = [
				["l", Math.abs(p.x - o.x)],
				["r", Math.abs(p.x - o.x - o.w)],
				["t", Math.abs(p.y - o.y)],
				["b", Math.abs(p.y - o.y - o.h)]
			].sort((a, b) => a[1] - b[1])[0][0];
			if (side === "l" || side === "r") {
				p.x = side === "l" ? n.x : n.x + n.w;
				p.y = Math.max(n.y + 14, Math.min(n.y + n.h - 14, p.y));
			} else {
				p.y = side === "t" ? n.y : n.y + n.h;
				p.x = Math.max(n.x + 18, Math.min(n.x + n.w - 18, p.x));
			}
			const step = idx === 0 ? 1 : -1;
			for (let j = idx + step; points[j] && Math.abs(points[j].x - old.x) < .1; j += step) points[j].x = p.x;
			for (let j = idx + step; points[j] && Math.abs(points[j].y - old.y) < .1; j += step) points[j].y = p.y;
		};
		snap(0, e.from);
		snap(points.length - 1, e.to);
		e.d = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
		if (e.lx != null) {
			e.lx *= sx;
			e.ly *= sy;
		}
		if (e.ldx) e.ldx *= sx;
		if (e.ldy) e.ldy *= sy;
	});
}
function wrapText(text, width, textFont) {
	const ctx = document.createElement("canvas").getContext("2d");
	ctx.font = textFont;
	const lines = [];
	let line = "";
	text.split(/\s+/).forEach((word) => {
		const candidate = line ? line + " " + word : word;
		if (line && ctx.measureText(candidate).width > width) {
			lines.push(line);
			line = word;
		} else line = candidate;
	});
	if (line) lines.push(line);
	return lines;
}
var ml_canvas_default = Object.freeze({
	setRole,
	card,
	iconTile,
	brandTile,
	roundPath,
	prepareLayout,
	wrapText
});
// src/runtime/scene.js
/** Draws the map: the big picture (map0) and the full map (map) with its zones, edges, labels and
*  component cards. Returns the drawn elements for the modules that light, move and frame them.
*  `on` receives a reader's click on an overview card (openGroup) or a component (selectNode). */
async function createScene({ scope, document, t }, { definition, HUES, hue, ICONS, ZONES, NODES, EDGES, GROUPS, L0 }, on) {
	const SVGNS = "http://www.w3.org/2000/svg";
	const logos = definition.logos;
	const svg0 = document.getElementById("map0");
	const svg = document.getElementById("map");
	function el(tag, attrs, parent) {
		const n = document.createElementNS(SVGNS, tag);
		for (const k in attrs) n.setAttribute(k, attrs[k]);
		if (parent) parent.appendChild(n);
		return n;
	}
	await Promise.all([
		document.fonts.load("600 13.5px \"Manrope\""),
		document.fonts.load("400 11px \"Manrope\""),
		document.fonts.load("500 9.5px \"Manrope\""),
		document.fonts.load("700 19px \"Manrope\""),
		document.fonts.load("600 12px \"Manrope\"")
	]).catch(() => {});
	const canvas = ml_canvas_default;
	const labelCtx = document.createElement("canvas").getContext("2d");
	function longestRun(d) {
		const pts = [...d.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map((m) => ({
			x: +m[1],
			y: +m[2]
		}));
		let best = null;
		for (let i = 0; i < pts.length - 1; i++) {
			const len = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
			if (!best || len > best.len) best = {
				len,
				horiz: Math.abs(pts[i + 1].y - pts[i].y) < 1,
				x: (pts[i].x + pts[i + 1].x) / 2,
				y: (pts[i].y + pts[i + 1].y) / 2
			};
		}
		return best;
	}
	const BW = definition.layout.overviewCard.width, BH = definition.layout.overviewCard.height;
	L0.forEach((b, i) => {
		const G = GROUPS[b.g], BY = b.y;
		const g = el("g", {
			class: "block",
			tabindex: "0",
			role: "button",
			"aria-label": G.title + ". " + G.line1 + " " + G.line2
		}, svg0);
		canvas.setRole(g, G.huekey);
		const role = definition.roles?.[G.huekey];
		const rect = canvas.card(g, {
			x: b.x,
			y: BY,
			width: BW,
			height: BH,
			overview: true
		});
		if (G.huekey === "person") rect.classList.add("b-person");
		if (G.huekey === "external") rect.classList.add("b-external");
		const pad = 22, tile = 44;
		canvas.iconTile(g, b.x + pad, BY + pad, tile, ICONS[G.icon]);
		el("text", {
			x: b.x + BW - pad,
			y: BY + pad + 14,
			class: "bstep",
			"text-anchor": "end"
		}, g).textContent = String(i + 1).padStart(2, "0");
		const tx = b.x + pad + tile + 14;
		const titleLines = canvas.wrapText(G.title, b.x + BW - pad - 30 - tx, "700 19px \"Manrope\"").slice(0, 2);
		const head = titleLines.length * 23 + 18;
		const hy = BY + pad + Math.max(0, (tile - head) / 2);
		titleLines.forEach((line, row) => {
			el("text", {
				x: tx,
				y: hy + 17 + row * 23,
				class: "btitle"
			}, g).textContent = line;
		});
		el("text", {
			x: tx,
			y: hy + titleLines.length * 23 + 13,
			class: "bkind"
		}, g).textContent = role?.label || "";
		const top = BY + pad + Math.max(tile, head) + 22;
		const footY = BY + BH - 42;
		const maxLines = Math.max(1, Math.floor((footY - 10 - top) / 21) + 1);
		let desc = canvas.wrapText(G.line1 + " " + G.line2, BW - 44, "400 14.5px \"Manrope\"");
		if (desc.length > maxLines) desc = desc.slice(0, maxLines).map((l, k) => k === maxLines - 1 ? l.replace(/\s*\S*$/, "") + "…" : l);
		desc.forEach((line, row) => {
			el("text", {
				x: b.x + pad,
				y: top + row * 21,
				class: "bline"
			}, g).textContent = line;
		});
		el("line", {
			x1: b.x + pad,
			x2: b.x + BW - pad,
			y1: footY,
			y2: footY,
			class: "brule"
		}, g);
		el("text", {
			x: b.x + pad,
			y: footY + 24,
			class: "btools"
		}, g).textContent = G.chips;
		el("text", {
			x: b.x + BW - pad,
			y: footY + 24,
			class: "bgo",
			"text-anchor": "end"
		}, g).textContent = t("cardOpen");
		const act = () => on.openGroup(b.g);
		scope.listen(g, "click", act);
		scope.listen(g, "keydown", (ev) => {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				act();
			}
		});
	});
	{
		el("path", {
			d: "M0,0 L10,5 L0,10 z",
			fill: "var(--ml-wire)"
		}, el("marker", {
			id: "arr0",
			viewBox: "0 0 10 10",
			refX: "8",
			refY: "5",
			markerWidth: "7",
			markerHeight: "7",
			orient: "auto-start-reverse"
		}, el("defs", {}, svg0)));
		const edge = (d, text, x, y, anchor, dashed) => {
			el("path", Object.assign({
				d,
				class: "l0edge",
				"marker-end": "url(#arr0)"
			}, dashed ? { "stroke-dasharray": "5 4" } : {}), svg0);
			const start = d.match(/M([\d.-]+),([\d.-]+)/);
			if (start) el("circle", {
				cx: start[1],
				cy: start[2],
				r: 3,
				class: "l0start"
			}, svg0);
			labelCtx.font = "600 12px \"Manrope\"";
			const w = labelCtx.measureText(text).width + 20;
			const run = longestRun(d);
			if (!text) return;
			if (run && (run.horiz ? run.len >= w + 24 : run.len >= 40)) {
				const chip = el("g", { class: "l0chip" }, svg0);
				el("rect", {
					x: run.x - w / 2,
					y: run.y - 11,
					width: w,
					height: 22,
					rx: 11
				}, chip);
				el("text", {
					x: run.x,
					y: run.y + 4.2,
					"text-anchor": "middle"
				}, chip).textContent = text;
				return;
			}
			const lab = el("text", {
				x,
				y,
				class: "l0lab",
				style: "text-anchor: " + anchor
			}, svg0);
			lab.textContent = text;
		};
		definition.overviewEdges.forEach((connection) => {
			const geo = definition.layout.overviewEdges[connection.id];
			edge(geo.d, connection.label, geo.x, geo.y, geo.anchor, connection.dashed);
		});
	}
	const defs = el("defs", {}, svg);
	Object.keys(HUES).concat(["base"]).forEach((k) => {
		const m = el("marker", {
			id: "arr-" + k,
			viewBox: "0 0 10 10",
			refX: "8",
			refY: "5",
			markerWidth: "7",
			markerHeight: "7",
			orient: "auto-start-reverse"
		}, defs);
		el("path", {
			d: "M0,0 L10,5 L0,10 z",
			fill: k === "base" ? "var(--edge)" : hue(k)
		}, m);
	});
	canvas.prepareLayout(NODES, EDGES, ZONES, definition.layout.scale);
	const zoneLayer = el("g", {}, svg);
	const edgeLayer = el("g", {}, svg);
	const nodeLayer = el("g", {}, svg);
	const storyLayer = el("g", {}, svg);
	const zoneEls = ZONES.map((z) => {
		const g = el("g", { class: "zone" }, zoneLayer);
		el("rect", {
			x: z.x,
			y: z.y,
			width: z.w,
			height: z.h,
			rx: 12,
			class: "zone-r"
		}, g);
		el("text", {
			x: z.x + 16,
			y: z.y + 24,
			class: "zone-t"
		}, g).textContent = z.label;
		return {
			g,
			members: NODES.filter((n) => n.zone === z.id)
		};
	});
	definition.layout.annotations.forEach((annotation) => {
		const index = ZONES.findIndex((zone) => zone.id === annotation.zone);
		const parent = zoneEls[index]?.g || zoneLayer;
		el("rect", {
			...annotation.rect,
			class: "hostchip"
		}, parent);
		el("text", {
			...annotation.text,
			class: "hostchip-t"
		}, parent).textContent = annotation.label;
	});
	function placeLabel(e) {
		const pts = [];
		e.d.replace(/[ML]([\d.-]+),([\d.-]+)/g, (_, x, y) => {
			pts.push({
				x: +x,
				y: +y
			});
			return "";
		});
		let a = pts[0], b = pts[1];
		for (let i = 1; i < pts.length - 1; i++) if (Math.abs(pts[i + 1].x - pts[i].x) + Math.abs(pts[i + 1].y - pts[i].y) > Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) {
			a = pts[i];
			b = pts[i + 1];
		}
		const horiz = Math.abs(b.y - a.y) < 1;
		let pos = horiz ? {
			lx: (a.x + b.x) / 2,
			ly: a.y - 11,
			anchor: "middle"
		} : {
			lx: a.x + 10,
			ly: (a.y + b.y) / 2 + 4,
			anchor: "start"
		};
		if (e.lside === "below" && horiz) pos.ly = a.y + 15;
		if (e.lside === "left" && !horiz) {
			pos.lx = a.x - 8;
			pos.anchor = "end";
		}
		pos.lx += e.ldx || 0;
		pos.ly += e.ldy || 0;
		return pos;
	}
	const edgeEls = {};
	EDGES.forEach((e) => {
		const p = el("path", {
			d: canvas.roundPath(e.d),
			class: "epath",
			"marker-end": "url(#arr-base)"
		}, edgeLayer);
		if (e.bidir) p.setAttribute("marker-start", "url(#arr-base)");
		let lab = null, mid = null;
		if (e.label) {
			const pos = e.lx != null ? {
				lx: e.lx,
				ly: e.ly,
				anchor: e.anchor
			} : placeLabel(e);
			lab = el("text", {
				x: pos.lx,
				y: pos.ly,
				class: "elabel",
				"text-anchor": pos.anchor || "middle"
			}, edgeLayer);
			lab.textContent = e.label;
			const run = longestRun(e.d);
			labelCtx.font = "500 9.5px \"Manrope\"";
			const w = labelCtx.measureText(e.label).width + 14;
			if (run && run.len >= w + 18) {
				const g = el("g", { class: "elabel echip" }, edgeLayer);
				el("rect", {
					x: run.x - w / 2,
					y: run.y - 8,
					width: w,
					height: 16,
					rx: 8
				}, g);
				lab.setAttribute("x", run.x);
				lab.setAttribute("y", run.y + 3.4);
				lab.setAttribute("text-anchor", "middle");
				lab.removeAttribute("class");
				g.appendChild(lab);
				lab = g;
				mid = run;
			}
		}
		edgeEls[e.id] = {
			def: e,
			path: p,
			label: lab,
			mid
		};
	});
	const nodeEls = {};
	NODES.forEach((n) => {
		const g = el("g", {
			class: "node" + (n.art ? " isart" : ""),
			tabindex: "0",
			role: "button",
			"data-node": n.id,
			"aria-label": n.tool + ", " + n.concept
		}, nodeLayer);
		canvas.setRole(g, n.cat);
		const r = canvas.card(g, {
			x: n.x,
			y: n.y,
			width: n.w,
			height: n.h,
			shape: n.shape
		});
		const logo = n.logo && logos?.[n.logo];
		if (logo) canvas.brandTile(g, n.x + 12, n.y + (n.h - 36) / 2, 36, ICONS[n.icon], logo);
		else canvas.iconTile(g, n.x + 12, n.y + (n.h - 36) / 2, 36, ICONS[n.icon]);
		const tx = n.x + 59, cy = n.y + n.h / 2 + (n.shape === "database" ? 4 : 0);
		const l1 = el("text", {
			x: tx,
			y: cy - 5,
			class: "l1"
		}, g);
		const l2 = el("text", {
			x: tx,
			y: cy + 16,
			class: "l2"
		}, g);
		nodeEls[n.id] = {
			def: n,
			g,
			rect: r,
			l1,
			l2
		};
		scope.listen(g, "click", () => on.selectNode(n.id));
		scope.listen(g, "keydown", (ev) => {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				on.selectNode(n.id);
			}
		});
	});
	const nodeBox = (id) => nodeEls[id].g.getBBox();
	const allNodeBoxes = () => NODES.map((n) => nodeBox(n.id));
	const hopBoxes = (ee) => [
		ee.path.getBBox(),
		nodeEls[ee.def.from].g.getBBox(),
		nodeEls[ee.def.to].g.getBBox()
	].concat(ee.label ? [ee.label.getBBox()] : []);
	return {
		svg0,
		svg,
		el,
		canvas,
		zoneLayer,
		edgeLayer,
		nodeLayer,
		storyLayer,
		zoneEls,
		edgeEls,
		nodeEls,
		nodeBox,
		allNodeBoxes,
		hopBoxes
	};
}
// src/rendering/ml-controls.js
var paths = {
	back: "m14 6-6 6 6 6",
	forward: "m10 6 6 6-6 6",
	close: "m6 6 12 12M18 6 6 18",
	exit: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
	expand: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
	collapse: "M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5",
	moon: "M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z",
	sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
};
function icon(name) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("class", "ml-control-icon");
	svg.setAttribute("aria-hidden", "true");
	const path = document.createElementNS(svg.namespaceURI, "path");
	path.setAttribute("d", paths[name]);
	svg.append(path);
	return svg;
}
function label(button, text, name) {
	const svg = icon(name);
	const span = document.createElement("span");
	span.textContent = text;
	button.replaceChildren(svg, span);
}
var ml_controls_default = Object.freeze({
	label,
	icon
});
// src/rendering/inside-scenes.js
var attr$1 = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
/** "path/file.js:466-471" -> link to that range at the pinned commit, labelled "file.js:466". */
function codeLink(ref, source) {
	if (!ref) return "";
	const [path, lines = ""] = String(ref).split(":");
	const [from, to] = lines.split("-");
	const label = path.split("/").pop() + (from ? ":" + from : "");
	if (!source?.repo) return `<span class="ins-code">${label}</span>`;
	const anchor = from ? `#L${from}${to ? "-L" + to : ""}` : "";
	return `<a class="ins-code" href="${attr$1(`${source.repo.replace(/\/$/, "")}/blob/${source.ref || "HEAD"}/${path}${anchor}`)}" target="_blank" rel="noopener" title="${attr$1(path + (lines ? ":" + lines : ""))}">${label}</a>`;
}
function steps(scene, source) {
	return `<ol class="ins-steps">${scene.steps.map((s, i) => {
		const exit = s.exit ? `<div class="ins-exit"><span class="ins-when">${s.exit.when || ""}</span><div class="ins-exit-card"><div class="ins-t">${s.exit.t}</div>${s.exit.code ? codeLink(s.exit.code, source) : ""}</div></div>` : "";
		return `<li class="ins-step${s.async ? " is-async" : ""}${i === scene.steps.length - 1 ? " is-last" : ""}"><div class="ins-card"><span class="ins-n">${i + 1}</span><div class="ins-main"><div class="ins-t">${s.t}</div>` + (s.d ? `<div class="ins-d">${s.d}</div>` : "") + codeLink(s.code, source) + `</div></div>${exit}</li>`;
	}).join("")}</ol>`;
}
function schema(scene, source) {
	return `<div class="ins-schema">${scene.tables.map((t) => {
		const fields = (t.fields || []).map((f) => `<li><span class="ins-f">${f.n}</span>` + (f.type ? `<span class="ins-type">${f.type}</span>` : "") + (f.ref ? `<span class="ins-ref" data-ref="${attr$1(f.ref)}">→ ${f.ref}</span>` : "") + (f.note ? `<span class="ins-fnote">${f.note}</span>` : "") + `</li>`).join("");
		return `<section class="ins-table" data-table="${attr$1(t.name)}"><header><span class="ins-name">${t.name}</span>` + (t.ttl ? `<span class="ins-ttl">${t.ttl}</span>` : "") + `</header>` + (t.note ? `<p class="ins-note">${t.note}</p>` : "") + (fields ? `<ul>${fields}</ul>` : "") + (t.code ? `<footer>${codeLink(t.code, source)}</footer>` : "") + `</section>`;
	}).join("")}</div>`;
}
function renderInsideScene(scene, source) {
	const body = scene.kind === "steps" ? steps(scene, source) : schema(scene, source);
	return `<div class="ins ins--${scene.kind}">${body}</div>`;
}
/** Hovering a reference lights up the table it points to. */
function wireInsideScene(root) {
	root.querySelectorAll(".ins-ref").forEach((ref) => {
		const target = root.querySelector(`.ins-table[data-table="${CSS.escape(ref.dataset.ref)}"]`);
		if (!target) return;
		ref.addEventListener("mouseenter", () => target.classList.add("is-lit"));
		ref.addEventListener("mouseleave", () => target.classList.remove("is-lit"));
	});
}
// src/runtime/panels.js
/** The side panel (in full screen, the drawer) and what it shows: the intro, a group, a component,
*  a build step; and the inside close-up over the map. */
var attr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
var NEEDS$6 = [
	"showLevel",
	"setFocus",
	"updateDrawerBounds",
	"hasFiles",
	"filesFor",
	"openFiles",
	"closeInside"
];
function createPanels({ env, model, scene, state, act }) {
	const document = env.document;
	const panel = document.getElementById("panel");
	const panelBody = document.getElementById("panelBody");
	const panelBtn = document.getElementById("panelBtn");
	const drawer = document.getElementById("drawer");
	const insideBox = document.getElementById("inside");
	function openInside(nodeId) {
		const n = scene.nodeEls[nodeId].def;
		const sc = model.INSIDES[n.inside];
		if (!sc) return;
		document.getElementById("insideTitle").textContent = sc.title;
		document.getElementById("insideSub").innerHTML = sc.sub || "";
		document.getElementById("insideCap").innerHTML = sc.cap || "";
		if (sc.kind) {
			const box = document.getElementById("insideScene");
			box.innerHTML = renderInsideScene(sc, sc.source);
			box.firstElementChild.style.setProperty("--ins-hue", `var(--h-${n.cat})`);
			wireInsideScene(box);
			insideBox.hidden = false;
			return;
		}
		document.getElementById("insideScene").innerHTML = `<svg class="iscene ml-canvas" viewBox="0 0 ${sc.w} ${sc.h}" role="img" aria-label="${attr(sc.title)}">${model.IMARK}${sc.svg}</svg>`;
		const iscene = document.querySelector("#insideScene svg");
		scene.canvas.setRole(iscene, n.cat);
		iscene.querySelectorAll(".ie").forEach((path) => {
			if (!/[CQ]/.test(path.getAttribute("d"))) path.setAttribute("d", scene.canvas.roundPath(path.getAttribute("d"), 10));
		});
		insideBox.hidden = false;
	}
	function closeInside() {
		insideBox.hidden = true;
	}
	function openPanel() {
		if (state.fsMode) {
			act.updateDrawerBounds();
			drawer.classList.add("open");
		}
		panel.classList.remove("closed");
		panelBtn.hidden = true;
	}
	function closePanel() {
		if (state.fsMode) drawer.classList.remove("open");
		else panel.classList.add("closed");
		panelBtn.hidden = false;
	}
	function panelIsOpen() {
		return state.fsMode ? drawer.classList.contains("open") : !panel.classList.contains("closed");
	}
	function revealInPanel(elm) {
		const box = state.fsMode ? drawer : panel;
		const br = box.getBoundingClientRect(), er = elm.getBoundingClientRect();
		const d = er.bottom > br.bottom ? er.bottom - br.bottom : er.top < br.top ? er.top - br.top : 0;
		if (!d) return;
		box.scrollTo({
			top: box.scrollTop + d,
			behavior: env.reduced ? "auto" : "smooth"
		});
	}
	function syncPanelHead(box) {
		const head = box.querySelector(":scope > .panelhead");
		if (!head) return;
		const scrolled = box.scrollTop > 0;
		head.classList.toggle("scrolled", scrolled);
		let label = head.querySelector(".ph-label");
		if (!label) {
			label = document.createElement("span");
			label.className = "ph-label";
			label.setAttribute("aria-hidden", "true");
			head.prepend(label);
		}
		const eyebrow = panelBody.querySelector(".p-eyebrow"), title = panelBody.querySelector("h2");
		const titleGone = Boolean(title) && title.getBoundingClientRect().bottom < head.getBoundingClientRect().bottom;
		const text = !scrolled ? "" : titleGone ? title.textContent.trim() : eyebrow ? eyebrow.textContent.trim() : "";
		label.hidden = !text;
		label.textContent = text;
		label.classList.toggle("title", titleGone);
		label.style.setProperty("--ph-hue", getComputedStyle(panel).getPropertyValue("--p-hue"));
	}
	function catName(c) {
		return model.definition.roles[c]?.label || c;
	}
	function panelHTML(h, hueKey) {
		panel.dataset.panelDesign = "journey";
		panel.style.setProperty("--p-hue", hueKey ? model.hue(hueKey) : "var(--muted)");
		panelBody.innerHTML = h;
		[panel, drawer].forEach(syncPanelHead);
	}
	function renderL0() {
		panelHTML(model.definition.panels.introHtml, null);
		const b = document.getElementById("gofull");
		if (b) env.scope.listen(b, "click", () => {
			act.showLevel(1);
			act.setFocus(null);
			renderOverview();
		});
	}
	function renderOverview() {
		panelHTML(model.definition.panels.overviewHtml, null);
	}
	function renderGroup(g) {
		const G = model.GROUPS[g];
		const items = G.members.map((id) => {
			const n = scene.nodeEls[id].def;
			return `<li><strong>${n.concept}</strong>: ${n.tool}</li>`;
		}).join("");
		panelHTML(`
      <div class="p-eyebrow">${env.t("stageEyebrow")}</div>
      <h2>${G.title}</h2>
      <p style="margin-top:8px">${G.text}</p>
      <h3>${env.t("stageMembers")}</h3><ul class="newlist">${items}</ul>
      <p class="p-note" style="margin-top:12px">${env.t("stageNote")}</p>
    `, G.huekey);
		openPanel();
	}
	function renderNode(id) {
		const n = scene.nodeEls[id].def;
		const decision = n.decision ? `<h3>${env.t("decision")}</h3><div class="decision">${n.decision}</div>` : "";
		const look = n.inside ? `<div class="panel-actions"><button type="button" class="panel-action" id="lookInside">${env.t("lookInside")}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button></div>` : "";
		const paths = act.hasFiles() ? act.filesFor(id) : [];
		const repo = paths.length ? `<h3>${env.t("repository")}</h3>
      <div class="panel-actions xrepo">${paths.map((p) => `<button type="button" class="panel-action" data-files-path="${attr(p)}" aria-label="${attr(env.t("showInFiles", { path: p }))}"><span class="mono">${p}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button>`).join("")}</div>` : "";
		panelHTML(`
      <div class="p-eyebrow">${catName(n.cat)}${n.art ? env.t("fileSuffix") : ""}</div>
      <h2>${state.viewMode === "tools" ? n.tool : n.concept}</h2>
      <p class="p-sub">${state.viewMode === "tools" ? n.concept : n.tool}</p>
      <div class="p-chips"><span class="pchip">${env.t("nodeBuildStep", {
			step: n.step,
			total: model.WEEKS.length - 1
		})}</span></div>
      <h3>${env.t("what")}</h3><p>${n.what}</p>
      <h3>${env.t("why")}</h3><p>${n.why}</p>
      ${decision}
      <h3>${env.t("tools")}</h3><p class="toolline">${n.tools}</p>
      ${repo}
      ${look}
    `, n.cat);
		const b = document.getElementById("lookInside");
		if (b) env.scope.listen(b, "click", () => openInside(id));
		panelBody.querySelectorAll("[data-files-path]").forEach((el) => env.scope.listen(el, "click", () => act.openFiles(el.dataset.filesPath)));
		openPanel();
	}
	function renderWeek(w) {
		const d = model.WEEKS[w];
		const items = d.nodes.map((id) => {
			const n = scene.nodeEls[id].def;
			return `<li><strong>${n.concept}</strong>: ${n.tool}</li>`;
		}).join("");
		panelHTML(`
      <div class="p-eyebrow">${env.t("buildStepTitle", {
			step: w,
			total: model.WEEKS.length - 1
		})}</div>
      <h2>${d.title}</h2>
      <p style="margin-top:8px">${d.text}</p>
      <h3>${env.t("newNodes")}</h3><ul class="newlist">${items}</ul>
      <h3>${env.t("decision")}</h3><div class="decision">${d.decision}</div>
      <h3>${env.t("runnable")}</h3><pre class="cmd"><code>${d.runnable}</code></pre>
      <p class="p-note">${env.t("buildNote")}</p>
    `, model.definition.settings.buildRole);
		openPanel();
	}
	ml_controls_default.label(document.getElementById("insideBack"), env.t("backToMap"), "back");
	env.scope.listen(document.getElementById("insideBack"), "click", act.closeInside);
	env.scope.listen(document.getElementById("drawerClose"), "click", closePanel);
	env.scope.listen(document.getElementById("panelClose"), "click", closePanel);
	[panel, drawer].forEach((box) => {
		if (box.querySelector(":scope > .panelhead")) env.scope.listen(box, "scroll", () => syncPanelHead(box), { passive: true });
	});
	env.scope.listen(panelBtn, "click", openPanel);
	return {
		openInside,
		closeInside,
		openPanel,
		closePanel,
		panelIsOpen,
		revealInPanel,
		syncPanelHead,
		catName,
		panelHTML,
		renderL0,
		renderOverview,
		renderGroup,
		renderNode,
		renderWeek
	};
}
// src/runtime/flow-player.js
/** Flows: playing one on the map (the travelling dot, the step chips, the narration in the panel),
*  and the flow picker with its Play button. The only writer of storyToken, dot and chosenFlow. */
var NEEDS$5 = [
	"showLevel",
	"closeInside",
	"setFocus",
	"setWeek",
	"unselect",
	"panelHTML",
	"openPanel",
	"revealInPanel",
	"focusHop"
];
function createFlowplayer({ env, model, scene, state, act }) {
	const { document } = env;
	const { NODES, EDGES, STORIES } = model;
	const { svg, el, storyLayer, edgeEls, nodeEls } = scene;
	const controlsEl = document.querySelector("section.controls");
	const panelBody = document.getElementById("panelBody");
	const flowPicker = document.getElementById("flowPicker");
	const flowSummary = flowPicker.querySelector("summary");
	function clearStory() {
		state.storyToken++;
		storyLayer.innerHTML = "";
		svg.classList.remove("tfocus", "flowing");
		if (state.dot) {
			state.dot.remove();
			state.dot = null;
		}
		svg.querySelectorAll(".fout, .inchip").forEach((x) => x.classList.remove("fout", "inchip"));
		EDGES.forEach((e) => {
			const ee = edgeEls[e.id];
			ee.path.classList.remove("eactive", "tcur", "eglow");
			if (ee.start) {
				ee.start.remove();
				ee.start = null;
			}
			ee.path.style.stroke = "";
			ee.path.setAttribute("marker-end", "url(#arr-base)");
			if (e.bidir) ee.path.setAttribute("marker-start", "url(#arr-base)");
		});
		NODES.forEach((n) => {
			const g = nodeEls[n.id].g;
			g.classList.remove("lit", "broken");
			g.style.removeProperty("--story-hue");
		});
	}
	function stopDot() {
		state.storyToken++;
		if (state.dot) {
			state.dot.remove();
			state.dot = null;
		}
	}
	function animateDot(pathEl, rev, hueKey) {
		return env.scope.cancellable((resolve) => {
			const token = state.storyToken;
			const L = pathEl.getTotalLength();
			if (env.reduced) {
				env.setTimeout(resolve, 350);
				return;
			}
			if (!state.dot) {
				state.dot = el("g", { class: "fdot" }, svg);
				el("circle", {
					r: 11,
					class: "fdot-halo"
				}, state.dot);
				el("circle", {
					r: 5,
					class: "fdot-core"
				}, state.dot);
			}
			state.dot.style.setProperty("--story-hue", model.hue(hueKey));
			const dur = Math.min(3200, Math.max(1200, L * 5.2));
			const t0 = performance.now();
			function step(t) {
				if (token !== state.storyToken) {
					resolve();
					return;
				}
				const k = Math.min(1, (t - t0) / dur);
				const ease = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
				const at = rev ? L * (1 - ease) : L * ease;
				const pt = pathEl.getPointAtLength(at);
				state.dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
				if (k < 1) env.requestAnimationFrame(step);
				else resolve();
			}
			env.requestAnimationFrame(step);
		});
	}
	function markSilent(sil) {
		const path = edgeEls[sil.e].path;
		const mid = path.getPointAtLength(path.getTotalLength() * .5);
		const g = el("g", {}, storyLayer);
		el("circle", {
			cx: mid.x,
			cy: mid.y,
			r: 9,
			class: "silent-c"
		}, g);
		el("path", {
			class: "silent-x",
			d: `M${mid.x - 3.6},${mid.y - 3.6} L${mid.x + 3.6},${mid.y + 3.6} M${mid.x + 3.6},${mid.y - 3.6} L${mid.x - 3.6},${mid.y + 3.6}`
		}, g);
		el("text", {
			x: mid.x,
			y: mid.y + 24,
			class: "silent-t"
		}, g).textContent = sil.t;
	}
	function popBadge(g) {
		if (!g || env.reduced) return;
		g.classList.remove("badge-pop");
		g.getBBox();
		g.classList.add("badge-pop");
	}
	function chipSpot(ee, w, own) {
		const grow = (b, m) => ({
			x: b.x - m,
			y: b.y - m,
			width: b.width + 2 * m,
			height: b.height + 2 * m
		});
		const hits = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
		const shown = (id) => edgeEls[id].label && !edgeEls[id].label.classList.contains("inchip");
		const busy = EDGES.map((e) => e.id).filter(shown).map((id) => grow(edgeEls[id].label.getBBox(), 2)).concat([...storyLayer.querySelectorAll("g.fchip > .fchip-r")].filter((r) => r.parentNode !== own).map((r) => grow(r.getBBox(), 2))).concat(NODES.map((n) => grow({
			x: n.x,
			y: n.y,
			width: n.w,
			height: n.h
		}, 4)));
		const free = (p) => !busy.some((b) => hits({
			x: p.x - w / 2,
			y: p.y - 10,
			width: w,
			height: 20
		}, b));
		const L = ee.path.getTotalLength(), lo = w / 2 + 6, hi = L - w / 2 - 12;
		for (let d = 0; d <= L / 2; d += 4) for (const t of d ? [L / 2 - d, L / 2 + d] : [L / 2]) {
			if (t < lo || t > hi) continue;
			const p = ee.path.getPointAtLength(t);
			if (free(p)) return p;
		}
		if (ee.label) {
			const b = ee.label.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
			const above = cy - b.height / 2 - 13, below = cy + b.height / 2 + 13;
			const right = b.x + b.width + 3 + w / 2, left = b.x - 3 - w / 2;
			const across = [
				[cx, above],
				[cx + w + 2, above],
				[cx, below],
				[cx + w + 2, below]
			];
			const along = [
				[right, cy],
				[right, cy - 22],
				[left, cy],
				[left, cy - 22]
			];
			const a = ee.path.getPointAtLength(L * .45), z = ee.path.getPointAtLength(L * .55);
			const spots = Math.abs(z.x - a.x) >= Math.abs(z.y - a.y) ? across.concat(along) : along.concat(across);
			for (const [x, y] of spots) if (free({
				x,
				y
			})) return {
				x,
				y
			};
		}
		return ee.path.getPointAtLength(L / 2);
	}
	async function playStory(key, opts) {
		const quiet = Boolean(opts && opts.quiet);
		const wide = Boolean(opts && opts.wide);
		const from = opts && opts.from || 0;
		if (state.level !== 1) act.showLevel(1);
		act.closeInside();
		clearStory();
		act.setFocus(null);
		const token = state.storyToken;
		if (state.week !== 0) act.setWeek(0, { silent: true });
		act.unselect();
		const s = STORIES[key];
		svg.style.setProperty("--story-hue", model.hue(s.hue));
		let list = null;
		if (!quiet) {
			chooseFlow(key);
			act.panelHTML(`
        <div class="p-eyebrow">${env.t(s.kind === "failure" ? "failureFlowEyebrow" : "flowEyebrow")}</div>
        <h2>${s.title}</h2>
        <p class="p-sub">${s.desc}</p>
        <ol class="steps" id="stepList"></ol>
      `, s.hue);
			act.openPanel();
			list = document.getElementById("stepList");
		}
		const badgeUses = {}, bidirSeen = {};
		s.hops.forEach((h) => {
			badgeUses[h.e] = (badgeUses[h.e] || 0) + 1;
		});
		const end = Math.min(s.hops.length, opts && opts.to || s.hops.length);
		const inFlow = /* @__PURE__ */ new Set(), flowEdges = /* @__PURE__ */ new Set();
		s.hops.slice(0, end).forEach((h) => {
			const d = edgeEls[h.e].def;
			flowEdges.add(h.e);
			inFlow.add(d.from);
			inFlow.add(d.to);
		});
		svg.classList.add("flowing");
		NODES.forEach((n) => {
			if (!inFlow.has(n.id)) nodeEls[n.id].g.classList.add("fout");
		});
		EDGES.forEach((e) => {
			if (flowEdges.has(e.id)) return;
			const ee = edgeEls[e.id];
			ee.path.classList.add("fout");
			ee.label?.classList.add("fout");
		});
		if (s.hops.length) {
			const h0 = s.hops[0], d0 = edgeEls[h0.e].def;
			const first = nodeEls[h0.rev ? d0.to : d0.from].g;
			first.style.setProperty("--story-hue", model.hue(h0.bad || !s.ok ? s.hue : s.ok));
			first.classList.add("lit");
		}
		for (let i = 0; i < end; i++) {
			if (token !== state.storyToken) return;
			const hop = s.hops[i];
			const landed = i < from;
			const hk = hop.bad || !s.ok ? s.hue : s.ok;
			const ee = edgeEls[hop.e];
			ee.path.classList.add("eactive");
			ee.path.style.stroke = model.hue(hk);
			ee.path.style.setProperty("--glow", model.hue(hk));
			if (ee.def.bidir && !bidirSeen[hop.e]) {
				bidirSeen[hop.e] = true;
				ee.path.removeAttribute("marker-start");
				ee.path.removeAttribute("marker-end");
			}
			if (hop.rev && ee.def.bidir) ee.path.setAttribute("marker-start", "url(#arr-" + hk + ")");
			else ee.path.setAttribute("marker-end", "url(#arr-" + hk + ")");
			if (!ee.start) {
				const p0 = ee.path.getPointAtLength(hop.rev ? ee.path.getTotalLength() : 0);
				ee.start = el("circle", {
					cx: p0.x,
					cy: p0.y,
					r: 3.2,
					class: "fstart"
				}, storyLayer);
				ee.start.style.setProperty("--story-hue", model.hue(hk));
			}
			if (landed || wide) {} else act.focusHop(ee.path);
			if (!landed) {
				ee.path.classList.add("eglow");
				await animateDot(ee.path, !!hop.rev, hk);
				ee.path.classList.remove("eglow");
			}
			if (token !== state.storyToken) return;
			const once = badgeUses[hop.e] === 1;
			let mid = once && ee.mid ? ee.mid : null;
			const bg = el("g", {
				"data-hop": i,
				class: "fchip"
			}, storyLayer);
			bg.style.setProperty("--story-hue", model.hue(hk));
			const label = once && ee.label ? ee.def.label : "";
			const pill = el("rect", {
				class: "fchip-r",
				height: 20,
				rx: 10
			}, bg);
			const disc = el("circle", {
				r: 7,
				class: "badge-c"
			}, bg);
			const num = el("text", { class: "badge-t" }, bg);
			num.textContent = String(i + 1);
			let w = 20;
			let txt = null;
			if (label) {
				txt = el("text", { class: "fchip-t" }, bg);
				txt.textContent = label;
				w = 26 + txt.getComputedTextLength() + 9;
				if (w > (mid ? mid.len - 4 : ee.path.getTotalLength() - 28)) {
					txt.remove();
					txt = null;
					w = 20;
					mid = null;
				} else ee.label.classList.add("inchip");
			}
			if (!mid) mid = txt ? ee.path.getPointAtLength(ee.path.getTotalLength() / 2) : chipSpot(ee, w, bg);
			const x0 = mid.x - w / 2;
			pill.setAttribute("x", x0);
			pill.setAttribute("y", mid.y - 10);
			pill.setAttribute("width", w);
			disc.setAttribute("cx", x0 + 10);
			disc.setAttribute("cy", mid.y);
			num.setAttribute("x", x0 + 10);
			num.setAttribute("y", mid.y + 3.4);
			if (txt) {
				txt.setAttribute("x", x0 + 22);
				txt.setAttribute("y", mid.y + 3.4);
			}
			storyLayer.querySelectorAll("g.fchip.now").forEach((g) => g.classList.remove("now"));
			bg.classList.add("now");
			if (!landed) popBadge(bg);
			const endNode = hop.rev ? ee.def.from : ee.def.to;
			const eg = nodeEls[endNode].g;
			eg.style.setProperty("--story-hue", model.hue(hk));
			eg.classList.add("lit");
			if (hop.breaks) nodeEls[hop.breaks].g.classList.add("broken");
			if (hop.silent) markSilent(hop.silent);
			if (list) {
				const li = document.createElement("li");
				li.innerHTML = `<span class="n">${i + 1}</span>${hop.t}` + (hop.note ? `<span class="note">${hop.note}</span>` : "");
				li.querySelector(".n").style.background = model.hue(hk);
				list.appendChild(li);
				act.revealInPanel(li);
			}
			if (!landed) await env.scope.cancellable((r) => env.setTimeout(r, env.reduced ? 1400 : 800));
		}
		if (token !== state.storyToken) return;
		if (state.dot) {
			state.dot.remove();
			state.dot = null;
		}
		storyLayer.querySelectorAll("g.fchip.now").forEach((g) => g.classList.remove("now"));
		if (quiet) return;
		if (s.ending) panelBody.insertAdjacentHTML("beforeend", s.ending);
		else {
			const note = document.createElement("p");
			note.className = "p-note";
			note.textContent = env.t("flowComplete");
			panelBody.appendChild(note);
		}
		act.revealInPanel(panelBody.lastElementChild);
	}
	function chooseFlow(key, { preview = false } = {}) {
		if (!flowPicker.querySelector(`[data-flow="${key}"]`)) return;
		state.chosenFlow = key;
		controlsEl.style.setProperty("--flow-hue", model.hue(STORIES[key].hue));
		document.getElementById("flowSelected").textContent = STORIES[key].title;
		flowPicker.querySelectorAll("[data-flow]").forEach((button) => {
			button.setAttribute("aria-pressed", String(button.dataset.flow === key));
		});
		if (preview) {
			const story = STORIES[key];
			const label = env.t(story.kind === "failure" ? "failureFlowEyebrow" : "flowEyebrow");
			const steps = story.hops.map((hop, index) => `<li><span class="n">${index + 1}</span>${hop.t}${hop.note ? `<span class="note">${hop.note}</span>` : ""}</li>`).join("");
			act.panelHTML(`<div class="p-eyebrow">${label}</div><h2>${story.title}</h2><p class="p-sub">${story.desc}</p><ol class="steps">${steps}</ol>`, story.hue);
			act.openPanel();
		}
	}
	function closeFlowPicker(restoreFocus = false) {
		flowPicker.open = false;
		if (restoreFocus) flowSummary.focus({ preventScroll: true });
	}
	function focusFlowOption() {
		(flowPicker.querySelector("[aria-pressed=\"true\"]") || flowPicker.querySelector("[data-flow]"))?.focus({ preventScroll: true });
	}
	const flowControls = document.getElementById("flowControls");
	const storyOptions = document.getElementById("storyOptions");
	const failureOptions = document.getElementById("failureOptions");
	const playFlowButton = document.getElementById("playFlow");
	env.scope.listen(flowPicker, "toggle", () => {
		if (flowPicker.open) env.requestAnimationFrame(() => {
			if (flowPicker.open) focusFlowOption();
		});
	});
	env.scope.listen(flowPicker, "keydown", (event) => {
		if (event.key === "Escape" && flowPicker.open) {
			event.preventDefault();
			closeFlowPicker(true);
			return;
		}
		const buttons = [...flowPicker.querySelectorAll("[data-flow]")];
		if (event.target === flowSummary && ["ArrowDown", "ArrowUp"].includes(event.key)) {
			event.preventDefault();
			flowPicker.open = true;
			return;
		}
		const index = buttons.indexOf(document.activeElement);
		if (index < 0 || ![
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End"
		].includes(event.key)) return;
		event.preventDefault();
		buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length].focus();
	});
	env.scope.listen(flowPicker, "focusout", (event) => {
		if (event.relatedTarget && !flowPicker.contains(event.relatedTarget)) closeFlowPicker();
	});
	env.scope.listen(document, "pointerdown", (event) => {
		if (flowPicker.open && !flowPicker.contains(event.target)) closeFlowPicker();
	});
	env.scope.listen(playFlowButton, "click", () => {
		if (state.chosenFlow) {
			closeFlowPicker();
			playStory(state.chosenFlow);
		}
	});
	Object.keys(STORIES).forEach((key) => {
		const story = STORIES[key];
		const button = document.createElement("button");
		button.type = "button";
		button.className = "flow-option";
		button.dataset.flow = key;
		button.style.setProperty("--flow-hue", model.hue(story.hue));
		button.setAttribute("aria-pressed", "false");
		button.title = story.desc;
		const marker = document.createElement("span");
		marker.className = "flow-dot";
		marker.setAttribute("aria-hidden", "true");
		button.append(marker, document.createTextNode(story.title));
		env.scope.listen(button, "click", () => {
			chooseFlow(key, { preview: true });
			closeFlowPicker(true);
		});
		(story.kind === "failure" ? failureOptions : storyOptions).appendChild(button);
	});
	[storyOptions, failureOptions].forEach((group) => {
		group.parentElement.hidden = !group.children.length;
	});
	const firstFlow = flowPicker.querySelector("[data-flow]");
	if (firstFlow) chooseFlow(firstFlow.dataset.flow);
	else flowControls.hidden = true;
	return {
		clearStory,
		stopDot,
		animateDot,
		markSilent,
		popBadge,
		playStory,
		chooseFlow,
		closeFlowPicker,
		focusFlowOption
	};
}
// src/runtime/camera.js
/** The camera: zoom and pan (the buttons, the wheel, a hand drag), the full-screen flow camera
*  that follows Explore's dot, and the tour's camera (the wide view, a flow beat's overview and
*  shots). The only writer of zoom, tx, ty, camTimer and tourCam. */
var NEEDS$4 = [];
function createCamera({ env, model, scene, state, act }) {
	const { document } = env;
	const stagecard = document.querySelector(".stagecard");
	const scroller = document.querySelector(".stage-scroll");
	const drawer = document.getElementById("drawer");
	const tourCard = document.getElementById("tourCard");
	const tcKeys = tourCard.querySelector(".tc-keys");
	const zoomCtl = document.getElementById("zoomCtl");
	const activeSvg = () => state.level === 0 ? scene.svg0 : scene.svg;
	const drawerOcclusion = () => drawer.classList.contains("open") ? drawer.offsetWidth + 2 * parseFloat(getComputedStyle(stagecard).getPropertyValue("--drawer-inset")) : tourOcclusion().x;
	const camFree = () => state.tour.active && state.fsMode && !env.reduced && !state.tourCam.manual;
	function tourOcclusion() {
		if (!state.tour.active || tourCard.hidden) return {
			x: 0,
			y: 0
		};
		const sr = scroller.getBoundingClientRect(), cr = tourCard.getBoundingClientRect();
		if (env.phoneQuery.matches) return {
			x: 0,
			y: Math.max(0, sr.bottom - cr.top)
		};
		return {
			x: Math.max(0, sr.right - cr.left) + 20,
			y: 0
		};
	}
	function clampPan() {
		const s = activeSvg();
		const r = s.getBoundingClientRect();
		const sr = scroller.getBoundingClientRect();
		const m = new DOMMatrixReadOnly(getComputedStyle(s).transform === "none" ? void 0 : getComputedStyle(s).transform);
		let box = r;
		if (s === scene.svg) {
			const a = scene.zoneLayer.getBoundingClientRect(), b = scene.nodeLayer.getBoundingClientRect();
			const left = Math.min(a.left, b.left), top = Math.min(a.top, b.top);
			box = {
				left,
				top,
				width: Math.max(a.right, b.right) - left,
				height: Math.max(a.bottom, b.bottom) - top
			};
		}
		const baseLeft = box.left - m.e, baseTop = box.top - m.f;
		const pad = Math.min(drawerOcclusion(), sr.width * .45);
		const vpad = Math.min(tourOcclusion().y, sr.height * .6);
		const cx = sr.left + (sr.width - pad) / 2, cy = sr.top + (sr.height - vpad) / 2;
		state.tx = Math.min(cx - baseLeft, Math.max(cx - baseLeft - box.width, state.tx));
		state.ty = Math.min(cy - baseTop, Math.max(cy - baseTop - box.height, state.ty));
	}
	function focusPoint(vx, vy) {
		if (!state.fsMode) return;
		const s = activeSvg();
		const r = s.getBoundingClientRect();
		const scale = r.width / (s === scene.svg0 ? model.VB.map0[0] : model.VB.map[0]);
		const sr = scroller.getBoundingClientRect();
		const pad = Math.min(drawerOcclusion(), sr.width * .45);
		const vpad = Math.min(tourOcclusion().y, sr.height * .6);
		const pointX = r.left + vx * scale;
		const pointY = r.top + vy * scale;
		const targetX = sr.left + (sr.width - pad) / 2;
		const targetY = sr.top + (sr.height - vpad) / 2;
		state.tx += targetX - pointX;
		state.ty += targetY - pointY;
		stagecard.classList.add("campan");
		applyPan();
		env.clearTimeout(state.camTimer);
		state.camTimer = env.setTimeout(() => stagecard.classList.remove("campan"), 500);
	}
	function focusHop(pathEl) {
		if (!state.fsMode) return;
		if (state.tour.active) return;
		const L = pathEl.getTotalLength();
		const m = pathEl.getPointAtLength(L * .5);
		focusPoint(m.x, m.y);
	}
	function applyPan() {
		clampPan();
		stagecard.style.setProperty("--tx", state.tx + "px");
		stagecard.style.setProperty("--ty", state.ty + "px");
	}
	function setZoom(z, at) {
		const next = Math.min(6, Math.max(.5, z));
		if (at && !state.fsMode) {
			const r = activeSvg().getBoundingClientRect(), k = 1 - next / state.zoom;
			state.tx += (at.x - r.left) * k;
			state.ty += (at.y - r.top) * k;
		}
		state.zoom = next;
		stagecard.style.setProperty("--zoom", state.zoom);
		stagecard.classList.toggle("zoomed", state.zoom !== 1);
		applyPan();
	}
	function canvasCentre() {
		const sr = scroller.getBoundingClientRect();
		return {
			x: sr.left + sr.width / 2,
			y: sr.top + sr.height / 2
		};
	}
	function resetView() {
		state.zoom = 1;
		state.tx = 0;
		state.ty = 0;
		setZoom(1);
	}
	function camFrame() {
		const s = activeSvg(), r = s.getBoundingClientRect(), vb = s === scene.svg0 ? model.VB.map0 : model.VB.map;
		const t = getComputedStyle(s).transform;
		const m = new DOMMatrixReadOnly(t === "none" ? void 0 : t);
		const sr = scroller.getBoundingClientRect(), occ = tourOcclusion();
		return {
			r,
			m,
			scale: r.width / vb[0],
			base: r.width / vb[0] / state.zoom,
			cx: sr.left + (sr.width - occ.x) / 2,
			cy: sr.top + (sr.height - occ.y) / 2,
			w: sr.width - occ.x,
			h: sr.height - occ.y
		};
	}
	function placeCamera(v) {
		state.zoom = Math.min(6, Math.max(.5, v.z));
		stagecard.style.setProperty("--zoom", state.zoom);
		const f = camFrame();
		state.tx = f.cx - (f.r.left - f.m.e + v.cx * f.scale);
		state.ty = f.cy - (f.r.top - f.m.f + v.cy * f.scale);
		stagecard.style.setProperty("--tx", state.tx + "px");
		stagecard.style.setProperty("--ty", state.ty + "px");
	}
	function currentView() {
		const f = camFrame();
		return {
			z: state.zoom,
			cx: (f.cx - f.r.left) / f.scale,
			cy: (f.cy - f.r.top) / f.scale
		};
	}
	function frameBoxes(boxes, pad, maxZ, mx = 24, my = 20) {
		const f = camFrame();
		const x0 = Math.min(...boxes.map((b) => b.x)) - pad, y0 = Math.min(...boxes.map((b) => b.y)) - pad;
		const x1 = Math.max(...boxes.map((b) => b.x + b.width)) + pad, y1 = Math.max(...boxes.map((b) => b.y + b.height)) + pad;
		return {
			z: Math.min(maxZ, (f.w - 2 * mx) / ((x1 - x0) * f.base), (f.h - 2 * my) / ((y1 - y0) * f.base)),
			cx: (x0 + x1) / 2,
			cy: (y0 + y1) / 2
		};
	}
	function camGeom() {
		const f = camFrame(), sr = scroller.getBoundingClientRect();
		const stage = {
			l: sr.left,
			t: sr.top,
			r: sr.right,
			b: sr.bottom
		};
		const vis = {
			l: sr.left,
			t: sr.top,
			r: sr.left + f.w,
			b: sr.top + f.h
		};
		const cr = state.tour.active && !tourCard.hidden ? tourCard.getBoundingClientRect() : null;
		const card = cr && {
			l: cr.left,
			t: cr.top,
			r: cr.right,
			b: cr.bottom
		};
		const kr = cr && getComputedStyle(tcKeys).display !== "none" ? tcKeys.getBoundingClientRect() : null;
		const keys = kr && kr.width ? {
			l: kr.left,
			t: kr.top,
			r: kr.right,
			b: kr.bottom
		} : null;
		const zr = getComputedStyle(zoomCtl).display === "none" ? null : zoomCtl.getBoundingClientRect();
		const res = zr && zr.width ? {
			l: zr.left - 12,
			t: zr.top - 12,
			r: zr.right + 12,
			b: zr.bottom + 12
		} : null;
		const hit = (a, b) => Boolean(b) && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
		const inside = (p, a) => p.l >= a.l - .5 && p.r <= a.r + .5 && p.t >= a.t - .5 && p.b <= a.b + .5;
		const proj = (t, b) => {
			const k = f.base * t.z;
			return {
				l: f.cx + (b.x - t.cx) * k,
				t: f.cy + (b.y - t.cy) * k,
				r: f.cx + (b.x + b.width - t.cx) * k,
				b: f.cy + (b.y + b.height - t.cy) * k
			};
		};
		const shown = (p) => inside(p, stage) && !hit(p, card) && !hit(p, keys) && !hit(p, res);
		const hidden = (p) => {
			const q = {
				l: Math.max(p.l, stage.l),
				t: Math.max(p.t, stage.t),
				r: Math.min(p.r, stage.r),
				b: Math.min(p.b, stage.b)
			};
			return q.r <= q.l || q.b <= q.t || Boolean(card) && inside(q, {
				l: card.l + 2.5,
				t: card.t + 2.5,
				r: card.r - 2.5,
				b: card.b - 2.5
			});
		};
		return {
			f,
			vis,
			res,
			hit,
			proj,
			shown,
			hidden
		};
	}
	function camSolve(must, lit, all, maxZ, mx, my, minZ = 0) {
		const G = camGeom(), f = G.f;
		const inner = {
			l: G.vis.l + mx,
			t: G.vis.t + my,
			r: G.vis.r - mx,
			b: G.vis.b - my
		};
		const loose = {
			l: G.vis.l + 24,
			t: G.vis.t + 20,
			r: G.vis.r - 24,
			b: G.vis.b - 20
		};
		const icx = (inner.l + inner.r) / 2, icy = (inner.t + inner.b) / 2;
		const ext = (boxes) => ({
			x0: Math.min(...boxes.map((b) => b.x)),
			y0: Math.min(...boxes.map((b) => b.y)),
			x1: Math.max(...boxes.map((b) => b.x + b.width)),
			y1: Math.max(...boxes.map((b) => b.y + b.height))
		});
		const at = (e, z, sx, sy) => {
			const k = f.base * z;
			return {
				z,
				cx: (e.x0 + e.x1) / 2 - (sx - f.cx) / k,
				cy: (e.y0 + e.y1) / 2 - (sy - f.cy) / k
			};
		};
		const half = (t) => lit.filter((b) => {
			const p = G.proj(t, b);
			return !G.shown(p) && !G.hidden(p);
		});
		let set = must.slice(), first = null;
		for (let round = 0; round < 8; round++) {
			const e = ext(set), bw = (e.x1 - e.x0) * f.base, bh = (e.y1 - e.y0) * f.base;
			const z0 = Math.min(maxZ, (inner.r - inner.l) / bw, (inner.b - inner.t) / bh);
			if (!first) first = at(e, Math.max(z0, minZ), icx, icy);
			const zs = z0 < minZ ? [minZ] : [
				z0,
				.94,
				.88,
				.82,
				.76,
				.7
			].map((m, i) => i ? z0 * m : z0).filter((z) => z >= minZ);
			let best = null, bestScore = -Infinity;
			for (const z of zs) {
				const w = bw * z, h = bh * z;
				const xl = loose.l + w / 2, xr = loose.r - w / 2, yt = loose.t + h / 2, yb = loose.b - h / 2;
				if (xl > xr + .5 || yt > yb + .5) continue;
				const px = Math.min(xr, Math.max(xl, icx)), py = Math.min(yb, Math.max(yt, icy));
				const xs = [px], ys = [py];
				for (let i = 0; i <= 8; i++) {
					xs.push(xl + (xr - xl) * i / 8);
					ys.push(yt + (yb - yt) * i / 8);
				}
				for (const sx of xs) for (const sy of ys) {
					const t = at(e, z, sx, sy);
					if (!set.every((b) => G.shown(G.proj(t, b))) || half(t).length) continue;
					const score = z * (all.some((b) => G.hit(G.proj(t, b), G.res)) ? .85 : 1) - Math.hypot(sx - px, sy - py) * 1e-5;
					if (score > bestScore) {
						best = t;
						bestScore = score;
					}
				}
			}
			if (best) return best;
			const grow = half(at(e, Math.max(z0, minZ), icx, icy));
			if (!grow.length) break;
			set = set.concat(grow);
		}
		return first;
	}
	function camShows(t, boxes) {
		const G = camGeom();
		return boxes.every((b) => G.shown(G.proj(t, b)));
	}
	function litBoxes(b) {
		const ids = /* @__PURE__ */ new Set();
		model.STORIES[b.flow].hops.slice(0, model.flowEnd(b)).forEach((h) => {
			const d = scene.edgeEls[h.e].def;
			ids.add(d.from);
			ids.add(d.to);
		});
		return [...ids].map(scene.nodeBox);
	}
	function fitTarget() {
		const s = activeSvg();
		if (s === scene.svg) {
			const nodes = scene.allNodeBoxes();
			return camSolve([
				scene.zoneLayer.getBBox(),
				scene.edgeLayer.getBBox(),
				scene.nodeLayer.getBBox()
			], nodes, nodes, 1.6, 24, 20);
		}
		const f = camFrame(), blocks = [...s.querySelectorAll("g.block")].map((g) => g.getBBox());
		return camSolve([s.getBBox()], blocks, blocks, 1.6, Math.max(48, f.w * .1), Math.max(48, f.h * .1));
	}
	function pathTarget(b) {
		const s = model.STORIES[b.flow], boxes = [];
		for (let i = model.beatStart(b); i < model.flowEnd(b); i++) boxes.push(...scene.hopBoxes(scene.edgeEls[s.hops[i].e]));
		const f = camFrame();
		return camSolve(boxes, litBoxes(b), scene.allNodeBoxes(), model.PATH_ZOOM_MAX, Math.max(48, f.w * .1), Math.max(48, f.h * .1), state.tourCam.fitZoom);
	}
	function beatShots(b) {
		const s = model.STORIES[b.flow], f = camFrame(), shots = [];
		const mx = Math.max(48, f.w * .1), my = Math.max(48, f.h * .1);
		const fitZ = (boxes) => frameBoxes(boxes, 0, Infinity, mx, my).z;
		const each = [];
		for (let i = model.beatStart(b); i < model.flowEnd(b); i++) each.push(scene.hopBoxes(scene.edgeEls[s.hops[i].e]));
		if (!each.length) return shots;
		const zc = Math.max(state.tourCam.fitZoom, Math.min(model.PATH_ZOOM_MAX, ...each.map(fitZ)));
		const zMerge = Math.max(state.tourCam.fitZoom, zc * model.SHOT_SLACK) - 1e-6;
		each.forEach((boxes, k) => {
			const cur = shots[shots.length - 1];
			if (cur && fitZ(cur.boxes.concat(boxes)) >= zMerge) {
				cur.edges.push(k);
				cur.boxes.push(...boxes);
			} else shots.push({
				edges: [k],
				boxes: boxes.slice()
			});
		});
		const lit = litBoxes(b), all = scene.allNodeBoxes(), out = [];
		shots.forEach((sh) => {
			const prev = out[out.length - 1];
			if (prev && camShows(prev.target, sh.boxes)) {
				prev.edges.push(...sh.edges);
				return;
			}
			out.push({
				edges: sh.edges,
				target: camSolve(sh.boxes, lit, all, model.PATH_ZOOM_MAX, mx, my, state.tourCam.fitZoom)
			});
		});
		return out;
	}
	function tweenCamera(to, ms) {
		const token = ++state.tourCam.token;
		const from = currentView();
		return env.scope.cancellable((resolve) => {
			const t0 = performance.now();
			const step = (now) => {
				if (token !== state.tourCam.token || !state.tour.active || !state.fsMode) {
					resolve();
					return;
				}
				const k = Math.min(1, (now - t0) / ms);
				const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
				placeCamera({
					z: 1 / ((1 - e) / from.z + e / to.z),
					cx: from.cx + (to.cx - from.cx) * e,
					cy: from.cy + (to.cy - from.cy) * e
				});
				if (k < 1) env.requestAnimationFrame(step);
				else resolve();
			};
			env.requestAnimationFrame(step);
		});
	}
	function tourCamShot(b, k, animate) {
		if (!b || !b.flow || !camFree()) return Promise.resolve();
		const shots = beatShots(b);
		const si = k == null ? -1 : shots.findIndex((sh) => sh.edges.includes(k));
		if (animate && si === state.tourCam.shot) return state.tourCam.shotMove || Promise.resolve();
		const to = si < 0 ? pathTarget(b) : shots[si].target;
		if (animate) {
			state.tourCam.shotMove = tweenCamera(to, 800);
			state.tourCam.shot = si;
			return state.tourCam.shotMove;
		}
		state.tourCam.token++;
		placeCamera(to);
		state.tourCam.shot = si;
		state.tourCam.shotMove = null;
		return Promise.resolve();
	}
	function tourCamManual() {
		if (!state.tour.active) return;
		state.tourCam.manual = true;
		state.tourCam.token++;
	}
	function tourFit() {
		if (!state.fsMode) return;
		state.tourCam.token++;
		env.clearTimeout(state.camTimer);
		stagecard.classList.remove("campan");
		placeCamera(fitTarget());
		state.tourCam.fitZoom = state.zoom;
		state.tourCam.shot = -2;
		state.tourCam.shotMove = null;
	}
	function tourCamFree() {
		state.tourCam.manual = false;
	}
	function tourCamStop() {
		state.tourCam.token++;
	}
	stagecard.classList.add("zoomable");
	const normalZoom = () => !state.fsMode && env.wideQuery.matches;
	env.scope.listen(document.getElementById("zoomIn"), "click", () => {
		tourCamManual();
		setZoom(state.zoom * 1.25, canvasCentre());
	});
	env.scope.listen(document.getElementById("zoomOut"), "click", () => {
		tourCamManual();
		setZoom(state.zoom / 1.25, canvasCentre());
	});
	env.scope.listen(document.getElementById("zoomFit"), "click", () => {
		if (state.tour.active) tourFit();
		else resetView();
	});
	env.scope.listen(scroller, "wheel", (e) => {
		if (e.target.closest("#zoomCtl")) return;
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
		if (e.ctrlKey) setZoom(state.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
		else {
			state.tx -= e.deltaX;
			state.ty -= e.deltaY;
			applyPan();
		}
	}, { passive: false });
	let panDown = false, panMoved = false, panX = 0, panY = 0;
	env.scope.listen(scroller, "pointerdown", (e) => {
		if (!(state.fsMode || normalZoom() && state.zoom !== 1) || e.button !== 0 || e.target.closest("#zoomCtl")) return;
		panDown = true;
		panMoved = false;
		panX = e.clientX;
		panY = e.clientY;
	});
	env.scope.listen(scroller, "pointermove", (e) => {
		if (!panDown) return;
		const dx = e.clientX - panX, dy = e.clientY - panY;
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
	["pointerup", "pointercancel"].forEach((t) => env.scope.listen(scroller, t, () => {
		panDown = false;
		scroller.classList.remove("panning");
	}));
	env.scope.listen(scroller, "click", (e) => {
		if (e.target.closest("#zoomCtl")) return;
		if (panMoved) {
			e.stopPropagation();
			e.preventDefault();
			panMoved = false;
		}
	}, true);
	return {
		tourOcclusion,
		clampPan,
		focusPoint,
		focusHop,
		applyPan,
		setZoom,
		canvasCentre,
		resetView,
		camFrame,
		placeCamera,
		currentView,
		frameBoxes,
		camGeom,
		camSolve,
		camShows,
		litBoxes,
		fitTarget,
		pathTarget,
		beatShots,
		tweenCamera,
		tourCamShot,
		tourCamManual,
		tourCamFree,
		tourCamStop,
		tourFit
	};
}
// src/runtime/tour-player.js
/** The guided tour: its entry button, the tour bar and step card, the beats (flow beats edge by
*  edge, the closing sweep, the ending), the keys while touring, and what happens when the browser
*  leaves full screen mid-tour. The only writer of tour, tourStepped, cardSwap and cardOut. */
var NEEDS$3 = [
	"showLevel",
	"setFocus",
	"setWeek",
	"unselect",
	"restoreSelection",
	"updateDrawerBounds",
	"applyFsDom",
	"exitFs",
	"onEscape",
	"closeInside",
	"panelIsOpen",
	"openPanel",
	"closePanel",
	"renderL0",
	"renderOverview",
	"renderGroup",
	"renderNode",
	"renderWeek",
	"clearStory",
	"stopDot",
	"playStory",
	"animateDot",
	"popBadge",
	"closeFlowPicker",
	"tourCamShot",
	"tourCamFree",
	"tourCamStop",
	"tourFit"
];
function createTourplayer({ env, model, scene, state, act }) {
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
	const beatHue = (b) => `var(${b.hue || model.TOUR_CHAPTERS[b.ch].hue})`;
	const beatHasMotion = (b) => Boolean(b.flow) || Boolean(b.whole) && !env.reduced;
	const hopHue = (s, hop) => model.hue(hop.bad || !s.ok ? s.hue : s.ok);
	const stageCount = (b) => b.whole && !env.reduced ? model.SWEEP.length : 0;
	if (env.param("reset")) try {
		localStorage.removeItem(model.definition.settings.storage.tour);
	} catch (err) {}
	ml_controls_default.label(tourExitBtn, env.t("tourExitShort"), "exit");
	tourExitBtn.setAttribute("aria-label", env.t("tourExit"));
	model.TOUR_CHAPTERS.forEach((c) => {
		const li = document.createElement("li");
		li.innerHTML = "<span class=\"tb-bar\"><span class=\"tb-fill\"></span></span><span class=\"tb-name\"></span>";
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
	function resumeStep() {
		const s = readTour().step;
		return Number.isInteger(s) && s >= 2 && s <= model.TOUR.length ? s : 0;
	}
	function refreshTourEntry() {
		const r = resumeStep(), done = Boolean(readTour().done);
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
		const pos = b ? model.TOUR.slice(0, n).filter((x) => x.ch === cur).length : 0;
		[...tourChapters.children].forEach((li, i) => {
			const fill = li.querySelector(".tb-fill");
			const now = i === cur;
			li.classList.toggle("current", now);
			if (now) li.setAttribute("aria-current", "step");
			else li.removeAttribute("aria-current");
			fill.style.width = i < cur ? "100%" : now ? pos / model.TOUR_CHAPTERS[i].span * 100 + "%" : "0%";
			fill.style.background = now ? beatHue(b) : "";
		});
		tourStatus.textContent = b ? env.t("tourStatus", {
			step: n,
			total: model.TOUR_TOTAL,
			left: timeLeft(n)
		}) : env.t("tourComplete");
	}
	function renderTourCard(n) {
		const b = model.TOUR[n - 1];
		tourCard.style.setProperty("--tc-hue", beatHue(b));
		tcEyebrow.textContent = env.t("tourCardCount", {
			chapter: model.TOUR_CHAPTERS[b.ch].name,
			step: n,
			total: model.TOUR_TOTAL
		});
		tcTitle.textContent = b.title;
		renderTourText(b);
		tcScroll.scrollTop = 0;
	}
	function renderTourText(b) {
		tcBody.replaceChildren(...b.body.map((t) => {
			const el = env.document.createElement("p");
			el.innerHTML = t;
			return el;
		}));
		const p = state.tour.phase;
		tcWhy.hidden = !b.why || Boolean(b.flow) && p <= model.edgeCount(b);
		tcWhyText.innerHTML = b.why || "";
		if (!b.flow) {
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
			head.append(model.TOUR_CHAPTERS.find((c) => c.name.toLowerCase().startsWith(g))?.name || model.GROUPS[g].title);
			const text = env.document.createElement("span");
			text.className = "recap-t";
			text.innerHTML = b.recap[g];
			li.append(head, text);
			tcList.replaceChildren(li);
			tcList.hidden = false;
			return;
		}
		const s = model.STORIES[b.flow], start = model.beatStart(b), total = model.edgeCount(b);
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
		const shown = model.beatStart(b) + Math.min(state.tour.phase, model.edgeCount(b));
		scene.storyLayer.querySelectorAll("g[data-hop]").forEach((g) => {
			const i = Number(g.dataset.hop);
			g.classList.toggle("tpend", i >= shown || i === state.tour.badgeWait);
		});
		const s = model.STORIES[b.flow], first = {};
		s.hops.forEach((h, i) => {
			if (scene.edgeEls[h.e].def.bidir && first[h.e] === void 0) first[h.e] = i;
		});
		s.hops.slice(0, model.flowEnd(b)).forEach((h, i) => {
			const ee = scene.edgeEls[h.e];
			if (!ee.def.bidir || i === first[h.e] || Boolean(h.rev) === Boolean(s.hops[first[h.e]].rev)) return;
			const attr = h.rev ? "marker-start" : "marker-end";
			if (i < shown) ee.path.setAttribute(attr, "url(#arr-" + (h.bad || !s.ok ? s.hue : s.ok) + ")");
			else ee.path.removeAttribute(attr);
		});
	}
	function syncFocus(b) {
		const s = model.STORIES[b.flow], end = model.flowEnd(b);
		const onPath = /* @__PURE__ */ new Set(), pathNodes = /* @__PURE__ */ new Set();
		s.hops.slice(0, end).forEach((h) => {
			const d = scene.edgeEls[h.e].def;
			onPath.add(d.id);
			pathNodes.add(d.from);
			pathNodes.add(d.to);
		});
		scene.svg.classList.add("tfocus");
		model.NODES.forEach((n) => scene.nodeEls[n.id].g.classList.toggle("dimmed", !pathNodes.has(n.id)));
		model.EDGES.forEach((e) => {
			[scene.edgeEls[e.id].path, scene.edgeEls[e.id].label].forEach((x) => {
				if (x) x.classList.toggle("dimmed", !onPath.has(e.id));
			});
		});
	}
	function revealLatest() {
		const b = model.TOUR[state.tour.step - 1];
		if (!b || !b.flow) return;
		const t = state.tour.phase > model.edgeCount(b) ? tcWhy : state.tour.phase > 0 ? tcList.firstElementChild : null;
		if (!t || t.closest("[hidden]")) return;
		const sr = tcScroll.getBoundingClientRect(), r = t.getBoundingClientRect();
		const dy = r.top < sr.top ? r.top - sr.top : r.bottom > sr.bottom ? Math.min(r.bottom - sr.bottom, r.top - sr.top) : 0;
		if (dy) tcScroll.scrollTo({
			top: tcScroll.scrollTop + dy,
			behavior: env.reduced ? "auto" : "smooth"
		});
	}
	function renderPlayer() {
		const b = model.TOUR[state.tour.step - 1];
		const hint = Boolean(b) && beatHasMotion(b) && !state.tourStepped;
		tcHint.hidden = !hint;
		tcNext.classList.toggle("hint", hint);
		const backHadFocus = env.document.activeElement === tcBack;
		tcBack.disabled = state.tour.step === 1;
		tcBack.hidden = state.tour.step === 1;
		if (backHadFocus && tcBack.disabled) tcNext.focus({ preventScroll: true });
		const last = Boolean(b) && state.tour.step >= model.TOUR.length && !(b.flow && state.tour.phase <= model.edgeCount(b)) && state.tour.phase >= stageCount(b);
		tcNext.textContent = env.t(state.tour.step === 1 ? "tourBegin" : last ? "tourFinish" : "tourNext");
		const total = !b ? 0 : b.flow ? model.edgeCount(b) + 1 : stageCount(b);
		const done = Math.min(state.tour.phase, total);
		tcCount.replaceChildren(...Array.from({ length: total }, (_, i) => {
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
		} else [
			"role",
			"aria-label",
			"aria-valuemin",
			"aria-valuemax",
			"aria-valuenow"
		].forEach((a) => tcCount.removeAttribute(a));
	}
	function sizeTourCard() {
		const b = model.TOUR[state.tour.step - 1];
		if (!b || tourCard.hidden) return;
		const keep = state.tour.phase, phases = b.flow ? model.edgeCount(b) + 2 : 1 + stageCount(b);
		tourCard.style.height = "";
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
	function showStage(p) {
		act.clearStory();
		if (!p) {
			act.setFocus(null);
			return;
		}
		const g = model.SWEEP[p - 1];
		act.setFocus(g);
		model.GROUPS[g].members.forEach((id) => {
			const ng = scene.nodeEls[id].g;
			ng.style.setProperty("--story-hue", model.hue(model.GROUPS[g].huekey));
			ng.classList.add("lit");
		});
	}
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
	function markEdge(b, k) {
		scene.storyLayer.querySelectorAll("g.tcur").forEach((g) => g.classList.remove("tcur"));
		model.EDGES.forEach((e) => scene.edgeEls[e.id].path.classList.remove("tcur", "eglow"));
		if (k == null) return;
		const i = model.beatStart(b) + k;
		scene.edgeEls[model.STORIES[b.flow].hops[i].e].path.classList.add("tcur");
		scene.storyLayer.querySelector(`g[data-hop="${i}"]`)?.classList.add("tcur");
	}
	function stopEdgeMotion() {
		act.stopDot();
		state.tour.badgeWait = -1;
	}
	async function playEdge(b, k, animate) {
		const s = model.STORIES[b.flow], i = model.beatStart(b) + k, hop = s.hops[i], ee = scene.edgeEls[hop.e];
		stopEdgeMotion();
		markEdge(b, k);
		if (!animate || env.reduced) {
			ee.path.classList.add("eglow");
			act.tourCamShot(b, k, true);
			return true;
		}
		const token = state.storyToken;
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
	function stepEdge(b) {
		state.tour.phase++;
		cardChange(() => {
			renderTourText(b);
			revealLatest();
		});
		return playEdge(b, state.tour.phase - 1, true);
	}
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
	function showBeat(n, opts) {
		const b = model.TOUR[n - 1];
		const atSummary = Boolean(opts && opts.atSummary && b.flow);
		stopEdgeMotion();
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
		if (b.flow) drawBeatPath(b);
		act.tourCamShot(b, null, true);
	}
	function startTour(n, opts) {
		if (state.tour.active) return;
		const wantNative = Boolean(opts && opts.native) && Boolean(stagecard.requestFullscreen);
		const wasNative = env.document.fullscreenElement === stagecard;
		act.closeFlowPicker();
		act.closeInside();
		const wasFs = state.fsMode;
		if (wasFs && wasNative && wantNative) act.applyFsDom(false);
		else if (wasFs) act.exitFs();
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
		tcNext.focus({ preventScroll: true });
		if (wantNative && !wasNative) stagecard.requestFullscreen().catch(() => {});
	}
	function tourNext() {
		if (!state.tour.active || state.tour.atEnd) return;
		const b = model.TOUR[state.tour.step - 1];
		if (b.flow && state.tour.phase <= model.edgeCount(b)) {
			state.tourStepped = true;
			if (state.tour.phase < model.edgeCount(b)) stepEdge(b);
			else finishBeat(b);
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
		if (state.tour.step >= model.TOUR.length) showEnding();
		else showBeat(state.tour.step + 1);
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
		showBeat(state.tour.step - 1, { atSummary: true });
	}
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
			env.scope.animate(tourCard, [{ opacity: 1 }, {
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
		teTitle.focus({ preventScroll: true });
	}
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
			if (snap.panelOpen) act.openPanel();
			else act.closePanel();
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
			} else if (snap.focused) act.renderGroup(snap.focused);
			else if (snap.week > 0) act.renderWeek(snap.week);
			else act.renderOverview();
			if (snap.panelOpen) act.openPanel();
			else act.closePanel();
		}
		if (snap.wasFs && !toFullMap && !atEnd) {
			stagecard.classList.add("fs-fixed");
			act.applyFsDom(true);
		}
		refreshTourEntry();
		tourBtn.focus({ preventScroll: true });
	}
	function onTourKey(ev) {
		if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey) return;
		if (ev.key === "Escape") {
			ev.preventDefault();
			if (env.document.fullscreenElement) {
				env.document.exitFullscreen().catch(() => {});
				return;
			}
			if (performance.now() - state.tour.nativeLeftAt < 600) return;
			exitTour(state.tour.atEnd);
			return;
		}
		if (ev.target instanceof Element && ev.target.closest("input, textarea, select, [contenteditable]") || state.tour.atEnd) return;
		if (ev.key === "ArrowRight") {
			ev.preventDefault();
			tourNext();
		} else if (ev.key === "ArrowLeft") {
			ev.preventDefault();
			tourBack();
		}
	}
	function halt() {
		state.cardSwap++;
		state.tour.active = false;
		state.tour.atEnd = false;
	}
	env.scope.listen(tourBtn, "click", () => startTour(resumeStep() || 1, { native: true }));
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
		if (state.tour.active && !document.fullscreenElement) state.tour.nativeLeftAt = performance.now();
		if (state.tour.active) env.requestAnimationFrame(() => {
			act.updateDrawerBounds();
			if (!state.tour.atEnd) act.tourFit();
		});
		if (document.fullscreenElement === stagecard) {
			if (!state.fsMode) act.applyFsDom(true);
		} else if (state.fsMode && !stagecard.classList.contains("fs-fixed")) act.applyFsDom(false);
	});
	env.scope.listen(document, "keydown", (ev) => {
		if (state.tour.active) {
			onTourKey(ev);
			return;
		}
		if (ev.key === "Escape") act.onEscape();
	});
	return {
		halt,
		readTour,
		saveTour,
		resumeStep,
		refreshTourEntry,
		timeLeft,
		renderTourBar,
		renderTourCard,
		renderTourText,
		syncBadges,
		syncFocus,
		revealLatest,
		renderPlayer,
		sizeTourCard,
		cardChange,
		showStage,
		drawBeatPath,
		markEdge,
		stopEdgeMotion,
		playEdge,
		stepEdge,
		finishBeat,
		showBeat,
		startTour,
		tourNext,
		tourBack,
		showEnding,
		exitTour,
		onTourKey
	};
}
// src/runtime/navigation.js
/** Where the reader is: the big picture or the full map, the focused group, the selected
*  component, the build step, full screen, the theme. The only writer of those fields. Owns the
*  controls that change them: Back to the big picture, the group chip, the build-step buttons and
*  their hint, the full-screen button, the light/dark switch. */
var NEEDS$2 = [
	"closeInside",
	"clearStory",
	"resetView",
	"panelIsOpen",
	"closePanel",
	"renderL0",
	"renderOverview",
	"renderGroup",
	"renderNode",
	"renderWeek",
	"filesIsOpen"
];
function createNavigation({ env, model, scene, state, act }) {
	const { document, scope, t } = env;
	const { NODES, EDGES, GROUPS, WEEKS } = model;
	const { svg0, svg, nodeEls, edgeEls, zoneEls } = scene;
	const control = ml_controls_default;
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
	function refreshWeekSeg() {
		document.querySelectorAll("#weekSeg button").forEach((b) => {
			b.classList.toggle("on", state.level === 1 && Number(b.dataset.w) === state.week);
		});
	}
	function showLevel(l) {
		state.level = l;
		refreshWeekSeg();
		act.closeInside();
		svg0.style.display = l === 0 ? "block" : "none";
		svg.style.display = l === 1 ? "block" : "none";
		const legend = document.querySelector(".legend");
		legend.style.display = l === 0 ? "none" : "";
		const zoomCtl = document.getElementById("zoomCtl");
		if (l === 0) document.querySelector(".stage-scroll").prepend(zoomCtl);
		else legend.append(zoomCtl);
		act.resetView();
		toL0.hidden = l === 0;
		toL1.hidden = l !== 0;
		crumbNote.textContent = t(l === 0 ? "bigPicture" : "fullMap");
		if (l === 0) {
			setFocus(null);
			act.clearStory();
			setWeek(0, { silent: true });
			unselect();
		}
	}
	function setFocus(g) {
		state.focused = g;
		NODES.forEach((n) => {
			nodeEls[n.id].g.classList.toggle("dimmed", !!g && n.group !== g);
		});
		EDGES.forEach((e) => {
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
		setWeek(0, { silent: true });
		unselect();
		setFocus(g);
		act.renderGroup(g);
	}
	function updateDrawerBounds() {
		if (!state.fsMode) return;
		const inset = parseFloat(getComputedStyle(stagecard).getPropertyValue("--drawer-inset"));
		const crumbEl = stagecard.querySelector(".crumbbar");
		const header = (crumbEl.getClientRects().length ? crumbEl : tourBar).getBoundingClientRect();
		const cardTop = stagecard.getBoundingClientRect().top + stagecard.clientTop;
		stagecard.style.setProperty("--drawer-top", header.bottom - cardTop + inset + "px");
		if (state.tour.active) {
			stagecard.style.setProperty("--tour-top", header.bottom - cardTop + 20 + "px");
			stagecard.style.setProperty("--tour-bar-h", tourBar.getBoundingClientRect().bottom - cardTop + "px");
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
		if (stagecard.requestFullscreen) stagecard.requestFullscreen().then(go).catch(() => {
			stagecard.classList.add("fs-fixed");
			go();
		});
		else {
			stagecard.classList.add("fs-fixed");
			go();
		}
	}
	function exitFs() {
		if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
		applyFsDom(false);
	}
	function unselect() {
		state.selected = null;
		NODES.forEach((n) => nodeEls[n.id].g.classList.remove("sel"));
	}
	function restoreSelection(id) {
		state.selected = id;
		nodeEls[state.selected].g.classList.add("sel");
	}
	function clearSelection() {
		unselect();
		if (state.level === 0) act.renderL0();
		else if (state.focused) act.renderGroup(state.focused);
		else if (state.week > 0) act.renderWeek(state.week);
		else act.renderOverview();
	}
	function selectNode(id) {
		if (state.tour.active) return;
		act.clearStory();
		if (state.focused && nodeEls[id].def.group !== state.focused) setFocus(null);
		state.selected = id;
		NODES.forEach((n) => nodeEls[n.id].g.classList.toggle("sel", n.id === id));
		act.renderNode(id);
	}
	function setWeek(w, opts) {
		state.week = w;
		refreshWeekSeg();
		NODES.forEach((n) => {
			const g = nodeEls[n.id].g;
			g.classList.toggle("future", w > 0 && n.step > w);
			g.classList.toggle("justbuilt", w > 0 && n.step === w);
		});
		zoneEls.forEach((z) => z.g.classList.toggle("future", w > 0 && z.members.length > 0 && z.members.every((n) => n.step > w)));
		EDGES.forEach((e) => {
			const fw = nodeEls[e.from].def.step, tw = nodeEls[e.to].def.step;
			const fut = w > 0 && Math.max(fw, tw) > w;
			edgeEls[e.id].path.classList.toggle("future", fut);
			if (edgeEls[e.id].label) edgeEls[e.id].label.classList.toggle("future", fut);
		});
		if (!(opts && opts.silent)) {
			if (w > 0) {
				unselect();
				act.renderWeek(w);
			} else if (state.selected) act.renderNode(state.selected);
			else act.renderOverview();
		}
	}
	function setTheme(t) {
		document.documentElement.dataset.theme = t;
		syncThemeLabel();
	}
	function syncThemeLabel() {
		const toggle = document.getElementById("themeToggle");
		if (!toggle) return;
		const rootEl = document.documentElement;
		const dark = rootEl.dataset.theme ? rootEl.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
		toggle.setAttribute("aria-label", dark ? t("themeToLight") : t("themeToDark"));
	}
	scope.listen(svg, "click", (ev) => {
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
	function hideStepTip() {
		stepTip.hidden = true;
	}
	WEEKS.map((_, i) => [String(i), i === 0 ? t("fullSystem") : String(i)]).forEach(([v, label]) => {
		const b = document.createElement("button");
		b.dataset.w = v;
		b.textContent = label;
		if (v !== "0" && WEEKS[v]?.title) {
			b.dataset.tip = v + " · " + WEEKS[v].title;
			b.setAttribute("aria-label", t("buildStepAria", { step: b.dataset.tip }));
			for (const ev of ["mouseenter", "focus"]) scope.listen(b, ev, () => showStepTip(b));
			for (const ev of [
				"mouseleave",
				"blur",
				"click"
			]) scope.listen(b, ev, hideStepTip);
		}
		scope.listen(b, "click", () => {
			if (state.level !== 1) showLevel(1);
			act.closeInside();
			act.clearStory();
			setFocus(null);
			setWeek(Number(v));
		});
		weekSeg.appendChild(b);
	});
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
	const forcedTheme = env.param("theme");
	if (forcedTheme === "dark" || forcedTheme === "light") setTheme(forcedTheme);
	function onEscape() {
		if (!document.getElementById("inside").hidden) act.closeInside();
		else if (act.filesIsOpen()) document.getElementById("filesBack").click();
		else if (state.fsMode && drawer.classList.contains("open")) act.closePanel();
		else if (state.fsMode && stagecard.classList.contains("fs-fixed")) applyFsDom(false);
	}
	function applyLabels() {
		NODES.forEach((n) => {
			const e = nodeEls[n.id];
			e.l1.textContent = state.viewMode === "tools" ? n.tool : n.concept;
			e.l2.textContent = state.viewMode === "tools" ? n.concept : n.tool;
		});
	}
	control.label(toL0, t("backToBigPicture"), "back");
	control.label(toL1, t("openFullMap"), "forward");
	control.label(fsBtn, t("fullScreen"), "expand");
	return {
		applyLabels,
		onEscape,
		refreshWeekSeg,
		showLevel,
		setFocus,
		focusGroup,
		updateDrawerBounds,
		applyFsDom,
		enterFs,
		exitFs,
		clearSelection,
		selectNode,
		setWeek,
		setTheme,
		unselect,
		restoreSelection
	};
}
// src/runtime/files-view.js
/** Files view: the repository as an annotated folder tree, tied to the map.
Data: definition.files = { title?, intro?, entries: [{ path, t, d?, tag?, nodes?, open?, more? }] }.
A path ending in "/" is a folder; parents that are not listed are added without a note. */
var FOLDER = "<path d=\"M3 7.5A1.5 1.5 0 0 1 4.5 6h4.1l1.8 2h9.1A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z\"/>";
var SHEET = "<path d=\"M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z\"/><path d=\"M14 3v4.5h4.5\"/>";
var KINDS = [
	[/\.(js|mjs|cjs|ts|tsx|jsx|py|go|rs|rb|java|kt|swift|c|cc|cpp|h|cs|php|scala|sh|sql|ipynb)$/i, "<path d=\"m10 12.5-2 2 2 2m4-4 2 2-2 2\"/>"],
	[/(\.(ya?ml|json|toml|ini|cfg|conf|lock)|\.env.*|^\.?[A-Za-z]*rc|Dockerfile|Makefile|Procfile|\.gitignore|\.dockerignore)$/i, "<path d=\"M8.5 12h7m-7 3h7m-7 3h4\"/>"],
	[/\.(md|mdx|rst|txt|html|hbs|ejs|jinja2?|pdf)$|^(LICENSE|README)/i, "<path d=\"M8.5 12.5h7m-7 3h7\"/>"]
];
var fileGlyph = (name) => SHEET + (KINDS.find(([re]) => re.test(name))?.[1] || "");
var CHEVRON = "<path d=\"m9 6 6 6-6 6\"/>";
var ARROW = "<path d=\"M4 12h16m-6-6 6 6-6 6\"/>";
var svg = (paths, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
var esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
/** Build the tree from flat paths. Returns { root, byPath }. */
function buildFileTree(entries) {
	const root = {
		path: "",
		name: "",
		dir: true,
		kids: [],
		entry: null
	};
	const byPath = /* @__PURE__ */ new Map([["", root]]);
	const ensure = (path, dir) => {
		const key = path.replace(/\/$/, "");
		if (byPath.has(key)) {
			const node = byPath.get(key);
			if (dir) node.dir = true;
			return node;
		}
		const cut = key.lastIndexOf("/");
		const parent = ensure(cut < 0 ? "" : key.slice(0, cut + 1), true);
		const node = {
			path: key,
			name: key.slice(cut + 1),
			dir,
			kids: [],
			entry: null,
			parent
		};
		parent.kids.push(node);
		byPath.set(key, node);
		return node;
	};
	for (const e of entries) ensure(e.path, e.path.endsWith("/")).entry = e;
	const sort = (n) => {
		n.kids.sort((a, b) => b.dir - a.dir || a.name.localeCompare(b.name));
		n.kids.forEach(sort);
	};
	sort(root);
	return {
		root,
		byPath
	};
}
var NEEDS$1 = [
	"panelHTML",
	"openPanel",
	"renderL0",
	"renderOverview",
	"renderNode",
	"showLevel",
	"selectNode",
	"closeInside",
	"clearStory"
];
function createFilesView({ env, model, scene, state, act }) {
	const doc = env.document;
	const files = model.definition.files;
	const box = doc.getElementById("files");
	const btn = doc.getElementById("filesBtn");
	if (!files || !box || !btn) return {
		available: false,
		open() {},
		close() {},
		isOpen: () => false,
		pathsFor: () => []
	};
	const { root, byPath } = buildFileTree(files.entries);
	const source = model.definition.source;
	const panelBody = doc.getElementById("panelBody");
	const stagecard = doc.querySelector(".stagecard");
	const tree = box.querySelector("#filesTree");
	const expanded = /* @__PURE__ */ new Set();
	byPath.forEach((n) => {
		if (n.dir && (n.parent === root || n.entry?.open)) expanded.add(n.path);
	});
	let selected = null;
	btn.hidden = false;
	const label = env.t("filesEntry");
	doc.getElementById("filesBtnText").textContent = label;
	const repoName = files.title || (source ? source.repo.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "") : "project");
	root.name = repoName.split("/").pop();
	box.querySelector("#filesTitle").innerHTML = `${esc(label)} · ${esc(repoName)}` + (source?.ref ? ` ${esc(env.t("filesAt"))} <span class="mono">${esc(source.ref.slice(0, 7))}</span>` : "");
	const nodeOf = (id) => scene.nodeEls[id]?.def;
	const roleOf = (n) => {
		const own = n.entry?.nodes?.map(nodeOf).find(Boolean);
		if (own) return own.cat;
		if (!n.dir) return null;
		const roles = new Set(n.kids.map(roleOf).filter(Boolean));
		return roles.size === 1 ? [...roles][0] : null;
	};
	const hueOf = (n) => {
		const role = roleOf(n);
		return role ? `var(--h-${role})` : "var(--muted)";
	};
	const chip = (id) => {
		const n = nodeOf(id);
		if (!n) return "";
		return `<button type="button" class="ft-chip" data-node="${esc(id)}" style="--chip-hue:var(--h-${n.cat})" title="${esc(env.t("filesShowOnMap", { name: n.concept }))}" tabindex="-1"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${model.ICONS[n.icon] || ""}</svg>${esc(n.concept)}</button>`;
	};
	function rowHTML(n, depth) {
		const e = n.entry;
		const open = n.dir && expanded.has(n.path);
		const kids = n.dir && (n.kids.length || e?.more);
		const name = n.name + (n.dir ? "/" : "");
		const chips = (e?.nodes || []).map(chip).join("");
		const tag = e?.tag ? `<span class="ft-tag">${esc(e.tag)}</span>` : "";
		let h = `<div class="ft-row${n === selected ? " is-sel" : ""}${e ? "" : " is-bare"}" role="treeitem" tabindex="${n === selected ? 0 : -1}" aria-level="${depth + 1}"${kids ? ` aria-expanded="${open}"` : ""}${n === selected ? " aria-selected=\"true\"" : ""} data-path="${esc(n.path)}" style="--depth:${depth};--row-hue:${hueOf(n)}"><span class="ft-name">${kids ? svg(CHEVRON, "ft-chev") : "<span class=\"ft-chev\"></span>"}${svg(n.dir ? FOLDER : fileGlyph(n.name), "ft-ico")}<span class="ft-label">${esc(name)}</span></span><span class="ft-note">${e?.t || ""}</span><span class="ft-meta">${tag}${chips}</span></div>`;
		if (open) {
			h += `<div role="group" class="ft-kids" style="--depth:${depth}">` + n.kids.map((k) => rowHTML(k, depth + 1)).join("");
			if (e?.more) h += `<div class="ft-row ft-more" style="--depth:${depth + 1}"><span class="ft-name"><span class="ft-chev"></span><span class="ft-label">…</span></span><span class="ft-note">${e.more}</span></div>`;
			h += "</div>";
		}
		return h;
	}
	function render() {
		tree.innerHTML = `<div class="ft-row is-root${selected ? "" : " is-sel"}" role="treeitem" aria-level="1" aria-expanded="true" tabindex="${selected ? -1 : 0}" data-path="" style="--depth:0;--row-hue:var(--muted)"><span class="ft-name">${svg(CHEVRON, "ft-chev")}${svg(FOLDER, "ft-ico")}<span class="ft-label">${esc(root.name)}/</span></span><span class="ft-note">${files.intro || ""}</span><span class="ft-meta"></span></div><div role="group" class="ft-kids" style="--depth:0">` + root.kids.map((k) => rowHTML(k, 1)).join("") + "</div>";
		if (!tree.querySelector("[tabindex=\"0\"]")) tree.querySelector(".ft-row[data-path]")?.setAttribute("tabindex", "0");
	}
	function renderIntro() {
		act.panelHTML(`
      <div class="p-eyebrow">${esc(env.t("filesEyebrow"))}</div>
      <h2>${esc(files.heading || env.t("filesHeading"))}</h2>
      <p style="margin-top:8px">${files.panel || esc(env.t("filesIntro", {
			repo: "\0",
			count: files.entries.length
		})).replace("\0", `<span class="mono">${esc(repoName)}</span>`)}</p>
      <h3>${esc(env.t("filesHowTo"))}</h3>
      <ul class="newlist ft-toplist">
        <li><b>${esc(env.t("filesTagsTerm"))}</b> ${esc(env.t("filesTags"))}</li>
        <li><b>${esc(env.t("filesFolderTerm"))}</b> ${esc(env.t("filesFolder"))}</li>
        <li>${esc(env.t("filesClickRow"))} <kbd>↑</kbd> <kbd>↓</kbd> ${esc(env.t("filesKeysWalk"))} <kbd>←</kbd> <kbd>→</kbd> ${esc(env.t("filesKeysFold"))}</li>
      </ul>
    `, null);
		act.openPanel();
	}
	function renderEntry(n) {
		const e = n.entry || {};
		const nodes = (e.nodes || []).map((id) => [id, nodeOf(id)]).filter(([, d]) => d);
		const onMap = nodes.map(([id, d]) => `<button type="button" class="panel-action ft-goto" data-node="${esc(id)}" style="--chip-hue:var(--h-${d.cat})"><span class="ft-goto-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${model.ICONS[d.icon] || ""}</svg></span>${esc(d.concept)}${svg(ARROW)}</button>`).join("");
		const kids = n.dir ? n.kids.filter((k) => k.entry).map((k) => `<li><button type="button" class="ft-link" data-path="${esc(k.path)}">${esc(k.name + (k.dir ? "/" : ""))}</button> ${k.entry.t}</li>`).join("") : "";
		const hue = nodes[0]?.[1].cat || null;
		act.panelHTML(`
      <div class="p-eyebrow">${n.dir ? "Folder" : "File"}</div>
      <h2 class="ft-h">${esc(n.name + (n.dir ? "/" : ""))}</h2>
      <p class="p-sub mono">${esc(n.path + (n.dir ? "/" : ""))}</p>
      ${e.tag ? `<div class="p-chips ft-chips"><span class="pchip">${esc(e.tag)}</span></div>` : ""}
      ${e.t ? `<h3>${esc(env.t("filesWhat"))}</h3><p>${e.t}</p>` : ""}
      ${e.why ? `<h3>${esc(env.t("filesWhy"))}</h3><p>${e.why}</p>` : ""}
      ${onMap ? `<h3>${esc(env.t("filesOnMap"))}</h3><div class="panel-actions">${onMap}</div>` : ""}
      ${kids ? `<h3>${esc(env.t("filesInside"))}</h3><ul class="newlist ft-toplist">${kids}</ul>` : ""}
    `, hue);
		panelBody.querySelectorAll("[data-node]").forEach((b) => env.scope.listen(b, "click", () => goToNode(b.dataset.node)));
		panelBody.querySelectorAll(".ft-link").forEach((b) => env.scope.listen(b, "click", () => select(b.dataset.path, { reveal: true })));
		act.openPanel();
	}
	function select(path, { reveal = false, focus = false } = {}) {
		const n = byPath.get(path.replace(/\/$/, ""));
		if (!n) return false;
		if (reveal) for (let p = n.parent; p && p !== root; p = p.parent) expanded.add(p.path);
		selected = n;
		render();
		renderEntry(n);
		const row = tree.querySelector(`.ft-row[data-path="${CSS.escape(n.path)}"]`);
		if (row) {
			if (reveal) row.scrollIntoView({
				block: "nearest",
				behavior: env.reduced ? "auto" : "smooth"
			});
			if (focus) row.focus({ preventScroll: !reveal });
		}
		return true;
	}
	function toggle(n, want) {
		if (!n.dir) return;
		if (want ?? !expanded.has(n.path)) expanded.add(n.path);
		else expanded.delete(n.path);
	}
	function goToNode(id) {
		close();
		if (state.level !== 1) act.showLevel(1);
		act.selectNode(id);
	}
	function open(path) {
		if (state.tour.active) return;
		act.closeInside();
		act.clearStory();
		box.hidden = false;
		btn.setAttribute("aria-pressed", "true");
		stagecard.classList.add("files-open");
		if (path && select(path, {
			reveal: true,
			focus: true
		})) return;
		selected = null;
		render();
		renderIntro();
	}
	function close() {
		if (box.hidden) return;
		box.hidden = true;
		btn.setAttribute("aria-pressed", "false");
		stagecard.classList.remove("files-open");
	}
	function rerenderPanelAfterClose() {
		close();
		if (state.level === 0) act.renderL0();
		else if (state.selected) act.renderNode(state.selected);
		else act.renderOverview();
	}
	env.scope.listen(btn, "click", () => box.hidden ? open() : rerenderPanelAfterClose());
	env.scope.listen(box.querySelector("#filesBack"), "click", rerenderPanelAfterClose);
	env.scope.listen(tree, "click", (ev) => {
		const c = ev.target.closest(".ft-chip");
		if (c) {
			goToNode(c.dataset.node);
			return;
		}
		const row = ev.target.closest(".ft-row[data-path]");
		if (!row) return;
		const n = byPath.get(row.dataset.path);
		if (n === root) {
			selected = null;
			render();
			renderIntro();
			tree.querySelector(".is-root")?.focus();
			return;
		}
		if (ev.target.closest(".ft-chev")) {
			toggle(n);
			render();
			row.focus?.();
			return;
		}
		if (n.dir && (n !== selected || !expanded.has(n.path))) toggle(n, true);
		select(n.path, { focus: true });
	});
	env.scope.listen(tree, "keydown", (ev) => {
		const row = ev.target.closest(".ft-row[data-path]");
		if (!row) return;
		const rows = [...tree.querySelectorAll(".ft-row[data-path]")];
		const i = rows.indexOf(row), n = byPath.get(row.dataset.path);
		if (n === root && !["ArrowDown", "ArrowUp"].includes(ev.key)) {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				selected = null;
				render();
				renderIntro();
				tree.querySelector(".is-root")?.focus();
			}
			return;
		}
		const move = (j) => {
			if (rows[j]) {
				rows.forEach((r) => r.tabIndex = -1);
				rows[j].tabIndex = 0;
				rows[j].focus();
			}
		};
		if (ev.key === "ArrowDown") move(i + 1);
		else if (ev.key === "ArrowUp") move(i - 1);
		else if (ev.key === "ArrowRight" && n.dir) {
			if (!expanded.has(n.path)) {
				toggle(n, true);
				render();
				tree.querySelector(`.ft-row[data-path="${CSS.escape(n.path)}"]`)?.focus();
			} else move(i + 1);
		} else if (ev.key === "ArrowLeft") {
			if (n.dir && expanded.has(n.path)) {
				toggle(n, false);
				render();
				tree.querySelector(`.ft-row[data-path="${CSS.escape(n.path)}"]`)?.focus();
			} else if (n.parent && n.parent !== root) move(rows.findIndex((r) => r.dataset.path === n.parent.path));
		} else if (ev.key === "Enter" || ev.key === " ") {
			if (n.dir) toggle(n, true);
			select(n.path, { focus: true });
		} else return;
		ev.preventDefault();
	});
	/** Paths whose entries list this node, for the node panel's "In the code". */
	const pathsFor = (id) => files.entries.filter((e) => e.nodes?.includes(id)).map((e) => e.path);
	return {
		available: true,
		open,
		close,
		isOpen: () => !box.hidden,
		pathsFor
	};
}
// src/runtime/help.js
/** Help: what each way into the map is for, in one place (2026-11-10).
The "?" button beside the theme switch opens a short card, one line per
mode the map actually has (a question a reader might ask, then where to
go); each line also opens its mode. The same lines show as hover hints
on the controls themselves, so the two never disagree. All text comes
from `ui` (help*), so a map can reword it. */
var NEEDS = ["showLevel", "hasFiles"];
function createHelp({ env, model, state, act }) {
	const doc = env.document;
	const btn = doc.getElementById("helpBtn");
	const pop = doc.getElementById("helpPop");
	const list = doc.getElementById("helpList");
	if (!btn || !pop || !list) return { close() {} };
	const flowControls = doc.getElementById("flowControls");
	const flowPicker = doc.getElementById("flowPicker");
	const buildStart = () => doc.querySelector("#weekSeg button[data-w=\"1\"]");
	const tourBtn = doc.getElementById("tourBtn");
	const toL0 = doc.getElementById("toL0");
	const t = env.t;
	const hasInsides = Object.keys(model.INSIDES || {}).length > 0;
	const modes = [
		{
			ask: t("helpTourAsk"),
			text: t("helpTour"),
			shown: () => (model.definition.tour || []).length > 0,
			go: () => tourBtn.click(),
			at: [tourBtn]
		},
		{
			ask: t("helpOverviewAsk"),
			text: t("helpOverview"),
			shown: () => true,
			go: () => {
				if (state.level !== 0) toL0.click();
			}
		},
		{
			ask: t("helpMapAsk"),
			text: t("helpMap") + (hasInsides ? " " + t("helpMapInside") : ""),
			shown: () => true,
			go: () => {
				if (state.level === 1) return;
				const full = doc.getElementById("gofull");
				if (full) full.click();
				else act.showLevel(1);
			}
		},
		{
			ask: t("helpFlowAsk"),
			text: t("helpFlow"),
			shown: () => !flowControls.hidden,
			go: () => {
				flowPicker.open = true;
				flowPicker.querySelector("summary").focus();
			},
			at: [flowPicker.querySelector("summary")]
		},
		{
			ask: t("helpFilesAsk"),
			text: t("helpFiles"),
			shown: () => act.hasFiles(),
			go: () => doc.getElementById("filesBtn").click(),
			at: [doc.getElementById("filesBtn")]
		},
		{
			ask: t("helpBuildAsk"),
			text: t("helpBuild"),
			shown: () => Boolean(buildStart()),
			go: () => buildStart().click(),
			at: [doc.querySelector(".build-controls .clabel"), doc.querySelector("#weekSeg button[data-w=\"0\"]")]
		}
	].filter((m) => m.shown());
	modes.forEach((m) => {
		const li = doc.createElement("li");
		const row = doc.createElement("button");
		row.type = "button";
		row.className = "help-row";
		const ask = doc.createElement("span");
		ask.className = "help-ask";
		ask.textContent = m.ask;
		const text = doc.createElement("span");
		text.className = "help-text";
		text.textContent = m.text;
		row.append(ask, text);
		env.scope.listen(row, "click", () => {
			close();
			m.go();
		});
		li.append(row);
		list.append(li);
	});
	function open() {
		hideTip();
		pop.hidden = false;
		btn.setAttribute("aria-expanded", "true");
		pop.focus();
	}
	function close(restoreFocus = false) {
		if (pop.hidden) return;
		pop.hidden = true;
		btn.setAttribute("aria-expanded", "false");
		if (restoreFocus) btn.focus();
	}
	env.scope.listen(btn, "click", () => pop.hidden ? open() : close());
	env.scope.listen(doc, "pointerdown", (e) => {
		if (!pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) close();
	});
	for (const el of [btn, pop]) env.scope.listen(el, "keydown", (e) => {
		if (e.key !== "Escape" || pop.hidden) return;
		e.stopPropagation();
		close(true);
	});
	const tip = doc.createElement("div");
	tip.className = "modetip";
	tip.hidden = true;
	tip.setAttribute("aria-hidden", "true");
	btn.closest(".controls").appendChild(tip);
	let timer = 0;
	function showTip(m, el) {
		tip.replaceChildren();
		const ask = doc.createElement("b");
		ask.textContent = m.ask;
		tip.append(ask, " " + m.text);
		tip.hidden = false;
		const r = el.getBoundingClientRect(), w = tip.offsetWidth;
		tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
		tip.style.top = r.bottom + 8 + "px";
	}
	function hideTip() {
		env.clearTimeout(timer);
		tip.hidden = true;
	}
	modes.forEach((m) => (m.at || []).filter(Boolean).forEach((el) => {
		env.scope.listen(el, "pointerenter", (e) => {
			if (e.pointerType !== "mouse" || flowPicker.open || !pop.hidden) return;
			env.clearTimeout(timer);
			timer = env.setTimeout(() => showTip(m, el), 450);
		});
		env.scope.listen(el, "focus", () => {
			if (el.matches(":focus-visible") && !flowPicker.open) showTip(m, el);
		});
		for (const ev of [
			"pointerleave",
			"blur",
			"pointerdown",
			"click"
		]) env.scope.listen(el, ev, hideTip);
	}));
	return { close };
}
// src/runtime/engine.js
/** Builds the viewer: the read-only env and model, the one state object, the drawn scene, then the
*  modules, each given only the neighbours' functions it lists in its NEEDS; then the first view
*  and the public controller (window.mapViewer). Holds no behaviour of its own. */
async function mountEngine(root, definition) {
	"use strict";
	const env = createEnv(root, definition);
	const model = createModel(definition);
	const state = createState();
	const wired = {};
	function actFor(who, needs) {
		const act = {};
		for (const name of needs) act[name] = (...args) => {
			if (!wired[name]) throw new Error(`${who}: ${name} is not wired`);
			return wired[name](...args);
		};
		return Object.freeze(act);
	}
	const inputs = (who, needs) => ({
		env,
		model,
		scene,
		state,
		act: actFor(who, needs)
	});
	const scene = await createScene(env, model, {
		openGroup: (id) => navigation.focusGroup(id),
		selectNode: (id) => navigation.selectNode(id)
	});
	const panels = createPanels(inputs("panels", NEEDS$6));
	const navigation = createNavigation(inputs("navigation", NEEDS$2));
	const flow = createFlowplayer(inputs("flow-player", NEEDS$5));
	const camera = createCamera(inputs("camera", NEEDS$4));
	Object.assign(wired, panels, navigation, flow, camera, {
		closeInside(...args) {
			files.close();
			return panels.closeInside(...args);
		},
		hasFiles: () => files.available,
		filesFor: (id) => files.pathsFor(id),
		openFiles: (path) => files.open(path),
		filesIsOpen: () => files.isOpen()
	});
	const files = createFilesView(inputs("files-view", NEEDS$1));
	createHelp(inputs("help", NEEDS));
	const tour = createTourplayer(inputs("tour-player", NEEDS$3));
	navigation.applyLabels();
	navigation.setWeek(0, { silent: true });
	navigation.showLevel(0);
	panels.renderL0();
	panels.openPanel();
	const wantNode = env.param("node");
	if (wantNode && scene.nodeEls[wantNode]) {
		navigation.showLevel(1);
		navigation.selectNode(wantNode);
	}
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
// src/app.js
var mounted = false;
/** Mount one document-level tool. SVG ids/fullscreen/styles require a single active instance per document. */
async function mount(root, definition) {
	if (mounted) throw new Error("Destroy the current tool before mounting another in this document.");
	mounted = true;
	const html = document.documentElement;
	const previous = {
		classes: html.className,
		theme: html.getAttribute("data-theme"),
		title: document.title
	};
	try {
		const prepared = prepareDefinition(definition);
		root.innerHTML = renderShell(template_default, prepared);
		document.title = prepared.page.title;
		const style = document.createElement("style");
		style.textContent = roleStyles(prepared);
		root.prepend(style);
		const controller = await mountEngine(root, prepared);
		let destroyed = false;
		return {
			...Object.fromEntries(Object.entries(controller).map(([name, action]) => [name, (...args) => {
				if (destroyed) throw new Error("This tool instance has been destroyed.");
				return action(...args);
			}])),
			destroy() {
				if (destroyed) return;
				destroyed = true;
				controller.destroy();
				html.className = previous.classes;
				document.title = previous.title;
				if (previous.theme === null) html.removeAttribute("data-theme");
				else html.dataset.theme = previous.theme;
				mounted = false;
			}
		};
	} catch (error) {
		mounted = false;
		root.replaceChildren();
		document.title = previous.title;
		html.className = previous.classes;
		if (previous.theme === null) html.removeAttribute("data-theme");
		else html.dataset.theme = previous.theme;
		throw error;
	}
}
// src/main.js
var root = document.getElementById("app");
/** A rendered page carries its map inline; dev shows a skill example (?map=fastapi-service). */
async function loadDefinition() {
	const inline = document.getElementById("map-definition")?.textContent.trim();
	if (inline) return JSON.parse(inline);
	throw new Error("This page has no map. Fill it with scripts/render.py.");
}
try {
	const controller = await mount(root, await loadDefinition());
	window.mapViewer = controller;
} catch (error) {
	root.replaceChildren(Object.assign(document.createElement("pre"), {
		className: "map-error",
		textContent: `This map could not be shown.\n${error.message}`
	}));
	console.error(error);
}
