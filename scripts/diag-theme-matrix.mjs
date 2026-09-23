// scripts/_diag-theme-matrix.mjs
//
// Contrast across the FOUR theme combinations, because two independent axes are in play
// and only one of them was ever configured.
//
// THE BUG THIS MEASURES
// The app sets `html.dark` (or `html.light`) from its own ThemeContext. Tailwind v4's
// bare `dark:` variant, with no `@custom-variant` declared, compiles to
// `@media (prefers-color-scheme: dark)` — it responds to the OPERATING SYSTEM, not to the
// class the app writes. Those are different axes:
//
//   app theme   : html.dark / html.light      (set by the user in the UI)
//   OS scheme   : prefers-color-scheme        (not set by the user in the UI)
//
// So there are four combinations, and the two where they disagree are where the dark
// overrides silently do not apply:
//
//   app=dark  os=dark    dark: rules active   -> intended
//   app=dark  os=light   dark: rules INACTIVE -> dark surfaces, light-mode text
//   app=light os=light   dark: rules inactive -> intended
//   app=light os=dark    dark: rules ACTIVE   -> light surfaces, dark-mode text
//
// Usage: node scripts/_diag-theme-matrix.mjs [route ...]

import { chromium } from 'playwright';
import { CONTRAST_PROBE } from './contrast-probe.mjs';

const ROUTES = [
  ['home', '/'],
  ['merchants', '/?page=merchants'],
  ['spa', '/?page=spa'],
];

const only = process.argv.slice(2);
const wanted = only.length ? ROUTES.filter(([k]) => only.includes(k)) : ROUTES;

const browser = await chromium.launch();


for (const [key, url] of wanted) {
  for (const appTheme of ['dark', 'light']) {
    for (const osScheme of ['dark', 'light']) {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        locale: 'en-KE',
        colorScheme: osScheme,
      });
      await ctx.addInitScript((t) => {
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
      }, appTheme);

      const page = await ctx.newPage();
      await page.goto('http://127.0.0.1:3000' + url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3200);

      // The shared probe, not a second copy. A duplicated measurement is how two
      // instruments end up disagreeing - this file's own inline version had the
      // translucent-background bug that the shared one has since fixed, so it reported
      // white-on-a-black-badge as 1.00:1.
      const rows = await page.evaluate(CONTRAST_PROBE);
      let checked = 0;
      let failed = 0;
      const examples = [];
      for (const r of rows) {
        if (r.unresolved || typeof r.ratio !== 'number') continue;
        checked++;
        const need = r.fontSize >= 24 || (r.fontSize >= 18.66 && r.fontWeight >= 700) ? 3 : 4.5;
        if (r.ratio < need) {
          failed++;
          if (examples.length < 3) examples.push(`${r.ratio}:1 ${r.color} on ${r.bg} "${r.text}"`);
        }
      }
      const result = { checked, failed, examples, htmlClass: await page.evaluate(() => document.documentElement.className) };
      const agrees = appTheme === osScheme;
      console.log(
        `${key.padEnd(10)} app=${appTheme.padEnd(5)} os=${osScheme.padEnd(5)} ` +
          `${agrees ? 'agree  ' : 'DISAGREE'}  html=${String(result.htmlClass).padEnd(6)}  ` +
          `failed ${String(result.failed).padStart(3)} of ${String(result.checked).padStart(4)}`
      );
      for (const e of result.examples) console.log(`        ${e}`);
      await ctx.close();
    }
  }
}

await browser.close();
