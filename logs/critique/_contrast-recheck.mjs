// Re-measure contrast on the live surface after the token changes.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';
const b = await chromium.launch();

function measure(page) {
  return page.evaluate(() => {
    const lum = (r, g, b) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    // Tailwind v4 emits oklch() colors, and Chromium returns them verbatim from
    // getComputedStyle — so ANY numeric parse misreads them (lightness 0.707 and
    // hue 261.325 look like red and blue channels). Painting on a canvas and
    // reading the pixel back makes the browser do the colour-space conversion, so
    // oklch, oklab, rgba and hex are all handled exactly.
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const toRgb = (css) => {
      if (!css) return null;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = css;
      // fillStyle silently keeps its previous value for an unparseable colour.
      const normalised = ctx.fillStyle;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      const alphaFromCss = (css.match(/rgba?\([^)]*?,\s*([\d.]+)\)/) || [])[1];
      return {
        rgb: [d[0], d[1], d[2]],
        alpha: alphaFromCss !== undefined ? Number(alphaFromCss) : 1,
        normalised,
      };
    };

    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const parsed = toRgb(getComputedStyle(n).backgroundColor);
        // Transparent backgrounds must be skipped, or the page's own colour is
        // never reached and text is judged against a false dark backdrop.
        if (parsed && parsed.alpha > 0.5 && !/rgba\(0,\s*0,\s*0,\s*0\)/.test(parsed.normalised)) {
          return parsed.rgb;
        }
        n = n.parentElement;
      }
      return [17, 19, 21];
    };

    const out = [];
    for (const el of document.querySelectorAll('p, span, h1, h2, h3, a, li, label, button')) {
      const text = (el.textContent || '').trim();
      if (!text || el.children.length > 0) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.5) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;

      const fg = toRgb(cs.color);
      if (!fg) continue;
      const bg = bgOf(el);
      const l1 = lum(...fg.rgb), l2 = lum(...bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const min = large ? 3 : 4.5;
      if (ratio < min) out.push({ text: text.slice(0, 42), ratio: +ratio.toFixed(2), min, size: +size.toFixed(1) });
    }
    return out;
  });
}

for (const theme of ['dark', 'light']) {
  const page = await b.newContext({ viewport: { width: 1440, height: 900 } }).then((c) => c.newPage());
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  if (theme === 'light') {
    await page.click('#header-theme-toggle-btn');
    await page.waitForTimeout(900);
  }
  await page.click('#hero-search-input');
  await page.locator('#discovery-search-input').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(2500);

  const fails = await measure(page);
  console.log(`\n=== ${theme.toUpperCase()} discovery: ${fails.length} contrast failures ===`);
  for (const f of fails.slice(0, 12)) console.log(`   ${String(f.ratio).padStart(5)} (min ${f.min}) ${f.size}px  "${f.text}"`);

  await page.screenshot({ path: `logs/critique/discovery-${theme}-after.png` });
  await page.close();
}

await b.close();
