# Repository cleanup and staging simulation — 2026-09-25

## Request

Tidy the GitHub repository structure, prepare a production-like simulation, and make
the result ready for a push after the simulation.

## Changes prepared locally

- Moved the source workbook to `data/source/` and font licensing research to
  `docs/brand/`; updated generator and documentation paths.
- Removed two unused root component forwarding files, the unused root `lib/utils.ts`
  forwarding file, their now-empty directories, and the unused `bun.lock` (npm is the
  repository's configured package manager).
- Corrected `db:generate-sql` to call `scripts/regenerate_catalog_seed.py`, the current
  catalogue generator, and removed the superseded generator it replaced.
- Replaced stale README/deployment instructions, added a documentation index and
  release-readiness checklist, and corrected current architecture/product/handoff notes.
- Added `docker-compose.staging.yml` and `scripts/staging.mjs`. The simulation builds
  the production Dockerfile, initializes an isolated PostgreSQL 15 database, checks
  the production SPA, API contract, outage responses, and recovery. Its DB has no host
  port; the app is bound to a random loopback
  port. Generated credentials are ignored by Git, and reset preserves a pre-existing
  `.env.staging` file.
- Added `.github/workflows/production-simulation.yml` to run the same simulation on
  pushes, pull requests, and manual dispatch.
- Updated the development-only Vitest dependency to the patched 4.1.11 line and
  refreshed `package-lock.json`. The lockfile root version now matches `package.json`.

## Verification and limits

- The pushed baseline is `60ca6bb`; GitHub CI run
  [36041258585](https://github.com/nexgeniusagent47/NEXG-APP/actions/runs/36041258585)
  passed before this local work.
- `node --check scripts/staging.mjs` — PASS (syntax only).
- `git diff --check` — PASS (Git reported expected LF-to-CRLF working-copy notices).
- `git check-ignore --quiet .env.staging` — PASS.
- Search found no imports of the removed shims, no use of the Bun lockfile, and no
  maintained references to the workbook at its former root location.
- Docker Desktop production-image build — PASS; Vite production bundle built.
- Docker-contained `npm run lint` — PASS.
- Docker-contained `npm test` — PASS: 7 test files, 52 tests.
- Staging API contract — PASS: 29 assertions; 21 categories, 128 subcategories, 640
  merchants, and 6,000 items.
- Staging outage rehearsal — PASS: health, categories, and merchant endpoints returned
  503 with PostgreSQL stopped; seeded health recovered after PostgreSQL restarted.
- `npm audit --package-lock-only` — PASS: zero vulnerabilities after the Vitest update.
  The production-only dependency installation also reported zero vulnerabilities.
- The version-matched Playwright image pull stalled without completing, so the existing
  `test:flow` and `test:consistency` browser suites were not run. They are not part of the
  current GitHub CI workflow.
- Changes remain local and uncommitted. No GitHub push or production action occurred.

## Next step

This local change set is ready for a push that runs GitHub CI and the new simulation
workflow. The staging stack remains available at `http://127.0.0.1:54095`; stop it with
`npm run staging:down`, or remove its volume and generated credentials with
`npm run staging:reset`. P0 production release readiness remains blocked on topology
confirmation, immutable artifact, rollback rehearsal, backup restore evidence, and current
production security checks.
