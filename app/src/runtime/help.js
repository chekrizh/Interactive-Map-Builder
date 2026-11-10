/** Help: what each way into the map is for, in one place (2026-11-10).
    The "?" button beside the theme switch opens a short card, one line per
    mode the map actually has (a question a reader might ask, then where to
    go); each line also opens its mode. The same lines show as hover hints
    on the controls themselves, so the two never disagree. All text comes
    from `ui` (help*), so a map can reword it. */

/* The neighbours' functions help calls (through act). */
export const NEEDS = ["showLevel", "hasFiles"];

export function createHelp({ env, model, state, act }) {
  const doc = env.document;
  const btn = doc.getElementById("helpBtn");
  const pop = doc.getElementById("helpPop");
  const list = doc.getElementById("helpList");
  if (!btn || !pop || !list) return { close() {} };

  const flowControls = doc.getElementById("flowControls");
  const flowPicker = doc.getElementById("flowPicker");
  const buildStart = () => doc.querySelector('#weekSeg button[data-w="1"]');
  const tourBtn = doc.getElementById("tourBtn");
  const toL0 = doc.getElementById("toL0");
  const t = env.t;
  const hasInsides = Object.keys(model.INSIDES || {}).length > 0;
  const modes = [
    {
      ask: t("helpTourAsk"), text: t("helpTour"),
      shown: () => (model.definition.tour || []).length > 0, go: () => tourBtn.click(), at: [tourBtn]
    },
    {
      ask: t("helpOverviewAsk"), text: t("helpOverview"),
      shown: () => true, go: () => { if (state.level !== 0) toL0.click(); }
    },
    {
      ask: t("helpMapAsk"), text: t("helpMap") + (hasInsides ? " " + t("helpMapInside") : ""),
      shown: () => true,
      go: () => {
        if (state.level === 1) return;
        const full = doc.getElementById("gofull");
        if (full) full.click(); else act.showLevel(1);
      }
    },
    {
      ask: t("helpFlowAsk"), text: t("helpFlow"),
      shown: () => !flowControls.hidden,
      go: () => { flowPicker.open = true; flowPicker.querySelector("summary").focus(); },
      at: [flowPicker.querySelector("summary")]
    },
    {
      ask: t("helpFilesAsk"), text: t("helpFiles"),
      shown: () => act.hasFiles(), go: () => doc.getElementById("filesBtn").click(),
      at: [doc.getElementById("filesBtn")]
    },
    {
      ask: t("helpBuildAsk"), text: t("helpBuild"),
      shown: () => Boolean(buildStart()), go: () => buildStart().click(),
      at: [doc.querySelector(".build-controls .clabel"), doc.querySelector('#weekSeg button[data-w="0"]')]
    }
  ].filter(m => m.shown());

  modes.forEach(m => {
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
  env.scope.listen(btn, "click", () => (pop.hidden ? open() : close()));
  env.scope.listen(doc, "pointerdown", e => {
    if (!pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) close();
  });
  for (const el of [btn, pop]) {
    env.scope.listen(el, "keydown", e => {
      if (e.key !== "Escape" || pop.hidden) return;
      e.stopPropagation();
      close(true);
    });
  }

  /* Hover hints: the same question and answer under the control, after a
     short pause so passing the mouse over the toolbar stays quiet. Mouse
     and keyboard focus only; a tap goes straight to the control. */
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
  modes.forEach(m => (m.at || []).filter(Boolean).forEach(el => {
    env.scope.listen(el, "pointerenter", e => {
      if (e.pointerType !== "mouse" || flowPicker.open || !pop.hidden) return;
      env.clearTimeout(timer);
      timer = env.setTimeout(() => showTip(m, el), 450);
    });
    env.scope.listen(el, "focus", () => {
      if (el.matches(":focus-visible") && !flowPicker.open) showTip(m, el);
    });
    for (const ev of ["pointerleave", "blur", "pointerdown", "click"]) env.scope.listen(el, ev, hideTip);
  }));

  return { close };
}
