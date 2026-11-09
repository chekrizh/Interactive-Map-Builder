/** Owns side effects for one mounted tool. No global monkey patches. */
export function createLifecycle() {
  let active = true;
  const abort = new AbortController();
  const frames = new Set(), timers = new Set(), observers = new Set(), animations = new Set();
  const pending = new Set();
  const api = {
    cancellable(executor) {
      if (!active) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const finish = value => { pending.delete(finish); resolve(value); };
        pending.add(finish);
        try { executor(finish); } catch (error) { pending.delete(finish); reject(error); }
      });
    },
    listen(target, event, listener, options) {
      if (!active) return;
      target.addEventListener(event, listener, { ...(typeof options === 'boolean' ? { capture: options } : options), signal: abort.signal });
    },
    frame(callback) {
      if (!active) return 0;
      const id = requestAnimationFrame(time => { frames.delete(id); if (active) callback(time); });
      frames.add(id); return id;
    },
    cancelFrame(id) { cancelAnimationFrame(id); frames.delete(id); },
    timeout(callback, delay) {
      if (!active) return 0;
      const id = setTimeout(() => { timers.delete(id); if (active) callback(); }, delay);
      timers.add(id); return id;
    },
    clearTimeout(id) { clearTimeout(id); timers.delete(id); },
    ResizeObserver: class {
      constructor(callback) { this.observer = new ResizeObserver((...args) => { if (active) callback(...args); }); observers.add(this.observer); }
      observe(...args) { this.observer.observe(...args); }
      disconnect() { this.observer.disconnect(); observers.delete(this.observer); }
    },
    animate(element, keyframes, options) {
      const animation = element.animate(keyframes, options); animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      if (!active) animation.cancel();
      return animation;
    },
    destroy() {
      active = false; abort.abort(); frames.forEach(cancelAnimationFrame); timers.forEach(clearTimeout);
      observers.forEach(observer => observer.disconnect()); animations.forEach(animation => animation.cancel());
      pending.forEach(finish => finish());
      frames.clear(); timers.clear(); observers.clear(); animations.clear();
    },
  };
  return api;
}

/** Queries are scoped to the mount; browser fullscreen/focus APIs retain the real document. */
export function scopedDocument(root) {
  return new Proxy(document, {
    get(target, name) {
      if (name === 'getElementById') return id => root.querySelector(`[id="${CSS.escape(id)}"]`);
      if (name === 'querySelector') return selector => root.querySelector(selector);
      if (name === 'querySelectorAll') return selector => root.querySelectorAll(selector);
      const value = Reflect.get(target, name, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}
