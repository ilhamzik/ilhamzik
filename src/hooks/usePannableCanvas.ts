import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

interface Point {
  x: number;
  y: number;
}

interface Options {
  worldWidth: number;
  worldHeight: number;
  minScale?: number;
  maxScale?: number;
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/**
 * Drag-to-pan, pinch-to-zoom (touch), and ctrl/pinch-wheel-to-zoom (trackpad)
 * mechanic for a big "world" div inside a fixed-size viewport — the game-map
 * feel the user asked for instead of normal page scrolling. Built to work
 * equally well on desktop mouse and touch (phone/tablet).
 */
export function usePannableCanvas({ worldWidth, worldHeight, minScale = 0.4, maxScale = 1.15 }: Options) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const dragState = useRef<{ startPointer: Point; startOffset: Point } | null>(null);
  const pointers = useRef<Map<number, Point>>(new Map());
  const pinchPrevDistance = useRef<number | null>(null);

  const pendingOffset = useRef<Point | null>(null);
  const pendingScale = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  const clampScale = useCallback((s: number) => Math.min(maxScale, Math.max(minScale, s)), [maxScale, minScale]);

  const clamp = useCallback(
    (next: Point, s: number = scale): Point => {
      const vp = viewportRef.current;
      if (!vp) return next;
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      const ww = worldWidth * s;
      const wh = worldHeight * s;
      const pad = 140;
      const clampAxis = (value: number, viewportSize: number, worldSize: number) => {
        if (worldSize <= viewportSize) return (viewportSize - worldSize) / 2;
        const min = viewportSize - worldSize - pad;
        const max = pad;
        return Math.min(max, Math.max(min, value));
      };
      return { x: clampAxis(next.x, vw, ww), y: clampAxis(next.y, vh, wh) };
    },
    [scale, worldWidth, worldHeight]
  );

  // Only ever commit one offset/scale update per animation frame, no matter
  // how many raw pointer/wheel events fire in between — raw events can fire
  // far faster than the display refresh rate, and re-rendering for every
  // single one was the main cause of drag/pinch feeling heavy.
  const scheduleTransform = useCallback((nextOffset: Point, nextScale?: number) => {
    pendingOffset.current = nextOffset;
    if (nextScale != null) pendingScale.current = nextScale;
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (pendingOffset.current) setOffset(pendingOffset.current);
      if (pendingScale.current != null) setScale(pendingScale.current);
      pendingOffset.current = null;
      pendingScale.current = null;
    });
  }, []);

  const liveOffset = useCallback(() => pendingOffset.current ?? offset, [offset]);
  const liveScale = useCallback(() => pendingScale.current ?? scale, [scale]);

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  /** A comfortable default zoom level for the current viewport — 1:1 on a
   * roomy desktop window, zoomed out further on narrow phone screens so a
   * paragraph's lines don't require panning mid-sentence to read. Computed
   * on demand (not memoized) so it stays correct across orientation changes. */
  const getDefaultScale = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return 1;
    return Math.min(1, Math.max(minScale, vp.clientWidth / 900));
  }, [minScale]);

  const recenterOn = useCallback(
    (cx: number, cy: number, s?: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const targetScale = s ?? getDefaultScale();
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      setScale(targetScale);
      setOffset(clamp({ x: vw / 2 - cx * targetScale, y: vh / 2 - cy * targetScale }, targetScale));
    },
    [clamp, getDefaultScale]
  );

  /** Like recenterOn, but aligns a node's top edge near the viewport top
   * instead of centering it — used for nodes near the world's edge (like the
   * home node) so landing there doesn't reveal empty void above it. */
  const alignTopOn = useCallback(
    (cx: number, topY: number, s?: number, topMargin = 28) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const targetScale = s ?? getDefaultScale();
      const vw = vp.clientWidth;
      setScale(targetScale);
      setOffset(clamp({ x: vw / 2 - cx * targetScale, y: topMargin - topY * targetScale }, targetScale));
    },
    [clamp, getDefaultScale]
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // Don't hijack presses that start on an interactive element (evidence
      // items, sticky notes, buttons) — setPointerCapture on the viewport
      // would otherwise redirect the matching pointerup there too and
      // silently swallow the child's click event. Only applies to the first
      // finger/pointer — a deliberate second finger always engages pinch.
      if (pointers.current.size === 0) {
        const target = e.target as HTMLElement;
        if (target.closest("button, a, input, textarea, select, [role='button']")) return;
      }

      // Some browser/input combinations can reject capture (e.g. a pointer
      // session the browser doesn't consider "active") — don't let that
      // stop us from tracking the pointer for pan/pinch purposes.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 1) {
        dragState.current = { startPointer: { x: e.clientX, y: e.clientY }, startOffset: liveOffset() };
        setIsDragging(true);
      } else if (pointers.current.size === 2) {
        dragState.current = null;
        const pts = [...pointers.current.values()];
        pinchPrevDistance.current = dist(pts[0], pts[1]);
        setHasInteracted(true);
      }
    },
    [liveOffset]
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size >= 2 && pinchPrevDistance.current != null) {
        const pts = [...pointers.current.values()].slice(0, 2);
        const newDistance = dist(pts[0], pts[1]);
        const midpoint = mid(pts[0], pts[1]);
        const s0 = liveScale();
        const ratio = newDistance / (pinchPrevDistance.current || newDistance || 1);
        const s1 = clampScale(s0 * ratio);
        const o0 = liveOffset();
        const worldPoint = { x: (midpoint.x - o0.x) / s0, y: (midpoint.y - o0.y) / s0 };
        const o1 = clamp({ x: midpoint.x - worldPoint.x * s1, y: midpoint.y - worldPoint.y * s1 }, s1);
        scheduleTransform(o1, s1);
        pinchPrevDistance.current = newDistance;
        setHasInteracted(true);
        return;
      }

      if (!dragState.current) return;
      const { startPointer, startOffset } = dragState.current;
      const dx = e.clientX - startPointer.x;
      const dy = e.clientY - startPointer.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setHasInteracted(true);
      scheduleTransform(clamp({ x: startOffset.x + dx, y: startOffset.y + dy }));
    },
    [clamp, clampScale, liveOffset, liveScale, scheduleTransform]
  );

  const endDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      pointers.current.delete(e.pointerId);

      if (pointers.current.size < 2) pinchPrevDistance.current = null;

      if (pointers.current.size === 0) {
        dragState.current = null;
        setIsDragging(false);
      } else if (pointers.current.size === 1) {
        // one finger lifted mid-pinch — resume a single-finger drag smoothly
        const [remaining] = [...pointers.current.values()];
        dragState.current = { startPointer: remaining, startOffset: liveOffset() };
      }
    },
    [liveOffset]
  );

  const onWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      setHasInteracted(true);
      const o0 = liveOffset();
      if (e.ctrlKey || e.metaKey) {
        // trackpad pinch (or ctrl+wheel) — zoom around the cursor position
        const vp = viewportRef.current;
        const rect = vp?.getBoundingClientRect();
        const cursor = rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: 0, y: 0 };
        const s0 = liveScale();
        const s1 = clampScale(s0 - e.deltaY * 0.001 * s0);
        const worldPoint = { x: (cursor.x - o0.x) / s0, y: (cursor.y - o0.y) / s0 };
        const o1 = clamp({ x: cursor.x - worldPoint.x * s1, y: cursor.y - worldPoint.y * s1 }, s1);
        scheduleTransform(o1, s1);
        return;
      }
      scheduleTransform(clamp({ x: o0.x - e.deltaX, y: o0.y - e.deltaY }));
    },
    [clamp, clampScale, liveOffset, liveScale, scheduleTransform]
  );

  return {
    viewportRef,
    offset,
    scale,
    isDragging,
    hasInteracted,
    recenterOn,
    alignTopOn,
    getDefaultScale,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
      onWheel,
    },
  };
}
