import type { Bilingual } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import { PaperclipIcon } from "../icons";

interface PolaroidPhotoProps {
  src?: string;
  caption?: Bilingual;
  rotate?: number;
  className?: string;
  clipped?: boolean;
}

/**
 * Displays a real photo styled like a pinned polaroid when `src` is provided.
 * Falls back to a hand-drawn placeholder silhouette so the layout never
 * breaks while real photos haven't been supplied yet.
 */
export function PolaroidPhoto({ src, caption, rotate = -4, className = "", clipped = true }: PolaroidPhotoProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`relative inline-block bg-[#fbf6e8] p-3 pb-8 shadow-pinned ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {clipped && <PaperclipIcon className="absolute -top-4 left-3 w-6 h-9 -rotate-12 z-10" />}
      <div className="relative w-40 h-40 bg-paper-200 overflow-hidden border border-ink-300/30">
        {src ? (
          <img
            src={src}
            alt={caption ? t(caption) : ""}
            decoding="async"
            className="w-full h-full object-cover sepia-[0.35] contrast-105"
          />
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#e5d3a3" />
            <circle cx="50" cy="38" r="16" fill="#c8a563" />
            <path d="M18 92 C18 66 34 56 50 56 C66 56 82 66 82 92 Z" fill="#c8a563" />
            <text x="50" y="98" textAnchor="middle" fontSize="6" fill="#4a381e" fontFamily="'Courier Prime', monospace">
              PHOTO PENDING
            </text>
          </svg>
        )}
      </div>
      {caption && (
        <p className="mt-2 text-center text-ink-500 text-xs font-hand leading-tight">{t(caption)}</p>
      )}
    </div>
  );
}
