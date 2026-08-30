import { useLanguage } from "../../context/LanguageContext";
import type { Bilingual } from "../../types";

export function LeadParagraph({ text }: { text: Bilingual }) {
  const { t } = useLanguage();
  const full = t(text);
  const first = full.charAt(0);
  const rest = full.slice(1);

  return (
    <p className="max-w-3xl mx-auto px-4 sm:px-8 font-body text-ink-500 text-[15px] sm:text-base leading-relaxed text-justify">
      <span className="float-left font-headline font-black text-6xl sm:text-7xl leading-[0.8] pr-2 pt-1 text-blood-600">
        {first}
      </span>
      {rest}
    </p>
  );
}
