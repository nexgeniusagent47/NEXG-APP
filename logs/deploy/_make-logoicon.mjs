// Generate src/components/LogoIcon.tsx from the supplied logo artwork.
//
// THE PROBLEM THIS REPLACES
// LogoIcon rendered a BITMAP — `NEXG LOGO.png` — through CSS filters:
//   light mode:  brightness-0 contrast-200 opacity-90
//   dark mode:   drop-shadow only
// `brightness-0` flattens every pixel to black, so the supplied artwork's gold was thrown
// away and the mark rendered as a silhouette. That is why the logo on the site never
// matched the file that was provided. The user gave an SVG; nothing was using it.
//
// COLOURS, from measuring each path with getBBox() against the rendered artwork:
//   paths 3 and 4  the N and the E   stroke only, black
//   path  5        part of the X     black fill
//   path  6        the X's stroke    gold  #F8A61E
//   path  7        the G with bell   gold  #F8A61E
//   path  2        the bell's body   black
//
// THE DARK-MODE DECISION
// Two elements are pure black: the N/E strokes and the bell's body. On the dark header they
// would vanish. There is no second colourway in the supplied file, so dark mode renders
// them in the foreground text colour (which the callers already set via `text-*` classes,
// and which was previously being consumed by a filter that did nothing useful with it).
// The gold is identical in both themes — it is the brand mark and it is legible on both.
import { readFileSync, writeFileSync } from 'node:fs';

const p = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));

const component = `// src/components/LogoIcon.tsx
//
// The NEXG wordmark, rendered from the supplied SVG artwork.
//
// This replaces a bitmap run through CSS filters. \`brightness-0 contrast-200\` flattened
// every pixel to black, so the artwork's gold was discarded and the mark rendered as a
// silhouette — which is why the logo never matched the provided file.
//
// INLINE SVG RATHER THAN AN <img>
// The letters are near-black and the dark header is near-black. As an <img> the artwork is
// a sealed document and the only way to adapt it is a filter, which is exactly the mistake
// being corrected. Inline, the strokes inherit \`currentColor\`, so callers set the colour
// with the \`text-*\` classes they were already passing.
//
// The gold is hard-coded because it is the brand colour and does not change between themes.
import { useTheme } from '../context/ThemeContext';

/** Cropped to the artwork. The source canvas is 396x504 with the logo in the upper third. */
const VIEW_BOX = '${p.viewBox}';

export default function LogoIcon({ className = 'w-10 h-10' }: { className?: string }) {
  const { isLight } = useTheme();

  return (
    <svg
      viewBox={VIEW_BOX}
      // \`preserveAspectRatio\` default (xMidYMid meet) is correct here: the artwork is wider
      // than it is tall, so a square slot letterboxes it rather than distorting it.
      className={\`shrink-0 \${className}\`}
      role="img"
      aria-label="NEXG"
    >
      {/* N and E — stroke only, no fill. Inherit currentColor so they read on both themes. */}
      <path
        d="${p.letters[0]}"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.1689"
        strokeMiterlimit="10"
      />
      <path
        d="${p.letters[1]}"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
      />

      {/* The X: one black stroke and one gold. */}
      <path d="${p.letters[2]}" fill="currentColor" />
      <path d="${p.goldX}" fill="#F8A61E" stroke="#F8A61E" strokeWidth="0.8" strokeMiterlimit="10" />

      {/* The G with the bell — the mark. Gold in both themes. */}
      <path d="${p.goldG}" fill="#F8A61E" stroke="#F8A61E" strokeWidth="4.3262" strokeMiterlimit="10" />

      {/*
        The bell's body. Black in the source artwork, so it disappears on the dark header.
        It follows currentColor instead: on light it stays the intended near-black, on dark
        it lifts to whatever the caller set. No colour is invented.
      */}
      <path
        d="${p.bellBody}"
        fill={isLight ? '#050606' : 'currentColor'}
      />
    </svg>
  );
}
`;

writeFileSync('src/components/LogoIcon.tsx', component, 'utf8');
console.log('wrote src/components/LogoIcon.tsx');
console.log(`  viewBox: ${p.viewBox}`);
console.log(`  paths: N, E, X(both), G+bell, bell body  (6 elements)`);
console.log(`  bytes: ${component.length}`);
