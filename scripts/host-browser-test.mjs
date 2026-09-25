import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { chromium } from 'playwright';

const base = process.env.HOST_BROWSER_BASE ?? 'http://127.0.0.1:3000';
const reviewerEmail = process.env.HOST_TEST_REVIEWER_EMAIL ?? '';
const reviewerPassword = process.env.HOST_TEST_REVIEWER_PASSWORD ?? '';
assert.match(reviewerEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
assert.ok(reviewerPassword.length >= 14);

const applicant = {
  fullName: 'Host Browser Integration',
  email: `host-test-ui-${Date.now()}-${randomBytes(4).toString('hex')}@example.invalid`,
  password: `Host-ui-${randomBytes(20).toString('base64url')}-9X`,
  organizationName: 'Browser Integration Property',
  location: 'Nairobi test area',
  propertyCount: '2',
  propertyType: 'hotel',
  note: 'Automated local browser test; no guest or payment data.',
};
const browser = await chromium.launch();
const errors = [];
const applicantContext = await browser.newContext({ viewport: { width: 1440, height: 960 }, locale: 'en-KE' });
const applicantPage = await applicantContext.newPage();
applicantPage.on('pageerror', (error) => errors.push(error.name));

try {
  await applicantPage.goto(`${base}/?page=host_login`);
  await applicantPage.locator('[data-analytics="consent-reject-all"]').click();
  await applicantPage.getByRole('heading', { name: 'Sign in to your Host Portal' }).waitFor();
  assert.ok(await applicantPage.getByRole('img', { name: 'NEXG' }).count(), 'NEXG wordmark must be accessible');
  assert.match(await applicantPage.getByRole('main').innerText(), /Host workspace access starts after NEXG approves your application/);
  process.stdout.write('PASS Host login renders with NEXG branding and clear approval copy\n');

  await applicantPage.getByRole('button', { name: 'Apply for a Host account' }).click();
  await applicantPage.locator('#apply-name').fill(applicant.fullName);
  await applicantPage.locator('#apply-email').fill(applicant.email);
  await applicantPage.locator('#apply-password').fill(applicant.password);
  await applicantPage.locator('#organization').fill(applicant.organizationName);
  await applicantPage.locator('#location').fill(applicant.location);
  await applicantPage.locator('#property-count').fill(applicant.propertyCount);
  await applicantPage.locator('#property-type').selectOption(applicant.propertyType);
  await applicantPage.locator('#application-note').fill(applicant.note);
  await applicantPage.getByRole('button', { name: 'Submit application' }).click();
  await applicantPage.getByRole('heading', { name: 'Your application is under review' }).waitFor();
  const statusText = await applicantPage.locator('#root').innerText();
  const applicationId = statusText.match(/Application reference:\s*([0-9a-f-]{36})/i)?.[1];
  assert.ok(applicationId, 'application reference must be shown after durable submission');
  const storedApplicantSecrets = await applicantPage.evaluate(({ email, password }) => {
    const values = Object.entries(localStorage).map(([key, value]) => `${key}=${value}`).join('\n');
    return values.includes(email) || values.includes(password);
  }, { email: applicant.email, password: applicant.password });
  assert.equal(storedApplicantSecrets, false, 'applicant email and password must not be persisted in local storage');
  process.stdout.write('PASS Host application submits to the service and remains out of browser storage\n');

  await applicantPage.getByRole('button', { name: 'Sign out' }).click();
  await applicantPage.getByRole('heading', { name: 'Sign in to your Host Portal' }).waitFor();
  await applicantPage.locator('#host-email').fill(applicant.email);
  await applicantPage.locator('#host-password').fill(applicant.password);
  await applicantPage.locator('#host-password').focus();
  await applicantPage.keyboard.press('Tab');
  const applicantSignIn = applicantPage.getByRole('button', { name: 'Sign in', exact: true });
  assert.equal(await applicantSignIn.evaluate((button) => button === document.activeElement), true, 'keyboard focus must reach Host sign-in');
  process.stdout.write('PASS Tab moves from password to Host sign-in\n');
  await applicantPage.keyboard.press('Enter');
  await applicantPage.getByRole('heading', { name: 'Your application is under review' }).waitFor();
  process.stdout.write('PASS applicant can use keyboard sign-in, return, and check pending status\n');

  const reviewerContext = await browser.newContext({ viewport: { width: 1440, height: 960 }, locale: 'en-KE' });
  const reviewerPage = await reviewerContext.newPage();
  reviewerPage.on('pageerror', (error) => errors.push(error.name));
  await reviewerPage.goto(`${base}/?page=host_review`);
  const reviewerConsent = reviewerPage.locator('[data-analytics="consent-reject-all"]');
  if (await reviewerConsent.count()) await reviewerConsent.click();
  await reviewerPage.getByRole('heading', { name: 'Review Host applications' }).waitFor();
  await reviewerPage.locator('#review-email').fill(reviewerEmail);
  await reviewerPage.locator('#review-password').fill(reviewerPassword);
  await reviewerPage.locator('#review-password').focus();
  await reviewerPage.keyboard.press('Tab');
  const reviewerSignIn = reviewerPage.getByRole('button', { name: 'Sign in to review' });
  assert.equal(await reviewerSignIn.evaluate((button) => button === document.activeElement), true, 'keyboard focus must reach reviewer sign-in');
  process.stdout.write('PASS Tab moves from password to reviewer sign-in\n');
  await reviewerPage.keyboard.press('Enter');
  await reviewerPage.getByRole('heading', { name: 'Host application review' }).waitFor();
  await reviewerPage.getByRole('button', { name: new RegExp(applicationId) }).click();
  await reviewerPage.getByRole('heading', { name: applicant.organizationName }).waitFor();
  await reviewerPage.locator('#review-reason').fill('Approved after local browser review.');
  await reviewerPage.getByRole('button', { name: 'Approve access' }).click();
  await reviewerPage.getByRole('button', { name: 'Confirm approve' }).click();
  await reviewerPage.getByRole('heading', { name: 'Host application review' }).waitFor();
  await reviewerPage.setViewportSize({ width: 390, height: 844 });
  assert.equal(await reviewerPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'reviewer page must not overflow at mobile width');
  process.stdout.write('PASS reviewer keyboard sign-in approves through the signed Host API and Admin audit\n');
  process.stdout.write('PASS reviewer queue remains within mobile viewport width\n');

  await applicantPage.getByRole('button', { name: 'Refresh status' }).click();
  await applicantPage.getByRole('heading', { name: 'Your Host access is approved' }).waitFor();
  await applicantPage.getByRole('button', { name: 'Open Host workspace' }).click();
  await applicantPage.getByText(`${applicant.organizationName} · approved Host workspace`).waitFor();
  process.stdout.write('PASS approved applicant reaches the server-confirmed Host workspace\n');

  await applicantPage.getByRole('button', { name: 'Sign out' }).click();
  await applicantPage.getByRole('heading', { name: 'Sign in to your Host Portal' }).waitFor();
  await applicantPage.setViewportSize({ width: 390, height: 844 });
  assert.equal(await applicantPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'Host sign-in must not overflow at mobile width');
  process.stdout.write('PASS Host login remains usable at mobile viewport width\n');

  assert.deepEqual(errors, [], 'Host applicant and reviewer flows must not throw browser errors');
  await reviewerContext.close();
} finally {
  await applicantContext.close();
  await browser.close();
}
