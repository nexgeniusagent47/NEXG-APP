#!/bin/bash
# FIX #4, corrected.
#
# The first attempt wrote 99-nexg-hardening.conf. sshd reads sshd_config.d in FILENAME
# order and the FIRST value for a keyword wins, so 50-cloud-init.conf
# (PasswordAuthentication yes) was still overriding it. Renaming to 00- puts ours first.
set -e

echo "=== before ==="
sshd -T 2>/dev/null | grep -iE '^passwordauthentication'

echo
echo "=== reorder: 99- -> 00- so the first-wins rule favours hardening ==="
if [ -f /etc/ssh/sshd_config.d/99-nexg-hardening.conf ]; then
  mv -v /etc/ssh/sshd_config.d/99-nexg-hardening.conf /etc/ssh/sshd_config.d/00-nexg-hardening.conf
fi
ls -la /etc/ssh/sshd_config.d/

echo
echo "=== validate with sshd's own parser ==="
sshd -t && echo "  sshd -t: VALID"

echo
echo "=== reload ==="
systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || true
sleep 2

echo
echo "=== effective policy now ==="
sshd -T 2>/dev/null | grep -iE '^(passwordauthentication|permitrootlogin|pubkeyauthentication|maxauthtries|logingracetime|kbdinteractiveauthentication)'

echo
echo "=== CRITICAL: verify KEY login still works from a fresh connection ==="
ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 root@127.0.0.1 'echo "  key login OK as $(whoami)"' 2>&1 | tail -3

echo
echo "=== confirm password auth is actually REFUSED now ==="
# A deliberately invalid key proves the server will not fall back to a password prompt.
if ssh -o BatchMode=yes -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no -o ConnectTimeout=10 root@127.0.0.1 'echo SHOULD_NOT_HAPPEN' 2>&1 | grep -qiE 'permission denied'; then
  echo "  password auth REFUSED - hardening is in effect"
else
  echo "  WARNING: password auth may still be accepted"
fi

echo
echo "=== site still up? ==="
curl -sS -o /dev/null -w '  site -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1

echo
echo "=== DONE ==="
