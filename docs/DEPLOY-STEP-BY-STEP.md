# Production deployment and HTTPS runbook

**Status (2026-09-25):** Production is serving NEXG App 2.2.0, commit
`b89350d78c1bcacf040f58696d291ceb9aa1035a`. Both Cloudflare Full (strict) TLS and the app
deployment have been verified. The previous production app image is retained for rollback.
This runbook describes the live topology and the commit-pinned release method.

## Verified production topology

- Server: `root@212.95.32.229`
- Stable project directory and production `.env`:
  `/var/www/apps/projects/nexg-concierge` (the `.env` is root-owned mode 600)
- Compose project: `nexg-concierge`; services: `app`, `postgres`
- App: host `127.0.0.1:3101` to container port 3001; one process serves API and SPA
- PostgreSQL: host `127.0.0.1:5433` to container port 5432; named volume
  `nexg-concierge-pgdata`; never publish it to a public interface
- Nginx: only public app entry point, HTTP :80 redirecting to HTTPS :443, proxying to
  `127.0.0.1:3101`. Tracked template:
  [`../deploy/nginx/nexgapp.com.conf`](../deploy/nginx/nexgapp.com.conf)
- Cloudflare SSL/TLS mode: **Full (strict)**. Origin certificate:
  `/etc/ssl/certs/nexgapp-origin-20260925.pem`; private key:
  `/etc/ssl/private/nexgapp-origin-20260925.key` (root-only; never copy into the repository).

Use the base `docker-compose.yml`. The `docker-compose.prod.yml` override assumes a managed
PostgreSQL service and removes the database container used on this host.

## Release procedure

1. Start from a clean, reviewed commit that has passing GitHub CI and production-simulation
   workflows. Record the full commit SHA and build timestamp.
2. Create a Git archive of that commit, not a zip/tar of the working directory. This makes the
   release immutable and excludes local credentials. On Windows, write the archive with Git's
   `--output` option; do not use PowerShell `>` for binary data.
3. Calculate SHA-256 locally, copy the archive to `/root/backups/`, and compare the remote hash.
   Run `unzip -t` before extraction.
4. Extract to a new, empty
   `/var/www/apps/projects/nexg-concierge/releases/<full-commit-sha>` directory. Never unpack over
   the stable project directory. Copy the existing production `.env` into the release directory
   with owner root and mode 600; do not print its contents. Keep the source archive and release
   directory for audit and rollback.
5. Before building, preserve the image referenced by the running container under a unique rollback
   tag. Do not retag or prune it until the release is accepted.
6. Build only the app with explicit `GIT_SHA` and `BUILT_AT` build args. Use the production
   `.env` for Compose interpolation and the protected release copy as the optional container
   `env_file`.
7. Recreate only the app service with `up -d --no-deps --wait --no-build app`. Do not restart
   PostgreSQL, run schema/seed scripts, or run `docker compose down`.
8. Verify the container is healthy; `/api/version` reports the release SHA; `/api/health` reports
   `source=postgres`, 21 categories, 128 subcategories, 640 merchants and 6,000 items; and
   public home, categories, merchants and search routes respond. Verify HTTPS and that diagnostics
   remain blocked until Zero Trust is in place. Check that the PostgreSQL container ID and named
   volume are unchanged.
9. If the app fails post-deploy, retag the preserved previous image as
   `nexg-concierge-app:latest` and run the same Compose `up --no-build` command against the
   release compose file. Confirm health and version before considering the rollback complete.

### Compose command shape

Run from PowerShell or SSH with values set to the exact release. Do not substitute the stable
project directory for the release directory:

```bash
root=/var/www/apps/projects/nexg-concierge
sha="REPLACE_WITH_FULL_COMMIT_SHA"
built_at="REPLACE_WITH_ISO_8601_UTC_TIMESTAMP"
release="$root/releases/$sha"
compose=(docker compose --project-name nexg-concierge --project-directory "$release" \
  --env-file "$root/.env" -f "$release/docker-compose.yml")
"${compose[@]}" build --build-arg "GIT_SHA=$sha" \
  --build-arg "BUILT_AT=$built_at" app
"${compose[@]}" up -d --no-deps --wait --no-build app
"${compose[@]}" ps
curl -fsS -H 'Host: nexgapp.com' http://127.0.0.1:3101/api/version
curl -fsS -H 'Host: nexgapp.com' http://127.0.0.1:3101/api/health
```

## Production invariants

- `AUTH_SECRET` is required and must be at least 32 characters. Compose should fail before
  startup when it is missing.
- `DATABASE_URL` uses the Compose service hostname `postgres` and container port 5432. Never
  put `127.0.0.1` in the app container's database URL.
- Preserve the existing database volume. Never run `docker compose down -v`, a live seed, or a
  migration as part of an app-only release.
- Do not use `docker-compose.prod.yml` on this self-hosted database deployment.
- The 2026-09-25 backup
  `/root/backups/nexg-release-20260925T053027Z.dump` passed an isolated restore rehearsal;
  see the sibling `*.restore-evidence.txt`. An encrypted off-host copy remains outstanding.
- No Cloudflare Access application is active. Nginx currently returns 404 for metrics/traces
  reads and 403 for telemetry reads, including common case and trailing-slash variants. Keep
  that temporary block until the future Access and origin-token work passes its own verification.
- The operations dashboard's private data is unavailable until that future work. See
  [Zero Trust for NEXG App](ZERO-TRUST-ACCESS.md).

## Current deployment evidence

- Commit: `b89350d78c1bcacf040f58696d291ceb9aa1035a`; version `2.2.0`
- Archive SHA-256:
  `81c67d0be48675e1c7397c00310b1fda08fe0bc2dec7b5b647a4936f7cff8714`
- New app image:
  `sha256:aeb8b198c097405ab7f6ed344c507549de866e9a9027b0b01e7b2b01c673cd6f`
- Previous image retained as `nexg-concierge-app:rollback-before-b89350d`
- Cloudflare served the site and API over Full (strict); HTTP redirected to HTTPS on both hosts.
- Public version, health, categories, merchants and search returned 200. Health reported all 6,000
  PostgreSQL items. Metrics/traces variants returned 404 and telemetry read variants returned 403.
