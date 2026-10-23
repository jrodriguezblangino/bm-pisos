import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { projectBySlug, projects } from "../content/site";

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

  const more = projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <article className="bg-tan pt-28 md:pt-32">
      <img src={project.image} alt={project.imageAlt} className="h-[52vh] w-full object-cover" />
      <div className="mx-auto max-w-[980px] px-5 py-14 md:px-8">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-grey">{project.category}</p>
        <h1 className="mt-3 font-heading text-[2.8rem] uppercase leading-[0.98] md:text-[4rem]">{project.title}</h1>
        <p className="mt-4 text-[18px]">
          {project.location} · {project.client}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-[4px] bg-blue px-2 py-1 font-heading text-[12px] uppercase text-tan">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-8 text-[18px] leading-relaxed">{project.summary}</p>
        <Button href="/contact" className="mt-8">
          Consultar esta obra
        </Button>
      </div>
      <section className="mx-auto max-w-[1360px] px-5 pb-20 md:px-8" aria-labelledby="more-work-heading">
        <h2 id="more-work-heading" className="font-heading text-[2rem] uppercase">
          Otros tipos de obra
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {more.map((item) => (
            <Link key={item.slug} to={`/project/${item.slug}`} className="block">
              <img src={item.image} alt="" className="aspect-[4/3] w-full rounded-[14px] object-cover" />
              <h3 className="mt-3 font-heading uppercase">{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
