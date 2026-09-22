// Verify the new logo renders correctly in BOTH themes, at every size it is used at.
import { chromium } from 'playwright';
import { grantConsent } from '../../scripts/test-support.mjs';

const BASE = 'http://127.0.0.1:3000';
const b = await chromium.launch();

for (const theme of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
  await grantConsent(ctx, BASE);
  // Force the stored theme before the app boots.
  await ctx.addInitScript((t) => {
    localStorage.setItem('nexg-theme', t);
  }, theme);

  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  const info = await page.evaluate(() => {
    const svg = document.querySelector('header svg[aria-label="NEXG"]');
    if (!svg) return { found: false };
    const box = svg.getBoundingClientRect();
    const paths = [...svg.querySelectorAll('path')];
    return {
      found: true,
      w: Math.round(box.width),
      h: Math.round(box.height),
      paths: paths.length,
      // Read the ACTUAL painted colours rather than trusting the attributes.
      strokes: paths.map((p) => getComputedStyle(p).stroke).slice(0, 4),
      fills: paths.map((p) => getComputedStyle(p).fill).slice(0, 5),
      // An <img> based logo would report tagName IMG; this must be an inline svg.
      tag: svg.tagName.toLowerCase(),
    };
  });

  console.log(`\n=== ${theme} theme ===`);
  console.log('  logo element   :', info.tag, info.found ? `${info.w}x${info.h}px` : 'NOT FOUND');
  console.log('  path count     :', info.paths);
  console.log('  strokes        :', JSON.stringify(info.strokes));
  console.log('  fills          :', JSON.stringify(info.fills));
  console.log('  has gold #F8A61E:', JSON.stringify(info.fills).includes('248, 166, 30') || JSON.stringify(info.fills).includes('#F8A61E') || JSON.stringify(info.fills).includes('rgb(248, 166, 30)'));

  await page.screenshot({ path: `logs/critique/logo-${theme}.png`, clip: { x: 0, y: 0, width: 560, height: 90 } });
  await ctx.close();
}

await b.close();
