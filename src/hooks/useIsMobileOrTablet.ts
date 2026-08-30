import { useState } from "react";

/**
 * Best-effort "is this a phone or tablet" check, computed once. Not meant
 * to be bulletproof (UA strings can lie), just a friendly gate: the pannable
 * map is a desktop-mouse-and-big-screen experience, so touch devices get a
 * "come back on a computer" page instead of a laggy, half-broken one.
 */
function detect(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const uaSaysMobile = /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|Opera Mini|Mobile/i.test(ua);
  // Modern iPadOS Safari reports itself as "Macintosh" by default, so also
  // catch touch devices with a phone/tablet-sized viewport.
  const touchPoints = typeof navigator.maxTouchPoints === "number" ? navigator.maxTouchPoints : 0;
  const smallTouchScreen = touchPoints > 1 && typeof window !== "undefined" && window.innerWidth < 1200;
  return uaSaysMobile || smallTouchScreen;
}

export function useIsMobileOrTablet(): boolean {
  const [isMobile] = useState(detect);
  return isMobile;
}
