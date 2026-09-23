import { Building2, Store, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Stats() {
  const { isLight } = useTheme();

  return (
    <section className="py-12 px-6 sm:px-8 xl:px-16 max-w-[1400px] mx-auto">
      <div className={`rounded-[2rem] p-8 sm:p-12 lg:p-16 overflow-hidden relative transition duration-300 ${
        isLight
          ? 'bg-white text-slate-900 border border-slate-200 shadow-xl'
          : 'bg-[#0D1013] text-white shadow-2xl border border-white/5'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 relative z-10">
          <div className="lg:col-span-1">
            <h2 className={`text-2xl sm:text-[32px] font-bold mb-4 sm:mb-5 leading-[1.2] tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Trusted by guests<br/>across East Africa
            </h2>
            <p className={`mb-8 sm:mb-10 text-sm sm:text-[15px] max-w-sm ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              From hotels to homes, we make everyday exceptional.
            </p>
            <button className={`border px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              isLight
                ? 'border-slate-300 text-slate-700 hover:border-[#B88728] hover:text-[#B88728]'
                : 'border-gray-700 text-gray-200 hover:border-[#E5B65F] hover:text-[#E5B65F]'
            }`}>
              Our Partners
            </button>
          </div>
          
          <div className="lg:col-span-2">
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-14 border-b pb-10 sm:pb-14 ${
              isLight ? 'border-slate-200' : 'border-gray-800/80'
            }`}>
              <div className="flex items-start gap-3 sm:gap-4">
                 <Building2 className={`${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'} shrink-0`} size={28} strokeWidth={1.5} />
                 <div>
                   <div className="text-xl sm:text-[26px] font-bold mb-0.5 leading-none">50+</div>
                   <div className={`text-xs sm:text-[13px] font-medium mt-1 ${
                     isLight ? 'text-slate-600' : 'text-gray-400'
                   }`}>Hotel Partners</div>
                 </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                 <Store className={`${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'} shrink-0`} size={28} strokeWidth={1.5} />
                 <div>
                   <div className="text-xl sm:text-[26px] font-bold mb-0.5 leading-none">1,000+</div>
                   <div className={`text-xs sm:text-[13px] font-medium mt-1 ${
                     isLight ? 'text-slate-600' : 'text-gray-400'
                   }`}>Merchants</div>
                 </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                 <MapPin className={`${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'} shrink-0`} size={28} strokeWidth={1.5} />
                 <div>
                   <div className="text-xl sm:text-[26px] font-bold mb-0.5 leading-none">6</div>
                   <div className={`text-xs sm:text-[13px] font-medium mt-1 ${
                     isLight ? 'text-slate-600' : 'text-gray-400'
                   }`}>Cities</div>
                 </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                 <Clock className={`${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'} shrink-0`} size={28} strokeWidth={1.5} />
                 <div>
                   <div className="text-xl sm:text-[26px] font-bold mb-0.5 leading-none">24/7</div>
                   <div className={`text-xs sm:text-[13px] font-medium mt-1 leading-tight ${
                     isLight ? 'text-slate-600' : 'text-gray-400'
                   }`}>Concierge Support</div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
               <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default">
                 <div className={`h-12 w-12 sm:h-16 sm:w-16 transition-colors ${
                   isLight ? 'text-[#B88728]/70 group-hover:text-[#B88728]' : 'text-[#E5B65F]/60 group-hover:text-[#E5B65F]'
                 }`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10M8 22V6M12 22V2M16 22V8M20 22V12 M2 22h20"/></svg></div>
                 <div className={`text-xs sm:text-[13px] font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Nairobi</div>
               </div>
               <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default">
                 <div className={`h-12 w-12 sm:h-16 sm:w-16 transition-colors ${
                   isLight ? 'text-[#B88728]/70 group-hover:text-[#B88728]' : 'text-[#E5B65F]/60 group-hover:text-[#E5B65F]'
                 }`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10M8 22V6M12 22V2M16 22V8M20 22V12 M2 22h20"/></svg></div>
                 <div className={`text-xs sm:text-[13px] font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Kigali</div>
               </div>
               <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default">
                 <div className={`h-12 w-12 sm:h-16 sm:w-16 transition-colors ${
                   isLight ? 'text-[#B88728]/70 group-hover:text-[#B88728]' : 'text-[#E5B65F]/60 group-hover:text-[#E5B65F]'
                 }`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10M8 22V6M12 22V2M16 22V8M20 22V12 M2 22h20"/></svg></div>
                 <div className={`text-xs sm:text-[13px] font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Kampala</div>
               </div>
               <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default">
                 <div className={`h-12 w-12 sm:h-16 sm:w-16 transition-colors ${
                   isLight ? 'text-[#B88728]/70 group-hover:text-[#B88728]' : 'text-[#E5B65F]/60 group-hover:text-[#E5B65F]'
                 }`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10M8 22V6M12 22V2M16 22V8M20 22V12 M2 22h20"/></svg></div>
                 <div className={`text-xs sm:text-[13px] font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Zanzibar</div>
               </div>
               <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default">
                 <div className={`h-12 w-12 sm:h-16 sm:w-16 transition-colors ${
                   isLight ? 'text-[#B88728]/70 group-hover:text-[#B88728]' : 'text-[#E5B65F]/60 group-hover:text-[#E5B65F]'
                 }`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10M8 22V6M12 22V2M16 22V8M20 22V12 M2 22h20"/></svg></div>
                 <div className={`text-xs sm:text-[13px] font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Dar es Salaam</div>
               </div>
               <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-default">
                 <div className={`h-12 w-12 sm:h-16 sm:w-16 transition-colors ${
                   isLight ? 'text-[#B88728]/70 group-hover:text-[#B88728]' : 'text-[#E5B65F]/60 group-hover:text-[#E5B65F]'
                 }`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V10M8 22V6M12 22V2M16 22V8M20 22V12 M2 22h20"/></svg></div>
                 <div className={`text-xs sm:text-[13px] font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Arusha</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
