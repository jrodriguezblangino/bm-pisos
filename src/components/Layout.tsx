import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { afterLoader, watchScrollFades } from "../viewport";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const node = document.querySelector(hash);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    let stop = () => {};
    const cancelWait = afterLoader(() => {
      stop = watchScrollFades();
    });
    return () => {
      cancelWait();
      stop();
    };
  }, [pathname]);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
