// Replace the "mark + text" logo blocks with the supplied wordmark, in the five NAVIGATION
// and FOOTER headers.
//
// DELIBERATELY NOT TOUCHED: the four blocks inside CourierOnboarding that head a legal
// agreement. There the mark is a seal on a document and the text beneath it reads
// "NEXG APP LIMITED", which is a company name rather than a brand label — replacing it with
// a wordmark would remove the legal entity from a contract.
import { readFileSync, writeFileSync } from 'node:fs';

const TARGETS = [
  { file: 'src/components/ForProperties.tsx', logo: "className={`w-8 h-8 sm:w-9 sm:h-9 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}", h: 'h-7' },
  { file: 'src/components/ForCouriers.tsx', logo: "className={`w-8 h-8 sm:w-9 sm:h-9 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}", h: 'h-7' },
  { file: 'src/components/ForMerchants.tsx', logo: "className={`w-8 h-8 sm:w-9 sm:h-9 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}", h: 'h-7' },
];

const MARK_BLOCK = /<LogoIcon className=\{`w-8 h-8 sm:w-9 sm:h-9 \$\{isLight \? 'text-amber-600' : 'text-amber-400'\}`\} \/>\s*<div className="flex flex-col">[\s\S]*?<\/div>\s*<\/div>/;

let changed = 0;

for (const t of TARGETS) {
  let src;
  try {
    src = readFileSync(t.file, 'utf8');
  } catch {
    console.log(`  SKIP (missing): ${t.file}`);
    continue;
  }

  const before = src;
  // Replace the whole logo + two-line text block with the wordmark alone.
  src = src.replace(
    MARK_BLOCK,
    `<LogoIcon variant="wordmark" className="${t.h} w-auto" />\n          </div>`
  );

  if (src !== before) {
    writeFileSync(t.file, src, 'utf8');
    changed++;
    console.log(`  rewrote ${t.file}`);
  } else {
    console.log(`  NO MATCH in ${t.file} - markup differs, needs a hand edit`);
  }
}

console.log(`\n${changed} of ${TARGETS.length} files rewritten`);
