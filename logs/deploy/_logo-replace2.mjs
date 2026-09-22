// Replace "mark + two-line text" logo blocks with the wordmark, working LINE BY LINE.
//
// A regex over JSX spanning multiple lines with interpolated class strings proved fragile: it
// matched nothing in three files and reported success at doing so. A line-based edit that
// locates the <LogoIcon> line and then consumes the following wrapper plus its two spans is
// easier to verify and fails loudly when the shape is not what was expected.
//
// NOT TOUCHED: the four blocks in CourierOnboarding that head a legal agreement, where the
// mark is a seal and the text is the company name "NEXG APP LIMITED".
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'src/components/ForProperties.tsx',
  'src/components/ForCouriers.tsx',
  'src/components/ForMerchants.tsx',
];

const HEIGHT = 'h-7';

for (const file of FILES) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  let i = 0;
  let converted = 0;
  let skipped = 0;

  while (i < lines.length) {
    const line = lines[i];

    // A header logo: sized w-8/h-8 with the amber accent, followed by a text block.
    const isNavLogo = /<LogoIcon[^>]*w-8 h-8/.test(line);

    if (!isNavLogo) {
      out.push(line);
      i++;
      continue;
    }

    // Look ahead for the shape we expect: a flex-col wrapper and at least one span holding
    // the brand name. If it is not there, leave the block alone rather than guessing.
    const window = lines.slice(i + 1, i + 8).join('\n');
    const hasTextBlock = /flex flex-col/.test(window) && /(NEXG|App|Concierge)/.test(window);

    if (!hasTextBlock) {
      out.push(line);
      i++;
      skipped++;
      continue;
    }

    const indent = line.match(/^\s*/)[0];
    out.push(`${indent}{/* The wordmark already spells NEXG, so no text sits beside it. */}`);
    out.push(`${indent}<LogoIcon variant="wordmark" className="${HEIGHT} w-auto" />`);

    // Skip the wrapper div and everything inside it, up to its closing tag on its own line.
    i++;
    let depth = 0;
    let seenWrapper = false;
    while (i < lines.length) {
      const l = lines[i];
      if (/<div/.test(l)) {
        depth++;
        seenWrapper = true;
      }
      if (/<\/div>/.test(l)) {
        depth--;
        if (seenWrapper && depth <= 0) {
          i++;
          break;
        }
      }
      i++;
    }
    converted++;
  }

  if (converted) {
    writeFileSync(file, out.join('\n'), 'utf8');
    console.log(`  ${file}: ${converted} block(s) converted`);
  } else {
    console.log(`  ${file}: nothing converted`);
  }
  if (skipped) console.log(`     (${skipped} logo(s) left as marks)`);
}
