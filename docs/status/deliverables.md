# NEXG App deliverables and phase status

Updated: 2026-09-25. Overall initiative status: **ACTIVE — P0 release readiness blocked; P2 API and identity security in planning**.

| Work item | Status | Evidence / next gate |
|---|---|---|
| Master build plan | ACTIVE — plan version 1.3 | `docs/MASTER-BUILD-PLAN.md`; initiative plan is documented, phase plans and owner decisions remain separate gates |
| P0 PostgreSQL-only catalogue patch | PUSHED — not deployed; phase open | Candidate `cf30039` is on `origin/master`; local source boot plus PostgreSQL API contract passed 29/29; isolated invalid-loopback DB simulation confirmed 503/no fallback. GitHub CI passed. The new production-image simulation is authored locally but unrun because Docker is unavailable; staging/production topology check, release artifact, rollback rehearsal, and production acceptance remain open |
| P0 release source and route | SOURCE ESTABLISHED — production release blocked | GitHub repository `nexgeniusagent47/NEXG-APP`, branch `master`; source candidate `cf30039`, current pushed tip `60ca6bb`; latest recorded CI run `36041258585` passed. No automatic deployment is configured. Staging topology, artifact, rollback rehearsal, and post-deploy checks remain open |
| P1 onboarding and brand slice | IMPLEMENTED LOCALLY — unaccepted | Supplied adaptive wordmark, gold title bands, back-before-logo order, motorcycle glyph, category selection surface, device-language detection, and shared theme updates are present. Existing-field inventory, complete multilingual copy/RTL review, and one adaptive host/merchant/rider entry remain open |
| P1 partner earnings estimates | IMPLEMENTED LOCALLY — illustrative | Courier estimate uses KES 95/km and 48-hour notice; property share uses 18% of estimated order markup and 14-day notice. Commercial wording and eligibility assumptions need owner confirmation before release |
| Merchant category illustration prompts | PROMPTS READY — image assets pending | `docs/design/merchant-category-google-flow-prompts.md` covers 21 category images and 91 reusable subcategory symbols (128 selectable subcategory entries). No Flow-generated images are integrated |
| Logo PNG exports | EXPORTED LOCALLY | Light and dark transparent PNGs, 1504 × 544, at `docs/brand/exports/`; generated from the tracked SVG artwork |
| P2 API and identity security | PLANNING — kickoff prepared | `docs/handoff/P2-API-AND-IDENTITY-SECURITY-KICKOFF.md`; ADR-0001–0004 remain proposed; route inventory, threat model, detailed phase plan, and owner decisions required before implementation |
| P3 guest discovery and V1 ordering | NOT STARTED AS A PHASE | Existing browse/cart code has local flow evidence; approved ordering/payment contract, P2 dependencies, detailed plan, and full acceptance remain open |
| P3.1 query/index evidence | NOT STARTED | Needs representative workload, baseline query plans/latency, reviewed indexes, and migration/rollback evidence |
| P3 brand, keyboard, and error-state system | PARTIAL | Theme and interaction work is local; full error-state family, mascot assets, complete accessibility/language review, and phase acceptance remain open |
| P4 unified onboarding | NOT STARTED — V1 requirement | Capture and map every current host/merchant/rider field, agreement, validation, upload, draft, and submission behavior before consolidation |
| P5 Cloudflare and production security gate | NOT STARTED — production blocker | Existing notes are historical; refresh Cloudflare/origin evidence, install/verify origin TLS, verify Full (strict), API controls, WAF/rate limits, monitoring, backups, and rollback |
| V1 production release | BLOCKED | GitHub source is established; P0, P2–P5, production TLS/security, and rollback acceptance remain open |
| P6 public partner/product pages | NOT STARTED — after V1 | Needs approved product readiness, destinations, and TempVault name/IP claim evidence |
| P7 partner portals | NOT STARTED | Requires accepted P2 identity/authz, guest flow, tenant boundaries, portal contracts, and isolation checks |
| P8 operability and progressive delivery | NOT STARTED | Requires ADR-0004/0007/0008, staging rehearsal, alert runbooks, and tested rollback |

## Local verification — 2026-09-24

- `node node_modules/typescript/bin/tsc --noEmit` — PASS after the SVG URL declaration and
  ignored-vendor exclusion were corrected.
- `node node_modules/vitest/vitest.mjs run` — PASS, 7 files and 52 tests.
- `node scripts/api-contract-test.mjs http://127.0.0.1:3317` — PASS, 29 assertions against the
  freshly initialized source server and local PostgreSQL (640 merchants, 6,000 items).
- `node scripts/v2-flow-test.mjs` — PASS, 18 assertions.
- `node scripts/v3-consistency-test.mjs` — PASS, 24 assertions.
- GitHub Actions CI — PASS for commit `cf30039`, including typecheck, unit tests, and production
  build. The final local Vite rerun was blocked by sandbox filesystem access; see the current handoff.
- `git diff --check` — recorded in the dated session after the documentation edits.

The workstation's global npm/npx launchers are broken; local Node binaries and GitHub Actions CI
were used. These checks do not equal production acceptance. No full security audit, staging outage
test, Cloudflare change, or production deployment was performed. See
[`../handoff/sessions/2026-09-24-release-readiness-and-phase-2.md`](../handoff/sessions/2026-09-24-release-readiness-and-phase-2.md).

## Local repository and simulation work — 2026-09-25

- Reorganized the source workbook and font-licensing research, removed unused root shims and
  the unused Bun lockfile and superseded catalogue generator, refreshed the README and
  documentation index, and corrected the SQL generation command to call the current generator.
- Added an isolated production-image/PostgreSQL outage-and-recovery simulation and a GitHub
  Actions workflow. The simulation was not run here because Docker is unavailable. These edits
  are local and uncommitted; no new CI result exists yet.
- Production release remains blocked. See [`../RELEASE-READINESS.md`](../RELEASE-READINESS.md).
