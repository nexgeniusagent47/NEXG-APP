import { Apple, Play, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import nexgMobileMockup from '../assets/images/NEXG  PHONE MPCKUP.png';
import merchantImg from '../assets/images/couriers_hero_banner_1783931131203.jpg';
import courierImg from '../assets/images/courier_delivery_door_1783931148146.jpg';
import propertyImg from '../assets/images/properties_hero_1783930332445.jpg';

interface PromoProps {
  onNavigate?: (page: 'home' | 'merchants' | 'properties' | 'restaurants' | 'experiences' | 'merchant_onboarding' | 'couriers' | 'courier_onboarding') => void;
}

export default function Promo({ onNavigate }: PromoProps) {
  const { isLight } = useTheme();
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Take NEXG everywhere card */}
        <div className={`lg:col-span-7 rounded-[24px] sm:rounded-[32px] border overflow-hidden min-h-[315px] sm:min-h-[380px] md:min-h-[415px] lg:min-h-[480px] xl:min-h-[520px] relative flex items-stretch transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-br from-slate-100 via-white to-amber-50/20 border-slate-200 shadow-sm'
            : 'bg-[#252828] border-gray-800/80 shadow-2xl'
        }`}>
          
          {/* Left Content (Text and Badges) - Constrained width to ensure no overlap and pushed lower */}
          <div className="w-[48%] sm:w-[46%] md:w-[44%] lg:w-[50%] xl:w-[46%] pl-6 sm:pl-12 md:pl-16 pt-12 pb-8 sm:pb-12 md:pb-14 flex flex-col justify-end z-10 relative">
            <h2 className={`text-2xl sm:text-3xl lg:text-[40px] xl:text-[48px] font-bold leading-[1.12] tracking-tight mb-3 sm:mb-5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.promo.appHeading1}<br />{t.promo.appHeading2}
            </h2>
            <p className={`text-xs sm:text-sm md:text-base lg:text-base xl:text-lg mb-6 sm:mb-8 max-w-[240px] sm:max-w-[320px] leading-relaxed font-medium ${
              isLight ? 'text-slate-600' : 'text-gray-300'
            }`}>
              {t.promo.appSubtitle}
            </p>
            
            {/* App download badges stacked vertically as shown in sample photo */}
            <div className="flex flex-col gap-2.5 items-start">
              {/* Apple Store Button */}
              <button className={`w-fit flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[12px] transition-all text-left shadow-sm hover:shadow-md cursor-pointer ${
                isLight ? 'bg-slate-900 text-white hover:bg-black' : 'bg-[#1C1C1E] text-white hover:bg-black'
              }`}>
                <Apple size={18} className="fill-current text-white flex-shrink-0 sm:w-5 sm:h-5" />
                <div className="flex flex-col leading-none">
                  <span className="text-[6px] sm:text-[8px] uppercase tracking-wider text-gray-400 font-semibold">{t.promo.downloadOn}</span>
                  <span className="font-bold text-[12px] sm:text-[15px] mt-0.5 sm:mt-1">{t.promo.appStore}</span>
                </div>
              </button>
              
              {/* Google Play Button */}
              <button className={`w-fit flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] sm:rounded-[12px] transition-all text-left shadow-sm hover:shadow-md cursor-pointer ${
                isLight ? 'bg-slate-900 text-white hover:bg-black' : 'bg-[#1C1C1E] text-white hover:bg-black'
              }`}>
                <Play size={16} className="fill-current text-white flex-shrink-0 sm:w-4 sm:h-4" />
                <div className="flex flex-col leading-none">
                  <span className="text-[6px] sm:text-[8px] uppercase tracking-wider text-gray-400 font-semibold">{t.promo.getItOn}</span>
                  <span className="font-bold text-[12px] sm:text-[15px] mt-0.5 sm:mt-1">{t.promo.googlePlay}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - Hand holding Phone Mockup aligned perfectly to bottom right as in the reference screenshot */}
          <div className="absolute right-0 bottom-0 top-0 w-[52%] sm:w-[54%] md:w-[56%] lg:w-[50%] xl:w-[54%] flex items-end justify-end overflow-hidden z-0 pointer-events-none">
            <img 
              src={nexgMobileMockup} 
              alt="NEXG Concierge App Interface" 
              className="w-full h-full object-contain object-right-bottom drop-shadow-2xl translate-y-[2%] translate-x-[2%] hover:scale-[1.02] transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>

        </div>

        {/* Right Column: Stacked partner cards on desktop (lg), and multi-column row on tablet/mobile */}
        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-5 md:gap-6 lg:flex lg:flex-col lg:justify-between lg:h-full">
          {/* Card 1: For Merchants */}
          <div 
            onClick={() => onNavigate?.('merchants')}
            className={`flex items-stretch overflow-hidden rounded-[20px] h-[140px] lg:flex-1 lg:h-auto lg:min-h-[140px] xl:min-h-[150px] transition-all duration-300 cursor-pointer border group ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                : 'bg-[#252828] border-gray-800 hover:shadow-lg hover:border-gray-700'
            }`}
          >
            <div className="w-[110px] sm:w-[130px] flex-shrink-0 relative overflow-hidden">
              <img 
                src={merchantImg} 
                alt="For Merchants" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-grow flex flex-col justify-center px-5 sm:px-6">
              <h3 className={`font-bold text-[16px] sm:text-[18px] mb-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {t.promo.merchantsTitle}
              </h3>
              <p className={`text-[12px] sm:text-[13px] leading-snug mb-2 ${
                isLight ? 'text-slate-600' : 'text-gray-400'
              }`}>
                {t.promo.merchantsDesc}
              </p>
              <span className={`font-semibold flex items-center gap-1.5 text-[12px] sm:text-xs transition-colors ${
                isLight
                  ? 'text-[#B88728] group-hover:text-[#967C3B]'
                  : 'text-[#E5B65F] group-hover:text-[#ffddb1]'
              }`}>
                {t.promo.merchantsCta} <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* Card 2: For Couriers */}
          <div 
            onClick={() => onNavigate?.('couriers')}
            className={`flex items-stretch overflow-hidden rounded-[20px] h-[140px] lg:flex-1 lg:h-auto lg:min-h-[140px] xl:min-h-[150px] transition-all duration-300 cursor-pointer border group ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                : 'bg-[#252828] border-gray-800 hover:shadow-lg hover:border-gray-700'
            }`}
          >
            <div className="w-[110px] sm:w-[130px] flex-shrink-0 relative overflow-hidden">
              <img 
                src={courierImg} 
                alt="For Couriers" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-grow flex flex-col justify-center px-5 sm:px-6">
              <h3 className={`font-bold text-[16px] sm:text-[18px] mb-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {t.promo.couriersTitle}
              </h3>
              <p className={`text-[12px] sm:text-[13px] leading-snug mb-2 ${
                isLight ? 'text-slate-600' : 'text-gray-400'
              }`}>
                {t.promo.couriersDesc}
              </p>
              <span className={`font-semibold flex items-center gap-1.5 text-[12px] sm:text-xs transition-colors ${
                isLight
                  ? 'text-[#B88728] group-hover:text-[#967C3B]'
                  : 'text-[#E5B65F] group-hover:text-[#ffddb1]'
              }`}>
                {t.promo.couriersCta} <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* Card 3: For Properties */}
          <div 
            onClick={() => onNavigate?.('properties')}
            className={`flex items-stretch overflow-hidden rounded-[20px] h-[140px] lg:flex-1 lg:h-auto lg:min-h-[140px] xl:min-h-[150px] transition-all duration-300 cursor-pointer border group ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                : 'bg-[#252828] border-gray-800 hover:shadow-lg hover:border-gray-700'
            }`}
          >
            <div className="w-[110px] sm:w-[130px] flex-shrink-0 relative overflow-hidden">
              <img 
                src={propertyImg} 
                alt="For Properties" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-grow flex flex-col justify-center px-5 sm:px-6">
              <h3 className={`font-bold text-[16px] sm:text-[18px] mb-0.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {t.promo.propertiesTitle}
              </h3>
              <p className={`text-[12px] sm:text-[13px] leading-snug mb-2 ${
                isLight ? 'text-slate-600' : 'text-gray-400'
              }`}>
                {t.promo.propertiesDesc}
              </p>
              <span className={`font-semibold flex items-center gap-1.5 text-[12px] sm:text-xs transition-colors ${
                isLight
                  ? 'text-[#B88728] group-hover:text-[#967C3B]'
                  : 'text-[#E5B65F] group-hover:text-[#ffddb1]'
              }`}>
                {t.promo.propertiesCta} <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


