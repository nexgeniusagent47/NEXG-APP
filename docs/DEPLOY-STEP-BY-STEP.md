# Deploying NEXG Concierge

A first deployment, written to be followed in order. Every command has been rehearsed on
a local Docker daemon against the real production image, and the results below are
measured rather than expected.

Target server (as supplied):

| Item | Value |
| --- | --- |
| Host | `212.95.32.229` |
| SSH | `root@212.95.32.229` — **credentials still needed; see §1** |
| Code | `/var/www/apps/projects/nexg/{backend,front-end}` |
| Docker configs | `/var/www/apps/{docker-compose.yml, Dockerfile, docker-compose/nginx/}` |
| Deployment user | `deployer` |
| Containers | `nexg-apps` (app), `nexg-apps-db` (Postgres), `nexg-apps-nginx` (nginx) |

---

## 0. What the rehearsal proved

Before touching the server, the whole stack was built and run locally. This is the
evidence, so nothing below is a guess:

```
docker build                                  -> image built, sha256:5ff5c276...
docker run with NO AUTH_SECRET                -> CRASHES (see §2)
docker compose up -d --wait                   -> app healthy, postgres healthy
psql < src/db/schema.sql                      -> CREATE TABLE, indexes, view
psql < src/db/seed_excel.sql                  -> COMMIT in 3s
row counts    categories=21 subcats=128 merchants=640 items=6000
/api/health   200  source=postgres
/api/merchants?limit=2    total=640
/api/version  200  2.1.0
/api/metrics  200        /api/traces  200
SPA /         200  renders in a browser, 35 buttons, zero page errors
              images served from the ladder: nexg-logo-320.webp at 320px natural width
live.js       CORRECTLY ABSENT from the production bundle
```

Two of those lines matter more than the rest and both are in §2.

---

## 1. What is still missing before we can start

I cannot connect yet, and I would rather ask than guess:

1. **SSH credentials.** You gave the IP and `root@`, but no key or password. Two better
   options than a root password:
   - add my public key, or
   - give me a `deployer`-owned key, since §4 is all done as `deployer` anyway.
2. **Domain or IP-only?** nginx can serve plain HTTP on the IP, or terminate TLS for a
   hostname. If you have a domain, point its `A` record at `212.95.32.229` first and TLS
   becomes a two-command step with certbot. This changes §6 only.
3. **Is the old site still serving traffic?** If something else already occupies ports 80
   and 443 on that host, we plan around it rather than surprising it.

---

## 2. Two things that would have broken the deploy

Both were found by running the image, not by reading it.

### 2.1 The app crash-loops without `AUTH_SECRET`

Measured, on the built image with no secret:

```
file:///app/server/auth/crypto.ts:155
Error: AUTH_SECRET must be set to at least 32 characters.
    at secret (server/auth/crypto.ts:155:11)
    at assertAuthConfigured (server/auth/crypto.ts:165:3)
    at registerAuthRoutes (server/auth/routes.ts:152:3)
    at server/index.ts:284
```

`AUTH_SECRET` was in **neither** compose file. It worked locally only because `.env` had
one, so this would have appeared on the server as a restart loop whose cause is buried in
`docker compose logs`.

Fixed by making it required at *compose* level, so a missing secret stops the deploy
immediately and names itself:

```yaml
AUTH_SECRET: "${AUTH_SECRET:?...Generate one with: node -e \"...\"}"
```

### 2.2 `docker-compose.prod.yml` assumes a managed database — you run a container

The production override does this:

```yaml
postgres: !reset null          # drops the Postgres container entirely
DATABASE_URL: !reset null      # must come from the provider
```

That is correct for a managed database (RDS, Neon, Supabase). Your architecture is three
containers including `nexg-apps-db`, so **the prod override is the wrong file for you.**
We deploy the *base* `docker-compose.yml`, which already keeps Postgres internal to the
compose network.

---

## 3. Decide the shape first

Your three containers map onto the base compose file like this:

| Your name | compose service | Notes |
| --- | --- | --- |
| `nexg-apps-db` | `postgres` | Internal only. **Do not publish 5433.** |
| `nexg-apps` | `app` | Serves API **and** the built SPA on one port: 3001 |
| `nexg-apps-nginx` | *not in the repo* | Reverse proxy, terminates TLS, serves 80/443 |

The app container already serves the SPA, so nginx has one job: proxy to `app:3001`. It
does not need a second upstream or static file root.

---

## 4. Deploy, in order

Every step runs as `deployer`, not root. `deployer` must be in the `docker` group or
every command needs `sudo`:

```bash
sudo usermod -aG docker deployer     # then log out and back in
```

### 4.1 Put the code and configs in place

```bash
sudo -u deployer -i
cd /var/www/apps/projects/nexg
git clone <your-remote> backend      # or `git pull` if it already exists
cd backend && git log --oneline -1   # confirm the commit you intend to ship
```

Compose files and the nginx config live one level up, per your layout:

```
/var/www/apps/
├── docker-compose.yml          <- copy from the repo
├── docker-compose.prod.yml     <- NOT used; see §2.2
├── .env                        <- create in §4.2, never committed
└── docker-compose/nginx/       <- nginx.conf / site config
```

### 4.2 Create the secrets file

```bash
cd /var/www/apps
openssl rand -base64 48 | tr -d '\n' > /tmp/secret        # 64 chars, well over the 32 minimum
cat > .env <<EOF
AUTH_SECRET=$(cat /tmp/secret)
POSTGRES_HOST_PORT=5433
PORT=3001
EOF
shred -u /tmp/secret
chmod 600 .env
```

`AUTH_SECRET` must be **≥ 32 characters** or the app refuses to boot. Generate it once per
environment; do not reuse the local one. Rotating it invalidates every existing session,
which is the intended behaviour of a signing key.

**Do not set `DATABASE_URL` here.** The base compose file supplies
`postgresql://nexg_user:...@postgres:5432/nexg_db` using the compose service name as the
hostname. A `DATABASE_URL` in `.env` would point at `127.0.0.1`, which inside the app
container is the container itself, and the app would silently fall back to the bundled
JSON catalogue while reporting healthy. If `/api/health` ever says
`seeded_json_fallback` in production, this is why.

### 4.3 Build and start

```bash
cd /var/www/apps
docker compose build --build-arg GIT_SHA=$(cd projects/nexg/backend && git rev-parse --short HEAD)
docker compose up -d --wait
docker compose ps
```

Expect both services `Up (healthy)`. If `app` is restarting, read §7 before anything else.

### 4.4 Create the schema and load the catalogue

`<` redirection does not work in PowerShell; on Linux it is fine. Run them in this order,
and note that `seed.sql` is a 4-merchant demo while `seed_excel.sql` is the real
catalogue:

```bash
cd /var/www/apps
docker compose exec -T postgres psql -U nexg_user -d nexg_db -v ON_ERROR_STOP=1 < projects/nexg/backend/src/db/schema.sql
docker compose exec -T postgres psql -U nexg_user -d nexg_db -v ON_ERROR_STOP=1 < projects/nexg/backend/src/db/seed_excel.sql
```

Then confirm — this should read exactly `21 | 128 | 640 | 6000`:

```bash
docker compose exec -T postgres psql -U nexg_user -d nexg_db -c \
  "SELECT (SELECT count(*) FROM categories) AS cats,
          (SELECT count(*) FROM subcategories) AS subs,
          (SELECT count(*) FROM merchants) AS merchants,
          (SELECT count(*) FROM items) AS items;"
```

Both scripts are idempotent (`CREATE TABLE IF NOT EXISTS`, `TRUNCATE ... CASCADE`), so
re-running them is safe. **They are deliberately not wired into the postgres entrypoint:**
Postgres only runs init scripts against an empty data directory, so an auto-seed would
silently do nothing on the second `up` and leave you serving only the JSON fallback while
looking provisioned.

### 4.5 Verify before involving nginx

```bash
curl -s localhost:3001/api/health   | head -c 300
curl -s localhost:3001/api/version
curl -so /dev/null -w '%{http_code}\n' localhost:3001/
```

`/api/health` must report `"source":"postgres"`. If it reports
`"seeded_json_fallback"`, the app cannot reach the database — fix that now, because nginx
will faithfully proxy a broken app.

`/api/version` reads `GIT_SHA`, which is why §4.3 passes it. A plain build reports
`"gitSha":"unknown"` rather than inventing a commit.

### 4.6 nginx

Your nginx container joins the same network as `app` and proxies to the service name:

```nginx
server {
    listen 80;
    server_name your-domain-or-ip;

    # Generous: the SPA is ~4 MB of lazy chunks and image ladder on first load.
    client_max_body_size 12m;

    location / {
        proxy_pass http://app:3001;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # SSE / long-poll friendly; harmless for normal requests.
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

`X-Forwarded-Proto` is not optional here: the session cookies are issued `Secure` when
`NODE_ENV=production`, so without it a TLS-terminating proxy makes the cookie look
insecure and login silently fails to persist.

Then TLS, if you have a domain:

```bash
docker compose exec nexg-apps-nginx certbot --nginx -d your-domain
```

With an IP only there is no public CA that will issue a certificate; plain HTTP is the
honest option until a domain exists.

---

## 5. What "deployed" looks like

```
Internet -> :443 nginx (TLS) -> app:3001 (API + SPA) -> postgres:5432
                                    |
                                127.0.0.1:3001   <- loopback only, not exposed
```

Only nginx publishes ports. `app` and `postgres` stay on the compose network.

---

## 6. Shipping changes after that

The loop you asked for. On your machine:

```bash
git push
```

On the server, as `deployer`:

```bash
cd /var/www/apps/projects/nexg/backend && git pull
cd /var/www/apps && docker compose build --build-arg GIT_SHA=$(git -C projects/nexg/backend rev-parse --short HEAD)
docker compose up -d
docker compose ps
```

`up -d` recreates only what changed. For a change touching only the front end, the image
still rebuilds because the SPA is compiled into it — that is the cost of shipping one
image instead of two.

This is also in the repo as `scripts/release.mjs`, which tags a version and records the
SHA. Check whether you want that driving releases or staying a developer convenience.

**A warning worth taking seriously:** your data lives in the `nexg-concierge-pgdata`
named volume. `docker compose down` keeps it; **`docker compose down -v` deletes it**,
including the catalogue. Back up before the first risky change:

```bash
docker compose exec -T postgres pg_dump -U nexg_user nexg_db | gzip > ~/backups/nexg-$(date +%F).sql.gz
```

---

## 7. Observability — what you asked to watch yourself

Everything is already exposed; nothing extra to install.

```bash
# Aggregate health, request counts, latency percentiles, error rate, DB state
curl -s localhost:3001/api/metrics | jq .

# Recent spans, each with traceId/spanId/duration/status
curl -s 'localhost:3001/api/traces?limit=20' | jq .

# Prometheus format, if you would rather scrape than poll
curl -s 'localhost:3001/api/metrics?format=prometheus'

# Build identity and runtime
curl -s localhost:3001/api/version | jq .
```

There is also a human dashboard at `/?page=metrics` — a developer surface, deliberately
outside the customer product. It polls every 5 seconds and shows requests/min with a
sparkline, the latency histogram, error rate, slowest routes by p95, recent traces, and
the data-source panel. **Watch `Data source` there:** if it flips to
`seeded_json_fallback`, the app lost the database.

Logs are one JSON object per line on stdout:

```bash
docker compose logs -f app | jq -c '{level,msg,requestId}'
```

Credentials are redacted before they reach stdout, and SQL parameters are never recorded
in traces, so it is safe to keep these logs.

**Alerts do not exist yet.** Nothing pages you. That is a deliberate remaining gap, not an
oversight — see `docs/OBSERVABILITY.md`.

---

## 8. Troubleshooting, in the order to check

| Symptom | Check |
| --- | --- |
| `app` restarting immediately | `docker compose logs app`. If it names `AUTH_SECRET`, §4.2 did not take. |
| App healthy but empty catalogue | `/api/health` — `seeded_json_fallback` means `DATABASE_URL` is wrong or Postgres is unreachable. |
| 502 from nginx | Is nginx on the same compose network? `proxy_pass http://app:3001` needs the *service* name, not `localhost`. |
| Login does not persist | `X-Forwarded-Proto` missing, so `Secure` cookies are dropped (§4.6). |
| Everything works, then dies after a reboot | `restart` policy is `unless-stopped`; check the daemon started at all — `systemctl status docker`. |
| Permission denied on `docker` | `deployer` is not in the `docker` group, or the session predates the change. Log out and back in. |

---

## 9. Honest limits of this document

- **I have not run a command on your server.** Everything above is rehearsed locally on
  the real image against a real Postgres, which is strong evidence, but your host is
  unknown to me: its Docker version, its firewall, and whatever else already listens on
  80/443.
- **I have not seen your existing `docker-compose.yml` or nginx configs.** Yours are at
  `/var/www/apps`; the ones here came from this repo. They will need reconciling, and I
  would rather read yours first than overwrite them.
- **`docs/DEPLOYMENT.md` in this repo documents the managed-database path**, which is not
  your architecture. §2.2 explains the difference. That document should be updated once
  we know which shape you are standardising on.
- **No rollback plan is written yet.** Before the first deploy that carries real
  consequences, we should agree on one; the image tag and the `pg_dump` in §6 are the raw
  materials.
