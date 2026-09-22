// What does /NEXG[\s-]Concierge/i ACTUALLY match in the big data files?
// The UI hits are confirmed and sensible; the 9,300 from seed data need proving before
// anyone rewrites them.
import { readFileSync } from 'node:fs';

for (const f of ['src/db/seed_excel.sql', 'src/data/seededCatalog.json']) {
  const src = readFileSync(f, 'utf8');
  const re = /NEXG[\s-]Concierge/gi;
  const found = [...src.matchAll(re)];
  console.log(`\n=== ${f} ===`);
  console.log(`  matches: ${found.length}`);

  const distinct = new Map();
  for (const m of found) distinct.set(m[0], (distinct.get(m[0]) || 0) + 1);
  console.log('  distinct matched strings:');
  for (const [k, v] of [...distinct.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)) {
    console.log(`    ${JSON.stringify(k)}  x${v}`);
  }

  // Context around the first few, read directly rather than with offset arithmetic.
  console.log('  first 3 with real context:');
  found.slice(0, 3).forEach((m, i) => {
    const start = Math.max(0, m.index - 60);
    const ctx = src.slice(start, m.index + m[0].length + 40).replace(/\s+/g, ' ');
    console.log(`    [${i}] ...${ctx}...`);
  });
}
