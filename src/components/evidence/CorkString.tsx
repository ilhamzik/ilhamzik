import { useCallback, useEffect, useLayoutEffect, useState } from "react";

interface CorkStringProps {
  /** The corkboard element. Passed as an *element*, not a ref object: React
   *  fills a child's ref during layout before the parent's, so reading a
   *  parent ref from a child's effect gets null. Same lesson as
   *  MobileRedString — see CLAUDE.md. */
  board: HTMLElement | null;
}

type Pt = { x: number; y: number };

/** Samples per span. Enough for the waviness to read, few enough to keep the
 *  path string short. */
const STEPS = 16;

const n = (v: number) => (Number.isFinite(v) ? Math.round(v * 10) / 10 : 0);

/** Deterministic pseudo-random in [0,1) (mulberry32's mixer). Seeded off the
 *  span index, never `Math.random()`: the geometry is re-derived on every
 *  ResizeObserver pass, and true randomness would make the string shiver
 *  every time the board reflows. Same rule as MobileRedString. */
function rnd(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Points along one hanging span of twine.
 *
 * Built by sampling rather than by fitting a single curve, because what makes
 * twine look like twine is what a formula leaves out: it hangs, it hangs
 * lopsided, and it is never perfectly smooth. So each sample gets
 *
 *   - gravity, as a sag profile that is zero at both pins and skewed towards
 *     one end so no two spans hang the same way;
 *   - a slow perpendicular wave of two seeded sine terms, roughly a pixel,
 *     faded out at both ends — the slack a real length carries along itself;
 *   - optionally a sideways bulge, used when the board collapses to one
 *     column and every pin shares an x (see the caller).
 */
function span(a: Pt, b: Pt, seed: number, bulge = 0): Pt[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;

  const sag = Math.min(40, 11 + len * 0.08) * (0.85 + rnd(seed) * 0.4);
  const skew = (rnd(seed * 3) - 0.5) * 0.9;
  const wave = 0.7 + rnd(seed * 5) * 0.8;
  const freq1 = 1.4 + rnd(seed * 7) * 1.3;
  const freq2 = 2.7 + rnd(seed * 11) * 1.8;
  const phase = rnd(seed * 13) * Math.PI * 2;

  const out: Pt[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    // zero at both ends, so the string always meets its pins
    const hang = 4 * t * (1 - t) * (1 + skew * (t - 0.5));
    const ripple =
      (Math.sin(t * Math.PI * freq1 + phase) * wave +
        Math.sin(t * Math.PI * freq2 + phase * 1.7) * wave * 0.4) *
      Math.sin(t * Math.PI);
    const off = bulge * hang + ripple;
    out.push({
      x: a.x + dx * t + px * off,
      y: a.y + dy * t + py * off + sag * hang,
    });
  }
  return out;
}

/** Smooth path through every point, Catmull-Rom converted to cubics. Keeps the
 *  sampled waviness while never showing a corner. */
function smooth(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${n(pts[0].x)} ${n(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d +=
      ` C ${n(p1.x + (p2.x - p0.x) / 6)} ${n(p1.y + (p2.y - p0.y) / 6)}` +
      ` ${n(p2.x - (p3.x - p1.x) / 6)} ${n(p2.y - (p3.y - p1.y) / 6)}` +
      ` ${n(p2.x)} ${n(p2.y)}`;
  }
  return d;
}

/**
 * Red string strung between the pushpins on the corkboard.
 *
 * One length of twine wound from file to file in timeline order, and it goes
 * over whatever is in the way: this is a board somebody has been working, not
 * a diagram. Routing it around the cards through the empty channels was tried
 * and read as pipework, boxes drawn around the files rather than string tying
 * them together.
 *
 * Two things this has to get right, both learned the hard way:
 *
 * 1. **It paints above the cards** (`z-10`, under the pin heads at `z-20`).
 *    It used to sit behind them, so every span was swallowed by the card it
 *    started from and all that showed was the middle of each run floating in
 *    the gutter, attached to nothing. The string looked random when it was
 *    pin-to-pin the whole time — that, not the geometry, was the original bug.
 * 2. **Positions are divided back out of any ancestor scale.** See `measure`.
 */
export function CorkString({ board }: CorkStringProps) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [pins, setPins] = useState<Pt[]>([]);

  const measure = useCallback(() => {
    if (!board) return;
    const b = board.getBoundingClientRect();

    // `getBoundingClientRect` reports *transformed* pixels while the SVG we
    // draw into is sized in layout pixels, so any scale on an ancestor has to
    // be divided back out. Two are live in this app: mobile sections mount
    // inside LazySection's `.animate-popIn`, which runs `scale(0.85) ->
    // scale(1)`, and the whole desktop map is a `scale()`-d world. Measuring
    // the rect directly left the string laid out at 0.85x and stuck there,
    // because ResizeObserver does not fire for a transform change.
    const s = board.offsetWidth ? b.width / board.offsetWidth : 1;
    const k = s > 0.01 ? s : 1;

    setBox({ w: board.clientWidth, h: board.clientHeight });
    setPins(
      Array.from(board.querySelectorAll<HTMLElement>("[data-pin]")).map((el) => {
        const r = el.getBoundingClientRect();
        // The SVG is positioned against the padding box, so the origin sits
        // inside the 6px cork frame, not at the border-box edge.
        return {
          x: (r.left - b.left) / k - board.clientLeft + r.width / (2 * k),
          y: (r.top - b.top) / k - board.clientTop + (r.height * 0.42) / k,
        };
      })
    );
  }, [board]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    if (!board) return;
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    board.querySelectorAll("[data-pin]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [board, measure]);

  if (pins.length < 2 || !box.w) return null;

  // Do all the pins sit on one vertical line? True whenever the board
  // collapses to a single column. A taut span between two of them would come
  // straight down through the middle of the card in between, so the string is
  // bulged out to alternating sides and crosses each card on the diagonal.
  const xs = pins.map((p) => p.x);
  const stacked = Math.max(...xs) - Math.min(...xs) < 60;

  const path = pins
    .slice(1)
    .map((q, i) => {
      const p = pins[i];
      const len = Math.hypot(q.x - p.x, q.y - p.y);
      return smooth(span(p, q, i * 17 + 3, stacked ? (i % 2 ? 1 : -1) * len * 0.42 : 0));
    })
    .join(" ");

  return (
    <svg
      className="absolute inset-0 z-10 pointer-events-none"
      width={box.w}
      height={box.h}
      viewBox={`0 0 ${box.w} ${box.h}`}
      aria-hidden="true"
    >
      {/* Cast shadow. The string lies over the cards, and this is what sells
          it as sitting above the paper rather than being printed on it. */}
      <path
        d={path}
        fill="none"
        strokeLinecap="round"
        stroke="rgba(22,15,9,0.34)"
        strokeWidth="3.2"
        transform="translate(1.6 2.8)"
      />

      {/* The fibre: a dark body with a thin highlight just above it, so the
          twine reads as round and lit from the top left rather than as a flat
          vector line. */}
      <g fill="none" strokeLinecap="round">
        <path data-main d={path} stroke="#7e1b1b" strokeWidth="2.5" />
        <path d={path} stroke="#c9503c" strokeWidth="0.9" opacity="0.5" transform="translate(-0.3 -0.7)" />
      </g>
    </svg>
  );
}
