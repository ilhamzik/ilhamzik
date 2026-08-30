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

export function PushpinIcon({ className, color = "#7a1f1f" }: IconProps & { color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
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

export function StudentCardIcon({ className, accent = "#6b502a" }: IconProps & { accent?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={className}>
      <rect x="2" y="2" width="156" height="96" rx="8" fill="#f2e6c4" stroke="#2a241d" strokeWidth="2" />
      <rect x="2" y="2" width="156" height="22" rx="8" fill={accent} />
      <rect x="14" y="34" width="42" height="52" rx="3" fill="#d8cba3" stroke="#8f6c39" strokeWidth="1.5" />
      <circle cx="35" cy="52" r="10" fill="#b8a888" />
      <path d="M20 82 q15 -16 30 0" fill="#b8a888" />
      <rect x="66" y="38" width="80" height="6" rx="3" fill="#8f6c39" opacity="0.6" />
      <rect x="66" y="52" width="70" height="6" rx="3" fill="#8f6c39" opacity="0.6" />
      <rect x="66" y="66" width="60" height="6" rx="3" fill="#8f6c39" opacity="0.6" />
      <circle cx="80" cy="13" r="4" fill="#f7efd9" opacity="0.7" />
    </svg>
  );
}

export function GraduationMedalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 140" className={className}>
      <path d="M30 4 L50 50 L20 50 Z" fill="#7a1f1f" />
      <path d="M70 4 L80 50 L50 50 Z" fill="#8f6c39" />
      <circle cx="50" cy="90" r="34" fill="#e0b843" stroke="#8f6c39" strokeWidth="3" />
      <circle cx="50" cy="90" r="26" fill="none" stroke="#2a241d" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M50 74 L55 86 L68 87 L58 95 L61 108 L50 101 L39 108 L42 95 L32 87 L45 86 Z" fill="#5c4310" />
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
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="#2a241d"
      strokeWidth={1.5 + c * 2}
      strokeLinecap="round"
      style={{ opacity: 0.35 + c * 0.65 }}
    >
      <path d="M50 18 C24 18 14 38 14 55 C14 68 18 78 24 86" />
      <path d="M50 26 C32 26 24 42 24 55 C24 65 27 73 32 80" />
      <path d="M50 34 C38 34 33 45 33 55 C33 62 35 68 39 74" />
      <path d="M50 42 C43 42 41 48 41 55 C41 59 42 63 45 67" />
      <path d="M62 22 C78 30 82 44 80 58 C78 70 72 80 64 86" />
      <path d="M58 30 C70 36 73 46 71 57 C70 66 65 74 59 79" />
      <path d="M55 38 C63 42 65 49 64 56" />
    </svg>
  );
}

export function EvidenceTagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 90 60" className={className}>
      <circle cx="14" cy="14" r="6" fill="none" stroke="#2a241d" strokeWidth="3" />
      <path d="M18 10 L80 6 L86 52 L24 58 Z" fill="#f2e6c4" stroke="#2a241d" strokeWidth="2" />
      <line x1="14" y1="14" x2="30" y2="20" stroke="#8a8a8a" strokeWidth="2" />
    </svg>
  );
}

export function MailboxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect x="20" y="70" width="12" height="24" fill="#5c4310" />
      <rect x="12" y="34" width="70" height="40" rx="20" fill="#7a1f1f" stroke="#2a241d" strokeWidth="3" />
      <rect x="12" y="54" width="70" height="20" fill="#5c1717" />
      <rect x="76" y="42" width="16" height="10" rx="2" fill="#f2e6c4" stroke="#2a241d" strokeWidth="2" />
      <rect x="44" y="20" width="6" height="16" fill="#8a8a8a" />
      <rect x="34" y="14" width="26" height="8" fill="#c94c4c" />
    </svg>
  );
}
