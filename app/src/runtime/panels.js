/** The side panel (in full screen, the drawer) and what it shows: the intro, a group, a component,
 *  a build step; and the inside close-up over the map. */
import controls from '../rendering/ml-controls.js';
import { renderInsideScene, wireInsideScene } from "../rendering/inside-scenes.js";
// Labels are plain text; inside an attribute they still need their quotes escaped.
const attr = value => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
/* The neighbours' functions the panels call (through act). */
export const NEEDS = ["showLevel", "setFocus", "updateDrawerBounds", "hasFiles", "filesFor", "openFiles", "closeInside"];

export function createPanels({ env, model, scene, state, act }) {
const document = env.document;
const panel = document.getElementById("panel");
const panelBody = document.getElementById("panelBody");
const panelBtn = document.getElementById("panelBtn");
const drawer = document.getElementById("drawer");
const insideBox = document.getElementById("inside");
/* ---------------- inside overlay ---------------- */

function openInside(nodeId) {
  const n = scene.nodeEls[nodeId].def;
  const sc = model.INSIDES[n.inside];
  if (!sc) return;
  document.getElementById("insideTitle").textContent = sc.title;
  // Subtitle and caption are rich text, like every other text field that is not a label.
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
  // Round close-up connector elbows with the same primitive as the full map.
  iscene.querySelectorAll(".ie").forEach(path => {
    if (!/[CQ]/.test(path.getAttribute("d"))) path.setAttribute("d", scene.canvas.roundPath(path.getAttribute("d"), 10));
  });
  insideBox.hidden = false;
}

function closeInside() {
  insideBox.hidden = true;
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
  if (state.fsMode) {
    act.updateDrawerBounds();
    drawer.classList.add("open");
  }
  panel.classList.remove("closed");
  panelBtn.hidden = true;
}

function closePanel() {
  if (state.fsMode) drawer.classList.remove("open");else panel.classList.add("closed");
  panelBtn.hidden = false;
}

function panelIsOpen() {
  return state.fsMode ? drawer.classList.contains("open") : !panel.classList.contains("closed");
}
/* Keep the newest line in view by scrolling the panel's own box. The
   obvious scrollIntoView walks up to the window when the box cannot move
   far enough, and a nudged page slides the map: unwanted anywhere, fatal
   while someone is recording. The scroller differs by mode; in fullscreen
   the panel sits at natural height inside .drawer, which is the box. */
function revealInPanel(elm) {
  const box = state.fsMode ? drawer : panel;
  const br = box.getBoundingClientRect(),
    er = elm.getBoundingClientRect();
  const d = er.bottom > br.bottom ? er.bottom - br.bottom : er.top < br.top ? er.top - br.top : 0;
  if (!d) return;
  box.scrollTo({
    top: box.scrollTop + d,
    behavior: env.reduced ? "auto" : "smooth"
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
    label = document.createElement("span");
    label.className = "ph-label";
    label.setAttribute("aria-hidden", "true");
    head.prepend(label);
  }
  const eyebrow = panelBody.querySelector(".p-eyebrow"),
    title = panelBody.querySelector("h2");
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
  // New content starts unscrolled-looking until the reader scrolls it.
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
  const items = G.members.map(id => {
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
      <div class="panel-actions xrepo">${paths.map(p => `<button type="button" class="panel-action" data-files-path="${attr(p)}" aria-label="${attr(env.t("showInFiles", { path: p }))}"><span class="mono">${p}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button>`).join("")}</div>` : "";

  panelHTML(`
      <div class="p-eyebrow">${catName(n.cat)}${n.art ? env.t("fileSuffix") : ""}</div>
      <h2>${state.viewMode === "tools" ? n.tool : n.concept}</h2>
      <p class="p-sub">${state.viewMode === "tools" ? n.concept : n.tool}</p>
      <div class="p-chips"><span class="pchip">${env.t("nodeBuildStep", {step: n.step, total: model.WEEKS.length - 1})}</span></div>
      <h3>${env.t("what")}</h3><p>${n.what}</p>
      <h3>${env.t("why")}</h3><p>${n.why}</p>
      ${decision}
      <h3>${env.t("tools")}</h3><p class="toolline">${n.tools}</p>
      ${repo}
      ${look}
    `, n.cat);
  const b = document.getElementById("lookInside");
  if (b) env.scope.listen(b, "click", () => openInside(id));
  panelBody.querySelectorAll("[data-files-path]").forEach(el => env.scope.listen(el, "click", () => act.openFiles(el.dataset.filesPath)));
  openPanel();
}

function renderWeek(w) {
  const d = model.WEEKS[w];
  const items = d.nodes.map(id => {
    const n = scene.nodeEls[id].def;
    return `<li><strong>${n.concept}</strong>: ${n.tool}</li>`;
  }).join("");
  panelHTML(`
      <div class="p-eyebrow">${env.t("buildStepTitle", {step: w, total: model.WEEKS.length - 1})}</div>
      <h2>${d.title}</h2>
      <p style="margin-top:8px">${d.text}</p>
      <h3>${env.t("newNodes")}</h3><ul class="newlist">${items}</ul>
      <h3>${env.t("decision")}</h3><div class="decision">${d.decision}</div>
      <h3>${env.t("runnable")}</h3><pre class="cmd"><code>${d.runnable}</code></pre>
      <p class="p-note">${env.t("buildNote")}</p>
    `, model.definition.settings.buildRole);
  openPanel();
}

/* The panel's own buttons. "Back to the map" goes through act.closeInside, which also closes the
   files view. Closing lives on the panel's own ✕ (the drawer's in full screen); reopening lives on
   the crumbbar's "Show panel", which only exists while the panel is closed. */
controls.label(document.getElementById("insideBack"), env.t("backToMap"), "back");
env.scope.listen(document.getElementById("insideBack"), "click", act.closeInside);
env.scope.listen(document.getElementById("drawerClose"), "click", closePanel);
env.scope.listen(document.getElementById("panelClose"), "click", closePanel);
/* The close strip turns opaque only once its card has scrolled. */
[panel, drawer].forEach(box => {
  if (box.querySelector(":scope > .panelhead")) env.scope.listen(box, "scroll", () => syncPanelHead(box), {
    passive: true
  });
});
env.scope.listen(panelBtn, "click", openPanel);

return { openInside, closeInside, openPanel, closePanel, panelIsOpen, revealInPanel, syncPanelHead, catName, panelHTML, renderL0, renderOverview, renderGroup, renderNode, renderWeek };
}
