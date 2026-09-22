// src/components/merchant/MerchantItemModal.tsx
//
// The ONE item modal, dynamically adapted to the order requirements.
//
// This is the second half of the consistency requirement: instead of a bespoke
// configuration screen per vertical (a dish customiser here, a spa booking form
// there, a transport scheduler somewhere else), a single modal renders whatever
// this particular item actually requires.
//
// What it renders comes from `buildRequirements`:
//   * the merchant's commerce arc  -> quantity, date/time, delivery vs pickup,
//     compliance gates, origin/destination for freight
//   * the subcategory's declared catalogue fields -> the vertical-specific
//     options and compliance inputs, with controls from FIELD_DEFS
//
// It asks nothing it does not need. A bag of groceries gets a quantity and a note.
// A chauffeur transfer gets a date, a time, a party size and a pickup point.

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { X, Minus, Plus, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import type { ApiItem, ApiMerchant } from '../../lib/apiClient';
import {
  validateRequirements,
  type BuiltRequirements,
  type RequirementSection,
} from '../../data/orderRequirements';
import { DynamicField } from '../forms/DynamicField';
import { useModalBehavior } from '../../hooks/useModalBehavior';

interface MerchantItemModalProps {
  item: ApiItem;
  merchant: ApiMerchant;
  requirements: BuiltRequirements;
  reduceMotion: boolean;
  onClose: () => void;
  onConfirm: (summary: { item: ApiItem; quantity: number }) => void;
}

export const MerchantItemModal: React.FC<MerchantItemModalProps> = ({
  item,
  merchant,
  requirements,
  reduceMotion,
  onClose,
  onConfirm,
}) => {
  const { isLight } = useTheme();

  // Escape, background scroll lock, initial focus and focus restore. Without this
  // the highest-stakes surface in the flow was a modal in appearance only: a
  // keyboard user could not dismiss it and a thumb-drag scrolled the merchant page
  // behind it.
  const { initialFocusRef } = useModalBehavior({ isOpen: true, onClose });

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const requirement of requirements.all) {
      if (requirement.id === 'quantity') initial.quantity = 1;
      else if (requirement.control === 'multicheck') initial[requirement.id] = [];
      else if (requirement.control === 'toggle') initial[requirement.id] = false;
      else initial[requirement.id] = '';
    }
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const quantity = Number(values.quantity ?? 1) || 1;
  const lineTotal = item.price * quantity;

  const handleChange = (id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    // Clear this field's error as soon as the user edits it, so the form stops
    // shouting while they are fixing it.
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleConfirm = () => {
    setSubmitted(true);
    const validation = validateRequirements(requirements.all, values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    onConfirm({ item, quantity });
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.16 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        // Focus target for useModalBehavior when no explicit ref is attached, and
        // focusable so the dialog itself can hold focus before any control is hit.
        data-modal-panel
        tabIndex={-1}
        initial={reduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { y: 16, opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          'relative w-full sm:max-w-lg max-h-[92dvh] flex flex-col overflow-hidden',
          'rounded-t-3xl sm:rounded-3xl',
          isLight ? 'bg-white' : 'bg-[#141618]',
          'shadow-2xl focus:outline-none'
        )}
      >
        {/* Header */}
        <div className="relative flex-shrink-0">
          <div className="h-40 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-black/40">
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            ref={initialFocusRef as React.RefObject<HTMLButtonElement>}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center',
              'bg-black/50 text-white hover:bg-black/70 transition-colors duration-150',
              'active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
            )}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2
                className={cn(
                  'text-lg font-bold leading-tight tracking-tight',
                  isLight ? 'text-slate-900' : 'text-white'
                )}
              >
                {item.name}
              </h2>
              <span className="text-base font-bold text-[#8A6413] dark:text-[#E5B65F] tabular-nums flex-shrink-0">
                KSh {item.price.toLocaleString()}
              </span>
            </div>
            <p className={cn('text-xs mt-1.5 leading-relaxed', isLight ? 'text-slate-600' : 'text-gray-400')}>
              {item.description}
            </p>
            <p className={cn('text-[11px] mt-1.5', isLight ? 'text-slate-600' : 'text-gray-400')}>
              {merchant.name} · {requirements.arcLabel}
            </p>
          </div>

          {/* Submission summary, only after a failed attempt. */}
          {submitted && errorCount > 0 && (
            <div
              role="alert"
              className={cn(
                'flex items-start gap-2 p-3 rounded-xl text-xs font-semibold',
                isLight ? 'bg-rose-50 text-rose-700' : 'bg-rose-500/10 text-rose-300'
              )}
            >
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>
                {errorCount === 1
                  ? 'One detail still needs your attention.'
                  : `${errorCount} details still need your attention.`}
              </span>
            </div>
          )}

          {/* Requirements, grouped. Empty sections are already dropped upstream. */}
          {requirements.sections.map((section) => (
            <RequirementSectionView
              key={section.kind}
              section={section}
              values={values}
              errors={errors}
              onChange={handleChange}
              isLight={isLight}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          className={cn(
            'flex-shrink-0 p-4 border-t',
            isLight ? 'bg-white border-slate-200' : 'bg-[#141618] border-white/10'
          )}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className={cn('text-xs font-semibold', isLight ? 'text-slate-500' : 'text-gray-400')}>
              {quantity} × KSh {item.price.toLocaleString()}
            </span>
            <span className={cn('text-base font-bold tabular-nums', isLight ? 'text-slate-900' : 'text-white')}>
              KSh {lineTotal.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full',
              'text-sm font-bold whitespace-nowrap',
              'bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d]',
              'transition-[transform,background-color] duration-150 ease-out active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728] focus-visible:ring-offset-2',
              isLight ? 'focus-visible:ring-offset-white' : 'focus-visible:ring-offset-[#141618]'
            )}
          >
            <Check size={15} />
            {requirements.commitAction}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/** One grouped block of requirements. */
const RequirementSectionView: React.FC<{
  section: RequirementSection;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (id: string, value: unknown) => void;
  isLight: boolean;
}> = ({ section, values, errors, onChange, isLight }) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
      <h3
        className={cn(
          'text-xs font-bold uppercase tracking-[0.12em]',
          isLight ? 'text-slate-500' : 'text-gray-400'
        )}
      >
        {section.title}
      </h3>
      <span className={cn('flex-1 h-px', isLight ? 'bg-slate-100' : 'bg-white/5')} />
    </div>

    {section.note && (
      <p className={cn('text-[11px] -mt-1', isLight ? 'text-slate-500' : 'text-gray-400')}>
        {section.note}
      </p>
    )}

    {/* Quantity gets a stepper rather than a bare number field: it is the one
        control used on nearly every order, so it should be one tap. */}
    {section.kind === 'quantity' ? (
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() =>
            onChange('quantity', Math.max(1, Number(values.quantity ?? 1) - 1))
          }
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center border',
            'transition-colors duration-150 ease-out active:scale-[0.96]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728]',
            isLight
              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              : 'bg-white/5 border-white/15 text-gray-200 hover:bg-white/10'
          )}
        >
          <Minus size={15} />
        </button>
        <span
          className={cn(
            'w-12 text-center text-lg font-bold tabular-nums',
            isLight ? 'text-slate-900' : 'text-white'
          )}
        >
          {Number(values.quantity ?? 1)}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onChange('quantity', Number(values.quantity ?? 1) + 1)}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center border',
            'transition-colors duration-150 ease-out active:scale-[0.96]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88728]',
            isLight
              ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              : 'bg-white/5 border-white/15 text-gray-200 hover:bg-white/10'
          )}
        >
          <Plus size={15} />
        </button>
        {errors.quantity && (
          <span className="text-[11px] font-semibold text-rose-500">{errors.quantity}</span>
        )}
      </div>
    ) : (
      <div className="space-y-3">
        {section.requirements.map((requirement) => (
          <DynamicField
            key={requirement.id}
            requirement={requirement}
            value={values[requirement.id]}
            onChange={onChange}
            error={errors[requirement.id]}
          />
        ))}
      </div>
    )}
  </section>
);
