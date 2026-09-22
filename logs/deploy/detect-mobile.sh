#!/bin/bash
# Impeccable detector across every mobile screen — WITH A CONTROL.
#
# The detector is a known-broken instrument here. It once timed out on every URL scan, exited
# 0, and printed `[]`, which is byte-identical to a genuinely clean result, and 22 of those
# were reported as passes. Running it without a control would repeat that mistake.
#
# The control is a page that MUST produce findings. If it comes back empty, the run's clean
# results mean nothing and the script says so instead of reporting success.
set -u

BASE="${1:-http://127.0.0.1:3000}"
IMP="__IMPECCABLE__"

ROUTES=(
  "home:/"
  "merchants:/?page=merchants"
  "restaurants:/?page=restaurants"
  "spa:/?page=spa"
  "transport:/?page=transport"
  "groceries:/?page=groceries"
  "experiences:/?page=experiences"
  "properties:/?page=properties"
  "couriers:/?page=couriers"
  "merchant_onboarding:/?page=merchant_onboarding"
  "courier_onboarding:/?page=courier_onboarding"
  "host_onboarding:/?page=host_onboarding"
  "metrics:/?page=metrics"
)

echo "############ CONTROL ############"
# A deliberately broken page. Inline styles, no alt text, a tiny tap target, low contrast.
CONTROL=$(mktemp /tmp/control-XXXX.html)
cat > "$CONTROL" <<'HTML'
<!doctype html><html><head><meta charset="utf-8"><title>control</title></head>
<body style="background:#0b0b0b">
  <div style="color:#111;background:#0b0b0b;font-size:9px">Invisible low contrast text</div>
  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="400" height="300">
  <button style="width:12px;height:12px;padding:0" onclick="void 0">x</button>
  <div style="width:1400px;height:60px;background:#333"></div>
  <marquee>deprecated element</marquee>
</body></html>
HTML

echo "  control file: $CONTROL"
CONTROL_OUT=$(node "$IMP" detect "$CONTROL" 2>&1 || true)
CONTROL_HITS=$(echo "$CONTROL_OUT" | grep -ciE 'finding|issue|warning|error|contrast|alt|tap|overflow' || true)
echo "  control findings: $CONTROL_HITS"
if [ "$CONTROL_HITS" -eq 0 ]; then
  echo "  CONTROL PRODUCED NOTHING - the detector is not working."
  echo "  Any clean result below would be indistinguishable from a failed scan, so the run"
  echo "  is reported as INVALID rather than clean."
  echo "  --- raw control output, first 12 lines ---"
  echo "$CONTROL_OUT" | head -12 | sed 's/^/    /'
  rm -f "$CONTROL"
  exit 2
fi
echo "  control flagged, so the instrument works for this run."
rm -f "$CONTROL"

echo
echo "############ MOBILE SCREENS ############"
TOTAL=0
FLAGGED=0
for entry in "${ROUTES[@]}"; do
  name="${entry%%:*}"
  path="${entry#*:}"
  url="${BASE}${path}"
  out=$(node "$IMP" detect "$url" 2>&1 || true)
  n=$(echo "$out" | grep -ciE 'finding|issue|warning|violation|contrast|overflow|alt=|tap target' || true)
  TOTAL=$((TOTAL + n))
  status="clean"
  if [ "$n" -gt 0 ]; then status="FLAGGED ($n)"; FLAGGED=$((FLAGGED + 1)); fi
  printf '  %-22s %s\n' "$name" "$status"
  if [ "$n" -gt 0 ]; then
    echo "$out" | grep -iE 'finding|issue|warning|violation|contrast|overflow|alt=|tap target' | head -6 | sed 's/^/      /'
  fi
done

echo
echo "  routes flagged: $FLAGGED of ${#ROUTES[@]}"
echo "  total findings: $TOTAL"
echo
echo "  NOTE: findings are reported as the detector gave them. This run is only meaningful"
echo "  because the control above was flagged in the same invocation."
