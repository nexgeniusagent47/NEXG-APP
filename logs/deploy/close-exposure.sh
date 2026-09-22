#!/bin/bash
# Close and protect the exposed backend.
#
# WHY IT WAS EXPOSED
# Docker publishes a port on ALL interfaces when the mapping has no host IP:
#     "${PORT:-3001}:3001"   ->  0.0.0.0:3101
#     "5433:5432"            ->  0.0.0.0:5433
# Only an explicit "127.0.0.1:" prefix binds to loopback. The compose files on this server
# were rewritten at 21:05, which replaced the loopback-bound mappings with these — that is
# what reopened the ports. `docker inspect` confirms it: HostIp is "" for both, and an empty
# HostIp means every interface.
set -e
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"
STAMP=$(date +%Y%m%d-%H%M%S)

echo "############ 1. BACK UP THE COMPOSE FILES ############"
cp -v docker-compose.yml "docker-compose.yml.bak-$STAMP"

echo
echo "############ 2. THE EXACT LINES ############"
grep -n 'PORT:-3001\|5433:5432' docker-compose.yml | sed 's/^/  /'

echo
echo "############ 3. BIND BOTH TO LOOPBACK ############"
python3 - <<'PY'
import io
p = 'docker-compose.yml'
src = io.open(p, encoding='utf-8').read()
orig = src

# App: the container listens on ${PORT} and the host side must be loopback.
src = src.replace('- "${PORT:-3001}:3001"', '- "127.0.0.1:${PORT:-3001}:3001"')
# Postgres: host 5433, loopback only.
src = src.replace('- "5433:5432"', '- "127.0.0.1:5433:5432"')

if src == orig:
    print('  WARNING: nothing replaced - the port lines are not in the expected form')
else:
    io.open(p, 'w', encoding='utf-8').write(src)
    print('  compose updated')
PY

echo
echo "--- result ---"
grep -n '127.0.0.1:' docker-compose.yml | sed 's/^/  /'

echo
echo "############ 4. VALIDATE BEFORE RECREATING ############"
docker compose config >/dev/null 2>&1 && echo "  compose VALID" || { echo "  INVALID"; docker compose config 2>&1 | head -5; exit 1; }
echo "--- published bindings after the change ---"
docker compose config 2>/dev/null | grep -B1 -A2 'published:' | grep -E 'published:|host_ip:' | sed 's/^/  /'

echo
echo "############ 5. RECREATE ############"
docker compose up -d --force-recreate app postgres 2>&1 | tail -6 | sed 's/^/  /'
for i in $(seq 1 40); do
  a=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-app-1 2>/dev/null || echo pending)
  p=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-postgres-1 2>/dev/null || echo pending)
  [ "$a" = healthy ] && [ "$p" = healthy ] && { echo "  both healthy after ${i}s"; break; }
  sleep 2
done

echo
echo "############ 6. VERIFY THE PORTS ARE CLOSED ############"
echo "--- what docker now publishes ---"
docker ps --format '  {{.Names}} | {{.Ports}}'
echo "--- actual listeners ---"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u | sed 's/^/  /'

echo
echo "############ 7. THE APP STILL WORKS ############"
curl -sS -o /dev/null -w '  through nginx  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/health
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health | python3 -c "
import sys,json
d=json.load(sys.stdin)
print('  source =', d.get('source'), '| merchants =', d.get('totalMerchants'), '| items =', d.get('totalItems'))
"
echo "  --- can the app still reach the database? ---"
docker exec nexg-concierge-app-1 sh -c 'wget -qO- http://127.0.0.1:3001/api/health 2>/dev/null | head -c 120' 2>/dev/null | sed 's/^/  /' || true
echo

echo
echo "############ 8. CONFIRM FROM OUTSIDE THAT 5433 IS GONE ############"
echo "  (testing the public IP from the host itself proves the bind address)"
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/212.95.32.229/5433' 2>/dev/null && echo "  STILL OPEN on the public IP" || echo "  CLOSED on the public IP"
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/5433' 2>/dev/null && echo "  reachable on loopback (correct)" || echo "  not reachable on loopback - investigate"

echo
echo "############ 9. REMOVE THE STALE sshd LINE ############"
# cloud-init's drop-in re-enables password authentication and is rewritten on reboot. It does
# not win today, but leaving it means the safe setting depends on file ordering.
CI=/etc/ssh/sshd_config.d/50-cloud-init.conf
if grep -q '^PasswordAuthentication yes' "$CI" 2>/dev/null; then
  cp "$CI" "/root/50-cloud-init.conf.bak-$STAMP"
  sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' "$CI"
  echo "  neutralised: $CI (backup at /root/50-cloud-init.conf.bak-$STAMP)"
  sshd -t && systemctl reload ssh && echo "  sshd config valid, reloaded"
else
  echo "  nothing to change in $CI"
fi
echo "--- effective settings now ---"
sshd -T 2>/dev/null | grep -iE '^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication)' | sed 's/^/  /'

echo
echo "=== DONE ==="
