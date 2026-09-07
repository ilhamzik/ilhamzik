import { useLanguage } from "../../context/LanguageContext";
import { FingerprintIcon } from "../icons";
import type { SkillEntry } from "../../types";

const ROMAN = ["", "I", "II", "III", "IV", "V"];

interface PrintCardProps {
  skill: SkillEntry;
  /** Official brand mark, when the skill is a real named product. */
  logo?: string;
}

/**
 * A ten-print identification card for one skill: the print box holds either
 * the tool's official mark or the fingerprint swirl, and the ridge-clarity
 * ladder underneath spells out proficiency in a way that works for both
 * (previously only the fingerprint skills carried any proficiency signal,
 * since the logos only varied in opacity).
 *
 * `text-left` is explicit: this renders inside EvidenceItem's <button>,
 * whose UA default is centred text.
 */
export function PrintCard({ skill, logo }: PrintCardProps) {
  const { t } = useLanguage();
  const clarity = skill.proficiency / 5;

  return (
    <div
      className="absolute inset-0 bg-[#f4e8c8] border border-ink-500/50 text-left select-none flex flex-col"
      style={{ boxShadow: "inset 0 0 18px rgba(107,80,42,0.26), inset 0 1px 0 rgba(255,255,255,0.55)" }}
    >
      {/* registration ticks in the corners, as on a real print card */}
      {[
        "top-[3px] left-[3px] border-l border-t",
        "top-[3px] right-[3px] border-r border-t",
        "bottom-[3px] left-[3px] border-l border-b",
        "bottom-[3px] right-[3px] border-r border-b",
      ].map((pos) => (
        <span key={pos} className={`absolute w-[6px] h-[6px] border-ink-500/45 pointer-events-none ${pos}`} />
      ))}

      {/* filing header */}
      <div className="flex items-baseline justify-between px-[9px] pt-[5px]">
        <span className="font-typewriter text-[6px] tracking-[0.16em] text-ink-500/55">{t(skill.tag)}</span>
        <span className="font-typewriter text-[6.5px] tracking-[0.1em] text-blood-600/75">
          {ROMAN[skill.proficiency]}
        </span>
      </div>

      {/* the print itself, rolled onto its box */}
      <div className="relative mx-[9px] mt-[4px] flex-1 border border-ink-500/30 bg-[#ede1bf] overflow-hidden">
        {/* ink smudge under the print, heavier for a crisper record */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, rgba(28,23,18,${0.05 + clarity * 0.09}) 0%, rgba(28,23,18,0) 68%)`,
          }}
        />
        <div className={`absolute inset-0 flex items-center justify-center ${logo ? "p-[7px]" : "p-[3px]"}`}>
          {logo ? (
            <img
              src={logo}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
              style={{ opacity: 0.45 + clarity * 0.55 }}
            />
          ) : (
            <FingerprintIcon className="w-full h-full" clarity={clarity} />
          )}
        </div>
      </div>

      {/* ridge-clarity ladder */}
      <div className="px-[9px] pt-[5px] pb-[6px]">
        <div className="flex gap-[2px]">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className="h-[4px] flex-1 rounded-[1px]"
              style={{
                background: step <= skill.proficiency ? "#7a1f1f" : "transparent",
                border: step <= skill.proficiency ? "none" : "1px solid rgba(28,23,18,0.28)",
                opacity: step <= skill.proficiency ? 0.55 + (step / 5) * 0.45 : 1,
              }}
            />
          ))}
        </div>
        <p className="font-typewriter text-[5.5px] tracking-[0.14em] text-ink-500/50 mt-[3px] leading-none">
          {t({ id: "KEJELASAN SIDIK", en: "RIDGE CLARITY" })}
        </p>
      </div>
    </div>
  );
}
