import { useMemo } from "react";
import { useCaseFile } from "../../context/CaseFileContext";
import { useLanguage } from "../../context/LanguageContext";
import type { CaseFile } from "../../types";

const COLORS = [
  { bg: "#f5e17a", tape: "#e3d4a8" },
  { bg: "#f3b6c6", tape: "#e0bfc9" },
  { bg: "#a9d6df", tape: "#c9dde2" },
];

interface StickyNoteProps {
  caseFile: CaseFile;
  className?: string;
  colorIndex?: number;
}

/**
 * A small pinned "post-it" — a lighter-weight alternative to EvidenceItem for
 * attaching a quick side-note or footnote to a block of article text.
 * Clicking it opens the same shared CaseFileModal.
 */
export function StickyNote({ caseFile, className = "", colorIndex }: StickyNoteProps) {
  const { openCase } = useCaseFile();
  const { t } = useLanguage();
  const tilt = useMemo(() => Math.round((Math.random() - 0.5) * 14) - 3, []);
  const color = COLORS[(colorIndex ?? Math.floor(Math.random() * COLORS.length)) % COLORS.length];

  return (
    <button
      type="button"
      onClick={() => openCase(caseFile)}
      className={`group relative w-36 sm:w-44 text-left p-3 pb-4 shadow-pinned hover:scale-105 hover:rotate-0 transition-transform duration-200 ${className}`}
      style={{ background: color.bg, transform: `rotate(${tilt}deg)` }}
    >
      <span
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 opacity-80 rotate-1"
        style={{ background: color.tape }}
      />
      <p className="font-hand text-lg sm:text-xl leading-tight text-ink-800">{t(caseFile.title)}</p>
      <p className="font-hand text-sm text-ink-700/70 mt-1.5">
        {t({ id: "klik buat baca →", en: "click to read →" })}
      </p>
    </button>
  );
}
