# Architecture

## Overview

NEXG Concierge is a **marketplace engine**, not a restaurant app. The domain problem
it solves: 21 unrelated verticals must share one discovery surface and one fulfilment
pipeline, while each vertical has a genuinely different transaction shape. A
restaurant order, a spa booking, a car rental and a freight quote cannot share one
checkout form — so they share an **engine** and declare their differences as data.

## Layers

```
┌──────────────────────────────────────────────────────────────┐
│ Presentation — React 19 SPA                                  │
│   Vite 6 dev server (:3000), Tailwind 4, Motion               │
│   Context providers: Cart, Theme, Language, NexGNavigation    │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP  /api/*  (Vite proxy → :3001)
┌───────────────────────────▼──────────────────────────────────┐
│ API — Express (server/)                                       │
│   index.ts       routes, validation, pagination, static SPA    │
│   repository.ts  SQL + row→contract mapping                    │
│   db.ts          pg Pool, fallback, idle-error handling        │
└───────────────────────────┬──────────────────────────────────┘
                            │ pg (TCP 5433)
┌───────────────────────────▼──────────────────────────────────┐
│ Data — PostgreSQL 15 (container nexg-concierge-pg)            │
│   6 tables + 1 view, pg_trgm GIN indexes for fuzzy search     │
└──────────────────────────────────────────────────────────────┘
```

## Data model

`src/db/schema.sql` defines six tables and a storefront view:

| Table | Rows | Notes |
| --- | --- | --- |
| `categories` | 21 | top-level verticals |
| `subcategories` | 128 | belongs to a category; carries workflow semantics |
| `merchants` | 640 | `metadata JSONB` holds `area`, `archetype`, `palette`, `workflow` |
| `merchant_subcategories` | — | many-to-many, `is_primary` marks the main one |
| `items` | 1,500 | purchasable units, `customization_options JSONB` |
| `merchant_reviews` | 0 | schema present, no seed data yet |
| `v_merchant_storefront` | view | denormalised read model for storefront queries |

### Why `metadata JSONB` instead of columns

`area`, `archetype`, `palette` and `workflow` are **presentation attributes that vary
by vertical**. A chauffeur company's "workflow" string and a florist's have the same
shape but no shared schema. Keeping them in JSONB avoids 21 sparse columns, and
`merchants.metadata->>'area'` is queryable and indexable when it needs to be.

The tradeoff is honest: these fields are **not type-checked by the database**. If
they acquire business meaning (rather than display meaning), promote them to columns.

### Search

`pg_trgm` GIN indexes back fuzzy matching on `merchants.name` and `items.name`:

```sql
CREATE INDEX idx_merchants_name_trgm ON merchants USING gin (name gin_trgm_ops);
CREATE INDEX idx_items_name_trgm     ON items     USING gin (name gin_trgm_ops);
```

The repository currently uses `ILIKE '%term%'` for simplicity. Trigram indexes can
accelerate `ILIKE` when the pattern is long enough; for short patterns Postgres will
still seq-scan. At 640 rows this is irrelevant; at 640k it will matter.

## Data flow

```
Browser → GET /api/merchants?limit=20
   → Vite proxy (dev) → Express :3001
   → repository.listMerchants()
       → SELECT count(*) ... (total)
       → SELECT ... LIMIT/OFFSET ... (page)
       → attachItems()  ← ONE extra query for the whole page, not per merchant
   → mapMerchant() shapes rows into the frontend's NexGMerchant contract
   → JSON
```

### The N+1 decision

`attachItems()` fetches items for **all** merchants on a page in a single query using
`row_number() OVER (PARTITION BY merchant_id)`. The naive alternative — one items
query per merchant — would issue 201 round trips for a 200-merchant page. This is the
single most important performance property of the list endpoint.

### The contract boundary

`NexGMerchant` (in `src/types/nexg.ts`) is the interface between backend and frontend.
The database uses different names (`primary_category_id`, `hero_image_url`). All
translation happens in `server/repository.ts` so that neither the SQL schema nor the
React components have to know about each other's naming. **If you change the API
shape, change `mapMerchant`/`mapItem` and the type — nothing else.**

## Data source strategy

```
DATABASE_URL set?
  ├─ no  → JSON fallback (src/data/seededCatalog.json)
  └─ yes → try pg Pool (5 attempts, backoff)
             ├─ connected    → Postgres  ← source of truth
             └─ unreachable  → JSON fallback + reason recorded
```

`/api/health` always reports which source is live, and the counts it returns are
derived from **the same collection the list endpoints serve**. This matters: the
original code reported the JSON `summary` block (640 merchants) while
`/api/merchants` served the `merchants` array (120), so the API silently looked 81%
empty while health looked healthy.

## Frontend structure

| Area | Path | Responsibility |
| --- | --- | --- |
| Shell | `src/App.tsx` | page router, modal orchestration, providers |
| Marketplace UI | `src/components/nexg/` | design system: cards, sheets, feed, search |
| Legacy pages | `src/components/*.tsx` | vertical landing pages |
| State | `src/context/` | cart, theme, language |
| Static data | `src/data/` | **catalogue modules — to be replaced in v2** |

### Known architectural debt

`src/data/` contains **five overlapping catalogue sources**:
`catalogData.ts` (JSON import), `restaurantsData.ts`, `spaData.ts`,
`transportData.ts`, `cellarData.ts`, plus `merchantCatalog.ts` (taxonomy).
Different pages read different ones. This is the root cause of inconsistent merchant
counts between screens, and it is why the API is not yet wired in.

Additionally there are duplicate component directories — `components/ui/` and
`src/components/ui/` — where the former appears to be dead code.

## Security posture

v1 is a **local development baseline**. It has no authentication and must not be
exposed publicly. Notable properties:

- All SQL uses **parameterised queries**; no string concatenation of user input.
- Pagination input is clamped (`limit` ≤ 200, `offset` ≥ 0) rather than trusted.
- `CORS: Access-Control-Allow-Origin: *` — safe locally, must be restricted in
  production.
- The database password is a **local-only placeholder** committed to `ci.yml` by
  design; production must inject a real secret.

## Out of scope for v1

Auth, payments, real courier dispatch, live GPS, merchant self-service portal,
pagination UX in the frontend, and i18n completion.
