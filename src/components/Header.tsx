import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { logos, nav } from "../content/site";
import { bindViewport, scrollTop, viewportHeight } from "../viewport";

function RiseLabel({ text }: { text: string }) {
  const chars = [...text];
  const line = (hover: boolean) => (
    <span className={hover ? "letter-line is-hover" : "letter-line"} aria-hidden="true">
      <span className="letter-word">
        {chars.map((char, index) => (
          <span className="letter-mask" key={`${hover ? "h" : "b"}-${index}`}>
            <span className="letter">{char}</span>
          </span>
        ))}
      </span>
    </span>
  );

  return (
    <>
      <span className="sr-only">{text}</span>
      {line(false)}
      {line(true)}
    </>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(pathname === "/");
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    const hero =
      pathname === "/"
        ? document.querySelector(".home-hero")
        : document.querySelector("[data-page-hero]");
    if (!hero) {
      setOnDark(false);
      return;
    }
    const onScroll = () => {
      if (pathname === "/") {
        setOnDark(scrollTop() < viewportHeight() * 0.46);
        return;
      }
      setOnDark(hero.getBoundingClientRect().bottom > 72);
    };
    onScroll();
    return bindViewport(onScroll);
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    if (open) {
      header.style.transform = "";
      header.style.transition = "";
      return;
    }

    let lastY = scrollTop();
    let scrollHidden = false;
    let visualHidden = false;
    let near = false;
    let pointerY = Number.POSITIVE_INFINITY;

    const shift = (hide: boolean) => {
      if (hide === visualHidden) return;
      visualHidden = hide;
      header.style.transition = hide
        ? "transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1) 300ms"
        : "transform 700ms cubic-bezier(0.25, 0.1, 0.25, 1)";
      header.style.transform = hide ? "translateY(-15em)" : "translateY(0)";
    };

    const apply = () => {
      const band = header.offsetHeight || 88;
      const nextNear = pointerY >= 0 && pointerY <= band;
      if (nextNear !== near) {
        near = nextNear;
        setPeek(nextNear);
      }
      const hide = scrollHidden && !near && scrollTop() > 0;
      shift(hide);
    };

    const onScroll = () => {
      if (document.body.classList.contains("nav-open")) return;
      const y = scrollTop();
      const delta = y - lastY;
      lastY = y;
      if (y <= 0) scrollHidden = false;
      else if (delta > 0) scrollHidden = true;
      else if (delta < 0) scrollHidden = false;
      apply();
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerY = event.clientY;
      apply();
    };

    const onLeave = () => {
      pointerY = Number.POSITIVE_INFINITY;
      apply();
    };

    const unbind = bindViewport(onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      unbind();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      header.style.transform = "";
      header.style.transition = "";
      setPeek(false);
    };
  }, [pathname, open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLElement>(".letter-link")];
    const cleanups: Array<() => void> = [];

    for (const link of links) {
      const outgoing = [...link.querySelectorAll<HTMLElement>(".letter-line:not(.is-hover) .letter")];
      const incoming = [...link.querySelectorAll<HTMLElement>(".letter-line.is-hover .letter")];
      const count = outgoing.length;
      const step = count > 1 ? 150 / (count - 1) : 0;
      let animations: Animation[] = [];

      const run = (forward: boolean) => {
        animations.forEach((animation) => animation.cancel());
        animations = [];
        const delayFor = (index: number) => (forward ? index : count - 1 - index) * step;
        outgoing.forEach((letter, index) => {
          animations.push(
            letter.animate(
              [
                { transform: forward ? "translateY(0%)" : "translateY(-100%)" },
                { transform: forward ? "translateY(-100%)" : "translateY(0%)" },
              ],
              { duration: 450, delay: delayFor(index), easing: "linear", fill: "forwards" },
            ),
          );
        });
        incoming.forEach((letter, index) => {
          animations.push(
            letter.animate(
              [
                { transform: forward ? "translateY(100%)" : "translateY(0%)" },
                { transform: forward ? "translateY(0%)" : "translateY(100%)" },
              ],
              { duration: 450, delay: delayFor(index), easing: "linear", fill: "forwards" },
            ),
          );
        });
      };

      const target = link.closest("a,button") ?? link;
      const enter = () => run(true);
      const leave = () => run(false);
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
      target.addEventListener("focus", enter);
      target.addEventListener("blur", leave);
      cleanups.push(() => {
        target.removeEventListener("mouseenter", enter);
        target.removeEventListener("mouseleave", leave);
        target.removeEventListener("focus", enter);
        target.removeEventListener("blur", leave);
        animations.forEach((animation) => animation.cancel());
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname]);

  const ink = "text-tan";
  const solid = !onDark || open;

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-[80] ${solid ? "nav-bar" : ""} ${open ? "nav-menu-open" : ""} ${peek ? "nav-peek" : ""}`}>
      <div className="nav-shell mx-auto flex w-full max-w-[1360px] items-center justify-between px-4 py-3 min-[768px]:px-6 min-[768px]:py-4 min-[992px]:px-0 min-[992px]:py-5">
        <Link to="/" aria-label="BMP Pisos Alisados" className="relative z-[90] flex h-11 shrink-0 items-center min-[768px]:h-14">
          <img src={logos.mark} alt="" className="h-10 w-auto rounded-md bg-tan min-[768px]:h-12" />
        </Link>

        <div className="relative z-[90] ml-auto hidden h-14 w-full max-w-[55.5313em] items-center justify-between lg:flex">
          <nav className="flex items-center gap-8" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={`letter-link font-heading text-[16px] font-semibold uppercase ${ink} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange`}
              >
                <RiseLabel text={item.label} />
              </NavLink>
            ))}
          </nav>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-[4px] bg-orange px-6 py-4 font-heading text-[16px] font-semibold uppercase leading-none text-tan transition-colors hover:bg-[#c2410e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <span className="letter-link">
              <RiseLabel text="Consultar" />
            </span>
          </Link>
        </div>

        <button
          type="button"
          className={`menu-toggle relative z-[90] lg:hidden ${ink}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div id="mobile-menu" inert={!open} className={`mobile-menu lg:hidden ${open ? "is-open" : ""}`}>
        <nav className="flex flex-col gap-8 px-6 pt-8" aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.href} to={item.href} className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2]" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link to="/careers" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2]" onClick={() => setOpen(false)}>
            Trabajo
          </Link>
          <Link to="/contact" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2]" onClick={() => setOpen(false)}>
            Consultar
          </Link>
        </nav>
      </div>
    </header>
  );
}
