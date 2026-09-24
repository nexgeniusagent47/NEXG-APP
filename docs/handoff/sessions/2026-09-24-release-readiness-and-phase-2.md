# Release readiness and Phase 2 handoff

- **Date:** 2026-09-24
**Request:** Document the accumulated local changes, prepare the handoff to Phase 2, and push the site.

This record was updated after the requested GitHub push. The post-push addendum at the end
supersedes the initial source/commit status below.

## Plan and scope

This pass reconciles existing code and documentation changes, completes the configured local
release checks, writes a Phase 2 API and identity security kickoff handoff, and updates the current
handoff, status matrix, and changelog with observed evidence. The existing worktree is broad and
has no Git remote; release publication is only possible after the source/destination and exact
candidate are reconciled.

The only planned code correction is an isolated type-check configuration fix: declare the SVG URL
import type used by the wordmark and exclude the Git-ignored `vendor/` examples from the project
type check. It changes no runtime behavior, application contract, database, or production state.

No Phase 2 feature implementation, database mutation, Cloudflare change, commit, push, or production
deployment is in scope for this preparation pass. Phase 2 remains in planning until its detailed
34+2-section plan, ADR decisions, and threat model are reviewed.

## Baseline

- Checkout: `master` at `f0e760e`.
- Git remote/tracking branch: none configured.
- Worktree: contains accumulated local API/database, onboarding/brand/i18n, estimates, build-plan,
  security-runbook, ADR/status/handoff and design-prompt changes. No files were staged.
- Production facts in the handoff are historical observations; no production access or fresh audit
  was used in this pass.

## Consolidated change inventory

- **Catalogue and API:** removed the bundled fallback catalogue and changed database-backed health,
  discovery, category, and search behavior to fail closed when PostgreSQL is unavailable; adjusted
  the Docker health check and production image accordingly. API logging, traces, metrics, errors,
  deployment configuration, and related operator documentation also changed in the worktree.
- **Partner/onboarding UI:** updated the supplied adaptive wordmark, gold title bands, theme
  contrast, back-control ordering, independent-rider motorcycle glyph, category selection behavior,
  headings, select affordance, language detection, and shared corner treatment. The single adaptive
  role selector and full field inventory are still not implemented.
- **Partner estimates:** added the owner-provided KES 95/km rider estimate and 18% of estimated
  property-order markup with 48-hour/14-day notices and localized copy. Calculations remain
  illustrative and unapproved as contract language.
- **Brand/docs:** transparent 1504 × 544 light/dark PNG exports exist beside the brand documentation;
  the 112 Google Flow illustration prompts are written but their generated images are not integrated.
  Master plan, security runbook, ADR register, follow-up register, status, changelog, and handoff were
  reconciled in this pass. The legacy deployment runbook now carries a clear hold note because its
  project path, container names, and deployment account differ from the last owner-provided SSH
  session.
- **Typecheck setup:** declared the imported SVG `?url` type and excluded the ignored `vendor/` demo
  from the project typecheck. Runtime code and app behavior were not changed by this correction.

## Verification record

- `node node_modules/typescript/bin/tsc --noEmit` — PASS after the typecheck correction. The first
  run reported two SVG `?url` typing errors and two errors from the ignored Gatsby demo.
- `node node_modules/vitest/vitest.mjs run` — PASS: 7 test files, 52 tests. The global `npm`/`npx`
  entry points fail because the configured npm CLI file is missing; invoking the local Vitest binary
  bypasses that workstation launcher defect. The first sandboxed Vitest run also lacked permission
  to inspect the Vite workspace root; the same local test command was then run with approval.
- `node scripts/api-contract-test.mjs http://127.0.0.1:3001` — PASS: 29 assertions against the
  already-running local API. A fresh source process on loopback port 3317 then initialized its pool
  through `initDb()` and passed the same 29 assertions, with PostgreSQL source and 640 merchants /
  6,000 items. An initial manual harness that imported `app` but skipped `initDb()` returned 503;
  it was stopped and the check was repeated through the proper initialization path.
- `node scripts/v2-flow-test.mjs` — PASS: 18 assertions against the local site on port 3000. Browser
  launch required the approved local process permission.
- `node scripts/v3-consistency-test.mjs` — PASS: 24 assertions against the local site on port 3000.
- `node node_modules/vite/bin/vite.js build` — PASS: final run transformed 2,182 modules after the
  type-only/config correction and the final documentation changes.
- Built `dist/index.html` — verified the Impeccable live-edit injection and `localhost:8400` are
  absent from the production HTML. Both logo exports — verified as 1504 × 544 RGBA PNGs.
- Isolated DB-outage simulation — PASS. With a deliberately unreachable loopback database target,
  `initDb()` returned false; `/api/health` returned 503/unavailable with
  `postgresConnected=false`; `/api/categories` and `/api/merchants` returned HTTP 503 with the
  generic `Database unavailable` response. The temporary source server shut down after the check.
  This is local evidence only; no staging or production outage was attempted.
- `git diff --check` — PASS (exit 0); Git emitted informational LF-to-CRLF working-copy warnings,
  with no whitespace errors.
- Skills CLI discovery attempted as directed, but `npx skills` cannot start because the global npm
  CLI path is missing. Available local phase, follow-through, security, and pre-push instructions
  were used instead.

## Release and phase decision

- No full security audit, staging/production outage, production check, database write, Cloudflare
  change, commit, push, or deploy was performed.
- At the initial preparation-pass cutoff, P0 remained blocked by no Git remote/upstream, a broad
  dirty worktree, an unreconciled server destination, and missing staging-topology/rollback
  evidence. The post-push addendum below updates the source/commit facts; staging and rollback
  evidence remain open.
- P2 is only in planning. ADR-0001 through ADR-0004 remain proposed. F-002 stays open and moves to
  P2; F-006 remains open for the P3 order contract/P7 portal boundary.
- Next session: confirm the approved source/release destination; create/review the detailed 34+2
  P2 plan and threat model; review ADR-0001 through ADR-0004 before writing P2 implementation code.

## Post-push update — 2026-09-24

- Added GitHub as `origin` and pushed the app/source commit `cf300395a411e376585e600af93b16cb14585cad`
  to `master`; a documentation-only status commit `a0265699530cae325b2240860bc44546d71dda76`
  followed. Local `master` tracks `origin/master` with a clean worktree.
- GitHub Actions CI run
  [36039810407](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36039810407) passed
  for `cf30039`. The documentation follow-up CI run
  [36040825521](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36040825521) also passed.
  CI covers typecheck, Vitest, and the Vite production build.
- The branch-push CI workflow does not deploy the live site. The separate release workflow is
  tag-driven and publishes a GHCR image; no tag was created. No production container, database,
  DNS, Cloudflare setting, or certificate was changed by this push.
- The final local Vite build rerun was blocked by workspace sandbox access to `../..`; the runner
  loader alternative was incompatible with the config's `__dirname`. The successful GitHub CI run
  is the production-build evidence for this commit.
- P0 remains open until staging outage/rollback evidence, the approved production release route,
  and post-deploy health/source/count checks are complete. P2 remains planning only.
- Next: finish the safe release and rollback gates for the pushed candidate; then continue P2
  planning from the API/identity security kickoff.
