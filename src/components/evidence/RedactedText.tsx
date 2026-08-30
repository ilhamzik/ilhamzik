import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Bilingual } from "../../types";

/**
 * A line of text hidden behind a black "redacted" bar, ala classified
 * documents. Reveals on hover (desktop) or tap (touch), toggled by click.
 */
export function RedactedText({ text }: { text: Bilingual }) {
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      className="group relative block w-full text-left mt-3 font-typewriter text-xs sm:text-sm"
      aria-label={revealed ? t({ id: "Sembunyikan", en: "Hide" }) : t({ id: "Bongkar redaksi", en: "Reveal redaction" })}
    >
      <span className={revealed ? "text-ink-700" : "text-transparent select-none"}>{t(text)}</span>
      <span
        className={`absolute inset-0 bg-ink-900 rounded-sm transition-opacity duration-300 ${
          revealed ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:opacity-60"
        }`}
      />
      {!revealed && (
        <span className="absolute inset-0 flex items-center justify-center text-paper-50/70 text-[10px] tracking-widest uppercase">
          {t({ id: "hover / klik untuk bongkar", en: "hover / click to reveal" })}
        </span>
      )}
    </button>
  );
}
