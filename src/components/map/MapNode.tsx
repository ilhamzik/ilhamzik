import type { ReactNode } from "react";

interface MapNodeProps {
  x: number;
  y: number;
  width: number;
  children: ReactNode;
  className?: string;
}

/** A single absolutely-positioned "location" on the big pannable map. */
export function MapNode({ x, y, width, children, className = "" }: MapNodeProps) {
  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width }}>
      {children}
    </div>
  );
}
