import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { additionalServices, principles, projects, services } from "../content/site";

export function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("tab") ?? "industrial";
  const active = services.find((service) => service.slug === initial) ?? services[0];

  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto max-w-[1360px] px-5 pb-16 md:px-8" aria-labelledby="services-heading">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-orange">Servicios</p>
        <h1 id="services-heading" className="mt-4 max-w-[14em] font-heading text-[3rem] uppercase leading-[0.95] md:text-[5rem]">
          Pisos de hormigón para el uso que va a tener la obra.
        </h1>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => setParams({ tab: service.slug })}
              className={`rounded-[12px] px-4 py-4 text-left font-heading uppercase ${
                active.slug === service.slug ? "bg-blue text-tan" : "bg-dark-tan text-ink"
              }`}
              aria-pressed={active.slug === service.slug}
            >
              <span className="block font-mono text-[12px] normal-case tracking-[0.12em]">[ {service.index}/04 ]</span>
              {service.title}
            </button>
          ))}
        </div>
        <article className="mt-8 grid items-center gap-8 overflow-hidden rounded-[18px] bg-dark-tan lg:grid-cols-2">
          <img src={active.image} alt={active.imageAlt} className="h-full min-h-[320px] w-full object-cover" />
          <div className="p-6 md:p-10">
            <h2 className="font-heading text-[3rem] uppercase">{active.title}</h2>
            <p className="mt-4 max-w-md text-[18px]">{active.summary}</p>
            <Button href="/contact" className="mt-8">
              Consultar
            </Button>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-[1360px] px-5 py-16 md:px-8" aria-labelledby="additional-heading">
        <h2 id="additional-heading" className="font-heading text-[2rem] uppercase">
          También entra en el oficio
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {additionalServices.map((item, index) => (
            <li key={item} className="border-b border-line py-4 font-heading text-[20px] uppercase">
              <span className="mr-3 font-mono text-[12px] text-grey">{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink py-20 text-tan" aria-labelledby="principles-heading">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="principles-heading" className="font-heading text-[2.6rem] uppercase leading-[1.02]">
            Lo que se puede afirmar hoy
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {principles.map((item) => (
              <article key={item.title}>
                <h3 className="font-heading text-[22px] uppercase">{item.title}</h3>
                <p className="mt-3 text-[16px] text-tan/85">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-5 py-20 md:px-8" aria-labelledby="service-projects-heading">
        <h2 id="service-projects-heading" className="font-heading text-[2.4rem] uppercase">
          Tipos de obra
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <a key={project.slug} href={`/project/${project.slug}`} className="group block">
              <img src={project.image} alt={project.imageAlt} className="aspect-[4/3] w-full rounded-[14px] object-cover" />
              <h3 className="mt-3 font-heading uppercase group-hover:text-blue">{project.title}</h3>
              <p className="text-[14px] text-grey">{project.location}</p>
            </a>
          ))}
        </div>
        <p className="mt-16 max-w-3xl text-[18px]">
          Las fotos de esta sección son de referencia. Los nombres de clientes y las obras terminadas se publican cuando BMP los confirme.
        </p>
      </section>
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["name", "email", "message"];
    const missing = required.some((key) => !String(data.get(key) ?? "").trim());
    if (missing) return;
    setSent(true);
  };

  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto grid max-w-[1360px] gap-12 px-5 pb-24 md:px-8 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="contact-heading">
        <div>
          <h1 id="contact-heading" className="font-heading text-[3rem] uppercase leading-[0.95] md:text-[4.4rem]">
            Contanos el piso que necesita la obra.
          </h1>
          <div className="mt-10 space-y-6">
            <div>
              <h2 className="font-heading uppercase">Canal</h2>
              <p className="mt-1 text-[15px] text-grey">Todavía no hay teléfono ni correo publicados.</p>
              <a className="mt-2 inline-block font-heading text-[20px] text-orange" href="https://www.instagram.com/bmpisosalisados/" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
            <div>
              <h2 className="font-heading uppercase">Base</h2>
              <p>Villa Carlos Paz<br />Córdoba, Argentina</p>
            </div>
            <div>
              <h2 className="font-heading uppercase">Zona</h2>
              <p>Córdoba, Santa Fe y provincias vecinas.</p>
            </div>
          </div>
        </div>
        {sent ? (
          <div className="rounded-[18px] bg-dark-tan p-8" role="status">
            <h2 className="font-heading text-[2rem] uppercase">Mensaje anotado</h2>
            <p className="mt-3">
              Quedó en esta pantalla. El formulario todavía no sale del navegador: cuando haya un correo confirmado, se envía de verdad.
            </p>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={onSubmit}>
            <Field label="Nombre" name="name" required />
            <Field label="Correo" name="email" type="email" required />
            <Field label="Teléfono" name="phone" type="tel" />
            <Field label="Empresa" name="company" />
            <Field label="Lugar de la obra" name="location" />
            <label className="grid gap-2 text-[14px]">
              Mensaje
              <textarea name="message" required rows={6} className="rounded-[8px] border border-stroke bg-white px-4 py-3 text-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue" />
            </label>
            <Button type="submit" className="w-fit">
              Enviar consulta
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-[14px]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-[8px] border border-stroke bg-white px-4 py-3 text-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
      />
    </label>
  );
}
