import React, { useState } from 'react';
import { Search, Sun, Moon, X } from 'lucide-react';
import heroNocturnalImage from '../assets/images/hero_nocturnal_dining_1789914100984.jpg';
import heroDaylightImage from '../assets/images/hero_daylight_resort_1789914085669.jpg';
import heroImageMobile from '../assets/images/mobile_landing_page_image.png';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onNavigate?: (page: string) => void;
  onOpenCategories?: (initialQuery?: string) => void;
}

/**
 * The hero subtitle, as data rather than a sentence.
 *
 * Short by design: the headline already carries the promise, so the subtitle only
 * has to name what the marketplace covers and what it amounts to. Separators are
 * explicit entries so the animation can stagger them too, and so the copy reads as
 * a list rather than a run-on.
 */
const HERO_SUBTITLE: Array<{ word: string; kind: 'category' | 'separator' | 'promise' }> = [
  { word: 'Dining', kind: 'category' },
  { word: '·', kind: 'separator' },
  { word: 'Spa', kind: 'category' },
  { word: '·', kind: 'separator' },
  { word: 'Chauffeurs', kind: 'category' },
  { word: '·', kind: 'separator' },
  { word: 'Groceries', kind: 'category' },
  { word: 'One concierge', kind: 'promise' },
];

export default function Hero({ onNavigate, onOpenCategories }: HeroProps) {
  const [query, setQuery] = useState('');
  const { isLight, toggleTheme } = useTheme();
  const { t } = useLanguage();

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
          
          <img
            src={heroNocturnalImage}
            alt="Nocturnal Luxury Penthouse Dining & Skyline"
            className="hidden sm:block w-full h-full object-cover opacity-80 brightness-90 transition-transform duration-1000 scale-100 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <img
            src={heroImageMobile}
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
          <img
            src={heroDaylightImage}
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
          
          <h1 className={`text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black mb-4 sm:mb-6 tracking-tight transition-colors duration-300 ${
            isLight ? 'text-slate-900 drop-shadow-sm' : 'text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
          }`}>
            <span className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'}>{t.hero.titleLine1}</span><br />
            {t.hero.titleLine2}
          </h1>

          {/* Hero subtitle.
              Wolt-grade brevity: the verticals, then the promise, in one line.
              Replaced the previous four-line sentence about "curated gourmet
              dishes, sanctuary spa treatments, VIP chauffeurs and swift concierge
              delivery", which spent the full width restating the headline.

              The first four entries are categories and are separated by a middot
              so the line scans as a list rather than a sentence with a missing
              verb. "One concierge" is what the list resolves to, so it carries the
              accent and takes no separator — which is also why it is the only part
              not wrapped in the de-emphasised class.

              The entrance is a staggered word rise; `prefers-reduced-motion` drops
              it to a plain render. Styles live beside the rest of the Hero's
              presentation in `src/index.css`. */}
          <p
            className={`hero-subtitle text-base sm:text-lg md:text-xl mb-7 sm:mb-8 font-semibold leading-snug transition-colors duration-300 ${
              isLight ? 'text-slate-700' : 'text-gray-200 drop-shadow-sm'
            }`}
          >
            {HERO_SUBTITLE.map((entry, index) =>
              entry.kind === 'separator' ? (
                <span key={`sep-${index}`} className="hero-subtitle__word hero-subtitle__separator" aria-hidden="true">
                  ·
                </span>
              ) : (
                <span
                  key={entry.word}
                  className={`hero-subtitle__word${
                    entry.kind === 'promise'
                      ? ` hero-subtitle__promise ${isLight ? 'hero-subtitle__promise--light' : 'hero-subtitle__promise--dark'}`
                      : entry.kind === 'category'
                      ? ' hero-subtitle__category'
                      : ''
                  }`}
                >
                  {entry.word}
                </span>
              )
            )}
          </p>

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
              className={`w-full pl-13 pr-32 py-4 sm:py-4.5 rounded-2xl text-xs sm:text-sm md:text-base font-semibold outline-none backdrop-blur-xl transition-all duration-300 cursor-pointer ${
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
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 ${
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

