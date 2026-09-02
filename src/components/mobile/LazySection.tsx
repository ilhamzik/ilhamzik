import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /**
   * Rough rendered-height estimate in px. Only affects when the section
   * mounts and how stable the scrollbar is before it does — a generous
   * guess never clips content.
   */
  height: number;
  className?: string;
}

/**
 * Keeps a stacked section cheap until the reader scrolls near it.
 *
 * Two independent levers:
 *  - `content-visibility: auto` lets the browser skip layout/paint for the
 *    section while it's off-screen (native, no JS).
 *  - a mount-once IntersectionObserver: the real children (and every Framer
 *    Motion instance inside them) don't exist in the tree until the section
 *    comes within ~800px of the viewport, then they stay mounted for good so
 *    scrolling back up never jumps.
 */
export function LazySection({ children, height, className = "" }: LazySectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ contentVisibility: "auto", containIntrinsicSize: `0 ${height}px` }}
    >
      {shown ? (
        <div className="animate-popIn">{children}</div>
      ) : (
        <div style={{ minHeight: height }} aria-hidden />
      )}
    </div>
  );
}
