// scripts/audit-contrast.mjs
//
// WCAG contrast audit across the real routes, at phone and desktop width, in both themes.
//
// WHY THIS IS SEPARATE FROM THE DEVICE ROOM
// The room measures layout: overflow, clipped text, tap targets. It has never measured
// colour, and the handoff names contrast as an unverified risk in this project. A page can
// pass every layout check and still be unreadable.
//
// THE INSTRUMENT TRAP THIS AVOIDS
// A canvas returns OPAQUE BLACK for `oklch()`, which it cannot parse. Two colour probes in
// this repo produced confidently wrong readings that way. So: no canvas. Colours are read
// as raw computed values and parsed here, and the effective background is resolved by
// walking ancestors for the first non-transparent one rather than being assumed.
//
// WHAT IS AND IS NOT CHECKED
//   - text and background as RENDERED, at the element's real font size and weight
//   - the large-text exemption (>= 24px, or >= 18.66px when bold) is applied properly
//   - text over an image or gradient cannot be resolved this way and is REPORTED as
//     unresolved rather than guessed at. A guessed contrast ratio is worse than none.
//
// Usage: node scripts/audit-contrast.mjs [route ...]

import { chromium } from 'playwright';
import { CONTRAST_PROBE } from './contrast-probe.mjs';

const BASE = 'http://127.0.0.1:3000';

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
  ['merchant_onboarding', '/?page=merchant_onboarding'],
];

const only = process.argv.slice(2);
const wanted = only.length ? ROUTES.filter(([k]) => only.includes(k)) : ROUTES;

// The probe lives in scripts/contrast-probe.mjs so the verifier can test the same string
// the audit runs. See that file for why it is built with String.raw.
const browser = await chromium.launch();
const findings = [];
const unresolvedCounts = new Map();
let checkedTotal = 0;

for (const theme of ['dark', 'light']) {
  for (const vp of [
    { name: '390', w: 390, h: 844 },
    { name: '1280', w: 1280, h: 900 },
  ]) {
    for (const [key, path] of wanted) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
        isMobile: vp.w < 768,
        hasTouch: vp.w < 768,
        locale: 'en-KE',
      });
      await ctx.addInitScript(
        (t) => {
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
            localStorage.setItem('nexg_theme', t);
          } catch {
            /* ignore */
          }
        },
        theme
      );
      const page = await ctx.newPage();
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3500);

      const rows = await page.evaluate(CONTRAST_PROBE);

      for (const r of rows) {
        if (r.unresolved) {
          const k = `${r.unresolved}`;
          unresolvedCounts.set(k, (unresolvedCounts.get(k) || 0) + 1);
          continue;
        }
        if (typeof r.ratio !== 'number') continue;
        checkedTotal++;
        // WCAG 2.2: 3:1 for large text (>= 24px, or >= 18.66px bold), 4.5:1 otherwise.
        const isLarge = r.fontSize >= 24 || (r.fontSize >= 18.66 && r.fontWeight >= 700);
        const required = isLarge ? 3 : 4.5;
        if (r.ratio < required) {
          findings.push({
            route: key,
            theme,
            vp: vp.name,
            ...r,
            required,
            isLarge,
          });
        }
      }
      await ctx.close();
    }
  }
}

await browser.close();

// Collapse to one row per (route, theme, colour pair, size) so a shared token reports once.
const grouped = new Map();
for (const f of findings) {
  const k = `${f.route}|${f.theme}|${f.color}|${f.bg}|${Math.round(f.fontSize)}`;
  if (!grouped.has(k)) grouped.set(k, { ...f, count: 0, samples: [] });
  const g = grouped.get(k);
  g.count++;
  if (g.samples.length < 2) g.samples.push(`${f.vp}px "${f.text}"`);
}

console.log(`contrast checks run: ${checkedTotal}\n`);
if (unresolvedCounts.size) {
  console.log('NOT MEASURABLE here (text over an image or gradient — reported, not guessed):');
  for (const [k, n] of unresolvedCounts) console.log(`  ${n} element(s) over ${k}`);
  console.log('');
}

if (!grouped.size) {
  console.log('No contrast failures found at the sizes and themes tested.');
} else {
  console.log(`FAILURES: ${grouped.size} distinct (colour, size) combination(s)\n`);
  const byRoute = new Map();
  for (const g of grouped.values()) {
    if (!byRoute.has(g.route)) byRoute.set(g.route, []);
    byRoute.get(g.route).push(g);
  }
  for (const [route, rows] of byRoute) {
    console.log(`${route}:`);
    for (const r of rows.sort((a, b) => a.ratio - b.ratio).slice(0, 8)) {
      console.log(
        `  ${String(r.ratio).padStart(5)}:1  needs ${r.required}:1  ${r.theme}/${r.fontSize}px${r.isLarge ? ' (large)' : ''}` +
          `  fg=${r.color} on bg=${r.bg}  x${r.count}`
      );
      console.log(`      <${r.tag}> ${r.samples.join(' ; ')}`);
      console.log(`      cls=[${r.cls}]`);
    }
  }
}
