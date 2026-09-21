import { ShieldCheck, Map, CreditCard, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Features() {
  const { isLight } = useTheme();
  const { t } = useLanguage();

  const items = [
    {
      icon: ShieldCheck,
      title: t.features.f1Title,
      desc: t.features.f1Desc,
      color: isLight ? 'text-emerald-600' : 'text-emerald-400',
      bg: isLight
        ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100/60'
        : 'bg-emerald-400/10 border-emerald-400/20 hover:border-emerald-400/40 hover:bg-emerald-400/20',
      hoverShadow: isLight
        ? 'hover:shadow-[0_8px_25px_rgba(16,185,129,0.12)]'
        : 'hover:shadow-[0_8px_30px_rgb(52,211,153,0.12)]',
    },
    {
      icon: Map,
      title: t.features.f2Title,
      desc: t.features.f2Desc,
      color: isLight ? 'text-blue-600' : 'text-blue-400',
      bg: isLight
        ? 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100/60'
        : 'bg-blue-400/10 border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-400/20',
      hoverShadow: isLight
        ? 'hover:shadow-[0_8px_25px_rgba(59,130,246,0.12)]'
        : 'hover:shadow-[0_8px_30px_rgb(96,165,250,0.12)]',
    },
    {
      icon: CreditCard,
      title: t.features.f3Title,
      desc: t.features.f3Desc,
      color: isLight ? 'text-[#B88728]' : 'text-[#E5B65F]',
      bg: isLight
        ? 'bg-amber-50 border-amber-200 hover:border-amber-300 hover:bg-amber-100/60'
        : 'bg-[#E5B65F]/10 border-[#E5B65F]/20 hover:border-[#E5B65F]/40 hover:bg-[#E5B65F]/20',
      hoverShadow: isLight
        ? 'hover:shadow-[0_8px_25px_rgba(184,135,40,0.15)]'
        : 'hover:shadow-[0_8px_30px_rgba(229,182,95,0.15)]',
    },
    {
      icon: Lock,
      title: t.features.f4Title,
      desc: t.features.f4Desc,
      color: isLight ? 'text-purple-600' : 'text-purple-400',
      bg: isLight
        ? 'bg-purple-50 border-purple-200 hover:border-purple-300 hover:bg-purple-100/60'
        : 'bg-purple-400/10 border-purple-400/20 hover:border-purple-400/40 hover:bg-purple-400/20',
      hoverShadow: isLight
        ? 'hover:shadow-[0_8px_25px_rgba(147,51,234,0.12)]'
        : 'hover:shadow-[0_8px_30px_rgb(167,139,250,0.12)]',
    },
  ];

  return (
    <section className="py-8 sm:py-16 px-4 sm:px-8 xl:px-16 max-w-[1400px] mx-auto bg-transparent" id="features-section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index} 
              className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl transition duration-300 hover:-translate-y-1 ${
                isLight ? 'bg-white/70 shadow-xs' : 'bg-white/[0.02]'
              } ${item.hoverShadow}`}
            >
              <div className={`shrink-0 flex items-center justify-center pt-0.5 ${item.color}`}>
                <IconComponent size={28} strokeWidth={2.2} className="transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-[14px] sm:text-[16px] md:text-[17px] tracking-tight mb-0.5 leading-tight truncate sm:whitespace-normal ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {item.title}
                </h4>
                <p className={`text-[11px] sm:text-[13px] font-medium leading-snug ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
