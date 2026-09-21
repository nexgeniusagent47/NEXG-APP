/**
 * Assessment B — browser evidence harness (throwaway).
 *
 * Run from the repo root:   node "$env:TEMP\_critique-b.mjs"
 * Writes screenshots + JSON metrics into <repoRoot>/logs/critique/.
 *
 * REQUIRES a sandbox that permits Chromium's Mojo named pipes. Under the
 * current DSH workspace-write sandbox it fails at chromium.launch() with
 * `spawn EPERM`, and Chromium itself dies with
 *   FATAL:mojo/public/cpp/platform/platform_channel.cc:108 Access is denied (0x5)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:3000';
const OUT = path.join(process.cwd(), 'logs', 'critique');
fs.mkdirSync(OUT, { recursive: true });

const report = { steps: [], checks: {} };
const shot = async (page, name) => {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  return file;
};

/* ------------------------------------------------------------- checks */

const CONTRAST_FN = `
(() => {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const parse = (s) => {
    const m = String(s).match(/rgba?\\(([^)]+)\\)/); if (!m) return null;
    const p = m[1].split(',').map((v) => parseFloat(v));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  const out = []; const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const text = n.textContent.trim();
    if (!text) continue;
    const el = n.parentElement;
    if (!el || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); if (!fg) continue;
    let bg = null, node = el, gradient = false;
    while (node && node !== document.documentElement.parentElement) {
      const s = getComputedStyle(node);
      if (s.backgroundImage && s.backgroundImage !== 'none') gradient = true;
      const c = parse(s.backgroundColor);
      if (c && c.a > 0.95) { bg = c; break; }
      node = node.parentElement;
    }
    if (!bg) bg = { rgb: [255, 255, 255], a: 1 };
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const cr = ratio(fg.rgb, bg.rgb);
    if (cr < need) out.push({
      text: text.slice(0, 70), tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 90),
      color: 'rgb(' + fg.rgb.join(',') + ')', bg: 'rgb(' + bg.rgb.join(',') + ')',
      ratio: Math.round(cr * 100) / 100, need, fontSize: size, fontWeight: weight, gradientAncestor: gradient,
    });
  }
  return out;
})()`;

const HIT_FN = `
(() => { const out = [];
  document.querySelectorAll('button, a, [role="button"], input, select, textarea').forEach((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (r.width === 0 && r.height === 0) return;
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (r.width < 40 || r.height < 40) out.push({
      tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || '',
      label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60),
      w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10,
      cls: (el.className || '').toString().slice(0, 90) });
  });
  return out; })()`;

const IMG_FN = `
(() => { const out = [];
  document.querySelectorAll('img').forEach((el) => {
    const r = el.getBoundingClientRect(); const alt = el.getAttribute('alt');
    out.push({ src: (el.currentSrc || el.src || '').slice(-70), alt, hasAlt: alt !== null,
      emptyAlt: alt === '', role: el.getAttribute('role') || '',
      ariaHidden: el.getAttribute('aria-hidden') || '',
      w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.height > 0 });
  });
  return out; })()`;

const FORM_FN = `
(() => { const out = [];
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    const id = el.id;
    const lbl = id ? document.querySelector('label[for="' + CSS.escape(id) + '"]') : null;
    const wrap = el.closest('label');
    const labelledby = el.getAttribute('aria-labelledby');
    const byId = labelledby ? document.getElementById(labelledby.split(/\\s+/)[0]) : null;
    const name = el.getAttribute('aria-label') || (lbl && lbl.textContent && lbl.textContent.trim()) ||
      (wrap && wrap.textContent && wrap.textContent.trim()) || (byId && byId.textContent && byId.textContent.trim()) || '';
    out.push({ tag: el.tagName.toLowerCase(), type: el.type || '', id: id || '',
      name: String(name).slice(0, 70), hasName: !!name,
      placeholder: el.getAttribute('placeholder') || '', required: el.hasAttribute('required') });
  });
  return out; })()`;

const HEAD_FN = `
(() => { const out = [];
  document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    out.push({ level: Number(el.tagName[1]), text: el.textContent.trim().slice(0, 70),
      visible: r.width > 0 && r.height > 0, fontSize: cs.fontSize });
  });
  return out; })()`;

const OVERFLOW_FN = `
(() => { const doc = document.documentElement; const offenders = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect(); if (r.width === 0) return;
    const pr = el.parentElement && el.parentElement.getBoundingClientRect(); if (!pr) return;
    if (r.width > pr.width + 1 && getComputedStyle(el).position !== 'fixed') offenders.push({
      tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 80),
      w: Math.round(r.width), parentW: Math.round(pr.width), delta: Math.round(r.width - pr.width) });
  });
  return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth,
    hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenderCount: offenders.length, offenders: offenders.slice(0, 40) }; })()`;

/* ------------------------------------------------------------ journey */

const browser = await chromium.launch({ headless: true });

async function step(name, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleMsgs = [], errors = [];
  page.on('console', (m) => consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 300) }));
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  const rec = { name, console: consoleMsgs, pageErrors: errors, ok: false };
  try {
    await fn(page);
    rec.ok = true; rec.url = page.url();
    rec.screenshot = await shot(page, name);
  } catch (e) {
    rec.error = String(e).slice(0, 400);
    try { rec.screenshot = await shot(page, name + '-FAILED'); } catch {}
  }
  report.steps.push(rec);
  await ctx.close();
  return rec;
}

const toDiscovery = async (p) => {
  await p.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await p.locator('#hero-search-input').first().click();
  await p.waitForSelector('#discovery-search-input', { timeout: 20000 });
};
const toMerchant = async (p) => {
  await toDiscovery(p);
  await p.locator('#discovery-search-input').fill('airport');
  await p.waitForTimeout(1500);
  await p.locator('article[role="button"]').first().click();
  await p.waitForTimeout(1200);
  await p.getByRole('button', { name: /View full profile/i }).first().click();
  await p.waitForTimeout(2500);
};

await step('01-home', async (p) => { await p.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 }); });
await step('02-discovery', async (p) => { await toDiscovery(p); });
await step('03-airport', async (p) => { await toDiscovery(p); await p.locator('#discovery-search-input').fill('airport'); await p.waitForTimeout(1500); });
await step('04-preview-sheet', async (p) => { await toDiscovery(p); await p.locator('#discovery-search-input').fill('airport'); await p.waitForTimeout(1500); await p.locator('article[role="button"]').first().click(); await p.waitForTimeout(1200); });
await step('05-merchant', async (p) => { await toMerchant(p); });
await step('06-item-modal', async (p) => { await toMerchant(p); await p.locator('ul li button').first().click(); await p.waitForTimeout(1200); });

/* --------------------------------------------------- mechanical checks */

const mctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const mp = await mctx.newPage();
await toMerchant(mp);

const merchant = {
  contrast: await mp.evaluate(CONTRAST_FN),
  hitAreas: await mp.evaluate(HIT_FN),
  images: await mp.evaluate(IMG_FN),
  formControls: await mp.evaluate(FORM_FN),
  headings: await mp.evaluate(HEAD_FN),
  overflow1440: await mp.evaluate(OVERFLOW_FN),
};
await mp.screenshot({ path: path.join(OUT, 'check-merchant-1440.png') });
await mp.setViewportSize({ width: 390, height: 844 });
await mp.waitForTimeout(800);
merchant.overflow390 = await mp.evaluate(OVERFLOW_FN);
await mp.screenshot({ path: path.join(OUT, 'check-merchant-390.png') });

await mp.setViewportSize({ width: 1440, height: 900 });
await mp.waitForTimeout(500);
await mp.locator('ul li button').first().click();
await mp.waitForTimeout(1200);

const modal = {
  contrast: await mp.evaluate(CONTRAST_FN),
  hitAreas: await mp.evaluate(HIT_FN),
  images: await mp.evaluate(IMG_FN),
  formControls: await mp.evaluate(FORM_FN),
  headings: await mp.evaluate(HEAD_FN),
  overflow1440: await mp.evaluate(OVERFLOW_FN),
};
await mp.screenshot({ path: path.join(OUT, 'check-modal-1440.png') });
await mp.setViewportSize({ width: 390, height: 844 });
await mp.waitForTimeout(800);
modal.overflow390 = await mp.evaluate(OVERFLOW_FN);
await mp.screenshot({ path: path.join(OUT, 'check-modal-390.png') });

await mp.setViewportSize({ width: 1440, height: 900 });
await mp.waitForTimeout(400);
const focusTrace = [];
for (let i = 0; i < 30; i++) {
  await mp.keyboard.press('Tab');
  await mp.waitForTimeout(120);
  const info = await mp.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: 'body', end: true };
    const cs = getComputedStyle(el);
    const outlineW = parseFloat(cs.outlineWidth) || 0;
    const hasRing = (cs.boxShadow && cs.boxShadow !== 'none') ||
      (cs.outlineStyle && cs.outlineStyle !== 'none' && outlineW > 0);
    return { tag: el.tagName.toLowerCase(),
      label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 50),
      cls: (el.className || '').toString().slice(0, 70),
      outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
      boxShadow: (cs.boxShadow || 'none').slice(0, 70),
      visibleIndicator: !!hasRing };
  });
  focusTrace.push(info);
  if (info.end) break;
}
modal.focusTrace = focusTrace;

report.checks.merchant = merchant;
report.checks.modal = modal;
fs.writeFileSync(path.join(OUT, 'assessment-b.json'), JSON.stringify(report, null, 2));
console.log('WROTE', path.join(OUT, 'assessment-b.json'));

await browser.close();
