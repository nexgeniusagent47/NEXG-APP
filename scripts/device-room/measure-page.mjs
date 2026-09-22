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

/**
 * `page.evaluate` with a STRING argument treats it as an EXPRESSION, not a program: it
 * evaluates it and returns the result. `MEASURE_SOURCE` is a function *declaration*, so
 * on its own it declared a function, evaluated to `undefined`, and every measurement
 * came back as `undefined`.
 *
 * That failure was silent in the worst way. `undefined > 2` is false and
 * `undefined > 0` is false, so every derived flag came out false and the audit reported
 * a clean page for every device while measuring nothing at all. Nothing threw.
 *
 * Wrapping the declaration in parentheses turns it into a function expression, and
 * calling it with an argument — as `page.evaluate` does with the outer `(source)` — runs
 * the body. The same wrapping is applied to `MEASURE` in measure.mjs.
 */
export const EVALUATE_EXPRESSION = `(${MEASURE_SOURCE})({})`;

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
      const result = await page.evaluate(EVALUATE_EXPRESSION);

      // A measurement that is not an object is a failure, not a clean page. Without
      // this check the declaration-versus-expression mistake above produced
      // `undefined`, which compared false against every threshold and reported a pass.
      if (!result || typeof result !== 'object' || typeof result.vw !== 'number') {
        lastError = `measurement returned ${JSON.stringify(result)} instead of a result object`;
        break;
      }

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
