import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlideLabel } from "./Button";
import { brand, footerColumns } from "../content/site";

function replaySplash(pathname: string, navigate: ReturnType<typeof useNavigate>) {
  window.scrollTo(0, 0);
  if (pathname === "/") {
    window.dispatchEvent(new Event("bmp-replay"));
    return;
  }
  navigate("/");
}

export function Footer() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <footer className="footer-band bg-blue text-tan">
      <div className="footer-wrap mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="footer-links">
          {footerColumns.map((column) => (
            <div key={column.title} className="footer-col">
              <h3 className="font-mono text-sm uppercase tracking-[0.36em]">
                <span className="text-orange">[{column.index}]</span> {column.title}
              </h3>
              <ul className="footer-list">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link to={link.href} className="footer-link group">
                      <SlideLabel>{link.label}</SlideLabel>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer-col">
            <h3 className="font-mono text-sm uppercase tracking-[0.36em]">
              <span className="text-orange">[04]</span> Contacto
            </h3>
            <div className="footer-list">
              <Link to="/contact" className="footer-link group">
                <SlideLabel>Escribinos</SlideLabel>
              </Link>
              {brand.offices.map((office) => (
                <a key={office.label} href={office.map} target="_blank" rel="noreferrer" className="footer-place">
                  <span className="font-mono text-xs uppercase tracking-[0.36em]">{office.label}</span>
                  <span className="footer-link">
                    {office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-social text-orange">
            {brand.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                {social.label === "WhatsApp" ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 13.87c-.24.68-1.4 1.3-1.94 1.38-.5.07-1.12.1-1.81-.11-.41-.13-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.91-4.35-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39 1.02-.39.12 0 .23 0 .33.01.29.01.44.03.63.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.41.5-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.89 1.05.93 1.94 1.23 2.21 1.36.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.54.73 1.8.86.27.13.44.2.51.31.07.11.07.64-.17 1.32Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        <button type="button" className="footer-mark" onClick={() => replaySplash(pathname, navigate)}>
          BM Pisos.
        </button>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BMP Pisos Alisados. Villa Carlos Paz, Córdoba.</p>
          <Link to="/privacy-policy" className="footer-legal">
            Privacidad
          </Link>
          <a className="footer-credit" href="https://github.com/jrodriguezblangino" target="_blank" rel="noreferrer">
            desarrollado por JRB
            <svg className="footer-github" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
