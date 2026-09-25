import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { grantConsent } from './test-support.mjs';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const widths = [320, 360, 640, 1024, 1440];
const browser = await chromium.launch();
let passed = 0;

function check(name, condition, detail = '') {
  assert.ok(condition, `${name}${detail ? ` — ${detail}` : ''}`);
  passed++;
  console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`);
}

function rgbChannels(value) {
  const rgb = value.match(/rgba?\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  const oklch = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:deg)?/i);
  const oklab = value.match(/oklab\(\s*([\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/i);
  assert.ok(oklch || oklab, `Expected computed RGB, OKLCH, or OKLab color, received ${value}`);
  const lightness = Number(oklch?.[1] ?? oklab[1]);
  const a = oklch
    ? Number(oklch[2]) * Math.cos((Number(oklch[3]) * Math.PI) / 180)
    : Number(oklab[2]);
  const b = oklch
    ? Number(oklch[2]) * Math.sin((Number(oklch[3]) * Math.PI) / 180)
    : Number(oklab[3]);

  const lRoot = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return linear.map((channel) => {
    const clamped = Math.max(0, Math.min(1, channel));
    const srgb = clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055;
    return srgb * 255;
  });
}

function luminance([r, g, b]) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function alpha(value) {
  const rgba = value.match(/rgba\([^)]*,\s*([\d.]+)\s*\)/i);
  const modern = value.match(/(?:oklab|oklch)\([^)]*\/\s*([\d.]+)\s*\)/i);
  return rgba ? Number(rgba[1]) : modern ? Number(modern[1]) : 1;
}

function contrastRatio(foreground, background) {
  const bgChannels = rgbChannels(background);
  const fgAlpha = alpha(foreground);
  const fgChannels = rgbChannels(foreground).map((channel, index) =>
    (channel * fgAlpha) + (bgChannels[index] * (1 - fgAlpha))
  );
  const values = [luminance(fgChannels), luminance(bgChannels)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

async function readContrastColors(locator) {
  return locator.evaluate((element) => {
    const foreground = getComputedStyle(element).color;
    let current = element;
    let background = 'rgba(0, 0, 0, 0)';
    while (current && background.endsWith(', 0)')) {
      background = getComputedStyle(current).backgroundColor;
      current = current.parentElement;
    }
    return { foreground, background };
  });
}

try {
  for (const theme of ['dark', 'light']) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const appRequests = [];
      const pageErrors = [];
      await grantConsent(page, baseUrl);

      page.on('request', (request) => {
        const url = new URL(request.url());
        if (
          url.pathname.startsWith('/api/') ||
          request.resourceType() === 'fetch' ||
          request.resourceType() === 'xhr'
        ) {
          appRequests.push(`${request.method()} ${url.pathname}`);
        }
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.goto(`${baseUrl}/?page=admin_login&theme=${theme}`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Admin access' }).waitFor({ state: 'visible' });

      const dimensions = await page.evaluate(() => ({
        width: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      }));
      check(`${theme} layout fits ${width}px`, dimensions.documentWidth <= dimensions.width);
      check(`${theme} route deep-links at ${width}px`, page.url().includes('page=admin_login'));
      check(`${theme} route has one main landmark at ${width}px`, await page.getByRole('main').count() === 1);
      check(`${theme} hides global header/footer at ${width}px`,
        (await page.locator('body > #root header').count()) === 0 &&
        (await page.locator('body > #root footer').count()) === 0);

      const contrast = await readContrastColors(page.locator('#admin-access-description'));
      const ratio = contrastRatio(contrast.foreground, contrast.background);
      check(`${theme} body copy meets WCAG AA at ${width}px`, ratio >= 4.5, `${ratio.toFixed(2)}:1`);

      const labelContrast = await readContrastColors(page.getByText('Work email', { exact: true }));
      const labelRatio = contrastRatio(labelContrast.foreground, labelContrast.background);
      check(`${theme} field label meets WCAG AA at ${width}px`, labelRatio >= 4.5, `${labelRatio.toFixed(2)}:1`);

      const buttonContrast = await readContrastColors(page.getByRole('button', { name: 'Continue' }));
      const buttonRatio = contrastRatio(buttonContrast.foreground, buttonContrast.background);
      check(`${theme} primary button meets WCAG AA at ${width}px`, buttonRatio >= 4.5, `${buttonRatio.toFixed(2)}:1`);

      if (theme === 'dark' && width === 320) {
        await page.reload({ waitUntil: 'networkidle' });
        await page.getByRole('heading', { name: 'Admin access' }).waitFor({ state: 'visible' });
        check('admin route survives refresh', page.url().includes('page=admin_login'));

        const email = page.getByLabel('Work email');
        const password = page.getByLabel('Password', { exact: true });
        await email.focus();
        await page.keyboard.press('Tab');
        check('keyboard Tab advances from email to password',
          await password.evaluate((element) => document.activeElement === element));
        check('keyboard focus has a visible ring',
          await password.evaluate((element) => getComputedStyle(element).boxShadow !== 'none'));

        const passwordInput = password;
        await passwordInput.fill('not-a-real-password');
        await page.getByRole('button', { name: 'Show password' }).click();
        check('password visibility control reveals the field', await passwordInput.getAttribute('type') === 'text');
        await page.getByRole('button', { name: 'Hide password' }).click();
        check('password visibility control masks the field again', await passwordInput.getAttribute('type') === 'password');

        await page.getByRole('button', { name: 'Forgot password?' }).click();
        check('recovery notice says no request was sent',
          /Password recovery is not connected.*No request was sent\./.test(await page.getByRole('status').innerText()));

        await email.fill('admin.prototype@example.test');
        await page.getByRole('button', { name: 'Continue' }).click();
        check('submit notice says no request was sent',
          /Admin sign-in is not connected.*No request was sent\./.test(await page.getByRole('status').innerText()));

        const storedValues = await page.evaluate(() => [
          ...Object.values(localStorage),
          ...Object.values(sessionStorage),
        ].join('\n'));
        check('synthetic credentials are not persisted',
          !storedValues.includes('admin.prototype@example.test') &&
          !storedValues.includes('not-a-real-password'));
      }

      check(`${theme} route sends no API/fetch/XHR requests at ${width}px`, appRequests.length === 0,
        appRequests.join(', '));
      check(`${theme} route has no browser errors at ${width}px`, pageErrors.length === 0,
        pageErrors.join('; '));
      await page.close();
    }
  }

  console.log(`\npassed: ${passed}   failed: 0`);
  console.log('Admin portal prototype checks OK');
} finally {
  await browser.close();
}
