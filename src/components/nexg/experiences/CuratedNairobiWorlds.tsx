// src/components/nexg/experiences/CuratedNairobiWorlds.tsx
// Single cohesive Discovery Section representing contextual occasions & worlds
// with progressive disclosure: Occasion Selector -> Multi-Step Journey -> Wolt Cards -> Full Itinerary Drawer

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ChevronRight,
  Clock,
  Compass,
  ArrowRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  MapPin,
  Flame,
  Utensils,
  Wine,
  Car,
  Flower2,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';
import { NEXG_EXPERIENCE_REGISTRY } from '../../../data/experienceRegistry';
import { NexGExperience, NexGMerchant, NexGCatalogItem } from '../../../types/nexg';
import { MerchantCard } from '../MerchantCard';

interface CuratedNairobiWorldsProps {
  merchants: NexGMerchant[];
  onSelectMerchant: (merchant: NexGMerchant) => void;
  onSelectItem: (item: NexGCatalogItem, merchant: NexGMerchant) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const CuratedNairobiWorlds: React.FC<CuratedNairobiWorldsProps> = ({
  merchants,
  onSelectMerchant,
  onSelectItem,
  onSelectCategory,
}) => {
  const { isLight } = useTheme();

  // Active occasion state (defaults to Date Night or time-based pick)
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>(
    NEXG_EXPERIENCE_REGISTRY[0].id
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isFullDrawerOpen, setIsFullDrawerOpen] = useState<boolean>(false);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');

  const activeExperience: NexGExperience = useMemo(() => {
    return (
      NEXG_EXPERIENCE_REGISTRY.find((exp) => exp.id === selectedExperienceId) ||
      NEXG_EXPERIENCE_REGISTRY[0]
    );
  }, [selectedExperienceId]);

  const activeStep = activeExperience.steps[activeStepIndex] || activeExperience.steps[0];

  // Filter merchants for the currently active step
  const stepMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const matchesCategory =
        m.category.toLowerCase().includes(activeStep.category.toLowerCase()) ||
        activeStep.category.toLowerCase().includes(m.category.toLowerCase());
      const matchesArea =
        selectedAreaFilter === 'all' ||
        m.nairobiArea.toLowerCase() === selectedAreaFilter.toLowerCase();
      return matchesCategory && matchesArea;
    }).slice(0, 6);
  }, [merchants, activeStep, selectedAreaFilter]);

  const availableAreas = ['all', 'Kilimani', 'Westlands', 'Karen', 'Lavington', 'Gigiri'];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils size={14} />;
      case 'Wine':
        return <Wine size={14} />;
      case 'Car':
        return <Car size={14} />;
      case 'Flower2':
        return <Flower2 size={14} />;
      case 'Home':
        return <Home size={14} />;
      case 'ShoppingBag':
        return <ShoppingBag size={14} />;
      default:
        return <Sparkles size={14} />;
    }
  };

  return (
    <section className="space-y-6">
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#E5B65F]/20 text-[#7d5a11] dark:text-[#E5B65F] border border-[#E5B65F]/30">
              <Sparkles size={11} className="fill-current" />
              Contextual Experience Hub
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500">
              Nairobi Curated
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curated Nairobi Worlds
          </h2>
          <p className={cn('text-xs sm:text-sm font-medium', isLight ? 'text-slate-500' : 'text-gray-400')}>
            Dynamic cross-category plans tailored to your moment, occasion & time of day
          </p>
        </div>

        {/* Quick Drawer Opener */}
        <button
          type="button"
          onClick={() => setIsFullDrawerOpen(true)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer self-start sm:self-auto',
            isLight
              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
              : 'bg-[#181A1F] hover:bg-white/10 border-white/10 text-gray-200'
          )}
        >
          <SlidersHorizontal size={13} className="text-[#7d5a11] dark:text-[#E5B65F]" />
          <span>Full Experience Builder</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* 2. LEVEL 1: OCCASION SELECTOR CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {NEXG_EXPERIENCE_REGISTRY.map((exp) => {
          const isSelected = exp.id === selectedExperienceId;
          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => {
                setSelectedExperienceId(exp.id);
                setActiveStepIndex(0);
              }}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition duration-200 flex items-center gap-2 cursor-pointer border shadow-2xs',
                isSelected
                  ? isLight
                    ? 'bg-[#B88728] text-slate-950 border-[#B88728] shadow-md scale-102'
                    : 'bg-[#E5B65F] text-slate-950 border-[#E5B65F] shadow-md scale-102'
                  : isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-[#181A1F] hover:bg-white/10 border-white/10 text-gray-300'
              )}
            >
              <span>{exp.name}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. LEVEL 2: ACTIVE WORLD HERO & PROGRESSIVE JOURNEY STEPPER */}
      <div
        className={cn(
          'relative rounded-3xl border overflow-hidden p-5 sm:p-7 transition duration-300 shadow-sm',
          isLight
            ? 'bg-gradient-to-br from-amber-50/70 via-white to-slate-50 border-amber-200/60'
            : 'bg-gradient-to-br from-[#1E1B15] via-[#151719] to-[#121315] border-[#E5B65F]/20'
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#E5B65F] text-slate-950">
                {activeExperience.name}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                • Est. Total: KSh {activeExperience.estimatedBudget.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                • Duration: {activeExperience.estimatedDuration}
              </span>
            </div>

            <p className={cn('text-sm sm:text-base font-semibold', isLight ? 'text-slate-800' : 'text-gray-200')}>
              {activeExperience.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeExperience.vibeTags.map((vibe) => (
                <span
                  key={vibe}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                    isLight
                      ? 'bg-white/80 border-slate-200 text-slate-600'
                      : 'bg-white/5 border-white/10 text-gray-300'
                  )}
                >
                  #{vibe}
                </span>
              ))}
            </div>
          </div>

          {/* Area Filter Selector inside Active World */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <MapPin size={14} className="text-[#7d5a11] dark:text-[#E5B65F]" />
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {availableAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedAreaFilter(area)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer border',
                    selectedAreaFilter === area
                      ? isLight
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-950 border-white'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Multi-Step Experience Chain */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Orchestrated Journey ({activeExperience.steps.length} Phases)
            </span>
            <span className="text-[11px] font-semibold text-[#7d5a11] dark:text-[#E5B65F]">
              Click step to explore offerings
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeExperience.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={cn(
                    'relative p-3.5 rounded-2xl border transition-colors duration-200 cursor-pointer text-left',
                    isActive
                      ? isLight
                        ? 'bg-white border-[#B88728] shadow-md ring-2 ring-[#B88728]/20'
                        : 'bg-[#181A1F] border-[#E5B65F] shadow-lg ring-2 ring-[#E5B65F]/20'
                      : isLight
                      ? 'bg-white/70 hover:bg-white border-slate-200/80'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#7d5a11] dark:text-[#E5B65F]">
                      <span className="w-5 h-5 rounded-full bg-[#E5B65F]/20 flex items-center justify-center text-[10px]">
                        {step.stepNumber}
                      </span>
                      <span>Phase {step.stepNumber}</span>
                    </span>
                    <span className="text-[10px] font-semibold opacity-70 flex items-center gap-1">
                      <Clock size={10} />
                      {step.defaultTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">
                    {step.stepName}
                  </h4>
                  <p className={cn('text-[11px] line-clamp-1 mt-0.5', isLight ? 'text-slate-500' : 'text-gray-400')}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. LEVEL 3: WOLT-GRADE MERCHANT CARDS FOR THE ACTIVE PHASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{activeStep.stepName}</span>
              <span className="text-xs font-normal text-slate-400 dark:text-gray-500">
                ({stepMerchants.length} curated partners)
              </span>
            </h3>
            <p className={cn('text-xs', isLight ? 'text-slate-500' : 'text-gray-400')}>
              {activeStep.description} • {activeStep.category}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) {
                onSelectCategory(activeStep.categoryId);
              }
            }}
            className="text-xs font-bold text-[#7d5a11] dark:text-[#E5B65F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See all {activeStep.category}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Merchant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stepMerchants.map((merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onSelectMerchant={onSelectMerchant}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      </div>

      {/* 5. LEVEL 4: EXPANDABLE FULL ITINERARY DRAWER */}
      {isFullDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={cn(
              'w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border',
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#151719] border-white/10 text-white'
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d5a11] dark:text-[#E5B65F]">
                  NEXG Experience Orchestrator
                </span>
                <h3 className="text-xl font-bold">{activeExperience.name} Full Itinerary</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFullDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Step-by-Step Experience Breakdown
                </h4>
                <div className="space-y-3">
                  {activeExperience.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className={cn(
                        'p-4 rounded-2xl border flex items-center justify-between gap-4',
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E5B65F]/20 text-[#7d5a11] dark:text-[#E5B65F] flex items-center justify-center font-bold">
                          {step.stepNumber}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold">{step.stepName}</h5>
                          <p className="text-xs text-slate-500 dark:text-gray-400">{step.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                        {step.defaultTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold">
                Estimated Total: KSh {activeExperience.estimatedBudget.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setIsFullDrawerOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#E5B65F] text-slate-950 hover:bg-[#d6a854] transition-colors cursor-pointer"
              >
                Explore Offerings in Main Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
