<div align="center">

# NEXG Concierge

**On-demand luxury concierge for Nairobi — Airbnb-grade discovery meets Glovo-grade fulfilment.**

Version **v1.0.0**

</div>

---

## What this is

A marketplace where 21 verticals — fine dining, spa & wellness, cellar, VIP mobility,
safaris, groceries, logistics and more — share one discovery and fulfilment engine,
while each subcategory declares its own commerce model (instant purchase, booking,
quote, rental, ticket, appointment).

## Status — read this first

v1 is a **working baseline**, not a finished product. Honest state:

| Capability | State |
| --- | --- |
| PostgreSQL database (21 categories / 128 subcategories / 640 merchants / 1,500 items) | ✅ working |
| REST API over the database, with JSON cold-start fallback | ✅ working |
| API contract tests | ✅ 29/29 passing |
| TypeScript typecheck | ✅ clean |
| Unit tests | ✅ 11/11 passing |
| Frontend runs and renders | ✅ working |
| Category explorer opens from header + hero search | ✅ fixed in v1 |
| **Frontend reads catalogue from the API** | ⚠️ **NOT YET — see below** |
| Auth, payments, real dispatch | ❌ out of scope for v1 |

### The one thing to know

The backend is real and serves the full 640-merchant catalogue from PostgreSQL.
**The React frontend does not consume it yet.** The UI still renders bundled static
modules (`src/data/restaurantsData.ts`, `catalogData.ts`'s 120-merchant subset),
so you are currently looking at hardcoded data while a complete API sits next to it.

Wiring the frontend to the API is the **first task of v2**. It is thoroughly
documented in [`docs/HANDOFF.md`](docs/HANDOFF.md).

---

## Quick start

Prerequisites: **Node 22+**, **Docker Desktop running**.

```bash
# 1. Install dependencies
npm install

# 2. Provision PostgreSQL (isolated container on port 5433)
npm run db:up

# 3. Start the API  (terminal 1)  -> http://localhost:3001
npm run server

# 4. Start the frontend (terminal 2) -> http://localhost:3000
npm run dev
```

Open <http://localhost:3000>.

The API works **without** step 2 — it falls back to the bundled JSON cache and
`/api/health` reports `source: seeded_json_fallback`. Postgres is preferred
whenever `DATABASE_URL` is reachable.

### Verify it works

```bash
npm run lint      # TypeScript
npm test          # unit tests
npm run test:api  # 29 API contract assertions (needs `npm run server` running)
npm run shots     # Playwright screenshots -> logs/screenshots/
```

---

## Architecture

```
React 19 + Vite 6 (SPA)  :3000
        │  fetch /api/* via Vite proxy (same-origin, no CORS)
        ▼
Express API (server/)    :3001
   ├── server/index.ts       routes, pagination clamping, static SPA serving
   ├── server/repository.ts  SQL queries + row → API mapping
   └── server/db.ts          pg Pool, graceful fallback, idle-error handling
        │  pg
        ▼
PostgreSQL 15            :5433   container `nexg-concierge-pg`
```

Full detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
API reference: [`docs/API.md`](docs/API.md).
Plan and defect backlog: [`docs/PLAN-v1.md`](docs/PLAN-v1.md).

---

## Important: two unrelated Postgres stacks on this machine

| Stack | Container | Port | Belongs to |
| --- | --- | --- | --- |
| **This project** | `nexg-concierge-pg` | **5433** | `nexg-concierge` |
| Unrelated | `nexg-postgres-1`, `nexg-api-1`, `nexg-kernel-1` | 5432 | the **NEXG POS** Go platform at `C:\Users\limta\Desktop\NEXG POS` |

`nexg-concierge` deliberately uses a **separate container name and port**. Do not
point this project at port 5432, and do not modify the `NEXG POS` containers.

## Database credentials

Local development (matches `.github/workflows/ci.yml` so local == CI):

```
postgresql://nexg_user:nexg_password@127.0.0.1:5433/nexg_db
```

`npm run db:up` writes this to `.env`. `.env` is gitignored; `.env.example` is the
template.

---

## Project layout

```
server/          Express API (db, repository, routes)
src/             React SPA
  components/      feature components + nexg/ design system
  data/            static catalogue modules  ← v2 will replace these with API calls
  db/              schema.sql + generated seed_excel.sql
  context/         cart, theme, language providers
scripts/         provisioning, seeding, contract tests, screenshots
tests/           vitest unit suites
docs/            plan, architecture, API reference, handoff
logs/            run logs + screenshots (see logs/README.md)
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server on :3000 |
| `npm run server` | Express API on :3001 |
| `npm run build` | Production SPA build |
| `npm run db:up` | Provision/seed the Postgres container |
| `npm run lint` | `tsc --noEmit` |
| `npm test` | Vitest unit suites |
| `npm run test:api` | API contract assertions |
| `npm run shots` | Playwright surface screenshots |
| `npm run db:generate-sql` | Regenerate seed SQL from the Excel catalogue |

## v1 changelog

See [`CHANGELOG.md`](CHANGELOG.md).
