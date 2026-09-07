import { caseSummary, contact, profile } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";

/**
 * The one-minute version, set as an official summary sheet: typed rows, three
 * pieces of evidence that each carry a number, and the two things a visitor
 * might actually want to do (take the CV, make contact).
 *
 * This exists because the rest of the site is an exploration. That is the
 * point of it, but it means somebody screening candidates could look for a
 * minute and leave with nothing concrete. Everything here is a restatement of
 * facts held elsewhere in content.ts.
 */
export function CaseSummary({ onContact }: { onContact?: () => void }) {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t(caseSummary.rubric)}
      className="relative mx-auto mt-8 max-w-3xl border-y-[3px] border-ink-700/70 px-1 py-[3px]"
    >
      <div className="border-y border-ink-700/25 bg-paper-50/40 px-5 py-5 sm:px-8 sm:py-6">
        <header className="text-center">
          <p className="font-typewriter text-[10px] uppercase tracking-[0.32em] text-blood-600">
            {t(caseSummary.rubric)}
          </p>
          <span className="mx-auto my-2.5 block h-px w-12 bg-ink-500/35" />
          <p className="font-hand text-[15px] text-ink-500/70">{t(caseSummary.hint)}</p>
        </header>

        {/* typed data rows */}
        <dl className="mt-5 space-y-2.5">
          {caseSummary.rows.map((row) => (
            <div key={row.label.en} className="sm:flex sm:items-baseline sm:gap-4">
              <dt className="font-typewriter text-[8.5px] uppercase tracking-[0.2em] text-ink-500/60 sm:w-[128px] sm:shrink-0 sm:text-right">
                {t(row.label)}
              </dt>
              <dd className="font-typewriter text-[12.5px] leading-snug text-ink-700 border-b border-dotted border-ink-500/25 pb-1 sm:flex-1">
                {t(row.value)}
              </dd>
            </div>
          ))}
        </dl>

        {/* the three lines worth reading if you read nothing else */}
        <div className="mt-6">
          <p className="font-typewriter text-[8.5px] uppercase tracking-[0.2em] text-ink-500/60 mb-2">
            {t(caseSummary.evidenceLabel)}
          </p>
          <ul className="space-y-2">
            {caseSummary.evidence.map((line, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="font-typewriter text-[11px] leading-relaxed text-blood-600/70 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-body text-[12.5px] leading-relaxed text-ink-700/90">{t(line)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <a
            href={profile.resumeHref}
            target="_blank"
            rel="noreferrer"
            className="font-typewriter text-[11px] uppercase tracking-[0.14em] bg-blood-600 text-paper-50 px-4 py-2 rounded-sm shadow-pinned hover:bg-blood-500 transition-colors"
          >
            {t(caseSummary.cta)}
          </a>
          {onContact ? (
            <button
              type="button"
              onClick={onContact}
              className="font-typewriter text-[11px] uppercase tracking-[0.14em] border-[1.5px] border-ink-700/45 text-ink-700/85 px-4 py-2 rounded-sm hover:bg-ink-700 hover:text-paper-50 hover:border-ink-700 transition-colors"
            >
              {t(caseSummary.contactCta)}
            </button>
          ) : (
            <a
              href={`mailto:${contact.email}`}
              className="font-typewriter text-[11px] uppercase tracking-[0.14em] border-[1.5px] border-ink-700/45 text-ink-700/85 px-4 py-2 rounded-sm hover:bg-ink-700 hover:text-paper-50 hover:border-ink-700 transition-colors"
            >
              {t(caseSummary.contactCta)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
