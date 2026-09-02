import { LanguageProvider, useLanguage } from "../../context/LanguageContext";
import { CaseFileProvider } from "../../context/CaseFileContext";
import { NightShiftProvider } from "../../context/NightShiftContext";

import { Masthead } from "../layout/Masthead";
import { LeadParagraph } from "../layout/LeadParagraph";
import { WantedPoster } from "../sections/WantedPoster";
import { EducationSection } from "../sections/EducationSection";
import { InterestsSection } from "../sections/InterestsSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { SkillsSection } from "../sections/SkillsSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { ContactSection } from "../sections/ContactSection";
import { CaseFileModal } from "../evidence/CaseFileModal";
import { StickyNote } from "../evidence/StickyNote";
import { PushpinIcon } from "../icons";

import { pressCredits, profile, stickyNotes } from "../../data/content";
import { LazySection } from "./LazySection";
import { MobileHud } from "./MobileHud";
import { MobileNightShiftOverlay } from "./MobileNightShiftOverlay";
import { FORCE_DESKTOP_KEY } from "./forceDesktop";

const INTRO = {
  id: "Sebuah investigasi masih berjalan di balik nama ini. Setiap bagian dari koran ini menyimpan potongan bukti. Gulir terus ke bawah untuk menyusuri berkasnya, dan ikuti benang merahnya kalau penasaran ke mana ceritanya berlanjut.",
  en: "An investigation is still underway behind this name. Every section of this paper holds a piece of evidence. Scroll on down to work through the file, and follow the red string if you're curious where the story leads next.",
};

/** Vertical stand-in for the desktop red string: a dashed thread + pushpin
 *  bridging one stacked clipping to the next. */
function StringGap() {
  return (
    <div className="relative h-12 flex justify-center" aria-hidden>
      <div className="border-l-2 border-dashed border-blood-600/50 h-full" />
      <PushpinIcon className="w-5 h-5 absolute -bottom-1 left-1/2 -translate-x-1/2" />
    </div>
  );
}

function Footer() {
  const { lang, t } = useLanguage();

  const goDesktop = () => {
    try {
      sessionStorage.setItem(FORCE_DESKTOP_KEY, "1");
    } catch {
      /* private mode: the reload just won't stick, no harm */
    }
    location.reload();
  };

  return (
    <footer className="text-center py-8 font-typewriter text-xs text-ink-500/60 tracking-widest uppercase">
      <p>* * * End of Report * * *</p>
      <p className="normal-case tracking-normal mt-1 text-[10px] opacity-70">
        {t(pressCredits)} {profile.issueDate}.
      </p>
      <button
        type="button"
        onClick={goDesktop}
        className="mt-5 font-typewriter text-[10px] uppercase tracking-wide border border-ink-500/40 text-ink-500/80 px-3 py-1.5 rounded-sm active:bg-ink-700 active:text-paper-50"
      >
        {lang === "id" ? "Buka versi desktop" : "Open desktop version"}
      </button>
    </footer>
  );
}

/**
 * Phone / tablet experience: the same newspaper, read top-to-bottom instead
 * of dragged around. No pannable world, no rAF loop, no world-sized SVG.
 * Sections are reused verbatim from the desktop build (they never touched
 * MapContext) and gated by `LazySection` so off-screen ones cost nothing.
 */
export function MobileView() {
  return (
    <LanguageProvider>
      <CaseFileProvider>
        <NightShiftProvider>
          <div
            className="h-screen overflow-y-auto overflow-x-hidden overscroll-none bg-ink-900"
            style={{ scrollBehavior: "smooth" }}
          >
            {/* No torn-edge clip here: its polygon is tuned for the wide/short
               desktop world; on a ~390px-wide, very tall column the teeth
               blow up into full-height black spikes. The paper grain +
               gradient carry the vintage look on their own. */}
            <div className="bg-paper-gradient paper-grain pt-[92px] pb-4">
              <div className="max-w-[680px] mx-auto px-1">
                <Masthead />
                <WantedPoster />

                {stickyNotes.home && (
                  <div className="px-4 flex justify-end -mt-1 mb-2">
                    <StickyNote caseFile={stickyNotes.home} />
                  </div>
                )}

                <LeadParagraph text={INTRO} />

                <StringGap />
                <LazySection height={1100}>
                  <EducationSection />
                </LazySection>

                <StringGap />
                <LazySection height={950}>
                  <InterestsSection />
                </LazySection>

                <StringGap />
                <LazySection height={1200}>
                  <ExperienceSection />
                </LazySection>

                <StringGap />
                <LazySection height={1150}>
                  <SkillsSection />
                </LazySection>

                <StringGap />
                <LazySection height={1200}>
                  <ProjectsSection />
                </LazySection>

                <StringGap />
                <LazySection height={1150}>
                  <ContactSection />
                </LazySection>

                <Footer />
              </div>
            </div>
          </div>

          <MobileHud />
          <MobileNightShiftOverlay />
          <CaseFileModal />
        </NightShiftProvider>
      </CaseFileProvider>
    </LanguageProvider>
  );
}
