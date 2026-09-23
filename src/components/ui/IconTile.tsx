// src/components/ui/IconTile.tsx
//
// The square that holds an icon in the onboarding forms.
//
// WHY THIS EXISTS
// The forms had drifted into several unrelated treatments for the same visual role,
// counted across the three of them: `bg-amber-100 text-amber-800` eight times,
// `bg-rose-100`, `bg-slate-800 text-[#E5B65F]`, `bg-red-500`, `bg-slate-950` and a
// `bg-gray-50 text-gray-800` tile that appears fifty-one times in CourierOnboarding.
// Nothing was wrong with any one of them; the problem is that a reviewer cannot tell
// whether a colour is meaningful or incidental, and the answer differed per screen.
//
// One tile, one accent. The accent is `--color-gold`, which is already theme-aware:
// #b88728 on light, #e5b65f on dark. That matters more than it sounds — a hardcoded
// #E5B65F is 1.77:1 on the light surface, so the previous tiles were legible in one
// theme and not the other.
//
// COLOUR AS SIGNAL, NOT DECORATION
// `tone` allows exactly one exception, `danger`, for tiles that sit in a destructive
// context such as a failed document check. Tones are not offered for selection, success
// or information: those states are carried by the message beside the icon, and giving
// each its own tile colour is how the palette became inconsistent in the first place.

import React from 'react';
import { cn } from '../../lib/utils';

type Tone = 'brand' | 'neutral' | 'danger';

interface IconTileProps {
  /** A lucide icon element, or any single glyph. Rendered at the size below. */
  children: React.ReactNode;
  /** Defaults to `brand`. */
  tone?: Tone;
  /** `md` is the 40px tile used beside a card title; `lg` is the 48px step header. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES: Record<NonNullable<IconTileProps['size']>, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
};

/* `neutral` and `danger` use the neutral scale so they invert with the theme; only
   `brand` reaches for the gold token. */
const TONES: Record<Tone, string> = {
  brand: 'bg-gold-tint text-gold',
  neutral: 'bg-slate-100 text-slate-600',
  danger: 'bg-rose-500/12 text-rose-600 dark:text-rose-400',
};

export default function IconTile({ children, tone = 'brand', size = 'md', className }: IconTileProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center',
        SIZES[size],
        TONES[tone],
        className
      )}
      // Decorative: the tile and its glyph repeat what the adjacent heading already
      // says, so announcing them would add noise rather than information.
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
