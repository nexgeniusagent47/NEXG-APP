// Convert the remaining footer logo blocks (the w-12 mark plus text) to the wordmark.
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = ['src/components/ForProperties.tsx', 'src/components/ForCouriers.tsx'];

for (const file of FILES) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  let i = 0;
  let converted = 0;

  while (i < lines.length) {
    const line = lines[i];
    // The footer variant: a w-12 mark with text beside it.
    const isFooterLogo = /<LogoIcon[^>]*w-12 h-12/.test(line);
    const window = lines.slice(i + 1, i + 6).join('\n');
    const hasTextBlock = /flex flex-col/.test(window) && /(NEXG|App|Concierge)/.test(window);

    if (!isFooterLogo || !hasTextBlock) {
      out.push(line);
      i++;
      continue;
    }

    const indent = line.match(/^\s*/)[0];
    out.push(`${indent}{/* The wordmark already spells NEXG, so no text sits beside it. */}`);
    out.push(`${indent}<LogoIcon variant="wordmark" className="h-9 w-auto" />`);

    i++;
    let depth = 0;
    let seen = false;
    while (i < lines.length) {
      const l = lines[i];
      if (/<div/.test(l)) { depth++; seen = true; }
      if (/<\/div>/.test(l)) {
        depth--;
        if (seen && depth <= 0) { i++; break; }
      }
      i++;
    }
    converted++;
  }

  writeFileSync(file, out.join('\n'), 'utf8');
  console.log(`  ${file}: ${converted} footer block(s) converted`);
}
