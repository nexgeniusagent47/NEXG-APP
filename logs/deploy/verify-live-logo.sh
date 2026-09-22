#!/bin/bash
# Verify the LIVE container is serving the new logo.
#
# The build happens INSIDE the image, so there is no dist/ on the host. Checking the host
# filesystem — which an earlier deploy script did — silently reported zero because the path
# did not exist, and a failed check looked identical to a clean one.
set -e

echo "=== container ==="
docker ps --filter name=nexg-concierge-app --format '  {{.Names}} | {{.Status}}'

echo
echo "=== where the bundle lives inside it ==="
docker exec nexg-concierge-app-1 sh -c 'ls -d /app/dist/assets && ls /app/dist/assets | head -5'

echo
echo "=== does the bundle carry the new logo? ==="
docker exec nexg-concierge-app-1 sh -c 'for f in /app/dist/assets/index-*.js; do
  echo "  $(basename "$f")"
  echo "    G path present : $(grep -c "M341.7,198.16" "$f" || true)"
  echo "    old filter     : $(grep -c "brightness-0" "$f" || true)"
  echo "    NEXG App       : $(grep -c "NEXG App" "$f" || true)"
  echo "    NEXG Concierge : $(grep -c "NEXG Concierge" "$f" || true)"
done'

echo
echo "=== the SPA actually served, through nginx ==="
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/ -o /tmp/served.html -w '  GET /  -> %{http_code}  (%{size_download} bytes)\n'
grep -o '<title>[^<]*</title>' /tmp/served.html | sed 's/^/  /'
echo "  root div: $(grep -c 'id="root"' /tmp/served.html)"
echo "  favicon links: $(grep -c 'rel="icon"' /tmp/served.html)"

echo
echo "=== favicon serves a real SVG, not the SPA fallback ==="
for f in /favicon.svg /favicon-dark.svg; do
  body=$(curl -sS -H 'Host: nexgapp.com' "http://127.0.0.1$f")
  shell=$(echo "$body" | grep -c 'id="root"' || true)
  svg=$(echo "$body" | grep -c '<svg' || true)
  echo "  $f  svg=$svg  htmlShell=$shell"
done

echo
echo "=== health ==="
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/api/health | head -c 200
echo

echo
echo "=== DONE ==="
