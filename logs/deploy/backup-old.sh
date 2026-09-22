#!/bin/bash
# FULL BACKUP of the existing stack before it is replaced.
#
# Nothing here asks permission because nothing here is destructive — it only reads and
# writes to a new backup directory. The point is that "remove the old rubbish" becomes
# reversible, and the user is not one regret away from losing a live database.
set -e

STAMP=$(date +%Y%m%d-%H%M%S)
BK="/var/backups/nexg-old-$STAMP"
mkdir -p "$BK"
echo "backup dir: $BK"

echo
echo "=== 1. MYSQL DUMP (the part that cannot be recreated) ==="
PW=$(awk -F= '/^DB_PASSWORD=/{sub(/^DB_PASSWORD=/,""); print; exit}' /var/www/apps/projects/nexg/backend/.env)
docker exec nexg-apps-db sh -c "exec mysqldump -u root -p'$PW' --all-databases --routines --triggers --events --single-transaction" > "$BK/mysql-all-databases.sql" 2>"$BK/mysqldump.err" || true
SIZE=$(stat -c %s "$BK/mysql-all-databases.sql" 2>/dev/null || echo 0)
echo "  mysql-all-databases.sql: $((SIZE/1024)) KB"
if [ "$SIZE" -lt 10000 ]; then
  echo "  WARNING: dump looks small — checking stderr"
  head -5 "$BK/mysqldump.err" 2>/dev/null | sed 's/^/    /'
fi
gzip -f "$BK/mysql-all-databases.sql"
echo "  compressed: $(( $(stat -c %s "$BK/mysql-all-databases.sql.gz") / 1024 )) KB"

echo
echo "=== 2. WHAT IS ACTUALLY IN THAT DATABASE? (so we know what we are about to remove) ==="
for db in dev nexg; do
  echo "--- $db ---"
  docker exec nexg-apps-db mysql -u root -p"$PW" -N -e \
    "SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema='$db' ORDER BY table_rows DESC LIMIT 8;" 2>/dev/null | sed 's/^/    /' || echo "    (could not read)"
  COUNT=$(docker exec nexg-apps-db mysql -u root -p"$PW" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$db';" 2>/dev/null)
  echo "    total tables: $COUNT"
done

echo
echo "=== 3. ALL PROJECT FILES (tar, excluding vendor dirs) ==="
tar czf "$BK/projects-nexg.tar.gz" \
  --exclude='node_modules' --exclude='.git/objects' \
  -C /var/www/apps projects 2>/dev/null || \
tar czf "$BK/projects-tony.tar.gz" -C /var/www/apps projects
echo "  projects-nexg.tar.gz: $(( $(stat -c %s "$BK/projects-nexg.tar.gz") / 1024 )) KB"

echo
echo "=== 4. COMPOSE FILES + NGINX CONFIGS ==="
cp -a /var/www/apps/docker-compose.yml "$BK/" 2>/dev/null || true
cp -a /var/www/apps/Dockerfile "$BK/" 2>/dev/null || true
tar czf "$BK/nginx-configs.tar.gz" -C / etc/nginx/sites-available /etc/nginx/sites-enabled /etc/nginx/conf.d /var/www/apps/docker-compose 2>/dev/null || true
echo "  nginx-configs.tar.gz: $(( $(stat -c %s "$BK/nginx-configs.tar.gz") / 1024 )) KB"

echo
echo "=== 5. THE MYSQL DATA VOLUME (the raw files, as a last resort) ==="
VOLPATH=$(docker inspect nexg-apps-db --format '{{range .Mounts}}{{if eq .Destination "/var/lib/mysql"}}{{.Source}}{{end}}{{end}}' 2>/dev/null)
echo "  volume path: $VOLPATH"
if [ -n "$VOLPATH" ] && [ -d "$VOLPATH" ]; then
  tar czf "$BK/mysql-volume.tar.gz" -C "$(dirname "$VOLPATH")" "$(basename "$VOLPATH")" 2>/dev/null && \
    echo "  mysql-volume.tar.gz: $(( $(stat -c %s "$BK/mysql-volume.tar.gz") / 1024 )) KB" || echo "  (volume tar failed - the SQL dump above is the primary)"
fi

echo
echo "=== 6. RECORD WHAT WAS RUNNING, for exact restoration ==="
docker ps -a --format '{{.Names}} | {{.Image}} | {{.Status}}' > "$BK/containers-before.txt" 2>/dev/null
docker images --format '{{.Repository}}:{{.Tag}}' > "$BK/images-before.txt" 2>/dev/null
cp -a /var/www/apps/projects/nexg/backend/.env "$BK/backend.env.bak" 2>/dev/null || true
echo "  containers, images and .env recorded"

echo
echo "=== 7. BACKUP CONTENTS ==="
ls -lah "$BK" | sed 's/^/  /'

echo
echo "=== 8. HOW TO RESTORE (documented while it is still fresh) ==="
cat > "$BK/RESTORE.md" <<EOF
# Restoring the old stack

Backup taken: $STAMP (server time), from /var/www/apps

## The database (the only irreplaceable part)
    cd /var/www/apps && docker compose up -d mysql
    gunzip -c $BK/mysql-all-databases.sql.gz | docker exec -i nexg-apps-db mysql -u root -p

## The files
    tar xzf $BK/projects-nexg.tar.gz -C /var/www/apps/

## nginx + compose
    tar xzf $BK/nginx-configs.tar.gz -C /

## The containers
    cd /var/www/apps && docker compose up -d
EOF
echo "  RESTORE.md written into the backup"

echo
echo "=== DONE - backup complete, nothing destroyed ==="
