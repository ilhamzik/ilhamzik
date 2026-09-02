import { useLanguage } from "../../context/LanguageContext";
import { useCaseFile } from "../../context/CaseFileContext";
import { useNightShift } from "../../context/NightShiftContext";
import { NODE_LABELS, QUICK_NAV_ORDER } from "../map/mapLayout";

/** Section ids that exist in the stacked column (home has no <section id>). */
export const NAV_IDS = QUICK_NAV_ORDER.filter((id) => id !== "home");

/**
 * One compact fixed header for the mobile scroll view: an INDEX strip of
 * anchor chips (the one for the section currently under the header is
 * highlighted), then a thin row with the case-completion meter and the
 * language / night-shift toggles. Kept to a single block so the page only
 * needs to clear a known height (see `pt-*` / `scroll-padding-top` on the
 * scroller in MobileView).
 */
export function MobileHud({ activeId = "" }: { activeId?: string }) {
  const { lang, toggle, t } = useLanguage();
  const { openedCount, totalCount } = useCaseFile();
  const { active: nightActive, toggle: toggleNight } = useNightShift();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-ink-700/95 backdrop-blur-sm shadow-pinned">
      <div className="flex gap-1.5 overflow-x-auto px-3 pt-2 pb-1.5 no-scrollbar">
        <span className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-paper-300 self-center shrink-0 pr-1">
          {lang === "id" ? "Indeks" : "Index"}
        </span>
        {NAV_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={`shrink-0 font-typewriter text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm transition-colors ${
              activeId === id
                ? "bg-blood-600 text-paper-50"
                : "bg-paper-100 text-ink-700 active:bg-blood-600 active:text-paper-50"
            }`}
          >
            {t(NODE_LABELS[id])}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-3 pb-2 border-t border-paper-300/15">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-typewriter text-[8px] uppercase tracking-widest text-paper-300/70 shrink-0">
            {lang === "id" ? "Kasus" : "Cases"}
          </span>
          <div className="w-20 h-1 bg-paper-300/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-blood-500 transition-all duration-500"
              style={{ width: `${(openedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="font-typewriter text-[10px] font-bold text-paper-200 shrink-0">
            {openedCount}/{totalCount}
          </span>
        </div>

        <div className="flex gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggle}
            className="w-8 h-8 rounded-full bg-paper-100 text-ink-700 font-typewriter text-[11px] shadow-pinned"
            aria-label="Toggle language"
          >
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            type="button"
            onClick={toggleNight}
            className={`w-8 h-8 rounded-full shadow-pinned flex items-center justify-center text-sm ${
              nightActive ? "bg-yellow-500 text-ink-900" : "bg-paper-100 text-ink-700"
            }`}
            aria-label={lang === "id" ? "Mode Night Shift" : "Night Shift mode"}
          >
            🔦
          </button>
        </div>
      </div>
    </header>
  );
}
