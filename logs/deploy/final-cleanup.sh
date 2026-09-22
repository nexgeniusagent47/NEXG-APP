#!/bin/bash
# FINAL CLEANUP — remove what the audit found still lying around.
#
# Everything here is from the OLD stack or from my own deployment work. Nothing in this
# script touches the running app.
set -e

echo "############ BEFORE ############"
df -h / | tail -1 | sed 's/^/  /'
docker system df 2>/dev/null | grep -E 'Build Cache' | sed 's/^/  /'

echo
echo "############ 1. OLD STACK'S COMPOSE SETUP ############"
echo "--- /var/www/apps/docker-compose (old nginx + mysql init) ---"
ls -la /var/www/apps/docker-compose 2>/dev/null | sed 's/^/  /'
if [ -f /var/www/apps/docker-compose/nginx/nexg.conf ]; then
  echo "  contains the old Laravel nginx vhost - no longer referenced by anything"
fi
rm -rf /var/www/apps/docker-compose
echo "  removed"

echo
echo "############ 2. OLD COMPOSE FILE + DOCKERFILE ############"
# These are the OLD stack's files: they define php/mysql/nginx services that no longer
# exist. The new stack has its own compose inside projects/nexg-concierge.
echo "--- docker-compose.yml still defines: ---"
grep -E '^\s{2}[a-z]+:' /var/www/apps/docker-compose.yml 2>/dev/null | sed 's/^/    /' || true
rm -f /var/www/apps/docker-compose.yml /var/www/apps/Dockerfile
echo "  removed docker-compose.yml and Dockerfile (old php/mysql/nginx definitions)"

echo
echo "############ 3. THE REDACTED BACKUP OF THAT FILE ############"
rm -f /var/www/apps/docker-compose.yml.bak*
echo "  removed compose backups (the old password was already redacted, but no reason to keep them)"

echo
echo "############ 4. MY TEMPORARY LOGS ############"
rm -f /tmp/clean.log /tmp/purge.log /tmp/deploy*.log /tmp/compcheck.log /tmp/cutover.log /tmp/apt-upgrade.log /tmp/secrecon*.sh /tmp/precheck*.sh /tmp/fix*.sh /tmp/verify*.sh /tmp/backupold.sh 2>/dev/null || true
echo "  cleared /tmp of my working files"

echo
echo "############ 5. DOCKER BUILD CACHE ############"
# 1.758GB reclaimable from the image builds. Safe: it is only build layers, and a rebuild
# recreates what it needs.
docker builder prune -af 2>&1 | tail -3 | sed 's/^/  /'

echo
echo "############ 6. LEFTOVER REPOS IN THE APP ############"
# The deployment archive had no .git, but check nothing stray was created.
ls -la /var/www/apps/projects/nexg-concierge | grep -E '^\.|\.bak|\.old|\.previous' | sed 's/^/  /' || echo "  no stray backup dirs in the app"

echo
echo "############ AFTER ############"
echo "--- /var/www/apps ---"
ls -la /var/www/apps | sed 's/^/  /'
echo "--- /var/www/apps/projects ---"
ls -la /var/www/apps/projects | sed 's/^/  /'
echo "--- disk ---"
df -h / | tail -1 | sed 's/^/  /'
echo "--- docker usage ---"
docker system df 2>/dev/null | sed 's/^/  /'

echo
echo "############ THE APP IS STILL HEALTHY ############"
cd /var/www/apps/projects/nexg-concierge
docker compose ps --format '  {{.Service}} | {{.Status}}'
curl -sS -o /dev/null -w '  site /      -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('  source =', d.get('source'), '| merchants =', d.get('totalMerchants'), '| items =', d.get('totalItems'))
"

echo
echo "=== CLEANUP COMPLETE ==="
