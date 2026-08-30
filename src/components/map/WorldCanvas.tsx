import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useMap } from "../../context/MapContext";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./mapLayout";

interface WorldCanvasProps {
  children: ReactNode;
  initialCenter: { x: number; y: number };
}

/**
 * The pannable "map" viewport — a fixed full-screen window looking onto a
 * much bigger paper world, dragged around like a game map instead of a
 * normal scrolling page.
 */
export function WorldCanvas({ children, initialCenter }: WorldCanvasProps) {
  const { viewportRef, offset, scale, isDragging, handlers, alignTopOn } = useMap();
  const didInit = useRef(false);

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    alignTopOn(initialCenter.x, initialCenter.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={viewportRef}
      className={`relative w-screen h-screen overflow-hidden bg-ink-900 touch-none select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      {...handlers}
    >
      <div
        className="bg-paper-gradient paper-grain paper-fold torn-edge-top torn-edge-bottom"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          // No will-change here on purpose: on a layer this big (thousands
          // of CSS px, x2-3 again for a phone's device pixel ratio),
          // will-change can force the browser to pre-rasterize the whole
          // thing as one oversized GPU texture up front — fine on a
          // desktop GPU, brutal on a phone's. Modern engines already
          // auto-promote an element once they see it being transformed
          // repeatedly, without needing the hint.
        }}
      >
        {children}
      </div>
    </div>
  );
}
