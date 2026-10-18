export function viewportHeight() {
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

export function bindViewport(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  window.addEventListener("resize", listener);
  window.visualViewport?.addEventListener("resize", listener);
  window.visualViewport?.addEventListener("scroll", listener);
  return () => {
    window.removeEventListener("scroll", listener);
    window.removeEventListener("resize", listener);
    window.visualViewport?.removeEventListener("resize", listener);
    window.visualViewport?.removeEventListener("scroll", listener);
  };
}

export function watchScrollFades(root: ParentNode = document) {
  const nodes = [...root.querySelectorAll<HTMLElement>(".scroll-fade")];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("is-in"));
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
  );

  const observe = () => nodes.forEach((node) => observer.observe(node));
  const frame = window.requestAnimationFrame(observe);
  return () => {
    window.cancelAnimationFrame(frame);
    observer.disconnect();
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
