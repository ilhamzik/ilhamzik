import { Fragment, useEffect, useRef, useState, type ComponentType } from "react";

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

import { pressCredits, profile, stickyNotes } from "../../data/content";
import { LazySection } from "./LazySection";
import { MobileHud, NAV_IDS } from "./MobileHud";
import { MobileNightShiftOverlay } from "./MobileNightShiftOverlay";
import { MobileRedString } from "./MobileRedString";
import { FORCE_DESKTOP_KEY } from "./forceDesktop";

const INTRO = {
  id: "Sebuah investigasi masih berjalan di balik nama ini. Setiap bagian dari koran ini menyimpan potongan bukti. Gulir terus ke bawah untuk menyusuri berkasnya, dan ikuti benang merahnya kalau penasaran ke mana ceritanya berlanjut.",
  en: "An investigation is still underway behind this name. Every section of this paper holds a piece of evidence. Scroll on down to work through the file, and follow the red string if you're curious where the story leads next.",
};

/** Header height to clear: fixed HUD is ~84px, plus a little breathing room. */
const HEADER_CLEARANCE = 104;

const SECTIONS: { Comp: ComponentType; h: number }[] = [
  { Comp: EducationSection, h: 1100 },
  { Comp: InterestsSection, h: 950 },
  { Comp: ExperienceSection, h: 1200 },
  { Comp: SkillsSection, h: 1150 },
  { Comp: ProjectsSection, h: 1200 },
  { Comp: ContactSection, h: 1150 },
];

/**
 * An always-rendered anchor the whole-column red string routes through.
 * Doubles as the breathing room between two stacked sections.
 */
function StringNode({ x, className = "h-14" }: { x: number; className?: string }) {
  return <div data-string-node data-x={x} className={className} aria-hidden />;
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

function MobileShell() {
  const { lang } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("");
  const [showTop, setShowTop] = useState(false);

  // One rAF-throttled scroll listener drives both the active INDEX chip and
  // the back-to-top button. `getBoundingClientRect` on ~6 mounted sections
  // per frame is cheap; no observer lifecycle to juggle against lazy mount.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur = "";
      for (const id of NAV_IDS) {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= HEADER_CLEARANCE + 48) cur = id;
      }
      setActiveId((prev) => (prev === cur ? prev : cur));
      setShowTop(el.scrollTop > 1200);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={scrollerRef}
        className="h-screen overflow-y-auto overflow-x-hidden overscroll-none bg-ink-900"
        style={{ scrollBehavior: "smooth", scrollPaddingTop: `${HEADER_CLEARANCE}px` }}
      >
        {/* No torn-edge clip here: its polygon is tuned for the wide/short
           desktop world; on a ~390px-wide, very tall column the teeth blow
           up into full-height black spikes. Paper grain + gradient carry
           the vintage look on their own. */}
        <div className="bg-paper-gradient paper-grain pt-[92px] pb-4">
          <div ref={columnRef} className="relative max-w-[680px] mx-auto px-1">
            {/* Drawn first so the column's content paints over it. */}
            <MobileRedString columnRef={columnRef} />

            <div className="relative">
              <Masthead />
              <WantedPoster />

              <StringNode x={7} className="h-4" />

              {stickyNotes.home && (
                <div className="px-4 flex justify-end -mt-1 mb-2">
                  <StickyNote caseFile={stickyNotes.home} />
                </div>
              )}

              <LeadParagraph text={INTRO} />

              {SECTIONS.map(({ Comp, h }, i) => (
                <Fragment key={i}>
                  <StringNode x={i % 2 === 1 ? 93 : 7} />
                  <LazySection height={h}>
                    <Comp />
                  </LazySection>
                </Fragment>
              ))}

              <StringNode x={7} className="h-6" />
              <Footer />
            </div>
          </div>
        </div>
      </div>

      <MobileHud activeId={activeId} />
      <MobileNightShiftOverlay />
      <CaseFileModal />

      {showTop && (
        <button
          type="button"
          onClick={() => scrollerRef.current?.scrollTo({ top: 0 })}
          className="fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-ink-700/90 text-lg text-paper-100 shadow-pinned active:bg-blood-600"
          aria-label={lang === "id" ? "Kembali ke atas" : "Back to top"}
        >
          ↑
        </button>
      )}
    </>
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
          <MobileShell />
        </NightShiftProvider>
      </CaseFileProvider>
    </LanguageProvider>
  );
}
