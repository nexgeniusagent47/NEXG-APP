import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Bike,
  Sun,
  Moon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import LogoIcon from './LogoIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  /** Opens the category explorer. Without this, "Explore" was a no-op. */
  onExplore?: () => void;
}

export default function Header({ currentPage, onNavigate, onExplore }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPartnersExpanded, setIsPartnersExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemsCount, setIsCartOpen, activeOrder, setIsTrackingOpen } = useCart();
  const { isLight, toggleTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (page: any) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 rounded-none border-none transition-all duration-300 ${
        isScrolled
          ? isLight
            ? 'py-2.5 sm:py-3 shadow-[0_6px_25px_rgba(0,0,0,0.04)]'
            : 'py-2.5 sm:py-3 shadow-[0_10px_35px_rgba(0,0,0,0.45)]'
          : 'py-3.5 sm:py-4'
      } ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}
    >
      {/* Progressive Blur Layering System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Layer 1: Core Frosted Glass with gradual vertical transparency falloff */}
        <div
          className={`absolute inset-0 backdrop-blur-2xl transition-all duration-500 ${
            isLight
              ? isScrolled
                ? 'bg-white/94'
                : 'bg-white/88'
              : isScrolled
              ? 'bg-[#0c0e12]/94'
              : 'bg-[#0c0e12]/85'
          }`}
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.85) 90%, rgba(0,0,0,0.6) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.85) 90%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        {/* Layer 2: Extended Feathered Progressive Blur below bottom border for seamless scroll bleed */}
        <div
          className={`absolute -bottom-5 left-0 right-0 h-5 backdrop-blur-md transition-opacity duration-500 pointer-events-none ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          } ${
            isLight
              ? 'bg-gradient-to-b from-white/30 to-transparent'
              : 'bg-gradient-to-b from-[#0c0e12]/40 to-transparent'
          }`}
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => onNavigate('home')}
        >
          <LogoIcon className="w-9 h-9 md:w-10 md:h-10 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span
              className={`font-black text-lg md:text-xl leading-none tracking-widest ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              NEXG
            </span>
            <span className="text-[7.5px] md:text-[8.5px] uppercase tracking-[0.25em] text-[#B88728] dark:text-[#E5B65F] font-extrabold mt-0.5">
              Concierge
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links
            v2: reduced to Explore + Partners. The six vertical entries that used
            to sit between them (Fine Dining, Spa & Wellness, VIP Mobility, Fine
            Cellar, Experiences) now live in the Discovery surface, which is the
            single browse entry point, and remain reachable from the footer.

            This also fixes v1 defect D-15: the full nav needed ~1331px inside a
            1280px `xl` breakpoint, so items crowded at exactly the width where
            they first appeared. */}
        <nav className="hidden xl:flex items-center gap-7 text-xs sm:text-[13px] font-semibold tracking-wide">
          <button
            onClick={() => (onExplore ? onExplore() : onNavigate('home'))}
            className={`transition-colors cursor-pointer text-left bg-transparent border-none p-0 ${
              currentPage === 'home'
                ? isLight
                  ? 'text-[#B88728] font-bold'
                  : 'text-[#E5B65F] font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.nav.explore}
          </button>

          {/* Partners Dropdown */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1 transition-colors cursor-pointer text-left bg-transparent border-none p-0 ${
                currentPage === 'merchants' ||
                currentPage === 'properties' ||
                currentPage === 'couriers'
                  ? isLight
                    ? 'text-[#B88728] font-bold'
                    : 'text-[#E5B65F] font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>{t.nav.partners}</span>
              <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div
                className={`w-48 rounded-xl shadow-2xl flex flex-col overflow-hidden py-2 border backdrop-blur-xl ${
                  isLight
                    ? 'bg-white/95 text-slate-800 border-slate-200'
                    : 'bg-[#141618]/95 text-gray-200 border-white/15'
                }`}
              >
                <button
                  onClick={() => onNavigate('properties')}
                  className={`px-4 py-2 text-left text-xs font-semibold w-full cursor-pointer transition-colors ${
                    isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-200'
                  }`}
                >
                  {t.nav.forProperties}
                </button>
                <button
                  onClick={() => onNavigate('couriers')}
                  className={`px-4 py-2 text-left text-xs font-semibold w-full cursor-pointer transition-colors ${
                    isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-200'
                  }`}
                >
                  {t.nav.forCouriers}
                </button>
                <button
                  onClick={() => onNavigate('merchants')}
                  className={`px-4 py-2 text-left text-xs font-semibold w-full cursor-pointer transition-colors ${
                    isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-200'
                  }`}
                >
                  {t.nav.forMerchants}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Order Tracker Shortcut */}
          {activeOrder && activeOrder.estimatedMinutesLeft > 0 && activeOrder.status !== 'delivered' && (
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Bike size={14} />
              <span className="hidden sm:inline">{t.nav.track}</span>
              <span>~{activeOrder.estimatedMinutesLeft}m</span>
            </button>
          )}

          {/* Dedicated Single-Color Language Switcher in Header */}
          <LanguageSwitcher align="right" />

          {/* Theme Toggle Button (Light / Dark Mode Switch) */}
          <button
            id="header-theme-toggle-btn"
            onClick={toggleTheme}
            className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-800'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-[#E5B65F]'
            }`}
            aria-label={isLight ? 'Switch to Nocturnal Dark Mode' : 'Switch to Daylight Light Mode'}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
            aria-label="View Cart"
          >
            <ShoppingBag size={17} />
            {itemsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5B65F] text-black font-extrabold text-[10px] flex items-center justify-center shadow-md"
              >
                {itemsCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-1.5 xl:hidden cursor-pointer ${
              isLight ? 'text-slate-800 hover:text-[#B88728]' : 'text-white hover:text-[#E5B65F]'
            }`}
            aria-label="Open Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`w-full border-t p-5 shadow-2xl flex flex-col gap-3.5 z-50 xl:hidden ${
              isLight
                ? 'bg-white/98 text-slate-900 border-slate-200'
                : 'bg-[#121417]/98 text-white border-white/15'
            }`}
          >
            {/* Mobile Language & Theme Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <LanguageSwitcher variant="mobile" />
              </div>
              <button
                id="header-mobile-theme-toggle-btn"
                onClick={toggleTheme}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-amber-800'
                    : 'bg-white/10 border-white/15 text-[#E5B65F]'
                }`}
                title="Toggle Light/Dark Theme"
              >
                {isLight ? <Moon size={15} /> : <Sun size={15} />}
                <span>{isLight ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 font-medium text-sm pt-2 border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onExplore) onExplore();
                  else onNavigate('home');
                }}
                className={`text-left py-2 transition-colors border-b ${
                  isLight ? 'border-slate-100 hover:text-[#B88728] text-slate-800' : 'border-white/10 hover:text-[#E5B65F] text-gray-200'
                }`}
              >
                {t.nav.explore}
              </button>

              <div>
                <button
                  onClick={() => setIsPartnersExpanded(!isPartnersExpanded)}
                  className={`flex items-center justify-between w-full text-left py-2 transition-colors border-b ${
                    isLight ? 'border-slate-100 hover:text-[#B88728] text-slate-800' : 'border-white/10 hover:text-[#E5B65F] text-gray-200'
                  }`}
                >
                  <span>{t.nav.partners}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isPartnersExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isPartnersExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`overflow-hidden rounded-xl mt-2 px-4 py-2 flex flex-col gap-2 text-xs ${
                        isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => handleMobileNav('properties')}
                        className="text-left py-1.5 hover:text-[#B88728] transition-colors"
                      >
                        {t.nav.forProperties}
                      </button>
                      <button
                        onClick={() => handleMobileNav('couriers')}
                        className="text-left py-1.5 hover:text-[#B88728] transition-colors"
                      >
                        {t.nav.forCouriers}
                      </button>
                      <button
                        onClick={() => handleMobileNav('merchants')}
                        className="text-left py-1.5 hover:text-[#B88728] transition-colors"
                      >
                        {t.nav.forMerchants}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

