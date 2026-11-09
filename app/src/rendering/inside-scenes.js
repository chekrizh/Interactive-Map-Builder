/* Structured close-ups ("inside" scenes) built from data instead of hand-drawn SVG.
   kind "steps":  a walkthrough of one component's main code path, with early exits.
   kind "schema": the tables (or cache keys) of a data store and how they refer to each other.
   Text fields are authored, trusted markup like every other text in the definition. */

const attr = value => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** "path/file.js:466-471" -> link to that range at the pinned commit, labelled "file.js:466". */
function codeLink(ref, source) {
  if (!ref) return "";
  const [path, lines = ""] = String(ref).split(":");
  const [from, to] = lines.split("-");
  const label = path.split("/").pop() + (from ? ":" + from : "");
  if (!source?.repo) return `<span class="ins-code">${label}</span>`;
  const anchor = from ? `#L${from}${to ? "-L" + to : ""}` : "";
  const href = `${source.repo.replace(/\/$/, "")}/blob/${source.ref || "HEAD"}/${path}${anchor}`;
  return `<a class="ins-code" href="${attr(href)}" target="_blank" rel="noopener" title="${attr(path + (lines ? ":" + lines : ""))}">${label}</a>`;
}

function steps(scene, source) {
  const items = scene.steps.map((s, i) => {
    const exit = s.exit ? `<div class="ins-exit"><span class="ins-when">${s.exit.when || ""}</span>` +
      `<div class="ins-exit-card"><div class="ins-t">${s.exit.t}</div>${s.exit.code ? codeLink(s.exit.code, source) : ""}</div></div>` : "";
    return `<li class="ins-step${s.async ? " is-async" : ""}${i === scene.steps.length - 1 ? " is-last" : ""}">` +
      `<div class="ins-card"><span class="ins-n">${i + 1}</span><div class="ins-main"><div class="ins-t">${s.t}</div>` +
      (s.d ? `<div class="ins-d">${s.d}</div>` : "") + codeLink(s.code, source) + `</div></div>${exit}</li>`;
  }).join("");
  return `<ol class="ins-steps">${items}</ol>`;
}

function schema(scene, source) {
  const cards = scene.tables.map(t => {
    const fields = (t.fields || []).map(f => `<li><span class="ins-f">${f.n}</span>` +
      (f.type ? `<span class="ins-type">${f.type}</span>` : "") +
      (f.ref ? `<span class="ins-ref" data-ref="${attr(f.ref)}">→ ${f.ref}</span>` : "") +
      (f.note ? `<span class="ins-fnote">${f.note}</span>` : "") + `</li>`).join("");
    return `<section class="ins-table" data-table="${attr(t.name)}"><header><span class="ins-name">${t.name}</span>` +
      (t.ttl ? `<span class="ins-ttl">${t.ttl}</span>` : "") + `</header>` +
      (t.note ? `<p class="ins-note">${t.note}</p>` : "") + (fields ? `<ul>${fields}</ul>` : "") +
      (t.code ? `<footer>${codeLink(t.code, source)}</footer>` : "") + `</section>`;
  }).join("");
  return `<div class="ins-schema">${cards}</div>`;
}

export const INSIDE_KINDS = ["steps", "schema"];

export function renderInsideScene(scene, source) {
  const body = scene.kind === "steps" ? steps(scene, source) : schema(scene, source);
  return `<div class="ins ins--${scene.kind}">${body}</div>`;
}

/** Hovering a reference lights up the table it points to. */
export function wireInsideScene(root) {
  root.querySelectorAll(".ins-ref").forEach(ref => {
    const target = root.querySelector(`.ins-table[data-table="${CSS.escape(ref.dataset.ref)}"]`);
    if (!target) return;
    ref.addEventListener("mouseenter", () => target.classList.add("is-lit"));
    ref.addEventListener("mouseleave", () => target.classList.remove("is-lit"));
  });
}
