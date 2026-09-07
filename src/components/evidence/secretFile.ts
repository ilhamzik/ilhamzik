import { useCallback, useEffect, useRef } from "react";

/** Fired by the hidden triggers. `SecretFrame` is the only listener. */
export const SECRET_EVENT = "ilhamzik:secret-file";

export function openSecretFile() {
  window.dispatchEvent(new Event(SECRET_EVENT));
}

const HOLD_MS = 650;
/** Past this much drift the press is a drag, not a hold. */
const MOVE_TOLERANCE = 12;

/**
 * Press-and-hold trigger, so phones have a way into the easter egg (there is
 * no Ctrl key to press). Spread the returned props onto the hidden trigger.
 *
 * The move/end listeners go on `window` rather than the element: on desktop
 * the trigger lives inside the pannable world, whose pointer handler takes
 * pointer capture, so the element itself never receives pointerup. Cancelling
 * on drift is what stops a drag of the map from springing the egg.
 */
export function useHoldTrigger(onHold: () => void) {
  const press = useRef<{ timer: number; x: number; y: number; cleanup: () => void } | null>(null);

  const end = useCallback(() => {
    if (!press.current) return;
    window.clearTimeout(press.current.timer);
    press.current.cleanup();
    press.current = null;
  }, []);

  useEffect(() => end, [end]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      end();
      const x = e.clientX;
      const y = e.clientY;

      const onMove = (ev: PointerEvent) => {
        if (!press.current) return;
        if (Math.hypot(ev.clientX - press.current.x, ev.clientY - press.current.y) > MOVE_TOLERANCE) end();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      const cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
      };

      const timer = window.setTimeout(() => {
        end();
        onHold();
      }, HOLD_MS);
      press.current = { timer, x, y, cleanup };
    },
    [end, onHold]
  );

  return {
    onPointerDown,
    // A long press on text otherwise raises the selection / context menu.
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}
