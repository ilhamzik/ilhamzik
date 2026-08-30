import { useLanguage } from "../../context/LanguageContext";
import { profile } from "../../data/content";
import { MagnifyingGlassIcon } from "../icons";

export function Masthead() {
  const { t } = useLanguage();

  return (
    <header className="relative px-4 sm:px-8 pt-8 sm:pt-12 pb-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-typewriter tracking-widest text-ink-500/70 uppercase mb-3">
        <span>{profile.caseNumber}</span>
        <span>{profile.issueDate}</span>
      </div>

      <div className="text-center border-y-4 border-double border-ink-700 py-4 sm:py-6">
        <h1 className="font-headline font-black text-5xl sm:text-7xl md:text-8xl text-ink-800 tracking-tight uppercase">
          {profile.name}
        </h1>
        <p className="font-typewriter text-sm sm:text-lg text-blood-600 mt-2 tracking-wide uppercase">
          {t(profile.role)}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-center">
        <MagnifyingGlassIcon className="w-5 h-5 shrink-0 opacity-70" />
        <p className="font-body text-xs sm:text-sm italic text-ink-500/80 max-w-lg">{t(profile.tagline)}</p>
      </div>
    </header>
  );
}
