import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, SlideLabel } from "../components/Button";
import { IntroLoader } from "../components/IntroLoader";
import { assets, brand, imageCredit, principles, projects, publicUrl, services } from "../content/site";
import { afterLoader, bindViewport, scrollTop, viewportHeight, watchScrollFades } from "../viewport";

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

function PrincipleMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tracks = () => [...root.querySelectorAll<HTMLElement>(".trust-marquee-track")];
    const clips = (track: HTMLElement) => track.getAnimations();

    const durationOf = () => {
      const timing = clips(tracks()[0])[0]?.effect?.getComputedTiming();
      return typeof timing?.duration === "number" ? timing.duration : 0;
    };

    const timeOf = () => {
      const time = clips(tracks()[0])[0]?.currentTime;
      return typeof time === "number" ? time : 0;
    };

    const setTime = (ms: number) => {
      const duration = durationOf();
      if (!duration) return;
      const next = ((ms % duration) + duration) % duration;
      for (const track of tracks()) {
        for (const animation of clips(track)) animation.currentTime = next;
      }
    };

    const pause = () => {
      for (const track of tracks()) clips(track).forEach((animation) => animation.pause());
    };

    const play = () => {
      for (const track of tracks()) clips(track).forEach((animation) => animation.play());
    };

    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let dragging = false;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pointerId !== -1) return;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = event.clientY;
      dragging = false;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!dragging) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          pointerId = -1;
          return;
        }
        if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return;
        dragging = true;
        root.classList.add("is-dragging");
        try {
          root.setPointerCapture(event.pointerId);
        } catch {
          /* A cancelled touch no longer has a pointer to capture. */
        }
        pause();
      }
      const width = tracks()[0]?.offsetWidth || 1;
      const duration = durationOf();
      if (duration) setTime(timeOf() - ((event.clientX - lastX) / width) * duration);
      lastX = event.clientX;
      event.preventDefault();
    };

    const finish = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = -1;
      if (dragging) {
        dragging = false;
        root.classList.remove("is-dragging");
        play();
      }
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", finish);
    root.addEventListener("pointercancel", finish);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", finish);
      root.removeEventListener("pointercancel", finish);
    };
  }, []);

  return (
    <div ref={rootRef} className="trust-marquee is-brisk">
      {[0, 1, 2].map((copy) => (
        <ul key={copy} className="trust-marquee-track list-none" aria-hidden={copy > 0 || undefined}>
          {principles.map((item, index) => (
            <li key={`${item.title}-${copy}`} className="trust-card is-principle bg-tan">
              <div>
                <p className="trust-index">[ 0{index + 1} ]</p>
                <h3 className="trust-name font-heading">{item.title}</h3>
              </div>
              <p className="trust-quote">{item.body}</p>
            </li>
          ))}
        </ul>
      ))}
    </div>
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
  const [showLoader, setShowLoader] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [scopePos, setScopePos] = useState(0);
  const [compactScope, setCompactScope] = useState(() => window.matchMedia("(max-width: 991px)").matches);
  const [reduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const heroRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const hero = heroRef.current;
    const sticky = stickyRef.current;
    const color = colorRef.current;
    const shade = shadeRef.current;
    const copy = copyRef.current;
    if (!hero || !sticky || !color || !shade || !copy) return;

    const header = document.querySelector("header");
    if (reduceMotion) {
      color.style.opacity = "1";
      color.style.maskImage = "none";
      color.style.setProperty("-webkit-mask-image", "none");
      sticky.style.height = "";
      copy.style.opacity = "1";
      copy.style.transform = "none";
      shade.style.opacity = "1";
      if (header) header.style.opacity = "";
      return;
    }

    const between = (progress: number, start: number, end: number, from: number, to: number) => {
      if (progress <= start) return from;
      if (progress >= end) return to;
      return from + ((to - from) * (progress - start)) / (end - start);
    };

    let target = 0;
    let shown = 0;
    let frame = 0;

    const smooth = (value: number) => {
      const x = Math.min(1, Math.max(0, value));
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    const apply = (progress: number) => {
      const full = viewportHeight();
      const reveal = smooth(between(progress, 0.48, 0.7, 0, 1));
      const feather = 8.5 * Math.sin(reveal * Math.PI);
      const edge = (1 - reveal) * 100;
      if (reveal <= 0.001) {
        color.style.opacity = "1";
        color.style.maskImage = "none";
        color.style.setProperty("-webkit-mask-image", "none");
      } else if (reveal >= 0.999) {
        color.style.opacity = "0";
      } else {
        const mask = `linear-gradient(to bottom, #000 ${Math.max(0, edge - feather)}%, transparent ${Math.min(100, edge + feather * 0.2)}%)`;
        color.style.opacity = "1";
        color.style.maskImage = mask;
        color.style.setProperty("-webkit-mask-image", mask);
      }
      sticky.style.height = `${between(progress, 0.74, 1, full, 0)}px`;
      const copyOpacity = between(progress, 0.4, 0.52, 1, 0);
      copy.style.opacity = String(copyOpacity);
      copy.style.transform = `translate3d(0, ${between(progress, 0.4, 0.56, 0, 20)}em, 0)`;
      shade.style.opacity = String(copyOpacity);
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
      const y = scrollTop();
      const top = hero.getBoundingClientRect().top + y;
      const start = top - viewport;
      const end = top + hero.offsetHeight;
      const span = end - start;
      return span <= 0 ? 0 : Math.min(1, Math.max(0, (y - start) / span));
    };

    const settle = () => {
      const delta = target - shown;
      if (Math.abs(delta) < 0.0004) {
        shown = target;
        apply(shown);
        frame = 0;
        return;
      }
      shown += delta * 0.2;
      apply(shown);
      frame = window.requestAnimationFrame(settle);
    };

    const onScroll = () => {
      target = measure();
      if (!frame) frame = window.requestAnimationFrame(settle);
    };

    let unbind = () => {};
    const cancelWait = afterLoader(() => {
      target = measure();
      shown = target;
      apply(shown);
      unbind = bindViewport(onScroll);
    });
    return () => {
      cancelWait();
      unbind();
      if (frame) window.cancelAnimationFrame(frame);
      if (header) header.style.opacity = "";
    };
  }, [reduceMotion]);

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
    if (!track || reduceMotion) return;
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
        [0.18, 0],
        [0.3, 1],
        [0.48, 1],
        [0.6, 2],
        [0.78, 2],
        [0.9, steps],
        [1, steps],
      ];
      let pos = steps;
      for (let i = 1; i < stops.length; i += 1) {
        if (scrolled <= stops[i][0]) {
          const [start, from] = stops[i - 1];
          const [end, to] = stops[i];
          const span = end - start;
          const linear = span === 0 ? 1 : (scrolled - start) / span;
          const eased = linear < 0.5 ? 2 * linear * linear : 1 - Math.pow(-2 * linear + 2, 2) / 2;
          pos = from + (to - from) * eased;
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
      shown += delta * 0.2;
      setScopePos(shown);
      frame = window.requestAnimationFrame(settle);
    };

    const onScroll = () => {
      target = measure();
      if (!frame) frame = window.requestAnimationFrame(settle);
    };

    let unbind = () => {};
    const cancelWait = afterLoader(() => {
      target = measure();
      shown = target;
      setScopePos(shown);
      unbind = bindViewport(onScroll);
    });
    return () => {
      cancelWait();
      unbind();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <>
      {showLoader && <IntroLoader onDone={finishLoader} />}
      <section ref={heroRef} className={`home-hero relative bg-tan ${reduceMotion ? "h-svh" : "h-[150svh]"}`} aria-labelledby="hero-heading">
        <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden bg-tan">
          <div className="hero-stage">
            <img src={assets.hero} alt="" className="hero-photo hero-photo-bw" width={1600} height={1066} />
            <img ref={colorRef} src={assets.hero} alt="" className="hero-photo" width={1600} height={1066} />
            <div ref={shadeRef} className="hero-shade" />
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
                    poster={assets.hero}
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

      <section className="bg-tan" aria-labelledby="scope-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 pt-20 min-[768px]:px-6 min-[768px]:pt-28 min-[992px]:px-0">
          <h2 id="scope-heading" className="scroll-fade text-center font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:text-[4.875rem]">
            Pisos de hormigón, según la obra
          </h2>
          <div className="mt-16 border-t border-[#532c1633]" aria-hidden="true" />
        </div>
        {reduceMotion ? (
          <div className="mx-auto grid w-full max-w-[1360px] gap-16 px-4 py-16 min-[768px]:px-6 min-[992px]:px-0">
            {services.map((service) => (
              <article key={service.slug} className="grid items-center gap-8 lg:grid-cols-2">
                {service.image ? (
                  <img src={service.image} alt={service.imageAlt} className="aspect-[4/3] w-full rounded-lg object-cover" />
                ) : (
                  <div className="type-panel min-h-64 rounded-lg">
                    <p>[ {service.index} / 04 ]</p>
                    <p className="type-panel-title" aria-hidden="true">{service.title}</p>
                  </div>
                )}
                <div className="flex flex-col items-start gap-5">
                  <p className="font-mono text-base tracking-[0.36em] text-[#898b8d]">[ {service.index}/04 ]</p>
                  <h3 className="font-heading text-2xl font-semibold uppercase leading-[1.2] min-[768px]:text-[2.5rem]">
                    <Link to={`/services?tab=${service.slug}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-[1.25rem] leading-[1.5]">{service.summary}</p>
                </div>
              </article>
            ))}
            <Button href="/services" className="w-fit">
              Ver servicios
            </Button>
          </div>
        ) : (
          <div ref={scopeTrackRef} className={`scope-track relative ${compactScope ? "h-[400vh]" : "h-[260vh]"}`}>
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
                        {service.image ? (
                          <img src={service.image} alt={service.imageAlt} className="h-full w-full object-cover" />
                        ) : (
                          <div className="type-panel">
                            <p>[ {service.index} / 04 ]</p>
                            <p className="type-panel-title" aria-hidden="true">{service.title}</p>
                          </div>
                        )}
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

      <section className="bg-tan pb-24 pt-8 min-[768px]:pb-36" aria-labelledby="work-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 min-[768px]:px-6 min-[992px]:px-0">
          <h2 id="work-heading" className="scroll-fade font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:text-[4rem]">
            Tipos de obra
          </h2>
          <p className="scroll-fade mt-6 max-w-[40rem] text-[1.25rem] leading-[1.5]">
            Cinco usos habituales. La foto entra cuando es de una obra de BMP y corresponde a ese piso.
          </p>
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <li key={project.slug} className="scroll-fade flex flex-col justify-between gap-8 rounded-lg bg-dark-tan p-6">
                <div>
                  <p className="font-mono text-sm tracking-[0.36em] text-grey">[ {String(index + 1).padStart(2, "0")} ]</p>
                  <h3 className="mt-4 font-heading text-2xl font-semibold uppercase leading-[1.2]">{project.title}</h3>
                  <p className="mt-3 text-sm">{project.location}</p>
                  <p className="mt-4 text-base leading-6">{project.summary}</p>
                </div>
                <Link
                  to={`/project/${project.slug}`}
                  className="font-heading text-base font-semibold uppercase text-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  Ver tipo de obra
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-tan" aria-labelledby="standard-heading">
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-10 px-4 pb-20 min-[768px]:px-6 min-[768px]:pb-28 min-[992px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[992px]:px-0">
          <div className="scroll-fade">
            <h2 id="standard-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[768px]:text-[3.5rem] min-[992px]:text-[4rem]">
              Treinta años en el hormigón.
            </h2>
            <p className="mt-6 max-w-[34rem] text-[1.25rem] leading-[1.5]">
              Tercera generación en el oficio. El piso se hace para el uso real: camiones, máquinas, mercadería o público.
            </p>
          </div>
          <figure className="scroll-fade">
            <img src={assets.pour} alt={imageCredit} className="aspect-[4/3] w-full rounded-lg object-cover" />
            <figcaption className="mt-3 text-sm leading-6 text-grey">{imageCredit}</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-tan pb-[7.5rem] pt-4 min-[768px]:pb-36" aria-labelledby="trusted-heading">
        <h2 id="trusted-heading" className="scroll-fade text-center font-heading text-base font-semibold uppercase leading-6">
          Con quién se trabaja
        </h2>
        <div className="scroll-fade scroll-fade-late mb-14 mt-8 min-[768px]:mb-16">
          <ClientMarquee />
        </div>
        <div className="mx-auto max-w-[1360px] border-b border-[#532c1633]" />
      </section>

      <section className="bg-tan" aria-labelledby="zone-heading">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col items-start gap-8 px-4 py-20 min-[768px]:px-6 min-[768px]:py-28 min-[992px]:px-0">
          <h2 id="zone-heading" className="scroll-fade font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[992px]:text-[4rem]">
            Desde Carlos Paz
          </h2>
          <p className="scroll-fade max-w-[36rem] text-[1.25rem] leading-[1.5]">
            La base está en Villa Carlos Paz. Córdoba, Santa Fe y provincias vecinas se confirman obra por obra.
          </p>
          <Button href="/cobertura">Zona de trabajo</Button>
        </div>
      </section>

      <section className="trust-section overflow-hidden bg-dark-tan text-ink" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="trust-heading scroll-fade mx-auto font-heading">
          Cómo se encara
          <br /> una obra.
        </h2>
        <div className="trust-gap scroll-fade scroll-fade-late w-full">
          <PrincipleMarquee />
        </div>
      </section>

      <section className="relative overflow-hidden text-tan" aria-labelledby="start-heading">
        <div className="absolute inset-0">
          <img src={assets.hero} alt="" className="h-full w-full object-cover" />
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
              poster={assets.hero}
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
