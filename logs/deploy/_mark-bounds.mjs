// Find the TRUE bounding box of the mark (gold G + bell body), so the square viewBox can be
// derived instead of estimated. The first guess was '222 165 159 159', which left a white
// sliver of the X visible at the left edge of the rendered logo.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const paths = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));

const b = await chromium.launch();
const page = await b.newPage();
await page.setContent('<body style="margin:0"></body>');

const bounds = await page.evaluate((p) => {
  // Build a throwaway SVG holding ONLY the two paths that make the mark.
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 396 504');
  svg.style.cssText = 'position:absolute;width:396px;height:504px';
  const g = document.createElementNS(ns, 'path');
  g.setAttribute('d', p.goldG);
  const bell = document.createElementNS(ns, 'path');
  bell.setAttribute('d', p.bellBody);
  svg.appendChild(g);
  svg.appendChild(bell);
  document.body.appendChild(svg);

  // getBBox includes the STROKE only when it is accounted for, so measure the geometry
  // bounds and then add the stroke width by hand. The G is stroked at 4.3262, which extends
  // 2.16 units beyond the fill on every side.
  const gb = g.getBBox();
  const bb = bell.getBBox();
  const STROKE = 4.3262;
  const half = STROKE / 2;

  const minX = Math.min(gb.x - half, bb.x);
  const minY = Math.min(gb.y - half, bb.y);
  const maxX = Math.max(gb.x + gb.width + half, bb.x + bb.width);
  const maxY = Math.max(gb.y + gb.height + half, bb.y + bb.height);

  return {
    goldG: { x: gb.x, y: gb.y, w: gb.width, h: gb.height },
    bell: { x: bb.x, y: bb.y, w: bb.width, h: bb.height },
    // Painted extent including stroke.
    painted: { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY },
  };
}, paths);

console.log('=== raw geometry ===');
console.log('  gold G :', JSON.stringify(bounds.goldG));
console.log('  bell   :', JSON.stringify(bounds.bell));
const p = bounds.painted;
console.log('=== painted extent, stroke included ===');
console.log(`  x ${p.minX.toFixed(1)} .. ${p.maxX.toFixed(1)}   (w ${p.w.toFixed(1)})`);
console.log(`  y ${p.minY.toFixed(1)} .. ${p.maxY.toFixed(1)}   (h ${p.h.toFixed(1)})`);

// Square it on the larger dimension and centre the mark, with a small optical margin.
const SIDE = Math.max(p.w, p.h);
const PAD = Math.round(SIDE * 0.04);
const VB = Math.ceil(SIDE + PAD * 2);
const VBX = Math.floor(p.minX - PAD - (SIDE - p.w) / 2);
const VBY = Math.floor(p.minY - PAD - (SIDE - p.h) / 2);
console.log('\n=== viewBox ===');
console.log(`  '${VBX} ${VBY} ${VB} ${VB}'`);
console.log(`  (previous guess was '222 165 159 159')`);

await b.close();
