import { Link } from "react-router-dom";
import { SlideLabel } from "./Button";

type ClosingBandProps = {
  id: string;
  title: string;
  stroke: string;
  body: string;
  image: string;
};

export function ClosingBand({ id, title, stroke, body, image }: ClosingBandProps) {
  return (
    <section className="relative overflow-hidden text-tan" aria-labelledby={id}>
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[rgb(29_29_29/0.6)]" />
      </div>
      <div className="cta-fade" aria-hidden="true">
        <div className="cta-fade-soft" />
      </div>
      <div className="scroll-fade relative z-[2] mx-auto flex w-full max-w-[48.875rem] flex-col items-center px-5 pb-28 pt-[18rem] text-center min-[768px]:px-6 min-[768px]:pb-40 min-[768px]:pt-[22rem] min-[992px]:pt-[26rem]">
        <h2 id={id} className="font-heading text-[2.5rem] font-semibold uppercase leading-[1.2] min-[768px]:text-[3.5rem] min-[992px]:text-[4rem]">
          {title}
          <span className="mt-1 block">{stroke}</span>
        </h2>
        <p className="mt-6 max-w-[37rem] text-xl leading-[1.5]">{body}</p>
        <div className="cta-actions mt-8">
          <Link to="/contact" className="cta-btn cta-btn-primary group">
            <SlideLabel>Pedir una visita</SlideLabel>
          </Link>
          <Link to="/careers" className="cta-btn cta-btn-dark group">
            <SlideLabel>Sumate a BMP</SlideLabel>
          </Link>
        </div>
      </div>
    </section>
  );
}
