import { createContext, useContext, type ReactNode } from "react";
import { usePannableCanvas } from "../hooks/usePannableCanvas";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../components/map/mapLayout";

type MapContextValue = ReturnType<typeof usePannableCanvas>;

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const value = usePannableCanvas({ worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT });
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within a MapProvider");
  return ctx;
}
