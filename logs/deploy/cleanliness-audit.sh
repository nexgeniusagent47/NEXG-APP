#!/bin/bash
# FULL SERVER CLEANLINESS AUDIT — read-only. What is actually left over?
echo "############ 1. CONTAINERS ############"
docker ps -a --format '  {{.Names}} | {{.Image}} | {{.Status}}'
echo "  total: $(docker ps -aq 2>/dev/null | wc -l)"

echo
echo "############ 2. IMAGES ############"
docker images --format '  {{.Repository}}:{{.Tag}} | {{.Size}}'
echo "  dangling (untagged) images: $(docker images -f dangling=true -q 2>/dev/null | wc -l)"

echo
echo "############ 3. VOLUMES — the thing most often forgotten ############"
docker volume ls --format '  {{.Name}} | {{.Driver}}'
echo "  --- volumes NOT in use by any container ---"
for v in $(docker volume ls -q 2>/dev/null); do
  used=$(docker ps -a --filter volume="$v" --format '{{.Names}}' 2>/dev/null | wc -l)
  [ "$used" -eq 0 ] && echo "    ORPHAN: $v ($(docker volume inspect "$v" --format '{{.Mountpoint}}' 2>/dev/null))"
done
echo "  (nothing listed = every volume is in use)"

echo
echo "############ 4. NETWORKS ############"
docker network ls --format '  {{.Name}} | {{.Driver}}'
echo "  --- networks with no containers ---"
for n in $(docker network ls --filter type=custom -q 2>/dev/null); do
  c=$(docker network inspect "$n" --format '{{len .Containers}}' 2>/dev/null)
  name=$(docker network inspect "$n" --format '{{.Name}}' 2>/dev/null)
  [ "$c" = "0" ] && echo "    ORPHAN: $name"
done

echo
echo "############ 5. OLD PROJECT FILES ############"
echo "--- /var/www/apps (top level) ---"
ls -la /var/www/apps | sed 's/^/  /'
echo "--- /var/www/apps/projects ---"
ls -la /var/www/apps/projects | sed 's/^/  /'

echo
echo "############ 6. ANY TRACE OF THE OLD APP ELSEWHERE? ############"
echo "--- paths containing 'nexg' outside our new app ---"
find / -maxdepth 4 -type d -name '*nexg*' 2>/dev/null | grep -v '/var/www/apps/projects/nexg-concierge' | grep -v '/proc\|/sys' | sed 's/^/  /' || echo "  none"
echo "--- the old MySQL volume path ---"
[ -d /.projects ] && { echo "  STILL EXISTS:"; du -sh /.projects 2>/dev/null | sed 's/^/    /'; } || echo "  /.projects gone"

echo
echo "############ 7. BIG FILES SOMEWHERE THEY SHOULD NOT BE ############"
echo "--- files over 200MB anywhere ---"
find / -xdev -type f -size +200M 2>/dev/null | head -10 | while read -r f; do
  echo "  $(du -h "$f" 2>/dev/null | cut -f1)  $f"
done || echo "  none"

echo
echo "############ 8. DISK ############"
df -h / | sed 's/^/  /'
echo "--- docker's own usage ---"
docker system df 2>/dev/null | sed 's/^/  /'

echo
echo "############ 9. WHAT IS RUNNING AND SERVING ############"
echo "--- public listeners ---"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u | sed 's/^/  /'
echo "--- site ---"
curl -sS -o /dev/null -w '  http://nexgapp.com/  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>/dev/null | head -c 150
echo

echo
echo "############ 10. TEMPORARY ARTEFACTS FROM MY WORK ############"
ls -la /tmp/*.log /tmp/*.tar.gz /tmp/*.sh 2>/dev/null | sed 's/^/  /' || echo "  none in /tmp"

echo
echo "=== AUDIT DONE - nothing changed ==="
