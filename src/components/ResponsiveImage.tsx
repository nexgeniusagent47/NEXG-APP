// src/components/ResponsiveImage.tsx
//
// A drop-in <img> that lets the browser choose which file to download.
//
// The build produces a ladder of widths per image plus a tiny inline placeholder
// (scripts/build-image-ladder.mjs). This component turns that into `srcset` and
// `sizes`, which is the part that makes large delivery products look sharp AND load
// fast: the browser reads `sizes` to work out the CSS width the image will occupy,
// multiplies by the device pixel ratio, and fetches the smallest candidate that
// covers it. A phone never downloads the 1920px file; a retina desktop never
// receives the 320px one.
//
// `sizes` is the piece most implementations get wrong — omitting it makes the browser
// assume the image is full-viewport-width and pick a far larger file than needed. The
// callers below therefore pass a real size hint.
//
// The placeholder is a ~350-byte WebP data URI used as the background colour behind
// the image. It paints immediately with the image's true tones (no grey box), then
// the real file fades in over it, and it disappears entirely once loaded so it can
// never tint a transparent image.

import React, { useState } from 'react';
import { cn } from '../lib/utils';
import manifest from '../assets/images/optimised/manifest.json';

/**
 * Where the ladder is served from.
 *
 * The variants live in `public/` and are addressed by absolute URL rather than
 * imported. Importing them would be wrong here: the manifest is consulted at RUNTIME
 * to build `srcset` strings, and a runtime string is invisible to the bundler, so
 * imported variants were never emitted — the build produced zero WebP files and every
 * image silently 404'd.
 *
 * The trade-off is no content hash in the filename, so a rebuilt variant is not
 * cache-busted by its URL. `LADDER_VERSION` covers that: bump it whenever the ladder
 * is regenerated and every client refetches.
 */
const LADDER_VERSION = '1';
const DIR = '/images/';
const v = (file: string) => `${DIR}${file}?v=${LADDER_VERSION}`;

type ManifestEntry = { width: number; src: string; srcSet: string; lqip: string };
const MANIFEST = manifest as Record<string, ManifestEntry>;

/** Resolve an original filename to its built ladder. */
export function imageLadder(original: string): ManifestEntry | undefined {
  return MANIFEST[original];
}

/**
 * `srcset`/`sizes` for an image, resolved without a component.
 *
 * Some call sites need the attributes on their own `<img>` — because they pass
 * handlers, refs or a `style` object the component does not model — rather than the
 * component itself. Returning the raw attributes keeps those usable instead of
 * forcing every one of them through the component.
 *
 * Returns `null` for a name the optimiser never saw, so a caller can fall back
 * explicitly rather than silently rendering an empty `src`.
 */
export function responsiveProps(
  name: string,
  sizes: string
): { src: string; srcSet: string; sizes: string } | null {
  const l = MANIFEST[name];
  if (!l) return null;
  return {
    src: v(l.src),
    srcSet: l.srcSet
      .split(', ')
      .map((entry) => {
        const [file, w] = entry.split(' ');
        return `${v(file)} ${w}`;
      })
      .join(', '),
    sizes,
  };
}

interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** The ORIGINAL filename, e.g. "hero_daylight_resort_1789914085669.jpg". */
  name: string;
  /** CSS length the image occupies, e.g. "100vw" or "(min-width: 1024px) 50vw, 100vw". */
  sizes: string;
  /** Rendered by the caller when the name is not in the manifest, so a missing image is visible rather than blank. */
  fallbackSrc?: string;
  /** Skip the fade when the image is above the fold and should paint with the page. */
  priority?: boolean;
}

export default function ResponsiveImage({
  name,
  sizes,
  className,
  fallbackSrc,
  priority = false,
  alt = '',
  ...rest
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ladder = MANIFEST[name];

  // An unknown name means the optimiser never saw this file. Render whatever the
  // caller supplied rather than an empty src, and leave a marker so it is findable.
  if (!ladder) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        data-image-missing={name}
        {...rest}
      />
    );
  }

  return (
    <img
      src={v(ladder.src)}
      srcSet={ladder.srcSet
        .split(', ')
        .map((entry) => {
          const [file, w] = entry.split(' ');
          return `${v(file)} ${w}`;
        })
        .join(', ')}
      sizes={sizes}
      alt={alt}
      // Above-the-fold art must not be lazy, or it arrives a frame late and the page
      // visibly fills in.
      loading={priority ? 'eager' : 'lazy'}
      // `async` for above-the-fold art so decoding does not block the first paint.
      decoding={priority ? 'async' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      className={cn('transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', className)}
      style={{
        // The placeholder only shows until the real image paints. Once it has, the
        // background is removed so it cannot bleed through transparent pixels.
        backgroundImage: loaded ? undefined : `url(${ladder.lqip})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...rest.style,
      }}
      {...rest}
    />
  );
}

/** The ladder for one image, for callers that need `srcset` on a custom element. */
export function ladderFor(name: string) {
  const l = MANIFEST[name];
  if (!l) return null;
  return {
    src: v(l.src),
    srcSet: l.srcSet
      .split(', ')
      .map((e) => {
        const [file, w] = e.split(' ');
        return `${v(file)} ${w}`;
      })
      .join(', '),
    lqip: l.lqip,
  };
}
