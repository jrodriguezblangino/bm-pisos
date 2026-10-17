import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon, Button, SlideLabel } from "../components/Button";
import { ClosingBand } from "../components/ClosingBand";
import { assets, projects } from "../content/site";

const filters = ["Todos", ...Array.from(new Set(projects.map((project) => project.category)))];

export function ProjectsPage() {
  const [filter, setFilter] = useState("Todos");
  const visible = filter === "Todos" ? projects : projects.filter((project) => project.category === filter);

  return (
    <div className="bg-tan">
      <section className="page-hero" data-page-hero aria-labelledby="projects-heading">
        <img src={assets.hero} alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-110" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex h-dvh w-full max-w-[1360px] flex-col justify-center px-4 md:px-6 lg:px-0">
          <h1 id="projects-heading" className="page-display max-w-[10em]">
            Hecho y entregado.
          </h1>
          <p className="page-kicker mt-6 max-w-[30rem]">
            Los tipos de piso que hace BMP en la región. No es un portafolio de clientes: las fotos son de referencia hasta tener obra documentada.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/projects#destacados">Tipos destacados</Button>
            <Button href="/projects#obras">Todos los tipos</Button>
          </div>
        </div>
      </section>

      <FeaturedSlider />

      <section id="obras" className="scroll-mt-24 bg-tan pb-24" aria-labelledby="all-projects-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 pt-8 md:px-6 lg:px-0">
          <h2 id="all-projects-heading" className="sr-only">
            Todos los tipos de obra
          </h2>
          <div className="flex gap-8 overflow-x-auto" role="tablist" aria-label="Filtrar por tipo">
            {filters.map((item) => {
              const selected = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`service-tab focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${selected ? "is-active" : ""}`}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div className="mt-8 border-t border-line">
            {visible.map((project) => (
              <Link key={project.slug} to={`/project/${project.slug}`} className="project-row group px-2">
                <img src={project.image} alt="" className="h-28 w-full object-cover md:h-[7.25rem]" />
                <h3 className="font-heading text-2xl font-semibold uppercase leading-[1.2] group-hover:text-blue">{project.title}</h3>
                <div className="text-sm leading-6">
                  <p>{project.location}</p>
                  <p className="mt-1">{project.category}</p>
                </div>
              </Link>
            ))}
          </div>
          {visible.length === 0 && <p className="py-10 text-lg">No hay tipos en este filtro.</p>}
        </div>
      </section>

      <ClosingBand
        id="projects-close-heading"
        title="¿Arrancamos"
        stroke="el piso?"
        body="Contanos el uso, la zona y el plazo. El resto se confirma en la obra."
        image={assets.pour}
      />
    </div>
  );
}

function FeaturedSlider() {
  const [slide, setSlide] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ active: false, x: 0, dx: 0 });
  const moved = useRef(false);
  const featured = projects;

  const finish = (width: number) => {
    const dx = dragRef.current.dx;
    dragRef.current.active = false;
    setDragging(false);
    setDrag(0);
    if (Math.abs(dx) < 8) return;
    moved.current = true;
    const threshold = Math.max(80, width * 0.18);
    if (dx < -threshold) setSlide((value) => Math.min(featured.length - 1, value + 1));
    if (dx > threshold) setSlide((value) => Math.max(0, value - 1));
  };

  return (
    <section id="destacados" className="scroll-mt-24 bg-tan py-24" aria-labelledby="featured-heading">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-6 lg:px-0">
        <div className="flex flex-col items-start justify-between gap-6 min-[768px]:flex-row min-[768px]:items-end">
          <h2 id="featured-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
            Destacados
          </h2>
          <div className="flex items-center gap-6">
            <span className="font-mono text-base tracking-[0.36em]">
              [ {String(slide + 1).padStart(2, "0")}/{String(featured.length).padStart(2, "0")} ]
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Anterior"
                disabled={slide === 0}
                className="work-nav-btn group grid h-12 w-12 place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
                onClick={() => setSlide((value) => Math.max(0, value - 1))}
              >
                <span className="work-arrow is-prev h-6 w-6">
                  <span>
                    <ArrowIcon className="rotate-180" />
                  </span>
                  <span>
                    <ArrowIcon className="rotate-180" />
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                disabled={slide === featured.length - 1}
                className="work-nav-btn group grid h-12 w-12 place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
                onClick={() => setSlide((value) => Math.min(featured.length - 1, value + 1))}
              >
                <span className="work-arrow h-6 w-6">
                  <span>
                    <ArrowIcon />
                  </span>
                  <span>
                    <ArrowIcon />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div
          className="mt-12 cursor-grab select-none overflow-hidden active:cursor-grabbing"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            dragRef.current = { active: true, x: event.clientX, dx: 0 };
            moved.current = false;
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragRef.current.active) return;
            const dx = event.clientX - dragRef.current.x;
            dragRef.current.dx = dx;
            setDrag(dx);
          }}
          onPointerUp={(event) => {
            if (!dragRef.current.active) return;
            const card = event.currentTarget.querySelector("article");
            finish(card?.getBoundingClientRect().width ?? 0);
          }}
          onPointerCancel={() => {
            dragRef.current.active = false;
            setDragging(false);
            setDrag(0);
          }}
          onClickCapture={(event) => {
            if (!moved.current) return;
            event.preventDefault();
            event.stopPropagation();
            moved.current = false;
          }}
        >
          <div
            className={`flex w-full gap-4 ${dragging ? "" : "transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"}`}
            style={{ transform: `translate3d(calc(${-slide} * (75.66% + 1rem) + ${drag}px), 0, 0)`, touchAction: "pan-y" }}
          >
            {featured.map((project) => (
              <article key={project.slug} className="flex w-[86%] shrink-0 flex-col gap-6 bg-dark-tan p-4 text-ink min-[992px]:h-[34.5rem] min-[992px]:w-[75.66%] min-[992px]:flex-row min-[992px]:gap-12 min-[992px]:p-6">
                <div className="relative h-64 shrink-0 overflow-hidden min-[992px]:h-full min-[992px]:w-[26.5rem]">
                  <img src={project.image} alt={project.imageAlt} draggable={false} className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-[4px] bg-[rgba(17,26,13,0.32)] px-3 py-2 font-heading text-sm font-semibold uppercase text-tan">
                    {project.category}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-8 py-2">
                  <div>
                    <p className="text-sm">{project.location}</p>
                    <h3 className="mt-4 font-heading text-2xl font-semibold uppercase leading-[1.2]">{project.title}</h3>
                    <p className="mt-4 text-base leading-6">{project.summary}</p>
                  </div>
                  <Link to={`/project/${project.slug}`} className="group inline-flex w-fit items-center gap-2 font-heading text-base font-semibold uppercase text-blue">
                    <SlideLabel>Ver tipo de obra</SlideLabel>
                    <span className="work-arrow h-8 w-8 rounded-[4px] bg-blue text-tan">
                      <span>
                        <ArrowIcon />
                      </span>
                      <span>
                        <ArrowIcon />
                      </span>
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
