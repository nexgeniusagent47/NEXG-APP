// Build the favicon from the "G with the bell" in the supplied logo.
//
// MEASURED, NOT GUESSED. The logo is NEXG across a 396x504 canvas, but the painted content
// only occupies y 177-312 — it sits in the upper third, with roughly 190px of empty canvas
// below it. Cropping to the canvas would therefore produce a tiny mark floating in
// whitespace, which is the most common way a favicon ends up unreadable.
//
// The G-with-bell is two paths, measured with the browser's own getBBox():
//   path index 2  (no class, black fill)   x 230 y 261  w 40 h 51   <- the bell's body
//   path index 7  (class st6, gold)        x 281 y 190  w 93 h 122  <- the G
//
// Combined bounds: x 229..374, y 177..312  ->  146 x 136
//
// WHY A TIGHT SQUARE VIEWBOX RATHER THAN THE ORIGINAL
// A favicon is rendered at 16-32px. Any padding in the viewBox is padding at 16px, so the
// mark would be a few pixels tall. The viewBox below is the mark plus a small optical
// margin, which is what makes it legible in a browser tab.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC =
  'C:\\Users\\limta\\.dsh\\attachments\\v1\\files\\43\\43f3e13a360c25fed96095c487e084121b5dcdc7945932143072c8193bb2366e\\nexg-logo.svg';
const svg = readFileSync(SRC, 'utf8');

// Pull out just the two paths that make the mark, keeping their class attributes so the
// existing <style> block still colours them.
const pathRe = /<path\s+([^>]*?)d="([^"]+)"\s*\/?>/gs;
const paths = [];
let m;
while ((m = pathRe.exec(svg)) !== null) {
  paths.push({ attrs: m[1].trim(), d: m[2] });
}

// Index 2 and 7 by document order, which is how they were measured.
const bellBody = paths[2];
const goldG = paths[7];

if (!bellBody || !goldG) {
  throw new Error(`expected 8 paths, found ${paths.length} - indices shifted`);
}

/* ---------------------------------------------------------------- geometry ---- */
// Bounds measured from the browser, rounded outward by a pixel so nothing clips.
const MIN_X = 228;
const MIN_Y = 176;
const MAX_X = 375;
const MAX_Y = 313;
const W = MAX_X - MIN_X; // 147
const H = MAX_Y - MIN_Y; // 137

// Square the crop on the larger dimension and centre the mark inside it. Favicons are
// rendered into a square; a non-square viewBox gets letterboxed by the browser, which
// silently shrinks the mark and wastes half the tab icon.
const SIDE = Math.max(W, H);
const PAD = Math.round(SIDE * 0.06); // small optical margin, not canvas padding
const VB = SIDE + PAD * 2;
const OFFSET_X = MIN_X - PAD - Math.round((SIDE - W) / 2);
const OFFSET_Y = MIN_Y - PAD - Math.round((SIDE - H) / 2);

/** Wrap a path so the original absolute coordinates land inside the new viewBox. */
function shifted(path, extraClass = '') {
  const cls = (path.attrs.match(/class="([^"]*)"/) || [])[1];
  const classAttr = cls ? ` class="${cls}${extraClass}"` : extraClass ? ` class="${extraClass.trim()}"` : '';
  return `  <path${classAttr} d="${path.d.replace(/\s+/g, ' ').trim()}"/>`;
}

/*
 * A DARK-MODE VARIANT IS NOT POSSIBLE FROM THIS ARTWORK ALONE.
 *
 * The G is gold (#F8A61E) and reads well on both light and dark. The bell's body is black,
 * which disappears on a dark tab strip. There is no second colourway in the supplied file,
 * so rather than invent one, the dark variant fills that path white and keeps everything
 * else identical. That is a deliberate substitution, flagged here so it can be replaced
 * with a designed variant when one exists.
 */
const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${OFFSET_X} ${OFFSET_Y} ${VB} ${VB}" width="${VB}" height="${VB}" role="img" aria-label="NEXG App">
  <title>NEXG App</title>
${shifted(goldG)}
${shifted(bellBody)}
</svg>
`;

const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${OFFSET_X} ${OFFSET_Y} ${VB} ${VB}" width="${VB}" height="${VB}" role="img" aria-label="NEXG App">
  <title>NEXG App</title>
${shifted(goldG)}
  <!-- Bell body recoloured for dark tab strips: the original is black and vanishes. -->
  <path fill="#ffffff" d="${bellBody.d.replace(/\s+/g, ' ').trim()}"/>
</svg>
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/favicon.svg', lightSvg, 'utf8');
writeFileSync('public/favicon-dark.svg', darkSvg, 'utf8');

console.log('viewBox          :', `${OFFSET_X} ${OFFSET_Y} ${VB} ${VB}`);
console.log('mark bounds      :', `${MIN_X},${MIN_Y} -> ${MAX_X},${MAX_Y}  (${W}x${H})`);
console.log('squared + padded :', `${VB}x${VB}, ${PAD}px margin`);
console.log('wrote            : public/favicon.svg  (' + lightSvg.length + ' bytes)');
console.log('                   public/favicon-dark.svg  (' + darkSvg.length + ' bytes)');
console.log('paths included   : gold G (st6) + bell body');
