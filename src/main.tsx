import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const path = window.location.pathname.replace(/\/$/, "");
if ((path === basename || path === "") && !window.location.hash) {
  window.scrollTo(0, 0);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
