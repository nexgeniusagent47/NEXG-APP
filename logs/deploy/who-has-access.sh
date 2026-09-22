#!/bin/bash
# Who can get into this server, and which passwords still work?
# Read-only. Nothing here changes any credential.
echo "############ 1. IS PASSWORD LOGIN EVEN POSSIBLE? ############"
echo "--- effective sshd config (main + drop-ins, last wins) ---"
sshd -T 2>/dev/null | grep -iE '^(passwordauthentication|permitrootlogin|pubkeyauthentication|kbdinteractiveauthentication|challengeresponseauthentication|maxauthtries|permitemptypasswords|allowusers|allowgroups|denyusers)' | sed 's/^/  /'

echo
echo "--- which files set those values ---"
grep -rn -iE 'passwordauthentication|permitrootlogin' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/ 2>/dev/null | grep -v '^\s*#' | sed 's/^/  /'

echo
echo "############ 2. EVERY ACCOUNT THAT CAN LOG IN ############"
echo "--- accounts with a usable shell ---"
awk -F: '$7 !~ /(nologin|false)$/ {print "  " $1 "  uid=" $3 "  shell=" $7}' /etc/passwd

echo
echo "--- accounts with a PASSWORD set (can be used at the console) ---"
awk -F: '$2 ~ /^\$/ {print "  " $1 "  (hashed password present)"}' /etc/shadow 2>/dev/null

echo
echo "--- accounts with NO password (locked) ---"
awk -F: '$2 !~ /^\$/ {print "  " $1 "  (no password / locked)"}' /etc/shadow 2>/dev/null

echo
echo "############ 3. WHO HAS SSH KEYS ############"
find /root /home -maxdepth 3 -name 'authorized_keys' 2>/dev/null | while read -r f; do
  echo "  $f"
  awk '{print "    type=" $1 "  comment=" $3}' "$f"
done

echo
echo "############ 4. WHO HAS ACTUALLY LOGGED IN ############"
echo "--- successful logins, last 30 days, by user and source ---"
last -ai 2>/dev/null | head -20 | sed 's/^/  /'

echo
echo "--- unique source IPs that succeeded ---"
last -ai 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/) print $i}' | sort | uniq -c | sort -rn | head -10 | sed 's/^/  /'

echo
echo "--- currently logged in ---"
who -a 2>/dev/null | sed 's/^/  /'
echo "  (only our SSH sessions should appear)"

echo
echo "############ 5. ROOT PASSWORD AGE ############"
echo "--- when was root's password last changed? ---"
chage -l root 2>/dev/null | sed 's/^/  /'

echo
echo "############ 6. ANY OTHER WAY IN ############"
echo "--- sudoers with NOPASSWD ---"
grep -rn 'NOPASSWD' /etc/sudoers /etc/sudoers.d/ 2>/dev/null | sed 's/^/  /' || echo "  none"

echo
echo "--- cloud-init / provider keys ---"
ls -la /root/.ssh/ 2>/dev/null | sed 's/^/  /'
grep -l 'ssh-' /etc/ssh/authorized_keys* 2>/dev/null | sed 's/^/  also: /' || true

echo
echo "=== DONE — nothing changed ==="
