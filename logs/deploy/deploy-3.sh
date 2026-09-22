#!/bin/bash
# DEPLOY STEP 3: start the app on 3101 and prove it works end to end.
# The old stack is still running and untouched.
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== 1. START THE APP ==="
docker compose up -d app >/dev/null 2>&1
for i in $(seq 1 40); do
  state=$(docker inspect --format '{{.State.Health.Status}}' nexg-concierge-app-1 2>/dev/null || echo pending)
  [ "$state" = "healthy" ] && { echo "  healthy after ${i}s"; break; }
  sleep 2
done
docker compose ps --format '  {{.Service}} | {{.Status}} | {{.Ports}}' 2>/dev/null

echo
echo "=== 2. HEALTH — the critical line is the data source ==="
curl -sS http://127.0.0.1:3101/api/health 2>&1 | head -c 300
echo

echo
echo "=== 3. VERSION — proves the build args reached the image ==="
curl -sS http://127.0.0.1:3101/api/version 2>&1 | head -c 200
echo

echo
echo "=== 4. REAL DATA — 640 merchants? ==="
curl -sS 'http://127.0.0.1:3101/api/merchants?limit=2' 2>&1 | head -c 260
echo

echo
echo "=== 5. SECURITY HEADERS — the work from earlier, live ==="
curl -sS -D - -o /dev/null http://127.0.0.1:3101/api/health 2>/dev/null | grep -iE '^content-security-policy|^x-content-type|^x-frame|^referrer-policy|^permissions-policy|^x-powered-by|^strict-transport' | cut -c1-90 | sed 's/^/  /'

echo
echo "=== 6. RATE LIMITING — 12 logins, expect 10 then 429 ==="
CODES=""
for i in $(seq 1 12); do
  C=$(curl -sS -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:3101/api/auth/login \
      -H 'content-type: application/json' -H 'x-device-id: deploy-check-device' \
      -d '{"email":"nobody@example.com","password":"wrongpassword123"}' 2>/dev/null)
  CODES="$CODES $C"
done
echo "  codes:$CODES"

echo
echo "=== 7. OBSERVABILITY — metrics and traces ==="
curl -sS http://127.0.0.1:3101/api/metrics 2>/dev/null | head -c 240
echo
curl -sS 'http://127.0.0.1:3101/api/traces?limit=1' 2>/dev/null | head -c 300
echo

echo
echo "=== 8. CLIENT IDENTITY ON A SPAN? ==="
curl -sS -H 'x-device-id: identity-proof-1234' http://127.0.0.1:3101/api/health >/dev/null 2>&1
sleep 1
curl -sS 'http://127.0.0.1:3101/api/traces?limit=3' 2>/dev/null | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    for s in d.get('spans', [])[:3]:
        a = s.get('attributes', {})
        print('  ', a.get('http.target'), '| ip=', a.get('client.ip'), '| device=', a.get('client.device_id'))
except Exception as e:
    print('  could not parse:', e)
"

echo
echo "=== 9. THE SPA ==="
curl -sS -o /dev/null -w '  GET / -> %{http_code}  (%{size_download} bytes)\n' http://127.0.0.1:3101/ 2>&1
echo "  root div present: $(curl -sS http://127.0.0.1:3101/ 2>/dev/null | grep -c 'id="root"')"

echo
echo "=== 10. IS THE APP PORT LOOPBACK-ONLY? ==="
docker compose ps --format '{{.Service}} | {{.Ports}}' | sed 's/^/  /'

echo
echo "=== 11. OLD STACK STILL UNTOUCHED? ==="
docker ps --format '  {{.Names}} | {{.Status}}' | grep -E 'nexg-apps' || echo "  (none)"

echo
echo "=== DONE - step 3 complete ==="
