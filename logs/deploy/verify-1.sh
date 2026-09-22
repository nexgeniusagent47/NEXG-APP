#!/bin/bash
# VERIFY fix #1: is the MySQL port actually closed, and is the site still working?
echo "=== 1. IS 9106 STILL PUBLISHED? ==="
if ss -ltn 2>/dev/null | grep -q ':9106'; then
  echo "  STILL LISTENING - fix did not apply"
  ss -ltnp | grep ':9106'
else
  echo "  port 9106 is CLOSED on the host - FIX APPLIED"
fi

echo
echo "=== 2. DOCKER'S DNAT RULES (the thing that bypassed UFW) ==="
iptables -t nat -L DOCKER -n 2>/dev/null | grep -E 'DNAT' || echo "  no DNAT rules remaining for our stack"

echo
echo "=== 3. CONTAINER STATUS ==="
docker ps --format '{{.Names}} | {{.Status}} | {{.Ports}}' | grep nexg-apps

echo
echo "=== 4. IS MYSQL ACCEPTING CONNECTIONS INTERNALLY? ==="
docker exec nexg-apps-db mysqladmin ping -h 127.0.0.1 -u root -p$OLD_MYSQL_PASSWORD 2>/dev/null || echo "  mysqladmin ping failed"

echo
echo "=== 5. CAN THE APP REACH THE DB? ==="
docker exec nexg-apps sh -c 'php -r "\$c=@fsockopen(getenv(\"DB_HOST\")?:\"mysql\",3306,\$e,\$s,5); echo \$c?\"  app -> mysql:3306 OK\n\":\"  FAILED\n\";"' 2>/dev/null || echo "  (could not run php check)"

echo
echo "=== 6. IS THE LIVE SITE STILL SERVING? ==="
curl -sS -o /dev/null -w '  GET /        -> %{http_code}  (%{size_download} bytes)\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
curl -sS -o /dev/null -w '  GET /api     -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api 2>&1 || true

echo
echo "=== 7. DOES THE API ACTUALLY TALK TO THE DATABASE? ==="
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api 2>/dev/null | head -c 200
echo

echo
echo "=== 8. RECENT APP ERRORS SINCE THE RESTART? ==="
docker logs nexg-apps-nginx --since 3m 2>&1 | grep -iE 'error|502|504' | tail -5 || echo "  no errors in nginx logs"
docker logs nexg-apps --since 3m 2>&1 | grep -iE 'SQLSTATE|connection refused|error' | tail -5 || echo "  no db errors in php logs"

echo
echo "=== DONE ==="
