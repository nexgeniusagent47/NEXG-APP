# Changelog

All notable changes to NEXG Concierge. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning is
[SemVer](https://semver.org/).

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
