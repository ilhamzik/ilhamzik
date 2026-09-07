import { useId } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { profile } from "../../data/content";
import type { ProjectEntry } from "../../types";

/**
 * A kraft-paper exhibit tag for one project. The grommet is a real hole
 * (punched through with an SVG mask, so the paper behind actually shows) with
 * a metal eyelet and a length of twine threaded through it; the letter comes
 * from the entry's own tag ("EXHIBIT C" -> "C") so numbering never drifts
 * out of sync with the content file.
 */
export function ExhibitTag({ project }: { project: ProjectEntry }) {
  const { t } = useLanguage();
  const uid = useId().replace(/:/g, "");
  const letter = t(project.tag).split(/\s+/).pop() ?? "?";

  return (
    <div className="absolute inset-0 text-left select-none">
      <svg viewBox="0 0 190 132" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <mask id={`hole-${uid}`}>
            <rect width="190" height="132" fill="#fff" />
            <circle cx="22" cy="23" r="5.6" fill="#000" />
          </mask>
        </defs>

        <g mask={`url(#hole-${uid})`}>
          {/* tag body, top-left corner cut off as tags are */}
          <path
            d="M0 16 L16 0 L189 0 L189 131 L0 131 Z"
            fill="#d7bd85"
            stroke="#8a6a35"
            strokeWidth="1.6"
          />
          {/* kraft fibre: a few flecks and a bottom shading band */}
          <g fill="#8a6a35" opacity="0.22">
            <rect x="42" y="34" width="7" height="1.2" rx="0.6" />
            <rect x="150" y="60" width="9" height="1.2" rx="0.6" transform="rotate(-8 150 60)" />
            <rect x="66" y="104" width="6" height="1.1" rx="0.6" transform="rotate(12 66 104)" />
            <rect x="118" y="20" width="5" height="1.1" rx="0.6" />
          </g>
          <path d="M0 108 L189 108 L189 131 L0 131 Z" fill="#c2a468" opacity="0.45" />
          {/* reinforcement patch around the eyelet */}
          <circle cx="22" cy="23" r="12" fill="#c8ac74" opacity="0.75" />
        </g>

        {/* metal eyelet */}
        <circle cx="22" cy="23" r="7.4" fill="none" stroke="#8d8d8d" strokeWidth="2.8" />
        <circle cx="22" cy="23" r="7.4" fill="none" stroke="#e8e8e8" strokeWidth="0.9" opacity="0.65" />
        <circle cx="22" cy="23" r="6.2" fill="none" stroke="rgba(20,14,8,0.45)" strokeWidth="0.8" />

        {/* twine knotted through the eyelet, the loop hanging off the cut
            corner (deliberately outside the tag body, as a real tie would) */}
        <path
          d="M22 23 C9 16 7 0 20 0.5 C33 2 30 16 22 23"
          fill="none"
          stroke="#8f1f1f"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M22 23 C9 16 7 0 20 0.5 C33 2 30 16 22 23"
          fill="none"
          stroke="#c74a37"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* the knot itself, sitting on the eyelet */}
        <path d="M18 21 L26 25 M26 21 L18 25" stroke="#8f1f1f" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      </svg>

      {/* typed face of the tag */}
      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-start justify-end pt-[9px] pr-3">
          <div className="text-right leading-none">
            <p className="font-typewriter text-[7.5px] tracking-[0.28em] text-ink-500/60">
              {t({ id: "BARANG BUKTI", en: "EXHIBIT" })}
            </p>
            <p className="font-headline font-black text-[30px] text-blood-600/85 leading-[0.85] -mt-px">
              {letter}
            </p>
          </div>
        </div>

        <p className="font-headline font-bold text-[12px] text-ink-700 leading-[1.18] px-3 mt-[3px] line-clamp-3">
          {t(project.title)}
        </p>

        {/* filing footer, on the shaded band */}
        <div className="mt-auto px-3 pb-[7px]">
          <span className="block border-t border-dashed border-ink-500/40 mb-[4px]" />
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-typewriter text-[7px] tracking-[0.14em] text-ink-500/70 whitespace-nowrap">
              {t({ id: "PERKARA", en: "CASE" })} {profile.caseNumber.replace("NO. ", "")}
            </span>
            <span className="font-typewriter text-[7px] tracking-[0.14em] text-ink-500/60">
              {project.capabilities.length} {t({ id: "TEKNIK", en: "TECHNIQUES" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
