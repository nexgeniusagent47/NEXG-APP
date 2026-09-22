#!/bin/bash
# Conclusive test: can Laravel itself reach MySQL with the rotated password?
#
# The earlier getenv() check was measuring the wrong thing. This compose file mounts the
# project into the php container and passes NO environment, so PHP's getenv() is empty by
# design — Laravel reads DB_* from the .env FILE on the mounted volume. The only test that
# means anything is Laravel's own connection.
set -e
cd /var/www/apps

echo "=== 1. WHAT LARAVEL ACTUALLY READS FROM THE .env ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php -r '
$env = [];
foreach (file("/var/www/projects/nexg/backend/.env", FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES) as $line) {
    if ($line === "" || $line[0] === "#" || strpos($line, "=") === false) continue;
    [$k, $v] = explode("=", $line, 2);
    $env[trim($k)] = trim($v);
}
$show = function($k) use ($env) {
    $v = $env[$k] ?? "(missing)";
    if ($k === "DB_PASSWORD") $v = "len=" . strlen($v) . " starts=" . substr($v, 0, 4);
    echo "  $k = $v\n";
};
foreach (["DB_CONNECTION","DB_HOST","DB_PORT","DB_DATABASE","DB_USERNAME","DB_PASSWORD"] as $k) $show($k);
' 2>&1 | head -10

echo
echo "=== 2. CONNECT WITH EXACTLY THOSE VALUES ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php -r '
$env = [];
foreach (file(".env", FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES) as $line) {
    if ($line === "" || $line[0] === "#" || strpos($line, "=") === false) continue;
    [$k, $v] = explode("=", $line, 2);
    $env[trim($k)] = trim($v);
}
$h=$env["DB_HOST"]; $u=$env["DB_USERNAME"]; $p=$env["DB_PASSWORD"]; $d=$env["DB_DATABASE"];
echo "  target: mysql:host=$h;dbname=$d as $u\n";
try { $c = new PDO("mysql:host=$h;dbname=$d", $u, $p); echo "  RESULT: CONNECTED\n"; }
catch (Exception $e) { echo "  RESULT: FAILED - ".substr($e->getMessage(),0,110)."\n"; }
' 2>&1 | tail -4

echo
echo "=== 3. LARAVEL ITSELF (artisan) ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php artisan db:show --json 2>/dev/null | head -c 200 || echo "  db:show unavailable"
echo
docker exec -w /var/www/projects/nexg/backend nexg-apps sh -c 'php artisan --version' 2>/dev/null | head -2

echo
echo "=== 4. DOES A REAL API ROUTE WORK? (find the prefix) ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php artisan route:list --json 2>/dev/null | head -c 300 || echo "  route:list unavailable"

echo
echo "=== 5. SITE + RECENT ERRORS ==="
curl -sS -o /dev/null -w '  /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
docker logs nexg-apps --since 5m 2>&1 | grep -iE 'SQLSTATE|access denied|connection refused' | tail -4 || echo "  no db errors in logs"

echo
echo "=== DONE ==="
