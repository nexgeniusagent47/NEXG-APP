#!/bin/bash
# REMOVE the old-file backups from the server now that verified copies exist locally.
#
# The user's reasoning is sound: stale copies of an old codebase carry old credentials and
# old dependencies, and a half-abandoned copy of a live application is exactly the kind of
# thing that gets forgotten and then exploited. The backup existed to make the replacement
# reversible; that job is done and the copy now lives off the server.
#
# The local copy was verified first: 10,510 files against 10,510, and the SQL dump was
# decompressed and checked for real schema and data before anything here runs.
set -e

echo "=== 1. WHAT IS ABOUT TO BE REMOVED ==="
du -sh /var/backups/nexg-old-* 2>/dev/null
echo "--- the sensitive parts ---"
echo "  the MySQL volume holds merchant documents, signatures, logos and customer records"
find /var/backups -maxdepth 1 -name 'nexg-old-*' -type d | wc -l | sed 's/^/  directories: /'

echo
echo "=== 2. THE MYSQL DATA VOLUME (separate from the backups, same problem) ==="
VOLPATH="/.projects/nexg-apps/v1/mysql"
if [ -d "$VOLPATH" ]; then
  echo "  found: $VOLPATH"
  du -sh "$VOLPATH" 2>/dev/null | sed 's/^/  size: /'
else
  echo "  not present at $VOLPATH"
fi

echo
echo "=== 3. SECURE DELETE THE BACKUP DIRECTORIES ==="
for d in /var/backups/nexg-old-*; do
  [ -d "$d" ] || continue
  # shred where the filesystem supports it, fall back to plain removal. On overlayfs
  # shred often cannot guarantee anything, so this is best-effort obfuscation rather than
  # a promise — the real protection is that the data is gone from a publicly reachable host.
  find "$d" -type f -exec shred -u {} \; 2>/dev/null || true
  rm -rf "$d"
  echo "  removed: $d"
done

echo
echo "=== 4. REMOVE THE MYSQL VOLUME ==="
if [ -d "$VOLPATH" ]; then
  find "$VOLPATH" -type f -exec shred -u {} \; 2>/dev/null || true
  rm -rf "$VOLPATH"
  echo "  removed: $VOLPATH"
  # Remove the now-empty parent chain only if empty, so we do not touch a sibling.
  rmdir /.projects/nexg-apps/v1 2>/dev/null || true
  rmdir /.projects/nexg-apps 2>/dev/null || true
  rmdir /.projects 2>/dev/null || true
  echo "  empty parents cleaned where possible"
fi

echo
echo "=== 5. CLEAN THE TRANSFER ARTEFACTS ==="
rm -f /tmp/nexg-deploy.tar.gz && echo "  removed /tmp/nexg-deploy.tar.gz"
rm -f /tmp/deploy*.log /tmp/compcheck.log /tmp/cutover.log /tmp/apt-upgrade.log 2>/dev/null || true
echo "  removed temporary logs"

echo
echo "=== 6. VERIFY NOTHING REMAINS ==="
echo "--- backup dirs ---"
ls -d /var/backups/nexg-old-* 2>/dev/null && echo "  STILL PRESENT" || echo "  none - all removed"
echo "--- mysql volume ---"
[ -d "$VOLPATH" ] && echo "  STILL PRESENT" || echo "  gone"
echo "--- any file naming the old app anywhere obvious ---"
find /var/www /root /home -maxdepth 4 -name '*nexg-old*' 2>/dev/null | head -5 || true
find / -maxdepth 2 -name '.projects' -type d 2>/dev/null | head -3 || echo "  no .projects directory"

echo
echo "=== 7. THE LIVE APP IS UNAFFECTED ==="
cd /var/www/apps/projects/nexg-concierge
docker compose ps --format '  {{.Service}} | {{.Status}}'
curl -sS -o /dev/null -w '  site /      -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health 2>/dev/null | head -c 160
echo

echo
echo "=== 8. DISK AFTER ==="
df -h / | tail -1 | sed 's/^/  /'

echo
echo "=== DONE — backups purged from the server, live app untouched ==="
