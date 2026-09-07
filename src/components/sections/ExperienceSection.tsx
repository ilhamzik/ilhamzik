import { useState } from "react";
import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { DossierCard } from "../evidence/DossierCard";
import { CorkString } from "../evidence/CorkString";
import { PushpinIcon } from "../icons";
import { articles, experience, stickyNotes } from "../../data/content";

/** Pin colours cycle so the board doesn't look mass-produced. */
const PIN_COLORS = ["#7a1f1f", "#2a4d3a", "#8f6c39", "#1f3a5c"];
/** Hand-placed feel: per-card tilt and vertical drop, in reading order. */
const PLACEMENT = [
  { tilt: -3, drop: 0 },
  { tilt: 2.5, drop: 30 },
  { tilt: 2, drop: 8 },
  { tilt: -2.5, drop: 38 },
];

export function ExperienceSection() {
  const [boardEl, setBoardEl] = useState<HTMLDivElement | null>(null);

  return (
    <Section
      id="experience"
      rubric={{ id: "Rubrik Investigasi", en: "Investigation Column" }}
      headline={{ id: "Papan Kasus: Pengalaman", en: "Case Board: Experience" }}
      article={articles.experience}
      note={stickyNotes.experience}
    >
      <div
        ref={setBoardEl}
        className="relative rounded-md px-4 py-8 sm:px-10 sm:py-12 border-[6px] border-[#4a3218]"
        style={{
          background: "radial-gradient(circle at 20% 15%, #7d6242 0%, #6b502a 55%, #533f1f 100%)",
          boxShadow:
            "inset 0 0 46px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.08), 0 10px 24px -12px rgba(0,0,0,0.6)",
        }}
      >
        {/* cork speckle: cheap and static, two dot layers instead of a filter */}
        <span
          className="absolute inset-0 pointer-events-none rounded-sm opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(40,26,10,0.9) 0.9px, transparent 1.1px), radial-gradient(circle at 50% 50%, rgba(240,220,180,0.5) 0.7px, transparent 0.9px)",
            backgroundSize: "13px 11px, 19px 17px",
            backgroundPosition: "0 0, 6px 5px",
          }}
        />

        <CorkString board={boardEl} />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-x-6 gap-y-8">
          {experience.map((entry, i) => {
            const place = PLACEMENT[i % PLACEMENT.length];
            return (
              <div key={entry.id} className="relative" style={{ marginTop: place.drop }}>
                <PushpinIcon
                  data-pin=""
                  className="w-7 h-7 absolute -top-3.5 left-1/2 -translate-x-1/2 z-20"
                  color={PIN_COLORS[i % PIN_COLORS.length]}
                />
                <EvidenceItem caseFile={entry} width={226} height={120} tilt={place.tilt}>
                  <DossierCard entry={entry} />
                </EvidenceItem>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
