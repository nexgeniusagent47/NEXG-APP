import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  Star,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  Users,
  ChevronRight,
  ArrowRight,
  Info,
  Car,
  Heart,
} from 'lucide-react';
import { DynamicItem, CatalogMerchant } from '../../data/categoryCatalog21';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useNexGNavigation } from './NexGNavigationContext';
import { cn } from '../../lib/utils';

export type ItemSheetState =
  | 'CLOSED'
  | 'OPEN'
  | 'CONFIGURING'
  | 'READY'
  | 'ACTION_PENDING'
  | 'SUCCESS'
  | 'UNAVAILABLE';

export const NexGItemSheet: React.FC = () => {
  const { isLight } = useTheme();
  const { addToCart, setIsCartOpen } = useCart();
  const { state: navState, closeItemSheet, navigateToMerchant } = useNexGNavigation();
  const { activeItem, activeMerchant, source } = navState;

  // Local configuration states
  const [sheetState, setSheetState] = useState<ItemSheetState>('CLOSED');
  const [quantity, setQuantity] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<string>('60 min');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-24');
  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isSavedFavorite, setIsSavedFavorite] = useState(false);

  // Sync open state
  useEffect(() => {
    if (activeItem) {
      setSheetState('OPEN');
      setQuantity(1);
      setSelectedAddons([]);
      setSpecialInstructions('');
    } else {
      setSheetState('CLOSED');
    }
  }, [activeItem]);

  if (!activeItem || sheetState === 'CLOSED') return null;

  const isBookable = activeItem.workflowType === 'book';
  const isQuoteOnly = activeItem.workflowType === 'quote';

  // Dynamic add-ons and variants based on category / subcategory
  const mockAddons = useMemo(() => {
    if (activeItem.subcategory.includes('spa') || activeItem.subcategory.includes('massage')) {
      return [
        { id: 'oil-aromatherapy', name: 'Organic African Frankincense & Marula Oil', price: 1500 },
        { id: 'hot-stone', name: 'Volcanic Basalt Hot Stones Therapy', price: 2200 },
        { id: 'foot-scrub', name: 'Exfoliating Himalayan Salt Foot Ritual', price: 1800 },
      ];
    }
    if (activeItem.subcategory.includes('safari') || activeItem.subcategory.includes('tour')) {
      return [
        { id: 'binocs', name: 'Zeiss Terra HD Binoculars Pair (Rental)', price: 1200 },
        { id: 'champagne-bush', name: 'Private Bush Breakfast with Chilled Champagne', price: 6500 },
        { id: 'hotel-pickup', name: 'Private Chauffeur Door-to-Door SUV Pickup', price: 4000 },
      ];
    }
    return [
      { id: 'gift-box', name: 'Signature Luxury Gift Packaging & Card', price: 600 },
      { id: 'express-courier', name: 'Dedicated Express White-Glove Dispatch', price: 1200 },
    ];
  }, [activeItem.subcategory]);

  // Compute live price
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const found = mockAddons.find((a) => a.id === id);
    return sum + (found?.price || 0);
  }, 0);

  const durationMultiplier = selectedDuration === '90 min' ? 1.45 : selectedDuration === '120 min' ? 1.85 : 1.0;
  const unitPrice = isBookable ? Math.round(activeItem.price * durationMultiplier) : activeItem.price;
  const calculatedTotal = (unitPrice + addonTotal) * (isBookable ? guestCount : quantity);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAction = async () => {
    setSheetState('ACTION_PENDING');

    await new Promise((r) => setTimeout(r, 600));

    if (isBookable) {
      // Add booking item to cart/session
      addToCart({
        id: `book-${Date.now()}`,
        menuItemId: activeItem.id,
        restaurantId: activeMerchant?.id || 'nexg-experience',
        restaurantName: activeMerchant?.name || 'Curated App Experience',
        name: `${activeItem.name} (${selectedDate} @ ${selectedTime} • ${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'})`,
        price: calculatedTotal,
        image: activeItem.image,
        quantity: 1,
        selectedOptions: [
          { groupId: 'timing', groupName: 'Schedule', choiceId: selectedTime, choiceName: `${selectedDate} at ${selectedTime}`, price: 0 },
          { groupId: 'guests', groupName: 'Party Size', choiceId: `${guestCount}`, choiceName: `${guestCount} Guests`, price: 0 },
          ...selectedAddons.map((adId) => {
            const ad = mockAddons.find((a) => a.id === adId);
            return { groupId: 'addon', groupName: 'Curated Add-on', choiceId: adId, choiceName: ad?.name || adId, price: ad?.price || 0 };
          }),
        ],
        specialInstructions,
        itemTotal: calculatedTotal,
      });
    } else {
      // Standard item
      addToCart({
        id: `item-${Date.now()}`,
        menuItemId: activeItem.id,
        restaurantId: activeMerchant?.id || 'nexg-merchant',
        restaurantName: activeMerchant?.name || 'Verified Partner',
        name: activeItem.name,
        price: unitPrice,
        image: activeItem.image,
        quantity,
        selectedOptions: selectedAddons.map((adId) => {
          const ad = mockAddons.find((a) => a.id === adId);
          return { groupId: 'addon', groupName: 'Option', choiceId: adId, choiceName: ad?.name || adId, price: ad?.price || 0 };
        }),
        specialInstructions,
        itemTotal: calculatedTotal,
      });
    }

    setSheetState('SUCCESS');
    setTimeout(() => {
      closeItemSheet();
    }, 900);
  };

  const actionText = isBookable
    ? `Book Experience • KSh ${calculatedTotal.toLocaleString()}`
    : isQuoteOnly
    ? 'Submit Proposal Request'
    : `Add ${quantity} to Order • KSh ${calculatedTotal.toLocaleString()}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeItemSheet}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Sheet / Modal Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className={cn(
            'relative w-full max-w-2xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl border flex flex-col z-10 transition-colors',
            isLight
              ? 'bg-white text-slate-900 border-slate-200'
              : 'bg-[#15171A] text-[#F3F4F6] border-white/15'
          )}
        >
          {/* Hero Media Top */}
          <div className="relative h-56 sm:h-64 overflow-hidden flex-shrink-0 bg-black/40">
            <img
              src={activeItem.image}
              alt={activeItem.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Close Button */}
            <button
              type="button"
              onClick={closeItemSheet}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 z-10"
              aria-label="Close sheet"
            >
              <X size={18} />
            </button>

            {/* Favorite toggle */}
            <button
              type="button"
              onClick={() => setIsSavedFavorite(!isSavedFavorite)}
              className={cn(
                'absolute top-4 right-15 w-9 h-9 rounded-full bg-black/60 hover:bg-black flex items-center justify-center transition-colors cursor-pointer border border-white/20 z-10',
                isSavedFavorite ? 'text-rose-500' : 'text-white'
              )}
              aria-label="Save to favorites"
            >
              <Heart size={18} className={isSavedFavorite ? 'fill-current' : ''} />
            </button>

            {/* Context Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-[#E5B65F] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {activeItem.subcategory}
              </span>
              {activeItem.discount && (
                <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  {activeItem.discount}
                </span>
              )}
            </div>

            {/* Title on Media */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              {activeMerchant && (
                <button
                  type="button"
                  onClick={() => {
                    closeItemSheet();
                    navigateToMerchant(activeMerchant, 'discovery');
                  }}
                  className="text-xs font-semibold text-[#E5B65F] hover:underline flex items-center gap-1 mb-1"
                >
                  <span>By {activeMerchant.name}</span>
                  <ChevronRight size={13} />
                </button>
              )}
              <h2 className="text-xl sm:text-2xl font-black line-clamp-2 leading-tight">
                {activeItem.name}
              </h2>
            </div>
          </div>

          {/* Scrollable Configuration Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
            {/* Description & Metadata */}
            <div className="space-y-3">
              <p className={cn('text-sm leading-relaxed', isLight ? 'text-slate-600' : 'text-gray-300')}>
                {activeItem.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  <Star size={13} className="fill-current" />
                  <span>{activeItem.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({activeItem.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                  <Clock size={13} className="text-[#B88728] dark:text-[#E5B65F]" />
                  <span>{activeItem.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  <ShieldCheck size={13} />
                  <span>NEXG App Guarantee</span>
                </div>
              </div>
            </div>

            {/* BOOKING CONTROLS: If item is bookable (Spa, Safari, Chauffeur, Event) */}
            {isBookable && (
              <div className={cn(
                'p-4 rounded-2xl border space-y-4',
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181A1F] border-white/10'
              )}>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#B88728] dark:text-[#E5B65F] flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Appointment & Scheduling</span>
                </h4>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-[#B88728]',
                        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121314] border-white/15 text-white'
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-[#B88728]',
                        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121314] border-white/15 text-white'
                      )}
                    >
                      <option value="09:00">09:00 AM (Morning Sunrise)</option>
                      <option value="11:30">11:30 AM (Midday Session)</option>
                      <option value="14:00">02:00 PM (Afternoon Prime)</option>
                      <option value="16:30">04:30 PM (Golden Hour)</option>
                      <option value="19:00">07:00 PM (Evening Sunset)</option>
                    </select>
                  </div>
                </div>

                {/* Duration Pills for Spa / Service */}
                {(activeItem.subcategory.includes('spa') || activeItem.subcategory.includes('massage')) && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 mb-1.5">
                      Session Duration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['60 min', '90 min', '120 min'].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={cn(
                            'py-2 px-3 rounded-xl text-xs font-bold transition-colors border cursor-pointer text-center',
                            selectedDuration === dur
                              ? isLight
                                ? 'bg-[#B88728] text-white border-[#B88728] shadow-xs'
                                : 'bg-[#E5B65F] text-black border-[#E5B65F] shadow-xs'
                              : isLight
                              ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
                          )}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guest / Party Counter */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-[#B88728] dark:text-[#E5B65F]" />
                    <span className="text-xs font-bold">Number of Guests / Attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center border font-bold text-xs',
                        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-white/10 border-white/10 text-white'
                      )}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center font-black text-sm">{guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.min(12, g + 1))}
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center border font-bold text-xs',
                        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-white/10 border-white/10 text-white'
                      )}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CURATED ADD-ONS & OPTIONS */}
            {mockAddons.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Curated Enhancements & Add-ons
                </h4>
                <div className="space-y-2">
                  {mockAddons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          'p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer select-none',
                          isChecked
                            ? isLight
                              ? 'bg-[#B88728]/10 border-[#B88728] text-slate-900'
                              : 'bg-[#E5B65F]/15 border-[#E5B65F] text-white'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold border transition-colors',
                              isChecked
                                ? 'bg-[#B88728] dark:bg-[#E5B65F] text-white dark:text-black border-transparent'
                                : 'border-slate-300 dark:border-white/20'
                            )}
                          >
                            {isChecked && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className="text-xs font-bold">{addon.name}</span>
                        </div>
                        <span className="text-xs font-black text-[#B88728] dark:text-[#E5B65F]">
                          +KSh {addon.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SPECIAL APP INSTRUCTIONS */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-1.5">
                Special App Notes or Dietary Preferences
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra napkins, private room preference, gate code #4892..."
                className={cn(
                  'w-full p-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#B88728]',
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'
                )}
              />
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className={cn(
            'p-4 sm:p-5 border-t flex items-center justify-between gap-4 transition-colors',
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
          )}>
            {/* Quantity Selector (for standard purchasable goods) */}
            {!isBookable && (
              <div className="flex items-center gap-2 bg-slate-200 dark:bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors',
                    isLight ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-black/50 text-white hover:bg-black'
                  )}
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-black text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors',
                    isLight ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-black/50 text-white hover:bg-black'
                  )}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={sheetState === 'ACTION_PENDING'}
              onClick={handleAction}
              className={cn(
                'flex-1 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer',
                sheetState === 'SUCCESS'
                  ? 'bg-emerald-600 text-white'
                  : isLight
                  ? 'bg-[#B88728] hover:bg-[#967C3B] text-white'
                  : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
              )}
            >
              {sheetState === 'ACTION_PENDING' ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : sheetState === 'SUCCESS' ? (
                <>
                  <Check size={18} strokeWidth={3} />
                  <span>Added to Experience Order</span>
                </>
              ) : (
                <>
                  <span>{actionText}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
