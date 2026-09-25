import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  QrCode, 
  TrendingUp, 
  Users, 
  LineChart, 
  Utensils, 
  Activity, 
  Car, 
  Compass, 
  Sparkles, 
  ShoppingBag, 
  ArrowLeft,
  DollarSign,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  CheckCircle,
  Globe,
  Star,
  Menu,
  X,
  Award,
  Sun,
  Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import LogoIcon from './LogoIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { formatKes, formatLocalizedNumber, interpolatePartnerCopy, partnerEconomicsCopy, PARTNER_ECONOMICS } from '../data/partnerEconomics';

import { useTheme } from '../context/ThemeContext';
import { responsiveProps } from './ResponsiveImage';

interface ForPropertiesProps {
  onNavigate: (page: any) => void;
}

const ECOSYSTEM_ICON_CLASS =
  'mb-4 text-gold group-hover:scale-110 transition-transform w-8 h-8 sm:w-10 sm:h-10';
const ecosystemCardSurface = (isLight: boolean) =>
  isLight
    ? 'bg-white hover:bg-amber-50/40 hover:shadow-[0_10px_30px_rgba(184,135,40,0.14)]'
    : 'bg-white/5 hover:bg-[#E5B65F]/10 hover:shadow-[0_0_20px_rgba(229,182,95,0.12)]';

export default function ForProperties({ onNavigate }: ForPropertiesProps) {
  const hostAccessEnabled = import.meta.env.DEV;
  // Navigation scrolling effect
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLight, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const economicsCopy = partnerEconomicsCopy[language].property;

  // Calculator states
  const [rooms, setRooms] = useState(25);
  const [occupancy, setOccupancy] = useState(70);
  const [averageMarkupPerOrderKes, setAverageMarkupPerOrderKes] = useState(500);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (page: any) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  // Illustrative order-volume estimate: 30 days divided by an assumed 3-night stay,
  // with one order per estimated stay. The owner's share applies to markup only.
  const estimatedMonthlyOrders = Math.round(rooms * (occupancy / 100) * 10);
  const totalOrderMarkupKes = estimatedMonthlyOrders * averageMarkupPerOrderKes;
  const totalPropertyShareKes = Math.round(
    totalOrderMarkupKes * (PARTNER_ECONOMICS.propertyMarkupSharePercent / 100),
  );

  return (
    <div className={`${isLight ? 'bg-[#F8F9FA] text-slate-900' : 'bg-[#0d0e0e] text-[#ececed]'} font-sans antialiased selection:bg-[#E5B65F] selection:text-black min-h-screen transition-colors duration-300`}>
      
      {/* Adaptive Docked Navigation for Properties */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
          scrolled 
            ? (isLight ? 'bg-[#F8F9FA]/85 backdrop-blur-2xl shadow-xs py-3' : 'bg-[#0d0e0e]/85 backdrop-blur-2xl shadow-xs py-3')
            : 'bg-transparent py-5 sm:py-6'
        }`} 
        id="top-nav"
      >
        <div className="px-4 sm:px-6 max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition backdrop-blur-md cursor-pointer min-w-[40px] min-h-[40px] ${
                isLight
                  ? 'bg-white/80 hover:bg-white text-slate-800 shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={t.ui.forProperties.s_75dde0}
              aria-label={t.ui.forProperties.s_ce7472}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Elegant brand info */}
            <div className="flex items-center gap-2 cursor-pointer py-1" onClick={() => onNavigate('home')}>
              {/* The wordmark already spells NEXG, so no text sits beside it. */}
              <LogoIcon variant="wordmark" className="h-7 w-auto" />
            </div>
          </div>

          {/* Desktop links & In-Page Property Anchors */}
          <div className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-semibold">
            {scrolled ? (
              <>
                <a href="#ecosystem-section" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.ecosystem}</a>
                <a href="#qr-section" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.qrTech}</a>
                <a href="#revenue-calculator" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.revShareCalc}</a>
                <a href="#partners-section" className={`transition-colors cursor-pointer py-2 px-2 hover:text-[#E5B65F] ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{t.partnerHeaders.integrations}</a>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('properties')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-amber-800 font-bold' : 'text-[#E5B65F] font-bold'}`}>{t.nav.forProperties}</button>
                <button onClick={() => onNavigate('merchants')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-slate-700 hover:text-amber-800' : 'text-gray-300 hover:text-white'}`}>{t.nav.forMerchants}</button>
                <button onClick={() => onNavigate('couriers')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-slate-700 hover:text-amber-800' : 'text-gray-300 hover:text-white'}`}>{t.nav.forCouriers}</button>
                <button onClick={() => onNavigate('experiences')} className={`transition-colors cursor-pointer py-2 px-2 ${isLight ? 'text-slate-700 hover:text-amber-800' : 'text-gray-300 hover:text-white'}`}>{t.nav.experiences}</button>
              </>
            )}

            {/* Quick Action Docked CTA */}
            <button
              onClick={() => onNavigate('merchant_onboarding')}
              className={`px-4 py-2 rounded-full font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 ${
                isLight 
                  ? 'bg-[#B88728] hover:bg-[#9e721d] text-slate-950'
                  : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-[#291800]'
              }`}
            >
              {t.partnersPortal.partnerNexg}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle Button */}
            <button
              id="properties-theme-toggle-btn"
              onClick={toggleTheme}
              className={`flex items-center justify-center w-9 h-9 rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'bg-white/80 hover:bg-white border-slate-200 text-amber-800 shadow-2xs'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-[#E5B65F]'
              }`}
              aria-label={t.ui.forProperties.s_b74c4e}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* Mobile hamburger & controls */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              id="properties-mobile-theme-btn"
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-amber-800'
                  : 'bg-white/10 border-white/15 text-[#E5B65F]'
              }`}
              title={t.ui.forProperties.s_b74c4e}
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center transition-colors focus:outline-none cursor-pointer min-w-[40px] min-h-[40px] ${
                isLight ? 'text-slate-800 hover:text-amber-800' : 'text-white hover:text-[#E5B65F]'
              }`}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                <button onClick={() => handleMobileNav('home')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">{t.ui.forProperties.s_a1e9f9}</button>
                <button onClick={() => handleMobileNav('properties')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors text-[#E5B65F]">{t.ui.forProperties.s_38769a}</button>
                <button onClick={() => handleMobileNav('merchants')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">{t.ui.forProperties.s_52a6f3}</button>
                <button onClick={() => handleMobileNav('couriers')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">{t.ui.forProperties.s_18414d}</button>
                <button onClick={() => handleMobileNav('experiences')} className="text-left py-2 hover:text-[#E5B65F] w-full transition-colors">Experiences</button>
              </div>
              <button 
                onClick={() => handleMobileNav('merchant_onboarding')}
                className="w-full text-center text-sm font-bold bg-[#E5B65F] text-[#291800] rounded-xl py-3 hover:bg-[#ffddb1] transition-colors"
              >{t.ui.forProperties.s_7bf908}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Dual Day/Night Image & Organic Bottom Blend */}
      <section className="relative h-[85vh] min-h-[520px] flex flex-col justify-end pb-[5%] sm:pb-[5%] overflow-hidden z-10 pt-20">
        {/* Background Image with Ambient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/70 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/95 via-[#F8F9FA]/70 to-transparent z-10"></div>
              <img 
                src={responsiveProps('properties_hero_light_1789911827135.jpg', '100vw')?.src} 
                alt={t.ui.forProperties.s_8d365a} 
                className="w-full h-full object-cover opacity-85 brightness-105 transition-transform duration-[10000ms] hover:scale-105" 
                referrerPolicy="no-referrer"
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0e] via-[#0d0e0e]/80 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent z-10"></div>
              <img 
                src={responsiveProps('properties_hero_1783930332445.jpg', '100vw')?.src} 
                alt={t.ui.forProperties.s_0293af} 
                className="w-full h-full object-cover opacity-65 transition-transform duration-[10000ms] hover:scale-105" 
                referrerPolicy="no-referrer"
              />
            </>
          )}

          {/* Organic Bottom Blend Feathering */}
          <div className={`absolute -bottom-1 left-0 right-0 h-32 z-10 ${
            isLight ? 'bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/90 to-transparent' : 'bg-gradient-to-t from-[#0d0e0e] via-[#0d0e0e]/90 to-transparent'
          }`} />
        </div>

        {/* Content Container */}
        <div className="container mx-auto max-w-[1400px] relative z-20 px-4 sm:px-8 xl:px-16 w-full">
          <div className="max-w-3xl">
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-[1.15] tracking-tight drop-shadow-md ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_31c559}</h1>
            <p className="text-[#E5B65F] text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 tracking-tight">{t.ui.forProperties.s_5fbc63}</p>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-10 max-w-2xl leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-gray-200'}`}>{t.ui.forProperties.s_06fb24}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => hostAccessEnabled && onNavigate('host_apply')}
                disabled={!hostAccessEnabled}
                className="flex items-center justify-center gap-2 bg-[#E5B65F] hover:bg-[#ffddb1] text-[#291800] px-8 py-4 rounded-full font-bold text-base transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-75"
              >{hostAccessEnabled ? 'Apply for Host access' : 'Host applications are not open yet'}<ArrowRight size={18} />
              </button>
              <button className={`flex items-center justify-center border px-8 py-4 rounded-full font-semibold text-base transition-colors shadow-md cursor-pointer ${
                isLight
                  ? 'border-slate-300 text-slate-800 hover:bg-slate-100 bg-white/70 shadow-sm'
                  : 'border-white/30 backdrop-blur-md text-white hover:bg-white/10'
              }`}>{t.ui.forProperties.s_7ee992}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Ecosystem Grid */}
      <section className={`py-16 sm:py-24 px-4 sm:px-8 xl:px-16 transition-colors duration-300 ${
        isLight ? 'bg-white/60' : 'bg-transparent'
      }`} id="ecosystem-section">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-8">
            <div className="max-w-xl">
              <span className={`font-bold tracking-widest text-xs uppercase px-3 py-1.5 rounded-full ${
                isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/10 text-[#E5B65F]'
              }`}>{t.ui.forProperties.s_fe3f95}</span>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-4 tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>{t.ui.forProperties.s_f907f8}</h2>
            </div>
            <div className={`max-w-sm text-xs sm:text-sm leading-relaxed font-medium ${
              isLight ? 'text-slate-600' : 'text-[#a0a1a1]'
            }`}>{t.ui.forProperties.s_ee7b88}</div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Fine Dining */}
            <div className="group cursor-default">
              <div className={`aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 transition duration-300 hover:-translate-y-2 shadow-sm ${
                ecosystemCardSurface(isLight)
              }`}>
                <Utensils className={ECOSYSTEM_ICON_CLASS} />
                <p className={`font-bold text-xs sm:text-sm text-center mb-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{t.ui.forProperties.s_a3fb7a}</p>
                <p className={`text-[10px] text-center hidden sm:block ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>{t.ui.forProperties.s_061f53}</p>
              </div>
            </div>

            {/* Spa & Wellness */}
            <div className="group cursor-default">
              <div className={`aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 transition duration-300 hover:-translate-y-2 shadow-sm ${
                ecosystemCardSurface(isLight)
              }`}>
                <Sparkles className={ECOSYSTEM_ICON_CLASS} />
                <p className={`font-bold text-xs sm:text-sm text-center mb-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{t.ui.forProperties.s_d8481d}</p>
                <p className={`text-[10px] text-center hidden sm:block ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>In-suite organic therapies</p>
              </div>
            </div>

            {/* Luxury Transport */}
            <div className="group cursor-default">
              <div className={`aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 transition duration-300 hover:-translate-y-2 shadow-sm ${
                ecosystemCardSurface(isLight)
              }`}>
                <Car className={ECOSYSTEM_ICON_CLASS} />
                <p className={`font-bold text-xs sm:text-sm text-center mb-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{t.ui.forProperties.s_c9bc84}</p>
                <p className={`text-[10px] text-center hidden sm:block ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>{t.ui.forProperties.s_73ba7f}</p>
              </div>
            </div>

            {/* Local Adventures */}
            <div className="group cursor-default">
              <div className={`aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 transition duration-300 hover:-translate-y-2 shadow-sm ${
                ecosystemCardSurface(isLight)
              }`}>
                <Compass className={ECOSYSTEM_ICON_CLASS} />
                <p className={`font-bold text-xs sm:text-sm text-center mb-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>{t.ui.forProperties.s_4d2dec}</p>
                <p className={`text-[10px] text-center hidden sm:block ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>{t.ui.forProperties.s_a969aa}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The QR Advantage */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Card Left */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-[#E5B65F]/5 rounded-[40px] blur-3xl"></div>
            <div className={`relative rounded-2xl sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden transition-colors duration-300 ${
              isLight
                ? 'bg-white border border-slate-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.06)]'
                : 'bg-[#131515] border border-white/10'
            }`}>
              <div className="flex items-center gap-4 mb-6 sm:mb-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isLight
                    ? 'bg-amber-100/70 border border-amber-300 text-amber-800'
                    : 'bg-white/5 border border-white/10 text-[#E5B65F]'
                }`}>
                  <QrCode size={24} />
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>{t.ui.forProperties.s_5bfbb7}</h3>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isLight ? 'text-slate-600' : 'text-gray-400'
                  }`}>{t.ui.forProperties.s_0a3693}</p>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    isLight
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-white/5 border border-white/10 text-[#E5B65F]'
                  }`}>
                    1
                  </div>
                  <div>
                    <h4 className={`font-bold text-base sm:text-lg mb-1 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>Room-Specific Precision</h4>
                    <p className={`leading-relaxed text-xs sm:text-sm ${
                      isLight ? 'text-slate-600' : 'text-[#a0a1a1]'
                    }`}>{t.ui.forProperties.s_1be9e5}</p>
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    isLight
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-white/5 border border-white/10 text-[#E5B65F]'
                  }`}>
                    2
                  </div>
                  <div>
                    <h4 className={`font-bold text-base sm:text-lg mb-1 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>{t.ui.forProperties.s_d08ccb}</h4>
                    <p className={`leading-relaxed text-xs sm:text-sm ${
                      isLight ? 'text-slate-600' : 'text-[#a0a1a1]'
                    }`}>{t.ui.forProperties.s_a2cb3c}</p>
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    isLight
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-white/5 border border-white/10 text-[#E5B65F]'
                  }`}>
                    3
                  </div>
                  <div>
                    <h4 className={`font-bold text-base sm:text-lg mb-1 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>{t.ui.forProperties.s_0e5ae2}</h4>
                    <p className={`leading-relaxed text-xs sm:text-sm ${
                      isLight ? 'text-slate-600' : 'text-[#a0a1a1]'
                    }`}>
                      Food, Spa sessions, Safaris, and luxury rentals are all combined cleanly under one highly elegant layout, custom-tailored to your suite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graphic Right */}
          <div className="order-1 lg:order-2">
            <div className={`h-[320px] sm:h-[450px] lg:h-[550px] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl relative group border ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={t.ui.forProperties.s_f77be3} 
                src={responsiveProps('qr_advantage_1783930346328.jpg', '100vw')?.src} 
              />
              <div className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 backdrop-blur-xl p-4 sm:p-6 rounded-2xl z-20 shadow-lg border ${
                isLight
                  ? 'bg-white/95 border-slate-200 text-slate-900'
                  : 'bg-[#131515]/95 border-white/10 text-white'
              }`}>
                <p className={`text-xl sm:text-2xl font-bold mb-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>94% User Adoption</p>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-300'
                }`}>{t.ui.forProperties.s_271358}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why Hosts Choose NEXG (6 Pillars) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto" id="why-hosts-choose">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 rounded-full ${
            isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/10 text-[#E5B65F]'
          }`}>{t.ui.forProperties.s_e56df8}</span>
          <h2 className={`text-2xl sm:text-3xl md:text-5xl font-extrabold mt-4 mb-6 tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>{t.ui.forProperties.s_8c8458}</h2>
          
          {/* Slogan Pill */}
          <div className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-6 px-6 py-3 rounded-full shadow-lg relative overflow-hidden border ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
              : 'bg-[#131515] border-white/10 text-gray-200'
          }`}>
            <div className="absolute inset-0 bg-[#E5B65F]/5 blur-md pointer-events-none"></div>
            <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-gray-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B65F] ring-2 ring-[#E5B65F]/25"></span>{t.ui.forProperties.s_21f4bb}</span>
            <span className={`hidden sm:inline font-light ${isLight ? 'text-slate-300' : 'text-gray-600'}`}>|</span>
            <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight flex items-center gap-1.5 ${
              isLight ? 'text-amber-800' : 'text-[#E5B65F]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B65F] ring-2 ring-[#E5B65F]/25"></span>{t.ui.forProperties.s_d300d6}</span>
            <span className={`hidden sm:inline font-light ${isLight ? 'text-slate-300' : 'text-gray-600'}`}>|</span>
            <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-gray-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B65F] ring-2 ring-[#E5B65F]/25"></span>{t.ui.forProperties.s_e7f7ee}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Pillar 1: Enhanced Experience */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xl shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border-white/10 hover:border-[#E5B65F]/30 hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-[#E5B65F]/10 border border-[#E5B65F]/20 text-[#E5B65F] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Sparkles size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_a2f3a7}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_f90548}</p>
          </div>

          {/* Pillar 2: 5-Star Reviews */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-xl shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border-white/10 hover:border-[#E5B65F]/30 hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-[#E5B65F]/10 border border-[#E5B65F]/20 text-[#E5B65F] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Star size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>5-Star Reviews</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_d15371}</p>
          </div>

          {/* Pillar 3: Earn More Income */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xl shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border-white/10 hover:border-[#E5B65F]/30 hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-[#E5B65F]/10 border border-[#E5B65F]/20 text-[#E5B65F] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <DollarSign size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_338ed9}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_a97bcc}</p>
          </div>

          {/* Pillar 4: Stand Out */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-xl shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border-white/10 hover:border-[#E5B65F]/30 hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-[#E5B65F]/10 border border-[#E5B65F]/20 text-[#E5B65F] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Award size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_70a8da}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_7a1f3a}</p>
          </div>

          {/* Pillar 5: We Handle Everything */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-rose-400 hover:shadow-xl shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border-white/10 hover:border-[#E5B65F]/30 hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-[#E5B65F]/10 border border-[#E5B65F]/20 text-[#E5B65F] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Briefcase size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_49f179}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_f04a9d}</p>
          </div>

          {/* Pillar 6: Trusted & Safe */}
          <div className={`group cursor-default rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition duration-300 hover:-translate-y-1 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl shadow-sm'
              : 'bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border-white/10 hover:border-[#E5B65F]/30 hover:shadow-[0_0_30px_rgba(229,182,95,0.1)]'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-[#E5B65F]/10 border border-[#E5B65F]/20 text-[#E5B65F] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_4216f1}</h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_182ad0}</p>
          </div>

        </div>
      </section>

      {/* Powerful Analytics */}
      <section className={`py-16 sm:py-24 border-y transition-colors duration-300 ${
        isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-[#131515] border-white/10'
      }`}>
        <div className="px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className={`font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 rounded-full ${
              isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/10 text-[#E5B65F]'
            }`}>{t.ui.forProperties.s_53cdfb}</span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-4 sm:mb-6 tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>{t.ui.forProperties.s_785c45}</h2>
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg ${
              isLight ? 'text-slate-600' : 'text-[#a0a1a1]'
            }`}>{t.ui.forProperties.s_7c6eec}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Analytics Card 1 */}
            <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-md hover:shadow-xl text-slate-900'
                : 'bg-white/5 border-white/10 shadow-md hover:shadow-lg text-white'
            }`}>
              <div>
                <div className="mb-6 flex justify-between items-start">
                  <div className={`p-3 rounded-2xl border ${
                    isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white/5 border-white/10 text-[#E5B65F]'
                  }`}>
                    <TrendingUp size={24} />
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{t.ui.forProperties.s_c5bb5d}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>+28%</p>
                  </div>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_d178f4}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_d887cc}</p>
              </div>
              <div className={`mt-8 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>{t.ui.forProperties.s_4fdd58}</span>
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>12.4%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div className="bg-[#E5B65F] h-full rounded-full" style={{ width: '12.4%' }}></div>
                </div>
              </div>
            </div>

            {/* Analytics Card 2 */}
            <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-md hover:shadow-xl text-slate-900'
                : 'bg-white/5 border-white/10 shadow-md hover:shadow-lg text-white'
            }`}>
              <div>
                <div className="mb-6 flex justify-between items-start">
                  <div className={`p-3 rounded-2xl border ${
                    isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white/5 border-white/10 text-[#E5B65F]'
                  }`}>
                    <Users size={24} />
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{t.ui.forProperties.s_052b34}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>4.9 / 5</p>
                  </div>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_176079}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_341a50}</p>
              </div>
              <div className={`mt-8 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>{t.ui.forProperties.s_e87389}</span>
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>88.0%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div className="bg-[#E5B65F] h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>

            {/* Analytics Card 3 */}
            <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition sm:max-lg:col-span-2 ${
              isLight
                ? 'bg-white border-slate-200 shadow-md hover:shadow-xl text-slate-900'
                : 'bg-white/5 border-white/10 shadow-md hover:shadow-lg text-white'
            }`}>
              <div>
                <div className="mb-6 flex justify-between items-start">
                  <div className={`p-3 rounded-2xl border ${
                    isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white/5 border-white/10 text-[#E5B65F]'
                  }`}>
                    <LineChart size={24} />
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{t.ui.forProperties.s_8332c9}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>Realtime</p>
                  </div>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_e09921}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_0d3b7b}</p>
              </div>
              <div className={`mt-8 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>{t.ui.forProperties.s_3b6c18}</span>
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>94.2%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  <div className="bg-[#E5B65F] h-full rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Step Onboarding Timeline Flow */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto" id="how-it-works-timeline">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className={`font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 rounded-full ${
            isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/10 text-[#E5B65F]'
          }`}>{t.ui.forProperties.s_4c36e1}</span>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-4 sm:mb-6 tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            4 Simple Steps to Get Started
          </h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-[#a0a1a1]'
          }`}>{t.ui.forProperties.s_a5d6a1}</p>
        </div>

        {/* Timeline track wrapper */}
        <div className="relative">
          {/* Connector Line (Desktop only) */}
          <div className={`absolute top-[48%] left-[12%] right-[12%] h-[2px] -translate-y-1/2 hidden lg:block z-0 pointer-events-none ${
            isLight
              ? 'bg-gradient-to-r from-amber-300 via-slate-300 to-amber-300'
              : 'bg-gradient-to-r from-[#E5B65F]/40 via-white/10 to-[#E5B65F]/40'
          }`}></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className={`relative rounded-2xl p-6 transition duration-300 flex flex-col justify-between min-h-[220px] ${
              isLight
                ? 'bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg shadow-sm text-slate-900'
                : 'bg-[#131515] border border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02] shadow-lg text-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                    isLight
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-[#E5B65F]/10 text-[#E5B65F] border-[#E5B65F]/20'
                  }`}>{t.ui.forProperties.s_2bf27f}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${
                    isLight
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-[#E5B65F]/10 border border-[#E5B65F]/30 text-[#E5B65F]'
                  }`}>
                    1
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_8fe3e8}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_8c288d}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`relative rounded-2xl p-6 transition duration-300 flex flex-col justify-between min-h-[220px] ${
              isLight
                ? 'bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg shadow-sm text-slate-900'
                : 'bg-[#131515] border border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02] shadow-lg text-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                    isLight
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-[#E5B65F]/10 text-[#E5B65F] border-[#E5B65F]/20'
                  }`}>{t.ui.forProperties.s_c24cae}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${
                    isLight
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-[#E5B65F]/10 border border-[#E5B65F]/30 text-[#E5B65F]'
                  }`}>
                    2
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_589ee1}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_d5d3ea}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative rounded-2xl p-6 transition duration-300 flex flex-col justify-between min-h-[220px] ${
              isLight
                ? 'bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg shadow-sm text-slate-900'
                : 'bg-[#131515] border border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02] shadow-lg text-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                    isLight
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-[#E5B65F]/10 text-[#E5B65F] border-[#E5B65F]/20'
                  }`}>{t.ui.forProperties.s_4d81b2}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${
                    isLight
                      ? 'bg-amber-100 border border-amber-300 text-amber-800'
                      : 'bg-[#E5B65F]/10 border border-[#E5B65F]/30 text-[#E5B65F]'
                  }`}>
                    3
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_872061}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_534294}</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`relative rounded-2xl p-6 transition duration-300 flex flex-col justify-between min-h-[220px] ${
              isLight
                ? 'bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-lg shadow-sm text-slate-900'
                : 'bg-[#131515] border border-white/10 hover:border-[#E5B65F]/40 hover:bg-white/[0.02] shadow-lg text-white'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{t.ui.forProperties.s_e3b925}</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs shadow-inner">
                    ✓
                  </div>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.ui.forProperties.s_aaa399}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-[#a0a1a1]'}`}>{t.ui.forProperties.s_46f477}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Monetize Every Stay - Interactive Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto">
        <div className={`rounded-3xl sm:rounded-[40px] p-5 sm:p-8 md:p-14 relative overflow-hidden shadow-2xl transition-colors duration-300 border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#1a1c1c] border-white/10 text-white'
        }`}>
          {/* Background Highlight */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7a5821]/15 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Content Left */}
            <div>
              <span className={`font-bold tracking-wider text-xs uppercase px-3 py-1 rounded-full mb-4 sm:mb-6 inline-block border ${
                isLight
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-[#E5B65F]/10 text-[#E5B65F] border-[#E5B65F]/20'
              }`}>{t.ui.forProperties.s_a62509}</span>
              <h2 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>{t.ui.forProperties.s_f59c46}</h2>
              <p className={`text-sm sm:text-base md:text-lg mb-6 sm:mb-10 leading-relaxed ${
                isLight ? 'text-slate-600 font-medium' : 'text-gray-300'
              }`}>{interpolatePartnerCopy(economicsCopy.explainer, {
                share: PARTNER_ECONOMICS.propertyMarkupSharePercent,
              })}</p>

              <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-10">
                <div>
                  <p className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>{PARTNER_ECONOMICS.propertyMarkupSharePercent}%</p>
                  <p className={`text-[10px] sm:text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{economicsCopy.markupShareLabel}</p>
                </div>
                <div>
                  <p className={`text-3xl sm:text-4xl font-extrabold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>
                    {interpolatePartnerCopy(economicsCopy.noticePeriodValue, {
                      days: formatLocalizedNumber(PARTNER_ECONOMICS.propertyShareNoticeDays, language),
                    })}
                  </p>
                  <p className={`text-[10px] sm:text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{economicsCopy.noticePeriodLabel}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className={`flex-shrink-0 ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`} size={20} />
                  <span className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>{t.ui.forProperties.s_c50b8f}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className={`flex-shrink-0 ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`} size={20} />
                  <span className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>Multi-currency payment gateways for global travelers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className={`flex-shrink-0 ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`} size={20} />
                  <span className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-200'}`}>{t.ui.forProperties.s_818f94}</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Right */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border ${
              isLight
                ? 'bg-slate-50/90 border-slate-200 text-slate-900'
                : 'bg-white/5 backdrop-blur-xl border-white/10 text-white'
            }`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-6 flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <DollarSign size={20} className={isLight ? 'text-amber-800' : 'text-[#E5B65F]'} />{economicsCopy.heading}</h3>

              <div className="space-y-6 mb-6 sm:mb-8">
                {/* Sliders */}
                <div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-2">
                    <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>{economicsCopy.rooms}</span>
                    <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>{formatLocalizedNumber(rooms, language)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="150" 
                    value={rooms}
                    onChange={(e) => setRooms(parseInt(e.target.value))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                      isLight ? 'bg-slate-300 accent-amber-600' : 'bg-gray-700 accent-[#E5B65F]'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-2">
                    <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>{economicsCopy.occupancy}</span>
                    <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>{formatLocalizedNumber(occupancy, language)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={occupancy}
                    onChange={(e) => setOccupancy(parseInt(e.target.value))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                      isLight ? 'bg-slate-300 accent-amber-600' : 'bg-gray-700 accent-[#E5B65F]'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-2">
                    <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>{economicsCopy.averageMarkupPerOrder}</span>
                    <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>{formatKes(averageMarkupPerOrderKes, language)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50"
                    max="5000"
                    step="50"
                    value={averageMarkupPerOrderKes}
                    onChange={(e) => setAverageMarkupPerOrderKes(parseInt(e.target.value))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                      isLight ? 'bg-slate-300 accent-amber-600' : 'bg-gray-700 accent-[#E5B65F]'
                    }`}
                  />
                </div>
              </div>

              {/* Outputs */}
              <div className={`border-t pt-6 space-y-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className={`flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center p-4 rounded-xl border ${
                  isLight
                    ? 'bg-amber-50/80 border-amber-200 text-slate-900'
                    : 'bg-white/5 border-white/5 text-white'
                }`}>
                  <span className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>{economicsCopy.estimatedMonthlyShare}</span>
                  <span className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-amber-800' : 'text-[#E5B65F]'}`}>
                    {formatKes(totalPropertyShareKes, language)}
                  </span>
                </div>

                <div className={`space-y-2.5 px-1 text-[11px] sm:text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  <div className="flex justify-between gap-4">
                    <span>{economicsCopy.estimatedMonthlyOrders}</span>
                    <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatLocalizedNumber(estimatedMonthlyOrders, language)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>{economicsCopy.totalEstimatedMarkup}</span>
                    <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatKes(totalOrderMarkupKes, language)}</span>
                  </div>
                </div>

                <div className={`rounded-xl p-3 sm:p-4 text-[11px] sm:text-xs leading-relaxed font-medium border space-y-2 ${
                  isLight
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-[#E5B65F]/10 border-[#E5B65F]/20 text-[#E5B65F]'
                }`}>
                  <p>{interpolatePartnerCopy(economicsCopy.rateNotice, {
                    notice: formatLocalizedNumber(PARTNER_ECONOMICS.propertyShareNoticeDays, language),
                  })}</p>
                  <p>{interpolatePartnerCopy(economicsCopy.estimateBasis, {
                    share: PARTNER_ECONOMICS.propertyMarkupSharePercent,
                  })}</p>
                </div>

                <button 
                  onClick={() => onNavigate('merchant_onboarding')}
                  className="w-full py-4 mt-4 bg-[#E5B65F] hover:bg-[#ffddb1] text-[#291800] rounded-xl font-bold transition text-sm tracking-wide shadow-md cursor-pointer"
                >{t.ui.forProperties.s_ea763f}</button>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* Call to Action Section with sunset background */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-3xl sm:rounded-[48px] overflow-hidden min-h-[350px] sm:min-h-[500px] flex items-center justify-center text-center shadow-2xl border border-white/10">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src={responsiveProps('properties_cta_1783930356640.jpg', '100vw')?.src} 
              alt={t.ui.forProperties.s_29b967} 
              className="w-full h-full object-cover transition-transform duration-[8000ms] hover:scale-105" 
            />
          </div>

          <div className="relative z-20 p-6 sm:p-8 md:p-16 max-w-3xl text-white">
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
              Ready to Transform Your Property?
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg mb-6 sm:mb-10 leading-relaxed max-w-2xl mx-auto">{t.ui.forProperties.s_110820}</p>
            <button 
              onClick={() => hostAccessEnabled && onNavigate('host_apply')}
              disabled={!hostAccessEnabled}
              className="bg-[#E5B65F] hover:bg-[#ffddb1] text-[#291800] px-8 sm:px-10 py-3.5 sm:py-5 rounded-full font-bold text-sm sm:text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl disabled:cursor-not-allowed disabled:opacity-75"
            >{hostAccessEnabled ? 'Apply for Host access' : 'Host applications are not open yet'}</button>
            <p className="mt-8 text-gray-300 text-[10px] sm:text-xs tracking-wider uppercase font-semibold">
              Ultra-Fast Onboarding • Dedicated Account Success Managers • Guaranteed Lift
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#111212] text-white border-t border-white/10 py-12 sm:py-16 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto rounded-t-3xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
          
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-1 cursor-pointer mb-6" onClick={() => onNavigate('home')}>
              {/* The wordmark already spells NEXG, so no text sits beside it. */}
              <LogoIcon variant="wordmark" className="h-9 w-auto" />
            </div>
            <p className="text-[#a0a1a1] text-sm leading-relaxed mb-6">{t.ui.forProperties.s_89bdbf}</p>
            <div className="flex space-x-4">
              <button className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-[#E5B65F] hover:border-[#E5B65F] transition-colors bg-white/5">
                <Star size={16} />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-[#E5B65F] hover:border-[#E5B65F] transition-colors bg-white/5">
                <Globe size={16} />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-[#E5B65F] hover:border-[#E5B65F] transition-colors bg-white/5">
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Company</h4>
            <div className="flex flex-col space-y-3">
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_c887b9}</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">Careers</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">Blog</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">Press</button>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Resources</h4>
            <div className="flex flex-col space-y-3">
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_110158}</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_9ad0cc}</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">FAQs</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_1d2be9}</button>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Legal</h4>
            <div className="flex flex-col space-y-3">
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_0c8a9a}</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_9db108}</button>
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold text-gray-400 hover:text-[#E5B65F] text-left bg-transparent border-none cursor-pointer">{t.ui.forProperties.s_e6e178}</button>
            </div>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">{t.ui.forProperties.s_ec3c35}</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-2.5 w-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
              />
              <button className="bg-[#E5B65F] text-[#291800] rounded-r-xl px-4 flex items-center justify-center hover:bg-[#ffddb1] transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
          <p>© 2026 NEXG App. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Globe size={14} /> Global</span>
            <span className="flex items-center gap-1.5">{t.ui.forProperties.s_a9577d}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
