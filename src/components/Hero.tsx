import React, { useRef, useState } from 'react';
import { Search, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from 'motion/react';
import { HeroWipeSubtitle } from './HeroRotatingSubtitle';
import DockedSearchBar from './hero/DockedSearchBar';
import ResponsiveImage from './ResponsiveImage';

interface HeroProps {
  onNavigate?: (page: string) => void;
  onOpenCategories?: (initialQuery?: string) => void;
}

export default function Hero({ onNavigate, onOpenCategories }: HeroProps) {
  const [query, setQuery] = useState('');
  const { isLight, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  // The inline search. The docked bar observes this element: once it has scrolled past the
  // header, the docked bar takes over. Typed as HTMLElement rather than HTMLFormElement so
  // the same ref works whether it lands on the wrapper div or the form inside it.
  const inlineSearchRef = useRef<HTMLDivElement | null>(null);

  /**
   * The search itself, extracted from the form handler so the docked bar can run exactly
   * the same logic. Two submit paths that drift apart is the classic way a duplicated
   * control starts behaving differently from the original.
   */
  const runSearch = () => {
    if (onOpenCategories) {
      onOpenCategories(query);
      return;
    }
    if (!query.trim()) return;
    const q = query.toLowerCase();
    if (q.includes('spa') || q.includes('massage') || q.includes('facial') || q.includes('wellness')) {
      onNavigate?.('spa');
    } else if (q.includes('car') || q.includes('maybach') || q.includes('ride') || q.includes('heli') || q.includes('transport')) {
      onNavigate?.('transport');
    } else if (q.includes('grocery') || q.includes('caviar') || q.includes('wine') || q.includes('pantry') || q.includes('cellar')) {
      onNavigate?.('groceries');
    } else if (q.includes('yacht') || q.includes('experience') || q.includes('safari') || q.includes('polo')) {
      onNavigate?.('experiences');
    } else {
      onNavigate?.('restaurants');
    }
  };

  /** Kept for the inline form's onSubmit, which must still preventDefault. */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  const handleSuggestionClick = (sug: string) => {
    setQuery(sug);
    if (onOpenCategories) {
      onOpenCategories(sug);
      return;
    }
    const q = sug.toLowerCase();
    if (q.includes('massage')) onNavigate?.('spa');
    else if (q.includes('maybach')) onNavigate?.('transport');
    else if (q.includes('caviar')) onNavigate?.('groceries');
    else if (q.includes('yacht')) onNavigate?.('experiences');
    else onNavigate?.('restaurants');
  };

  return (
    <section className={`relative min-h-[92vh] lg:min-h-[100svh] px-4 sm:px-8 xl:px-16 flex flex-col justify-center overflow-hidden pt-24 sm:pt-28 pb-16 transition-colors duration-700 ${
      isLight ? 'bg-[#f7f8fa]' : 'bg-[#111315]'
    }`}>
      {/* Background Imagery with Smooth Mode Cross-Fade & Organic Feathering */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dark Mode Nocturnal Penthouse Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            isLight ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Radial & directional ambient vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/95 via-[#111315]/80 to-[#111315]/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-transparent to-black/30 z-10" />
          
          {/* Full-bleed hero art: the browser picks the smallest width that covers
              this element at the current device pixel ratio, so a phone never
              downloads the 1920px file. `priority` because it is the first paint. */}
          <ResponsiveImage
            name="hero_nocturnal_dining_1789914100984.jpg"
            sizes="100vw"
            priority
            alt="Nocturnal Luxury Penthouse Dining & Skyline"
            className="hidden sm:block w-full h-full object-cover opacity-80 brightness-90 transition-transform duration-1000 scale-100 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <ResponsiveImage
            name="mobile_landing_page_image.png"
            sizes="100vw"
            priority
            alt="Nocturnal Luxury Suite Mobile"
            className="block sm:hidden w-full h-full object-cover opacity-75 brightness-80"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Light Mode Sunlit Penthouse Terrace Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            isLight ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Subtle directional scrim for optimal text contrast in daylight mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20 sm:from-white/90 sm:via-white/70 sm:to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f8fa] via-[#f7f8fa]/60 to-transparent z-10" />
          <ResponsiveImage
            name="hero_daylight_resort_1789914085669.jpg"
            sizes="100vw"
            priority
            alt="Sunlit Luxury Penthouse Infinity Pool and Skyline"
            className="w-full h-full object-cover brightness-100 contrast-[1.03] transition-transform duration-1000 scale-100 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Soft Organic Hero-to-Body Blend Gradient Mask */}
        <div className={`absolute -bottom-1 left-0 right-0 h-40 z-10 pointer-events-none transition-colors duration-700 ${
          isLight
            ? 'bg-gradient-to-t from-[#f7f8fa] via-[#f7f8fa]/80 to-transparent'
            : 'bg-gradient-to-t from-[#111315] via-[#111315]/80 to-transparent'
        }`} />
      </div>

      <div className="container mx-auto max-w-[1400px] relative z-20 flex flex-col justify-center flex-1">
        <div className="hero-copy mt-auto sm:mt-0 mb-8 sm:mb-0">
          
          {/* Hero headline. Values baked from the accepted live-mode variant:
              scale=large, leading=snug, ink=tight. The @scope scaffolding and the
              helper markers are gone; this is the permanent form.
          
              Line 2 is 0.95em, so it tracks the clamp on the h1 automatically rather
              than needing its own breakpoint ladder. */}
          <h1
            className={`hero-h1 font-display font-black transition-colors duration-300 ${
              isLight ? 'text-slate-900 drop-shadow-sm' : 'text-white'
            }`}
          >
            <span className="hero-h1__lead">{t.hero.titleLine1}</span>{' '}
            <span className="hero-h1__line2">{t.hero.titleLine2}</span>
          </h1>

          {/* The rotating line: a customer's word, then what that word buys.
              TWO spacing decisions, both deliberate:

              `pl-[0.18em]` indents it very slightly from the headline's left edge. The
              indent is what signals that this line belongs TO the headline rather than
              being a sibling of it — the difference is small enough to read as
              intentional positioning rather than as a misalignment, which is the risk
              with any indent this shallow.

              `mt-6` against `mb-4` puts MORE space above than below, so the line groups
              downward with the search bar. Equal gaps had it floating between the two,
              belonging to neither. */}
          <HeroWipeSubtitle
            isLight={isLight}
            reduceMotion={Boolean(prefersReducedMotion)}
            className={`mt-6 mb-4 pl-[0.26em] text-base sm:text-lg md:text-xl font-semibold leading-snug transition-colors duration-300 ${
              isLight ? 'text-slate-700' : 'text-gray-200 drop-shadow-sm'
            }`}
          />

          {/* Adaptive Editable Search Bar with Live Clear & Suggestions.
              The docked bar watches a WRAPPER, not the form itself, and the wrapper is
              given 220px of extra height below. A one-line element leaves the viewport
              almost immediately, so observing it directly would dock the bar after about
              sixty pixels of scrolling — the bar would appear before the user had
              meaningfully left the hero. The extra box means the hero search must travel
              properly out of view first. */}
          <div ref={inlineSearchRef}>
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              isLight ? 'text-slate-400' : 'text-gray-400'
            }`} size={20} />
            
            <input
              id="hero-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => onOpenCategories?.(query)}
              placeholder="Search luxury dining, private chauffeurs, spa retreats, cellar reserve..."
              className={`w-full pl-13 pr-32 py-4 sm:py-4.5 rounded-2xl text-xs sm:text-sm md:text-base font-semibold outline-none backdrop-blur-xl transition duration-300 cursor-pointer ${
                isLight
                  ? 'bg-white/95 text-slate-900 border border-slate-300/80 placeholder:text-slate-400 focus:border-[#B88728] focus:ring-4 focus:ring-[#B88728]/15 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                  : 'bg-[#181a1b]/95 text-white border border-white/20 placeholder:text-gray-400 focus:border-[#E5B65F] focus:ring-4 focus:ring-[#E5B65F]/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
              }`}
            />

            {/* Clear Input Button */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`absolute right-24 sm:right-28 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}

            <button
              id="hero-search-submit-btn"
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-md active:scale-95 ${
                isLight
                  ? 'bg-[#B88728] hover:bg-[#9e721d] text-white'
                  : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
              }`}
            >
              {t.hero.searchBtn}
            </button>
          </form>
          </div>
        </div>
      </div>

      {/* The docked bar lives inside the hero rather than at app level, so it is scoped
          to the home page by construction. The user asked for the scroll effect here and
          nowhere else, and a component mounted per-page cannot leak onto another route.
          It is `fixed`, so its position in this tree has no effect on where it renders. */}
      <DockedSearchBar
        value={query}
        onChange={setQuery}
        onSubmit={runSearch}
        onOpenCategories={onOpenCategories}
        anchorRef={inlineSearchRef}
        placeholder={t.hero.searchPlaceholder}
      />
    </section>
  );
}

