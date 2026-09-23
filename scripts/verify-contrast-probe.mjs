// scripts/_verify-contrast-probe.mjs
//
// Does the contrast probe return the right answer on inputs whose answer is known?
//
// A contrast audit that reports "no failures" is worth exactly nothing unless it is known
// to fail on something. This project has already had a detector time out on every URL,
// exit 0, and print `[]` — byte-identical to a clean scan — and 22 of those were reported
// as a pass. So the probe is tested against cases where the correct verdict is arithmetic,
// not opinion, before it is pointed at the app.
//
// TWO THINGS THIS FILE HAS ALREADY CAUGHT IN ITSELF
//   1. The probe originally ignored `background-color` alpha, so a white-on-75%-black
//      badge resolved all the way to the white page behind it and reported 1.00:1 for text
//      that really sits near 8:1. That was a real false positive on the spa page, and it
//      would have sent someone to "fix" a badge that was already correct.
//   2. Two of the compositing cases below were written with the opaque colour on `body`,
//      which the probe cannot reach through a translucent span, so the test asserted
//      against a composite it had no way to compute. The cases now carry a parent, which
//      is what a badge over a card actually looks like.

import { chromium } from 'playwright';
import { CONTRAST_PROBE } from './contrast-probe.mjs';

// [name, innerHTML, style of the PARENT, expected verdict]
const CASES = [
  ['black on white, 16px', 'color:#000;background:#fff;font-size:16px', 'PASS'],
  ['grey #767676 on white (the exact AA boundary)', 'color:#767676;background:#fff;font-size:16px', 'PASS'],
  ['grey #777777 on white (one step past it)', 'color:#777777;background:#fff;font-size:16px', 'FAIL'],
  ['white on white', 'color:#fff;background:#fff;font-size:16px', 'FAIL'],
  ['black on #111315 (the app page colour)', 'color:#000;background:#111315;font-size:16px', 'FAIL'],
  ['white on #111315', 'color:#fff;background:#111315;font-size:16px', 'PASS'],
  ['grey-400 #9ca3af on #181A1F (the documented dark floor)', 'color:#9ca3af;background:#181A1F;font-size:16px', 'PASS'],
  ['grey-500 #6b7280 on #181A1F (documented as failing)', 'color:#6b7280;background:#181A1F;font-size:16px', 'FAIL'],
  ['gold #E5B65F on #111315', 'color:#E5B65F;background:#111315;font-size:16px', 'PASS'],
  ['gold fill #B88728 AS TEXT on white (documented 3.21:1)', 'color:#B88728;background:#fff;font-size:16px', 'FAIL'],
  ['gold text #8A6413 on white (documented 5.37:1)', 'color:#8A6413;background:#fff;font-size:16px', 'PASS'],
  ['slate-950 on gold fill #B88728 (the button fix)', 'color:#0f172a;background:#B88728;font-size:16px', 'PASS'],
  ['white on gold fill #B88728 (the old button pairing)', 'color:#fff;background:#B88728;font-size:16px', 'FAIL'],
  ['3.5:1 at 25px IS large text, and passes', 'color:#949494;background:#fff;font-size:25px', 'PASS'],
  ['3.5:1 at 19px bold IS large text, and passes', 'color:#949494;background:#fff;font-size:19px;font-weight:700', 'PASS'],
  ['3.5:1 at 19px regular is NOT large text, and fails', 'color:#949494;background:#fff;font-size:19px;font-weight:400', 'FAIL'],
  ['text over a gradient is UNRESOLVED, not passed', 'color:#333;background:linear-gradient(#fff,#000);font-size:16px', 'UNRESOLVED'],
  ['text over an image is UNRESOLVED, not passed', 'color:#333;background:url(data:image/gif;base64,R0lGODlhAQABAAAAACw=);font-size:16px', 'UNRESOLVED'],
  // Compositing: the translucent layer must blend with what is behind it.
  [
    'white on a 75% black badge over a white card (composited -> PASS)',
    'color:#fff;background:rgba(0,0,0,0.75);font-size:16px',
    'PASS',
    'background:#fff',
  ],
  [
    'black on a 10% white overlay over a black card (composited -> FAIL)',
    'color:#000;background:rgba(255,255,255,0.1);font-size:16px',
    'FAIL',
    'background:#000',
  ],
  // MODERN COLOUR SYNTAX. Tailwind v4 emits oklab/oklch, and a parser that only understood
  // rgb/rgba returned null for them - which made the walk skip the layer entirely and
  // report a 75%-black badge as white-on-white. This case uses the syntax the browser
  // actually returns, so a regression in the parser fails here rather than on a real page.
  //
  // Note this is the OPACITY-BLACK case, where reading alpha alone is sufficient: black
  // composites as black in either colour space. A translucent WHITE layer is not tested in
  // oklab, because the probe deliberately reads only the alpha from oklab/oklch and does
  // NOT convert channels between colour spaces. The next case covers the white-overlay
  // arithmetic in rgb, where the numbers are exact.
  [
    'white on an oklab 75% black badge over a white card (modern syntax -> PASS)',
    'color:#fff;background:oklab(0 0 0 / 0.75);font-size:16px',
    'PASS',
    'background:#fff',
  ],
  [
    'black on an rgba 10% white overlay over a black card (composited -> FAIL)',
    'color:#000;background:rgba(255,255,255,0.1);font-size:16px',
    'FAIL',
    'background:#000',
  ],
];

// The probe is imported from the same module the audit uses, so passing here is a
// statement about the code that actually measures the app — not about a copy of it.
const PROBE = CONTRAST_PROBE;

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();

let pass = 0;
let fail = 0;

for (const [name, style, expected, parentStyle = ''] of CASES) {
  await page.setContent(
    `<!doctype html><html><body style="margin:0">` +
      `<div style="padding:20px;${parentStyle}">` +
      `<span id="t" style="${style}">Sample text here</span>` +
      `</div></body></html>`
  );
  const rows = await page.evaluate(PROBE);
  const row = rows.find((r) => r.tag === 'span');

  if (!row) {
    console.log(`FAIL  ${name}  - element not measured at all`);
    fail++;
    continue;
  }

  const need = row.fontSize >= 24 || (row.fontSize >= 18.66 && row.fontWeight >= 700) ? 3 : 4.5;
  const verdict = row.unresolved
    ? 'UNRESOLVED'
    : row.ratio < need
      ? 'FAIL'
      : 'PASS';
  const ok = verdict === expected;
  if (ok) pass++;
  else fail++;

  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name}\n` +
      `        verdict=${verdict} expected=${expected} ratio=${row.ratio ?? 'n/a'} ` +
      `fg=${row.color} bg=${row.bg ?? 'n/a'}`
  );
}

await browser.close();

console.log(`\n${pass}/${CASES.length} probe cases correct`);
if (fail) {
  console.log('The probe is not trustworthy. Do not read an audit result from it.');
  process.exit(1);
}
console.log('The probe fails what should fail and passes what should pass.');
