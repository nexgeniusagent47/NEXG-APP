# Handoff — NEXG Concierge v2.1.0

**Date:** 2026-09-21
**Version:** v2.1.0 (tags: `v1.0.0`, `v2.0.0`, `v2.1.0`)
**Workspace:** `C:\Users\limta\Downloads\nexg-concierge`
**Supersedes:** `docs/HANDOFF-v1.md`

---

## 1. Read this first

**The frontend now reads the real API.** Discovery, the merchant page and the item
modal all render live Postgres data. That was the headline gap in v1 and it is
closed.

**What is still not done, stated plainly:**

1. **The catalogue is thin for 19 of 21 verticals.** Items exist on merchants in
   every vertical in the JSON bundle, but the SQL seed ships 6,000 of 14,895 items
   and the API serves those. Some merchants legitimately have no offerings and show
   an honest empty state.
2. **The other 19 verticals' landing pages still use static data.**
   `Restaurants.tsx`, `SpaWellness`, `TransportPage`, `GroceriesPage` and
   `NexGDiscoveryView` read bundled modules (`restaurantsData.ts`, `spaData.ts`,
   …). The discovery flow is real; those pages are not yet migrated.
3. **Typefaces are self-hosted and freely licensed** (changed from Inter-only). See
   §3.1. The commercial faces the client originally asked for are **not** in the repo
   and must not be added without a licence.

4. **The hero line is mid-decision.** Three reveal treatments sit in one component
   awaiting a pick (§7.0). The copy is settled; only the presentation is open. The
   working tree should not be committed until one is chosen.

---

## 3.1 Typefaces

Everything is served from `public/fonts/`. No subscription, no page-view tier, no
CDN dependency — which matters because this project deploys continuously.

| Role | Face | Licence | File |
| --- | --- | --- | --- |
| Headings | **TeX Gyre Adventor** | GUST Font License | `texgyreadventor-regular.otf` |
| Warm accent line | **Cooper Black** (indestructible type\*) | SIL OFL 1.1 | `Cooper-Black.ttf` |
| UI and body | **Inter** | SIL OFL 1.1 | Google Fonts `@import` |

Tokens are `--font-display` and `--font-warm` in `src/index.css`, consumed as the
`font-display` Tailwind utility. Inter stays for UI text: both new faces are display
faces, and Adventor is poor at small sizes.

**What was asked for, and why it is not here.** The request was ITC Avant Garde
Gothic plus Cooper BT. Neither has a free version, and the files supplied were
**Adobe-served** — their embedded name tables name Adobe as manufacturer and point at
`typekit.com/eulas/...`. Those records *are* the licence:

- Adobe's web font licence requires fonts be added *"by the embed code provided"*;
  *"Any other method of displaying the font on your website isn't allowed."*
- Adobe *"doesn't offer the ability to host fonts locally."*
- Client sites must load Adobe Fonts through the **client's own** subscription.

Stripping the embedded metadata was requested and declined. It would remove the
record of origin without granting any right, and would leave a deployed `dist/`
carrying unlicensed commercial font software.

**Two licensed routes remain**, if the exact faces are wanted:

1. **Adobe Fonts embed code** — the client's Creative Cloud subscription covers both
   faces; swap the `@font-face` for Adobe's `<link>`. Note it will not render on
   `localhost` until the domain is added to the web project, so keep the current
   stack as the fallback.
2. **A Monotype webfont licence** — permits self-hosting, annual and priced by monthly
   page views. **Check the SaaS clause first**: the Cooper BT WebFont EULA excludes
   *"Web Based Customer Product (e.g., a web server application, SaaS or other online
   product)"*. A marketing site is covered; a logged-in product UI may not be. Get it
   in writing before paying.

One correction worth keeping: **Cooper BT is not the same as Cooper Black.** Cooper BT
is Bitstream's commercial cut (now Monotype); Adobe Fonts' "Cooper Black" is Adobe
Originals' own digitisation; the file shipped here is indestructible type\*'s OFL
revival. Three different cuts with different metrics — expect layout to shift if the
face is ever swapped.

---

## 2. Run it

Prerequisites: **Node 22+**, **Docker Desktop running**.

```bash
npm install
npm run db:up      # provisions Postgres 15 on port 5433
npm run server     # API  :3001   (terminal 1)
npm run dev        # SPA  :3000   (terminal 2)
```

Open <http://localhost:3000> and click the search bar.

### Verify the state yourself

```bash
npm run lint              # expect: clean
npm test                  # expect: 34/34
npm run test:api          # expect: 29/29   (server must be running)
npm run test:flow         # expect: 18/18
npm run test:consistency  # expect: 21/21
```

Total: **102 assertions**. `npm run test:api` is the fastest confidence check —
if `health.totalMerchants` and `/api/merchants?limit=1`'s `total` ever diverge
again, it fails.

---

## 3. What is actually built

| Surface | State |
| --- | --- |
| PostgreSQL 15 (`nexg-concierge-pg`, port 5433) | 21 categories · 128 subcategories · 640 merchants · 6,000 items · 640 merchant↔subcategory links |
| REST API with JSON cold-start fallback | `/api/health`, `/api/categories`, `/api/merchants` (filter + sort), `/api/merchants/:id`, `/api/search`, `/api/areas` |
| Discovery screen | live search, 21-vertical rail, subcategory chips, sort, pagination, skeletons, empty and error states |
| Commerce-arc engine | five arcs derived from each merchant's seeded `workflow` string |
| Merchant page | one template for all 21 verticals |
| Item modal | one modal, requirements derived from arc + the catalogue's own declared fields |
| Cart | add from the modal, persisted to `localStorage` |
| Hero motivation pods | five motivations (Craving/Reset/Arrive/Supply/Fix) drawn from the real catalogue, **three variants awaiting selection** — uncommitted, see §7.0 |

### The five commerce arcs

| Arc | Example verticals | Modal asks for | Commit button |
| --- | --- | --- | --- |
| Browse & buy | restaurants, groceries, pharmacy | quantity, options, delivery/pickup | Add to order |
| Book a slot | airport transfers, experiences | date, time, party size, pickup point | Request booking |
| Request a service | concierge, laundry | service address, scope, window | Submit request |
| Compliance & appointment | financial services | eligibility, then digital/branch | Confirm appointment request |
| Get a quote | logistics & shipping | origin, destination, units | Request quote |

Naive `Add to cart` is deliberately refused everywhere: a bank cannot be asked to
"add to cart".

---

## 4. Verified state

| Gate | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `vitest run` | **34/34**, 5 suites |
| API contract | **29/29** |
| v2 flow (discovery) | **18/18** |
| v3 consistency (merchant page + item modal) | **21/21** |
| Impeccable detector | `[]` — zero findings on the review surface |

Last Impeccable **design critique: 20/40** (Acceptable), taken before the v2.1.0
remediation. All five issues it raised are fixed; the score has **not** been
re-measured since.

---

## 5. Environment facts a future session must know

1. **Two unrelated Postgres stacks exist on this machine.**
   - `nexg-concierge-pg` on **5433** — this project.
   - `nexg-postgres-1`, `nexg-api-1`, `nexg-kernel-1` on **5432** — the separate
     **NEXG POS Go platform** at `C:\Users\limta\Desktop\NEXG POS`.
   Never point this project at 5432 and never modify those containers.

2. **PowerShell is 5.1, not `pwsh`.** Use `powershell.exe`. Avoid
   `[Parameter(ValueFromRemainingArguments)]` wrappers around `docker`; 5.1 binds
   native flags like `--format` as parameter names. Pass argument arrays instead.
   A script-level `$ErrorActionPreference = 'Stop'` promotes a psql `NOTICE` on
   stderr to a terminating error — relax it around docker calls.

3. **Chromium needs full access to launch.** Playwright dies with `spawn EPERM`
   under a confined sandbox, and Chromium itself fails with
   `FATAL:mojo/platform_channel.cc Access is denied`. **Subagents cannot escalate**,
   so browser tests must run from the parent session.

4. **Vite's watcher kills the dev server on `*.tmpdir`.** Atomic writes create a
   hidden sibling directory (`src/…/.Foo.tsx.<pid>.<uuid>.tmpdir/`) and Vite dies
   with `EBUSY: resource busy or locked`. The ignore list in `vite.config.ts`
   covers it; do not remove those patterns.

5. **Tell your measuring instruments apart from the product.** Three harness bugs
   in one session each nearly caused a change to working code: a mid-load
   screenshot read as "the grid is all skeletons"; a copy-leak marker matched
   `crop` in an image URL; and a contrast check reported 144 failures because
   Tailwind v4 emits `oklch()`, which a numeric parse misreads. **A dramatic
   number is more likely to be a broken instrument than a broken product.**

   A fourth, from the hero-pods session: the live scaffold injects a per-event
   stylesheet that forces variant 1 visible with `!important`. Measuring any other
   variant without disabling that sheet first returns a `0x0` box and every
   derived number is zero. Disable it before you measure —
   `logs/critique/_verify-hero-pods.mjs` shows how.

6. **Never write files with `Set-Content` or `Out-File`; encoding will bite you.**
   PowerShell 5.1's `Out-File` defaults to **UTF-16LE** and `Set-Content` is not
   UTF-8. This has already cost real damage twice: a double-encoded em-dash in
   `src/index.css`, and 20 of 23 logs in `logs/` unreadable as text (16 UTF-16LE,
   3 mixed UTF-8-header + UTF-16LE-body, 1 cp1252). Use
   `[System.IO.File]::WriteAllText($p, $t, (New-Object System.Text.UTF8Encoding($false)))`,
   or write through Node, which is what fixed it. Two traps worth knowing if you
   ever have to repair such a file:

   - **Mixed-encoding files must be split on the file's original byte alignment**,
     not on a line boundary. Deriving the split from the first NUL byte lands one
     byte late and byte-swaps the whole tail into CJK-looking garbage.
   - **The double-encoding is cp1252, not Latin-1.** Bytes `0x80`-`0x9F` map to
     `U+0150`-`U+017F` (`ž`, `œ`), so a Latin-1 round-trip fails on exactly those.

---

## 6. The catalogue is generated, not authored

`src/db/seed_excel.sql` and `src/data/seededCatalog.json` are **generated**. Do not
hand-edit them.

```bash
python scripts/regenerate_catalog_seed.py   # Excel -> seed SQL + JSON bundle
npm run db:up                                # apply to Postgres
```

The original `scripts/parse_excel_to_db.py` remains but is superseded: it read the
Excel correctly and then discarded most of it (no `merchant_subcategories` rows,
one price per band, 16 images, image-generator prompts shipped as product copy).
`regenerate_catalog_seed.py` keeps the same output shape and fixes all four.

**The highest-value next task is raising `SQL_ITEM_LIMIT`** (currently 6,000) or
removing the cap, so all 14,895 items reach the database.

---

## 7. Backlog, in priority order

### 7.0 ✅ Decided — the hero subtitle is the rotating clip wipe

Recorded 2026-09-21. The user chose **variant 3**, so `Hero.tsx` renders
`HeroWipeSubtitle` directly: five motivations, revealed one at a time, gold
sweeping across the line on each change. The other two presentations are deleted,
along with their CSS and the `examples` field they used.

| Variant | Verdict |
| --- | --- |
| 1 — rotating pod with blur cross-fade + subcategory chips | not chosen; **the chip idea is kept in reserve** and may return |
| 2 — five-item visible rail | rejected: needed two lines at 672px, so it could not honour the one-line brief |
| **3 — rotating clip wipe** | **shipped** |

Measured on the shipped build: gold `#E5B65F` at **9.92:1** dark and `#8A6413` at
**5.05:1** light, one line at every width, rotation confirmed changing
(`Craving → Reset`), and the wipe animation live on every change rather than firing
once on mount. With `prefers-reduced-motion`, all five motivations render as static
text with `clip-path: none` — verified, not assumed.

Note for the record: the browser's accept event reported `variantId: 1`, because
variant 1 was the scaffold's visible default rather than the choice. The decision
above is the one that shipped; the discrepancy is recorded in
`.impeccable/live/accept-receipts/9c63bcac.json`.

### 7.1 🔴 Migrate the remaining 19 verticals off static data

`Restaurants.tsx`, `SpaWellness`, `TransportPage`, `GroceriesPage` and
`NexGDiscoveryView` still read bundled modules. Discovery, the merchant page and
the item modal are on the API; these are not, so the same product shows different
data depending on the route taken. **Acceptance:** deleting `restaurantsData.ts`
does not break the restaurants page.

### 7.2 🟠 Raise the item cap so the full catalogue is served

`SQL_ITEM_LIMIT = 6000` in `regenerate_catalog_seed.py`. The Excel holds ~14,895
items. Watch seed size and load time; consider chunked inserts.

### 7.3 🟠 Finish the contrast work honestly

The token changes are verified (3.60→6.86, 2.41→7.13, 3.21→5.37). The
**measurement harness is not**: it reads `fillStyle` before compositing, so
translucent backdrops report as opaque and a handful of false positives remain.
Build a compositing-correct checker before claiming AA compliance.

### 7.4 🟠 Real search scope

Search matches merchant name, category and subcategory only — not item names or
descriptions. Searching "JKIA" or "wagyu" returns nothing, and the empty state
blames the search term rather than the scope.

### 7.5 🟡 Smaller items

- `CategoryExplorerModal` is on disk, unreferenced. Wire it to a "browse all
  categories" control or delete it.
- Two measured hit-area failures on the merchant page: the Back button is 76.9×32
  and the offerings search input 236×20, both under 40px tall.
- `DiscoveryMerchantCard`'s `aria-label` **replaces** the accessible name, so
  rating, review count, area and price level are stripped from all 24 cards.
- The sort listbox declares `role="listbox"`/`role="option"` but implements no
  arrow-key handling.
- `merchant_reviews` is empty; `v_merchant_storefront` is unused.
- `.img2threejs-mascot/` belongs to an unrelated tool. Gitignored and untracked,
  but still on disk.

---

## 8. Known issues, and one correction to a previous claim

- **A v1-era claim in this project's own docs was wrong.** The `seededCatalog.json`
  `.summary` block reports 14,895 merchants-wide item counts while the bundle
  carries a slice; the API no longer reads `summary` for counts, so `/api/health`
  and `/api/merchants` agree. Do not reintroduce a count derived from `summary`.
- **`is_featured` drives the "Featured" badge** and is now populated (rating ≥ 4.85)
  rather than uniformly false.
- **38 merchants are seeded closed** so the "Closed" state renders for the first
  time. If the UI looks wrong for them, that is a genuine finding.

---

## 9. Suggested first 30 minutes of v3

1. `npm run db:up && npm run server && npm run dev` — confirm the stack runs.
2. `npm run test:api && npm run test:flow && npm run test:consistency` — confirm
   102 assertions still pass.
3. **Ask the user which hero variant won (§7.0), delete the other two, commit.** The
   tree is dirty until this happens, so do it before layering more work on top.
4. Raise `SQL_ITEM_LIMIT` in `scripts/regenerate_catalog_seed.py`, regenerate,
   re-apply, and confirm `/api/health` reports a much larger `totalItems`.
5. Pick one static vertical (`Restaurants.tsx` is the largest) and migrate it to
   `/api/merchants?category=restaurants-food`, using the discovery screen as the
   worked example.
