# API Reference

Base URL (development): `http://localhost:3001`

In the browser, always call **`/api/*` on the same origin** (`:3000`). Vite proxies
those requests to the API, so there is no CORS preflight and no hardcoded host.

Auth: **none in v1.** Every endpoint is public. Do not expose this API publicly.

All responses are JSON. Errors use `{ "error": "message" }`.

---

## `GET /api/health`

Database readiness. A successful response includes counts queried from PostgreSQL;
an unavailable database returns HTTP `503` so the container and monitoring can detect it.

```json
{
  "status": "ok",
  "timestamp": "2026-09-21T12:08:28.266Z",
  "source": "postgres",
  "postgresConnected": true,
  "totalCategories": 21,
  "totalSubcategories": 128,
  "totalMerchants": 640,
  "totalItems": 1500
}
```

| Field | Meaning |
| --- | --- |
| `source` | Always `postgres`; there is no JSON catalogue fallback. |
| `postgresConnected` | A PostgreSQL query succeeded for this health request. |
| `status` | `ok` on success; `unavailable` in the HTTP 503 response. |

Unavailable response (no connection detail is disclosed):

```json
{
  "status": "unavailable",
  "source": "postgres",
  "postgresConnected": false
}
```

> **Contract:** `totalMerchants` **must** equal `total` from `GET /api/merchants`
> with no filters. A previous version reported 640 here while serving 120, which
> made the catalogue look empty. `scripts/api-contract-test.mjs` guards this.

---

## `GET /api/categories`

All 21 active categories with their subcategories nested.

```json
{
  "categories": [
    {
      "id": "restaurants-food",
      "name": "Restaurants & Food",
      "slug": "restaurants-food",
      "description": "...",
      "icon_name": "Utensils",
      "image_url": "https://...",
      "subcategories": [
        { "id": "restaurant", "name": "Restaurant", "slug": "restaurant", "image_url": "..." }
      ]
    }
  ]
}
```

---

## `GET /api/merchants`

Paginated merchant list. **Items and the primary subcategory are each hydrated in
one extra query for the whole page, not one per merchant.**

| Query param | Type | Default | Notes |
| --- | --- | --- | --- |
| `limit` | int | 50 | clamped to 1–200 |
| `offset` | int | 0 | clamped to ≥ 0 |
| `category` | string | — | matches `primary_category_id` **or** category `slug` |
| `subcategory` | string | — | matches subcategory `id` **or** `slug` |
| `area` | string | — | matches `merchants.metadata->>'area'` exactly |
| `search` | string | — | `ILIKE` over merchant name, category name, subcategory name |
| `sort` | enum | `recommended` | `recommended` · `rating` · `delivery` · `price_low` · `price_high` |

**`sort` is applied in SQL, behind a whitelist.** An unknown value falls back to
`recommended` rather than erroring, and the key is never interpolated from user
input — it selects a pre-written `ORDER BY` clause. Sorting client-side over the
loaded page was the previous behaviour and it silently lied: the first page sorted
correctly, then scrolling appended the next page in server order and re-sorted the
union, beneath a header showing the server total.

> Changing `sort` resets pagination to page one. If your client keeps its own
> offset, reset it when the sort key changes or you will fetch an arbitrary late
> page of the newly ordered set.

Each merchant also carries `subcategory` and `subcategoryId`, resolved from
`merchant_subcategories` (primary link wins). The client needs these to resolve the
catalogue-declared order requirements — liquor licence, age gate, session duration
— because `orderRequirements` looks fields up **by subcategory**.

```json
{
  "total": 640,
  "offset": 0,
  "limit": 5,
  "merchants": [
    {
      "id": "M0312",
      "name": "Amani Catering Atelier",
      "slug": "amani-catering-atelier",
      "category": "Restaurants & Food",
      "categoryId": "restaurants-food",
      "subcategory": "Catering",
      "subcategoryId": "catering",
      "nairobiArea": "CBD",
      "address": "CBD, Nairobi",
      "brandArchetype": "Modern Premium",
      "brandPalette": "obsidian, warm ivory, muted gold",
      "workflow": "Browse → item → ...",
      "rating": 4.98,
      "ratingCount": 210,
      "deliveryTimeMin": 28,
      "deliveryTimeMax": 43,
      "deliveryTime": "28-43 min",
      "deliveryFee": 0,
      "priceLevel": 2,
      "heroImage": "https://images.unsplash.com/...",
      "logoUrl": "https://api.dicebear.com/...",
      "badges": ["Featured"],
      "isOpen": true,
      "items": [ /* NexGCatalogItem[] */ ]
    }
  ]
}
```

`limit`/`offset` are clamped rather than rejected. Non-numeric values fall back to
defaults instead of erroring, so a malformed client request cannot 500 the endpoint.

---

## `GET /api/merchants/:id`

Merchant detail. `:id` accepts a **merchant id or slug**.

Returns the same merchant object as the list endpoint, with up to 60 items.

| Status | Condition |
| --- | --- |
| `200` | found |
| `404` | `{ "error": "Merchant not found" }` |

---

## `GET /api/search?q=<term>`

Heterogeneous search across merchants and items.

| Param | Type | Default | Notes |
| --- | --- | --- | --- |
| `q` | string | — | **required**; `400` if blank |
| `limit` | int | 20 | clamped to 1–50 |

```json
{
  "query": "spa",
  "merchants": [ /* ... */ ],
  "items": [ /* ... */ ]
}
```

---

## `GET /api/areas`

Distinct Nairobi neighbourhoods present in the catalogue, for filter UI.

```json
{
  "areas": ["CBD", "Eastleigh", "Gigiri", "Hurlingham", "Karen", "Kileleshwa",
            "Kilimani", "Lavington", "Loresho", "Muthaiga", "Nairobi West",
            "Ngong Road", "Parklands", "Riverside", "Runda", "South B",
            "South C", "Spring Valley", "Upper Hill", "Westlands"]
}
```

---

## Static assets

When `dist/` exists (after `npm run build`), the API also serves the built SPA and
falls back to `index.html` for any non-`/api/*` path. This makes
`npm run build && npm run server` a single deployable process.

## Status codes

| Code | Meaning |
| --- | --- |
| `200` | success |
| `204` | CORS preflight (`OPTIONS`) |
| `400` | missing required query param (`/api/search` without `q`) |
| `404` | unknown merchant, or unknown route |
| `500` | unhandled server error |
| `503` | PostgreSQL is unavailable or a catalogue query failed |

## Not implemented

`POST`, `PUT`, `PATCH` and `DELETE` do not exist. v1 is read-only, and CORS now
advertises only `GET, OPTIONS` — the previous build advertised write methods it did
not implement.
