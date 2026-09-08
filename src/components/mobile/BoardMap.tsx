import { useLanguage } from "../../context/LanguageContext";
import { NODES, NODE_LABELS, STRING_PATH, WORLD_HEIGHT, WORLD_WIDTH } from "../map/mapLayout";
import { PushpinIcon } from "../icons";
import { jumpToAnchor } from "./jumpTo";

/** Pin colours, cycled so the board doesn't look mass-produced. Same palette
 *  as the corkboard in the experience section. */
const PIN_COLORS = ["#7a1f1f", "#2a4d3a", "#8f6c39", "#1f3a5c", "#5c2a4d", "#2a4d4d", "#7a4a1f"];
/** Hand-placed tilt per file, in reading order of STRING_PATH. */
const TILTS = [-2.5, 1.5, 2.5, -1.5, 2, -2, 1];

const pctX = (v: number) => `${(v / WORLD_WIDTH) * 100}%`;
const pctY = (v: number) => `${(v / WORLD_HEIGHT) * 100}%`;

/**
 * The whole investigation board, seen from above, on one screen.
 *
 * The desktop site is a single pannable world and that is its entire idea.
 * Phone visitors get a stacked column instead (the world was tried on phones
 * and was too heavy), which reads fine but never tells them the thing they
 * are scrolling *is* a board. Most people arriving from a link are on a
 * phone, so the site's central conceit was reaching the smallest share of its
 * audience.
 *
 * So: the same coordinates the desktop map is built from, drawn as a plan of
 * the board. Every file is a tap target that jumps to that section. Cheap by
 * construction, since it is a handful of divs and one SVG with no images and
 * nothing animated.
 *
 * `nav-<id>` targets are the permanent anchors the column renders above each
 * section (see MobileView) rather than the sections' own ids, which do not
 * exist until LazySection mounts them.
 */
export function BoardMap() {
  const { t } = useLanguage();

  return (
    <section
      id="board"
      aria-label={t({ id: "Papan perkara", en: "The case board" })}
      className="px-3 mb-6 mt-1"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="h-px flex-1 bg-ink-500/30" />
        <span className="font-typewriter text-[10px] tracking-[0.3em] uppercase text-blood-600">
          {t({ id: "Papan Perkara", en: "The Case Board" })}
        </span>
        <span className="h-px flex-1 bg-ink-500/30" />
      </div>
      <p className="font-hand text-[15px] text-ink-500/80 text-center mb-3">
        {t({
          id: "Semuanya terpasang di satu papan. Sentuh berkasnya untuk melompat.",
          en: "It is all pinned to one board. Tap a file to jump to it.",
        })}
      </p>

      <div
        className="relative w-full max-w-[320px] mx-auto rounded-md border-[5px] border-[#4a3218] overflow-hidden"
        style={{
          aspectRatio: `${WORLD_WIDTH} / ${WORLD_HEIGHT}`,
          background: "radial-gradient(circle at 20% 15%, #7d6242 0%, #6b502a 55%, #533f1f 100%)",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.5), 0 8px 18px -10px rgba(0,0,0,0.6)",
        }}
      >
        {/* cork speckle: two static dot layers, same trick as the corkboard */}
        <span
          className="absolute inset-0 pointer-events-none opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(40,26,10,0.9) 0.9px, transparent 1.1px), radial-gradient(circle at 50% 50%, rgba(240,220,180,0.5) 0.7px, transparent 0.9px)",
            backgroundSize: "13px 11px, 19px 17px",
            backgroundPosition: "0 0, 6px 5px",
          }}
        />

        {/* The red string, in world coordinates. `non-scaling-stroke` keeps it
            a hair thick on screen no matter how far the viewBox is scaled. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
          aria-hidden="true"
        >
          {STRING_PATH.slice(1).map((id, i) => {
            const a = NODES[STRING_PATH[i]].pin;
            const b = NODES[id].pin;
            const sag = Math.hypot(b.x - a.x, b.y - a.y) * 0.08;
            return (
              <path
                key={id}
                d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + sag} ${b.x} ${b.y}`}
                fill="none"
                stroke="#8f1f1f"
                strokeWidth={1.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {STRING_PATH.map((id, i) => {
          const n = NODES[id];
          const isHome = id === "home";
          return (
            <a
              key={id}
              href={isHome ? "#top" : `#nav-${id}`}
              onClick={(e) => {
                e.preventDefault();
                void jumpToAnchor(isHome ? "top" : `nav-${id}`);
              }}
              className="absolute block bg-[#f2e6c4] border border-ink-700/50 shadow-[0_2px_4px_rgba(10,8,5,0.4)] active:bg-blood-600 active:text-paper-50 transition-colors"
              style={{
                left: pctX(n.x),
                top: pctY(n.y),
                width: pctX(n.width),
                height: pctY(n.height),
                transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
              }}
            >
              <span className="absolute inset-x-0 top-[18%] px-0.5 font-typewriter text-[8px] leading-tight uppercase tracking-tight text-center break-words">
                {t(NODE_LABELS[id])}
              </span>
              {isHome && (
                <span className="absolute inset-x-0 bottom-[14%] font-typewriter text-[6px] uppercase tracking-widest text-blood-600/80 text-center">
                  {t({ id: "Anda di sini", en: "You are here" })}
                </span>
              )}
            </a>
          );
        })}

        {/* Pins go on last so they read as holding the files and the string
            down, and they sit outside the tap targets so they never eat a tap. */}
        {STRING_PATH.map((id, i) => {
          const p = NODES[id].pin;
          return (
            <PushpinIcon
              key={id}
              color={PIN_COLORS[i % PIN_COLORS.length]}
              className="absolute w-3 h-3 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: pctX(p.x), top: pctY(p.y) }}
            />
          );
        })}
      </div>
    </section>
  );
}
