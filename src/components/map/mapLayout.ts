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
// measured empirically (not estimated). Keep ~60px margin on every edge so
// panning all the way out doesn't reveal a lopsided void on one side.
//
// The Case Summary sheet used to sit in the flow of `home`, which made that
// node ~500px taller than its neighbours and forced everything below it down
// by 680px. Read as two disconnected halves of a world, so the sheet became a
// popup off the wanted poster (see `SummaryModal`) and those 680px came back
// out. `education` and `interests` flank home and never moved either way.
//
// `projects` and `skills` sit below the experience corkboard rather than
// beside its lower half: their section rubrics end in a full-width hairline
// rule, and at the old y they painted that rule straight across the board's
// bottom corners. Verify with the pairwise rect check (see README) after
// moving anything here.
export const WORLD_WIDTH = 2950;
export const WORLD_HEIGHT = 3840;

/**
 * Hand-placed coordinates for every section on the big pannable "map".
 *
 * Heights are MEASURED, not estimated: render the section at its node
 * `width` on the dev specimen page and read `offsetHeight`, awaiting
 * `document.fonts.ready` first. Measure at BOTH a narrow (<640px) and a wide
 * browser window and take the larger: node widths are world px and never
 * reflow, but the sections' Tailwind `sm:` utilities key off the *viewport*,
 * so in a narrow window every section drops to smaller padding and a smaller
 * headline and ends up TALLER (experience: 1098 wide vs 1278 narrow) and
 * WIDER in content box. Positions below leave clearance for that worst case,
 * which is why projects sits well clear of the corkboard rather than snugly
 * under it. Re-measure whenever a card size or a section grid changes.
 */
export const NODES: Record<string, MapNodeConfig> = {
  home: { x: 950, y: 40, width: 1100, height: 1010, pin: { x: 1500, y: 480 } },
  education: { x: 60, y: 300, width: 640, height: 1260, pin: { x: 380, y: 500 } },
  interests: { x: 2250, y: 300, width: 640, height: 940, pin: { x: 2570, y: 480 } },
  experience: { x: 900, y: 1020, width: 1100, height: 1380, pin: { x: 1450, y: 1230 } },
  skills: { x: 1990, y: 1970, width: 900, height: 1290, pin: { x: 2440, y: 2170 } },
  projects: { x: 90, y: 2240, width: 1000, height: 1560, pin: { x: 590, y: 2440 } },
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
