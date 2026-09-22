// Derive the mark's viewBox by RENDERING it and scanning alpha, instead of computing
// geometry by hand. Two hand-derived attempts both left the tail of the X visible as a white
// sliver on the dark header, so the numbers were not being reasoned about reliably.
//
// A canvas alpha scan is not available here — canvas returns opaque black for oklch — but
// painting SVG into a normal <img> and reading pixels IS reliable, because the SVG is drawn
// with explicit rgb colours.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const paths = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));

const svgMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 504" width="396" height="504">
  <path fill="#F8A61E" stroke="#F8A61E" stroke-width="4.3262" d="${paths.goldG}"/>
  <path fill="#050606" d="${paths.bellBody}"/>
</svg>`;

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 500, height: 600 } });
await page.setContent(
  `<body style="margin:0;background:#fff"><img id="m" src="data:image/svg+xml;base64,${Buffer.from(svgMark).toString('base64')}" width="396" height="504"></body>`,
  { waitUntil: 'load' }
);
await page.waitForTimeout(500);

const result = await page.evaluate(async () => {
  const img = document.getElementById('m');
  await img.decode();
  const c = document.createElement('canvas');
  c.width = 396;
  c.height = 504;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, 396, 504);
  const data = ctx.getImageData(0, 0, 396, 504).data;

  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, painted = 0;
  for (let y = 0; y < 504; y++) {
    for (let x = 0; x < 396; x++) {
      const i = (y * 396 + x) * 4;
      const [r, g, bl, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      // Anything that is not the white background counts as painted.
      const isPainted = a > 10 && !(r > 245 && g > 245 && bl > 245);
      if (isPainted) {
        painted++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY, painted };
});

console.log('=== mark alone: painted pixel extent (alpha scan) ===');
console.log(`  x ${result.minX} .. ${result.maxX}   (w ${result.maxX - result.minX + 1})`);
console.log(`  y ${result.minY} .. ${result.maxY}   (h ${result.maxY - result.minY + 1})`);
console.log(`  painted pixels: ${result.painted}`);

// Add a 3px optical margin, then square on the larger dimension.
const PAD = 3;
const w = result.maxX - result.minX + 1;
const h = result.maxY - result.minY + 1;
const SIDE = Math.max(w, h);
const VBX = result.minX - PAD - Math.round((SIDE - w) / 2);
const VBY = result.minY - PAD - Math.round((SIDE - h) / 2);
const VB = SIDE + PAD * 2;

console.log('\n=== derived viewBox ===');
console.log(`  '${VBX} ${VBY} ${VB} ${VB}'`);
console.log('\nprevious attempts:');
console.log("  '222 165 159 159'  (hand-read, 2 units left  -> caught the X)");
console.log("  '224 171 159 159'  (computed,  still caught the X)");

await b.close();
