// src/components/nexg/CategoryPage.tsx
// Category & Subcategory Discovery Page: Category Hero, Subcategory Rail,
// Capability-Driven Filters, Wolt Merchant Grid, and Popular Items Rail.

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Bike,
  Sparkles,
  ChevronRight,
  X,
  MapPin,
  Check,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { NexGMerchant, NexGCatalogItem } from '../../types/nexg';
import { MerchantCard } from './MerchantCard';

interface SubcategoryInfo {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  subcategories: SubcategoryInfo[];
  image_url?: string;
  description?: string;
}

interface CategoryPageProps {
  category: CategoryInfo;
  merchants: NexGMerchant[];
  initialSubcategoryId?: string;
  onBackToHome: () => void;
  onSelectMerchant: (merchant: NexGMerchant) => void;
  onSelectItem: (item: NexGCatalogItem, merchant: NexGMerchant) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  merchants,
  initialSubcategoryId,
  onBackToHome,
  onSelectMerchant,
  onSelectItem,
}) => {
  const { isLight } = useTheme();

  // Active subcategory state (empty = all in category)
  const [selectedSubcatId, setSelectedSubcatId] = useState<string>(
    initialSubcategoryId || 'all'
  );

  // Filter states
  const [selectedSort, setSelectedSort] = useState<'rating' | 'delivery' | 'price'>('rating');
  const [filterFreeDelivery, setFilterFreeDelivery] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(true);
  const [filterPriceLevel, setFilterPriceLevel] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Merchants in this category
  const categoryMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const matchCat =
        m.categoryId === category.id ||
        m.category.toLowerCase() === category.name.toLowerCase();

      const matchSub =
        selectedSubcatId === 'all' ||
        m.subcategoryId === selectedSubcatId ||
        m.subcategory.toLowerCase() === selectedSubcatId.toLowerCase();

      const matchSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDelivery = !filterFreeDelivery || m.deliveryFee === 0;
      const matchPrice = filterPriceLevel === null || m.priceLevel === filterPriceLevel;

      return matchCat && matchSub && matchSearch && matchDelivery && matchPrice;
    });
  }, [
    merchants,
    category,
    selectedSubcatId,
    searchQuery,
    filterFreeDelivery,
    filterPriceLevel,
  ]);

  // Sort merchants
  const sortedMerchants = useMemo(() => {
    return [...categoryMerchants].sort((a, b) => {
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'delivery') return a.deliveryTimeMin - b.deliveryTimeMin;
      if (selectedSort === 'price') return a.priceLevel - b.priceLevel;
      return 0;
    });
  }, [categoryMerchants, selectedSort]);

  // Extract popular items from these merchants
  const popularItems = useMemo(() => {
    return categoryMerchants
      .flatMap((m) => m.items || [])
      .slice(0, 8);
  }, [categoryMerchants]);

  return (
    <div
      className={cn(
        'min-h-screen transition-colors pb-24',
        isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#111315] text-[#f2f2f2]'
      )}
    >
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div
        className={cn(
          'sticky top-0 z-30 border-b backdrop-blur-xl transition-colors',
          isLight ? 'bg-white/90 border-slate-200 shadow-2xs' : 'bg-[#141618]/90 border-white/10'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border cursor-pointer',
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              )}
            >
              <ArrowLeft size={14} />
              <span>Discovery</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>NEXG</span>
              <ChevronRight size={12} />
              <span className="text-slate-900 dark:text-white font-bold">{category.name}</span>
              {selectedSubcatId !== 'all' && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-[#B88728] dark:text-[#E5B65F] font-bold">
                    {category.subcategories.find((s) => s.id === selectedSubcatId)?.name ||
                      selectedSubcatId}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Search in Category */}
          <div
            className={cn(
              'flex items-center px-3.5 py-1.5 rounded-full border text-xs w-48 sm:w-72',
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
            )}
          >
            <Search size={14} className="mr-2 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}>
                <X size={13} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* 2. SUBCATEGORY RAIL */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => setSelectedSubcatId('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border',
              selectedSubcatId === 'all'
                ? isLight
                  ? 'bg-[#B88728] text-white border-[#B88728] shadow-xs'
                  : 'bg-[#E5B65F] text-slate-950 border-[#E5B65F] shadow-xs'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
            )}
          >
            All {category.name}
          </button>

          {category.subcategories.map((sub) => {
            const isActive = selectedSubcatId === sub.id || selectedSubcatId === sub.slug;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubcatId(sub.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border',
                  isActive
                    ? isLight
                      ? 'bg-[#B88728] text-white border-[#B88728] shadow-xs'
                      : 'bg-[#E5B65F] text-slate-950 border-[#E5B65F] shadow-xs'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                )}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. HERO & CAPABILITY-DRIVEN FILTER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {selectedSubcatId === 'all'
                ? category.name
                : category.subcategories.find((s) => s.id === selectedSubcatId)?.name ||
                  category.name}
            </h1>
            <p className={cn('text-xs sm:text-sm mt-0.5', isLight ? 'text-slate-500' : 'text-gray-400')}>
              Showing {sortedMerchants.length} verified Nairobi partners
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterFreeDelivery(!filterFreeDelivery)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5',
                filterFreeDelivery
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              )}
            >
              <Bike size={13} />
              <span>Free Delivery</span>
            </button>

            {/* Price Level Toggles */}
            <div className="flex items-center rounded-full border p-0.5 border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
              {[1, 2, 3, 4].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() =>
                    setFilterPriceLevel(filterPriceLevel === tier ? null : tier)
                  }
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer',
                    filterPriceLevel === tier
                      ? 'bg-[#E5B65F] text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {'$'.repeat(tier)}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none',
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#181A1F] border-white/10 text-white'
              )}
            >
              <option value="rating">Top Rated</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="price">Price Level</option>
            </select>
          </div>
        </div>

        {/* 4. POPULAR ITEMS RAIL */}
        {popularItems.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Popular in {category.name}
            </span>
            <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none pb-2">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const foundMerchant = merchants.find((m) => m.id === item.merchantId);
                    if (foundMerchant) onSelectItem(item, foundMerchant);
                  }}
                  className={cn(
                    'group/pop flex-shrink-0 w-48 sm:w-56 p-2.5 rounded-2xl border transition duration-200 hover:shadow-md cursor-pointer',
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#B88728]/50'
                      : 'bg-[#181A1F] border-white/10 hover:border-[#E5B65F]/50'
                  )}
                >
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/pop:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.merchantName}</p>
                  <span className="text-xs font-extrabold text-[#B88728] dark:text-[#E5B65F] mt-1 block">
                    KSh {item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. WOLT-GRADE MERCHANT GRID */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              All {selectedSubcatId === 'all' ? category.name : 'Partners'} ({sortedMerchants.length})
            </h3>
          </div>

          {sortedMerchants.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm font-semibold text-slate-400">
                No merchants found matching your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSubcatId('all');
                  setSearchQuery('');
                  setFilterFreeDelivery(false);
                  setFilterPriceLevel(null);
                }}
                className="text-xs font-bold text-[#B88728] dark:text-[#E5B65F] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMerchants.map((merchant) => (
                <MerchantCard
                  key={merchant.id}
                  merchant={merchant}
                  onSelectMerchant={onSelectMerchant}
                  onSelectItem={onSelectItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
