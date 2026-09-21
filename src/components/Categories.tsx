import { ArrowRight } from 'lucide-react';
import essentialsImg from '../assets/images/Essentials.png';
import experiencesImg from '../assets/images/Experiences card.png';
import restaurantsImg from '../assets/images/Restaurants.png';
import spaImg from '../assets/images/Spa & Wellness.png';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Categories({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { isLight } = useTheme();
  const { t } = useLanguage();

  const categories = [
    {
      title: t.categories.groceriesTitle,
      desc: t.categories.groceriesDesc,
      pageKey: 'groceries',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw53uJMTAN5g7B713DIeo4axhJ_gVNRr6h1AYCSh80fnu4S1sXFM6GZ0MTM3fCulVqSsHaj2D1Q0cpLF_ir6pJ-JIMgGCivecNserzF4VM4ZXiC5D7yFuAwNTQbTVBhKyhtMAN0pgqfH27Zj2X48g8_ghttsF5EyD-BPgL3y_o6v_pJCB7HoypCfU1VfNnDV9PUkDi6Wq8LD2ARMEVoeKllu3RFVlCpXicDJO1o1IFzHb2M-sg3DuOKgrpAum8sWPRRg',
      width: 'w-[72%]',
      translate: 'translate(-10%, 25%)',
      mixBlend: ''
    },
    {
      title: t.categories.transportTitle,
      desc: t.categories.transportDesc,
      pageKey: 'transport',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA66QRCNT4n9S7_L4Nb-RdWUMBXch2uyTZD7LuDw00SWf2VVq502GkNAk3ILv2iqftyqv78sDd5nrLq4qLUjENUk-zR9cizwqmf03_TDChN0TDJDFOS3uKNPTiL5jqZXQSVWcPGW4WTVUs50S-jAH2mAlK539NB-G1-H0Va-cn5dOHHTYdJPkLZxc7_VlxWFgiXjIM-KPGdneOvuXA-NDoBcTZSGpqI38af87kA37wSYBB3UGTXBpm0e1IIXuK_b6Luyw',
      width: 'w-[82%]',
      translate: 'translate(-10%, 25%)',
      mixBlend: ''
    },
    {
      title: t.categories.spaTitle,
      desc: t.categories.spaDesc,
      pageKey: 'spa',
      img: spaImg,
      width: 'w-[82%]',
      translate: 'translate(-10%, 25%)',
      mixBlend: ''
    },
    {
      title: t.categories.restaurantsTitle,
      desc: t.categories.restaurantsDesc,
      pageKey: 'restaurants',
      img: restaurantsImg,
      width: 'w-[75%]',
      translate: 'translate(-10%, 9%)',
      mixBlend: ''
    },
    {
      title: t.categories.experiencesTitle,
      desc: t.categories.experiencesDesc,
      pageKey: 'experiences',
      img: experiencesImg,
      width: 'w-[75%]',
      translate: 'translate(-10%, 9%)',
      mixBlend: ''
    },
    {
      title: t.categories.essentialsTitle,
      desc: t.categories.essentialsDesc,
      pageKey: 'groceries',
      img: essentialsImg,
      width: 'w-[75%]',
      translate: 'translate(-10%, 9%)',
      mixBlend: ''
    }
  ];

  return (
    <section className={`py-12 sm:py-20 px-6 sm:px-8 xl:px-16 max-w-[1440px] mx-auto transition-colors duration-300 ${
      isLight ? 'bg-transparent text-slate-900' : 'bg-transparent text-white'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
        <div>
          <h2 className={`text-2xl sm:text-[28px] font-black tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {t.categories.heading}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${
            isLight ? 'text-slate-600' : 'text-gray-400'
          }`}>
            {t.categories.subtitle}
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('restaurants')}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer group self-start sm:self-auto ${
            isLight ? 'text-[#B88728] hover:text-[#916719]' : 'text-[#E5B65F] hover:text-white'
          }`}
        >
          <span>{t.categories.viewAll}</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 sm:-mx-8 sm:px-8 xl:-mx-16 xl:px-16">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className={`min-w-[240px] sm:min-w-[300px] lg:min-w-[340px] flex-shrink-0 rounded-2xl overflow-hidden relative transition duration-300 aspect-square group cursor-pointer flex flex-col snap-start ${
              isLight
                ? 'bg-white hover:bg-slate-50/95 ring-1 ring-inset ring-slate-200/90 hover:ring-2 hover:ring-[#B88728] shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99]'
                : 'bg-[#181a1d] hover:bg-[#1f2227] ring-1 ring-inset ring-white/10 hover:ring-2 hover:ring-[#E5B65F] shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.99]'
            }`}
            onClick={() => onNavigate?.(cat.pageKey)}
          >
            {/* Content Top Left */}
            <div className="absolute top-0 left-0 p-6 sm:p-7 z-10 w-4/5">
              <span className={`text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-2 border ${
                isLight ? 'bg-amber-50/90 text-[#B88728] border-amber-200 shadow-2xs' : 'bg-white/10 text-[#E5B65F] border-white/10'
              }`}>
                Browse Partners
              </span>
              <h3 className={`text-lg sm:text-[22px] font-black mb-1.5 tracking-tight leading-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {cat.title}
              </h3>
              <p className={`text-xs sm:text-sm font-medium leading-snug ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}>
                {cat.desc}
              </p>
            </div>

            {/* Bottom-right Image */}
            <div className={`absolute bottom-0 right-0 w-full h-full pointer-events-none flex items-end justify-end overflow-hidden`}>
              <img 
                src={cat.img} 
                alt={cat.title}
                className={`max-w-[75%] max-h-[75%] object-contain transition-transform duration-500 group-hover:scale-105 ${
                  isLight ? 'opacity-90 contrast-105' : 'opacity-85'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Subtle hover gradient */}
            <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none ${
              isLight ? 'bg-gradient-to-t from-slate-300/20 to-transparent' : 'bg-gradient-to-t from-[#E5B65F]/10 to-transparent'
            }`} />
          </div>
        ))}
      </div>
    </section>
  );
}

