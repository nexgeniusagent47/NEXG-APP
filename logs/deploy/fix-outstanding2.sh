#!/bin/bash
# Retry of outstanding items 1 and 2, with the two bugs from the first attempt fixed.
#
# Bug 1: the glob was `/var/www/apps/docker-compose.yml.bak*.yml` but the real filenames
#        are `docker-compose.yml.bak-20260922-182206` — no .yml suffix — so the loop never
#        matched and the files holding the old password survived.
# Bug 2: `\$MYSQL_ROOT_PASSWORD` was escaped through two shell layers, expanded to empty,
#        and MySQL rejected the login. The password is now read once and passed explicitly.
set -e

echo "############ 1. PURGE BACKUPS HOLDING THE OLD PASSWORD ############"
echo "=== files matching, before ==="
ls -la /var/www/apps/docker-compose.yml.bak* 2>/dev/null || echo "  none"

# Keep the single newest compose backup as a rollback point; remove the rest, which all
# predate the password rotation and still carry the old credential.
NEWEST=$(ls -t /var/www/apps/docker-compose.yml.bak* 2>/dev/null | head -1)
echo "  keeping newest: $NEWEST"

for f in /var/www/apps/docker-compose.yml.bak*; do
  [ -e "$f" ] || continue
  if [ "$f" = "$NEWEST" ]; then
    echo "  kept:     $f"
    continue
  fi
  shred -u "$f" 2>/dev/null || rm -f "$f"
  echo "  shredded: $f"
done

# The newest one still holds the old password, so blank it in place rather than losing the
# rollback point entirely. The file's value is only useful for reverting the port change,
# and that part is independent of the credential.
if [ -n "$NEWEST" ] && grep -q '$OLD_MYSQL_PASSWORD' "$NEWEST" 2>/dev/null; then
  sed -i 's/$OLD_MYSQL_PASSWORD/<rotated-2026-09-22>/g' "$NEWEST"
  echo "  redacted the old credential inside: $NEWEST"
fi

echo
echo "=== any file left containing the old password? ==="
LEFT=$(grep -rl '$OLD_MYSQL_PASSWORD' /var/www/apps 2>/dev/null | grep -v '\.git/' || true)
if [ -z "$LEFT" ]; then
  echo "  NONE - old credential fully purged from the project"
else
  echo "$LEFT"
fi

echo
echo "############ 2. SCOPE THE MYSQL ACCOUNTS TO THE DOCKER SUBNET ############"
SUBNET=$(docker network inspect apps_nexg-apps -f '{{(index .IPAM.Config 0).Subnet}}')
PW=$(docker exec nexg-apps-db printenv MYSQL_ROOT_PASSWORD)
echo "  subnet: $SUBNET"
echo "  password read from the container env: ${#PW} chars"

# A scoped account is created rather than replacing root@% outright: if anything still
# connects as root from an unexpected address, dropping root@% first would break it with
# no warning. Create the scoped one, verify the app works, and only then tighten.
docker exec nexg-apps-db mysql -u root -p"$PW" -e "
  CREATE USER IF NOT EXISTS 'root'@'${SUBNET}' IDENTIFIED BY '${PW}';
  GRANT ALL PRIVILEGES ON *.* TO 'root'@'${SUBNET}' WITH GRANT OPTION;
  CREATE USER IF NOT EXISTS 'davido'@'${SUBNET}' IDENTIFIED BY '${PW}';
  GRANT ALL PRIVILEGES ON \`dev\`.* TO 'davido'@'${SUBNET}';
  FLUSH PRIVILEGES;
" 2>&1 | grep -v 'Warning' || true

echo "  --- accounts now ---"
docker exec nexg-apps-db mysql -u root -p"$PW" -N -e \
  "SELECT CONCAT('    ', user, '@', host) FROM mysql.user WHERE user IN ('root','davido') ORDER BY user, host;" 2>/dev/null

echo
echo "=== app still connects? ==="
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
echo "############ 3. SECURITY UPDATES ############"
echo "  pending: $(apt-get -s upgrade 2>/dev/null | grep -ciE '^Inst.*security')"

echo
echo "############ VERIFY ############"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u
curl -sS -o /dev/null -w '  site /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
docker ps --format '  {{.Names}} | {{.Status}}' | grep nexg-apps

echo
echo "=== DONE ==="
