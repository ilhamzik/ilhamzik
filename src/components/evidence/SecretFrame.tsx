import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { secretFile } from "../../data/content";
import { SECRET_EVENT } from "./secretFile";
import silhouette from "../../assets/photos/easter-egg-silhouette.png";
import { useDialogFocus } from "../../hooks/useDialogFocus";

/** The frame is hung, then the stamp is slammed, then the label is read. */
const FRAME_SETTLE = 0.34;

/** The placard lines arrive one after another, once the frame has landed. */
const placard: Variants = {
  hidden: {},
  show: { transition: { delayChildren: FRAME_SETTLE, staggerChildren: 0.075 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * The hidden easter egg: an ornate frame holding nothing but a silhouette and
 * a question mark. Opens on Ctrl/Cmd+K, or on the `SECRET_EVENT` that the
 * press-and-hold trigger dispatches (see `useHoldTrigger`), and sits above
 * everything else on the page, night shift and case modal included.
 *
 * Layout note: the frame and its placard sit side by side from 960px up, and
 * the frame is capped against viewport *height* (`max-w-[65vh]`, since its
 * height runs about 1.385x its width). Stacked, the pair came to ~990px tall,
 * so on any laptop shorter than that the panel turned into a scroller, and
 * because `useDialogFocus` moves focus to the dismiss line at the very bottom
 * it opened already scrolled there: measured 273px down at 1366x768, which
 * sheared the top rail, both upper corner ornaments and the whole head off the
 * frame. The reveal is the picture, so the picture has to land whole.
 */
export function SecretFrame() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dialogRef = useDialogFocus(open);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        // Ctrl+K is the browser search shortcut, so claim it explicitly.
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onSecret = () => setOpen((v) => !v);

    window.addEventListener("keydown", onKey);
    window.addEventListener(SECRET_EVENT, onSecret);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(SECRET_EVENT, onSecret);
    };
  }, []);

  // The same lock the case file modal takes: without it the newspaper column
  // behind the backdrop still scrolls under a stray wheel or swipe.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
          <motion.div
            className="absolute inset-0 bg-ink-900/95 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(secretFile.title)}
            className="relative z-10 flex flex-col items-center min-[960px]:flex-row min-[960px]:gap-11 max-h-[94vh] overflow-y-auto no-scrollbar"
            initial={{ opacity: 0, scale: 0.93, y: 30, rotate: -7 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -1.5 }}
            exit={{ opacity: 0, scale: 0.96, y: 14, rotate: -4, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 190, damping: 21, mass: 0.9 }}
          >
            {/* The frame, plus the room its brass plaque needs. The plaque is
                positioned across the lower rail, so it overhangs the frame by
                ~34px without growing it; reserving that here is what keeps
                `max-h-[94vh]` from clipping it. */}
            <div className="shrink-0 w-[min(86vw,340px)] sm:w-[430px] md:w-[500px] max-w-[65vh] pb-[34px]">
              {/* gilt frame moulding */}
              <div
                className="relative w-full p-[18px] sm:p-[22px] rounded-[3px]"
                style={{
                  background:
                    "linear-gradient(135deg, #b8862a 0%, #6b4a12 22%, #d8ab45 46%, #5c4310 70%, #a1701a 88%, #4a3308 100%)",
                  boxShadow:
                    "0 34px 70px -22px rgba(0,0,0,0.9), inset 0 0 0 1.5px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.22)",
                }}
              >
                {/* corner ornaments */}
                {[
                  "top-[6px] left-[6px]",
                  "top-[6px] right-[6px]",
                  "bottom-[6px] left-[6px]",
                  "bottom-[6px] right-[6px]",
                ].map((pos) => (
                  <span
                    key={pos}
                    className={`absolute w-[12px] h-[12px] rotate-45 ${pos}`}
                    style={{
                      background: "linear-gradient(135deg, #f0d68a, #7a5314)",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                    }}
                  />
                ))}

                {/* the plate itself */}
                <div
                  className="relative overflow-hidden"
                  style={{ background: "#0b0906", boxShadow: "inset 0 0 34px rgba(0,0,0,0.95)" }}
                >
                  <svg viewBox="0 0 200 277" className="block w-full" aria-hidden="true">
                    <defs>
                      <radialGradient id="secret-spot" cx="58%" cy="26%" r="68%">
                        <stop offset="0%" stopColor="#9c9a95" />
                        <stop offset="30%" stopColor="#605e5a" />
                        <stop offset="64%" stopColor="#26251f" />
                        <stop offset="100%" stopColor="#0a0a09" />
                      </radialGradient>
                      <linearGradient id="secret-figure" x1="0.2" y1="0" x2="0.8" y2="1">
                        <stop offset="0%" stopColor="#241d16" />
                        <stop offset="60%" stopColor="#120e0a" />
                        <stop offset="100%" stopColor="#0c0907" />
                      </linearGradient>
                    </defs>

                    {/* one lamp, somewhere off frame */}
                    <rect width="200" height="277" fill="url(#secret-spot)" />

                    {/* The figure. Derived from a photo, but only as a shape:
                        everything above the shoulder line is redrawn generically
                        and the outline is blurred back to a cast shadow, so the
                        person is not identifiable. See the recipe in CLAUDE.md. */}
                    <image
                      href={silhouette}
                      x="0"
                      y="0"
                      width="200"
                      height="277"
                      preserveAspectRatio="xMidYMax meet"
                      opacity="0.97"
                    />

                    {/* the only thing actually on file */}
                    <text
                      x="120"
                      y="98"
                      textAnchor="middle"
                      fontFamily="'Playfair Display', serif"
                      fontWeight="700"
                      fontSize="66"
                      fill="#efece4"
                      opacity="0.88"
                    >
                      ?
                    </text>
                  </svg>

                  {/* Stamp, slammed across the plate once the frame has settled.
                      The wrapper owns the centring so the slam is free to drive
                      `transform` on its own. */}
                  <span className="absolute bottom-[18px] left-1/2 -translate-x-1/2 pointer-events-none">
                    <motion.span
                      className="block font-typewriter text-[12px] sm:text-[13px] tracking-[0.3em] text-blood-500 border-2 border-blood-500/70 rounded-[2px] px-2.5 py-1"
                      style={{ background: "rgba(11,9,6,0.55)" }}
                      initial={{ opacity: 0, scale: 2.6, rotate: -17 }}
                      animate={{ opacity: 1, scale: 1, rotate: -7 }}
                      transition={{ delay: FRAME_SETTLE, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      {t(secretFile.stamp)}
                    </motion.span>
                  </span>
                </div>

                {/* engraved brass plaque on the lower rail */}
                <div className="absolute -bottom-[18px] sm:-bottom-[22px] left-1/2 -translate-x-1/2 translate-y-1/2">
                  <span
                    className="block font-typewriter text-[9px] sm:text-[10px] tracking-[0.24em] text-[#3a2c0d] px-3.5 py-[4px] rounded-[1px] whitespace-nowrap"
                    style={{
                      background: "linear-gradient(180deg, #e6c66f, #a1701a)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.5)",
                    }}
                  >
                    {t(secretFile.tag)}
                  </span>
                </div>
              </div>
            </div>

            {/* The placard: under the frame when stacked, beside it as a
                gallery wall label once there is room. */}
            <motion.div
              variants={placard}
              initial="hidden"
              animate="show"
              className="mt-4 sm:mt-6 min-[960px]:mt-0 w-[min(86vw,340px)] min-[960px]:w-[300px] shrink-0 text-center min-[960px]:text-left rotate-[1.5deg]"
            >
              <motion.p
                variants={line}
                className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-blood-500/80"
              >
                {t(secretFile.rubric)}
              </motion.p>
              <motion.h3
                variants={line}
                className="font-headline text-2xl sm:text-4xl font-black text-paper-100 mt-1.5 leading-none tracking-wide"
              >
                {t(secretFile.title)}
              </motion.h3>
              <motion.p
                variants={line}
                className="font-typewriter text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-paper-200/55 mt-2"
              >
                {t(secretFile.subtitle)}
              </motion.p>
              <motion.p variants={line} className="font-hand text-[15px] text-paper-200/70 mt-1">
                {t(secretFile.caption)}
              </motion.p>

              <div className="mt-3 space-y-2 max-w-[300px] mx-auto min-[960px]:mx-0">
                {secretFile.body.map((para, i) => (
                  <motion.p
                    key={i}
                    variants={line}
                    className="font-body text-[11.5px] leading-relaxed text-paper-200/65"
                  >
                    {t(para)}
                  </motion.p>
                ))}
              </div>

              <motion.button
                variants={line}
                type="button"
                onClick={close}
                className="mt-4 font-typewriter text-[9px] uppercase tracking-[0.18em] text-paper-200/45 border-b border-dotted border-paper-200/25 pb-0.5"
              >
                {t(secretFile.dismiss)}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
