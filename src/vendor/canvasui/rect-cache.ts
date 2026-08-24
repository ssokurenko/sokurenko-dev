/**
 * Upstream's Peel imports this helper but the Canvas UI registry does not
 * ship it — `/r/rect-cache.json` is a 404 and it appears nowhere in the
 * 210-item registry index. So it is ours. See ./README.md.
 *
 * Peel reads `.current` on every `pointermove`. Calling
 * getBoundingClientRect() there would force a synchronous layout on each
 * event, so the rect is cached and only recomputed when something that can
 * actually move the element happens: it resizes, an ancestor scrolls, or the
 * viewport changes.
 */
export interface RectCache {
  /** Last known viewport-relative box of the observed element. */
  readonly current: DOMRect;
  /** Detach every observer and listener. */
  destroy: () => void;
}

export function createRectCache(element: HTMLElement): RectCache {
  let rect = element.getBoundingClientRect();

  const update = () => {
    rect = element.getBoundingClientRect();
  };

  // ResizeObserver fires once on observe(), which also covers the case where
  // the element has not been laid out yet at construction time.
  const observer = new ResizeObserver(update);
  observer.observe(element);

  // Capture phase so scrolling inside any ancestor counts, not just the
  // document — scroll events from elements do not bubble.
  const scrollOptions: AddEventListenerOptions = { passive: true, capture: true };
  window.addEventListener('scroll', update, scrollOptions);
  window.addEventListener('resize', update, { passive: true });

  return {
    get current() {
      return rect;
    },
    destroy() {
      observer.disconnect();
      window.removeEventListener('scroll', update, scrollOptions);
      window.removeEventListener('resize', update);
    },
  };
}
