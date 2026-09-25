# Release readiness

**Push checks: PASS locally. Production release: BLOCKED.** The local change set passed
the configured CI gates and the production-container rehearsal. A push to GitHub runs CI;
it does not deploy the live site.

## Evidence available

- The current pushed source candidate is recorded in the [handoff](handoff/HANDOFF.md);
  this change set is local, uncommitted, and not pushed.
- TypeScript check, Vitest (7 files / 52 tests), and the Vite production build passed in
  Docker using the patched lockfile.
- `npm audit --package-lock-only` reports zero vulnerabilities. The production-only npm
  install in the image also reported zero vulnerabilities.
- `docker-compose.staging.yml` and `scripts/staging.mjs` passed a local simulation on
  2026-09-25 using the production Dockerfile and PostgreSQL 15: the SPA shell and all 29
  API contract assertions passed; health, categories, and merchant routes returned 503
  during a staging-only database outage; seeded health recovered afterward.
- The isolated staging stack remains available at `http://127.0.0.1:54095` for inspection.
  Its ignored `.env.staging` holds disposable credentials; PostgreSQL has no host port.
- The browser flow and consistency suites were not run: pulling the version-matched
  Playwright image stalled, and these suites are not part of the current GitHub CI job.
- `.github/workflows/production-simulation.yml` runs the simulation on pushes and pull
  requests to `main` and `master`; its result will be available only after these changes
  are pushed.

## Gates still open

1. Push the local change set when ready, then review both GitHub CI and the production
   simulation workflow results.
2. Reconcile the production runbook with the owner-confirmed server directory, Compose
   project, services, database and proxy topology. Current notes disagree; do not use
   guessed server paths or the managed-database override.
3. Define and rehearse an immutable release artifact and a rollback that restores both
   application version and compatible database state.
4. Verify backups and restore evidence before changing the live database.
5. Complete current production security, origin/TLS, monitoring, and post-deploy health
   checks as recorded in the phase handoff.
6. Obtain explicit owner approval for the production release after the evidence above
   is reviewable.

## Safe local rehearsal

```powershell
npm run staging:simulate
npm run staging:down
npm run staging:reset
```

The first command builds and starts the isolated stack, performs the database outage
and recovery check, and leaves the stack running for inspection. `down` preserves the
simulation database volume. `reset` removes only the staging Compose project, its
project-scoped volume, and the generated ignored credentials file. It uses the local
Compose service `postgres` for `DATABASE_URL`, has no production host or credentials
configured, invokes no deployment command, and does not publish PostgreSQL.
