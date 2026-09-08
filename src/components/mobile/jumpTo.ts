/** Fixed header height the landing spot has to clear (see MobileView). */
const HEADER_CLEARANCE = 104;
/** Close enough to stop chasing. */
const TOLERANCE = 6;

function scrollParent(el: HTMLElement): HTMLElement {
  let p: HTMLElement | null = el.parentElement;
  while (p) {
    const s = getComputedStyle(p);
    if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 40) return p;
    p = p.parentElement;
  }
  return (document.scrollingElement as HTMLElement) ?? document.documentElement;
}

const settle = (scroller: HTMLElement) =>
  new Promise<void>((resolve) => {
    let last = Number.NaN;
    let idle = 0;
    const id = setInterval(() => {
      const now = scroller.scrollTop;
      if (Math.abs(now - last) < 1 && ++idle > 1) {
        clearInterval(id);
        resolve();
      } else if (Math.abs(now - last) >= 1) {
        idle = 0;
      }
      last = now;
    }, 90);
    // never hang on a scroll that refuses to stop
    setTimeout(() => {
      clearInterval(id);
      resolve();
    }, 2400);
  });

/**
 * Scroll the stacked column to a section anchor, and keep going until it
 * actually lands there.
 *
 * A plain anchor jump is not enough here. Sections mount lazily as the column
 * travels past them, each one replacing a height *estimate* with its real
 * height, so the target drifts while you are on the way to it. Tapping
 * "Contact" from the top of the page landed 2700px short, in the middle of
 * the projects section, with contact itself not even mounted yet.
 *
 * So: scroll, wait for it to stop, and if the target has moved, go again. A
 * couple of rounds is normally enough because everything above it has mounted
 * by then.
 */
export async function jumpToAnchor(anchorId: string) {
  const first = document.getElementById(anchorId);
  if (!first) return;
  const scroller = scrollParent(first);

  for (let round = 0; round < 5; round++) {
    const target = document.getElementById(anchorId);
    if (!target) return;
    const delta = target.getBoundingClientRect().top - HEADER_CLEARANCE;
    if (Math.abs(delta) <= TOLERANCE) return;
    scroller.scrollTo({
      top: scroller.scrollTop + delta,
      // Glide on the way there, then correct without a second animation.
      behavior: round === 0 ? "smooth" : "auto",
    });
    await settle(scroller);
  }
}
