# Current handoff — NEXG App

- **Updated:** 2026-09-25
- **Current initiative plan:** [`../MASTER-BUILD-PLAN.md`](../MASTER-BUILD-PLAN.md), v1.3
- **Current phase:** P0 release readiness remains blocked; P2 API and identity security is in planning.
- **Phase 2 kickoff:** [`P2-API-AND-IDENTITY-SECURITY-KICKOFF.md`](P2-API-AND-IDENTITY-SECURITY-KICKOFF.md)
**Live-state/security notes:** [`../HANDOFF-2026-09-22.md`](../HANDOFF-2026-09-22.md) and
[`../SECURITY-HARDENING-AND-CLEANUP-PLAN.md`](../SECURITY-HARDENING-AND-CLEANUP-PLAN.md)

## Current state

- The site-source candidate `cf30039` is pushed to
  [`origin/master`](https://github.com/nexgeniusagent47/NEXG-APP/tree/master). The current
  branch tip is `60ca6bb`; documentation updates `a026569` and `60ca6bb` are also pushed.
  GitHub Actions runs
  [36039810407](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36039810407),
  [36040825521](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36040825521), and
  [36041258585](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36041258585) passed
  for those commits. The local branch matched `origin/master` with a clean tree at this baseline.
- Local work now includes the PostgreSQL-only, fail-closed catalogue API; app/database/deployment
  documentation; onboarding/logo/theme and partner-estimate changes; language-detection and
  translation work; API logging/observability changes; and the current master plan, security plan,
  ADR register, design prompts, and dated session records. See the changelog and session history
  for the grouped source changes.
- The fallback JSON catalogue files were removed from the local source. The local source server
  booted with PostgreSQL initialized; read-only API contract checks reported 21 categories,
  128 subcategories, 640 merchants, and 6,000 items. A separate local invalid-loopback DB
  simulation returned 503 for health, category, and merchant routes without fallback. No
  staging/production outage test was run.
- Type checking now passes. The fix adds a `*.svg?url` type declaration for the supplied logo imports
  and excludes the Git-ignored `vendor/` icon demo from the project's TypeScript input set; it does
  not change runtime behavior.
- The supplied NEXG wordmark is used with adaptive ink on transparent backgrounds. Merchant, rider,
  and host title bands use the gold treatment; onboarding back controls precede the logo; the
  independent rider selection uses a motorcycle glyph. The wordmark's light and dark theme SVGs
  have transparent PNG exports (1504 × 544) at [`../brand/exports/`](../brand/exports/).
- Partner estimates show KES 95/km with 48-hour notice for riders and 18% of estimated order markup
  with 14-day notice for property owners. These are illustrative and not finalized contract terms.
- The 112-item Google Flow prompt pack is ready, but generated illustrations are not integrated.
  Site-wide Chinese, Kiswahili, and Arabic translations and Arabic RTL review remain incomplete.
  Host/merchant/rider onboarding is not yet one role-selecting form; field preservation still needs
  a complete inventory.
- No fresh production security audit was performed. The earlier Cloudflare/origin and server notes
  are dated observations, not current proof. P2 API/authz controls and P5 Cloudflare/TLS acceptance
  remain open.

## Verification on 2026-09-24

- `node node_modules/typescript/bin/tsc --noEmit` — PASS.
- `node node_modules/vitest/vitest.mjs run` — PASS: 7 files, 52 tests.
- `node scripts/api-contract-test.mjs http://127.0.0.1:3317` — PASS: 29 assertions against the
  freshly initialized source API and local PostgreSQL.
- `node scripts/v2-flow-test.mjs` — PASS: 18 assertions.
- `node scripts/v3-consistency-test.mjs` — PASS: 24 assertions.
- GitHub Actions CI — PASS for source candidate `cf30039` and current pushed tip `60ca6bb`,
  including typecheck, Vitest, and production build. The latest recorded run is `36041258585`.
- The final local Vite build rerun was blocked by sandbox filesystem access to `../..`; the
  `--configLoader runner` workaround is incompatible with this config's `__dirname`. CI provides
  the production-build result for the pushed commit.
- `git diff --check` — PASS; see the dated session for the final output.

The workstation's global npm/npx launchers point to a missing npm installation; local Node binaries
were used to run the repository checks. The local results do not equal phase acceptance or a
production release.

- Local repository cleanup is in progress: the source workbook and font licensing research
  have been moved under `data/source/` and `docs/brand/`; dead root forwarding shims and the
  unused Bun lockfile and superseded catalogue generator have been removed; the README, docs
  index, and deployment guidance were refreshed. These changes are uncommitted and have not been
  pushed.
- A disposable production-image simulation is defined by `docker-compose.staging.yml` and
  `scripts/staging.mjs`, with a workflow in `.github/workflows/production-simulation.yml`. It
  passed locally on 2026-09-25: production image/build and 29 API assertions passed; database
  outage routes returned 503 and seeded health recovered. Docker staging remains at
  `http://127.0.0.1:54095` for inspection.
- After upgrading Vitest to patched 4.1.11, local Docker checks passed: `npm run lint`, 52 unit
  tests, and `npm audit --package-lock-only` with zero vulnerabilities. The browser flow and
  consistency scripts were not run because the version-matched Playwright image pull stalled;
  those suites are not included in current GitHub CI.

## Push/deployment status

The source snapshot is committed and pushed to GitHub `origin/master` at `cf30039`; the latest
branch tip is `60ca6bb`. Documentation follow-ups `a026569` and `60ca6bb` passed CI. This session's
repository cleanup and staging-simulation changes are locally verified and ready for a push, but
remain uncommitted and are not on GitHub. GitHub CI and the new staging workflow have not yet run
for this local change set. A push does not deploy to production. The existing SSH handoff records
the live project path `/var/www/apps/projects/nexg-concierge`; an immutable release artifact,
rollback rehearsal, backup restore evidence, and current production security checks remain
outstanding. No production container, database, Cloudflare setting, or DNS record was changed.

P0 is not accepted: the local production-image simulation passed, but no rollback rehearsal was
performed and production health/security were not freshly verified. Do not claim the local
changes are pushed, deployed, or ready for a production release.

## Next actions

1. Push the locally verified change set when ready, then inspect the GitHub CI and
   production-simulation workflow results.
2. Resolve F-001: complete P0 staging-topology outage, immutable-artifact, and rollback checks;
   then confirm the production release procedure before deploying.
3. Keep the pushed source and production release as separate gates; do not treat GitHub CI as a
   live-site deployment.
4. Begin P2 with the API route inventory, threat model, and detailed 34-section plan. Review
   ADR-0001 through ADR-0004; they are proposed only. Include F-002 in P2 and carry F-006's open
   checkout semantics to P3/P7.
5. After P2 decisions and acceptance, advance to P3 guest ordering and its query/index evidence.
   Do not begin portals before the guest flow and tenant authorization are accepted.
6. Re-check Cloudflare/origin TLS and security before any V1 production release.

## Skills applied in this pass

`find-skills` (catalogue searched on skills.sh; local `npx skills` command unavailable),
`nexg-phase-loop`, `nexg-follow-through`, `security-audit` (guidance mode; no full audit), and
`dsh-pre-push-checks`.

## Session records

- [`sessions/2026-09-24-master-build-plan.md`](sessions/2026-09-24-master-build-plan.md)
- [`sessions/2026-09-24-impeccable-cleanup.md`](sessions/2026-09-24-impeccable-cleanup.md)
- [`sessions/2026-09-24-onboarding-logo-and-icon-prompts.md`](sessions/2026-09-24-onboarding-logo-and-icon-prompts.md)
- [`sessions/2026-09-24-partner-earnings-rates.md`](sessions/2026-09-24-partner-earnings-rates.md)
- [`sessions/2026-09-24-release-readiness-and-phase-2.md`](sessions/2026-09-24-release-readiness-and-phase-2.md)
- [`sessions/2026-09-25-repository-cleanup-and-staging-simulation.md`](sessions/2026-09-25-repository-cleanup-and-staging-simulation.md)
