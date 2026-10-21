import { Button } from "../components/Button";
import { coverage } from "../content/site";

export function CoveragePage() {
  return (
    <div className="bg-tan pt-28 md:pt-36">
      <section className="mx-auto max-w-[1360px] px-4 pb-16 md:px-6" aria-labelledby="coverage-heading">
        <h1 id="coverage-heading" className="max-w-[14em] font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] md:text-[4rem]">
          Desde Villa Carlos Paz, hacia la región.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-[1.5]">
          BMP trabaja pisos de hormigón en Córdoba, Santa Fe y provincias vecinas. El radio exacto de cada obra se confirma al consultarla: no publicamos un mapa de clientes.
        </p>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 pb-20 md:px-6" aria-labelledby="places-heading">
        <h2 id="places-heading" className="font-heading text-[2rem] font-semibold uppercase leading-[1.2] md:text-[2.5rem]">
          Dónde se mueve la obra
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {coverage.map((name) => (
            <li key={name} className="border-b border-line py-3 font-heading uppercase">
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink py-20 text-tan" aria-labelledby="types-heading">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start gap-8 px-4 md:px-6">
          <h2 id="types-heading" className="max-w-[16em] font-heading text-[2.4rem] font-semibold uppercase leading-[1.2] md:text-[3.5rem]">
            El tipo de piso está en obras.
          </h2>
          <p className="max-w-xl text-xl leading-[1.5] text-tan/80">Esta página es el radio de trabajo. Los usos del hormigón se leen aparte, sin repetirlos acá.</p>
          <div className="flex flex-wrap gap-4">
            <Button href="/projects">Tipos de obra</Button>
            <Button href="/contact">Consultar una obra</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <article className="bg-tan px-4 pb-24 pt-32 md:px-6">
      <div className="mx-auto max-w-[760px]">
        <h1 className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.1] md:text-[3.5rem]">Privacidad</h1>
        <p className="mt-6 text-xl leading-[1.5]">
          Este texto es provisorio. BMP Pisos Alisados todavía no publicó una política legal definitiva ni un correo de contacto.
        </p>
        <h2 className="mt-10 font-heading text-[1.6rem] font-semibold uppercase">Qué hace este sitio hoy</h2>
        <p className="mt-3 text-lg leading-[1.5]">
          Los formularios no envían la información a un servidor. El mensaje se queda en el navegador de quien lo escribe. No hay cuentas, pagos ni un registro de usuarios.
        </p>
        <h2 className="mt-8 font-heading text-[1.6rem] font-semibold uppercase">Imágenes</h2>
        <p className="mt-3 text-lg leading-[1.5]">
          Las fotografías de obra son de referencia y no documentan proyectos de BMP. Se van a reemplazar con fotos propias cuando estén disponibles.
        </p>
        <h2 className="mt-8 font-heading text-[1.6rem] font-semibold uppercase">Contacto</h2>
        <p className="mt-3 text-lg leading-[1.5]">
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
