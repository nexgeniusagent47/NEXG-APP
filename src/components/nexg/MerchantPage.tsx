// src/components/nexg/MerchantPage.tsx
// Dedicated Merchant / Provider Screen with Hero, Identity, Meta, Sticky CategoryNav, and Item Sections

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  Heart,
  Share2,
  MapPin,
  Sparkles,
  Info,
  Plus,
  Check,
  Search,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { NexGMerchant, NexGCatalogItem } from '../../types/nexg';

interface MerchantPageProps {
  merchant: NexGMerchant;
  onBack: () => void;
  onSelectItem: (item: NexGCatalogItem, merchant: NexGMerchant) => void;
}

export const MerchantPage: React.FC<MerchantPageProps> = ({
  merchant,
  onBack,
  onSelectItem,
}) => {
  const { isLight } = useTheme();
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Group merchant items into meaningful sections
  const sections = useMemo(() => {
    const items = merchant.items || [];
    if (items.length === 0) return [];

    const grouped: Record<string, NexGCatalogItem[]> = {
      'Signature & Popular': items.slice(0, 4),
      'Main Offerings': items.slice(4, 12),
      'Sides & Essentials': items.slice(12, 20),
      'Specialties & Add-ons': items.slice(20),
    };

    return Object.entries(grouped)
      .filter(([_, list]) => list.length > 0)
      .map(([title, list]) => ({
        id: title.toLowerCase().replace(/[^\w]/g, '-'),
        title,
        items: list.filter((it) =>
          searchFilter ? it.name.toLowerCase().includes(searchFilter.toLowerCase()) : true
        ),
      }));
  }, [merchant.items, searchFilter]);

  const navRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen transition-colors pb-24',
        isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#111315] text-[#f2f2f2]'
      )}
    >
      {/* 1. MERCHANT HERO */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={merchant.heroImage}
          alt={merchant.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Top Floating Actions */}
        <div className="absolute top-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between z-10">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105 active:scale-95 border border-white/10 cursor-pointer',
                isFavorited ? 'bg-rose-500 text-white' : 'bg-black/60 text-white hover:bg-black/90'
              )}
              aria-label="Favorite"
            >
              <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Hero Bottom Info */}
        <div className="absolute bottom-6 left-4 right-4 max-w-7xl mx-auto flex items-end justify-between gap-4 text-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-[#181A1F] bg-white shadow-xl flex-shrink-0">
              <img
                src={merchant.logoUrl}
                alt={merchant.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5B65F]">
                {merchant.subcategory || merchant.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight">{merchant.name}</h1>
              <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                <MapPin size={13} className="text-[#E5B65F]" />
                <span>{merchant.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MERCHANT IDENTITY & METADATA BAR */}
      <div
        className={cn(
          'border-b transition-colors',
          isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            {/* Rating */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold">
              <Star size={13} className="fill-current" />
              <span>{merchant.rating.toFixed(1)}</span>
              <span className="text-[11px] opacity-75">({merchant.ratingCount} reviews)</span>
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
              <Clock size={14} className="text-[#7d5a11] dark:text-[#E5B65F]" />
              <span>{merchant.deliveryTime}</span>
            </div>

            {/* Delivery Fee */}
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
              <Bike size={14} className="text-[#7d5a11] dark:text-[#E5B65F]" />
              <span>
                {merchant.deliveryFee === 0 ? 'Free delivery' : `KSh ${merchant.deliveryFee} delivery`}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Open Now</span>
            </div>
          </div>

          {/* Quick Search */}
          <div
            className={cn(
              'flex items-center px-3 py-1.5 rounded-full border text-xs w-full sm:w-64',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
            )}
          >
            <Search size={14} className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${merchant.name}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. STICKY CATEGORY NAV (WOLT-STYLE) */}
      <div
        ref={navRef}
        className={cn(
          'sticky top-0 z-30 border-b backdrop-blur-xl transition-colors',
          isLight ? 'bg-white/95 border-slate-200' : 'bg-[#141618]/95 border-white/10'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {sections.map((section) => {
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border',
                  isActive
                    ? isLight
                      ? 'bg-[#B88728] text-slate-950 border-[#B88728] shadow-xs'
                      : 'bg-[#E5B65F] text-slate-950 border-[#E5B65F] shadow-xs'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                )}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MERCHANT ITEM SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="space-y-4 scroll-mt-20">
            <div className="border-b border-black/5 dark:border-white/10 pb-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <span className="text-xs text-slate-400">
                {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Items Grid (Wolt-Style horizontal dish card with image on right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item, merchant)}
                  className={cn(
                    'group relative flex items-center justify-between p-4 rounded-2xl border transition duration-200 hover:shadow-md cursor-pointer select-none',
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#B88728]/50'
                      : 'bg-[#181A1F] border-white/10 hover:border-[#E5B65F]/50'
                  )}
                >
                  {/* Left: Info */}
                  <div className="flex-1 pr-4 space-y-1.5">
                    <h4
                      className={cn(
                        'text-sm font-bold line-clamp-1 group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors',
                        isLight ? 'text-slate-900' : 'text-white'
                      )}
                    >
                      {item.name}
                    </h4>
                    <p
                      className={cn(
                        'text-xs line-clamp-2',
                        isLight ? 'text-slate-600' : 'text-gray-400'
                      )}
                    >
                      {item.description}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#7d5a11] dark:text-[#E5B65F]">
                        KSh {item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-600 line-through">
                          KSh {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Dish Photo & Add Button */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/30 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#E5B65F] text-slate-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                      <Plus size={16} className="stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
