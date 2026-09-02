import { useNightShift } from "../../context/NightShiftContext";

/**
 * Mobile Night Shift: a plain dusk-dim over the whole page. The desktop
 * version follows the cursor with a flashlight hole, but touch has no
 * cursor, so this just drops the lights with a flat gradient. No pointer
 * listener, no rAF, `pointer-events-none` so scrolling underneath is
 * untouched.
 */
export function MobileNightShiftOverlay() {
  const { active } = useNightShift();
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none"
      style={{
        background:
          "radial-gradient(150% 100% at 50% 25%, rgba(6,8,16,0.45) 0%, rgba(4,6,12,0.78) 55%, rgba(2,3,7,0.92) 100%)",
      }}
    />
  );
}
