import { useState } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  Instagram, 
  Globe, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { GoogleReview } from '../types';
import { useTheme } from '../context/ThemeContext';
import BookingCalendar from './BookingCalendar';
import GoogleReviewsModal from './GoogleReviewsModal';

export interface UnifiedItemConfig {
  id: string;
  type: 'dining' | 'spa' | 'transport' | 'groceries' | 'experience';
  title: string;
  subtitle?: string;
  merchantName: string;
  merchantId?: string;
  price: number;
  priceUnitLabel?: string; // e.g. 'per plate', 'per session', 'per hour', 'per bottle', 'per guest'
  image: string;
  description: string;
  rating?: number;
  reviewsCount?: number;
  googleRating?: number;
  googleReviewsCount?: number;
  googleReviews?: GoogleReview[];
  tags?: string[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  // Dynamic Option Configs
  options?: {
    title: string;
    required?: boolean;
    choices: {
      id: string;
      name: string;
      price: number;
      description?: string;
    }[];
  }[];
  // Experience & activity specifics
  durationMinutes?: string | number;
  includedItems?: string[];
  // Spa specifics
  durations?: { duration: number; price: number }[];
  availableOils?: string[];
  // Transport specifics
  amenities?: string[];
  passengers?: number;
  luggage?: number;
  // Booking calendar enabled
  hasCalendarBooking?: boolean;
}

interface UnifiedItemModalProps {
  item: UnifiedItemConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: any) => void;
  onBookNow?: (bookingDetails: any) => void;
}

export default function UnifiedItemModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
  onBookNow,
}: UnifiedItemModalProps) {
  const { isLight } = useTheme();

  // State
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(0);
  const [selectedOil, setSelectedOil] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(item?.hasCalendarBooking || false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate() + 1).padStart(2, '0')}`;
  });
  const [selectedTime, setSelectedTime] = useState('07:30 PM');
  const [guests, setGuests] = useState(2);

  // Reviews modal
  const [showGoogleReviewsModal, setShowGoogleReviewsModal] = useState(false);
  const [actionConfirmedToast, setActionConfirmedToast] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  // Calculate dynamic price
  let basePrice = item.price;
  if (item.durations && item.durations.length > 0) {
    basePrice = item.durations[selectedDurationIndex]?.price || item.price;
  }

  // Add options
  let optionsPrice = 0;
  if (item.options) {
    item.options.forEach((optGroup) => {
      const selectedChoiceId = selectedOptions[optGroup.title];
      if (selectedChoiceId) {
        const choice = optGroup.choices.find((c) => c.id === selectedChoiceId);
        if (choice) optionsPrice += choice.price;
      }
    });
  }

  const totalPrice = (basePrice + optionsPrice) * quantity;
  // Per-unit price including option pricing. The cart multiplies price by quantity
  // itself, so this — not totalPrice — is what `price` must carry or the options
  // would vanish from the line total.
  const unitPrice = basePrice + optionsPrice;

  const handleAction = () => {
    // The payload carries BOTH the cart's field names and the modal's own, because
    // two different consumers read it: `onAddToCart` feeds the cart, which needs
    // `name`/`price`/`itemTotal`, while `onBookNow` keeps the descriptive
    // `title`/`totalPrice` shape its callers already use.
    //
    // This is deliberate duplication across an interface boundary, not an oversight.
    // The alternative already caused a shipped bug: the cart was fed `title` and
    // `totalPrice` while reading `name` and `price`, so every line item was added with
    // `undefined` for both and the cart totals came out NaN.
    //
    // `unitPrice` is the per-unit figure AFTER option pricing. `price` cannot carry it
    // because the cart multiplies price by quantity itself, which would drop the
    // options from every line total.
    const payload = {
      // --- cart-compatible
      id: item.id,
      menuItemId: item.id,
      name: item.title,
      price: unitPrice,
      unitPrice,
      image: item.image,
      quantity,
      itemTotal: totalPrice,
      merchantId: item.merchantId,
      merchantName: item.merchantName,
      selectedOptions: Object.entries(selectedOptions).map(([group, choice]) => ({
        group,
        choice,
      })),
      selectedAddons,
      specialInstructions: specialNotes,
      // --- booking-compatible
      itemId: item.id,
      itemType: item.type,
      title: item.title,
      totalPrice,
      selectedDuration: item.durations ? item.durations[selectedDurationIndex]?.duration : undefined,
      selectedOil: selectedOil || (item.availableOils ? item.availableOils[0] : undefined),
      selectedDate: item.hasCalendarBooking ? selectedDate : undefined,
      selectedTime: item.hasCalendarBooking ? selectedTime : undefined,
      guests: item.hasCalendarBooking ? guests : undefined,
      specialNotes,
    };

    if (item.hasCalendarBooking && onBookNow) {
      onBookNow(payload);
    } else if (onAddToCart) {
      onAddToCart(payload);
    }

    setActionConfirmedToast(`Added to your Villa App request!`);
    setTimeout(() => {
      setActionConfirmedToast(null);
      onClose();
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className={`relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-[#141618] border-white/15 text-white'
          }`}
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto flex-grow">
            {/* Hero Image Container */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black/40">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Provider Badge & Tags */}
              <div className="absolute bottom-4 left-4 sm:left-6 right-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E5B65F] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-white/90 text-xs font-semibold drop-shadow-md">
                      Offered by {item.merchantName}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {item.title}
                  </h2>
                </div>

                {/* Google Reviews Pill button */}
                <button
                  onClick={() => setShowGoogleReviewsModal(true)}
                  className="bg-black/70 hover:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-lg"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                  <span>{item.googleRating || item.rating || 4.9}</span>
                  <span className="text-gray-300">
                    ({(item.googleReviewsCount || item.reviewsCount || 340).toLocaleString()} reviews)
                  </span>
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Merchant Credentials & Socials Bar */}
              <div
                className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a1c1e] border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E5B65F]/20 text-[#E5B65F] font-bold flex items-center justify-center shrink-0">
                    {item.merchantName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{item.merchantName}</div>
                    <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      App Verified Partner • Direct Fulfillment
                    </div>
                  </div>
                </div>

                {/* Socials buttons */}
                <div className="flex items-center gap-2">
                  {item.socials?.instagram && (
                    <a
                      href={`https://instagram.com/${item.socials.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                        isLight
                          ? 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
                          : 'bg-white/5 border-pink-500/30 text-pink-400 hover:bg-pink-500/10'
                      }`}
                    >
                      <Instagram className="w-3 h-3" />
                      <span>{item.socials.instagram}</span>
                    </a>
                  )}

                  {item.socials?.googleMaps && (
                    <a
                      href={item.socials.googleMaps}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                        isLight
                          ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'
                          : 'bg-white/5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                  <button
                    onClick={() => setShowGoogleReviewsModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-[#E5B65F]/15 text-[#E5B65F] font-bold text-[11px] hover:bg-[#E5B65F]/25 transition-colors cursor-pointer"
                  >
                    View All Reviews
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5B65F] mb-1.5">
                  About this offering
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-gray-300'
                  }`}
                >
                  {item.description}
                </p>
              </div>

              {/* Tags / Highlights */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Dynamic Durations (For Spa) */}
              {item.durations && item.durations.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5B65F] mb-2">
                    Select Ritual Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {item.durations.map((d, index) => (
                      <button
                        key={d.duration}
                        type="button"
                        onClick={() => setSelectedDurationIndex(index)}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                          selectedDurationIndex === index
                            ? 'bg-[#E5B65F] text-black border-[#E5B65F] font-extrabold shadow-md'
                            : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                        }`}
                      >
                        <div className="text-sm font-bold">{d.duration} Minutes</div>
                        <div className="text-xs mt-0.5">${d.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Essential Oils (For Spa) */}
              {item.availableOils && item.availableOils.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5B65F] mb-2">
                    Aromatherapy Essential Oil
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.availableOils.map((oil) => (
                      <button
                        key={oil}
                        type="button"
                        onClick={() => setSelectedOil(oil)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                          (selectedOil || item.availableOils![0]) === oil
                            ? 'bg-[#E5B65F] text-black border-[#E5B65F] font-bold shadow-sm'
                            : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                        }`}
                      >
                        {oil}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Options Groups (e.g. Dining options, Preparation, Sides) */}
              {item.options &&
                item.options.map((optGroup) => (
                  <div key={optGroup.title}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#E5B65F]">
                        {optGroup.title}
                      </label>
                      {optGroup.required && (
                        <span className="text-[10px] text-[#E5B65F] font-semibold">Required</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {optGroup.choices.map((choice) => {
                        const isSelected = selectedOptions[optGroup.title] === choice.id;
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() =>
                              setSelectedOptions({
                                ...selectedOptions,
                                [optGroup.title]: choice.id,
                              })
                            }
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#E5B65F] text-black border-[#E5B65F] font-bold shadow-sm'
                                : isLight
                                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                            }`}
                          >
                            <span>{choice.name}</span>
                            {choice.price > 0 && <span>+${choice.price}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Dedicated Booking Calendar Section */}
              {item.hasCalendarBooking && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#E5B65F]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E5B65F]">
                        Dedicated Appointment Calendar
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="text-xs text-[#E5B65F] font-semibold hover:underline"
                    >
                      {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                    </button>
                  </div>

                  {showCalendar && (
                    <BookingCalendar
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                      guests={guests}
                      onGuestsChange={setGuests}
                      serviceTitle={item.title}
                      providerName={item.merchantName}
                    />
                  )}
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5B65F] mb-1.5">
                  App Notes & Villa Details
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="E.g. Villa Suite 402, gate access code, dietary allergies, or arrival notes..."
                  className={`w-full p-3 rounded-xl border text-xs outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#E5B65F]'
                      : 'bg-white/5 border-white/10 text-white focus:border-[#E5B65F]'
                  }`}
                />
              </div>

              {/* Simulated Checkout Disclaimer */}
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-500/20 text-blue-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Simulated App Hold for Demo Purposes:</strong>{' '}
                  Instant booking verification simulated locally, awaiting live connection to the payment router and banking provider.
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Bar */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center justify-between gap-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a1c] border-white/10'
            }`}
          >
            <div>
              <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Total Estimate
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#E5B65F]">
                ${totalPrice.toFixed(2)}{' '}
                {item.priceUnitLabel && (
                  <span className="text-xs font-normal text-gray-400">
                    {item.priceUnitLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity and Action */}
            <div className="flex items-center gap-3">
              {!item.hasCalendarBooking && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border transition-colors cursor-pointer ${
                      isLight ? 'border-slate-300 hover:bg-slate-200' : 'border-white/15 hover:bg-white/10'
                    }`}
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border transition-colors cursor-pointer ${
                      isLight ? 'border-slate-300 hover:bg-slate-200' : 'border-white/15 hover:bg-white/10'
                    }`}
                  >
                    +
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleAction}
                className="bg-[#E5B65F] hover:bg-[#d6a54d] text-black font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition cursor-pointer flex items-center gap-2"
              >
                {item.hasCalendarBooking ? (
                  <>
                    <CalendarIcon className="w-4 h-4" />
                    <span>Confirm Calendar Reservation</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to App Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Reviews Modal */}
      <GoogleReviewsModal
        isOpen={showGoogleReviewsModal}
        onClose={() => setShowGoogleReviewsModal(false)}
        entityName={item.merchantName}
        categoryName={item.type.toUpperCase()}
        rating={item.googleRating || item.rating || 4.9}
        totalReviews={item.googleReviewsCount || item.reviewsCount || 340}
        reviews={item.googleReviews || []}
        socials={item.socials}
      />
    </>
  );
}
