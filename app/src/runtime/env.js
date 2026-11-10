import { createLifecycle, scopedDocument } from './lifecycle.js';
import { formatText } from './definition.js';

/** What the page gives every module: the scoped document, listeners and timers that are cleaned
 *  up on destroy, interface strings, media queries and storage. Read only. */
export function createEnv(root, definition) {
  const scope = createLifecycle();
  return {
    scope,
    document: scopedDocument(root),
    requestAnimationFrame: scope.frame,
    cancelAnimationFrame: scope.cancelFrame,
    setTimeout: scope.timeout,
    clearTimeout: scope.clearTimeout,
    ResizeObserver: scope.ResizeObserver,
    format: formatText,
    /* An interface string from definition.ui, with {name} filled in. */
    t: (key, values = {}) => formatText(definition.ui[key] ?? key, values),
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    phoneQuery: window.matchMedia("(max-width: 640px)"),
    wideQuery: window.matchMedia("(min-width: 981px)"),
    /* A page parameter from the hash or the query string. */
    param(key) {
      const fromHash = new URLSearchParams(location.hash.slice(1)).get(key);
      return fromHash || new URLSearchParams(location.search).get(key);
    },
    /* Storage never throws: private modes and blocked storage just forget. */
    store: {
      get(key) {
        try {
          return localStorage.getItem(key);
        } catch (err) {
          return null;
        }
      },
      set(key, value) {
        try {
          localStorage.setItem(key, value);
        } catch (err) {}
      }
    }
  };
}
