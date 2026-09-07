import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { PhotoMount } from "../evidence/PhotoMount";
import { PushpinIcon } from "../icons";
import { articles, interests, stickyNotes } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import manutdCrest from "../../assets/photos/manutd-crest.png";

const PIN_COLORS = ["#7a1f1f", "#1f3d7a", "#2a4d3a"];
const TILTS = [-3, 2.5, -1.5];

export function InterestsSection() {
  const { t } = useLanguage();

  return (
    <Section
      id="interests"
      rubric={{ id: "Rubrik Minat", en: "Interest Column" }}
      headline={{ id: "Ketertarikan Tersangka", en: "Suspect's Interests" }}
      article={articles.interests}
      note={stickyNotes.interests}
    >
      <div className="flex flex-wrap justify-center gap-x-7 gap-y-12 sm:gap-x-10">
        {interests.map((item, i) => {
          const isCrest = item.icon === "manutd";
          return (
            <div key={item.id} className="relative flex flex-col items-center">
              <PushpinIcon
                className="w-7 h-7 absolute -top-3.5 left-1/2 -translate-x-1/2 z-20"
                color={PIN_COLORS[i % PIN_COLORS.length]}
              />
              <EvidenceItem caseFile={item} width={158} height={188} tilt={TILTS[i % TILTS.length]}>
                <PhotoMount
                  src={isCrest ? manutdCrest : item.photoSrc}
                  alt={isCrest ? "Manchester United" : t(item.title)}
                  caption={item.subtitle}
                  tag={t(item.tag)}
                  contain={isCrest}
                />
              </EvidenceItem>
              <span className="font-typewriter text-[10px] tracking-wide text-ink-500/60 mt-2.5">
                {t({ id: "klik untuk periksa", en: "click to inspect" })}
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
