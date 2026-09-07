import { LanguageProvider } from "./context/LanguageContext";
import { CaseFileProvider } from "./context/CaseFileContext";
import { MapProvider } from "./context/MapContext";
import { NightShiftProvider } from "./context/NightShiftContext";
import { WorldCanvas } from "./components/map/WorldCanvas";
import { MapNode } from "./components/map/MapNode";
import { RedString } from "./components/map/RedString";
import { Hud } from "./components/map/Hud";
import { PaperDecor } from "./components/map/PaperDecor";
import { NightShiftOverlay } from "./components/map/NightShiftOverlay";
import { NODES } from "./components/map/mapLayout";
import { Masthead } from "./components/layout/Masthead";
import { LeadParagraph } from "./components/layout/LeadParagraph";
import { CaseSummary } from "./components/layout/CaseSummary";
import { WantedPoster } from "./components/sections/WantedPoster";
import { InterestsSection } from "./components/sections/InterestsSection";
import { EducationSection } from "./components/sections/EducationSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { ContactSection } from "./components/sections/ContactSection";
import { CaseFileModal } from "./components/evidence/CaseFileModal";
import { SecretFrame } from "./components/evidence/SecretFrame";
import { StickyNote } from "./components/evidence/StickyNote";
import { pressCredits, profile, stickyNotes } from "./data/content";
import { useLanguage } from "./context/LanguageContext";
import { useMap } from "./context/MapContext";
import { useIsMobileOrTablet } from "./hooks/useIsMobileOrTablet";
import { MobileView } from "./components/mobile/MobileView";
import { isForceDesktop } from "./components/mobile/forceDesktop";

function SummaryWithNav() {
  const { recenterOn } = useMap();
  const node = NODES.contact;
  return <CaseSummary onContact={() => recenterOn(node.x + node.width / 2, node.y + 300)} />;
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="text-center py-6 font-typewriter text-xs text-ink-500/60 tracking-widest uppercase">
      <p>* * * End of Report * * *</p>
      <p className="normal-case tracking-normal mt-1 text-[10px] opacity-70">
        {t(pressCredits)} {t(profile.issueDate)}.
      </p>
    </footer>
  );
}

function App() {
  const home = NODES.home;
  const isMobileOrTablet = useIsMobileOrTablet();

  if (isMobileOrTablet && !isForceDesktop()) {
    return <MobileView />;
  }

  return (
    <LanguageProvider>
      <CaseFileProvider>
        <NightShiftProvider>
          <MapProvider>
            <WorldCanvas initialCenter={{ x: home.x + home.width / 2, y: home.y }}>
              <RedString />
              <PaperDecor />

              <MapNode {...NODES.home}>
                {/* Wrapper, not `absolute` on the note itself: StickyNote's
                    base class includes `relative` and Tailwind emits
                    `.relative` after `.absolute`, so the utility passed in
                    via className lost and the note landed at the top-left of
                    the node instead of the right corner. Same fix as
                    Section.tsx. */}
                {stickyNotes.home && (
                  <div className="flex justify-end pr-2 sm:pr-10 mb-1">
                    <StickyNote caseFile={stickyNotes.home} />
                  </div>
                )}
                <Masthead />
                <WantedPoster />
                <LeadParagraph
                  text={{
                    id: "Sebuah investigasi masih berjalan di balik nama ini. Setiap bagian dari koran ini menyimpan potongan bukti. Geser peta untuk menjelajah, dan ikuti benang merahnya kalau penasaran ke mana ceritanya berlanjut.",
                    en: "An investigation is still underway behind this name. Every section of this paper holds a piece of evidence. Drag the map to explore, and follow the red string if you're curious where the story leads next.",
                  }}
                />
                <SummaryWithNav />
              </MapNode>

              <MapNode {...NODES.education}>
                <EducationSection />
              </MapNode>
              <MapNode {...NODES.interests}>
                <InterestsSection />
              </MapNode>
              <MapNode {...NODES.experience}>
                <ExperienceSection />
              </MapNode>
              <MapNode {...NODES.skills}>
                <SkillsSection />
              </MapNode>
              <MapNode {...NODES.projects}>
                <ProjectsSection />
              </MapNode>
              <MapNode {...NODES.contact}>
                <ContactSection />
                <Footer />
              </MapNode>
            </WorldCanvas>

            <Hud />
            <NightShiftOverlay />
          </MapProvider>
        </NightShiftProvider>

        <CaseFileModal />
            <SecretFrame />
      </CaseFileProvider>
    </LanguageProvider>
  );
}

export default App;
