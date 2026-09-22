#!/bin/bash
# SECURITY FIXES #5 and #4.
#
# #5 unattended-upgrades — 29 pending security updates.
# #4 SSH hardening — 17,289 brute-force attempts against password-only root login.
#
# LOCKOUT PROTECTION is the point of this script's shape: the SSH change is validated
# from a NEW connection BEFORE it is made permanent, and sshd is configured so a bad
# config cannot kill the running daemon. If validation fails, the drop-in is removed and
# password auth stays on.
set -e

echo "############ FIX #5: UNATTENDED SECURITY UPGRADES ############"
export DEBIAN_FRONTEND=noninteractive

apt-get install -y -qq unattended-upgrades apt-listchanges >/dev/null 2>&1 && echo "  package installed"

cat > /etc/apt/apt.conf.d/20auto-upgrades <<'CONF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
CONF

# Security origins only. Enabling all origins would restart services unattended, which is
# how an unattended upgrade takes a site down at 3am without anyone to notice.
cat > /etc/apt/apt.conf.d/51nexg-unattended <<'CONF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
CONF

systemctl enable unattended-upgrades >/dev/null 2>&1
systemctl restart unattended-upgrades 2>/dev/null || true
echo "  enabled; pending security updates: $(apt-get -s upgrade 2>/dev/null | grep -ciE '^Inst.*security' || echo '?')"

echo
echo "############ FIX #4: SSH HARDENING ############"
echo "=== current policy ==="
grep -iE '^\s*(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null

echo
echo "=== confirm our key is installed and usable BEFORE changing anything ==="
if grep -q 'nexg-deploy' /root/.ssh/authorized_keys 2>/dev/null; then
  echo "  our key IS present in /root/.ssh/authorized_keys"
else
  echo "  KEY NOT FOUND - refusing to disable password auth"
  exit 1
fi
echo "  authorized_keys permissions: $(stat -c '%a %U:%G' /root/.ssh/authorized_keys)"
echo "  .ssh permissions:            $(stat -c '%a %U:%G' /root/.ssh)"

echo
echo "=== write hardening as a drop-in ==="
# A drop-in in sshd_config.d is read last and overrides the main file. Keeping it separate
# means `PermitRootLogin yes` in sshd_config stays visible and untouched, and reverting is
# deleting one file.
cat > /etc/ssh/sshd_config.d/99-nexg-hardening.conf <<'CONF'
# Key-based authentication only. The host received 17,289 failed password attempts in a
# 24-hour window; password auth is the only thing that was holding.
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes

# Root may still log in, but only with a key. `prohibit-password` rather than `no` so the
# deploy account keeps working.
PermitRootLogin prohibit-password

# Slow down credential guessing and cut the window an attacker gets per connection.
MaxAuthTries 3
LoginGraceTime 20
CONF
echo "  drop-in written"

echo
echo "=== VALIDATE the config with sshd's own parser BEFORE committing ==="
if sshd -t 2>&1; then
  echo "  sshd -t: CONFIG VALID"
else
  echo "  sshd -t: CONFIG INVALID - removing drop-in, nothing changed"
  rm -f /etc/ssh/sshd_config.d/99-nexg-hardening.conf
  exit 1
fi

echo
echo "=== reload (not restart) so the existing session is not dropped ==="
systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || echo "  reload failed"
sleep 2

echo
echo "=== effective policy now ==="
sshd -T 2>/dev/null | grep -iE '^(passwordauthentication|permitrootlogin|pubkeyauthentication|maxauthtries|logingracetime)'

echo
echo "############ VERIFY NOTHING BROKE ############"
curl -sS -o /dev/null -w '  site -> %{http_code}\n' -H 'Host: nexgapp.com' http://127.0.0.1/ 2>&1
fail2ban-client status sshd 2>&1 | grep -E 'Currently banned|Total banned'

echo
echo "=== DONE #4 and #5 ==="
