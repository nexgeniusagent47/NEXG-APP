// src/components/merchant/MerchantView.tsx
//
// ONE merchant page for every merchant, across all 21 verticals.
//
// Consistency is the point. Previously each vertical had its own merchant
// presentation (restaurantsData, spaData, transportData, cellarData), so the same
// product looked and behaved differently depending on which vertical you arrived
// from. This component renders any merchant from the API with the same structure:
//
//   cover + identity  ->  key facts  ->  the workflow  ->  the catalogue
//
// What varies is the WORKFLOW, not the layout. The merchant's commerce arc decides
// the step rail in the header, the wording of the primary action, and the
// requirements the item modal will ask for. A chauffeur company and a pharmacy get
// the same page with different behaviour, which is what "consistent" has to mean
// if it is not to mean "identical and wrong".

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  MapPin,
  Search,
  ShieldCheck,
  ArrowRight,
  Store,
  Plus,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import type { ApiItem, ApiMerchant } from '../../lib/apiClient';
import { resolveIntent } from '../../data/workflowEngine';
import { buildRequirements } from '../../data/orderRequirements';
import { MerchantItemModal } from './MerchantItemModal';

interface MerchantViewProps {
  merchant: ApiMerchant;
  onBack: () => void;
  /** Called after an order line is confirmed, so the host can open the cart. */
  onAddedToCart?: (summary: { item: ApiItem; quantity: number }) => void;
}

export default function MerchantView({ merchant, onBack, onAddedToCart }: MerchantViewProps) {
  const { isLight } = useTheme();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState('');
  const [openItem, setOpenItem] = useState<ApiItem | null>(null);

  const intent = resolveIntent(merchant);

  // Requirements are built once per merchant: the arc is merchant-level, and the
  // catalogue fields are subcategory-level. Both are stable for the whole page.
  const requirements = useMemo(
    () =>
      buildRequirements({
        workflow: merchant.workflow,
        categoryId: merchant.categoryId,
        category: merchant.category,
        subcategoryId: merchant.subcategoryId,
        subcategory: merchant.subcategory,
      }),
    [merchant.workflow, merchant.categoryId, merchant.category, merchant.subcategoryId, merchant.subcategory]
  );

  const items = merchant.items ?? [];

  const filteredItems = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [items, filter]);

  return (
    <div className={cn('min-h-[100dvh]', isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#111315] text-[#f2f2f2]')}>
      {/* Cover */}
      <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden bg-slate-200 dark:bg-black/40">
        <img
          src={merchant.heroImage}
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

        <button
          type="button"
          onClick={onBack}
          className={cn(
            'absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full',
            'text-xs font-bold text-white bg-black/45 hover:bg-black/65',
            'transition-colors duration-150 ease-out active:scale-[0.96]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
          )}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="absolute bottom-5 left-0 right-0">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-end gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/90 bg-white flex-shrink-0">
              <img
                src={merchant.logoUrl}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 pb-1">
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight truncate">
                {merchant.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-white/85 truncate">
                {merchant.subcategory || merchant.category} · {merchant.nairobiArea}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Key facts, on one line, as text. No metric cards. */}
        <div
          className={cn(
            'flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold',
            isLight ? 'text-slate-600' : 'text-gray-300'
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="fill-current text-amber-500" />
            <span className="tabular-nums">{merchant.rating.toFixed(1)}</span>
            <span className={isLight ? 'text-slate-400' : 'text-gray-500'}>
              (<span className="tabular-nums">{merchant.ratingCount}</span> reviews)
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-[#B88728] dark:text-[#E5B65F]" />
            {merchant.deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bike size={14} className="text-[#B88728] dark:text-[#E5B65F]" />
            {merchant.deliveryFee === 0 ? 'Free delivery' : `KSh ${merchant.deliveryFee} delivery`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} className="text-[#B88728] dark:text-[#E5B65F]" />
            {merchant.address}
          </span>
          {!merchant.isOpen && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-900 text-white">
              Closed
            </span>
          )}
        </div>

        {/* The workflow. This is what makes the page behave correctly for this
            merchant instead of assuming they all sell the same way. */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={15} className="text-[#B88728] dark:text-[#E5B65F]" />
            <h2 className={cn('text-sm font-bold', isLight ? 'text-slate-900' : 'text-white')}>
              {intent.arc.label}
            </h2>
          </div>
          <p className={cn('text-xs sm:text-sm max-w-[70ch]', isLight ? 'text-slate-600' : 'text-gray-400')}>
            {intent.arc.intent}
            {intent.inferred
              ? ' This merchant does not declare its own workflow, so the default for its category is used.'
              : ''}
          </p>
          <ol
            className={cn(
              'mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-[11px] font-semibold',
              isLight ? 'text-slate-500' : 'text-gray-500'
            )}
          >
            {intent.arc.steps.map((step, index) => (
              <li key={step.id} className="flex items-center gap-1.5">
                <span>{step.label}</span>
                {index < intent.arc.steps.length - 1 && (
                  <ArrowRight size={10} className={cn(isLight ? 'text-slate-300' : 'text-white/20')} />
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Catalogue */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className={cn('text-base sm:text-lg font-black tracking-tight', isLight ? 'text-slate-900' : 'text-white')}>
              {items.length > 0 ? `${items.length} offerings` : 'Offerings'}
            </h2>

            {items.length > 3 && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3.5 py-2 w-full sm:w-72',
                  isLight
                    ? 'bg-white border-slate-200 focus-within:border-[#B88728]'
                    : 'bg-white/5 border-white/10 focus-within:border-[#E5B65F]'
                )}
              >
                <Search size={14} className="flex-shrink-0 text-[#B88728] dark:text-[#E5B65F]" />
                <input
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={`Search ${merchant.name}...`}
                  aria-label={`Search offerings from ${merchant.name}`}
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-400 dark:placeholder:text-gray-500"
                />
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div
              className={cn(
                'rounded-2xl border p-8 text-center',
                isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
              )}
            >
              <Store size={22} className={cn('mx-auto mb-2', isLight ? 'text-slate-300' : 'text-gray-600')} />
              <h3 className={cn('text-sm font-bold', isLight ? 'text-slate-900' : 'text-white')}>
                No offerings listed yet
              </h3>
              <p className={cn('text-xs mt-1', isLight ? 'text-slate-500' : 'text-gray-400')}>
                This merchant has not published its catalogue. You can still request{' '}
                {intent.arc.cardAction.toLowerCase()} directly.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              className={cn(
                'rounded-2xl border p-8 text-center',
                isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
              )}
            >
              <h3 className={cn('text-sm font-bold', isLight ? 'text-slate-900' : 'text-white')}>
                Nothing matches “{filter}”
              </h3>
              <button
                type="button"
                onClick={() => setFilter('')}
                className="mt-3 text-xs font-bold text-[#B88728] dark:text-[#E5B65F] underline underline-offset-2"
              >
                Clear search
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenItem(item)}
                    className={cn(
                      'w-full h-full flex gap-3 p-3 rounded-2xl border text-left',
                      'transition-[border-color,transform] duration-150 ease-out active:scale-[0.99]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728]',
                      isLight
                        ? 'bg-white border-slate-200 hover:border-[#B88728]/50'
                        : 'bg-[#181A1F] border-white/10 hover:border-[#E5B65F]/50'
                    )}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/30 flex-shrink-0">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col">
                      <p
                        className={cn(
                          'text-sm font-bold leading-snug line-clamp-2',
                          isLight ? 'text-slate-900' : 'text-white'
                        )}
                      >
                        {item.name}
                      </p>
                      <p className={cn('text-[11px] mt-0.5 line-clamp-2', isLight ? 'text-slate-500' : 'text-gray-400')}>
                        {item.description}
                      </p>
                      <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#B88728] dark:text-[#E5B65F] tabular-nums">
                          KSh {item.price.toLocaleString()}
                        </span>
                        <span
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center',
                            isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-gray-200'
                          )}
                        >
                          <Plus size={13} />
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* One modal, driven by this merchant's requirements. `initial={false}`
          keeps the first paint animation-free. */}
      <AnimatePresence initial={false}>
        {openItem && (
          <MerchantItemModal
            key={openItem.id}
            item={openItem}
            merchant={merchant}
            requirements={requirements}
            reduceMotion={Boolean(reduceMotion)}
            onClose={() => setOpenItem(null)}
            onConfirm={(summary) => {
              setOpenItem(null);
              onAddedToCart?.(summary);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
