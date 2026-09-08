/**
 * Deterministic pseudo-randomness, keyed off something stable about the thing
 * being drawn (usually its case-file id).
 *
 * The map unmounts nodes that are far from the viewport and mounts them again
 * on the way back, so anything that reaches for `Math.random()` at render time
 * comes back *different*: evidence cards were re-tilting themselves every time
 * you panned away and returned, and the sticky notes were changing colour on
 * any re-render at all, because their colour was not even memoised.
 *
 * Same rule already applies to the string geometry in `CorkString` and
 * `MobileRedString`. This is the shared version for component decoration.
 */

/** FNV-1a, enough to spread short ids like "edu-smp" across the range. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Stable value in [0,1) for a seed. mulberry32's mixing step. */
export function seededUnit(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Stable value in [0,1) for a string key, optionally varied by `salt` so one
 *  key can drive several independent decisions. */
export function seededFrom(key: string, salt = 0): number {
  return seededUnit(hashString(key) + salt * 0x9e3779b9);
}

/** Stable integer in [0, count) for a string key. */
export function seededIndex(key: string, count: number, salt = 0): number {
  return Math.floor(seededFrom(key, salt) * count) % count;
}
