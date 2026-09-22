// Check the FULL wordmark renders legibly at header sizes.
//
// The header previously showed the mark plus a text block spelling NEXG / APP. The request is
// to use the supplied logo instead of that text, so the wordmark has to read on its own at
// the size the header can afford.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const j = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));

const wordmark = (light) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${j.viewBox}">
  <path d="${j.letters[0]}" fill="none" stroke="${light ? '#050606' : '#ffffff'}" stroke-width="4.1689"/>
  <path d="${j.letters[1]}" fill="none" stroke="${light ? '#050606' : '#ffffff'}" stroke-width="2"/>
  <path d="${j.letters[2]}" fill="${light ? '#050606' : '#ffffff'}"/>
  <path d="${j.bellBody}" fill="${light ? '#050606' : '#ffffff'}"/>
  <path d="${j.goldX}" fill="#F8A61E" stroke="#F8A61E" stroke-width="0.8"/>
  <path d="${j.goldG}" fill="#F8A61E" stroke="#F8A61E" stroke-width="4.3262"/>
</svg>`;

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 720, height: 300 } });
const b64 = (s) => Buffer.from(s).toString('base64');

// Heights the header can realistically give a wordmark. The artwork is 361x137, so a 32px
// tall wordmark is about 84px wide — the number that decides whether it fits.
await page.setContent(
  `<body style="margin:0;font:12px sans-serif">
    <div style="background:#111315;padding:16px 20px;display:flex;align-items:center;gap:28px">
      ${[24, 28, 32, 36, 40]
        .map(
          (h) => `<div style="text-align:center">
          <img src="data:image/svg+xml;base64,${b64(wordmark(false))}" style="height:${h}px;display:block">
          <div style="color:#9aa0a6;padding-top:6px">${h}px</div>
        </div>`
        )
        .join('')}
    </div>
    <div style="background:#f4f4f5;padding:16px 20px;display:flex;align-items:center;gap:28px">
      ${[24, 28, 32, 36, 40]
        .map(
          (h) => `<div style="text-align:center">
          <img src="data:image/svg+xml;base64,${b64(wordmark(true))}" style="height:${h}px;display:block">
          <div style="color:#555;padding-top:6px">${h}px</div>
        </div>`
        )
        .join('')}
    </div>
  </body>`,
  { waitUntil: 'load' }
);
await page.waitForTimeout(500);
await page.screenshot({ path: 'logs/critique/wordmark-sizes.png' });
console.log('wordmark aspect:', (361 / 137).toFixed(2), ': 1');
console.log('widths at header heights:');
for (const h of [24, 28, 32, 36, 40]) console.log(`  ${h}px tall -> ${Math.round(h * (361 / 137))}px wide`);
console.log('wrote logs/critique/wordmark-sizes.png');
await b.close();
