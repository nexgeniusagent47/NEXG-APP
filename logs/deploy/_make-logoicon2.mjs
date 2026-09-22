// Regenerate LogoIcon.tsx with the CORRECT path roles.
//
// WHAT WAS WRONG
// Path indices were assumed from geometry instead of being identified. Rendering each path in
// isolation showed what they actually are:
//
//   [3] st3   the N
//   [4] st4   the E
//   [2] black one diagonal of the X   <- previously mistaken for "the bell's body"
//   [5] black the other diagonal of the X
//   [6] st5   the gold diagonal of the X
//   [7] st6   THE G WITH THE BELL     <- the complete mark; the bell is part of this path
//
// Including path 2 in the mark put a stray black wedge beside the G, which rendered white on
// the dark header and looked like a rendering fault.
import { readFileSync, writeFileSync } from 'node:fs';

const j = JSON.parse(readFileSync('logs/deploy/_logo-paths.json', 'utf8'));

const file = `// src/components/LogoIcon.tsx
//
// The NEXG artwork as inline SVG.
//
// This replaces a bitmap rendered through CSS filters. \\\`brightness-0 contrast-200\\\` flattened
// every pixel to black, so the supplied artwork's gold was discarded and the mark rendered
// as a silhouette. That is why the logo never matched the file that was provided.
//
// INLINE RATHER THAN AN <img>
// The N and E strokes are near-black and the dark header is near-black. As an <img> the
// artwork is a sealed document and the only way to adapt it is a filter, which is the
// mistake being corrected. Inline, the strokes inherit \\\`currentColor\\\`, so callers set the
// colour with the \\\`text-*\\\` classes they were already passing. The gold is fixed, because it
// is the brand colour and does not change between themes.
import { useTheme } from '../context/ThemeContext';

/** The whole wordmark. Source canvas is 396x504 with the artwork in the upper third. */
const VIEW_BOX = '${j.viewBox}';

/**
 * The mark alone: the gold G with the bell sitting on it.
 *
 * 97.6 wide by 126.5 tall, so squaring it pads the sides rather than cropping — a wider crop
 * would slice the bell. Derived by measuring the G path's painted extent, not by reading
 * coordinates out of the path data, which uses relative commands and cannot be bounded by
 * parsing numbers.
 */
const MARK_VIEW_BOX = '258 181 139 139';

const GOLD = '#F8A61E';

export default function LogoIcon({
  className = 'w-10 h-10',
  variant = 'mark',
}: {
  className?: string;
  /**
   * \\\`mark\\\` — the G with the bell, for slots that show the name in text alongside.
   * \\\`wordmark\\\` — NEXG including the mark, for standalone use.
   */
  variant?: 'mark' | 'wordmark';
}) {
  const { isLight } = useTheme();
  const isMark = variant === 'mark';

  // The letters are near-black and would vanish on the dark header, so they follow
  // currentColor, which the call sites already set.
  const ink = isLight ? '#050606' : 'currentColor';

  return (
    <svg
      viewBox={isMark ? MARK_VIEW_BOX : VIEW_BOX}
      className={\\\`shrink-0 \\\${className}\\\`}
      role="img"
      aria-label="NEXG"
    >
      {!isMark && (
        <>
          {/* N and E — stroke only, no fill. */}
          <path d="${j.letters[0]}" fill="none" stroke="currentColor" strokeWidth="4.1689" strokeMiterlimit="10" />
          <path d="${j.letters[1]}" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />

          {/* The X is three paths: two ink diagonals and one gold. */}
          <path d="${j.letters[2]}" fill="currentColor" />
          <path d="${j.bellBody}" fill={ink} />
          <path d="${j.goldX}" fill={GOLD} stroke={GOLD} strokeWidth="0.8" strokeMiterlimit="10" />
        </>
      )}

      {/* The G with the bell. This single path IS the mark. */}
      <path d="${j.goldG}" fill={GOLD} stroke={GOLD} strokeWidth="4.3262" strokeMiterlimit="10" />
    </svg>
  );
}
`;

writeFileSync('src/components/LogoIcon.tsx', file, 'utf8');
console.log('rewrote src/components/LogoIcon.tsx');
console.log('  mark     : G path only, viewBox', '258 181 139 139');
console.log('  wordmark : N + E + 3 X paths + G, viewBox', j.viewBox);
console.log('  dropped  : the stray X diagonal, which is now correctly grouped with the X');
