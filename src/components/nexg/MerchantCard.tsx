// src/components/nexg/MerchantCard.tsx
// Wolt-grade Merchant Card with landscape hero, floating badges, logo roundel,
// and horizontal popular item preview strip with instant item sheet triggers.

import React, { useState } from 'react';
import { Star, Clock, Bike, Heart, Plus, MapPin, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { NexGMerchant, NexGCatalogItem, MerchantCardVariant } from '../../types/nexg';

interface MerchantCardProps {
  merchant: NexGMerchant;
  variant?: MerchantCardVariant;
  className?: string;
  onSelectMerchant?: (merchant: NexGMerchant) => void;
  onSelectItem?: (item: NexGCatalogItem, merchant: NexGMerchant) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({
  merchant,
  variant = 'default',
  className,
  onSelectMerchant,
  onSelectItem,
}) => {
  const { isLight } = useTheme();
  const [isFavorited, setIsFavorited] = useState(false);

  // Take top 3 items for the Wolt preview strip
  const previewItems = merchant.items ? merchant.items.slice(0, 3) : [];

  const handleCardClick = () => {
    if (onSelectMerchant) {
      onSelectMerchant(merchant);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleItemClick = (e: React.MouseEvent, item: NexGCatalogItem) => {
    e.stopPropagation();
    if (onSelectItem) {
      onSelectItem(item, merchant);
    } else if (onSelectMerchant) {
      onSelectMerchant(merchant);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative flex flex-col rounded-2xl border transition duration-300 hover:shadow-xl cursor-pointer select-none overflow-hidden',
        isLight
          ? 'bg-white border-slate-200/90 hover:border-[#B88728]/50 shadow-xs'
          : 'bg-[#181A1F] border-white/10 hover:border-[#E5B65F]/50 shadow-md',
        className
      )}
    >
      {/* 1. Wolt-Grade Landscape Hero Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#111315]">
        <img
          src={merchant.heroImage}
          alt={merchant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top-Left Promo Badge */}
        {merchant.badges && merchant.badges.length > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-[#E5B65F] text-slate-950 shadow-md">
              <Sparkles size={10} className="fill-current" />
              {merchant.badges[0]}
            </span>
          </div>
        )}

        {/* Top-Right Frosted Glass Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className={cn(
            'absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-md',
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          )}
        >
          <Heart size={14} className={isFavorited ? 'fill-current' : ''} />
        </button>

        {/* Bottom-Left Floating Merchant Logo */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-[#181A1F] bg-white shadow-md flex items-center justify-center">
            <img
              src={merchant.logoUrl}
              alt={merchant.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Bottom-Right Wolt Delivery Pill */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-[#181A1F]/95 text-slate-900 dark:text-white backdrop-blur-md shadow-md border border-black/5 dark:border-white/10">
            <Clock size={12} className="text-[#B88728] dark:text-[#E5B65F]" />
            <span>{merchant.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* 2. Merchant Info Body */}
      <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                'text-base font-bold line-clamp-1 tracking-tight group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors',
                isLight ? 'text-slate-900' : 'text-white'
              )}
            >
              {merchant.name}
            </h3>

            {/* Rating Pill */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Star size={11} className="fill-current" />
              <span>{merchant.rating.toFixed(1)}</span>
              {merchant.ratingCount && (
                <span className="text-[10px] opacity-75">({merchant.ratingCount})</span>
              )}
            </div>
          </div>

          <p className={cn('text-xs line-clamp-1 font-medium', isLight ? 'text-slate-500' : 'text-gray-400')}>
            {merchant.subcategory || merchant.category} • {merchant.nairobiArea} • {'$'.repeat(merchant.priceLevel || 2)}
          </p>
        </div>

        {/* Delivery & Logistics Row */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-gray-300">
            <Bike size={13} className="text-[#B88728] dark:text-[#E5B65F]" />
            <span>
              {merchant.deliveryFee === 0
                ? 'Free delivery'
                : `KSh ${merchant.deliveryFee} delivery`}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 dark:text-gray-500">
            {merchant.address.split(',')[0]}
          </span>
        </div>

        {/* 3. Wolt-Style Horizontal Popular Item Preview Strip */}
        {previewItems.length > 0 && variant !== 'compact' && (
          <div className="pt-2 mt-1 space-y-1.5 border-t border-slate-100 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 block">
              Popular offerings
            </span>
            <div className="grid grid-cols-3 gap-2">
              {previewItems.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => handleItemClick(e, item)}
                  className={cn(
                    'group/item relative flex flex-col p-1.5 rounded-xl border transition-colors duration-200 hover:border-[#B88728]/60 cursor-pointer overflow-hidden',
                    isLight
                      ? 'bg-slate-50/80 hover:bg-white border-slate-200/80'
                      : 'bg-white/5 hover:bg-white/10 border-white/5'
                  )}
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-black/30 mb-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#E5B65F] text-slate-950 flex items-center justify-center shadow-xs">
                      <Plus size={12} className="stroke-[2.5]" />
                    </div>
                  </div>
                  <h5
                    className={cn(
                      'text-[11px] font-semibold truncate leading-tight',
                      isLight ? 'text-slate-800' : 'text-gray-200'
                    )}
                  >
                    {item.name}
                  </h5>
                  <span className="text-[10px] font-bold text-[#B88728] dark:text-[#E5B65F] mt-0.5">
                    KSh {item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
