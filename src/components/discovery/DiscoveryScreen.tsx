// src/components/discovery/DiscoveryScreen.tsx
//
// The merchant discovery surface.
//
// This is what the search bar opens. It replaces the previous behaviour, where
// clicking search opened a taxonomy modal listing categories with no merchants,
// no results, no sorting and no filters.
//
// It is a real browse surface: live search, a vertical rail, subcategory chips,
// sorting and pagination, all fed by the API. It reads API slugs only and never
// touches the legacy CATEGORIES_21 taxonomy, whose slugs do not match the
// database (v1 handoff section 5.3).

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  X,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Store,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';
import { fetchCategories, type ApiCategory, type ApiMerchant } from '../../lib/apiClient';
import { emojiFor, categoryEmoji } from '../../data/railEmoji';
import { useMerchantSearch, SORT_OPTIONS, type SortKey } from '../../hooks/useMerchantSearch';
import { DiscoveryMerchantCard } from './DiscoveryMerchantCard';

interface DiscoveryScreenProps {
  /** Optional query to seed the field, e.g. from the hero search box. */
  initialQuery?: string;
  onBack: () => void;
  onOpenMerchant: (merchant: ApiMerchant) => void;
}

export default function DiscoveryScreen({
  initialQuery = '',
  onBack,
  onOpenMerchant,
}: DiscoveryScreenProps) {
  const { isLight } = useTheme();
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState<string>('all');
  const [subcategoryId, setSubcategoryId] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('recommended');
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // The docked rail sits directly under the header, so its offset is the header's
  // measured height rather than a guessed constant. Measured at runtime because the
  // header wraps on narrow screens, and a hardcoded value that is 40px out leaves a
  // visible gap for merchants to scroll through.
  const headerRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isRailDocked, setIsRailDocked] = useState(false);
  const activeChipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 0;
      setHeaderHeight(Math.round(h));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // "Docked" means the rail has reached its sticky offset, which is what decides
  // whether it paints a scrim. Keying this off window.scrollY instead would be wrong:
  // the rail is already stuck at the top of the page on short viewports, so a
  // scroll-based test reports undocked while it is visibly pinned.
  useEffect(() => {
    const onScroll = () => {
      const rail = railRef.current;
      if (!rail) return;
      setIsRailDocked(rail.getBoundingClientRect().top <= headerHeight + 2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headerHeight]);

  // Keep the selected vertical visible in the rail. Without this, choosing a
  // category far down the list leaves the active chip scrolled out of sight, so the
  // rail stops reporting which vertical you are actually browsing.
  useEffect(() => {
    activeChipRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [categoryId, reduceMotion]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId]
  );

  const { merchants, total, loading, loadingMore, error, hasMore, loadMore, retry } =
    useMerchantSearch({
      category: categoryId === 'all' ? undefined : categoryId,
      subcategory: subcategoryId === 'all' ? undefined : subcategoryId,
      query,
      sort,
      pageSize: 24,
    });

  // Load the vertical rail once.
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        setCategoriesError(err?.message ?? 'Could not load categories');
      });
    return () => controller.abort();
  }, []);

  // Focus the field on entry: the user clicked a search bar to get here.
  useEffect(() => {
    const timer = window.setTimeout(() => searchRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  // NOTE: deliberately no Escape handler on this surface.
  //
  // An earlier pass also bound Escape to "leave discovery". That raced the preview
  // sheet's own Escape handler, so pressing Escape with the sheet open could tear
  // down the entire surface instead of closing the sheet. A modal owns Escape
  // while it is open; this surface leaves the key alone and relies on the visible
  // Back control for navigation.

  // Infinite scroll. IntersectionObserver rather than a scroll listener:
  // a scroll handler would fire continuously and force layout on every frame.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && !loading) loadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  const handleSelectCategory = (id: string) => {
    setCategoryId(id);
    setSubcategoryId('all');
  };

  return (
    <div
      className={cn(
        'min-h-[100dvh] transition-colors duration-500',
        isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#111315] text-[#f2f2f2]'
      )}
    >
      {/* ---------------------------------------------------------------- header */}
      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-40 border-b backdrop-blur-2xl',
          isLight ? 'bg-white/90 border-slate-200' : 'bg-[#141618]/92 border-white/10'
        )}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border',
              'transition-transform duration-200 active:scale-95',
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            )}
          >
            <ArrowLeft size={16} />
          </button>

          <div
            className={cn(
              'flex-1 flex items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors',
              isLight
                ? 'bg-slate-50 border-slate-200 focus-within:border-[#B88728] focus-within:bg-white'
                : 'bg-white/5 border-white/10 focus-within:border-[#E5B65F]'
            )}
          >
            <Search size={16} className="flex-shrink-0 text-[#8A6413] dark:text-[#E5B65F]" />
            <input
              ref={searchRef}
              id="discovery-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants, spa, safaris, champagne, chauffeur, pharmacy..."
              aria-label="Search merchants"
              className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-600 dark:placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                  isLight ? 'text-slate-500 hover:bg-slate-200' : 'text-gray-400 hover:bg-white/10'
                )}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Subcategory chips + sort */}
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            <Chip
              isLight={isLight}
              active={subcategoryId === 'all'}
              onClick={() => setSubcategoryId('all')}
            >
              All
            </Chip>
            {(activeCategory?.subcategories ?? []).map((sub) => (
              <Chip
                key={sub.id}
                isLight={isLight}
                active={subcategoryId === sub.id}
                onClick={() => setSubcategoryId(sub.id)}
                // Falls back to the parent category's emoji, so a subcategory with no
                // entry of its own still shows a glyph rather than a blank leading gap.
                emoji={emojiFor(activeCategory?.id, sub.name) ?? categoryEmoji(activeCategory?.id)}
              >
                {sub.name}
              </Chip>
            ))}
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap',
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
              )}
            >
              <SlidersHorizontal size={12} />
              <span className="hidden sm:inline">
                {SORT_OPTIONS.find((o) => o.key === sort)?.label}
              </span>
              <ChevronDown size={12} className={cn('transition-transform', sortOpen && 'rotate-180')} />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <ul
                  role="listbox"
                  className={cn(
                    'absolute right-0 top-full mt-2 z-20 w-52 rounded-xl border shadow-2xl overflow-hidden py-1',
                    isLight ? 'bg-white border-slate-200' : 'bg-[#1A1D21] border-white/10'
                  )}
                >
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === option.key}
                        onClick={() => {
                          setSort(option.key);
                          setSortOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2 text-xs font-semibold transition-colors',
                          sort === option.key
                            ? 'text-[#8A6413] dark:text-[#E5B65F]'
                            : isLight
                            ? 'text-slate-700 hover:bg-slate-50'
                            : 'text-gray-300 hover:bg-white/5'
                        )}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ body */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex gap-6">
        {/* Vertical rail */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-[124px] space-y-1">
            <h2
              className={cn(
                'px-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.16em]',
                isLight ? 'text-slate-600' : 'text-gray-400'
              )}
            >
              All verticals
            </h2>
            <RailButton isLight={isLight} active={categoryId === 'all'} onClick={() => handleSelectCategory('all')}>
              <Store size={15} />
              <span className="flex-1 truncate">Everything</span>
              <span className="text-[10px] font-bold opacity-60">{total || ''}</span>
            </RailButton>

            {categories.map((category) => (
              <RailButton
                key={category.id}
                isLight={isLight}
                active={categoryId === category.id}
                onClick={() => handleSelectCategory(category.id)}
              >
                <span className="flex-1 truncate">{category.name}</span>
                <span className="text-[10px] font-bold opacity-60">{category.subcategories.length}</span>
              </RailButton>
            ))}

            {categoriesError && (
              <p className="px-3 pt-2 text-[11px] font-medium text-amber-500">{categoriesError}</p>
            )}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          {/* Vertical chips, docked.
              Below `lg` there is no room for the left rail, so the categories used
              to scroll away with the results — once you were 20 merchants down there
              was no way to change vertical without scrolling back to the top. This
              docks directly under the header (top-[66px], matching its height) and
              keeps the categories reachable for the whole browse, the same way the
              merchant page's section rail does.

              The negative margins let it span the full width of the scroller so
              chips pass under the page padding rather than being clipped at it. */}
          <div
            ref={railRef}
            className={cn(
              'lg:hidden sticky z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 mb-3',
              'flex gap-2 overflow-x-auto scrollbar-hide transition-colors duration-200',
              isRailDocked
                ? isLight
                  ? 'bg-[#f7f8fa]/95 backdrop-blur-md border-b border-slate-200'
                  : 'bg-[#111315]/95 backdrop-blur-md border-b border-white/10'
                : 'border-b border-transparent'
            )}
            style={{ top: headerHeight }}
            role="tablist"
            aria-label="Merchant categories"
          >
            <Chip
              isLight={isLight}
              active={categoryId === 'all'}
              onClick={() => handleSelectCategory('all')}
              ref={activeChipRef}
              emoji="✨"
            >
              Everything
            </Chip>
            {categories.map((category) => (
              <Chip
                key={category.id}
                isLight={isLight}
                active={categoryId === category.id}
                onClick={() => handleSelectCategory(category.id)}
                ref={categoryId === category.id ? activeChipRef : undefined}
                emoji={categoryEmoji(category.id)}
              >
                {category.name}
              </Chip>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-3 mb-4">
            <h1 className="text-lg sm:text-xl font-black tracking-tight">
              {query
                ? `Results for "${query}"`
                : activeCategory
                ? activeCategory.name
                : 'All merchants'}
            </h1>
            {!loading && (
              <span className={cn('text-xs font-semibold', isLight ? 'text-slate-500' : 'text-gray-400')}>
                {total.toLocaleString()} {total === 1 ? 'merchant' : 'merchants'}
              </span>
            )}
          </div>
          {/* Error */}
          {error && (
            <div
              className={cn(
                'rounded-2xl border p-6 text-center',
                isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
              )}
            >
              <p className="text-sm font-bold text-rose-500">{error}</p>
              <p className={cn('text-xs mt-1', isLight ? 'text-slate-500' : 'text-gray-400')}>
                The API may not be running. Start it with <code className="font-mono">npm run server</code>.
              </p>
              <button
                type="button"
                onClick={retry}
                className={cn(
                  'mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold',
                  'bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d] active:scale-[0.98] transition-transform'
                )}
              >
                <RefreshCw size={13} />
                Try again
              </button>
            </div>
          )}

          {/* Skeletons */}
          {loading && !error && <SkeletonGrid isLight={isLight} />}

          {/* Empty */}
          {!loading && !error && merchants.length === 0 && (
            <div
              className={cn(
                'rounded-2xl border p-10 text-center',
                isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3',
                  isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-gray-400'
                )}
              >
                <Search size={20} />
              </div>
              <h3 className="text-sm font-bold">No merchants found</h3>
              <p className={cn('text-xs mt-1 max-w-sm mx-auto', isLight ? 'text-slate-500' : 'text-gray-400')}>
                {query
                  ? `Nothing matches "${query}" in this vertical. Try a different term or browse everything.`
                  : 'This vertical has no merchants yet.'}
              </p>
              {(query || categoryId !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    handleSelectCategory('all');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d] active:scale-[0.98] transition-transform"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!error && merchants.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                {merchants.map((merchant) => (
                  <DiscoveryMerchantCard
                    key={merchant.id}
                    merchant={merchant}
                    onOpen={onOpenMerchant}
                  />
                ))}
              </div>

              {loadingMore && <SkeletonGrid isLight={isLight} count={3} className="mt-5" />}

              <div ref={sentinelRef} className="h-10" />

              {hasMore && !loadingMore && (
                <div className="flex justify-center pb-8">
                  <button
                    type="button"
                    onClick={loadMore}
                    className={cn(
                      'px-5 py-2.5 rounded-full text-xs font-bold border transition-colors',
                      isLight
                        ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                        : 'bg-white/5 border-white/15 text-gray-100 hover:bg-white/10'
                    )}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ sub-pieces

const Chip = React.forwardRef<
  HTMLButtonElement,
  {
    isLight: boolean;
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    /** Emoji shown before the label. See src/data/railEmoji.ts for why emoji. */
    emoji?: string;
  }
>(({ isLight, active, onClick, children, emoji }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    role="tab"
    aria-selected={active}
    className={cn(
      // Sized to Wolt's rail: taller than a text pill so the emoji has room to read as a
      // glyph rather than a speck, which is what makes the rail scannable at a glance.
      // `gap` separates the glyph from the label without a wrapper element.
      'flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-colors',
      // Tactile press feedback on every chip: 100-160ms is Emil's band for a press, and
      // scale-only keeps it off the layout path.
      'active:scale-[0.97] transition-transform',
      active
        ? isLight
          ? 'bg-[#B88728] text-white border-[#B88728]'
          : 'bg-[#E5B65F] text-slate-950 border-[#E5B65F]'
        : isLight
        ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        : 'bg-white/8 text-gray-200 border-white/12 hover:bg-white/12'
    )}
  >
    {/* aria-hidden because the label already carries the meaning; a screen reader
        announcing "fork and knife emoji Restaurants" is noise, not information. */}
    {emoji && (
      <span aria-hidden="true" className="text-sm leading-none">
        {emoji}
      </span>
    )}
    {children}
  </button>
));
Chip.displayName = 'Chip';

const RailButton: React.FC<{
  isLight: boolean;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isLight, active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors',
      active
        ? isLight
          ? 'bg-[#B88728]/10 text-[#8A6413]'
          : 'bg-[#E5B65F]/15 text-[#E5B65F]'
        : isLight
        ? 'text-slate-600 hover:bg-slate-100'
        : 'text-gray-400 hover:bg-white/5'
    )}
  >
    {children}
  </button>
);

const SkeletonGrid: React.FC<{ isLight: boolean; count?: number; className?: string }> = ({
  isLight,
  count = 6,
  className,
}) => (
  <div
    className={cn(
      'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5',
      className
    )}
  >
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className={cn(
          'rounded-2xl overflow-hidden border animate-status',
          isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
        )}
      >
        <div className={cn('aspect-[16/10] w-full', isLight ? 'bg-slate-100' : 'bg-white/5')} />
        <div className="p-4 space-y-2.5">
          <div className={cn('h-3.5 rounded w-3/4', isLight ? 'bg-slate-100' : 'bg-white/5')} />
          <div className={cn('h-3 rounded w-1/2', isLight ? 'bg-slate-100' : 'bg-white/5')} />
          <div className={cn('h-3 rounded w-2/3', isLight ? 'bg-slate-100' : 'bg-white/5')} />
        </div>
      </div>
    ))}
  </div>
);
