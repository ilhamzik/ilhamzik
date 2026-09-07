/* DEV-ONLY card specimen sheet. Not part of the shipped site; deleted once
   the per-card visual pass is done. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// the real site locks scroll on <html>; the specimen sheet wants it back
document.documentElement.style.overflow = "auto";
document.body.style.overflow = "auto";
import { LanguageProvider } from "./context/LanguageContext";
import { CaseFileProvider } from "./context/CaseFileContext";
import { EducationSection } from "./components/sections/EducationSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { InterestsSection } from "./components/sections/InterestsSection";
import { ContactSection } from "./components/sections/ContactSection";
import { CaseFileModal } from "./components/evidence/CaseFileModal";

const SECTIONS: Record<string, () => JSX.Element> = {
  education: EducationSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  interests: InterestsSection,
  contact: ContactSection,
};

function Gallery() {
  const q = new URLSearchParams(location.search);
  const which = q.get("s") ?? "education";
  const w = q.get("w");
  const Only = SECTIONS[which];
  return (
    <div className="min-h-screen bg-paper-gradient paper-grain">
      <div className="relative z-10" style={w ? { width: `${w}px` } : undefined}>
        {Only ? <Only /> : Object.values(SECTIONS).map((S, i) => <S key={i} />)}
      </div>
      <CaseFileModal />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <CaseFileProvider>
        <Gallery />
      </CaseFileProvider>
    </LanguageProvider>
  </StrictMode>
);
