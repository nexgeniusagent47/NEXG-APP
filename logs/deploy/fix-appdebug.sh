#!/bin/bash
# FIX: APP_DEBUG=true in production.
#
# With debug on, every error page renders a full stack trace with file paths, and
# Laravel's Ignition page can expose environment variables — potentially APP_KEY and the
# database password. That is an information-disclosure hole on a public site.
#
# Before flipping it we confirm where errors DO get recorded, so nothing is lost.
set -e

ENV=/var/www/apps/projects/nexg/backend/.env
STAMP=$(date +%Y%m%d-%H%M%S)

echo "=== 1. WHERE ERRORS ARE RECORDED ==="
grep -E '^(LOG_|APP_DEBUG|APP_ENV)' "$ENV" | sed 's/=.*SECRET.*/=<redacted>/'
echo "  log dir: $(ls -ld /var/www/apps/projects/nexg/backend/storage/logs 2>/dev/null | awk '{print $1, $3, $4}')"
ls -la /var/www/apps/projects/nexg/backend/storage/logs/ 2>/dev/null | tail -4

echo
echo "=== 2. PROVE an error is currently leaking internals (before the fix) ==="
LEAK=$(curl -sS -H 'Host: nexgapp.com' 'http://127.0.0.1/api/v1/nonexistent-endpoint-xyz' 2>/dev/null | head -c 400)
echo "$LEAK" | grep -iE 'stack|vendor/|/var/www|APP_KEY|DB_PASSWORD|Trace' >/dev/null 2>&1 \
  && echo "  LEAK CONFIRMED: response contains internal paths or config" \
  || echo "  this route did not leak (404 handler); a thrown exception is the real test"

echo
echo "=== 3. BACK UP .env THEN SET APP_DEBUG=false ==="
cp -v "$ENV" "$ENV.bak-$STAMP"
sed -i 's/^APP_DEBUG=.*/APP_DEBUG=false/' "$ENV"
grep -E '^APP_(ENV|DEBUG|URL)' "$ENV"

echo
echo "=== 4. CLEAR THE CONFIG CACHE (Laravel caches .env values) ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php artisan config:clear 2>&1 | tail -2 || true
docker exec -w /var/www/projects/nexg/backend nexg-apps php artisan cache:clear 2>&1 | tail -2 || true

echo
echo "=== 5. RECYCLE so the change is definitely picked up ==="
cd /var/www/apps
docker compose up -d --force-recreate php >/dev/null 2>&1
sleep 9

echo
echo "=== 6. VERIFY the app still works ==="
curl -sS -o /dev/null -w '  site /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
curl -sS -o /dev/null -w '  api     -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/v1/admin/analytics/alerts 2>&1

echo
echo "=== 7. VERIFY debug is actually off (a 500 should be generic now) ==="
BODY=$(curl -sS -H 'Host: nexgapp.com' 'http://127.0.0.1/api/v1/this-route-does-not-exist-xyz' 2>/dev/null | head -c 300)
echo "  first 200 chars: $(echo "$BODY" | tr -d '\n' | head -c 200)"
if echo "$BODY" | grep -qiE 'vendor/|/var/www|stack trace|APP_KEY'; then
  echo "  STILL LEAKING - investigate"
else
  echo "  no internal paths in the response"
fi

echo
echo "=== 8. CONFIRM errors still reach the log file ==="
echo "  (tail of laravel.log, if anything has been logged)"
tail -3 /var/www/apps/projects/nexg/backend/storage/logs/laravel.log 2>/dev/null | cut -c1-140 || echo "  log empty so far"

echo
echo "=== DONE ==="
