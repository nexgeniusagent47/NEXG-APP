// src/components/RouteFallback.tsx
//
// Shown while a lazily-loaded route chunk is being fetched.
//
// Deliberately a skeleton of the page shape rather than a spinner: a spinner tells
// the user to wait, while a skeleton tells them what is arriving and keeps the
// layout from collapsing when it does. It reserves roughly a hero plus a grid so the
// scrollbar does not jump between the fallback and the real page — a layout shift on
// every navigation is more noticeable than the wait itself.
//
// The pulse is opacity-only. Tailwind's `animate-pulse` also scales the element,
// which transforms on every frame of an animation that never ends; `animate-status`
// is the token defined in src/index.css for exactly this.

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

  const block = cn('rounded-2xl animate-status', isLight ? 'bg-slate-200/70' : 'bg-white/[0.06]');

  return (
    <div className="min-h-[70vh] px-4 sm:px-6 lg:px-8 py-10" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>

      {/* Heading block */}
      <div className={cn(block, 'h-10 w-2/3 max-w-[420px]')} />
      <div className={cn(block, 'h-4 w-1/3 max-w-[220px] mt-3')} />

      {/* Card grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={cn(block, 'h-32')} />
        ))}
      </div>
    </div>
  );
}
