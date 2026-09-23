import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  Calendar as CalendarIcon,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { EXPERIENCE_HOSTS, ExperienceHost, ExperienceActivity } from '../data/experienceData';
import { GoogleReview } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import GoogleReviewsModal from './GoogleReviewsModal';
import BookingCalendar from './BookingCalendar';
import UnifiedItemModal, { UnifiedItemConfig } from './UnifiedItemModal';

interface ExperiencesProps {
  onNavigate?: (page: string) => void;
}

export default function Experiences({ onNavigate }: ExperiencesProps) {
  const { t } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();
  const { isLight } = useTheme();

  // Navigation: null = Available Hosts / Outfitters First; ExperienceHost = Specific Host Storefront & Activities
  const [selectedHost, setSelectedHost] = useState<ExperienceHost | null>(null);

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

  const [bookingModalConfig, setBookingModalConfig] = useState<{
    isOpen: boolean;
    hostName: string;
    activityTitle: string;
    selectedDate: string;
    selectedTime: string;
    guests: number;
    isConfirmed: boolean;
  }>({
    isOpen: false,
    hostName: '',
    activityTitle: '',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: '09:00 AM',
    guests: 2,
    isConfirmed: false,
  });

  const [unifiedModalItem, setUnifiedModalItem] = useState<UnifiedItemConfig | null>(null);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredHosts = EXPERIENCE_HOSTS.filter((host) => {
    return (
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenHostReviews = (e: React.MouseEvent, host: ExperienceHost) => {
    e.stopPropagation();
    setReviewsModalConfig({
      isOpen: true,
      name: host.name,
      rating: host.googleRating,
      count: host.googleReviewsCount,
      reviews: host.googleReviews ?? [],
      socials: host.socials,
    });
  };

  const handleOpenBooking = (e: React.MouseEvent, host: ExperienceHost, activity?: ExperienceActivity) => {
    e.stopPropagation();
    setBookingModalConfig({
      isOpen: true,
      hostName: host.name,
      activityTitle: activity?.title || host.activities[0]?.title || 'Curated Experience',
      selectedDate: new Date().toISOString().split('T')[0],
      selectedTime: '09:00 AM',
      guests: 2,
      isConfirmed: false,
    });
  };

  const handleOpenActivityModal = (activity: ExperienceActivity, host: ExperienceHost) => {
    const config: UnifiedItemConfig = {
      id: activity.id,
      type: 'experience',
      title: activity.title,
      subtitle: `${activity.duration} • ${activity.location}`,
      merchantName: host.name,
      merchantId: host.id,
      price: activity.price,
      priceUnitLabel: 'per guest',
      image: activity.image,
      description: activity.description,
      rating: activity.rating,
      reviewsCount: activity.reviewsCount,
      googleRating: host.googleRating,
      googleReviewsCount: host.googleReviewsCount,
      durationMinutes: activity.duration,
      includedItems: activity.inclusions,
      hasCalendarBooking: true,
      tags: [activity.category.replace('_', ' '), activity.duration],
      socials: host.socials,
      options: [
        {
          title: 'Curated Options & Photography Package',
          required: false,
          choices: [
            { id: 'opt-std', name: 'Standard Guided Tour with Binoculars', price: 0 },
            { id: 'opt-photo', name: 'Dedicated Wildlife & Drone Photographer (+ Edited High-Res Album)', price: 180 },
            { id: 'opt-champagne', name: 'Private Sommelier Champagne Toast in Bush', price: 95 },
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
      {/* VIEW 1: AVAILABLE HOSTS & OUTFITTERS FIRST */}
      {!selectedHost ? (
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
                <span>{t.ui.experiences.s_a1e9f9}</span>
              </button>
              <span className={isLight ? 'text-slate-300' : 'text-gray-600'}>/</span>
              <span className={`text-xs sm:text-sm font-extrabold ${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}`}>{t.ui.experiences.s_057742}</span>
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'
            }`}>
              {EXPERIENCE_HOSTS.length} Certified Outfitters Available
            </span>
          </div>

          {/* Hero Banner for Experiences Category */}
          <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-slate-200/80 dark:border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEbRZlaTr3ShItMBuRcR80nEYxHWt0M02UWlqb5E4Rkiskp-1HC8SEIrgSYSMDtrxRHo29WMdgCy3BKX2Vbtzoqco642hG7qH8kiIo3UhQ_0UG8v5kHS9OpyFLaZDLmyj2J9JL9SOcQmOWDWGBkfNKSy29r5lfzuLP3DiA9Nzk4xCcOT_1EWxZWxVTzsYl0Gg_glvdB7QJ09TwRHh6M0-AGpiWPRUPLF5yLOU9LlHYdpc56MFNg8kl')",
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
                <span>{t.ui.experiences.s_d29299}</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>{t.ui.experiences.s_ad3a34}</h1>
              <p className={`text-sm sm:text-base leading-relaxed mb-6 font-medium ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}>{t.ui.experiences.s_cebc44}</p>

              {/* Search Bar */}
              <div className={`flex items-center rounded-2xl p-1.5 border shadow-lg ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#14171b]/95 border-white/20'
              }`}>
                <Search className={`ml-3 w-5 h-5 ${isLight ? 'text-slate-400' : 'text-[#E5B65F]'}`} />
                <input
                  type="text"
                  placeholder={t.ui.experiences.s_96ebfb}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent border-none px-3 text-sm outline-none font-medium ${
                    isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Hosts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => {
              const isFav = favorites[host.id];

              return (
                <div
                  key={host.id}
                  onClick={() => setSelectedHost(host)}
                  className={`rounded-2xl overflow-hidden border transition duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#B88728]'
                      : 'bg-[#15171b] border-white/10 hover:border-[#E5B65F]/60'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/50">
                    <img
                      src={host.image}
                      alt={host.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <button
                      onClick={(e) => toggleFavorite(e, host.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white backdrop-blur-md transition-transform active:scale-95 border border-white/20"
                    >
                      <Heart size={14} fill={isFav ? '#ef4444' : 'none'} className={isFav ? 'text-rose-500' : ''} />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white border border-white/15 flex items-center gap-1">
                        <Compass size={11} className="text-[#E5B65F]" />
                        <span>{host.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`font-bold text-lg group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors mb-1 line-clamp-1 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {host.name}
                    </h3>

                    <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-medium ${
                      isLight ? 'text-slate-600' : 'text-gray-300'
                    }`}>
                      {host.tagline}
                    </p>

                    {/* Google Reviews Clickable Banner */}
                    <div className="mb-4">
                      <button
                        onClick={(e) => handleOpenHostReviews(e, host)}
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
                          <span className="font-bold">{host.googleRating}</span>
                          <span className="text-[11px] opacity-75">({host.googleReviewsCount.toLocaleString()} Google reviews)</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#7d5a11] dark:text-[#E5B65F]">
                          View Reviews →
                        </span>
                      </button>
                    </div>

                    {/* Action Row */}
                    <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => handleOpenBooking(e, host)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                        }`}
                      >
                        <CalendarIcon size={12} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                        <span>{t.ui.experiences.s_14c995}</span>
                      </button>

                      {host.socials && (
                        <div className="flex items-center gap-1">
                          {host.socials.instagram && (
                            <a
                              href={`https://instagram.com/${host.socials.instagram.replace('@', '')}`}
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
                          {host.socials.phone && (
                            <a
                              href={`tel:${host.socials.phone}`}
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

                    {/* View Activities Button */}
                    <div className="mt-3">
                      <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors ${
                        isLight
                          ? 'bg-[#B88728] text-slate-950 group-hover:bg-[#916719]'
                          : 'bg-white/10 group-hover:bg-[#E5B65F] text-white group-hover:text-black'
                      }`}>
                        <span>Explore Activities ({host.activities.length} Available)</span>
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
        /* VIEW 2: SPECIFIC HOST STOREFRONT & ACTIVITIES */
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setSelectedHost(null)}
              className={`flex items-center gap-2 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer ${
                isLight ? 'text-slate-700 hover:text-slate-900' : 'text-gray-300 hover:text-white'
              }`}
            >
              <ArrowLeft size={16} />
              <span>{t.ui.experiences.s_9fda6b}</span>
            </button>

            <button
              onClick={(e) => handleOpenHostReviews(e, selectedHost)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isLight ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
              }`}
            >
              <Star size={13} className="text-[#E5B65F] fill-[#E5B65F]" />
              <span>Google Reviews ({selectedHost.googleRating}★)</span>
            </button>
          </div>

          {/* Host Header Banner */}
          <div className={`relative rounded-3xl overflow-hidden mb-10 border shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#15171a] border-white/10'
          }`}>
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img
                src={selectedHost.image}
                alt={selectedHost.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5B65F] text-black font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                    {selectedHost.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white drop-shadow-md">
                    {selectedHost.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-200 max-w-2xl font-medium leading-relaxed drop-shadow">
                    {selectedHost.tagline}
                  </p>
                </div>

                {selectedHost.socials && (
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-gray-300 text-xs">
                    {selectedHost.socials.instagram && (
                      <a
                        href={`https://instagram.com/${selectedHost.socials.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-[#E5B65F]"
                      >
                        <Instagram size={13} />
                        <span>{selectedHost.socials.instagram}</span>
                      </a>
                    )}
                    {selectedHost.socials.phone && (
                      <a
                        href={`tel:${selectedHost.socials.phone}`}
                        className="flex items-center gap-1 hover:text-[#E5B65F]"
                      >
                        <Phone size={13} />
                        <span>{selectedHost.socials.phone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedHost.activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleOpenActivityModal(act, selectedHost)}
                className={`rounded-2xl overflow-hidden border transition duration-300 flex flex-col group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-[#B88728]'
                    : 'bg-[#15171a] border-white/10 hover:border-[#E5B65F]/60'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/50">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[9.5px] font-bold uppercase tracking-wider border border-white/15">
                      {act.duration}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-[#E5B65F] border border-white/15 shadow-md">
                    From ${act.price}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className={`font-bold text-base group-hover:text-[#B88728] dark:group-hover:text-[#E5B65F] transition-colors line-clamp-1 mb-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {act.title}
                  </h3>

                  <p className={`text-xs leading-relaxed line-clamp-2 mb-4 font-medium ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}>
                    {act.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <Star size={12} className="text-[#E5B65F] fill-[#E5B65F]" />
                      <span className="font-bold">{act.rating}</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>
                        ({act.reviewsCount} reviews)
                      </span>
                    </div>

                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                    }`}>
                      <span>{t.ui.experiences.s_574a76}</span>
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
        categoryName="Curated Experience Host"
        rating={reviewsModalConfig.rating}
        totalReviews={reviewsModalConfig.count}
        reviews={reviewsModalConfig.reviews}
        socials={reviewsModalConfig.socials}
      />

      {/* Booking Calendar Modal */}
      {bookingModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            className={`w-full max-w-xl rounded-3xl overflow-hidden border shadow-2xl transition ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#15171a] border-white/15 text-white'
            }`}
          >
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7d5a11] dark:text-[#E5B65F]">{t.ui.experiences.s_f6e8ce}</span>
                <h3 className="text-xl font-bold">{bookingModalConfig.activityTitle}</h3>
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
                    serviceTitle={bookingModalConfig.activityTitle}
                    providerName={bookingModalConfig.hostName}
                    showGuestsPicker={true}
                  />

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">{t.ui.experiences.s_63ae7c}</div>
                      <div className="text-sm font-bold">
                        {bookingModalConfig.selectedDate} at {bookingModalConfig.selectedTime} • {bookingModalConfig.guests} Guest(s)
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingModalConfig((prev) => ({ ...prev, isConfirmed: true }))}
                      className="px-6 py-3 rounded-xl bg-[#E5B65F] hover:bg-[#d6a54d] text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >{t.ui.experiences.s_eb9e1e}</button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Experience Booked!</h4>
                  <p className={`text-xs max-w-md mx-auto mb-6 leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}>{t.ui.experiences.s_6568e5}<span className="font-bold">{bookingModalConfig.hostName}</span> has been confirmed for {bookingModalConfig.selectedDate} at {bookingModalConfig.selectedTime}. Your concierge will provide itinerary and private pickup details.
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

      {/* Standardized Unified Item Modal */}
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
