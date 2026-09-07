import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { PrintCard } from "../evidence/PrintCard";
import { articles, otherSkills, skills } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";

import pythonLogo from "../../assets/logos/python.svg";
import gitLogo from "../../assets/logos/git.svg";
import sqliteLogo from "../../assets/logos/sqlite.svg";
import scikitLearnLogo from "../../assets/logos/scikitlearn.svg";
import excelLogo from "../../assets/logos/excel.svg";
import powerbiLogo from "../../assets/logos/powerbi.svg";

/**
 * Official brand logos for skills that are actual named tools/products.
 * Skills that are general categories, not a brand (e.g. "Data Cleaning",
 * "Statistics & Machine Learning"), have no real official mark — those
 * keep the fingerprint-swirl illustration instead of a fabricated logo.
 */
const SKILL_LOGOS: Record<string, string> = {
  "skill-sql": sqliteLogo, // no logo exists for the SQL language itself; SQLite is the actual engine used
  "skill-python": pythonLogo,
  "skill-scikit": scikitLearnLogo,
  "skill-powerbi": powerbiLogo,
  "skill-excel": excelLogo,
  "skill-git": gitLogo,
};

/**
 * Branded tools first, then the two general categories that have no official
 * mark, so the fingerprint-swirl cards sit together at the end of the row
 * instead of being scattered between logos (user's call). `sort` is stable,
 * so each group keeps its content.ts order.
 */
const orderedSkills = [...skills].sort(
  (a, b) => (SKILL_LOGOS[a.id] ? 0 : 1) - (SKILL_LOGOS[b.id] ? 0 : 1)
);

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <Section
      id="skills"
      rubric={{ id: "Rubrik Identifikasi", en: "Identification Column" }}
      headline={{ id: "Berkas Sidik Jari: Keahlian", en: "Fingerprint Files: Skills" }}
      article={articles.skills}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-7 sm:gap-x-8 justify-items-center">
        {orderedSkills.map((skill) => (
          <div key={skill.id} className="flex flex-col items-center">
            <EvidenceItem caseFile={skill} tilt={0} width={106} height={124}>
              <PrintCard skill={skill} logo={SKILL_LOGOS[skill.id]} />
            </EvidenceItem>
            <span className="font-typewriter text-[11px] text-ink-700 text-center leading-tight mt-2.5 max-w-[112px]">
              {t(skill.title)}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-lg mx-auto mt-10 border-t border-dashed border-ink-500/30 pt-4 text-center">
        <p className="font-body text-xs text-ink-500/70 leading-relaxed">{t(otherSkills.soft)}</p>
        <p className="font-body text-xs text-ink-500/70 leading-relaxed mt-1">{t(otherSkills.languages)}</p>
      </div>
    </Section>
  );
}
