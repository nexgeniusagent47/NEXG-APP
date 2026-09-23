import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface NexGInfiniteFeedProps<T> {
  items: T[];
  batchSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  emptyState?: React.ReactNode;
  gridClassName?: string;
  itemTypeLabel?: string; // e.g. "experiences", "merchants", "products", "services"
  enableAutoScroll?: boolean;
}

export function NexGInfiniteFeed<T>({
  items,
  batchSize = 12,
  renderItem,
  renderSkeleton,
  emptyState,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  itemTypeLabel = 'offerings',
  enableAutoScroll = true,
}: NexGInfiniteFeedProps<T>) {
  const { isLight } = useTheme();
  const [displayedCount, setDisplayedCount] = useState<number>(batchSize);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset displayed count when item dataset changes
  useEffect(() => {
    setDisplayedCount(batchSize);
  }, [items, batchSize]);

  const hasMore = displayedCount < items.length;

  const loadNextBatch = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    // Micro-timeout to provide smooth spring feel and zero layout thrash
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + batchSize, items.length));
      setIsLoadingMore(false);
    }, 280);
  }, [isLoadingMore, hasMore, batchSize, items.length]);

  // IntersectionObserver for auto infinite scroll
  useEffect(() => {
    if (!enableAutoScroll || !hasMore) return;

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextBatch();
        }
      },
      {
        rootMargin: '250px',
        threshold: 0.1,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [enableAutoScroll, hasMore, loadNextBatch]);

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        {emptyState || (
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-dashed text-center">
            <p className={isLight ? 'text-slate-600 font-medium text-sm' : 'text-gray-400 font-medium text-sm'}>
              No {itemTypeLabel} matching your current filters.
            </p>
          </div>
        )}
      </div>
    );
  }

  const visibleItems = items.slice(0, displayedCount);

  return (
    <div className="w-full space-y-6">
      {/* Items Grid */}
      <div className={gridClassName}>
        {visibleItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {renderItem(item, idx)}
          </React.Fragment>
        ))}
      </div>

      {/* Loading Skeletons */}
      {isLoadingMore && (
        <div className={gridClassName}>
          {Array.from({ length: Math.min(4, items.length - displayedCount) }).map((_, sIdx) =>
            renderSkeleton ? (
              <React.Fragment key={`skel-${sIdx}`}>{renderSkeleton()}</React.Fragment>
            ) : (
              <div
                key={`skel-${sIdx}`}
                className={cn(
                  'h-64 rounded-2xl animate-status border',
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'
                )}
              />
            )
          )}
        </div>
      )}

      {/* Infinite Scroll Sentinel & Batch Control */}
      <div ref={sentinelRef} className="pt-4 flex flex-col items-center justify-center space-y-2">
        {hasMore ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={loadNextBatch}
              disabled={isLoadingMore}
              className={cn(
                'px-6 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border shadow-xs cursor-pointer',
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-[#B88728]'
                  : 'bg-[#181A1F] hover:bg-[#202328] text-gray-200 border-white/10 hover:border-[#E5B65F]'
              )}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7d5a11] dark:text-[#E5B65F]" />
                  <span>Loading more curated {itemTypeLabel}...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7d5a11] dark:text-[#E5B65F]" />
                  <span>
                    Load more ({displayedCount} of {items.length} {itemTypeLabel})
                  </span>
                </>
              )}
            </button>
            <div className="w-48 h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mt-1">
              <div
                className="h-full bg-[#B88728] dark:bg-[#E5B65F] transition-colors duration-300"
                style={{ width: `${(displayedCount / items.length) * 100}%` }}
              />
            </div>
          </div>
        ) : items.length > batchSize ? (
          <div className="py-4 text-center">
            <p
              className={cn(
                'text-xs font-semibold flex items-center justify-center gap-1.5',
                isLight ? 'text-slate-400' : 'text-gray-500'
              )}
            >
              <Sparkles className="w-3 h-3 text-[#7d5a11] dark:text-[#E5B65F]" />
              <span>You have reached the end of all {items.length} {itemTypeLabel}</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
