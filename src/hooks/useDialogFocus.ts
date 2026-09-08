import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE =
  "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Keyboard plumbing every dialog on this site needs.
 *
 * Without it a keyboard visitor opens a case file and their focus is still on
 * the evidence item *behind* the backdrop: Tab then walks the page underneath
 * the modal, invisibly. This moves focus in on open, keeps Tab inside while
 * it is up, and puts focus back on whatever opened it on close, so the person
 * lands where they left off instead of at the top of the document.
 *
 * Returns a ref to put on the dialog element. Escape is left to the caller,
 * since each dialog already owns that and closes for its own reasons.
 */
export function useDialogFocus(open: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const focusables = useCallback(
    () => (ref.current ? Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)) : []),
    []
  );

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;

    // Wait a frame: the panel mounts with an entrance transform and framer
    // has not settled its children yet on the first tick.
    const id = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const first = focusables()[0];
      if (first) first.focus();
      else {
        // No controls inside (the easter-egg frame is nearly all artwork):
        // focus the panel itself so screen readers announce it and Tab has
        // somewhere to start.
        el.setAttribute("tabindex", "-1");
        el.focus();
      }
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // Wrap at both ends, and pull focus back in if it has escaped the panel
      // (which is what happens on the very first Tab, since the trigger that
      // opened the dialog still sits in the tab order behind it).
      if (!ref.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey, true);
      // Only take focus back if it is still somewhere in the closing dialog;
      // if the person has clicked elsewhere in the meantime, leave them be.
      const target = restoreTo.current;
      if (target && document.body.contains(target)) target.focus();
    };
  }, [open, focusables]);

  return ref;
}
