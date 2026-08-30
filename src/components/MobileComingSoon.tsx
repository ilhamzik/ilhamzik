import { MagnifyingGlassIcon, StampMark } from "./icons";
import { profile } from "../data/content";

/**
 * Shown instead of the whole pannable map on phones/tablets. The map is
 * fundamentally a mouse-and-big-screen experience (drag-to-pan, hover
 * states, dense text at map scale) — rather than ship a laggy, half-broken
 * version to touch devices, just ask nicely for a bigger screen.
 */
export function MobileComingSoon() {
  return (
    <div className="min-h-screen w-full bg-paper-gradient paper-grain flex items-center justify-center p-6">
      <div className="relative max-w-sm w-full bg-[#f2e6c4] border-[3px] border-ink-700 shadow-case p-6 sm:p-8 text-center">
        <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-80" />

        <p className="font-typewriter text-[10px] uppercase tracking-widest text-ink-500/70 mb-2">
          {profile.caseNumber}
        </p>

        <h1 className="font-headline font-black text-3xl text-ink-800 mb-4">ilhamzik</h1>

        <h2 className="font-headline text-xl font-bold text-ink-800 mb-3">Best on a Bigger Screen</h2>
        <p className="font-body text-sm text-ink-500 leading-relaxed mb-4">
          This case board is built for a mouse and a big screen, dragging around a big interactive map doesn't
          translate well to a phone yet. Mobile support is coming soon.
        </p>
        <p className="font-body text-sm text-ink-500 leading-relaxed mb-6">
          For now, open <span className="font-bold">ilhamzik.com</span> on a laptop or desktop browser for the full
          experience.
        </p>

        <div className="border-t border-dashed border-ink-500/30 pt-4 mb-2">
          <p className="font-body text-xs text-ink-500/70 leading-relaxed">
            Papan investigasi ini didesain untuk mouse dan layar besar. Dukungan HP/tablet segera hadir, buka{" "}
            <span className="font-bold">ilhamzik.com</span> lewat browser laptop/desktop untuk pengalaman penuhnya.
          </p>
        </div>

        <div className="w-32 mx-auto mt-4 opacity-90 rotate-[-6deg]">
          <StampMark text="COMING SOON" />
        </div>
      </div>
    </div>
  );
}
