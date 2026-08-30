import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCaseFile } from "../../context/CaseFileContext";
import { useLanguage } from "../../context/LanguageContext";
import { PolaroidPhoto } from "./PolaroidPhoto";
import { RedactedText } from "./RedactedText";
import { StampMark } from "../icons";

export function CaseFileModal() {
  const { activeCase, closeCase } = useCaseFile();
  const { t } = useLanguage();

  useEffect(() => {
    if (!activeCase) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCase();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeCase, closeCase]);

  return (
    <AnimatePresence>
      {activeCase && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
            onClick={closeCase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#f2e6c4] shadow-case rounded-sm border border-ink-500/20"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Manila folder tab */}
            <div className="absolute -top-6 left-8 bg-[#d8bd80] px-6 py-1.5 rounded-t-md border border-b-0 border-ink-500/20 text-ink-500 font-typewriter text-xs tracking-widest">
              {activeCase.tag}
            </div>

            <button
              type="button"
              onClick={closeCase}
              aria-label={t({ id: "Tutup", en: "Close" })}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-stamp-500 text-paper-50 font-bold text-lg leading-none flex items-center justify-center shadow-pinned hover:scale-110 transition-transform"
            >
              ×
            </button>

            <div className="p-6 sm:p-10 pt-10">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative shrink-0 self-center sm:self-start">
                  <PolaroidPhoto src={activeCase.photoSrc} caption={activeCase.photoCaption} rotate={-3} />
                  {activeCase.stamp && (
                    <div className="absolute -bottom-3 -right-6 w-32 opacity-90 animate-stampIn pointer-events-none rotate-[-10deg] z-10">
                      <StampMark text={activeCase.stamp} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-headline text-2xl sm:text-3xl text-ink-700 font-bold leading-tight">
                    {t(activeCase.title)}
                  </h3>
                  {activeCase.subtitle && (
                    <p className="font-typewriter text-sm text-blood-600 mt-1 tracking-wide uppercase">
                      {t(activeCase.subtitle)}
                    </p>
                  )}

                  <div className="mt-4 space-y-3">
                    {activeCase.body.map((para, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.12 }}
                        className="font-body text-[15px] leading-relaxed text-ink-500"
                      >
                        {t(para)}
                      </motion.p>
                    ))}
                  </div>

                  {activeCase.techStack && activeCase.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {activeCase.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-typewriter px-2 py-1 bg-ink-700 text-paper-50 rounded-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeCase.redacted && <RedactedText text={activeCase.redacted} />}

                  {activeCase.facts && activeCase.facts.length > 0 && (
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-dashed border-ink-500/30 pt-4">
                      {activeCase.facts.map((fact, i) => (
                        <div key={i} className="col-span-2 sm:col-span-1">
                          <dt className="text-[10px] uppercase tracking-widest text-ink-500/60 font-typewriter">
                            {t(fact.label)}
                          </dt>
                          <dd className="text-sm text-ink-700 font-bold">{t(fact.value)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {activeCase.link && (
                    <a
                      href={activeCase.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-block font-typewriter text-sm text-paper-50 bg-ink-700 px-4 py-2 rounded-sm shadow-pinned hover:bg-ink-500 transition-colors"
                    >
                      {t(activeCase.link.label)}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
