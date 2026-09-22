// src/components/RouteFallback.tsx
//
// Shown while a lazily-loaded route chunk is being fetched.
//
// WHY THIS NO LONGER DRAWS A SKELETON
// It used to render a heading bar and six `h-32` rectangles for every route. The user's
// verdict was blunt and correct: "the loading bones are heavily inaccurate... four stupid
// rectangular bones". They were, because one generic shape was standing in for a merchant
// grid, a courier page, a property listing and an admin dashboard — it described none of
// them, and it appeared AFTER the user had already committed to the navigation, so it
// read as the product being broken rather than as it being busy.
//
// A skeleton earns its place when it matches what is arriving, closely enough that the
// swap is invisible. When it cannot, the honest thing is to show nothing: a brief empty
// region is quieter than a wrong one, and it does not have to be un-learned a moment
// later. The wait itself is addressed upstream by prefetching these chunks on idle, so
// this file is a backstop, not the normal path.
//
// WHAT REMAINS
// A single centred indicator that is deliberately small and low-contrast, plus the
// `role="status"` announcement so assistive technology is still told the page is loading.
// No fake content, no layout to shift out from under the arriving page.
//
// `min-h` is kept so the footer does not leap up and then down again — the one part of
// the old approach that was doing real work.

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface RouteFallbackProps {
  /** Passed in when the caller already has the theme, to avoid a second subscription. */
  isLight?: boolean;
}

export default function RouteFallback({ isLight: isLightProp }: RouteFallbackProps) {
  // Subscribing unconditionally keeps the hook order stable whether or not the caller
  // supplied the value; the subscription is simply unused in that case.
  const theme = useTheme();
  const isLight = isLightProp ?? theme.isLight;

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading page</span>

      {/* Three dots that breathe in sequence. Opacity only, and small enough to read as
          "working" rather than as content that failed to load. The animation is the
          existing `animate-status` token, which is opacity-only by design: Tailwind's
          `animate-pulse` also scales the element, which transforms on every frame of an
          animation that never ends. */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-1.5 rounded-full animate-status',
              isLight ? 'bg-slate-300' : 'bg-white/25'
            )}
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
