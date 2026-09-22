#!/bin/bash
# What is actually running, and is the site up?
echo "=== containers ==="
docker ps -a --format '  {{.Names}} | {{.Image}} | {{.Status}}' 2>/dev/null
echo "  count: $(docker ps -aq 2>/dev/null | wc -l)"

echo
echo "=== compose state ==="
cd /var/www/apps/projects/nexg-concierge 2>/dev/null && docker compose ps 2>&1 | head -8

echo
echo "=== listeners ==="
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u | sed 's/^/  /'

echo
echo "=== direct to the app on 3101 ==="
curl -sS -o /dev/null -w '  -> %{http_code}\n' http://127.0.0.1:3101/api/health 2>&1 || echo "  refused"

echo
echo "=== through nginx, with the Host header ==="
curl -sS -o /dev/null -w '  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>&1 || echo "  failed"

echo
echo "=== nginx running? ==="
systemctl is-active nginx 2>/dev/null | sed 's/^/  nginx: /'
systemctl is-active docker 2>/dev/null | sed 's/^/  docker: /'

echo
echo "=== recent app logs, if any ==="
docker compose logs --tail=12 app 2>&1 | tail -12 | sed 's/^/  /'

echo
echo "=== DONE ==="
