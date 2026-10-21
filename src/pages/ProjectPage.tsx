import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { imageCredit, projectBySlug, projects } from "../content/site";

export function ProjectPage() {
  const { slug = "" } = useParams();
  const project = projectBySlug(slug);

  if (!project) {
    return (
      <div className="bg-tan px-6 pb-24 pt-36">
        <h1 className="font-heading text-4xl uppercase">Ese tipo de obra no está</h1>
        <Link to="/projects" className="mt-4 inline-block text-orange">
          Volver
        </Link>
      </div>
    );
  }

  const more = projects.filter((item) => item.slug !== project.slug);

  return (
    <article className="bg-tan pt-28 md:pt-36">
      <div className="mx-auto max-w-[980px] px-5 md:px-8">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-grey">{project.category}</p>
        <h1 className="mt-3 font-heading text-[2.8rem] font-semibold uppercase leading-[0.98] md:text-[4rem]">{project.title}</h1>
        <p className="mt-4 text-[18px]">{project.location}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-[4px] bg-blue px-2 py-1 font-heading text-[12px] uppercase text-tan">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {project.image ? (
        <figure className="mx-auto mt-10 max-w-[1360px] px-5 md:px-8">
          <img src={project.image} alt={project.imageAlt} className="aspect-[16/9] w-full object-cover" />
          <figcaption className="mt-3 text-sm leading-6 text-grey">{imageCredit}</figcaption>
        </figure>
      ) : (
        <p className="mx-auto mt-8 max-w-[980px] px-5 text-base leading-6 text-grey md:px-8">
          No hay foto de este tipo de piso. No se usa una imagen de otra obra para completarla.
        </p>
      )}
      <div className="mx-auto max-w-[980px] px-5 py-14 md:px-8">
        <p className="text-[18px] leading-relaxed">{project.summary}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={`/services?tab=${project.service}`}>Ver el servicio</Button>
          <Button href="/contact">Consultar este tipo de piso</Button>
        </div>
      </div>
      <section className="mx-auto max-w-[980px] px-5 pb-20 md:px-8" aria-labelledby="more-work-heading">
        <h2 id="more-work-heading" className="font-heading text-[2rem] font-semibold uppercase">
          Otros tipos de obra
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {more.map((item) => (
            <li key={item.slug}>
              <Link to={`/project/${item.slug}`} className="flex items-center justify-between gap-4 py-4 font-heading uppercase">
                <span>{item.title}</span>
                <span className="text-sm text-grey">{item.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
