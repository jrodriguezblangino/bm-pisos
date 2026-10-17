import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage, CareerPage, CareersPage } from "./pages/AboutPage";
import { CoveragePage, PrivacyPage } from "./pages/CompanyPages";
import { ContactPage, ServicesPage } from "./pages/ServicesPage";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";
import { ProjectsPage } from "./pages/ProjectsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/career/:slug" element={<CareerPage />} />
        <Route path="/cobertura" element={<CoveragePage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
      </Routes>
    </Layout>
  );
}
