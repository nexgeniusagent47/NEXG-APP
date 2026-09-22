// scripts/device-room/measure-page.mjs
//
// Navigate a Playwright page and measure it, surviving the dev server reloading it.
//
// WHY RETRIES ARE NOT PAPERING OVER A BUG
// Vite issues a full page reload when a change lands outside its HMR boundary, which
// includes `index.html` and anything `main.tsx` imports. If that lands between
// `goto` and `evaluate`, the execution context is destroyed and `page.evaluate` throws
// "Execution context was destroyed". Both audits were aborting part-way through a run
// because of it, which is indistinguishable from a crash and loses the whole matrix.
//
// A retry after the reload settles is the correct response. A failure that survives
// every attempt is reported as UNMEASURED, never as clean — the distinction this
// project has been burned by is exactly the one between "found nothing" and "did not
// look".

import { MEASURE_SOURCE } from './measure.mjs';

/** The measurement as source text, which is what `page.evaluate` accepts. */
export const EVALUATE_SOURCE = MEASURE_SOURCE;

const TRANSIENT = /Execution context was destroyed|Target closed|navigat|frame was detached/i;

/**
 * Measure one URL at one viewport.
 *
 * @returns {Promise<object|null>} The measurement, or `null` when no attempt succeeded.
 *   Null is deliberate: it cannot be mistaken for a clean result.
 */
export async function measurePage(page, { url, width, height, settleMs = 3200, attempts = 3 }) {
  if (height && page.viewportSize()?.height !== height) {
    await page.setViewportSize({ width, height });
  }

  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(settleMs);
      const result = await page.evaluate(EVALUATE_SOURCE);
      return { ...result, attempt };
    } catch (err) {
      lastError = err?.message ?? String(err);
      if (!TRANSIENT.test(lastError) || attempt === attempts) break;
      // A reload is in flight. Let it land, then navigate again from a known state.
      await page.waitForTimeout(1500);
    }
  }

  return null;
}

export { TRANSIENT };
