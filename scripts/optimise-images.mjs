#!/usr/bin/env node
// Optimise the bundled images to WebP and resize them to the largest size they are
// actually rendered at.
//
// Why this exists: the build shipped 14 MB of images, five of them 1.7-2.0 MB. That
// is the single largest cost on a first load and no amount of bundler tuning fixes
// it. Measured targets come from the components that use each image, not from a
// guess, so nothing is resized below the size it is displayed at (which would show
// as blur).
//
// ffmpeg is used rather than sharp/imagemin because it is already present on the
// build machine and needs no dependency. Quality 82 is the point where WebP stops
// showing artefacts on photographic content at these sizes.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SRC = 'src/assets/images';
const OUT = 'src/assets/images/optimised';

// Longest edge per image. Hero art is displayed at up to ~1440 CSS px and on 2x
// screens, so 1920 is the ceiling; inline card art never exceeds ~800.
const MAX_EDGE = 1920;
const QUALITY = 82;

// Images only ever shown inside a card or modal, so they do not need hero sizing.
// The categories carousel renders these at up to ~340 CSS px; at 2x that is 680, so
// 1024 leaves headroom without shipping a 1024px file for a 340px slot. Note the
// source art is already 1024 square, so this cap never upscales it.
const CARD_IMAGES = new Set([
  'Restaurants.png',
  'Spa & Wellness.png',
  'Essentials.png',
  'Experiences card.png',
  'NEXG LOGO.png',
  'merchant_hero_section.29.39.jpeg',
  'qr_advantage_1783930346328.jpg',
  'nexg_mobile_mockup_1783933676948.jpg',
]);
const CARD_EDGE = 1024;

// The logo is a mark with transparency; WebP keeps the alpha and stays crisp.
const KEEP_ALPHA = new Set(['NEXG LOGO.png']);

function ffmpeg(args) {
  return execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function dimensions(file) {
  // ffprobe ships with ffmpeg; read the real dimensions so the resize is reported.
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file],
      { encoding: 'utf8' }
    ).trim();
    const [w, h] = out.split(',').map(Number);
    return { w, h };
  } catch {
    return null;
  }
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
const rows = [];
let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const inPath = path.join(SRC, file);
  const before = statSync(inPath).size;
  const dims = dimensions(inPath);
  const cap = CARD_IMAGES.has(file) ? CARD_EDGE : MAX_EDGE;

  // Only downscale; never upscale a small image.
  let scale = `scale='min(${cap},iw)':-2`;
  if (dims && Math.max(dims.w, dims.h) <= cap) scale = 'scale=iw:ih';

  const outName = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const outPath = path.join(OUT, outName);

  const args = ['-i', inPath, '-vf', scale, '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6'];
  // Preserve alpha where it exists.
  if (KEEP_ALPHA.has(file)) args.push('-pix_fmt', 'yuva420p');
  args.push(outPath);

  try {
    ffmpeg(args);
    const after = statSync(outPath).size;
    beforeTotal += before;
    afterTotal += after;
    rows.push({
      file,
      outName,
      beforeKB: Math.round(before / 1024),
      afterKB: Math.round(after / 1024),
      saved: `${Math.round((1 - after / before) * 100)}%`,
      dims: dims ? `${dims.w}x${dims.h}` : '?',
      cap,
    });
  } catch (e) {
    rows.push({ file, error: String(e.stderr || e.message).slice(0, 120) });
  }
}

rows.sort((a, b) => (b.beforeKB || 0) - (a.beforeKB || 0));
for (const r of rows) {
  if (r.error) console.log(`${r.file.padEnd(44)} FAILED ${r.error}`);
  else
    console.log(
      `${r.file.padEnd(44)} ${String(r.beforeKB).padStart(5)}KB -> ${String(r.afterKB).padStart(5)}KB  -${r.saved.padStart(4)}  ${r.dims} (cap ${r.cap})`
    );
}

console.log('');
console.log(`total: ${Math.round(beforeTotal / 1024)}KB -> ${Math.round(afterTotal / 1024)}KB  (saved ${Math.round((1 - afterTotal / beforeTotal) * 100)}%)`);

// A manifest lets the app resolve the WebP for a given original name without
// hardcoding extensions at each call site.
const manifest = Object.fromEntries(rows.filter((r) => !r.error).map((r) => [r.file, r.outName]));
writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`manifest: ${Object.keys(manifest).length} entries`);
