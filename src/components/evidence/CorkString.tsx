import { useCallback, useEffect, useLayoutEffect, useState } from "react";

interface CorkStringProps {
  /** The corkboard element. Passed as an *element*, not a ref object: React
   *  fills a child's ref during layout before the parent's, so reading a
   *  parent ref from a child's effect gets null. Same lesson as
   *  MobileRedString — see CLAUDE.md. */
  board: HTMLElement | null;
}

/**
 * Red string strung between the pushpins on the corkboard. Positions are
 * measured from the live `[data-pin]` markers rather than hardcoded, so the
 * string keeps meeting the pins through any reflow (language switch, wrap
 * at a different breakpoint, font load).
 */
export function CorkString({ board }: CorkStringProps) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [pins, setPins] = useState<{ x: number; y: number }[]>([]);

  const measure = useCallback(() => {
    if (!board) return;
    const b = board.getBoundingClientRect();
    setBox({ w: b.width, h: b.height });
    setPins(
      Array.from(board.querySelectorAll<HTMLElement>("[data-pin]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height * 0.42 };
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

  // Each leg sags under its own weight: a quadratic with the control point
  // pushed below the midpoint, more for longer spans.
  const d = pins
    .slice(1)
    .map((p, i) => {
      const a = pins[i];
      const span = Math.hypot(p.x - a.x, p.y - a.y);
      const sag = Math.min(34, 10 + span * 0.07);
      return `Q ${(a.x + p.x) / 2} ${(a.y + p.y) / 2 + sag} ${p.x} ${p.y}`;
    })
    .join(" ");
  const path = `M ${pins[0].x} ${pins[0].y} ${d}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={box.w}
      height={box.h}
      viewBox={`0 0 ${box.w} ${box.h}`}
      aria-hidden="true"
    >
      {/* cast shadow, offset onto the cork */}
      <path d={path} fill="none" stroke="rgba(20,14,8,0.4)" strokeWidth="3" transform="translate(1.5 2.5)" />
      {/* the twine itself, plus a lighter core so it reads as fibre */}
      <path d={path} fill="none" stroke="#8f1f1f" strokeWidth="2.6" strokeLinecap="round" />
      <path d={path} fill="none" stroke="#c74a37" strokeWidth="0.9" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}
