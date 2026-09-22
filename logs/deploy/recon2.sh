#!/bin/bash
# READ-ONLY. Fetching the remaining recon sections plus the existing configs.

echo "=== EXISTING docker-compose.yml ==="
cat /var/www/apps/docker-compose.yml

echo
echo "=== EXISTING Dockerfile (first 40 lines) ==="
head -40 /var/www/apps/Dockerfile

echo
echo "=== docker-compose dir tree ==="
find /var/www/apps/docker-compose -maxdepth 3 2>/dev/null

echo
echo "=== nginx configs (host) ==="
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "no sites-enabled"
echo "--- what host nginx serves on :80 ---"
grep -rhE 'server_name|root|proxy_pass|listen' /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null | head -30

echo
echo "=== container nginx config ==="
docker exec nexg-apps-nginx sh -c 'cat /etc/nginx/conf.d/*.conf 2>/dev/null | head -50' 2>/dev/null || echo "could not read container nginx config"

echo
echo "=== what is actually served on :80 right now ==="
curl -sS -o /dev/null -w 'http://127.0.0.1/ -> %{http_code} (%{content_type})\n' http://127.0.0.1/ 2>&1
curl -sS -o /dev/null -w 'http://127.0.0.1:7001/ -> %{http_code}\n' http://127.0.0.1:7001/ 2>&1
echo "--- first 400 bytes of :80 ---"
curl -sS http://127.0.0.1/ 2>/dev/null | head -c 400
echo

echo
echo "=== TLS ==="
ls -la /etc/letsencrypt 2>/dev/null || echo "no letsencrypt on host"
docker exec nexg-apps-nginx sh -c 'ls -la /etc/letsencrypt 2>/dev/null' 2>/dev/null || echo "no letsencrypt in container"

echo
echo "=== nexg/backend contents ==="
ls -la /var/www/apps/projects/nexg/backend 2>/dev/null | head -20
echo "--- is it a git repo? ---"
git -C /var/www/apps/projects/nexg/backend remote -v 2>/dev/null || echo "not a git repo"
git -C /var/www/apps/projects/nexg/backend log --oneline -3 2>/dev/null || true

echo
echo "=== nexg/frontend contents ==="
ls -la /var/www/apps/projects/nexg/frontend 2>/dev/null | head -20

echo
echo "=== DONE ==="
