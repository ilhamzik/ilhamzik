import type { ReactNode } from "react";
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
 * Big enough that content is ready just before it scrolls into view (no visible
 * pop-in), small enough that far-away sections stay fully unmounted. */
const CULL_BUFFER = 650;

/**
 * A single "location" on the big pannable map — and the virtualization
 * boundary. Nodes far outside the current view don't just get visually
 * clipped by the viewport's overflow:hidden, they get unmounted entirely
 * (no images decoded, no Framer Motion instances alive, nothing in the
 * DOM), so panning over a big empty stretch of paper stays cheap. Nodes
 * re-mount automatically once they're back near the visible area.
 */
export function MapNode({ x, y, width, height, children, className = "" }: MapNodeProps) {
  const { offset, scale, viewportRef } = useMap();

  const vp = viewportRef.current;
  const vw = vp?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1280);
  const vh = vp?.clientHeight ?? (typeof window !== "undefined" ? window.innerHeight : 800);

  // Visible viewport rect, converted into world coordinates, padded by the
  // cull buffer on every side.
  const viewLeft = -offset.x / scale - CULL_BUFFER;
  const viewTop = -offset.y / scale - CULL_BUFFER;
  const viewRight = viewLeft + vw / scale + CULL_BUFFER * 2;
  const viewBottom = viewTop + vh / scale + CULL_BUFFER * 2;

  const isNearView = x < viewRight && x + width > viewLeft && y < viewBottom && y + height > viewTop;

  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width }}>
      {isNearView ? children : null}
    </div>
  );
}
