// Build a responsive image ladder: several widths per image plus a tiny inline
// placeholder, emitted as a typed manifest the app consumes through srcset/sizes.
//
// Why a ladder rather than one file: a 1920px hero sent to a 390px phone wastes
// ~90% of its bytes, and sending a 640px file to a 4K display looks soft. This is
// how large delivery products stay sharp AND fast — the browser picks a candidate
// from `srcset` using `sizes` and its own device pixel ratio, and never downloads
// the ones it does not need.
//
// The placeholder is a ~24px WebP encoded as a data URI and used as the CSS
// background behind the img. It is small enough to inline (no request) and gives the
// page a real colour immediately instead of a grey box, which is the LQIP technique.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, mkdirSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const SRC = 'src/assets/images';
const OUT = 'src/assets/images/optimised';
const QUALITY = 82;

// Widths offered to the browser. 320 covers small phones, 1920 covers desktop at 2x
// for a full-bleed hero. Anything above 1920 would be for a 4K full-bleed hero, which
// this product does not have.
const LADDER = [320, 640, 960, 1280, 1920];

// Images only used inside cards never need the top of the ladder.
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

function run(bin, args) {
  return execFileSync(bin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function probe(file) {
  const out = run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file,
  ]).trim();
  const [w, h] = out.split(',').map(Number);
  return { w, h };
}

if (existsSync(OUT)) {
  // Start clean so a removed width does not leave an orphan file in the bundle.
  for (const f of readdirSync(OUT)) rmSync(path.join(OUT, f), { force: true, recursive: true });
} else {
  mkdirSync(OUT, { recursive: true });
}

const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
const manifest = {};
let totalBytes = 0;
let placeholderBytes = 0;

for (const file of files) {
  const inPath = path.join(SRC, file);
  const { w: srcW } = probe(inPath);
  const cap = CARD_IMAGES.has(file) ? 1024 : 1920;

  // Only widths at or below the source width, so nothing is upscaled.
  const widths = LADDER.filter((w) => w <= Math.min(srcW, cap));
  if (widths.length === 0) widths.push(Math.min(srcW, cap));

  const base = file.replace(/\.(png|jpe?g)$/i, '');
  const safe = base.replace(/[^a-zA-Z0-9_-]+/g, '-').toLowerCase();
  const sources = [];

  for (const targetW of widths) {
    const outName = `${safe}-${targetW}.webp`;
    const outPath = path.join(OUT, outName);
    const scale = targetW >= srcW ? 'scale=iw:ih' : `scale=${targetW}:-2`;
    const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', inPath, '-vf', scale];
    args.push('-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6');
    if (file.endsWith('.png')) args.push('-pix_fmt', 'yuva420p');
    args.push(outPath);
    run('ffmpeg', args);
    const size = statSync(outPath).size;
    totalBytes += size;
    sources.push({ w: targetW, file: outName, bytes: size });
  }

  // LQIP: 24px wide, blur is applied by CSS rather than baked in so the placeholder
  // stays cheap to encode.
  const phName = `${safe}-lqip.webp`;
  const phPath = path.join(OUT, phName);
  run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', inPath,
    '-vf', 'scale=24:-2', '-c:v', 'libwebp', '-quality', '40', '-compression_level', '6',
    phPath,
  ]);
  const phBytes = statSync(phPath).size;
  placeholderBytes += phBytes;
  const lqip = `data:image/webp;base64,${Buffer.from(
    execFileSync('node', ['-e', `process.stdout.write(require('node:fs').readFileSync(${JSON.stringify(phPath)}).toString('base64'))`], { encoding: 'utf8' })
  ).toString('utf8')}`;

  rmSync(phPath, { force: true });

  manifest[file] = {
    width: srcW,
    // Largest first is the conventional order for a fallback `src`.
    src: sources[sources.length - 1].file,
    srcSet: sources.map((s) => `${s.file} ${s.w}w`).join(', '),
    lqip,
  };
}

writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`images: ${files.length}`);
console.log(`variants: ${Object.values(manifest).reduce((a, m) => a + m.srcSet.split(',').length, 0)}`);
console.log(`total encoded: ${Math.round(totalBytes / 1024)} KB across all sizes`);
console.log(`placeholders: ${Math.round(placeholderBytes / 1024)} KB of source, inlined as ~${Math.round(
  Object.values(manifest).reduce((a, m) => a + m.lqip.length, 0) / 1024
)} KB of data URIs`);
console.log('\nsample:');
const first = Object.entries(manifest)[0];
if (first) console.log(`  ${first[0]}\n    srcSet: ${first[1].srcSet}`);
