import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function FloatingCartBar() {
  const {
    cart,
    itemsCount,
    finalTotal,
    setIsCartOpen,
    cartRestaurantName,
    isCartOpen,
    isCheckoutOpen,
    isTrackingOpen,
    activeOrder,
  } = useCart();
  const { isLight } = useTheme();

  // Hide if cart empty, if cart/checkout/tracking drawer is open, or if an order is currently active
  if (cart.length === 0 || isCartOpen || isCheckoutOpen || isTrackingOpen || activeOrder !== null) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="fixed left-0 right-0 z-40 px-4 max-w-xl mx-auto pointer-events-none"
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={`w-full pointer-events-auto backdrop-blur-xl border transition duration-300 rounded-full p-2 pl-3.5 pr-2.5 flex items-center justify-between group cursor-pointer ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:border-[#B88728]'
              : 'bg-[#1a1c1e]/95 border-[#E5B65F]/40 text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-[#E5B65F]'
          }`}
        >
          {/* Left: Cart Badge & Details */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform ${
              isLight ? 'bg-[#B88728] text-slate-950' : 'bg-[#E5B65F] text-black'
            }`}>
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  View Order
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-gray-300'
                }`}>
                  {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className={`text-[11px] font-medium truncate max-w-[180px] sm:max-w-[260px] ${
                isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
              }`}>
                {cartRestaurantName || 'Concierge Order'}
              </p>
            </div>
          </div>

          {/* Right: Total and Proceed Pill */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm tracking-wide transition-colors ${
            isLight
              ? 'bg-[#B88728] text-slate-950 group-hover:bg-[#967C3B]'
              : 'bg-[#E5B65F] text-black group-hover:bg-[#d6a54d]'
          }`}>
            <span>${finalTotal.toFixed(2)}</span>
            <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
