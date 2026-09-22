#!/bin/bash
# SECURITY FIXES #2 and #3, applied together.
#
# #2 unpublish 7001 — the nginx container is only ever reached by host nginx on
#    127.0.0.1:7001, so publishing it on 0.0.0.0 is exposure with no consumer.
# #3 fail2ban — the host took 17,289 failed SSH attempts in 24 hours with no protection.
#
# Both are safe for the application: #2 changes only the bind address (host nginx keeps
# working over loopback), #3 touches only the SSH path.
set -e

cd /var/www/apps
STAMP=$(date +%Y%m%d-%H%M%S)

echo "############ FIX #2: UNPUBLISH 7001 ############"
echo "=== confirm host nginx reaches it over loopback ==="
grep -n 'proxy_pass' /etc/nginx/sites-available/nexgapp.com | head -5

cp -v docker-compose.yml "docker-compose.yml.bak2-$STAMP"

python3 - <<'PY'
import io
path = 'docker-compose.yml'
with io.open(path, encoding='utf-8') as f:
    src = f.read()

old = """    ports:
      - "7001:80"
"""
new = """    # SECURITY: published on 0.0.0.0, which Docker exposes ahead of UFW. The only
    # consumer is host nginx, over loopback, so binding there is sufficient.
    ports:
      - "127.0.0.1:7001:80"
"""

if old not in src:
    raise SystemExit('PATTERN NOT FOUND for 7001 - aborting')
with io.open(path, 'w', encoding='utf-8') as f:
    f.write(src.replace(old, new))
print('  compose updated')
PY

echo "=== validate before applying ==="
docker compose config >/dev/null 2>&1 && echo "  VALID" || { echo "  INVALID - restoring"; cp "docker-compose.yml.bak2-$STAMP" docker-compose.yml; exit 1; }

echo "=== recreate nginx container ==="
docker compose up -d nginx

sleep 3
echo "=== is 7001 now loopback-only? ==="
docker ps --format '{{.Names}} | {{.Ports}}' | grep nginx
ss -ltn 2>/dev/null | grep ':7001' || echo "  (no host listener)"

echo
echo "############ FIX #3: FAIL2BAN ############"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq fail2ban >/dev/null 2>&1 && echo "  fail2ban installed" || echo "  fail2ban install failed"

echo "=== write a dedicated jail ==="
cat > /etc/fail2ban/jail.d/nexg-sshd.local <<'JAIL'
[DEFAULT]
# One hour ban; the attacker moves on long before it expires.
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd

[sshd]
enabled = true
port    = 22
# Deliberately NOT using `mode = aggressive`. Under the default mode a successful login
# clears the failure history for that address, which is what stops a legitimate user who
# mistyped a few times from banning themselves.
JAIL

systemctl enable fail2ban >/dev/null 2>&1
systemctl restart fail2ban

echo "=== jail status ==="
sleep 4
fail2ban-client status sshd 2>&1 | head -12

echo
echo "############ VERIFY NOTHING BROKE ############"
echo "--- containers ---"
docker ps --format '{{.Names}} | {{.Status}} | {{.Ports}}' | grep nexg-apps

echo "--- host nginx still proxying to 7001? ---"
curl -sS -o /dev/null -w '  /        -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1

echo
echo "=== DONE #2 and #3 ==="
