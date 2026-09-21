import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import LogoIcon from './LogoIcon';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate?: (page: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { isLight } = useTheme();
  const { t } = useLanguage();

  return (
    <footer
      className={`pt-16 sm:pt-24 pb-12 px-6 sm:px-8 xl:px-16 border-t transition-colors duration-300 ${
        isLight
          ? 'bg-slate-100 text-slate-800 border-slate-200'
          : 'bg-[#0e1012] text-[#f2f2f2] border-white/10'
      }`}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 sm:gap-12">
        <div className="col-span-2">
          <div 
            onClick={() => onNavigate && onNavigate('home')}
            className={`flex items-center gap-2 mb-6 ${onNavigate ? 'cursor-pointer' : ''}`}
          >
            <LogoIcon className="w-12 h-12" />
            <div className="flex flex-col ml-1">
              <span className={`font-black text-xl leading-none tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>
                NEXG
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B88728] dark:text-[#E5B65F] font-bold mt-1">
                Concierge
              </span>
            </div>
          </div>
          <p className={`text-sm sm:text-[15px] font-medium leading-relaxed max-w-sm ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            {t.footer.aboutText}
          </p>
        </div>
        
        <div className="col-span-1">
          <h4 className={`font-bold text-sm sm:text-[15px] mb-4 sm:mb-5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.footer.verticals}
          </h4>
          <ul className={`space-y-3 text-xs sm:text-[14px] font-medium ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            <li>
              <button onClick={() => onNavigate?.('restaurants')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.fineDining}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.('spa')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.spaWellness}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.('transport')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.vipMobility}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.('groceries')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.gourmetCellar}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.('experiences')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.experiences}
              </button>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className={`font-bold text-sm sm:text-[15px] mb-4 sm:mb-5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.footer.partners}
          </h4>
          <ul className={`space-y-3 text-xs sm:text-[14px] font-medium ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            <li>
              <button onClick={() => onNavigate?.('merchants')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.forMerchants}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.('couriers')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.forCouriers}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.('properties')} className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors cursor-pointer">
                {t.footer.forProperties}
              </button>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className={`font-bold text-sm sm:text-[15px] mb-4 sm:mb-5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t.footer.legalSupport}
          </h4>
          <ul className={`space-y-3 text-xs sm:text-[14px] font-medium ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            <li><a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors">{t.footer.conciergeDesk}</a></li>
            <li><a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors">{t.footer.termsOfService}</a></li>
            <li><a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors">{t.footer.privacyPolicy}</a></li>
            <li><a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors">{t.footer.safetyStandards}</a></li>
          </ul>
        </div>

        <div className="col-span-1 flex flex-col lg:items-end">
          <div className="flex flex-col lg:items-start w-full max-w-[120px]">
            <h4 className={`font-bold text-sm sm:text-[15px] mb-4 sm:mb-5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t.footer.connect}
            </h4>
            <div className={`flex items-center gap-4 ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              <a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-[#B88728] dark:hover:text-[#E5B65F] transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`max-w-[1400px] mx-auto mt-16 sm:mt-20 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-8 text-[12px] font-medium ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-gray-400'
      }`}>
        <div>
          {t.footer.rights}
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.footer.simulatedNotice}</span>
        </div>
      </div>
    </footer>
  );
}
