#!/usr/bin/env python3
"""Measure the mascot's real proportions and part bounds from the cutout alpha.

The character contract wants measured head-units, not assumed ones. The raster
carries the artwork's own alpha, so the bands between body parts can be located
from row/column occupancy rather than guessed off the reference coordinates.

Pure stdlib: PNG rows are inflated with zlib and un-filtered by hand.
"""
import json
import struct
import sys
import zlib
from pathlib import Path

ws = Path(sys.argv[1])
png = ws / "mascot-cutout.png"
raw = png.read_bytes()

# --- minimal PNG decode (8-bit RGBA, the only form Playwright emitted) ---
pos, idat, w, h, depth, ctype = 8, bytearray(), 0, 0, 0, 0
while pos < len(raw):
    (ln,) = struct.unpack(">I", raw[pos:pos + 4])
    typ = raw[pos + 4:pos + 8]
    data = raw[pos + 8:pos + 8 + ln]
    if typ == b"IHDR":
        w, h, depth, ctype = struct.unpack(">IIBB", data[:10])
        if depth != 8 or ctype != 6:
            sys.exit(f"unsupported PNG: depth={depth} colorType={ctype}")
    elif typ == b"IDAT":
        idat += data
    elif typ == b"IEND":
        break
    pos += 12 + ln

buf = zlib.decompress(bytes(idat))
stride = w * 4
prev = bytearray(stride)
alpha_rows = []
off = 0
for _ in range(h):
    ft = buf[off]
    line = bytearray(buf[off + 1:off + 1 + stride])
    off += 1 + stride
    for i in range(stride):
        a = line[i - 4] if i >= 4 else 0
        b = prev[i]
        c = prev[i - 4] if i >= 4 else 0
        if ft == 1:
            line[i] = (line[i] + a) & 0xFF
        elif ft == 2:
            line[i] = (line[i] + b) & 0xFF
        elif ft == 3:
            line[i] = (line[i] + ((a + b) >> 1)) & 0xFF
        elif ft == 4:
            p = a + b - c
            pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
            pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
            line[i] = (line[i] + pr) & 0xFF
    prev = line
    alpha_rows.append(line[3::4])

# --- occupancy: per-row and per-column opaque extents ---
row_w = [sum(1 for v in r if v > 24) for r in alpha_rows]
col_h = [0] * w
for r in alpha_rows:
    for x, v in enumerate(r):
        if v > 24:
            col_h[x] += 1

ys = [y for y, n in enumerate(row_w) if n > 0]
xs = [x for x, n in enumerate(col_h) if n > 0]
top, bottom = ys[0], ys[-1]
left, right = xs[0], xs[-1]
H = bottom - top + 1

# Row-width profile, normalised: 0 = narrowest, 1 = widest.
peak = max(row_w) or 1
prof = [round(row_w[y] / peak, 4) for y in range(top, bottom + 1)]


def band(lo, hi, label):
    """Widest row inside a fractional height band -- locates rims, hips, shoulders."""
    a, b = top + int(lo * H), top + int(hi * H)
    seg = [(row_w[y], y) for y in range(a, min(b, bottom + 1))]
    if not seg:
        return None
    n, y = max(seg)
    return {"label": label, "y": y, "frac": round((y - top) / H, 4), "widthPx": n}


bands = [
    band(0.00, 0.10, "button"),
    band(0.10, 0.40, "bell-dome"),
    band(0.30, 0.42, "rim-flare"),
    band(0.42, 0.62, "body"),
    band(0.62, 0.75, "glove-line"),
    band(0.75, 0.90, "legs"),
    band(0.86, 1.00, "boots"),
]

# Transitions where the silhouette widens sharply -- the flared rim and the boots.
deltas = []
for i in range(1, len(prof)):
    deltas.append((prof[i] - prof[i - 1], i))
deltas.sort(reverse=True)
widest_gains = [{"atFrac": round(i / H, 4), "gain": round(d, 4)} for d, i in deltas[:5]]

out = {
    "source": str(png),
    "pixelBox": {"left": left, "top": top, "right": right, "bottom": bottom,
                 "width": right - left + 1, "height": H},
    "contentAspect": round((right - left + 1) / H, 4),
    "viewBoxAspect": round(709 / 1024, 4),
    "bands": bands,
    "sharpestWidening": widest_gains,
    "rowWidthProfile": prof,
}
(ws / "measurements.json").write_text(json.dumps(out, indent=2), encoding="utf-8")

print(f"content box      : {right - left + 1} x {H} px  (aspect {out['contentAspect']})")
print(f"image            : {w} x {h}")
print()
for b in bands:
    if b:
        print(f"  {b['label']:<13} widest at frac {b['frac']:.3f}  width {b['widthPx']}px")
print()
print("sharpest widenings (top 5):")
for g in widest_gains:
    print(f"  frac {g['atFrac']:.3f}  gain {g['gain']}")
