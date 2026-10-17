import { useEffect, useLayoutEffect, useRef } from "react";
import { assets } from "../content/site";

const FILL_DELAY_MS = 550;
const FILL_MS = 1050;
const HOLD_MS = 180;
const FILL_DONE_MS = FILL_DELAY_MS + FILL_MS + HOLD_MS;
const DOT_FADE_MS = 280;
const EXPAND_MS = 1700;

export function IntroLoader({ onDone }: { onDone: () => void }) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shellRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const openingRef = useRef(false);
  const fitRef = useRef<() => void>(() => undefined);

  useLayoutEffect(() => {
    if (reduce) return;
    const word = wordRef.current;
    const shell = shellRef.current;
    if (!word || !shell) return;

    const placePhoto = () => {
      const period = word.querySelector<HTMLElement>(".loader-outline .loader-period");
      const photo = dotRef.current;
      if (!period || !photo) return;
      const wordBox = word.getBoundingClientRect();
      const periodBox = period.getBoundingClientRect();
      photo.style.left = `${periodBox.left - wordBox.left}px`;
      photo.style.top = `${periodBox.top - wordBox.top}px`;
      photo.style.width = `${periodBox.width}px`;
      photo.style.height = `${periodBox.height}px`;
    };

    const fit = () => {
      if (openingRef.current) return;
      const line = word.querySelector<HTMLElement>(".loader-outline");
      if (!line) return;
      const shellStyle = getComputedStyle(shell);
      const padX = parseFloat(shellStyle.paddingLeft) + parseFloat(shellStyle.paddingRight);
      const padY = parseFloat(shellStyle.paddingTop) + parseFloat(shellStyle.paddingBottom);
      const available = Math.max(64, shell.clientWidth - padX - 24);
      const availableH = Math.max(48, shell.clientHeight - padY - 24);
      word.style.fontSize = "100px";
      const needed = line.getBoundingClientRect().width;
      let size = Math.min(176, (100 * available) / Math.max(needed, 1));
      word.style.fontSize = `${size}px`;
      const used = line.getBoundingClientRect().width;
      if (used > available) {
        size = (size * available) / used;
        word.style.fontSize = `${size}px`;
      }
      const height = line.getBoundingClientRect().height;
      if (height > availableH) word.style.fontSize = `${(size * availableH) / height}px`;
      placePhoto();
    };

    fitRef.current = fit;
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, [reduce]);

  useEffect(() => {
    const lockedY = window.scrollY;
    document.documentElement.classList.add("is-loader-locked");
    document.body.classList.add("is-loader-locked");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const unlock = () => {
      document.documentElement.classList.remove("is-loader-locked");
      document.body.classList.remove("is-loader-locked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, lockedY);
    };

    if (reduce) {
      unlock();
      onDone();
      return;
    }

    let cancelled = false;
    let timer = 0;
    const dot = dotRef.current;
    const shell = shellRef.current;
    const word = wordRef.current;

    const begin = async () => {
      try {
        await document.fonts.load('600 100px "Geom Graphic"');
      } catch {
        /* show the fallback only if the brand font never arrives */
      }
      if (cancelled || !word) return;
      fitRef.current();
      word.classList.add("is-ready");
      timer = window.setTimeout(open, FILL_DONE_MS);
    };

    const open = () => {
      if (cancelled || !dot || !shell || !word) return;
      openingRef.current = true;
      shell.classList.add("is-opening");

      const from = dot.getBoundingClientRect();
      const to = shell.getBoundingClientRect();
      dot.style.position = "fixed";
      dot.style.inset = "auto";
      dot.style.margin = "0";
      dot.style.zIndex = "5";
      const parked = {
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        borderRadius: "22%",
      };

      const fade = dot.animate([{ ...parked, opacity: 0 }, { ...parked, opacity: 1 }], {
        duration: DOT_FADE_MS,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        fill: "forwards",
      });

      fade.finished
        .then(() => {
          if (cancelled) return;
          word.querySelectorAll<HTMLElement>(".loader-period").forEach((period) => {
            period.style.opacity = "0";
          });
          return dot.animate(
            [
              { ...parked, opacity: 1 },
              {
                left: `${to.left}px`,
                top: `${to.top}px`,
                width: `${to.width}px`,
                height: `${to.height}px`,
                borderRadius: "0px",
                opacity: 1,
              },
            ],
            {
              duration: EXPAND_MS,
              easing: "cubic-bezier(0.76, 0, 0.18, 1)",
              fill: "forwards",
            },
          ).finished;
        })
        .then(() => {
          if (cancelled) return;
          window.setTimeout(() => {
            if (!cancelled) {
              unlock();
              onDone();
            }
          }, 180);
        })
        .catch(() => undefined);
    };

    void begin();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      dot?.getAnimations().forEach((animation) => animation.cancel());
      unlock();
    };
  }, [onDone, reduce]);

  if (reduce) return null;

  return (
    <div
      ref={shellRef}
      className="loader-shell fixed inset-0 z-[200] flex h-dvh w-full items-center justify-center overflow-hidden bg-blue"
      role="status"
      aria-label="Loading BM PISOS."
    >
      <div ref={wordRef} className="loader-word">
        <span className="loader-line loader-outline">
          <span className="loader-letters">BM PISOS</span>
          <span className="loader-period" />
        </span>
        <span className="loader-line loader-solid" aria-hidden="true">
          <span className="loader-letters">BM PISOS</span>
          <span className="loader-period is-fill" />
        </span>
        <span
          ref={dotRef}
          className="loader-photo"
          style={{ backgroundImage: `url(${assets.hero})` }}
        >
          <span className="loader-dot-shade" />
        </span>
      </div>
    </div>
  );
}
