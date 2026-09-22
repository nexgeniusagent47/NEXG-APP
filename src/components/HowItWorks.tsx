import React from 'react';
import { QrCode, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { isLight } = useTheme();
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-8 xl:px-16 max-w-[1400px] mx-auto overflow-hidden bg-transparent">
      <div className="max-w-2xl mx-auto mb-16 sm:mb-20 text-center">
        {/* font-bold, not font-extrabold. The heading face here resolves to Quicksand,
            whose variable file declares `font-weight: 300 700` and has no master above
            700 — so an 800 request does not fail, it renders SYNTHETIC bold: the 700
            outlines dilated, which closes the counters and reads muddier rather than
            heavier. Measured: at 40px this string paints 637.69px at 700, 800 and 900
            alike, while 400 paints 616.67px.

            This was the only element on the whole home page asking a family for a weight
            it cannot supply. The other 82 `font-extrabold` uses are on Cooper, which
            ships a real 800. Verified with scripts/_diag-synthetic-weights.mjs. */}
        <h2 className={`text-3xl sm:text-4xl md:text-[46px] font-bold mb-4 tracking-tight leading-none ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          {t.howItWorks.heading}
        </h2>
        <p className={`text-sm sm:text-base font-medium max-w-md mx-auto ${
          isLight ? 'text-slate-600' : 'text-gray-400'
        }`}>
          {t.howItWorks.subtitle}
        </p>
      </div>

      {/* MOBILE VERSION (Vertical Timeline - stops and continues between icons) */}
      <div className="md:hidden relative max-w-xl mx-auto flex flex-col gap-12">
        {/* Step 1 */}
        <div className="relative flex items-center gap-6 sm:gap-10 text-left group">
          <div className="relative flex-shrink-0 z-10">
            <div className={`w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-full border flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105 ${
              isLight
                ? 'border-[#B88728]/35 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
                : 'border-[#E5B65F]/30 bg-[#161819] shadow-[0_8px_25px_rgba(0,0,0,0.6)]'
            }`}>
              <QrCode size={28} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <div className={`absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm border-2 shadow-sm ${
                isLight
                  ? 'bg-[#B88728] text-white border-white'
                  : 'bg-[#E5B65F] text-black border-[#161819]'
              }`}>
                1
              </div>
            </div>
          </div>
          <div>
            <h3 className={`font-bold text-lg sm:text-[21px] mb-1 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.howItWorks.step1Title}
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              {t.howItWorks.step1Desc}
            </p>
          </div>

          {/* Segment 1 -> 2 (Stops at icon and continues) */}
          <div className={`absolute left-[44px] sm:left-[48px] top-[92px] sm:top-[100px] h-[44px] w-0.5 bg-gradient-to-b -translate-x-1/2 pointer-events-none ${
            isLight
              ? 'from-[#B88728] to-[#B88728]/60'
              : 'from-[#E5B65F] to-[#E5B65F]/60'
          }`} />
        </div>

        {/* Step 2 */}
        <div className="relative flex items-center gap-6 sm:gap-10 text-left group">
          <div className="relative flex-shrink-0 z-10">
            <div className={`w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-full border flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105 ${
              isLight
                ? 'border-[#B88728]/35 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
                : 'border-[#E5B65F]/30 bg-[#161819] shadow-[0_8px_25px_rgba(0,0,0,0.6)]'
            }`}>
              <ShoppingBag size={28} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <div className={`absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm border-2 shadow-sm ${
                isLight
                  ? 'bg-[#B88728] text-white border-white'
                  : 'bg-[#E5B65F] text-black border-[#161819]'
              }`}>
                2
              </div>
            </div>
          </div>
          <div>
            <h3 className={`font-bold text-lg sm:text-[21px] mb-1 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.howItWorks.step2Title}
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              {t.howItWorks.step2Desc}
            </p>
          </div>

          {/* Segment 2 -> 3 (Stops at icon and continues) */}
          <div className={`absolute left-[44px] sm:left-[48px] top-[92px] sm:top-[100px] h-[44px] w-0.5 bg-gradient-to-b -translate-x-1/2 pointer-events-none ${
            isLight
              ? 'from-[#B88728]/60 to-[#B88728]'
              : 'from-[#E5B65F]/60 to-[#E5B65F]'
          }`} />
        </div>

        {/* Step 3 */}
        <div className="relative flex items-center gap-6 sm:gap-10 text-left group">
          <div className="relative flex-shrink-0 z-10">
            <div className={`w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-full border flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105 ${
              isLight
                ? 'border-[#B88728]/35 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
                : 'border-[#E5B65F]/30 bg-[#161819] shadow-[0_8px_25px_rgba(0,0,0,0.6)]'
            }`}>
              <ShoppingCart size={28} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <div className={`absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm border-2 shadow-sm ${
                isLight
                  ? 'bg-[#B88728] text-white border-white'
                  : 'bg-[#E5B65F] text-black border-[#161819]'
              }`}>
                3
              </div>
            </div>
          </div>
          <div>
            <h3 className={`font-bold text-lg sm:text-[21px] mb-1 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.howItWorks.step3Title}
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              {t.howItWorks.step3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP/LAPTOP VERSION (Discrete Segmented Lines that stop before each icon and continue) */}
      <div className="hidden md:block relative max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-8 relative">
          {/* Discrete Line Segment between Step 1 and Step 2 */}
          <div className={`absolute top-[48px] left-[22%] w-[22%] h-[2px] bg-gradient-to-r pointer-events-none z-0 ${
            isLight
              ? 'from-[#B88728] via-[#B88728]/70 to-[#B88728]'
              : 'from-[#E5B65F] via-[#E5B65F]/70 to-[#E5B65F]'
          }`} />
          
          {/* Discrete Line Segment between Step 2 and Step 3 */}
          <div className={`absolute top-[48px] left-[56%] w-[22%] h-[2px] bg-gradient-to-r pointer-events-none z-0 ${
            isLight
              ? 'from-[#B88728] via-[#B88728]/70 to-[#B88728]'
              : 'from-[#E5B65F] via-[#E5B65F]/70 to-[#E5B65F]'
          }`} />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group relative z-10">
            <div className={`w-[96px] h-[96px] rounded-full border flex items-center justify-center relative transition duration-300 group-hover:scale-105 ${
              isLight
                ? 'border-[#B88728]/35 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                : 'border-[#E5B65F]/30 bg-[#161819] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
            }`}>
              <QrCode size={28} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm border-2 shadow-md ${
                isLight
                  ? 'bg-[#B88728] text-white border-white'
                  : 'bg-[#E5B65F] text-black border-[#161819]'
              }`}>
                1
              </div>
            </div>
            <h3 className={`font-bold text-lg lg:text-xl mt-6 mb-2 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.howItWorks.step1Title}
            </h3>
            <p className={`text-sm leading-relaxed max-w-[240px] ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              {t.howItWorks.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group relative z-10">
            <div className={`w-[96px] h-[96px] rounded-full border flex items-center justify-center relative transition duration-300 group-hover:scale-105 ${
              isLight
                ? 'border-[#B88728]/35 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                : 'border-[#E5B65F]/30 bg-[#161819] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
            }`}>
              <ShoppingBag size={28} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm border-2 shadow-md ${
                isLight
                  ? 'bg-[#B88728] text-white border-white'
                  : 'bg-[#E5B65F] text-black border-[#161819]'
              }`}>
                2
              </div>
            </div>
            <h3 className={`font-bold text-lg lg:text-xl mt-6 mb-2 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.howItWorks.step2Title}
            </h3>
            <p className={`text-sm leading-relaxed max-w-[240px] ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              {t.howItWorks.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group relative z-10">
            <div className={`w-[96px] h-[96px] rounded-full border flex items-center justify-center relative transition duration-300 group-hover:scale-105 ${
              isLight
                ? 'border-[#B88728]/35 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                : 'border-[#E5B65F]/30 bg-[#161819] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
            }`}>
              <ShoppingCart size={28} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm border-2 shadow-md ${
                isLight
                  ? 'bg-[#B88728] text-white border-white'
                  : 'bg-[#E5B65F] text-black border-[#161819]'
              }`}>
                3
              </div>
            </div>
            <h3 className={`font-bold text-lg lg:text-xl mt-6 mb-2 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {t.howItWorks.step3Title}
            </h3>
            <p className={`text-sm leading-relaxed max-w-[240px] ${
              isLight ? 'text-slate-600' : 'text-gray-400'
            }`}>
              {t.howItWorks.step3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
