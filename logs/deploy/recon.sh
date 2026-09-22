#!/bin/bash
# READ-ONLY reconnaissance. No writes, no installs, no service changes.
# Every command here only inspects.

echo "=== IDENTITY ==="
whoami
hostname
uname -a
echo "uptime: $(uptime -p 2>/dev/null || uptime)"

echo
echo "=== OS ==="
cat /etc/os-release 2>/dev/null | head -4

echo
echo "=== RESOURCES ==="
echo "--- cpu ---"
nproc
echo "--- memory ---"
free -m
echo "--- disk ---"
df -h / /var 2>/dev/null

echo
echo "=== LISTENING PORTS ==="
ss -ltnp 2>/dev/null | head -30

echo
echo "=== PORTS 80 / 443 SPECIFICALLY ==="
ss -ltnp 2>/dev/null | grep -E ':(80|443)\b' || echo "nothing listening on 80/443"

echo
echo "=== WEB SERVER PROCESSES ==="
ps aux 2>/dev/null | grep -E 'nginx|apache|httpd|caddy' | grep -v grep || echo "no web server process found"

echo
echo "=== DOCKER ==="
docker --version 2>/dev/null || echo "docker NOT installed"
docker compose version 2>/dev/null || echo "docker compose NOT available"
echo "--- running ---"
docker ps --format '{{.Names}} | {{.Image}} | {{.Ports}} | {{.Status}}' 2>/dev/null || echo "cannot list"
echo "--- all (incl stopped) ---"
docker ps -a --format '{{.Names}} | {{.Image}} | {{.Status}}' 2>/dev/null | head -20
echo "--- volumes ---"
docker volume ls 2>/dev/null | head -20
echo "--- compose projects ---"
docker compose ls 2>/dev/null || true

echo
echo "=== NODE / RUNTIMES ==="
for c in node npm python3 git curl; do
  printf '%s: ' "$c"
  command -v "$c" >/dev/null 2>&1 && "$c" --version 2>/dev/null | head -1 || echo "not installed"
done

echo
echo "=== DEPLOY USER ==="
id deployer 2>/dev/null || echo "user 'deployer' does NOT exist"
getent group docker 2>/dev/null || echo "no docker group"

echo
echo "=== /var/www ==="
ls -la /var/www 2>/dev/null || echo "/var/www does not exist"
echo "--- /var/www/apps ---"
ls -la /var/www/apps 2>/dev/null || echo "/var/www/apps does not exist"

echo
echo "=== PROJECT DIR ==="
ls -la /var/www/apps/projects 2>/dev/null || echo "no projects dir"
ls -la /var/www/apps/projects/nexg 2>/dev/null || echo "no nexg dir"

echo
echo "=== FIREWALL ==="
if command -v ufw >/dev/null 2>&1; then ufw status 2>/dev/null || echo "ufw present, status unavailable"; else echo "ufw not installed"; fi
if command -v iptables >/dev/null 2>&1; then echo "--- iptables (filter) ---"; iptables -L -n 2>/dev/null | head -20; fi

echo
echo "=== TLS ==="
ls -la /etc/letsencrypt 2>/dev/null || echo "no letsencrypt"
ls -la /etc/nginx 2>/dev/null | head -20 || echo "no /etc/nginx"

echo
echo "=== DONE ==="
