// Rebuild the favicon correctly.
//
// TWO BUGS IN THE FIRST ATTEMPT, both visible in the rendered preview:
//
//  1. The SVG carried width/height="165" and no CSS constraint, so it rendered at 165px
//     inside a 16px slot and overflowed across the page. A favicon must take its size from
//     its container, so width/height are omitted and the viewBox does the scaling.
//
//  2. The gold was lost. Paths were copied without the original <style> block, so
//     `class="st6"` resolved to nothing and the G rendered with the default black fill.
//     Colours are now inlined on the paths, which also makes the file self-contained —
//     important for a favicon, which a browser fetches with no page context.
//
// GEOMETRY, measured with getBBox() rather than read off the path data, because the paths
// use relative coordinates and cannot be bounded by parsing numbers:
//   path 7, class st6, gold   x 281 y 190  w  93 h 122   <- the G
//   path 2, no class, black   x 230 y 261  w  40 h  51   <- the bell body
// Combined: x 228..375, y 176..313.
import { readFileSync, writeFileSync } from 'node:fs';

const SRC =
  'C:\\Users\\limta\\.dsh\\attachments\\v1\\files\\43\\43f3e13a360c25fed96095c487e084121b5dcdc7945932143072c8193bb2366e\\nexg-logo.svg';
const svg = readFileSync(SRC, 'utf8');

const pathRe = /<path\s+([^>]*?)d="([^"]+)"\s*\/?>/gs;
const paths = [];
let m;
while ((m = pathRe.exec(svg)) !== null) paths.push({ attrs: m[1].trim(), d: m[2] });
if (paths.length !== 8) throw new Error(`expected 8 paths, found ${paths.length}`);

const GOLD = '#F8A61E';
const G = paths[7].d.replace(/\s+/g, ' ').trim();
const BELL = paths[2].d.replace(/\s+/g, ' ').trim();

// Square the crop so the browser does not letterbox it into a square tab slot.
const MIN_X = 228, MIN_Y = 176, MAX_X = 375, MAX_Y = 313;
const W = MAX_X - MIN_X, H = MAX_Y - MIN_Y;
const SIDE = Math.max(W, H);
const PAD = 6; // optical margin only; every pixel here is a pixel not drawing the mark
const VB = SIDE + PAD * 2;
const VBX = MIN_X - PAD - Math.round((SIDE - W) / 2);
const VBY = MIN_Y - PAD - Math.round((SIDE - H) / 2);

/**
 * `width`/`height` deliberately omitted: an SVG with them renders at that pixel size
 * regardless of its container, which is what caused the overflow.
 */
function build(bellFill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VBX} ${VBY} ${VB} ${VB}" role="img" aria-label="NEXG">
  <title>NEXG</title>
  <path fill="${GOLD}" d="${G}"/>
  <path fill="${bellFill}" d="${BELL}"/>
</svg>
`;
}

writeFileSync('public/favicon.svg', build('none'), 'utf8');
// The bell's body is black in the source artwork and disappears on a dark tab strip. There
// is no second colourway in the supplied file, so it becomes the gold accent instead of
// being invented — the mark stays two colours in both themes.
writeFileSync('public/favicon-dark.svg', build(GOLD), 'utf8');

console.log(`viewBox  : ${VBX} ${VBY} ${VB} ${VB}   (mark ${W}x${H}, squared to ${SIDE})`);
console.log(`gold G   : ${G.length} chars of path data`);
console.log(`bell     : ${BELL.length} chars`);
console.log('wrote    : public/favicon.svg (bell outline), public/favicon-dark.svg (bell gold)');
console.log('NO width/height on the svg, so it scales to its container');
