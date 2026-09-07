import { useId, type SVGProps } from "react";

/**
 * Hand-coded inline SVG icon set for the detective newspaper theme.
 * Everything here is drawn from scratch (no external image assets) so the
 * whole visual language stays consistent and easily recolorable.
 */

interface IconProps {
  className?: string;
}

export function MagnifyingGlassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <circle cx="42" cy="42" r="26" stroke="#2a241d" strokeWidth="7" fill="rgba(247,239,217,0.25)" />
      <circle cx="42" cy="42" r="26" stroke="#b38b4a" strokeWidth="2" />
      <line x1="61" y1="61" x2="88" y2="88" stroke="#2a241d" strokeWidth="9" strokeLinecap="round" />
      <line x1="61" y1="61" x2="88" y2="88" stroke="#8f6c39" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PushpinIcon({
  className,
  color = "#7a1f1f",
  ...rest
}: IconProps & { color?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" {...rest}>
      <ellipse cx="20" cy="34" rx="4" ry="2" fill="rgba(0,0,0,0.35)" />
      <line x1="20" y1="18" x2="20" y2="33" stroke="#8a8a8a" strokeWidth="2" />
      <circle cx="20" cy="14" r="11" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <circle cx="16" cy="10" r="3" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

export function PaperclipIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 60" className={className} fill="none" stroke="#8a8a8a" strokeWidth="3.5" strokeLinecap="round">
      <path d="M12 12 V42 a8 8 0 0 0 16 0 V16 a5 5 0 0 0 -10 0 V38" />
    </svg>
  );
}

/** Stylized fan badge — a shield in club colors, not a reproduction of the official crest. */
export function ClubBadgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 120" className={className}>
      <path d="M50 4 L92 18 V58 C92 88 74 106 50 116 C26 106 8 88 8 58 V18 Z" fill="#7a1f1f" stroke="#2a241d" strokeWidth="3" />
      <path d="M50 4 L92 18 V58 C92 88 74 106 50 116 Z" fill="#5c1717" opacity="0.5" />
      <path d="M50 12 L84 24 V58 C84 82 69 97 50 106 C31 97 16 82 16 58 V24 Z" fill="#f7efd9" opacity="0.08" />
      <circle cx="50" cy="48" r="20" fill="none" stroke="#f2c94c" strokeWidth="3" />
      <path d="M50 34 L55 45 L67 46 L58 54 L61 66 L50 59 L39 66 L42 54 L33 46 L45 45 Z" fill="#f2c94c" />
      <text x="50" y="94" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="13" fill="#f7efd9">
        MUFC
      </text>
    </svg>
  );
}

interface GraduationMedalIconProps extends IconProps {
  /**
   * Emblem struck into the face of the disc, e.g. the university's mark.
   * Expects a transparent PNG already toned as relief (see the Makara recipe
   * in CLAUDE.md): baking the highlight/shadow into the asset keeps any SVG
   * or CSS filter off a layer that lives inside the transformed world.
   * Without one, the disc falls back to a plain struck star.
   */
  emblem?: string;
  emblemLabel?: string;
}

export function GraduationMedalIcon({ className, emblem, emblemLabel }: GraduationMedalIconProps) {
  const uid = useId().replace(/:/g, "");
  const gold = `gold-${uid}`;
  const sheen = `sheen-${uid}`;
  return (
    <svg viewBox="0 0 100 150" className={className}>
      <defs>
        <radialGradient id={gold} cx="36%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#fbeaa0" />
          <stop offset="38%" stopColor="#e5be4c" />
          <stop offset="74%" stopColor="#b8862a" />
          <stop offset="100%" stopColor="#7f5514" />
        </radialGradient>
        <linearGradient id={sheen} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.7" />
          <stop offset="38%" stopColor="#fffbe6" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#fffbe6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* pin bar the ribbon hangs from */}
      <rect x="19" y="2" width="62" height="8" rx="1.5" fill="#5c4310" />
      <rect x="19" y="3" width="62" height="2" fill="#8f6c39" opacity="0.8" />

      {/* ribbon: one band, notched at the bottom, split down the middle.
          Blue and red, the "soul" colours the user asked for on this one. */}
      <path d="M23 10 L50 10 L50 48 L23 60 Z" fill="#1f3d7a" />
      <path d="M50 10 L77 10 L77 60 L50 48 Z" fill="#b02a2a" />
      {/* fabric folds */}
      <g opacity="0.13">
        <path d="M31 10 L31 56.5 L35 54.8 L35 10 Z" fill="#000" />
        <path d="M43 10 L43 51.5 L46 50.2 L46 10 Z" fill="#fff" />
        <path d="M57 10 L57 50.2 L60 51.5 L60 10 Z" fill="#000" />
        <path d="M69 10 L69 54.8 L72 56.5 L72 10 Z" fill="#fff" />
      </g>
      {/* soft shadow where the disc tucks in front of the ribbon (a hard slab
          here read as a grey stripe across the ribbon) */}
      <ellipse cx="50" cy="60" rx="26" ry="9" fill="rgba(20,14,8,0.34)" />

      {/* medal disc */}
      <ellipse cx="52" cy="103" rx="39" ry="39" fill="rgba(20,14,8,0.32)" />
      <circle cx="50" cy="101" r="39" fill={`url(#${gold})`} stroke="#77500f" strokeWidth="2" />
      {/* milled rim */}
      <g stroke="#77500f" strokeWidth="2" opacity="0.5">
        {Array.from({ length: 40 }, (_, i) => {
          const a2 = (i / 40) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={50 + Math.cos(a2) * 35}
              y1={101 + Math.sin(a2) * 35}
              x2={50 + Math.cos(a2) * 38.5}
              y2={101 + Math.sin(a2) * 38.5}
            />
          );
        })}
      </g>
      <circle cx="50" cy="101" r="31" fill="none" stroke="#7f5514" strokeWidth="1.6" opacity="0.75" />
      <circle cx="50" cy="101" r="28.5" fill="none" stroke="#fbeaa0" strokeWidth="1" opacity="0.45" />

      {/* laurel: just the two thin branch arcs. The Makara is itself an
          ornate fan shape, so a full leafed wreath around it read as clutter
          at the size this medal actually renders. */}
      <g stroke="#77500f" strokeWidth="1.8" fill="none" opacity="0.6">
        <path d="M25 108 C21 97 26 84 35 77" />
        <path d="M75 108 C79 97 74 84 65 77" />
      </g>

      {/* the emblem struck into the face, or a plain star if none is given */}
      {emblem ? (
        <image
          href={emblem}
          x="29"
          y="72"
          width="42"
          height="42"
          preserveAspectRatio="xMidYMid meet"
        >
          {emblemLabel && <title>{emblemLabel}</title>}
        </image>
      ) : (
        <>
          <path
            d="M50 81 L53.9 90.7 L64.3 91.4 L56.3 98 L58.8 108.1 L50 102.6 L41.2 108.1 L43.7 98 L35.7 91.4 L46.1 90.7 Z"
            fill="#8a5f18"
          />
          <path
            d="M50 81 L53.9 90.7 L64.3 91.4 L56.3 98 L58.8 108.1 L50 102.6 L41.2 108.1 L43.7 98 L35.7 91.4 L46.1 90.7 Z"
            fill="none"
            stroke="#5c4310"
            strokeWidth="1.1"
          />
        </>
      )}

      {/* engraved banner across the foot of the wreath */}
      <path d="M31 113 L69 113 L66 126 L34 126 Z" fill="#c79c36" stroke="#77500f" strokeWidth="1.2" />
      <path d="M31 113 L69 113 L68.4 115.6 L31.6 115.6 Z" fill="#e8c869" opacity="0.7" />
      <text
        x="50"
        y="123.2"
        textAnchor="middle"
        fontFamily="'Special Elite', monospace"
        fontSize="9"
        letterSpacing="0.5"
        fill="#4a3308"
      >
        S.Kom
      </text>

      {/* specular sheen across the upper-left of the disc */}
      <circle cx="50" cy="101" r="38" fill={`url(#${sheen})`} />
    </svg>
  );
}

export function StampMark({ className, text = "CASE CLOSED" }: IconProps & { text?: string }) {
  return (
    <svg viewBox="0 0 220 90" className={className}>
      <rect x="4" y="4" width="212" height="82" rx="6" fill="none" stroke="#7a1f1f" strokeWidth="5" strokeDasharray="2 3" />
      <text
        x="110"
        y="52"
        textAnchor="middle"
        fontFamily="'Special Elite', monospace"
        fontSize="26"
        fill="#7a1f1f"
        letterSpacing="2"
      >
        {text}
      </text>
    </svg>
  );
}

interface FingerprintIconProps extends IconProps {
  /** 0 = barely-there smudge, 1 = crisp full print. Represents skill proficiency. */
  clarity?: number;
}

export function FingerprintIcon({ className, clarity = 1 }: FingerprintIconProps) {
  const c = Math.max(0.15, Math.min(1, clarity));

  // A loop-pattern print. Two things this needs to look like skin rather
  // than a stack of arches: elliptical arcs instead of cubics (a cubic's
  // apex only reaches ~3/4 of the way to its control points, so the arches
  // came out bunched in the middle of the box), and legs that carry each
  // ridge down to the base instead of stopping at the shoulder.
  const ridges = Array.from({ length: 9 }, (_, i) => {
    const w = 5.5 + i * 4.1;
    const shoulder = 54 + i * 1.4;
    const apex = 45 - i * 4.9;
    // alternate a small sideways nudge so it doesn't read as a bullseye
    const skew = i % 2 === 0 ? 1.3 : -1;
    const l = 50 - w + skew;
    const r = 50 + w + skew;
    return {
      i,
      d: `M ${l} 100 L ${l} ${shoulder} A ${w} ${shoulder - apex} 0 0 1 ${r} ${shoulder} L ${r} 100`,
    };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="#2a241d"
      strokeWidth={1.2 + c * 1.4}
      strokeLinecap="round"
      style={{ opacity: 0.3 + c * 0.7 }}
    >
      {/* the core rod at the centre of the loop */}
      <path d="M49.6 38 L49.6 50" />
      {ridges.map(({ d, i }) => (
        <path
          key={i}
          d={d}
          opacity={i > 6 ? 0.72 : 1}
          /* a couple of ridge breaks, so it reads as skin, not a graph */
          strokeDasharray={i === 3 ? "58 6 200" : i === 6 ? "96 7 200" : undefined}
        />
      ))}
      {/* deltas: ridges converging in from the lower corners */}
      <path d="M2 66 C6 76, 8 86, 8 100" opacity="0.7" />
      <path d="M98 66 C94 76, 92 86, 92 100" opacity="0.7" />
      <path d="M4 84 L10 92" opacity="0.55" />
      <path d="M96 84 L90 92" opacity="0.55" />
    </svg>
  );
}

export function MailboxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* post */}
      <rect x="21" y="70" width="11" height="26" rx="1.5" fill="#c8a563" />
      <rect x="21" y="70" width="4" height="26" fill="#e5d3a3" opacity="0.7" />
      {/* body */}
      <path d="M12 54 V44 a24 24 0 0 1 48 0 v10 z" fill="#c8433a" stroke="#f7efd9" strokeWidth="2.5" />
      <rect x="12" y="54" width="48" height="20" fill="#a3322b" stroke="#f7efd9" strokeWidth="2.5" />
      {/* letter slot */}
      <rect x="22" y="60" width="28" height="4" rx="2" fill="#f7efd9" opacity="0.8" />
      {/* raised flag: a tip is waiting */}
      <rect x="62" y="34" width="4" height="30" rx="1" fill="#e5d3a3" />
      <path d="M66 34 h20 l-6 7 6 7 h-20 z" fill="#f2c94c" stroke="#f7efd9" strokeWidth="1.6" />
    </svg>
  );
}
