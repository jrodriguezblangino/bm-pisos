import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowIcon, Button } from "../components/Button";
import { ClosingBand } from "../components/ClosingBand";
import { assets, careerStories, imageCredit, jobBySlug, jobs, values } from "../content/site";

export function AboutPage() {
  return (
    <div className="bg-tan">
      <section className="page-hero" data-page-hero aria-labelledby="legacy-heading">
        <img src={assets.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex h-svh w-full max-w-[1360px] flex-col items-center justify-center px-4 text-center md:px-6 lg:px-0">
          <h1 id="legacy-heading" className="page-display max-w-[14em]">
            El estándar es el piso.
          </h1>
          <p className="page-kicker mt-6 max-w-[28rem]">Oficio, uso y terminación, en la misma línea.</p>
        </div>
      </section>

      <section className="bg-tan" aria-labelledby="story-heading">
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-10 px-4 py-28 md:px-6 lg:grid-cols-2 lg:px-0">
          <figure className="scroll-fade">
            <img src={assets.nave} alt={imageCredit} className="h-[28rem] w-full object-cover" />
            <figcaption className="mt-3 text-sm leading-6 text-grey">{imageCredit}</figcaption>
          </figure>
          <div className="scroll-fade space-y-6 text-xl leading-[1.5]">
            <h2 id="story-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
              Treinta años de oficio
            </h2>
            <p>
              BMP Pisos Alisados nace en Villa Carlos Paz y llega a la obra como tercera generación en el rubro. El trabajo es el piso de hormigón: industrial, comercial, de estación de servicio, depósito u hotel.
            </p>
            <p>
              No publicamos una historia de fundadores que no esté confirmada. Lo que sí está dicho es el tiempo en el oficio, el lugar de origen y el tipo de piso que se hace.
            </p>
            <p>La zona habitual es Córdoba, Santa Fe y provincias vecinas. Cada obra confirma radio, plazo y uso del piso.</p>
            <Button href="/cobertura" className="mt-4">
              Zona de trabajo
            </Button>
          </div>
        </div>
      </section>

      <section id="our-team" className="scroll-mt-24 bg-tan pb-28" aria-labelledby="team-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-6 lg:px-0">
          <h2 id="team-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
            Somos BMP.
          </h2>
          <p className="mt-6 max-w-3xl text-xl leading-[1.5]">
            El equipo no se lista con nombres hasta que BMP los confirme. Lo que se puede decir hoy es el oficio: gente que hace pisos de hormigón, con treinta años de práctica familiar en el rubro.
          </p>
        </div>
      </section>

      <ValueTrack />

      <ClosingBand
        id="about-close-heading"
        title="Empezá con"
        stroke="BM Pisos."
        body="Pisos de hormigón alisado para industria, comercio y depósitos, desde Villa Carlos Paz."
        image={assets.pour}
      />
    </div>
  );
}

function ValueTrack() {
  const [index, setIndex] = useState(0);
  const count = values.length;
  const slide = values[index];

  return (
    <section id="our-values" className="bg-ink text-tan" aria-labelledby="values-heading">
      <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col px-4 py-24 md:px-6 lg:px-0 lg:py-16">
        <div className="flex flex-col items-start justify-between gap-6 min-[768px]:flex-row min-[768px]:items-end">
          <h2 id="values-heading" className="max-w-[12em] font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
            Así se trabaja.
          </h2>
          <div className="flex items-center gap-6">
            <span className="font-mono text-base tracking-[0.36em]">
              [ {String(index + 1).padStart(2, "0")}/{String(count).padStart(2, "0")} ]
            </span>
            <button
              type="button"
              aria-label="Anterior"
              disabled={index === 0}
              className="work-nav-btn group grid h-12 w-12 touch-manipulation place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
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
              disabled={index === count - 1}
              className="work-nav-btn group grid h-12 w-12 touch-manipulation place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
              onClick={() => setIndex((current) => Math.min(count - 1, current + 1))}
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
        <div key={slide.title} className="tab-panel mt-12 max-w-[40rem]">
          <h3 className="font-heading text-[1.75rem] font-semibold uppercase leading-[1.2] md:text-[2.5rem]">{slide.title}</h3>
          <p className="mt-4 text-xl leading-[1.5]">{slide.body}</p>
        </div>
      </div>
    </section>
  );
}

export function CareersPage() {
  const [sent, setSent] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get("name") ?? "").trim() || !String(data.get("email") ?? "").trim()) return;
    setSent(true);
  };

  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto max-w-[1360px] px-4 pb-16 md:px-6" aria-labelledby="careers-heading">
        <h1 id="careers-heading" className="max-w-[12em] font-heading text-[2.5rem] font-semibold uppercase leading-[1.1] md:text-[4rem]">
          Trabajar en el oficio.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-[1.5]">No hay puestos publicados. Si el trabajo encaja, se conversa.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Oficio", "Pisos de hormigón, en obra real, con gente que ya conoce el rubro."],
            ["Lugar", "La base está en Villa Carlos Paz. La obra se mueve por la región."],
            ["Forma", "No prometemos cargos ni sueldos que no estén definidos."],
          ].map(([title, body]) => (
            <article key={title}>
              <h2 className="font-heading text-[1.4rem] uppercase">{title}</h2>
              <p className="mt-2">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {careerStories.length > 0 && (
      <section className="bg-ink py-16 text-tan" aria-label="Historias del equipo">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-5 md:px-8">
          {careerStories.map((story) => (
            <figure key={story.name}>
              <blockquote className="font-heading text-[1.6rem] uppercase leading-snug md:text-[2rem]">“{story.quote}”</blockquote>
              <figcaption className="mt-4">
                {story.name}
                <span className="text-tan/70"> · {story.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      )}

      <section id="open-positions" className="mx-auto max-w-[1360px] px-4 py-16 md:px-6" aria-labelledby="jobs-heading">
        <h2 id="jobs-heading" className="font-heading text-[2rem] font-semibold uppercase leading-[1.2] md:text-[2.5rem]">
          Búsquedas
        </h2>
        <p className="mt-2">Cuando haya un puesto abierto, va a figurar acá.</p>
        {jobs.length === 0 && <p className="mt-6 text-[18px]">Hoy no hay búsquedas publicadas.</p>}
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link to={`/career/${job.slug}`} className="grid items-center gap-4 py-5 md:grid-cols-[96px_1fr_auto]">
                <img src={job.image} alt="" className="h-20 w-24 rounded-md object-cover" />
                <span>
                  <span className="block font-heading text-[1.3rem] uppercase">{job.title}</span>
                  <span className="text-[14px] text-grey">{job.location}</span>
                </span>
                <span className="font-heading uppercase text-orange">Ver puesto</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-dark-tan py-16" aria-labelledby="resume-heading">
        <div className="mx-auto max-w-[720px] px-4 md:px-6">
          <h2 id="resume-heading" className="font-heading text-[2rem] font-semibold uppercase leading-[1.2]">
            Escribí igual.
          </h2>
          <p className="mt-3">El mensaje queda en este navegador: el sitio todavía no lo envía a un servidor.</p>
          {sent ? (
            <p className="mt-6" role="status">
              Quedó anotado en esta pantalla. Cuando BMP confirme un correo, este formulario va a poder enviarse de verdad.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <input name="name" required placeholder="Nombre" aria-label="Nombre" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
              <input name="email" type="email" required placeholder="Correo" aria-label="Correo" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
              <input name="role" placeholder="Oficio" aria-label="Oficio" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
              <textarea name="note" rows={4} placeholder="Contanos tu experiencia" aria-label="Experiencia" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
              <Button type="submit" className="w-fit">
                Dejar mensaje
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export function CareerPage() {
  const { slug = "" } = useParams();
  const job = jobBySlug(slug);
  const [sent, setSent] = useState(false);

  if (!job) {
    return (
      <div className="bg-tan px-6 pb-24 pt-36">
        <h1 className="font-heading text-4xl uppercase">Ese puesto no está publicado</h1>
        <Link to="/careers" className="mt-4 inline-block text-orange">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-tan pt-28 md:pt-36">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-grey">{job.location}</p>
          <h1 className="mt-3 font-heading text-[3rem] uppercase leading-none md:text-[4.4rem]">{job.title}</h1>
          <p className="mt-6 text-[18px]">{job.summary}</p>
          <img src={job.image} alt="" className="mt-8 aspect-[16/10] w-full rounded-[14px] object-cover" />
        </div>
        {sent ? (
          <p className="rounded-[16px] bg-dark-tan p-6" role="status">
            El mensaje quedó en esta pantalla. El sitio todavía no lo envía.
          </p>
        ) : (
          <form
            className="grid h-fit gap-4 rounded-[16px] bg-dark-tan p-6"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <h2 className="font-heading text-[1.6rem] uppercase">Escribir</h2>
            <input name="name" required aria-label="Nombre" placeholder="Nombre" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
            <input name="email" type="email" required aria-label="Correo" placeholder="Correo" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
            <input name="phone" aria-label="Teléfono" placeholder="Teléfono" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
            <textarea name="note" rows={5} aria-label="Nota" placeholder="Contanos tu oficio" className="rounded-[8px] border border-stroke bg-white px-4 py-3" />
            <Button type="submit">Dejar mensaje</Button>
          </form>
        )}
      </div>
    </article>
  );
}
