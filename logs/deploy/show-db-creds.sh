#!/bin/bash
# Report the database credentials, and PROVE they work rather than just printing them.
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "=== the connection string the app uses ==="
grep '^DATABASE_URL' .env

echo
echo "=== parsed ==="
URL=$(grep '^DATABASE_URL' .env | sed 's/^DATABASE_URL=//')
REST=${URL#postgresql://}
USERPASS=${REST%%@*}
HOSTPART=${REST#*@}
DBUSER=${USERPASS%%:*}
DBPASS=${USERPASS#*:}
HOSTPORT=${HOSTPART%%/*}
DBNAME=${HOSTPART#*/}
echo "  user     : $DBUSER"
echo "  password : $DBPASS"
echo "  host     : ${HOSTPORT%%:*}"
echo "  port     : ${HOSTPORT##*:}"
echo "  database : $DBNAME"

echo
echo "=== postgres container environment ==="
docker exec nexg-concierge-postgres-1 sh -c 'echo "  POSTGRES_USER : $POSTGRES_USER"; echo "  POSTGRES_DB   : $POSTGRES_DB"; echo "  password len  : ${#POSTGRES_PASSWORD}"'

echo
echo "=== PROOF: do these credentials actually log in? ==="
docker exec nexg-concierge-postgres-1 sh -c "PGPASSWORD='$DBPASS' psql -U '$DBUSER' -d '$DBNAME' -t -c \"SELECT '  LOGIN OK, public tables: ' || count(*) FROM information_schema.tables WHERE table_schema='public';\"" 2>&1 | head -3

echo
echo "=== and can they read real data? ==="
docker exec nexg-concierge-postgres-1 sh -c "PGPASSWORD='$DBPASS' psql -U '$DBUSER' -d '$DBNAME' -t -c \"SELECT '  merchants: ' || count(*) FROM merchants;\"" 2>&1 | head -2

echo
echo "=== the exposure, confirmed closed ==="
echo "  listener: $(ss -ltn 2>/dev/null | grep 5433 | awk '{print $4}' | head -1)"
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/212.95.32.229/5433' 2>/dev/null \
  && echo "  public IP 5433: OPEN" \
  || echo "  public IP 5433: CLOSED"

echo
echo "=== NOTE ON PASSWORD STRENGTH ==="
echo "  The database password is short and guessable. It no longer matters much now that"
echo "  5433 is loopback-only, but it should still be rotated: it is in .env, and .env"
echo "  values end up in backups and logs."
