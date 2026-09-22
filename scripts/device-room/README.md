# Device room

One local page that shows this app at every device size we support, live, side by side.

The point is to answer "how does this look on the devices our customers actually hold"
in one scroll instead of one devtools width at a time. Comparing two widths currently
means remembering one of them; here they are both on screen at once.

```bash
npm run room          # http://localhost:3100
```

Both other services must already be running, because the frames load the real app with
real data:

| Service | Port | Start |
| --- | --- | --- |
| Vite dev server | 3000 | `npm run dev` |
| Express API | 3001 | `npm run server` |
| Device room | 3100 | `npm run room` |

## What it gives you

**Every width at once.** 36 presets, from iPhone SE (320px) through the 1440px desktop. The
three widths where defects actually appear — 320, 344 and 360 — carry a gold tier badge so
they are never scrolled past by accident.

**Real physical size.** In `auto` zoom the frame is drawn at the size the object actually
is, not at its logical width. The page inside still lays out to the logical width — a 390
CSS px viewport for an iPhone 14 — while the frame occupies the millimetres that phone
measures, derived from `mmW` in the preset. CSS fixes 96px to one inch, so this is
dependable: an iPhone 14 paints at 270 CSS px, which is 2.81 inches on any display, and can
be held against the phone in your hand. A device with no `mmW` falls back to 1:1, which is
honest about being approximate.

This is why two different 360px phones paint at different widths (257px vs 289px): they are
different physical objects. Scaling every device to its column, or drawing it at its logical
width, both destroyed that — the first made every phone ~300px wide whatever its real size,
the second made every device about a third larger than life. `Zoom` still offers manual
scales when a whole page needs to be seen at once.

**A real audit.** `Audit layout` measures the current screen at every visible width and
reports, per device: page-level horizontal overflow, elements loose past the right edge,
text clipped by its own container, and tap targets under 24px. Press `A`.

**Stills.** `Capture stills` renders each width to a PNG through a separate browser and
shows them as a gallery, so a set can be captured without leaving the page. Press `S`.

**Shareable state.** Route, device group, theme and zoom live in the URL hash, so a
specific comparison can be linked, reloaded, or pasted to someone else.

Keyboard: `A` audit, `R` reload all frames, `S` stills, `Esc` close.

## Two things that will bite you

### The frames are cross-origin, and that is expected

The room listens on 3100 and the app on 3000. A port is part of an origin, so
`iframe.contentDocument` is `null` from here — the page cannot read the layout of the
frames it displays.

This is why **the audit runs on the server**, driving its own browser per device. An
in-page audit would report "0 broken" for every frame while measuring nothing at all,
which is the exact failure mode this project has already been burned by: an Impeccable
detector timed out on every URL, exited 0, and printed `[]` — byte-identical to a clean
scan — and 22 of those were reported as a pass.

If you ever make the room same-origin with the app, the in-page path would work, but the
audit deliberately does not depend on it.

### A clean audit is only meaningful with a control

`scripts/_verify-device-room.mjs` runs the room end to end and includes two controls
against the *same* measurement function the audit uses:

- a deliberately broken page (a 1200px box in a 390px viewport) must be flagged
- a clean page must not be

If the broken page is not flagged, the run fails. Without that, "0 broken" cannot be
distinguished from "the measurement did nothing".

```bash
node scripts/_verify-device-room.mjs
```

## Files

| File | What it is |
| --- | --- |
| `server.mjs` | Static host plus `/api/presets`, `/api/audit`, `/api/still`, `/api/measure-source` |
| `index.html`, `room.css`, `room.js` | The page |
| `measure.mjs` | **The** measurement function — one implementation, server and client |
| `measure-page.mjs` | Navigate-and-measure with retries for dev-server reloads |
| `check-source.mjs` | Guards the template-literal trap described below |

`scripts/_verify-device-room.mjs` is the end-to-end check for all of it:

```bash
node scripts/_verify-device-room.mjs
```

It asserts what the room claims — frames mount, they paint at physical size, the page
declares the logical viewport, route changes reach every frame, the audit covers each
device — and then runs both controls. **It is the fastest way to tell whether the room
still works after a change**, because a room that silently stopped rendering looks the
same as one with nothing to show.

`scripts/device-presets.mjs` is the single list of devices and routes, shared with
`logs/critique/_device-matrix.mjs`. Adding a device there adds it to both, which is the
point: the two must never disagree about what was reviewed. Each preset carries `w`/`h`
(logical CSS px, what the page lays out to), `mmW` (the physical width, for real-size
rendering), `category`, `tier` and `critical`.

## The template-literal trap

`MEASURE_SOURCE` in `measure.mjs` is a template literal holding a whole JavaScript
function, because the same function has to run both in this process and inside a page.
**A single backtick anywhere inside it — including inside a comment — terminates the
literal early and the module stops parsing.** This happened twice while writing it.

`node scripts/device-room/check-source.mjs` fails on it. Run it after touching
`measure.mjs`; `tsc --noEmit` does not catch every form of this.

## What counts as broken, and what does not

A bounding-box test alone cannot tell a defect from a layout doing its job, and the first
version of this audit got that badly wrong in both directions.

**Excluded, because the layout is correct:**

- **Off-screen carousel slides.** The track holds several cards and the ones after the
  first sit past the right edge on purpose, clipped by an ancestor's `overflow: hidden`
  so they can slide in. Measured on the home page at 360px: **429 such elements, and not
  one element in the document had `overflow-x: auto`** — this app's carousels translate a
  track rather than scroll a container. An earlier version of this audit reported those
  429 as "past the edge", which is what produced the original "37 of 72 combinations
  broken" figure. It was measuring the carousel's off-screen slides, not the layout.
- **Marquee tracks**, wider than the viewport by construction.

The rule is therefore: an element is only *loose* if it is past the right edge **and** no
ancestor clips it. Being clipped means it cannot affect the page, and the page's own
`scrollWidth - clientWidth` is the thing a user actually experiences — that is the
primary verdict.

**Excluded, because the truncation is deliberate:**

- **`line-clamp` truncation.** `-webkit-line-clamp` forces `overflow: hidden` as part of
  its own mechanism, so a deliberately clamped two-line title is indistinguishable from a
  clipped one by computed style alone. Counting it inflated every phone's clipped-text
  count by roughly 19. Clamped elements are read back and skipped.

A 1880px rail in a 360px scroller is correct. Do not "fix" it.
