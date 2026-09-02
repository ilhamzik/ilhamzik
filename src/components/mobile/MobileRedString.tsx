import { useLayoutEffect, useState, type RefObject } from "react";
import { PushpinIcon } from "../icons";

interface Props {
  /** The relatively-positioned column that holds the sections. */
  columnRef: RefObject<HTMLDivElement>;
}

interface Waypoint {
  /** Horizontal position as a percentage of column width. */
  xPct: number;
  /** Vertical position in px from the top of the column. */
  y: number;
}

interface Box {
  w: number;
  h: number;
}

/**
 * One continuous investigation string for the whole mobile column, in the
 * spirit of the desktop `RedString`: mounted in full from the start (a
 * cheap static stroked SVG, no filter, no animation) and threaded pin to
 * pin down the page so it visibly points from one section to the next,
 * rather than sitting in the gaps as disconnected fragments.
 *
 * Geometry comes from the `[data-string-node]` anchors the column renders
 * between sections (each carries a `data-x` percentage), re-measured
 * whenever layout changes so the string stays attached as lazy sections
 * mount. Segments are S-curves that leave and enter each pin vertically:
 * that keeps most of the thread running down the margins and crossing the
 * text column only briefly, so the board reads busy without trampling the
 * articles. Three layers do the work: a taut main thread, a loose offset
 * strand, and faint skip-one cross-links.
 */
export function MobileRedString({ columnRef }: Props) {
  const [wps, setWps] = useState<Waypoint[]>([]);
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const col = columnRef.current;
    if (!col) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const anchors = Array.from(col.querySelectorAll<HTMLElement>("[data-string-node]"));
      if (anchors.length < 2) return;
      const colTop = col.getBoundingClientRect().top;
      setWps(
        anchors.map((el) => {
          const r = el.getBoundingClientRect();
          return { xPct: Number(el.dataset.x) || 50, y: r.top - colTop + r.height / 2 };
        })
      );
      setBox({ w: col.offsetWidth, h: col.offsetHeight });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(col);
    window.addEventListener("resize", schedule);
    // one more pass after web fonts land and shift the layout
    const t = window.setTimeout(measure, 600);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [columnRef]);

  if (wps.length < 2 || !box.w || !box.h) return null;

  const px = (w: Waypoint) => (w.xPct / 100) * box.w;

  /**
   * Runs straight down `a`'s margin for the length of the section, then
   * swings across to `b` only in the whitespace just above that pin. A
   * plain diagonal would cut through every paragraph instead.
   */
  const segment = (a: Waypoint, b: Waypoint, dx = 0) => {
    const ax = px(a) + dx;
    const bx = px(b) + dx;
    const dy = b.y - a.y;
    const cross = Math.max(50, Math.min(110, dy * 0.5));
    const turn = b.y - cross;
    return (
      `M${ax},${a.y} L${ax},${turn} ` +
      `C${ax},${turn + cross * 0.55} ${bx},${b.y - cross * 0.55} ${bx},${b.y}`
    );
  };

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-x-0 top-0"
        width={box.w}
        height={box.h}
        aria-hidden
      >
        {/* faint skip-one cross links, the frantic "everything connects" layer */}
        {wps.slice(0, -2).map((a, i) => (
          <line
            key={`cross-${i}`}
            x1={px(a)} y1={a.y}
            x2={px(wps[i + 2])} y2={wps[i + 2].y}
            stroke="#6f2117" strokeWidth={1} opacity={0.18}
          />
        ))}

        {/* loose second strand running alongside the main thread */}
        {wps.slice(0, -1).map((a, i) => (
          <path
            key={`loose-${i}`}
            d={segment(a, wps[i + 1], a.xPct < 50 ? 7 : -7)}
            fill="none" stroke="#8a2b1e" strokeWidth={1.5} opacity={0.38}
          />
        ))}

        {/* taut main thread */}
        {wps.slice(0, -1).map((a, i) => (
          <path
            key={`main-${i}`}
            d={segment(a, wps[i + 1])}
            fill="none" stroke="#6f2117" strokeWidth={2.6} opacity={0.8}
          />
        ))}
      </svg>

      {wps.map((p, i) => (
        <span
          key={`pin-${i}`}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.xPct}%`, top: p.y }}
        >
          <PushpinIcon className="h-4 w-4" />
        </span>
      ))}
    </>
  );
}
