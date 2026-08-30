import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { profile, wanted } from "../../data/content";
import mugshot from "../../assets/photos/ilham-mugshot.jpg";
import { PushpinIcon, StampMark } from "../icons";

/**
 * The hero centerpiece: a playful "wanted poster" riffing on the
 * mafia-boss-being-hunted-by-a-detective framing the user asked for.
 * Not meant to be mean-spirited — just a fun visual hook up top.
 */
export function WantedPoster() {
  const { t } = useLanguage();

  return (
    <div className="px-4 sm:px-8 -mt-2 mb-4">
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative max-w-3xl mx-auto bg-[#f2e6c4] border-[3px] border-ink-700 shadow-case p-6 sm:p-8"
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

        <div className="absolute -bottom-4 -right-4 w-28 rotate-[8deg] opacity-90 pointer-events-none">
          <StampMark text={t(wanted.status)} />
        </div>
      </motion.div>
    </div>
  );
}
