// scripts/v3-consistency-test.mjs
// Asserts the two consistency requirements:
//
//   C1  ONE merchant page template renders for merchants from different verticals
//   C2  ONE item modal adapts its requirements to each merchant's commerce arc
//
// Behavioural, not visual: a screenshot cannot show that a chauffeur transfer is
// asked for a date and party size while a product order is asked for a quantity.
//
// The seeded catalogue currently has items on merchants in only two verticals
// (airport-transfers and adults-only). Those two sit on different arcs, which is
// exactly the contrast this test needs.
//
// Usage: node scripts/v3-consistency-test.mjs [baseUrl]

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

const settle = (page, ms = 1200) => page.waitForTimeout(ms);

/** Find the first merchant per category that actually carries items. */
async function probeMerchants() {
  const res = await fetch(`${BASE}/api/merchants?limit=200`);
  const json = await res.json();
  const withItems = (json.merchants ?? []).filter((m) => (m.items ?? []).length > 0);
  const pick = (categoryId) => withItems.find((m) => m.categoryId === categoryId) ?? null;
  return { booking: pick('airport-transfers'), purchase: pick('adults-only') };
}

/** landing -> discovery -> preview sheet -> explicit full merchant page. */
async function openMerchantPage(page, merchantName) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await settle(page, 1400);

  await page.click('#hero-search-input');
  const search = page.locator('#discovery-search-input');
  await search.waitFor({ state: 'visible', timeout: 10000 });
  await search.fill(merchantName);
  await settle(page, 2400);

  const card = page.locator('article[role="button"]').first();
  await card.waitFor({ state: 'visible', timeout: 10000 });
  await card.click();
  await settle(page, 1100);

  // R3 guard: the card opens a preview, never the page.
  await page.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 8000 });
  check('card click left the browse surface mounted', (await page.locator('#discovery-search-input').count()) === 1);

  // Only this explicit action navigates.
  await page.getByRole('button', { name: /See all offerings|View full profile/i }).first().click();
  await settle(page, 2400);
}

/** Open the first offering and return its modal locator. */
async function openFirstItem(page) {
  const itemButton = page.locator('ul li button').first();
  await itemButton.waitFor({ state: 'visible', timeout: 10000 });
  await itemButton.click();
  await settle(page, 1000);

  const modal = page.locator('[role="dialog"]').last();
  await modal.waitFor({ state: 'visible', timeout: 8000 });
  return modal;
}

async function main() {
  console.log(`v3 consistency test against ${BASE}\n`);

  const merchants = await probeMerchants();
  if (!merchants.booking || !merchants.purchase) {
    console.log('SKIP: no merchants with items in both target arcs.');
    process.exit(0);
  }

  console.log(`booking arc : ${merchants.booking.name} (${merchants.booking.items.length} items)`);
  console.log(`purchase arc: ${merchants.purchase.name} (${merchants.purchase.items.length} items)\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-KE' });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err.message).slice(0, 200)));

  // -------------------------------------------------------------------- C1
  console.log('C1  one merchant page template across verticals');

  const shapes = [];

  for (const merchant of [merchants.booking, merchants.purchase]) {
    await openMerchantPage(page, merchant.name);

    const h1 = ((await page.locator('h1').first().textContent().catch(() => '')) ?? '').trim();
    const hasBack = (await page.getByRole('button', { name: /^Back$/i }).count()) > 0;
    const hasOfferings = (await page.getByRole('heading', { name: /offerings/i }).count()) > 0;
    const workflow = (
      (await page
        .locator('h2')
        .filter({ hasText: /Order & deliver|Book a time|Request a service|Compliance & appointment|Get a quote/ })
        .first()
        .textContent()
        .catch(() => '')) ?? ''
    ).trim();

    shapes.push({ merchant: h1, hasBack, hasOfferings, workflow });
    console.log(`        ${merchant.categoryId.padEnd(20)} h1="${h1.slice(0, 28)}" workflow="${workflow}"`);

    await page.screenshot({ path: `logs/screenshots/merchant-page-${merchant.categoryId}.png` });
  }

  check('every vertical renders a merchant heading', shapes.every((s) => s.merchant.length > 0));
  check('every vertical renders the same Back control', shapes.every((s) => s.hasBack));
  check('every vertical renders the same offerings section', shapes.every((s) => s.hasOfferings));
  check('every vertical declares its workflow on the same template', shapes.every((s) => s.workflow.length > 0));
  check(
    'the two verticals report different workflows (the template adapts)',
    new Set(shapes.map((s) => s.workflow)).size === 2,
    shapes.map((s) => s.workflow).join(' | ')
  );

  // -------------------------------------------------------------------- C2
  console.log('\nC2  one item modal adapts to the order requirements');

  await openMerchantPage(page, merchants.booking.name);
  let modal = await openFirstItem(page);
  let modalText = (await modal.textContent()) ?? '';

  const bookingHasDate = /preferred date/i.test(modalText);
  const bookingHasTime = /preferred time/i.test(modalText);
  const bookingHasParty = /how many people/i.test(modalText);
  const bookingStepper = await modal.locator('button[aria-label="Increase quantity"]').count();

  console.log(`        booking arc  -> date=${bookingHasDate} time=${bookingHasTime} party=${bookingHasParty} stepper=${bookingStepper}`);
  check('booking arc asks for a date', bookingHasDate);
  check('booking arc asks for a time', bookingHasTime);
  check('booking arc asks for a party size', bookingHasParty);
  check('booking arc does NOT ask for a quantity', bookingStepper === 0);

  await page.screenshot({ path: 'logs/screenshots/item-modal-booking-arc.png' });

  await modal.getByRole('button', { name: /Request booking/i }).first().click();
  await settle(page, 700);
  const bookingAlerts = await page.locator('[role="alert"]').count();
  check('incomplete booking is blocked with a visible reason', bookingAlerts > 0, `alerts=${bookingAlerts}`);
  await page.keyboard.press('Escape');
  await settle(page, 800);

  await openMerchantPage(page, merchants.purchase.name);
  modal = await openFirstItem(page);
  modalText = (await modal.textContent()) ?? '';

  const purchaseStepper = await modal.locator('button[aria-label="Increase quantity"]').count();
  const purchaseHasDate = /preferred date/i.test(modalText);
  const purchaseHasCompliance = /required to proceed/i.test(modalText);

  console.log(`        purchase arc -> stepper=${purchaseStepper} date=${purchaseHasDate} compliance=${purchaseHasCompliance}`);
  check('purchase arc asks for a quantity', purchaseStepper === 1);
  check('purchase arc does NOT ask for a booking date', !purchaseHasDate);

  // Compliance is only assertable when the merchant is linked to a subcategory
  // Compliance now resolves. It previously could not, because three separate
  // defects stacked: the seed emitted no merchant_subcategories rows, the resolver
  // used `??` (which does not fall through an empty string), and the API's
  // category-prefixed subcategory id was compared against the catalogue's bare
  // slug. With all three fixed, an adults-only order finally shows its age gate.
  check('purchase arc surfaces the catalogue compliance gates', purchaseHasCompliance);

  await page.screenshot({ path: 'logs/screenshots/item-modal-purchase-arc.png' });

  // A confirmed line must actually reach the cart.
  //
  // The merchant page deliberately has no cart control: the docked header (which
  // owns the cart trigger) is hidden on full-page surfaces. So assert against the
  // persisted cart, then confirm the header badge reflects it once we are back on
  // a page that has a header.
  //
  // Fill every required control the way a user would before confirming. This is
  // not busywork: once the compliance gates started resolving, the adults-only
  // modal gained a required age-verification choice and licence field, and a
  // half-filled form is correctly refused.
  //
  // Controls are filled BY TYPE. A blanket fill() throws on `input[type=number]`,
  // which is how the first version of this helper failed rather than filling.
  const radios = modal.locator('[role="radio"]');
  const radioCount = await radios.count();
  for (let i = 0; i < radioCount; i += 1) {
    const group = radios.nth(i);
    const groupName = await group.evaluate(
      (el) => el.parentElement?.getAttribute('aria-labelledby') ?? ''
    );
    const alreadyChosen = await group.evaluate((el) => {
      const parent = el.parentElement;
      return parent ? parent.querySelector('[role="radio"][aria-checked="true"]') !== null : false;
    });
    if (!groupName || alreadyChosen) continue;
    await group.click();
    await settle(page, 200);
  }

  // Multicheck groups must have at least one selection.
  const multiGroups = modal.locator('[role="group"]');
  for (let i = 0; i < (await multiGroups.count()); i += 1) {
    const group = multiGroups.nth(i);
    const options = group.locator('button');
    if ((await options.count()) === 0) continue;
    if ((await options.first().getAttribute('aria-pressed')) !== 'true') {
      await options.first().click();
      await settle(page, 150);
    }
  }

  const selects = modal.locator('select');
  for (let i = 0; i < (await selects.count()); i += 1) {
    const el = selects.nth(i);
    if ((await el.locator('option').count()) > 1) {
      await el.selectOption({ index: 1 });
      await settle(page, 150);
    }
  }

  for (const selector of ['input[type="number"]', 'input[type="text"]', 'textarea']) {
    const fields = modal.locator(selector);
    for (let i = 0; i < (await fields.count()); i += 1) {
      await fields.nth(i).fill(selector.includes('number') ? '5' : 'Verified at reception');
      await settle(page, 100);
    }
  }

  await modal.locator('button[aria-label="Increase quantity"]').first().click();
  await settle(page, 350);

  await modal
    .getByRole('button', { name: /Add to order|Request booking|Submit request|Confirm appointment request|Request quote/i })
    .first()
    .click();
  await settle(page, 1500);

  const modalClosed = (await page.locator('[role="dialog"]').count()) === 0;
  check('confirming a valid line closes the modal', modalClosed);

  const persisted = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('nexg_cart') || '[]');
    } catch {
      return [];
    }
  });
  console.log(`        persisted cart lines: ${persisted.length} (qty ${persisted[0]?.quantity ?? 0})`);
  check('a completed line is persisted to the cart', persisted.length > 0);

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await settle(page, 1800);
  const badge = ((await page.locator('button[aria-label="View Cart"]').first().textContent().catch(() => '')) ?? '').trim();
  console.log(`        header cart badge: "${badge}"`);
  check('the header cart badge reflects the added line', badge.length > 0 && badge !== '0');

  check('no page errors during the consistency flow', pageErrors.length === 0, pageErrors[0] ?? '');

  await browser.close();

  console.log(`\n${'-'.repeat(64)}`);
  console.log(`passed: ${passed}   failed: ${failures.length}`);
  if (failures.length) {
    console.log('\nfailures:');
    for (const f of failures) console.log(`  * ${f}`);
    process.exit(1);
  }
  console.log('v3 consistency OK');
}

main().catch((err) => {
  console.error('v3 consistency test crashed:', err?.message ?? err);
  process.exit(1);
});
