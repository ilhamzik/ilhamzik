import { type ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import { useCaseFile } from "../../context/CaseFileContext";
import type { CaseFile } from "../../types";

interface EvidenceItemProps {
  caseFile: CaseFile;
  children: ReactNode;
  className?: string;
  /** Base rotation in degrees, gives each pinned item a hand-placed feel. */
  tilt?: number;
  size?: number;
  /** Override for non-square items (e.g. index cards); falls back to `size`. */
  width?: number;
  height?: number;
}

/**
 * A clickable piece of "evidence" pinned to the newspaper. Clicking it opens
 * the shared case-file modal with that item's details.
 */
export function EvidenceItem({ caseFile, children, className = "", tilt, size = 120, width, height }: EvidenceItemProps) {
  const { openCase } = useCaseFile();
  const resolvedTilt = useMemo(() => tilt ?? Math.round((Math.random() - 0.5) * 14), [tilt]);

  return (
    <motion.button
      type="button"
      onClick={() => openCase(caseFile)}
      className={`group relative magnifier-cursor focus:outline-none ${className}`}
      style={{
        width: width ?? size,
        height: height ?? size,
        ["--tilt" as string]: `${resolvedTilt}deg`,
        transform: `rotate(${resolvedTilt}deg)`,
      }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      aria-label={caseFile.title.id}
    >
      <span className="absolute inset-0 drop-shadow-[0_8px_10px_rgba(10,8,5,0.45)] transition-transform">
        {children}
      </span>
      <span className="absolute -top-2 -right-2 bg-stamp-500 text-paper-50 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow opacity-0 group-hover:opacity-100 transition-opacity tracking-wide">
        {caseFile.tag}
      </span>
    </motion.button>
  );
}
