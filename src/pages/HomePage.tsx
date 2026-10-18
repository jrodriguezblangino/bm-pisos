import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon, Button, SlideLabel } from "../components/Button";
import { IntroLoader } from "../components/IntroLoader";
import {
  assets,
  brand,
  capabilities,
  imageCredit,
  principles,
  projects,
  publicUrl,
  services,
  stats,
} from "../content/site";
import { afterLoader, bindViewport, viewportHeight, watchScrollFades } from "../viewport";

const clients = [
  { src: publicUrl("logos/ypf-logo.svg"), alt: "YPF", height: "h-10" },
  { src: publicUrl("logos/shell.svg"), alt: "Shell", height: "h-[2.15rem]" },
  { src: publicUrl("logos/libertad.svg"), alt: "Hiper Libertad", height: "h-11" },
  {
    src: publicUrl("logos/escuela.png"),
    alt: "Instituto Parroquial Bernardo D'Elía, Centro Parroquial Margarita A. de Paz",
    height: "h-12",
  },
  { src: publicUrl("logos/vcp.png"), alt: "Municipalidad de Villa Carlos Paz", height: "h-12" },
];

function scopeFrame(index: number, pos: number, compact: boolean) {
  const distance = Math.max(-1.2, Math.min(1.2, index - pos));
  const z = Math.round(30 - Math.abs(distance) * 10);
  if (compact) {
    if (distance <= -1) return { sx: 1, sy: 1, x: 0, y: -24, text: 0, image: 0, z };
    if (distance >= 1) return { sx: 1, sy: 1, x: 0, y: 16, text: 0, image: 0.4, z };
    if (distance < 0) {
      const t = -distance;
      return { sx: 1, sy: 1, x: 0, y: -24 * t, text: t < 0.12 ? 1 - t / 0.12 : 0, image: 1 - t, z };
    }
    const t = distance;
    return { sx: 1, sy: 1, x: 0, y: 16 * t, text: t < 0.12 ? 1 - t / 0.12 : 0, image: 1 - t * 0.6, z };
  }
  if (distance <= -1) return { sx: 0.2, sy: 0.15, x: -26, y: 0, text: 0, image: 0, z };
  if (distance >= 1) return { sx: 0.2, sy: 0.15, x: 107, y: 85, text: 0, image: 1, z };
  if (distance < 0) {
    const t = -distance;
    return {
      sx: 1 + (0.2 - 1) * t,
      sy: 1 + (0.15 - 1) * t,
      x: -26 * t,
      y: 0,
      text: t < 0.08 ? 1 - t / 0.08 : 0,
      image: 1 - t,
      z,
    };
  }
  const t = distance;
  return {
    sx: 0.2 + 0.8 * (1 - t),
    sy: 0.15 + 0.85 * (1 - t),
    x: 107 * t,
    y: 85 * t,
    text: t < 0.08 ? 1 - t / 0.08 : 0,
    image: 1,
    z,
  };
}

const careerClips = [
  { src: assets.pour },
  { src: assets.hall },
  { src: assets.hero },
];

function PlayMark({ paused = false, hidden = false }: { paused?: boolean; hidden?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={hidden ? "is-hidden" : ""}>
      <circle cx="32" cy="32" r="18" fill="currentColor" />
      {paused ? (
        <path d="M26 22h5v20h-5zm7 0h5v20h-5z" fill="#f4f1eb" />
      ) : (
        <path d="M25.334 44 44 32 25.334 20v24Z" fill="#f4f1eb" />
      )}
    </svg>
  );
}

function CareerStack() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const drag = useRef({ x: 0, dx: 0 });
  const total = careerClips.length;

  const go = (next: number) => {
    setIndex((next + total) % total);
    setPlaying(null);
  };

  return (
    <div
      className="career-stack"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        drag.current = { x: event.clientX, dx: 0 };
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) return;
        drag.current.dx = event.clientX - drag.current.x;
      }}
      onPointerUp={() => {
        if (drag.current.dx <= -48) go(index + 1);
        else if (drag.current.dx >= 48) go(index - 1);
      }}
    >
      {careerClips.map((clip, clipIndex) => {
        const depth = (clipIndex - index + total) % total;
        const shift = depth === 0 ? "0%" : depth === 1 ? "14.25%" : "27%";
        const lift = depth === 0 ? "0px" : depth === 1 ? "-100px" : "-200px";
        const isFront = depth === 0;
        const isOn = playing === clipIndex;
        return (
          <article
            key={clip.src}
            className={`career-card${isFront ? " is-front" : " is-back"}${depth === 2 ? " is-far" : ""}`}
            style={{ transform: `translate3d(${shift}, 0, ${lift})`, zIndex: 3 - depth }}
            onClick={() => {
              if (Math.abs(drag.current.dx) > 8 || isFront) return;
              go(clipIndex);
            }}
          >
            <img src={clip.src} alt={isFront ? imageCredit : ""} draggable={false} />
            <div className="career-shade" />
            <p className="career-count">
              [ {String(clipIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")} ]
            </p>
            <button
              type="button"
              className="career-play"
              aria-label={isOn ? `Pausar referencia ${clipIndex + 1} de ${total}` : `Reproducir referencia ${clipIndex + 1} de ${total}`}
              aria-pressed={isOn}
              onClick={(event) => {
                event.stopPropagation();
                if (!isFront) return;
                setPlaying(isOn ? null : clipIndex);
              }}
            >
              <PlayMark hidden={isOn} />
              <PlayMark paused hidden={!isOn} />
            </button>
          </article>
        );
      })}
    </div>
  );
}

function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(value);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    let frame = 0;
    let timer = 0;
    const tick = (start: number) => {
      const progress = Math.min(1, (performance.now() - start) / 2000);
      setShown(Math.round(value * progress));
      if (progress < 1) frame = window.requestAnimationFrame(() => tick(start));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timer = window.setTimeout(() => tick(performance.now()), 300);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <dt ref={ref} className="flex font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:text-[3rem]">
      <span>{shown}</span>
      {suffix ? <span>{suffix}</span> : null}
    </dt>
  );
}

function ClientMarquee() {
  return (
    <div className="overflow-hidden">
      <div className="marquee-track-slow flex w-max items-center">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex h-[3.4375rem] items-center">
            {clients.map((logo) => (
              <li key={`${logo.alt}-${copy}`} className="mx-[3.25rem] flex h-full shrink-0 items-center">
                <img src={logo.src} alt={copy === 0 ? logo.alt : ""} className={`${logo.height} w-auto max-w-none object-contain`} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const [capability, setCapability] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [workDrag, setWorkDrag] = useState(0);
  const [workDragging, setWorkDragging] = useState(false);
  const workDragRef = useRef({ active: false, x: 0, dx: 0 });
  const workMoved = useRef(false);
  const [showLoader, setShowLoader] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [scopePos, setScopePos] = useState(0);
  const [compactScope, setCompactScope] = useState(() => window.matchMedia("(max-width: 991px)").matches);
  const [reduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const heroRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const scopeTrackRef = useRef<HTMLDivElement>(null);
  const finishLoader = useCallback(() => {
    setShowLoader(false);
    const root = document.documentElement;
    root.classList.remove("hero-pending", "hero-ready");
    void root.offsetWidth;
    root.classList.add("hero-ready");
    window.dispatchEvent(new Event("bmp-loader-done"));
  }, []);

  useEffect(() => {
    const replay = () => {
      window.scrollTo(0, 0);
      document.documentElement.classList.add("hero-pending");
      document.documentElement.classList.remove("hero-ready");
      setShowLoader(true);
    };
    window.addEventListener("bmp-replay", replay);
    return () => window.removeEventListener("bmp-replay", replay);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.classList.add("hero-ready");
      return () => root.classList.remove("hero-ready", "hero-pending");
    }
    root.classList.add("hero-pending");
    root.classList.remove("hero-ready");
    return () => root.classList.remove("hero-pending", "hero-ready");
  }, []);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVideoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen]);
  const featured = projects.slice(0, 5);
  const finishWorkDrag = (width: number) => {
    const dx = workDragRef.current.dx;
    workDragRef.current.active = false;
    workMoved.current = Math.abs(dx) > 8;
    setWorkDragging(false);
    setWorkDrag(0);
    if (width <= 0) return;
    if (dx < -width * 0.18) setSlide((value) => Math.min(featured.length - 1, value + 1));
    else if (dx > width * 0.18) setSlide((value) => Math.max(0, value - 1));
  };

  useEffect(() => {
    const hero = heroRef.current;
    const sticky = stickyRef.current;
    const color = colorRef.current;
    const copy = copyRef.current;
    if (!hero || !sticky || !color || !copy) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector("header");

    const between = (progress: number, start: number, end: number, from: number, to: number) => {
      if (progress <= start) return from;
      if (progress >= end) return to;
      return from + ((to - from) * (progress - start)) / (end - start);
    };

    let target = 0;
    let shown = 0;
    let frame = 0;

    const apply = (progress: number) => {
      const full = viewportHeight();
      document.documentElement.style.setProperty("--vvh", `${full}px`);
      color.style.height = `${between(progress, 0.425, 0.6, 100, 0)}%`;
      sticky.style.height = `${between(progress, 0.7, 1, full, 0)}px`;
      copy.style.opacity = String(between(progress, 0.405, 0.425, 1, 0));
      copy.style.transform = `translate3d(0, ${between(progress, 0.405, 0.55, 0, 20)}em, 0)`;
      if (header) {
        if (window.matchMedia("(min-width: 992px)").matches) {
          const hidden = between(progress, 0.405, 0.41, 1, 0);
          const back = between(progress, 0.98, 1, 0, 1);
          header.style.opacity = String(progress < 0.98 ? hidden : back);
        } else {
          header.style.opacity = "";
        }
      }
    };

    const measure = () => {
      const viewport = viewportHeight();
      const top = hero.getBoundingClientRect().top + window.scrollY;
      const start = top - viewport;
      const end = top + hero.offsetHeight;
      const span = end - start;
      return span <= 0 ? 0 : Math.min(1, Math.max(0, (window.scrollY - start) / span));
    };

    const settle = () => {
      const delta = target - shown;
      if (Math.abs(delta) < 0.0004) {
        shown = target;
        apply(shown);
        frame = 0;
        return;
      }
      shown += delta * 0.1;
      apply(shown);
      frame = window.requestAnimationFrame(settle);
    };

    const onScroll = () => {
      if (reduce.matches) {
        color.style.height = "";
        sticky.style.height = "";
        copy.style.opacity = "";
        copy.style.transform = "";
        if (header) header.style.opacity = "";
        return;
      }
      target = measure();
      if (!frame) frame = window.requestAnimationFrame(settle);
    };

    target = measure();
    shown = target;
    apply(shown);
    const unbind = bindViewport(onScroll);
    window.addEventListener("bmp-loader-done", onScroll);
    return () => {
      unbind();
      window.removeEventListener("bmp-loader-done", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (header) header.style.opacity = "";
    };
  }, []);

  useEffect(() => {
    let stop = () => {};
    const cancelWait = afterLoader(() => {
      stop = watchScrollFades();
    });
    return () => {
      cancelWait();
      stop();
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 991px)");
    const sync = () => setCompactScope(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = scopeTrackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const steps = services.length - 1;
    let target = 0;
    let shown = 0;
    let frame = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - viewportHeight();
      const scrolled = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      const stops: Array<[number, number]> = [
        [0, 0],
        [0.12, 0],
        [0.32, 1],
        [0.4, 1],
        [0.58, 2],
        [0.66, 2],
        [1, steps],
      ];
      let pos = steps;
      for (let i = 1; i < stops.length; i += 1) {
        if (scrolled <= stops[i][0]) {
          const [start, from] = stops[i - 1];
          const [end, to] = stops[i];
          const span = end - start;
          pos = from + (to - from) * (span === 0 ? 1 : (scrolled - start) / span);
          break;
        }
      }
      return pos;
    };

    const settle = () => {
      const delta = target - shown;
      if (Math.abs(delta) < 0.002) {
        shown = target;
        setScopePos(shown);
        frame = 0;
        return;
      }
      shown += delta * 0.12;
      setScopePos(shown);
      frame = window.requestAnimationFrame(settle);
    };

    const onScroll = () => {
      target = measure();
      if (!frame) frame = window.requestAnimationFrame(settle);
    };

    target = measure();
    shown = target;
    setScopePos(shown);
    const unbind = bindViewport(onScroll);
    window.addEventListener("bmp-loader-done", onScroll);
    return () => {
      unbind();
      window.removeEventListener("bmp-loader-done", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {showLoader && <IntroLoader onDone={finishLoader} />}
      <section ref={heroRef} className="home-hero relative h-[150svh] bg-tan" aria-labelledby="hero-heading">
        <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden bg-tan">
          <div
            className="hero-fill pointer-events-none absolute inset-x-0 top-0 bg-cover bg-center bg-no-repeat grayscale contrast-110"
            style={{ backgroundImage: `url(${assets.hero})` }}
          />
          <div ref={colorRef} className="home-hero-plate pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden will-change-[height]">
            <div
              className="hero-fill absolute inset-x-0 top-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${assets.hero})` }}
            />
            <div className="hero-fill absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />
          </div>
          <div ref={copyRef} className="absolute inset-0 z-10">
            <div className="hero-copy mx-auto flex h-full w-full max-w-[1360px] flex-col items-center justify-center gap-6 px-4 pb-8 pt-[5.7rem] text-center text-tan md:gap-8 md:pt-28 lg:gap-64 lg:px-0 lg:pb-14 lg:pt-[13.5rem]">
              <h1 id="hero-heading" className="hero-title font-heading text-[clamp(2.35rem,12vw,3rem)] font-semibold uppercase leading-[1.2] md:text-[4rem] lg:text-[4.875rem]">
                <span className="block">Pisos para</span>
                obra exigente.
              </h1>
              <div className="hero-sub relative flex w-full flex-col items-center gap-6 lg:block">
                <p className="mx-auto max-w-[35.6875rem] font-body text-[1.25rem] leading-[1.5]">
                  {brand.description}
                </p>
                <button
                  type="button"
                  className="hero-video group relative mx-auto block h-[8.1875rem] w-[14.5625rem] overflow-hidden rounded-lg lg:absolute lg:right-0 lg:top-1/2 lg:mx-0 lg:h-[6.625rem] lg:w-[11.8125rem] lg:-translate-y-1/2"
                  aria-label="Reproducir video"
                  onClick={() => setVideoOpen(true)}
                >
                  <video
                    className="h-full w-full object-cover"
                    src={assets.heroVideo}
                    poster={publicUrl("media/hall.jpg")}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110">
                      <circle cx="32" cy="32" r="18" fill="#e04b12" />
                      <path d="M28 24.5v15l12-7.5-12-7.5Z" fill="#f4f1eb" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-tan pt-20 min-[768px]:pt-28" aria-labelledby="standard-heading">
        <div className="px-4 min-[768px]:px-6">
          <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-16">
            <div className="flex items-end justify-between max-[991px]:flex-col max-[991px]:items-start max-[991px]:gap-6">
              <div className="scroll-fade w-full max-w-[43.5rem]">
                <h2 id="standard-heading" className="w-full font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[768px]:text-[3.5rem] min-[992px]:text-[4rem]">
                  Treinta años en<br className="max-[767px]:hidden" /> el hormigón.
                </h2>
              </div>
              <div className="scroll-fade w-full min-[992px]:w-[27.3125rem] min-[992px]:shrink-0">
                <p className="w-full border-b border-[#532c1633] pb-6 text-[1.25rem] leading-[1.5]">
                  Tercera generación en el oficio. El piso se hace para el uso real: camiones, máquinas, mercadería o público.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] min-[992px]:gap-6">
              <img
                src={assets.floor}
                alt={imageCredit}
                className="scroll-fade scroll-fade-late aspect-square w-full rounded-lg object-cover min-[768px]:aspect-auto min-[768px]:h-[19.9219rem] min-[992px]:h-[26.5625rem]"
              />
              <img
                src={assets.pour}
                alt={imageCredit}
                className="scroll-fade scroll-fade-late aspect-square w-full rounded-lg object-cover min-[768px]:aspect-auto min-[768px]:h-[19.9219rem] min-[992px]:h-[26.5625rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-tan pb-[7.5rem] pt-16 min-[768px]:pb-36 min-[768px]:pt-20" aria-labelledby="trusted-heading">
        <h2 id="trusted-heading" className="scroll-fade text-center font-heading text-base font-semibold uppercase leading-6">
          Proyectos que confiaron en nosotros
        </h2>
        <div className="scroll-fade scroll-fade-late mb-14 mt-8 min-[768px]:mb-16">
          <ClientMarquee />
        </div>
        <div className="mx-auto max-w-[1360px] border-b border-[#532c1633]" />
      </section>

      <section className="relative -mb-20 pb-20 text-tan" aria-labelledby="all-in-heading">
        <div className="scroll-fade absolute inset-0">
          <img src={assets.yard} alt={imageCredit} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative mx-auto flex min-h-svh w-full max-w-[1360px] flex-col justify-end gap-16 px-4 min-[768px]:gap-24 min-[768px]:px-6 min-[992px]:px-0">
          <div className="scroll-fade flex flex-col items-start gap-6">
            <h2 id="all-in-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[768px]:text-[3.5rem]">
              El oficio,
              <br />
              en la obra.
            </h2>
            <p className="max-w-[43.625rem] text-[1.25rem] leading-[1.5]">
              No es solo alisar. Es dejar un piso que aguante el proyecto para el que fue pedido.
            </p>
          </div>
          <div className="grid min-h-[14em] items-start gap-6 [overflow-anchor:none] min-[768px]:grid-cols-2 min-[1200px]:grid-cols-4">
            {capabilities.map((item, index) => {
              const expanded = capability === index;
              return (
                <div
                  key={item.title}
                  className="scroll-fade scroll-fade-late overflow-hidden rounded-lg border border-black/10 bg-tan text-ink"
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setCapability(index);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setCapability((current) => (current === index ? null : current));
                  }}
                  onPointerUp={(event) => {
                    if (event.pointerType !== "touch") return;
                    setCapability(expanded ? null : index);
                  }}
                  onClick={(event) => {
                    if (event.detail !== 0) return;
                    setCapability(expanded ? null : index);
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-2 px-6 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange"
                    aria-expanded={expanded}
                    aria-controls={`capability-${index}`}
                  >
                    <span className="font-heading text-[1.125rem] font-semibold uppercase leading-[1.2] min-[768px]:text-2xl">{item.title}</span>
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center text-ink transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                      style={{ transform: expanded ? "rotate(-180deg)" : "rotate(0deg)" }}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 12 8" className="h-full w-full" fill="none">
                        <path opacity="0.5" d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                  <div id={`capability-${index}`} className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-4 text-base leading-6">{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-tan" aria-labelledby="scope-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 pt-20 min-[768px]:px-6 min-[768px]:pt-24 min-[992px]:px-0 min-[992px]:pt-28">
          <h2 id="scope-heading" className="scroll-fade text-center font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:text-[4.875rem]">
            Pisos de hormigón, según la obra
          </h2>
          <div className="mt-16 border-t border-[#532c1633]" aria-hidden="true" />
        </div>
        {reduceMotion ? (
          <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-16 px-4 py-16 min-[768px]:px-6 min-[992px]:px-0">
            {services.map((service) => (
              <article key={service.slug} className="grid items-center gap-8 min-[992px]:grid-cols-[23.25rem_minmax(0,1fr)_24.9rem] min-[992px]:gap-10">
                <div className="hidden min-[992px]:block" aria-hidden="true" />
                <img src={service.image} alt={service.imageAlt} className="aspect-[4/5] w-full rounded-lg object-cover min-[992px]:aspect-auto min-[992px]:h-[32rem]" />
                <div className="flex flex-col gap-5">
                  <p className="font-mono text-base text-[#898b8d]">[ {service.index}/04 ]</p>
                  <h3 className="font-heading text-2xl font-semibold uppercase leading-[1.2] min-[768px]:text-[2.5rem]">
                    <Link to={`/services?tab=${service.slug}`}>{service.title}</Link>
                  </h3>
                  <p className="text-[1.25rem] leading-[1.5]">{service.summary}</p>
                  {service === services[services.length - 1] && (
                    <Button href="/services" className="mt-8 w-fit">
                      Ver servicios
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
        <div ref={scopeTrackRef} className="scope-track relative h-[210vh]">
          <div className="sticky top-0 flex h-svh items-start overflow-x-clip pt-6 min-[992px]:pt-10">
            <div className="relative mx-auto h-[min(51.875rem,calc(100svh-5.5rem))] w-full max-w-[1360px] px-4 min-[768px]:px-6 min-[992px]:h-[min(51.875rem,calc(100svh-2.5rem))] min-[992px]:px-0">
              {services.map((service, index) => {
                const card = scopeFrame(index, scopePos, compactScope);
                return (
                  <article
                    key={service.slug}
                    className="scope-card absolute inset-x-4 grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6 min-[768px]:inset-x-6 min-[992px]:inset-x-0 min-[992px]:grid-cols-[23.25rem_minmax(0,1fr)_24.9rem] min-[992px]:grid-rows-1 min-[992px]:items-stretch min-[992px]:gap-10"
                    style={{ zIndex: card.z, pointerEvents: card.text > 0.4 ? "auto" : "none" }}
                  >
                    <div className="hidden min-[992px]:block" aria-hidden="true" />
                    <div
                      className="overflow-hidden rounded-lg"
                      style={{
                        transformOrigin: "0 0",
                        transform: `translate(${card.x}%, ${card.y}%) scale(${card.sx}, ${card.sy})`,
                        opacity: card.image,
                      }}
                    >
                      <img src={service.image} alt={service.imageAlt} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-5" style={{ opacity: card.text }}>
                      <p className="font-mono text-base tracking-[0.36em] text-[#898b8d]">[ {service.index}/04 ]</p>
                      <h3 className="font-heading text-2xl font-semibold uppercase leading-[1.2] min-[768px]:text-[2.5rem] min-[768px]:leading-[48px]">
                        <Link to={`/services?tab=${service.slug}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange">
                          {service.title}
                        </Link>
                      </h3>
                      <p className="text-[1.25rem] leading-[1.5]">{service.summary}</p>
                      {index === services.length - 1 && (
                        <Button href="/services" className="mt-3 w-fit">
                          Ver servicios
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </section>

      <section className="bg-tan" aria-labelledby="stats-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 py-16 min-[768px]:px-6 min-[992px]:px-0 min-[992px]:py-36">
          <div className="scroll-fade flex items-center gap-6">
            <h2 id="stats-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:shrink-0 min-[992px]:text-[4rem]">
              Desde Carlos Paz
            </h2>
            <div className="hidden h-px min-w-16 flex-1 border-b border-[#532c1633] min-[992px]:block" aria-hidden="true" />
            <div className="hidden w-[18.5rem] shrink-0 min-[992px]:block" aria-hidden="true" />
          </div>
          <div className="scroll-fade mt-8 flex flex-col gap-8 min-[992px]:mt-12 min-[992px]:flex-row min-[992px]:items-stretch min-[992px]:gap-[3.1875rem]">
            <img src={assets.hall} alt={imageCredit} className="h-72 w-full object-cover min-[992px]:h-[34.4375rem] min-[992px]:min-w-0 min-[992px]:flex-1" />
            <div className="flex w-full flex-col items-start justify-between gap-10 min-[992px]:h-[34.4375rem] min-[992px]:w-[18.5rem] min-[992px]:shrink-0">
              <p className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.05] min-[992px]:text-[4rem]">
                A la
                <br />
                región
              </p>
              <div className="flex flex-col items-start gap-8">
                <p className="text-[1.25rem] leading-[1.5]">
                  La base está en Villa Carlos Paz. El trabajo llega a Córdoba, Santa Fe y provincias vecinas, según la obra.
                </p>
                <Button href="/cobertura">Zona de trabajo</Button>
              </div>
            </div>
          </div>
          <dl className="scroll-fade scroll-fade-late mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 min-[992px]:mt-16 min-[992px]:w-[calc(100%-18.5rem-3.1875rem)] min-[992px]:flex-nowrap min-[992px]:gap-x-[5.5rem]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-start gap-2">
                <StatValue value={stat.value} suffix={stat.suffix} />
                <dd className="text-[1.25rem] leading-[1.5]">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 text-tan min-[992px]:py-24" aria-labelledby="work-heading">
        <img src={featured[0].image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-md" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto w-full max-w-[1360px] px-4 min-[768px]:px-6 min-[992px]:px-0">
          <div className="scroll-fade flex w-full flex-col items-start justify-between gap-6 min-[992px]:flex-row min-[992px]:items-end">
            <h2 id="work-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:text-[4rem]">
              Tipos de obra
            </h2>
            <div className="slider-bar">
              <span className="slider-count">
                [ {String(slide + 1).padStart(2, "0")}/{String(featured.length).padStart(2, "0")} ]
              </span>
              <Link to="/projects" className="slider-cta group inline-flex shrink-0 items-center justify-center rounded-[4px] bg-blue font-heading font-semibold uppercase leading-none text-tan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tan">
                <SlideLabel>Ver tipos</SlideLabel>
              </Link>
              <div className="slider-arrows">
                <button
                  type="button"
                  aria-label="Anterior"
                  disabled={slide === 0}
                  className="work-nav-btn group grid place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
                  onClick={() => setSlide((value) => Math.max(0, value - 1))}
                >
                  <span className="work-arrow is-prev h-6 w-6">
                    <span><ArrowIcon className="rotate-180" /></span>
                    <span><ArrowIcon className="rotate-180" /></span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  disabled={slide === featured.length - 1}
                  className="work-nav-btn group grid place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
                  onClick={() => setSlide((value) => Math.min(featured.length - 1, value + 1))}
                >
                  <span className="work-arrow h-6 w-6">
                    <span><ArrowIcon /></span>
                    <span><ArrowIcon /></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div
            className="drag-row mt-16 cursor-grab select-none overflow-hidden active:cursor-grabbing"
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              workDragRef.current = { active: true, x: event.clientX, dx: 0 };
              workMoved.current = false;
              setWorkDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!workDragRef.current.active) return;
              const dx = event.clientX - workDragRef.current.x;
              workDragRef.current.dx = dx;
              setWorkDrag(dx);
            }}
            onPointerUp={(event) => {
              if (!workDragRef.current.active) return;
              const card = event.currentTarget.querySelector("article");
              finishWorkDrag(card?.getBoundingClientRect().width ?? 0);
            }}
            onPointerCancel={() => {
              workDragRef.current.active = false;
              setWorkDragging(false);
              setWorkDrag(0);
            }}
            onClickCapture={(event) => {
              if (!workMoved.current) return;
              event.preventDefault();
              event.stopPropagation();
              workMoved.current = false;
            }}
          >
            <div
              className={`flex w-full gap-4 ${workDragging ? "" : "transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"}`}
              style={{ transform: `translate3d(calc(${-slide} * (75.66% + 1rem) + ${workDrag}px), 0, 0)` }}
            >
              {featured.map((project) => (
                <article key={project.slug} className="flex w-[75.66%] shrink-0 flex-col gap-6 rounded-lg bg-tan p-4 text-ink min-[992px]:h-[28.875rem] min-[992px]:flex-row min-[992px]:gap-12 min-[992px]:p-6">
                  <div className="relative h-64 shrink-0 overflow-hidden rounded-lg min-[992px]:h-[25.875rem] min-[992px]:w-[26.5rem]">
                    <img src={project.image} alt={project.imageAlt} draggable={false} className="h-full w-full object-cover" />
                    <span className="absolute left-4 top-4 rounded-[4px] bg-[rgba(17,26,13,0.32)] px-3 py-2 font-heading text-sm font-semibold uppercase leading-[1.5] text-tan">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-8">
                    <div>
                      <p className="text-sm leading-[1.5]">{project.location}</p>
                      <h3 className="mt-4 font-heading text-2xl font-semibold uppercase leading-[1.2]">{project.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-[4px] bg-blue px-3 py-2 font-heading text-xs font-semibold uppercase leading-[1.5] text-tan">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-base leading-6">{project.summary}</p>
                    </div>
                    <Link to={`/project/${project.slug}`} className="group inline-flex w-fit items-center gap-2 font-heading text-base font-semibold uppercase text-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue">
                      <SlideLabel>Ver tipo de obra</SlideLabel>
                      <span className="work-arrow h-8 w-8 rounded-[4px] bg-blue text-tan">
                        <span><ArrowIcon /></span>
                        <span><ArrowIcon /></span>
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section overflow-hidden bg-dark-tan text-ink" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="trust-heading scroll-fade mx-auto font-heading">
          Cómo se encara<br /> una obra.
        </h2>
        <div className="trust-gap scroll-fade scroll-fade-late w-full">
          <div className="trust-marquee">
            {[0, 1, 2].map((copy) => (
              <ul key={copy} className="trust-marquee-track list-none" aria-hidden={copy > 0 || undefined}>
                {principles.map((item) => (
                  <li key={`${item.title}-${copy}`} className="trust-card bg-tan">
                    <p className="trust-quote">{item.body}</p>
                    <h3 className="trust-name font-heading">{item.title}</h3>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-tan px-4 pb-[5.4375rem] pt-20 min-[992px]:px-0 min-[992px]:pb-[3.1875rem] min-[992px]:pt-28" aria-labelledby="career-heading">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col items-start gap-14 min-[992px]:flex-row min-[992px]:items-center">
          <div className="scroll-fade w-full max-w-[43.25rem]">
            <h2 id="career-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[768px]:text-[3.5rem]">
              El oficio se aprende en la obra.
            </h2>
            <p className="mt-6 text-[1.25rem] leading-[1.5]">
              No hay búsquedas publicadas. Si trabajás pisos de hormigón y querés escribir, el canal está abierto.
            </p>
            <Button href="/careers" className="career-btn group mt-8">
              <SlideLabel>Trabajar con BMP</SlideLabel>
            </Button>
          </div>
          <div className="scroll-fade scroll-fade-late w-full min-[992px]:w-auto">
            <CareerStack />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden text-tan" aria-labelledby="start-heading">
        <div className="absolute inset-0">
          <img src={assets.floor} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[rgb(29_29_29/0.6)]" />
        </div>
        <div className="cta-fade" aria-hidden="true">
          <div className="cta-fade-soft" />
        </div>
        <div className="relative z-[2] mx-auto flex w-full max-w-[48.875rem] flex-col items-center px-6 pb-40 pt-[29.875rem] text-center min-[768px]:pb-[15rem]">
          <div className="scroll-fade flex w-full flex-col items-center">
          <h2 id="start-heading" className="cta-title">
            <span>Empezá con</span>
            <span className="cta-stroke">BM Pisos.</span>
          </h2>
          <p className="cta-sub">Pisos de hormigón alisado para industria, comercio y depósitos, desde Villa Carlos Paz.</p>
          <div className="cta-actions">
            <Link to="/contact" className="cta-btn cta-btn-primary group">
              <SlideLabel>Pedir una visita</SlideLabel>
            </Link>
            <Link to="/careers" className="cta-btn cta-btn-dark group">
              <SlideLabel>Sumate a BMP</SlideLabel>
            </Link>
          </div>
          </div>
        </div>
      </section>

      {videoOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/80 p-5" role="presentation" onClick={() => setVideoOpen(false)}>
          <div
            className="hero-popup relative w-full max-w-4xl"
            role="dialog"
            aria-modal="true"
            aria-label="Video de referencia"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hero-popup-close absolute -top-14 right-0 font-heading text-[16px] uppercase text-tan"
              onClick={() => setVideoOpen(false)}
            >
              Cerrar
            </button>
            <video
              className="aspect-video w-full rounded-lg bg-ink"
              src={assets.heroVideo}
              poster={publicUrl("media/hall.jpg")}
              controls
              autoPlay
              playsInline
            />
            <p className="mt-3 text-center text-[14px] text-tan">{imageCredit}</p>
          </div>
        </div>
      )}
    </>
  );
}
