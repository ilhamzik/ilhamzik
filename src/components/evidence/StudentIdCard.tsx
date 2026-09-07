import { useLanguage } from "../../context/LanguageContext";
import type { EducationEntry } from "../../types";

interface StudentIdCardProps {
  entry: EducationEntry;
  accent: string;
}

/**
 * Deterministic pseudo-barcode: widths derived from the entry id so the same
 * card always prints the same bars (no `Math.random()`, which would reshuffle
 * on every re-render and make the card look like it's flickering).
 */
function barcodeBars(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff;
  const bars: number[] = [];
  for (let i = 0; i < 30; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    bars.push(1 + ((h >> 8) % 3));
  }
  return bars;
}

/**
 * A school student card ("kartu pelajar") built out of the real crest the
 * entry carries, rather than a generic illustrated placeholder: header band
 * in the school's accent colour, crest in the photo window, typed data rows,
 * signature line and a printed barcode along the bottom.
 *
 * Note the explicit `text-left`: this renders inside EvidenceItem's <button>,
 * and a button's UA default is `text-align: center`, which Tailwind preflight
 * does not reset — without this the typed rows drift to the middle.
 */
export function StudentIdCard({ entry, accent }: StudentIdCardProps) {
  const { t } = useLanguage();
  const bars = barcodeBars(entry.id);
  const gradYear = entry.facts?.[0]?.value;

  return (
    <div
      className="absolute inset-0 rounded-[6px] overflow-hidden border border-ink-500/70 bg-[#f4e8c8] text-left select-none"
      style={{ boxShadow: "inset 0 0 26px rgba(107,80,42,0.3), inset 0 1px 0 rgba(255,255,255,0.55)" }}
    >
      {/* header band */}
      <div
        className="relative flex items-center gap-1.5 px-2 h-[24px]"
        style={{ background: accent, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.24)" }}
      >
        {entry.photoSrc && (
          <span className="shrink-0 w-[17px] h-[17px] rounded-[2px] bg-paper-50/90 flex items-center justify-center overflow-hidden">
            <img
              src={entry.photoSrc}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-[1px]"
            />
          </span>
        )}
        <span className="font-typewriter text-[8px] tracking-[0.2em] text-paper-50/95 leading-none truncate">
          {t({ id: "KARTU PELAJAR", en: "STUDENT CARD" })}
        </span>
        <span className="ml-auto font-typewriter text-[7px] tracking-widest text-paper-50/65 leading-none">
          {t(entry.tag)}
        </span>
      </div>

      <div className="flex gap-2.5 px-2.5 pt-2 pb-[21px] h-[calc(100%-24px)]">
        {/* photo window, holding the real school crest */}
        <div className="relative shrink-0 w-[50px] bg-[#e7d8ae] border border-ink-500/40">
          {entry.photoSrc ? (
            <img
              src={entry.photoSrc}
              alt={t(entry.institution)}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-[3px] sepia-[0.15] contrast-105"
            />
          ) : (
            <svg viewBox="0 0 50 62" className="w-full h-full">
              <circle cx="25" cy="22" r="10" fill="#c8a563" />
              <path d="M7 58 C7 40 15 34 25 34 C35 34 43 40 43 58 Z" fill="#c8a563" />
            </svg>
          )}
          {/* clipped corner, like a card mounted under a plastic tab */}
          <span
            className="absolute -bottom-px -right-px w-[12px] h-[12px]"
            style={{ background: "rgba(28,23,18,0.32)", clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          />
        </div>

        {/* typed data rows */}
        <div className="min-w-0 flex-1 flex flex-col">
          <Row label={t({ id: "NAMA", en: "NAME" })} value="M. ILHAM ZIKRI" />
          <Row label={t({ id: "SEKOLAH", en: "SCHOOL" })} value={t(entry.institution)} clamp />
          <Row label={t({ id: "LULUS", en: "GRADUATED" })} value={gradYear ? t(gradYear) : "—"} />

          {/* signature line, pushed to the bottom of the data column */}
          <div className="mt-auto">
            <span className="font-hand text-[12px] text-blood-600/85 leading-none block -mb-[3px] pl-1.5">
              ilhamzik
            </span>
            <span className="block h-px bg-ink-500/45" />
            <span className="font-typewriter text-[6px] tracking-[0.18em] text-ink-500/60 leading-none block mt-px">
              {t({ id: "TANDA TANGAN", en: "SIGNATURE" })}
            </span>
          </div>
        </div>
      </div>

      {/* printed barcode footer */}
      <div className="absolute bottom-0 left-0 right-0 h-[15px] flex items-end justify-between px-2.5 pb-[3.5px] bg-[#eadec0] border-t border-ink-500/25">
        {bars.map((w, i) => (
          <span
            key={i}
            className="bg-ink-700"
            style={{ width: w, height: i % 4 === 0 ? 9 : 6.5, opacity: 0.75 }}
          />
        ))}
      </div>

      {/* laminate sheen sweeping across the card */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(114deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.05) 26%, rgba(255,255,255,0) 42%, rgba(255,255,255,0.16) 62%, rgba(255,255,255,0) 72%)",
        }}
      />
      {/* age stain in one corner, so no two cards look factory-fresh */}
      <span
        className="absolute -bottom-3 -left-3 w-16 h-16 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(107,80,42,0.22) 0%, rgba(107,80,42,0) 70%)" }}
      />
    </div>
  );
}

function Row({ label, value, clamp = false }: { label: string; value: string; clamp?: boolean }) {
  return (
    <div className="leading-none mb-[3px]">
      <span className="font-typewriter text-[6px] tracking-[0.18em] text-ink-500/55 block">{label}</span>
      <span
        className={`font-typewriter text-[9px] text-ink-700 block leading-[1.15] ${
          clamp ? "line-clamp-2" : "truncate"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
