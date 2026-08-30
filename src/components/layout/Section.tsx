import type { ReactNode } from "react";
import type { Bilingual, CaseFile } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import { LeadParagraph } from "./LeadParagraph";
import { StickyNote } from "../evidence/StickyNote";

interface SectionProps {
  id: string;
  rubric: Bilingual;
  headline: Bilingual;
  children: ReactNode;
  className?: string;
  /** Newspaper-feature-style narrative paragraph, rendered above the evidence grid. */
  article?: Bilingual;
  /** Optional pinned post-it footnote floating over a corner of the section. */
  note?: CaseFile;
}

/**
 * A single "clipping" of the newspaper — a torn, slightly rotated paper
 * panel with a rubric (section eyebrow) and a headline, matching the
 * masthead's editorial voice.
 */
export function Section({ id, rubric, headline, children, className = "", article, note }: SectionProps) {
  const { t } = useLanguage();

  return (
    <section id={id} className={`relative py-14 sm:py-20 px-4 sm:px-8 ${className}`}>
      {note && <StickyNote caseFile={note} className="absolute top-4 right-4 sm:right-10 z-10" />}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px flex-1 bg-ink-500/30" />
          <span className="font-typewriter text-xs sm:text-sm tracking-[0.3em] uppercase text-blood-600">
            {t(rubric)}
          </span>
          <span className="h-px flex-1 bg-ink-500/30" />
        </div>
        <h2 className="font-headline text-3xl sm:text-5xl text-ink-700 font-bold text-center mb-8">
          {t(headline)}
        </h2>
        {article && (
          <div className="mb-10 sm:mb-14">
            <LeadParagraph text={article} />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
