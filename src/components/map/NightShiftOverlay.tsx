import { useEffect, useRef } from "react";
import { useNightShift } from "../../context/NightShiftContext";

/**
 * A flashlight-in-the-dark effect: the whole viewport goes near-black except
 * for a circle that follows the cursor, revealing the paper underneath.
 * Position is tracked imperatively (no React re-renders on mousemove) for
 * smooth 60fps tracking.
 */
export function NightShiftOverlay() {
  const { active } = useNightShift();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const setPos = (x: number, y: number) => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    // start centered so it doesn't flash top-left before the first move
    setPos(window.innerWidth / 2, window.innerHeight / 2);

    const onMove = (e: PointerEvent) => setPos(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-30 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle 210px at var(--mx, 50%) var(--my, 50%), rgba(6,8,16,0.12) 0%, rgba(4,6,12,0.55) 42%, rgba(3,4,9,0.92) 66%, rgba(2,3,7,0.98) 100%)",
        transition: "background 0.05s linear",
      }}
    />
  );
}
