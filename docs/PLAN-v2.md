# NEXG Concierge — v2 Plan

**Status:** Active
**Version:** v2.0.0
**Date:** 2026-09-21
**Follows:** `docs/PLAN-v1.md`, `docs/HANDOFF.md`

---

## 1. The v2 brief, in the user's words

1. **Clicking the search bar leads to a merchant discovery screen** — Wolt-like — with
   *"their respective dynamic workflows for the intended use."*
2. **Clicking a merchant must never take the user straight to the merchant screen.**
3. **Remove everything from Explore to Experiences in the docked state.**
4. Use the installed skills; follow the strict v1 rules (plan → document → build →
   test → handoff → docs → logs).

### 1.1 Design Read (required by `design-taste-frontend` §0.B)

> Reading this as: **a consumer marketplace discovery surface for Nairobi residents and
> hotel guests**, with a **premium-consumer / Wolt-grade utility** language, leaning
> toward **Tailwind v4 utilities + Motion + an asymmetric editorial split**, where the
> dark nocturnal brand palette is already established and must be preserved.

### 1.2 Dials (from `design-taste-frontend` §1.A)

This is a **redesign-preserve** on an existing, brand-locked surface.

| Dial | Value | Reasoning |
| --- | --- | --- |
| `DESIGN_VARIANCE` | **7** | Premium consumer baseline is 7–8; the existing product already uses asymmetry, so preserve. |
| `MOTION_INTENSITY` | **6** | Frequent-use surface (discovery is opened many times per session). Motion must aid orientation, not perform. |
| `VISUAL_DENSITY` | **5** | A merchant *browse* surface needs more density than a landing page — but not cockpit density. |

> **Deliberate deviation from `high-end-visual-design` §4.C**, which asks for `py-24`–`py-40`
> macro-whitespace. That is a *marketing page* rule. This is a browse/utility surface
> opened repeatedly; that much whitespace would push results below the fold and cost
> the user scroll on every visit. §1.A of the taste skill governs: *"Every rule is
> contextual. None of it fires automatically."* Section padding is `py-8`–`py-12`.

---

## 2. Requirements, decomposed

### R1 — Search bar opens a merchant discovery screen

**Current behaviour.** Clicking the hero search input calls `onOpenCategories`, which
opens `CategoryExplorerModal` — a taxonomy browser that lists 21 categories and their
subcategories. It is a *category picker*, not a *merchant discovery surface*: no
merchants, no search results, no sorting, no filters.

**v2 behaviour.** Clicking the search bar enters a **Discovery** state that is a real
browse surface:

- a focused search field with live query → `GET /api/search`
- a horizontal **vertical rail** (all 21 categories) with counts
- a **subcategory chip** row for the selected vertical
- a **sort** control (recommended / rating / delivery time / price)
- a responsive **merchant grid** fed by `GET /api/merchants` with real pagination
- loading skeletons, empty state, and error state

### R2 — Dynamic workflows per vertical for the intended use

Every merchant carries a `workflow` string in `merchants.metadata`. Extracting the
real data gives **exactly six workflow arcs** across all 640 merchants and 21
verticals:

| Arc | Verticals | Shape |
| --- | --- | --- |
| **Browse & buy** | adults-only, alcohol-beverages, beauty, fashion-apparel, flowers-gifts, groceries-essentials, health, laundry-cleaning, marketplace, pharmacy, restaurants-food, tech-electronics, vehicle-rentals, vehicle-services, wellness, adults-only | Browse → item → variant/quantity → delivery or pickup → eligibility checks → cart → payment → dispatch → delivery |
| **Book a slot** | airport-transfers, experiences, travel-tours | Select offering → date/time → party/vehicle details → availability → price → payment/deposit → confirmation |
| **Request a service** | concierge-services | Select service → address → scope/details → schedule → quote or fixed price → confirmation → assigned provider → completion |
| **Compliance & appointment** | financial-services | Service selection → eligibility/compliance → customer details → quote/fee disclosure → appointment → confirmation |
| **Get a quote** | logistics-shipping | Shipment quote → route/cargo → weight/volume → price → booking → dispatch |

**Design consequence.** A merchant card's primary action, and the merchant preview
sheet's action set, must be **derived from the merchant's arc**, not hardcoded.
A restaurant says "Add to cart"; a chauffeur company says "Check availability";
a freight forwarder says "Request quote"; a bank says "Book appointment". Showing
"Add to cart" on a bank is the bug this requirement exists to prevent.

### R3 — Merchant click must not go to the merchant screen

**Current behaviour.** `NexGDiscoveryView` calls `onSelectMerchant(m)` → `App.tsx`
`setSelectedMerchant(m)` → renders the full `MerchantPage`, replacing the feed.

**v2 behaviour.** Clicking a merchant card opens a **`MerchantPreviewSheet`** — a
bottom sheet (desktop: right-hand sheet) showing hero, rating, delivery, areas,
badges, a 3–4 item preview, and **workflow-derived actions**:

| Arc | Sheet primary action |
| --- | --- |
| Browse & buy | `View full menu` → merchant screen |
| Book a slot | `Check availability` → booking flow |
| Request a service | `Request a quote` → request flow |
| Compliance | `Book appointment` → appointment flow |
| Get a quote | `Get shipping quote` → quote flow |

Navigation to `MerchantPage` happens **only** from an explicit "view full" action
inside the sheet. The card click itself never navigates.

### R4 — Remove nav from Explore through Experiences in the docked state

The desktop nav currently renders: Explore, Fine Dining, Spa & Wellness (District),
VIP Mobility, Fine Cellar, Experiences, Partners. Remove the six between Explore and
Partners, leaving **Explore + Partners**. This also resolves v1 defect **D-15** (nav
needed ~1331px inside a 1280px breakpoint) as a side effect.

Those verticals stay reachable through Discovery (R1) and the footer, so nothing
becomes unreachable.

---

## 3. Architecture for v2

```
Header (docked)          Explore · Partners + search trigger + locale/theme/cart
   │ click search or Explore
   ▼
DiscoveryScreen (new)    ── full-page browse surface
   ├── SearchField            live → GET /api/search
   ├── VerticalRail           21 categories (GET /api/categories)
   ├── SubcategoryChips       from selected category
   ├── SortControl            client-side ordering
   └── MerchantGrid           GET /api/merchants?category&search&limit&offset
          │ click card
          ▼
   MerchantPreviewSheet (new)  workflow-derived actions, NO auto-navigation
          │ explicit "view full"
          ▼
   MerchantPage (existing)
```

### New modules

| File | Responsibility |
| --- | --- |
| `src/data/workflowEngine.ts` | Maps a merchant's `workflow` string → arc → steps → labels. The single source of truth for R2. |
| `src/lib/apiClient.ts` | Typed `fetch` wrappers for `/api/*`, abortable, with error surfacing. |
| `src/hooks/useMerchantSearch.ts` | Debounced search + pagination state. |
| `src/components/discovery/DiscoveryScreen.tsx` | The browse surface (R1). |
| `src/components/discovery/MerchantGrid.tsx` | Card grid, skeletons, empty + error states. |
| `src/components/discovery/MerchantPreviewSheet.tsx` | Preview sheet with workflow actions (R3). |
| `src/components/discovery/VerticalRail.tsx` | Category rail with counts. |

### Reused

`src/types/nexg.ts` (`NexGMerchant`), `cn()` from `src/lib/utils.ts`,
`CartContext`, `ThemeContext`, `Motion` (already a dependency).

---

## 4. Defects this closes

| ID | Defect (from v1 handoff) | How v2 closes it |
| --- | --- | --- |
| **D-04** | Frontend never consumes the API | DiscoveryScreen reads `/api/categories`, `/api/merchants`, `/api/search` |
| **D-10** | Category explorer unreachable | Superseded: search now opens Discovery, not the taxonomy modal |
| **D-15** | Nav overflows its breakpoint | Six items removed, leaving Explore + Partners |
| **D-16** | Hero search is a fake search | Becomes a real query surface |
| **D-17** | Header Explore was a no-op | Explore opens Discovery |
| **D-18** | UI claims 134 subcategories | Discovery shows **live counts** from the API, so the number can no longer drift |

Still open after v2 (documented, not silently dropped): **D-06** (Excel import is
lossy: 14,895 vs 3,300 vs 1,500 items), **D-11** (no error boundary), **D-13**
(duplicate `components/ui/`), **D-14** (full design pass on the legacy vertical pages).

---

## 5. Build order (v1 rules)

| # | Step | Gate |
| --- | --- | --- |
| 1 | Plan + document (this file) | committed before code |
| 2 | `workflowEngine.ts` + unit tests | tests pass |
| 3 | `apiClient.ts` + `useMerchantSearch` | typecheck |
| 4 | Header: remove nav items (R4) | screenshot diff |
| 5 | `DiscoveryScreen` + grid (R1) | renders real API data |
| 6 | `MerchantPreviewSheet` (R3) | click never navigates |
| 7 | Wire `App.tsx` | full flow walkable |
| 8 | Test: typecheck, vitest, API contract | all green |
| 9 | Playwright: capture the new flow | screenshots + manifest |
| 10 | Docs, logs, handoff | committed |
| 11 | Tag `v2.0.0` | tagged |

---

## 6. Testing strategy

- **Unit** — `workflowEngine` maps each of the six arcs correctly, falls back safely
  for an unknown workflow string, and never returns an empty action set.
- **Contract** — existing 29 assertions must still pass (no backend change planned).
- **Interaction (Playwright)** — the three new behaviours asserted, not just captured:
  1. clicking the search bar reveals a discovery surface with merchant cards;
  2. clicking a merchant card opens a sheet **and the URL/route does not become the
     merchant page** (the headline regression test for R3);
  3. the docked header contains no nav items between Explore and Partners.
- **Visual** — desktop + mobile screenshots of discovery, sheet per workflow arc,
  and the trimmed header.

---

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Rewriting discovery strands existing flows (cart, item sheet) | Build DiscoveryScreen as a *new* surface; leave `NexGDiscoveryView` intact until v2 is verified, then retire it |
| 640 merchants × item hydration is heavy | API already batches items one query per page; page size 24 |
| Legacy `CATEGORIES_21` slugs don't match DB slugs (v1 §5.3) | Discovery uses **API slugs only**, never `CATEGORIES_21` |
| Brand palette drift | Reuse existing tokens; no new accent colour |

---

## 8. Out of scope for v2

Completing the booking/quote/request flows end-to-end (sheets route into existing
modals where they exist, and clearly signal where they do not), the lossy Excel
re-import (D-06), auth, payments, and the legacy vertical pages' design pass.
