// src/components/forms/DynamicField.tsx
//
// One renderer for every requirement control type.
//
// The item modal, and anything else that collects order requirements, renders
// through this component so the control vocabulary is identical everywhere. The
// alternative, each caller styling its own inputs, is how a product ends up with
// three different text fields and two different toggle styles.
//
// Control types come from FIELD_DEFS in src/data/merchantCatalog.ts:
//   text | number | textarea | select | toggle | radio | multicheck

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import type { OrderRequirement } from '../../data/orderRequirements';

interface DynamicFieldProps {
  requirement: OrderRequirement;
  value: unknown;
  onChange: (id: string, value: unknown) => void;
  error?: string;
}

/** Shared input chrome so every control sits on the same surface. */
function fieldClasses(isLight: boolean, invalid: boolean): string {
  return cn(
    'w-full rounded-xl px-3.5 py-2.5 text-sm font-medium',
    'border transition-colors duration-150 ease-out',
    'focus:outline-none focus:ring-2',
    'placeholder:font-normal',
    invalid
      ? isLight
        ? 'border-rose-400 focus:ring-rose-300 bg-white text-slate-900 placeholder:text-slate-400'
        : 'border-rose-500/60 focus:ring-rose-500/30 bg-white/5 text-white placeholder:text-gray-500'
      : isLight
      ? 'border-slate-300 focus:border-[#B88728] focus:ring-[#B88728]/25 bg-white text-slate-900 placeholder:text-slate-400'
      : 'border-white/15 focus:border-[#E5B65F] focus:ring-[#E5B65F]/25 bg-white/5 text-white placeholder:text-gray-500'
  );
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  requirement,
  value,
  onChange,
  error,
}) => {
  const { isLight } = useTheme();
  const invalid = Boolean(error);
  const describedBy = error ? `${requirement.id}-error` : requirement.hint ? `${requirement.id}-hint` : undefined;

  const label = (
    <label
      htmlFor={requirement.id}
      className={cn(
        'block text-xs font-bold mb-1.5',
        isLight ? 'text-slate-700' : 'text-gray-200'
      )}
    >
      {requirement.label}
      {!requirement.required && (
        <span className={cn('ml-1.5 font-medium', isLight ? 'text-slate-400' : 'text-gray-500')}>
          optional
        </span>
      )}
    </label>
  );

  const hint = requirement.hint && !error && (
    <p id={`${requirement.id}-hint`} className={cn('mt-1 text-[11px]', isLight ? 'text-slate-500' : 'text-gray-400')}>
      {requirement.hint}
    </p>
  );

  const errorText = error && (
    <p
      id={`${requirement.id}-error`}
      role="alert"
      className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-500"
    >
      <AlertCircle size={11} />
      {error}
    </p>
  );

  const renderControl = () => {
    switch (requirement.control) {
      case 'textarea':
        return (
          <textarea
            id={requirement.id}
            name={requirement.id}
            rows={3}
            value={String(value ?? '')}
            placeholder={requirement.placeholder}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(e) => onChange(requirement.id, e.target.value)}
            className={cn(fieldClasses(isLight, invalid), 'resize-y min-h-[80px]')}
          />
        );

      case 'number':
        return (
          <input
            id={requirement.id}
            name={requirement.id}
            type="number"
            inputMode="numeric"
            min={1}
            value={value === undefined || value === null ? '' : String(value)}
            placeholder={requirement.placeholder}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(e) => onChange(requirement.id, e.target.value)}
            className={cn(fieldClasses(isLight, invalid), 'tabular-nums')}
          />
        );

      case 'select':
        return (
          <select
            id={requirement.id}
            name={requirement.id}
            value={String(value ?? '')}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(e) => onChange(requirement.id, e.target.value)}
            className={cn(fieldClasses(isLight, invalid), 'cursor-pointer')}
          >
            <option value="">Choose an option</option>
            {(requirement.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <button
            type="button"
            id={requirement.id}
            role="switch"
            aria-checked={Boolean(value)}
            onClick={() => onChange(requirement.id, !value)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <span
              className={cn(
                'relative w-10 h-6 rounded-full transition-colors duration-150 ease-out flex-shrink-0',
                value ? 'bg-[#B88728]' : isLight ? 'bg-slate-300' : 'bg-white/20'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out',
                  value && 'translate-x-4'
                )}
              />
            </span>
            <span className={cn('text-xs font-semibold', isLight ? 'text-slate-700' : 'text-gray-200')}>
              {value ? 'Yes' : 'No'}
            </span>
          </button>
        );

      case 'radio':
        return (
          <div role="radiogroup" aria-labelledby={requirement.id} className="flex flex-col gap-2">
            {(requirement.options ?? []).map((option) => {
              const selected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(requirement.id, option)}
                  className={cn(
                    'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-sm font-semibold',
                    'transition-colors duration-150 ease-out cursor-pointer',
                    selected
                      ? isLight
                        ? 'border-[#B88728] bg-[#B88728]/8 text-slate-900'
                        : 'border-[#E5B65F] bg-[#E5B65F]/10 text-white'
                      : isLight
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      : 'border-white/10 bg-white/5 text-gray-200 hover:border-white/20'
                  )}
                >
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors',
                      selected
                        ? 'border-[#B88728] bg-[#B88728] shadow-[inset_0_0_0_2px_white]'
                        : isLight
                        ? 'border-slate-300'
                        : 'border-white/30'
                    )}
                  />
                  {option}
                </button>
              );
            })}
          </div>
        );

      case 'multicheck': {
        const selectedValues = Array.isArray(value) ? (value as string[]) : [];
        return (
          <div className="flex flex-wrap gap-2">
            {(requirement.options ?? []).map((option) => {
              const selected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    const next = selected
                      ? selectedValues.filter((v) => v !== option)
                      : [...selectedValues, option];
                    onChange(requirement.id, next);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-full border text-xs font-bold transition-colors duration-150 ease-out cursor-pointer',
                    selected
                      ? isLight
                        ? 'border-[#B88728] bg-[#B88728] text-white'
                        : 'border-[#E5B65F] bg-[#E5B65F] text-slate-950'
                      : isLight
                      ? 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );
      }

      case 'text':
      default:
        return (
          <input
            id={requirement.id}
            name={requirement.id}
            type="text"
            value={String(value ?? '')}
            placeholder={requirement.placeholder}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(e) => onChange(requirement.id, e.target.value)}
            className={fieldClasses(isLight, invalid)}
          />
        );
    }
  };

  return (
    <div>
      {requirement.control !== 'toggle' && label}
      {requirement.control === 'toggle' ? (
        <>
          <span className={cn('block text-xs font-bold mb-1.5', isLight ? 'text-slate-700' : 'text-gray-200')}>
            {requirement.label}
          </span>
          {renderControl()}
        </>
      ) : (
        renderControl()
      )}
      {hint}
      {errorText}
    </div>
  );
};
