import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCaseFile } from "../../context/CaseFileContext";

const HINTS_EARLY = [
  { id: "Coba klik lencana atau kartu yang tertempel, detektif.", en: "Try clicking a badge or card pinned around here, detective." },
  { id: "Ada catatan post-it yang bisa dibuka juga, lho.", en: "There are post-it notes you can open too, you know." },
];
const HINTS_MID = [
  { id: "Bagus. Masih ada beberapa berkas yang belum dibongkar.", en: "Good work. A few files are still unopened." },
  { id: "Ikuti benang merahnya kalau bingung mau ke mana lagi.", en: "Follow the red string if you're not sure where to go next." },
];
const HINTS_DONE = [
  { id: "Semua berkas terbongkar. Kerja bagus, detektif.", en: "Every file's been cracked open. Nice work, detective." },
];

/** A small pinned detective silhouette offering contextual hints. */
export function DetectiveGuide() {
  const { t } = useLanguage();
  const { openedCount, totalCount } = useCaseFile();
  const [dismissed, setDismissed] = useState(false);

  const pool = openedCount === 0 ? HINTS_EARLY : openedCount >= totalCount ? HINTS_DONE : HINTS_MID;
  const hint = useMemo(() => pool[Math.floor(Math.random() * pool.length)], [pool]);

  if (dismissed) {
    return (
      <button
        type="button"
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 right-4 z-40 w-11 h-11 rounded-full bg-ink-700 shadow-pinned flex items-center justify-center hover:bg-ink-500 transition-colors"
        aria-label={t({ id: "Tampilkan pemandu", en: "Show guide" })}
      >
        <DetectiveSilhouette className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-end gap-2 max-w-[240px] sm:max-w-[280px]">
      <div className="relative bg-paper-100 text-ink-700 text-xs font-typewriter rounded-lg rounded-br-none shadow-pinned px-3 py-2">
        {t(hint)}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blood-600 text-paper-50 text-[10px] flex items-center justify-center shadow"
          aria-label={t({ id: "Sembunyikan pemandu", en: "Hide guide" })}
        >
          ×
        </button>
      </div>
      <DetectiveSilhouette className="w-11 h-11 shrink-0" />
    </div>
  );
}

function DetectiveSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill="#2a241d" />
      <path d="M20 78 C20 58 32 48 50 48 C68 48 80 58 80 78 Z" fill="#100d0a" />
      <circle cx="50" cy="38" r="16" fill="#100d0a" />
      <path d="M28 34 Q50 14 72 34 L72 30 Q50 16 28 30 Z" fill="#100d0a" />
      <path d="M22 32 Q50 8 78 32 L78 26 Q50 4 22 26 Z" fill="#100d0a" />
    </svg>
  );
}
