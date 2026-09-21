// scripts/screenshots.mjs
// Capture the major NEXG Concierge surfaces for visual review.
//
// Usage:
//   node scripts/screenshots.mjs [baseUrl] [outDir]
//
// Requires the dev server running (npm run dev) AND the API running
// (npm run server), because screenshots must be taken against real data.
//
// Artifacts land in logs/screenshots/ as <id>-<viewport>.png plus a
// manifest.json recording console errors, page errors and failed requests per
// surface. A screen that renders but throws is still a defect, and a manifest
// that only lists successes is not useful for debugging.

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const OUT = path.resolve(process.argv[3] ?? 'logs/screenshots');
/** Optional 4th arg: substring filter on surface id, e.g. "03" or "landing". */
const ONLY = process.argv[4] ?? '';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

/** Third-party hosts expected to be unreachable in this environment. */
const IGNORED_HOSTS = /unsplash|dicebear|googleapis|gstatic|fonts\.|pexels|cloudinary/i;

// Desktop nav labels are localised; these are the en-KE values from
// src/data/translations.ts. The desktop nav is `hidden xl:flex`, so it only
// exists at >=1280px. At mobile widths everything lives behind the hamburger.
const NAV = {
  explore: 'Explore',
  restaurants: 'Fine Dining',
  spa: 'Spa & Wellness',
  transport: 'VIP Mobility',
  groceries: 'Fine Cellar',
  experiences: 'Experiences',
  partners: 'Partners',
};

async function settle(page, ms = 1400) {
  await page.waitForTimeout(ms);
  try {
    await page.evaluate(() => document.fonts?.ready);
  } catch {
    /* fonts API unavailable */
  }
}

async function openPage(page, viewport, navLabel) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await settle(page);

  if (viewport.name === 'mobile') {
    await page.click('button[aria-label="Open Mobile Menu"]');
    await settle(page, 500);
    // Partners is a collapsible group on mobile; expand it first.
    if (navLabel === NAV.partners) {
      await page.getByText(NAV.partners, { exact: true }).first().click();
      await settle(page, 400);
      await page.getByText('For Merchants', { exact: true }).first().click();
    } else {
      await page.getByText(navLabel, { exact: true }).first().click();
    }
  } else {
    if (navLabel === NAV.partners) {
      // Desktop Partners is a hover-revealed dropdown.
      await page.getByText(NAV.partners, { exact: true }).first().hover();
      await settle(page, 400);
      await page.getByText('For Merchants', { exact: true }).first().click();
    } else {
      await page.getByText(navLabel, { exact: true }).first().click();
    }
  }
  await settle(page);
}

const SURFACES = [
  {
    id: '01-landing',
    label: 'Landing page (hero)',
    async go(page) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    },
  },
  {
    id: '02-dashboard',
    label: 'Landing page full scroll',
    async go(page) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await settle(page);
      // Scroll so lazy sections below the fold actually mount.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
    },
  },
  {
    id: '03-categories-modal',
    label: 'Category explorer modal (Explore nav)',
    async go(page, viewport) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await settle(page);
      if (viewport.name === 'mobile') {
        await page.click('button[aria-label="Open Mobile Menu"]');
        await settle(page, 500);
        await page.getByText('Home', { exact: true }).first().click();
      } else {
        // The header "Explore" entry point — previously a no-op (D-17).
        await page.getByText(NAV.explore, { exact: true }).first().click();
      }
    },
  },
  {
    id: '04-restaurants',
    label: 'Restaurants / Fine Dining page',
    async go(page, viewport) {
      await openPage(page, viewport, NAV.restaurants);
    },
  },
  {
    id: '05-spa',
    label: 'Spa & Wellness page',
    async go(page, viewport) {
      await openPage(page, viewport, NAV.spa);
    },
  },
  {
    id: '06-transport',
    label: 'VIP Mobility page',
    async go(page, viewport) {
      await openPage(page, viewport, NAV.transport);
    },
  },
  {
    id: '07-groceries',
    label: 'Fine Cellar page',
    async go(page, viewport) {
      await openPage(page, viewport, NAV.groceries);
    },
  },
  {
    id: '08-experiences',
    label: 'Experiences page',
    async go(page, viewport) {
      await openPage(page, viewport, NAV.experiences);
    },
  },
  {
    id: '09-partners',
    label: 'For Merchants portal',
    async go(page, viewport) {
      await openPage(page, viewport, NAV.partners);
    },
  },
  {
    id: '10-cart',
    label: 'Cart drawer (empty state)',
    async go(page) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await settle(page);
      await page.click('button[aria-label="View Cart"]');
    },
    viewports: ['desktop'],
  },
  {
    id: '11-light-mode',
    label: 'Landing page in light theme',
    async go(page) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await settle(page);
      await page.click('#header-theme-toggle-btn');
    },
    viewports: ['desktop'],
  },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const manifest = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2,
      locale: 'en-KE',
      permissions: [],
    });

    for (const surface of SURFACES) {
      if (surface.viewports && !surface.viewports.includes(viewport.name)) continue;
      if (ONLY && !surface.id.includes(ONLY)) continue;

      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300));
      });
      page.on('pageerror', (err) => pageErrors.push(String(err.message).slice(0, 300)));
      page.on('requestfailed', (req) => {
        if (IGNORED_HOSTS.test(req.url())) return;
        failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText ?? 'failed'}`);
      });

      const file = `${surface.id}-${viewport.name}.png`;
      const fullFile = `${surface.id}-${viewport.name}-full.png`;

      try {
        await surface.go(page, viewport);
        await settle(page);
        await page.screenshot({ path: path.join(OUT, file), fullPage: false });
        await page.screenshot({ path: path.join(OUT, fullFile), fullPage: true });

        const title = await page.title();
        const bodyText = ((await page.textContent('body')) ?? '').trim();

        manifest.push({
          id: surface.id,
          label: surface.label,
          viewport: viewport.name,
          file,
          fullFile,
          title,
          bodyChars: bodyText.length,
          looksBlank: bodyText.length < 200,
          consoleErrors,
          pageErrors,
          failedRequests,
          status: 'captured',
        });

        const flags = [
          pageErrors.length ? `${pageErrors.length} pageerror` : '',
          consoleErrors.length ? `${consoleErrors.length} consoleerr` : '',
          bodyText.length < 200 ? 'BLANK?' : '',
        ]
          .filter(Boolean)
          .join(' ');
        console.log(`  captured ${file.padEnd(40)} ${String(bodyText.length).padStart(6)} chars  ${flags}`);
      } catch (err) {
        manifest.push({
          id: surface.id,
          label: surface.label,
          viewport: viewport.name,
          file: null,
          consoleErrors,
          pageErrors,
          failedRequests,
          status: 'failed',
          error: (err?.message ?? String(err)).split('\n')[0],
        });
        console.log(`  FAILED   ${file.padEnd(40)} ${(err?.message ?? err).split('\n')[0]}`);
      } finally {
        await page.close();
      }
    }

    await context.close();
  }

  await browser.close();

  const manifestPath = path.join(OUT, 'manifest.json');
  await fs.writeFile(
    manifestPath,
    JSON.stringify({ base: BASE, capturedAt: new Date().toISOString(), surfaces: manifest }, null, 2)
  );

  const captured = manifest.filter((m) => m.status === 'captured');
  const failed = manifest.filter((m) => m.status !== 'captured');
  const withPageErrors = captured.filter((m) => m.pageErrors.length > 0);
  const withConsoleErrors = captured.filter((m) => m.consoleErrors.length > 0);

  console.log(`\n${captured.length}/${manifest.length} surfaces captured`);
  if (withPageErrors.length) {
    console.log(`\n${withPageErrors.length} surface(s) raised page errors:`);
    for (const s of withPageErrors) console.log(`  * ${s.id} (${s.viewport}): ${s.pageErrors[0]}`);
  }
  if (withConsoleErrors.length) {
    console.log(`\n${withConsoleErrors.length} surface(s) logged console errors:`);
    for (const s of withConsoleErrors) console.log(`  * ${s.id} (${s.viewport}): ${s.consoleErrors[0]}`);
  }
  if (failed.length) {
    console.log('\nfailed to capture:');
    for (const f of failed) console.log(`  * ${f.id} (${f.viewport}): ${f.error}`);
  }
  console.log(`\nmanifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error('screenshot run crashed:', err?.message ?? err);
  process.exit(1);
});
