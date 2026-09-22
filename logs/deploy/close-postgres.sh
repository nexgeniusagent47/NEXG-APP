#!/bin/bash
# Close the Postgres exposure.
#
# The first attempt missed this line because it is written with a variable —
# "${POSTGRES_HOST_PORT:-5433}:5432" — and the replacement only matched the literal "5433:5432".
# Worth recording: replacing port mappings by literal string is fragile, because the same
# mapping can be written several ways.
set -e
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "############ 1. THE LINE ############"
grep -n 'POSTGRES_HOST_PORT' docker-compose.yml | sed 's/^/  /'

echo
echo "############ 2. BIND IT TO LOOPBACK ############"
# Only an explicit host IP binds to one interface. Without it Docker publishes on 0.0.0.0 and
# its iptables rules bypass UFW, so the port is reachable from the internet even though the
# firewall looks closed. That is exactly how the old MySQL ended up exposed.
sed -i 's|- "\${POSTGRES_HOST_PORT:-5433}:5432"|- "127.0.0.1:${POSTGRES_HOST_PORT:-5433}:5432"|' docker-compose.yml

echo "--- result ---"
grep -n '127.0.0.1:\${POSTGRES_HOST_PORT' docker-compose.yml | sed 's/^/  /' || echo "  NOT REPLACED"

echo
echo "############ 3. VALIDATE ############"
docker compose config >/dev/null 2>&1 && echo "  compose VALID" || { echo "  INVALID"; exit 1; }

echo
echo "############ 4. RECREATE POSTGRES ############"
docker compose up -d --force-recreate postgres 2>&1 | tail -5 | sed 's/^/  /'
for i in $(seq 1 40); do
  p=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-postgres-1 2>/dev/null || echo pending)
  [ "$p" = healthy ] && { echo "  healthy after ${i}s"; break; }
  sleep 2
done

echo
echo "############ 5. VERIFY ############"
docker ps --format '  {{.Names}} | {{.Ports}}'
echo "--- listeners ---"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u | sed 's/^/  /'

echo
echo "--- is 5433 reachable on the PUBLIC ip? ---"
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/212.95.32.229/5433' 2>/dev/null \
  && echo "  STILL OPEN - investigate" \
  || echo "  CLOSED to the internet"
echo "--- reachable on loopback? (must be yes, for admin access) ---"
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/5433' 2>/dev/null \
  && echo "  yes" \
  || echo "  no"

echo
echo "############ 6. THE APP STILL WORKS ############"
curl -sS -o /dev/null -w '  through nginx -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/health
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health | python3 -c "
import sys,json
d=json.load(sys.stdin)
print('  source =', d.get('source'), '| merchants =', d.get('totalMerchants'), '| items =', d.get('totalItems'))
"

echo
echo "############ 7. PORTS THAT SHOULD BE PUBLIC NOW ############"
echo "  expected: 22 (ssh), 80 (http). Nothing else."
ss -ltn 2>/dev/null | awk 'NR>1 {split($4,a,":"); print a[length(a)]}' | sort -un | while read -r p; do
  case "$p" in
    22|80) echo "    $p  public, expected" ;;
    *) echo "    $p  <-- check this one" ;;
  esac
done

echo
echo "=== DONE ==="
