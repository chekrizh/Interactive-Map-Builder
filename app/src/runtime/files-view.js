/** Files view: the repository as an annotated folder tree, tied to the map.
    Data: definition.files = { title?, intro?, entries: [{ path, t, d?, tag?, nodes?, open?, more? }] }.
    A path ending in "/" is a folder; parents that are not listed are added without a note. */

const FOLDER = '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.1l1.8 2h9.1A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>';
const SHEET = '<path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"/><path d="M14 3v4.5h4.5"/>';
/* File glyphs by kind, all on the same sheet so the column stays quiet. */
const KINDS = [
  [/\.(js|mjs|cjs|ts|tsx|jsx|py|go|rs|rb|java|kt|swift|c|cc|cpp|h|cs|php|scala|sh|sql|ipynb)$/i, '<path d="m10 12.5-2 2 2 2m4-4 2 2-2 2"/>'],
  [/(\.(ya?ml|json|toml|ini|cfg|conf|lock)|\.env.*|^\.?[A-Za-z]*rc|Dockerfile|Makefile|Procfile|\.gitignore|\.dockerignore)$/i, '<path d="M8.5 12h7m-7 3h7m-7 3h4"/>'],
  [/\.(md|mdx|rst|txt|html|hbs|ejs|jinja2?|pdf)$|^(LICENSE|README)/i, '<path d="M8.5 12.5h7m-7 3h7"/>'],
];
const fileGlyph = name => SHEET + (KINDS.find(([re]) => re.test(name))?.[1] || "");
const CHEVRON = '<path d="m9 6 6 6-6 6"/>';
const ARROW = '<path d="M4 12h16m-6-6 6 6-6 6"/>';
const OUT = '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>';
const svg = (paths, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/** Build the tree from flat paths. Returns { root, byPath }. */
export function buildFileTree(entries) {
  const root = { path: "", name: "", dir: true, kids: [], entry: null };
  const byPath = new Map([["", root]]);
  const ensure = (path, dir) => {
    const key = path.replace(/\/$/, "");
    if (byPath.has(key)) {
      const node = byPath.get(key);
      if (dir) node.dir = true;
      return node;
    }
    const cut = key.lastIndexOf("/");
    const parent = ensure(cut < 0 ? "" : key.slice(0, cut + 1), true);
    const node = { path: key, name: key.slice(cut + 1), dir, kids: [], entry: null, parent };
    parent.kids.push(node);
    byPath.set(key, node);
    return node;
  };
  for (const e of entries) ensure(e.path, e.path.endsWith("/")).entry = e;
  const sort = n => {
    n.kids.sort((a, b) => (b.dir - a.dir) || a.name.localeCompare(b.name));
    n.kids.forEach(sort);
  };
  sort(root);
  return { root, byPath };
}

export function createFilesView(ctx) {
  const files = ctx.definition.files;
  const box = ctx.document.getElementById("files");
  const btn = ctx.document.getElementById("filesBtn");
  if (!files || !box || !btn) return { available: false, open() {}, close() {}, isOpen: () => false, pathsFor: () => [] };

  const { root, byPath } = buildFileTree(files.entries);
  const source = ctx.definition.source;
  const ui = ctx.definition.ui;
  const tree = box.querySelector("#filesTree");
  const expanded = new Set();
  byPath.forEach(n => {
    if (n.dir && (n.parent === root || n.entry?.open)) expanded.add(n.path);
  });
  let selected = null;

  btn.hidden = false;
  ctx.document.getElementById("filesBtnText").textContent = ui.filesEntry || "Browse the code";
  const repoName = files.title || (source ? source.repo.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "") : "project");
  root.name = repoName.split("/").pop();
  box.querySelector("#filesTitle").innerHTML = `${esc(ui.filesTitle || "Project files")} · ${esc(repoName)}` +
    (source?.ref ? ` at <span class="mono">${esc(source.ref.slice(0, 7))}</span>` : "");

  const nodeOf = id => ctx.nodeEls[id]?.def;
  /* A path takes the role of its first component. A folder without its own
     components takes its contents' role when they all share one; mixed or
     unlinked paths stay grey. */
  const roleOf = n => {
    const own = n.entry?.nodes?.map(nodeOf).find(Boolean);
    if (own) return own.cat;
    if (!n.dir) return null;
    const roles = new Set(n.kids.map(roleOf).filter(Boolean));
    return roles.size === 1 ? [...roles][0] : null;
  };
  const hueOf = n => {
    const role = roleOf(n);
    return role ? `var(--h-${role})` : "var(--muted)";
  };
  const href = n => {
    if (!source?.repo?.startsWith("https://github.com/")) return null;
    return `${source.repo.replace(/\/$/, "")}/${n.dir ? "tree" : "blob"}/${source.ref || "HEAD"}/${n.path.split("/").map(encodeURIComponent).join("/")}`;
  };
  const chip = id => {
    const n = nodeOf(id);
    if (!n) return "";
    return `<button type="button" class="ft-chip" data-node="${esc(id)}" style="--chip-hue:var(--h-${n.cat})" title="Show ${esc(n.concept)} on the map" tabindex="-1">` +
      `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ctx.ICONS[n.icon] || ""}</svg>${esc(n.concept)}</button>`;
  };

  function rowHTML(n, depth) {
    const e = n.entry;
    const open = n.dir && expanded.has(n.path);
    const kids = n.dir && (n.kids.length || e?.more);
    const name = n.name + (n.dir ? "/" : "");
    const chips = (e?.nodes || []).map(chip).join("");
    const tag = e?.tag ? `<span class="ft-tag">${esc(e.tag)}</span>` : "";
    let h = `<div class="ft-row${n === selected ? " is-sel" : ""}${e ? "" : " is-bare"}" role="treeitem" tabindex="${n === selected ? 0 : -1}"` +
      ` aria-level="${depth + 1}"${kids ? ` aria-expanded="${open}"` : ""}${n === selected ? ' aria-selected="true"' : ""}` +
      ` data-path="${esc(n.path)}" style="--depth:${depth};--row-hue:${hueOf(n)}">` +
      `<span class="ft-name">${kids ? svg(CHEVRON, "ft-chev") : '<span class="ft-chev"></span>'}${svg(n.dir ? FOLDER : fileGlyph(n.name), "ft-ico")}<span class="ft-label">${esc(name)}</span></span>` +
      `<span class="ft-note">${e?.t || ""}</span><span class="ft-meta">${tag}${chips}</span></div>`;
    if (open) {
      h += `<div role="group" class="ft-kids" style="--depth:${depth}">` + n.kids.map(k => rowHTML(k, depth + 1)).join("");
      if (e?.more) h += `<div class="ft-row ft-more" style="--depth:${depth + 1}"><span class="ft-name"><span class="ft-chev"></span><span class="ft-label">…</span></span><span class="ft-note">${e.more}</span></div>`;
      h += "</div>";
    }
    return h;
  }

  function render() {
    // The repository itself is the first row, like the top of a file explorer.
    tree.innerHTML = `<div class="ft-row is-root${selected ? "" : " is-sel"}" role="treeitem" aria-level="1" aria-expanded="true" tabindex="${selected ? -1 : 0}" data-path="" style="--depth:0;--row-hue:var(--muted)">` +
      `<span class="ft-name">${svg(CHEVRON, "ft-chev")}${svg(FOLDER, "ft-ico")}<span class="ft-label">${esc(root.name)}/</span></span><span class="ft-note">${files.intro || ""}</span><span class="ft-meta"></span></div>` +
      `<div role="group" class="ft-kids" style="--depth:0">` + root.kids.map(k => rowHTML(k, 1)).join("") + "</div>";
    if (!tree.querySelector('[tabindex="0"]')) tree.querySelector(".ft-row[data-path]")?.setAttribute("tabindex", "0");
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
    const nodes = (e.nodes || []).map(id => [id, nodeOf(id)]).filter(([, d]) => d);
    const onMap = nodes.map(([id, d]) =>
      `<button type="button" class="panel-action ft-goto" data-node="${esc(id)}" style="--chip-hue:var(--h-${d.cat})">` +
      `<span class="ft-goto-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ctx.ICONS[d.icon] || ""}</svg></span>` +
      `${esc(d.concept)}${svg(ARROW)}</button>`).join("");
    const kids = n.dir ? n.kids.filter(k => k.entry).map(k =>
      `<li><button type="button" class="ft-link" data-path="${esc(k.path)}">${esc(k.name + (k.dir ? "/" : ""))}</button> ${k.entry.t}</li>`).join("") : "";
    const link = href(n);
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
      ${link ? `<div class="panel-actions"><a class="panel-action" href="${esc(link)}" target="_blank" rel="noopener">Open on GitHub${svg(OUT)}</a></div>` : ""}
    `, hue);
    ctx.panelBody.querySelectorAll("[data-node]").forEach(b => ctx.scope.listen(b, "click", () => goToNode(b.dataset.node)));
    ctx.panelBody.querySelectorAll(".ft-link").forEach(b => ctx.scope.listen(b, "click", () => select(b.dataset.path, { reveal: true })));
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
      if (reveal) row.scrollIntoView({ block: "nearest", behavior: ctx.reduced ? "auto" : "smooth" });
      if (focus) row.focus({ preventScroll: !reveal });
    }
    return true;
  }

  function toggle(n, want) {
    if (!n.dir) return;
    const open = want ?? !expanded.has(n.path);
    if (open) expanded.add(n.path); else expanded.delete(n.path);
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
    if (path && select(path, { reveal: true, focus: true })) return;
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
    if (ctx.level === 0) ctx.renderL0(); else if (ctx.selected) ctx.renderNode(ctx.selected); else ctx.renderOverview();
  }

  ctx.scope.listen(btn, "click", () => (box.hidden ? open() : rerenderPanelAfterClose()));
  ctx.scope.listen(box.querySelector("#filesBack"), "click", rerenderPanelAfterClose);
  ctx.scope.listen(tree, "click", ev => {
    const c = ev.target.closest(".ft-chip");
    if (c) { goToNode(c.dataset.node); return; }
    const row = ev.target.closest(".ft-row[data-path]");
    if (!row) return;
    const n = byPath.get(row.dataset.path);
    if (n === root) { selected = null; render(); renderIntro(); tree.querySelector(".is-root")?.focus(); return; }
    // The chevron only folds; the rest of the row selects (and opens a closed folder).
    if (ev.target.closest(".ft-chev")) { toggle(n); render(); row.focus?.(); return; }
    if (n.dir && (n !== selected || !expanded.has(n.path))) toggle(n, true);
    select(n.path, { focus: true });
  });
  ctx.scope.listen(tree, "keydown", ev => {
    const row = ev.target.closest(".ft-row[data-path]");
    if (!row) return;
    const rows = [...tree.querySelectorAll(".ft-row[data-path]")];
    const i = rows.indexOf(row), n = byPath.get(row.dataset.path);
    if (n === root && !["ArrowDown", "ArrowUp"].includes(ev.key)) {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selected = null; render(); renderIntro(); tree.querySelector(".is-root")?.focus(); }
      return;
    }
    const move = j => { if (rows[j]) { rows.forEach(r => r.tabIndex = -1); rows[j].tabIndex = 0; rows[j].focus(); } };
    if (ev.key === "ArrowDown") move(i + 1);
    else if (ev.key === "ArrowUp") move(i - 1);
    else if (ev.key === "ArrowRight" && n.dir) { if (!expanded.has(n.path)) { toggle(n, true); render(); tree.querySelector(`.ft-row[data-path="${CSS.escape(n.path)}"]`)?.focus(); } else move(i + 1); }
    else if (ev.key === "ArrowLeft") {
      if (n.dir && expanded.has(n.path)) { toggle(n, false); render(); tree.querySelector(`.ft-row[data-path="${CSS.escape(n.path)}"]`)?.focus(); }
      else if (n.parent && n.parent !== root) move(rows.findIndex(r => r.dataset.path === n.parent.path));
    } else if (ev.key === "Enter" || ev.key === " ") { if (n.dir) toggle(n, true); select(n.path, { focus: true }); }
    else return;
    ev.preventDefault();
  });

  /** Paths whose entries list this node, for the node panel's "In the code". */
  const pathsFor = id => files.entries.filter(e => e.nodes?.includes(id)).map(e => e.path);

  return { available: true, open, close, isOpen: () => !box.hidden, pathsFor };
}
