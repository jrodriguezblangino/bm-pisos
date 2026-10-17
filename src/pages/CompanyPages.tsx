import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { coverage, projects } from "../content/site";

export function CoveragePage() {
  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto max-w-[980px] px-5 pb-16 md:px-8" aria-labelledby="coverage-heading">
        <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-orange">Zona</p>
        <h1 id="coverage-heading" className="mt-4 font-heading text-[2.8rem] uppercase leading-[1] md:text-[4.2rem]">
          Desde Villa Carlos Paz, hacia la región.
        </h1>
        <p className="mt-6 text-[18px]">
          BMP trabaja pisos de hormigón en Córdoba, Santa Fe y provincias vecinas. El radio exacto de cada obra se confirma al consultarla: no publicamos un mapa de clientes.
        </p>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 pb-16 md:px-8" aria-labelledby="places-heading">
        <h2 id="places-heading" className="font-heading text-[2rem] uppercase">
          Dónde se mueve la obra
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {coverage.map((name) => (
            <li key={name} className="border-b border-line py-3 font-heading uppercase">
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink py-16 text-tan" aria-labelledby="types-heading">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <h2 id="types-heading" className="font-heading text-[2.4rem] uppercase">
            El tipo de piso
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {projects.slice(0, 3).map((item) => (
              <article key={item.slug}>
                <h3 className="font-heading text-[1.4rem] uppercase">{item.title}</h3>
                <p className="mt-3 text-tan/80">{item.summary}</p>
                <Link to={`/project/${item.slug}`} className="mt-4 inline-block font-heading uppercase text-orange">
                  Ver
                </Link>
              </article>
            ))}
          </div>
          <Button href="/contact" className="mt-10">
            Consultar una obra
          </Button>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <article className="bg-tan px-5 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[760px]">
        <h1 className="font-heading text-[3rem] uppercase">Privacidad</h1>
        <p className="mt-6">
          Este texto es provisorio. BMP Pisos Alisados todavía no publicó una política legal definitiva ni un correo de contacto.
        </p>
        <h2 className="mt-8 font-heading text-[1.6rem] uppercase">Qué hace este sitio hoy</h2>
        <p className="mt-3">
          Los formularios no envían la información a un servidor. El mensaje se queda en el navegador de quien lo escribe. No hay cuentas, pagos ni un registro de usuarios.
        </p>
        <h2 className="mt-8 font-heading text-[1.6rem] uppercase">Imágenes</h2>
        <p className="mt-3">
          Las fotografías de obra son de referencia y no documentan proyectos de BMP. Se van a reemplazar con fotos propias cuando estén disponibles.
        </p>
        <h2 className="mt-8 font-heading text-[1.6rem] uppercase">Contacto</h2>
        <p className="mt-3">
          Hasta que haya un correo confirmado, el canal público es{" "}
          <a className="text-orange" href="https://www.instagram.com/bmpisosalisados/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          .
        </p>
      </div>
    </article>
  );
}
