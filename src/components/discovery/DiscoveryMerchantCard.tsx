// src/components/discovery/DiscoveryMerchantCard.tsx
//
// A workflow-aware merchant card.
//
// The card's action label is DERIVED from the merchant's commerce arc
// (see src/data/workflowEngine.ts), not hardcoded. A restaurant offers
// "View menu", a chauffeur company "Check dates", a freight forwarder
// "Get quote", a bank "Book".
//
// It reuses the established card language (landscape hero, logo roundel,
// delivery pill, price level) so discovery reads as the same product.
//
// The commerce arc is carried as INLINE TEXT rather than an overlay badge.
// The arc is operational information, and a chip floating on a photograph
// reads as decoration. Text on the surface is legible, scannable and honest.

import React from 'react';
import { Star, Clock, Bike, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import type { ApiMerchant } from '../../lib/apiClient';
import { resolveIntent } from '../../data/workflowEngine';

interface DiscoveryMerchantCardProps {
  merchant: ApiMerchant;
  onOpen: (merchant: ApiMerchant) => void;
  className?: string;
}

export const DiscoveryMerchantCard: React.FC<DiscoveryMerchantCardProps> = ({
  merchant,
  onOpen,
  className,
}) => {
  const { isLight } = useTheme();
  const intent = resolveIntent(merchant);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(merchant);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(merchant)}
      onKeyDown={handleKeyDown}
      aria-label={`${merchant.name}. ${intent.arc.label}. ${intent.arc.cardAction}.`}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden text-left cursor-pointer',
        'border transition-[transform,border-color,box-shadow] duration-200 ease-out',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] focus-visible:ring-offset-2',
        isLight
          ? 'bg-[#F7EED8] border-[#6D531D]/20 hover:border-[#6D531D]/55 hover:shadow-lg focus-visible:ring-offset-[#D8B350]'
          : 'bg-[#181A1F] border-white/10 hover:border-[#E5B65F]/50 hover:shadow-xl focus-visible:ring-offset-[#111315]',
        className
      )}
    >
      {/* Hero */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8D7AA] dark:bg-[#111315]">
        <img
          src={merchant.heroImage}
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        {!merchant.isOpen && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-900/85 text-white">
              Closed
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 z-10 w-9 h-9 rounded-full overflow-hidden border-2 border-[#F7EED8] dark:border-[#181A1F] bg-[#F7EED8]">
          <img
            src={merchant.logoUrl}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold bg-[#F7EED8]/95 dark:bg-[#181A1F]/95 text-slate-900 dark:text-white">
            <Clock size={12} className="text-[#7d5a11] dark:text-[#E5B65F]" />
            {merchant.deliveryTime}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'text-[15px] font-bold leading-tight line-clamp-1 tracking-tight transition-colors',
              'group-hover:text-[#7d5a11] dark:group-hover:text-[#E5B65F]',
              isLight ? 'text-slate-900' : 'text-white'
            )}
          >
            {merchant.name}
          </h3>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Star size={11} className="fill-current" />
            {merchant.rating.toFixed(1)}
          </span>
        </div>

        <p className={cn('text-xs font-medium line-clamp-1', isLight ? 'text-slate-600' : 'text-gray-400')}>
          {merchant.subcategory || merchant.category}
        </p>

        {/* The commerce arc, as text. This tells the user what kind of merchant
            this is before they commit to opening anything. */}
        <p className={cn('text-[11px] font-semibold', isLight ? 'text-slate-600' : 'text-gray-300')}>
          {intent.arc.label}
        </p>

        <div
          className={cn(
            'flex items-center gap-3 text-[11px] font-medium',
            isLight ? 'text-slate-600' : 'text-gray-400'
          )}
        >
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="text-[#7d5a11] dark:text-[#E5B65F]" />
            {merchant.nairobiArea}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bike size={12} className="text-[#7d5a11] dark:text-[#E5B65F]" />
            {merchant.deliveryFee === 0 ? 'Free' : `KSh ${merchant.deliveryFee}`}
          </span>
          <span className="ml-auto font-bold tracking-tight">
            {'$'.repeat(Math.max(1, Math.min(4, merchant.priceLevel || 2)))}
          </span>
        </div>

        <div
          className={cn(
            'mt-auto pt-2.5 flex items-center justify-between gap-2 border-t',
            isLight ? 'border-[#6D531D]/12' : 'border-white/5'
          )}
        >
          <span className={cn('text-xs font-bold', isLight ? 'text-slate-700' : 'text-gray-200')}>
            {intent.arc.cardAction}
          </span>
          <span
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ease-out',
              'group-hover:translate-x-0.5',
              isLight ? 'bg-[#E9D9B6] text-slate-800' : 'bg-white/10 text-gray-200'
            )}
          >
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
};
