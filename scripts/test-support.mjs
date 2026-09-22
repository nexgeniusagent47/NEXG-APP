// scripts/test-support.mjs
//
// Shared helpers for the browser test scripts.
//
// The consent banner is a real, blocking part of the app: it covers the bottom of the
// viewport until a choice is made, and Playwright refuses to click through it. A real
// returning user has already chosen, so the tests seed that choice rather than fighting
// the banner on every interaction.
//
// Seeding the cookie directly (instead of clicking "Accept all") also keeps these
// suites about the product rather than about the banner, and means a change to the
// banner's layout cannot break cart tests.

/**
 * A choice that satisfies the banner so it never renders.
 *
 * Mirrors the exact `ConsentState` shape `src/lib/consent.ts` writes —
 * `{ status, categories, version, decidedAt }` — because a mismatch is silently
 * treated as "undecided" and the banner reappears with no error to explain why.
 */
export const CONSENT_COOKIE_VALUE = encodeURIComponent(
  JSON.stringify({
    status: 'granted',
    categories: { necessary: true, analytics: true, marketing: false },
    version: 1,
    decidedAt: '2026-01-01T00:00:00.000Z',
  })
);

/**
 * Make the browser look like a user who has already answered the consent prompt.
 *
 * Accepts a Playwright BrowserContext or Page. `addInitScript` runs before any page
 * script, so `consent.ts` reads the cookie on its first render and the banner is never
 * mounted — which is also what avoids a flash of the banner in screenshots.
 */
export async function grantConsent(target, baseUrl) {
  const host = new URL(baseUrl).hostname;
  await target.addInitScript(
    ({ name, value, domain }) => {
      document.cookie = `${name}=${value}; path=/; domain=${domain}; SameSite=Lax`;
    },
    { name: 'nexg_consent', value: CONSENT_COOKIE_VALUE, domain: host }
  );
}

/** Decline instead, for the rare test that wants the undecided state. */
export async function clearConsent(target) {
  await target.addInitScript(() => {
    document.cookie = 'nexg_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
}
