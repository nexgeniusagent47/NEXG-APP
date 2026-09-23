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
  // MODERN COLOUR SYNTAX, RESOLVED.
  //
  // These were previously UNRESOLVED. Tailwind v4 emits oklch/oklab for most utilities, so
  // 2550 elements across the app could not be measured at all. The browser resolves them
  // exactly - but only when the canvas is used with a SENTINEL, because an unparsable value
  // leaves `fillStyle` unchanged and would otherwise inherit whatever was set before it.
  // That sentinel is implementation, so these cases pin the RESULT:
  //
  // Tailwind gray-400 (#9ca3af) on #181A1F is the ratio DESIGN.md documents as the dark-mode
  // floor at 6.86:1, and gray-500 (#6b7280) on the same surface is documented as failing at
  // 3.60:1. Both are asserted in oklch syntax here, so a pixel-resolution regression fails
  // on the palette's own numbers rather than on a number this file invented.
  [
    'gray-400 in oklch on #181A1F (modern syntax -> the documented 6.86:1, PASS)',
    'color:oklch(0.707 0.022 261.325);background:#181A1F;font-size:16px',
    'PASS',
  ],
  [
    'gray-500 in oklch on #181A1F (modern syntax -> the documented 3.60:1, FAIL)',
    'color:oklch(0.551 0.027 264.364);background:#181A1F;font-size:16px',
    'FAIL',
  ],
  [
    'black on oklch(1 0 0) over white (modern syntax resolves to white -> PASS at 21:1)',
    'color:#000;background:oklch(1 0 0);font-size:16px',
    'PASS',
  ],
  [
    'white on oklch(0.928 0.006 264.531) (resolves to gray-200 #e5e7eb -> FAIL)',
    'color:#fff;background:oklch(0.928 0.006 264.531);font-size:16px',
    'FAIL',
  ],
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

  // PLACEHOLDER TEXT.
  //
  // A placeholder is an attribute, not a text node, so the "renders its own text" filter
  // skipped every field whose only text is its placeholder. The hero search field is the
  // most prominent string on the home page and 3248 checks were not looking at it: its
  // light-mode placeholder was slate-400 on a 95%-white fill, which is 2.63:1.
  //
  // The first case also exercises the OPACITY BOUND. The field sits on a gradient, so a walk
  // that stopped at unreadable layers could not measure it at all; because the fill is 95%
  // opaque, the hidden layer can move the result by at most 5% and the check goes ahead —
  // conservatively, using the worse of a white and a black base.
  {
    name: 'placeholder slate-400 #94a3b8 at 12px on a 95% white field over a gradient (the light hero field as it was -> FAIL)',
    expected: 'FAIL',
    selector: 'input',
    pageStyle: 'input::placeholder{color:#94a3b8}',
    extra:
      '<div style="width:360px;background:linear-gradient(#fff,#000);padding:10px">' +
      '<input id="t" placeholder="Search dining, spa, rides" ' +
      'style="width:330px;border:0;font-size:12px;background:rgba(255,255,255,0.95)"></div>',
  },
  {
    // The colour this case pins is the one the field actually ships. slate-500 (#64748b) was
    // the first choice and it is NOT enough: 4.76:1 against pure white, but 4.26:1 against the
    // worst backdrop the 5% transparency allows, and 4.5:1 is the requirement. The bound is
    // what caught that, which is the whole reason it is resolved conservatively.
    name: 'placeholder slate-600 #475569 at 12px on the same field (the fix -> PASS at 6.66:1 worst case)',
    expected: 'PASS',
    pageStyle: 'input::placeholder{color:#475569}',
    extra:
      '<div style="width:360px;background:linear-gradient(#fff,#000);padding:10px">' +
      '<input id="t" placeholder="Search dining, spa, rides" ' +
      'style="width:330px;border:0;font-size:12px;background:rgba(255,255,255,0.95)"></div>',
  },
  {
    name: 'placeholder on a 50%-opaque field over a gradient is UNRESOLVED, not guessed',
    expected: 'UNRESOLVED',
    selector: 'input',
    pageStyle: 'input::placeholder{color:#94a3b8}',
    extra:
      '<div style="width:360px;background:linear-gradient(#fff,#000);padding:10px">' +
      '<input id="t" placeholder="Search dining, spa, rides" ' +
      'style="width:330px;border:0;font-size:12px;background:rgba(255,255,255,0.5)"></div>',
  },
  {
    name: 'white on a 95% black field over an IMG is measured, not reported as over-image',
    expected: 'PASS',
    selector: 'span',
    extra:
      '<div style="position:relative;width:300px">' +
      '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACw=" ' +
      'style="position:absolute;inset:0;width:300px;height:60px">' +
      '<span id="t" style="position:relative;color:#fff;background:rgba(0,0,0,0.95);font-size:16px">Sample text here</span></div>',
  },
  {
    name: 'an input with no placeholder and no text is not measured (control)',
    expected: 'ABSENT',
    selector: 'input',
    extra: '<input id="t" style="width:200px;font-size:12px;background:#fff">',
  },
];

// The probe is imported from the same module the audit uses, so passing here is a
// statement about the code that actually measures the app — not about a copy of it.
const PROBE = CONTRAST_PROBE;

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();

let pass = 0;
let fail = 0;

for (const raw of CASES) {
  // Two shapes: the original positional tuple, and an object for cases that need their own
  // markup (a placeholder needs a <style> rule, which cannot be set inline).
  const c = Array.isArray(raw)
    ? {
        name: raw[0],
        style: raw[1],
        expected: raw[2],
        parentStyle: raw[3] ?? '',
        selector: 'span',
        pageStyle: '',
        extra: '',
      }
    : { parentStyle: '', selector: 'span', pageStyle: '', extra: '', ...raw };

  await page.setContent(
    `<!doctype html><html><head><style>${c.pageStyle}</style></head><body style="margin:0">` +
      `<div style="padding:20px;${c.parentStyle}">` +
      // A positional case is always the default span. An object case brings its own markup,
      // which must carry id="t" so the row can be picked out unambiguously.
      (c.style === undefined ? '' : `<span id="t" style="${c.style}">Sample text here</span>`) +
      c.extra +
      `</div></body></html>`
  );
  const rows = await page.evaluate(PROBE);
  // Picked by id, not by tag: an early version selected the first <span> and silently
  // measured the default element instead of the fixture, which reported 21:1 for a case
  // whose real answer was white on a 95% black field.
  const row = rows.find((r) => r.id === 't');

  if (!row) {
    const ok = c.expected === 'ABSENT';
    if (ok) pass++;
    else fail++;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${c.name}\n        element not measured at all (expected ${c.expected})`
    );
    continue;
  }

  if (c.expected === 'ABSENT') {
    fail++;
    console.log(`FAIL  ${c.name}\n        expected NOT to be measured, but a <${c.selector}> row was returned`);
    continue;
  }

  const need = row.fontSize >= 24 || (row.fontSize >= 18.66 && row.fontWeight >= 700) ? 3 : 4.5;
  const verdict = row.unresolved
    ? 'UNRESOLVED'
    : row.ratio < need
      ? 'FAIL'
      : 'PASS';
  const ok = verdict === c.expected;
  if (ok) pass++;
  else fail++;

  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${c.name}\n` +
      `        verdict=${verdict} expected=${c.expected} ratio=${row.ratio ?? 'n/a'} ` +
      `${row.ratioBest === undefined ? '' : `best=${row.ratioBest} bound=${row.boundedBy} `}` +
      `fg=${row.color} bg=${row.bg ?? 'n/a'}${row.placeholder ? ' [placeholder]' : ''}`
  );
}

await browser.close();

console.log(`\n${pass}/${CASES.length} probe cases correct`);
if (fail) {
  console.log('The probe is not trustworthy. Do not read an audit result from it.');
  process.exit(1);
}
console.log('The probe fails what should fail and passes what should pass.');
