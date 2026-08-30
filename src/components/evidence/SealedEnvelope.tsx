import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import type { Bilingual } from "../../types";

interface SealedEnvelopeProps {
  href: string;
  label: Bilingual;
  sealedLabel: Bilingual;
  hint: Bilingual;
}

/**
 * A sealed envelope that tears open on click before revealing the actual
 * download link, per the "amplop tersegel" brainstorm idea.
 */
export function SealedEnvelope({ href, label, sealedLabel, hint }: SealedEnvelopeProps) {
  const { t } = useLanguage();
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative w-48 h-32">
      <AnimatePresence initial={false} mode="wait">
        {!opened ? (
          <motion.button
            key="sealed"
            type="button"
            onClick={() => setOpened(true)}
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            aria-label={t(hint)}
          >
            <svg viewBox="0 0 200 130" className="w-full h-full drop-shadow-[0_6px_10px_rgba(10,8,5,0.4)]">
              <rect x="4" y="4" width="192" height="122" fill="#e3d3a8" stroke="#2a241d" strokeWidth="2" />
              <motion.path
                d="M4 4 L100 68 L196 4 Z"
                fill="#d4bf8e"
                stroke="#2a241d"
                strokeWidth="2"
                initial={{ rotate: 0 }}
              />
              <circle cx="100" cy="54" r="14" fill="#7a1f1f" stroke="#4a0f0f" strokeWidth="1.5" />
              <path d="M100 47 L104 53 L112 54 L106 59 L108 66 L100 62 L92 66 L94 59 L88 54 L96 53 Z" fill="#e0b843" />
            </svg>
            <p className="mt-2 text-center font-hand text-base text-ink-700">{t(sealedLabel)}</p>
            <p className="text-center font-hand text-xs text-ink-500/70">{t(hint)}</p>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
          >
            <svg viewBox="0 0 200 130" className="w-full h-full absolute inset-0 -z-10 opacity-40">
              <rect x="4" y="4" width="192" height="122" fill="#e3d3a8" stroke="#2a241d" strokeWidth="2" />
              <path d="M4 4 L100 68 L196 4" fill="none" stroke="#2a241d" strokeWidth="2" strokeDasharray="4 3" />
            </svg>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-typewriter text-sm text-paper-50 bg-blood-600 px-4 py-2.5 rounded-sm shadow-pinned hover:bg-blood-500 transition-colors"
            >
              {t(label)}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
