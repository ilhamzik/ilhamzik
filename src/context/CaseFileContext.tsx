import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CaseFile } from "../types";
import { education, experience, interests, projects, skills, stickyNotes } from "../data/content";

const TOTAL_CASES =
  education.length +
  experience.length +
  projects.length +
  skills.length +
  interests.length +
  Object.keys(stickyNotes).length;

interface CaseFileContextValue {
  activeCase: CaseFile | null;
  openCase: (file: CaseFile) => void;
  closeCase: () => void;
  openedCount: number;
  totalCount: number;
  justCompleted: boolean;
  dismissCompletion: () => void;
}

const CaseFileContext = createContext<CaseFileContextValue | null>(null);

export function CaseFileProvider({ children }: { children: ReactNode }) {
  const [activeCase, setActiveCase] = useState<CaseFile | null>(null);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const [justCompleted, setJustCompleted] = useState(false);

  const value = useMemo<CaseFileContextValue>(
    () => ({
      activeCase,
      openCase: (file) => {
        setActiveCase(file);
        setOpenedIds((prev) => {
          if (prev.has(file.id)) return prev;
          const next = new Set(prev);
          next.add(file.id);
          if (next.size === TOTAL_CASES) setJustCompleted(true);
          return next;
        });
      },
      closeCase: () => setActiveCase(null),
      openedCount: openedIds.size,
      totalCount: TOTAL_CASES,
      justCompleted,
      dismissCompletion: () => setJustCompleted(false),
    }),
    [activeCase, openedIds, justCompleted]
  );

  return <CaseFileContext.Provider value={value}>{children}</CaseFileContext.Provider>;
}

export function useCaseFile() {
  const ctx = useContext(CaseFileContext);
  if (!ctx) throw new Error("useCaseFile must be used within a CaseFileProvider");
  return ctx;
}
