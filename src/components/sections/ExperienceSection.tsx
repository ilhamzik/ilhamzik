import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { PushpinIcon } from "../icons";
import { articles, experience, stickyNotes } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import type { ExperienceEntry } from "../../types";

function IndexCard({ entry }: { entry: ExperienceEntry }) {
  const { t } = useLanguage();
  return (
    <div className="w-full h-full bg-[#f2e6c4] border border-ink-500/30 shadow-pinned p-3 flex flex-col justify-center text-left">
      <p className="font-typewriter text-[10px] text-blood-600 uppercase tracking-widest">{t(entry.period)}</p>
      <p className="font-headline font-bold text-sm text-ink-700 mt-1 leading-snug">{t(entry.role)}</p>
      <p className="font-body text-xs text-ink-500 mt-0.5">{t(entry.organization)}</p>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      rubric={{ id: "Rubrik Investigasi", en: "Investigation Column" }}
      headline={{ id: "Papan Kasus: Pengalaman", en: "Case Board: Experience" }}
      article={articles.experience}
      note={stickyNotes.experience}
    >
      <div
        className="relative rounded-md p-8 sm:p-12"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #7a5f3f 0%, #6b502a 60%, #5a4322 100%)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* decorative red string connecting the cards */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <line
            x1="12%"
            y1="30%"
            x2="88%"
            y2="65%"
            stroke="#a12e2e"
            strokeWidth="2"
            strokeDasharray="1 0"
            opacity="0.8"
          />
        </svg>

        <div className="relative flex flex-wrap justify-center gap-x-16 gap-y-10">
          {experience.map((entry, i) => (
            <div key={entry.id} className="relative" style={{ marginTop: i % 2 === 1 ? "2.5rem" : 0 }}>
              <PushpinIcon className="w-6 h-6 absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
              <EvidenceItem caseFile={entry} width={190} height={110} tilt={i % 2 === 0 ? -3 : 2}>
                <IndexCard entry={entry} />
              </EvidenceItem>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
