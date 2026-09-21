# Changelog

All notable changes to NEXG Concierge. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning is
[SemVer](https://semver.org/).

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
