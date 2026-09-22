#!/bin/bash
# READ-ONLY security exposure check. Nothing is changed.
echo "=== IS MYSQL REACHABLE FROM THE PUBLIC INTERNET? ==="
echo "  (checking the bind address, not connecting)"
ss -ltnp 2>/dev/null | grep -E ':(9106|7001)\b'

echo
echo "=== SSH AUTHENTICATION POLICY ==="
grep -iE '^\s*(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|PermitEmptyPasswords|ChallengeResponseAuthentication|KbdInteractiveAuthentication|MaxAuthTries)' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null || echo "  no explicit settings found (defaults apply)"

echo
echo "=== AUTH FAILURES IN THE LAST 24H (are we already being brute-forced?) ==="
if command -v journalctl >/dev/null 2>&1; then
  journalctl -u ssh --since '24 hours ago' 2>/dev/null | grep -ciE 'failed password|invalid user' || echo "  0"
fi

echo
echo "=== FAIL2BAN / ANY BRUTE-FORCE PROTECTION? ==="
command -v fail2ban-client >/dev/null 2>&1 && fail2ban-client status 2>/dev/null || echo "  fail2ban NOT installed"

echo
echo "=== SECURITY UPDATES PENDING ==="
apt-get -s upgrade 2>/dev/null | grep -ciE '^Inst.*security' || echo "  unknown"
echo "  unattended-upgrades: $(dpkg -l unattended-upgrades 2>/dev/null | grep -c '^ii')"

echo
echo "=== HTTP SECURITY HEADERS ON THE LIVE SITE ==="
curl -sS -D - -o /dev/null -H 'Host: nexgapp.com' http://127.0.0.1/ 2>/dev/null | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy' || echo "  NONE of the standard security headers are set"

echo
echo "=== IS THERE A CERT FOR nexgapp.com ANYWHERE? ==="
ls /etc/letsencrypt/live 2>/dev/null || echo "  no letsencrypt certs"
command -v certbot >/dev/null 2>&1 && certbot --version 2>&1 || echo "  certbot NOT installed"

echo
echo "=== DNS: where does nexgapp.com point? ==="
getent hosts nexgapp.com 2>/dev/null || echo "  cannot resolve nexgapp.com from the server"
echo "  server public IP:"
curl -sS --max-time 8 ifconfig.me 2>/dev/null || echo "  (could not determine)"

echo
echo "=== OTHER LISTENING SERVICES THAT MIGHT BE EXPOSED ==="
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | sort -u

echo
echo "=== DONE ==="
