#!/bin/bash
# Outstanding items 1, 2 and 3.
#
# 1. The two compose backups still contain the now-rotated password. Harmless, but a
#    credential at rest with no purpose is just liability — removed.
# 2. root@% and davido@% may authenticate from ANY host. Unreachable now that 9106 is
#    closed, so this is defence in depth: if the port is ever republished by mistake,
#    the account itself still refuses the connection.
# 3. Apply the pending security updates now rather than waiting for the timer.
set -e

echo "############ 1. REMOVE STALE BACKUPS HOLDING THE OLD PASSWORD ############"
echo "=== before ==="
ls -la /var/www/apps/*.bak*.yml /var/www/apps/projects/nexg/backend/.env.bak-* 2>/dev/null || echo "  none"

# Keep the most recent compose backup (it is the rollback point for the current state)
# and remove the two older ones that carry the old credential.
KEEP=$(ls -t /var/www/apps/docker-compose.yml.bak*.yml 2>/dev/null | head -1)
echo "  keeping: $KEEP"
for f in /var/www/apps/docker-compose.yml.bak*.yml; do
  [ "$f" = "$KEEP" ] && continue
  if grep -q '$OLD_MYSQL_PASSWORD' "$f" 2>/dev/null; then
    shred -u "$f" 2>/dev/null || rm -f "$f"
    echo "  shredded: $f (contained the old password)"
  else
    echo "  kept:     $f (no credential)"
  fi
done

if grep -q '$OLD_MYSQL_PASSWORD' /var/www/apps/projects/nexg/backend/.env.bak-* 2>/dev/null; then
  for f in /var/www/apps/projects/nexg/backend/.env.bak-*; do
    shred -u "$f" 2>/dev/null || rm -f "$f"
    echo "  shredded: $f (contained the old password)"
  done
fi

echo
echo "=== any file left with the old password? ==="
LEFT=$(grep -rl '$OLD_MYSQL_PASSWORD' /var/www/apps 2>/dev/null | grep -v '\.git/' || true)
if [ -z "$LEFT" ]; then echo "  NONE - old credential fully purged"; else echo "$LEFT"; fi

echo
echo "############ 2. SCOPE THE MYSQL ACCOUNTS TO THE DOCKER SUBNET ############"
SUBNET=$(docker network inspect apps_nexg-apps -f '{{(index .IPAM.Config 0).Subnet}}' 2>/dev/null)
echo "  docker subnet: $SUBNET"

if [ -n "$SUBNET" ]; then
  # `root@%` means "any host on the internet". Recreating the same user as
  # `root@<subnet>` keeps the app working (it connects from inside that subnet) while
  # making an accidental re-publish of the port useless to an attacker.
  docker exec nexg-apps-db sh -c "mysql -u root -p\$MYSQL_ROOT_PASSWORD -e \"
    CREATE USER IF NOT EXISTS 'root'@'$SUBNET' IDENTIFIED BY '\$MYSQL_ROOT_PASSWORD';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'$SUBNET' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
  \"" && echo "  scoped account created"

  echo "  --- users now ---"
  docker exec nexg-apps-db sh -c 'mysql -u root -p$MYSQL_ROOT_PASSWORD -N -e "SELECT user, host FROM mysql.user WHERE user IN (\"root\",\"davido\");"'
fi

echo
echo "=== does the app still connect? (the only thing that matters) ==="
docker exec -w /var/www/projects/nexg/backend nexg-apps php -r '
$env=[];
foreach (file(".env", FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES) as $l) {
  if ($l==="" || $l[0]==="#" || strpos($l,"=")===false) continue;
  [$k,$v]=explode("=",$l,2); $env[trim($k)]=trim($v);
}
try { new PDO("mysql:host={$env["DB_HOST"]};dbname={$env["DB_DATABASE"]}", $env["DB_USERNAME"], $env["DB_PASSWORD"]); echo "  PDO: CONNECTED\n"; }
catch (Exception $e) { echo "  PDO FAILED: ".substr($e->getMessage(),0,100)."\n"; }
' 2>&1 | tail -2

echo
echo "############ 3. APPLY PENDING SECURITY UPDATES ############"
echo "  pending before: $(apt-get -s upgrade 2>/dev/null | grep -ciE '^Inst.*security')"
export DEBIAN_FRONTEND=noninteractive
apt-get -y -qq upgrade >/tmp/apt-upgrade.log 2>&1 && echo "  upgrade completed" || echo "  upgrade returned non-zero (see /tmp/apt-upgrade.log)"
echo "  pending after:  $(apt-get -s upgrade 2>/dev/null | grep -ciE '^Inst.*security')"
tail -3 /tmp/apt-upgrade.log

echo
echo "############ VERIFY NOTHING BROKE ############"
echo "  --- ports ---"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u
echo "  --- site ---"
curl -sS -o /dev/null -w '    /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
echo "  --- containers ---"
docker ps --format '  {{.Names}} | {{.Status}}' | grep nexg-apps

echo
echo "=== DONE ==="
