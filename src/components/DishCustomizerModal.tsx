import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Plus,
  Minus,
  Check,
  Clock,
  Sparkles,
  AlertCircle,
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, CartSelectedOption, CartItem, DishUserReview } from '../types';
import { useCart } from '../context/CartContext';

interface DishCustomizerModalProps {
  dish: MenuItem | null;
  restaurantName?: string;
  onClose: () => void;
}

export default function DishCustomizerModal({
  dish,
  restaurantName,
  onClose,
}: DishCustomizerModalProps) {
  const { t } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();
  const [activeTab, setActiveTab] = useState<'customize' | 'reviews'>('customize');
  const [quantity, setQuantity] = useState(1);
  const [selectedRadioChoices, setSelectedRadioChoices] = useState<
    Record<string, { choiceId: string; choiceName: string; price: number }>
  >({});
  const [selectedCheckboxChoices, setSelectedCheckboxChoices] = useState<
    Record<string, { choiceId: string; choiceName: string; price: number }[]>
  >({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reviews State
  const [reviewsList, setReviewsList] = useState<DishUserReview[]>([]);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  // New Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Must Try');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Initialize required selections & reviews
  useEffect(() => {
    if (!dish) return;
    setQuantity(1);
    setSpecialInstructions('');
    setValidationError(null);
    setActiveTab('customize');
    setReviewSubmitted(false);

    // Load reviews
    const initialReviews: DishUserReview[] = dish.userReviews ? [...dish.userReviews] : [];
    // Check if there are locally stored reviews for this dish
    try {
      const stored = localStorage.getItem(`nexg_dish_reviews_${dish.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialReviews.unshift(...parsed);
        }
      }
    } catch {
      // Ignore localStorage read error
    }
    setReviewsList(initialReviews);

    const initialRadios: Record<string, { choiceId: string; choiceName: string; price: number }> = {};
    const initialChecks: Record<string, { choiceId: string; choiceName: string; price: number }[]> = {};

    dish.optionGroups?.forEach((group) => {
      if (group.required && group.choices.length > 0) {
        initialRadios[group.id] = {
          choiceId: group.choices[0].id,
          choiceName: group.choices[0].name,
          price: group.choices[0].price,
        };
      } else {
        initialChecks[group.id] = [];
      }
    });

    setSelectedRadioChoices(initialRadios);
    setSelectedCheckboxChoices(initialChecks);
  }, [dish]);

  if (!dish) return null;

  // Calculate unit price including options
  const radioExtrasTotal = (Object.values(selectedRadioChoices) as { choiceId: string; choiceName: string; price: number }[]).reduce(
    (sum, c) => sum + c.price,
    0
  );
  const allCheckboxItems = Object.values(selectedCheckboxChoices).flat() as {
    choiceId: string;
    choiceName: string;
    price: number;
  }[];
  const checkboxExtrasTotal = allCheckboxItems.reduce((sum, c) => sum + c.price, 0);
  const unitPrice = dish.price + radioExtrasTotal + checkboxExtrasTotal;
  const totalPrice = +(unitPrice * quantity).toFixed(2);

  const handleRadioSelect = (groupId: string, choiceId: string, choiceName: string, price: number) => {
    setSelectedRadioChoices((prev) => ({
      ...prev,
      [groupId]: { choiceId, choiceName, price },
    }));
    setValidationError(null);
  };

  const handleCheckboxToggle = (groupId: string, choiceId: string, choiceName: string, price: number) => {
    setSelectedCheckboxChoices((prev) => {
      const currentList = prev[groupId] || [];
      const exists = currentList.some((c) => c.choiceId === choiceId);
      if (exists) {
        return {
          ...prev,
          [groupId]: currentList.filter((c) => c.choiceId !== choiceId),
        };
      } else {
        return {
          ...prev,
          [groupId]: [...currentList, { choiceId, choiceName, price }],
        };
      }
    });
  };

  const handleAddToCart = () => {
    if (dish.optionGroups) {
      for (const group of dish.optionGroups) {
        if (group.required && !selectedRadioChoices[group.id]) {
          setActiveTab('customize');
          setValidationError(`Please make a selection for "${group.name}".`);
          return;
        }
      }
    }

    const allSelectedOptions: CartSelectedOption[] = [];

    (Object.entries(selectedRadioChoices) as [string, { choiceId: string; choiceName: string; price: number }][]).forEach(
      ([groupId, choice]) => {
        const group = dish.optionGroups?.find((g) => g.id === groupId);
        allSelectedOptions.push({
          groupId,
          groupName: group?.name || 'Option',
          choiceId: choice.choiceId,
          choiceName: choice.choiceName,
          price: choice.price,
        });
      }
    );

    (Object.entries(selectedCheckboxChoices) as [string, { choiceId: string; choiceName: string; price: number }[]][]).forEach(
      ([groupId, list]) => {
        const group = dish.optionGroups?.find((g) => g.id === groupId);
        list.forEach((choice) => {
          allSelectedOptions.push({
            groupId,
            groupName: group?.name || 'Add-on',
            choiceId: choice.choiceId,
            choiceName: choice.choiceName,
            price: choice.price,
          });
        });
      }
    );

    const cartItem: CartItem = {
      id: `${dish.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: dish.id,
      restaurantId: dish.restaurantId,
      restaurantName: restaurantName || 'NEXG Partner Restaurant',
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity,
      selectedOptions: allSelectedOptions,
      specialInstructions: specialInstructions.trim() || undefined,
      itemTotal: totalPrice,
    };

    addToCart(cartItem);
    onClose();
    setIsCartOpen(true);
  };

  const handleHelpfulClick = (reviewId: string, initialCount: number) => {
    if (userVoted[reviewId]) return;
    setUserVoted((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1,
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReview: DishUserReview = {
      id: `rev-${Date.now()}`,
      dishId: dish.id,
      authorName: newAuthorName.trim() || 'Verified Guest',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verifiedDiner: true,
      authorRoom: newRoomNumber.trim() ? `Room ${newRoomNumber.trim()}` : 'Suite 204',
      tags: selectedTag ? [selectedTag] : ['Must Try'],
      helpfulCount: 0,
    };

    setReviewsList((prev) => [newReview, ...prev]);
    try {
      const stored = localStorage.getItem(`nexg_dish_reviews_${dish.id}`);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newReview);
      localStorage.setItem(`nexg_dish_reviews_${dish.id}`, JSON.stringify(list));
    } catch {
      // ignore
    }

    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const availableTags = ['Must Try', 'Perfect Temperature', 'Fast Dispatch', 'Generous Portion', 'Exceptional Flavor'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="onboarding-theme relative w-full max-w-xl bg-white text-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Image with Gradient */}
          <div className="relative h-48 sm:h-56 w-full flex-shrink-0 bg-black/40 overflow-hidden">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181a1b] via-[#181a1b]/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105 cursor-pointer border border-slate-200"
              aria-label={t.ui.dishCustomizerModal.s_70d3a5}
            >
              <X size={18} />
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {dish.dietary?.map((diet) => (
                <span
                  key={diet}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-black/60 text-gold border border-gold-line backdrop-blur-md uppercase"
                >
                  {diet.replace('_', ' ')}
                </span>
              ))}
            </div>

            {dish.prepTimeMinutes && (
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/70 text-gray-200 border border-slate-200 backdrop-blur-sm">
                <Clock size={13} className="text-gold" />
                <span>{dish.prepTimeMinutes} mins prep</span>
              </div>
            )}
          </div>

          {/* Dish Header Info */}
          <div className="px-5 pt-4 pb-2 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {dish.name}
                </h3>
                {/* Rating and review counter */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-gold">
                    <Star size={13} className="fill-gold" />
                    <span>{dish.rating || 4.9}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-slate-600 hover:text-gold transition-colors underline decoration-white/20 cursor-pointer"
                  >
                    {reviewsList.length} verified diner reviews
                  </button>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-emerald-400 font-medium">98% recommendation</span>
                </div>
              </div>

              <span className="text-xl sm:text-2xl font-bold text-gold whitespace-nowrap">
                ${dish.price.toFixed(2)}
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
              {dish.description}
            </p>
          </div>

          {/* Tab Selector: Customize Dish vs Diner Reviews */}
          <div className="flex items-center border-b border-slate-200 bg-white px-5 sm:px-7 mt-2">
            <button
              onClick={() => setActiveTab('customize')}
              className={`py-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'customize'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t.ui.dishCustomizerModal.s_a196bb}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={14} />
              <span>Diner Reviews ({reviewsList.length})</span>
            </button>
          </div>

          {/* TAB 1: CUSTOMIZE */}
          {activeTab === 'customize' && (
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
              {/* Option Groups */}
              {dish.optionGroups && dish.optionGroups.length > 0 && (
                <div className="space-y-6">
                  {dish.optionGroups.map((group) => {
                    const isRequired = group.required;
                    return (
                      <div key={group.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-white">
                              {group.name}
                            </h4>
                            {isRequired ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-tint text-gold border border-gold-line uppercase">
                                Required
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600">Optional</span>
                            )}
                          </div>
                        </div>

                        {/* Choices */}
                        <div className="space-y-2">
                          {group.choices.map((choice) => {
                            if (group.required || group.maxSelect === 1) {
                              const isSelected = selectedRadioChoices[group.id]?.choiceId === choice.id;
                              return (
                                <label
                                  key={choice.id}
                                  onClick={() => handleRadioSelect(group.id, choice.id, choice.name, choice.price)}
                                  className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-gold-tint border-gold text-white shadow-sm'
                                      : 'bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                        isSelected
                                          ? 'border-gold bg-gold text-slate-950'
                                          : 'border-gray-500'
                                      }`}
                                    >
                                      {isSelected && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <span className="text-sm font-medium">{choice.name}</span>
                                  </div>
                                  <span className="text-xs font-semibold text-gold">
                                    {choice.price > 0 ? `+$${choice.price.toFixed(2)}` : 'Included'}
                                  </span>
                                </label>
                              );
                            }

                            // Multiple checkboxes
                            const isChecked = selectedCheckboxChoices[group.id]?.some((c) => c.choiceId === choice.id);
                            return (
                              <label
                                key={choice.id}
                                onClick={() => handleCheckboxToggle(group.id, choice.id, choice.name, choice.price)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                                  isChecked
                                    ? 'bg-gold-tint border-gold text-white shadow-sm'
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-600'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                      isChecked
                                        ? 'border-gold bg-gold text-slate-950'
                                        : 'border-gray-500'
                                    }`}
                                  >
                                    {isChecked && <Check size={12} strokeWidth={3} />}
                                  </div>
                                  <span className="text-sm font-medium">{choice.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-gold">
                                  {choice.price > 0 ? `+$${choice.price.toFixed(2)}` : 'Free'}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Special Instructions */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label htmlFor="dish-instructions" className="text-sm font-semibold text-white block">{t.ui.dishCustomizerModal.s_ece1f0}</label>
                <textarea
                  id="dish-instructions"
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder={t.ui.dishCustomizerModal.s_2db328}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              {/* Validation warning */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle size={15} />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DINER REVIEWS & WRITE A REVIEW */}
          {activeTab === 'reviews' && (
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar bg-white">
              {/* Reviews Summary Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-white">{dish.rating || 4.9}</span>
                    <div className="flex text-gold">
                      <Star size={10} className="fill-gold" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.ui.dishCustomizerModal.s_052b34}</h4>
                    <p className="text-xs text-slate-600">
                      Based on {reviewsList.length} verified ratings for this dish
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/20">{t.ui.dishCustomizerModal.s_1c711d}</span>
                </div>
              </div>

              {/* Write a Review Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={14} className="text-gold" />
                  <span>{t.ui.dishCustomizerModal.s_d0fac0}</span>
                </h4>

                {reviewSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Thank you! Your verified review has been posted and will help other diners.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    {/* Interactive Star Rating */}
                    <div>
                      <label className="text-xs text-slate-600 block mb-1.5 font-medium">
                        Your Rating:
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-gray-600 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              size={22}
                              className={
                                star <= (hoverRating || newRating)
                                  ? 'fill-gold text-gold'
                                  : 'text-gray-600'
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-gold ml-2">
                          {newRating === 5 ? '5.0 (Exceptional)' : `${newRating}.0`}
                        </span>
                      </div>
                    </div>

                    {/* Author name & room */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={t.ui.dishCustomizerModal.s_bfae0e}
                        value={newAuthorName}
                        onChange={(e) => setNewAuthorName(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        placeholder={t.ui.dishCustomizerModal.s_9c0406}
                        value={newRoomNumber}
                        onChange={(e) => setNewRoomNumber(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                      />
                    </div>

                    {/* Quick Tags */}
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Highlight:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(tag)}
                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                              selectedTag === tag
                                ? 'bg-gold text-slate-950 border-gold font-bold'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Area */}
                    <textarea
                      rows={2}
                      placeholder={t.ui.dishCustomizerModal.s_594a3d}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-strong text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Send size={13} />
                      <span>{t.ui.dishCustomizerModal.s_84ab4b}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Guest Comments ({reviewsList.length})
                </h4>

                {reviewsList.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-6">
                    No guest reviews yet. Be the first to review this dish!
                  </p>
                ) : (
                  reviewsList.map((rev) => {
                    const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulCount ?? 6;
                    const hasVoted = userVoted[rev.id];

                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gold-tint border border-gold-line text-gold font-bold text-xs flex items-center justify-center">
                              {rev.authorName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white">{rev.authorName}</span>
                                {rev.verifiedDiner && (
                                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-0.5">
                                    <CheckCircle2 size={10} /> Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                <span>{rev.authorRoom || 'Guest'}</span>
                                <span>•</span>
                                <span>{rev.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-gold">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={11} className="fill-gold" />
                            ))}
                          </div>
                        </div>

                        {rev.tags && rev.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {rev.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-100"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {rev.comment}
                        </p>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount ?? 6)}
                            className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                              hasVoted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                            }`}
                          >
                            <ThumbsUp size={11} className={hasVoted ? 'fill-emerald-400' : ''} />
                            <span>Helpful ({currentHelpful})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Footer Bar with Quantity and Add Button */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label={t.ui.dishCustomizerModal.s_6c02ab}
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label={t.ui.dishCustomizerModal.s_062e79}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Add to Order Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-grow flex items-center justify-between px-6 py-3.5 rounded-full bg-gold hover:bg-gold-strong text-slate-950 font-bold text-sm sm:text-base transition transform active:scale-[0.98] shadow-lg shadow-gold-tint cursor-pointer"
            >
              <span>{t.ui.dishCustomizerModal.s_492026}</span>
              <span className="font-extrabold tracking-wide">
                ${totalPrice.toFixed(2)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
