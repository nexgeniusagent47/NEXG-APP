import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Heart,
  Star,
  ShoppingBag,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Globe,
  Instagram,
  Phone,
  Filter,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { RESTAURANTS_DATA } from '../data/restaurantsData';
import { Restaurant, MenuItem, GoogleReview } from '../types';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import GoogleReviewsModal from './GoogleReviewsModal';
import BookingCalendar from './BookingCalendar';
import UnifiedItemModal, { UnifiedItemConfig } from './UnifiedItemModal';

interface RestaurantsProps {
  onNavigate?: (page: string) => void;
}

export default function Restaurants({ onNavigate }: RestaurantsProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { isLight } = useTheme();

  // Navigation state within Restaurants: null = merchant list; Restaurant = merchant storefront & items
  const [selectedMerchant, setSelectedMerchant] = useState<Restaurant | null>(null);

  // Filters for merchant list
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('all');
  const [onlyTopRated, setOnlyTopRated] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Filters for items view inside selected merchant
  const [dishCategory, setDishCategory] = useState('all');
  const [dishSearch, setDishSearch] = useState('');

  // Modals state
  const [reviewsModalConfig, setReviewsModalConfig] = useState<{
    isOpen: boolean;
    name: string;
    rating: number;
    count: number;
    aspects?: { food?: number; service?: number; atmosphere?: number };
    reviews: GoogleReview[];
    socials?: { instagram?: string; googleMaps?: string; website?: string; phone?: string };
  }>({
    isOpen: false,
    name: '',
    rating: 5,
    count: 0,
    reviews: [],
  });

  const [bookingModalConfig, setBookingModalConfig] = useState<{
    isOpen: boolean;
    restaurantName: string;
    selectedDate: string;
    selectedTime: string;
    guests: number;
    isConfirmed: boolean;
  }>({
    isOpen: false,
    restaurantName: '',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: '07:30 PM',
    guests: 2,
    isConfirmed: false,
  });

  const [unifiedModalItem, setUnifiedModalItem] = useState<UnifiedItemConfig | null>(null);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cuisines = [
    { id: 'all', label: 'All Cuisines' },
    { id: 'Japanese', label: 'Japanese & Sushi' },
    { id: 'Italian', label: 'Italian & Pizza' },
    { id: 'Steakhouse', label: 'Steakhouse & Grill' },
    { id: 'Thai', label: 'Thai & Pan-Asian' },
  ];

  const filteredRestaurants = RESTAURANTS_DATA.filter((r) => {
    const matchesCuisine = activeCuisine === 'all' || r.cuisine.includes(activeCuisine);
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = !onlyTopRated || (r.googleRating ?? r.rating) >= 4.8;
    return matchesCuisine && matchesSearch && matchesRating;
  });

  // Open Google reviews modal for a merchant
  const handleOpenMerchantReviews = (e: React.MouseEvent, restaurant: Restaurant) => {
    e.stopPropagation();
    setReviewsModalConfig({
      isOpen: true,
      name: restaurant.name,
      rating: restaurant.googleRating ?? restaurant.rating,
      count: restaurant.googleReviewsCount ?? restaurant.reviewsCount,
      aspects: restaurant.googleAspects,
      reviews: restaurant.googleReviews ?? [],
      socials: restaurant.socials,
    });
  };

  // Open table booking calendar modal
  const handleOpenTableBooking = (e: React.MouseEvent, restaurant: Restaurant) => {
    e.stopPropagation();
    setBookingModalConfig({
      isOpen: true,
      restaurantName: restaurant.name,
      selectedDate: new Date().toISOString().split('T')[0],
      selectedTime: '07:30 PM',
      guests: 2,
      isConfirmed: false,
    });
  };

  // Map a Dish to UnifiedItemConfig
  const handleOpenDishModal = (dish: MenuItem, restaurant: Restaurant) => {
    const config: UnifiedItemConfig = {
      id: dish.id,
      type: 'dining',
      title: dish.name,
      subtitle: dish.category.toUpperCase(),
      merchantName: restaurant.name,
      merchantId: restaurant.id,
      price: dish.price,
      priceUnitLabel: 'per serving',
      image: dish.image,
      description: dish.description,
      rating: dish.rating,
      reviewsCount: dish.reviewsCount,
      googleRating: restaurant.googleRating,
      googleReviewsCount: restaurant.googleReviewsCount,
      tags: dish.dietary || [],
      socials: restaurant.socials,
      options: dish.optionGroups?.map((og) => ({
        title: og.name,
        required: og.required,
        choices: og.choices.map((c) => ({
          id: c.id,
          name: c.name,
          price: c.price,
        })),
      })),
    };
    setUnifiedModalItem(config);
  };

  return (
    <div
      className={`min-h-screen pt-20 sm:pt-24 pb-28 transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0d10] text-gray-100'
      }`}
    >
      {/* VIEW 1: AVAILABLE MERCHANTS LIST (Category View) */}
      {!selectedMerchant ? (
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
          {/* Breadcrumb / Top Bar */}
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
              <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}`}>
                Fine Dining Partners
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'
              }`}>
                {RESTAURANTS_DATA.length} Artisanal Partners Available
              </span>
            </div>
          </div>

          {/* Hero Banner for Fine Dining Category */}
          <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-slate-200/80 dark:border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
            <div className={`absolute inset-0 ${
              isLight 
                ? 'bg-gradient-to-r from-white via-white/90 to-transparent' 
                : 'bg-gradient-to-r from-[#0b0d10] via-[#0b0d10]/85 to-transparent'
            }`} />

            <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3 bg-[#E5B65F]/20 text-[#7d5a11] dark:text-[#E5B65F]">
                <Sparkles size={13} />
                <span>Curated Culinary Directory</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Fine Dining Partners & Master Chefs
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed mb-6 font-medium ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}>
                Select a merchant to explore their Michelin-grade menu, signature dishes, verified Google diner reviews, and table reservations.
              </p>

              {/* Search Bar */}
              <div className={`flex items-center rounded-2xl p-1.5 border shadow-lg ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#14171b]/95 border-white/20'
              }`}>
                <Search className={`ml-3 w-5 h-5 ${isLight ? 'text-slate-400' : 'text-[#E5B65F]'}`} />
                <input
                  type="text"
                  placeholder="Search dining partners, sushi, dry-aged steaks, pasta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent border-none px-3 text-sm outline-none font-medium ${
                    isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-gray-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`text-xs px-2 font-bold ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              {cuisines.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCuisine(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    activeCuisine === c.id
                      ? isLight
                        ? 'bg-[#B88728] text-slate-950 border-[#B88728] shadow-sm'
                        : 'bg-[#E5B65F] text-black border-[#E5B65F] shadow-lg'
                      : isLight
                      ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOnlyTopRated(!onlyTopRated)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                onlyTopRated
                  ? isLight
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-black border-white'
                  : isLight
                  ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Star size={13} className={onlyTopRated ? 'fill-current' : 'text-[#7d5a11] dark:text-[#E5B65F]'} />
              <span>Top Rated Only (4.8+)</span>
            </button>
          </div>

          {/* Merchants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const isFav = favorites[restaurant.id];
              const gRating = restaurant.googleRating ?? restaurant.rating;
              const gCount = restaurant.googleReviewsCount ?? restaurant.reviewsCount;

              return (
                <div
                  key={restaurant.id}
                  onClick={() => setSelectedMerchant(restaurant)}
                  className={`rounded-2xl overflow-hidden border transition duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#B88728]'
                      : 'bg-[#15171b] border-white/10 hover:border-[#E5B65F]/60'
                  }`}
                >
                  {/* Hero Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/50">
                    <img
                      src={restaurant.heroImage}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, restaurant.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white backdrop-blur-md transition-transform active:scale-95 border border-white/20"
                      aria-label="Favorite"
                    >
                      <Heart size={14} fill={isFav ? '#ef4444' : 'none'} className={isFav ? 'text-rose-500' : ''} />
                    </button>

                    {/* Delivery & Distance Badges */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1">
                        <Clock size={11} className="text-[#E5B65F]" />
                        <span>{restaurant.deliveryTime}</span>
                      </span>
                      <span className="bg-black/75 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-semibold text-gray-200 border border-white/15">
                        {restaurant.distanceKm} km
                      </span>
                    </div>

                    {restaurant.featured && (
                      <span className="absolute top-3 left-3 bg-[#E5B65F] text-black text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                        Featured Partner
                      </span>
                    )}
                  </div>

                  {/* Merchant Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className={`font-bold text-lg group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors line-clamp-1 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {restaurant.name}
                      </h3>
                      <span className={`text-xs font-extrabold shrink-0 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        {restaurant.priceTier}
                      </span>
                    </div>

                    <p className={`text-xs font-semibold mb-2 line-clamp-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      {restaurant.cuisine}
                    </p>

                    <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-medium ${
                      isLight ? 'text-slate-600' : 'text-gray-300'
                    }`}>
                      {restaurant.tagline}
                    </p>

                    {/* Google Reviews Clickable Badge */}
                    <div className="mb-4">
                      <button
                        onClick={(e) => handleOpenMerchantReviews(e, restaurant)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                          isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                        }`}
                        title="View Google Reviews & Diner Insights"
                      >
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span className="font-bold">{gRating}</span>
                          <span className="text-[11px] opacity-75">({gCount.toLocaleString()} Google reviews)</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#7d5a11] dark:text-[#E5B65F]">
                          View Reviews →
                        </span>
                      </button>
                    </div>

                    {/* Action Row: Reserve Table & Socials */}
                    <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => handleOpenTableBooking(e, restaurant)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                        }`}
                      >
                        <CalendarIcon size={12} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                        <span>Reserve Table</span>
                      </button>

                      {/* Social shortcuts */}
                      {restaurant.socials && (
                        <div className="flex items-center gap-1">
                          {restaurant.socials.instagram && (
                            <a
                              href={`https://instagram.com/${restaurant.socials.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/15 text-gray-300'
                              }`}
                              title={`Instagram: ${restaurant.socials.instagram}`}
                            >
                              <Instagram size={13} />
                            </a>
                          )}
                          {restaurant.socials.googleMaps && (
                            <a
                              href={restaurant.socials.googleMaps}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/15 text-gray-300'
                              }`}
                              title="Google Maps Location"
                            >
                              <MapPin size={13} />
                            </a>
                          )}
                          {restaurant.socials.phone && (
                            <a
                              href={`tel:${restaurant.socials.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/15 text-gray-300'
                              }`}
                              title={`Call: ${restaurant.socials.phone}`}
                            >
                              <Phone size={13} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Primary Button: View Menu & Dishes */}
                    <div className="mt-3">
                      <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors ${
                        isLight
                          ? 'bg-[#B88728] text-slate-950 group-hover:bg-[#916719]'
                          : 'bg-white/10 group-hover:bg-[#E5B65F] text-white group-hover:text-black'
                      }`}>
                        <span>Explore Menu ({restaurant.menu.length} Dishes)</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className={`text-center py-20 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#15171b] border-white/10'
            }`}>
              <Utensils size={36} className="mx-auto text-gray-400 mb-3" />
              <h4 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                No dining partners match your filters
              </h4>
              <p className={`text-xs max-w-sm mx-auto mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Try adjusting your search keywords or resetting cuisine filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCuisine('all');
                  setOnlyTopRated(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#E5B65F] text-black font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: SPECIFIC MERCHANT STOREFRONT & ITEMS OFFERED */
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
          {/* Breadcrumb back to all restaurants */}
          <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setSelectedMerchant(null)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer ${
                isLight ? 'text-slate-700 hover:text-slate-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <ArrowLeft size={16} />
              <span>Back to all Dining Partners & Merchants</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleOpenMerchantReviews(e, selectedMerchant)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isLight ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                }`}
              >
                <Star size={13} className="text-[#E5B65F] fill-[#E5B65F]" />
                <span>Google Reviews ({selectedMerchant.googleRating ?? selectedMerchant.rating}★)</span>
              </button>

              <button
                onClick={(e) => handleOpenTableBooking(e, selectedMerchant)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#E5B65F] hover:bg-[#d6a54d] text-black shadow-md cursor-pointer transition-colors"
              >
                <CalendarIcon size={14} />
                <span>Reserve Table</span>
              </button>
            </div>
          </div>

          {/* Merchant Hero Showcase */}
          <div className={`relative rounded-3xl overflow-hidden mb-10 border shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#15171a] border-white/10'
          }`}>
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img
                src={selectedMerchant.heroImage}
                alt={selectedMerchant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E5B65F] text-black font-bold text-[10px] uppercase tracking-wider">
                      {selectedMerchant.priceTier} • {selectedMerchant.cuisine}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-[10px]">
                      {selectedMerchant.deliveryTime}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white drop-shadow-md">
                    {selectedMerchant.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-200 max-w-2xl font-medium leading-relaxed drop-shadow">
                    {selectedMerchant.tagline}
                  </p>
                </div>

                {/* Socials & Address Bar */}
                <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-gray-200">
                    <MapPin size={14} className="text-[#E5B65F] shrink-0" />
                    <span className="line-clamp-1">{selectedMerchant.address}</span>
                  </div>
                  {selectedMerchant.socials && (
                    <div className="flex items-center gap-3 pt-1 border-t border-white/15 text-xs text-gray-300">
                      {selectedMerchant.socials.instagram && (
                        <a
                          href={`https://instagram.com/${selectedMerchant.socials.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:text-[#E5B65F] transition-colors"
                        >
                          <Instagram size={12} />
                          <span>{selectedMerchant.socials.instagram}</span>
                        </a>
                      )}
                      {selectedMerchant.socials.phone && (
                        <a
                          href={`tel:${selectedMerchant.socials.phone}`}
                          className="flex items-center gap-1 hover:text-[#E5B65F] transition-colors"
                        >
                          <Phone size={12} />
                          <span>{selectedMerchant.socials.phone}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Storefront Menu Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Signature Dishes & Menu Offerings
              </h2>
              <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Click any dish to configure ingredients, accompaniments, or place a simulated order
              </p>
            </div>

            {/* Dish Search Input */}
            <div className={`flex items-center rounded-xl p-1.5 border w-full sm:w-72 ${
              isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
            }`}>
              <Search size={16} className={`ml-2 ${isLight ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search menu dishes..."
                value={dishSearch}
                onChange={(e) => setDishSearch(e.target.value)}
                className={`w-full bg-transparent border-none px-2 text-xs outline-none font-medium ${
                  isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedMerchant.menu
              .filter((dish) => {
                const matchCategory = dishCategory === 'all' || dish.category === dishCategory;
                const matchSearch =
                  dish.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
                  dish.description.toLowerCase().includes(dishSearch.toLowerCase());
                return matchCategory && matchSearch;
              })
              .map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => handleOpenDishModal(dish, selectedMerchant)}
                  className={`rounded-2xl overflow-hidden border transition duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#B88728]'
                      : 'bg-[#15171a] border-white/10 hover:border-[#E5B65F]/60'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/50">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {dish.dietary?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[9.5px] font-bold uppercase tracking-wider border border-white/15"
                        >
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-[#E5B65F] border border-white/15 shadow-md">
                      ${dish.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h3 className={`font-bold text-base group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors line-clamp-1 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {dish.name}
                      </h3>
                    </div>

                    <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-medium ${
                      isLight ? 'text-slate-600' : 'text-gray-300'
                    }`}>
                      {dish.description}
                    </p>

                    {/* Ratings & Diner Feedback snippet */}
                    <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs">
                        <Star size={12} className="text-[#E5B65F] fill-[#E5B65F]" />
                        <span className="font-bold">{dish.rating}</span>
                        <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                          ({dish.reviewsCount} reviews)
                        </span>
                      </div>

                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                      }`}>
                        <span>Customize & Order</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL 1: GOOGLE REVIEWS & SOCIALS MODAL */}
      <GoogleReviewsModal
        isOpen={reviewsModalConfig.isOpen}
        onClose={() => setReviewsModalConfig((prev) => ({ ...prev, isOpen: false }))}
        entityName={reviewsModalConfig.name}
        categoryName="Fine Dining Restaurant"
        rating={reviewsModalConfig.rating}
        totalReviews={reviewsModalConfig.count}
        googleAspects={reviewsModalConfig.aspects}
        reviews={reviewsModalConfig.reviews}
        socials={reviewsModalConfig.socials}
      />

      {/* MODAL 2: DEDICATED TABLE BOOKING CALENDAR MODAL */}
      {bookingModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            className={`w-full max-w-xl rounded-3xl overflow-hidden border shadow-2xl transition ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#15171a] border-white/15 text-white'
            }`}
          >
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7d5a11] dark:text-[#E5B65F]">
                  Table Reservation
                </span>
                <h3 className="text-xl font-bold">{bookingModalConfig.restaurantName}</h3>
              </div>
              <button
                onClick={() => setBookingModalConfig((prev) => ({ ...prev, isOpen: false }))}
                className={`p-1.5 rounded-xl border ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {!bookingModalConfig.isConfirmed ? (
                <>
                  <BookingCalendar
                    selectedDate={bookingModalConfig.selectedDate}
                    onDateSelect={(d) => setBookingModalConfig((prev) => ({ ...prev, selectedDate: d }))}
                    selectedTime={bookingModalConfig.selectedTime}
                    onTimeSelect={(t) => setBookingModalConfig((prev) => ({ ...prev, selectedTime: t }))}
                    guests={bookingModalConfig.guests}
                    onGuestsChange={(g) => setBookingModalConfig((prev) => ({ ...prev, guests: g }))}
                    serviceTitle="VIP Table Reservation"
                    providerName={bookingModalConfig.restaurantName}
                    showGuestsPicker={true}
                  />

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Selected Reservation</div>
                      <div className="text-sm font-bold">
                        {bookingModalConfig.selectedDate} at {bookingModalConfig.selectedTime} • {bookingModalConfig.guests} Guests
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingModalConfig((prev) => ({ ...prev, isConfirmed: true }))}
                      className="px-6 py-3 rounded-xl bg-[#E5B65F] hover:bg-[#d6a54d] text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      Confirm Table
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Table Reserved & Confirmed!</h4>
                  <p className={`text-xs max-w-md mx-auto mb-6 leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}>
                    Your reservation at <span className="font-bold">{bookingModalConfig.restaurantName}</span> has been locked for {bookingModalConfig.selectedDate} at {bookingModalConfig.selectedTime} for {bookingModalConfig.guests} guests.
                  </p>
                  <button
                    onClick={() => setBookingModalConfig((prev) => ({ ...prev, isOpen: false }))}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: STANDARDIZED UNIFIED ITEM MODAL */}
      <UnifiedItemModal
        item={unifiedModalItem}
        isOpen={Boolean(unifiedModalItem)}
        onClose={() => setUnifiedModalItem(null)}
        onAddToCart={(cartItem) => {
          // Forwarded verbatim: the modal already emits the cart's shape, and
          // re-mapping it here is what previously let the two drift apart.
          addToCart(cartItem);
          setUnifiedModalItem(null);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
