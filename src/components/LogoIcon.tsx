// src/components/LogoIcon.tsx
//
// The NEXG artwork as inline SVG.
//
// This replaces a bitmap rendered through CSS filters. `brightness-0 contrast-200` flattened
// every pixel to black, so the supplied artwork's gold was discarded and the mark rendered
// as a silhouette. That is why the logo never matched the file that was provided.
//
// INLINE RATHER THAN AN <img>
// The N and E strokes are near-black and the dark header is near-black. As an <img> the
// artwork is a sealed document and the only way to adapt it is a filter, which is the
// mistake being corrected. Inline, the strokes inherit `currentColor`, so callers set the
// colour with the `text-*` classes they were already passing. The gold is fixed, because it
// is the brand colour and does not change between themes.
import { useTheme } from '../context/ThemeContext';

/** The whole wordmark. Source canvas is 396x504 with the artwork in the upper third. */
const VIEW_BOX = '13 176 361 137';

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
   * `mark` — the G with the bell, for slots that show the name in text alongside.
   * `wordmark` — NEXG including the mark, for standalone use.
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
      className={`shrink-0 \${className}`}
      role="img"
      aria-label="NEXG"
    >
      {!isMark && (
        <>
          {/* N and E — stroke only, no fill. */}
          <path d="M16.7,205.85H29c1.32,0,2.54,0.66,3.19,1.72l34.52,56.49c1.85,3.02,6.85,1.82,6.85-1.65v-53.19 c0-1.86,1.64-3.37,3.66-3.37h11.55c2.02,0,3.66,1.51,3.66,3.37v98.75c0,1.86-1.64,3.37-3.66,3.37H76.42c-1.32,0-2.54-0.66-3.19-1.71 l-34.47-56.3c-1.85-3.02-6.85-1.81-6.85,1.65v52.99c0,1.86-1.64,3.37-3.66,3.37H16.7c-2.02,0-3.66-1.51-3.66-3.37v-98.75 C13.04,207.35,14.68,205.85,16.7,205.85z" fill="none" stroke="currentColor" strokeWidth="4.1689" strokeMiterlimit="10" />
          <path d="M110.74,206.37h54.52c2.74,0,4.96,2.22,4.96,4.96v9.75c0,2.74-2.22,4.96-4.96,4.96h-32.21 c-2.74,0-4.96,2.22-4.96,4.96v9.18c0,2.74,2.22,4.96,4.96,4.96h32.21c2.74,0,4.96,2.22,4.96,4.96v9.4c0,2.74-2.22,4.96-4.96,4.96 h-32.21c-2.74,0-4.96,2.22-4.96,4.96v17.87c0,2.74,2.22,4.96,4.96,4.96h32.21c2.74,0,4.96,2.22,4.96,4.96v9.83 c0,2.74-2.22,4.96-4.96,4.96h-54.52c-2.74,0-4.96-2.22-4.96-4.96v-95.71C105.78,208.59,108,206.37,110.74,206.37z" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />

          {/* The X is three paths: two ink diagonals and one gold. */}
          <path d="M244.7,249.93l24.85-34.43c2.98-4.13-0.22-9.66-5.6-9.66h-8.8c-2.25,0-4.34,1.04-5.59,2.76l-20.56,28.41L240,250.09 C241.22,251.53,243.61,251.45,244.7,249.93z" fill="currentColor" />
          <path d="M268.53,311.93c1.13-0.31,1.68-1.49,1.14-2.46l-26.25-47.63c-0.42-0.7-1.49-0.74-1.97-0.08l-11.19,15.55 c-0.24,0.33-0.26,0.75-0.05,1.1l17.97,30.35c1.18,2,3.45,3.24,5.92,3.24h13.89C268.17,312,268.36,311.98,268.53,311.93 L268.53,311.93z" fill={ink} />
          <path d="M227.57,240.07l-22.84-31.63c-1-1.38-2.67-2.21-4.46-2.21h-12.09c-4.29,0-6.84,4.41-4.46,7.71l29.45,40.78 c1.2,1.67,1.2,3.84,0,5.5l-31.89,44.07c-2.38,3.29,0.17,7.71,4.46,7.71h12.23c1.79,0,3.47-0.83,4.46-2.21l25.25-34.98l0.07,0.1 l11.18-15.47c1.27-1.76,1.19-4.06-0.19-5.75l-10.99-13.38C227.7,240.23,227.63,240.15,227.57,240.07z" fill={GOLD} stroke={GOLD} strokeWidth="0.8" strokeMiterlimit="10" />
        </>
      )}

      {/* The G with the bell. This single path IS the mark. */}
      <path d="M341.7,198.16L341.7,198.16c-2.73,0.77-5.74,2-5.47,6.05c0,0.01-0.01,0.03-0.01,0.04 c-0.33,1.78,0.65,3.53,2.03,3.77c12.34,2.13,21.36,8.92,28.29,18.34c3.43,4.66,0.16,11.26-5.63,11.31l-1.59,0.01 c-1.99,0.02-3.87-0.83-5.26-2.26c-12.23-12.63-32.44-14.32-43.66-0.85c-17.31,20.79-7.67,59.27,19.7,56.15 c5.51-0.63,15.22-3.17,18.8-6.04c0.5-0.4,0.97-0.8,1.42-1.2c4.88-4.37,1.7-12.46-4.85-12.36l-7.24,0.11 c-3.93,0.06-7.15-3.08-7.19-7.01l-0.06-5.75c-0.04-3.92,3.1-7.12,7.02-7.16l29.16-0.28c3.91-0.04,7.07,3.09,7.16,7 c0.58,25.32-9.66,53.38-43.32,53.96c-49.8,0.87-64.36-59.89-34.62-89.85c9.11-9.18,19.33-13.39,30.87-14.2 c1.64-0.12,2.88-2,2.69-4.13c0-0.03,0-0.05-0.01-0.08c-0.28-2.99-0.85-4.56-5.34-5.55l0,0.05c-1.73-0.69-2.99-2.85-2.99-5.41v-0.01 c0-1.65,1.02-2.99,2.29-2.99h17.84c2.38,0,3.85,3.53,2.46,6.07C343.62,196.88,342.83,197.74,341.7,198.16z" fill={GOLD} stroke={GOLD} strokeWidth="4.3262" strokeMiterlimit="10" />
    </svg>
  );
}
