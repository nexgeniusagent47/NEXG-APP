#!/bin/bash
# DEPLOY STEP 2: database up, schema + catalogue loaded, counts verified.
set -e
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== 1. START POSTGRES ONLY ==="
docker compose up -d postgres
echo "  waiting for healthy..."
for i in $(seq 1 40); do
  state=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-postgres-1 2>/dev/null || echo pending)
  [ "$state" = "healthy" ] && { echo "  healthy after ${i}s"; break; }
  sleep 2
done
docker compose ps --format '  {{.Service}} | {{.Status}}' 2>/dev/null

echo
echo "=== 2. LOAD THE SCHEMA ==="
docker compose exec -T postgres psql -U nexg_user -d nexg_db -v ON_ERROR_STOP=1 < src/db/schema.sql 2>&1 | tail -4 | sed 's/^/  /'

echo
echo "=== 3. LOAD THE CATALOGUE ==="
echo "  (seed_excel.sql is the real one: 3.4 MB generating 640 merchants)"
docker compose exec -T postgres psql -U nexg_user -d nexg_db -v ON_ERROR_STOP=1 < src/db/seed_excel.sql 2>&1 | tail -3 | sed 's/^/  /'

echo
echo "=== 4. VERIFY THE COUNTS ==="
docker compose exec -T postgres psql -U nexg_user -d nexg_db -t -c \
  "SELECT '  categories='||(SELECT count(*) FROM categories)
        ||' subcats='||(SELECT count(*) FROM subcategories)
        ||' merchants='||(SELECT count(*) FROM merchants)
        ||' items='||(SELECT count(*) FROM items);"

echo
echo "=== 5. CONFIRM EXPECTED NUMBERS ==="
EXPECTED="categories=21 subcats=128 merchants=640 items=6000"
ACTUAL=$(docker compose exec -T postgres psql -U nexg_user -d nexg_db -t -A -c \
  "SELECT 'categories='||(SELECT count(*) FROM categories)
        ||' subcats='||(SELECT count(*) FROM subcategories)
        ||' merchants='||(SELECT count(*) FROM merchants)
        ||' items='||(SELECT count(*) FROM items);" | tr -d '\r')
echo "  expected: $EXPECTED"
echo "  actual:   $ACTUAL"
if [ "$ACTUAL" = "$EXPECTED" ]; then
  echo "  MATCH - catalogue loaded correctly"
else
  echo "  MISMATCH - investigate before proceeding"
fi

echo
echo "=== 6. IS THE POSTGRES PORT LOOPBACK-ONLY? (not 0.0.0.0) ==="
docker compose ps --format '{{.Service}} | {{.Ports}}' | sed 's/^/  /'

echo
echo "=== DONE - step 2 complete, app not started yet ==="
