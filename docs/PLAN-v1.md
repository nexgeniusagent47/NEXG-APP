# NEXG Concierge — v1 Plan

**Status:** Active
**Version:** v1.0.0 (first continuously-deployable baseline)
**Date:** 2026-09-21
**Workspace:** `C:\Users\limta\Downloads\nexg-concierge`

---

## 1. What this is

NEXG Concierge is a **concierge marketplace for Nairobi**: Airbnb-style discovery and
trust (curated places, rich merchant pages, reviews, experiences) crossed with
Glovo-style on-demand fulfilment (live catalogue, cart, delivery/pickup, courier
dispatch, order tracking).

The differentiator is **scope**. It is not restaurants-only. It models **21 top-level
categories / 134 subcategories / 640 merchants**, where each subcategory declares its
own *fulfilment hint*, *workflow hint*, and *attribute schema*. A restaurant order, a
spa booking, a car rental, and a freight quote are all first-class, but they do **not**
share one checkout shape — they share one *engine* and declare their differences.

### The v1 definition of done

> The app runs locally against a real PostgreSQL backend, serves the **full** seeded
> catalogue through a typed HTTP API, and every major surface renders correctly with
> no placeholder or fabricated data. `npm run dev` opens a working product.

"v1" is deliberately a **baseline, not a finish line.** It exists so that every
subsequent change is a small, testable diff against a known-good tag.

---

## 2. Verified current state (measured, not assumed)

Everything in this table was observed directly during recon.

| Area | State | Evidence |
| --- | --- | --- |
| TypeScript | **Clean** — `tsc --noEmit` exits 0 | verified run |
| Unit tests | **BLOCKED** — vitest dies `spawn EPERM` | esbuild IPC blocked by sandbox |
| Backend boot | **Was broken, now fixed** | `server/index.ts:4` imported TS types as runtime values |
| Backend data | **Broken — serves 19% of catalogue** | `/api/health` says 640 merchants; `/api/merchants` returns 120 |
| PostgreSQL | **Now provisioned** | container `nexg-concierge-pg`, 21/128/640/1500 rows seeded |
| Backend ↔ Postgres | **Not connected at all** | `postgresConfigured:false`; handlers only read the JSON cache |
| Frontend ↔ Backend | **Not connected** | no `fetch` to `/api/*`; UI reads bundled TS data |
| Playwright | **Not installed** | no `@playwright/test`, no browsers cached |
| Version control | **No `.git`** | `git status` → *not a git repository* |

### The single most important finding

There are **two competing catalogue sources of truth**, and they disagree:

| Source | Merchants | Items |
| --- | --- | --- |
| `src/data/seededCatalog.json` `.summary` | 640 | 14,895 |
| `src/data/seededCatalog.json` `.merchants[]` (**what the API serves**) | **120** | **3,300** |
| `src/db/seed_excel.sql` (**what Postgres has**) | **640** | **1,500** |

The API reports the number from one field and serves the contents of another. This is
the root cause of "the website still needs a lot of fixing": most of the catalogue is
invisible. **Resolving this is v1's first build task.**

---

## 3. Target architecture

```
┌─────────────────────────────┐
│  React 19 + Vite 6 (SPA)    │   :3000
│  Tailwind 4, Motion         │
└──────────┬──────────────────┘
           │  fetch /api/*        (same-origin via Vite proxy — TO BUILD)
           ▼
┌─────────────────────────────┐
│  Express API (server/)      │   :3001
│  • JSON cache = fallback    │
│  • Postgres = source of     │   ← NOT YET IMPLEMENTED
│    truth when DATABASE_URL  │
└──────────┬──────────────────┘
           │  pg Pool
           ▼
┌─────────────────────────────┐
│  PostgreSQL 15              │   127.0.0.1:5433
│  container nexg-concierge-pg│
│  21 / 128 / 640 / 1500      │
└─────────────────────────────┘
```

### Deliberate decisions

- **Postgres is the source of truth; JSON is a cold-start fallback.** The API must
  work with `DATABASE_URL` unset (no hard dependency for a new contributor), but must
  prefer the database whenever it is reachable. This is why `/api/health` already
  reports `postgresConfigured`.
- **Isolated database.** The DB runs on **port 5433** in container
  `nexg-concierge-pg`. It deliberately does **not** reuse port 5432 or the existing
  `nexg-postgres-1` / `nexg-api-1` / `nexg-kernel-1` containers, which belong to an
  **unrelated Go platform** at `C:\Users\limta\Desktop\NEXG POS`. Those are out of
  scope and must not be modified.
- **Credentials match CI.** `nexg_user` / `nexg_password` / `nexg_db` mirror
  `.github/workflows/ci.yml`, so local and CI behave identically.
- **Vite proxies `/api`.** Avoids hardcoded hosts and CORS in the browser.
- **The API shapes rows into the frontend's existing `NexGMerchant` contract**, so the
  React layer needs no rewrite. The contract is the boundary.

---

## 4. Defect backlog

Ordered by dependency, not severity. Each has an ID used by commits, tests and logs.

### P0 — Blocks v1 outright

| ID | Defect | Fix |
| --- | --- | --- |
| `D-01` | ✅ **FIXED** — `server/index.ts` imported TS types as runtime values, preventing boot under native TS | `import type { Request, Response }` |
| `D-02` | Backend never queries Postgres despite it being configured | Add `pg.Pool`, prefer DB, fall back to JSON |
| `D-03` | API serves 120 of 640 merchants; `/api/health` contradicts its own payload | Single source for counts; serve the full set |
| `D-04` | Frontend never calls the API; UI renders bundled static data | Add API client + Vite `/api` proxy |
| `D-05` | No version control — no way to tag v1 or roll back | `git init` + first commit before changes |

### P1 — Correctness

| ID | Defect | Fix |
| --- | --- | --- |
| `D-06` | Three disagreeing catalogue counts (14,895 / 3,300 / 1,500) | Reconcile to one authoritative figure; document the gap |
| `D-07` | `server/index.ts` starts listening on import, breaking tests | Export `app`; guard `listen` behind `import.meta.url`/env |
| `D-08` | `POST`/`PUT`/`DELETE` advertised in CORS but **no routes exist** | Either implement or stop advertising |
| `D-09` | SQL-injection-free but unvalidated `limit`/`offset` (`parseInt` of arbitrary input) | Clamp bounds, reject NaN |
| `D-10` | Dead code: `isCategoryExplorerOpen` / `categorySearchQuery` never opened by any control | Wire `openCategories` or delete |

### P2 — Quality

| ID | Defect | Fix |
| --- | --- | --- |
| `D-11` | No error boundary; one render throw blanks the page | Add boundary with recovery UI |
| `D-12` | Tests cannot run (sandbox) — no CI signal locally | Verify under wider sandbox; keep `vitest` green |
| `D-13` | Duplicate components: `components/ui/*` **and** `src/components/ui/*` | Delete the dead copy |
| `D-14` | Design polish pass (spacing, states, focus, motion) | Run taste/design + `better-*` skills |

---

## 5. Build order

The requested sequence is **plan → document → build → test → handoff**, and that is
the order below. No step starts before its predecessor is recorded.

| # | Phase | Output | Status |
| --- | --- | --- | --- |
| 1 | **Recon** | Verified state table (§2) | ✅ done |
| 2 | **Plan** | this document | ✅ done |
| 3 | **Skills** | taste, high-end-visual-design, image-to-code, web-design-reviewer, playwright-cli, supabase-postgres installed | ✅ done |
| 4 | **Infra** | Postgres 15 container, schema + seed applied | ✅ done |
| 5 | **Build — data** | `D-02`, `D-03`: DB-backed API, one source of truth | next |
| 6 | **Build — wiring** | `D-04`: API client + Vite proxy | |
| 7 | **Build — hardening** | `D-06`…`D-11`, `D-13` | |
| 8 | **Test** | Playwright CLI, screenshots of every major surface, defect log | |
| 9 | **Docs** | `README`, `docs/ARCHITECTURE`, `docs/API`, `CHANGELOG` | |
| 10 | **Logs** | `logs/*.log` per phase | continuous |
| 11 | **Handoff** | `docs/HANDOFF.md` — state, decisions, next steps | |
| 12 | **Tag** | `git tag v1.0.0` | |

### Skills applied per phase

Per your instruction to consult the skill store at every step, these are already
loaded and will be applied where noted:

| Phase | Skill | Why |
| --- | --- | --- |
| Build — data | `supabase-postgres-best-practices` | index/query/type review of the schema |
| Test | `playwright-cli` | drive the real browser, capture screenshots |
| Test | `web-design-reviewer` | visual + responsive + a11y inspection |
| Test | `better-interface` | composite review: a11y, layout, type, colour, polish |
| Design | `design-taste-frontend` | anti-slop, prevents templated-looking UI |
| Design | `high-end-visual-design` | the "feels expensive" bar for a concierge brand |
| Design | `emil-design-eng` | motion decisions, press feedback, easing |
| Docs | `documentation-engineer` | doc structure and accuracy |

---

## 6. Testing strategy

**Layer 1 — static.** `tsc --noEmit` must stay green (it is the only currently
working gate).

**Layer 2 — unit.** `vitest run` (4 existing suites: commerce modes, component
registry, experience engine, seed catalogue). Currently blocked by the sandbox's
`spawn EPERM`; must pass before v1 is tagged.

**Layer 3 — API contract.** Direct HTTP assertions against a running server:
`/api/health` counts must **equal** `/api/merchants.total`; every category in
`/api/categories` must resolve; `/api/merchants/:id` must 404 cleanly. This is the
test that would have caught `D-03`.

**Layer 4 — visual (Playwright).** Screenshot every major surface — home, discovery,
category drilldown, merchant page, item sheet, cart, checkout, tracking, plus the
partner/onboarding pages — at desktop and mobile widths. Review each against the
design skills. Artifacts to `logs/screenshots/`.

**Layer 5 — performance.** The brief asks for "high speed". Measure and record
`/api/merchants` latency against Postgres, confirm index usage with `EXPLAIN`, and
confirm the SPA's time-to-interactive. Numbers go in the logs.

---

## 7. Risks and constraints

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Sandbox blocks `spawn` (Vite/Playwright/vitest) | Cannot build or screenshot the UI | Escalate to full access per-run; user approved |
| No `.git` | No rollback; a bad edit is unrecoverable | `git init` + commit **before** the build phase |
| Two unrelated Postgres stacks | Could damage the `NEXG POS` Go platform | Separate container name **and** port 5433 |
| Catalogue count ambiguity | Wrong data makes UI work meaningless | Resolve `D-06` before any design pass |
| `seed_excel.sql` is generated | Hand-editing it is lost work | Fix `parse_excel_to_db.py`, regenerate |

---

## 8. Explicitly out of scope for v1

Auth, payments, real courier dispatch, live GPS, merchant self-service portal,
i18n completion, and mobile apps. v1 makes the existing vision **real, fast and
visually credible**; it does not add new business capability.
