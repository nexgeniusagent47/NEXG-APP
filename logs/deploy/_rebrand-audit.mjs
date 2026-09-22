// Count and classify the "concierge" occurrences.
//
// 9,887 raw hits is a misleading number on its own: most are the English noun
// ("...concierge delivery...") inside generated catalogue copy, not the brand name. A
// rebrand that rewrites the noun would corrupt the data; one that misses the brand would
// ship a half-renamed product. This separates the two before anything is changed.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out = walk(p, out);
    else if (/\.(tsx?|json|sql|html)$/.test(e)) out.push(p);
  }
  return out;
}

const files = [...walk('src'), ...walk('server'), 'index.html', 'package.json'];

const PATTERNS = {
  // "NEXG Concierge" / "NEXG-Concierge" — the product name.
  brandNexg: /NEXG[\s-]Concierge/gi,
  // "Concierge Partner", "Villa Concierge" — constructed brand-ish strings.
  conciergeTitle: /Concierge\s+(Partner|Request|Service|Team|Collection)/g,
  // Standalone Capitalised "Concierge" as a label (button text, headings).
  conciergeWord: /\bConcierge\b/g,
  // Lowercase noun inside prose: "...and enjoy swift concierge delivery directly..."
  conciergeNoun: /\bconcierge\b/g,
};

const totals = {};
for (const k of Object.keys(PATTERNS)) totals[k] = 0;

const perFile = [];
const samples = { brandNexg: [], conciergeTitle: [] };

for (const f of files) {
  let src;
  try {
    src = readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  const row = { file: f, brandNexg: 0, conciergeTitle: 0, conciergeWord: 0, conciergeNoun: 0, total: 0 };
  let hit = false;

  for (const [key, re] of Object.entries(PATTERNS)) {
    const m = src.match(re);
    if (!m) continue;
    row[key] = m.length;
    totals[key] += m.length;
    row.total += m.length;
    hit = true;
    if (key === 'brandNexg' && samples.brandNexg.length < 6) {
      for (const mm of src.matchAll(/NEXG[\s-]Concierge/gi)) {
        samples.brandNexg.push(`${f}: ...${src.slice(Math.max(0, mm.index - 45), mm.index + 30).replace(/\s+/g, ' ')}...`);
        if (samples.brandNexg.length >= 6) break;
      }
    }
    if (key === 'conciergeTitle' && samples.conciergeTitle.length < 4) {
      samples.conciergeTitle.push(`${f}: ${m.slice(0, 3).join(' | ')}`);
    }
  }
  if (hit) perFile.push(row);
}

console.log('=== TOTALS ===');
for (const [k, v] of Object.entries(totals)) console.log(`  ${k.padEnd(16)} ${v}`);

console.log('\n=== TOP 12 FILES BY BRAND PHRASE ===');
perFile
  .filter((r) => r.brandNexg > 0)
  .sort((a, b) => b.brandNexg - a.brandNexg)
  .slice(0, 12)
  .forEach((r) => console.log(`  ${String(r.brandNexg).padStart(5)}  ${r.file}`));

console.log('\n=== BRAND PHRASE SAMPLES ===');
samples.brandNexg.forEach((s) => console.log('  ' + s.slice(0, 130)));

console.log('\n=== CONSTRUCTED BRAND STRINGS ===');
samples.conciergeTitle.forEach((s) => console.log('  ' + s.slice(0, 130)));

console.log('\n=== FILES WHERE "Concierge" IS A UI LABEL (not data) ===');
perFile
  .filter((r) => r.conciergeWord > 0 && !/seed|seededCatalog/.test(r.file))
  .sort((a, b) => b.conciergeWord - a.conciergeWord)
  .slice(0, 10)
  .forEach((r) => console.log(`  ${String(r.conciergeWord).padStart(4)}  ${r.file}`));
