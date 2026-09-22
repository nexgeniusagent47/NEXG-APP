import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, MapPin, Sparkles, ShieldCheck, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export type NexGCardVariant = 'vertical' | 'horizontal' | 'compact' | 'featured' | 'large' | 'minimal';

export interface NexGEntityData {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  price?: number;
  originalPrice?: number;
  pricePrefix?: string; // e.g. "From", "Est."
  priceSuffix?: string; // e.g. "/hr", "/guest", "/night"
  discount?: string;
  deliveryTime?: string;
  duration?: string;
  location?: string;
  distanceKm?: number;
  badges?: string[];
  verified?: boolean;
  statusLabel?: string;
  actionLabel?: string;
  onClick?: () => void;
  onAction?: () => void;
}

interface NexGEntityCardProps {
  entity: NexGEntityData;
  variant?: NexGCardVariant;
  className?: string;
}

export const NexGEntityCard: React.FC<NexGEntityCardProps> = ({
  entity,
  variant = 'vertical',
  className,
}) => {
  const { isLight } = useTheme();

  // HORIZONTAL / ROW LAYOUT
  if (variant === 'horizontal') {
    return (
      <div
        onClick={entity.onClick}
        className={cn(
          'group relative flex items-center gap-3.5 p-3 rounded-2xl border transition duration-300 hover:shadow-md cursor-pointer select-none',
          isLight
            ? 'bg-white text-slate-900 border-slate-200/90 hover:border-[#B88728]/40'
            : 'bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40',
          className
        )}
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-black/40">
          <img
            src={entity.image}
            alt={entity.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {entity.discount && (
            <div className="absolute top-1.5 left-1.5 bg-[#E5B65F] text-slate-950 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
              {entity.discount}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1">
              {entity.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88728] dark:text-[#E5B65F] truncate">
                  {entity.category}
                </span>
              )}
              {entity.rating && (
                <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 flex-shrink-0">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{entity.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <h4 className={cn(
              'font-bold text-sm sm:text-base line-clamp-1 group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors',
              isLight ? 'text-slate-900' : 'text-white'
            )}>
              {entity.title}
            </h4>

            {entity.subtitle && (
              <p className={cn('text-xs line-clamp-1', isLight ? 'text-slate-500' : 'text-gray-400')}>
                {entity.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3 text-xs">
              {entity.deliveryTime && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                  <Clock size={11} className="text-[#B88728] dark:text-[#E5B65F]" />
                  {entity.deliveryTime}
                </span>
              )}
              {entity.duration && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                  <Clock size={11} className="text-[#B88728] dark:text-[#E5B65F]" />
                  {entity.duration}
                </span>
              )}
            </div>

            {entity.price !== undefined && (
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {entity.pricePrefix} KSh {entity.price.toLocaleString()} {entity.priceSuffix}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMPACT / MINIMAL
  if (variant === 'compact' || variant === 'minimal') {
    return (
      <div
        onClick={entity.onClick}
        className={cn(
          'group relative flex flex-col rounded-xl overflow-hidden border transition duration-300 hover:shadow-md cursor-pointer select-none',
          isLight
            ? 'bg-white text-slate-900 border-slate-200 hover:border-[#B88728]/40'
            : 'bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40',
          className
        )}
      >
        <div className="relative h-28 overflow-hidden bg-slate-100 dark:bg-black/40">
          <img
            src={entity.image}
            alt={entity.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {entity.discount && (
            <div className="absolute top-2 left-2 bg-[#E5B65F] text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-bold">
              {entity.discount}
            </div>
          )}
        </div>
        <div className="p-2.5 space-y-1">
          <h4 className="font-bold text-xs line-clamp-1 group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F]">
            {entity.title}
          </h4>
          <div className="flex items-center justify-between text-xs">
            {entity.rating && (
              <div className="flex items-center gap-0.5 font-bold text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span>{entity.rating.toFixed(1)}</span>
              </div>
            )}
            {entity.price !== undefined && (
              <p className="font-extrabold text-[#B88728] dark:text-[#E5B65F]">
                KSh {entity.price.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FEATURED / LARGE HERO CARD
  if (variant === 'featured' || variant === 'large') {
    return (
      <div
        onClick={entity.onClick}
        className={cn(
          'group relative flex flex-col rounded-3xl overflow-hidden border transition duration-300 hover:shadow-xl cursor-pointer select-none',
          isLight
            ? 'bg-white text-slate-900 border-slate-200 hover:border-[#B88728]/40'
            : 'bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40',
          className
        )}
      >
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={entity.image}
            alt={entity.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {entity.discount && (
            <div className="absolute top-4 left-4 bg-[#E5B65F] text-slate-950 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{entity.discount}</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            {entity.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#E5B65F]">
                {entity.category}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-bold line-clamp-1">{entity.title}</h3>
            {entity.subtitle && <p className="text-xs text-gray-200 line-clamp-1">{entity.subtitle}</p>}
          </div>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            {entity.rating && (
              <div className="flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{entity.rating.toFixed(1)}</span>
                {entity.reviewsCount && (
                  <span className="text-slate-400 font-normal">({entity.reviewsCount})</span>
                )}
              </div>
            )}
            {entity.deliveryTime && (
              <div className="flex items-center gap-1 font-medium text-slate-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 text-[#B88728] dark:text-[#E5B65F]" />
                <span>{entity.deliveryTime}</span>
              </div>
            )}
            {entity.duration && (
              <div className="flex items-center gap-1 font-medium text-slate-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 text-[#B88728] dark:text-[#E5B65F]" />
                <span>{entity.duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {entity.price !== undefined && (
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {entity.pricePrefix} KSh {entity.price.toLocaleString()} {entity.priceSuffix}
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-[#B88728] dark:bg-[#E5B65F] text-white dark:text-black flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VERTICAL CARD (Clean, High Contrast, Focused on Image, Title, Rating, Delivery Time, Price)
  return (
    <div
      onClick={entity.onClick}
      className={cn(
        'group relative flex flex-col h-full rounded-2xl overflow-hidden border shadow-xs transition duration-300 hover:shadow-lg cursor-pointer select-none',
        isLight
          ? 'bg-white text-slate-900 border-slate-200/90 hover:border-[#B88728]/40'
          : 'bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40',
        className
      )}
    >
      {/* Top Media */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-[#131518]">
        <img
          src={entity.image}
          alt={entity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {entity.discount && (
          <div className="absolute top-3 left-3 bg-[#E5B65F] text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            {entity.discount}
          </div>
        )}

        {/* Rating Floating Tag */}
        {entity.rating && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-black/80 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{entity.rating.toFixed(1)}</span>
            {entity.reviewsCount && (
              <span className="text-gray-300 font-normal text-[10px]">({entity.reviewsCount})</span>
            )}
          </div>
        )}

        {/* Delivery Time Floating Tag */}
        {(entity.deliveryTime || entity.duration) && (
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/75 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <Clock size={11} className="text-[#E5B65F]" />
            <span>{entity.deliveryTime || entity.duration}</span>
          </div>
        )}
      </div>

      {/* Body Info */}
      <div className="flex flex-col justify-between flex-grow p-4 space-y-2.5">
        <div className="space-y-1">
          {entity.category && (
            <span className="uppercase tracking-wider text-[10px] font-bold text-[#B88728] dark:text-[#E5B65F] block truncate">
              {entity.category}
            </span>
          )}

          <h3 className={cn(
            'text-sm sm:text-base font-bold line-clamp-1 leading-snug group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors',
            isLight ? 'text-slate-900' : 'text-white'
          )}>
            {entity.title}
          </h3>

          {entity.subtitle && (
            <p className={cn('text-xs line-clamp-1', isLight ? 'text-slate-500' : 'text-gray-400')}>
              {entity.subtitle}
            </p>
          )}
        </div>

        {/* Price & Direct Visual Indicator */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/10">
          <div className="flex flex-col">
            {entity.price !== undefined ? (
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {entity.pricePrefix} KSh {entity.price.toLocaleString()} {entity.priceSuffix}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                View catalog & pricing
              </span>
            )}

            {entity.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                KSh {entity.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transform transition duration-300 group-hover:translate-x-0.5 group-hover:bg-[#B88728] group-hover:text-white',
              isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-gray-200'
            )}
          >
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};
