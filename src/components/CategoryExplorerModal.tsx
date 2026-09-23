import { useState, useMemo, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATALOG, Category } from '../data/merchantCatalog';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface CategoryExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
  initialQuery?: string;
}

export default function CategoryExplorerModal({
  isOpen,
  onClose,
  onNavigate,
  initialQuery = '',
}: CategoryExplorerModalProps) {
  const { isLight } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, initialQuery, onClose]);

  // Dynamic icon renderer ensuring strict single-color styling
  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    const IconComponent = (Icons as any)[iconName] || Icons.Sparkles;
    return (
      <IconComponent
        className={`${className} ${
          isLight ? 'text-[#8A6413]' : 'text-[#E5B65F]'
        }`}
      />
    );
  };

  // Map category ID to target page if one exists
  const getCategoryPage = (catId: string): string => {
    switch (catId) {
      case 'restaurants_food':
        return 'restaurants';
      case 'experiences':
        return 'experiences';
      case 'wellness':
        return 'spa';
      case 'airport_transfers':
      case 'vehicle_rentals':
        return 'transport';
      case 'groceries_essentials':
      case 'alcohol_beverages':
        return 'groceries';
      default:
        return 'merchants';
    }
  };

  const handleSelectCategory = (cat: Category) => {
    const page = getCategoryPage(cat.id);
    onClose();
    onNavigate?.(page);
  };

  const handleSelectSubcategory = (cat: Category) => {
    const page = getCategoryPage(cat.id);
    onClose();
    onNavigate?.(page);
  };

  // Filter categories and subcategories
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CATALOG.map((cat) => {
      const matchCat = cat.name.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q);
      const matchedSubs = cat.subcategories.filter(
        (sub) => sub.name.toLowerCase().includes(q) || sub.id.toLowerCase().includes(q)
      );

      if (!q) {
        return cat;
      }

      if (matchCat) {
        return cat;
      }

      if (matchedSubs.length > 0) {
        return {
          ...cat,
          subcategories: matchedSubs,
        };
      }

      return null;
    }).filter(Boolean) as Category[];
  }, [searchQuery]);

  const displayedCategories = useMemo(() => {
    if (selectedCategoryId === 'all') return filteredCategories;
    return filteredCategories.filter((c) => c.id === selectedCategoryId);
  }, [filteredCategories, selectedCategoryId]);

  const totalSubcategoriesCount = useMemo(() => {
    return CATALOG.reduce((acc, c) => acc + c.subcategories.length, 0);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Professional Multi-Stage Progressive Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 backdrop-blur-2xl transition-opacity duration-300 ${
            isLight
              ? 'bg-slate-900/40'
              : 'bg-black/75'
          }`}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full max-w-5xl max-h-[90vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden z-10 border transition ${
            isLight
              ? 'bg-white/95 text-slate-900 border-slate-200/90 shadow-2xl'
              : 'bg-[#15171a]/95 text-white border-white/15 shadow-2xl'
          }`}
        >
          {/* Top Search & Header Bar */}
          <div
            className={`p-5 sm:p-6 border-b flex flex-col gap-4 ${
              isLight
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-[#1a1d21]/80 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xs ${
                    isLight
                      ? 'bg-amber-50 border-amber-200 text-[#B88728]'
                      : 'bg-white/5 border-white/10 text-[#E5B65F]'
                  }`}
                >
                  <Icons.Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    Merchant Categories & Subcategories
                  </h2>
                  <p
                    className={`text-xs font-medium ${
                      isLight ? 'text-slate-500' : 'text-gray-400'
                    }`}
                  >
                    21 Curated Verticals • {totalSubcategoriesCount} Specialized Subcategories
                  </p>
                </div>
              </div>

              <button
                id="close-category-explorer-btn"
                onClick={onClose}
                aria-label="Close categories"
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <Icons.X size={18} />
              </button>
            </div>

            {/* Real-time Category & Subcategory Search Field */}
            <div className="relative">
              <Icons.Search
                size={18}
                className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isLight ? 'text-[#8A6413]' : 'text-[#E5B65F]'
                }`}
              />
              <input
                id="category-explorer-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 21 categories & 134 subcategories (e.g. Fine Dining, Vapes, Chauffeur, Safari)..."
                autoFocus
                className={`w-full pl-11 pr-10 py-3 rounded-xl text-sm font-medium border transition-colors focus:outline-none focus:ring-2 ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-[#B88728]/40 focus:border-[#B88728]'
                    : 'bg-[#111315] border-white/10 text-white placeholder:text-gray-500 focus:ring-[#E5B65F]/40 focus:border-[#E5B65F]'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg ${
                    isLight
                      ? 'text-slate-400 hover:text-slate-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icons.X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs font-semibold">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-3 py-1.5 rounded-full border transition whitespace-nowrap cursor-pointer ${
                  selectedCategoryId === 'all'
                    ? isLight
                      ? 'bg-[#B88728] text-slate-950 border-[#B88728] shadow-xs'
                      : 'bg-[#E5B65F] text-black border-[#E5B65F] font-bold shadow-xs'
                    : isLight
                    ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                All Categories ({CATALOG.length})
              </button>
              {CATALOG.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`px-3 py-1.5 rounded-full border transition whitespace-nowrap cursor-pointer ${
                    selectedCategoryId === c.id
                      ? isLight
                        ? 'bg-[#B88728] text-slate-950 border-[#B88728] shadow-xs'
                        : 'bg-[#E5B65F] text-black border-[#E5B65F] font-bold shadow-xs'
                      : isLight
                      ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid List */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
            {displayedCategories.length === 0 ? (
              <div className="py-16 text-center">
                <Icons.SearchX
                  size={40}
                  className={`mx-auto mb-3 ${
                    isLight ? 'text-slate-300' : 'text-gray-600'
                  }`}
                />
                <h3 className="text-base font-bold mb-1">No matching verticals found</h3>
                <p
                  className={`text-xs ${
                    isLight ? 'text-slate-500' : 'text-gray-400'
                  }`}
                >
                  Try searching for another keyword or clear the search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId('all');
                  }}
                  className={`mt-4 px-4 py-2 text-xs font-bold rounded-xl border transition-colors ${
                    isLight
                      ? 'bg-amber-50 border-amber-300 text-[#B88728]'
                      : 'bg-white/5 border-white/15 text-[#E5B65F]'
                  }`}
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {displayedCategories.map((cat) => (
                  <div
                    key={cat.id}
                    id={`cat-card-${cat.id}`}
                    className={`rounded-2xl p-4 sm:p-5 border transition duration-200 flex flex-col justify-between group ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
                        : 'bg-[#181a1e] border-white/10 hover:border-[#E5B65F]/60 hover:shadow-lg'
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                              isLight
                                ? 'bg-amber-50/90 border-amber-200'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            {renderIcon(cat.icon, 'w-5 h-5')}
                          </div>
                          <div>
                            <h3
                              onClick={() => handleSelectCategory(cat)}
                              className={`text-base font-bold tracking-tight cursor-pointer transition-colors ${
                                isLight
                                  ? 'group-hover:text-[#B88728]'
                                  : 'group-hover:text-[#E5B65F]'
                              }`}
                            >
                              {cat.name}
                            </h3>
                            <p
                              className={`text-xs line-clamp-1 ${
                                isLight ? 'text-slate-500' : 'text-gray-400'
                              }`}
                            >
                              {cat.desc}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectCategory(cat)}
                          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex-shrink-0 ${
                            isLight
                              ? 'bg-slate-50 hover:bg-amber-50 text-[#B88728] border-slate-200 hover:border-amber-300'
                              : 'bg-white/5 hover:bg-white/10 text-[#E5B65F] border-white/10 hover:border-[#E5B65F]/40'
                          }`}
                        >
                          <span>Explore</span>
                          <Icons.ArrowRight size={12} />
                        </button>
                      </div>

                      {/* Subcategories Chips */}
                      <div className="mt-3 pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider ${
                              isLight ? 'text-slate-400' : 'text-gray-500'
                            }`}
                          >
                            Subcategories ({cat.subcategories.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleSelectSubcategory(cat)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                isLight
                                  ? 'bg-slate-50 hover:bg-amber-50/80 text-slate-700 hover:text-[#B88728] border-slate-200/80 hover:border-amber-300'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#E5B65F] border-white/10 hover:border-[#E5B65F]/40'
                              }`}
                            >
                              {renderIcon(sub.icon, 'w-3.5 h-3.5')}
                              <span>{sub.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom hint badge */}
                    <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-medium opacity-80 border-t border-black/5 dark:border-white/5">
                      <span className="flex items-center gap-1">
                        <Icons.CheckCircle2 size={12} className={isLight ? 'text-emerald-600' : 'text-emerald-400'} />
                        <span className={isLight ? 'text-slate-600' : 'text-gray-400'}>
                          Verified Merchant Partners
                        </span>
                      </span>
                      <span
                        onClick={() => handleSelectCategory(cat)}
                        className={`font-semibold cursor-pointer underline-offset-2 hover:underline ${
                          isLight ? 'text-[#8A6413]' : 'text-[#E5B65F]'
                        }`}
                      >
                        View listings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Footer Info */}
          <div
            className={`px-6 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-[#1a1d21] border-white/10 text-gray-400'
            }`}
          >
            <span>Click any category or subcategory to instantly browse partners</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigate?.('merchant_onboarding');
                }}
                className={`font-bold transition-colors cursor-pointer ${
                  isLight ? 'text-[#B88728] hover:text-[#916719]' : 'text-[#E5B65F] hover:text-white'
                }`}
              >
                + Register New Merchant
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
