import { useLayoutEffect, useState } from "react";
import { PushpinIcon } from "../icons";

interface Props {
  /**
   * The relatively-positioned column that holds the sections. Passed as the
   * resolved element, not a ref: this component renders *inside* that
   * column, and React attaches a host element's ref bottom-up during the
   * layout phase, so a child's layout effect runs before its parent's ref
   * exists. Reading `parentRef.current` here found null and silently gave
   * up in production (dev only appeared to work because StrictMode invokes
   * effects twice). The column is held in state upstream instead, so this
   * re-renders once the node is really there.
   */
  column: HTMLDivElement | null;
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
export function MobileRedString({ column }: Props) {
  const [wps, setWps] = useState<Waypoint[]>([]);
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const col = column;
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
  }, [column]);

  if (wps.length < 2 || !box.w || !box.h) return null;

  const px = (w: Waypoint) => (w.xPct / 100) * box.w;

  /** Stable pseudo-random in [0,1) — the tangle must not reshuffle on every
   *  re-measure, so it is derived from the link's own indices, not Math.random. */
  const rand = (seed: number) => {
    const x = Math.sin(seed * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  const jitter = (seed: number, amount: number) => (rand(seed) - 0.5) * 2 * amount;

  /**
   * The chaos layer: every waypoint gets tied to the ones two, three, four
   * and five sections away, with jittered endpoints and a bit of bow, so
   * the board looks strung by someone in a hurry rather than plotted. Kept
   * hairline and faint on purpose — these are the only strands that cross
   * the article text.
   */
  const tangle: { d: string; w: number; o: number }[] = [];
  for (let skip = 2; skip <= 5; skip++) {
    for (let i = 0; i + skip < wps.length; i++) {
      const a = wps[i];
      const b = wps[i + skip];
      const seed = i * 13 + skip * 71;
      const ax = px(a) + jitter(seed, 16);
      const ay = a.y + jitter(seed + 1, 12);
      const bx = px(b) + jitter(seed + 2, 16);
      const by = b.y + jitter(seed + 3, 12);
      const mx = (ax + bx) / 2 + jitter(seed + 4, 70);
      const my = (ay + by) / 2 + jitter(seed + 5, 40);
      tangle.push({
        d: `M${ax},${ay} Q${mx},${my} ${bx},${by}`,
        w: 0.7 + rand(seed + 6) * 0.6,
        // longer reaches hang back so the near ties still read first
        o: (0.1 + rand(seed + 7) * 0.14) * (skip >= 4 ? 0.75 : 1),
      });
    }
  }

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
        {/* the chaos layer */}
        {tangle.map((l, i) => (
          <path
            key={`tangle-${i}`}
            d={l.d}
            fill="none" stroke="#6f2117" strokeWidth={l.w} opacity={l.o}
          />
        ))}

        {/* loose strands bundled alongside the main thread down the gutter */}
        {wps.slice(0, -1).map((a, i) => (
          <path
            key={`loose-${i}`}
            d={segment(a, wps[i + 1], a.xPct < 50 ? 7 : -7)}
            fill="none" stroke="#8a2b1e" strokeWidth={1.5} opacity={0.38}
          />
        ))}
        {wps.slice(0, -1).map((a, i) => (
          <path
            key={`loose2-${i}`}
            d={segment(a, wps[i + 1], a.xPct < 50 ? 14 : -14)}
            fill="none" stroke="#8a2b1e" strokeWidth={1} opacity={0.22}
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
