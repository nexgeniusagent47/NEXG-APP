#!/bin/bash
# INVENTORY before rotating the MySQL password. Read-only.
# The password $OLD_MYSQL_PASSWORD is committed in plaintext in the compose file and is the
# ROOT password. Before changing it we must find every consumer, or the live site breaks.
echo "=== 1. EVERY FILE CONTAINING THE CURRENT PASSWORD ==="
grep -rln '$OLD_MYSQL_PASSWORD' /var/www/apps /root /home 2>/dev/null | grep -v '\.git/' | head -20

echo
echo "=== 2. LARAVEL .env DB SETTINGS ==="
sed 's/\(PASSWORD=\).*/\1<redacted>/' /var/www/apps/projects/nexg/backend/.env 2>/dev/null | grep -E '^DB_'

echo
echo "=== 3. GO API CONTAINERS — DO THEY SHARE THIS DATABASE? ==="
for c in nexg-api-1 nexg-kernel-1; do
  echo "--- $c ---"
  docker inspect "$c" 2>/dev/null | grep -iE 'MYSQL|DATABASE_URL|DB_HOST|DB_PASS|DSN' | head -6 || echo "  not found"
done

echo
echo "=== 4. WAS THIS DB EVER EXPOSED? (for the record) ==="
echo "  published as 0.0.0.0:9106 until 18:22 today"

echo
echo "=== 5. MYSQL USERS AND THEIR HOSTS ==="
docker exec nexg-apps-db mysql -u root -p$OLD_MYSQL_PASSWORD -N -e "SELECT user, host FROM mysql.user;" 2>/dev/null || echo "  could not query"

echo
echo "=== 6. WHICH DATABASES EXIST? ==="
docker exec nexg-apps-db mysql -u root -p$OLD_MYSQL_PASSWORD -N -e "SHOW DATABASES;" 2>/dev/null || echo "  could not query"

echo
echo "=== 7. IS THE GO API USING MYSQL AT ALL? ==="
docker exec nexg-api-1 sh -c 'env | grep -iE "mysql|db_|database" || echo "  no DB env vars"' 2>/dev/null || echo "  could not exec"

echo
echo "=== DONE - nothing changed ==="
