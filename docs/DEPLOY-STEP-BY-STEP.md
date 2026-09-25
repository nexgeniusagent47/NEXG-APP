# Deployment runbook status

**Do not deploy from this document yet.** The available server notes and the older
deployment instructions disagree about the live directory, Compose project, services,
and database topology. The current handoff records `/var/www/apps/projects/nexg-concierge`
and `nexg-concierge-*` containers, while this checkout's older commands target another
layout. That mismatch has not been reconciled against the live host.

The current repository has not established a rehearsed production release or rollback
procedure. This file intentionally documents the blocker instead of retaining server
commands that may target the wrong project. A push to `master` does not deploy the site.

## Local production-image simulation

The disposable simulation uses the production `Dockerfile`, a fresh seeded PostgreSQL
15 service, loopback-only app port binding, and a project-scoped volume. It verifies
the production SPA and version endpoint, checks the API contract, confirms health and
catalogue routes fail closed when the staging DB is stopped, then waits for recovery.

```powershell
npm run staging:simulate
npm run staging:down
npm run staging:reset
```

`simulate` leaves the stack running for inspection. `down` preserves its local volume;
`reset` removes only the isolated staging stack and its generated ignored credentials.
See [release readiness](RELEASE-READINESS.md) for the remaining gates. Docker is not
available in the current workstation session, so this simulation has not been run here.

## Deployment invariants to preserve

- Use the base `docker-compose.yml` as the starting model; do not use
  `docker-compose.prod.yml`, which assumes a managed database and removes the local
  PostgreSQL service.
- `AUTH_SECRET` must be set to at least 32 characters. Compose must fail before startup
  if it is missing.
- The app's `DATABASE_URL` must use the Compose service hostname `postgres` and the
  container port. Never set an in-container database URL to `127.0.0.1`.
- Keep PostgreSQL off public host ports. The app and database should communicate over
  the Compose network; expose customer traffic only through the verified proxy path.
- Do not run a live migration, seed, container restart, DNS change, or Cloudflare change
  until the target topology, backup, rollback, and approval are recorded.

## Evidence required before deployment

1. Owner-confirmed live paths, Compose files, service names, network, database volume,
   proxy, and deployment account.
2. Passing production-image simulation with retained CI run and test output.
3. A named, immutable release artifact tied to a Git commit and the production runtime.
4. Verified database backup plus a rehearsed restore and application rollback procedure.
5. Current staging acceptance, production security/TLS checks, monitoring, and post-deploy
   health criteria.
6. Explicit owner approval for the specific release candidate.

No command in this runbook deploys to production. Update it with verified, owner-approved
server commands only after the open topology and rollback gates have evidence.
