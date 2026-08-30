import { Section } from "../layout/Section";
import { MailboxIcon } from "../icons";
import { SealedEnvelope } from "../evidence/SealedEnvelope";
import { articles, contact, profile } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <Section
      id="contact"
      rubric={{ id: "Rubrik Kontak", en: "Contact Column" }}
      headline={{ id: "Jalur Petunjuk", en: "Tip Line" }}
      article={articles.contact}
    >
      <div className="max-w-sm mx-auto mb-6 border-2 border-dashed border-ink-500/40 px-4 py-3 text-center bg-paper-100/60">
        <p className="font-typewriter text-[11px] uppercase tracking-widest text-blood-600">
          {t({ id: "Iklan Baris", en: "Classifieds" })}
        </p>
        <p className="font-body text-xs text-ink-700 mt-1">{t(contact.classifiedAd)}</p>
      </div>

      <div className="max-w-md mx-auto flex flex-col items-center text-center gap-4 bg-[#f2e6c4] border border-ink-500/20 shadow-pinned p-8 rounded-sm">
        <MailboxIcon className="w-16 h-16" />
        <h3 className="font-headline text-xl font-bold text-ink-700">{t(contact.heading)}</h3>
        <p className="font-body text-sm text-ink-500">{t(contact.description)}</p>

        <a
          href={`mailto:${contact.email}`}
          className="font-typewriter text-sm bg-blood-600 text-paper-50 px-5 py-2.5 rounded-sm shadow-pinned hover:bg-blood-500 transition-colors"
        >
          {contact.email}
        </a>

        <div className="flex gap-3 mt-2">
          {contact.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="font-typewriter text-xs border border-ink-500/40 text-ink-700 px-3 py-1.5 rounded-sm hover:bg-ink-700 hover:text-paper-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed border-ink-500/30 w-full flex justify-center">
          <SealedEnvelope
            href={profile.resumeHref}
            label={contact.resumeLabel}
            sealedLabel={contact.envelopeLabel}
            hint={contact.envelopeHint}
          />
        </div>
      </div>
    </Section>
  );
}
