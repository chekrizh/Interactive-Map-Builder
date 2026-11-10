// src/template.html?raw
var template_default = "\n\n\n<div class=\"pintitle\" id=\"pinTitle\" hidden>\n  <span class=\"eyebrow\">Your system so far</span>\n  <h1 id=\"pinTitleWeek\"></h1>\n</div>\n\n<section class=\"controls\" aria-label=\"Explore the map\">\n  <div class=\"flow-controls\" id=\"flowControls\">\n    <div class=\"cgroup flow-field\">\n      <div class=\"clabel\" id=\"flowLabel\">Watch a flow</div>\n      <details class=\"flow-picker\" id=\"flowPicker\">\n        <summary aria-labelledby=\"flowLabel flowSelected\"><span class=\"flow-dot\" aria-hidden=\"true\"></span><span id=\"flowSelected\">Choose a flow</span><svg class=\"flow-chevron\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg></summary>\n        <div class=\"flow-menu\" aria-label=\"Available flows\">\n          <div class=\"flow-option-group\" role=\"group\" aria-labelledby=\"systemFlowsLabel\"><div class=\"flow-options-label\" id=\"systemFlowsLabel\">System flows</div><div id=\"storyOptions\"></div></div>\n          <div class=\"flow-option-group\" role=\"group\" aria-labelledby=\"failureFlowsLabel\"><div class=\"flow-options-label\" id=\"failureFlowsLabel\">Failure scenario</div><div id=\"failureOptions\"></div></div>\n        </div>\n      </details>\n    </div>\n    <button type=\"button\" class=\"flow-play\" id=\"playFlow\"><svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M3 1.5 14 8 3 14.5Z\"/></svg><span>Play flow</span></button>\n  </div>\n  <div class=\"cgroup build-controls\">\n    <div class=\"clabel\">Build it step by step</div>\n    <div class=\"seg\" id=\"weekSeg\"></div>\n  </div>\n  <div class=\"cgroup tour-controls\" id=\"tourControls\">\n    <div class=\"clabel\" id=\"tourLabel\" hidden>New here?</div>\n    <button type=\"button\" class=\"tour-entry\" id=\"tourBtn\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 8.6v6.8l5.6-3.4z\" fill=\"currentColor\"/></svg><span id=\"tourBtnText\">{{tourEntry}}</span></button>\n    <button type=\"button\" class=\"files-entry\" id=\"filesBtn\" aria-pressed=\"false\" hidden><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 4v13a2 2 0 0 0 2 2h3M4 9h5\"/><rect x=\"11\" y=\"6\" width=\"9\" height=\"6\" rx=\"1.5\"/><rect x=\"11\" y=\"15\" width=\"9\" height=\"6\" rx=\"1.5\"/></svg><span id=\"filesBtnText\"></span></button>\n  </div>\n  <button type=\"button\" class=\"theme-toggle\" id=\"themeToggle\" aria-label=\"Switch to dark theme\" title=\"Switch theme\"><svg class=\"ico-moon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/></svg><svg class=\"ico-sun\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\"/></svg></button>\n\n</section>\n<div id=\"ctrlSlot\" hidden></div>\n\n<main class=\"wrap\">\n  <div class=\"stagecard\">\n\n    <div class=\"tourbar\" id=\"tourBar\">\n      <div class=\"tb-text\"><div class=\"tb-eyebrow\">Guided tour</div><div class=\"tb-status\" id=\"tourStatus\"></div></div>\n      <ol class=\"tb-chapters\" id=\"tourChapters\" aria-label=\"Tour chapters\"></ol>\n      <button type=\"button\" class=\"crumbbtn tb-exit\" id=\"tourExit\">Exit tour</button>\n    </div>\n    <div class=\"crumbbar\">\n      <button class=\"crumbbtn\" id=\"toL0\" hidden>&lsaquo; Big picture</button>\n      <span class=\"crumbnote\" id=\"crumbNote\">The big picture</span>\n      <button class=\"crumbbtn\" id=\"unfocus\" hidden></button>\n\n      <button class=\"crumbbtn\" id=\"panelBtn\" hidden>Show panel</button>\n      <button class=\"crumbbtn\" id=\"fsBtn\">Full screen</button>\n    </div>\n    <div class=\"stage-scroll\">\n      <span class=\"zoomctl\" id=\"zoomCtl\" role=\"group\" aria-label=\"Canvas zoom\">\n        <button type=\"button\" class=\"crumbbtn\" id=\"zoomOut\" aria-label=\"Zoom out\" title=\"Zoom out\">−</button>\n        <button type=\"button\" class=\"crumbbtn\" id=\"zoomFit\" aria-label=\"Fit whole map\" title=\"Fit whole map\">Fit</button>\n        <button type=\"button\" class=\"crumbbtn\" id=\"zoomIn\" aria-label=\"Zoom in\" title=\"Zoom in\">+</button>\n      </span>\n      <svg id=\"map0\" class=\"mapsvg ml-canvas\" viewBox=\"{{overviewViewBox}}\" role=\"img\"\n        aria-label=\"{{overviewDescription}}\"></svg>\n      <svg id=\"map\" class=\"mapsvg ml-canvas\" viewBox=\"{{mapViewBox}}\" role=\"img\" style=\"display:none\"\n        aria-label=\"{{mapDescription}}\"></svg>\n    </div>\n    <div class=\"legend ml-canvas\">{{legend}}</div>\n    <div class=\"inside\" id=\"inside\" hidden>\n      <button class=\"crumbbtn\" id=\"insideBack\">&lsaquo; Back to the map</button>\n      <h2 id=\"insideTitle\"></h2>\n      <p class=\"i-sub\" id=\"insideSub\"></p>\n      <div id=\"insideScene\"></div>\n      <p class=\"i-cap\" id=\"insideCap\"></p>\n    </div>\n    <div class=\"files\" id=\"files\" hidden>\n      <div class=\"crumbbar files-head\">\n        <button class=\"crumbbtn\" id=\"filesBack\">&lsaquo; Back to the map</button>\n        <span class=\"crumbnote\" id=\"filesTitle\"></span>\n      </div>\n      <div class=\"files-body\">\n        <div class=\"ft\" id=\"filesTree\" role=\"tree\" aria-labelledby=\"filesTitle\"></div>\n      </div>\n    </div>\n    <div class=\"drawer\" id=\"drawer\">\n      <div class=\"panelhead\"><button type=\"button\" class=\"crumbbtn drawerclose\" id=\"drawerClose\" aria-label=\"Close panel\" title=\"Close panel\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button></div>\n      <div id=\"drawerBody\"></div>\n    </div>\n    <section class=\"tourcard\" id=\"tourCard\" aria-labelledby=\"tcTitle\" hidden>\n      <div class=\"tc-scroll\" id=\"tcScroll\">\n      <div aria-live=\"polite\">\n        <div class=\"tc-eyebrow\"><span class=\"tc-dot\" aria-hidden=\"true\"></span><span id=\"tcEyebrow\"></span></div>\n        <h2 id=\"tcTitle\" tabindex=\"-1\"></h2>\n        <div class=\"tc-body\" id=\"tcBody\"></div>\n        <ol class=\"tc-list\" id=\"tcList\" hidden></ol>\n        <div class=\"tc-why\" id=\"tcWhy\"><div class=\"tc-why-label\">Why it matters</div><p id=\"tcWhyText\"></p></div>\n      </div>\n      </div>\n      <p class=\"tc-hint\" id=\"tcHint\" hidden>Press Next to walk through each step.<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 5v14m-6-6 6 6 6-6\"/></svg></p>\n      <div class=\"tc-foot\">\n        <span class=\"tc-count\" id=\"tcCount\"></span>\n        <button type=\"button\" class=\"tc-back\" id=\"tcBack\">Back</button>\n        <button type=\"button\" class=\"tc-next\" id=\"tcNext\">Next</button>\n      </div>\n      <p class=\"tc-keys\" aria-hidden=\"true\"><kbd>&larr;</kbd> <kbd>&rarr;</kbd> to go back or next <span>&middot;</span> <kbd>Esc</kbd> to exit</p>\n    </section>\n    <div class=\"tourend\" id=\"tourEnd\" hidden>\n      <div class=\"tourend-card\" role=\"dialog\" aria-labelledby=\"teTitle\">\n        <div class=\"te-check\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></svg></div>\n        <div class=\"te-eyebrow\">{{completionCount}}</div>\n        <h1 id=\"teTitle\" tabindex=\"-1\">You've finished the tour</h1>\n        <p class=\"te-lede\">{{completionIntro}}</p>\n        <ul class=\"te-list\">{{completionLessons}}</ul>\n\n        <div class=\"te-links\">\n          <button type=\"button\" id=\"teBack\">Back to the map</button>\n          <span class=\"te-sep\" aria-hidden=\"true\" {{nextToolHidden}}>|</span>\n          <a id=\"teNext\" href=\"{{nextToolUrl}}\" {{nextToolHidden}}>{{nextToolLabel}}</a>\n        </div>\n      </div>\n    </div>\n  </div>\n  <span id=\"panelSlot\" hidden></span>\n  <aside class=\"panel\" id=\"panel\">\n    <div class=\"panelhead\"><button type=\"button\" class=\"crumbbtn panelclose\" id=\"panelClose\" aria-label=\"Close panel\" title=\"Close panel\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg></button></div>\n    <div id=\"panelBody\"></div>\n  </aside>\n</main>\n";
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
// src/rendering/inside-scenes.js
var attr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
/** "path/file.js:466-471" -> link to that range at the pinned commit, labelled "file.js:466". */
function codeLink(ref, source) {
	if (!ref) return "";
	const [path, lines = ""] = String(ref).split(":");
	const [from, to] = lines.split("-");
	const label = path.split("/").pop() + (from ? ":" + from : "");
	if (!source?.repo) return `<span class="ins-code">${label}</span>`;
	const anchor = from ? `#L${from}${to ? "-L" + to : ""}` : "";
	return `<a class="ins-code" href="${attr(`${source.repo.replace(/\/$/, "")}/blob/${source.ref || "HEAD"}/${path}${anchor}`)}" target="_blank" rel="noopener" title="${attr(path + (lines ? ":" + lines : ""))}">${label}</a>`;
}
function steps(scene, source) {
	return `<ol class="ins-steps">${scene.steps.map((s, i) => {
		const exit = s.exit ? `<div class="ins-exit"><span class="ins-when">${s.exit.when || ""}</span><div class="ins-exit-card"><div class="ins-t">${s.exit.t}</div>${s.exit.code ? codeLink(s.exit.code, source) : ""}</div></div>` : "";
		return `<li class="ins-step${s.async ? " is-async" : ""}${i === scene.steps.length - 1 ? " is-last" : ""}"><div class="ins-card"><span class="ins-n">${i + 1}</span><div class="ins-main"><div class="ins-t">${s.t}</div>` + (s.d ? `<div class="ins-d">${s.d}</div>` : "") + codeLink(s.code, source) + `</div></div>${exit}</li>`;
	}).join("")}</ol>`;
}
function schema(scene, source) {
	return `<div class="ins-schema">${scene.tables.map((t) => {
		const fields = (t.fields || []).map((f) => `<li><span class="ins-f">${f.n}</span>` + (f.type ? `<span class="ins-type">${f.type}</span>` : "") + (f.ref ? `<span class="ins-ref" data-ref="${attr(f.ref)}">→ ${f.ref}</span>` : "") + (f.note ? `<span class="ins-fnote">${f.note}</span>` : "") + `</li>`).join("");
		return `<section class="ins-table" data-table="${attr(t.name)}"><header><span class="ins-name">${t.name}</span>` + (t.ttl ? `<span class="ins-ttl">${t.ttl}</span>` : "") + `</header>` + (t.note ? `<p class="ins-note">${t.note}</p>` : "") + (fields ? `<ul>${fields}</ul>` : "") + (t.code ? `<footer>${codeLink(t.code, source)}</footer>` : "") + `</section>`;
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
/** panels: extracted original behavior; dependencies supplied by the instance controller. */
function createPanels(ctx) {
	function openInside(nodeId) {
		const n = ctx.nodeEls[nodeId].def;
		const sc = ctx.INSIDES[n.inside];
		if (!sc) return;
		ctx.T()?.step("inside", nodeId);
		ctx.document.getElementById("insideTitle").textContent = sc.title;
		ctx.document.getElementById("insideSub").textContent = sc.sub;
		ctx.document.getElementById("insideCap").textContent = sc.cap || "";
		if (sc.kind) {
			ctx.document.getElementById("insideSub").innerHTML = sc.sub || "";
			ctx.document.getElementById("insideCap").innerHTML = sc.cap || "";
			const box = ctx.document.getElementById("insideScene");
			box.innerHTML = renderInsideScene(sc, sc.source);
			box.firstElementChild.style.setProperty("--ins-hue", `var(--h-${n.cat})`);
			wireInsideScene(box);
			ctx.insideBox.hidden = false;
			return;
		}
		ctx.document.getElementById("insideScene").innerHTML = `<svg class="iscene ml-canvas" viewBox="0 0 ${sc.w} ${sc.h}" role="img" aria-label="${sc.title}">${ctx.IMARK}${sc.svg}</svg>`;
		const scene = ctx.document.querySelector("#insideScene svg");
		ctx.canvas.setRole(scene, n.cat);
		scene.querySelectorAll(".ie").forEach((path) => {
			if (!/[CQ]/.test(path.getAttribute("d"))) path.setAttribute("d", ctx.canvas.roundPath(path.getAttribute("d"), 10));
		});
		ctx.insideBox.hidden = false;
	}
	function closeInside() {
		ctx.insideBox.hidden = true;
	}
	function openPanel() {
		if (ctx.fsMode) {
			ctx.updateDrawerBounds();
			ctx.drawer.classList.add("open");
		}
		ctx.panel.classList.remove("closed");
		ctx.panelBtn.hidden = true;
	}
	function closePanel() {
		if (ctx.fsMode) ctx.drawer.classList.remove("open");
		else ctx.panel.classList.add("closed");
		ctx.panelBtn.hidden = false;
	}
	function panelIsOpen() {
		return ctx.fsMode ? ctx.drawer.classList.contains("open") : !ctx.panel.classList.contains("closed");
	}
	function revealInPanel(elm) {
		const box = ctx.fsMode ? ctx.drawer : ctx.panel;
		const br = box.getBoundingClientRect(), er = elm.getBoundingClientRect();
		const d = er.bottom > br.bottom ? er.bottom - br.bottom : er.top < br.top ? er.top - br.top : 0;
		if (!d) return;
		box.scrollTo({
			top: box.scrollTop + d,
			behavior: ctx.reduced ? "auto" : "smooth"
		});
	}
	function syncPanelHead(box) {
		const head = box.querySelector(":scope > .panelhead");
		if (!head) return;
		const scrolled = box.scrollTop > 0;
		head.classList.toggle("scrolled", scrolled);
		let label = head.querySelector(".ph-label");
		if (!label) {
			label = ctx.document.createElement("span");
			label.className = "ph-label";
			label.setAttribute("aria-hidden", "true");
			head.prepend(label);
		}
		const eyebrow = ctx.panelBody.querySelector(".p-eyebrow"), title = ctx.panelBody.querySelector("h2");
		const titleGone = Boolean(title) && title.getBoundingClientRect().bottom < head.getBoundingClientRect().bottom;
		const text = !scrolled ? "" : titleGone ? title.textContent.trim() : eyebrow ? eyebrow.textContent.trim() : "";
		label.hidden = !text;
		label.textContent = text;
		label.classList.toggle("title", titleGone);
		label.style.setProperty("--ph-hue", getComputedStyle(ctx.panel).getPropertyValue("--p-hue"));
	}
	function catName(c) {
		return ctx.definition.roles[c]?.label || c;
	}
	function panelHTML(h, hueKey) {
		ctx.panel.dataset.panelDesign = "journey";
		ctx.panel.style.setProperty("--p-hue", hueKey ? ctx.hue(hueKey) : "var(--muted)");
		ctx.panelBody.innerHTML = h;
		if (typeof ctx.syncPanelHead === "function") [ctx.panel, ctx.drawer].forEach(ctx.syncPanelHead);
	}
	function renderL0() {
		ctx.panelHTML(ctx.definition.panels.introHtml, null);
		const b = ctx.document.getElementById("gofull");
		if (b) ctx.scope.listen(b, "click", () => {
			ctx.showLevel(1);
			ctx.setFocus(null);
			ctx.renderOverview();
		});
	}
	function renderOverview() {
		ctx.panelHTML(ctx.definition.panels.overviewHtml, null);
	}
	function renderGroup(g) {
		const G = ctx.GROUPS[g];
		const items = G.members.map((id) => {
			const n = ctx.nodeEls[id].def;
			return `<li><strong>${n.concept}</strong>: ${n.tool}</li>`;
		}).join("");
		ctx.panelHTML(`
      <div class="p-eyebrow">${ctx.definition.panels.stageEyebrow}</div>
      <h2>${G.title}</h2>
      <p style="margin-top:8px">${G.text}</p>
      <h3>${ctx.definition.panels.stageMembers}</h3><ul class="newlist">${items}</ul>
      <p class="p-note" style="margin-top:12px">${ctx.definition.panels.stageNote}</p>
    `, G.huekey);
		ctx.openPanel();
	}
	function renderNode(id) {
		const n = ctx.nodeEls[id].def;
		const decision = n.decision ? `<h3>${ctx.definition.panels.decision}</h3><div class="decision">${n.decision}</div>` : "";
		const look = n.inside ? `<div class="panel-actions"><button type="button" class="panel-action" id="lookInside">Look inside<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button></div>` : "";
		const paths = ctx.filesView?.available ? ctx.filesView.pathsFor(id) : [];
		const repo = paths.length ? `<h3>${ctx.definition.panels.repository}</h3>
      <div class="panel-actions xrepo">${paths.map((p) => `<button type="button" class="panel-action" data-files-path="${p}" aria-label="Show ${p} in the project files"><span class="mono">${p}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button>`).join("")}</div>` : n.structure ? `<h3>${ctx.definition.panels.repository}</h3>
      <div class="panel-actions xrepo"><a class="panel-action" href="${ctx.structureHref(n.structure)}"${ctx.LINK_TARGET} aria-label="Open ${n.structure} in the project layout"><span class="mono">${n.structure}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></a></div>` : "";
		const bnote = ctx.BOOTCAMP && n.bootcampNote ? `<h3>${ctx.definition.panels.course}</h3><div class="bnote">${n.bootcampNote}</div>` : "";
		ctx.panelHTML(`
      <div class="p-eyebrow">${ctx.catName(n.cat)}${n.art ? ctx.definition.panels.fileSuffix : ""}</div>
      <h2>${ctx.viewMode === "tools" ? n.tool : n.concept}</h2>
      <p class="p-sub">${ctx.viewMode === "tools" ? n.concept : n.tool}</p>
      <div class="p-chips"><span class="pchip">${ctx.format(ctx.BOOTCAMP ? ctx.definition.panels.nodeCourseLabel : ctx.definition.panels.nodeBuildLabel, {
			step: n.week,
			total: ctx.WEEKS.length - 1
		})}</span></div>
      <h3>${ctx.definition.panels.what}</h3><p>${n.what}</p>
      <h3>${ctx.definition.panels.why}</h3><p>${n.why}</p>
      ${bnote}
      ${decision}
      <h3>${ctx.definition.panels.tools}</h3><p class="toolline">${n.tools}</p>
      ${repo}
      ${look}
    `, n.cat);
		const b = ctx.document.getElementById("lookInside");
		if (b) ctx.scope.listen(b, "click", () => ctx.openInside(id));
		ctx.panelBody.querySelectorAll("[data-files-path]").forEach((el) => ctx.scope.listen(el, "click", () => ctx.filesView.open(el.dataset.filesPath)));
		ctx.openPanel();
	}
	function renderWeek(w) {
		const d = ctx.WEEKS[w];
		const items = d.nodes.map((id) => {
			const n = ctx.nodeEls[id].def;
			return `<li><strong>${n.concept}</strong>: ${n.tool}</li>`;
		}).join("");
		ctx.panelHTML(`
      <div class="p-eyebrow">${ctx.format(ctx.BOOTCAMP ? ctx.definition.panels.courseLabel : ctx.definition.panels.buildLabel, {
			step: w,
			total: ctx.WEEKS.length - 1
		})}</div>
      <h2>${d.title}</h2>
      <p style="margin-top:8px">${ctx.BOOTCAMP && d.you ? d.you : d.text}</p>
      <h3>${ctx.definition.panels.newNodes}</h3><ul class="newlist">${items}</ul>
      <h3>${ctx.definition.panels.decision}</h3><div class="decision">${d.decision}</div>
      <h3>${ctx.definition.panels.runnable}</h3><pre class="cmd"><code>${d.runnable}</code></pre>
      <p class="p-note">${ctx.PINNED ? ctx.definition.panels.pinnedNote : ctx.definition.panels.buildNote}</p>
    `, ctx.definition.panels.buildRole);
		ctx.openPanel();
	}
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
/** flow-player: extracted original behavior; dependencies supplied by the instance controller. */
function createFlowplayer(ctx) {
	function clearStory() {
		ctx.storyToken++;
		ctx.storyLayer.innerHTML = "";
		ctx.svg.classList.remove("tfocus", "flowing");
		if (ctx.dot) {
			ctx.dot.remove();
			ctx.dot = null;
		}
		ctx.svg.querySelectorAll(".fout, .inchip").forEach((x) => x.classList.remove("fout", "inchip"));
		ctx.EDGES.forEach((e) => {
			const ee = ctx.edgeEls[e.id];
			ee.path.classList.remove("eactive", "tcur", "eglow");
			if (ee.start) {
				ee.start.remove();
				ee.start = null;
			}
			ee.path.style.stroke = "";
			ee.path.setAttribute("marker-end", "url(#arr-base)");
			if (e.bidir) ee.path.setAttribute("marker-start", "url(#arr-base)");
		});
		ctx.NODES.forEach((n) => {
			const g = ctx.nodeEls[n.id].g;
			g.classList.remove("lit", "broken");
			g.style.removeProperty("--story-hue");
		});
	}
	function animateDot(pathEl, rev, hueKey) {
		return ctx.scope.cancellable((resolve) => {
			const token = ctx.storyToken;
			const L = pathEl.getTotalLength();
			if (ctx.reduced) {
				ctx.setTimeout(resolve, 350);
				return;
			}
			if (!ctx.dot) {
				ctx.dot = ctx.el("g", { class: "fdot" }, ctx.svg);
				ctx.el("circle", {
					r: 11,
					class: "fdot-halo"
				}, ctx.dot);
				ctx.el("circle", {
					r: 5,
					class: "fdot-core"
				}, ctx.dot);
			}
			ctx.dot.style.setProperty("--story-hue", ctx.hue(hueKey));
			const dur = Math.min(3200, Math.max(1200, L * 5.2));
			const t0 = performance.now();
			function step(t) {
				if (token !== ctx.storyToken) {
					resolve();
					return;
				}
				const k = Math.min(1, (t - t0) / dur);
				const ease = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
				const at = rev ? L * (1 - ease) : L * ease;
				const pt = pathEl.getPointAtLength(at);
				ctx.dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
				if (k < 1) ctx.requestAnimationFrame(step);
				else resolve();
			}
			ctx.requestAnimationFrame(step);
		});
	}
	function markSilent(sil) {
		const path = ctx.edgeEls[sil.e].path;
		const mid = path.getPointAtLength(path.getTotalLength() * .5);
		const g = ctx.el("g", {}, ctx.storyLayer);
		ctx.el("circle", {
			cx: mid.x,
			cy: mid.y,
			r: 9,
			class: "silent-c"
		}, g);
		ctx.el("path", {
			class: "silent-x",
			d: `M${mid.x - 3.6},${mid.y - 3.6} L${mid.x + 3.6},${mid.y + 3.6} M${mid.x + 3.6},${mid.y - 3.6} L${mid.x - 3.6},${mid.y + 3.6}`
		}, g);
		ctx.el("text", {
			x: mid.x,
			y: mid.y + 24,
			class: "silent-t"
		}, g).textContent = sil.t;
	}
	function popBadge(g) {
		if (!g || ctx.reduced) return;
		g.classList.remove("badge-pop");
		g.getBBox();
		g.classList.add("badge-pop");
	}
	async function playStory(key, opts) {
		const quiet = Boolean(opts && opts.quiet);
		const wide = Boolean(opts && opts.wide);
		const from = opts && opts.from || 0;
		if (!quiet) ctx.T()?.step("flow", key);
		if (ctx.level !== 1) ctx.showLevel(1);
		ctx.closeInside();
		ctx.clearStory();
		ctx.setFocus(null);
		const token = ctx.storyToken;
		if (ctx.week !== 0) ctx.setWeek(0, { silent: true });
		ctx.selected = null;
		ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.remove("sel"));
		const s = ctx.STORIES[key];
		ctx.svg.style.setProperty("--story-hue", ctx.hue(s.hue));
		let list = null;
		if (!quiet) {
			ctx.chooseFlow(key);
			ctx.panelHTML(`
        <div class="p-eyebrow">${s.kind === "failure" ? "Failure flow" : "Flow"}</div>
        <h2>${s.title}</h2>
        <p class="p-sub">${s.desc}</p>
        <ol class="steps" id="stepList"></ol>
      `, s.hue);
			ctx.openPanel();
			list = ctx.document.getElementById("stepList");
		}
		const badgeUses = {}, badgeSeen = {}, bidirSeen = {};
		s.hops.forEach((h) => {
			badgeUses[h.e] = (badgeUses[h.e] || 0) + 1;
		});
		const end = Math.min(s.hops.length, opts && opts.to || s.hops.length);
		const inFlow = /* @__PURE__ */ new Set(), flowEdges = /* @__PURE__ */ new Set();
		s.hops.slice(0, end).forEach((h) => {
			const d = ctx.edgeEls[h.e].def;
			flowEdges.add(h.e);
			inFlow.add(d.from);
			inFlow.add(d.to);
		});
		ctx.svg.classList.add("flowing");
		ctx.NODES.forEach((n) => {
			if (!inFlow.has(n.id)) ctx.nodeEls[n.id].g.classList.add("fout");
		});
		ctx.EDGES.forEach((e) => {
			if (flowEdges.has(e.id)) return;
			const ee = ctx.edgeEls[e.id];
			ee.path.classList.add("fout");
			ee.label?.classList.add("fout");
		});
		if (s.hops.length) {
			const h0 = s.hops[0], d0 = ctx.edgeEls[h0.e].def;
			const first = ctx.nodeEls[h0.rev ? d0.to : d0.from].g;
			first.style.setProperty("--story-hue", ctx.hue(h0.bad || !s.ok ? s.hue : s.ok));
			first.classList.add("lit");
		}
		for (let i = 0; i < end; i++) {
			if (token !== ctx.storyToken) return;
			const hop = s.hops[i];
			const landed = i < from;
			if (ctx.PINNED) {
				const d = ctx.edgeEls[hop.e].def;
				if (ctx.nodeEls[d.from].def.week > ctx.PINNED || ctx.nodeEls[d.to].def.week > ctx.PINNED) break;
			}
			const hk = hop.bad || !s.ok ? s.hue : s.ok;
			const ee = ctx.edgeEls[hop.e];
			ee.path.classList.add("eactive");
			ee.path.style.stroke = ctx.hue(hk);
			ee.path.style.setProperty("--glow", ctx.hue(hk));
			if (ee.def.bidir && !bidirSeen[hop.e]) {
				bidirSeen[hop.e] = true;
				ee.path.removeAttribute("marker-start");
				ee.path.removeAttribute("marker-end");
			}
			if (hop.rev && ee.def.bidir) ee.path.setAttribute("marker-start", "url(#arr-" + hk + ")");
			else ee.path.setAttribute("marker-end", "url(#arr-" + hk + ")");
			if (!ee.start) {
				const p0 = ee.path.getPointAtLength(hop.rev ? ee.path.getTotalLength() : 0);
				ee.start = ctx.el("circle", {
					cx: p0.x,
					cy: p0.y,
					r: 3.2,
					class: "fstart"
				}, ctx.storyLayer);
				ee.start.style.setProperty("--story-hue", ctx.hue(hk));
			}
			if (landed || wide) {} else ctx.focusHop(ee.path);
			if (!landed) {
				ee.path.classList.add("eglow");
				await ctx.animateDot(ee.path, !!hop.rev, hk);
				ee.path.classList.remove("eglow");
			}
			if (token !== ctx.storyToken) return;
			const L = ee.path.getTotalLength();
			const k = badgeSeen[hop.e] = (badgeSeen[hop.e] || 0) + 1;
			const mid = badgeUses[hop.e] === 1 && ee.mid ? ee.mid : ee.path.getPointAtLength(L * .5 + (k - (badgeUses[hop.e] + 1) / 2) * 26);
			const bg = ctx.el("g", {
				"data-hop": i,
				class: "fchip"
			}, ctx.storyLayer);
			bg.style.setProperty("--story-hue", ctx.hue(hk));
			const label = badgeUses[hop.e] === 1 && ee.label ? ee.def.label : "";
			const pill = ctx.el("rect", {
				class: "fchip-r",
				y: mid.y - 10,
				height: 20,
				rx: 10
			}, bg);
			ctx.el("circle", {
				cx: 0,
				cy: mid.y,
				r: 7,
				class: "badge-c"
			}, bg);
			const num = ctx.el("text", {
				x: 0,
				y: mid.y + 3.4,
				class: "badge-t"
			}, bg);
			num.textContent = String(i + 1);
			let w = 20;
			let txt = null;
			if (label) {
				txt = ctx.el("text", {
					y: mid.y + 3.4,
					class: "fchip-t"
				}, bg);
				txt.textContent = label;
				w = 26 + txt.getComputedTextLength() + 9;
				if (w > (ee.mid && badgeUses[hop.e] === 1 ? ee.mid.len - 4 : L - 28)) {
					txt.remove();
					txt = null;
					w = 20;
				} else ee.label.classList.add("inchip");
			}
			const x0 = mid.x - w / 2;
			pill.setAttribute("x", x0);
			pill.setAttribute("width", w);
			bg.querySelector(".badge-c").setAttribute("cx", x0 + 10);
			num.setAttribute("x", x0 + 10);
			if (txt) txt.setAttribute("x", x0 + 22);
			ctx.storyLayer.querySelectorAll("g.fchip.now").forEach((g) => g.classList.remove("now"));
			bg.classList.add("now");
			if (!landed) ctx.popBadge(bg);
			const endNode = hop.rev ? ee.def.from : ee.def.to;
			const eg = ctx.nodeEls[endNode].g;
			eg.style.setProperty("--story-hue", ctx.hue(hk));
			eg.classList.add("lit");
			if (hop.breaks) ctx.nodeEls[hop.breaks].g.classList.add("broken");
			if (hop.silent) ctx.markSilent(hop.silent);
			if (list) {
				const li = ctx.document.createElement("li");
				li.innerHTML = `<span class="n">${i + 1}</span>${hop.t}` + (hop.note ? `<span class="note">${hop.note}</span>` : "");
				li.querySelector(".n").style.background = ctx.hue(hk);
				list.appendChild(li);
				ctx.revealInPanel(li);
			}
			if (!landed) await ctx.scope.cancellable((r) => ctx.setTimeout(r, ctx.reduced ? 1400 : 800));
		}
		if (token !== ctx.storyToken) return;
		if (ctx.dot) {
			ctx.dot.remove();
			ctx.dot = null;
		}
		ctx.storyLayer.querySelectorAll("g.fchip.now").forEach((g) => g.classList.remove("now"));
		if (quiet) return;
		if (s.ending) ctx.panelBody.insertAdjacentHTML("beforeend", s.ending);
		else {
			const note = ctx.document.createElement("p");
			note.className = "p-note";
			note.textContent = ctx.definition.ui.flowComplete;
			ctx.panelBody.appendChild(note);
		}
		ctx.T()?.done("flow", key);
		ctx.T()?.milestone(s.completionMilestone || "flow_complete");
		if (s.markSeenOnComplete) ctx.T()?.seen();
		ctx.revealInPanel(ctx.panelBody.lastElementChild);
	}
	function chooseFlow(key, { preview = false } = {}) {
		if (!ctx.flowPicker.querySelector(`[data-flow="${key}"]`)) return;
		ctx.chosenFlow = key;
		ctx.controlsEl.style.setProperty("--flow-hue", ctx.hue(ctx.STORIES[key].hue));
		ctx.document.getElementById("flowSelected").textContent = ctx.STORIES[key].title;
		ctx.flowPicker.querySelectorAll("[data-flow]").forEach((button) => {
			button.setAttribute("aria-pressed", String(button.dataset.flow === key));
		});
		if (preview) {
			const story = ctx.STORIES[key];
			const label = story.kind === "failure" ? "Failure flow" : "Flow";
			const steps = story.hops.map((hop, index) => `<li><span class="n">${index + 1}</span>${hop.t}${hop.note ? `<span class="note">${hop.note}</span>` : ""}</li>`).join("");
			ctx.panelHTML(`<div class="p-eyebrow">${label}</div><h2>${story.title}</h2><p class="p-sub">${story.desc}</p><ol class="steps">${steps}</ol>`, story.hue);
			ctx.openPanel();
		}
	}
	function closeFlowPicker(restoreFocus = false) {
		ctx.flowPicker.open = false;
		if (restoreFocus) ctx.flowSummary.focus({ preventScroll: true });
	}
	function focusFlowOption() {
		(ctx.flowPicker.querySelector("[aria-pressed=\"true\"]") || ctx.flowPicker.querySelector("[data-flow]"))?.focus({ preventScroll: true });
	}
	return {
		clearStory,
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
/** camera: extracted original behavior; dependencies supplied by the instance controller. */
function createCamera(ctx) {
	function tourOcclusion() {
		if (!ctx.tour.active || ctx.tourCard.hidden) return {
			x: 0,
			y: 0
		};
		const sr = ctx.scroller.getBoundingClientRect(), cr = ctx.tourCard.getBoundingClientRect();
		if (ctx.phoneQuery.matches) return {
			x: 0,
			y: Math.max(0, sr.bottom - cr.top)
		};
		return {
			x: Math.max(0, sr.right - cr.left) + 20,
			y: 0
		};
	}
	function clampPan() {
		const s = ctx.activeSvg();
		const r = s.getBoundingClientRect();
		const sr = ctx.scroller.getBoundingClientRect();
		const m = new DOMMatrixReadOnly(getComputedStyle(s).transform === "none" ? void 0 : getComputedStyle(s).transform);
		let box = r;
		if (s === ctx.svg) {
			const a = ctx.zoneLayer.getBoundingClientRect(), b = ctx.nodeLayer.getBoundingClientRect();
			const left = Math.min(a.left, b.left), top = Math.min(a.top, b.top);
			box = {
				left,
				top,
				width: Math.max(a.right, b.right) - left,
				height: Math.max(a.bottom, b.bottom) - top
			};
		}
		const baseLeft = box.left - m.e, baseTop = box.top - m.f;
		const pad = Math.min(ctx.drawerOcclusion(), sr.width * .45);
		const vpad = Math.min(ctx.tourOcclusion().y, sr.height * .6);
		const cx = sr.left + (sr.width - pad) / 2, cy = sr.top + (sr.height - vpad) / 2;
		ctx.tx = Math.min(cx - baseLeft, Math.max(cx - baseLeft - box.width, ctx.tx));
		ctx.ty = Math.min(cy - baseTop, Math.max(cy - baseTop - box.height, ctx.ty));
	}
	function focusPoint(vx, vy) {
		if (!ctx.fsMode) return;
		const s = ctx.activeSvg();
		const r = s.getBoundingClientRect();
		const scale = r.width / (s === ctx.svg0 ? ctx.VB.map0[0] : ctx.VB.map[0]);
		const sr = ctx.scroller.getBoundingClientRect();
		const pad = Math.min(ctx.drawerOcclusion(), sr.width * .45);
		const vpad = Math.min(ctx.tourOcclusion().y, sr.height * .6);
		const pointX = r.left + vx * scale;
		const pointY = r.top + vy * scale;
		const targetX = sr.left + (sr.width - pad) / 2;
		const targetY = sr.top + (sr.height - vpad) / 2;
		ctx.tx += targetX - pointX;
		ctx.ty += targetY - pointY;
		ctx.stagecard.classList.add("campan");
		ctx.applyPan();
		ctx.clearTimeout(ctx.camTimer);
		ctx.camTimer = ctx.setTimeout(() => ctx.stagecard.classList.remove("campan"), 500);
	}
	function focusHop(pathEl) {
		if (!ctx.fsMode) return;
		if (ctx.tour.active) return;
		const L = pathEl.getTotalLength();
		const m = pathEl.getPointAtLength(L * .5);
		ctx.focusPoint(m.x, m.y);
	}
	function applyPan() {
		ctx.clampPan();
		ctx.stagecard.style.setProperty("--tx", ctx.tx + "px");
		ctx.stagecard.style.setProperty("--ty", ctx.ty + "px");
	}
	function setZoom(z, at) {
		const next = Math.min(6, Math.max(.5, z));
		if (at && !ctx.fsMode) {
			const r = ctx.activeSvg().getBoundingClientRect(), k = 1 - next / ctx.zoom;
			ctx.tx += (at.x - r.left) * k;
			ctx.ty += (at.y - r.top) * k;
		}
		ctx.zoom = next;
		ctx.stagecard.style.setProperty("--zoom", ctx.zoom);
		ctx.stagecard.classList.toggle("zoomed", ctx.zoom !== 1);
		ctx.applyPan();
	}
	function canvasCentre() {
		const sr = ctx.scroller.getBoundingClientRect();
		return {
			x: sr.left + sr.width / 2,
			y: sr.top + sr.height / 2
		};
	}
	function resetView() {
		ctx.zoom = 1;
		ctx.tx = 0;
		ctx.ty = 0;
		ctx.setZoom(1);
	}
	function camFrame() {
		const s = ctx.activeSvg(), r = s.getBoundingClientRect(), vb = s === ctx.svg0 ? ctx.VB.map0 : ctx.VB.map;
		const t = getComputedStyle(s).transform;
		const m = new DOMMatrixReadOnly(t === "none" ? void 0 : t);
		const sr = ctx.scroller.getBoundingClientRect(), occ = ctx.tourOcclusion();
		return {
			r,
			m,
			scale: r.width / vb[0],
			base: r.width / vb[0] / ctx.zoom,
			cx: sr.left + (sr.width - occ.x) / 2,
			cy: sr.top + (sr.height - occ.y) / 2,
			w: sr.width - occ.x,
			h: sr.height - occ.y
		};
	}
	function placeCamera(v) {
		ctx.zoom = Math.min(6, Math.max(.5, v.z));
		ctx.stagecard.style.setProperty("--zoom", ctx.zoom);
		const f = ctx.camFrame();
		ctx.tx = f.cx - (f.r.left - f.m.e + v.cx * f.scale);
		ctx.ty = f.cy - (f.r.top - f.m.f + v.cy * f.scale);
		ctx.stagecard.style.setProperty("--tx", ctx.tx + "px");
		ctx.stagecard.style.setProperty("--ty", ctx.ty + "px");
	}
	function currentView() {
		const f = ctx.camFrame();
		return {
			z: ctx.zoom,
			cx: (f.cx - f.r.left) / f.scale,
			cy: (f.cy - f.r.top) / f.scale
		};
	}
	function frameBoxes(boxes, pad, maxZ, mx = 24, my = 20) {
		const f = ctx.camFrame();
		const x0 = Math.min(...boxes.map((b) => b.x)) - pad, y0 = Math.min(...boxes.map((b) => b.y)) - pad;
		const x1 = Math.max(...boxes.map((b) => b.x + b.width)) + pad, y1 = Math.max(...boxes.map((b) => b.y + b.height)) + pad;
		return {
			z: Math.min(maxZ, (f.w - 2 * mx) / ((x1 - x0) * f.base), (f.h - 2 * my) / ((y1 - y0) * f.base)),
			cx: (x0 + x1) / 2,
			cy: (y0 + y1) / 2
		};
	}
	function camGeom() {
		const f = ctx.camFrame(), sr = ctx.scroller.getBoundingClientRect();
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
		const cr = ctx.tour.active && !ctx.tourCard.hidden ? ctx.tourCard.getBoundingClientRect() : null;
		const card = cr && {
			l: cr.left,
			t: cr.top,
			r: cr.right,
			b: cr.bottom
		};
		const kr = cr && getComputedStyle(ctx.tcKeys).display !== "none" ? ctx.tcKeys.getBoundingClientRect() : null;
		const keys = kr && kr.width ? {
			l: kr.left,
			t: kr.top,
			r: kr.right,
			b: kr.bottom
		} : null;
		const zr = getComputedStyle(ctx.zoomCtl).display === "none" ? null : ctx.zoomCtl.getBoundingClientRect();
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
		const G = ctx.camGeom(), f = G.f;
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
		const G = ctx.camGeom();
		return boxes.every((b) => G.shown(G.proj(t, b)));
	}
	function litBoxes(b) {
		const ids = /* @__PURE__ */ new Set();
		ctx.STORIES[b.flow].hops.slice(0, ctx.flowEnd(b)).forEach((h) => {
			const d = ctx.edgeEls[h.e].def;
			ids.add(d.from);
			ids.add(d.to);
		});
		return [...ids].map(ctx.nodeBox);
	}
	function fitTarget() {
		const s = ctx.activeSvg();
		if (s === ctx.svg) {
			const nodes = ctx.allNodeBoxes();
			return ctx.camSolve([
				ctx.zoneLayer.getBBox(),
				ctx.edgeLayer.getBBox(),
				ctx.nodeLayer.getBBox()
			], nodes, nodes, 1.6, 24, 20);
		}
		const f = ctx.camFrame(), blocks = [...s.querySelectorAll("g.block")].map((g) => g.getBBox());
		return ctx.camSolve([s.getBBox()], blocks, blocks, 1.6, Math.max(48, f.w * .1), Math.max(48, f.h * .1));
	}
	function pathTarget(b) {
		const s = ctx.STORIES[b.flow], boxes = [];
		for (let i = ctx.beatStart(b); i < ctx.flowEnd(b); i++) boxes.push(...ctx.hopBoxes(ctx.edgeEls[s.hops[i].e]));
		const f = ctx.camFrame();
		return ctx.camSolve(boxes, ctx.litBoxes(b), ctx.allNodeBoxes(), ctx.PATH_ZOOM_MAX, Math.max(48, f.w * .1), Math.max(48, f.h * .1), ctx.tour.fitZoom);
	}
	function beatShots(b) {
		const s = ctx.STORIES[b.flow], f = ctx.camFrame(), shots = [];
		const mx = Math.max(48, f.w * .1), my = Math.max(48, f.h * .1);
		const fitZ = (boxes) => ctx.frameBoxes(boxes, 0, Infinity, mx, my).z;
		const each = [];
		for (let i = ctx.beatStart(b); i < ctx.flowEnd(b); i++) each.push(ctx.hopBoxes(ctx.edgeEls[s.hops[i].e]));
		if (!each.length) return shots;
		const zc = Math.max(ctx.tour.fitZoom, Math.min(ctx.PATH_ZOOM_MAX, ...each.map(fitZ)));
		const zMerge = Math.max(ctx.tour.fitZoom, zc * ctx.SHOT_SLACK) - 1e-6;
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
		const lit = ctx.litBoxes(b), all = ctx.allNodeBoxes(), out = [];
		shots.forEach((sh) => {
			const prev = out[out.length - 1];
			if (prev && ctx.camShows(prev.target, sh.boxes)) {
				prev.edges.push(...sh.edges);
				return;
			}
			out.push({
				edges: sh.edges,
				target: ctx.camSolve(sh.boxes, lit, all, ctx.PATH_ZOOM_MAX, mx, my, ctx.tour.fitZoom)
			});
		});
		return out;
	}
	function tweenCamera(to, ms) {
		const token = ++ctx.tour.camToken;
		const from = ctx.currentView();
		return ctx.scope.cancellable((resolve) => {
			const t0 = performance.now();
			const step = (now) => {
				if (token !== ctx.tour.camToken || !ctx.tour.active || !ctx.fsMode) {
					resolve();
					return;
				}
				const k = Math.min(1, (now - t0) / ms);
				const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
				ctx.placeCamera({
					z: 1 / ((1 - e) / from.z + e / to.z),
					cx: from.cx + (to.cx - from.cx) * e,
					cy: from.cy + (to.cy - from.cy) * e
				});
				if (k < 1) ctx.requestAnimationFrame(step);
				else resolve();
			};
			ctx.requestAnimationFrame(step);
		});
	}
	function tourCamShot(b, k, animate) {
		if (!b || !b.flow || !ctx.camFree()) return Promise.resolve();
		const shots = ctx.beatShots(b);
		const si = k == null ? -1 : shots.findIndex((sh) => sh.edges.includes(k));
		if (animate && si === ctx.tour.shot) return ctx.tour.shotMove || Promise.resolve();
		const to = si < 0 ? ctx.pathTarget(b) : shots[si].target;
		if (animate) {
			ctx.tour.shotMove = ctx.tweenCamera(to, 800);
			ctx.tour.shot = si;
			return ctx.tour.shotMove;
		}
		ctx.tour.camToken++;
		ctx.placeCamera(to);
		ctx.tour.shot = si;
		ctx.tour.shotMove = null;
		return Promise.resolve();
	}
	function tourCamManual() {
		if (!ctx.tour.active) return;
		ctx.tour.camManual = true;
		ctx.tour.camToken++;
	}
	function tourFit() {
		if (!ctx.fsMode) return;
		ctx.tour.camToken++;
		ctx.clearTimeout(ctx.camTimer);
		ctx.stagecard.classList.remove("campan");
		ctx.placeCamera(ctx.fitTarget());
		ctx.tour.fitZoom = ctx.zoom;
		ctx.tour.shot = -2;
		ctx.tour.shotMove = null;
	}
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
		tourFit
	};
}
// src/runtime/tour-player.js
/** tour-player: extracted original behavior; dependencies supplied by the instance controller. */
function createTourplayer(ctx) {
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
	function resumeStep() {
		const s = ctx.readTour().step;
		return Number.isInteger(s) && s >= 2 && s <= ctx.TOUR.length ? s : 0;
	}
	function refreshTourEntry() {
		const r = ctx.resumeStep(), done = Boolean(ctx.readTour().done);
		ctx.tourBtnText.textContent = r ? "Resume the tour · step " + r : ctx.definition.ui.tourEntry;
		ctx.document.getElementById("tourLabel").textContent = done ? "Guided tour" : "New here?";
	}
	function timeLeft(n) {
		const secs = ctx.TOUR.slice(n - 1).reduce((t, b) => t + (b.flow ? ctx.FLOW_BEAT_SECONDS : ctx.BEAT_SECONDS), 0);
		return secs < 60 ? "less than a minute left" : "about " + Math.round(secs / 60) + " min left";
	}
	function renderTourBar(n) {
		const b = n <= ctx.TOUR.length ? ctx.TOUR[n - 1] : null;
		const cur = b ? b.ch : ctx.TOUR_CHAPTERS.length;
		const pos = b ? ctx.TOUR.slice(0, n).filter((x) => x.ch === cur).length : 0;
		[...ctx.tourChapters.children].forEach((li, i) => {
			const fill = li.querySelector(".tb-fill");
			const now = i === cur;
			li.classList.toggle("current", now);
			if (now) li.setAttribute("aria-current", "step");
			else li.removeAttribute("aria-current");
			fill.style.width = i < cur ? "100%" : now ? pos / ctx.TOUR_CHAPTERS[i].span * 100 + "%" : "0%";
			fill.style.background = now ? ctx.beatHue(b) : "";
		});
		ctx.tourStatus.textContent = b ? `Step ${n} of ${ctx.TOUR_TOTAL} · ${ctx.timeLeft(n)}` : "Complete";
	}
	function renderTourCard(n) {
		const b = ctx.TOUR[n - 1];
		ctx.tourCard.style.setProperty("--tc-hue", ctx.beatHue(b));
		ctx.tcEyebrow.textContent = `${ctx.TOUR_CHAPTERS[b.ch].name} · ${n} of ${ctx.TOUR_TOTAL}`;
		ctx.tcTitle.textContent = b.title;
		ctx.renderTourText(b);
		ctx.tcScroll.scrollTop = 0;
	}
	function renderTourText(b) {
		ctx.tcBody.replaceChildren(...b.body.map((t) => {
			const el = ctx.document.createElement("p");
			el.textContent = t;
			return el;
		}));
		const p = ctx.tour.phase;
		ctx.tcWhy.hidden = !b.why || Boolean(b.flow) && p <= ctx.edgeCount(b);
		ctx.tcWhyText.textContent = b.why || "";
		if (!b.flow) {
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
			head.append(ctx.TOUR_CHAPTERS.find((c) => c.name.toLowerCase().startsWith(g))?.name || ctx.GROUPS[g].title);
			const text = ctx.document.createElement("span");
			text.className = "recap-t";
			text.textContent = b.recap[g];
			li.append(head, text);
			ctx.tcList.replaceChildren(li);
			ctx.tcList.hidden = false;
			return;
		}
		const s = ctx.STORIES[b.flow], start = ctx.beatStart(b), total = ctx.edgeCount(b);
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
		li.append(n, hop.t);
		ctx.tcList.replaceChildren(li);
		ctx.tcList.hidden = false;
	}
	function syncBadges(b) {
		const shown = ctx.beatStart(b) + Math.min(ctx.tour.phase, ctx.edgeCount(b));
		ctx.storyLayer.querySelectorAll("g[data-hop]").forEach((g) => {
			const i = Number(g.dataset.hop);
			g.classList.toggle("tpend", i >= shown || i === ctx.tour.badgeWait);
		});
		const s = ctx.STORIES[b.flow], first = {};
		s.hops.forEach((h, i) => {
			if (ctx.edgeEls[h.e].def.bidir && first[h.e] === void 0) first[h.e] = i;
		});
		s.hops.slice(0, ctx.flowEnd(b)).forEach((h, i) => {
			const ee = ctx.edgeEls[h.e];
			if (!ee.def.bidir || i === first[h.e] || Boolean(h.rev) === Boolean(s.hops[first[h.e]].rev)) return;
			const attr = h.rev ? "marker-start" : "marker-end";
			if (i < shown) ee.path.setAttribute(attr, "url(#arr-" + (h.bad || !s.ok ? s.hue : s.ok) + ")");
			else ee.path.removeAttribute(attr);
		});
	}
	function syncFocus(b) {
		const s = ctx.STORIES[b.flow], end = ctx.flowEnd(b);
		const onPath = /* @__PURE__ */ new Set(), pathNodes = /* @__PURE__ */ new Set();
		s.hops.slice(0, end).forEach((h) => {
			const d = ctx.edgeEls[h.e].def;
			onPath.add(d.id);
			pathNodes.add(d.from);
			pathNodes.add(d.to);
		});
		ctx.svg.classList.add("tfocus");
		ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.toggle("dimmed", !pathNodes.has(n.id)));
		ctx.EDGES.forEach((e) => {
			[ctx.edgeEls[e.id].path, ctx.edgeEls[e.id].label].forEach((x) => {
				if (x) x.classList.toggle("dimmed", !onPath.has(e.id));
			});
		});
	}
	function revealLatest() {
		const b = ctx.TOUR[ctx.tour.step - 1];
		if (!b || !b.flow) return;
		const t = ctx.tour.phase > ctx.edgeCount(b) ? ctx.tcWhy : ctx.tour.phase > 0 ? ctx.tcList.firstElementChild : null;
		if (!t || t.closest("[hidden]")) return;
		const sr = ctx.tcScroll.getBoundingClientRect(), r = t.getBoundingClientRect();
		const dy = r.top < sr.top ? r.top - sr.top : r.bottom > sr.bottom ? Math.min(r.bottom - sr.bottom, r.top - sr.top) : 0;
		if (dy) ctx.tcScroll.scrollTo({
			top: ctx.tcScroll.scrollTop + dy,
			behavior: ctx.reduced ? "auto" : "smooth"
		});
	}
	function renderPlayer() {
		const b = ctx.TOUR[ctx.tour.step - 1];
		const hint = Boolean(b) && ctx.beatHasMotion(b) && !ctx.tourStepped;
		ctx.tcHint.hidden = !hint;
		ctx.tcNext.classList.toggle("hint", hint);
		const backHadFocus = ctx.document.activeElement === ctx.tcBack;
		ctx.tcBack.disabled = ctx.tour.step === 1;
		ctx.tcBack.hidden = ctx.tour.step === 1;
		if (backHadFocus && ctx.tcBack.disabled) ctx.tcNext.focus({ preventScroll: true });
		const last = Boolean(b) && ctx.tour.step >= ctx.TOUR.length && !(b.flow && ctx.tour.phase <= ctx.edgeCount(b)) && ctx.tour.phase >= ctx.stageCount(b);
		ctx.tcNext.textContent = ctx.tour.step === 1 ? "Begin" : last ? "Finish" : "Next";
		const total = !b ? 0 : b.flow ? ctx.edgeCount(b) + 1 : ctx.stageCount(b);
		const done = Math.min(ctx.tour.phase, total);
		ctx.tcCount.replaceChildren(...Array.from({ length: total }, (_, i) => {
			const seg = ctx.document.createElement("span");
			seg.className = "tc-seg" + (i < done ? " on" : "");
			return seg;
		}));
		if (total) {
			ctx.tcCount.setAttribute("role", "progressbar");
			ctx.tcCount.setAttribute("aria-label", "Progress in this step");
			ctx.tcCount.setAttribute("aria-valuemin", "0");
			ctx.tcCount.setAttribute("aria-valuemax", String(total));
			ctx.tcCount.setAttribute("aria-valuenow", String(done));
		} else [
			"role",
			"aria-label",
			"aria-valuemin",
			"aria-valuemax",
			"aria-valuenow"
		].forEach((a) => ctx.tcCount.removeAttribute(a));
	}
	function sizeTourCard() {
		const b = ctx.TOUR[ctx.tour.step - 1];
		if (!b || ctx.tourCard.hidden) return;
		const keep = ctx.tour.phase, phases = b.flow ? ctx.edgeCount(b) + 2 : 1 + ctx.stageCount(b);
		ctx.tourCard.style.height = "";
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
	function showStage(p) {
		ctx.clearStory();
		if (!p) {
			ctx.setFocus(null);
			return;
		}
		const g = ctx.SWEEP[p - 1];
		ctx.setFocus(g);
		ctx.GROUPS[g].members.forEach((id) => {
			const ng = ctx.nodeEls[id].g;
			ng.style.setProperty("--story-hue", ctx.hue(ctx.GROUPS[g].huekey));
			ng.classList.add("lit");
		});
	}
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
	function markEdge(b, k) {
		ctx.storyLayer.querySelectorAll("g.tcur").forEach((g) => g.classList.remove("tcur"));
		ctx.EDGES.forEach((e) => ctx.edgeEls[e.id].path.classList.remove("tcur", "eglow"));
		if (k == null) return;
		const i = ctx.beatStart(b) + k;
		ctx.edgeEls[ctx.STORIES[b.flow].hops[i].e].path.classList.add("tcur");
		ctx.storyLayer.querySelector(`g[data-hop="${i}"]`)?.classList.add("tcur");
	}
	function stopEdgeMotion() {
		ctx.storyToken++;
		ctx.tour.badgeWait = -1;
		if (ctx.dot) {
			ctx.dot.remove();
			ctx.dot = null;
		}
	}
	async function playEdge(b, k, animate) {
		const s = ctx.STORIES[b.flow], i = ctx.beatStart(b) + k, hop = s.hops[i], ee = ctx.edgeEls[hop.e];
		ctx.stopEdgeMotion();
		ctx.markEdge(b, k);
		if (!animate || ctx.reduced) {
			ee.path.classList.add("eglow");
			ctx.tourCamShot(b, k, true);
			return true;
		}
		const token = ctx.storyToken;
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
	function stepEdge(b) {
		ctx.tour.phase++;
		ctx.cardChange(() => {
			ctx.renderTourText(b);
			ctx.revealLatest();
		});
		return ctx.playEdge(b, ctx.tour.phase - 1, true);
	}
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
	function showBeat(n, opts) {
		const b = ctx.TOUR[n - 1];
		const atSummary = Boolean(opts && opts.atSummary && b.flow);
		ctx.stopEdgeMotion();
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
		ctx.T()?.step("tour", "step-" + n, n);
		ctx.selected = null;
		ctx.NODES.forEach((x) => ctx.nodeEls[x.id].g.classList.remove("sel"));
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
		ctx.tour.camManual = false;
		ctx.tourFit();
		if (b.flow) ctx.drawBeatPath(b);
		ctx.tourCamShot(b, null, true);
	}
	function startTour(n, opts) {
		if (ctx.tour.active || ctx.PINNED || ctx.BOOTCAMP) return;
		const wantNative = Boolean(opts && opts.native) && Boolean(ctx.stagecard.requestFullscreen);
		const wasNative = ctx.document.fullscreenElement === ctx.stagecard;
		if (ctx.exploreNudge) ctx.exploreNudge.hide();
		ctx.closeFlowPicker();
		ctx.closeInside();
		const wasFs = ctx.fsMode;
		if (wasFs && wasNative && wantNative) ctx.applyFsDom(false);
		else if (wasFs) ctx.exitFs();
		ctx.tour.snap = {
			level: ctx.level,
			focused: ctx.focused,
			selected: ctx.selected,
			week: ctx.week,
			panelOpen: ctx.panelIsOpen(),
			wasFs
		};
		ctx.tour.active = true;
		ctx.T()?.milestone("tour_started");
		ctx.clearStory();
		ctx.stagecard.classList.add("touring", "fs-fixed");
		ctx.applyFsDom(true);
		ctx.showBeat(Math.min(Math.max(1, n), ctx.TOUR.length));
		ctx.tcNext.focus({ preventScroll: true });
		if (wantNative && !wasNative) ctx.stagecard.requestFullscreen().catch(() => {});
	}
	function tourNext() {
		if (!ctx.tour.active || ctx.tour.atEnd) return;
		const b = ctx.TOUR[ctx.tour.step - 1];
		if (b.flow && ctx.tour.phase <= ctx.edgeCount(b)) {
			ctx.tourStepped = true;
			if (ctx.tour.phase < ctx.edgeCount(b)) ctx.stepEdge(b);
			else ctx.finishBeat(b);
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
		if (ctx.tour.step >= ctx.TOUR.length) ctx.showEnding();
		else ctx.showBeat(ctx.tour.step + 1);
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
		ctx.showBeat(ctx.tour.step - 1, { atSummary: true });
	}
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
			ctx.scope.animate(ctx.tourCard, [{ opacity: 1 }, {
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
		ctx.T()?.milestone("tour_complete");
		ctx.T()?.seen();
		ctx.teTitle.focus({ preventScroll: true });
	}
	function exitTour(toFullMap) {
		if (!ctx.tour.active) return;
		const atEnd = ctx.tour.atEnd;
		if (!atEnd) ctx.T()?.track("tool_milestone", {
			milestone: "tour_exit",
			tool_area: "tour",
			tool_step: "step-" + ctx.tour.step
		});
		ctx.clearStory();
		ctx.tour.camToken++;
		if (ctx.document.fullscreenElement) ctx.document.exitFullscreen().catch(() => {});
		ctx.tour.active = false;
		ctx.tour.atEnd = false;
		ctx.tourCard.hidden = true;
		ctx.tourEnd.hidden = true;
		ctx.stagecard.classList.remove("touring");
		ctx.applyFsDom(false);
		const snap = ctx.tour.snap || {};
		ctx.tour.snap = null;
		ctx.selected = null;
		ctx.NODES.forEach((x) => ctx.nodeEls[x.id].g.classList.remove("sel"));
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
			if (snap.panelOpen) ctx.openPanel();
			else ctx.closePanel();
		} else {
			ctx.showLevel(1);
			ctx.setWeek(snap.week || 0, {
				silent: true,
				quiet: true
			});
			ctx.setFocus(snap.focused || null);
			if (snap.selected && ctx.nodeEls[snap.selected]) {
				ctx.selected = snap.selected;
				ctx.nodeEls[ctx.selected].g.classList.add("sel");
				ctx.renderNode(ctx.selected);
			} else if (snap.focused) ctx.renderGroup(snap.focused);
			else if (snap.week > 0) ctx.renderWeek(snap.week);
			else ctx.renderOverview();
			if (snap.panelOpen) ctx.openPanel();
			else ctx.closePanel();
		}
		if (snap.wasFs && !toFullMap && !atEnd) {
			ctx.stagecard.classList.add("fs-fixed");
			ctx.applyFsDom(true);
		}
		ctx.refreshTourEntry();
		ctx.tourBtn.focus({ preventScroll: true });
	}
	function onTourKey(ev) {
		if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey) return;
		if (ev.key === "Escape") {
			ev.preventDefault();
			if (ctx.document.fullscreenElement) {
				ctx.document.exitFullscreen().catch(() => {});
				return;
			}
			if (performance.now() - ctx.tour.nativeLeftAt < 600) return;
			ctx.exitTour(ctx.tour.atEnd);
			return;
		}
		if (ev.target instanceof Element && ev.target.closest("input, textarea, select, [contenteditable]") || ctx.tour.atEnd) return;
		if (ev.key === "ArrowRight") {
			ev.preventDefault();
			ctx.tourNext();
		} else if (ev.key === "ArrowLeft") {
			ev.preventDefault();
			ctx.tourBack();
		}
	}
	return {
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
/** navigation: extracted original behavior; dependencies supplied by the instance controller. */
function createNavigation(ctx) {
	function refreshWeekSeg() {
		ctx.document.querySelectorAll("#weekSeg button").forEach((b) => {
			b.classList.toggle("on", ctx.level === 1 && Number(b.dataset.w) === ctx.week);
		});
	}
	function showLevel(l) {
		ctx.level = l;
		if (l === 1 && !ctx.tour.active) ctx.T()?.milestone("full_map_opened");
		ctx.refreshWeekSeg();
		ctx.closeInside();
		ctx.svg0.style.display = l === 0 ? "block" : "none";
		ctx.svg.style.display = l === 1 ? "block" : "none";
		ctx.document.querySelector(".legend").style.display = l === 0 ? "none" : "";
		ctx.resetView();
		ctx.toL0.hidden = l === 0;
		ctx.crumbNote.textContent = l === 0 ? "The big picture" : "The full map";
		if (l === 0) {
			ctx.setFocus(null);
			ctx.clearStory();
			ctx.setWeek(0, { silent: true });
			ctx.selected = null;
			ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.remove("sel"));
		}
	}
	function setFocus(g) {
		ctx.focused = g;
		ctx.NODES.forEach((n) => {
			ctx.nodeEls[n.id].g.classList.toggle("dimmed", !!g && n.group !== g);
		});
		ctx.EDGES.forEach((e) => {
			const inG = !!g && ctx.nodeEls[e.from].def.group === g && ctx.nodeEls[e.to].def.group === g;
			const dim = !!g && !inG;
			ctx.edgeEls[e.id].path.classList.toggle("dimmed", dim);
			if (ctx.edgeEls[e.id].label) ctx.edgeEls[e.id].label.classList.toggle("dimmed", dim);
		});
		ctx.unfocusBtn.hidden = !g;
		if (g) {
			ctx.control.label(ctx.unfocusBtn, ctx.GROUPS[g].title, "close");
			ctx.unfocusBtn.style.setProperty("--focus-hue", ctx.hue(ctx.GROUPS[g].huekey));
			ctx.unfocusBtn.setAttribute("aria-label", "Clear " + ctx.GROUPS[g].title + " stage filter");
			ctx.unfocusBtn.title = "Show all stages";
		}
	}
	function focusGroup(g) {
		if (ctx.tour.active) return;
		ctx.showLevel(1);
		ctx.clearStory();
		ctx.setWeek(0, { silent: true });
		ctx.selected = null;
		ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.remove("sel"));
		ctx.setFocus(g);
		ctx.renderGroup(g);
	}
	function updateDrawerBounds() {
		if (!ctx.fsMode) return;
		const inset = parseFloat(getComputedStyle(ctx.stagecard).getPropertyValue("--drawer-inset"));
		const crumbEl = ctx.stagecard.querySelector(".crumbbar");
		const header = (crumbEl.getClientRects().length ? crumbEl : ctx.tourBar).getBoundingClientRect();
		const cardTop = ctx.stagecard.getBoundingClientRect().top + ctx.stagecard.clientTop;
		ctx.stagecard.style.setProperty("--drawer-top", header.bottom - cardTop + inset + "px");
		if (ctx.tour.active) {
			ctx.stagecard.style.setProperty("--tour-top", header.bottom - cardTop + 20 + "px");
			ctx.stagecard.style.setProperty("--tour-bar-h", ctx.tourBar.getBoundingClientRect().bottom - cardTop + "px");
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
			if (ctx.zoom !== 1 || ctx.tx || ctx.ty) ctx.resetView();
			ctx.control.label(ctx.fsBtn, "Exit full screen", "collapse");
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
			ctx.control.label(ctx.fsBtn, "Full screen", "expand");
			ctx.panelBtn.hidden = ctx.preFsOpen;
		}
	}
	function enterFs() {
		ctx.T()?.milestone("fullscreen");
		const go = () => {
			if (!ctx.fsMode) ctx.applyFsDom(true);
		};
		if (ctx.stagecard.requestFullscreen) ctx.stagecard.requestFullscreen().then(go).catch(() => {
			ctx.stagecard.classList.add("fs-fixed");
			go();
		});
		else {
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
		ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.remove("sel"));
		if (ctx.level === 0) ctx.renderL0();
		else if (ctx.focused) ctx.renderGroup(ctx.focused);
		else if (ctx.week > 0) ctx.renderWeek(ctx.week);
		else ctx.renderOverview();
	}
	function selectNode(id) {
		if (ctx.tour.active) return;
		ctx.T()?.step("component", id);
		ctx.clearStory();
		if (ctx.focused && ctx.nodeEls[id].def.group !== ctx.focused) ctx.setFocus(null);
		ctx.selected = id;
		ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.toggle("sel", n.id === id));
		ctx.renderNode(id);
	}
	function setWeek(w, opts) {
		if (ctx.PINNED && (w === 0 || w > ctx.PINNED)) w = ctx.PINNED;
		const quiet = Boolean(opts && opts.quiet);
		if (w >= 1 && !quiet) ctx.T()?.step("build", "step-" + w, w);
		if (w === ctx.WEEKS.length - 1 && !ctx.PINNED && !quiet) {
			ctx.T()?.milestone("build_complete");
			ctx.T()?.seen();
		}
		ctx.week = w;
		ctx.refreshWeekSeg();
		ctx.NODES.forEach((n) => {
			const g = ctx.nodeEls[n.id].g;
			g.classList.toggle("future", w > 0 && n.week > w);
			g.classList.toggle("justbuilt", w > 0 && n.week === w);
		});
		ctx.zoneEls.forEach((z) => z.g.classList.toggle("future", w > 0 && z.members.length > 0 && z.members.every((n) => n.week > w)));
		ctx.EDGES.forEach((e) => {
			const fw = ctx.nodeEls[e.from].def.week, tw = ctx.nodeEls[e.to].def.week;
			const fut = w > 0 && Math.max(fw, tw) > w;
			ctx.edgeEls[e.id].path.classList.toggle("future", fut);
			if (ctx.edgeEls[e.id].label) ctx.edgeEls[e.id].label.classList.toggle("future", fut);
		});
		if (!(opts && opts.silent)) {
			if (w > 0) {
				ctx.selected = null;
				ctx.NODES.forEach((n) => ctx.nodeEls[n.id].g.classList.remove("sel"));
				ctx.renderWeek(w);
			} else if (ctx.selected) ctx.renderNode(ctx.selected);
			else ctx.renderOverview();
		}
	}
	function setTheme(t) {
		ctx.document.documentElement.dataset.theme = t;
	}
	return {
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
		setTheme
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
function createFilesView(ctx) {
	const files = ctx.definition.files;
	const box = ctx.document.getElementById("files");
	const btn = ctx.document.getElementById("filesBtn");
	if (!files || !box || !btn) return {
		available: false,
		open() {},
		close() {},
		isOpen: () => false,
		pathsFor: () => []
	};
	const { root, byPath } = buildFileTree(files.entries);
	const source = ctx.definition.source;
	const ui = ctx.definition.ui;
	const tree = box.querySelector("#filesTree");
	const expanded = /* @__PURE__ */ new Set();
	byPath.forEach((n) => {
		if (n.dir && (n.parent === root || n.entry?.open)) expanded.add(n.path);
	});
	let selected = null;
	btn.hidden = false;
	const label = ui.filesEntry || "Project structure";
	ctx.document.getElementById("filesBtnText").textContent = label;
	const repoName = files.title || (source ? source.repo.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "") : "project");
	root.name = repoName.split("/").pop();
	box.querySelector("#filesTitle").innerHTML = `${esc(label)} · ${esc(repoName)}` + (source?.ref ? ` at <span class="mono">${esc(source.ref.slice(0, 7))}</span>` : "");
	const nodeOf = (id) => ctx.nodeEls[id]?.def;
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
		return `<button type="button" class="ft-chip" data-node="${esc(id)}" style="--chip-hue:var(--h-${n.cat})" title="Show ${esc(n.concept)} on the map" tabindex="-1"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ctx.ICONS[n.icon] || ""}</svg>${esc(n.concept)}</button>`;
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
		ctx.panelHTML(`
      <div class="p-eyebrow">Start here</div>
      <h2>${esc(files.heading || "Where each part lives")}</h2>
      <p style="margin-top:8px">${files.panel || `The paths of <span class="mono">${esc(repoName)}</span> that matter for the map, ${files.entries.length} of them, each with a line on what it holds.`}</p>
      <h3>How to read it</h3>
      <ul class="newlist ft-toplist">
        <li><b>Coloured tags</b> are components on the map; click one to jump there.</li>
        <li><b>The folder colour</b> follows the role of its component. Grey means plumbing (config, docs, tooling) or a mix of roles.</li>
        <li>Click a row for why it exists. <kbd>↑</kbd> <kbd>↓</kbd> walk the tree, <kbd>←</kbd> <kbd>→</kbd> fold it.</li>
      </ul>
    `, null);
		ctx.openPanel();
	}
	function renderEntry(n) {
		const e = n.entry || {};
		const nodes = (e.nodes || []).map((id) => [id, nodeOf(id)]).filter(([, d]) => d);
		const onMap = nodes.map(([id, d]) => `<button type="button" class="panel-action ft-goto" data-node="${esc(id)}" style="--chip-hue:var(--h-${d.cat})"><span class="ft-goto-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ctx.ICONS[d.icon] || ""}</svg></span>${esc(d.concept)}${svg(ARROW)}</button>`).join("");
		const kids = n.dir ? n.kids.filter((k) => k.entry).map((k) => `<li><button type="button" class="ft-link" data-path="${esc(k.path)}">${esc(k.name + (k.dir ? "/" : ""))}</button> ${k.entry.t}</li>`).join("") : "";
		const hue = nodes[0]?.[1].cat || null;
		ctx.panelHTML(`
      <div class="p-eyebrow">${n.dir ? "Folder" : "File"}</div>
      <h2 class="ft-h">${esc(n.name + (n.dir ? "/" : ""))}</h2>
      <p class="p-sub mono">${esc(n.path + (n.dir ? "/" : ""))}</p>
      ${e.tag ? `<div class="p-chips ft-chips"><span class="pchip">${esc(e.tag)}</span></div>` : ""}
      ${e.t ? `<h3>What lives here</h3><p>${e.t}</p>` : ""}
      ${e.why ? `<h3>Why it exists</h3><p>${e.why}</p>` : ""}
      ${onMap ? `<h3>On the map</h3><div class="panel-actions">${onMap}</div>` : ""}
      ${kids ? `<h3>Inside</h3><ul class="newlist ft-toplist">${kids}</ul>` : ""}
    `, hue);
		ctx.panelBody.querySelectorAll("[data-node]").forEach((b) => ctx.scope.listen(b, "click", () => goToNode(b.dataset.node)));
		ctx.panelBody.querySelectorAll(".ft-link").forEach((b) => ctx.scope.listen(b, "click", () => select(b.dataset.path, { reveal: true })));
		ctx.openPanel();
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
				behavior: ctx.reduced ? "auto" : "smooth"
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
		if (ctx.level !== 1) ctx.showLevel(1);
		ctx.selectNode(id);
	}
	function open(path) {
		if (ctx.tour.active) return;
		ctx.closeInside();
		ctx.clearStory?.();
		box.hidden = false;
		btn.setAttribute("aria-pressed", "true");
		ctx.stagecard.classList.add("files-open");
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
		ctx.stagecard.classList.remove("files-open");
	}
	function rerenderPanelAfterClose() {
		close();
		if (ctx.level === 0) ctx.renderL0();
		else if (ctx.selected) ctx.renderNode(ctx.selected);
		else ctx.renderOverview();
	}
	ctx.scope.listen(btn, "click", () => box.hidden ? open() : rerenderPanelAfterClose());
	ctx.scope.listen(box.querySelector("#filesBack"), "click", rerenderPanelAfterClose);
	ctx.scope.listen(tree, "click", (ev) => {
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
	ctx.scope.listen(tree, "keydown", (ev) => {
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
// src/runtime/engine.js
async function mountEngine(root, definition) {
	"use strict";
	const scope = createLifecycle();
	const document = scopedDocument(root);
	const requestAnimationFrame = scope.frame;
	const cancelAnimationFrame = scope.cancelFrame;
	const setTimeout = scope.timeout;
	const clearTimeout = scope.clearTimeout;
	const ResizeObserver = scope.ResizeObserver;
	const context = {
		definition,
		format: (pattern, values) => pattern.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? "")),
		get BEAT_SECONDS() {
			return BEAT_SECONDS;
		},
		get BOOTCAMP() {
			return BOOTCAMP;
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
		get LINK_TARGET() {
			return LINK_TARGET;
		},
		get NODES() {
			return NODES;
		},
		get PATH_ZOOM_MAX() {
			return PATH_ZOOM_MAX;
		},
		get PINNED() {
			return PINNED;
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
		get T() {
			return T;
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
			return camTimer;
		},
		set camTimer(value) {
			camTimer = value;
		},
		get canvas() {
			return canvas;
		},
		get cardChange() {
			return cardChange;
		},
		get cardOut() {
			return cardOut;
		},
		set cardOut(value) {
			cardOut = value;
		},
		get cardSwap() {
			return cardSwap;
		},
		set cardSwap(value) {
			cardSwap = value;
		},
		get catName() {
			return catName;
		},
		get chooseFlow() {
			return chooseFlow;
		},
		get chosenFlow() {
			return chosenFlow;
		},
		set chosenFlow(value) {
			chosenFlow = value;
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
			return dot;
		},
		set dot(value) {
			dot = value;
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
			return exploreNudge;
		},
		set exploreNudge(value) {
			exploreNudge = value;
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
		get flowPicker() {
			return flowPicker;
		},
		get flowSummary() {
			return flowSummary;
		},
		get focusHop() {
			return focusHop;
		},
		get focusPoint() {
			return focusPoint;
		},
		get focused() {
			return focused;
		},
		set focused(value) {
			focused = value;
		},
		get frameBoxes() {
			return frameBoxes;
		},
		get fsBtn() {
			return fsBtn;
		},
		get fsMode() {
			return fsMode;
		},
		set fsMode(value) {
			fsMode = value;
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
			return level;
		},
		set level(value) {
			level = value;
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
			return preFsOpen;
		},
		set preFsOpen(value) {
			preFsOpen = value;
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
			return selected;
		},
		set selected(value) {
			selected = value;
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
			return storyToken;
		},
		set storyToken(value) {
			storyToken = value;
		},
		get selectNode() {
			return selectNode;
		},
		get filesView() {
			return filesView;
		},
		get structureHref() {
			return structureHref;
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
			return tour;
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
			return tourStepped;
		},
		set tourStepped(value) {
			tourStepped = value;
		},
		get tweenCamera() {
			return tweenCamera;
		},
		get tx() {
			return tx;
		},
		set tx(value) {
			tx = value;
		},
		get ty() {
			return ty;
		},
		set ty(value) {
			ty = value;
		},
		get unfocusBtn() {
			return unfocusBtn;
		},
		get updateDrawerBounds() {
			return updateDrawerBounds;
		},
		get viewMode() {
			return viewMode;
		},
		set viewMode(value) {
			viewMode = value;
		},
		get week() {
			return week;
		},
		set week(value) {
			week = value;
		},
		get zoneEls() {
			return zoneEls;
		},
		get zoneLayer() {
			return zoneLayer;
		},
		get zoom() {
			return zoom;
		},
		set zoom(value) {
			zoom = value;
		},
		get zoomCtl() {
			return zoomCtl;
		}
	};
	const panelsModule = createPanels(context);
	const flowplayerModule = createFlowplayer(context);
	const cameraModule = createCamera(context);
	const tourplayerModule = createTourplayer(context);
	const navigationModule = createNavigation(context);
	const SVGNS = "http://www.w3.org/2000/svg";
	const svg0 = document.getElementById("map0");
	const svg = document.getElementById("map");
	const panel = document.getElementById("panel");
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const T = () => null;
	const HUB = definition.settings.zoomable;
	const logos = definition.logos;
	const STRUCTURE_URL = definition.links.projectStructure;
	const LINK_TARGET = definition.settings.linkTarget ? ` target="${definition.settings.linkTarget}"` : "";
	const structureHref = (path) => STRUCTURE_URL + "#path=" + encodeURIComponent(path);
	if (definition.settings.embedded) document.documentElement.classList.add("embedded");
	const PINNED = (() => {
		const w = Number(param("week"));
		return Number.isInteger(w) && w >= 1 && w < definition.buildSteps.length ? w : null;
	})();
	const BOOTCAMP = Boolean(param("bootcamp"));
	if (PINNED) document.documentElement.classList.add("weekpinned");
	function param(key) {
		return new URLSearchParams(location.hash.slice(1)).get(key) || new URLSearchParams(location.search).get(key);
	}
	const HUES = Object.fromEntries(Object.keys(definition.roles).map((key) => [key, `--h-${key}`]));
	const hue = (k) => `var(${HUES[k]})`;
	const ICONS = definition.icons;
	const ZONES = definition.zones;
	const NODES = definition.nodes;
	const EDGES = definition.edges;
	const GROUPS = definition.groups;
	const L0 = definition.overview;
	const STORIES = definition.flows;
	const WEEKS = definition.buildSteps;
	const IMARK = definition.insideMarkers;
	const INSIDES = definition.insides;
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
	const control = ml_controls_default;
	control.label(document.getElementById("toL0"), "Big picture", "back");
	control.label(document.getElementById("fsBtn"), "Full screen", "expand");
	control.label(document.getElementById("insideBack"), "Back to the map", "back");
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
		}, g).textContent = "Open →";
		const act = () => focusGroup(b.g);
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
		scope.listen(g, "click", () => selectNode(n.id));
		scope.listen(g, "keydown", (ev) => {
			if (ev.key === "Enter" || ev.key === " ") {
				ev.preventDefault();
				selectNode(n.id);
			}
		});
	});
	scope.listen(svg, "click", (ev) => {
		if (tour.active) return;
		if (ev.target === svg) {
			if (fsMode) closePanel();
			clearSelection();
		}
	});
	let level = 0;
	let focused = null;
	let viewMode = "concepts";
	let selected = null;
	let week = 0;
	let storyToken = 0;
	let dot = null;
	const toL0 = document.getElementById("toL0");
	const crumbNote = document.getElementById("crumbNote");
	const unfocusBtn = document.getElementById("unfocus");
	const insideBox = document.getElementById("inside");
	let filesView = null;
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
	scope.listen(toL0, "click", () => {
		showLevel(0);
		renderL0();
	});
	scope.listen(unfocusBtn, "click", () => {
		setFocus(null);
		renderOverview();
	});
	function openInside(...args) {
		return panelsModule.openInside(...args);
	}
	function closeInside(...args) {
		filesView?.close();
		return panelsModule.closeInside(...args);
	}
	scope.listen(document.getElementById("insideBack"), "click", closeInside);
	const stagecard = document.querySelector(".stagecard");
	const controlsEl = document.querySelector("section.controls");
	const ctrlSlot = document.getElementById("ctrlSlot");
	const panelSlot = document.getElementById("panelSlot");
	const drawer = document.getElementById("drawer");
	const drawerBody = document.getElementById("drawerBody");
	const fsBtn = document.getElementById("fsBtn");
	const panelBtn = document.getElementById("panelBtn");
	let fsMode = false;
	const tour = {
		active: false,
		step: 1,
		phase: 0,
		atEnd: false,
		snap: null,
		news: null,
		fitZoom: 1,
		camToken: 0,
		camManual: false,
		shot: -2,
		shotMove: null,
		badgeWait: -1,
		nativeLeftAt: -1e9
	};
	const tourBar = document.getElementById("tourBar");
	const tourCard = document.getElementById("tourCard");
	const tourEnd = document.getElementById("tourEnd");
	const phoneQuery = window.matchMedia("(max-width: 640px)");
	function openPanel(...args) {
		return panelsModule.openPanel(...args);
	}
	function closePanel(...args) {
		return panelsModule.closePanel(...args);
	}
	function panelIsOpen(...args) {
		return panelsModule.panelIsOpen(...args);
	}
	function revealInPanel(...args) {
		return panelsModule.revealInPanel(...args);
	}
	scope.listen(document.getElementById("drawerClose"), "click", closePanel);
	scope.listen(document.getElementById("panelClose"), "click", closePanel);
	function syncPanelHead(...args) {
		return panelsModule.syncPanelHead(...args);
	}
	[panel, drawer].forEach((box) => {
		if (box.querySelector(":scope > .panelhead")) scope.listen(box, "scroll", () => syncPanelHead(box), { passive: true });
	});
	scope.listen(panelBtn, "click", openPanel);
	let preFsOpen = true;
	let exploreNudge = null;
	function updateDrawerBounds(...args) {
		return navigationModule.updateDrawerBounds(...args);
	}
	if (window.ResizeObserver) {
		const drawerBoundsObserver = new ResizeObserver(updateDrawerBounds);
		drawerBoundsObserver.observe(stagecard.querySelector(".crumbbar"));
		drawerBoundsObserver.observe(controlsEl);
		drawerBoundsObserver.observe(tourBar);
	}
	scope.listen(window, "resize", updateDrawerBounds);
	function applyFsDom(...args) {
		return navigationModule.applyFsDom(...args);
	}
	function enterFs(...args) {
		return navigationModule.enterFs(...args);
	}
	function exitFs(...args) {
		return navigationModule.exitFs(...args);
	}
	scope.listen(fsBtn, "click", () => {
		fsMode ? exitFs() : enterFs();
	});
	scope.listen(document, "fullscreenchange", () => {
		if (tour.active && !document.fullscreenElement) tour.nativeLeftAt = performance.now();
		if (tour.active) requestAnimationFrame(() => {
			updateDrawerBounds();
			if (!tour.atEnd) tourFit();
		});
		if (document.fullscreenElement === stagecard) {
			if (!fsMode) applyFsDom(true);
		} else if (fsMode && !stagecard.classList.contains("fs-fixed")) applyFsDom(false);
	});
	scope.listen(document, "keydown", (ev) => {
		if (tour.active) {
			onTourKey(ev);
			return;
		}
		if (ev.key !== "Escape") return;
		if (!insideBox.hidden) closeInside();
		else if (filesView?.isOpen()) document.getElementById("filesBack").click();
		else if (fsMode && drawer.classList.contains("open")) closePanel();
		else if (fsMode && stagecard.classList.contains("fs-fixed")) applyFsDom(false);
	});
	const scroller = document.querySelector(".stage-scroll");
	const VB = definition.layout.viewBoxes;
	const drawerOcclusion = () => drawer.classList.contains("open") ? drawer.offsetWidth + 2 * parseFloat(getComputedStyle(stagecard).getPropertyValue("--drawer-inset")) : tourOcclusion().x;
	function tourOcclusion(...args) {
		return cameraModule.tourOcclusion(...args);
	}
	let zoom = 1, tx = 0, ty = 0;
	if (HUB) stagecard.classList.add("zoomable");
	const wideQuery = window.matchMedia("(min-width: 981px)");
	const normalZoom = () => !fsMode && Boolean(HUB) && wideQuery.matches;
	const activeSvg = () => level === 0 ? svg0 : svg;
	function clampPan(...args) {
		return cameraModule.clampPan(...args);
	}
	let camTimer = null;
	function focusPoint(...args) {
		return cameraModule.focusPoint(...args);
	}
	function focusHop(...args) {
		return cameraModule.focusHop(...args);
	}
	function applyPan(...args) {
		return cameraModule.applyPan(...args);
	}
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
		setZoom(zoom * 1.25, canvasCentre());
	});
	scope.listen(document.getElementById("zoomOut"), "click", () => {
		tourCamManual();
		setZoom(zoom / 1.25, canvasCentre());
	});
	scope.listen(document.getElementById("zoomFit"), "click", () => {
		if (tour.active) tourFit();
		else resetView();
	});
	scope.listen(scroller, "wheel", (e) => {
		if (e.target.closest("#zoomCtl")) return;
		if (!fsMode) {
			if (!normalZoom() || !e.ctrlKey) return;
			e.preventDefault();
			setZoom(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), {
				x: e.clientX,
				y: e.clientY
			});
			return;
		}
		e.preventDefault();
		tourCamManual();
		if (e.ctrlKey) setZoom(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
		else {
			tx -= e.deltaX;
			ty -= e.deltaY;
			applyPan();
		}
	}, { passive: false });
	let panDown = false, panMoved = false, panX = 0, panY = 0;
	scope.listen(scroller, "pointerdown", (e) => {
		if (!(fsMode || normalZoom() && zoom !== 1) || e.button !== 0 || e.target.closest("#zoomCtl")) return;
		panDown = true;
		panMoved = false;
		panX = e.clientX;
		panY = e.clientY;
	});
	scope.listen(scroller, "pointermove", (e) => {
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
		tx += dx;
		ty += dy;
		applyPan();
		panX = e.clientX;
		panY = e.clientY;
	});
	["pointerup", "pointercancel"].forEach((t) => scope.listen(scroller, t, () => {
		panDown = false;
		scroller.classList.remove("panning");
	}));
	scope.listen(scroller, "click", (e) => {
		if (e.target.closest("#zoomCtl")) return;
		if (panMoved) {
			e.stopPropagation();
			e.preventDefault();
			panMoved = false;
		}
	}, true);
	function applyLabels() {
		NODES.forEach((n) => {
			const e = nodeEls[n.id];
			e.l1.textContent = viewMode === "tools" ? n.tool : n.concept;
			e.l2.textContent = viewMode === "tools" ? n.concept : n.tool;
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
	function animateDot(...args) {
		return flowplayerModule.animateDot(...args);
	}
	function markSilent(...args) {
		return flowplayerModule.markSilent(...args);
	}
	function popBadge(...args) {
		return flowplayerModule.popBadge(...args);
	}
	function playStory(...args) {
		return flowplayerModule.playStory(...args);
	}
	const flowPicker = document.getElementById("flowPicker");
	const flowSummary = flowPicker.querySelector("summary");
	const flowControls = document.getElementById("flowControls");
	const storyOptions = document.getElementById("storyOptions");
	const failureOptions = document.getElementById("failureOptions");
	const playFlowButton = document.getElementById("playFlow");
	let chosenFlow = null;
	function chooseFlow(...args) {
		return flowplayerModule.chooseFlow(...args);
	}
	function closeFlowPicker(...args) {
		return flowplayerModule.closeFlowPicker(...args);
	}
	function focusFlowOption(...args) {
		return flowplayerModule.focusFlowOption(...args);
	}
	scope.listen(flowPicker, "toggle", () => {
		if (flowPicker.open) requestAnimationFrame(() => {
			if (flowPicker.open) focusFlowOption();
		});
	});
	scope.listen(flowPicker, "keydown", (event) => {
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
	scope.listen(flowPicker, "focusout", (event) => {
		if (event.relatedTarget && !flowPicker.contains(event.relatedTarget)) closeFlowPicker();
	});
	scope.listen(document, "pointerdown", (event) => {
		if (flowPicker.open && !flowPicker.contains(event.target)) closeFlowPicker();
	});
	scope.listen(playFlowButton, "click", () => {
		if (chosenFlow) {
			closeFlowPicker();
			playStory(chosenFlow);
		}
	});
	const storyAvailable = (st) => {
		if (!PINNED) return true;
		let playable = 0;
		for (const h of st.hops) {
			const e = EDGES.find((x) => x.id === h.e);
			if (!e || nodeEls[e.from].def.week > PINNED || nodeEls[e.to].def.week > PINNED) break;
			playable++;
		}
		return playable > 0 && playable >= st.hops.length * definition.settings.pinnedFlowFraction;
	};
	Object.keys(STORIES).forEach((key) => {
		const story = STORIES[key];
		if (!storyAvailable(story)) return;
		const button = document.createElement("button");
		button.type = "button";
		button.className = "flow-option";
		button.dataset.flow = key;
		button.style.setProperty("--flow-hue", hue(story.hue));
		button.setAttribute("aria-pressed", "false");
		button.title = story.desc;
		const marker = document.createElement("span");
		marker.className = "flow-dot";
		marker.setAttribute("aria-hidden", "true");
		button.append(marker, document.createTextNode(story.title));
		scope.listen(button, "click", () => {
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
	WEEKS.map((_, i) => [String(i), i === 0 ? definition.ui.fullSystem : String(i)]).filter(([v]) => !PINNED || Number(v) >= 1 && Number(v) <= PINNED).forEach(([v, t]) => {
		const b = document.createElement("button");
		b.dataset.w = v;
		b.textContent = t;
		if (v !== "0" && WEEKS[v]?.title) {
			b.dataset.tip = v + " · " + WEEKS[v].title;
			b.setAttribute("aria-label", "Step " + b.dataset.tip);
			for (const ev of ["mouseenter", "focus"]) scope.listen(b, ev, () => showStepTip(b));
			for (const ev of [
				"mouseleave",
				"blur",
				"click"
			]) scope.listen(b, ev, hideStepTip);
		}
		scope.listen(b, "click", () => {
			if (level !== 1) showLevel(1);
			closeInside();
			clearStory();
			setFocus(null);
			setWeek(Number(v));
		});
		weekSeg.appendChild(b);
	});
	const TOUR_CHAPTERS = definition.tourChapters;
	const TOUR = definition.tour;
	const TOUR_TOTAL = TOUR.length + 1;
	const BEAT_SECONDS = definition.beatSeconds;
	const FLOW_BEAT_SECONDS = definition.flowBeatSeconds;
	const store = {
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
	};
	if (param("reset")) [definition.settings.storage.tour, definition.settings.storage.nudge].forEach((key) => {
		try {
			localStorage.removeItem(key);
		} catch (err) {}
	});
	function readTour(...args) {
		return tourplayerModule.readTour(...args);
	}
	function saveTour(...args) {
		return tourplayerModule.saveTour(...args);
	}
	const tourControls = document.getElementById("tourControls");
	const tourBtn = document.getElementById("tourBtn");
	const themeToggle = document.getElementById("themeToggle");
	if (themeToggle) {
		const rootEl = document.documentElement;
		const isDark = () => rootEl.dataset.theme ? rootEl.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
		const syncThemeLabel = () => themeToggle.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
		try {
			const saved = localStorage.getItem("imap-theme");
			if (saved === "dark" || saved === "light") rootEl.dataset.theme = saved;
		} catch (_) {}
		syncThemeLabel();
		scope.listen(themeToggle, "click", () => {
			const next = isDark() ? "light" : "dark";
			rootEl.dataset.theme = next;
			try {
				localStorage.setItem("imap-theme", next);
			} catch (_) {}
			syncThemeLabel();
		});
	}
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
	const teNext = document.getElementById("teNext");
	control.label(tourExitBtn, "Exit", "exit");
	tourExitBtn.setAttribute("aria-label", "Exit tour");
	if (PINNED || BOOTCAMP) tourControls.hidden = true;
	teNext.href = STRUCTURE_URL;
	if (HUB) teNext.target = "_top";
	scope.listen(teNext, "click", () => T()?.milestone("to_repo_tool"));
	TOUR_CHAPTERS.forEach((c) => {
		const li = document.createElement("li");
		li.innerHTML = "<span class=\"tb-bar\"><span class=\"tb-fill\"></span></span><span class=\"tb-name\"></span>";
		li.querySelector(".tb-name").textContent = c.name;
		tourChapters.appendChild(li);
	});
	function resumeStep(...args) {
		return tourplayerModule.resumeStep(...args);
	}
	function refreshTourEntry(...args) {
		return tourplayerModule.refreshTourEntry(...args);
	}
	filesView = createFilesView(context);
	scope.listen(tourBtn, "click", () => startTour(resumeStep() || 1, { native: true }));
	function timeLeft(...args) {
		return tourplayerModule.timeLeft(...args);
	}
	const beatHue = (b) => `var(${b.hue || TOUR_CHAPTERS[b.ch].hue})`;
	const beatHasMotion = (b) => Boolean(b.flow) || Boolean(b.whole) && !reduced;
	function renderTourBar(...args) {
		return tourplayerModule.renderTourBar(...args);
	}
	function renderTourCard(...args) {
		return tourplayerModule.renderTourCard(...args);
	}
	const flowEnd = (b) => b.hops ? b.hops[1] : STORIES[b.flow].hops.length;
	const beatStart = (b) => b.hops ? b.hops[0] : 0;
	const edgeCount = (b) => flowEnd(b) - beatStart(b);
	const hopHue = (s, hop) => hue(hop.bad || !s.ok ? s.hue : s.ok);
	function renderTourText(...args) {
		return tourplayerModule.renderTourText(...args);
	}
	function syncBadges(...args) {
		return tourplayerModule.syncBadges(...args);
	}
	function syncFocus(...args) {
		return tourplayerModule.syncFocus(...args);
	}
	function revealLatest(...args) {
		return tourplayerModule.revealLatest(...args);
	}
	let tourStepped = false;
	function renderPlayer(...args) {
		return tourplayerModule.renderPlayer(...args);
	}
	function sizeTourCard(...args) {
		return tourplayerModule.sizeTourCard(...args);
	}
	let cardSwap = 0, cardOut = null;
	function cardChange(...args) {
		return tourplayerModule.cardChange(...args);
	}
	const PATH_ZOOM_MAX = 1.6;
	const SHOT_SLACK = .85;
	function camFrame(...args) {
		return cameraModule.camFrame(...args);
	}
	function placeCamera(...args) {
		return cameraModule.placeCamera(...args);
	}
	function currentView(...args) {
		return cameraModule.currentView(...args);
	}
	function frameBoxes(...args) {
		return cameraModule.frameBoxes(...args);
	}
	const zoomCtl = document.getElementById("zoomCtl"), tcKeys = tourCard.querySelector(".tc-keys");
	function camGeom(...args) {
		return cameraModule.camGeom(...args);
	}
	function camSolve(...args) {
		return cameraModule.camSolve(...args);
	}
	function camShows(...args) {
		return cameraModule.camShows(...args);
	}
	const nodeBox = (id) => nodeEls[id].g.getBBox();
	const allNodeBoxes = () => NODES.map((n) => nodeBox(n.id));
	function litBoxes(...args) {
		return cameraModule.litBoxes(...args);
	}
	function fitTarget(...args) {
		return cameraModule.fitTarget(...args);
	}
	const hopBoxes = (ee) => [
		ee.path.getBBox(),
		nodeEls[ee.def.from].g.getBBox(),
		nodeEls[ee.def.to].g.getBBox()
	].concat(ee.label ? [ee.label.getBBox()] : []);
	function pathTarget(...args) {
		return cameraModule.pathTarget(...args);
	}
	function beatShots(...args) {
		return cameraModule.beatShots(...args);
	}
	function tweenCamera(...args) {
		return cameraModule.tweenCamera(...args);
	}
	const camFree = () => tour.active && fsMode && !reduced && !tour.camManual;
	function tourCamShot(...args) {
		return cameraModule.tourCamShot(...args);
	}
	function tourCamManual(...args) {
		return cameraModule.tourCamManual(...args);
	}
	function tourFit(...args) {
		return cameraModule.tourFit(...args);
	}
	let tourFitFrame = 0;
	scope.listen(window, "resize", () => {
		if (!tour.active) return;
		cancelAnimationFrame(tourFitFrame);
		tourFitFrame = requestAnimationFrame(() => {
			updateDrawerBounds();
			if (!tour.atEnd) sizeTourCard();
			tourFit();
			if (!tour.atEnd) {
				const b = TOUR[tour.step - 1];
				tourCamShot(b, b.flow && tour.phase > 0 && tour.phase <= edgeCount(b) ? tour.phase - 1 : null, false);
			}
		});
	});
	const SWEEP = definition.settings.recapOrder;
	const stageCount = (b) => b.whole && !reduced ? SWEEP.length : 0;
	function showStage(...args) {
		return tourplayerModule.showStage(...args);
	}
	function drawBeatPath(...args) {
		return tourplayerModule.drawBeatPath(...args);
	}
	function markEdge(...args) {
		return tourplayerModule.markEdge(...args);
	}
	function stopEdgeMotion(...args) {
		return tourplayerModule.stopEdgeMotion(...args);
	}
	function playEdge(...args) {
		return tourplayerModule.playEdge(...args);
	}
	function stepEdge(...args) {
		return tourplayerModule.stepEdge(...args);
	}
	function finishBeat(...args) {
		return tourplayerModule.finishBeat(...args);
	}
	function showBeat(...args) {
		return tourplayerModule.showBeat(...args);
	}
	function startTour(...args) {
		return tourplayerModule.startTour(...args);
	}
	function tourNext(...args) {
		return tourplayerModule.tourNext(...args);
	}
	function tourBack(...args) {
		return tourplayerModule.tourBack(...args);
	}
	function showEnding(...args) {
		return tourplayerModule.showEnding(...args);
	}
	function exitTour(...args) {
		return tourplayerModule.exitTour(...args);
	}
	function onTourKey(...args) {
		return tourplayerModule.onTourKey(...args);
	}
	scope.listen(tcNext, "click", tourNext);
	scope.listen(tcBack, "click", tourBack);
	scope.listen(tourExitBtn, "click", () => exitTour(tour.atEnd));
	scope.listen(document.getElementById("teBack"), "click", () => exitTour(true));
	function setTheme(...args) {
		return navigationModule.setTheme(...args);
	}
	const forcedTheme = param("theme");
	let storedTheme = null;
	try {
		storedTheme = localStorage.getItem(definition.settings.storage.theme);
	} catch (err) {}
	if (forcedTheme === "dark" || forcedTheme === "light") setTheme(forcedTheme);
	else if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
	applyLabels();
	if (PINNED) {
		document.getElementById("pinTitleWeek").textContent = context.format(definition.ui.pinnedTitle, {
			step: PINNED,
			title: WEEKS[PINNED].title
		});
		document.getElementById("pinTitle").hidden = false;
		showLevel(1);
		setWeek(PINNED);
		openPanel();
	} else {
		setWeek(0, { silent: true });
		showLevel(0);
		renderL0();
		openPanel();
	}
	const wantNode = param("node");
	if (wantNode && nodeEls[wantNode]) {
		showLevel(1);
		selectNode(wantNode);
	}
	refreshTourEntry();
	if (!PINNED && !BOOTCAMP && param("tour") === "1") startTour(1);
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
				level,
				focused,
				selected,
				buildStep: week,
				flow: chosenFlow,
				zoom,
				pan: {
					x: tx,
					y: ty
				},
				fullscreen: fsMode,
				tour: {
					active: tour.active,
					step: tour.step,
					phase: tour.phase,
					complete: tour.atEnd
				}
			};
		},
		destroy() {
			storyToken++;
			cardSwap++;
			tour.camToken++;
			tour.active = false;
			tour.atEnd = false;
			scope.destroy();
			if (document.fullscreenElement === stagecard) document.exitFullscreen().catch(() => {});
			root.replaceChildren();
		}
	};
}
// src/runtime/definition.js
/** Validate and hydrate a trusted definition without mutating the author's data. */
function prepareDefinition(input) {
	const d = structuredClone(input);
	const fail = (message) => {
		throw new Error(`Invalid map definition: ${message}`);
	};
	if (typeof d.id !== "string" || !d.id) fail("id must be a non-empty string");
	d.settings.storage = {
		tour: `${d.id}:tour`,
		nudge: `${d.id}:nudge`,
		theme: "map-viewer:theme"
	};
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
		if (!d.buildSteps[n.week]) fail(`node ${n.id}.week: ${n.week}`);
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
/** Authored markup is trusted project content, not user-submitted HTML. */
function renderShell(template, d) {
	const pageSlots = d.page?.slots || {};
	const description = pageSlots.mapDescription || pageSlots.overviewDescription || d.page.title;
	const slots = {
		completionCount: `Tour complete · ${d.tour.length} steps`,
		completionIntro: "You have reached the end of this map.",
		completionLessons: "",
		nextToolUrl: "#",
		nextToolLabel: "",
		tourEntry: "Take the guided tour",
		overviewDescription: pageSlots.mapDescription || description,
		mapDescription: pageSlots.overviewDescription || description,
		legend: Object.entries(d.roles).map(([key, role]) => `<span class="lg"><span class="sw" style="--legend-hue:var(--h-${key})"></span>${role.label}</span>`).join(""),
		...pageSlots,
		overviewViewBox: "0 0 " + d.layout.viewBoxes.map0.join(" "),
		mapViewBox: "0 0 " + d.layout.viewBoxes.map.join(" ")
	};
	slots.nextToolHidden = slots.nextToolUrl && slots.nextToolLabel ? "" : "hidden";
	return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
		if (!(key in slots)) throw new Error(`Missing page slot: ${key}`);
		return slots[key];
	});
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
