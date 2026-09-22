// Preview the favicon at the sizes a browser tab actually uses.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const light = readFileSync('public/favicon.svg', 'utf8');
const dark = readFileSync('public/favicon-dark.svg', 'utf8');

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 760, height: 420 } });

// A tab strip look, because that is the context a favicon is judged in — not on white.
await page.setContent(
  `<html><body style="margin:0;font:13px 'Segoe UI',sans-serif">
    <div style="display:flex;gap:0;background:#dee1e6;padding:8px 8px 0 8px">
      <div style="background:#fff;border-radius:8px 8px 0 0;padding:8px 16px;display:flex;align-items:center;gap:8px">
        <span style="width:16px;height:16px;display:inline-block">${light}</span>
        <span>NEXG App</span>
      </div>
      <div style="background:#f1f3f4;border-radius:8px 8px 0 0;padding:8px 16px;color:#5f6368">Another tab</div>
    </div>
    <div style="background:#fff;padding:28px;height:120px">
      <div style="font-size:12px;color:#666;margin-bottom:18px">Light tab strip, actual size</div>
      <div style="display:flex;align-items:flex-end;gap:32px">
        ${[16, 32, 64].map((s) => `<div style="text-align:center"><span style="width:${s}px;height:${s}px;display:inline-block">${light}</span><div style="font-size:11px;color:#888;margin-top:6px">${s}px</div></div>`).join('')}
      </div>
    </div>
    <div style="background:#202124;padding:28px;height:150px">
      <div style="font-size:12px;color:#9aa0a6;margin-bottom:18px">Dark tab strip</div>
      <div style="display:flex;align-items:flex-end;gap:32px">
        ${[16, 32, 64].map((s) => `<div style="text-align:center"><span style="width:${s}px;height:${s}px;display:inline-block">${dark}</span><div style="font-size:11px;color:#9aa0a6;margin-top:6px">${s}px</div></div>`).join('')}
      </div>
    </div>
  </body></html>`,
  { waitUntil: 'load' }
);
await page.waitForTimeout(700);
await page.screenshot({ path: 'logs/critique/favicon-preview.png' });
console.log('preview written: logs/critique/favicon-preview.png');
await b.close();
