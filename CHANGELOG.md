# Changelog

All notable changes to NEXG Concierge. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning is
[SemVer](https://semver.org/).

---

## [Unreleased] — merchant menu, host onboarding, deep links, audit

### Added

- **Host onboarding** (`HostOnboarding.tsx`): the `nexg-host-onboarding.html`
  prototype as a React component — 10 steps, 48 controls, 54 chip options, a Leaflet
  map pin, dynamic space and guest-request rows, uploads, a signature canvas and a
  review step. Lazy-loaded, so Leaflet stays out of the first paint (its own 205 kB
  chunk). Reached from **For Properties → "Partner with NEXG"**, which previously
  sent a property owner into the *merchant* intake form.
- **Merchant menu sections** (`src/data/menuSections.ts`) with a **docked category
  rail**: sticky under the header on scroll, active section tracked by intersection,
  tap to jump.
- **Docked category rail on the discovery screen** for mobile and tablet. Below `lg`
  there is no room for the desktop left rail, so the category chips previously
  scrolled away with the results — twenty merchants down, there was no way to change
  vertical without scrolling back to the top. The chips now dock under the header,
  and the selected vertical is scrolled into view so the rail keeps reporting which
  category you are browsing.
- **Deep-linkable pages**: `?page=<name>` for the top-level routes and
  `?merchant=<id-or-slug>` for a merchant. Previously every route lived only in React
  state, so nothing could be linked, reloaded or audited by an external tool.

### Fixed

- **The merchant page showed its whole catalogue in one unbroken grid.** See the
  "Repaired" note below for why the obvious grouping fix could not work.
- **Passing a partial merchant as a route fallback crashed the page.**
  `MerchantRoute` treats a fallback as a complete record, and `MerchantView` called
  `merchant.rating.toFixed()` on it. A deep-linked identifier is now held separately
  from the resolved record so a partial object can never be presented as loaded.
- **`For Properties` → "Partner with NEXG" routed to merchant onboarding**, so a
  property owner landed in a merchant intake. It now opens the host form.
- The prototype's mojibake `<title>` — a cp1252-double-encoded em dash, the same
  corruption repaired across the logs earlier.

### Repaired — why the merchant menu is derived

Grouping by an item's own subcategory is the obvious fix and it does not work. Two
measurements, both recorded in `menuSections.ts` so nobody retries it:

1. `server/repository.ts` stamps **the merchant's subcategory onto every item**
   (`mapItem(i, …, m.subcategory)`), discarding the item's own `subcategory_id`.
2. Even fixed, there is nothing to group by: sheet 3 of
   `NEXG_Nairobi_Merchant_Seed_Catalog.xlsx` holds **14,895 item rows across 640
   merchants, and not one merchant's items span more than a single subcategory.**

A menu built from subcategory is therefore one group holding everything — the
current page with a heading on top. Real merchants' items are near-identical variants
distinguished by a modifier ("House Red", "Signature House Red", "Premium House
Red"), so there is no semantic sub-kind to recover either.

Sections are assigned by a **stable hash of the item id** — never the index, never
random — so an item keeps its section across reloads, pagination and reordering.
Measured on Gold Champagne Co.: 4 sections, 8/8/7/7, all 30 items accounted for.

### Audited

All **11 pages × 2 viewports** scanned with the Impeccable detector: **zero findings
on every page.** The source tree carries one finding, the pre-existing
`overused-font` for Inter.

That result was validated before it was believed: a known-bad control file still
produces 10 source findings and 8 URL findings, and the deep links render 10 distinct
headings — so the sweep is a real pass, not a silent no-op.

---

## [Unreleased] — the hero line becomes a call to action

The hero subtitle rotates five moments, each pairing the customer's own word with
the services they can actually buy:

> **Relax** — spa · massage · wellness
> **Cravings** — food · restaurants · late-night
> **Arrive** — chauffeurs · transfers · airport
> **Stock up** — groceries · pharmacy · butcher
> **Get sorted** — laundry · repairs · vehicle care

The block is the call to action: it answers "what is this and what can I get"
without a second sentence. Neither half works alone — the first half is the
customer's word for the moment, the second half is the inventory.

Two earlier drafts failed in opposite directions and both are worth not repeating.
**Arrive / Supply / Fix** were operational verbs, describing what the platform does
*to* the customer, which is why they read rigid. **Breathe / Welcomed / Handled /
Sorted** fixed the tone but hid the goods, naming a mood instead of a product. Full
account: `logs/2026-09-21-live-hero-cta.log`.

Three reveal treatments are in the tree awaiting a pick: **plain** (the word alone),
**dash** (one line with an em dash), **stack** (word in the warm face with a tracked
caption). The em dash is `aria-hidden` — it is layout, not punctuation.

### Added

- **Self-hosted display typefaces**, both freely licensed, so the build carries no
  subscription, no page-view tier and no CDN dependency:
  - **TeX Gyre Adventor** (GUST Font License) for headings — the metric-compatible
    ITC Avant Garde Gothic clone from URW's Base 35 set.
  - **Cooper Black** (SIL OFL 1.1), the OFL revival by indestructible type\*, for the
    warm accent line. This is *not* Bitstream's commercial Cooper BT, which is a
    different cut with different metrics.
  - `--font-display` / `--font-warm` theme tokens, with Inter retained as the UI and
    body face: both new faces are display faces and Adventor is poor at small sizes.
- A three-treatment reveal on `HeroWipeSubtitle` (`plain` / `dash` / `stack`), each
  scoped to its own variant wrapper with `@scope`.

### Fixed

- The modifier class was emitted only for non-default reveals, so `.hero-wipe--breathe`
  never existed and the scoped rules applied to nothing — while their keyframes
  registered without complaint. The class must exist for every mode, default included.
- The support line ran together as "BreatheSpa" with a 0px gap, because the two spans
  are adjacent inline elements with no whitespace node between them once JSX collapses
  the newline. Spacing is now explicit.
- `@font-face` declared `font-weight: 400 900` on a static face, advertising weights the
  file does not contain. The range is for variable fonts.
- The stack treatment asked for `font-weight: 900` on Cooper Black, which is already a
  black weight — the browser synthesised extra bold on top and smeared the counters.
- The light-mode accent was keyed off `@media (prefers-color-scheme: light)`, but the
  app drives its theme with an explicit `html.light` / `html.dark` class. An OS set to
  light with the app set to dark painted `#8A6413` on the dark hero at **2.4:1**. Now
  keyed off the class the theme provider writes.
- The reveal carried **no gold at all** at one point: `.hero-wipe__inner` had no colour
  rule and inherited slate, silently missing the brief's contrast requirement.
- The reveal fired once on mount and left a static line, so it reported nothing when
  the line changed.

### Removed

- The previous subtitle's dead CSS: `.hero-subtitle`, `.hero-subtitle__separator`,
  `.hero-subtitle__promise`, `.hero-subtitle__promise--light/--dark`,
  `@keyframes hero-word-rise` and its ten `nth-child` delay rules. Verified by grep:
  zero references remain in `src/`.
- Variant 1's rotating pod with its blur cross-fade and subcategory chips (the chip
  idea is kept in reserve), and variant 2's five-item rail.

### Repaired

- `src/index.css` held a double-encoded em-dash from an earlier PowerShell 5.1
  `Set-Content`; all 23 logs in `logs/` were unreadable as text — 16 UTF-16LE, 3
  mixed UTF-8-header/UTF-16LE-body, 1 cp1252 double-encoded. All are now clean UTF-8.
- Vite's watcher killed the dev server a third time with `EBUSY`, this time on a `.ttf`
  being written by a download tool. `**/public/fonts/**` joined the ignore list.

### Note on the requested commercial typefaces

ITC Avant Garde Gothic and Cooper BT were requested. Neither has a free version. The
files supplied were **Adobe-served**: their embedded records name Adobe as the
manufacturer and point at `typekit.com/eulas/...`. Those records are the licence —
Adobe's terms state the web font licence requires fonts be added *"by the embed code
provided"* and that Adobe *"doesn't offer the ability to host fonts locally"*.
Stripping the metadata was requested and declined: it would remove the record of
origin without granting any right. The freely licensed alternatives above are shipped
instead. A licensed route remains available via Adobe Fonts embed code or a Monotype
webfont licence.

---

## [2.1.0] — 2026-09-21

Remediation of the Impeccable dual-agent design critique of the v2 discovery flow.
The critique scored the surface **20/40** and raised three P0 and two P1 issues; all
five are fixed and verified. Full account: `logs/2026-09-21-critique-remediation.log`.

### Fixed — P0

**The dynamic requirements engine silently degraded, through three stacked defects.**

Each was independently sufficient to keep the "Required to proceed" section from
ever rendering, so an adults-only order never asked for age verification while the
step rail promised "Eligibility check".

| # | Defect | Effect |
| --- | --- | --- |
| a | `parse_excel_to_db.py` computed a `subcategoryId` per merchant and never emitted `merchant_subcategories` rows | junction table held **0 rows**; the API returned no `subcategoryId` at all |
| b | `findSubcategory` resolved `normaliseKey(subcategoryId ?? subcategoryName ?? '')` | `??` does not fall through an **empty string**, so the name fallback never fired |
| c | The API sends a category-prefixed id (`adults-only_vapes`); the catalogue keys by bare slug (`vapes`) | even with links present, the id lookup missed |

A first attempt at (c) split at the *first* hyphen, turning `adults-only-vapes`
into `only-vapes`; the whole category prefix must be removed, and both the
catalogue id and slug are tried.

**One price for 1,500 items, and a sort that could not sort.** The Excel holds a
price *band* per item and the parser collapsed each band to a single value.
`sortMerchants` then sorted only the loaded page while pagination appended in
server order, so scrolling re-shuffled the list beneath a header showing the
server total.

**Recycled imagery and leaked generator copy.** 16 hero images across 640
merchants, and item descriptions shipped the Excel "Image Brief" column, which is
a prompt for an image generator rather than copy for a customer.

### Fixed — P1

**The item modal was a modal in appearance only.** `MerchantItemModal` imported no
`useEffect` at all: no Escape, no focus move, no focus trap, no scroll lock, while
`MerchantPreviewSheet` one layer down did all four. Extracted
`src/hooks/useModalBehavior.ts` so the two cannot drift apart again. Also fixed a
dangling `aria-labelledby` on the radiogroup — the label carried `htmlFor` but no
`id` of its own, so the group had no accessible name.

**The workflow rendered in the palette's least legible colour.** Measured, then
corrected:

| Pair | Before | After |
| --- | --- | --- |
| `gray-500` on card `#181A1F` | 3.60:1 | `gray-400` → **6.86:1** |
| `gray-500` on page `#111315` | 3.85:1 | `gray-400` → **7.33:1** |
| light `slate-400` on `#f7f8fa` | 2.41:1 | `slate-600` → **7.13:1** |
| light gold `#B88728` as text on white | 3.21:1 | `#8A6413` → **5.37:1** |

### Fixed — further correctness

- **The preview sheet's two buttons had identical destinations.** The primary CTA
  fell through to `onViewFull`, so "Check availability" and "View full profile"
  did the same thing under different labels. The primary now lands on the merchant
  page *at the offerings*, where the flow its label names begins; the secondary
  became "See all offerings".
- **The item modal's submit borrowed the arc's navigation verb**, so a
  quantity-and-notes dialog finished with "View full menu" — a label describing a
  navigation the user had already performed. Arcs now carry a separate
  `commitAction` ("Add to order", "Request booking", "Submit request", …).
- **Booking could not collect a pickup point.** `book_slot` asked for a date, a
  time and a party size but never where to go. Added a required `pickupAddress`
  and an optional `flightNumber`.
- **Vite's file watcher crashed the dev server** with `EBUSY: resource busy or
  locked` on the transient `*.tmpdir` directories that atomic writes create beside
  their target file. Added to the watcher ignore list.

### Added

- `scripts/regenerate_catalog_seed.py` — regenerates the seed from the source
  Excel with the data the original parser discarded: `merchant_subcategories`
  links, per-item prices spread inside each declared band, per-vertical imagery,
  and descriptions composed from the item's own facts. Idempotent (truncates
  before inserting) so re-running cannot duplicate the seed.
- `src/hooks/useModalBehavior.ts`.
- `GET /api/merchants` accepts `sort` (`recommended`, `rating`, `delivery`,
  `price_low`, `price_high`), ordered in SQL behind a whitelist.

### Data quality

| Metric | Before | After |
| --- | --- | --- |
| Distinct item prices | 1 | 270 (500–34,000) |
| Distinct hero images | 16 | 87 |
| `merchant_subcategories` rows | 0 | 640 |
| Items leaking generator copy | all | 0 |

### Verified

`tsc` clean · **34** unit · **29** API contract · **18** flow · **21** consistency —
**102 assertions**. Detector still reports zero findings on the surface.

One failure during remediation was **correct behaviour, not a regression**: once
the compliance gates began rendering, the adults-only modal gained required fields
and correctly refused a half-filled submission. The test was under-filling.

### A note on measurement

Three instruments of mine were wrong during this work, and each nearly caused a
change to working code: a screenshot taken mid-load read as "the grid is all
skeletons"; a copy-leak marker matched `crop` inside an image URL's `&fit=crop`;
and a contrast harness reported 144 failures because Tailwind v4 emits `oklch()`,
which a numeric parse reads as red/green/blue. The last one still over-reports:
its canvas conversion reads `fillStyle` before compositing, so translucent
backdrops appear opaque and a handful of false positives remain. **Do not quote
that harness as a clean bill of health.**

### Known issues carried forward

- The typeface is still `Inter`, loaded from Google Fonts via `@import`. Both
  design skills flag it (`overused-font`); changing it changes the product's whole
  visual identity, so it was raised rather than changed silently.
- `CategoryExplorerModal` remains on disk unreferenced, as an intentional reserve.
- `.img2threejs-mascot/` belongs to an unrelated tool; it is gitignored and
  untracked, but still present on disk.

---

## [2.0.0] — 2026-09-21

The discovery, merchant-page and item-ordering surfaces, rebuilt on real API data.

### The four requirements this release delivers

| # | Requirement | Result |
| --- | --- | --- |
| R1 | Clicking the search bar leads to a merchant discovery screen (Wolt-style) | New `DiscoveryScreen`: live search, 21-vertical rail, subcategory chips, sorting, pagination, skeletons, empty and error states |
| R2 | Each vertical gets its own dynamic workflow for its intended use | New `workflowEngine` derives one of five commerce arcs per merchant and adapts every action to it |
| R3 | Clicking a merchant must never go straight to the merchant screen | New `MerchantPreviewSheet`; the discovery surface stays mounted behind it and navigation requires an explicit "View full profile" |
| R4 | Remove every nav item from Explore through Experiences in the docked state | Nav is now Explore + Partners only. Verticals remain reachable via discovery and the footer |

### Added

- **`src/data/workflowEngine.ts`** — maps a merchant's seeded `workflow` string onto
  one of five commerce arcs, each with its own step rail, CTA wording and structural
  requirements:

  | Arc | Verticals | Primary action |
  | --- | --- | --- |
  | Browse & buy | restaurants, groceries, alcohol, pharmacy, marketplace, retail | View full menu |
  | Book a slot | airport transfers, experiences, travel, vehicle rentals | Check availability |
  | Request a service | concierge, laundry | Request this service |
  | Compliance & appointment | financial services | Book appointment |
  | Get a quote | logistics & shipping | Get shipping quote |

  Falls back to a per-category default when a merchant declares no workflow, and
  flags that fallback in the UI rather than hiding it.

- **`src/components/discovery/`** — `DiscoveryScreen`, `DiscoveryMerchantCard`,
  `MerchantPreviewSheet`.

- **`src/lib/apiClient.ts`** — typed, abortable API access. Every call takes an
  `AbortSignal`; without cancellation a slow response for `"ch"` can overwrite a
  fast one for `"champagne"` and the grid renders a stale query.

- **`src/hooks/useMerchantSearch.ts`** — debounced (280 ms) search with pagination.
  Deliberately aborts the in-flight request on every query change.

- **`src/components/forms/DynamicField.tsx`** — one renderer for all seven control
  types, so the product cannot drift into three text-field styles.

- **`scripts/v2-flow-test.mjs`** (18 assertions) and
  **`scripts/v3-consistency-test.mjs`** (20 assertions) — behavioural tests for the
  new flows. Neither behaviour is visible in a screenshot.

### Fixed

| ID | Defect | Resolution |
| --- | --- | --- |
| D-04 | Frontend never consumed the API | Discovery, merchant page and item modal all read `/api/*` |
| D-16 | Hero search was a fake search | It now opens a real query surface |
| D-10 | Category explorer unreachable | Superseded: search opens discovery. The taxonomy modal is now unreachable from the UI and remains in the tree pending a decision |
| D-15 | Nav overflowed its own breakpoint | Removing six items resolved it as a side effect |
| D-18 | UI claimed 134 subcategories while the database had 128 | Counts now come from the API, so the number cannot drift |

### Fixed during this release (found by testing, not by reading)

These are worth recording because each was invisible until something exercised it:

1. **Merchant page was unreachable from discovery.** The merchant route was nested
   *inside* the non-discovery branch of the render tree, so while discovery was open
   the `selectedMerchant` branch could never render. "View full profile" closed the
   sheet and displayed nothing. Fixed by giving the merchant route top precedence.
2. **Escape tore down the whole surface.** The discovery screen and the preview
   sheet both bound Escape. With the sheet open, Escape could unmount discovery
   instead of closing the sheet. A modal must own Escape while it is open.
3. **Quantity was validated but never rendered.** `'quantity'` was missing from
   `SECTION_ORDER`, so the section builder silently dropped it while it stayed in
   the flat requirement list. The form therefore rejected submissions over a field
   the user had never been shown. Fixed, with a regression test asserting that every
   validated requirement is reachable in a rendered section.
4. **Validation copy was ungrammatical.** Editing a required field produced
   *"How would you like to receive this? is required."* Messages were rewritten to
   name the problem and the recovery.

### Changed

- **One merchant page for all 21 verticals** (`MerchantView`), replacing the
  per-vertical bespoke presentations. What varies is the workflow, not the layout.
- **One item modal for all order types** (`MerchantItemModal`), rendering
  requirements grouped into Quantity / Options / When / Delivery / Required to
  proceed / Anything else. A bag of groceries gets a quantity and a note; a
  chauffeur transfer gets a date, a time, a party size and a pickup choice.
- Requirements come from the catalogue's own declarations — the subcategory `fields`
  in `merchantCatalog.ts` and the `FIELD_DEFS` schema — rather than a new invented
  schema, so the modal and the merchant-onboarding form cannot disagree.
- Styling aligned to the Impeccable craft floor: no kicker/eyebrow labels, no nested
  cards, no icon-in-a-tile scaffolds, 150–200 ms transitions, one authored motion
  moment per surface.
- Browser surfaces themed from the palette: `::selection`, `caret-color`, and
  global `:focus-visible`.

### Verified

- `tsc --noEmit` — clean.
- `vitest run` — **34/34** across 5 suites.
- API contract — **29/29**.
- v2 flow — **18/18**.
- v3 consistency — **20/20**.
- Total: **101 assertions passing**.

### Known issues carried forward

- The seeded catalogue has items on merchants in only **two** verticals
  (`airport-transfers`, `adults-only`). The other 19 verticals render a merchant
  page with an empty offerings state. This is a **data** gap (the Excel import is
  lossy — see D-06), not a code gap.
- Many merchants have `subcategory` set to their category name with no
  `subcategoryId`, because they are not linked in `merchant_subcategories`. Those
  merchants therefore render no catalogue-declared requirements, so the compliance
  section never appears for them. Covered by unit tests instead.
- `inter` is still the typeface, loaded from Google Fonts via `@import`. Both are
  flagged by the design skills; changing the typeface changes the product's whole
  visual identity, so it is raised rather than done silently.
- The `CategoryExplorerModal` is now unreachable, and its wiring was removed from
  `App.tsx`. The component file is kept as an intentional reserve rather than
  deleted: nothing imports it, so it costs nothing at build time, and it already
  implements search across all 21 categories. Either wire it to a "browse all
  categories" control or delete it. `src/lib/adapters.ts` was genuinely dead and
  has been deleted.

---

## [1.0.0] — 2026-09-21

First continuously-deployable baseline. The project previously had a working UI
sketch but **could not start its own backend**, had **no database connection**, and
had **no version control**.

### Added

- **PostgreSQL data layer**
  - `server/db.ts` — `pg` connection pool with bounded retry/backoff, an idle-client
    error handler (without one, an idle error kills the process), and graceful
    degradation to the JSON cache instead of crashing.
  - `server/repository.ts` — SQL-backed queries, row→contract mapping, and
    `attachItems()` which hydrates items for a whole page in **one** query rather
    than one per merchant (avoids an N+1 of 201 round trips on a 200-item page).
  - New endpoints: `GET /api/search`, `GET /api/areas`.
  - `/api/merchants` now supports `category`, `subcategory`, `area` and `search`
    filters **in SQL**, where previously filtering happened in JavaScript over a
    pre-truncated array.

- **Local database provisioning**
  - `scripts/setup-postgres.ps1` — idempotent, creates an isolated PostgreSQL 15
    container `nexg-concierge-pg` on **port 5433**, applies `schema.sql` and
    `seed_excel.sql`, verifies row counts, writes `.env`.
  - `npm run db:up` wraps it.

- **Testing**
  - `scripts/api-contract-test.mjs` — 29 assertions covering health, counts,
    pagination, clamping, filtering, item hydration, detail and 404 behaviour.
    Includes an explicit regression guard for the count-contradiction bug.
  - `scripts/screenshots.mjs` — Playwright capture of every major surface at desktop
    and mobile widths, recording console errors, page errors and failed requests
    into a `manifest.json`.
  - `npm run test:api`, `npm run shots`.

- **Documentation** — `docs/PLAN-v1.md` (verified state + defect backlog),
  `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/HANDOFF.md`, `logs/README.md`,
  rewritten `README.md`.

- **Version control** — `git init` plus a baseline commit taken *before* any
  behaviour changed, so every v1 change is a reviewable, revertible diff.

- **Frontend ↔ API plumbing** — `/api` proxy in `vite.config.ts` (dev and preview)
  so the SPA can call the backend same-origin, with no CORS and no hardcoded host.

### Fixed

| ID | Defect | Resolution |
| --- | --- | --- |
| D-01 | **Backend could not boot.** `server/index.ts:4` used `import express, { Request, Response }`, importing TypeScript *types* as runtime values. Under Node's native TS loader this throws `SyntaxError: Named export 'Request' not found`; under `tsx` it crashed on esbuild. | Split into a value import plus `import type`. |
| D-02 | Backend never queried PostgreSQL even when configured, so a fully seeded 640-merchant database sat unused while the API served JSON. | Added the pool and repository; Postgres is now preferred when reachable. |
| D-03 | **API served 19% of the catalogue and contradicted itself.** `/api/health` reported `summary.totalMerchants` (640) while `/api/merchants` served the `merchants` array (120). | Counts are now derived from the collection actually served; verified 640 == 640. |
| D-07 | `server/index.ts` called `app.listen()` on import, so importing it in a test bound a real port. | Exported `app`; `listen()` is guarded behind a direct-invocation check. |
| D-08 | CORS advertised `POST, PUT, DELETE` but no write routes exist. | Now advertises `GET, OPTIONS` only. |
| D-09 | `limit`/`offset` were passed through `parseInt` with no bounds. | Clamped to 1–200 and ≥ 0; non-numeric input falls back to defaults. |
| D-10 | **Inert category explorer.** `setIsCategoryExplorerOpen(true)` did not exist anywhere in the codebase, so the hero search box and the "Explore Categories" cards did nothing. | Wired the hero search and Explore cards; a matching query now jumps straight to that vertical, otherwise the explorer opens. |
| D-17 | **Header "Explore" was a no-op.** It called `onNavigate('home')`, which on the home page changed nothing. Also missing from the mobile drawer. | Added an `onExplore` prop opening the category explorer; wired both desktop nav and mobile drawer. |

### Changed

- **Postgres is the source of truth; JSON is a cold-start fallback.** The API is
  fully usable with no database (`source: seeded_json_fallback`), so a new
  contributor is never blocked, but real data wins whenever available.
- `package.json` renamed `react-example` → `nexg-concierge`, version `0.0.0` → `1.0.0`.
- `npm run server` switched from `tsx` to `node server/index.ts` (Node 24 native TS),
  which the project already supports and which removes an esbuild dependency at runtime.
- `.gitignore` hardened: env files, local npm cache, Playwright artifacts.

### Verified

- `tsc --noEmit` — clean.
- `vitest run` — **11/11 tests pass** across 4 suites.
- `api-contract-test.mjs` — **29/29 assertions pass** against PostgreSQL.
- `screenshots.mjs` — **20/20 surfaces captured** (desktop + mobile) with zero page
  errors and zero console errors.
- Database seeded: 21 categories, 128 subcategories, 640 merchants, 1,500 items.
- Frontend serves on :3000; the Vite proxy reaches Postgres via the API.

### Known issues carried into v2

Detailed in `docs/HANDOFF.md`. The most important:

1. **The frontend still does not consume the API.** It renders bundled static
   modules, so users see a 120-merchant hardcoded subset while the API serves 640.
2. **Three conflicting catalogue counts** (JSON summary 14,895 / JSON array 3,300 /
   Postgres 1,500 items) — the Excel import is lossy and must be reconciled.
3. **Category slug taxonomy mismatch**: the database uses `restaurants-food`,
   `groceries-essentials`, `wellness`, `travel-tours`; the frontend's filter tabs
   reference `restaurants`, `fine_dining`, `groceries`, `health_nutrition`,
   `electronics`, `florists`, `alcohol_beverages`. Tabs therefore filter to nothing.
4. **Subcategory count mismatch**: the UI claims "134 subcategories" in three places
   while the seed contains 128.
5. Category explorer subcategory chips render as inert badges with no count or link.

### Not included in v1

Authentication, payments, real courier dispatch, live GPS tracking, merchant
self-service portal, and completed i18n.
