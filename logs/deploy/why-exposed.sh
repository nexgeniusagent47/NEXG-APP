#!/bin/bash
# Why is Postgres published on 0.0.0.0, and what does the config actually say?
APP=/var/www/apps/projects/nexg-concierge
cd "$APP"

echo "############ 1. WHAT IS PUBLISHED RIGHT NOW ############"
docker ps --format '  {{.Names}} | {{.Ports}}'

echo
echo "############ 2. WHAT THE COMPOSE FILE SAYS ############"
echo "--- every ports: block in docker-compose.yml ---"
grep -n -A3 'ports:' docker-compose.yml | sed 's/^/  /'

echo
echo "############ 3. IS THERE AN OVERRIDE FILE? ############"
ls -la docker-compose*.yml compose*.yml 2>/dev/null | sed 's/^/  /'
echo "--- which files compose actually loads ---"
docker compose config --services 2>/dev/null | sed 's/^/  service: /'
docker compose config 2>/dev/null | grep -A3 'published:' | sed 's/^/  /' | head -20

echo
echo "############ 4. WHAT DOCKER RECORDS FOR THE RUNNING CONTAINER ############"
docker inspect nexg-concierge-postgres-1 --format '{{json .HostConfig.PortBindings}}' | sed 's/^/  /'
docker inspect nexg-concierge-app-1 --format '{{json .HostConfig.PortBindings}}' | sed 's/^/  /'

echo
echo "############ 5. WHEN WERE THEY CREATED? ############"
docker inspect nexg-concierge-postgres-1 --format '  created: {{.Created}}'
docker inspect nexg-concierge-app-1 --format '  created: {{.Created}}'
echo "  (compare with when the compose file was last changed)"
stat -c '  docker-compose.yml modified: %y' docker-compose.yml

echo
echo "############ 6. IS THE DATABASE ALSO LISTENING INSIDE THE CONTAINER ON ALL INTERFACES? ############"
docker exec nexg-concierge-postgres-1 sh -c 'grep -E "^listen_addresses|^port" /var/lib/postgresql/data/postgresql.conf 2>/dev/null; cat /var/lib/postgresql/data/pg_hba.conf 2>/dev/null | grep -vE "^#|^$"' | sed 's/^/  /'

echo
echo "=== DONE - nothing changed ==="
