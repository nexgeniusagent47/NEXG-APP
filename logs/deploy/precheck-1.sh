#!/bin/bash
# PRE-CHANGE SAFETY CHECK for unpublishing the MySQL port.
# Read-only. Confirms how the app reaches the database before we change anything.
set -e

echo "=== 1. HOW DOES THE APP CONNECT TO MYSQL? ==="
echo "--- laravel .env DB settings ---"
for f in /var/www/apps/projects/nexg/backend/.env; do
  if [ -f "$f" ]; then
    grep -E '^DB_' "$f" 2>/dev/null | sed 's/\(DB_PASSWORD=\).*/\1<redacted>/' || echo "  no DB_ lines in $f"
  else
    echo "  $f does not exist"
  fi
done

echo
echo "--- any other .env files in the backend ---"
find /var/www/apps/projects/nexg/backend -maxdepth 2 -name '.env*' 2>/dev/null | head -5

echo
echo "=== 2. DOES ANYTHING CONNECT TO MYSQL FROM OUTSIDE DOCKER? ==="
echo "--- processes on the host holding a connection to 9106 ---"
ss -tnp 2>/dev/null | grep ':9106' | head -10 || echo "  (none right now)"

echo
echo "--- is 9106 referenced anywhere in the project configs? ---"
grep -rn '9106' /var/www/apps --include='*.yml' --include='*.yaml' --include='*.env' --include='*.conf' --include='*.php' 2>/dev/null | head -10 || echo "  only the compose port mapping"

echo
echo "=== 3. THE EXACT LINES WE WOULD CHANGE ==="
grep -n -A2 -B2 '9106' /var/www/apps/docker-compose.yml

echo
echo "=== 4. CONFIRM THE APP AND DB SHARE A NETWORK ==="
docker inspect nexg-apps --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null
docker inspect nexg-apps-db --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' 2>/dev/null

echo
echo "=== 5. CAN THE APP RESOLVE THE DB BY SERVICE NAME? ==="
docker exec nexg-apps sh -c 'getent hosts mysql 2>/dev/null || getent hosts nexg-apps-db 2>/dev/null || echo "  cannot resolve mysql hostname"' 2>/dev/null || echo "  could not exec into nexg-apps"

echo
echo "=== DONE - nothing changed ==="
