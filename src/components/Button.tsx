import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "blue" | "outline" | "text";
  className?: string;
  type?: "button" | "submit";
  external?: boolean;
};

const variants = {
  blue: "bg-blue text-tan hover:bg-[#00498a]",
  outline: "border border-tan/80 text-tan hover:bg-tan hover:text-blue",
  text: "text-blue px-0 py-0",
};

export function Button({
  children,
  href,
  onClick,
  variant = "blue",
  className = "",
  type = "button",
  external,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-[4px] px-5 py-3 font-heading text-[15px] uppercase leading-none tracking-[0.01em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${variants[variant]} ${className}`;

  if (href && external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link className={classes} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export function SlideLabel({ children }: { children: string }) {
  const words = children.split(" ");
  const count = words.reduce((total, word) => total + word.length, 0);
  const step = count > 1 ? 0.15 / (count - 1) : 0;
  let index = 0;

  return (
    <span className="slide-link" style={{ "--step": `${step}s` } as CSSProperties}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="slide-words">
        {words.map((word, wordIndex) => (
          <span className="slide-word" key={`${word}-${wordIndex}`}>
            {wordIndex > 0 && <span className="slide-space"> </span>}
            {[...word].map((char) => {
              const letter = index++;
              return (
                <span className="slide-char" key={letter} style={{ "--i": letter } as CSSProperties}>
                  <span>{char}</span>
                  <span>{char}</span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </span>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" className={`h-full w-full ${className}`}>
      <path d="M5 12H18M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
