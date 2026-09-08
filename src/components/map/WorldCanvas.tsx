import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import { useMap } from "../../context/MapContext";
import { useLanguage } from "../../context/LanguageContext";
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
  const { viewportRef, offset, scale, isDragging, handlers, alignTopOn, panBy, zoomBy } = useMap();
  const { t } = useLanguage();
  const didInit = useRef(false);

  /**
   * Arrow keys pan, +/- zoom, Home returns.
   *
   * The map was pointer-only, so anyone driving the page from a keyboard
   * could reach the sections through the quick-nav pins but could never
   * actually move around the board. Only fires when the viewport itself holds
   * focus, so it never steals arrow keys from a focused button or a modal.
   */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      const step = e.shiftKey ? 480 : 160;
      switch (e.key) {
        case "ArrowLeft": panBy(-step, 0); break;
        case "ArrowRight": panBy(step, 0); break;
        case "ArrowUp": panBy(0, -step); break;
        case "ArrowDown": panBy(0, step); break;
        case "+": case "=": zoomBy(1.15); break;
        case "-": case "_": zoomBy(1 / 1.15); break;
        case "Home": alignTopOn(initialCenter.x, initialCenter.y); break;
        default: return;
      }
      e.preventDefault();
    },
    [alignTopOn, initialCenter.x, initialCenter.y, panBy, zoomBy]
  );

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    alignTopOn(initialCenter.x, initialCenter.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={viewportRef}
      tabIndex={0}
      role="application"
      aria-label={t({
        id: "Peta berkas kasus. Seret untuk menjelajah, atau pakai tombol panah, plus dan minus untuk zoom, Home untuk kembali ke awal.",
        en: "Case file map. Drag to explore, or use the arrow keys, plus and minus to zoom, and Home to return to the start.",
      })}
      onKeyDown={onKeyDown}
      className={`relative w-screen h-screen overflow-hidden bg-ink-900 touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blood-600 ${
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
        }}
      >
        {children}
      </div>
    </div>
  );
}
