import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage, LanguageOption } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../data/translations';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'footer' | 'pill';
  align?: 'left' | 'right';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'header',
  align = 'right',
  className = '',
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, options, currentOption, t } = useLanguage();
  const { isLight } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const CurrentIcon = currentOption.Icon;

  // Mobile / Inlined Variant (for Mobile Drawer)
  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${
            isLight ? 'text-slate-600' : 'text-gray-300'
          }`}>
            <Globe size={14} className="text-[#7d5a11] dark:text-[#E5B65F]" />
            {t.nav.selectLanguage}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isLight ? 'bg-amber-100 text-amber-800' : 'bg-white/10 text-[#E5B65F]'
          }`}>
            {currentOption.nativeName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {options.map((opt) => {
            const OptIcon = opt.Icon;
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelectLanguage(opt.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300/80 shadow-xs'
                      : 'bg-[#E5B65F]/20 text-[#E5B65F] border border-[#E5B65F]/40 shadow-xs'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span className={`p-1 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? isLight ? 'text-amber-800' : 'text-[#E5B65F]'
                    : isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  <OptIcon className="w-4 h-4" />
                </span>
                <div className="flex flex-col text-left truncate">
                  <span className="leading-tight font-bold truncate">{opt.nativeName}</span>
                  <span className={`text-[10px] truncate ${
                    isSelected
                      ? isLight ? 'text-amber-700' : 'text-amber-300/80'
                      : isLight ? 'text-slate-500' : 'text-gray-400'
                  }`}>
                    {opt.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Footer Variant
  if (variant === 'footer') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer backdrop-blur-md ${
            isLight
              ? 'bg-white/80 hover:bg-white border-slate-200 text-slate-700 shadow-xs'
              : 'bg-white/10 hover:bg-white/15 border-white/15 text-gray-200 shadow-xs'
          }`}
          aria-expanded={isOpen}
          aria-label="Select Regional Language"
        >
          <span className="text-[#7d5a11] dark:text-[#E5B65F] flex items-center justify-center">
            <CurrentIcon className="w-4 h-4" />
          </span>
          <span>{currentOption.nativeName}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
            isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/15 text-gray-300'
          }`}>
            {currentOption.code}
          </span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`absolute bottom-full mb-2 ${
                align === 'right' ? 'right-0' : 'left-0'
              } w-60 rounded-2xl shadow-2xl p-2 z-50 border backdrop-blur-2xl ${
                isLight
                  ? 'bg-white/95 text-slate-900 border-slate-200'
                  : 'bg-[#141618]/95 text-white border-white/15'
              }`}
            >
              <div className="px-2.5 py-1.5 border-b border-black/5 dark:border-white/5 mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  {t.nav.selectLanguage}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {options.map((opt) => {
                  const OptIcon = opt.Icon;
                  const isSelected = opt.code === language;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => handleSelectLanguage(opt.code)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? isLight
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'bg-white/10 text-[#E5B65F] font-bold'
                          : isLight
                          ? 'hover:bg-slate-100 text-slate-700'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? isLight ? 'text-amber-800' : 'text-[#E5B65F]'
                            : isLight ? 'text-slate-600' : 'text-gray-400'
                        }`}>
                          <OptIcon className="w-4 h-4" />
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="leading-tight">{opt.nativeName}</span>
                          <span className={`text-[10px] font-normal ${
                            isLight ? 'text-slate-500' : 'text-gray-400'
                          }`}>
                            {opt.label} • {opt.region}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Header Dropdown Trigger (Desktop Navigation & Docked Headers)
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer backdrop-blur-md active:scale-95 ${
          isLight
            ? 'bg-slate-100/90 hover:bg-slate-200/90 border-slate-200 text-slate-800 shadow-2xs'
            : 'bg-white/10 hover:bg-white/20 border-white/15 text-gray-200 shadow-2xs'
        }`}
        aria-expanded={isOpen}
        aria-label="Language Selector"
        title="Change Language (English, 中文, Kiswahili, العربية)"
      >
        {/* Single-color authentic cultural / language emblem */}
        <span className="text-[#7d5a11] dark:text-[#E5B65F] flex items-center justify-center">
          <CurrentIcon className="w-4 h-4" />
        </span>
        <span className="hidden sm:inline font-bold tracking-tight">{currentOption.nativeName}</span>
        <span className="inline sm:hidden uppercase font-extrabold text-[11px]">{currentOption.code}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 opacity-70 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 ${
              align === 'right' ? 'right-0' : 'left-0'
            } w-64 rounded-2xl shadow-2xl p-2 z-50 border backdrop-blur-2xl ${
              isLight
                ? 'bg-white/98 text-slate-900 border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
                : 'bg-[#141618]/98 text-white border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.6)]'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-black/5 dark:border-white/5 mb-1">
              <Globe size={13} className="text-[#7d5a11] dark:text-[#E5B65F]" />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}>
                {t.nav.selectLanguage}
              </span>
            </div>

            {/* Language Options List */}
            <div className="flex flex-col gap-1">
              {options.map((opt) => {
                const OptIcon = opt.Icon;
                const isSelected = opt.code === language;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => handleSelectLanguage(opt.code)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/60'
                          : 'bg-white/10 text-[#E5B65F] font-bold border border-[#E5B65F]/30'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Monochromatic single-color icon */}
                      <span className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#E5B65F]/20 text-[#E5B65F]'
                          : isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-gray-400'
                      }`}>
                        <OptIcon className="w-4 h-4" />
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[13px] leading-snug">{opt.nativeName}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                            isSelected
                              ? isLight ? 'bg-amber-200 text-amber-900' : 'bg-[#E5B65F] text-black'
                              : isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/15 text-gray-300'
                          }`}>
                            {opt.code}
                          </span>
                        </div>
                        <span className={`text-[11px] font-normal ${
                          isLight ? 'text-slate-500' : 'text-gray-400'
                        }`}>
                          {opt.label} • {opt.region}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-[#7d5a11] dark:text-[#E5B65F] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
