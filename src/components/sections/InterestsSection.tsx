import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { EvidenceTagIcon, PushpinIcon } from "../icons";
import { articles, interests, stickyNotes } from "../../data/content";
import manutdCrest from "../../assets/photos/manutd-crest.png";

export function InterestsSection() {
  return (
    <Section
      id="interests"
      rubric={{ id: "Rubrik Minat", en: "Interest Column" }}
      headline={{ id: "Ketertarikan Tersangka", en: "Suspect's Interests" }}
      article={articles.interests}
      note={stickyNotes.interests}
    >
      <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
        {interests.map((item) => (
          <div key={item.id} className="relative flex flex-col items-center gap-2">
            <PushpinIcon className="w-6 h-6 absolute -top-4 z-10" />
            <EvidenceItem caseFile={item} size={110}>
              {item.icon === "manutd" ? (
                <img src={manutdCrest} alt="Manchester United" className="w-full h-full object-contain drop-shadow" />
              ) : item.photoSrc ? (
                <img
                  src={item.photoSrc}
                  alt={item.title.id}
                  className="w-full h-full object-cover rounded-sm border-4 border-[#fbf6e8] shadow-pinned sepia-[0.1]"
                />
              ) : (
                <EvidenceTagIcon className="w-full h-full" />
              )}
            </EvidenceItem>
            <span className="font-typewriter text-xs text-ink-500/70 mt-1">click to inspect</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
