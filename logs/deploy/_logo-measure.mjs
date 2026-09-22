// Render the logo at a large size and measure REAL painted bounds region by region,
// so the favicon can be cropped to the mark instead of guessed at.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const SVG_PATH =
  'C:\\Users\\limta\\.dsh\\attachments\\v1\\files\\43\\43f3e13a360c25fed96095c487e084121b5dcdc7945932143072c8193bb2366e\\nexg-logo.svg';
const svg = readFileSync(SVG_PATH, 'utf8');

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 900, height: 1100 } });

// Render the raw logo large, on white, and screenshot it.
await page.setContent(
  `<html><body style="margin:0;background:#fff;display:flex;align-items:center;justify-content:center;height:1100px">
     <div style="width:600px">${svg.replace('<svg', '<svg style="width:100%;height:auto"')}</div>
   </body></html>`,
  { waitUntil: 'load' }
);
await page.waitForTimeout(600);
await page.screenshot({ path: 'logs/critique/logo-full.png' });

// Now measure where each path actually paints, using the browser's own geometry.
const measured = await page.evaluate(() => {
  const svgEl = document.querySelector('svg');
  const out = [];
  const all = [...svgEl.querySelectorAll('path')];
  all.forEach((p, i) => {
    const box = p.getBBox();
    const cls = p.getAttribute('class') || '(none)';
    out.push({
      i,
      cls,
      x: Math.round(box.x),
      y: Math.round(box.y),
      w: Math.round(box.width),
      h: Math.round(box.height),
    });
  });
  const root = svgEl.getBBox();
  return {
    viewBox: svgEl.getAttribute('viewBox'),
    total: { x: Math.round(root.x), y: Math.round(root.y), w: Math.round(root.width), h: Math.round(root.height) },
    paths: out,
  };
});

console.log(JSON.stringify(measured, null, 2));
await b.close();
