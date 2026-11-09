import './style.css';

const root = document.getElementById('app');
const THEME_KEY = 'pretty-text-theme';

async function loadContent() {
  const raw = document.getElementById('page-content')?.textContent.trim();
  if (raw) return JSON.parse(raw);
  // A built template is always filled by render.py; only dev reads src/content.json.
  if (import.meta.env.MODE === 'template') throw new Error('This page has no content. Fill it with scripts/render.py.');
  return (await import('./content.json')).default;
}

// Storage is blocked in some sandboxes and private windows; the page must work without it.
const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* forget */ } },
};

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.filter(child => child != null));
  return node;
}

function render(content) {
  const html = document.documentElement;
  const sections = content.sections;
  let current = 0;
  document.title = content.title;
  html.lang = content.lang || 'en';

  const themeButton = el('button', { type: 'button', className: 'btn' });
  const setTheme = theme => {
    html.dataset.theme = theme;
    themeButton.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
  };
  themeButton.onclick = () => {
    const theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    store.set(THEME_KEY, theme);
  };
  setTheme(store.get(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  const chip = el('span', { className: 'chip' });
  const heading = el('h2');
  const body = el('div', { className: 'body' });
  const back = el('button', { type: 'button', className: 'btn', textContent: 'Back', onclick: () => show(current - 1) });
  const next = el('button', { type: 'button', className: 'btn primary', textContent: 'Next', onclick: () => show(current + 1) });
  const links = sections.map((section, index) => el('button', { type: 'button', onclick: () => show(index) },
    el('span', { className: 'num', textContent: String(index + 1).padStart(2, '0') }), section.heading));

  function show(index) {
    current = Math.max(0, Math.min(sections.length - 1, index));
    const section = sections[current];
    chip.textContent = `Section ${current + 1} of ${sections.length}`;
    heading.textContent = section.heading;
    body.replaceChildren(
      ...(section.paragraphs || []).map(text => el('p', { textContent: text })),
      ...(section.points?.length ? [el('ul', {}, ...section.points.map(text => el('li', { textContent: text })))] : []),
    );
    back.disabled = current === 0;
    next.disabled = current === sections.length - 1;
    links.forEach((link, i) => i === current ? link.setAttribute('aria-current', 'step') : link.removeAttribute('aria-current'));
  }

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
  });

  const live = el('div', {}, el('div', { className: 'stage' }, chip, heading), body);
  live.setAttribute('aria-live', 'polite');
  root.replaceChildren(el('div', { className: 'page' },
    el('header', { className: 'topbar' }, el('span', { className: 'eyebrow', textContent: content.eyebrow || '' }), themeButton),
    el('h1', { textContent: content.title }),
    content.lede ? el('p', { className: 'lede', textContent: content.lede }) : null,
    el('main', { className: 'layout' },
      el('article', { className: 'card' }, live,
        el('div', { className: 'foot' }, el('span', { className: 'keys', textContent: 'Use ← → to move' }), back, next)),
      el('nav', { className: 'panel', ariaLabel: 'Contents' },
        el('h3', { textContent: 'Contents' }),
        el('ol', { className: 'outline' }, ...links.map(link => el('li', {}, link)))),
    ),
  ));
  show(0);
}

try {
  render(await loadContent());
} catch (error) {
  // Shown on the page so a broken render is visible in any preview, not only in the console.
  root.replaceChildren(el('pre', { className: 'error', textContent: `Could not show this page.\n${error.message}` }));
  console.error(error);
}
