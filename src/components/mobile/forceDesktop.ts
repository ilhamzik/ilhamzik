/**
 * Session flag that lets a phone/tablet visitor opt out of the mobile scroll
 * view and load the full desktop pannable map anyway. Set from the mobile
 * HUD, read once in App.tsx. Session-scoped on purpose: it should not
 * permanently trap someone on the heavy view across visits.
 */
export const FORCE_DESKTOP_KEY = "ilhamzik:forceDesktop";

export function isForceDesktop(): boolean {
  try {
    return sessionStorage.getItem(FORCE_DESKTOP_KEY) === "1";
  } catch {
    return false;
  }
}
