// Render each path of the logo IN ISOLATION, labelled, so the artwork can be identified by
// looking rather than by inferring from geometry.
//
// This is needed because two attempts to isolate "the G with the bell" produced a mark with
// a stray wedge beside it. The wedge is one of the X's strokes, and the mapping from path
// index to letter was assumed rather than checked.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const SRC =
  'C:\\Users\\limta\\.dsh\\attachments\\v1\\files\\43\\43f3e13a360c25fed96095c487e084121b5dcdc7945932143072c8193bb2366e\\nexg-logo.svg';
const svg = readFileSync(SRC, 'utf8');

const pathRe = /<path\s+([^>]*?)d="([^"]+)"\s*\/?>/gs;
const paths = [];
let m;
while ((m = pathRe.exec(svg)) !== null) {
  paths.push({
    cls: ((m[1].match(/class="([^"]*)"/) || [])[1]) || '(none)',
    d: m[2].replace(/\s+/g, ' ').trim(),
  });
}

// The style rules, so each path renders in its own intended colour.
const styleOf = {
  st1: 'fill:#F8A61E;stroke:#F8A61E;stroke-width:4.3262',
  st2: 'fill:#FDFEFE;stroke:#F8A61E;stroke-width:4.3262',
  st3: 'fill:none;stroke:#666;stroke-width:4.1689',
  st4: 'fill:none;stroke:#666;stroke-width:2',
  st5: 'fill:#F8A61E',
  st6: 'fill:#F8A61E;stroke:#F8A61E;stroke-width:0.8',
};

const cells = paths
  .map(
    (p, i) => `<div style="text-align:center">
      <svg viewBox="0 0 396 340" width="170" height="146" style="background:#fff;border:1px solid #ddd">
        <path d="${p.d}" style="${styleOf[p.cls] || 'fill:#050606'}" />
      </svg>
      <div style="font:11px monospace;color:#333;padding-top:4px">[${i}] ${p.cls}</div>
    </div>`
  )
  .join('');

// Plus the full logo for reference.
const full = `<div style="text-align:center">
    <svg viewBox="13 176 361 137" width="340" height="129" style="background:#fff;border:1px solid #ddd">
      ${paths.map((p) => `<path d="${p.d}" style="${styleOf[p.cls] || 'fill:#050606'}" />`).join('')}
    </svg>
    <div style="font:11px monospace;color:#333;padding-top:4px">ALL PATHS (reference)</div>
  </div>`;

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 780, height: 700 } });
await page.setContent(
  `<body style="margin:0;padding:16px;background:#fff;font:13px sans-serif">
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${cells}</div>
     <div style="margin-top:20px">${full}</div>
   </body>`,
  { waitUntil: 'load' }
);
await page.waitForTimeout(500);
await page.screenshot({ path: 'logs/critique/logo-paths-labelled.png', fullPage: true });
console.log('wrote logs/critique/logo-paths-labelled.png');
console.log('paths rendered:', paths.length);
await b.close();
