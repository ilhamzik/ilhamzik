import { createContext, useContext, useState, type ReactNode } from "react";

interface NightShiftContextValue {
  active: boolean;
  toggle: () => void;
}

const NightShiftContext = createContext<NightShiftContextValue | null>(null);

export function NightShiftProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  return (
    <NightShiftContext.Provider value={{ active, toggle: () => setActive((a) => !a) }}>
      {children}
    </NightShiftContext.Provider>
  );
}

export function useNightShift() {
  const ctx = useContext(NightShiftContext);
  if (!ctx) throw new Error("useNightShift must be used within a NightShiftProvider");
  return ctx;
}
