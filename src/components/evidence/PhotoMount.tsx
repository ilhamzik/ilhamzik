import { useLanguage } from "../../context/LanguageContext";
import type { Bilingual } from "../../types";

interface PhotoMountProps {
  src?: string;
  /** Handwritten caption under the print. */
  caption?: Bilingual;
  /** Typed file number, printed on the mount. */
  tag: string;
  /** Logos and crests need `contain`; real photographs want `cover`. */
  contain?: boolean;
  alt: string;
}

/**
 * A print mounted onto an album page: cream stock, the photo held by four
 * black paper corners, a handwritten caption below, and the file number
 * typed along the bottom edge.
 *
 * `text-left` / explicit alignment: this renders inside EvidenceItem's
 * <button>, whose UA default is centred text.
 */
export function PhotoMount({ src, caption, tag, contain = false, alt }: PhotoMountProps) {
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 bg-[#fbf6e8] border border-ink-500/25 flex flex-col p-[7px] select-none"
      style={{ boxShadow: "inset 0 0 16px rgba(107,80,42,0.16), inset 0 1px 0 rgba(255,255,255,0.7)" }}
    >
      {/* the print, held in its corners */}
      <div className="relative flex-1 bg-[#ded0a8] overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`w-full h-full sepia-[0.22] contrast-[1.04] ${
              contain ? "object-contain p-1.5" : "object-cover"
            }`}
          />
        ) : (
          <svg viewBox="0 0 100 80" className="w-full h-full">
            <rect width="100" height="80" fill="#e5d3a3" />
            <circle cx="50" cy="30" r="13" fill="#c8a563" />
            <path d="M22 74 C22 52 35 44 50 44 C65 44 78 52 78 74 Z" fill="#c8a563" />
          </svg>
        )}
        {/* darkened edges, as a print picks up under glass */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 14px rgba(40,28,12,0.35)" }}
        />
        {/* four photo corners */}
        {[
          "top-0 left-0 polygon(0 0, 100% 0, 0 100%)",
          "top-0 right-0 polygon(100% 0, 100% 100%, 0 0)",
          "bottom-0 left-0 polygon(0 0, 0 100%, 100% 100%)",
          "bottom-0 right-0 polygon(100% 0, 100% 100%, 0 100%)",
        ].map((spec) => {
          const [v, h, ...poly] = spec.split(" ");
          return (
            <span
              key={spec}
              className={`absolute w-[13px] h-[13px] pointer-events-none ${v} ${h}`}
              style={{
                background: "linear-gradient(135deg, #3a3128, #1c1712)",
                clipPath: poly.join(" "),
              }}
            />
          );
        })}
      </div>

      {/* caption and file number on the mount */}
      <div className="pt-[5px] px-px">
        {caption && (
          <p className="font-hand text-[13px] leading-[1.1] text-ink-700 text-center line-clamp-2">
            {t(caption)}
          </p>
        )}
        <p className="font-typewriter text-[6.5px] tracking-[0.2em] text-ink-500/50 text-center mt-[3px] leading-none">
          {tag}
        </p>
      </div>
    </div>
  );
}
