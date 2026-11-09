import './styles/map.css';
import './styles/ml-chrome.css';
import './styles/ml-canvas.css';
import './styles/ml-panel.css';
import './styles/local.css';
import { mount } from './app.js';

const root = document.getElementById('app');

/** A rendered page carries its map inline; dev shows a skill example (?map=fastapi-service). */
async function loadDefinition() {
  const inline = document.getElementById('map-definition')?.textContent.trim();
  if (inline) return JSON.parse(inline);
  if (import.meta.env.MODE === 'template') throw new Error('This page has no map. Fill it with scripts/render.py.');
  const name = new URLSearchParams(location.search).get('map') || 'ml-system';
  const response = await fetch(`/examples/${encodeURIComponent(name)}.json`);
  if (!response.ok) throw new Error(`Example map not found (HTTP ${response.status}).`);
  return response.json();
}

try {
  const controller = await mount(root, await loadDefinition());
  // Stable embedding/debug contract; no external services or tracking.
  window.mapViewer = controller;
  if (import.meta.hot) import.meta.hot.dispose(() => controller.destroy());
} catch (error) {
  // Shown on the page so a broken map is visible in any preview, not only in the console.
  root.replaceChildren(Object.assign(document.createElement('pre'), {
    className: 'map-error',
    textContent: `This map could not be shown.\n${error.message}`,
  }));
  console.error(error);
}
