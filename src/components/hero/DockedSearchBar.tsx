// src/components/hero/DockedSearchBar.tsx
//
// The hero search bar, re-appearing docked to the top of the viewport once the hero's own
// search has scrolled away — the Glovo behaviour.
//
// WHY IT IS A SECOND BAR RATHER THAN THE SAME ONE MOVING
// Moving one element between two positions means measuring both, animating between them,
// and keeping the measurement correct through every resize and font swap. A second bar
// that fades in is a fraction of the code, cannot desynchronise, and is what the reference
// product actually does: the hero bar scrolls away with the hero, and an independent
// sticky bar arrives.
//
// THE SAME STATE DRIVES BOTH. `value` and `onChange` are owned by the parent, so typing in
// one is instantly reflected in the other if both are ever on screen. A duplicated
// `useState` here would give the user two searches that disagree.
//
// MOTION IS REACT-SPRING, NOT CSS. This is a gesture-adjacent transition that can be
// interrupted mid-flight by scrolling back up, and react-spring carries the current
// position and velocity into the reversal rather than restarting from a fixed value. The
// project keeps one animation library per subtree (see docs/ANIMATION.md); this component
// uses react-spring and no Motion, and the rest of the hero is the reverse.
//
// The trigger is an IntersectionObserver on the hero's search, not a scroll listener.
// A scroll handler runs on every frame and would put layout reads in the scroll path; the
// observer fires only on the crossing.

import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

interface DockedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onOpenCategories?: (query: string) => void;
  /** The inline search whose disappearance reveals this one. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Accessible name for the docked input; the inline placeholder is very long. */
  placeholder: string;
}

export default function DockedSearchBar({
  value,
  onChange,
  onSubmit,
  onOpenCategories,
  anchorRef,
  placeholder,
}: DockedSearchBarProps) {
  const { isLight } = useTheme();
  const { t } = useLanguage();
  const [docked, setDocked] = useState(false);

  // Reduced motion is honoured at the source: the bar still appears, it simply does not
  // travel. Removing the animation entirely would hide the control from anyone who has
  // asked for less movement, which is not what that preference means.
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDocked(!entry.isIntersecting),
      {
        // A zero-height band at the top of the viewport. The bar appears only once the
        // hero search is fully past the header, so the two never overlap visually.
        rootMargin: '-72px 0px 0px 0px',
        threshold: 0,
      }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchorRef]);

  const style = useSpring({
    transform: docked ? 'translateY(0%)' : 'translateY(-115%)',
    opacity: docked ? 1 : 0,
    config: prefersReduced
      ? { duration: 0 }
      : { tension: 320, friction: 34, clamp: false },
  });

  return (
    // `pointer-events-none` while hidden: a bar parked above the viewport can still
    // intercept clicks aimed at the header beneath it otherwise.
    <animated.div
      style={style}
      aria-hidden={!docked}
      className={cn(
        'fixed inset-x-0 top-0 z-[60] border-b backdrop-blur-2xl',
        docked ? 'pointer-events-auto' : 'pointer-events-none',
        isLight
          ? 'bg-white/90 border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
          : 'bg-[#111315]/90 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="relative mx-auto max-w-2xl"
        >
          <Search
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none',
              isLight ? 'text-slate-400' : 'text-gray-400'
            )}
            size={18}
          />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={() => onOpenCategories?.(value)}
            placeholder={placeholder}
            // Focusable only once it is on screen, so it stays out of the tab order while
            // parked above the viewport.
            tabIndex={docked ? 0 : -1}
            className={cn(
              'w-full pl-11 pr-28 py-2.5 rounded-xl text-xs sm:text-sm font-semibold outline-none transition',
              isLight
                ? 'bg-slate-50 text-slate-900 border border-slate-200 placeholder:text-slate-400 focus:border-[#B88728] focus:ring-4 focus:ring-[#B88728]/12'
                : 'bg-white/[0.06] text-white border border-white/12 placeholder:text-gray-400 focus:border-[#E5B65F] focus:ring-4 focus:ring-[#E5B65F]/15'
            )}
          />

          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange('')}
              tabIndex={docked ? 0 : -1}
              title="Clear search"
              className={cn(
                'absolute right-20 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors cursor-pointer',
                isLight
                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              <X size={15} />
            </button>
          )}

          <button
            type="submit"
            tabIndex={docked ? 0 : -1}
            className={cn(
              'absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer shadow-sm active:scale-95',
              isLight
                ? 'bg-[#B88728] hover:bg-[#9e721d] text-white'
                : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
            )}
          >
            {t.hero.searchBtn}
          </button>
        </form>
      </div>
    </animated.div>
  );
}
