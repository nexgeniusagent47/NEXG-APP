#!/bin/bash
# COMPROMISE CHECK — read-only. Before wiping anything, establish whether the host is clean.
# A backdoor survives a redeploy, so this runs first.

echo "############ 1. SUSPICIOUS LISTENERS ############"
echo "--- every listening socket with its owning process ---"
ss -ltnp 2>/dev/null | tail -n +2 | while read -r line; do
  echo "  $line" | sed 's/  */ /g' | cut -c1-150
done

echo
echo "--- anything listening on a high or unexpected port? ---"
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | sed 's/.*://' | sort -un | while read -r p; do
  case "$p" in
    22|80|443|53|3001|5433|9106|7001) ;;
    *) echo "  UNEXPECTED PORT: $p" ;;
  esac
done
echo "  (ports known and expected: 22 80 443 53 3001 5433 9106 7001)"

echo
echo "############ 2. PROCESSES: anything not explainable? ############"
echo "--- listening process binaries ---"
ss -ltnp 2>/dev/null | grep -oP 'users:\(\("\K[^"]+' | sort -u | while read -r p; do
  path=$(command -v "$p" 2>/dev/null || echo "?")
  echo "  $p -> $path"
done

echo
echo "--- processes running from /tmp, /dev/shm, /var/tmp (classic backdoor locations) ---"
ls -la /proc/*/exe 2>/dev/null | grep -E '/tmp/|/dev/shm|/var/tmp' | head -10 || echo "  none"

echo
echo "--- top CPU consumers ---"
ps aux --sort=-%cpu 2>/dev/null | head -6 | sed 's/^/  /'

echo
echo "############ 3. PERSISTENCE MECHANISMS ############"
echo "--- root crontab ---"
crontab -l 2>/dev/null | sed 's/^/  /' || echo "  empty"
echo "--- all user crontabs ---"
ls -la /var/spool/cron/crontabs/ 2>/dev/null | sed 's/^/  /' || echo "  none"
echo "--- /etc/cron.d ---"
ls -la /etc/cron.d/ 2>/dev/null | sed 's/^/  /'
for f in /etc/cron.d/*; do [ -f "$f" ] && { echo "  --- $f ---"; cat "$f" | grep -v '^#' | grep -v '^$' | sed 's/^/    /'; }; done

echo
echo "--- systemd units added recently (last 30 days) ---"
find /etc/systemd/system -name '*.service' -mtime -30 2>/dev/null | sed 's/^/  /' || echo "  none recent"

echo
echo "--- rc.local / profile.d / bashrc tail ---"
[ -f /etc/rc.local ] && { echo "  --- /etc/rc.local ---"; cat /etc/rc.local | sed 's/^/    /'; } || echo "  no rc.local"
ls -la /etc/profile.d/ 2>/dev/null | tail -5 | sed 's/^/  /'

echo
echo "############ 4. AUTHORIZED KEYS — anyone else in? ############"
echo "--- root ---"
if [ -f /root/.ssh/authorized_keys ]; then
  awk '{print "  " $1 " " substr($2,1,20) "..." " " $3}' /root/.ssh/authorized_keys
else
  echo "  none"
fi
echo "--- all other users with authorized_keys ---"
find /home /root -maxdepth 3 -name 'authorized_keys' 2>/dev/null | while read -r f; do
  echo "  $f:"; awk '{print "    " $1 " ... " $3}' "$f"
done

echo
echo "############ 5. RECENT MODIFICATIONS IN SYSTEM DIRECTORIES ############"
echo "--- files changed in /etc, /usr/local/bin, /usr/bin in the last 7 days ---"
find /etc /usr/local/bin /usr/local/sbin -type f -mtime -7 2>/dev/null | head -20 | sed 's/^/  /' || echo "  none"

echo
echo "############ 6. SSH BRUTE-FORCE / SUCCESSFUL LOGINS ############"
echo "--- accepted logins in the last 7 days (are any not us?) ---"
journalctl -u ssh --since '7 days ago' 2>/dev/null | grep -i 'Accepted' | tail -12 | sed 's/^/  /' || echo "  none readable"
echo "--- count of accepted logins ---"
journalctl -u ssh --since '7 days ago' 2>/dev/null | grep -ci 'Accepted' || echo "  0"

echo
echo "############ 7. DOCKER: anything unexpected? ############"
docker ps -a --format '  {{.Names}} | {{.Image}} | {{.Status}}' 2>/dev/null
echo "--- images ---"
docker images --format '  {{.Repository}}:{{.Tag}} {{.Size}}' 2>/dev/null | head -12
echo "--- containers NOT part of a compose project ---"
for c in $(docker ps -aq 2>/dev/null); do
  name=$(docker inspect -f '{{.Name}}' "$c" 2>/dev/null | tr -d '/')
  proj=$(docker inspect -f '{{index .Config.Labels "com.docker.compose.project"}}' "$c" 2>/dev/null)
  [ -z "$proj" ] || [ "$proj" = "<no value>" ] && echo "  ORPHAN: $name (no compose project)"
done
echo "  (nothing listed = every container belongs to a compose project)"

echo
echo "############ 8. NETWORK CONNECTIONS OUT (C2 beacons?) ############"
ss -tnp state established 2>/dev/null | grep -v '127.0.0.1\|::1' | head -12 | sed 's/^/  /' || echo "  none"

echo
echo "############ DONE — nothing changed ############"
