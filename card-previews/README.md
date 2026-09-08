# Card previews

Screenshots of every card family after the per-card visual pass, so the
result can be reviewed without running the site. Two shots per card:

| File | What it shows |
| --- | --- |
| `01-education-*` | Student cards (SD red / SMP blue / SMA grey, per Indonesian uniform colours) + the graduation medal: blue-and-red ribbon, official UI Makara struck into the disc |
| `02-experience-*` | Corkboard: ruled file cards with mounted photo prints, coloured pushpins, and the twine measured pin-to-pin |
| `03-projects-*` | Kraft exhibit tags with a punched grommet, metal eyelet and knotted twine |
| `04-skills-*` | Ten-print identification cards with the ridge-clarity ladder; the two logo-less skills are grouped last |
| `05-interests-*` | Album mounts: the print held by four photo corners, handwritten caption |
| `06-contact-*` | Boxed newspaper classified + the tear-off tip-line coupon |
| `07-whole-map-desktop` | The entire pannable desktop world, zoomed out, for checking node placement |
| `08-easter-egg-*` | The hidden "Agent K" frame. Ctrl+K (or Cmd+K) on a keyboard; press and hold the masthead's case number on a phone |
| `11-board-map-phone` | The whole board in miniature at the top of the phone column: seven tappable files, pins and red string, drawn from the same `NODES` the desktop map uses |
| `09-case-summary-*` | The one-minute brief, now a popup: press the WANTED poster to open it. Typed rows plus three numbered pieces of evidence, no buttons of its own |
| `10-witness-statement-desktop` | A case file showing the stat-tile row and the witness statement block, with its provenance stated |

`-desktop` is shot through the dev-only specimen page (`gallery.html`), which
renders one section at a time on the paper background. `-phone` is the real
`MobileView` at 390 x 844 with an iPhone UA, scrolled to that section, so it
reflects what a phone actually renders (lazy mount, mobile HUD, red string).

## Regenerating

The specimen page also measures section heights for `mapLayout.ts`. Run the
dev server, then open:

    http://localhost:5173/gallery.html?s=experience          # one section
    http://localhost:5173/gallery.html?s=skills&w=900        # at a node's width
    http://localhost:5173/gallery.html                       # all sections

`?w=` constrains the column to a map node's `width`, which is how the
`height` values in `mapLayout.ts` were measured. Wait for
`document.fonts.ready` before reading `offsetHeight`: measuring before the
webfonts land gives noticeably wrong numbers.

To confirm no two map nodes collide after moving anything, compare the
sections' `.max-w-5xl` bounding rects pairwise in the console with every node
mounted (a very large viewport mounts them all, since `MapNode`
virtualizes). A section rubric ends in a full-width hairline rule, so a node
whose box merely *touches* a neighbour will still paint that rule across it.

## ⚠️ A "phone" shot needs the mobile user agent, not just a narrow viewport

`useIsMobileOrTablet` keys off the user agent (with a touch-points
fallback), so setting `Emulation.setDeviceMetricsOverride` alone renders the
**desktop** tree squeezed into 390px. That is a different render tree from
`MobileView`, and it looks plausible enough that three phone previews were
regenerated wrong before anyone noticed. Any capture script needs
`Emulation.setUserAgentOverride` with an iPhone UA plus
`Emulation.setTouchEmulationEnabled` as well.

Symptom to watch for: the phone shot shows the two-column corkboard, or
`#board` is reported as never mounted (that section only exists in the
mobile tree).
