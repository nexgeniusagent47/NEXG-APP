#!/bin/bash
# HTTPS / Cloudflare diagnosis, from BOTH sides.
# Determines the SSL mode by comparing what Cloudflare serves with what the origin serves.
echo "############ SET A FRESH ROOT PASSWORD ############"
NEWPW=$(openssl rand -base64 24 | tr -d '/+=' | head -c 28)
echo "root:$NEWPW" | chpasswd
if [ $? -eq 0 ]; then
  echo "  root password changed"
  echo "NEW_ROOT_PASSWORD=$NEWPW"
else
  echo "  FAILED to change root password"
fi
echo "  (SSH unaffected: password auth is already disabled)"

echo
echo "############ CLOUDFLARE / HTTPS DIAGNOSIS ############"
echo "=== A. what Cloudflare serves to the public ==="
echo "--- HTTPS response headers ---"
curl -sS -D - -o /dev/null --max-time 15 https://nexgapp.com/ 2>&1 | grep -iE '^HTTP/|^server:|^cf-ray:|^cf-cache|^strict-transport|^content-security|^x-frame|^x-content-type|^referrer-policy|^location:' | head -20

echo
echo "--- certificate presented by the edge ---"
echo | timeout 12 openssl s_client -connect nexgapp.com:443 -servername nexgapp.com 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null | sed 's/^/  /' || echo "  could not read cert"

echo
echo "=== B. what the ORIGIN serves directly (no Cloudflare) ==="
echo "--- plain HTTP on the origin ---"
curl -sS -D - -o /dev/null --max-time 10 -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1 | grep -iE '^HTTP/|^server:' | head -5

echo "--- does the ORIGIN speak HTTPS at all? ---"
if timeout 6 bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/443' 2>/dev/null; then
  echo "  origin port 443: OPEN"
else
  echo "  origin port 443: CLOSED (nothing listening)"
fi

echo
echo "=== C. DOES THE PUBLIC IP SERVE HTTPS DIRECTLY? ==="
echo "--- hitting the origin IP with HTTPS ---"
curl -sS -o /dev/null -w '  https://212.95.32.229/  -> %{http_code}\n' --max-time 10 -k https://212.95.32.229/ 2>&1 | tail -2

echo
echo "=== D. INTERPRETATION ==="
echo "  If https://nexgapp.com works but the origin has no 443 and no cert,"
echo "  then Cloudflare is terminating TLS AND talking to the origin over PLAIN HTTP."
echo "  That is SSL mode 'Flexible', and traffic is unencrypted server-side."

echo
echo "=== E. IS CLOUDFLARE AUTHENTICATED ORIGIN PULL IN USE? ==="
command -v cloudflared >/dev/null 2>&1 && echo "  cloudflared installed: $(cloudflared --version 2>&1 | head -1)" || echo "  cloudflared NOT installed (so no Cloudflare Tunnel; traffic comes over the public IP)"
ls -la /etc/cloudflared 2>/dev/null || true

echo
echo "=== DONE ==="
