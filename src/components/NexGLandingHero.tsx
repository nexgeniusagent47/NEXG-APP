import React, { useState, useEffect } from 'react';
import { MapPin, Crosshair, ArrowRight, ChevronDown, Sparkles, Search, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface NexGLandingHeroProps {
  onEnterDiscovery: (initialAddress?: string) => void;
  onOpenCategories?: () => void;
  onNavigate?: (page: string) => void;
}

const HEADLINE_WORDS = ['GOURMET.', 'SUSHI.', 'SEAFOOD.', 'LUXURY.', 'APP.'];

export default function NexGLandingHero({
  onEnterDiscovery,
  onOpenCategories,
  onNavigate,
}: NexGLandingHeroProps) {
  const { isLight } = useTheme();
  const [wordIndex, setWordIndex] = useState(0);
  const [addressInput, setAddressInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Cycling headline effect
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HEADLINE_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleAddressSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onEnterDiscovery(addressInput || 'Nairobi Sanctuary Suites');
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setAddressInput('Nairobi Villa 14 • Karen Estate');
      setIsLocating(false);
      onEnterDiscovery('Nairobi Villa 14 • Karen Estate');
    }, 700);
  };

  return (
    <div
      className={`relative min-h-[90vh] flex flex-col justify-between overflow-hidden transition-colors duration-500 select-none ${
        isLight
          ? 'bg-[#009DE0] text-white'
          : 'bg-[#082b3d] text-white'
      }`}
    >
      {/* Subtle wave/curve background geometry */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg
          className="absolute -bottom-20 -left-20 w-[120vw] h-[70vh]"
          viewBox="0 0 1440 600"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160L80,186.7C160,213,320,267,480,266.7C640,267,800,213,960,192C1120,171,1280,181,1360,186.7L1440,192L1440,600L1360,600C1280,600,1120,600,960,600C800,600,640,600,480,600C320,600,160,600,80,600L0,600Z"
            fill="currentColor"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {/* Top Navbar */}
      <nav className="relative z-20 px-5 sm:px-10 py-5 flex items-center justify-between max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo */}
          <button
            onClick={() => onEnterDiscovery()}
            className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1 font-serif"
          >
            <span>NEXG</span>
            <span className="text-[#FFE066] not-italic text-sm font-bold font-sans tracking-normal ml-1 px-2 py-0.5 rounded-full bg-white/20">
              APP
            </span>
          </button>

          {/* Location Selector */}
          <button
            onClick={handleLocateMe}
            className="hidden sm:flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-colors cursor-pointer backdrop-blur-md"
            title="Change Delivery Location"
          >
            <div className="w-5 h-5 rounded-full bg-white text-[#009DE0] flex items-center justify-center">
              <MapPin size={12} className="fill-current" />
            </div>
            <span>Nairobi Villas</span>
            <ChevronDown size={14} className="opacity-70" />
          </button>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('merchants')}
            className="hidden md:inline-block text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            For Partners
          </button>
          <button
            onClick={() => onNavigate?.('couriers')}
            className="hidden md:inline-block text-xs font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Fleet
          </button>
          <button
            onClick={() => onEnterDiscovery()}
            className="text-xs font-bold text-white/90 hover:text-white px-3.5 py-2 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => onEnterDiscovery()}
            className="text-xs font-black bg-white text-[#009DE0] px-4 py-2 rounded-full hover:bg-white/90 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Main Center Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 max-w-4xl mx-auto w-full">
        {/* Sustainable delivery pill */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onEnterDiscovery()}
          className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 cursor-pointer transition-colors border border-white/25"
        >
          <span>♥ Delivered sustainably & in private warmth</span>
          <ArrowRight size={13} className="ml-0.5" />
        </motion.button>

        {/* Big Bold Typography */}
        <div className="mb-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h1
              key={wordIndex}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95] uppercase font-sans text-white drop-shadow-sm"
            >
              {HEADLINE_WORDS[wordIndex]}
              <br />
              <span className="text-white/95">DELIVERED.</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Central Search Bar (The Address / Category Trigger) */}
        <form
          onSubmit={handleAddressSubmit}
          className="w-full max-w-xl bg-white rounded-full p-2 sm:p-2.5 shadow-2xl flex items-center gap-3 transition hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] focus-within:ring-4 focus-within:ring-white/40"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#009DE0] flex-shrink-0 ml-1">
            <MapPin size={20} className="fill-[#009DE0]" />
          </div>

          <input
            type="text"
            id="nexg-address-search-input"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onClick={() => onEnterDiscovery()}
            placeholder="Enter delivery address, villa or hotel suite..."
            className="flex-grow bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base font-semibold focus:outline-none cursor-pointer"
          />

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#009DE0] transition-colors cursor-pointer flex-shrink-0"
            title="Locate my position"
          >
            <Crosshair
              size={20}
              className={`${isLocating ? 'animate-spin text-[#009DE0]' : ''}`}
            />
          </button>

          <button
            type="submit"
            className="bg-[#009DE0] hover:bg-[#008cc7] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
          >
            <span>Explore</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Below Search Secondary Controls */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm font-semibold text-white/90">
          <button
            onClick={() => onEnterDiscovery()}
            className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-colors cursor-pointer backdrop-blur-sm"
          >
            Log in for saved addresses &gt;
          </button>
          <button
            onClick={() => onEnterDiscovery()}
            className="underline underline-offset-4 hover:text-white transition-colors cursor-pointer py-1"
          >
            Popular around you right now &gt;
          </button>
        </div>
      </main>

      {/* Bottom Footer Info Bar */}
      <footer className="relative z-10 px-6 py-4 flex items-center justify-between max-w-[1440px] mx-auto w-full text-xs text-white/70">
        <div className="flex items-center gap-4">
          <span>© 2026 NEXG App</span>
          <button
            onClick={onOpenCategories}
            className="text-white hover:underline flex items-center gap-1"
          >
            <Compass size={13} />
            <span>21 Curated Categories</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-status" />
          <span>Active App Fleet in Nairobi</span>
        </div>
      </footer>
    </div>
  );
}
