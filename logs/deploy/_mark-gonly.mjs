// Derive the mark's square viewBox from the G path ALONE.
//
// Path 7 (class st6) is the complete mark: the gold G together with the bell on top. The
// bell is part of that path, not a separate element. Earlier attempts also included path 2,
// which is one of the X's black diagonals — that is the wedge that kept appearing beside the
// mark in the header.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const j = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));

const b = await chromium.launch();
const page = await b.newPage();
await page.setContent('<body style="margin:0"></body>');

const r = await page.evaluate((d) => {
  const ns = 'http://www.w3.org/2000/svg';
  const s = document.createElementNS(ns, 'svg');
  s.setAttribute('viewBox', '0 0 396 504');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', d);
  s.appendChild(p);
  document.body.appendChild(s);

  const bb = p.getBBox();
  // getBBox returns geometry bounds; the stroke paints half its width beyond that.
  const half = 4.3262 / 2;
  return {
    x: bb.x,
    y: bb.y,
    w: bb.width,
    h: bb.height,
    painted: {
      minX: bb.x - half,
      minY: bb.y - half,
      w: bb.width + 4.3262,
      h: bb.height + 4.3262,
    },
  };
}, j.goldG);

const p = r.painted;
console.log('gold G path only (the mark, bell included):');
console.log(`  x ${p.minX.toFixed(1)} .. ${(p.minX + p.w).toFixed(1)}   w ${p.w.toFixed(1)}`);
console.log(`  y ${p.minY.toFixed(1)} .. ${(p.minY + p.h).toFixed(1)}   h ${p.h.toFixed(1)}`);
console.log(`  aspect: ${(p.w / p.h).toFixed(3)}  (taller than wide, so a square crop pads the sides)`);

// Square on the taller dimension. The artwork is ~100 wide by ~127 tall, so squaring adds
// empty space left and right rather than cropping — a wider crop would slice the bell.
const SIDE = Math.max(p.w, p.h);
const PAD = Math.round(SIDE * 0.05);
const VB = Math.ceil(SIDE + PAD * 2);
const VBX = Math.floor(p.minX - PAD - (SIDE - p.w) / 2);
const VBY = Math.floor(p.minY - PAD - (SIDE - p.h) / 2);

console.log('\nderived square viewBox:');
console.log(`  '${VBX} ${VBY} ${VB} ${VB}'`);
console.log('\nprevious attempts and why they failed:');
console.log("  '222 165 159 159'  included the X's black diagonal -> white wedge on dark");
console.log("  '224 171 159 159'  same cause, shifted");
console.log("  '227 174 153 153'  same cause, derived from the wrong path set");

await b.close();
