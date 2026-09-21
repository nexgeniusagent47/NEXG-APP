import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Search,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Heart,
  Instagram,
  Phone,
  PackageCheck
} from 'lucide-react';
import { CELLAR_PURVEYORS } from '../data/cellarData';
import { CellarPurveyor, CellarItem, GoogleReview } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import GoogleReviewsModal from './GoogleReviewsModal';
import UnifiedItemModal, { UnifiedItemConfig } from './UnifiedItemModal';

interface GroceriesPageProps {
  onNavigate?: (page: string) => void;
}

export default function GroceriesPage({ onNavigate }: GroceriesPageProps) {
  const { addItem, setIsCartOpen } = useCart();
  const { isLight } = useTheme();

  // Navigation: null = Available Purveyors / Merchants First; CellarPurveyor = Specific Purveyor Storefront & Items
  const [selectedPurveyor, setSelectedPurveyor] = useState<CellarPurveyor | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modals state
  const [reviewsModalConfig, setReviewsModalConfig] = useState<{
    isOpen: boolean;
    name: string;
    rating: number;
    count: number;
    reviews: GoogleReview[];
    socials?: { instagram?: string; googleMaps?: string; website?: string; phone?: string };
  }>({
    isOpen: false,
    name: '',
    rating: 5,
    count: 0,
    reviews: [],
  });

  const [unifiedModalItem, setUnifiedModalItem] = useState<UnifiedItemConfig | null>(null);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPurveyors = CELLAR_PURVEYORS.filter((purveyor) => {
    return (
      purveyor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purveyor.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenPurveyorReviews = (e: React.MouseEvent, purveyor: CellarPurveyor) => {
    e.stopPropagation();
    setReviewsModalConfig({
      isOpen: true,
      name: purveyor.name,
      rating: purveyor.googleRating,
      count: purveyor.googleReviewsCount,
      reviews: purveyor.googleReviews ?? [],
      socials: purveyor.socials,
    });
  };

  const handleOpenItemModal = (item: CellarItem, purveyor: CellarPurveyor) => {
    const config: UnifiedItemConfig = {
      id: item.id,
      type: 'groceries',
      title: item.name,
      subtitle: item.vintage ? `Vintage ${item.vintage} • ${item.region}` : item.category.toUpperCase(),
      merchantName: purveyor.name,
      merchantId: purveyor.id,
      price: item.price,
      priceUnitLabel: 'per unit',
      image: item.image,
      description: item.description,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      googleRating: purveyor.googleRating,
      googleReviewsCount: purveyor.googleReviewsCount,
      tags: item.tags,
      socials: purveyor.socials,
      options: [
        {
          title: 'Packaging & Temperature Preference',
          required: false,
          choices: [
            { id: 'opt-ice', name: 'Insulated Ice Thermal Casket with Gel Packs', price: 0 },
            { id: 'opt-cellar', name: 'Standard Temperature Cellar Carton', price: 0 },
            { id: 'opt-gift', name: 'Luxury Velvet Gift Presentation Box', price: 15 },
          ],
        },
      ],
    };
    setUnifiedModalItem(config);
  };

  return (
    <div
      className={`min-h-screen pt-20 sm:pt-24 pb-28 transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0d10] text-gray-100'
      }`}
    >
      {/* VIEW 1: AVAILABLE PURVEYORS & CELLARS FIRST */}
      {!selectedPurveyor ? (
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between py-4 mb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.('home')}
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowLeft size={16} />
                <span>Explore Home</span>
              </button>
              <span className={isLight ? 'text-slate-300' : 'text-gray-600'}>/</span>
              <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'}`}>
                Gourmet Cellar & Purveyors
              </span>
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'
            }`}>
              {CELLAR_PURVEYORS.length} Artisan Purveyors Available
            </span>
          </div>

          {/* Hero Banner for Gourmet Groceries & Cellar Category */}
          <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-slate-200/80 dark:border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
            <div className={`absolute inset-0 ${
              isLight 
                ? 'bg-gradient-to-r from-white via-white/90 to-transparent' 
                : 'bg-gradient-to-r from-[#0b0d10] via-[#0b0d10]/85 to-transparent'
            }`} />

            <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3 bg-[#E5B65F]/20 text-[#B88728] dark:text-[#E5B65F]">
                <Sparkles size={13} />
                <span>Fine Cellar & Epicurean Purveyors</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Artisanal Cellar, Caviar & Fromagerie
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed mb-6 font-medium ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}>
                Choose an artisanal merchant to explore chilled vintage Champagnes, Imperial sturgeon caviar, Jamón Ibérico de Bellota, and freshly harvested tropical villa fruit platters.
              </p>

              {/* Search Bar */}
              <div className={`flex items-center rounded-2xl p-1.5 border shadow-lg ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#14171b]/95 border-white/20'
              }`}>
                <Search className={`ml-3 w-5 h-5 ${isLight ? 'text-slate-400' : 'text-[#E5B65F]'}`} />
                <input
                  type="text"
                  placeholder="Search purveyors, caviar, Dom Pérignon, Bellota, truffles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent border-none px-3 text-sm outline-none font-medium ${
                    isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Purveyors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPurveyors.map((purveyor) => {
              const isFav = favorites[purveyor.id];

              return (
                <div
                  key={purveyor.id}
                  onClick={() => setSelectedPurveyor(purveyor)}
                  className={`rounded-2xl overflow-hidden border transition duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#B88728]'
                      : 'bg-[#15171b] border-white/10 hover:border-[#E5B65F]/60'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/50">
                    <img
                      src={purveyor.image}
                      alt={purveyor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <button
                      onClick={(e) => toggleFavorite(e, purveyor.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white backdrop-blur-md transition-transform active:scale-95 border border-white/20"
                    >
                      <Heart size={14} fill={isFav ? '#ef4444' : 'none'} className={isFav ? 'text-rose-500' : ''} />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1">
                        <Clock size={11} className="text-[#E5B65F]" />
                        <span>{purveyor.deliveryTime}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`font-black text-lg group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors mb-1 line-clamp-1 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {purveyor.name}
                    </h3>

                    <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-medium ${
                      isLight ? 'text-slate-600' : 'text-gray-300'
                    }`}>
                      {purveyor.tagline}
                    </p>

                    {/* Google Reviews Clickable Banner */}
                    <div className="mb-4">
                      <button
                        onClick={(e) => handleOpenPurveyorReviews(e, purveyor)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                          isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span className="font-bold">{purveyor.googleRating}</span>
                          <span className="text-[11px] opacity-75">({purveyor.googleReviewsCount.toLocaleString()} Google reviews)</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#B88728] dark:text-[#E5B65F]">
                          View Reviews →
                        </span>
                      </button>
                    </div>

                    {/* Action Row */}
                    <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold flex items-center gap-1 ${
                        isLight ? 'text-slate-500' : 'text-gray-400'
                      }`}>
                        <PackageCheck size={13} className="text-emerald-500" />
                        <span>Insulated Cold Packaging</span>
                      </span>

                      {purveyor.socials && (
                        <div className="flex items-center gap-1">
                          {purveyor.socials.instagram && (
                            <a
                              href={`https://instagram.com/${purveyor.socials.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/15 text-gray-300'
                              }`}
                            >
                              <Instagram size={13} />
                            </a>
                          )}
                          {purveyor.socials.phone && (
                            <a
                              href={`tel:${purveyor.socials.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/15 text-gray-300'
                              }`}
                            >
                              <Phone size={13} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* View Products Button */}
                    <div className="mt-3">
                      <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors ${
                        isLight
                          ? 'bg-[#B88728] text-white group-hover:bg-[#916719]'
                          : 'bg-white/10 group-hover:bg-[#E5B65F] text-white group-hover:text-black'
                      }`}>
                        <span>Explore Provisions ({purveyor.items.length} Items)</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: SPECIFIC PURVEYOR STOREFRONT & PRODUCTS */
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setSelectedPurveyor(null)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer ${
                isLight ? 'text-slate-700 hover:text-slate-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <ArrowLeft size={16} />
              <span>Back to all Purveyors</span>
            </button>

            <button
              onClick={(e) => handleOpenPurveyorReviews(e, selectedPurveyor)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isLight ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
              }`}
            >
              <Star size={13} className="text-[#E5B65F] fill-[#E5B65F]" />
              <span>Google Reviews ({selectedPurveyor.googleRating}★)</span>
            </button>
          </div>

          {/* Purveyor Header Banner */}
          <div className={`relative rounded-3xl overflow-hidden mb-10 border shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#15171a] border-white/10'
          }`}>
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img
                src={selectedPurveyor.image}
                alt={selectedPurveyor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5B65F] text-black font-black text-[10px] uppercase tracking-wider mb-2 inline-block">
                    {selectedPurveyor.deliveryTime}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 text-white drop-shadow-md">
                    {selectedPurveyor.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-200 max-w-2xl font-medium leading-relaxed drop-shadow">
                    {selectedPurveyor.tagline}
                  </p>
                </div>

                {selectedPurveyor.socials && (
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-gray-300 text-xs">
                    {selectedPurveyor.socials.instagram && (
                      <a
                        href={`https://instagram.com/${selectedPurveyor.socials.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-[#E5B65F]"
                      >
                        <Instagram size={13} />
                        <span>{selectedPurveyor.socials.instagram}</span>
                      </a>
                    )}
                    {selectedPurveyor.socials.phone && (
                      <a
                        href={`tel:${selectedPurveyor.socials.phone}`}
                        className="flex items-center gap-1 hover:text-[#E5B65F]"
                      >
                        <Phone size={13} />
                        <span>{selectedPurveyor.socials.phone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPurveyor.items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenItemModal(item, selectedPurveyor)}
                className={`rounded-2xl overflow-hidden border transition duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-[#B88728]'
                    : 'bg-[#15171a] border-white/10 hover:border-[#E5B65F]/60'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {item.vintage && (
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#E5B65F] text-[9.5px] font-bold uppercase tracking-wider border border-white/15">
                        Vintage {item.vintage}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-[#E5B65F] border border-white/15 shadow-md">
                    ${item.price}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className={`font-black text-base group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors line-clamp-1 mb-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {item.name}
                  </h3>

                  <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-medium ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}>
                    {item.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <Star size={12} className="text-[#E5B65F] fill-[#E5B65F]" />
                      <span className="font-bold">{item.rating}</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                        ({item.reviewsCount} ratings)
                      </span>
                    </div>

                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isLight ? 'text-[#B88728]' : 'text-[#E5B65F]'
                    }`}>
                      <span>Select Item</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Reviews Modal */}
      <GoogleReviewsModal
        isOpen={reviewsModalConfig.isOpen}
        onClose={() => setReviewsModalConfig((prev) => ({ ...prev, isOpen: false }))}
        entityName={reviewsModalConfig.name}
        categoryName="Fine Cellar & Epicurean Purveyor"
        rating={reviewsModalConfig.rating}
        totalReviews={reviewsModalConfig.count}
        reviews={reviewsModalConfig.reviews}
        socials={reviewsModalConfig.socials}
      />

      {/* Standardized Unified Item Modal */}
      <UnifiedItemModal
        item={unifiedModalItem}
        isOpen={Boolean(unifiedModalItem)}
        onClose={() => setUnifiedModalItem(null)}
        onAddToCart={(cartItem) => {
          addItem({
            id: cartItem.id,
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity,
            selectedOptions: cartItem.selectedOptions,
            specialInstructions: cartItem.specialInstructions,
            restaurantName: cartItem.merchantName,
            restaurantId: cartItem.merchantId || '',
          });
          setUnifiedModalItem(null);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
