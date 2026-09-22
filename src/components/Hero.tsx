import React, { useState } from 'react';
import { Search, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from 'motion/react';
import { HeroWipeSubtitle } from './HeroRotatingSubtitle';
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className="max-w-xl lg:max-w-2xl mt-auto sm:mt-0 mb-8 sm:mb-0">
          
          <h1 className={`font-display text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black mb-4 sm:mb-6 tracking-tight transition-colors duration-300 ${
            isLight ? 'text-slate-900 drop-shadow-sm' : 'text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
          }`}>
            <span className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'}>{t.hero.titleLine1}</span><br />
            {t.hero.titleLine2}
          </h1>

        <div data-impeccable-variants="d6d13a63" data-impeccable-variant-count="3" style={{ display: 'contents' }}>
          {/* impeccable-variants-start d6d13a63 */}
          {/* The gold lead and the greyer support line are fixed tokens in both
              treatments, so contrast does not shift as the line rotates. The lead
              carries the accent and the call to action stays the gold Search button;
              nothing else in the line competes with it. */}
          <style>{`
            /* Each rule steps into its own variant wrapper; @scope keeps the three
               treatments from reaching each other. The modifier class lives on
               .hero-wipe__inner because that is the element the wipe's width and
               clip-path constraint sits on, and a rule targeting anything else would
               never see it. */
            @scope ([data-impeccable-variant="1"]) {
              :scope > .hero-wipe__inner.hero-wipe--plain {
                display: inline-block;
                animation: hwAloneIn 900ms cubic-bezier(0.33, 0, 0.15, 1) both;
              }
              :scope .hero-wipe--plain .hero-wipe__lead {
                font-size: 1.6em;
                letter-spacing: 0.005em;
              }
            }

            @scope ([data-impeccable-variant="2"]) {
              /* One line: the customer's word, an em dash, then the services. The dash
                 is styled here rather than inherited because it is doing layout work,
                 not punctuation — it needs its own breathing room on both sides. */
              :scope .hero-wipe--dash .hero-wipe__lead {
                display: inline-block;
                animation: hwLeadIn 1000ms cubic-bezier(0.33, 0, 0.15, 1) both;
              }
              :scope .hero-wipe--dash .hero-wipe__dash {
                opacity: 0;
                color: #7d838b;
                animation: hwSupportIn 700ms cubic-bezier(0.33, 0, 0.15, 1) 260ms both;
              }
              :scope .hero-wipe--dash .hero-wipe__support {
                display: inline-block;
                opacity: 0;
                animation: hwSupportIn 900ms cubic-bezier(0.33, 0, 0.15, 1) 380ms both;
              }
            }

            @scope ([data-impeccable-variant="3"]) {
              /* The word becomes display type in the warm face, with the services as
                 a tracked caption beneath it. */
              :scope .hero-wipe--stack .hero-wipe__lead {
                display: block;
                font-family: var(--font-warm);
                font-size: 1.9em;
                /* Cooper* Bold, not Black. The family's heavy end is the famous one,
                   but at this size Black reads as bulk; Bold keeps the counters open
                   and the Art Nouveau bowing visible. It is a real weight in the
                   family, so nothing is synthesised. */
                font-weight: 700;
                line-height: 1.1;
                letter-spacing: 0;
                animation: hwLeadIn 1000ms cubic-bezier(0.33, 0, 0.15, 1) both;
              }
              :scope .hero-wipe--stack .hero-wipe__support {
                display: block;
                margin-top: 0.2em;
                font-size: 0.6em;
                font-weight: 600;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                opacity: 0;
                animation: hwSupportIn 900ms cubic-bezier(0.33, 0, 0.15, 1) 360ms both;
              }
            }

            @keyframes hwLeadIn {
              from { opacity: 0; transform: translateY(0.38em); filter: blur(4px); }
              to   { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            @keyframes hwSupportIn {
              from { opacity: 0; transform: translateY(0.3em); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes hwAloneIn {
              from { opacity: 0; transform: translateY(0.3em) scale(0.985); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-wipe__inner, .hero-wipe__lead, .hero-wipe__support { animation: none !important; }
            }
          `}</style>
          {/* Variant 1 — axis: RESTRAINT. The state word alone, larger, no support
              line. Nothing to read but the feeling; the verticals are one tap away. */}
          <div data-impeccable-variant="1">
            <HeroWipeSubtitle
              isLight={isLight}
              reduceMotion={Boolean(prefersReducedMotion)}
              reveal="plain"
              className={`text-base sm:text-lg md:text-xl mb-7 sm:mb-8 font-semibold leading-snug transition-colors duration-300 ${
                isLight ? 'text-slate-700' : 'text-gray-200 drop-shadow-sm'
              }`}
            />
          </div>
          {/* Variant 2 — axis: BREATH. The word lands, then the verticals arrive
              after it. Same information, loosened into two beats. */}
          <div data-impeccable-variant="2" style={{ display: 'none' }}>
            <HeroWipeSubtitle
              isLight={isLight}
              reduceMotion={Boolean(prefersReducedMotion)}
              reveal="dash"
              className={`text-base sm:text-lg md:text-xl mb-7 sm:mb-8 font-semibold leading-snug transition-colors duration-300 ${
                isLight ? 'text-slate-700' : 'text-gray-200 drop-shadow-sm'
              }`}
            />
          </div>
          {/* Variant 3 — axis: HIERARCHY. The word becomes display type and the
              verticals become a quiet tracked footnote beneath it. */}
          <div data-impeccable-variant="3" style={{ display: 'none' }}>
            <HeroWipeSubtitle
              isLight={isLight}
              reduceMotion={Boolean(prefersReducedMotion)}
              reveal="stack"
              className={`text-base sm:text-lg md:text-xl mb-7 sm:mb-8 font-semibold leading-snug transition-colors duration-300 ${
                isLight ? 'text-slate-700' : 'text-gray-200 drop-shadow-sm'
              }`}
            />
          </div>
          {/* impeccable-variants-end d6d13a63 */}
        </div>

          {/* Adaptive Editable Search Bar with Live Clear & Suggestions */}
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
    </section>
  );
}

