import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Check, Star, Clock, Calendar, Sparkles, ChevronRight, Info } from 'lucide-react';
import { DynamicItem, CatalogMerchant } from '../../data/categoryCatalog21';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useNexGNavigation } from './NexGNavigationContext';
import { cn } from '../../lib/utils';

interface NexGItemCardProps {
  item: DynamicItem;
  merchant?: CatalogMerchant | null;
  layout?: 'grid' | 'row' | 'compact';
  onQuickAdd?: (item: DynamicItem) => void;
  onOpenDetail?: (item: DynamicItem) => void;
}

export const NexGItemCard: React.FC<NexGItemCardProps> = ({
  item,
  merchant,
  layout = 'grid',
  onQuickAdd,
  onOpenDetail,
}) => {
  const { isLight } = useTheme();
  const { addToCart } = useCart();
  const { openItemSheet } = useNexGNavigation();
  const [justAdded, setJustAdded] = useState(false);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(item);
    } else {
      openItemSheet(item, merchant, 'discovery');
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If item requires booking or dynamic options, open sheet
    if (item.workflowType === 'book' || item.workflowType === 'quote') {
      handleCardClick();
      return;
    }

    // Direct Quick-Add for standard purchasable item
    if (onQuickAdd) {
      onQuickAdd(item);
    } else {
      addToCart({
        id: item.id,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        restaurantId: merchant?.id || 'nexg-merchant',
        restaurantName: merchant?.name || 'Verified Partner',
        itemTotal: item.price,
      });
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  // ROW / LIST ITEM LAYOUT
  if (layout === 'row') {
    return (
      <div
        onClick={handleCardClick}
        className={cn(
          'group relative flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border transition duration-300 hover:shadow-md cursor-pointer select-none',
          isLight
            ? 'bg-white text-slate-900 border-slate-200/90 hover:border-[#B88728]/40'
            : 'bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40'
        )}
      >
        <div className="flex-1 min-w-0 pr-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#B88728] dark:text-[#E5B65F]">
              {item.subcategory}
            </span>
            {item.discount && (
              <span className="text-[9px] font-black bg-[#E5B65F] text-slate-950 px-1.5 py-0.2 rounded-full">
                {item.discount}
              </span>
            )}
          </div>

          <h4 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors">
            {item.name}
          </h4>

          <p className={cn('text-xs line-clamp-2', isLight ? 'text-slate-500' : 'text-gray-400')}>
            {item.description}
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs">
            <span className="font-black text-sm text-slate-900 dark:text-white">
              KSh {item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-slate-400 line-through text-[11px]">
                KSh {item.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-gray-400">
              <Clock size={11} className="text-[#B88728] dark:text-[#E5B65F]" />
              {item.deliveryTime}
            </span>
          </div>
        </div>

        {/* Media & Action */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-black/30">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={handleActionClick}
            className={cn(
              'absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 shadow-md cursor-pointer',
              justAdded
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-white/95 text-slate-900 hover:bg-[#B88728] hover:text-white'
                : 'bg-black/90 text-white hover:bg-[#E5B65F] hover:text-black'
            )}
          >
            {justAdded ? (
              <>
                <Check size={12} />
                <span>Added</span>
              </>
            ) : item.workflowType === 'book' ? (
              <>
                <Calendar size={12} />
                <span>Book</span>
              </>
            ) : (
              <>
                <Plus size={12} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT GRID CARD
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative flex flex-col h-full rounded-2xl overflow-hidden border shadow-xs transition duration-300 hover:shadow-lg cursor-pointer select-none',
        isLight
          ? 'bg-white text-slate-900 border-slate-200/90 hover:border-[#B88728]/40'
          : 'bg-[#181A1F] text-[#F3F4F6] border-white/10 hover:border-[#E5B65F]/40'
      )}
    >
      {/* Media Top */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-[#131518]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {item.discount && (
          <div className="absolute top-3 left-3 bg-[#E5B65F] text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs">
            {item.discount}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-400 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
          <Star size={10} className="fill-current" />
          <span>{item.rating.toFixed(1)}</span>
        </div>

        {item.quantity && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium">
            {item.quantity}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-gray-400">
            <span className="uppercase tracking-wider text-[10px] font-bold text-[#B88728] dark:text-[#E5B65F] truncate">
              {item.subcategory}
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock size={11} className="text-[#B88728] dark:text-[#E5B65F]" />
              {item.deliveryTime}
            </span>
          </div>

          <h3 className={cn(
            'text-sm sm:text-base font-bold line-clamp-2 leading-snug group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors',
            isLight ? 'text-slate-900' : 'text-white'
          )}>
            {item.name}
          </h3>

          <p className={cn('text-xs line-clamp-2', isLight ? 'text-slate-500' : 'text-gray-400')}>
            {item.description}
          </p>
        </div>

        {/* Footer & Dynamic Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              KSh {item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                KSh {item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleActionClick}
            className={cn(
              'rounded-xl px-3.5 py-1.5 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs',
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : item.workflowType === 'book'
                ? isLight
                  ? 'bg-[#B88728] text-white hover:bg-[#967C3B]'
                  : 'bg-[#E5B65F] text-black hover:bg-[#d6a54d]'
                : isLight
                ? 'bg-slate-100 hover:bg-[#B88728] text-slate-900 hover:text-white border border-slate-200'
                : 'bg-white/10 hover:bg-[#E5B65F] text-white hover:text-black border border-white/10'
            )}
          >
            {justAdded ? (
              <>
                <Check size={13} strokeWidth={3} />
                <span>Added</span>
              </>
            ) : item.workflowType === 'book' ? (
              <>
                <Calendar size={13} />
                <span>Book</span>
              </>
            ) : item.workflowType === 'quote' ? (
              <>
                <Info size={13} />
                <span>Quote</span>
              </>
            ) : (
              <>
                <Plus size={13} strokeWidth={2.5} />
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
