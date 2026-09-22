#!/bin/bash
# READ-ONLY. Resolving what actually serves nexgapp.com on port 80.

echo "=== HOST nginx site config: nexgapp.com ==="
cat /etc/nginx/sites-available/nexgapp.com 2>/dev/null || echo "cannot read"

echo
echo "=== which nginx owns port 80? ==="
echo "--- host nginx master (pid 116334) config root ---"
nginx -T 2>/dev/null | grep -E 'server_name|listen|root|proxy_pass' | head -30

echo
echo "=== is host nginx running in a container or on the host? ==="
for pid in 116334 126005; do
  echo "--- pid $pid ---"
  cat /proc/$pid/cgroup 2>/dev/null | head -3
  echo "cmdline: $(tr '\0' ' ' < /proc/$pid/cmdline 2>/dev/null)"
done

echo
echo "=== docker network of nexg-apps-nginx ==="
docker inspect nexg-apps-nginx --format '{{json .NetworkSettings.Networks}}' 2>/dev/null | head -c 600
echo

echo
echo "=== what does host nginx serve for nexgapp.com ==="
curl -sS -H 'Host: nexgapp.com' -o /dev/null -w '  -> %{http_code} (%{content_type}) size=%{size_download}\n' http://127.0.0.1/ 2>&1
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | head -c 500
echo
echo "--- title if any ---"
curl -sS -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | grep -oE '<title>[^<]*</title>' | head -2

echo
echo "=== is there anything on 443 at all? ==="
ss -ltnp 2>/dev/null | grep ':443' || echo "NOTHING listening on 443"

echo
echo "=== nginx error/access logs, last lines ==="
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "no host error log"
tail -5 /var/log/nginx/access.log 2>/dev/null || echo "no host access log"

echo
echo "=== DONE ==="
