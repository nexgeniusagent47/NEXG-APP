#!/bin/bash
# The app fell back to the JSON catalogue after a deploy. Find out why.
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== 1. what is it reporting? ==="
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health | head -c 320
echo

echo
echo "=== 2. the app's database config ==="
if [ -f .env ]; then
  grep -E '^(DATABASE_URL|PORT|NODE_ENV)' .env | sed 's/\(:\/\/[^:]*:\)[^@]*/\1<redacted>/' | sed 's/^/  /'
else
  echo "  .env IS MISSING"
fi
echo "  file perms: $(stat -c '%a %U:%G' .env 2>/dev/null || echo 'absent')"

echo
echo "=== 3. is postgres reachable from the app container? ==="
docker compose ps --format '  {{.Service}} | {{.Status}} | {{.Ports}}'

echo
echo "=== 4. what does the app container actually see for DATABASE_URL? ==="
docker exec nexg-concierge-app-1 sh -c 'echo "  DATABASE_URL set: ${DATABASE_URL:+yes}"; echo "  host part: $(echo $DATABASE_URL | sed "s|.*@||")"' 2>&1 | head -4

echo
echo "=== 5. can the app container resolve and reach the database? ==="
docker exec nexg-concierge-app-1 sh -c 'getent hosts postgres || echo "  cannot resolve hostname postgres"' 2>&1 | head -3

echo
echo "=== 6. the app's own logs, looking for the connection error ==="
docker compose logs --tail=40 app 2>&1 | grep -iE 'db|connect|password|database|fallback|error' | tail -8 | sed 's/^/  /'

echo
echo "=== 7. is the postgres container actually accepting connections? ==="
docker exec nexg-concierge-postgres-1 sh -c 'pg_isready -U nexg_user -d nexg_db' 2>&1 | sed 's/^/  /'
docker exec nexg-concierge-postgres-1 sh -c 'psql -U nexg_user -d nexg_db -t -c "SELECT '"'"'  merchants: '"'"'||count(*) FROM merchants;"' 2>&1 | head -2 | sed 's/^/  /'

echo
echo "=== DONE - nothing changed ==="
