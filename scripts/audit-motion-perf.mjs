// scripts/audit-motion-perf.mjs
//
// Two objective performance/craft rules from the frontend skills this project is being
// cleaned up against, both testable rather than a matter of taste:
//
//   1. backdrop-blur belongs on fixed and sticky elements only. On a scrolling container
//      it forces a repaint of everything behind it every frame, which is the classic cause
//      of mobile scroll jank. This is measurable: for each blurred element, is it (or an
//      ancestor) positioned fixed or sticky?
//
//   2. A transition must name its properties. transition-all animates every animatable
//      property including layout ones, so a hover can trigger reflow. Also flagged:
//      ease-in on UI, which reads sluggish, and durations above 300ms on interactive
//      elements, which feel slow however well they are eased.
//
// Read-only. Reports; does not edit.
//
// Usage: node scripts/audit-motion-perf.mjs [route ...]

import { chromium } from 'playwright';

const ROUTES = [
  ['home', '/'],
  ['merchants', '/?page=merchants'],
  ['restaurants', '/?page=restaurants'],
  ['spa', '/?page=spa'],
  ['transport', '/?page=transport'],
  ['groceries', '/?page=groceries'],
  ['experiences', '/?page=experiences'],
  ['properties', '/?page=properties'],
  ['couriers', '/?page=couriers'],
];

const only = process.argv.slice(2);
const wanted = only.length ? ROUTES.filter(([k]) => only.includes(k)) : ROUTES;

const PROBE = `(() => {
  const isFixedOrSticky = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const pos = getComputedStyle(n).position;
      if (pos === 'fixed' || pos === 'sticky') return true;
    }
    return false;
  };

  const blurViolations = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const bd = cs.backdropFilter || cs.webkitBackdropFilter;
    if (!bd || bd === 'none') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    if (isFixedOrSticky(el)) continue;
    blurViolations.push({
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || '').slice(0, 64),
      filter: bd.slice(0, 40),
      w: Math.round(rect.width),
      h: Math.round(rect.height)
    });
  }

  // Transitions: read from the stylesheet rules that actually match, since a computed
  // transition-property of "all" is what the browser will animate.
  const transitionAll = [];
  const easeIn = [];
  const longDuration = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const prop = cs.transitionProperty;
    const dur = cs.transitionDuration;
    const tf = cs.transitionTimingFunction;
    if (!prop || prop === 'none') continue;

    // A transition with ZERO duration animates nothing, and transition-property all
    // with 0s is the inherited default rather than a decision anyone made. Counting those
    // reported 2560 "violations" on this app while transition-all appears ZERO times in
    // the source - a number that measures inheritance, not intent. Only a real, running
    // transition counts.
    const durMs = parseFloat(dur || '0') * (String(dur || '').includes('ms') ? 1 : 1000);
    if (!durMs || durMs <= 0) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    const cls = String(el.className || '').slice(0, 60);
    if (prop === 'all') {
      transitionAll.push({ tag: el.tagName.toLowerCase(), cls: cls, dur: dur });
    }
    if (tf && /ease-in(?!-out)/.test(tf)) {
      easeIn.push({ tag: el.tagName.toLowerCase(), cls: cls, tf: tf });
    }
    const ms = parseFloat(dur || '0') * (String(dur).includes('ms') ? 1 : 1000);
    const interactive = el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button';
    if (interactive && ms > 300) {
      longDuration.push({ tag: el.tagName.toLowerCase(), cls: cls, dur: dur });
    }
  }

  const dedupe = (arr, key) => {
    const seen = {};
    const out = [];
    for (const x of arr) {
      const k = x[key];
      if (seen[k]) { seen[k]++; continue; }
      seen[k] = 1;
      out.push(x);
    }
    return { rows: out, totals: seen };
  };

  return {
    blur: dedupe(blurViolations, 'cls'),
    all: dedupe(transitionAll, 'cls'),
    easeIn: dedupe(easeIn, 'cls'),
    long: dedupe(longDuration, 'cls')
  };
})()`;

const browser = await chromium.launch();
const totals = { blur: 0, all: 0, easeIn: 0, long: 0 };
const byClass = { blur: new Map(), all: new Map(), easeIn: new Map(), long: new Map() };

for (const [key, path] of wanted) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-KE' });
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
  await page.goto('http://127.0.0.1:3000' + path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  const r = await page.evaluate(PROBE);
  for (const kind of ['blur', 'all', 'easeIn', 'long']) {
    const { rows, totals: t } = r[kind];
    totals[kind] += rows.reduce((n, x) => n + (t[x.cls] || 1), 0);
    for (const row of rows) byClass[kind].set(row.cls || '(no class)', (byClass[kind].get(row.cls || '(no class)') || 0) + 1);
  }
  const bits = [];
  if (r.blur.rows.length) bits.push(`${r.blur.rows.length} backdrop-blur outside fixed/sticky`);
  if (r.all.rows.length) bits.push(`${r.all.rows.length} transition-all`);
  if (r.easeIn.rows.length) bits.push(`${r.easeIn.rows.length} ease-in`);
  if (r.long.rows.length) bits.push(`${r.long.rows.length} interactive >300ms`);
  console.log(`${key.padEnd(12)} ${bits.length ? bits.join('   ') : 'clean'}`);
  await ctx.close();
}

await browser.close();

console.log('');
const report = (kind, label) => {
  console.log(`=== ${label}: ${totals[kind]} element(s) ===`);
  const rows = [...byClass[kind].entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (!rows.length) console.log('  none');
  for (const [cls, n] of rows) console.log(`  x${String(n).padStart(3)}  ${cls}`);
};
report('blur', 'backdrop-blur on a scrolling container');
report('all', 'transition-all (animates layout properties too)');
report('easeIn', 'ease-in on UI (reads sluggish)');
report('long', 'interactive transition over 300ms');
