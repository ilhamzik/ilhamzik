import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { secretFile } from "../../data/content";
import { SECRET_EVENT } from "./secretFile";
import silhouette from "../../assets/photos/easter-egg-silhouette.png";
import { useDialogFocus } from "../../hooks/useDialogFocus";

/**
 * The hidden easter egg: an ornate frame holding nothing but a silhouette and
 * a question mark. Opens on Ctrl/Cmd+K, or on the `SECRET_EVENT` that the
 * press-and-hold trigger dispatches (see `useHoldTrigger`), and sits above
 * everything else on the page, night shift and case modal included.
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-900/95"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(secretFile.title)}
            className="relative z-10 w-[min(86vw,340px)] sm:w-[430px] md:w-[500px] max-h-[94vh] overflow-y-auto no-scrollbar"
            initial={{ opacity: 0, scale: 0.9, y: 18, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -1.5 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {/* gilt frame moulding */}
            <div
              className="relative p-[18px] sm:p-[22px] rounded-[3px]"
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

                {/* stamp, slammed across the plate */}
                <span
                  className="absolute bottom-[18px] left-1/2 -translate-x-1/2 -rotate-[7deg] font-typewriter text-[12px] sm:text-[13px] tracking-[0.3em] text-blood-500 border-2 border-blood-500/70 rounded-[2px] px-2.5 py-1 pointer-events-none"
                  style={{ background: "rgba(11,9,6,0.55)" }}
                >
                  {t(secretFile.stamp)}
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

            {/* the note under the frame */}
            <div className="mt-12 sm:mt-14 text-center rotate-[1.5deg]">
              <p className="font-typewriter text-[9px] uppercase tracking-[0.3em] text-blood-500/80">
                {t(secretFile.rubric)}
              </p>
              <h3 className="font-headline text-2xl sm:text-4xl font-black text-paper-100 mt-1.5 leading-none tracking-wide">
                {t(secretFile.title)}
              </h3>
              <p className="font-typewriter text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-paper-200/55 mt-2">
                {t(secretFile.subtitle)}
              </p>
              <p className="font-hand text-[15px] text-paper-200/70 mt-1">{t(secretFile.caption)}</p>

              <div className="mt-3 space-y-2 max-w-[300px] mx-auto">
                {secretFile.body.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.16 }}
                    className="font-body text-[11.5px] leading-relaxed text-paper-200/65"
                  >
                    {t(para)}
                  </motion.p>
                ))}
              </div>

              <button
                type="button"
                onClick={close}
                className="mt-4 font-typewriter text-[9px] uppercase tracking-[0.18em] text-paper-200/45 border-b border-dotted border-paper-200/25 pb-0.5"
              >
                {t(secretFile.dismiss)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
