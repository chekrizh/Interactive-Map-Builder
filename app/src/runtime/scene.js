import canvasPrimitives from '../rendering/ml-canvas.js';

/** Draws the map: the big picture (map0) and the full map (map) with its zones, edges, labels and
 *  component cards. Returns the drawn elements for the modules that light, move and frame them.
 *  `on` receives a reader's click on an overview card (openGroup) or a component (selectNode). */
export async function createScene({ scope, document, t }, { definition, HUES, hue, ICONS, ZONES, NODES, EDGES, GROUPS, L0 }, on) {
  const SVGNS = "http://www.w3.org/2000/svg";
  const logos = definition.logos;
  const svg0 = document.getElementById("map0");
  const svg = document.getElementById("map");

  /* ---------------- svg helpers ---------------- */

  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------------- build level 0 ---------------- */

  // Settle local typography before measuring either label mode.
  await Promise.all([document.fonts.load('600 13.5px "Manrope"'), document.fonts.load('400 11px "Manrope"'), document.fonts.load('500 9.5px "Manrope"'), document.fonts.load('700 19px "Manrope"'), document.fonts.load('600 12px "Manrope"')]).catch(() => {});
  const canvas = canvasPrimitives;
  const labelCtx = document.createElement("canvas").getContext("2d");
  // The middle of a path's longest straight run, and that run's length.
  function longestRun(d) {
    const pts = [...d.matchAll(/[ML]([\d.-]+),([\d.-]+)/g)].map(m => ({ x: +m[1], y: +m[2] }));
    let best = null;
    for (let i = 0; i < pts.length - 1; i++) {
      const len = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
      if (!best || len > best.len) best = { len, horiz: Math.abs(pts[i + 1].y - pts[i].y) < 1, x: (pts[i].x + pts[i + 1].x) / 2, y: (pts[i].y + pts[i + 1].y) / 2 };
    }
    return best;
  }
  const BW = definition.layout.overviewCard.width,
    BH = definition.layout.overviewCard.height;
  L0.forEach((b, i) => {
    const G = GROUPS[b.g],
      BY = b.y;
    const g = el("g", {
      class: "block",
      tabindex: "0",
      role: "button",
      "aria-label": G.title + ". " + G.line1 + " " + G.line2
    }, svg0);
    canvas.setRole(g, G.huekey);
    /* Overview cards follow the full map's node style (2026-11-09): a light
       card with a role-tinted shadow, a solid role tile, the title wrapped
       to fit beside it, the role and step number, a description and the
       tools along a footer rule. "Open" shows on hover. */
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
    const pad = 22,
      tile = 44;
    canvas.iconTile(g, b.x + pad, BY + pad, tile, ICONS[G.icon]);
    el("text", {
      x: b.x + BW - pad,
      y: BY + pad + 14,
      class: "bstep",
      "text-anchor": "end"
    }, g).textContent = String(i + 1).padStart(2, "0");
    const tx = b.x + pad + tile + 14;
    const titleLines = canvas.wrapText(G.title, b.x + BW - pad - 30 - tx, '700 19px "Manrope"').slice(0, 2);
    const head = titleLines.length * 23 + 18;
    const hy = BY + pad + Math.max(0, (tile - head) / 2);
    titleLines.forEach((line, row) => {
      el("text", { x: tx, y: hy + 17 + row * 23, class: "btitle" }, g).textContent = line;
    });
    el("text", { x: tx, y: hy + titleLines.length * 23 + 13, class: "bkind" }, g).textContent = role?.label || "";
    const top = BY + pad + Math.max(tile, head) + 22;
    const footY = BY + BH - 42;
    const maxLines = Math.max(1, Math.floor((footY - 10 - top) / 21) + 1);
    let desc = canvas.wrapText(G.line1 + " " + G.line2, BW - 2 * pad, '400 14.5px "Manrope"');
    if (desc.length > maxLines) desc = desc.slice(0, maxLines).map((l, k) => k === maxLines - 1 ? l.replace(/\s*\S*$/, "") + "…" : l);
    desc.forEach((line, row) => {
      el("text", { x: b.x + pad, y: top + row * 21, class: "bline" }, g).textContent = line;
    });
    el("line", { x1: b.x + pad, x2: b.x + BW - pad, y1: footY, y2: footY, class: "brule" }, g);
    el("text", { x: b.x + pad, y: footY + 24, class: "btools" }, g).textContent = G.chips;
    el("text", { x: b.x + BW - pad, y: footY + 24, class: "bgo", "text-anchor": "end" }, g).textContent = t("cardOpen");
    const act = () => on.openGroup(b.g);
    scope.listen(g, "click", act);
    scope.listen(g, "keydown", ev => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        act();
      }
    });
  });
  {
    const d0 = el("defs", {}, svg0);
    const m = el("marker", {
      id: "arr0",
      viewBox: "0 0 10 10",
      refX: "8",
      refY: "5",
      markerWidth: "7",
      markerHeight: "7",
      orient: "auto-start-reverse"
    }, d0);
    // Arrowheads carry the clockwise reading order, so the marker draws one.
    el("path", {
      d: "M0,0 L10,5 L0,10 z",
      fill: "var(--ml-wire)"
    }, m);
    const edge = (d, text, x, y, anchor, dashed) => {
      el("path", Object.assign({
        d,
        class: "l0edge",
        "marker-end": "url(#arr0)"
      }, dashed ? {
        "stroke-dasharray": "5 4"
      } : {}), svg0);
      const start = d.match(/M([\d.-]+),([\d.-]+)/);
      if (start) el("circle", { cx: start[1], cy: start[2], r: 3, class: "l0start" }, svg0);
      /* The label rides on the line as a chip when the line has room;
         otherwise it stays at its authored spot beside the line. */
      labelCtx.font = '600 12px "Manrope"';
      const w = labelCtx.measureText(text).width + 20;
      const run = longestRun(d);
      if (!text) return;
      if (run && (run.horiz ? run.len >= w + 24 : run.len >= 40)) {
        const chip = el("g", { class: "l0chip" }, svg0);
        el("rect", { x: run.x - w / 2, y: run.y - 11, width: w, height: 22, rx: 11 }, chip);
        el("text", { x: run.x, y: run.y + 4.2, "text-anchor": "middle" }, chip).textContent = text;
        return;
      }
      // Inline style: the shared .l0lab rule centres labels and would beat an attribute.
      const lab = el("text", {
        x,
        y,
        class: "l0lab",
        style: "text-anchor: " + anchor
      }, svg0);
      lab.textContent = text;
    };
    definition.overviewEdges.forEach(connection => {
      const geo = definition.layout.overviewEdges[connection.id];
      edge(geo.d, connection.label, geo.x, geo.y, geo.anchor, connection.dashed);
    });
  }

  /* ---------------- build level 1 ---------------- */

  /* SVG markers cannot inherit the stroke color of their line, so each hue
     gets its own arrowhead; edges swap marker urls when a story colors them. */
  const defs = el("defs", {}, svg);
  Object.keys(HUES).concat(["base"]).forEach(k => {
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

  /* Each environment is one group, so Build order can fade a whole box
     (frame, label, host chip) while none of its components exist yet;
     otherwise the solid frame reads as sitting on top of the faded cards. */
  const zoneEls = ZONES.map(z => {
    const g = el("g", {
      class: "zone"
    }, zoneLayer);
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
      members: NODES.filter(n => n.zone === z.id)
    };
  });
  definition.layout.annotations.forEach(annotation => {
    const index = ZONES.findIndex(zone => zone.id === annotation.zone);
    const parent = zoneEls[index]?.g || zoneLayer;
    el("rect", {...annotation.rect, class: "hostchip"}, parent);
    el("text", {...annotation.text, class: "hostchip-t"}, parent).textContent = annotation.label;
  });

  /* The default label rule. Runs on the SNAPPED path, so midpoints are of
     what is actually drawn, not the authored endpoints (the api row relies
     on this: label-width snapping moves its box edges). Longest run wins
     because that is the run a reader follows; lside/ldx/ldy adjust from
     there and lx/ly opt out (see the note above EDGES). */
  function placeLabel(e) {
    const pts = [];
    e.d.replace(/[ML]([\d.-]+),([\d.-]+)/g, (_, x, y) => {
      pts.push({
        x: +x,
        y: +y
      });
      return "";
    });
    let a = pts[0],
      b = pts[1];
    for (let i = 1; i < pts.length - 1; i++) {
      const len = Math.abs(pts[i + 1].x - pts[i].x) + Math.abs(pts[i + 1].y - pts[i].y);
      if (len > Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) {
        a = pts[i];
        b = pts[i + 1];
      }
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
  EDGES.forEach(e => {
    const p = el("path", {
      d: canvas.roundPath(e.d),
      class: "epath",
      "marker-end": "url(#arr-base)"
    }, edgeLayer);
    if (e.bidir) p.setAttribute("marker-start", "url(#arr-base)");
    let lab = null,
      mid = null;
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
      /* Labels sit on their line as a small chip (2026-11-09) when the
         longest straight run has room for one; otherwise the text stays
         beside the line where placeLabel puts it. */
      const run = longestRun(e.d);
      // Measured off-screen: the full map's svg is still hidden here.
      labelCtx.font = '500 9.5px "Manrope"';
      const w = labelCtx.measureText(e.label).width + 14;
      if (run && run.len >= w + 18) {
        const g = el("g", { class: "elabel echip" }, edgeLayer);
        el("rect", { x: run.x - w / 2, y: run.y - 8, width: w, height: 16, rx: 8 }, g);
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
  NODES.forEach(n => {
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
    if (logo) canvas.brandTile(g, n.x + 12, n.y + (n.h - 36) / 2, 36, ICONS[n.icon], logo);else canvas.iconTile(g, n.x + 12, n.y + (n.h - 36) / 2, 36, ICONS[n.icon]);
    const tx = n.x + 59,
      cy = n.y + n.h / 2 + (n.shape === "database" ? 4 : 0);
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
    scope.listen(g, "keydown", ev => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        on.selectNode(n.id);
      }
    });
  });
  const nodeBox = id => nodeEls[id].g.getBBox();
  const allNodeBoxes = () => NODES.map(n => nodeBox(n.id));
  const hopBoxes = ee => [ee.path.getBBox(), nodeEls[ee.def.from].g.getBBox(), nodeEls[ee.def.to].g.getBBox()].concat(ee.label ? [ee.label.getBBox()] : []);

  return { svg0, svg, el, canvas, zoneLayer, edgeLayer, nodeLayer, storyLayer, zoneEls, edgeEls, nodeEls, nodeBox, allNodeBoxes, hopBoxes };
}
