#!/bin/bash
# Diagnose and complete the container restart for fix #6.
#
# `docker compose up -d php` printed "Container nexg-apps Running" — it did NOT recreate the
# container, so PHP is still holding the pre-rotation environment. A plain `up -d` only
# recreates when the service definition changed; here only the env_file changed.
set -e
cd /var/www/apps

echo "=== 1. WHAT PASSWORD DOES THE CONTAINER CURRENTLY SEE? ==="
docker exec nexg-apps php -r 'echo "  DB_HOST=".(getenv("DB_HOST")?:"(unset)")."\n";
  $p = getenv("DB_PASSWORD")?:"(unset)";
  echo "  DB_PASSWORD length=".strlen($p)." starts=".substr($p,0,4)."\n";' 2>/dev/null

echo
echo "=== 2. WHAT DOES THE .env ON DISK SAY? (length only) ==="
awk -F= '/^DB_PASSWORD=/{print "  DB_PASSWORD length=" length($2) " starts=" substr($2,1,4)}' projects/nexg/backend/.env

echo
echo "=== 3. FORCE-RECREATE so the container re-reads the env_file ==="
docker compose up -d --force-recreate php
sleep 10

echo
echo "=== 4. ENVIRONMENT AFTER RECREATE ==="
docker exec nexg-apps php -r 'echo "  DB_HOST=".(getenv("DB_HOST")?:"(unset)")."\n";
  $p = getenv("DB_PASSWORD")?:"(unset)";
  echo "  DB_PASSWORD length=".strlen($p)." starts=".substr($p,0,4)."\n";' 2>/dev/null

echo
echo "=== 5. REAL DATABASE CONNECTION TEST ==="
docker exec nexg-apps php -r '
$h=getenv("DB_HOST")?:""; $u=getenv("DB_USERNAME")?:""; $p=getenv("DB_PASSWORD")?:""; $d=getenv("DB_DATABASE")?:"";
echo "  attempting mysql:host=$h;dbname=$d as $u\n";
try { $c=new PDO("mysql:host=$h;dbname=$d",$u,$p); echo "  PDO connect: OK\n"; }
catch (Exception $e) { echo "  PDO FAILED: ".substr($e->getMessage(),0,120)."\n"; }
' 2>/dev/null || echo "  (php unavailable)"

echo
echo "=== 6. LARAVEL'S OWN VIEW OF IT ==="
docker exec nexg-apps php artisan tinker --execute='try { DB::connection()->getPdo(); echo "  laravel DB: OK\n"; } catch (\Exception $e) { echo "  laravel DB FAILED: ".substr($e->getMessage(),0,100)."\n"; }' 2>/dev/null | tail -3 || echo "  (tinker unavailable)"

echo
echo "=== 7. SITE + API ==="
curl -sS -o /dev/null -w '  /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
curl -sS -o /dev/null -w '  /api/up -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/up 2>&1 || true

echo
echo "=== 8. ANY FRESH ERRORS? ==="
docker logs nexg-apps --since 2m 2>&1 | grep -iE 'SQLSTATE|access denied|connection refused' | tail -5 || echo "  no db errors"

echo
echo "=== DONE ==="
