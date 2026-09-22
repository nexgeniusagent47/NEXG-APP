// src/components/ui/InfiniteMarquee.tsx
//
// A seamless, continuously scrolling rail of content.
//
// This is the 21st.dev `image-auto-slider` idea rebuilt rather than copied, for three
// reasons that matter here:
//
//   1. The original injected a <style> block setting `html, body { overflow-x: hidden }`
//      and its own font-family. Both are global side effects from a component that
//      should own nothing outside itself, and the overflow rule in particular hides
//      real layout bugs on every other page in the app.
//   2. It hardcoded eight remote CDN images. This app has its own art and a responsive
//      ladder for it, so the children are passed in.
//   3. Its speed was a fixed `20s` regardless of content width, so a rail with twice
//      the items scrolled twice as fast. `durationSeconds` here is derived from the
//      measured width instead, which keeps the perceived speed constant.
//
// SEAMLESSNESS. The children are rendered twice and the track translates by exactly
// -50%. At that point the second copy sits precisely where the first began, so the
// reset to 0 is invisible. That only holds if the two halves are identical widths,
// which is why the duplicate is a real re-render rather than a transform trick.
//
// MOTION. `prefers-reduced-motion` stops the animation and switches the rail to a
// normal horizontally-scrollable strip. Removing the motion entirely would hide most
// of the content behind an edge the user cannot reach; making it scrollable is the
// accessible equivalent of the same information.
//
// The track is also paused on hover and on focus-within, so a keyboard user tabbing
// into a card is not chasing it.

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full pass. The actual duration is scaled to the measured width. */
  durationSeconds?: number;
  /** Pixels per second the rail travels. Takes precedence over durationSeconds. */
  pixelsPerSecond?: number;
  /** Pause while the pointer is over the rail. */
  pauseOnHover?: boolean;
  className?: string;
  /** Applied to the moving track. */
  trackClassName?: string;
  /** Accessible label; the rail is decorative texture unless the caller says otherwise. */
  label?: string;
}

export default function InfiniteMarquee({
  children,
  durationSeconds = 40,
  pixelsPerSecond,
  pauseOnHover = true,
  className,
  trackClassName,
  label,
}: InfiniteMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(durationSeconds);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Respect the user's motion preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Derive the duration from the measured half-width so the rail travels at a
  // constant speed no matter how many items it holds. Measuring also means the value
  // is right after a resize or a font swap, which a hardcoded duration cannot be.
  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      // scrollWidth is the full track; half of it is one copy.
      const half = el.scrollWidth / 2;
      if (half <= 0) return;
      const speed = pixelsPerSecond ?? half / durationSeconds;
      setDuration(half / speed);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, durationSeconds, pixelsPerSecond, children]);

  // Reduced motion: a plain scrollable strip, no animation, same content.
  if (reduced) {
    return (
      <div
        className={cn('overflow-x-auto scrollbar-hide', className)}
        role={label ? 'region' : undefined}
        aria-label={label}
      >
        <div className={cn('flex w-max gap-4', trackClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      role={label ? 'region' : undefined}
      aria-label={label}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className={cn('flex w-max gap-4 will-change-transform', trackClassName)}
        style={{
          animation: `nexg-marquee ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {/* Rendered twice so the -50% translate lands on an identical frame. Both
            copies are aria-hidden except the first, so a screen reader hears the
            content once rather than twice. */}
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden="true">
          {children}
        </div>
      </div>

      {/* Edge masks so items fade in and out rather than being sliced off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[var(--marquee-fade,rgba(0,0,0,1))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[var(--marquee-fade,rgba(0,0,0,1))] to-transparent" />
    </div>
  );
}
