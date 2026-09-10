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
      {/* boxed classified ad, set the way a newspaper sets them: heavy rules
          top and bottom, centred rubric, a dingbat to close the notice */}
      <div className="max-w-sm mx-auto mb-9 border-y-[3px] border-ink-700/80 py-[3px]">
        <div className="border-y border-ink-700/40 px-4 py-3 text-center">
          <p className="font-typewriter text-[10px] uppercase tracking-[0.34em] text-blood-600">
            {t({ id: "Iklan Baris", en: "Classifieds" })}
          </p>
          <span className="mx-auto my-2 block h-px w-10 bg-ink-500/35" />
          <p className="font-body text-[12.5px] leading-relaxed text-ink-700">{t(contact.classifiedAd)}</p>
          <p className="font-typewriter text-[11px] text-ink-500/45 mt-2 tracking-[0.5em]">❖</p>
        </div>
      </div>

      {/* the tip-line coupon */}
      <div
        className="relative max-w-md mx-auto bg-[#f4e9cd] border border-ink-500/30 rounded-sm overflow-hidden"
        style={{ boxShadow: "0 10px 26px -12px rgba(20,14,8,0.55), inset 0 0 26px rgba(107,80,42,0.18)" }}
      >
        {/* header bar */}
        <div className="flex items-center gap-2 bg-ink-700 px-4 py-2">
          <MailboxIcon className="w-6 h-6 shrink-0" />
          <span className="font-typewriter text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-paper-100">
            {t(contact.heading)}
          </span>
          <span className="ml-auto font-typewriter text-[9px] tracking-widest text-paper-100/55 whitespace-nowrap">
            {profile.caseNumber}
          </span>
        </div>

        <div className="px-5 sm:px-7 py-5">
          <p className="font-body text-[13px] leading-relaxed text-ink-500 text-center">
            {t(contact.description)}
          </p>

          {/* the address, typed onto a ruled form line */}
          <div className="mt-5">
            <p className="font-typewriter text-[8px] uppercase tracking-[0.24em] text-ink-500/55 mb-1 text-center">
              {t({ id: "Surat Elektronik", en: "Electronic Mail" })}
            </p>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent(t(contact.emailSubject))}`}
              aria-label={t({
                id: `Kirim email ke Muhammad Ilham Zikri di ${contact.email}`,
                en: `Email Muhammad Ilham Zikri at ${contact.email}`,
              })}
              className="group block cursor-pointer border-b border-dashed border-ink-500/45 pb-1.5 text-center hover:border-blood-600 focus-visible:border-blood-600 transition-colors"
            >
              <span className="font-typewriter text-[13px] sm:text-[15px] text-blood-600 underline decoration-dotted decoration-blood-600/40 underline-offset-[3px] group-hover:decoration-blood-500 group-hover:text-blood-500 break-all">
                {contact.email}
              </span>
              <span className="mt-1 block font-typewriter text-[8px] uppercase tracking-[0.24em] text-ink-500/55 group-hover:text-blood-600 transition-colors">
                {t(contact.emailHint)}
              </span>
            </a>
          </div>

          {/* known aliases, stamped on */}
          <div className="mt-5">
            <p className="font-typewriter text-[8px] uppercase tracking-[0.24em] text-ink-500/55 mb-2 text-center">
              {t({ id: "Alias Terpantau", en: "Known Aliases" })}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {contact.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-typewriter text-[11px] tracking-[0.12em] uppercase border-[1.5px] border-ink-700/45 text-ink-700/85 px-2.5 py-1 rounded-[2px] -rotate-1 hover:rotate-0 hover:bg-ink-700 hover:text-paper-50 hover:border-ink-700 transition-all"
                  style={{ boxShadow: "inset 0 0 4px rgba(28,23,18,0.12)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* perforation, then the tear-off stub holding the case file */}
        <div className="relative">
          <span className="absolute inset-x-0 top-0 border-t-2 border-dashed border-ink-500/40" />
          {/* the punched-out notches that make a perforation read as one */}
          <span className="absolute -left-[7px] -top-[7px] w-[14px] h-[14px] rounded-full bg-paper-100" />
          <span className="absolute -right-[7px] -top-[7px] w-[14px] h-[14px] rounded-full bg-paper-100" />
          <div className="bg-[#eadec0]/70 pt-5 pb-6 flex flex-col items-center">
            <p className="font-typewriter text-[8px] uppercase tracking-[0.24em] text-ink-500/55 mb-2">
              {t({ id: "Sobek di Sini", en: "Tear Along Here" })}
            </p>
            <SealedEnvelope
              href={profile.resumeHref}
              label={contact.resumeLabel}
              sealedLabel={contact.envelopeLabel}
              hint={contact.envelopeHint}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
