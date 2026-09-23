import React, { useState } from 'react';
import { X, CreditCard, Check, Loader2, Building2, MapPin, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CheckoutSimulatedModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    finalTotal,
    cartRestaurantName,
    placeSimulatedOrder,
  } = useCart();
  const { isLight } = useTheme();

  const [deliveryAddress, setDeliveryAddress] = useState('Villa Rosa Kempinski Nairobi, Chiromo Rd');
  const [unitOrRoom, setUnitOrRoom] = useState('Executive Suite 712');
  const [instructions, setInstructions] = useState('Please leave with private floor butler.');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'apple_pay' | 'cash'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('+254 712 345 678');
  const [cardHolder, setCardHolder] = useState('Sarah Jenkins');

  // Simulation loading states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setProcessingStage('Connecting to payment router & provider sandbox...');

    await new Promise((r) => setTimeout(r, 750));
    setProcessingStage(
      paymentMethod === 'mpesa'
        ? 'Awaiting simulated M-Pesa STK push response from provider...'
        : 'Awaiting provider 3D-Secure demo token authorization...'
    );

    await new Promise((r) => setTimeout(r, 900));
    setProcessingStage('Handshake verified! Demo payment authorized without live debit...');

    await new Promise((r) => setTimeout(r, 650));

    let label = 'Simulated Card •••• 8492';
    if (paymentMethod === 'mpesa') label = `M-Pesa STK (${phoneNumber})`;
    if (paymentMethod === 'apple_pay') label = 'Apple Pay (Simulated Biometric)';
    if (paymentMethod === 'cash') label = 'Room Folio / Cash on Delivery';

    await placeSimulatedOrder({
      address: deliveryAddress,
      unitOrRoom,
      instructions,
      paymentMethod,
      paymentLabel: label,
      phoneNumber,
    });

    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isProcessing && setIsCheckoutOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border z-10 my-auto max-h-[92vh] flex flex-col overflow-hidden transition-colors ${
            isLight
              ? 'bg-white text-slate-900 border-slate-200'
              : 'bg-[#15171a] text-[#f2f2f2] border-white/15'
          }`}
        >
          {/* Top Bar */}
          <div className={`p-5 sm:p-6 border-b flex items-center justify-between transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E5B65F]/20 text-[#7d5a11] dark:text-[#E5B65F] border border-[#E5B65F]/40 flex items-center justify-center font-bold">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className={`font-bold text-lg sm:text-xl tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Finalize & Place Order
                </h3>
                <span className={`text-[10px] uppercase font-bold tracking-widest block mt-0.5 ${
                  isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                }`}>
                  Simulated Demo Checkout
                </span>
              </div>
            </div>

            <button
              onClick={() => !isProcessing && setIsCheckoutOpen(false)}
              disabled={isProcessing}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border disabled:opacity-30 ${
                isLight
                  ? 'bg-white hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10'
              }`}
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          </div>

          {/* EXPLICIT NOTICE BANNER: SIMULATED PAYMENT ONLY */}
          <div className={`border-b px-5 sm:px-6 py-3.5 flex items-start gap-3 transition-colors ${
            isLight
              ? 'bg-amber-50/90 border-amber-200 text-amber-900'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <div className="w-6 h-6 rounded-full bg-[#E5B65F] text-black flex-shrink-0 flex items-center justify-center mt-0.5 font-bold text-xs">
              !
            </div>
            <div className="text-xs leading-relaxed">
              <span className="font-extrabold uppercase tracking-wider text-[11px] block text-amber-700 dark:text-[#E5B65F]">
                Simulated Payment Demo (Waiting for Live Payment Router & Provider Connection)
              </span>
              <p className={`mt-0.5 font-medium ${isLight ? 'text-amber-800' : 'text-gray-200'}`}>
                This payment is <strong>strictly for demo & testing purposes</strong> while waiting for connection to the production payment router and provider (M-Pesa Daraja, Stripe, or Adyen). <strong>No real funds or accounts will be debited.</strong>
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
            {/* Delivery Location */}
            <div className="space-y-4">
              <div className={`flex items-center gap-2 text-sm font-extrabold tracking-wide ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <MapPin size={16} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                <span>Delivery Address & Location</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Hotel / Villa / Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#E5B65F] font-medium transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-[#202224] border-white/10 text-white'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                    Suite / Villa / Room #
                  </label>
                  <input
                    type="text"
                    value={unitOrRoom}
                    onChange={(e) => setUnitOrRoom(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#E5B65F] font-medium transition-colors ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-[#202224] border-white/10 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
                  App Delivery Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Leave with private villa concierge"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#E5B65F] font-medium transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-[#202224] border-white/10 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-sm font-extrabold tracking-wide ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  <CreditCard size={16} className="text-[#7d5a11] dark:text-[#E5B65F]" />
                  <span>Choose Simulated Payment Method</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-amber-500/10 border-amber-500/30 text-[#7d5a11] dark:text-[#E5B65F]">
                  Sandbox Router Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* M-Pesa Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'mpesa'
                      ? isLight
                        ? 'bg-amber-50 border-[#B88728] shadow-sm'
                        : 'bg-[#E5B65F]/10 border-[#E5B65F] shadow-md'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      : 'bg-[#202224] border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        M
                      </div>
                      <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        M-Pesa Express
                      </span>
                    </div>
                    {paymentMethod === 'mpesa' && (
                      <div className="w-5 h-5 rounded-full bg-[#E5B65F] text-black flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Simulates instant STK push prompt directly on mobile handset.
                  </p>
                </button>

                {/* Credit Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? isLight
                        ? 'bg-amber-50 border-[#B88728] shadow-sm'
                        : 'bg-[#E5B65F]/10 border-[#E5B65F] shadow-md'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      : 'bg-[#202224] border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        VIP
                      </div>
                      <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Credit Card (Demo)
                      </span>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="w-5 h-5 rounded-full bg-[#E5B65F] text-black flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Simulates 1-click tokenized checkout via test card ending •••• 8492.
                  </p>
                </button>

                {/* Apple Pay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-4 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'apple_pay'
                      ? isLight
                        ? 'bg-amber-50 border-[#B88728] shadow-sm'
                        : 'bg-[#E5B65F]/10 border-[#E5B65F] shadow-md'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      : 'bg-[#202224] border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs border border-white/20">
                        
                      </div>
                      <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Apple Pay
                      </span>
                    </div>
                    {paymentMethod === 'apple_pay' && (
                      <div className="w-5 h-5 rounded-full bg-[#E5B65F] text-black flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Simulates one-touch FaceID / TouchID authorization.
                  </p>
                </button>

                {/* Room Folio Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'cash'
                      ? isLight
                        ? 'bg-amber-50 border-[#B88728] shadow-sm'
                        : 'bg-[#E5B65F]/10 border-[#E5B65F] shadow-md'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      : 'bg-[#202224] border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        <Building2 size={14} />
                      </div>
                      <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Room Folio / Cash
                      </span>
                    </div>
                    {paymentMethod === 'cash' && (
                      <div className="w-5 h-5 rounded-full bg-[#E5B65F] text-black flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Billed directly to your hotel master room folio upon delivery.
                  </p>
                </button>
              </div>

              {/* Dynamic Inputs Based on Selection */}
              {paymentMethod === 'mpesa' && (
                <div className={`p-3.5 rounded-xl border space-y-2 mt-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#202224] border-white/10'
                }`}>
                  <label className={`text-xs font-bold flex items-center justify-between ${
                    isLight ? 'text-slate-700' : 'text-gray-300'
                  }`}>
                    <span>M-Pesa Phone Number (for simulated prompt)</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Router Demo Validated</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#E5B65F] font-medium ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-[#161819] border-white/10 text-white'
                    }`}
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className={`p-3.5 rounded-xl border space-y-2 mt-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#202224] border-white/10'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                      Preloaded Demo Card
                    </span>
                    <span className="font-bold text-[#7d5a11] dark:text-[#E5B65F]">Visa Infinite • 8492</span>
                  </div>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Cardholder Name"
                    className={`w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-[#E5B65F] font-medium ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-[#161819] border-white/10 text-white'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Order Summary Snapshot */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
            }`}>
              <div className={`flex items-center justify-between text-xs font-semibold ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <span>Merchant Partner</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {cartRestaurantName}
                </span>
              </div>
              <div className={`flex items-center justify-between text-xs font-semibold ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <span>Selected Items</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {cart.length} item(s)
                </span>
              </div>
              <div className={`flex items-center justify-between text-sm font-bold pt-2 border-t ${
                isLight ? 'text-slate-900 border-slate-200' : 'text-white border-white/10'
              }`}>
                <span>Total Demo Amount</span>
                <span className="text-[#7d5a11] dark:text-[#E5B65F] text-base font-bold">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Action Button with Interactive Simulation State */}
          <div className={`p-5 sm:p-6 border-t ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
          }`}>
            {isProcessing ? (
              <div className={`w-full py-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center ${
                isLight ? 'bg-white border-amber-300' : 'bg-[#202224] border-[#E5B65F]/40'
              }`}>
                <div className="flex items-center gap-2 text-sm font-bold text-[#7d5a11] dark:text-[#E5B65F]">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Demo Payment...</span>
                </div>
                <p className={`text-xs font-semibold animate-status ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  {processingStage}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#E5B65F] hover:bg-[#d6a54d] text-black font-bold text-sm uppercase tracking-wider transition transform active:scale-[0.98] shadow-lg shadow-[#E5B65F]/20 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>Simulate Payment & Place Order</span>
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-mono font-bold">
                    DEMO ROUTER
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-base">
                  <span>${finalTotal.toFixed(2)}</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
