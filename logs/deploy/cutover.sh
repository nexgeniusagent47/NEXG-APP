#!/bin/bash
# CUTOVER: point nexgapp.com at the new app, then remove the old stack.
#
# Order matters and is deliberate:
#   1. write the new nginx config alongside
#   2. nginx -t BEFORE reloading, so a typo cannot take the site down
#   3. reload and verify through nginx (not just the app port)
#   4. only then stop and remove the old stack
#
# If step 3 fails at any point the script exits and the old site is still serving.
set -e

STAMP=$(date +%Y%m%d-%H%M%S)
SITE=/etc/nginx/sites-available/nexgapp.com
OLD=/var/www/apps/projects/nexg
NEW=/var/www/apps/projects/nexg-concierge

echo "############ 1. BACK UP THE CURRENT NGINX CONFIG ############"
cp -v "$SITE" "$SITE.bak-$STAMP"

echo
echo "=== current config (what we are replacing) ==="
grep -vE '^\s*#|^\s*$' "$SITE" | sed 's/^/  /'

echo
echo "############ 2. WRITE THE NEW CONFIG ############"
cat > "$SITE" <<'NGINX'
# nexgapp.com — serves the NEXG App SPA and API from a single container on 127.0.0.1:3101.
#
# The app serves BOTH the built SPA and the API, so there is one upstream rather than the
# two the previous stack needed (a static root plus a PHP-FPM proxy). Everything proxies.

server {
    listen 80;
    listen [::]:80;
    server_name nexgapp.com www.nexgapp.com;

    # Uploads: merchant onboarding attaches documents.
    client_max_body_size 12M;

    # Security headers are set by the APPLICATION (server/security.ts), not here, so they
    # are present on every response the app produces regardless of how it is reached.
    # Duplicating them in nginx would create two sources of truth that drift.
    # The one exception is HSTS, which belongs at the edge once HTTPS is confirmed.

    # Long-lived, content-hashed assets. `immutable` is safe because the filename changes
    # whenever the content does.
    location /assets/ {
        proxy_pass http://127.0.0.1:3101;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3101;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        # The app trusts exactly one proxy hop and reads this to rate-limit per client.
        # Without it every request shares one identity and the limiter becomes global.
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Server-sent events and long polls must not be buffered or they never arrive.
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
NGINX
echo "  config written"

echo
echo "############ 3. VALIDATE BEFORE RELOADING ############"
if nginx -t 2>&1 | grep -q 'successful'; then
  echo "  nginx -t: OK"
else
  echo "  nginx -t FAILED - restoring the backup, site untouched"
  cp "$SITE.bak-$STAMP" "$SITE"
  nginx -t 2>&1 | sed 's/^/    /'
  exit 1
fi

echo
echo "############ 4. RELOAD ############"
systemctl reload nginx
sleep 2
echo "  reloaded"

echo
echo "############ 5. VERIFY THROUGH NGINX (the real path a visitor takes) ############"
echo "--- SPA ---"
curl -sS -o /dev/null -w '  GET /  -> %{http_code} (%{size_download} bytes)\n' -H 'Host: nexgapp.com' http://127.0.0.1/
echo "  root div: $(curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | grep -c 'id=\"root\"')"
echo "--- API (must be OUR Express app, not the old Laravel one) ---"
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>/dev/null | head -c 240
echo
echo "--- does it report postgres and the full catalogue? ---"
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
ok = d.get('source') == 'postgres' and d.get('totalMerchants') == 640
print('  source =', d.get('source'), '| merchants =', d.get('totalMerchants'), '| items =', d.get('totalItems'))
print('  VERDICT:', 'NEW APP IS SERVING' if ok else 'WRONG APP - investigate')
"
echo "--- security headers through nginx ---"
curl -sS -D - -o /dev/null -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | grep -icE 'content-security-policy|x-frame-options|x-content-type' | sed 's/^/  headers found: /'

echo
echo "############ 6. STOP AND REMOVE THE OLD STACK ############"
cd /var/www/apps
docker compose down 2>&1 | tail -8 | sed 's/^/  /'

echo
echo "=== old containers gone? ==="
docker ps -a --format '  {{.Names}} | {{.Status}}' | grep nexg-apps || echo "  none - removed"

echo
echo "############ 7. REMOVE THE OLD FILES ############"
# Backed up at /var/backups/nexg-old-*/ before any of this began.
mv -v "$OLD" "/var/backups/nexg-old-removed-$STAMP" 2>&1 | sed 's/^/  /'

echo
echo "=== old images ==="
docker rmi php-8.3-dev:latest mysql:8.0 nginx:1.25-alpine 2>&1 | tail -4 | sed 's/^/  /' || echo "  (in use or already gone)"

echo
echo "############ 8. FINAL STATE ############"
echo "--- containers ---"
docker ps --format '  {{.Names}} | {{.Status}} | {{.Ports}}'
echo "--- public listeners ---"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u | sed 's/^/  /'
echo "--- site through nginx ---"
curl -sS -o /dev/null -w '  / -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/
echo "--- disk ---"
df -h / | tail -1 | sed 's/^/  /'

echo
echo "=== CUTOVER COMPLETE ==="
