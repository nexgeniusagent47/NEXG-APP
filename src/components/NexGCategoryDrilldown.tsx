import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  ArrowLeft,
  Sparkles,
  SlidersHorizontal,
  Plus,
  Check,
  Calendar,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
  Filter,
  Tag,
  Flame,
  Award,
} from 'lucide-react';
import LogoIcon from './LogoIcon';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import {
  CatalogCategory,
  CatalogMerchant,
  CatalogSubcategory,
  DynamicItem,
  getCategoryMerchants,
} from '../data/categoryCatalog21';
import { ProductCarousel, type Product } from './ui/product-carousel';

interface NexGCategoryDrilldownProps {
  category: CatalogCategory;
  onBackToDiscovery: () => void;
}

export default function NexGCategoryDrilldown({
  category,
  onBackToDiscovery,
}: NexGCategoryDrilldownProps) {
  const { isLight } = useTheme();
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMerchantId, setActiveMerchantId] = useState<string | null>(null);

  // NEXG filter states
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'delivery' | 'price_low' | 'price_high'>('recommended');
  const [filterRating45, setFilterRating45] = useState(false);
  const [filterFastDelivery, setFilterFastDelivery] = useState(false);
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);

  // Scroll ref for subcategories cards
  const subcategoryScrollRef = useRef<HTMLDivElement>(null);

  // Dynamic booking / order modal state
  const [selectedItemForWorkflow, setSelectedItemForWorkflow] = useState<{
    item: DynamicItem;
    merchant: CatalogMerchant;
  } | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-03-22');
  const [bookingTime, setBookingTime] = useState<string>('14:00');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const scrollSubcategories = (direction: 'left' | 'right') => {
    if (subcategoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      subcategoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fetch merchants for this category: each subcategory has 5 dedicated merchants (category total = subcategories * 5)
  const allCategoryMerchants = useMemo(() => getCategoryMerchants(category.id), [category.id]);

  // Displayed merchants filtered by selected subcategory:
  // If 'all', displays all merchants; if a specific subcategory is chosen, displays its 5 merchants!
  const displayedMerchants = useMemo(() => {
    if (selectedSubcategory === 'all') {
      return allCategoryMerchants;
    }
    return allCategoryMerchants.filter(
      (m) =>
        m.subcategoryName?.toLowerCase() === selectedSubcategory.toLowerCase() ||
        m.subcategoryId?.toLowerCase() === selectedSubcategory.toLowerCase() ||
        m.cuisineOrType.toLowerCase() === selectedSubcategory.toLowerCase()
    );
  }, [allCategoryMerchants, selectedSubcategory]);

  // Active merchant: ONLY set after a customer clicks a merchant card
  const currentMerchant = useMemo(() => {
    if (!activeMerchantId) return null;
    return allCategoryMerchants.find((m) => m.id === activeMerchantId) || null;
  }, [activeMerchantId, allCategoryMerchants]);

  // Filter and sort items of the current merchant (only active when currentMerchant is chosen)
  const filteredItems = useMemo(() => {
    if (!currentMerchant) return [];
    let items = currentMerchant.items.filter((item) => {
      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        const matchesSub = item.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();
        if (!matchesSub) return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.subcategory.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      // Rating 4.8+
      if (filterRating45 && item.rating < 4.8) {
        return false;
      }
      // Fast delivery (< 25 min)
      if (filterFastDelivery && !item.deliveryTime.includes('15 min') && !item.deliveryTime.includes('20 min')) {
        return false;
      }
      // Offers only
      if (filterDiscountOnly && !item.discount) {
        return false;
      }
      return true;
    });

    // Sorting
    return items.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return 0; // recommended
    });
  }, [
    currentMerchant,
    selectedSubcategory,
    searchQuery,
    filterRating45,
    filterFastDelivery,
    filterDiscountOnly,
    sortBy,
  ]);

  // Convert top items of current merchant to ProductCarousel format
  const carouselProducts: Product[] = useMemo(() => {
    if (!currentMerchant) return [];
    return currentMerchant.items.slice(0, 10).map((it) => ({
      id: it.id,
      name: it.name,
      quantity: it.quantity || 'Curated Selection',
      price: it.price,
      originalPrice: it.originalPrice,
      discount: it.discount,
      deliveryTime: it.deliveryTime,
      imageUrl: it.image,
      onAdd: () => {
        handleActionClick(it, currentMerchant);
      },
    }));
  }, [currentMerchant]);

  const handleActionClick = (item: DynamicItem, merchant: CatalogMerchant) => {
    if (item.workflowType === 'order') {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        category: category.id,
        quantity: 1,
      });
      setIsCartOpen(true);
    } else {
      setBookingSuccess(false);
      setSelectedItemForWorkflow({ item, merchant });
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedItemForWorkflow(null);
      setBookingSuccess(false);
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-300 ${
        isLight ? 'bg-[#f8f9fa] text-slate-900' : 'bg-[#111315] text-slate-100'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 border-b backdrop-blur-xl transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200/80 shadow-xs'
            : 'bg-[#111315]/95 border-white/10 shadow-md'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToDiscovery}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:border-[#B88728]'
                  : 'bg-[#181a1b] border-white/10 text-white hover:border-[#E5B65F]'
              }`}
              title="Back to Discovery"
            >
              <ArrowLeft size={18} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
            </button>

            {/* The supplied wordmark, replacing NEXG set in italic serif. */}
            <button
              onClick={onBackToDiscovery}
              className="cursor-pointer hover:opacity-90 flex items-center"
              aria-label="NEXG"
            >
              <LogoIcon variant="wordmark" className="h-8 w-auto" />
            </button>

            <div
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#181a1b] border-white/10 text-gray-300'
              }`}
            >
              <MapPin size={12} className={isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'} />
              <span>Nairobi Luxury District</span>
            </div>
          </div>

          {/* Search bar inside category */}
          <div className="flex-grow max-w-md">
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-colors ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800 focus-within:border-[#B88728]'
                  : 'bg-[#181a1b] border-white/10 text-white focus-within:border-[#E5B65F]'
              }`}
            >
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${category.name}...`}
                className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 space-y-9">
        {/* Category Hero / Title Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-10 bg-slate-950 text-white">
          <img
            src={category.bannerImage}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E5B65F]/20 text-[#E5B65F] border border-[#E5B65F]/30 backdrop-blur-md">
              <Sparkles size={12} />
              <span>Strict Category & Subcategory Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {category.name}
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* WOLT SUBCATEGORY VISUAL CARDS SECTION */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Subcategories</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#B88728]/15 dark:bg-[#E5B65F]/20 text-[#B88728] dark:text-[#E5B65F]">
                  {category.subcategories.length} Curated
                </span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Explore dedicated subcategories with specialized imagery and custom parameters
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollSubcategories('left')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-[#B88728] text-slate-700'
                    : 'bg-[#181a1b] border-white/10 hover:border-[#E5B65F] text-white'
                }`}
                title="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollSubcategories('right')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-[#B88728] text-slate-700'
                    : 'bg-[#181a1b] border-white/10 hover:border-[#E5B65F] text-white'
                }`}
                title="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontally scrollable Subcategory Cards */}
          <div
            ref={subcategoryScrollRef}
            className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-hide scroll-smooth"
          >
            {/* "All" card */}
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`flex-shrink-0 w-32 sm:w-36 rounded-2xl p-3 border transition cursor-pointer flex flex-col items-center text-center justify-between group ${
                selectedSubcategory === 'all'
                  ? isLight
                    ? 'bg-white border-[#B88728] ring-2 ring-[#B88728]/30 shadow-md scale-[1.02]'
                    : 'bg-[#181a1b] border-[#E5B65F] ring-2 ring-[#E5B65F]/30 shadow-lg scale-[1.02]'
                  : isLight
                  ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  : 'bg-[#181a1b] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden mb-2.5 bg-slate-900 flex items-center justify-center p-1.5">
                <img
                  src={category.bannerImage}
                  alt="All"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full">
                <span className="block font-bold text-xs text-foreground truncate">
                  All Items
                </span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                  Complete view
                </span>
              </div>
            </button>

            {/* Individual Subcategory Cards with relatable images */}
            {category.subcategories.map((sub: CatalogSubcategory) => {
              const isSelected = selectedSubcategory.toLowerCase() === sub.name.toLowerCase();
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.name)}
                  className={`flex-shrink-0 w-32 sm:w-36 rounded-2xl p-3 border transition cursor-pointer flex flex-col items-center text-center justify-between group ${
                    isSelected
                      ? isLight
                        ? 'bg-white border-[#B88728] ring-2 ring-[#B88728]/30 shadow-md scale-[1.02]'
                        : 'bg-[#181a1b] border-[#E5B65F] ring-2 ring-[#E5B65F]/30 shadow-lg scale-[1.02]'
                      : isLight
                      ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                      : 'bg-[#181a1b] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden mb-2.5 bg-slate-900 relative">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#E5B65F]/20 flex items-center justify-center">
                        <Check size={16} className="text-[#E5B65F] stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <span className="block font-bold text-xs text-foreground truncate" title={sub.name}>
                      {sub.name}
                    </span>
                    <span className={`text-[10px] block mt-0.5 truncate ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                      {sub.fulfillment_hint ? sub.fulfillment_hint.replace(/_/g, ' ') : 'Verified'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* WOLT FILTER BAR */}
        <section
          className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            isLight ? 'bg-white border-slate-200/90' : 'bg-[#181a1b] border-white/10'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 pr-2 border-r border-slate-200 dark:border-white/10">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </div>

            {/* Quick Filter: Rating 4.5+ */}
            <button
              onClick={() => setFilterRating45(!filterRating45)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterRating45
                  ? isLight
                    ? 'bg-[#B88728] text-white border-[#B88728]'
                    : 'bg-[#E5B65F] text-black border-[#E5B65F]'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>Rating 4.8+</span>
            </button>

            {/* Quick Filter: Fast Delivery */}
            <button
              onClick={() => setFilterFastDelivery(!filterFastDelivery)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterFastDelivery
                  ? isLight
                    ? 'bg-[#B88728] text-white border-[#B88728]'
                    : 'bg-[#E5B65F] text-black border-[#E5B65F]'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Clock size={12} />
              <span>Under 25 min</span>
            </button>

            {/* Quick Filter: Special Offers */}
            <button
              onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterDiscountOnly
                  ? isLight
                    ? 'bg-[#B88728] text-white border-[#B88728]'
                    : 'bg-[#E5B65F] text-black border-[#E5B65F]'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Tag size={12} />
              <span>Special Offers</span>
            </button>

            {(filterRating45 || filterFastDelivery || filterDiscountOnly || selectedSubcategory !== 'all') && (
              <button
                onClick={() => {
                  setFilterRating45(false);
                  setFilterFastDelivery(false);
                  setFilterDiscountOnly(false);
                  setSelectedSubcategory('all');
                }}
                className="text-xs text-rose-500 hover:underline font-bold px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-1.5 rounded-xl border font-bold outline-none cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-[#181a1b] border-white/10 text-white'
              }`}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* MERCHANTS (5 per subcategory, or all when 'all' is selected) */}
        <section id="merchants-selection-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Merchant Providers & Partners
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {selectedSubcategory === 'all'
                  ? `Showing ${displayedMerchants.length} premier partners (5 merchants per subcategory). Click any provider to reveal their live items.`
                  : `Showing 5 partners for ${selectedSubcategory}. Click any provider to reveal their live items.`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#B88728] dark:text-[#E5B65F]">
                {displayedMerchants.length} Partners
              </span>
              {currentMerchant && (
                <button
                  onClick={() => setActiveMerchantId(null)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {displayedMerchants.map((merchant) => {
              const isActive = activeMerchantId === merchant.id;
              return (
                <button
                  key={merchant.id}
                  onClick={() => {
                    setActiveMerchantId(merchant.id);
                    setTimeout(() => {
                      document.getElementById('active-merchant-banner')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className={`rounded-2xl border text-left transition cursor-pointer overflow-hidden flex flex-col justify-between group ${
                    isActive
                      ? isLight
                        ? 'bg-white border-[#B88728] ring-2 ring-[#B88728]/35 shadow-lg scale-[1.01]'
                        : 'bg-[#181a1b] border-[#E5B65F] ring-2 ring-[#E5B65F]/35 shadow-xl scale-[1.01]'
                      : isLight
                      ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                      : 'bg-[#181a1b] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative h-32 w-full overflow-hidden bg-slate-900 flex-shrink-0">
                    <img
                      src={merchant.heroImage}
                      alt={merchant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-md flex items-center gap-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span>{merchant.rating}</span>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-md flex items-center gap-1">
                      <Clock size={10} />
                      <span>{merchant.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex-grow flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            isActive
                              ? isLight
                                ? 'bg-[#B88728]/15 text-[#B88728]'
                                : 'bg-[#E5B65F]/20 text-[#E5B65F]'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400'
                          }`}
                        >
                          {merchant.cuisineOrType}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm truncate text-foreground group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors">
                        {merchant.name}
                      </h3>
                      <p className={`text-[11px] mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        {merchant.deliveryFee === 0 ? 'Free Delivery' : `Delivery: KSh ${merchant.deliveryFee}`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500 dark:text-gray-400 truncate max-w-[150px]">
                        {merchant.address}
                      </span>
                      {isActive ? (
                        <span className="text-[#B88728] dark:text-[#E5B65F] flex items-center gap-1 flex-shrink-0">
                          <Check size={12} className="stroke-[3]" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] flex-shrink-0">
                          &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* ITEM CARDS SECTION: ONLY SHOWN AFTER A MERCHANT HAS BEEN CLICKED!    */}
        {/* ==================================================================== */}
        {!currentMerchant ? (
          <section className="py-6">
            <div
              className={`p-10 text-center rounded-3xl border border-dashed transition ${
                isLight ? 'bg-white border-slate-300 shadow-xs' : 'bg-[#181a1b] border-white/15'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-[#B88728]/10 dark:bg-[#E5B65F]/15 flex items-center justify-center text-[#B88728] dark:text-[#E5B65F]">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Select a Merchant Provider Above
              </h3>
              <p className={`text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                To view item cards, please click any of the verified merchant providers above. Their full 30-item catalog, specifications, and instant ordering will appear here.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
                {displayedMerchants.slice(0, 5).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMerchantId(m.id);
                      setTimeout(() => {
                        document.getElementById('active-merchant-banner')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 hover:border-[#B88728] dark:hover:border-[#E5B65F] bg-slate-50 dark:bg-white/5 transition cursor-pointer flex items-center gap-1.5 hover:scale-105"
                  >
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Active Provider Info Banner */}
            <section
              id="active-merchant-banner"
              className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                isLight
                  ? 'bg-white border-[#B88728]/30 shadow-md ring-1 ring-[#B88728]/20'
                  : 'bg-[#181a1b] border-[#E5B65F]/30 shadow-xl ring-1 ring-[#E5B65F]/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={currentMerchant.heroImage}
                  alt={currentMerchant.name}
                  className="w-16 h-16 rounded-xl object-cover border border-black/10 dark:border-white/10 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#B88728]/15 text-[#B88728] dark:bg-[#E5B65F]/20 dark:text-[#E5B65F]">
                      {currentMerchant.cuisineOrType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                      • {currentMerchant.address}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mt-0.5">
                    {currentMerchant.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    {currentMerchant.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-foreground">
                    Rating: {currentMerchant.rating} ★ ({currentMerchant.ratingCount} reviews)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    Delivery: {currentMerchant.deliveryTime}
                  </p>
                </div>
                <button
                  onClick={() => setActiveMerchantId(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Switch Provider
                </button>
              </div>
            </section>

            {/* Featured Fast Items for this Merchant via ProductCarousel */}
            <section>
              <ProductCarousel
                title={`${currentMerchant.name} · Highlight Selections`}
                subtitle="Fast selections & customer favorites"
                products={carouselProducts}
              />
            </section>

        {/* 30 Items Catalog with DYNAMIC DECISION-MAKING ATTRIBUTES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {currentMerchant.name} Catalog ({filteredItems.length} Offerings)
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Browse catalog offerings with real-time pricing and availability
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div
              className={`p-12 text-center rounded-3xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#181a1b] border-white/10'
              }`}
            >
              <p className="text-slate-400 text-sm">No items found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedSubcategory('all');
                  setSearchQuery('');
                  setFilterRating45(false);
                  setFilterFastDelivery(false);
                  setFilterDiscountOnly(false);
                }}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#B88728] text-white cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border overflow-hidden transition duration-200 flex flex-col shadow-2xs ${
                    isLight
                      ? 'bg-white border-slate-200/90 hover:border-[#B88728] hover:shadow-md'
                      : 'bg-[#181a1b] border-white/10 hover:border-[#E5B65F]/50 hover:shadow-xl'
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 text-[#E5B65F] backdrop-blur-md">
                        {item.subcategory}
                      </span>
                      {item.discount && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-600 text-white">
                          {item.discount}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-black/80 text-white backdrop-blur-md flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-foreground leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      <p className={`text-xs mb-4 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        {item.description}
                      </p>

                      {/* DYNAMIC DECISION-MAKING ATTRIBUTES BLOCK */}
                      <div
                        className={`p-3.5 rounded-xl border mb-5 space-y-2 text-xs ${
                          isLight
                            ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                            : 'bg-[#111315]/80 border-white/10 text-gray-300'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#B88728] dark:text-[#E5B65F] mb-1">
                          Decision Specifications
                        </div>
                        {Object.entries(item.dynamicAttributes).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 text-[11px] truncate">{key}:</span>
                            <span className="font-semibold text-right text-[11px] text-foreground truncate max-w-[60%]">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                      <div>
                        <div className="text-xs text-slate-400">Price</div>
                        <div className="text-lg font-bold text-foreground">
                          KSh {item.price.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleActionClick(item, currentMerchant)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 ${
                          item.workflowType === 'order'
                            ? isLight
                              ? 'bg-[#B88728] hover:bg-[#9e721d] text-white'
                              : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
                            : isLight
                            ? 'bg-slate-900 hover:bg-black text-white'
                            : 'bg-white hover:bg-slate-100 text-black'
                        }`}
                      >
                        {item.workflowType === 'order' ? (
                          <>
                            <Plus size={14} />
                            <span>Add to Order</span>
                          </>
                        ) : (
                          <>
                            <Calendar size={14} />
                            <span>Reserve / Book</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    )}
  </main>

      {/* DYNAMIC WORKFLOW MODAL (For booking / reservations / quote requests) */}
      {selectedItemForWorkflow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl relative transition ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#181a1b] border-white/15 text-white'
            }`}
          >
            <button
              onClick={() => setSelectedItemForWorkflow(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer"
            >
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold">Dispatch Confirmed!</h3>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  Your reservation for <span className="font-bold text-foreground">{selectedItemForWorkflow.item.name}</span> has been scheduled with {selectedItemForWorkflow.merchant.name}.
                </p>
                <p className="text-xs text-slate-400">
                  A personal concierge has been assigned to your suite.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88728] dark:text-[#E5B65F]">
                    {selectedItemForWorkflow.item.workflowType === 'book' ? 'Reservation Request' : 'Priority Request'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                    {selectedItemForWorkflow.item.name}
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Provider: {selectedItemForWorkflow.merchant.name} • KSh {selectedItemForWorkflow.item.price.toLocaleString()}
                  </p>
                </div>

                {/* Key Spec Highlight */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111315] border-white/10'
                  }`}
                >
                  <div className="font-bold text-foreground">Verified Specifications:</div>
                  {Object.entries(selectedItemForWorkflow.item.dynamicAttributes).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px]">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-semibold text-foreground">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-500">Scheduled Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-medium ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#111315] border-white/10 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-500">Preferred Time</label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-medium ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#111315] border-white/10 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-500">
                    Suite Number or Location Notes
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Penthouse Suite 402, Villa Rosa Kempinski"
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-medium ${
                      isLight ? 'bg-white border-slate-200' : 'bg-[#111315] border-white/10 text-white'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer shadow-lg active:scale-98 ${
                      isLight
                        ? 'bg-[#B88728] hover:bg-[#9e721d] text-white'
                        : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
                    }`}
                  >
                    Confirm & Reserve Instant Dispatch
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    No upfront charge. Escrow reservation handled by concierge desk.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
