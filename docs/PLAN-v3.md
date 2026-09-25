# Plan — v3: host onboarding, adaptive forms, real typefaces

**Date:** 2026-09-21
**Baseline:** v2.1.0 (`6dac31d` shipped the hero subtitle; this plan covers the work after it)
**Rule this plan obeys:** plan → document the plan → build → test → log + handoff.

---

## 1. What prompted this

Three requests, arriving together:

1. **Hero copy critique.** "the changing words you are advertising to consumers,
   that sounds rigid, i only like reset and craving, the rest are rigid, the better
   should breathe" — then, after a rework: "I LIKED THE RELAX SPA MASSAGE WELLNESS,
   CRAVINGS FOOD, RESTAURANTS ... A NICE CTA THAT IS CLEAR TO CONSUMERS".
2. **Typefaces.** Avant Garde Gothic plus Cooper BT were requested; a second,
   fuller Cooper package followed.
3. **Adaptive onboarding.** "THE ONBOARDING FORMS SHOULD BE ADAPTIVE TO THE THEME
   AS WELL", plus a new standalone `nexg-host-onboarding.html` prototype to absorb.

---

## 2. Findings that shape the work

### 2.1 The onboarding forms never adapted to the theme

Both `MerchantOnboarding.tsx` and `CourierOnboarding.tsx` call `useTheme()` and
destructure `isLight` — and then **never reference it**. Between them they carry
~650 light-only neutral utilities (`bg-white`, `text-slate-500`,
`border-slate-200`). They were correct in light mode and wrong in dark mode, and
the `useTheme()` call made them look handled.

**Decision: fix by token, not by conditional.** Rewriting 650 call sites into
`isLight ? … : …` would add thousands of tokens of noise with an error opportunity
at each one. Instead the neutral scales are redefined as custom properties scoped to
`.onboarding-theme` on each form's root, flipping under `html.dark`.

This works because Tailwind v4 utilities compile to `var(--color-slate-200)`, which
resolves **on the element that uses it**. A declaration on an ancestor therefore
wins by proximity, not by specificity — no `!important` needed.

Only neutrals flip. Amber, emerald, red and blue keep their meaning in both themes,
which is what keeps a warning looking like a warning at night.

### 2.2 Printed agreements must not follow the screen theme

`MerchantOnboarding` prints `#printAgreementArea`. If the screen theme inverted the
tokens, the printed contract would be pale text on white paper. The print block now
pins the neutral tokens back to their light values on the print container itself.

### 2.3 The contract preview is not part of the form

`CourierOnboarding` renders the agreement text inside a **white** preview card. That
markup must keep light tokens; wrapping it in the theme scope would have produced
light text on a white card. Verified and explicitly excluded.

### 2.4 The requested commercial typefaces cannot be self-hosted

The supplied files were **Adobe-served** — their embedded name tables name Adobe as
manufacturer and point at `typekit.com/eulas/...`. Adobe's web font licence requires
fonts be added *"by the embed code provided"* and states Adobe *"doesn't offer the
ability to host fonts locally"*. Stripping the metadata was requested and declined:
the embedded records **are** the licence, so removing them grants no right and
leaves a deployed `dist/` carrying unlicensed commercial font software.

**Decision: ship freely licensed faces that occupy the same roles.**

| Role | Face | Licence |
| --- | --- | --- |
| Headings | TeX Gyre Adventor | GUST Font License |
| Warm accent | Cooper\* (full family) | SIL OFL 1.1 |
| UI and body | Inter | SIL OFL 1.1 |

Cooper\* is the researched OFL revival of Oswald Cooper's 1920s series. The full
six-weight family arrived in the second package, so the accent line uses **Bold**
rather than Black: at display size Black reads as bulk and loses the Art Nouveau
bowing that the family exists to preserve.

A licensed route stays open — Adobe Fonts embed code, or a Monotype webfont licence
(subject to its SaaS clause, which excludes *"Web Based Product"* use).

---

## 3. The hero line

### 3.1 Copy

Two drafts failed, in opposite directions, and both are worth recording because the
second is only visible once the first is measured against the brief:

- **Draft 1 — Arrive / Supply / Fix.** Operational verbs. A verb describes what the
  platform does *to* the customer, which is exactly why it read rigid.
- **Draft 2 — Breathe / Welcomed / Handled / Sorted.** Warmer, but names a mood and
  hides the goods. Not a call to action, however nice it sounds.

The brief wants both halves at once: the customer's word, then the inventory.

```
Relax       spa · massage · wellness
Cravings    food · restaurants · late-night
Arrive      chauffeurs · transfers · airport
Stock up    groceries · pharmacy · butcher
Get sorted  laundry · repairs · vehicle care
```

### 3.2 Three reveal treatments

| # | Mode | Presentation |
| --- | --- | --- |
| 1 | `plain` | the customer's word alone, larger |
| 2 | `dash` | one line: word, em dash, inventory |
| 3 | `stack` | word in Cooper Bold, inventory as a tracked caption |

The em dash is `aria-hidden`: it is layout, not punctuation, and a screen reader
announcing "dash" mid-sentence is noise.

---

## 4. Host onboarding

### 4.1 What the prototype is

`nexg-host-onboarding.html` — 66 KB, standalone:

- Tailwind **CDN** with its own inline `tailwind.config`
- Google Fonts (Inter, Outfit, Caveat) + Font Awesome + **Leaflet 1.9.4** (CDN)
- 11 sections: About you · Property profile · Location + map pin · Spaces &
  inventory · Property access · Services & guest requests · Operations · Commerce &
  settlement · Settlement account · Documents & brand · Review & authorization
- 54 fields (42 inputs, 8 selects, 4 textareas)
- ~20 KB of inline vanilla JS driving a 10-step wizard, chips, validation, file
  previews and the map

### 4.2 Conversion rules

1. **No CDN Tailwind.** The prototype's `tailwind.config` extends `fontFamily` and
   adds `brand.gold/orange/dark`. These become theme tokens in `src/index.css`; the
   CDN script and inline config are dropped.
2. **No CDN Leaflet.** Add the `leaflet` package and import it in the component.
   The map initialises in an effect after the location step mounts, and is torn down
   on unmount — the prototype's global-init approach leaks on navigation.
3. **Vanilla DOM → React state.** `querySelector` step switching becomes
   `useState`; chips and choices become controlled; validation moves to explicit
   rules rather than class toggling.
4. **Adaptive from the start.** Root gets `onboarding-theme`; the prototype's
   hardcoded `#e2e8f0` / `#f8fafc` / `#475569` become token references so the form
   is correct in both themes on day one rather than retrofitted like its two
   siblings.
5. **Real navigation.** Registers as `host_onboarding` in `AppCurrentPage`, reached
   from the Partners menu alongside Merchants and Couriers.

### 4.3 Non-goals

- No backend submission. The prototype has no endpoint; this ships the flow and
  leaves persistence to a later phase, consistent with how the other two forms
  behave.
- No Leaflet tile key. Uses OpenStreetMap tiles as the prototype does.

---

## 7. Merchant page: from one flat block to a menu

### 7.1 What is wrong today

The merchant page renders **every item in a single grid**. There is no grouping,
no sections, and no way to navigate. For a merchant with 15 offerings that is
merely dense; the design does not scale and it reads as overwhelming.

### 7.2 The root cause is in the data, not the markup

Measured, not assumed:

- `server/repository.ts` calls `mapItem(i, ..., m.subcategory)` — it stamps **the
  merchant's own subcategory onto every item** and discards the item's own
  `subcategory_id`.
- The source workbook `data/source/NEXG_Nairobi_Merchant_Seed_Catalog.xlsx` sheet 3 holds
  **14,895 item rows across 640 merchants, and not one merchant's items span more
  than a single subcategory.**

So the page cannot group by subcategory — there is exactly one group. Fixing the
markup alone would produce a single menu section containing everything, which is
the current page with a heading on it.

### 7.3 Why that is fixable

Item names are already section-shaped. Sampled from the workbook:

| Vertical | Real item names | Natural sections |
| --- | --- | --- |
| Alcohol & Beverages | House Red, Sauvignon Blanc, Cabernet, Merlot | Wines |
| Wellness | Deep Tissue Ritual, Signature Facial, Body Scrub | Massage · Facials · Body |
| Restaurants & Food | Signature Burger, Grilled Chicken, Beef Steak | Mains · Grills |
| Groceries | Milk, Bread, Eggs, Rice, Pasta | Dairy · Bakery · Pantry |

The taxonomy exists in the names; it was never assigned.

### 7.4 Work

1. **Assign a menu section per item** in the seed generator, from a per-vertical
   section taxonomy plus a keyword classifier over the item name. Deterministic, so
   regeneration is stable. Store it as the item's subcategory so it flows through
   the existing `subcategoryId` column rather than adding a parallel concept.
2. **Serve it.** `mapItem` must use the item's own subcategory; `attachItems` must
   join `subcategories` to resolve the name. This is a real defect fix independent
   of the UI — the current mapping is simply wrong.
3. **Group and collapse in the UI.** Render per-section blocks with a bounded
   initial height so the page no longer shows everything at once.
4. **Dock the section nav.** A sticky category rail that sits under the header and
   sticks while scrolling, with the active section tracked by intersection and
   tapping a section scrolling to it. This is the Wolt behaviour that was asked
   for.
5. **Anchor offset.** Jumping to a section must clear the sticky rail, or the
   heading hides underneath it.

### 7.5 Acceptance

- No merchant page shows its full catalogue in one unbroken block.
- The category rail sticks while scrolling and tracks the active section.
- Tapping a category scrolls to that section with its heading clear of the rail.
- A merchant with items spanning several sections renders several sections.

---

## 8. Verification

Every claim is measured in a browser, not read off the source:

| Gate | Expectation |
| --- | --- |
| `tsc --noEmit` | clean |
| `vitest run` | 34/34 |
| API contract | 29/29 |
| v2 flow | 18/18 |
| v3 consistency | 21/21 |
| `npm run build` | clean |
| Detector | no new findings |
| Onboarding theme | tokens flip under `html.dark`; printed area stays light |
| Host wizard | all 10 steps reachable; fields controlled; map mounts and unmounts |

---

## 9. Known traps to avoid

Carried forward because each one has already cost time in this project:

1. Measure the running app, not the source. Four defects in the hero work were
   invisible in the code.
2. `height / line-height` is not a line count. Use `Range.getClientRects()`.
3. Screenshots taken mid-animation understate contrast. Pin animations first.
4. The live scaffold injects `!important` rules that beat inline styles, and its
   sheet matches the same substring as the feature's own `<style>`. Match on the
   scaffold's rule shape, not the substring.
5. `Out-File` and `Set-Content` are not UTF-8 in PowerShell 5.1. Write through Node
   or `File.WriteAllText` with an explicit encoding.
6. Vite's watcher dies on `EBUSY` for files being written under it — `*.tmpdir`,
   and now `public/fonts/`.
