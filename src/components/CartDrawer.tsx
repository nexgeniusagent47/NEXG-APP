import React, { useEffect, useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ShieldCheck, ArrowRight, Utensils, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartRestaurantName,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    serviceFee,
    tipAmount,
    setTipAmount,
    appliedPromo,
    applyPromo,
    removePromo,
    finalTotal,
    setIsCheckoutOpen,
  } = useCart();
  const { isLight } = useTheme();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  /**
   * Lock the page behind the drawer, and let Escape dismiss it.
   *
   * Declared HERE, above every return, because the component used to bail out with
   * `if (!isCartOpen) return null` further down. Any hook placed after that return is
   * mounted only while the drawer is open, so the render where it opens mounts MORE hooks
   * than the previous one did - React's "Rendered more hooks than during the previous
   * render", which throws and blanks the page. That was introduced and caught here; the
   * effect now sits before the guard so the hook count is constant.
   *
   * This drawer was also the only overlay in the app that never locked the body. Every
   * other modal goes through `useModalBehavior`, which owns exactly this. On a phone an
   * unlocked page scrolls under an open drawer, so the user scrolls content they cannot
   * see and loses their place - the same defect the Header's drawer was fixed for.
   *
   * `previous` is restored rather than cleared, so a second lock elsewhere is not broken,
   * and the listener is bound in the capture phase so a descendant calling
   * stopPropagation cannot swallow the dismissal (a failure recorded in MerchantPreviewSheet).
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isCartOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsCartOpen(false);
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previous;
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, success: res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeDeliveryThreshold = 75;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
      <div
        className="fixed inset-0 z-50 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`w-screen max-w-md shadow-2xl border-l flex flex-col transition-colors duration-300 ${
              isLight
                ? 'bg-white text-slate-900 border-slate-200'
                : 'bg-[#161819] text-[#f2f2f2] border-white/10'
            }`}
          >
            {/* Header */}
            <div className={`p-5 sm:p-6 border-b flex items-center justify-between transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-widest block mb-0.5 ${
                  isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                }`}>
                  Your Order Cart
                </span>
                <h3 className={`font-bold text-lg sm:text-xl tracking-tight truncate max-w-[240px] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {cartRestaurantName || 'Select Items'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className={`text-xs transition-colors px-2 py-1 cursor-pointer ${
                      isLight
                        ? 'text-slate-600 hover:text-rose-600'
                        : 'text-gray-400 hover:text-rose-400'
                    }`}
                    title="Clear entire cart"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/5'
                  }`}
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Free Delivery Bar */}
            {cart.length > 0 && (
              <div className={`px-5 py-3 border-b ${
                isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#1e2022] border-white/5'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  {remainingForFreeDelivery > 0 ? (
                    <span className={isLight ? 'text-slate-700' : 'text-gray-300'}>
                      Add <strong className={isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}>${remainingForFreeDelivery.toFixed(2)}</strong> for Free Delivery
                    </span>
                  ) : (
                    <span className={`font-semibold flex items-center gap-1 ${
                      isLight ? 'text-emerald-700' : 'text-emerald-400'
                    }`}>
                      <Sparkles size={12} /> You unlocked Free Priority Delivery!
                    </span>
                  )}
                  <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    {Math.round(progressToFreeDelivery)}%
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isLight ? 'bg-slate-200' : 'bg-white/10'
                }`}>
                  {/* scaleX rather than width: the free-delivery meter animates on
                      every cart change, and a width tween relayouts the drawer each
                      frame. Transform is composited. */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: Math.max(0, Math.min(1, progressToFreeDelivery / 100)) }}
                    transition={{ duration: 0.5 }}
                    style={{ originX: 0 }}
                    className={`h-full w-full origin-left rounded-full ${
                      isLight
                        ? 'bg-gradient-to-r from-[#B88728] to-emerald-600'
                        : 'bg-gradient-to-r from-[#E5B65F] to-emerald-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Content: Empty or List */}
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <div className={`w-20 h-20 rounded-full border flex items-center justify-center mb-4 ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                    : 'bg-white/5 border border-white/10 text-gray-400'
                }`}>
                  <Utensils size={32} />
                </div>
                <h4 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Your cart is empty
                </h4>
                <p className={`text-sm max-w-xs mb-6 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  Explore our curated restaurants and add artisanal dishes or concierge dining to get started.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-[#B88728] text-slate-950 hover:bg-[#967C3B]'
                      : 'bg-[#E5B65F] text-black hover:bg-[#d6a54d]'
                  }`}
                >
                  Explore Menus
                </button>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex gap-3 group transition-colors ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          : 'bg-[#202224] border-white/5 hover:border-white/15'
                      }`}
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-16 h-16 rounded-lg object-cover flex-shrink-0 ${
                          isLight ? 'bg-slate-200' : 'bg-black/40'
                        }`}
                      />

                      {/* Details */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className={`font-semibold text-sm tracking-tight leading-snug truncate ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {item.name}
                          </h5>
                          <span className={`text-sm font-bold whitespace-nowrap ${
                            isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                          }`}>
                            ${item.itemTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Options summary */}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedOptions.map((opt, i) => (
                              <span
                                key={i}
                                className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isLight
                                    ? 'text-slate-600 bg-slate-200/80'
                                    : 'text-gray-400 bg-black/40'
                                }`}
                              >
                                {opt.choiceName}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.specialInstructions && (
                          <p className={`text-[11px] italic mt-1 truncate ${
                            isLight ? 'text-slate-600' : 'text-gray-400'
                          }`}>
                            &quot;{item.specialInstructions}&quot;
                          </p>
                        )}

                        {/* Controls */}
                        <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
                          isLight ? 'border-slate-200' : 'border-white/5'
                        }`}>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className={`transition-colors p-1 cursor-pointer ${
                              isLight
                                ? 'text-slate-400 hover:text-rose-600'
                                : 'text-gray-400 hover:text-rose-400'
                            }`}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className={`flex items-center rounded-full border px-2 py-0.5 ${
                            isLight
                              ? 'bg-white border-slate-200 text-slate-900'
                              : 'bg-[#17181a] border-white/10 text-white'
                          }`}>
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  {appliedPromo ? (
                    <div className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      isLight
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Tag size={14} />
                        <span className="font-semibold">{appliedPromo.code}</span>
                        <span className={isLight ? 'text-slate-600' : 'text-gray-300'}>({appliedPromo.label})</span>
                      </div>
                      <button
                        onClick={removePromo}
                        className={`underline text-[11px] cursor-pointer ${
                          isLight ? 'text-slate-600 hover:text-slate-800' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-grow">
                        <Tag
                          size={14}
                          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                            isLight ? 'text-slate-400' : 'text-gray-400'
                          }`}
                        />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo code (try NEXG20)"
                          className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#B88728]'
                              : 'bg-[#202224] border-white/10 text-white placeholder-gray-500 focus:border-[#E5B65F]'
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isLight
                            ? 'bg-slate-900 hover:bg-black text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoMessage && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        promoMessage.success
                          ? isLight ? 'text-emerald-700' : 'text-emerald-400'
                          : isLight ? 'text-rose-600' : 'text-rose-400'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                {/* Tip Selector */}
                <div className={`pt-2 border-t space-y-2 ${
                  isLight ? 'border-slate-200' : 'border-white/10'
                }`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Courier Concierge Tip</span>
                    <span className={`font-bold ${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}`}>
                      ${tipAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 8, 12].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTipAmount(amount)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                          tipAmount === amount
                            ? isLight
                              ? 'bg-[#B88728] text-slate-950 border-[#B88728]'
                              : 'bg-[#E5B65F] text-black border-[#E5B65F]'
                            : isLight
                            ? 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                            : 'bg-[#202224] text-gray-300 border-white/5 hover:border-white/20'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className={`pt-3 border-t space-y-2 text-xs ${
                  isLight ? 'border-slate-200' : 'border-white/10'
                }`}>
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    <span>Delivery fee</span>
                    <span>
                      {remainingForFreeDelivery === 0 ? (
                        <span className={`font-semibold line-through mr-1.5 ${
                          isLight ? 'text-emerald-700' : 'text-emerald-400'
                        }`}>
                          ${deliveryFee.toFixed(2)}
                        </span>
                      ) : null}
                      {remainingForFreeDelivery === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    <span>Concierge service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className={`flex justify-between font-medium ${
                      isLight ? 'text-emerald-700' : 'text-emerald-400'
                    }`}>
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${appliedPromo.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {tipAmount > 0 && (
                    <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                      <span>Courier tip</span>
                      <span>${tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-base font-bold pt-2 border-t ${
                    isLight
                      ? 'border-slate-200 text-slate-900'
                      : 'border-white/10 text-white'
                  }`}>
                    <span>Total</span>
                    <span className={isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}>
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Checkout CTA */}
            {cart.length > 0 && (
              <div className={`p-5 sm:p-6 border-t ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
              }`}>
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-full font-bold text-base transition transform active:scale-[0.98] shadow-lg cursor-pointer ${
                    isLight
                      ? 'bg-[#B88728] hover:bg-[#967C3B] text-slate-950 shadow-[#B88728]/20'
                      : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black shadow-[#E5B65F]/20'
                  }`}
                >
                  <span>Proceed to Checkout</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold">${finalTotal.toFixed(2)}</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </div>
                </button>
                <div className={`flex items-center justify-center gap-1.5 text-[11px] mt-3 ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  <ShieldCheck size={13} className={isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'} />
                  <span>Simulated checkout & instant confirmation</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      )}
    </AnimatePresence>
  );
}
