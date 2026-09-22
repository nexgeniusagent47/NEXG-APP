// Work out which paths form the "G with the bell" and what their bounding box is.
//
// The logo is eight paths across a 396x504 canvas: N, E, X, G, and two unclassed paths that
// default to black fill. A favicon needs ONE recognisable mark at 16-32px, so this
// establishes the geometry before anything is drawn.
import { readFileSync } from 'node:fs';

const SVG = 'C:\\Users\\limta\\.dsh\\attachments\\v1\\files\\43\\43f3e13a360c25fed96095c487e084121b5dcdc7945932143072c8193bb2366e\\nexg-logo.svg';
const svg = readFileSync(SVG, 'utf8');

// Pull each path with its class and first coordinates, so we can locate them on the canvas.
const pathRe = /<path\s+([^>]*?)d="([^"]+)"/gs;
const paths = [];
let m;
while ((m = pathRe.exec(svg)) !== null) {
  const attrs = m[1];
  const d = m[2];
  const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || '(none)';
  const nums = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  paths.push({
    cls,
    len: d.length,
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
    head: d.slice(0, 34).replace(/\s+/g, ' '),
  });
}

console.log('=== paths, in document order, with their approximate bounds ===');
paths.forEach((p, i) => {
  console.log(
    `  [${i}] class=${p.cls.padEnd(7)} x ${String(Math.round(p.xMin)).padStart(4)}..${String(Math.round(p.xMax)).padStart(4)}` +
      `   y ${String(Math.round(p.yMin)).padStart(4)}..${String(Math.round(p.yMax)).padStart(4)}   len=${p.len}`
  );
  console.log(`        ${p.head}`);
});

console.log('\n=== interpretation ===');
console.log('  The G is the shape drawn with a stroke and NO fill (st3/st4 use stroke only),');
console.log('  sitting lower-right. The bell is the gold st6 path near y 190-250.');
console.log('  The N and E occupy the left half (x < 170).');
const lowerRight = paths.filter((p) => p.xMin > 180 || p.yMin > 180);
console.log(`  paths in the lower-right region: ${lowerRight.length}`);
lowerRight.forEach((p, i) => console.log(`    ${p.cls}  y ${Math.round(p.yMin)}..${Math.round(p.yMax)}  len=${p.len}`));
