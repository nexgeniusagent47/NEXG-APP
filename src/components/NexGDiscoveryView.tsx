import React, { useRef, useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Heart,
  SlidersHorizontal,
  X,
  Compass,
  Utensils,
  Car,
  Tag,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useNexGNavigation } from './nexg/NexGNavigationContext';
import { CATEGORIES_21, CatalogCategory, CatalogMerchant, getCategoryMerchants, DynamicItem } from '../data/categoryCatalog21';
import { Restaurant } from '../types';
import { ProductCarousel, type Product } from './ui/product-carousel';
import { NexGInfiniteFeed } from './nexg/NexGInfiniteFeed';
import { NexGEntityCard, NexGEntityData } from './nexg/NexGEntityCard';
import { NexGItemCard } from './nexg/NexGItemCard';
import { NexGSearchEngine } from './nexg/NexGSearchEngine';
import { CuratedNairobiWorlds } from './nexg/experiences/CuratedNairobiWorlds';
import { MerchantCard } from './nexg/MerchantCard';
import { SEEDED_MERCHANTS } from '../data/catalogData';
import { cn } from '../lib/utils';

interface NexGDiscoveryViewProps {
  onSelectCategory: (category: CatalogCategory) => void;
  onOpenStore: (restaurant: Restaurant) => void;
  onBackToLanding: () => void;
  onOpenDatabaseViewer?: () => void;
  onSelectMerchant?: (merchant: any) => void;
}

export default function NexGDiscoveryView({
  onSelectCategory,
  onOpenStore,
  onBackToLanding,
  onOpenDatabaseViewer,
  onSelectMerchant,
}: NexGDiscoveryViewProps) {
  const { isLight } = useTheme();
  const { cartCount, setIsCartOpen, addToCart } = useCart();
  const {
    navigateToCategory,
    navigateToMerchant,
    openItemSheet,
    state: navState,
    setSearchQuery,
  } = useNexGNavigation();

  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'wellness' | 'experiences' | 'cellar'>('all');
  const [searchInput, setSearchInput] = useState('');
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCategories = CATEGORIES_21.filter((c) => {
    if (activeTab === 'food') return ['restaurants', 'fine_dining', 'desserts_bakery', 'fast_food', 'coffee_tea', 'groceries'].includes(c.slug);
    if (activeTab === 'wellness') return ['beauty', 'pharmacy', 'health_nutrition', 'florists'].includes(c.slug);
    if (activeTab === 'experiences') return ['experiences', 'vehicle_rentals', 'airport_transfers', 'electronics'].includes(c.slug);
    if (activeTab === 'cellar') return ['alcohol_beverages', 'adults_only'].includes(c.slug);
    return true;
  });




  // Instant fast delivery products for carousel
  const featuredFastProducts: Product[] = [
    {
      id: 'fast-dom-p',
      name: 'Dom Pérignon Vintage Brut Champagne',
      quantity: '750ml • Chilled in Ice Pouch',
      price: 48000,
      originalPrice: 55000,
      discount: '12% OFF',
      deliveryTime: '20 min',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
      onAdd: () => {
        addToCart({
          id: 'fast-dom-p',
          name: 'Dom Pérignon Vintage Brut Champagne',
          price: 48000,
          quantity: 1,
        });
      },
    },
    {
      id: 'fast-beluga-caviar',
      name: 'Imperial Beluga Hybrid Caviar',
      quantity: '50g Tin with Mother of Pearl Spoon',
      price: 26000,
      deliveryTime: '25 min',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      onAdd: () => {
        addToCart({
          id: 'fast-beluga-caviar',
          name: 'Imperial Beluga Hybrid Caviar',
          price: 26000,
          quantity: 1,
        });
      },
    },
    {
      id: 'fast-macallan-18',
      name: 'The Macallan 18 Year Double Cask',
      quantity: '700ml Bottle in Wooden Casket',
      price: 68000,
      originalPrice: 75000,
      discount: 'KSh 7k Off',
      deliveryTime: '15 min',
      imageUrl: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=600&q=80',
      onAdd: () => {
        addToCart({
          id: 'fast-macallan-18',
          name: 'The Macallan 18 Year Double Cask',
          price: 68000,
          quantity: 1,
        });
      },
    },
    {
      id: 'fast-wagyu-ribeye',
      name: 'Japanese Miyazaki A5 Wagyu Ribeye Cut',
      quantity: '350g Prime Steak',
      price: 18500,
      deliveryTime: '30 min',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      onAdd: () => {
        addToCart({
          id: 'fast-wagyu-ribeye',
          name: 'Japanese Miyazaki A5 Wagyu Ribeye Cut',
          price: 18500,
          quantity: 1,
        });
      },
    },
    {
      id: 'fast-truffle-tagliolini',
      name: 'Handmade Alba White Truffle Pasta',
      quantity: 'Prepared Fresh in Suite Packaging',
      price: 5400,
      deliveryTime: '20 min',
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      onAdd: () => {
        addToCart({
          id: 'fast-truffle-tagliolini',
          name: 'Handmade Alba White Truffle Pasta',
          price: 5400,
          quantity: 1,
        });
      },
    },
  ];

  // Feed items for Infinite Feed: dynamic merchants across categories
  const discoveryMerchants = useMemo(() => {
    return CATEGORIES_21.flatMap((cat) => getCategoryMerchants(cat.id));
  }, []);

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-500',
        isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#111315] text-[#f2f2f2]'
      )}
    >
      {/* Top Sticky Navigation Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 backdrop-blur-xl border-b transition-colors',
          isLight
            ? 'bg-white/90 border-slate-200 shadow-2xs'
            : 'bg-[#141618]/90 border-white/10 shadow-lg'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Back + Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToLanding}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border cursor-pointer',
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
              )}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Solid brand gold, not a gradient-clipped fill. Gradient text is a
                  refusal in DESIGN.md: emphasis comes from weight and size, and a
                  gradient across two golds reads as neither one. This also lets the
                  token switch cleanly between themes. */}
              <span
                className={cn(
                  'font-bold text-base sm:text-lg tracking-tight',
                  isLight ? 'text-[#8A6413]' : 'text-[#E5B65F]'
                )}
              >
                NEXG
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E5B65F]/20 text-[#B88728] dark:text-[#E5B65F] border border-[#E5B65F]/30">
                Concierge
              </span>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl">
            <div
              className={cn(
                'relative flex items-center rounded-full border transition px-3.5 py-2 shadow-2xs',
                isLight
                  ? 'bg-slate-50 border-slate-200 focus-within:border-[#B88728] focus-within:bg-white'
                  : 'bg-white/5 border-white/10 focus-within:border-[#E5B65F] focus-within:bg-[#181a1b]'
              )}
            >
              <Search
                size={16}
                className={cn('mr-2.5 flex-shrink-0', isLight ? 'text-[#B88728]' : 'text-[#E5B65F]')}
              />
              <input
                type="text"
                placeholder="Search food, spa, safaris, champagne, chauffeur..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none placeholder:text-gray-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Location */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-white/5 border-white/10 text-gray-300'
              )}
            >
              <MapPin size={13} className="text-[#B88728] dark:text-[#E5B65F]" />
              <span className="truncate max-w-[130px]">Nairobi • Westlands</span>
            </div>
          </div>
        </div>

        {/* Discovery Filter Tabs */}
        {!searchInput && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Experiences', icon: Compass },
              { id: 'food', label: 'Dining & Food', icon: Utensils },
              { id: 'wellness', label: 'Spa & Wellness', icon: Sparkles },
              { id: 'experiences', label: 'Safaris & Tours', icon: MapPin },
              { id: 'cellar', label: 'Cellar & VIP', icon: Tag },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer border',
                    isActive
                      ? isLight
                        ? 'bg-[#B88728] text-white border-[#B88728] shadow-xs'
                        : 'bg-[#E5B65F] text-slate-950 border-[#E5B65F] shadow-xs'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  )}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        {/* If searching, render the live heterogeneous search engine */}
        {searchInput.trim().length > 0 ? (
          <NexGSearchEngine query={searchInput} />
        ) : (
          <>
            {/* 1. CATEGORIES RAIL */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Explore Verticals & Categories
                  </h2>
                  <p className={cn('text-xs mt-0.5', isLight ? 'text-slate-500' : 'text-gray-400')}>
                    21 distinct verticals with 134 specialized subcategories
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollHorizontally(categoryScrollRef, 'left')}
                    className={cn(
                      'p-2 rounded-full border transition-colors cursor-pointer',
                      isLight
                        ? 'bg-white border-slate-200 hover:bg-slate-50'
                        : 'bg-[#181a1b] border-white/10 hover:bg-white/10'
                    )}
                    aria-label="Previous categories"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollHorizontally(categoryScrollRef, 'right')}
                    className={cn(
                      'p-2 rounded-full border transition-colors cursor-pointer',
                      isLight
                        ? 'bg-white border-slate-200 hover:bg-slate-50'
                        : 'bg-[#181a1b] border-white/10 hover:bg-white/10'
                    )}
                    aria-label="Next categories"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div
                ref={categoryScrollRef}
                className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2 scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category)}
                    className={cn(
                      'flex-shrink-0 w-36 sm:w-44 p-3 rounded-2xl border text-left transition duration-200 hover:-translate-y-1 cursor-pointer group shadow-2xs snap-start',
                      isLight
                        ? 'bg-white border-slate-200/90 hover:border-[#B88728] hover:shadow-md'
                        : 'bg-[#181a1b] border-white/10 hover:border-[#E5B65F]/60 hover:shadow-lg'
                    )}
                  >
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2.5">
                      <img
                        src={category.bannerImage}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm truncate group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors">
                      {category.name}
                    </h3>
                    <p className={cn('text-[11px] truncate mt-0.5', isLight ? 'text-slate-500' : 'text-gray-400')}>
                      {category.subcategories.length} Subcategories
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* 2. INSTANT SUITE EXPRESS CONVEYOR CAROUSEL */}
            <section>
              <ProductCarousel
                title="Instant Suite Express"
                subtitle="High-priority concierge delivery direct to your suite or villa in under 30 minutes"
                products={featuredFastProducts}
              />
            </section>

            {/* 3. CURATED NAIROBI WORLDS (Unified Single Section with Progressive Reveal) */}
            <CuratedNairobiWorlds
              merchants={SEEDED_MERCHANTS}
              onSelectMerchant={(m) => {
                if (onSelectMerchant) {
                  onSelectMerchant(m);
                } else {
                  navigateToMerchant(m as any, 'discovery');
                }
              }}
              onSelectItem={(item, m) => {
                openItemSheet(
                  {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    deliveryTime: m.deliveryTime,
                    rating: item.rating || m.rating,
                    reviewCount: item.reviewCount || m.ratingCount,
                    image: item.image,
                    workflowType:
                      item.commerceMode === 'booking'
                        ? 'book'
                        : item.commerceMode === 'quote'
                        ? 'quote'
                        : 'order',
                    subcategory: item.subcategory,
                    description: item.description,
                    dynamicAttributes: {},
                  } as any,
                  m as any,
                  'discovery'
                );
              }}
              onSelectCategory={(catId) => {
                const found = CATEGORIES_21.find(
                  (c) => c.id === catId || c.slug === catId
                );
                if (found) onSelectCategory(found);
              }}
            />

            {/* 4. ALL VERIFIED PARTNERS & OFFERINGS (Wolt-Grade Merchant Grid) */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    All Verified Partners & Merchants
                  </h2>
                  <p className={cn('text-xs mt-0.5', isLight ? 'text-slate-500' : 'text-gray-400')}>
                    Browse verified Nairobi merchants across 20 neighborhoods with Wolt-grade previews
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SEEDED_MERCHANTS.slice(0, 18).map((merchant) => (
                  <MerchantCard
                    key={merchant.id}
                    merchant={merchant}
                    onSelectMerchant={(m) => {
                      if (onSelectMerchant) {
                        onSelectMerchant(m);
                      } else {
                        navigateToMerchant(m as any, 'discovery');
                      }
                    }}
                    onSelectItem={(item, m) => {
                      openItemSheet(
                        {
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          deliveryTime: m.deliveryTime,
                          rating: item.rating || m.rating,
                          reviewCount: item.reviewCount || m.ratingCount,
                          image: item.image,
                          workflowType:
                            item.commerceMode === 'booking'
                              ? 'book'
                              : item.commerceMode === 'quote'
                              ? 'quote'
                              : 'order',
                          subcategory: item.subcategory,
                          description: item.description,
                          dynamicAttributes: {},
                        } as any,
                        m as any,
                        'discovery'
                      );
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
