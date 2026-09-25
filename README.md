# NEXG App

NEXG App is a Nairobi marketplace with 21 categories and ordering flows tailored to
each kind of service. The seeded catalogue currently contains 128 subcategories,
640 merchants, and 6,000 items.

## Release status

The source branch is `master`. GitHub CI has passed for the current pushed source,
but a successful CI run does not deploy the site. Production release readiness is
still blocked on staging evidence, a verified release and rollback procedure, and
current production security checks. See the [current handoff](docs/handoff/HANDOFF.md)
and [release readiness checklist](docs/RELEASE-READINESS.md).

## Run locally

Requirements: Node.js 24+, npm, and Docker Desktop with Compose v2.

```powershell
npm ci
npm run db:up       # starts this project's PostgreSQL on 127.0.0.1:5433
npm run server      # API on :3001, in one terminal
npm run dev         # Vite on :3000, in another terminal
```

Open <http://localhost:3000>. Local development uses PostgreSQL; the app returns
HTTP 503 for catalogue requests when the database is unavailable rather than using
a stale bundled catalogue.

## Production-image simulation

The simulation builds the same Dockerfile used for production and runs it against a
fresh, separately named PostgreSQL 15 container. It checks the production SPA shell,
version endpoint, and seeded API contract; stops only that temporary database to verify
fail-closed responses; then checks recovery.

```powershell
npm run staging:simulate
npm run staging:down     # stop the stack; keep its disposable database volume
npm run staging:reset    # remove only the simulation stack and its volume
```

The simulation binds its app port to loopback on a random port and does not publish
PostgreSQL. It creates a random, ignored `.env.staging`. `simulate` leaves the stack
running for inspection. This is local release evidence only; it does not exercise
the live server or authorize a production release. GitHub Actions runs the same
simulation on pushes and pull requests to `main` or `master`.

## Checks

```powershell
npm run lint
npm test
npm run test:api         # requires an already running API and seeded database
npm run test:flow
npm run test:consistency
npm run build
```

`test:api` needs an already running API and seeded PostgreSQL. `test:flow` and
`test:consistency` need the app and API running at their documented local URLs.

## Repository map

| Path | Contents |
| --- | --- |
| `src/` | React app, shared components, frontend data, database schema and generated seed SQL |
| `server/` | Express API and PostgreSQL repository |
| `scripts/` | Database setup, catalogue generation, checks, screenshots, and staging simulation |
| `tests/` | Vitest unit tests |
| `data/source/` | Source workbook used to generate catalogue SQL |
| `docs/` | Architecture, API, release, planning, brand, and handoff documentation |
| `public/` | Static assets and licensed fonts |
| `.github/workflows/` | CI and disposable production-image simulation |

## Project guides

- [Documentation index](docs/INDEX.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API reference](docs/API.md)
- [Release readiness](docs/RELEASE-READINESS.md)
- [Deployment runbook status](docs/DEPLOY-STEP-BY-STEP.md)
- [Current handoff](docs/handoff/HANDOFF.md)
- [Changelog](CHANGELOG.md)
