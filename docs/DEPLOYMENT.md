# Deployment

How NEXG Concierge gets from a commit to a running URL. The application is a
single process: one Express server that answers `/api/*` and serves the built SPA
from `dist/` when that directory exists (`server/index.ts`). There is no separate
frontend host and no build step at runtime.

Verified against this revision — the facts below were read out of the source, not
assumed. Where something is a convention rather than a guarantee, it says so.

> **Live VM scope:** the production server currently uses the base `docker-compose.yml`
> with its own PostgreSQL container. Follow [`HANDOFF-2026-09-22.md`](./HANDOFF-2026-09-22.md)
> and [`SECURITY-HARDENING-AND-CLEANUP-PLAN.md`](./SECURITY-HARDENING-AND-CLEANUP-PLAN.md)
> for that host. The managed-Postgres examples in this document are a separate deployment
> option and must not be used to replace the live VM's database service.

---

## 1. Environment variables

**The running application reads exactly two variables: `DATABASE_URL` and `PORT`.**
This was verified by grepping the whole repository:

```bash
grep -rn "process\.env\." --include="*.ts" --include="*.tsx" --include="*.mjs" \
  src server scripts vite.config.ts
```

The matches inside the running server are:

| File | Line | Variable | Used for |
| --- | --- | --- | --- |
| `server/index.ts` | 27 | `PORT` | Listen port, default `3001` |
| `server/index.ts` | 111 | `DATABASE_URL` | Reported as `postgresConfigured` on `/api/health` |
| `server/db.ts` | 42 | `DATABASE_URL` | Postgres pool connection string |

Everything else the grep returns is outside the server process and therefore not
part of the deployment contract:

| Variable | Read by | Why it is not in this list |
| --- | --- | --- |
| `API_PORT` | `vite.config.ts` | Dev/preview proxy target. Absent in a built SPA. |
| `DISABLE_HMR` | `vite.config.ts` | Dev-server file watching. Build-time only. |
| `DATABASE_URL` | `scripts/seed_postgres.ts` | The seed script, run by a human, not by the server. |
| `GIT_SHA`, `BUILT_AT` | `server/version.ts` | **Optional.** Build metadata for `/api/version`; both have safe fallbacks. |

`.env.example` documents `DATABASE_URL` and `PORT` only, which matches.

### Required in production

```bash
DATABASE_URL=postgresql://user:password@host:5432/nexg_db?sslmode=require
PORT=3001
```

`PORT` may be omitted; it defaults to 3001. `DATABASE_URL` may be omitted too, and
that is the important part of the next section.

---

## 2. PostgreSQL is required at runtime

The API retries its PostgreSQL connection during startup. If it cannot connect,
the process stays available for diagnostics, while `/api/health` and all
database-backed catalogue routes return HTTP `503`. The container healthcheck uses
`/api/health`, so Docker marks it unhealthy. Responses never include the raw
database connection error.

The production image does not copy or serve `src/data/seededCatalog.json`. The
generated bundle was removed from the browser discovery flow as well; discovery,
category, and search results come from PostgreSQL through the API. A database outage
therefore shows an explicit retryable error instead of sample merchants or items.

---

## 3. Docker

### Build

```bash
docker build -t nexg-concierge:2.1.0 \
  --build-arg GIT_SHA="$(git rev-parse HEAD)" \
  --build-arg BUILT_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)" .
```

The image is multi-stage: `node:24-alpine` builds the SPA, then a second
`node:24-alpine` installs production dependencies only and runs as the unprivileged
`node` user. Node 24 is required, not preferred — `CMD ["node", "server/index.ts"]`
executes TypeScript directly and the image contains no transpiler.

The build context is trimmed by `.dockerignore`. Do not exclude `public/fonts`:
Vite copies it into `dist/`, and the licensed webfonts are part of the shipped UI.
The generated catalogue JSON is no longer required by the app or production image.

### Run

```bash
docker run -d --name nexg-concierge \
  -p 3001:3001 \
  -e PORT=3001 \
  -e DATABASE_URL="postgresql://user:password@db-host:5432/nexg_db?sslmode=require" \
  --restart unless-stopped \
  nexg-concierge:2.1.0
```

Single port serves both the API and the SPA. `HEALTHCHECK` polls
`/api/health`; the first probe is delayed 15s because `initDb()` retries before it
degrades.

### Compose

```bash
docker compose up --build          # http://localhost:3001
docker compose logs -f app
docker compose down                # keeps the pgdata volume
docker compose down -v             # discards the catalogue as well
```

**Documented port mappings.** `docker-compose.yml` publishes two:

| Service | Host | Container | Note |
| --- | --- | --- | --- |
| `app` | `${PORT:-3001}` | 3001 | API + SPA |
| `postgres` | `${POSTGRES_HOST_PORT:-5433}` | 5432 | Host port is **5433 on purpose** |

Port **5433** is deliberate. Port 5432 on the development machine already belongs
to the unrelated NEXG POS Go platform (containers `nexg-postgres-1`, `nexg-api-1`,
`nexg-kernel-1` — see README). Do not "fix" the mapping to 5432.

The `app` service waits on `depends_on: condition: service_healthy`, so it never
starts against a Postgres that is merely running.

### Managed database (production override)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

`docker-compose.prod.yml` drops the `postgres` service, removes the base file's
`DATABASE_URL`, requires `.env`, and binds the app to `127.0.0.1` so TLS
termination stays with the reverse proxy in front of it.

---

## 4. Migrations and seeding

There is no migration framework. Schema and data are two idempotent SQL files
applied with `psql`:

| File | Contents | Safe to re-run |
| --- | --- | --- |
| `src/db/schema.sql` | 6 tables + `v_merchant_storefront`, `CREATE TABLE IF NOT EXISTS`, extensions created with `IF NOT EXISTS` | yes |
| `src/db/seed_excel.sql` | Generated catalogue; `TRUNCATE ... CASCADE` before `INSERT` | yes — replaces, never duplicates |

The npm scripts wrap this for local development:

```bash
npm run db:up      # provisions the Postgres 15 container on 127.0.0.1:5433, applies schema + seed
npm run db:seed    # re-applies the seed
npm run db:generate-sql   # regenerates seed SQL from the Excel workbook
```

Against any other database, including a managed one:

```bash
export DATABASE_URL='postgresql://user:password@host:5432/nexg_db?sslmode=require'

psql "$DATABASE_URL" -f src/db/schema.sql
psql "$DATABASE_URL" -f src/db/seed_excel.sql
```

Against the compose database, from the host:

```bash
docker compose exec -T postgres psql -U nexg_user -d nexg_db < src/db/schema.sql
docker compose exec -T postgres psql -U nexg_user -d nexg_db < src/db/seed_excel.sql
```

Notes that matter operationally:

- **`npm run db:seed` needs `tsx`, a dev dependency.** The production image installs
  with `--omit=dev`, so seeding from inside the app container is not possible. Run
  migrations from a machine or job that has full dependencies, or use `psql`.
- **`seed_excel.sql` is ~3.4 MB and truncates before inserting.** On a live database
  there is a window where the catalogue is empty. Pause traffic or accept the window;
  do not run it from a request handler.
- **`src/db/seed_excel.sql` is generated.** Never hand-edit it; regenerate via
  `npm run db:generate-sql`. The runtime JSON catalogue has been removed.
- The application performs **no migrations at boot**. `initDb()` only issues
  `SELECT 1`. A container that starts against an empty but reachable database will
  answer with empty result sets, not an error — that is the failure mode to watch
  for when a deploy "succeeds" and the UI is empty.

### TLS for managed Postgres

Managed providers require TLS. Append the parameter to the connection string:

```
postgresql://user:password@host:5432/nexg_db?sslmode=require
```

`server/db.ts` passes the string straight to `pg` and does not add its own `ssl`
option, so the URL parameter is the only TLS switch. Some providers hand you a
`postgres://` URL with `sslmode` already included — keep it verbatim.

---

## 5. Bare VPS with systemd

Prerequisites: Node 24, PostgreSQL 15, and the repository at `/srv/nexg-concierge`.

```bash
cd /srv/nexg-concierge
npm ci
npm run build          # emits dist/, which the API then serves
```

`/etc/systemd/system/nexg-concierge.service`:

```ini
[Unit]
Description=NEXG Concierge (API + SPA)
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=nexg
Group=nexg
WorkingDirectory=/srv/nexg-concierge
# Credentials belong in this file, mode 0600, owned by nexg — not in the unit,
# which is world-readable and lands in journal output on failure.
EnvironmentFile=/etc/nexg-concierge.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.ts
Restart=always
RestartSec=5
# The server traps SIGTERM, closes the pg pool and exits 0 (server/index.ts).
KillSignal=SIGTERM
TimeoutStopSec=20
# The API binds 3001 unprivileged; no capabilities needed.
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/nexg-concierge/logs

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nexg-concierge
systemctl status nexg-concierge
curl -s localhost:3001/api/health
```

`/etc/nexg-concierge.env`:

```bash
DATABASE_URL=postgresql://nexg:secret@127.0.0.1:5432/nexg_db
PORT=3001
GIT_SHA=<commit built>
BUILT_AT=<iso timestamp>
```

Put nginx or Caddy in front for TLS and to serve `dist/` directly if you prefer;
the app serves it either way, so a proxy is optional rather than required.

---

## 6. PaaS

Any platform that runs a Node process works. The contract is two commands and one
port:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Start command | `node server/index.ts` |
| Runtime | Node **24** (TypeScript is executed natively; there is no `tsx`/`ts-node` step) |
| Port | `PORT`, injected by the platform; the app reads it |

Then:

1. Provision a managed Postgres 15 and copy its connection string.
2. Set `DATABASE_URL` (with `?sslmode=require` if the provider does not add it).
3. Apply `src/db/schema.sql` then `src/db/seed_excel.sql` once, with `psql`, as a
   release job.
4. Point the health check at `/api/health`; require HTTP 200 and
   `postgresConnected == true`. A database outage returns HTTP 503 and marks the
   container unhealthy.

---

## 7. Zero-downtime notes

The application is stateless. Sessions, carts and cart state live in the browser;
the server holds no in-memory cache and no sticky routing requirement. That makes
rolling deploys straightforward, with these caveats:

- **Run at least two instances behind a load balancer.** One container can only be
  restarted, not rolled.
- **`/api/health` returns 200 while degraded.** Do not use it as a database
  readiness gate for the load balancer; use it as a liveness gate and alert on
  `source` separately.
- **Shutdown is graceful.** `SIGTERM` closes the pg pool and exits 0. Give the
  container 20 seconds (`TimeoutStopSec`, or `stop_grace_period` in compose) so
  in-flight requests finish.
- **Deploy by image digest, not by `latest`.** `release.yml` pushes both; only the
  digest is immutable.
- **Schema changes are additive-only.** `schema.sql` uses `CREATE TABLE IF NOT
  EXISTS` and never drops. A destructive change needs a hand-written migration and
  a two-phase deploy (expand, backfill, contract) — there is no tooling to do it
  for you, and `db:seed` truncates, so it is not a migration mechanism.
- **Cold start is slower than it looks.** `initDb()` retries a starting database for
  a few seconds. The container's `--start-period=15s` accounts for it; a rollout
  that probes sooner will kill healthy containers.

---

## 8. Rollback

Rollback is redeploying the previous artefact, because the build is the release.

**Docker / Compose**

```bash
docker pull ghcr.io/<owner>/nexg-concierge@sha256:<previous-digest>
docker tag  ghcr.io/<owner>/nexg-concierge@sha256:<previous-digest> nexg-concierge:rollback
docker compose up -d --no-build app      # or: docker run ... nexg-concierge:rollback
curl -s localhost:3001/api/health
```

**systemd**

```bash
cd /srv/nexg-concierge
git fetch --tags
git checkout v2.1.0        # the previous release tag
npm ci && npm run build
sudo systemctl restart nexg-concierge
```

**PaaS** — redeploy the previous release or image digest from the platform's
history.

What rollback does **not** cover:

- **Database changes.** Code rolls back; data does not. `seed_excel.sql` replaced the
  catalogue, and re-running the older seed is the only "rollback" available — it
  truncates. Take a dump before any seeding:
  `pg_dump "$DATABASE_URL" -Fc -f nexg-$(date +%F).dump`.
- **`package.json` version is baked into the image.** A rolled-back container reports
  its own version from `/api/version`, which is exactly why that endpoint exists.

Tag names are immutable by convention here: re-tagging an existing version means the
digest no longer identifies a release. Cut a new patch via `scripts/release.mjs`
instead.

---

## 9. Versioning and the release process

`package.json` is the single source of truth for the version. Nothing else in the
repository hardcodes it; `README.md` mentions v2.1.0 in prose and is updated by hand.

```bash
node scripts/release.mjs patch              # 2.1.0 -> 2.1.1
node scripts/release.mjs minor              # 2.1.0 -> 2.2.0
node scripts/release.mjs major              # 2.1.0 -> 3.0.0
node scripts/release.mjs 2.5.0              # explicit version
node scripts/release.mjs patch --dry-run    # print the plan, write nothing
node scripts/release.mjs patch --date 2026-03-01
```

The script updates `package.json` and `package-lock.json`, prepends a
`CHANGELOG.md` entry, then prints the git commands. It deliberately never runs
`git commit` or `git tag`: a release is the one irreversible action in this
repository, so the last step is a human reading the changelog and the diff.

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): v2.1.1"
git tag -a v2.1.1 -m "NEXG Concierge v2.1.1"
git push origin main && git push origin v2.1.1
```

Pushing the tag triggers `.github/workflows/release.yml`, which builds the image and
pushes it to GHCR tagged with the SemVer (`2.1.1`, `2.1`) and `latest`, with
provenance and an SBOM. A pre-release tag (`v2.1.1-rc.1`) does not move `latest`.

### Integration point — mounting `/api/version`

`server/version.ts` exports `versionInfo()`, which returns
`{ version, gitSha, builtAt, node }`. It is **not mounted yet**: this change was
scoped to avoid editing `server/index.ts`, so one line is left for a maintainer.
Add it beside the existing health route in `server/index.ts`:

```ts
import { versionInfo } from './version.ts';
app.get('/api/version', (_req: Request, res: Response) => res.json(versionInfo()));
```

That is the whole integration — no other file needs to change. The import follows
the file's existing `./db.ts` convention (explicit extension, required by Node's
TypeScript execution). Until it is wired, verify a deployed build from the image
labels or `docker inspect`, or by checking the SHA in the GHCR tag's provenance.

Response shape once mounted:

```json
{
  "version": "2.1.0",
  "gitSha": "8d82685",
  "builtAt": "2026-09-21T09:14:02Z",
  "node": "24.21.0"
}
```

`gitSha` falls back to reading `.git/HEAD` from a local checkout and then to
`"unknown"`; `builtAt` is `null` when nothing recorded it. Neither ever throws.

---

## 10. CI/CD

| Workflow | Trigger | Does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | push / PR to `main` or `master` | `npm ci`, then `npm run lint`, `npm test`, `npm run build` — in that order, failing fast |
| `.github/workflows/release.yml` | push of a `v*` tag | Builds the image, pushes to GHCR with SemVer + `latest` tags, provenance and SBOM |

CI runs **no services**, because the three gates need none. `npm run test:api`
(29 assertions against a live server and database), `npm run test:flow` and
`npm run test:consistency` are intentionally excluded — they belong to a
provisioned environment, not to the default pipeline. Run them locally with
`npm run db:up && npm run server` in one terminal before a release.

Superseded runs are cancelled by a `concurrency` group, and `open-pull-requests-limit`
plus grouped minor/patch updates in `.github/dependabot.yml` keep dependency PRs
readable. Weekly updates cover npm, GitHub Actions, and the Docker base images.

---

## 11. Post-deploy verification

```bash
curl -s "$APP_URL/api/health" | jq '{source, postgresConnected, totalMerchants, totalItems}'
curl -s "$APP_URL/api/version"                     # once the route is mounted
curl -s "$APP_URL/api/merchants?limit=3" | jq '.total'
curl -sI "$APP_URL/" | head -1                     # the SPA shell
```

The check that matters is the first one: `source` must be `postgres`, and
`totalMerchants` must be non-zero. A container that boots against an unseeded
database passes every other check in this list.

One standing production caveat from `docs/ARCHITECTURE.md`: CORS is
`Access-Control-Allow-Origin: *` and there is no authentication. Put this behind a
reverse proxy that either restricts access or sets a real origin allowlist before
exposing it publicly.
