import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { useMap } from "../../context/MapContext";
import { useCaseFile } from "../../context/CaseFileContext";
import { useNightShift } from "../../context/NightShiftContext";
import { NODES, NODE_LABELS, QUICK_NAV_ORDER } from "./mapLayout";
import { StampMark } from "../icons";
import { DetectiveGuide } from "./DetectiveGuide";

/**
 * Fixed controls that float on top of the pannable map regardless of where
 * the player has dragged to: language toggle, quick-travel pins, a recenter
 * button, a case-completion meter, and a one-time hint nudging people to
 * start dragging.
 */
export function Hud() {
  const { lang, toggle, t } = useLanguage();
  const { recenterOn, alignTopOn, hasInteracted } = useMap();
  const { openedCount, totalCount, justCompleted, dismissCompletion } = useCaseFile();
  const { active: nightActive, toggle: toggleNight } = useNightShift();
  const home = NODES.home;

  return (
    <>
      <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => alignTopOn(home.x + home.width / 2, home.y)}
            className="w-10 h-10 rounded-full bg-blood-600 text-paper-50 shadow-pinned hover:bg-blood-500 transition-colors flex items-center justify-center text-lg"
            aria-label={lang === "id" ? "Kembali ke profil utama" : "Back to main profile"}
            title={lang === "id" ? "Kembali ke profil utama" : "Back to main profile"}
          >
            ⌂
          </button>
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-ink-700 text-paper-50 font-typewriter text-xs shadow-pinned hover:bg-ink-500 transition-colors"
            aria-label="Toggle language"
          >
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            type="button"
            onClick={toggleNight}
            className={`w-10 h-10 rounded-full shadow-pinned flex items-center justify-center text-lg transition-colors ${
              nightActive ? "bg-yellow-500 text-ink-900" : "bg-ink-700 text-paper-50 hover:bg-ink-500"
            }`}
            aria-label={lang === "id" ? "Mode Night Shift" : "Night Shift mode"}
            title={lang === "id" ? "Mode Night Shift" : "Night Shift mode"}
          >
            🔦
          </button>
        </div>

        <div
          className="bg-paper-100/95 text-ink-700 rounded-sm shadow-pinned px-3 py-1.5 text-right"
          title={lang === "id" ? "Berkas yang sudah dibongkar" : "Case files opened"}
        >
          <p className="font-typewriter text-[9px] uppercase tracking-widest text-ink-500/70">
            {lang === "id" ? "Kasus Terbongkar" : "Cases Solved"}
          </p>
          <p className="font-typewriter text-sm font-bold">
            {openedCount}/{totalCount}
          </p>
          <div className="w-24 h-1 bg-ink-500/20 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blood-600 transition-all duration-500"
              style={{ width: `${(openedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 z-40 flex flex-wrap gap-1.5 max-w-[210px] sm:max-w-[260px]">
        {QUICK_NAV_ORDER.map((id) => {
          const n = NODES[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() =>
                id === "home" ? alignTopOn(n.x + n.width / 2, n.y) : recenterOn(n.pin.x, n.pin.y)
              }
              className="quicknav-btn text-[10px] font-typewriter uppercase tracking-wide bg-paper-100 text-ink-700 px-2 py-1 rounded-sm shadow-pinned hover:bg-blood-600 hover:text-paper-50 transition-colors"
            >
              {t(NODE_LABELS[id])}
            </button>
          );
        })}
      </div>

      {!hasInteracted && (
        <div className="fixed top-32 sm:top-4 left-1/2 -translate-x-1/2 z-40 bg-ink-700/90 text-paper-50 font-typewriter text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-pinned animate-pulse pointer-events-none whitespace-nowrap">
          {lang === "id" ? "🖱️ Geser peta untuk menjelajah…" : "🖱️ Drag the map to explore…"}
        </div>
      )}

      <DetectiveGuide />

      <AnimatePresence>
        {justCompleted && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissCompletion}
          >
            <motion.div
              className="w-72"
              initial={{ scale: 2.2, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: -6, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <StampMark text={lang === "id" ? "KASUS DITUTUP" : "CASE CLOSED"} />
              <p className="text-center font-typewriter text-paper-50 text-xs mt-4">
                {lang === "id"
                  ? "Semua berkas terbongkar. Investigasi selesai, detektif."
                  : "Every file cracked open. Investigation complete, detective."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
