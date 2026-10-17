import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { careerStories, jobBySlug, jobs, team, values } from "../content/site";

export function AboutPage() {
  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto max-w-[1100px] px-5 pb-20 md:px-8" aria-labelledby="legacy-heading">
        <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-orange">El oficio</p>
        <h1 id="legacy-heading" className="mt-4 font-heading text-[2.6rem] uppercase leading-[1.02] md:text-[4rem]">
          Treinta años alisando hormigón.
        </h1>
        <div className="mt-8 space-y-5 text-[18px] leading-relaxed">
          <p>
            BMP Pisos Alisados nace en Villa Carlos Paz y llega a la obra como tercera generación en el rubro. El trabajo es el piso de hormigón: industrial, comercial, de estación de servicio, depósito u hotel.
          </p>
          <p>
            No publicamos una historia de fundadores que no esté confirmada. Lo que sí está dicho es el tiempo en el oficio, el lugar de origen y el tipo de piso que se hace.
          </p>
          <p>La zona habitual es Córdoba, Santa Fe y provincias vecinas. Cada obra confirma radio, plazo y uso del piso.</p>
        </div>
      </section>

      <section id="our-values" className="bg-ink py-20 text-tan" aria-labelledby="values-heading">
        <div className="mx-auto max-w-[1360px] px-5 md:px-8">
          <h2 id="values-heading" className="font-heading text-[3rem] uppercase md:text-[4.5rem]">
            Cómo se trabaja.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <article key={value.index}>
                <p className="font-mono text-[13px] text-tan/70">[ {value.index} / 05 ]</p>
                <h3 className="mt-3 font-heading text-[1.6rem] uppercase">{value.title}</h3>
                <p className="mt-3 text-tan/85">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="our-team" className="mx-auto max-w-[1360px] px-5 py-20 md:px-8" aria-labelledby="team-heading">
        <h2 id="team-heading" className="font-heading text-[3rem] uppercase">
          Tercera generación.
        </h2>
        <p className="mt-4 max-w-3xl text-[18px]">
          El equipo no se lista con nombres hasta que BMP los confirme. Lo que se puede decir hoy es el oficio: gente que hace pisos de hormigón, con treinta años de práctica familiar en el rubro.
        </p>
        {team.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {team.map((person) => (
            <li key={person.name}>
              {person.image ? (
                <img src={person.image} alt={person.name} className="aspect-square w-full rounded-[12px] object-cover" />
              ) : (
                <div className="flex aspect-square w-full items-end rounded-[12px] bg-dark-tan p-4 font-heading uppercase">
                  {person.name}
                </div>
              )}
              <h3 className="mt-3 font-heading uppercase">{person.name}</h3>
              <p className="text-[14px] text-grey">{person.role}</p>
            </li>
          ))}
        </ul>
        )}
      </section>

      <section id="give-back" className="bg-dark-tan py-20" aria-labelledby="give-heading">
        <div className="mx-auto max-w-[980px] px-5 md:px-8">
          <h2 id="give-heading" className="font-heading text-[3rem] uppercase">
            Desde Carlos Paz
          </h2>
          <p className="mt-4 text-[18px]">
            La empresa trabaja en la región donde está la base. No se publican campañas ni patrocinios que BMP no haya confirmado.
          </p>
          <p className="mt-8 font-heading text-[1.6rem] uppercase">El piso queda. El resto se dice cuando es cierto.</p>
        </div>
      </section>
    </div>
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
      <section className="mx-auto max-w-[1100px] px-5 pb-16 md:px-8" aria-labelledby="careers-heading">
        <h1 id="careers-heading" className="font-heading text-[3rem] uppercase leading-[0.95] md:text-[5rem]">
          Trabajar en el oficio.
        </h1>
        <p className="mt-4 text-[20px]">No hay puestos publicados. Si el trabajo encaja, se conversa.</p>
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

      <section id="open-positions" className="mx-auto max-w-[1100px] px-5 py-16 md:px-8" aria-labelledby="jobs-heading">
        <h2 id="jobs-heading" className="font-heading text-[2.6rem] uppercase">
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
        <div className="mx-auto max-w-[720px] px-5 md:px-8">
          <h2 id="resume-heading" className="font-heading text-[2.2rem] uppercase">
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
