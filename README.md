<div align="center">

# NEXG Concierge

**On-demand luxury concierge for Nairobi — Airbnb-grade discovery meets Glovo-grade fulfilment.**

Version **v2.1.0**

</div>

---

## What this is

A marketplace where 21 verticals — fine dining, spa & wellness, cellar, VIP mobility,
safaris, groceries, logistics and more — share one discovery and fulfilment engine,
while each subcategory declares its own commerce model (instant purchase, booking,
quote, rental, ticket, appointment).

## Status

| Capability | State |
| --- | --- |
| PostgreSQL database (21 categories / 128 subcategories / 640 merchants / 1,500 items) | ✅ working |
| REST API over the database, with JSON cold-start fallback | ✅ working |
| **Discovery surface** — search opens a merchant browse screen | ✅ v2 |
| **Dynamic workflows** — five commerce arcs derived per merchant | ✅ v2 |
| **Merchant preview** — card click never navigates straight to the page | ✅ v2 |
| **One merchant page** for all 21 verticals | ✅ v2 |
| **One item modal** that adapts to each vertical's order requirements | ✅ v2 |
| Add to cart from the item modal, persisted | ✅ v2 |
| Typecheck / unit / API / flow / consistency tests | ✅ 102 assertions |
| Legacy vertical landing pages (19 of them) | ⚠️ still on bundled static data |
| Auth, payments, real dispatch, live GPS | ❌ out of scope |

### Known gaps

**Catalogue depth.** The SQL seed ships **6,000 of the ~14,895 items** in the source
Excel (`SQL_ITEM_LIMIT` in `scripts/regenerate_catalog_seed.py`). Merchants beyond
that cap render an honest empty state. Raising the cap is the highest-value next
task.

**Legacy pages.** The discovery flow, merchant page and item modal read the API.
`Restaurants.tsx`, `SpaWellness`, `TransportPage`, `GroceriesPage` and
`NexGDiscoveryView` still read bundled static modules, so the same product shows
different data depending on the route taken.

---

## The discovery flow

```
landing ──click search bar──▶ Discovery ──click a merchant card──▶ Preview sheet
                                  │                                     │
                        live search, vertical rail,        workflow-specific action
                        subcategory chips, sorting,        + "View full profile"
                        pagination, skeletons                        │
                                                                     ▼
                                                      Merchant page (all verticals)
                                                                     │
                                                       click an offering
                                                                     ▼
                                                    Item modal (adapts to the arc)
                                                                     │
                                                                 Add to cart
```

Clicking a merchant card **never** navigates. The preview sheet answers "what is this
and what can I do here?" first; only the explicit *View full profile* action opens the
merchant page.

### Dynamic workflows

Every merchant carries a `workflow` string from the catalogue. `workflowEngine` maps it
onto one of five commerce arcs, and the arc decides the card's action, the sheet's
primary action, and what the item modal asks for:

| Arc | Example verticals | The modal asks for |
| --- | --- | --- |
| Browse & buy | restaurants, groceries, pharmacy | quantity, options, delivery or pickup |
| Book a slot | airport transfers, experiences | date, time, party size |
| Request a service | concierge, laundry | service address, scope, preferred window |
| Compliance & appointment | financial services | eligibility, then digital or branch |
| Get a quote | logistics & shipping | origin, destination, units |

Vertical-specific requirements come from the catalogue's own declarations
(`merchantCatalog.ts` `fields` + `FIELD_DEFS`), so an alcohol order collects a liquor
licence and an adults-only order collects an age-gate method — without either being
hardcoded in the modal.

---

## Quick start

Prerequisites: **Node 22+**, **Docker Desktop running**.

```bash
npm install
npm run db:up       # provisions Postgres 15 on port 5433
npm run server      # API on :3001   (terminal 1)
npm run dev         # SPA on :3000   (terminal 2)
```

Open <http://localhost:3000> and click the search bar.

### Verify it works

```bash
npm run lint             # TypeScript
npm test                 # 34 unit tests
npm run test:api         # 29 API contract assertions    (server must be running)
npm run test:flow        # 18 discovery-flow assertions
npm run test:consistency # 21 merchant-page + item-modal assertions
npm run shots            # Playwright screenshots -> logs/screenshots/
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
