import { Section } from "../layout/Section";
import { EvidenceItem } from "../evidence/EvidenceItem";
import { ExhibitTag } from "../evidence/ExhibitTag";
import { articles, capabilityAreas, capabilityCatalog, projects } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import type { CapabilityArea } from "../../data/content";
import type { ProjectEntry } from "../../types";

/** Alternating tilt so the tags look tossed onto the table, not laid out. */
const TILTS = [-2.5, 2, -1.5, 3, -3, 1.5, 2.5];

/** How many technique chips fit under a tag before it gets cluttered. */
const CHIPS_PER_TAG = 3;

/**
 * The techniques actually evidenced across the exhibits, grouped by area.
 * Derived from the projects themselves rather than kept as a second list, so
 * it can never claim a competency no case file backs up.
 */
function techniquesOnFile() {
  const used = new Map<CapabilityArea, string[]>();
  for (const project of projects) {
    for (const key of project.capabilities) {
      const entry = capabilityCatalog[key];
      if (!entry) continue;
      const bucket = used.get(entry.area) ?? [];
      if (!bucket.includes(key)) bucket.push(key);
      used.set(entry.area, bucket);
    }
  }
  // Keep the catalog's own area order, which runs prep -> modelling.
  return (Object.keys(capabilityAreas) as CapabilityArea[])
    .filter((area) => used.has(area))
    .map((area) => ({ area, keys: used.get(area)! }));
}

export function ProjectsSection() {
  const { t } = useLanguage();
  const areas = techniquesOnFile();

  return (
    <Section
      id="projects"
      rubric={{ id: "Rubrik Bukti", en: "Evidence Column" }}
      headline={{ id: "Ruang Bukti: Proyek", en: "Exhibit Room: Projects" }}
      article={articles.projects}
    >
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-12">
        {projects.map((project: ProjectEntry, i) => (
          <div key={project.id} className="flex flex-col items-center">
            <EvidenceItem caseFile={project} width={190} height={132} tilt={TILTS[i % TILTS.length]}>
              <ExhibitTag project={project} />
            </EvidenceItem>

            {/* The analyst techniques this exhibit demonstrates, tagged on
                below like lab annotations. These lead over the tech stack on
                purpose: the stack alone reads like a web build, when the work
                on file is analysis and reporting. */}
            <div className="mt-3 flex flex-wrap justify-center gap-1 max-w-[190px]">
              {project.capabilities.slice(0, CHIPS_PER_TAG).map((key) => {
                const entry = capabilityCatalog[key];
                if (!entry) return null;
                return (
                  <span
                    key={`${project.id}-${key}`}
                    className="text-[8.5px] font-typewriter px-1.5 py-[2px] bg-ink-700/90 text-paper-100 rounded-sm tracking-wide"
                  >
                    {t(entry.label)}
                  </span>
                );
              })}
              {project.capabilities.length > CHIPS_PER_TAG && (
                <span className="text-[8.5px] font-typewriter px-1.5 py-[2px] border border-ink-700/40 text-ink-500/70 rounded-sm">
                  +{project.capabilities.length - CHIPS_PER_TAG}
                </span>
              )}
            </div>

            {/* Tooling, kept but quiet: it answers "built with what" without
                competing with the competencies above. */}
            <p className="mt-1.5 max-w-[186px] text-center font-typewriter text-[7.5px] leading-snug tracking-wide text-ink-500/55">
              {project.techStack.join(" · ")}
            </p>
          </div>
        ))}
      </div>

      {/* Competency summary for the room, set like a lab capability sheet */}
      <div className="mt-14 sm:mt-16 max-w-3xl mx-auto border-y-[3px] border-ink-700/70 py-[3px]">
        <div className="border-y border-ink-700/30 px-5 py-5 sm:px-8">
          <p className="text-center font-typewriter text-[10px] uppercase tracking-[0.3em] text-blood-600">
            {t({ id: "Teknik yang Terdokumentasi", en: "Techniques on File" })}
          </p>
          <span className="mx-auto my-3 block h-px w-12 bg-ink-500/35" />
          <p className="mb-5 text-center font-body text-[11.5px] leading-relaxed text-ink-500/80">
            {t({
              id: "Setiap teknik di bawah ini bisa ditelusuri ke minimal satu barang bukti di atas, bukan daftar keinginan.",
              en: "Every technique below traces back to at least one exhibit above, not a wishlist.",
            })}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {areas.map(({ area, keys }, i) => (
              <div key={area}>
                <div className="flex items-baseline gap-2">
                  <span className="font-typewriter text-[9px] text-blood-600/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-headline text-[14px] font-bold text-ink-700 leading-tight">
                    {t(capabilityAreas[area])}
                  </h4>
                </div>
                <span className="mt-1 mb-1.5 block h-px w-full bg-ink-500/20" />
                <p className="font-body text-[11px] leading-relaxed text-ink-500/85">
                  {keys.map((k) => t(capabilityCatalog[k].label)).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
