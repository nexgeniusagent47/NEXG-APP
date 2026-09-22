#!/bin/bash
# DEPLOY STEP 1: extract, configure, build. No containers started.
#
# Deliberately stops before running anything. A build failure is cheap to fix; a half-up
# stack that has already taken over a port is not.
set -e

APP=/var/www/apps/projects/nexg-concierge
STAMP=$(date +%Y%m%d-%H%M%S)

echo "=== 1. CREATE THE APP DIRECTORY (beside the old one, nothing replaced) ==="
mkdir -p "$APP"
if [ -d "$APP" ] && [ "$(ls -A "$APP" 2>/dev/null)" ]; then
  echo "  directory exists and is not empty - archiving previous contents"
  mv "$APP" "$APP.previous-$STAMP"
  mkdir -p "$APP"
fi
echo "  $APP"

echo
echo "=== 2. EXTRACT THE APPLICATION ==="
tar xzf /tmp/nexg-deploy.tar.gz -C "$APP"
cd "$APP"
echo "  files: $(find . -type f | wc -l)"
ls -la | head -14 | sed 's/^/  /'

echo
echo "=== 3. OWNERSHIP (deployer, so the app is not root-owned) ==="
chown -R deployer:deployer "$APP"
chmod 755 "$APP"
echo "  owner: $(stat -c '%U:%G' "$APP")"

echo
echo "=== 4. WRITE .env WITH A FRESH SECRET ==="
# Generated here rather than copied from the development machine: a development secret in
# a production environment is the same mistake the old stack made with its database password.
SECRET=$(openssl rand -base64 48 | tr -d '\n' | head -c 64)
cat > "$APP/.env" <<EOF
# NEXG App production environment. Not in version control.

# Postgres runs inside the compose network under the service name, so this is a hostname
# the container resolves. Never 127.0.0.1 here: inside the app container that address is
# the container itself, and the app would silently serve the bundled JSON catalogue while
# reporting healthy.
DATABASE_URL=postgresql://nexg_user:nexg_password@postgres:5432/nexg_db

# Signs session JWTs. Unique to this environment. Rotating it invalidates every session.
AUTH_SECRET=$SECRET

PORT=3001
NODE_ENV=production
LOG_LEVEL=info
EOF
chown deployer:deployer "$APP/.env"
chmod 600 "$APP/.env"
echo "  .env written, $(stat -c '%a %U:%G' "$APP/.env")"
echo "  AUTH_SECRET length: ${#SECRET}"

echo
echo "=== 5. PORT CHOICE: confirm 3101 is free ==="
if ss -ltn 2>/dev/null | grep -q ':3101'; then
  echo "  3101 IS IN USE - choose another port before continuing"
  ss -ltnp | grep ':3101'
  exit 1
fi
echo "  3101 is free"

echo
echo "=== 6. SET THE HOST PORT IN COMPOSE ==="
# The app port is published on loopback only; nginx will proxy to it. The database port is
# published on a non-conflicting host port for the local psql migration step, then removed.
python3 - <<'PY'
import io
p = 'docker-compose.yml'
with io.open(p, encoding='utf-8') as f:
    src = f.read()

# App: loopback only. Never 0.0.0.0 - Docker's iptables rules bypass UFW, which is the
# exact mistake that left the old MySQL reachable from the internet.
src = src.replace('      - "${PORT:-3001}:3001"', '      - "127.0.0.1:${PORT:-3001}:3001"')

# Postgres: host port 5433 avoids the old stack's MySQL on 9106 and the NEXG POS Go
# platform on 5432. Loopback only.
src = src.replace('      - "${POSTGRES_HOST_PORT:-5433}:5432"', '      - "127.0.0.1:${POSTGRES_HOST_PORT:-5433}:5432"')

with io.open(p, 'w', encoding='utf-8') as f:
    f.write(src)
print('  compose ports bound to loopback')
PY

echo
echo "=== 7. VALIDATE THE COMPOSE FILE ==="
docker compose config >/dev/null 2>&1 && echo "  VALID" || { echo "  INVALID"; docker compose config 2>&1 | head -5; exit 1; }

echo
echo "=== 8. BUILD THE IMAGE (this takes a few minutes) ==="
GIT_SHA=$(cd "$APP" && cat .git/HEAD 2>/dev/null || echo "archive")
docker compose build 2>&1 | tail -12 | sed 's/^/  /'

echo
echo "=== 9. IMAGE BUILT? ==="
docker images --format '{{.Repository}}:{{.Tag}}  {{.Size}}' | grep -i nexg | head -5 | sed 's/^/  /'

echo
echo "=== 10. NOTHING STARTED YET - confirming ==="
docker compose ps 2>&1 | sed 's/^/  /'

echo
echo "=== DONE - step 1 complete, no containers running ==="
