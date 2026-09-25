# Release readiness

**Production deployment: COMPLETE.** NEXG App 2.2.0, commit
`b89350d78c1bcacf040f58696d291ceb9aa1035a`, is live on 2026-09-25. The current handoff and
[deployment runbook](DEPLOY-STEP-BY-STEP.md) contain the release evidence and rollback tag.

## Release evidence

- GitHub [CI](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36097453708) and
  [production simulation](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36097453713)
  both passed for the deployed commit.
- The production simulation used the production Dockerfile and PostgreSQL 15. It passed the SPA
  shell and API contract assertions, confirmed health/categories/merchants fail closed during a
  staging-only DB outage, and recovered after the test DB restarted.
- A SHA-256-verified archive of the exact commit was built into a fresh release directory on the
  server. The app image records the full commit SHA and build timestamp in `/api/version`.
- Before deployment, the PostgreSQL backup was restored into an isolated, temporary Postgres
  container and matched the expected counts. Production app container was recreated without
  restarting PostgreSQL or running a schema change. Database container ID and named volume stayed
  unchanged.
- After deployment, both hostnames returned the site and health API over HTTPS. HTTP redirected to
  HTTPS. Version reported the deployed commit; health reported PostgreSQL connected with 21
  categories, 128 subcategories, 640 merchants and 6,000 items. Categories, merchants and search
  endpoints returned 200.
- Metrics/traces return 404 and telemetry read requests return 403, including tested case,
  trailing-slash and nested path variants. Browser telemetry POST ingestion remains public.
- The prior app image remains tagged
  `nexg-concierge-app:rollback-before-b89350d` for rollback.

## Work still open

1. **Zero Trust is deferred.** No Cloudflare Access plan, app, or policy is active. Nginx blocks
   operator diagnostics in the meantime, so the operations dashboard cannot read metrics or
   traces. See [Zero Trust for NEXG App](ZERO-TRUST-ACCESS.md) for its purpose, safe scope and
   future implementation path. The telemetry read view must move to a separate protected route
   before an Access path policy can be applied without blocking public telemetry ingestion.
2. **Encrypted off-host database backup remains open.** The isolated restore rehearsal from the
   server-local dump passed; after making an encrypted off-host copy, verify that copy can also be
   restored. This deployment did not change database schema or data.
3. The browser flow and consistency suites were not run because pulling the matching Playwright
   image stalled. They were not part of the passing GitHub workflows.
4. Follow up on the remaining production monitoring/logging decisions in the handoff. Do not
   describe these items as passed until they are implemented and verified.

## Pre-deployment CI

The current deployed candidate completed the repository's required CI and production-simulation
workflows. The simulation remains staging-only: its outage exercise must never target production.
Pushes to `master` do not themselves deploy the live site.
