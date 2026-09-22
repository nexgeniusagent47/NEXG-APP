// Extract the real path data from the supplied logo so a React component can render it.
//
// The existing LogoIcon renders a BITMAP through CSS filters — `brightness-0 contrast-200`
// in light mode, which flattens the artwork to a silhouette and throws the gold away. That
// is why the logo never matched the file that was provided.
import { readFileSync, writeFileSync } from 'node:fs';

const SRC =
  'C:\\Users\\limta\\.dsh\\attachments\\v1\\files\\43\\43f3e13a360c25fed96095c487e084121b5dcdc7945932143072c8193bb2366e\\nexg-logo.svg';
const svg = readFileSync(SRC, 'utf8');

const pathRe = /<path\s+([^>]*?)d="([^"]+)"\s*\/?>/gs;
const found = [];
let m;
while ((m = pathRe.exec(svg)) !== null) {
  const cls = (m[1].match(/class="([^"]*)"/) || [])[1] || '';
  found.push({ cls, d: m[2].replace(/\s+/g, ' ').trim() });
}

console.log(`paths: ${found.length}`);
found.forEach((p, i) => console.log(`  [${i}] class=${p.cls || '(none)'}  len=${p.d.length}`));

// Trim to the real content bounds. The canvas is 396x504 but the artwork occupies
// y 176..313, so a viewBox of the full canvas would render the logo as a thin strip with
// ~190px of empty space beneath it — at header size that makes the mark tiny.
const VIEWBOX = '13 176 361 137';

const out = {
  viewBox: VIEWBOX,
  // Role of each path, established by measuring with getBBox:
  //   3 -> the N (stroke only)
  //   4 -> the E (stroke only)
  //   5 -> part of the X (black fill)
  //   6 -> the X's second stroke (gold fill)
  //   7 -> the G with the bell (gold, and the only multi-colour element)
  //   2 -> the bell's body, black, which is why it vanishes on a dark background
  letters: [found[3].d, found[4].d, found[5].d],
  goldX: found[6].d,
  goldG: found[7].d,
  bellBody: found[2].d,
};

writeFileSync('logs/deploy/_logo-paths.json', JSON.stringify(out, null, 1), 'utf8');
console.log(`\nviewBox trimmed to: ${VIEWBOX}`);
console.log(`  original 396x504  ->  content 361x137`);
console.log('wrote logs/deploy/_logo-paths.json');
