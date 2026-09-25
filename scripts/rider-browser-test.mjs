import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-KE' });
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

const asOf = '2026-09-25T10:00:00.000Z';
const fixtureJob = {
  id: 'dlv_browser_fixture',
  status: 'PICKED',
  merchant_name: 'Browser fixture merchant',
  created_at: asOf,
  updated_at: asOf,
};
const unavailable = (source, message) => ({ status: 'unavailable', value: null, source, as_of: null, message });
const dashboard = {
  as_of: asOf,
  widgets: {
    availability: unavailable('Dispatch API', 'Availability is not connected to Dispatch yet.'),
    assigned_jobs: { status: 'ready', value: { items: [fixtureJob], count: 1 }, source: 'Core Delivery API', as_of: asOf },
    earnings_today: unavailable('Finance API', 'Earnings and payable totals are not connected to the Finance API.'),
    completed_deliveries: { status: 'ready', value: { total: 2 }, source: 'Core Delivery API', as_of: asOf },
    performance_summary: unavailable('Analytics API', 'Performance metrics are not connected to the Analytics API.'),
    active_delivery: { status: 'ready', value: fixtureJob, source: 'Core Delivery API', as_of: asOf },
    incentives_and_bonuses: unavailable('Rewards API', 'Incentives are not connected to the Rewards API.'),
    recent_notifications: unavailable('Notifications API', 'Rider notifications are not connected to the Notifications API.'),
    quick_actions: { status: 'ready', value: [{ id: 'view_assigned_jobs', label: 'View assigned jobs' }], source: 'Rider Portal', as_of: asOf },
  },
};

await page.route('**/api/v1/rider/session', async (route) => {
  const method = route.request().method();
  if (method === 'GET') {
    return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'rider_session_required' }) });
  }
  if (method === 'POST') {
    return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ data: {
      identity: { account_id: 'rider-fixture', display_name: 'Portal Test Rider', phone: null, profile_status: 'approved' },
      csrf_token: 'test-csrf-token',
    } }) });
  }
  if (method === 'DELETE') {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { signed_out: true } }) });
  }
  return route.continue();
});

await page.route('**/api/v1/rider/dashboard', (route) => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ data: dashboard }),
}));

try {
  await page.goto(`${base}/?page=rider_portal`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Rider sign in' }).waitFor({ state: 'visible', timeout: 15000 });
  assert.equal(await page.getByLabel('Phone number').isVisible(), true);
  assert.equal(await page.getByLabel('PIN').isVisible(), true);

  await page.getByLabel('Phone number').fill('+254700000111');
  await page.getByLabel('PIN').fill('1234');
  await page.getByRole('button', { name: /Sign in/ }).click();

  const headings = [
    'Availability status', 'Assigned jobs', 'Earnings today', 'Completed deliveries',
    'Performance summary', 'Active delivery', 'Incentives and bonuses', 'Recent notifications', 'Quick actions',
  ];
  for (const heading of headings) {
    await page.getByRole('heading', { name: heading, exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  }
  assert.equal(await page.getByText('Browser fixture merchant').count(), 2);
  assert.equal(await page.getByText('Availability is not connected to Dispatch yet.').isVisible(), true);
  assert.equal(await page.getByText('Earnings and payable totals are not connected to the Finance API.').isVisible(), true);
  assert.equal(await page.getByText('2', { exact: true }).count(), 1);
  assert.equal(await page.getByText('KSh 4,250').count(), 0);
  assert.equal(await page.getByText('Daniel Kamau').count(), 0);

  await page.getByRole('button', { name: /Sign out/ }).click();
  await page.getByRole('heading', { name: 'Rider sign in' }).waitFor({ state: 'visible', timeout: 10000 });
  assert.deepEqual(pageErrors, []);
  console.log('PASS: anonymous login, nine dashboard areas, assigned data, unavailable upstreams, no sample values, and logout');
} finally {
  await browser.close();
}
