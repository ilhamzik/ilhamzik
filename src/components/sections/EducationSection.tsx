import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { StudentIdCard } from "../evidence/StudentIdCard";
import { GraduationMedalIcon } from "../icons";
import { articles, education, stickyNotes } from "../../data/content";
import uiMakara from "../../assets/photos/ui-makara-engraved.png";
import { useLanguage } from "../../context/LanguageContext";
import type { Bilingual } from "../../types";

/**
 * Indonesian school uniform colours, per the user's note: SD wears red,
 * SMP navy blue, SMA grey. Shades are pulled a little darker/duller than
 * the literal uniform so they still sit on aged newsprint.
 */
const accentByLevel: Record<string, string> = {
  sd: "#b02a2a",
  smp: "#1f3d7a",
  sma: "#5c626b",
  kuliah: "#8f6c39",
};

/** Full-word rubric under each card — "sd" alone read like a debug label. */
const captionByLevel: Record<string, Bilingual> = {
  sd: { id: "Sekolah Dasar", en: "Elementary" },
  smp: { id: "SMP", en: "Junior High" },
  sma: { id: "SMA", en: "Senior High" },
  kuliah: { id: "Universitas", en: "University" },
};

export function EducationSection() {
  const { t } = useLanguage();

  return (
    <Section
      id="education"
      rubric={{ id: "Rubrik Riwayat", en: "Background Column" }}
      headline={{ id: "Jejak Pendidikan", en: "Education Trail" }}
      article={articles.education}
      note={stickyNotes.education}
    >
      <div className="flex flex-wrap justify-center items-end gap-x-8 gap-y-12 sm:gap-x-12">
        {education.map((entry) => {
          const isDegree = entry.level === "kuliah";
          return (
            <div key={entry.id} className="flex flex-col items-center">
              <EvidenceItem
                caseFile={entry}
                width={isDegree ? 108 : 216}
                height={isDegree ? 158 : 136}
                tilt={undefined}
              >
                {isDegree ? (
                  <GraduationMedalIcon
                    className="w-full h-full"
                    emblem={uiMakara}
                    emblemLabel="Universitas Indonesia"
                  />
                ) : (
                  <StudentIdCard entry={entry} accent={accentByLevel[entry.level]} />
                )}
              </EvidenceItem>

              {/* filing caption, typed onto the board under the card */}
              <div className="mt-3 flex flex-col items-center gap-0.5">
                <span className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-ink-500/75">
                  {t(captionByLevel[entry.level])}
                </span>
                <span className="h-px w-8 bg-ink-500/25" />
                <span className="font-typewriter text-[9px] tracking-widest text-blood-600/70">
                  {t(entry.tag)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
