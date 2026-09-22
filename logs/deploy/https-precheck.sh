#!/bin/bash
# Does the Laravel app already expect HTTPS? Determines whether the Cloudflare SSL mode
# switch needs a matching app setting.
echo "=== SESSION / COOKIE CONFIG ==="
grep -E '^(SESSION_|APP_URL|APP_ENV|APP_DEBUG|FORCE_HTTPS|ASSET_URL)' /var/www/apps/projects/nexg/backend/.env 2>/dev/null | sed 's/\(SECRET=\|KEY=\).*/\1<redacted>/'

echo
echo "=== session.php secure setting ==="
grep -nE "'secure'|'same_site'|'http_only'" /var/www/apps/projects/nexg/backend/config/session.php 2>/dev/null | head -10

echo
echo "=== is a TrustProxies / proxy middleware configured? ==="
ls /var/www/apps/projects/nexg/backend/app/Http/Middleware/ 2>/dev/null | head -20
grep -rn 'TrustProxies\|trustProxies\|X_FORWARDED' /var/www/apps/projects/nexg/backend/bootstrap/app.php /var/www/apps/projects/nexg/backend/app/Http/Middleware/*.php 2>/dev/null | head -5 || echo "  no explicit TrustProxies found"

echo
echo "=== does the app force https in a service provider? ==="
grep -rn "forceScheme\|URL::forceScheme\|'https'" /var/www/apps/projects/nexg/backend/app/Providers/*.php 2>/dev/null | head -6 || echo "  no forceScheme found"

echo
echo "=== WRITE TEST: prove the current setup is plaintext end-to-end ==="
echo "--- are cookies Secure today? ---"
curl -sS -D - -o /dev/null -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | grep -i 'set-cookie' | head -3 || echo "  no Set-Cookie on the landing page"

echo
echo "=== DONE ==="
