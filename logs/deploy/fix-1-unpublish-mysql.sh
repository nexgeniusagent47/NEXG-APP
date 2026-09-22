#!/bin/bash
# SECURITY FIX #1: unpublish the MySQL port.
#
# WHY: 9106 was published on 0.0.0.0, and Docker writes its own iptables DNAT rules
# ahead of UFW's chain — so published container ports are reachable from the internet
# regardless of the firewall. That put MySQL, with its root password in a plaintext
# compose file, on the public internet.
#
# SAFETY: verified beforehand that nothing connects from outside. Laravel reaches the
# database as `mysql:3306` over the compose network, so removing the host mapping does
# not affect it. The app and db share `apps_nexg-apps`.
set -e

cd /var/www/apps

echo "=== 1. BACKUP the compose file ==="
STAMP=$(date +%Y%m%d-%H%M%S)
cp -v docker-compose.yml "docker-compose.yml.bak-$STAMP"
ls -la docker-compose.yml.bak-* | tail -3

echo
echo "=== 2. BEFORE ==="
grep -n -B3 -A3 '9106' docker-compose.yml

echo
echo "=== 3. APPLY: replace the published port with an internal-only expose ==="
python3 - <<'PY'
import re, io

path = 'docker-compose.yml'
with io.open(path, encoding='utf-8') as f:
    src = f.read()

# Remove the `ports:` block that publishes 9106, and replace it with `expose:` so the
# intent is explicit: reachable on the compose network, not on the host.
old = """    ports:
      - 9106:3306
"""
new = """    # SECURITY: the port was published on 0.0.0.0 and Docker's iptables DNAT rules
    # bypass UFW, so MySQL was reachable from the public internet. `expose` documents
    # that it must be reachable on the compose network only.
    expose:
      - "3306"
"""

if old not in src:
    raise SystemExit('PATTERN NOT FOUND - aborting, nothing written')

src = src.replace(old, new)

with io.open(path, 'w', encoding='utf-8') as f:
    f.write(src)
print('compose file rewritten')
PY

echo
echo "=== 4. AFTER ==="
grep -n -B4 -A3 'expose:' docker-compose.yml

echo
echo "=== 5. VALIDATE the file parses BEFORE restarting anything ==="
docker compose config >/dev/null && echo "  compose config: VALID" || { echo "  compose config INVALID - restoring backup"; cp "docker-compose.yml.bak-$STAMP" docker-compose.yml; exit 1; }

echo
echo "=== 6. RECREATE ONLY THE mysql SERVICE (leaves nginx and php untouched) ==="
docker compose up -d mysql

echo
echo "=== 7. WAIT FOR HEALTHY ==="
for i in $(seq 1 30); do
  state=$(docker inspect --format '{{.State.Health.Status}}' nexg-apps-db 2>/dev/null || echo "unknown")
  echo "  t+${i}s: $state"
  [ "$state" = "healthy" ] && break
  sleep 2
done

echo
echo "=== 8. VERIFY ==="
echo "--- container status ---"
docker ps --format '{{.Names}} | {{.Ports}} | {{.Status}}' | grep -E 'nexg-apps'

echo
echo "--- is 9106 still published on the host? ---"
if ss -ltn 2>/dev/null | grep -q ':9106'; then
  echo "  STILL LISTENING on 9106 - FIX DID NOT WORK"
else
  echo "  port 9106 is NO LONGER listening on the host - FIX APPLIED"
fi

echo
echo "--- can the app still reach the database? ---"
docker exec nexg-apps php -r '
$h = getenv("DB_HOST") ?: "mysql";
$p = getenv("DB_PORT") ?: "3306";
$c = @fsockopen($h, (int)$p, $e, $s, 5);
echo $c ? "  app -> $h:$p  OK\n" : "  app -> $h:$p  FAILED ($s)\n";
' 2>/dev/null || echo "  (php check unavailable, will verify via the site instead)"

echo
echo "--- is the live site still serving? ---"
curl -sS -o /dev/null -w '  http://127.0.0.1/ (Host: nexgapp.com) -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
curl -sS -o /dev/null -w '  /api -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api 2>&1 || true

echo
echo "=== DONE ==="
