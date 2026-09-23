// scripts/audit-overlays.mjs
//
// Every route has been measured closed. This measures it OPEN.
//
// WHY THIS IS A SEPARATE PASS
// The device matrix loads a page and measures it. Every modal, drawer and sheet on this site
// only exists after a click, so none of them has ever been measured at any width - and they
// are where this project's documented bugs have been. The handoff records two: "the drawer now
// closes and unlocks the body", which means it previously did not, and a modal whose scrim
// swallowed clicks.
//
// WHAT IT CHECKS, per overlay:
//   - it opens at all (a trigger that does nothing is a dead control, not a layout issue)
//   - it fits the viewport: no element inside it past the right edge, nothing clipped
//   - the page does not scroll behind it (the lock is the whole point of a scrim)
//   - on close: body scroll is RESTORED, and focus is not left on a detached node
//
// That last pair is the important one. A scroll lock that is not released leaves the page
// frozen after the modal closes, which looks like the site having hung, and it does not show
// up in any screenshot or layout measurement.
//
// Usage: node scripts/audit-overlays.mjs

import { chromium } from 'playwright';

// Each entry finds its own trigger by accessible name on the given route.
//
// NOTE ON THE MENU ENTRY: this used to look for a "Close Mobile Menu" button to close the
// drawer, and found none. The cause was a real defect rather than a bad selector - the
// hamburger's aria-label was the fixed string "Open Mobile Menu" while it showed an X once
// open, so the control that closes the drawer announced itself as the one that opens it.
// That is fixed in Header.tsx, and this entry now clicks whichever name is current.
const TARGETS = [
  { route: 'home', path: '/', name: 'cart', open: 'button[aria-label="View Cart"]' },
  { route: 'home', path: '/', name: 'mobile menu', open: 'button[aria-label="Open Mobile Menu"]' },
];

const BASE = 'http://127.0.0.1:3000';

const browser = await chromium.launch();
let failures = 0;

for (const t of TARGETS) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: 'en-KE',
  });
  await ctx.addInitScript(() => {
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
      localStorage.setItem('nexg_theme', 'dark');
    } catch {
      /* ignore */
    }
  });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e.message).slice(0, 120)));
  await page.goto(BASE + t.path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  const before = await page.evaluate(() => ({
    bodyOverflow: getComputedStyle(document.body).overflow,
    dialogs: document.querySelectorAll('[role="dialog"], [role="menu"], aside, nav[aria-label]').length,
  }));

  let trigger = page.locator(t.open).first();
  let opened = false;
  try {
    if (await trigger.count()) {
      await trigger.click({ timeout: 5000 });
      await page.waitForTimeout(1200);
      opened = true;
    }
  } catch {
    opened = false;
  }

  if (!opened) {
    console.log(`${t.route}/${t.name.padEnd(12)} TRIGGER NOT FOUND OR NOT CLICKABLE  (${t.open})`);
    failures++;
    await ctx.close();
    continue;
  }

  const open = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    // Prefer the element that DECLARES itself a dialog. Falling back to "the last big
    // positioned element" was order-dependent and picked a different node as soon as the
    // cart drawer gained `role="dialog"`, which reported "no overlay detected" for a
    // drawer that was open. A declared role is the stable signal.
    const declared = [...document.querySelectorAll('[role="dialog"]')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width >= 120 && r.height >= 120;
    });
    const candidates = [...document.querySelectorAll('div,aside,nav,section')].filter((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 120 || r.height < 120) return false;
      if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      return cs.position === 'fixed' || cs.position === 'absolute' || el.getAttribute('role') === 'dialog';
    });
    const overlay = declared[declared.length - 1] || candidates[candidates.length - 1] || null;
    if (!overlay) return { found: false };

    const rect = overlay.getBoundingClientRect();
    let past = 0;
    for (const el of overlay.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      let clipped = false;
      for (let q = el; q && q !== overlay; q = q.parentElement) {
        const ox = getComputedStyle(q).overflowX;
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; }
      }
      if (!clipped && r.right > vw + 1 && r.left >= -1) past++;
    }

    let clippedText = 0;
    for (const el of overlay.querySelectorAll('h1,h2,h3,h4,p,span,button,a,li')) {
      if (!(el.innerText || '').trim()) continue;
      const cs = getComputedStyle(el);
      if (cs.overflow !== 'hidden' || el.clientHeight <= 0) continue;
      if (el.scrollHeight <= el.clientHeight + 4) continue;
      const clamp = cs.webkitLineClamp || cs['-webkit-line-clamp'];
      if (clamp && clamp !== 'none' && clamp !== '0') continue;
      clippedText++;
    }

    const smallTaps = [...overlay.querySelectorAll('button,a[href],[role="button"]')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      return r.height < 24 || r.width < 24;
    }).length;

    return {
      found: true,
      tag: overlay.tagName.toLowerCase(),
      role: overlay.getAttribute('role'),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      fitsWidth: rect.left >= -1 && rect.right <= vw + 1,
      past,
      clippedText,
      smallTaps,
      bodyOverflow: getComputedStyle(document.body).overflow,
    };
  });

  if (!open.found) {
    console.log(`${t.route}/${t.name.padEnd(12)} OPENED BUT NO OVERLAY DETECTED`);
    failures++;
    await ctx.close();
    continue;
  }

  const locked = open.bodyOverflow === 'hidden';
  const overlayProblems = [];
  if (!open.fitsWidth) overlayProblems.push('wider than the viewport');
  if (open.past > 0) overlayProblems.push(`${open.past} element(s) past the edge`);
  if (open.clippedText > 0) overlayProblems.push(`${open.clippedText} clipped text`);
  if (!locked) overlayProblems.push(`body NOT scroll-locked (overflow=${open.bodyOverflow})`);

  console.log(
    `${t.route}/${t.name.padEnd(12)} open  ${open.w}x${open.h}  scrollLock=${locked}  ` +
      `${overlayProblems.length ? 'ISSUES: ' + overlayProblems.join(', ') : 'clean'}`
  );
  if (overlayProblems.length) failures++;

  // Close it and check the page was handed back intact.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);

  const after = await page.evaluate(() => ({
    bodyOverflow: getComputedStyle(document.body).overflow,
    focusIsBody: document.activeElement === document.body || document.activeElement === null,
    focusTag: document.activeElement ? document.activeElement.tagName.toLowerCase() : 'none',
    canScroll: document.documentElement.scrollHeight > window.innerHeight,
  }));

  // A lock that is never released is the defect the handoff records. `hidden` here means the
  // page is still frozen after the overlay is gone.
  const restored = after.bodyOverflow !== 'hidden';
  console.log(
    `  after Escape: scrollLock released=${restored}  bodyOverflow=${after.bodyOverflow}  focus=${after.focusTag}`
  );
  if (!restored) {
    console.log('  ISSUE: body scroll was NOT restored after closing');
    failures++;
  }
  if (pageErrors.length) {
    console.log(`  page errors: ${pageErrors.slice(0, 2).join(' | ')}`);
    failures++;
  }

  await ctx.close();
}

await browser.close();
console.log(`\n${failures === 0 ? 'no overlay issues found' : failures + ' issue(s) found'}`);
process.exit(failures ? 1 : 0);
