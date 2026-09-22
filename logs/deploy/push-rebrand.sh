#!/bin/bash
# Deploy the rebrand to the running server.
#
# The .env is preserved: it holds the production AUTH_SECRET and DATABASE_URL, and the
# archive contains only tracked files, so .env is not in it and must not be overwritten.
set -e
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== 1. PRESERVE PRODUCTION CONFIG ==="
cp .env /tmp/nexg-prod.env
echo "  .env saved (AUTH_SECRET ${#AUTH_SECRET} chars via file, $(grep -c '=' .env) lines)"
grep -E '^(PORT|NODE_ENV)=' .env | sed 's/^/  /'

echo
echo "=== 2. EXTRACT THE NEW BUILD OVER IT ==="
# --overwrite replaces tracked files; it does not delete anything the new tree lacks, so a
# file removed from the repo would linger. None were removed in this change, and the build
# output is regenerated anyway.
tar xzf /tmp/nexg-rebrand.tar.gz -C "$APP" --overwrite
echo "  extracted"

echo
echo "=== 3. RESTORE PRODUCTION CONFIG ==="
cp /tmp/nexg-prod.env .env
rm -f /tmp/nexg-prod.env
chown deployer:deployer .env
chmod 600 .env
echo "  .env restored: $(stat -c '%a %U:%G' .env)"
grep -E '^PORT=' .env | sed 's/^/  /'
echo "  DATABASE_URL host: $(grep '^DATABASE_URL=' .env | sed 's/.*@//;s|/.*||')"

echo
echo "=== 4. REBUILD THE IMAGE ==="
docker compose build 2>&1 | tail -6 | sed 's/^/  /'

echo
echo "=== 5. ROLLING RESTART (app only, database untouched) ==="
docker compose up -d app >/dev/null 2>&1
for i in $(seq 1 40); do
  state=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-app-1 2>/dev/null || echo pending)
  [ "$state" = "healthy" ] && { echo "  healthy after ${i}s"; break; }
  sleep 2
done

echo
echo "=== 6. VERIFY THE REBRAND IS LIVE ==="
echo "--- health ---"
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('  source =', d.get('source'), '| merchants =', d.get('totalMerchants'), '| items =', d.get('totalItems'))
"
echo "--- does any 'NEXG Concierge' remain in the served bundle? ---"
REMAIN=$(curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | grep -c 'NEXG Concierge' || true)
echo "  index.html occurrences: $REMAIN"
for f in dist/assets/index-*.js; do
  [ -f "$f" ] && echo "  $(basename "$f"): $(grep -c 'NEXG Concierge' "$f" 2>/dev/null || echo 0) occurrences of the old name"
done
echo "--- and does the NEW name appear? ---"
for f in dist/assets/index-*.js; do
  [ -f "$f" ] && echo "  $(basename "$f"): $(grep -c 'NEXG App' "$f" 2>/dev/null || echo 0) occurrences of NEXG App"
done

echo
echo "=== 7. PUBLIC SITE ==="
curl -sS -o /dev/null -w '  https://nexgapp.com/  -> %{http_code}\n' https://nexgapp.com/ 2>&1 || true
curl -sS https://nexgapp.com/ 2>/dev/null | grep -oE '<title>[^<]*</title>' | head -1 | sed 's/^/  /'

echo
echo "=== DONE ==="
