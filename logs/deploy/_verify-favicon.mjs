// Verify the favicon is served and referenced.
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 800 } });
const page = await ctx.newPage();

const fetched = [];
page.on('response', (r) => {
  if (/favicon/i.test(r.url())) fetched.push(r.status() + '  ' + r.url().replace(BASE, '') + '  ' + (r.headers()['content-type'] || '?'));
});

await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

const links = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel*="icon"]')].map((l) => ({
    rel: l.getAttribute('rel'),
    href: l.getAttribute('href'),
    type: l.getAttribute('type'),
    media: l.getAttribute('media'),
  }))
);

// Fetch both directly to prove they are served, not just referenced.
const check = async (path) => {
  const r = await page.request.get(BASE + path);
  const body = await r.text();
  return {
    path,
    status: r.status(),
    type: r.headers()['content-type'],
    bytes: body.length,
    isSvg: body.trimStart().startsWith('<svg') || body.includes('<svg'),
    // A 200 returning the SPA shell is the failure mode that has bitten this project
    // repeatedly, so assert on content rather than status alone.
    isHtmlShell: body.includes('<!doctype html') || body.includes('id="root"'),
  };
};

console.log('=== <link> tags ===');
links.forEach((l) => console.log('  ' + JSON.stringify(l)));

console.log('\n=== served directly ===');
for (const p of ['/favicon.svg', '/favicon-dark.svg']) {
  const r = await check(p);
  console.log(
    `  ${r.path.padEnd(20)} ${r.status}  ${r.type}  ${r.bytes}B  svg=${r.isSvg}  htmlShell=${r.isHtmlShell}`
  );
}

console.log('\n=== requests the browser made for favicon files ===');
console.log(fetched.length ? fetched.map((f) => '  ' + f).join('\n') : '  (none - click the tab to trigger one)');

await b.close();
