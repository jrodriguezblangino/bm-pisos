export function viewportHeight() {
  const visual = window.visualViewport?.height ?? 0;
  const inner = window.innerHeight || document.documentElement.clientHeight || 0;
  return Math.round(visual >= 200 ? visual : inner);
}

export function scrollTop() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function bindViewport(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  document.addEventListener("scroll", listener, { passive: true, capture: true });
  window.addEventListener("resize", listener);
  window.visualViewport?.addEventListener("resize", listener);
  window.visualViewport?.addEventListener("scroll", listener);
  return () => {
    window.removeEventListener("scroll", listener);
    document.removeEventListener("scroll", listener, { capture: true });
    window.removeEventListener("resize", listener);
    window.visualViewport?.removeEventListener("resize", listener);
    window.visualViewport?.removeEventListener("scroll", listener);
  };
}

export function watchScrollFades(root: ParentNode = document) {
  const nodes = [...root.querySelectorAll<HTMLElement>(".scroll-fade")];
  let observer: IntersectionObserver | null = null;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.01, rootMargin: "0px" },
    );
  } catch {
    nodes.forEach((node) => node.classList.add("is-in"));
    return () => undefined;
  }

  const active = observer;
  const observe = () => nodes.forEach((node) => active.observe(node));
  const frame = window.requestAnimationFrame(observe);
  return () => {
    window.cancelAnimationFrame(frame);
    active.disconnect();
  };
}

export function afterLoader(run: () => void) {
  if (!document.documentElement.classList.contains("hero-pending")) {
    const frame = window.requestAnimationFrame(run);
    return () => window.cancelAnimationFrame(frame);
  }

  let frame = 0;
  const start = () => {
    window.removeEventListener("bmp-loader-done", start);
    frame = window.requestAnimationFrame(run);
  };
  window.addEventListener("bmp-loader-done", start);
  return () => {
    window.removeEventListener("bmp-loader-done", start);
    window.cancelAnimationFrame(frame);
  };
}
