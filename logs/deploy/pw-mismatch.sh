#!/bin/bash
# Why does authentication fail, and why did the ports reopen?
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== 1. the password the APP is sending ==="
APP_PW=$(grep '^DATABASE_URL' .env | sed 's|.*://[^:]*:||; s|@.*||')
echo "  length: ${#APP_PW}"

echo
echo "=== 2. the password POSTGRES was started with ==="
PG_PW=$(docker exec nexg-concierge-postgres-1 sh -c 'echo $POSTGRES_PASSWORD')
echo "  length: ${#PG_PW}"

echo
echo "=== 3. do they match? ==="
if [ "$APP_PW" = "$PG_PW" ]; then
  echo "  MATCH - so the failure is something else"
else
  echo "  MISMATCH - this is the cause"
  echo "    app sends:      '$APP_PW'"
  echo "    postgres wants: '$PG_PW'"
fi

echo
echo "=== 4. what the compose file resolves the password to ==="
grep -n 'POSTGRES_PASSWORD' docker-compose.yml | sed 's/^/  /'

echo
echo "=== 5. is POSTGRES_PASSWORD set in .env? ==="
if grep -q '^POSTGRES_PASSWORD' .env 2>/dev/null; then
  grep '^POSTGRES_PASSWORD' .env | sed 's/=.*/=<set>/' | sed 's/^/  /'
else
  echo "  NOT SET in .env - so compose uses its fallback"
fi

echo
echo "=== 6. had this container been created before? (volume persistence) ==="
docker volume ls --format '  {{.Name}}' | grep -i pgdata

echo
echo "=== 7. the port bindings, which reverted ==="
grep -nE '^\s+- ".*(3001|5432)"' docker-compose.yml | sed 's/^/  /'

echo
echo "=== DONE ==="
