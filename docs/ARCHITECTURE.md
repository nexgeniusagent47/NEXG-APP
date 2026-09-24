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
Browser → GET /api/merchants?limit=20&sort=price_low
   → Vite proxy (dev) → Express :3001
   → repository.listMerchants()
       → SELECT count(*) ... (total)
       → SELECT ... ORDER BY <whitelisted clause> LIMIT/OFFSET ... (page)
       → attachSubcategories()  ← ONE extra query for the whole page
       → attachItems()          ← ONE extra query for the whole page
   → mapMerchant() shapes rows into the frontend's NexGMerchant contract
   → JSON
```

### The N+1 decision

Both hydrations fetch data for **all** merchants on a page in a single query:
`attachItems()` uses `row_number() OVER (PARTITION BY merchant_id)`, and
`attachSubcategories()` uses `DISTINCT ON (merchant_id)`. The naive alternative —
one query per merchant — would issue 401 round trips for a 200-merchant page.

`attachSubcategories()` is not a nicety. Without it the list response carried no
subcategory, so cards printed the category name and **the client could not resolve
any catalogue-declared requirement**, because `orderRequirements` looks fields up by
subcategory. Its absence was one of three stacked defects behind a missing
compliance section (see `logs/2026-09-21-critique-remediation.log`).

### Sorting happens in SQL

`sort` selects a pre-written `ORDER BY` clause from a whitelist in
`server/repository.ts`. It is never interpolated from the query string. Sorting the
loaded page client-side was the previous behaviour and it silently lied: the first
page sorted, then pagination appended in server order and the union was re-sorted
beneath a header showing the server total.

### The contract boundary

`NexGMerchant` (in `src/types/nexg.ts`) is the interface between backend and frontend.
The database uses different names (`primary_category_id`, `hero_image_url`). All
translation happens in `server/repository.ts` so that neither the SQL schema nor the
React components have to know about each other's naming. **If you change the API
shape, change `mapMerchant`/`mapItem` and the type — nothing else.**

## The commerce-arc engine

The product's actual idea is that a marketplace vertical is not just a tag: each one
transacts differently. That lives in two modules.

```
merchant.workflow (seeded string)
        │
        ▼
  workflowEngine.resolveIntent()          ── five arcs, ordered detectors,
        │                                    then a per-category default
        ▼
   CommerceArc  (browse_buy │ book_slot │ request_service │
                 compliance_appointment │ get_quote)
        │
        ├──► cardAction      what the merchant card offers
        ├──► primaryAction   the verb that OPENS the flow (navigation)
        ├──► commitAction    the verb on the modal's submit button
        └──► needsSchedule
        │
        ▼
  orderRequirements.buildRequirements()
        │
        ├── arc requirements        structural: date, pickup point, origin/destination
        └── catalogue requirements  the subcategory's declared `fields`
                                    resolved through FIELD_DEFS
        │
        ▼
  sections: quantity │ options │ schedule │ fulfilment │ compliance │ notes
```

`primaryAction` and `commitAction` are separate on purpose. The modal used to render
the navigation verb on its submit button, so a quantity-and-notes dialog finished
with "View full menu" — a label describing a navigation the user had already
performed, on a control that adds a line to the cart.

### Two invariants worth protecting

1. **Every `RequirementKind` must appear in `SECTION_ORDER`.** Sections are built by
   filtering over that list, so a missing kind is dropped from the UI while
   remaining in the flat `all` array — and validation then rejects a submission over
   a field the user was never shown. A test asserts every validated requirement is
   reachable in a rendered section.
2. **`findSubcategory` must not use `??` for the id/name fallback.** `??` falls
   through only on null/undefined, and the API returns an empty string for a missing
   id, so an empty id short-circuits the fallback and every lookup misses. It must
   also strip the API's category prefix (`adults-only_vapes` → `vapes`), removing the
   **whole** prefix rather than splitting at the first hyphen.

## Catalogue generation

`src/db/seed_excel.sql` is generated. Do not hand-edit it. The generated
`src/data/seededCatalog.json` bundle was removed; it had duplicated catalogue data
in the browser and silently masked database failures.

```
NEXG_Nairobi_Merchant_Seed_Catalog.xlsx
        │
        ▼
scripts/regenerate_catalog_seed.py
        │   emits merchant_subcategories links, spreads prices inside each
        │   declared band, assigns per-vertical imagery, composes descriptions
        │   from the item's own facts
        ▼
seed_excel.sql  ──►  npm run db:up  ──►  Postgres
```

`scripts/parse_excel_to_db.py` is the original generator and is **superseded**. It
read the Excel correctly and then discarded most of it; its specific failures are
documented in `CHANGELOG.md` under 2.1.0.

## Data source strategy

```
DATABASE_URL set and PostgreSQL responds?
  ├─ yes → serve catalogue from PostgreSQL
  └─ no  → health and catalogue APIs return HTTP 503; container is unhealthy
```

The production image does not contain a JSON catalogue. Discovery, category, and
search merchant/item results are fetched from the API. `/api/health` performs a
database count query and returns HTTP 503 when that query fails; catalogue routes
also return 503 instead of showing stale sample data.

## Frontend structure

| Area | Path | Responsibility |
| --- | --- | --- |
| Shell | `src/App.tsx` | page router, modal orchestration, providers |
| Discovery | `src/components/discovery/` | browse surface, workflow-aware card, preview sheet |
| Merchant | `src/components/merchant/` | the one merchant page and the one item modal |
| Forms | `src/components/forms/` | `DynamicField` — one renderer for all seven control types |
| Marketplace UI | `src/components/nexg/` | legacy design-system components |
| Legacy pages | `src/components/*.tsx` | vertical landing pages — **still on static data** |
| State | `src/context/` | cart, theme, language |
| Static data | `src/data/` | taxonomy + the generated JSON bundle |
| Hooks | `src/hooks/` | `useMerchantSearch`, `useModalBehavior` |

### Known architectural debt

**Nineteen verticals still render bundled static data.** `Restaurants.tsx`,
`SpaWellness`, `TransportPage`, `GroceriesPage` and `NexGDiscoveryView` read
`restaurantsData.ts`, `spaData.ts`, `transportData.ts` and `cellarData.ts` rather
than the API, so the same product shows different data depending on the route taken.
The discovery flow, the merchant page and the item modal are migrated; the rest are
the top backlog item in `docs/HANDOFF.md`.

There are also duplicate component directories — `components/ui/` and
`src/components/ui/` — where the former appears to be dead code.

## Security posture

This is a **local development baseline**. It has no authentication and must not be
exposed publicly. Notable properties:

- All SQL uses **parameterised queries**; no string concatenation of user input.
  The one value concatenated into SQL is the `sort` key, which selects from a
  fixed whitelist rather than being interpolated from the query string.
- Pagination input is clamped (`limit` ≤ 200, `offset` ≥ 0) rather than trusted.
- `CORS: Access-Control-Allow-Origin: *` — safe locally, must be restricted in
  production.
- The database password is a **local-only placeholder** committed to `ci.yml` by
  design; production must inject a real secret.

## Out of scope

Auth, payments, real courier dispatch, live GPS, merchant self-service portal, and
completed i18n. Discovery pagination exists; the legacy vertical pages still render
their whole catalogue at once.
