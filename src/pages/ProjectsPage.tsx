import { Link } from "react-router-dom";
import { projects } from "../content/site";

export function ProjectsPage() {
  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto max-w-[1360px] px-5 pb-20 md:px-8" aria-labelledby="projects-heading">
        <h1 id="projects-heading" className="max-w-[16em] font-heading text-[2.8rem] uppercase leading-[1] md:text-[4.4rem]">
          Tipos de piso que hace BMP.
        </h1>
        <p className="mt-6 max-w-2xl text-[18px]">
          No es un portafolio de clientes. Son los trabajos habituales: industria, comercio, estaciones, depósitos y hotelería. Las fotos son de referencia.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.slug} className="overflow-hidden rounded-[18px] bg-dark-tan">
              <Link to={`/project/${project.slug}`}>
                <img src={project.image} alt={project.imageAlt} className="aspect-[16/10] w-full object-cover" />
              </Link>
              <div className="p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-grey">{project.category}</p>
                <h2 className="mt-2 font-heading text-[1.7rem] uppercase leading-tight">
                  <Link to={`/project/${project.slug}`}>{project.title}</Link>
                </h2>
                <p className="mt-2 text-[14px] text-grey">
                  {project.location} · {project.client}
                </p>
                <p className="mt-3 text-[16px]">{project.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
