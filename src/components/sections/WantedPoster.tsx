import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { caseSummary, profile, wanted } from "../../data/content";
import { SummaryModal } from "../layout/SummaryModal";
import mugshot from "../../assets/photos/ilham-mugshot.jpg";
import { PushpinIcon, StampMark } from "../icons";

/**
 * The hero centerpiece: a playful "wanted poster" riffing on the
 * mafia-boss-being-hunted-by-a-detective framing the user asked for.
 * Not meant to be mean-spirited — just a fun visual hook up top.
 *
 * The whole poster is the button that opens the case summary. That sheet used
 * to sit in the flow right below here and made the home node tower over its
 * neighbours; as the poster's own case file it costs the layout nothing and
 * it is where somebody would look for it anyway. See `SummaryModal`.
 */
export function WantedPoster() {
  const { t } = useLanguage();
  const [openSummary, setOpenSummary] = useState(false);

  return (
    <div className="px-4 sm:px-8 -mt-2 mb-4">
      <motion.button
        type="button"
        onClick={() => setOpenSummary(true)}
        aria-label={t(caseSummary.rubric)}
        initial={{ opacity: 0, y: 20, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="group relative block w-full text-left magnifier-cursor focus:outline-none focus-visible:ring-2 focus-visible:ring-blood-600 max-w-3xl mx-auto bg-[#f2e6c4] border-[3px] border-ink-700 shadow-case p-6 sm:p-8"
      >
        <PushpinIcon className="w-7 h-7 absolute -top-4 left-8 -rotate-6" />
        <PushpinIcon className="w-7 h-7 absolute -top-4 right-8 rotate-6" />

        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-blood-600 text-lg">★</span>
          <h2 className="font-headline font-black text-4xl sm:text-6xl tracking-widest text-ink-800 text-center">
            {t(wanted.heading)}
          </h2>
          <span className="text-blood-600 text-lg">★</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="shrink-0">
            <div className="border-4 border-ink-700 w-40 sm:w-48 shadow-pinned">
              <img
                src={mugshot}
                alt={profile.fullName}
                className="w-full h-full object-cover sepia-[0.3] contrast-105"
              />
              <div className="bg-ink-700 text-paper-50 text-center py-1 font-typewriter text-[10px] tracking-widest">
                {profile.caseNumber}
              </div>
            </div>
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h3 className="font-headline font-bold text-xl sm:text-2xl text-ink-800">{profile.fullName}</h3>
            <p className="font-typewriter text-xs text-blood-600 uppercase tracking-widest mt-0.5">
              {t(wanted.alias)}
            </p>
            <p className="font-body text-sm text-ink-500 mt-3 leading-relaxed">{t(wanted.charge)}</p>
            <p className="font-hand text-lg text-ink-700 mt-3">{t(wanted.reward)}</p>
          </div>
        </div>

        {/* The only hint that the poster opens anything. Sits inside the
            rules of the sheet so it reads as a note the desk sergeant left,
            not as a UI label. */}
        <p className="mt-5 pt-3 border-t border-dashed border-ink-500/30 text-center font-hand text-base text-ink-500/80 group-hover:text-blood-600 transition-colors">
          {t({
            id: "Buka berkasnya untuk ringkasan perkara →",
            en: "Open the file for the case summary →",
          })}
        </p>

        <div className="absolute -bottom-4 -right-4 w-28 rotate-[8deg] opacity-90 pointer-events-none">
          <StampMark text={t(wanted.status)} />
        </div>
      </motion.button>

      <SummaryModal open={openSummary} onClose={() => setOpenSummary(false)} />
    </div>
  );
}
