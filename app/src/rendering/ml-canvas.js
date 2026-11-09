/* Shared Journey Board SVG primitives and measured layout. Content, analytics,
   state and navigation belong to each adapter, not this rendering foundation. */


  const font = '"Manrope", system-ui, sans-serif';
  const setRole = (group, role) => {
    group.style.color = `var(--h-${role})`;
    group.style.setProperty("--ml-node-fill", `var(--ml-fill-${role})`);
  };
  const element = (tag, attrs, parent) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    parent.appendChild(node);
    return node;
  };
  function card(parent, { x, y, width, height, overview = false }) {
    return element("rect", { x, y, width, height, class: overview ? "brect" : "nrect" }, parent);
  }
  function iconTile(parent, x, y, size, markup) {
    const tile = element("rect", { x, y, width: size, height: size, rx: size / 2, class: "nicon-tile", "aria-hidden": "true" }, parent);
    const inset = (size - 22) / 2;
    const icon = element("g", { transform: `translate(${x + inset},${y + inset}) scale(1.1)`, class: "nicon", stroke: "currentColor", "aria-hidden": "true" }, parent);
    icon.innerHTML = markup;
    return { tile, icon };
  }
  function brandTile(parent, x, y, size, fallbackMarkup, logo) {
    const { tile, icon } = iconTile(parent, x, y, size, fallbackMarkup);
    tile.classList.add("logo-tile");
    const inset = (size - logo.size) / 2;
    const image = element("image", { x: x + inset, y: y + inset,
      width: logo.size, height: logo.size, preserveAspectRatio: "xMidYMid meet",
      class: "nlogo", visibility: "hidden", "aria-hidden": "true" }, parent);
    // Keep role icons visible until the local mark has loaded, including
    // blocked assets and failed requests. Text labels remain the accessible name.
    image.addEventListener("load", () => {
      image.dataset.loaded = "true";
      image.removeAttribute("visibility"); icon.setAttribute("visibility", "hidden");
    });
    image.addEventListener("error", () => { image.remove(); icon.removeAttribute("visibility"); });
    image.setAttribute("href", logo.src);
  }
  function roundPath(path, radius = 16) {
    const points = [...path.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map((m) => ({ x: +m[1], y: +m[2] }));
    if (points.length < 2) return path;
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
      const ab = Math.hypot(b.x - a.x, b.y - a.y), bc = Math.hypot(c.x - b.x, c.y - b.y);
      if (!ab || !bc) continue;
      const r = Math.min(radius, ab / 2, bc / 2);
      d += ` L${b.x + (a.x - b.x) * r / ab},${b.y + (a.y - b.y) * r / ab} Q${b.x},${b.y} ${b.x + (c.x - b.x) * r / bc},${b.y + (c.y - b.y) * r / bc}`;
    }
    const end = points.at(-1);
    return d + ` L${end.x},${end.y}`;
  }
  function prepareLayout(nodes, edges, zones, scale = {x: 1, y: 1}) {
    const sx = scale.x, sy = scale.y;
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `600 13.5px ${font}`;
    nodes.forEach((n) => {
      n.original = { x: n.x * sx, y: n.y * sy, w: n.w * sx, h: n.h * sy };
      n.w = Math.max(168, Math.ceil(Math.max(ctx.measureText(n.tool).width, ctx.measureText(n.concept).width) + 76));
      n.h = 72;
      n.x = n.original.x + n.original.w / 2 - n.w / 2;
      n.y = n.original.y + n.original.h / 2 - n.h / 2;
    });
    zones.forEach((z) => { z.x *= sx; z.y *= sy; z.w *= sx; z.h *= sy; });
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    edges.forEach((e) => {
      const points = [...e.d.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map((m) => ({ x: +m[1] * sx, y: +m[2] * sy }));
      const snap = (idx, id) => {
        const n = byId[id], o = n.original, p = points[idx], old = { ...p };
        const sides = [["l", Math.abs(p.x - o.x)], ["r", Math.abs(p.x - o.x - o.w)], ["t", Math.abs(p.y - o.y)], ["b", Math.abs(p.y - o.y - o.h)]].sort((a, b) => a[1] - b[1]);
        const side = sides[0][0];
        if (side === "l" || side === "r") {
          p.x = side === "l" ? n.x : n.x + n.w;
          p.y = Math.max(n.y + 14, Math.min(n.y + n.h - 14, p.y));
        } else {
          p.y = side === "t" ? n.y : n.y + n.h;
          p.x = Math.max(n.x + 18, Math.min(n.x + n.w - 18, p.x));
        }
        const step = idx === 0 ? 1 : -1;
        // Move the whole contiguous run, not only its first bend.
        for (let j = idx + step; points[j] && Math.abs(points[j].x - old.x) < .1; j += step) points[j].x = p.x;
        for (let j = idx + step; points[j] && Math.abs(points[j].y - old.y) < .1; j += step) points[j].y = p.y;
      };
      snap(0, e.from); snap(points.length - 1, e.to);
      e.d = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
      if (e.lx != null) { e.lx *= sx; e.ly *= sy; }
      if (e.ldx) e.ldx *= sx;
      if (e.ldy) e.ldy *= sy;
    });
  }
  function wrapText(text, width, textFont) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = textFont;
    const lines = []; let line = "";
    text.split(/\s+/).forEach((word) => {
      const candidate = line ? line + " " + word : word;
      if (line && ctx.measureText(candidate).width > width) { lines.push(line); line = word; }
      else line = candidate;
    });
    if (line) lines.push(line);
    return lines;
  }
  export default Object.freeze({ setRole, card, iconTile, brandTile, roundPath, prepareLayout, wrapText });
