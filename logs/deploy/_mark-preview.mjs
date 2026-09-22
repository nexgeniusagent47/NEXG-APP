// Render the mark alone, large, on the real header background so the artwork can be judged
// rather than inferred from numbers.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const src = readFileSync('src/components/LogoIcon.tsx', 'utf8');
const j = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));
const vb = src.match(/MARK_VIEW_BOX = '([^']+)'/)[1];

const build = (bellFill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="180" height="180">
  <path fill="#F8A61E" stroke="#F8A61E" stroke-width="4.3262" d="${j.goldG}"/>
  <path fill="${bellFill}" d="${j.bellBody}"/>
</svg>`;

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 640, height: 260 } });
const b64 = (s) => Buffer.from(s).toString('base64');

await page.setContent(
  `<body style="margin:0;background:#111315;display:flex;align-items:center;justify-content:center;gap:40px;height:260px">
     <div style="text-align:center">
       <img src="data:image/svg+xml;base64,${b64(build('#ffffff'))}" width="180" height="180">
       <div style="color:#9aa0a6;font:11px sans-serif">dark theme (bell white)</div>
     </div>
     <div style="text-align:center;background:#f4f4f5;padding:8px">
       <img src="data:image/svg+xml;base64,${b64(build('#050606'))}" width="180" height="180">
       <div style="color:#555;font:11px sans-serif">light theme (bell ink)</div>
     </div>
   </body>`,
  { waitUntil: 'load' }
);
await page.waitForTimeout(500);
await page.screenshot({ path: 'logs/critique/mark-large.png' });
console.log('viewBox used:', vb);
console.log('wrote logs/critique/mark-large.png');
await b.close();
