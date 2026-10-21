import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, SlideLabel } from "../components/Button";
import { ClosingBand } from "../components/ClosingBand";
import { additionalServices, assets, brand, imageCredit, services } from "../content/site";

const serviceTabs = [
  ...services,
  {
    slug: "adicionales",
    index: "05",
    title: "También entra en el oficio",
    summary: "Trabajos que acompañan el piso cuando la obra los pide, siempre confirmados caso por caso.",
    image: "",
    imageAlt: "",
  },
];

const pillars = [
  {
    index: "01",
    title: "Claridad",
    body: "Uso, tránsito y plazos se hablan al principio, para no corregir el hormigón cuando ya está puesto.",
  },
  {
    index: "02",
    title: "Control",
    body: "La obra se coordina con el resto de los gremios. El piso entra cuando el frente está listo para recibirlo.",
  },
  {
    index: "03",
    title: "Confianza",
    body: "Treinta años en el oficio alcanzan para decir qué se puede afirmar y qué hay que preguntar todavía.",
  },
];

export function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("tab") ?? "industrial";
  const active = serviceTabs.find((service) => service.slug === initial) ?? serviceTabs[0];

  return (
    <div className="bg-tan">
      <section className="page-hero" data-page-hero aria-labelledby="services-heading">
            <img src={assets.pour} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex h-svh w-full max-w-[1360px] flex-col justify-end px-4 pb-24 md:px-6 lg:px-0 lg:pb-40">
          <h1 id="services-heading" className="page-display max-w-[11em]">
            Donde arranca el piso.
          </h1>
          <p className="page-kicker mt-6 max-w-[40rem]">
            Hormigón alisado para industria, comercio y depósitos, con planificación, oficio y un resultado que se puede prever.
          </p>
        </div>
      </section>

      <section className="bg-tan" aria-labelledby="service-panel-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 pb-24 pt-28 md:px-6 lg:px-0">
          <div className="service-tabs" role="tablist" aria-label="Servicios">
            {serviceTabs.map((service) => {
              const selected = service.slug === active.slug;
              return (
                <button
                  key={service.slug}
                  type="button"
                  role="tab"
                  id={`tab-${service.slug}`}
                  aria-selected={selected}
                  aria-controls="service-panel"
                  className={`service-tab focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue ${selected ? "is-active" : ""}`}
                  onClick={() => setParams({ tab: service.slug })}
                >
                  {service.index} {service.title}
                </button>
              );
            })}
          </div>
          <article
            id="service-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active.slug}`}
            key={active.slug}
            className="tab-panel mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_39.5rem]"
          >
            <div>
              <p className="font-mono text-base tracking-[0.36em] text-[#898b8d]">[ {active.index}/05 ]</p>
              <h2 id="service-panel-heading" className="mt-4 font-heading text-[2rem] font-semibold uppercase leading-[1.2] md:text-[3rem]">
                {active.title}
              </h2>
              <p className="mt-5 max-w-xl text-xl leading-[1.5]">{active.summary}</p>
              {active.slug === "adicionales" && (
                <ul className="mt-6 max-w-xl space-y-3">
                  {additionalServices.map((item) => (
                    <li key={item} className="border-b border-line pb-3 font-heading text-xl uppercase">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <Button href="/contact" className="group mt-8">
                <SlideLabel>Consultar</SlideLabel>
              </Button>
            </div>
            {active.image ? (
              <figure className="order-first min-[992px]:order-none">
                <img src={active.image} alt={active.imageAlt} className="h-[16.5rem] w-full object-cover min-[768px]:h-[22rem] min-[992px]:h-[37.5rem]" />
                <figcaption className="mt-3 text-sm leading-6 text-grey">{imageCredit}</figcaption>
              </figure>
            ) : (
              <div className="type-panel order-first min-h-64 rounded-lg min-[768px]:min-h-[22rem] min-[992px]:order-none min-[992px]:min-h-[37.5rem]">
                <p>[ {active.index} / 05 ]</p>
                <p className="type-panel-title" aria-hidden="true">{active.title}</p>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="bg-tan pb-28" aria-labelledby="pillars-heading">
        <div className="mx-auto w-full max-w-[1360px] px-4 md:px-6 lg:px-0">
          <h2 id="pillars-heading" className="scroll-fade max-w-[16em] font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[4rem]">
            Para obras que no pueden fallar el piso.
          </h2>
          <div className="mt-14 grid gap-12 min-[768px]:mt-20 min-[992px]:grid-cols-3 min-[992px]:gap-16">
            {pillars.map((item) => (
              <article key={item.index} className="scroll-fade">
                <p className="font-mono text-base tracking-[0.36em] text-[#898b8d]">[ {item.index} ]</p>
                <h3 className="mt-4 font-heading text-[2rem] font-semibold uppercase leading-[1.2]">{item.title}</h3>
                <p className="mt-4 text-xl leading-[1.5]">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-start gap-8">
            <p className="max-w-3xl text-base leading-6 text-grey">
              Las fotos son de referencia. Los nombres de clientes y las obras terminadas se publican cuando BMP los confirme.
            </p>
            <Button href="/projects">Ver tipos de obra</Button>
          </div>
        </div>
      </section>

      <section className="relative h-svh text-tan" aria-labelledby="expertise-heading">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={assets.hero}>
          <source src={assets.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <h2
          id="expertise-heading"
          className="scroll-fade relative z-10 mx-auto flex h-full max-w-[62rem] items-center px-6 text-center font-heading text-[1.75rem] font-semibold uppercase leading-[1.2] md:text-[2.5rem]"
        >
          El oficio es ver el problema antes de que el hormigón fragüe. Hacer el piso una vez. Saber qué viene después.
        </h2>
      </section>

      <ClosingBand
        id="services-close-heading"
        title="Empezá con"
        stroke="BM Pisos."
        body="Pisos de hormigón alisado para industria, comercio y depósitos, desde Villa Carlos Paz."
        image={assets.surface}
      />

    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["first", "last", "email", "inquiry", "message"];
    const missing = required.some((key) => !String(data.get(key) ?? "").trim());
    if (missing) return;
    setSent(true);
  };

  return (
    <div className="bg-tan">
      <section className="page-hero" data-page-hero aria-labelledby="contact-heading">
        <img src={assets.surface} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto w-full max-w-[1360px] px-4 pb-36 pt-28 md:px-6 lg:px-0 lg:pt-[6.5rem]">
          <h1 id="contact-heading" className="page-display mx-auto max-w-[16em] text-center">
            ¿Listos para el piso?
          </h1>
          <div className="contact-card mx-auto mt-10 w-full max-w-[60rem] text-ink min-[768px]:mt-16">
            {sent ? (
              <div className="py-16 text-center" role="status">
                <h2 className="font-heading text-[2rem] font-semibold uppercase leading-[1.2] md:text-[3rem]">Mensaje anotado</h2>
                <p className="mx-auto mt-4 max-w-md text-xl leading-[1.5]">
                  Quedó en esta pantalla. El formulario todavía no sale del navegador: cuando haya un correo confirmado, se envía de verdad.
                </p>
              </div>
            ) : (
              <>
                <p className="mx-auto max-w-[34rem] text-center text-xl leading-[1.5]">
                  Tomamos consultas por pisos de hormigón en Córdoba, Santa Fe y provincias vecinas. El mensaje queda en esta pantalla: el sitio todavía no lo envía.
                </p>
                <form className="mt-10" onSubmit={onSubmit}>
                  <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                    <Field label="Nombre" name="first" required />
                    <Field label="Apellido" name="last" required />
                    <Field label="Correo" name="email" type="email" required />
                    <Field label="Teléfono" name="phone" type="tel" placeholder="Opcional" />
                  </div>
                  <div className="mt-6">
                    <Field label="Empresa" name="company" placeholder="Opcional" />
                  </div>
                  <label className="mt-6 grid gap-2 text-base">
                    ¿Sobre qué es la consulta?*
                    <select name="inquiry" required defaultValue="" className="contact-field">
                      <option value="" disabled>
                        Elegí una
                      </option>
                      <option>Pedir una visita</option>
                      <option>Piso industrial</option>
                      <option>Estación de servicio</option>
                      <option>Depósito o nave</option>
                      <option>Otra consulta</option>
                    </select>
                  </label>
                  <label className="mt-6 grid gap-2 text-base">
                    Mensaje*
                    <textarea name="message" required rows={4} placeholder="Contanos la obra" className="contact-field contact-area" />
                  </label>
                  <Button type="submit" className="group mt-8">
                    <SlideLabel>Anotar consulta</SlideLabel>
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-dark-tan" aria-labelledby="talk-heading">
        <div className="mx-auto grid w-full max-w-[1360px] gap-16 px-4 py-24 md:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-0 lg:py-32">
          <div>
            <h2 id="talk-heading" className="max-w-[14em] font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] lg:text-[3.5rem]">
              Si preferís hablar de la obra.
            </h2>
            <p className="mt-6 max-w-md text-xl leading-[1.5]">Todavía no hay teléfono ni correo publicados. El canal abierto es Instagram.</p>
            <div className="mt-12">
              <h3 className="font-mono text-xs uppercase tracking-[0.36em] text-grey">Canal</h3>
              <a
                className="mt-3 inline-block font-heading text-[2rem] font-semibold uppercase text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                href={brand.socials[0].href}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="lg:text-right">
            <h3 className="font-mono text-xs uppercase tracking-[0.36em] text-grey">Base</h3>
            <p className="mt-3 text-xl leading-[1.5]">
              Villa Carlos Paz
              <br />
              Córdoba, Argentina
            </p>
            <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.36em] text-grey">Zona</h3>
            <p className="mt-3 text-xl leading-[1.5]">Córdoba, Santa Fe y provincias vecinas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-base">
      {label}
      {required ? "*" : ""}
      <input name={name} type={type} required={required} placeholder={placeholder} className="contact-field" />
    </label>
  );
}
