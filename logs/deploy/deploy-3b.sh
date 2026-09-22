#!/bin/bash
# Correct the host port, then verify properly.
#
# The compose override binds "127.0.0.1:${PORT:-3001}:3001" while .env declared PORT=3001,
# so the app was published on 3001 rather than 3101 and every check in step 3 hit a closed
# port. Both the host binding and the container listen port read the same variable, so they
# have to agree.
set -e
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== 1. POINT THE HOST PORT AT 3101 ==="
sed -i 's/^PORT=.*/PORT=3101/' .env
grep -E '^PORT=' .env | sed 's/^/  /'

echo
echo "=== 2. RECREATE THE APP ==="
docker compose up -d --force-recreate app >/dev/null 2>&1
for i in $(seq 1 40); do
  state=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-app-1 2>/dev/null || echo pending)
  [ "$state" = "healthy" ] && { echo "  healthy after ${i}s"; break; }
  sleep 2
done
docker compose ps --format '  {{.Service}} | {{.Status}} | {{.Ports}}' 2>/dev/null

echo
echo "=== 3. HEALTH (the source line is the one that matters) ==="
curl -sS http://127.0.0.1:3101/api/health 2>&1 | head -c 260
echo
echo
echo "=== 4. VERSION ==="
curl -sS http://127.0.0.1:3101/api/version 2>&1 | head -c 180
echo
echo
echo "=== 5. REAL DATA ==="
curl -sS 'http://127.0.0.1:3101/api/merchants?limit=2' 2>&1 | head -c 220
echo
echo
echo "=== 6. SECURITY HEADERS, LIVE ==="
curl -sS -D - -o /dev/null http://127.0.0.1:3101/api/health 2>/dev/null \
  | grep -iE '^content-security-policy|^x-content-type-options|^x-frame-options|^referrer-policy|^permissions-policy|^x-powered-by|^strict-transport-security' \
  | cut -c1-88 | sed 's/^/  /'

echo
echo "=== 7. RATE LIMITING: 12 logins, expect 10 then 429 ==="
CODES=""
for i in $(seq 1 12); do
  C=$(curl -sS -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:3101/api/auth/login \
      -H 'content-type: application/json' -H 'x-device-id: deploy-check-device' \
      -d '{"email":"nobody@example.com","password":"wrongpassword123"}' 2>/dev/null)
  CODES="$CODES $C"
done
echo "  codes:$CODES"

echo
echo "=== 8. OBSERVABILITY ==="
curl -sS http://127.0.0.1:3101/api/metrics 2>/dev/null | head -c 200
echo
echo "  --- and the rate limiter's live state ---"
curl -sS http://127.0.0.1:3101/api/metrics 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('   rateLimiter:', d.get('rateLimiter'))
print('   requests:', d.get('requests', {}).get('total'), 'errors:', d.get('requests', {}).get('errors'))
"

echo
echo "=== 9. CLIENT IDENTITY ON SPANS ==="
curl -sS -H 'x-device-id: identity-proof-1234' http://127.0.0.1:3101/api/health >/dev/null 2>&1
sleep 1
curl -sS 'http://127.0.0.1:3101/api/traces?limit=4' 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
for s in d.get('spans', [])[:4]:
    a = s.get('attributes', {})
    print('  ', str(a.get('http.target'))[:26].ljust(26), 'ip=', a.get('client.ip'), ' device=', a.get('client.device_id'))
"

echo
echo "=== 10. THE SPA ==="
curl -sS -o /dev/null -w '  GET / -> %{http_code} (%{size_download} bytes)\n' http://127.0.0.1:3101/ 2>&1
curl -sS http://127.0.0.1:3101/ 2>/dev/null | grep -o 'id="root"' | head -1 | sed 's/^/  found: /'

echo
echo "=== 11. OLD STACK STILL RUNNING? ==="
docker ps --format '  {{.Names}} | {{.Status}}' | grep nexg-apps | sed 's/^/  /' || echo "  none"

echo
echo "=== DONE ==="
