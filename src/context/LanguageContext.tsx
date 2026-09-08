import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Bilingual, Lang } from "../types";

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  t: (text: Bilingual) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Keep the document language in step with the copy. Without this the page
  // stays `lang="en"` while showing Indonesian, so a screen reader applies
  // English pronunciation to it and search engines file it under the wrong
  // language. `index.html` ships `lang="en"` because that is the default.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      toggle: () => setLang((prev) => (prev === "id" ? "en" : "id")),
      t: (text: Bilingual) => text[lang],
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
