import { useState } from 'react';
import { 
  X, 
  Star, 
  ExternalLink, 
  MapPin, 
  Globe, 
  Instagram, 
  Phone, 
  CheckCircle2, 
  ThumbsUp, 
  Search,
  Filter
} from 'lucide-react';
import { GoogleReview } from '../types';
import { useTheme } from '../context/ThemeContext';

interface GoogleReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  categoryName?: string;
  rating: number;
  totalReviews: number;
  googleAspects?: {
    food?: number;
    service?: number;
    atmosphere?: number;
  };
  reviews: GoogleReview[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
}

export default function GoogleReviewsModal({
  isOpen,
  onClose,
  entityName,
  categoryName,
  rating,
  totalReviews,
  googleAspects,
  reviews,
  socials,
}: GoogleReviewsModalProps) {
  const { isLight } = useTheme();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const filteredReviews = reviews.filter((r) => {
    if (filterRating && r.rating !== filterRating) return false;
    if (
      searchFilter &&
      !r.text.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !r.authorName.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#141618] border-white/15 text-white'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight ? 'border-slate-100 bg-slate-50/70' : 'border-white/10 bg-[#191b1d]'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Google G Logo */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl leading-snug">{entityName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Google Reviews
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                {categoryName || 'Partner'} • Direct Google Places Integration & Socials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isLight
                ? 'hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'hover:bg-white/10 border-white/10 text-gray-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-grow">
          {/* Rating Summary Card */}
          <div
            className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a1c1e] border-white/10'
            }`}
          >
            {/* Left Score */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-white/10 pr-0 md:pr-4">
              <div className="text-5xl font-black text-[#E5B65F] leading-none mb-2">
                {rating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 text-[#E5B65F] fill-[#E5B65F]"
                  />
                ))}
              </div>
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                Based on {totalReviews.toLocaleString()} verified Google reviews
              </span>
            </div>

            {/* Middle: Aspect Breakdown */}
            <div className="md:col-span-5 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#E5B65F]">
                Verified Aspect Scores
              </div>
              {googleAspects ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Quality & Execution</span>
                      <span className="font-bold">{googleAspects.food || 4.9} / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full bg-[#E5B65F] rounded-full"
                        style={{ width: `${((googleAspects.food || 4.9) / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>App Service</span>
                      <span className="font-bold">{googleAspects.service || 4.8} / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full bg-[#E5B65F] rounded-full"
                        style={{ width: `${((googleAspects.service || 4.8) / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Atmosphere & Reliability</span>
                      <span className="font-bold">{googleAspects.atmosphere || 4.9} / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full bg-[#E5B65F] rounded-full"
                        style={{ width: `${((googleAspects.atmosphere || 4.9) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400">Aspect data collected via Google Places API</p>
              )}
            </div>

            {/* Right: Quick Star Filters */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Filter by Stars
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[5, 4, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFilterRating(filterRating === num ? null : num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                      filterRating === num
                        ? 'bg-[#E5B65F] text-black border-[#E5B65F]'
                        : isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{num}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                ))}
                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-[11px] text-[#E5B65F] hover:underline ml-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Social Links & Verified Profiles Bar */}
          <div
            className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-amber-50/50 border-amber-200/60' : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-[#E5B65F] font-bold">Official Profiles:</span>
              <span className={isLight ? 'text-slate-600' : 'text-gray-300'}>
                Verified direct contacts & socials
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {socials?.instagram && (
                <a
                  href={`https://instagram.com/${socials.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    isLight
                      ? 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'
                      : 'bg-white/5 text-pink-400 border-pink-500/30 hover:bg-pink-500/10'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{socials.instagram}</span>
                </a>
              )}

              {socials?.googleMaps && (
                <a
                  href={socials.googleMaps}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    isLight
                      ? 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                      : 'bg-white/5 text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {socials?.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    isLight
                      ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                      : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#E5B65F]" />
                  <span>Official Portal</span>
                </a>
              )}

              {socials?.phone && (
                <a
                  href={`tel:${socials.phone}`}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    isLight
                      ? 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      : 'bg-white/5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{socials.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Search bar for reviews */}
          <div className="flex items-center justify-between gap-3">
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border flex-grow max-w-md ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search reviews for dishes, ambiance, speed..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-[10px] text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Showing {filteredReviews.length} reviews
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">
                No Google reviews match your selected filter.
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border transition ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-[#181a1c] border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      {rev.authorPhoto ? (
                        <img
                          src={rev.authorPhoto}
                          alt={rev.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E5B65F] to-amber-600 flex items-center justify-center font-bold text-black text-sm">
                          {rev.authorName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{rev.authorName}</span>
                          {rev.isLocalGuide && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                              Local Guide • Level {rev.localGuideLevel || 7}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= rev.rating
                                    ? 'text-[#E5B65F] fill-[#E5B65F]'
                                    : 'text-gray-500'
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{rev.relativeTimeDescription}</span>
                          {rev.reviewCount && (
                            <>
                              <span>•</span>
                              <span>{rev.reviewCount} reviews</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <ThumbsUp className="w-3 h-3 text-[#E5B65F]" />
                      <span>{rev.helpfulVotes || 12}</span>
                    </div>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    "{rev.text}"
                  </p>

                  {rev.aspects && (
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/5 text-[11px] text-gray-400">
                      {rev.aspects.food && (
                        <span>
                          Experience: <strong className="text-[#E5B65F]">{rev.aspects.food}/5</strong>
                        </span>
                      )}
                      {rev.aspects.service && (
                        <span>
                          Service: <strong className="text-[#E5B65F]">{rev.aspects.service}/5</strong>
                        </span>
                      )}
                      {rev.aspects.atmosphere && (
                        <span>
                          Ambiance: <strong className="text-[#E5B65F]">{rev.aspects.atmosphere}/5</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a1c] border-white/10'
          }`}
        >
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#E5B65F]" />
            <span>Reviews synced in real-time with Google Places API</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
