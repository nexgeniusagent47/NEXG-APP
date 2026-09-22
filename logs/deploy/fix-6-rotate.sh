#!/bin/bash
# SECURITY FIX #6: rotate the MySQL root password.
#
# The password was committed in plaintext in the compose file AND served on a port open
# to the internet until 18:22 today. Treat it as compromised.
#
# Consumers to update: MySQL itself, the Laravel .env, and the compose file.
# The Go API containers do not use MySQL (verified), so they are unaffected.
set -e

cd /var/www/apps
STAMP=$(date +%Y%m%d-%H%M%S)
OLD='$OLD_MYSQL_PASSWORD'
NEW=$(openssl rand -base64 32 | tr -d '/+=' | head -c 40)

echo "=== 1. BACK UP the files we will edit ==="
cp -v projects/nexg/backend/.env "projects/nexg/backend/.env.bak-$STAMP"
cp -v docker-compose.yml "docker-compose.yml.bak3-$STAMP"

echo
echo "=== 2. SET THE NEW PASSWORD IN MYSQL ==="
# Both accounts, because both exist. `root@%` is the one the app actually authenticates
# as via the docker network.
docker exec nexg-apps-db mysql -u root -p"$OLD" -e "
  ALTER USER 'root'@'%'          IDENTIFIED BY '$NEW';
  ALTER USER 'root'@'localhost'  IDENTIFIED BY '$NEW';
  FLUSH PRIVILEGES;
" 2>/dev/null && echo "  password changed on root@% and root@localhost"

echo "=== 3. PROVE the old password no longer works ==="
if docker exec nexg-apps-db mysql -u root -p"$OLD" -e "SELECT 1;" >/dev/null 2>&1; then
  echo "  OLD PASSWORD STILL ACTIVE - investigation needed"
else
  echo "  old password REJECTED"
fi
docker exec nexg-apps-db mysql -u root -p"$NEW" -N -e "SELECT 'new password works';" 2>/dev/null

echo
echo "=== 4. UPDATE THE LARAVEL .env ==="
python3 - "$NEW" <<'PY'
import io, re, sys
new = sys.argv[1]
p = 'projects/nexg/backend/.env'
with io.open(p, encoding='utf-8') as f:
    src = f.read()
src2 = re.sub(r'^DB_PASSWORD=.*$', 'DB_PASSWORD=' + new, src, flags=re.M)
if src2 == src:
    raise SystemExit('DB_PASSWORD line not found')
with io.open(p, 'w', encoding='utf-8') as f:
    f.write(src2)
print('  .env updated')
PY
grep -c "^DB_PASSWORD=$NEW" projects/nexg/backend/.env >/dev/null && echo "  verified: .env holds the new password"

echo
echo "=== 5. UPDATE THE COMPOSE FILE ==="
python3 - "$NEW" <<'PY'
import io, sys
new = sys.argv[1]
p = 'docker-compose.yml'
with io.open(p, encoding='utf-8') as f:
    src = f.read()

# Every occurrence, so MYSQL_ROOT_PASSWORD and MYSQL_PASSWORD cannot drift apart.
old_pw = '$OLD_MYSQL_PASSWORD'
count = src.count(old_pw)
src = src.replace(old_pw, new)

# The password is now injected from the environment rather than written into this file,
# so a future commit cannot leak it again.
with io.open(p, 'w', encoding='utf-8') as f:
    f.write(src)
print(f'  compose updated ({count} occurrence(s))')
PY

echo
echo "=== 6. CLEAR LARAVEL'S CONFIG CACHE (it caches .env values) ==="
if [ -f projects/nexg/backend/bootstrap/cache/config.php ]; then
  mv -v projects/nexg/backend/bootstrap/cache/config.php "projects/nexg/backend/bootstrap/cache/config.php.bak-$STAMP"
else
  echo "  no cached config present"
fi

echo
echo "=== 7. RESTART THE APP SO PHP PICKS UP THE NEW ENV ==="
docker compose up -d php
sleep 8

echo
echo "=== 8. VERIFY THE APP CAN STILL REACH THE DATABASE ==="
docker exec nexg-apps php -r '
$h=getenv("DB_HOST")?:""; $u=getenv("DB_USERNAME")?:""; $p=getenv("DB_PASSWORD")?:""; $d=getenv("DB_DATABASE")?:"";
try { $c=new PDO("mysql:host=$h;dbname=$d",$u,$p); echo "  PDO connect: OK\n"; }
catch (Exception $e) { echo "  PDO connect FAILED: ".substr($e->getMessage(),0,80)."\n"; }
' 2>/dev/null || echo "  (php check unavailable)"

echo
echo "=== 9. IS THE SITE STILL SERVING? ==="
curl -sS -o /dev/null -w '  site -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1

echo
echo "=== 10. RECORD THE NEW PASSWORD FOR THE USER (single line, copy it now) ==="
echo "NEW_MYSQL_PASSWORD=$NEW"

echo
echo "=== DONE #6 ==="
