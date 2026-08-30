import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { EvidenceTagIcon } from "../icons";
import { articles, projects } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import type { ProjectEntry } from "../../types";

function ExhibitVisual({ project }: { project: ProjectEntry }) {
  const { t } = useLanguage();
  return (
    <div className="relative w-full h-full">
      <EvidenceTagIcon className="w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center pt-1">
        <span className="font-typewriter text-[9px] text-blood-600 uppercase tracking-widest">{project.tag}</span>
        <span className="font-headline font-bold text-[13px] text-ink-700 mt-1 leading-snug line-clamp-2">
          {t(project.title)}
        </span>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      rubric={{ id: "Rubrik Bukti", en: "Evidence Column" }}
      headline={{ id: "Ruang Bukti: Proyek", en: "Exhibit Room: Projects" }}
      article={articles.projects}
    >
      <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
        {projects.map((project, i) => (
          <div key={project.id} className="flex flex-col items-center gap-2">
            <EvidenceItem caseFile={project} width={180} height={120} tilt={i % 2 === 0 ? -2 : 3}>
              <ExhibitVisual project={project} />
            </EvidenceItem>
            <div className="flex flex-wrap justify-center gap-1 max-w-[180px]">
              {project.techStack.slice(0, 3).map((tech, i) => (
                <span
                  key={`${project.id}-tech-${i}`}
                  className="text-[9px] font-typewriter px-1.5 py-0.5 bg-ink-700 text-paper-50 rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
