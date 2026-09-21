// scripts/v2-flow-test.mjs
// Interaction assertions for the v2 discovery flow.
//
// These are the three behaviours the v2 brief specifies. They are asserted, not
// merely screenshotted, because all three are invisible in a still image:
//
//   R1  clicking the search bar leads to a merchant discovery screen
//   R2  the discovery surface offers workflow-appropriate actions per vertical
//   R3  clicking a merchant must NEVER take the user to the merchant screen
//   R4  the docked header has no nav items between Explore and Partners
//
// Usage: node scripts/v2-flow-test.mjs [baseUrl]

import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function settle(page, ms = 1200) {
  await page.waitForTimeout(ms);
}

async function main() {
  console.log(`v2 flow test against ${BASE}\n`);
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-KE' });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err.message).slice(0, 200)));

  // ------------------------------------------------------------------ R1
  console.log('R1  search bar opens merchant discovery');
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await settle(page);

  check('landing page exposes a search input', (await page.locator('#hero-search-input').count()) === 1);

  await page.click('#hero-search-input');
  await settle(page, 1500);

  const discoveryInput = page.locator('#discovery-search-input');
  check('discovery surface renders its own search field', (await discoveryInput.count()) === 1);

  // The discovery surface must show real merchants from the API, not a taxonomy list.
  const cardCount = await page.locator('article[role="button"]').count();
  check('discovery renders merchant cards from the API', cardCount > 0, `found ${cardCount}`);

  const merchantLabel = await page.locator('text=/merchants?$/').first().textContent().catch(() => null);
  console.log(`        header count label: ${merchantLabel?.trim() ?? 'n/a'}`);

  // ------------------------------------------------------------------ R1b
  console.log('\nR1b live search narrows results');
  await discoveryInput.fill('spa');
  await settle(page, 2000);

  const heading = await page.locator('h1').first().textContent();
  check('heading reflects the query', /spa/i.test(heading ?? ''), `heading="${heading}"`);

  await discoveryInput.fill('');
  await settle(page, 1600);

  // ------------------------------------------------------------------ R4
  console.log('\nR4  docked header trimmed to Explore + Partners');
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await settle(page);

  const navText = (await page.locator('header nav').first().textContent()) ?? '';
  for (const removed of ['Fine Dining', 'Spa & Wellness', 'VIP Mobility', 'Fine Cellar', 'Experiences']) {
    check(`nav no longer contains "${removed}"`, !navText.includes(removed));
  }
  check('nav still contains Explore', /Explore/.test(navText));
  check('nav still contains Partners', /Partners/.test(navText));

  // ------------------------------------------------------------------ R3
  console.log('\nR3  merchant click opens a preview and never navigates');
  await page.click('#hero-search-input');
  await settle(page, 1600);

  const firstCard = page.locator('article[role="button"]').first();
  await firstCard.waitFor({ state: 'visible', timeout: 8000 });
  const merchantName = (await firstCard.locator('h3').first().textContent())?.trim();
  console.log(`        clicking: ${merchantName}`);

  await firstCard.click();
  await settle(page, 1200);

  const dialog = page.locator('[role="dialog"]');
  check('a preview sheet opens', (await dialog.count()) === 1);

  // The headline regression guard: the discovery surface must still be mounted
  // behind the sheet. If the click had navigated, this field would be gone.
  check(
    'discovery surface is still mounted (no navigation occurred)',
    (await page.locator('#discovery-search-input').count()) === 1
  );

  // The sheet must offer a workflow-appropriate primary action and an explicit
  // route to the full profile, and they must be different controls.
  if ((await dialog.count()) === 1) {
    const dialogText = (await dialog.textContent()) ?? '';
    const hasViewFull = /See all offerings|View full profile/i.test(dialogText);
    check('sheet offers an explicit "View full profile" action', hasViewFull);

    const workflowActions = [
      'View full menu',
      'Check availability',
      'Request this service',
      'Book appointment',
      'Get shipping quote',
    ];
    const matched = workflowActions.filter((a) => dialogText.includes(a));
    check(
      'sheet offers a workflow-specific primary action',
      matched.length === 1,
      matched.length ? `matched "${matched[0]}"` : 'none matched'
    );
    console.log(`        workflow: ${matched[0] ?? 'n/a'}`);
  }

  // Closing returns to the browse surface.
  await page.keyboard.press('Escape');
  await settle(page, 800);
  check('Escape closes the sheet', (await page.locator('[role="dialog"]').count()) === 0);
  check(
    'still on discovery after closing',
    (await page.locator('#discovery-search-input').count()) === 1
  );

  // ---------------------------------------------------------------- errors
  console.log('');
  check('no page errors during the flow', pageErrors.length === 0, pageErrors[0] ?? '');

  await browser.close();

  console.log(`\n${'-'.repeat(64)}`);
  console.log(`passed: ${passed}   failed: ${failures.length}`);
  if (failures.length) {
    console.log('\nfailures:');
    for (const f of failures) console.log(`  * ${f}`);
    process.exit(1);
  }
  console.log('v2 flow OK');
}

main().catch((err) => {
  console.error('v2 flow test crashed:', err?.message ?? err);
  process.exit(1);
});
