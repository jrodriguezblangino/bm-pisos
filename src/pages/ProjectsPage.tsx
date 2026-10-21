import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { ClosingBand } from "../components/ClosingBand";
import { assets, projects } from "../content/site";

const filters = ["Todos", ...Array.from(new Set(projects.map((project) => project.category)))];

export function ProjectsPage() {
  const [filter, setFilter] = useState("Todos");
  const visible = filter === "Todos" ? projects : projects.filter((project) => project.category === filter);

  return (
    <div className="bg-tan">
      <section className="page-hero" data-page-hero aria-labelledby="projects-heading">
        <img src={assets.surface} alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-110" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex h-svh w-full max-w-[1360px] flex-col justify-center px-4 md:px-6 lg:px-0">
          <h1 id="projects-heading" className="page-display max-w-[10em]">
            El tipo de piso.
          </h1>
          <p className="page-kicker mt-6 max-w-[34rem]">
            Los usos que hace BMP en la región. No es un portafolio de clientes: las fotos son de referencia y no documentan una obra de BMP.
          </p>
          <div className="mt-8">
            <Button href="/projects#obras">Todos los tipos</Button>
          </div>
        </div>
      </section>

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
              <Link key={project.slug} to={`/project/${project.slug}`} className={`project-row group px-2 ${project.image ? "" : "is-type"}`}>
                {project.image ? <img src={project.image} alt={project.imageAlt} className="object-cover" /> : null}
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
      />
    </div>
  );
}

