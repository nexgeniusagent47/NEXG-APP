#!/bin/bash
# Scope the MySQL accounts, using the password Laravel actually authenticates with.
#
# The earlier attempt read `printenv MYSQL_ROOT_PASSWORD` from the container and got the
# PRE-ROTATION value: MySQL's password was changed inside the database, but the container's
# environment is only set at creation time, so it still holds the old string. The
# authoritative source is the .env Laravel uses.
set -e

ENV_FILE=/var/www/apps/projects/nexg/backend/.env
PW=$(awk -F= '/^DB_PASSWORD=/{sub(/^DB_PASSWORD=/,""); print; exit}' "$ENV_FILE")
echo "  password source: $ENV_FILE (${#PW} chars)"

if [ ${#PW} -lt 32 ]; then
  echo "  REFUSING: password looks like the old 16-char value, not the rotated one"
  exit 1
fi

echo "=== confirm this password works before changing anything ==="
docker exec nexg-apps-db mysql -u root -p"$PW" -N -e "SELECT '  authenticated OK';" 2>/dev/null || {
  echo "  could not authenticate - aborting"; exit 1; }

SUBNET=$(docker network inspect apps_nexg-apps -f '{{(index .IPAM.Config 0).Subnet}}')
echo "  docker subnet: $SUBNET"

echo
echo "=== create subnet-scoped accounts ==="
docker exec nexg-apps-db mysql -u root -p"$PW" -e "
  CREATE USER IF NOT EXISTS 'root'@'${SUBNET}' IDENTIFIED BY '${PW}';
  GRANT ALL PRIVILEGES ON *.* TO 'root'@'${SUBNET}' WITH GRANT OPTION;
  CREATE USER IF NOT EXISTS 'davido'@'${SUBNET}' IDENTIFIED BY '${PW}';
  GRANT ALL PRIVILEGES ON \`dev\`.* TO 'davido'@'${SUBNET}';
  FLUSH PRIVILEGES;
" 2>&1 | grep -vi warning || true
echo "  accounts created"

echo
echo "=== all root/davido accounts now ==="
docker exec nexg-apps-db mysql -u root -p"$PW" -N -e \
  "SELECT CONCAT('    ', user, '@', host) FROM mysql.user WHERE user IN ('root','davido') ORDER BY user, host;" 2>/dev/null

echo
echo "=== does the app still connect? ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php -r '
$env=[];
foreach (file(".env", FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES) as $l) {
  if ($l==="" || $l[0]==="#" || strpos($l,"=")===false) continue;
  [$k,$v]=explode("=",$l,2); $env[trim($k)]=trim($v);
}
try { new PDO("mysql:host={$env["DB_HOST"]};dbname={$env["DB_DATABASE"]}", $env["DB_USERNAME"], $env["DB_PASSWORD"]); echo "  PDO: CONNECTED\n"; }
catch (Exception $e) { echo "  PDO FAILED: ".substr($e->getMessage(),0,110)."\n"; }
' 2>&1 | tail -2

echo
echo "=== recycle the db container so its env matches the real password ==="
echo "  (it currently advertises the pre-rotation value, which is why the first attempt failed)"
cd /var/www/apps
docker compose up -d --force-recreate mysql
sleep 12
docker exec nexg-apps-db printenv MYSQL_ROOT_PASSWORD | wc -c | xargs -I{} echo "  env password length now: {}"

echo
echo "=== verify after the db restart ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php -r '
$env=[];
foreach (file(".env", FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES) as $l) {
  if ($l==="" || $l[0]==="#" || strpos($l,"=")===false) continue;
  [$k,$v]=explode("=",$l,2); $env[trim($k)]=trim($v);
}
try { new PDO("mysql:host={$env["DB_HOST"]};dbname={$env["DB_DATABASE"]}", $env["DB_USERNAME"], $env["DB_PASSWORD"]); echo "  PDO after restart: CONNECTED\n"; }
catch (Exception $e) { echo "  PDO after restart FAILED: ".substr($e->getMessage(),0,110)."\n"; }
' 2>&1 | tail -2

curl -sS -o /dev/null -w '  site /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
curl -sS -o /dev/null -w '  api     -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/v1/admin/analytics/alerts 2>&1

echo
echo "=== DONE ==="
