import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowIcon, Button, SlideLabel } from "../components/Button";
import { ClosingBand } from "../components/ClosingBand";
import { assets, careerStories, coverage, jobBySlug, jobs, team, values } from "../content/site";
import { bindViewport, viewportHeight } from "../viewport";

const valueWords = ["Oficio", "Claridad", "Criterio", "Terminación", "Región", "Detalle"];
const slideImages = [assets.floor, assets.hall, assets.pour, assets.hero, assets.yard];

export function AboutPage() {
  return (
    <div className="bg-tan">
      <section className="page-hero" data-page-hero aria-labelledby="legacy-heading">
        <img src={assets.hall} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex h-svh w-full max-w-[1360px] flex-col items-center justify-center px-4 text-center md:px-6 lg:px-0">
          <h1 id="legacy-heading" className="page-display max-w-[14em]">
            El estándar es el piso.
          </h1>
          <p className="page-kicker mt-6 max-w-[28rem]">Oficio, uso y terminación, en la misma línea.</p>
        </div>
      </section>

      <section className="bg-tan" aria-labelledby="story-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 py-28 md:px-6 lg:px-0">
          <h2 id="story-heading" className="scroll-fade text-center font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
            Treinta años de oficio
          </h2>
          <div className="mt-14 grid items-start gap-8 lg:grid-cols-2 lg:gap-8">
            <img src={assets.pour} alt="" className="scroll-fade h-[28rem] w-full object-cover" />
            <div className="scroll-fade space-y-6 text-xl leading-[1.5]">
              <p>
                BMP Pisos Alisados nace en Villa Carlos Paz y llega a la obra como tercera generación en el rubro. El trabajo es el piso de hormigón: industrial, comercial, de estación de servicio, depósito u hotel.
              </p>
              <p>
                No publicamos una historia de fundadores que no esté confirmada. Lo que sí está dicho es el tiempo en el oficio, el lugar de origen y el tipo de piso que se hace.
              </p>
              <p>La zona habitual es Córdoba, Santa Fe y provincias vecinas. Cada obra confirma radio, plazo y uso del piso.</p>
              <Button href="/about#our-team" className="group mt-4">
                <SlideLabel>El oficio</SlideLabel>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ValueTrack />

      <section className="overflow-hidden bg-tan py-16" aria-labelledby="words-heading">
        <h2 id="words-heading" className="px-4 font-heading text-base font-semibold uppercase tracking-[0.14em]">
          [ Cómo se trabaja ]
        </h2>
        <div className="mt-8 overflow-hidden">
          <div className="value-marquee">
            {[0, 1].map((copy) => (
              <p key={copy} className="flex" aria-hidden={copy > 0 || undefined}>
                {valueWords.map((word) => (
                  <span key={`${word}-${copy}`} className="value-word">
                    {word}
                  </span>
                ))}
              </p>
            ))}
          </div>
          <div className="value-marquee is-reverse mt-2">
            {[0, 1].map((copy) => (
              <p key={copy} className="flex" aria-hidden="true">
                {[...valueWords].reverse().map((word) => (
                  <span key={`${word}-b-${copy}`} className="value-word">
                    {word}
                  </span>
                ))}
              </p>
            ))}
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
          <Button href="/careers" className="group mt-8">
            <SlideLabel>Trabajar con BMP</SlideLabel>
          </Button>
          {team.length > 0 ? (
            <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {team.map((person) => (
                <li key={person.name}>
                  {person.image ? (
                    <img src={person.image} alt={person.name} className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="flex aspect-square w-full items-end bg-dark-tan p-4 font-heading uppercase">{person.name}</div>
                  )}
                  <h3 className="mt-3 font-heading uppercase">{person.name}</h3>
                  <p className="text-sm text-grey">{person.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [assets.floor, "Industrial"],
                [assets.hall, "Comercial"],
                [assets.pour, "Obra"],
                [assets.hero, "Región"],
              ].map(([src, label]) => (
                <figure key={label}>
                  <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
                  <figcaption className="mt-3 font-heading uppercase">{label}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-tan" aria-labelledby="matters-heading">
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-12 px-4 py-24 md:px-6 lg:grid-cols-2 lg:px-0">
          <div>
            <h2 id="matters-heading" className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
              El trabajo importa.
            </h2>
            <p className="mt-4 text-xl leading-[1.5]">Para la obra. Para quien lo pisa todos los días. Para la región donde se hace.</p>
          </div>
          <img src={assets.yard} alt="" className="h-[24rem] w-full object-cover" />
        </div>
        <div className="mx-auto grid w-full max-w-[1360px] gap-16 px-4 pb-24 md:px-6 lg:grid-cols-2 lg:px-0">
          <article>
            <h3 className="font-heading text-[2rem] font-semibold uppercase leading-[1.2]">El oficio se aprende en la obra.</h3>
            <p className="mt-4 max-w-xl text-xl leading-[1.5]">
              No hay búsquedas publicadas. Si trabajás pisos de hormigón y el ritmo encaja, se conversa.
            </p>
            <Button href="/careers" className="group mt-8">
              <SlideLabel>Trabajar con BMP</SlideLabel>
            </Button>
          </article>
          <article id="give-back" className="scroll-mt-24">
            <h3 id="give-heading" className="font-heading text-[2rem] font-semibold uppercase leading-[1.2]">
              Desde Carlos Paz
            </h3>
            <p className="mt-4 text-xl leading-[1.5]">
              La empresa trabaja en la región donde está la base. No se publican campañas ni patrocinios que BMP no haya confirmado.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-heading uppercase">
              {coverage.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <ClosingBand
        id="about-close-heading"
        title="Empezá con"
        stroke="BM Pisos."
        body="Pisos de hormigón alisado para industria, comercio y depósitos, desde Villa Carlos Paz."
        image={assets.floor}
      />
    </div>
  );
}

function ValueTrack() {
  const trackRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const count = values.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - viewportHeight();
      const scrolled = total <= 0 ? 0 : Math.min(0.999, Math.max(0, -rect.top / total));
      setIndex(Math.min(count - 1, Math.floor(scrolled * count)));
    };
    onScroll();
    return bindViewport(onScroll);
  }, [count]);

  const jump = (next: number) => {
    const track = trackRef.current;
    const clamped = Math.min(count - 1, Math.max(0, next));
    setIndex(clamped);
    if (!track) return;
    const top = window.scrollY + track.getBoundingClientRect().top;
    const total = track.offsetHeight - viewportHeight();
    window.scrollTo({ top: top + (clamped / Math.max(1, count - 1)) * total, behavior: "smooth" });
  };

  const slide = values[index];

  return (
    <section id="our-values" ref={trackRef} className="relative h-auto bg-ink text-tan lg:h-[400vh]" aria-labelledby="values-heading">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
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
                className="work-nav-btn group grid h-12 w-12 place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
                onClick={() => jump(index - 1)}
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
                className="work-nav-btn group grid h-12 w-12 place-items-center rounded-[4px] bg-blue disabled:pointer-events-none disabled:opacity-40"
                onClick={() => jump(index + 1)}
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
          <div className="relative mt-8 min-h-[24rem] flex-1 overflow-hidden lg:mt-10">
            {slideImages.map((src, imageIndex) => (
              <img
                key={imageIndex}
                src={src}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${imageIndex === index ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div key={slide.title} className="tab-panel absolute inset-x-0 bottom-0 max-w-[40rem] p-6 md:p-10">
              <h3 className="font-heading text-[1.75rem] font-semibold uppercase leading-[1.2] md:text-[2.5rem]">{slide.title}</h3>
              <p className="mt-3 max-w-xl text-xl leading-[1.5]">{slide.body}</p>
            </div>
          </div>
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
