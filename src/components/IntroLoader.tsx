import { useEffect, useLayoutEffect, useRef } from "react";
import { assets } from "../content/site";

const FILL_DELAY_MS = 550;
const FILL_MS = 1050;
const HOLD_MS = 180;
const FILL_DONE_MS = FILL_DELAY_MS + FILL_MS + HOLD_MS;
const DOT_FADE_MS = 280;
const EXPAND_MS = 1700;
const FONT_WAIT_MS = 900;
const HARD_STOP_MS = 6500;

export function IntroLoader({ onDone }: { onDone: () => void }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const openingRef = useRef(false);
  const fitRef = useRef<() => void>(() => undefined);
  const finishedRef = useRef(false);

  useLayoutEffect(() => {
    const word = wordRef.current;
    const shell = shellRef.current;
    if (!word || !shell) return;

    const pinShell = () => {
      const visual = window.visualViewport?.height ?? 0;
      const inner = window.innerHeight || document.documentElement.clientHeight || 0;
      const height = visual >= 200 ? visual : inner;
      if (height < 200) return;
      shell.style.top = "0px";
      shell.style.bottom = "auto";
      shell.style.height = `${Math.round(height)}px`;
    };

    const placePhoto = () => {
      const period = word.querySelector<HTMLElement>(".loader-outline .loader-period");
      const photo = dotRef.current;
      if (!period || !photo) return;
      const wordBox = word.getBoundingClientRect();
      const periodBox = period.getBoundingClientRect();
      photo.style.left = `${periodBox.left - wordBox.left}px`;
      photo.style.top = `${periodBox.top - wordBox.top}px`;
      photo.style.width = `${Math.max(periodBox.width, 1)}px`;
      photo.style.height = `${Math.max(periodBox.height, 1)}px`;
    };

    const fit = () => {
      if (openingRef.current) return;
      pinShell();
      const line = word.querySelector<HTMLElement>(".loader-outline");
      if (!line) return;
      const shellStyle = getComputedStyle(shell);
      const padX = (parseFloat(shellStyle.paddingLeft) || 0) + (parseFloat(shellStyle.paddingRight) || 0);
      const padY = (parseFloat(shellStyle.paddingTop) || 0) + (parseFloat(shellStyle.paddingBottom) || 0);
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
    fit();
    word.classList.add("is-shown");
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("is-loader-locked");
    document.body.classList.add("is-loader-locked");

    const unlock = () => {
      document.documentElement.classList.remove("is-loader-locked");
      document.body.classList.remove("is-loader-locked");
      window.scrollTo(0, 0);
    };

    const complete = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      unlock();
      onDone();
    };

    let cancelled = false;
    let timer = 0;
    let watchdog = 0;
    const hardStop = window.setTimeout(complete, HARD_STOP_MS);
    const dot = dotRef.current;
    const shell = shellRef.current;
    const word = wordRef.current;

    const begin = async () => {
      const fontLoad = document.fonts?.load
        ? document.fonts.load('600 100px "Geom Graphic"').catch(() => undefined)
        : Promise.resolve();
      await Promise.race([
        fontLoad,
        new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT_MS)),
      ]);
      if (cancelled || !word) return;
      fitRef.current();
      word.classList.remove("is-ready");
      void word.offsetWidth;
      word.classList.add("is-ready");
      timer = window.setTimeout(open, FILL_DONE_MS);
    };

    const open = () => {
      if (cancelled || finishedRef.current || !dot || !shell || !word) return;
      openingRef.current = true;
      shell.classList.add("is-opening");

      const finish = () => {
        window.clearTimeout(watchdog);
        window.setTimeout(complete, 180);
      };

      watchdog = window.setTimeout(finish, DOT_FADE_MS + EXPAND_MS + 700);

      try {
        const from = dot.getBoundingClientRect();
        const to = shell.getBoundingClientRect();
        dot.style.position = "fixed";
        dot.style.inset = "auto";
        dot.style.margin = "0";
        dot.style.zIndex = "5";
        const parked = {
          left: `${from.left}px`,
          top: `${from.top}px`,
          width: `${Math.max(from.width, 1)}px`,
          height: `${Math.max(from.height, 1)}px`,
          borderRadius: "22%",
        };

        const fade = dot.animate([{ ...parked, opacity: 0 }, { ...parked, opacity: 1 }], {
          duration: DOT_FADE_MS,
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          fill: "forwards",
        });

        const finished = fade.finished ?? Promise.resolve();
        finished
          .then(() => {
            if (cancelled || finishedRef.current) return;
            word.querySelectorAll<HTMLElement>(".loader-period").forEach((period) => {
              period.style.opacity = "0";
            });
            const expand = dot.animate(
              [
                { ...parked, opacity: 1 },
                {
                  left: `${to.left}px`,
                  top: `${to.top}px`,
                  width: `${Math.max(to.width, 1)}px`,
                  height: `${Math.max(to.height, 1)}px`,
                  borderRadius: "0px",
                  opacity: 1,
                },
              ],
              {
                duration: EXPAND_MS,
                easing: "cubic-bezier(0.76, 0, 0.18, 1)",
                fill: "forwards",
              },
            );
            return expand.finished ?? Promise.resolve();
          })
          .then(() => finish())
          .catch(() => finish());
      } catch {
        finish();
      }
    };

    void begin();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(watchdog);
      window.clearTimeout(hardStop);
      if (dot && typeof dot.getAnimations === "function") {
        dot.getAnimations().forEach((animation) => animation.cancel());
      }
      if (!finishedRef.current) unlock();
    };
  }, [onDone]);

  return (
    <div
      ref={shellRef}
      className="loader-shell z-[200] flex w-full items-center justify-center overflow-hidden bg-blue"
      role="status"
      aria-label="Loading BM PISOS."
    >
      <div ref={wordRef} className="loader-word is-shown">
        <span className="loader-line loader-outline">
          <span className="loader-letters">BM PISOS</span>
          <span className="loader-period" />
        </span>
        <span className="loader-line loader-solid" aria-hidden="true">
          <span className="loader-letters">BM PISOS</span>
          <span className="loader-period is-fill" />
        </span>
        <span ref={dotRef} className="loader-photo" style={{ backgroundImage: `url(${assets.hero})` }}>
          <span className="loader-dot-shade" />
        </span>
      </div>
    </div>
  );
}
