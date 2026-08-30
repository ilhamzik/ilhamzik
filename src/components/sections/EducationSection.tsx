import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { GraduationMedalIcon, StudentCardIcon } from "../icons";
import { articles, education, stickyNotes } from "../../data/content";

const accentByLevel: Record<string, string> = {
  sd: "#6b502a",
  smp: "#7a1f1f",
  sma: "#2a4d3a",
  kuliah: "#8f6c39",
};

export function EducationSection() {
  return (
    <Section
      id="education"
      rubric={{ id: "Rubrik Riwayat", en: "Background Column" }}
      headline={{ id: "Jejak Pendidikan", en: "Education Trail" }}
      article={articles.education}
      note={stickyNotes.education}
    >
      <div className="flex flex-wrap justify-center items-end gap-8 sm:gap-12">
        {education.map((entry) => (
          <div key={entry.id} className="flex flex-col items-center gap-3">
            <EvidenceItem caseFile={entry} size={entry.level === "kuliah" ? 100 : 160} tilt={undefined}>
              {entry.level === "kuliah" ? (
                <GraduationMedalIcon className="w-full h-full" />
              ) : (
                <StudentCardIcon className="w-full h-full" accent={accentByLevel[entry.level]} />
              )}
            </EvidenceItem>
            <span className="font-typewriter text-[11px] uppercase tracking-widest text-ink-500/70">
              {entry.level}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
