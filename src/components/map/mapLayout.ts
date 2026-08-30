import type { Bilingual } from "../../types";

export interface MapNodeConfig {
  x: number;
  y: number;
  width: number;
  /** Approximate rendered height, in world px — used only to decide whether
   * this node is near the visible viewport (virtualization), rounded up
   * generously from measured values so it's never an underestimate. Content
   * still renders at its natural height regardless; this never clips it. */
  height: number;
  /** Where the red string "pin" attaches on this node, in world coordinates. */
  pin: { x: number; y: number };
}

// Sized to snugly (and symmetrically) bound the actual rendered content —
// measured empirically (not estimated): content spans world x:[60, 2890]
// and y:[40, 3735.5]. Keep ~60px margin on every edge so panning all the way
// out doesn't reveal a lopsided void on one side.
export const WORLD_WIDTH = 2950;
export const WORLD_HEIGHT = 3780;

/**
 * Hand-placed coordinates for every section on the big pannable "map".
 * Heights are estimated (not measured), with generous gaps between rows —
 * good enough for a game-map feel where perfect alignment isn't the point.
 * Tune these after a visual pass if something ends up overlapping.
 */
export const NODES: Record<string, MapNodeConfig> = {
  home: { x: 950, y: 40, width: 1100, height: 950, pin: { x: 1500, y: 480 } },
  education: { x: 60, y: 300, width: 640, height: 1150, pin: { x: 380, y: 500 } },
  interests: { x: 2250, y: 300, width: 640, height: 800, pin: { x: 2570, y: 480 } },
  experience: { x: 900, y: 1020, width: 1100, height: 1120, pin: { x: 1450, y: 1230 } },
  skills: { x: 1850, y: 1750, width: 900, height: 920, pin: { x: 2300, y: 1950 } },
  projects: { x: 120, y: 1750, width: 1000, height: 700, pin: { x: 620, y: 1950 } },
  contact: { x: 1150, y: 2550, width: 600, height: 1250, pin: { x: 1450, y: 2680 } },
};

/** Traversal order for the red string connecting sections across the map. */
export const STRING_PATH = [
  "education",
  "home",
  "interests",
  "experience",
  "skills",
  "projects",
  "contact",
];

/**
 * Extra taut cross-connections beyond the main trail, for a more frantic
 * "conspiracy board" look, more strings pinned across the whole map.
 */
export const EXTRA_LINKS: [string, string][] = [
  ["education", "skills"],
  ["interests", "projects"],
  ["home", "contact"],
  ["education", "projects"],
];

export const NODE_LABELS: Record<string, Bilingual> = {
  home: { id: "Profil", en: "Profile" },
  education: { id: "Pendidikan", en: "Education" },
  interests: { id: "Minat", en: "Interests" },
  experience: { id: "Pengalaman", en: "Experience" },
  skills: { id: "Keahlian", en: "Skills" },
  projects: { id: "Proyek", en: "Projects" },
  contact: { id: "Kontak", en: "Contact" },
};

export const QUICK_NAV_ORDER = ["home", "education", "interests", "experience", "skills", "projects", "contact"];
