import { useLanguage } from "../../context/LanguageContext";
import type { ExperienceEntry } from "../../types";

/**
 * A ruled file card for one job on the corkboard: red header rule and left
 * margin rule like real index stock, faint blue writing lines behind the
 * typed entry, the attached photo mounted as a small print, a dog-eared
 * corner, and a rubber stamp when the entry carries one (e.g. the still
 * running Telkom internship, stamped ACTIVE).
 *
 * `text-left` is explicit because this renders inside EvidenceItem's
 * <button>, whose UA default is centred text.
 */
export function DossierCard({ entry }: { entry: ExperienceEntry }) {
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#f4e9cd] border border-ink-500/45 text-left select-none"
      style={{ boxShadow: "inset 0 0 20px rgba(107,80,42,0.22), inset 0 1px 0 rgba(255,255,255,0.6)" }}
    >
      {/* faint blue writing lines, as on real index stock */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(70,110,150,0.15) 0px, rgba(70,110,150,0.15) 1px, transparent 1px, transparent 15px)",
          backgroundPosition: "0 36px",
        }}
      />
      {/* red margin rule down the left, and the header rule */}
      <span className="absolute top-0 bottom-0 left-[11px] w-px bg-blood-500/30 pointer-events-none" />
      <span className="absolute left-0 right-0 top-[25px] h-[1.5px] bg-blood-500/55 pointer-events-none" />

      {/* header: file number and dates */}
      <div className="relative flex items-baseline gap-2 px-2.5 pt-[6px]">
        <span className="font-typewriter text-[8px] tracking-[0.2em] text-ink-500/60">{t(entry.tag)}</span>
        <span className="ml-auto font-typewriter text-[9px] tracking-wide text-blood-600 whitespace-nowrap">
          {t(entry.period)}
        </span>
      </div>

      <div className="relative flex gap-2.5 px-2.5 pt-[8px]">
        {/* the attached print, mounted on the card */}
        <div
          className="shrink-0 w-[54px] h-[54px] bg-[#fbf6e8] p-[3px] pb-[7px] -rotate-2"
          style={{ boxShadow: "0 2px 4px rgba(20,14,8,0.35)" }}
        >
          {entry.photoSrc ? (
            <img
              src={entry.photoSrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover sepia-[0.3] contrast-105"
            />
          ) : (
            <div className="w-full h-full bg-[#e0d0a4] flex items-center justify-center">
              <span className="font-typewriter text-[5.5px] leading-tight text-ink-500/60 text-center px-px">
                {t({ id: "TANPA FOTO", en: "NO PHOTO" })}
              </span>
            </div>
          )}
        </div>

        {/* the entry itself, typed onto the ruled lines */}
        <div className="min-w-0 flex-1">
          <p className="font-headline font-bold text-[13px] text-ink-700 leading-[1.12] line-clamp-2">
            {t(entry.role)}
          </p>
          <p className="font-body text-[9.5px] text-ink-500/85 mt-[4px] leading-snug line-clamp-2">
            {t(entry.organization)}
          </p>
        </div>
      </div>

      {/* rubber stamp, slammed across the lower right */}
      {entry.stamp && (
        <span
          className="absolute bottom-[7px] right-[6px] font-typewriter text-[9px] tracking-[0.18em] text-stamp-500/85 border-[1.5px] border-stamp-500/70 rounded-[2px] px-1.5 py-[2px] -rotate-[7deg] pointer-events-none"
          style={{ boxShadow: "inset 0 0 3px rgba(122,31,31,0.25)" }}
        >
          {t(entry.stamp)}
        </span>
      )}

      {/* dog-eared bottom-left corner */}
      <span
        className="absolute bottom-0 left-0 w-[15px] h-[15px] pointer-events-none"
        style={{ background: "#d9c69a", clipPath: "polygon(0 100%, 100% 100%, 0 0)" }}
      />
      <span
        className="absolute bottom-0 left-0 w-[15px] h-[15px] pointer-events-none"
        style={{
          background: "linear-gradient(45deg, rgba(20,14,8,0.28), rgba(20,14,8,0) 60%)",
          clipPath: "polygon(0 100%, 100% 100%, 0 0)",
        }}
      />
    </div>
  );
}
