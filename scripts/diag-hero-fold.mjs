// scripts/diag-hero-fold.mjs
//
// Does the hero's primary action fit above the fold on the phone sizes people actually hold?
//
// WHY THIS IS A RULE AND NOT A PREFERENCE
// The frontend skill this project is being cleaned up against states it plainly: the hero must
// fit the initial viewport, the headline is capped at two lines, and "never let the hero
// overflow and force scroll to find the CTA". A hero whose action is below the fold is not a
// style choice - the first screen asks the visitor to scroll before it asks them to act.
//
// A second, harder constraint applies here: the search bar is the primary conversion on this
// page, and it is interactive. If it sits below the fold, a visitor on a 360px phone never
// sees the thing the page exists to offer.
//
// Line counting uses Range.getClientRects() over all descendant text nodes and counts DISTINCT
// TOP OFFSETS. height / line-height is not a line count and has already produced a wrong answer
// in this repo.
//
// Usage: node scripts/diag-hero-fold.mjs

import { chromium } from 'playwright';

// Measured viewport heights, not nominal: a phone browser reports less than the device
// height once browser chrome is subtracted, which is why 640-700 is the realistic band even
// on a 844px screen. Both are reported so the difference is visible rather than assumed.
const DEVICES = [
  { name: 'Tecno Spark (common)', w: 360, h: 720 },
  { name: 'Galaxy S8/S9', w: 360, h: 740 },
  { name: 'iPhone SE (3rd)', w: 375, h: 667 },
  { name: 'iPhone 14/15/16', w: 390, h: 844 },
  { name: 'iPhone 16 Pro Max', w: 440, h: 956 },
];

const browser = await chromium.launch();

console.log(
  'device                    vw x vh    h1 lines  h1 bottom  search bottom  primary CTA y   above fold?'
);
console.log('-'.repeat(104));

for (const d of DEVICES) {
  const ctx = await browser.newContext({
    viewport: { width: d.w, height: d.h },
    isMobile: true,
    hasTouch: true,
    locale: 'en-KE',
  });
  await ctx.addInitScript(() => {
    document.cookie =
      'nexg_consent=' +
      encodeURIComponent(
        JSON.stringify({
          status: 'granted',
          categories: { necessary: true, analytics: true, marketing: false },
          version: 1,
          decidedAt: '2026-01-01T00:00:00.000Z',
        })
      ) +
      '; Path=/; SameSite=Lax';
    try {
      localStorage.setItem('nexg_theme', 'dark');
    } catch {
      /* ignore */
    }
  });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const r = await page.evaluate(() => {
    const tops = new Set();
    const h1 = document.querySelector('h1');
    if (h1) {
      const w = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (!n.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const rect of range.getClientRects()) {
          if (rect.width > 0 && rect.height > 0) tops.add(Math.round(rect.top));
        }
      }
    }
    const h1Rect = h1 ? h1.getBoundingClientRect() : null;
    const search = document.querySelector('#hero-search-input');
    const sRect = search ? search.getBoundingClientRect() : null;
    const submit = document.querySelector('#hero-search-submit-btn');
    const bRect = submit ? submit.getBoundingClientRect() : null;
    return {
      vh: window.innerHeight,
      lines: tops.size,
      h1Size: h1 ? getComputedStyle(h1).fontSize : null,
      h1Bottom: h1Rect ? Math.round(h1Rect.bottom) : null,
      h1Height: h1Rect ? Math.round(h1Rect.height) : null,
      searchBottom: sRect ? Math.round(sRect.bottom) : null,
      searchTop: sRect ? Math.round(sRect.top) : null,
      ctaY: bRect ? Math.round(bRect.top) : null,
    };
  });

  const searchVisible = r.searchBottom !== null && r.searchBottom <= r.vh;
  const ctaVisible = r.ctaY !== null && r.ctaY < r.vh;
  console.log(
    `${d.name.padEnd(24)} ${String(d.w).padStart(3)}x${String(r.vh).padEnd(4)} ` +
      `${String(r.lines).padStart(6)}    ${String(r.h1Bottom).padStart(6)}    ` +
      `${String(r.searchBottom).padStart(9)}      ${String(r.ctaY).padStart(6)}        ` +
      `${ctaVisible ? 'YES' : 'NO'}${searchVisible ? '' : '  (search below fold)'}`
  );
  await ctx.close();
}

await browser.close();
