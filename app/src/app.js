import template from './template.html?raw';
import { mountEngine } from './runtime/engine.js';
import { prepareDefinition, renderShell, roleStyles } from './runtime/definition.js';

let mounted = false;
/** Mount one document-level tool. SVG ids/fullscreen/styles require a single active instance per document. */
export async function mount(root, definition) {
  if (mounted) throw new Error('Destroy the current tool before mounting another in this document.');
  mounted = true;
  const html = document.documentElement;
  const previous = { classes: html.className, theme: html.getAttribute('data-theme'), title: document.title };
  try {
    const prepared = prepareDefinition(definition);
    root.innerHTML = renderShell(template, prepared);
    document.title = prepared.page.title;
    const style = document.createElement("style");
    style.textContent = roleStyles(prepared);
    root.prepend(style);
    // prepareLayout mutates measured geometry; each mount must start with a fresh definition.
    const controller = await mountEngine(root, prepared);
    let destroyed = false;
    return {
      ...Object.fromEntries(Object.entries(controller).map(([name, action]) => [name, (...args) => {
        if (destroyed) throw new Error('This tool instance has been destroyed.');
        return action(...args);
      }])),
      destroy() {
        if (destroyed) return;
        destroyed = true;
        controller.destroy();
        html.className = previous.classes;
        document.title = previous.title;
        if (previous.theme === null) html.removeAttribute('data-theme'); else html.dataset.theme = previous.theme;
        mounted = false;
      },
    };
  } catch (error) {
    mounted = false; root.replaceChildren();
    document.title = previous.title; html.className = previous.classes;
    if (previous.theme === null) html.removeAttribute("data-theme"); else html.dataset.theme = previous.theme;
    throw error;
  }
}
