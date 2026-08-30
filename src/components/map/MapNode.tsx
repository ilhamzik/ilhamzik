import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMap } from "../../context/MapContext";

interface MapNodeProps {
  x: number;
  y: number;
  width: number;
  /** Approximate rendered height in world px, for the visibility check below. */
  height: number;
  children: ReactNode;
  className?: string;
}

/** World-space slack around the visible viewport before a node mounts/unmounts.
 * Kept small on purpose — sections near "home" sit only ~200-250px away from
 * it by design, so a big buffer used to pull them all in regardless of pan
 * position, defeating the point. The fade-in below hides the tighter timing. */
const CULL_BUFFER = 220;

/**
 * A single "location" on the big pannable map — and the virtualization
 * boundary. Nodes far outside the current view don't just get visually
 * clipped by the viewport's overflow:hidden, they get unmounted entirely
 * (no images decoded, no Framer Motion instances alive, nothing in the
 * DOM), so panning over a big empty stretch of paper stays cheap. Nodes
 * re-mount automatically once they're back near the visible area, fading
 * in rather than popping in stiffly.
 */
export function MapNode({ x, y, width, height, children, className = "" }: MapNodeProps) {
  const { offset, scale, viewportRef } = useMap();

  const vp = viewportRef.current;
  const vw = vp?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1280);
  const vh = vp?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 800);

  const viewLeft = -offset.x / scale - CULL_BUFFER;
  const viewTop = -offset.y / scale - CULL_BUFFER;
  const viewRight = viewLeft + vw / scale + CULL_BUFFER * 2;
  const viewBottom = viewTop + vh / scale + CULL_BUFFER * 2;

  const isNearView = x < viewRight && x + width > viewLeft && y < viewBottom && y + height > viewTop;

  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width }}>
      <AnimatePresence>
        {isNearView && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
