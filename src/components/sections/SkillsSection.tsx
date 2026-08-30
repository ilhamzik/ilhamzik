import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { FingerprintIcon } from "../icons";
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

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <Section
      id="skills"
      rubric={{ id: "Rubrik Identifikasi", en: "Identification Column" }}
      headline={{ id: "Berkas Sidik Jari: Keahlian", en: "Fingerprint Files: Skills" }}
      article={articles.skills}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8">
        {skills.map((skill) => {
          const logo = SKILL_LOGOS[skill.id];
          const clarity = skill.proficiency / 5;
          return (
            <div key={skill.id} className="flex flex-col items-center gap-2">
              <EvidenceItem
                caseFile={skill}
                tilt={0}
                size={84}
                className="bg-paper-100 rounded-full p-3 shadow-pinned"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={skill.title.id}
                    className="w-full h-full object-contain"
                    style={{ opacity: 0.35 + clarity * 0.65 }}
                  />
                ) : (
                  <FingerprintIcon className="w-full h-full" clarity={clarity} />
                )}
              </EvidenceItem>
              <span className="font-typewriter text-[11px] text-ink-700 text-center leading-tight">
                {t(skill.title)}
              </span>
              {!logo && (
                <span className="font-hand text-[11px] text-ink-500/60 -mt-1">
                  {t({ id: "kejelasan sidik jari", en: "print clarity" })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="max-w-lg mx-auto mt-10 border-t border-dashed border-ink-500/30 pt-4 text-center">
        <p className="font-body text-xs text-ink-500/70 leading-relaxed">{t(otherSkills.soft)}</p>
        <p className="font-body text-xs text-ink-500/70 leading-relaxed mt-1">{t(otherSkills.languages)}</p>
      </div>
    </Section>
  );
}
