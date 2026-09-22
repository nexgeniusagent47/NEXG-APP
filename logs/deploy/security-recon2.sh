#!/bin/bash
# READ-ONLY. Confirming the server's public IP and Cloudflare hosting.
echo "=== SERVER PUBLIC IP ==="
ip -4 addr show scope global 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -3

echo
echo "=== DEFAULT ROUTE / INTERFACE ==="
ip route get 1.1.1.1 2>/dev/null | head -2

echo
echo "=== nexgapp.com RESOLUTION (A records) ==="
getent ahostsv4 nexgapp.com 2>/dev/null | awk '{print $1}' | sort -u | head -5 || echo "  cannot resolve"

echo
echo "=== IS THIS ACTUALLY nexgapp.com's ORIGIN? compare with the host's own IP ==="
echo "  host IPs above; Cloudflare IPs seen earlier were 104.21.109.13 and 172.67.135.72"

echo
echo "=== UFW vs DOCKER: what is ACTUALLY reachable from outside? ==="
echo "  ufw rules:"
ufw status 2>/dev/null | tail -n +4
echo "  docker-published ports (these BYPASS ufw via the DOCKER-USER chain):"
iptables -t nat -L DOCKER -n 2>/dev/null | grep -E 'DNAT' | head -10

echo
echo "=== IS THERE A CLOUDFLARE ORIGIN CERT PRESENT? ==="
find /etc /var/www -maxdepth 4 \( -name '*.pem' -o -name '*origin*' -o -name '*.crt' \) 2>/dev/null | grep -viE 'ca-certificates|ssl/certs' | head -10 || echo "  none found"

echo
echo "=== DONE ==="
