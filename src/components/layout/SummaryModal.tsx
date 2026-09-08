import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../context/LanguageContext";
import { caseSummary, profile } from "../../data/content";
import { CaseSummary } from "./CaseSummary";

/**
 * The case summary, as the wanted poster's own case file.
 *
 * It used to sit in the flow of the `home` node, directly under the poster.
 * That made the node about 500px taller than everything around it and pushed
 * the whole lower half of the map down with it, so the top of the world and
 * the bottom of it read as two separate places. As a popup it costs the
 * layout nothing and it lands where somebody would look for it anyway:
 * press the file on the suspect, get the file on the suspect.
 *
 * Deliberately not registered in `CaseFileContext`, so it does not move the
 * case-completion meter. Same call as `SecretFrame`: the meter counts the
 * evidence scattered across the board, and this is a restatement of it.
 *
 * ⚠️ Rendered through a portal onto `document.body`, and it has to be. The
 * trigger lives inside the pannable world, whose `transform` makes it the
 * containing block for `position: fixed` descendants: rendered in place, this
 * overlay sized itself to the world (2950x3780) instead of the viewport and
 * put the panel 1590px down the map, off screen. Any other fixed overlay
 * mounted from inside a section needs the same treatment.
 */
export function SummaryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(caseSummary.rubric)}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#f2e6c4] shadow-case rounded-sm border border-ink-500/20"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Manila folder tab, carrying the case number rather than the
                rubric: the sheet inside already prints the rubric. */}
            <div className="absolute -top-6 left-8 bg-[#d8bd80] px-6 py-1.5 rounded-t-md border border-b-0 border-ink-500/20 text-ink-500 font-typewriter text-xs tracking-widest">
              {profile.caseNumber}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t({ id: "Tutup", en: "Close" })}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-stamp-500 text-paper-50 font-bold text-lg leading-none flex items-center justify-center shadow-pinned hover:scale-110 transition-transform"
            >
              ×
            </button>

            <div className="p-5 sm:p-8">
              <CaseSummary />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
