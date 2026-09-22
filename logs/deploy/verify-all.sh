#!/bin/bash
# Final verification of security fixes #1-#6.
echo "=== PUBLISHED PORTS (expect 22 and 80 only) ==="
ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -vE '127\.0\.0\.(53|54)' | sort -u

echo
echo "=== 1. MYSQL PORT 9106 ==="
ss -ltn 2>/dev/null | grep -q ':9106' && echo "  STILL OPEN" || echo "  CLOSED (fix applied)"

echo
echo "=== 2. PORT 7001 BIND ==="
ss -ltn 2>/dev/null | grep ':7001' || echo "  not listening"

echo
echo "=== 3. FAIL2BAN ==="
fail2ban-client status sshd 2>/dev/null | grep -E 'Currently failed|Total failed|Currently banned|Total banned'

echo
echo "=== 4. SSH POLICY ==="
sshd -T 2>/dev/null | grep -E '^(passwordauthentication|permitrootlogin|pubkeyauthentication|maxauthtries|logingracetime)'

echo
echo "=== 5. UNATTENDED UPGRADES ==="
echo "  enabled: $(systemctl is-enabled unattended-upgrades 2>/dev/null || echo unknown)"
echo "  active:  $(systemctl is-active unattended-upgrades 2>/dev/null || echo unknown)"

echo
echo "=== 6. MYSQL PASSWORD ROTATION ==="
echo "  .env password length: $(awk -F= '/^DB_PASSWORD=/{print length($2)}' /var/www/apps/projects/nexg/backend/.env)"
echo "  old password still accepted?"
if docker exec nexg-apps-db mysql -u root -p$OLD_MYSQL_PASSWORD -e 'SELECT 1' >/dev/null 2>&1; then
  echo "    YES - ROTATION FAILED"
else
  echo "    no - rotation confirmed"
fi

echo
echo "=== LIVE SITE ==="
curl -sS -o /dev/null -w '  /  -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
echo "  --- a real API route ---"
curl -sS -o /dev/null -w '  /api/v1/admin/analytics/alerts -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/api/v1/admin/analytics/alerts 2>&1

echo
echo "=== TIME SINCE CHANGES ==="
uptime -p

echo
echo "=== DONE ==="
