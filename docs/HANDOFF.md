# Handoff — NEXG Concierge v1

**Date:** 2026-09-21
**Version:** v1.0.0
**Workspace:** `C:\Users\limta\Downloads\nexg-concierge`
**Author:** build session (agent)

---

## 1. Read this first

**The backend is real and works. The frontend is still showing hardcoded data.**

You can run the full stack today and browse a polished, working app — but the
merchants on screen come from bundled static modules, not from the 640-row
PostgreSQL database that is now provisioned and serving a complete API right
next to it. Closing that gap is the single highest-value task in v2.

Everything else in v1 was about making the project *startable, testable,
verifiable and documented* so that work could happen at all. Before v1 the
backend could not boot, there was no database connection, and there was no
version control.

---

## 2. How to run it

```bash
npm install
npm run db:up      # provisions Postgres 15 on port 5433 (needs Docker running)
npm run server     # API on :3001        (terminal 1)
npm run dev        # SPA on :3000        (terminal 2)
```

Open <http://localhost:3000>.

### Verify the state yourself

```bash
npm run lint        # expect: clean
npm test            # expect: 11/11 passing
npm run test:api    # expect: 29/29 passing   (server must be running)
npm run shots       # writes logs/screenshots/ + manifest.json
```

`npm run test:api` is the fastest confidence check. If `health.totalMerchants`
and `/api/merchants?limit=1`'s `total` ever diverge again, it fails.

---

## 3. What was actually wrong (and what I fixed)

| ID | Defect | Status |
| --- | --- | --- |
| D-01 | Backend could not boot — imported TS types as runtime values | ✅ fixed |
| D-02 | Backend never queried Postgres, despite it being configured | ✅ fixed |
| D-03 | API served 120 of 640 merchants and contradicted its own health check | ✅ fixed |
| D-04 | Frontend never calls the API | ⚠️ **plumbing done, wiring remains** |
| D-05 | No version control at all | ✅ fixed |
| D-06 | Three conflicting catalogue counts | ❌ **open — see §5.2** |
| D-07 | `listen()` fired on import, breaking tests | ✅ fixed |
| D-08 | CORS advertised write methods that don't exist | ✅ fixed |
| D-09 | Unbounded `limit`/`offset` | ✅ fixed |
| D-10 | `setIsCategoryExplorerOpen(true)` existed nowhere — explorer was unreachable | ✅ fixed |
| D-11 | No error boundary | ❌ open |
| D-12 | Tests blocked by sandbox | ✅ resolved (11/11 pass) |
| D-13 | Duplicate `components/ui/` vs `src/components/ui/` | ❌ open |
| D-14 | Design polish pass | ❌ open |
| D-17 | Header "Explore" was a no-op | ✅ fixed |
| D-18 | UI claims 134 subcategories; database has 128 | ❌ open |

### D-01 in detail, because it explains a lot

`server/index.ts:4` read:

```ts
import express, { Request, Response } from 'express';
```

`Request` and `Response` are **TypeScript types**, not runtime exports. `express`
is CommonJS. Under Node's native TS loader this throws
`SyntaxError: Named export 'Request' not found`; under `tsx` it died inside
esbuild. The server had therefore **never successfully started in this
configuration**. Fixed by splitting into a value import and `import type`.

### D-03 in detail, because it was the most damaging

`/api/health` read `seededCatalog.summary.totalMerchants` → **640**.
`/api/merchants` served `seededCatalog.merchants` → **120 entries**.

The API confidently reported a number it did not serve. Any UI built against
`/api/merchants` would silently show 19% of the catalogue and look "empty" with
no error anywhere. Counts are now derived from the collection actually served,
and the contract test asserts the two agree.

---

## 4. Current verified state

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `vitest run` | 11/11 across 4 suites |
| API contract | 29/29 against PostgreSQL |
| DB seed | 21 categories, 128 subcategories, 640 merchants, 1,500 items |
| Frontend boot | serves on :3000, Vite proxy reaches Postgres through the API |
| Screenshots | 20/20 surfaces captured (desktop + mobile), no page or console errors |

### Environment facts a future session must know

1. **Two unrelated Postgres stacks exist on this machine.**
   - `nexg-concierge-pg` on **5433** — this project.
   - `nexg-postgres-1`, `nexg-api-1`, `nexg-kernel-1` on **5432** — the separate
     **NEXG POS Go platform** at `C:\Users\limta\Desktop\NEXG POS`.
   Never point this project at 5432 and never modify those containers.

2. **Docker requires escalation.** The Docker named pipe `\\.\pipe\...` is blocked
   under the `workspace-write` sandbox. So do Vite, esbuild, `tsx` and Playwright,
   which spawn native binaries over named pipes (`spawn EPERM`). Background jobs
   run under the restricted sandbox and will fail on these — run them in the
   foreground with full access.

3. **PowerShell is 5.1, not `pwsh`.** Use `powershell.exe`. Avoid
   `[Parameter(ValueFromRemainingArguments)]` wrappers around `docker`; 5.1 binds
   native flags like `--format` as parameter names. Pass argument arrays instead.

4. **`curl.exe` and `Invoke-WebRequest` cannot do TLS here** (`schannel
   SEC_E_NO_CREDENTIALS`). Use Node's `fetch` for network checks.

---

## 5. The v2 backlog, in priority order

### 5.1 🔴 Wire the frontend to the API (D-04) — do this first

**Problem.** Every page reads a different bundled module:

| Page | Source |
| --- | --- |
| `NexGDiscoveryView`, `CuratedNairobiWorlds` | `catalogData.ts` → `seededCatalog.json` (120 merchants) |
| `Restaurants.tsx` | `restaurantsData.ts` |
| `SpaWellness`, `TransportPage`, `GroceriesPage` | `spaData.ts`, `transportData.ts`, `cellarData.ts` |

**Consequence.** The app shows a hardcoded subset, merchant counts disagree
between screens, and none of the 1,500 database items with real prices are visible.

**Suggested approach.** The components consume `SEEDED_MERCHANTS` synchronously, so
a wholesale async conversion is large and risky. Two viable paths:

- **(a) Hydrate a store (lower risk).** Create `src/data/apiClient.ts` plus a
  `CatalogProvider` that fetches `/api/categories` and paginated `/api/merchants`
  once at boot, then publishes into a module-level store whose accessors keep their
  current synchronous signatures. Components keep working unchanged; the data
  becomes real. Cost: a brief render of bundled data before hydration.
- **(b) Convert to async hooks (cleaner).** `useMerchants()`, `useCategories()`,
  `useMerchant(id)` with loading/error states. Correct long-term, but touches every
  consumer and needs `D-11` (error boundary) first.

Recommend **(a)** for v2, then migrate to **(b)** incrementally.

**Acceptance criteria.** `NexGDiscoveryView` renders merchants from
`/api/merchants`; the merchant count on screen matches `/api/health`; deleting
`restaurantsData.ts` does not break the restaurants page.

### 5.2 🔴 Reconcile the catalogue counts (D-06)

Three sources disagree on items:

| Source | Merchants | Items |
| --- | --- | --- |
| `seededCatalog.json` `.summary` | 640 | 14,895 |
| `seededCatalog.json` `.merchants[]` | 120 | 3,300 |
| `src/db/seed_excel.sql` (Postgres) | 640 | **1,500** |

`NEXG_Nairobi_Merchant_Seed_Catalog.xlsx` is the presumed origin. `seed_excel.sql`
is **generated** by `scripts/parse_excel_to_db.py` — do not hand-edit it; fix the
parser and regenerate. Decide which figure is authoritative and make the seed, the
JSON and the docs all agree. Until then, "how many items do we have?" has no answer.

### 5.3 🟠 Fix the category slug taxonomy (blocks filtering)

The database uses slugs like `restaurants-food`, `groceries-essentials`,
`wellness`, `travel-tours`, `adults-only`. The frontend's discovery tabs filter on a
different vocabulary entirely — `restaurants`, `fine_dining`, `desserts_bakery`,
`fast_food`, `coffee_tea`, `groceries`, `health_nutrition`, `electronics`,
`florists`, `alcohol_beverages`. See `NexGDiscoveryView.tsx` lines ~73–79.

**Effect.** Selecting a tab filters to an empty list. Establish one canonical slug
set and use it in the schema, the seed, `categoryCatalog21.ts` and the tabs.

### 5.4 🟠 Subcategory count is wrong in the UI (D-18)

Three surfaces claim **134** subcategories; the database and seed contain **128**.
Fix the copy or reconcile the data. The explorer also renders subcategory chips as
inert badges with no counts and no links, unlike the category rows which have
"View listings".

### 5.5 🟡 Remaining defects

- **D-11** — add a React error boundary; one render throw currently blanks the page.
- **D-13** — delete the dead `components/ui/` duplicate of `src/components/ui/`.
- **D-14** — design polish pass. Skills are installed: `design-taste-frontend`,
  `high-end-visual-design`, `better-interface`, `emil-design-eng`.
- **D-15** — header nav needs ~1331px but the `xl:` breakpoint is 1280px, so nav
  items crowd at exactly the width where they first appear.
- **D-16** — hero search loses focus; it is a click-to-open trigger in disguise.
  Consider making it a real inline search over `/api/search`.
- **D-19** — hero search loses focus; it is a click-to-open trigger in disguise.
  Consider making it a real inline search over `/api/search`.
- `merchant_reviews` table is empty; `v_merchant_storefront` view is unused.

### Resolved during v1: mobile screenshot capture

The mobile captures initially failed for 6 surfaces. Probing the live page showed
this was a **harness bug, not a product bug**: `getByText(exact)` cannot match nav
buttons that contain nested badge spans (`"Fine DiningOrder"`), and
`locator('button').filter({ hasText }).first()` resolves to the **zero-size hidden
desktop nav**, so waiting for visibility times out even though the mobile item is
rendered. `getByRole('button', { name: /^Label/ })` filters out non-visible
candidates and fixes it. All 20 surfaces now capture cleanly.

---

## 6. Testing infrastructure

| Script | What it does |
| --- | --- |
| `scripts/api-contract-test.mjs` | 29 HTTP assertions; the D-03 regression guard |
| `scripts/screenshots.mjs` | Playwright capture, desktop + mobile, with a manifest of console/page errors |
| `scripts/setup-postgres.ps1` | idempotent Postgres provisioning + seeding |
| `tests/*.test.ts` | 11 vitest unit tests (pre-existing, now passing) |

**Screenshot usage:** `node scripts/screenshots.mjs [baseUrl] [outDir] [idFilter]`.
The 4th argument filters surfaces, e.g. `node scripts/screenshots.mjs http://127.0.0.1:3000 logs/screenshots 03`.

Current result: **20/20 surfaces captured** with zero page errors and zero console
errors. `logs/screenshots/manifest.json` is the machine-readable record.

---

## 7. Decisions made in v1, and why

| Decision | Rationale |
| --- | --- |
| Postgres is source of truth, JSON is fallback | A new contributor is never blocked by infrastructure, but real data wins when present. The active source is always reported. |
| Separate container **and** port (5433) | Another `nexg` project already owns 5432 on this machine. Isolation prevents damage. |
| Credentials copied from `ci.yml` | Local behaviour then matches CI exactly. |
| `node server/index.ts` instead of `tsx` | Node 24 strips types natively; removes a runtime build dependency and was required to start at all. |
| Mapping lives in `repository.ts` | The DB schema and the React components both stay ignorant of each other's naming. |
| `attachItems()` batches by page | Avoids N+1 round trips — the difference between 2 and 201 queries per page. |
| Contract test before feature work | The count contradiction was invisible for the entire project's life; it needs a permanent guard. |
| Baseline commit before any change | There was no rollback path. Now there is. |

---

## 8. Suggested first 30 minutes of v2

1. `npm run db:up && npm run server && npm run dev` — confirm the stack runs.
2. `npm run test:api` — confirm 29/29 still passes.
3. Open `src/data/catalogData.ts` and `src/data/apiClient.ts` (to be created); write
   the fetch layer per §5.1(a).
4. Point `SEEDED_MERCHANTS` at the store and confirm the discovery grid shows
   merchants that exist in `/api/merchants` but not in `seededCatalog.json`
   (e.g. `M0312` "Amani Catering Atelier") — that proves the wiring.
