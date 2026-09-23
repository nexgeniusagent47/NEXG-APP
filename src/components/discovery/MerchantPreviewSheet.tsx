// src/components/discovery/MerchantPreviewSheet.tsx
//
// The merchant PREVIEW sheet.
//
// This component enforces one product rule:
//
//   Clicking a merchant must never take the user straight to the merchant screen.
//
// The click opens this sheet, which answers "what is this and what can I do here?"
// before committing the user to a full page. Navigation to MerchantPage happens
// ONLY through an explicit action inside this sheet.
//
// The two actions are deliberately distinct:
//   * primary   — the arc's workflow CTA, landing on the merchant page AT THE
//                 OFFERINGS, where the flow the label names actually begins.
//   * secondary — "See all offerings", the full merchant page from the top.
// Passing one handler to both is what previously gave two labels one destination.
//
// The action set and the step rail come from the merchant's commerce arc
// (workflowEngine), so a pharmacist, a chauffeur company, a freight forwarder and
// a bank each get the flow that matches their intended use.
//
// Structure notes:
//   * The arc is presented as prose plus a plain inline step sequence. An earlier
//     pass wrapped both in a bordered panel of pill chips, which is a card inside
//     a sheet and reads as decoration around information that is already legible.
//   * There is no kicker / eyebrow label; the merchant name is the heading.
//   * One authored motion moment (the sheet entrance). Everything else is a
//     150-200ms state transition.

import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Star, Clock, Bike, MapPin, ArrowRight, Store } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import type { ApiMerchant } from '../../lib/apiClient';
import { resolveIntent } from '../../data/workflowEngine';
import { useModalBehavior } from '../../hooks/useModalBehavior';

interface MerchantPreviewSheetProps {
  merchant: ApiMerchant | null;
  onClose: () => void;
  /** Explicit, user-initiated navigation to the full merchant screen. */
  onViewFull: (merchant: ApiMerchant) => void;
  /** Arc-appropriate action that is not "open the full page". */
  onPrimaryAction?: (merchant: ApiMerchant) => void;
}

export const MerchantPreviewSheet: React.FC<MerchantPreviewSheetProps> = ({
  merchant,
  onClose,
  onViewFull,
  onPrimaryAction,
}) => {
  const { t } = useLanguage();
  const { isLight } = useTheme();
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = merchant !== null;
  const intent = merchant ? resolveIntent(merchant) : null;

  // Escape, scroll lock, initial focus and focus restore, from the shared hook.
  //
  // This sheet previously owned an inline copy of that behaviour, bound on the
  // bubble phase. It silently stopped receiving Escape while the close button kept
  // working — a failure mode with no visible symptom until a keyboard user tries to
  // leave. The shared hook binds on the capture phase and is the same code path the
  // item modal already proves, so the two overlays cannot diverge again.
  useModalBehavior({ isOpen, onClose });

  const previewItems = merchant?.items?.slice(0, 4) ?? [];

  return (
    <AnimatePresence>
      {isOpen && merchant && intent && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label={`${merchant.name} preview`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55"
          />

          {/* Bottom sheet on mobile, right-hand sheet from md up. */}
          <div className="absolute inset-0 flex items-end justify-center md:items-stretch md:justify-end pointer-events-none">
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              transition={
                reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.08 }
              }
              className={cn(
                'pointer-events-auto relative w-full md:w-[440px] lg:w-[500px]',
                'max-h-[92dvh] md:max-h-none flex flex-col overflow-hidden',
                'rounded-t-3xl md:rounded-none md:rounded-l-3xl',
                isLight ? 'bg-white' : 'bg-[#141618]',
                'shadow-2xl border-t md:border-t-0 md:border-l',
                isLight ? 'border-slate-200' : 'border-white/10'
              )}
            >
              <div className="md:hidden pt-2.5 flex justify-center">
                <span className={cn('w-10 h-1 rounded-full', isLight ? 'bg-slate-300' : 'bg-white/20')} />
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label={t.ui.merchantPreviewSheet.s_baa550}
                className={cn(
                  'absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center',
                  'transition-transform duration-150 ease-out hover:scale-105 active:scale-95',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728]',
                  isLight ? 'bg-white/90 text-slate-800' : 'bg-black/50 text-white'
                )}
              >
                <X size={16} />
              </button>

              <div className="overflow-y-auto overscroll-contain">
                {/* Hero */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-black/40">
                  <img
                    src={merchant.heroImage}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/90 bg-white flex-shrink-0">
                      <img
                        src={merchant.logoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">
                        {merchant.name}
                      </h2>
                      <p className="text-xs font-semibold text-white/85 truncate">
                        {merchant.subcategory || merchant.category} · {merchant.nairobiArea}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Metrics, as plain text separated by rules. Not pills, not a
                      card: these are three facts, not a dashboard. */}
                  <div
                    className={cn(
                      'flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold',
                      isLight ? 'text-slate-600' : 'text-gray-300'
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Star size={13} className="fill-current text-amber-500" />
                      {merchant.rating.toFixed(1)}
                      <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>
                        ({merchant.ratingCount})
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                      {merchant.deliveryTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Bike size={13} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                      {merchant.deliveryFee === 0 ? 'Free delivery' : `KSh ${merchant.deliveryFee}`}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                      {merchant.nairobiArea}
                    </span>
                  </div>

                  {/* The workflow, stated plainly. */}
                  <div className="space-y-2">
                    <h3 className={cn('text-sm font-bold', isLight ? 'text-slate-900' : 'text-white')}>
                      {intent.arc.label}
                    </h3>
                    <p className={cn('text-xs leading-relaxed', isLight ? 'text-slate-600' : 'text-gray-400')}>
                      {intent.arc.intent}
                    </p>

                    <ol
                      className={cn(
                        'flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-medium pt-1',
                        isLight ? 'text-slate-600' : 'text-gray-400'
                      )}
                    >
                      {intent.arc.steps.map((step, index) => (
                        <li key={step.id} className="flex items-center gap-1.5">
                          <span>{step.label}</span>
                          {index < intent.arc.steps.length - 1 && (
                            <ArrowRight
                              size={10}
                              className={cn('flex-shrink-0', isLight ? 'text-slate-300' : 'text-white/20')}
                            />
                          )}
                        </li>
                      ))}
                    </ol>

                    {intent.inferred && (
                      <p className={cn('text-[11px] italic', isLight ? 'text-slate-600' : 'text-gray-400')}>{t.ui.merchantPreviewSheet.s_0f4c5c}</p>
                    )}
                  </div>

                  {/* Item preview. Rows divided by rules, not boxed tiles. */}
                  {previewItems.length > 0 && (
                    <div className="space-y-1">
                      <h3
                        className={cn(
                          'text-sm font-bold pb-1',
                          isLight ? 'text-slate-900' : 'text-white'
                        )}
                      >
                        {intent.arc.id === 'browse_buy' ? 'Popular right now' : 'Signature offerings'}
                      </h3>
                      <ul className={cn('divide-y', isLight ? 'divide-slate-100' : 'divide-white/5')}>
                        {previewItems.map((item) => (
                          <li key={item.id} className="flex items-center gap-3 py-2.5">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-black/30 flex-shrink-0">
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                              />
                            </div>
                            <p
                              className={cn(
                                'flex-1 min-w-0 text-xs font-semibold leading-snug line-clamp-2',
                                isLight ? 'text-slate-800' : 'text-gray-200'
                              )}
                            >
                              {item.name}
                            </p>
                            <span className="text-xs font-bold text-[#7d5a11] dark:text-[#E5B65F] flex-shrink-0">
                              KSh {item.price.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className={cn('flex items-start gap-2 text-xs', isLight ? 'text-slate-600' : 'text-gray-400')}>
                    <Store size={13} className="mt-0.5 flex-shrink-0 text-[#7d5a11] dark:text-[#E5B65F]" />
                    {merchant.address}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className={cn(
                  'mt-auto p-4 flex flex-col sm:flex-row gap-2.5 border-t',
                  isLight ? 'bg-white border-slate-200' : 'bg-[#141618] border-white/10'
                )}
              >
                <button
                  type="button"
                  onClick={() => (onPrimaryAction ? onPrimaryAction(merchant) : onViewFull(merchant))}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full',
                    'text-sm font-bold whitespace-nowrap',
                    'bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d]',
                    'transition-[transform,background-color] duration-150 ease-out active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] focus-visible:ring-offset-2',
                    isLight ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-[#141618]'
                  )}
                >
                  {intent.arc.primaryAction}
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onViewFull(merchant)}
                  className={cn(
                    'inline-flex items-center justify-center px-5 py-3 rounded-full',
                    'text-sm font-bold whitespace-nowrap border',
                    'transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] focus-visible:ring-offset-2',
                    isLight
                      ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 focus-visible:ring-offset-white'
                      : 'bg-white/5 border-white/15 text-gray-100 hover:bg-white/10 focus-visible:ring-offset-[#141618]'
                  )}
                >{t.ui.merchantPreviewSheet.s_28da6e}</button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
