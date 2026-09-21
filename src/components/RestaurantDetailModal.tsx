import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  ShoppingBag,
  Heart,
  Search,
  Plus,
  Sparkles,
  MapPin,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  initialTab?: 'menu' | 'google-reviews';
}

export default function RestaurantDetailModal({
  restaurant,
  onClose,
  initialTab = 'menu',
}: RestaurantDetailModalProps) {
  const { setCustomizingDish, cart, setIsCartOpen, itemsCount, finalTotal } = useCart();
  const [modalTab, setModalTab] = useState<'menu' | 'google-reviews'>(initialTab);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  if (!restaurant) return null;

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Signature Mains' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Beverages' },
  ];

  const filteredMenu = restaurant.menu.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleHelpfulClick = (reviewId: string, initialCount: number) => {
    if (userVoted[reviewId]) return;
    setUserVoted((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1,
    }));
  };

  const googleRating = restaurant.googleRating || restaurant.rating;
  const googleReviewsCount = restaurant.googleReviewsCount || restaurant.reviewsCount;
  const googleAspects = restaurant.googleAspects || {
    food: 4.9,
    service: 4.8,
    atmosphere: 4.9,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-45 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#161819] text-[#f2f2f2] sm:rounded-3xl shadow-2xl border border-white/15 z-10 min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header Banner */}
          <div className="relative h-60 sm:h-72 w-full flex-shrink-0 bg-black/40 overflow-hidden">
            <img
              src={restaurant.heroImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161819] via-[#161819]/50 to-black/60" />

            {/* Top action buttons */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/10"
                aria-label="Back"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/10 ${
                    isFavorite ? 'text-rose-500' : 'text-white'
                  }`}
                  aria-label="Save to favorites"
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Restaurant Meta Info over Banner */}
            <div className="absolute bottom-4 left-5 right-5 z-20">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5B65F] text-black">
                  {restaurant.priceTier} • {restaurant.cuisine}
                </span>

                {/* Google Reviews Badge in Header */}
                <button
                  onClick={() => setModalTab('google-reviews')}
                  className="flex items-center gap-1.5 bg-black/75 hover:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/15 cursor-pointer transition-all hover:border-[#E5B65F]/60"
                  title="View Google Reviews"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{googleRating}</span>
                  <span className="text-gray-300 font-normal">({googleReviewsCount?.toLocaleString()} Google Reviews)</span>
                </button>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {restaurant.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1 max-w-xl truncate">
                {restaurant.tagline}
              </p>

              {/* Delivery info pills */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-300 mt-2.5 pt-2.5 border-t border-white/15">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#E5B65F]" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-[#E5B65F]" />
                  <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#E5B65F]" />
                  <span>{restaurant.distanceKm} km • {restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary View Switcher: Menu vs. Google Reviews */}
          <div className="flex items-center border-b border-white/10 bg-[#141517] px-4 sm:px-6">
            <button
              onClick={() => setModalTab('menu')}
              className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                modalTab === 'menu'
                  ? 'border-[#E5B65F] text-[#E5B65F]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag size={15} />
              <span>Artisanal Menu</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-medium">
                {restaurant.menu.length}
              </span>
            </button>

            <button
              onClick={() => setModalTab('google-reviews')}
              className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                modalTab === 'google-reviews'
                  ? 'border-[#E5B65F] text-[#E5B65F]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google Restaurant Reviews</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5B65F]/20 text-[#E5B65F] font-semibold">
                {googleReviewsCount?.toLocaleString()}
              </span>
            </button>
          </div>

          {/* TAB 1: ARTISANAL MENU */}
          {modalTab === 'menu' && (
            <>
              {/* Sticky Category and Search Filter Bar */}
              <div className="p-4 sm:px-6 bg-[#121314] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 z-30">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-hide py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-[#E5B65F] text-black shadow-md'
                          : 'bg-[#202224] text-gray-400 hover:text-white hover:bg-[#282a2d] border border-white/5'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-[#202224] border border-white/10 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E5B65F]"
                  />
                </div>
              </div>

              {/* Menu Items Grid with User Reviews per Item */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-4 custom-scrollbar">
                {filteredMenu.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-400 text-sm">No dishes match your search criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMenu.map((dish) => (
                      <div
                        key={dish.id}
                        onClick={() => setCustomizingDish(dish)}
                        className="p-4 rounded-2xl bg-[#1e2022] border border-white/5 hover:border-[#E5B65F]/40 hover:bg-[#242629] transition-all duration-300 flex justify-between gap-3 group cursor-pointer relative"
                      >
                        <div className="flex flex-col justify-between flex-grow min-w-0 pr-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-[#E5B65F] transition-colors line-clamp-1">
                                {dish.name}
                              </h4>
                              {dish.dietary?.includes('chef_special') && (
                                <span className="text-[10px] bg-[#E5B65F]/15 text-[#E5B65F] border border-[#E5B65F]/30 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                                  Chef Pick
                                </span>
                              )}
                            </div>

                            {/* User Reviews per Item Rating Badge */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="flex items-center gap-1 text-xs font-semibold text-[#E5B65F]">
                                <Star size={12} className="fill-[#E5B65F]" />
                                <span>{dish.rating || 4.9}</span>
                              </div>
                              <span className="text-[11px] text-gray-400 hover:text-[#E5B65F] transition-colors underline decoration-white/20">
                                ({dish.reviewsCount || (dish.userReviews?.length || 24)} diner reviews)
                              </span>
                            </div>

                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-normal">
                              {dish.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                            <span className="font-bold text-sm sm:text-base text-[#E5B65F]">
                              ${dish.price.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1">
                              <MessageSquare size={12} />
                              <span>View & Write Reviews</span>
                            </span>
                          </div>
                        </div>

                        {/* Dish Image + Add Button */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomizingDish(dish);
                            }}
                            className="absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-[#E5B65F] text-black hover:bg-white flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
                            title="Add to order"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: GOOGLE RESTAURANT REVIEWS */}
          {modalTab === 'google-reviews' && (
            <div className="p-5 sm:p-7 overflow-y-auto flex-grow space-y-6 custom-scrollbar bg-[#121315]">
              {/* Google Reviews Overview Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1c1e] border border-white/10 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#232528] border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">{googleRating}</span>
                      <div className="flex items-center gap-0.5 text-[#E5B65F]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className="fill-[#E5B65F]" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">Google Maps Rating</h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          Verified Place
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Based on {googleReviewsCount?.toLocaleString()} authentic customer reviews on Google Places & Maps
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Synced Live</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Aspect Ratings (Food, Service, Atmosphere) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-gray-300 font-medium">Food Quality</span>
                      <span className="text-[#E5B65F] font-bold">{googleAspects.food} / 5.0</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E5B65F] h-full rounded-full"
                        style={{ width: `${(googleAspects.food / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-gray-300 font-medium">Hospitality & Service</span>
                      <span className="text-[#E5B65F] font-bold">{googleAspects.service} / 5.0</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E5B65F] h-full rounded-full"
                        style={{ width: `${(googleAspects.service / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-gray-300 font-medium">Atmosphere & Transport</span>
                      <span className="text-[#E5B65F] font-bold">{googleAspects.atmosphere} / 5.0</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E5B65F] h-full rounded-full"
                        style={{ width: `${(googleAspects.atmosphere / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Reviews List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#E5B65F]" />
                  <span>Recent Google Reviews</span>
                </h4>

                {(!restaurant.googleReviews || restaurant.googleReviews.length === 0) ? (
                  <div className="text-center py-10 bg-[#1a1c1e] rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-sm">No Google reviews loaded for this venue.</p>
                  </div>
                ) : (
                  restaurant.googleReviews.map((rev) => {
                    const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulVotes ?? 12;
                    const hasVoted = userVoted[rev.id];

                    return (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-[#191b1d] border border-white/10 hover:border-white/20 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {rev.authorPhoto ? (
                              <img
                                src={rev.authorPhoto}
                                alt={rev.authorName}
                                className="w-10 h-10 rounded-full object-cover border border-white/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#E5B65F]/20 text-[#E5B65F] font-bold flex items-center justify-center border border-[#E5B65F]/30 text-sm">
                                {rev.authorName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm text-white">{rev.authorName}</h5>
                                {rev.isLocalGuide && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Local Guide • Level {rev.localGuideLevel || 6}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <div className="flex items-center gap-0.5 text-[#E5B65F]">
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} size={11} className="fill-[#E5B65F]" />
                                  ))}
                                </div>
                                <span>•</span>
                                <span>{rev.relativeTimeDescription}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                            <span>Verified</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                          {rev.text}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleHelpfulClick(rev.id, rev.helpfulVotes ?? 12)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-all cursor-pointer ${
                              hasVoted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <ThumbsUp size={12} className={hasVoted ? 'fill-emerald-400' : ''} />
                            <span>Helpful ({currentHelpful})</span>
                          </button>

                          <span className="text-[11px] text-gray-500">
                            Posted on Google
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Sticky Footer Bar if Cart has items */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#121314] border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">Order Total:</span>
                <span className="text-sm font-bold text-[#E5B65F] ml-2">${finalTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-[#E5B65F] hover:bg-[#d6a54d] text-black font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <ShoppingBag size={14} />
                <span>View Cart ({itemsCount})</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
