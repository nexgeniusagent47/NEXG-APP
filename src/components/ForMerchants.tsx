import React, { useState, useEffect } from 'react';
import { responsiveProps } from './ResponsiveImage';
import * as Icons from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import LogoIcon from './LogoIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function ForMerchants({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLight, toggleTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (page: string) => {
    onNavigate?.(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`${isLight ? 'bg-[#F8F9FA] text-slate-900' : 'bg-[#1a1c1c] text-[#f9f9f9]'} font-sans antialiased selection:bg-[#E5B65F] selection:text-black min-h-screen transition-colors duration-300`}>
      {/* Adaptive Docked Navigation for Merchants */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
          scrolled 
            ? (isLight ? 'bg-[#F8F9FA]/85 backdrop-blur-2xl shadow-xs py-3' : 'bg-[#1a1c1c]/85 backdrop-blur-2xl shadow-xs py-3')
            : 'bg-transparent py-5 sm:py-6'
        }`} 
        id="top-nav"
      >
        <div className="px-4 sm:px-6 max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate?.('home')}
              className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition backdrop-blur-md cursor-pointer min-w-[40px] min-h-[40px] ${
                isLight 
                  ? 'bg-white/80 hover:bg-white text-slate-800 shadow-xs' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={t.partnersPortal.backHome}
              aria-label="Back to Home"
            >
              <Icons.ArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Elegant brand info */}
            <div className="flex items-center gap-2 cursor-pointer py-1" onClick={() => onNavigate?.('home')}>
              {/* The wordmark already spells NEXG, so no text sits beside it. */}
              <LogoIcon variant="wordmark" className="h-7 w-auto" />
            </div>
          </div>

          {/* Desktop links & In-Page Merchant Anchors */}
          <div className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-semibold">
            {scrolled ? (
              <>
                <a href="#why-merchants-choose" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.benefits}</a>
                <a href="#white-glove-service" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.logistics}</a>
                <a href="#how-it-works-merchant" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.howItWorks}</a>
                <a href="#merchant-categories" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.categories}</a>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate?.('properties')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-slate-700 hover:text-amber-600' : 'text-gray-300 hover:text-white'}`}>{t.nav.forProperties}</button>
                <button onClick={() => onNavigate?.('merchants')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-amber-700 font-bold' : 'text-[#E5B65F] font-bold'}`}>{t.nav.forMerchants}</button>
                <button onClick={() => onNavigate?.('couriers')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-slate-700 hover:text-amber-600' : 'text-gray-300 hover:text-white'}`}>{t.nav.forCouriers}</button>
                <button onClick={() => onNavigate?.('experiences')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-slate-700 hover:text-amber-600' : 'text-gray-300 hover:text-white'}`}>{t.nav.experiences}</button>
              </>
            )}
            
            {/* Quick Action Docked CTA */}
            <button
              onClick={() => onNavigate?.('merchant_onboarding')}
              className={`px-4 py-2 rounded-full font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 ${
                isLight 
                  ? 'bg-[#B88728] hover:bg-[#9e721d] text-white'
                  : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-[#291800]'
              }`}
            >
              {t.partnersPortal.listBusiness}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle Button */}
            <button
              id="merchants-theme-toggle-btn"
              onClick={toggleTheme}
              className={`flex items-center justify-center w-9 h-9 rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'bg-white/80 hover:bg-white border-slate-200 text-amber-800 shadow-2xs'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-[#E5B65F]'
              }`}
              aria-label="Toggle Theme"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Icons.Moon size={16} /> : <Icons.Sun size={16} />}
            </button>
          </div>

          {/* Mobile hamburger & language switcher */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              id="merchants-mobile-theme-btn"
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-amber-800'
                  : 'bg-white/10 border-white/15 text-[#E5B65F]'
              }`}
              title="Toggle Theme"
            >
              {isLight ? <Icons.Moon size={15} /> : <Icons.Sun size={15} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center transition-colors focus:outline-none cursor-pointer min-w-[40px] min-h-[40px] ${
                isLight ? 'text-slate-800 hover:text-amber-600' : 'text-white hover:text-[#E5B65F]'
              }`}
            >
              {isMobileMenuOpen ? <Icons.X size={22} /> : <Icons.Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-4 right-4 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 z-50 md:hidden backdrop-blur-2xl ${
                isLight
                  ? 'bg-white/95 text-slate-800 shadow-lg'
                  : 'bg-[#1e2020]/95 text-white'
              }`}
            >
              <div className="flex flex-col gap-3 font-semibold text-sm">
                <button onClick={() => handleMobileNav('home')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">Explore Home</button>
                <button onClick={() => handleMobileNav('properties')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">For Properties</button>
                <button onClick={() => handleMobileNav('merchants')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors text-[#E5B65F]">For Partners</button>
                <button onClick={() => handleMobileNav('couriers')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">Elite Fleet</button>
                <button onClick={() => handleMobileNav('experiences')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">Experiences</button>
              </div>
              <button 
                onClick={() => handleMobileNav('merchant_onboarding')}
                className="w-full text-center text-sm font-bold bg-[#E5B65F] text-[#291800] rounded-xl py-3 hover:bg-[#ffddb1] transition-colors shadow-md"
              >
                Start Onboarding
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Dual Day/Night Imagery & Organic Bottom Blend */}
      <section className="relative h-[80vh] min-h-[520px] sm:min-h-[580px] flex flex-col justify-end pb-[5%] sm:pb-[5%] overflow-hidden z-10 pt-20">
        {/* Background Image with Ambient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/70 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/95 via-[#F8F9FA]/70 to-transparent z-10"></div>
              <img 
                src={responsiveProps('merchants_hero_light_1789911802167.jpg', '100vw')?.src} 
                alt="Merchants Hero Daylight Background" 
                className="w-full h-full object-cover opacity-85 brightness-105 transition-transform duration-[10000ms] hover:scale-105" 
                referrerPolicy="no-referrer"
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1c] via-[#1a1c1c]/80 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1c]/95 via-[#1a1c1c]/70 to-transparent z-10"></div>
              <img 
                src={responsiveProps('merchant_hero_section.29.39.jpeg', '100vw')?.src} 
                alt="Merchants Hero Background" 
                className="w-full h-full object-cover opacity-60 sm:opacity-80 brightness-60 sm:brightness-75 transition-transform duration-[10000ms] hover:scale-105" 
                referrerPolicy="no-referrer"
              />
            </>
          )}

          {/* Organic Bottom Blend Feathering */}
          <div className={`absolute -bottom-1 left-0 right-0 h-32 z-10 ${
            isLight ? 'bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/90 to-transparent' : 'bg-gradient-to-t from-[#1a1c1c] via-[#1a1c1c]/90 to-transparent'
          }`} />
        </div>

        {/* Content Container */}
        <div className="container mx-auto max-w-[1400px] relative z-20 px-4 sm:px-8 xl:px-16 w-full">
          <div className="max-w-3xl">
            <h1 className={`font-bold text-3xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 leading-[1.15] tracking-tight ${isLight ? 'text-slate-900 drop-shadow-sm' : 'text-white'}`}>
              Reach Customers.
            </h1>
            <p className="text-[#E5B65F] text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 tracking-tight">
              Right Where They Are.
            </p>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-10 max-w-2xl leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-gray-200'}`}>
              Partner with NEXG App to serve guests directly inside premier luxury properties. We provide white-glove logistics, automated payouts, and seamless integration with your existing team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => onNavigate?.('merchant_onboarding')}
                className="w-full sm:w-auto bg-[#E5B65F] text-[#291800] px-8 py-4 rounded-full font-bold text-base hover:bg-[#ffddb1] transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer min-h-[48px]"
              >
                Start Onboarding
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Metrics */}
      <section className={`border-y transition-colors duration-300 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/5'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="font-bold text-3xl sm:text-4xl text-[#E5B65F] mb-1">3x</div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-[#a0a1a1]'}`}>Higher Avg. Order Value</div>
          </div>
          <div className="text-center sm:text-left">
            <div className={`font-bold text-3xl sm:text-4xl mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>100%</div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-[#a0a1a1]'}`}>White-Glove Delivery</div>
          </div>
          <div className="text-center sm:text-left">
            <div className={`font-bold text-3xl sm:text-4xl mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>0%</div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-[#a0a1a1]'}`}>Commission on Pickups</div>
          </div>
          <div className="text-center sm:text-left">
            <div className={`font-bold text-3xl sm:text-4xl mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>24/7</div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-[#a0a1a1]'}`}>Merchant Support</div>
          </div>
        </div>
      </section>

      {/* Why Partners Choose NEXG (6 Pillars) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto" id="why-merchants-choose">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 rounded-full ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/10 text-[#E5B65F]'}`}>
            WHY PARTNER WITH US
          </span>
          <h2 className={`text-2xl sm:text-3xl md:text-5xl font-extrabold mt-4 mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Why Merchants Choose NEXG
          </h2>
          
          {/* Slogan banner */}
          <div className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-6 px-6 py-3 rounded-full shadow-lg relative overflow-hidden border ${
            isLight
              ? 'bg-white border-slate-200 shadow-slate-200/50'
              : 'bg-[#131515] border-white/10'
          }`}>
            <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B65F] ring-2 ring-[#E5B65F]/25"></span>
              Verified Properties
            </span>
            <span className={`hidden sm:inline font-light ${isLight ? 'text-slate-300' : 'text-gray-600'}`}>|</span>
            <span className="text-xs sm:text-sm md:text-base font-bold text-[#E5B65F] tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B65F] ring-2 ring-[#E5B65F]/25"></span>
              Consistent Orders
            </span>
            <span className={`hidden sm:inline font-light ${isLight ? 'text-slate-300' : 'text-gray-600'}`}>|</span>
            <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B65F] ring-2 ring-[#E5B65F]/25"></span>
              Seamless Payouts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Pillar 1: Premium Exposure */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="text-[#E5B65F] mb-5 transition-transform duration-300 group-hover:scale-110">
              <Icons.Sparkles size={28} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Premium Exposure</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
              Gain exclusive positioning in elite hotel room directories, high-visibility bedside QR cards, and digital concierge web-apps.
            </p>
          </div>

          {/* Pillar 2: Multiply Orders */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="text-[#E5B65F] mb-5 transition-transform duration-300 group-hover:scale-110">
              <Icons.TrendingUp size={28} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Multiply Volume</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
              Tap into high-net-worth guests, tourists, and business travelers ordering gourmet meals, personal amenities, or spa treatments.
            </p>
          </div>

          {/* Pillar 3: White-Glove Logistics */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="text-[#E5B65F] mb-5 transition-transform duration-300 group-hover:scale-110">
              <Icons.Truck size={28} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>White-Glove Logistics</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
              Never worry about transport. Our highly vetted professional courier fleet collects your packages and delivers them with elite standards.
            </p>
          </div>

          {/* Pillar 4: Zero Friction Setup */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="text-[#E5B65F] mb-5 transition-transform duration-300 group-hover:scale-110">
              <Icons.Zap size={28} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Zero Friction Setup</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
              We handle everything from digital menu formatting to custom checkout links. Absolutely no technical setup required on your end.
            </p>
          </div>

          {/* Pillar 5: Direct Split Payouts */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="text-rose-500 mb-5 transition-transform duration-300 group-hover:scale-110">
              <Icons.CreditCard size={28} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Instant Split Payouts</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
              Get paid on time, every time. Once a guest completes checkout, automated, secure merchant payouts route instantly to your bank.
            </p>
          </div>

          {/* Pillar 6: Dedicated Live Support */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="text-[#E5B65F] mb-5 transition-transform duration-300 group-hover:scale-110">
              <Icons.ShieldCheck size={28} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Dedicated Support</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
              Keep orders running flawlessly. Our active support concierge monitors deliveries live and assists with special suite requests.
            </p>
          </div>

        </div>
      </section>

      {/* 4-Step Onboarding Timeline Flow */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto" id="how-it-works-merchant-timeline">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className={`font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 rounded-full ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/10 text-[#E5B65F]'}`}>
            ONBOARDING TIMELINE
          </span>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-4 sm:mb-6 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            4 Simple Steps to Launch Your Brand
          </h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
            Zero integration headache. Submit your menu or catalogue, let us digitise your portal, and receive curated local sales in 48 hours.
          </p>
        </div>

        {/* Timeline track wrapper */}
        <div className="relative">
          {/* Connector Line (Desktop only) */}
          <div className={`absolute top-[48%] left-[12%] right-[12%] h-[2px] -translate-y-1/2 hidden lg:block z-0 pointer-events-none ${
            isLight
              ? 'bg-gradient-to-r from-amber-400/40 via-slate-300 to-amber-400/40'
              : 'bg-gradient-to-r from-[#E5B65F]/40 via-white/10 to-[#E5B65F]/40'
          }`}></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className={`relative rounded-2xl p-6 shadow-lg transition duration-300 flex flex-col justify-between min-h-[220px] border ${
              isLight
                ? 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
                : 'bg-[#131515] border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02]'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                    isLight ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-[#E5B65F] bg-[#E5B65F]/10 border-[#E5B65F]/20'
                  }`}>
                    STEP 01
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner border ${
                    isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-[#E5B65F]/10 border-[#E5B65F]/30 text-[#E5B65F]'
                  }`}>
                    1
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Apply Online</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
                  Submit your fine dining menus, luxury spa offerings, or rental catalogs through our seamless, intuitive 2-minute onboarding form.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`relative rounded-2xl p-6 shadow-lg transition duration-300 flex flex-col justify-between min-h-[220px] border ${
              isLight
                ? 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
                : 'bg-[#131515] border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02]'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                    isLight ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-[#E5B65F] bg-[#E5B65F]/10 border-[#E5B65F]/20'
                  }`}>
                    STEP 02
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner border ${
                    isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-[#E5B65F]/10 border-[#E5B65F]/30 text-[#E5B65F]'
                  }`}>
                    2
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Digital Integration</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
                  Our professional curation experts ingest your items, style gorgeous visuals, and optimize layouts for direct contactless guest displays.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative rounded-2xl p-6 shadow-lg transition duration-300 flex flex-col justify-between min-h-[220px] border ${
              isLight
                ? 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
                : 'bg-[#131515] border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02]'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                    isLight ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-[#E5B65F] bg-[#E5B65F]/10 border-[#E5B65F]/20'
                  }`}>
                    STEP 03
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner border ${
                    isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-[#E5B65F]/10 border-[#E5B65F]/30 text-[#E5B65F]'
                  }`}>
                    3
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Receive Suite Orders</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
                  As guests scan room QR codes, orders stream directly to your merchant dashboard with real-time audio and visual system notifications.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`relative rounded-2xl p-6 shadow-lg transition duration-300 flex flex-col justify-between min-h-[220px] border ${
              isLight
                ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                : 'bg-[#131515] border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02]'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    STEP 04
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-inner">
                    ✓
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Automated Revenue</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>
                  Prepare packages meticulously. Professional NEXG couriers gather the items, fulfill deliveries, and secure payouts automatically.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E5B65F]/10 pointer-events-none"></div>
        <div className={`max-w-[800px] mx-auto text-center relative z-10 p-6 sm:p-12 rounded-3xl md:rounded-[3rem] backdrop-blur-sm border ${
          isLight
            ? 'bg-amber-50/70 border-amber-200/80 shadow-lg'
            : 'bg-white/5 border-white/10'
        }`}>
          <h2 className={`font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Ready to redefine your reach?</h2>
          <p className={`mb-8 md:mb-10 text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-[#a0a1a1]'}`}>
            Applications are reviewed by our curation team within 24 hours to ensure our high standards of quality and service are maintained across the platform.
          </p>
          <button 
            onClick={() => onNavigate?.('merchant_onboarding')}
            className="w-full sm:w-auto bg-[#E5B65F] text-[#291800] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-[#ffddb1] transition shadow-[0_0_40px_rgba(229,182,95,0.3)] hover:shadow-[0_0_60px_rgba(229,182,95,0.5)] active:scale-95 cursor-pointer text-center min-h-[48px]"
          >
            Apply to Join NEXG
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#1a1c1c] border-white/10 text-[#a0a1a1]'}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className={`font-bold text-xl sm:text-2xl tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>NEXG</div>
          <div className="text-xs sm:text-sm text-center md:text-left">© 2026 NEXG App. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="#" className={`transition-colors py-2 px-1 min-h-[44px] flex items-center ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Merchant Terms</a>
            <a href="#" className={`transition-colors py-2 px-1 min-h-[44px] flex items-center ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Privacy</a>
            <a href="#" className={`transition-colors py-2 px-1 min-h-[44px] flex items-center ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
