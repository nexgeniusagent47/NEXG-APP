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
| Discovery screen | live search, 21-vertical rail, subcategory chips, sort, pagination, skeletons, empty and error states; **category rail docks under the header on mobile and tablet** |
| Commerce-arc engine | five arcs derived from each merchant's seeded `workflow` string |
| Merchant page | one template for all 21 verticals |
| Item modal | one modal, requirements derived from arc + the catalogue's own declared fields |
| Cart | add from the modal, persisted to `localStorage` |
| Merchant menu | sectioned, with a **docked category rail** that sticks under the header on scroll and tracks the active section |
| Host onboarding | 10-step property intake with a Leaflet map pin, lazy-loaded from `For Properties → Partner with NEXG` |
| Deep links | `?page=<name>` per route, `?merchant=<id-or-slug>` per merchant |
| Hero motivation pods | five moments drawn from the real catalogue; three reveal treatments await a pick (§7.0) |

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

   A fifth, from the docked category rail: **`window.scrollTo` reported
   `scrollY: 0` on a page with 10,218px of content**, because the search input held
   focus and programmatic scrolling fought focus scrolling. That read as "position:
   sticky is broken" when the rail was fine. Driving a real `mouse.wheel` showed it
   docking at exactly the header's height. **When a sticky element looks broken,
   check the scroll method before the CSS.**

   A sixth, and the most serious — it produced a false all-clear that was reported
   as a pass: **the Impeccable detector's URL path is broken in this environment.**
   It shells out to Puppeteer, which times out on every page, and it **still exits 0
   while printing `[]`**. A failed scan is therefore byte-identical to a clean one.

   This went unnoticed because the negative control (a deliberately bad file) *had*
   reported findings earlier in the session, so the sweep looked validated. It had
   since regressed. What caught it was the user's browser showing six findings that
   the sweep reported as zero.

   **Rules for anyone repeating this:**
   - `impeccable detect <file-or-dir>` still works. **Only URL scanning is broken.**
     Prefer source scans, and treat any URL scan as suspect.
   - **A clean result is not evidence unless a known-bad input fails in the same
     run.** Re-run the negative control every time, not once per session.
   - Most of these rules need computed style and rendered geometry, which no
     source scan can see. `logs/critique/_audit-rules.mjs` reimplements them against
     Playwright, which this project already controls. Use it.

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

7. **Server-side TypeScript is STRIP-ONLY under Node 24.** `node server/index.ts`
   erases types but does **not transform syntax**, so anything that emits runtime
   code throws `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` **at import time** and takes the
   whole server down — not a type error, a dead process. Forbidden in `server/`:

   - constructor parameter properties — `constructor(private x: T) {}`. **This
     actually happened** and crashed the boot; declare the field and assign it in
     the body instead.
   - `enum`, `namespace`, decorators, and `import x = require()`.

   Type annotations, `interface`, `type`, `as`, and `satisfies` are all fine — they
   are erasures. When adding server code, always run `node server/index.ts` and
   confirm it boots; `tsc --noEmit` will pass on code that cannot run.

8. **A font added to `public/` while the dev server is running is NOT served.**
   Vite builds its public-directory index at startup. A newly added file then returns
   the **SPA fallback**: status 200, `content-type: text/html`, ~1370 bytes — for a
   file that exists on disk with valid magic bytes. Because the response is a 200 this
   looks like success everywhere except the browser, where the font silently falls back
   and `document.fonts.load()` throws a NetworkError.

   **This has now bitten twice** (Cooper, then Quicksand). After adding or replacing
   anything under `public/`, restart the dev server. The diagnosis that always works:
   compare the response for the real path against one you know is missing —
   byte-identical responses mean the fallback is answering both.

   Corollary: when a font looks applied, **measure it**. A family name in computed
   style only means the stack was consulted. `document.fonts.load()` plus a width
   comparison against a fallback is what proves the glyphs are the intended face —
   Quicksand's headings measured "distinct from system sans" while actually rendering
   Adventor.

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

### 7.1 🔴 Assign real menu sections in the catalogue

The merchant page now renders a sectioned menu with a docked rail, but **the sections
are derived at read time by hashing the item id** (`src/data/menuSections.ts`), not
authored in the catalogue. It works and it looks right; it is still a workaround, and
the reason is worth understanding before touching it.

Grouping by an item's own subcategory cannot work here:

1. `server/repository.ts` stamps **the merchant's subcategory onto every item**
   (`mapItem(i, …, m.subcategory)`), discarding the item's own `subcategory_id`. That
   mapping is simply wrong and should be corrected regardless.
2. Even fixed, the source workbook has nothing to group by: sheet 3 of
   `NEXG_Nairobi_Merchant_Seed_Catalog.xlsx` holds **14,895 item rows across 640
   merchants, and not one merchant's items span more than a single subcategory.**

**The real fix is upstream**, in the Excel generator: give each item a genuine menu
section (Starters / Mains / Desserts; Red / White / Sparkling). Then the hash in
`menuSections.ts` can be deleted and the page can group on real data. Until then, a
customer sees plausible sections that do not correspond to anything in the catalogue.

### 7.2 🔴 Item names carry generator artefacts

Visible in the shipped catalogue and worth fixing with §7.1:

- Doubled modifiers: **"Signature Signature Facial"**, **"Premium Premium Intimacy
  Set"**, **"Premium Luxury Care Bundle Bundle"**. The generator appends a second
  prefix to names that already carry one.
- Every description repeats the merchant name and the vertical:
  *"Champagne in the Alcohol & Beverages vertical, dispatched by the NEXG concierge
  team."* — identical text on all 30 items of a merchant, so it distinguishes nothing.

### 7.3 🔴 Migrate the remaining 19 verticals off static data

`Restaurants.tsx`, `SpaWellness`, `TransportPage`, `GroceriesPage` and
`NexGDiscoveryView` still read bundled modules. Discovery, the merchant page and
the item modal are on the API; these are not, so the same product shows different
data depending on the route taken. **Acceptance:** deleting `restaurantsData.ts`
does not break the restaurants page.

### 7.4 🟠 Raise the item cap so the full catalogue is served

`SQL_ITEM_LIMIT = 6000` in `regenerate_catalog_seed.py`. The Excel holds ~14,895
items. Watch seed size and load time; consider chunked inserts.

### 7.5 🟠 Finish the contrast work honestly

The token changes are verified (3.60→6.86, 2.41→7.13, 3.21→5.37). The
**measurement harness is not**: it reads `fillStyle` before compositing, so
translucent backdrops report as opaque and a handful of false positives remain.
Build a compositing-correct checker before claiming AA compliance.

### 7.6 🟠 Real search scope

Search matches merchant name, category and subcategory only — not item names or
descriptions. Searching "JKIA" or "wagyu" returns nothing, and the empty state
blames the search term rather than the scope.

### 7.7 🟡 Smaller items

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


## 10. Hardening brief — status at the last session

Nine tracks were requested in one brief. This is the honest state of each, so a
future session starts from reality rather than from the commit titles.

| # | Track | State |
| --- | --- | --- |
| 1 | Image optimisation | **DONE.** 14.05 MB → an 80-variant WebP ladder; a phone fetches the 960 rung and a desktop the 1280, 628 KB vs 708 KB measured |
| 2 | Route-level code splitting | **DONE.** Initial route JS 585 KB → 76 KB gzipped; 27 lazy routes, `manualChunks` collapses the icon fragmentation |
| 3 | Category rail + sub-category rail + top filter | **PARTIAL.** Discovery already had all three (docked vertical rail, subcategory chips, sort bar) — see §11 |
| 4 | Infinite scroll + `image-auto-slider` | **PARTIAL.** Discovery already had IntersectionObserver infinite scroll. `InfiniteMarquee` is built and wired to the sponsored rail; **not browser-verified** |
| 5 | Deployment / versioning | **DONE.** Dockerfile, Compose, `scripts/release.mjs`, `docs/DEPLOYMENT.md`, `/api/version` |
| 6 | CI/CD | **DONE.** `.github/workflows/{ci,release}.yml`, dependabot |
| 7 | Observability | **PARTIAL.** Logs, tracing, metrics, `/api/metrics`, consent, telemetry all shipped and verified at the API. **The dashboard at `?page=metrics` has never been rendered in a browser** |
| 8 | Session tokens + JWT | **DONE** for the API (13/13 checks). User store is in-process — see §11 |
| 9 | Onboarding draft caching | **DONE.** `useMerchantDraft` + `readMerchantDraft` persist the merchant form (22 fields, category by id, restore verified through a reload and by 11 unit tests). HostOnboarding keeps its own inline version — see §11.2 |

### 10.1 The highest-value thing this session found

Installing `@types/react` and `@types/react-dom` turned `tsc --noEmit` from a weak
check into a real one and immediately exposed **19 live defects**, including:

- **Add-to-cart was dead on five pages.** Restaurants, Spa, Transport, Groceries and
  Experiences destructured `addItem` from `useCart()`, but the context exports
  `addToCart` — so the function was `undefined` and clicking threw.
- **A second break behind it:** `UnifiedItemModal` sent `title`/`totalPrice` while
  those call sites read `name`/`price`, so every line arrived blank with NaN totals.
- **Five dead styles** from `class=` instead of `className=`.
- **The consent banner swallowed clicks** across the full bottom strip of every page.

**Do not remove those two dev dependencies.** Without them `tsc` infers React's types
from JavaScript, real errors vanish, and the gates report a clean build on a broken
cart.

## 11. Notes that will save a future session real time

1. **The discovery screen is further along than the brief assumed.** It already has a
   docked vertical rail, subcategory chips with an `all` option, a region/sort bar and
   pagination with an IntersectionObserver sentinel. There is no separate "category
   page" — categories filter the one browse surface. If the brief's category page is
   still wanted, it is a NEW surface, not a fix to this one.
2. **`useMerchantDraft` is the only draft implementation.** An earlier generic
   `useDraftPersistence` was deleted: it was never wired to anything and both forms
   carried inline copies, which is the worst of both. The live hook takes `{ key,
   version }` so more than one form can use it without sharing a storage slot — two
   forms on one key would silently read each other's drafts. HostOnboarding still has
   its own inline copy, and **migrating it is not a mechanical swap**: its restore
   re-keys dynamic rows, because stored row ids collide with the first row added after
   a reload and a duplicate key makes removal delete both rows. That bug has been fixed
   once; preserve and test that logic if you move it.
3. **Tailwind v4 does not generate opacity modifiers for custom theme colours.**
   `bg-gold/12` compiled to nothing — silently, with no build warning — leaving
   elements with no background. Thirty-nine usages across twenty utilities were dead
   until they were replaced with real tokens (`--color-gold-tint`, `--color-gold-line`).
   **Any new theme colour must be declared, then verified by grepping the BUILT CSS**,
   not the source: `dist/assets/index-*.css`. A missing tint is easy to misread as a
   deliberate flat design.
4. **The user store is a `Map`.** Auth is complete and verified, but does not survive
   a restart or scale past one process. The table and `citext` note are in
   `docs/AUTH.md`; only four functions change.
5. **Signup returns the verification token.** That is a deliberate placeholder until a
   mailer exists, and it **must stop** before this is public — returning a verification
   token to the caller defeats verification.
6. **`AUTH_SECRET` has no default and the server refuses to boot without it.** That is
   intentional. Generate one per environment.
7. **`src/assets/images/` originals are no longer imported** — only the ladder in
   `public/images/` is. Deleting the originals would break
   `scripts/build-image-ladder.mjs`, which reads them.

---

## 12. Suggested first 30 minutes of the next session

1. `npm run db:up && npm run server && npm run dev` — confirm the stack runs.
2. `npm run lint && npm test && npm run test:api && npm run test:flow && npm run test:consistency`
   — expect **113 assertions** (42 unit, 29 API, 18 flow, 24 consistency).
3. **Render `?page=metrics` in a browser.** It is the one shipped surface never
   verified visually; it only populates when the API is answering.
4. **Finish the draft caching (§10 row 9)** — migrate `HostOnboarding` off its inline
   copy and add `useDraftPersistence` to `MerchantOnboarding`. The hook is written and
   generic; this is wiring.
5. **Give the catalogue real menu sections (§7.1).** Still the highest-value data fix:
   it replaces a hash with authored taxonomy and makes the merchant menu truthful.
6. Ask which hero reveal treatment won (§7.0) and delete the other two.
