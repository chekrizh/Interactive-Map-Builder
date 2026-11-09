/** panels: extracted original behavior; dependencies supplied by the instance controller. */
export function createPanels(ctx) {
/* ---------------- inside overlay ---------------- */

function openInside(nodeId) {
  const n = ctx.nodeEls[nodeId].def;
  const sc = ctx.INSIDES[n.inside];
  if (!sc) return;
  ctx.T()?.step("inside", nodeId);
  ctx.document.getElementById("insideTitle").textContent = sc.title;
  ctx.document.getElementById("insideSub").textContent = sc.sub;
  ctx.document.getElementById("insideCap").textContent = sc.cap;
  ctx.document.getElementById("insideScene").innerHTML = `<svg class="iscene ml-canvas" viewBox="0 0 ${sc.w} ${sc.h}" role="img" aria-label="${sc.title}">${ctx.IMARK}${sc.svg}</svg>`;
  const scene = ctx.document.querySelector("#insideScene svg");
  ctx.canvas.setRole(scene, n.cat);
  // Round close-up connector elbows with the same primitive as the full map.
  scene.querySelectorAll(".ie").forEach(path => {
    if (!/[CQ]/.test(path.getAttribute("d"))) path.setAttribute("d", ctx.canvas.roundPath(path.getAttribute("d"), 10));
  });
  ctx.insideBox.hidden = false;
}

function closeInside() {
  ctx.insideBox.hidden = true;
}

/* One logical panel, two containers: in normal view it is the page-level
   side card (aside.panel); in fullscreen the same element is reparented
   into the .drawer sidebar, whose visibility is driven by .open. */
/* In fullscreen the drawer's .open drives visibility and the panel must
   stay un-"closed" inside it; hiding is per-mode, or a reopened drawer
   slides in around a display:none panel and looks empty. */
/* Closing lives on the panel's own ✕; reopening lives on the crumbbar's
   "Show panel", which only exists while the panel is closed. */
function openPanel() {
  if (ctx.fsMode) {
    ctx.updateDrawerBounds();
    ctx.drawer.classList.add("open");
  }
  ctx.panel.classList.remove("closed");
  ctx.panelBtn.hidden = true;
}

function closePanel() {
  if (ctx.fsMode) ctx.drawer.classList.remove("open");else ctx.panel.classList.add("closed");
  ctx.panelBtn.hidden = false;
}

function panelIsOpen() {
  return ctx.fsMode ? ctx.drawer.classList.contains("open") : !ctx.panel.classList.contains("closed");
}
/* Keep the newest line in view by scrolling the panel's own box. The
   obvious scrollIntoView walks up to the window when the box cannot move
   far enough, and a nudged page slides the map: unwanted anywhere, fatal
   while someone is recording. The scroller differs by mode; in fullscreen
   the panel sits at natural height inside .drawer, which is the box. */
function revealInPanel(elm) {
  const box = ctx.fsMode ? ctx.drawer : ctx.panel;
  const br = box.getBoundingClientRect(),
    er = elm.getBoundingClientRect();
  const d = er.bottom > br.bottom ? er.bottom - br.bottom : er.top < br.top ? er.top - br.top : 0;
  if (!d) return;
  box.scrollTo({
    top: box.scrollTop + d,
    behavior: ctx.reduced ? "auto" : "smooth"
  });
}

/* The close strip turns opaque only once its card has scrolled. */
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
  const eyebrow = ctx.panelBody.querySelector(".p-eyebrow"),
    title = ctx.panelBody.querySelector("h2");
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
  // New content starts unscrolled-looking until the reader scrolls it.
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
  const items = G.members.map(id => {
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

  const repo = n.structure ? `<h3>${ctx.definition.panels.repository}</h3>
      <div class="panel-actions xrepo"><a class="panel-action" href="${ctx.structureHref(n.structure)}"${ctx.LINK_TARGET} aria-label="Open ${n.structure} in the project layout"><span class="mono">${n.structure}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></a></div>` : "";

  const bnote = ctx.BOOTCAMP && n.bootcampNote ? `<h3>${ctx.definition.panels.course}</h3><div class="bnote">${n.bootcampNote}</div>` : "";
  ctx.panelHTML(`
      <div class="p-eyebrow">${ctx.catName(n.cat)}${n.art ? ctx.definition.panels.fileSuffix : ""}</div>
      <h2>${ctx.viewMode === "tools" ? n.tool : n.concept}</h2>
      <p class="p-sub">${ctx.viewMode === "tools" ? n.concept : n.tool}</p>
      <div class="p-chips"><span class="pchip">${ctx.format(ctx.BOOTCAMP ? ctx.definition.panels.nodeCourseLabel : ctx.definition.panels.nodeBuildLabel, {step: n.week, total: ctx.WEEKS.length - 1})}</span></div>
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
  ctx.openPanel();
}

function renderWeek(w) {
  const d = ctx.WEEKS[w];
  const items = d.nodes.map(id => {
    const n = ctx.nodeEls[id].def;
    return `<li><strong>${n.concept}</strong>: ${n.tool}</li>`;
  }).join("");
  ctx.panelHTML(`
      <div class="p-eyebrow">${ctx.format(ctx.BOOTCAMP ? ctx.definition.panels.courseLabel : ctx.definition.panels.buildLabel, {step: w, total: ctx.WEEKS.length - 1})}</div>
      <h2>${d.title}</h2>
      <p style="margin-top:8px">${ctx.BOOTCAMP && d.you ? d.you : d.text}</p>
      <h3>${ctx.definition.panels.newNodes}</h3><ul class="newlist">${items}</ul>
      <h3>${ctx.definition.panels.decision}</h3><div class="decision">${d.decision}</div>
      <h3>${ctx.definition.panels.runnable}</h3><pre class="cmd"><code>${d.runnable}</code></pre>
      <p class="p-note">${ctx.PINNED ? ctx.definition.panels.pinnedNote : ctx.definition.panels.buildNote}</p>
    `, ctx.definition.panels.buildRole);
  ctx.openPanel();
}

/* ---------------- stories + weeks ---------------- */

/* storyToken cancels in-flight playback: every await inside playStory
   re-checks it, so starting anything new safely abandons the old flow. */
return { openInside, closeInside, openPanel, closePanel, panelIsOpen, revealInPanel, syncPanelHead, catName, panelHTML, renderL0, renderOverview, renderGroup, renderNode, renderWeek };
}
