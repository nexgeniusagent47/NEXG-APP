import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNexGNavigation } from './NexGNavigationContext';
import { NexGEntityCard, NexGEntityData } from './NexGEntityCard';
import { cn } from '../../lib/utils';

export interface NexGCollectionData {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  items: NexGEntityData[];
}

interface NexGCollectionRailProps {
  collection: NexGCollectionData;
  onViewAll?: () => void;
}

export const NexGCollectionRail: React.FC<NexGCollectionRailProps> = ({
  collection,
  onViewAll,
}) => {
  const { isLight } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-4 my-8">
      {/* Rail Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {collection.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E5B65F] text-slate-950 px-2 py-0.5 rounded-full">
                {collection.badge}
              </span>
            )}
            <span className="text-xs font-bold text-[#7d5a11] dark:text-[#E5B65F] flex items-center gap-1">
              <Sparkles size={13} />
              <span>Curated Collection</span>
            </span>
          </div>
          <h3 className={cn(
            'text-xl sm:text-2xl font-bold tracking-tight',
            isLight ? 'text-slate-900' : 'text-white'
          )}>
            {collection.title}
          </h3>
          <p className={cn('text-xs mt-0.5', isLight ? 'text-slate-600' : 'text-gray-400')}>
            {collection.subtitle}
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className={cn(
                'hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer mr-1',
                isLight
                  ? 'border-slate-200 text-slate-700 hover:text-[#B88728] hover:border-[#B88728]'
                  : 'border-white/10 text-gray-300 hover:text-[#E5B65F] hover:border-[#E5B65F]'
              )}
            >
              <span>Explore All</span>
              <ArrowRight size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => scroll('left')}
            className={cn(
              'w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer',
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className={cn(
              'w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer',
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
            )}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {collection.items.map((item, idx) => (
          <div
            key={idx}
            className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
          >
            <NexGEntityCard entity={item} variant="vertical" className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
