import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Bike,
  Utensils,
  Receipt,
  FastForward,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function OrderTrackingModal() {
  const {
    activeOrder,
    isTrackingOpen,
    setIsTrackingOpen,
    advanceOrderSimulation,
    cancelOrder,
  } = useCart();
  const { isLight } = useTheme();

  const [activeTab, setActiveTab] = useState<'tracking' | 'receipt'>('tracking');
  const [copiedPin, setCopiedPin] = useState(false);

  if (!isTrackingOpen || !activeOrder) return null;

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(activeOrder.securityPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const getStatusBadge = () => {
    switch (activeOrder.status) {
      case 'placed':
        return {
          label: 'Order Confirmed',
          color: isLight
            ? 'text-blue-700 bg-blue-50 border-blue-200'
            : 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
      case 'preparing':
        return {
          label: 'Chef Preparing Dishes',
          color: isLight
            ? 'text-amber-800 bg-amber-50 border-amber-200'
            : 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
      case 'courier_heading':
        return {
          label: 'Courier Heading to Kitchen',
          color: isLight
            ? 'text-purple-700 bg-purple-50 border-purple-200'
            : 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Discreet Delivery',
          color: isLight
            ? 'text-[#B88728] bg-amber-50 border-amber-200'
            : 'text-[#E5B65F] bg-[#E5B65F]/10 border-[#E5B65F]/30',
        };
      case 'delivered':
        return {
          label: 'Order Delivered & Completed',
          color: isLight
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTrackingOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border z-10 my-auto max-h-[92vh] flex flex-col overflow-hidden transition duration-300 ${
            isLight
              ? 'bg-white text-slate-900 border-slate-200'
              : 'bg-[#161819] text-[#f2f2f2] border-white/15'
          }`}
        >
          {/* Header Bar */}
          <div className={`p-5 sm:p-6 border-b flex items-center justify-between transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                isLight
                  ? 'bg-amber-100 text-[#B88728] border-amber-200'
                  : 'bg-[#E5B65F]/20 text-[#E5B65F] border-[#E5B65F]/30'
              }`}>
                <Bike size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    {activeOrder.id}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <h3 className={`font-bold text-lg sm:text-xl tracking-tight truncate max-w-[260px] ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {activeOrder.restaurantName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTrackingOpen(false)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/5'
                }`}
                aria-label="Minimize tracking"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Demo Notice Banner */}
          <div className={`border-b px-5 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle size={14} />
              <span>Simulated Order • Live tracking demo in progress</span>
            </div>
            {activeOrder.status !== 'delivered' && (
              <button
                onClick={advanceOrderSimulation}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer shadow-sm ${
                  isLight
                    ? 'bg-[#B88728] hover:bg-[#967C3B] text-slate-950'
                    : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
                }`}
                title="Fast forward simulation to next lifecycle stage"
              >
                <FastForward size={12} />
                <span>Fast-Forward Stage</span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className={`flex border-b px-6 ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#141517]'
          }`}>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'tracking'
                  ? isLight ? 'border-[#B88728] text-[#B88728]' : 'border-[#E5B65F] text-[#E5B65F]'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Live Journey & ETA
            </button>
            <button
              onClick={() => setActiveTab('receipt')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'receipt'
                  ? isLight ? 'border-[#B88728] text-[#B88728]' : 'border-[#E5B65F] text-[#E5B65F]'
                  : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Itemized Receipt & PIN
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
            {activeTab === 'tracking' ? (
              <>
                {/* ETA Big Display Card */}
                <div className={`p-5 sm:p-6 rounded-2xl border relative overflow-hidden ${
                  isLight
                    ? 'bg-gradient-to-br from-slate-50 to-white border-slate-200'
                    : 'bg-gradient-to-br from-[#1d2023] to-[#16181a] border-white/10'
                }`}>
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className={`text-xs font-medium uppercase tracking-wider block mb-1 ${
                        isLight ? 'text-slate-600' : 'text-gray-400'
                      }`}>
                        Estimated Delivery
                      </span>
                      <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight flex items-baseline gap-2 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {activeOrder.status === 'delivered' ? (
                          <span className={isLight ? 'text-emerald-700' : 'text-emerald-400'}>Order Arrived!</span>
                        ) : (
                          <>
                            <span>~{activeOrder.estimatedMinutesLeft} mins</span>
                            <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${
                              isLight ? 'text-emerald-700 bg-emerald-100' : 'text-emerald-400 bg-emerald-400/10'
                            }`}>
                              On schedule
                            </span>
                          </>
                        )}
                      </div>
                      <p className={`text-xs mt-2 flex items-center gap-1.5 ${
                        isLight ? 'text-slate-600' : 'text-gray-400'
                      }`}>
                        <MapPin size={13} className={isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'} />
                        <span>Delivering to {activeOrder.unitOrRoom}, {activeOrder.deliveryAddress}</span>
                      </p>
                    </div>

                    {/* Delivery PIN Pill */}
                    <div className={`border p-3 rounded-xl flex items-center gap-3 ${
                      isLight
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-[#121314] border-[#E5B65F]/30'
                    }`}>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-widest block ${
                          isLight ? 'text-slate-600' : 'text-gray-400'
                        }`}>
                          Delivery PIN
                        </span>
                        <span className={`text-xl font-mono font-bold tracking-widest ${
                          isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                        }`}>
                          {activeOrder.securityPin}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyPin}
                        className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          isLight
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                        title="Copy delivery security PIN"
                      >
                        {copiedPin ? <Check size={14} className={isLight ? 'text-emerald-700' : 'text-emerald-400'} /> : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Simulated Map / Route Radar Graphic */}
                  <div className={`mt-6 h-40 sm:h-48 rounded-xl border relative overflow-hidden flex items-center justify-center ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0e1012] border-white/10'
                  }`}>
                    {/* Map Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: isLight
                          ? `radial-gradient(#B88728 1px, transparent 1px), radial-gradient(#64748b 1px, #f1f5f9 1px)`
                          : `radial-gradient(#E5B65F 1px, transparent 1px), radial-gradient(#ffffff 1px, #0e1012 1px)`,
                        backgroundSize: '24px 24px',
                        backgroundPosition: '0 0, 12px 12px',
                      }}
                    />

                    {/* Animated Delivery Route Vector */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 60,120 Q 200,40 320,80 T 540,110"
                        fill="none"
                        stroke={isLight ? '#cbd5e1' : '#333'}
                        strokeWidth="3"
                        strokeDasharray="6 6"
                      />
                      <path
                        d="M 60,120 Q 200,40 320,80 T 540,110"
                        fill="none"
                        stroke={isLight ? '#B88728' : '#E5B65F'}
                        strokeWidth="3"
                        className="animate-status"
                      />
                    </svg>

                    {/* Restaurant Pin */}
                    <div className="absolute left-12 bottom-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white/20">
                        <Utensils size={14} />
                      </div>
                      <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded backdrop-blur-sm ${
                        isLight ? 'text-slate-800 bg-white/80 border border-slate-200' : 'text-gray-300 bg-black/60'
                      }`}>
                        Restaurant
                      </span>
                    </div>

                    {/* Customer Destination Pin */}
                    <div className="absolute right-12 bottom-14 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white/20">
                        <MapPin size={14} />
                      </div>
                      <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded backdrop-blur-sm ${
                        isLight ? 'text-slate-800 bg-white/80 border border-slate-200' : 'text-gray-300 bg-black/60'
                      }`}>
                        Your Location
                      </span>
                    </div>

                    {/* Moving Rider Beacon */}
                    <motion.div
                      animate={{
                        x: activeOrder.status === 'placed' ? -140 : activeOrder.status === 'preparing' ? -60 : activeOrder.status === 'courier_heading' ? 20 : activeOrder.status === 'out_for_delivery' ? 100 : 160,
                        y: activeOrder.status === 'placed' ? 20 : activeOrder.status === 'preparing' ? -20 : activeOrder.status === 'courier_heading' ? -10 : activeOrder.status === 'out_for_delivery' ? 5 : 10,
                      }}
                      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                      className="absolute z-20 flex flex-col items-center"
                    >
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isLight
                            ? 'bg-[#B88728] text-slate-950 shadow-[0_0_20px_rgba(184,135,40,0.4)]'
                            : 'bg-[#E5B65F] text-black shadow-[0_0_20px_rgba(229,182,95,0.6)]'
                        }`}>
                          <Bike size={20} />
                        </div>
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-40 -z-10 ${
                          isLight ? 'bg-[#B88728]' : 'bg-[#E5B65F]'
                        }`} />
                      </div>
                      <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border ${
                        isLight
                          ? 'bg-white text-slate-800 border-slate-200'
                          : 'bg-[#121314] text-white border-[#E5B65F]/40'
                      }`}>
                        {activeOrder.courier.name}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Courier Details Card */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#202224] border-white/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={activeOrder.courier.photoUrl}
                      alt={activeOrder.courier.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 ${
                        isLight ? 'border-[#B88728]' : 'border-[#E5B65F]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {activeOrder.courier.name}
                        </h5>
                        <span className={`text-xs font-semibold flex items-center ${
                          isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'
                        }`}>
                          ★ {activeOrder.courier.rating}
                        </span>
                      </div>
                      <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        {activeOrder.courier.vehicle}
                      </p>
                      <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        {activeOrder.courier.deliveriesCount}+ concierge trips
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeOrder.courier.phone}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      title="Call Courier"
                    >
                      <Phone size={16} />
                    </a>
                    <button
                      onClick={() => alert(`App chat with ${activeOrder.courier.name}: "Hello! I am on my way with your heated thermal pack."`)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-[#B88728] hover:bg-[#967C3B] text-slate-950'
                          : 'bg-[#E5B65F] hover:bg-[#d6a54d] text-black'
                      }`}
                      title="Message Courier"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>

                {/* Vertical Timeline Stepper */}
                <div className={`space-y-4 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-slate-600' : 'text-gray-400'
                  }`}>
                    Live Progress Stages
                  </h4>

                  <div className={`relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 ${
                    isLight ? 'before:bg-slate-200' : 'before:bg-white/10'
                  }`}>
                    {activeOrder.timeline.map((step) => (
                      <div key={step.key} className="relative flex items-start gap-4">
                        {/* Dot Icon */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            step.completed
                              ? isLight
                                ? 'bg-[#B88728] text-slate-950 ring-4 ring-[#B88728]/20'
                                : 'bg-[#E5B65F] text-black ring-4 ring-[#E5B65F]/20'
                              : step.current
                              ? isLight
                                ? 'bg-slate-900 text-white ring-4 ring-slate-400/20 animate-status'
                                : 'bg-white text-black ring-4 ring-white/20 animate-status'
                              : isLight
                              ? 'bg-slate-100 border border-slate-300 text-slate-400'
                              : 'bg-[#202224] border border-white/20 text-gray-500'
                          }`}
                        >
                          {step.completed ? (
                            <Check size={11} strokeWidth={3} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-semibold ${
                                step.current || step.completed
                                  ? isLight ? 'text-slate-900' : 'text-white'
                                  : isLight ? 'text-slate-600' : 'text-gray-400'
                              }`}
                            >
                              {step.title}
                            </span>
                            <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-gray-400'}`}>{step.timestamp}</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Receipt Tab */
              <div className="space-y-5">
                {/* Receipt Box */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#202224] border-white/10'
                }`}>
                  <div className={`flex items-center justify-between pb-3 border-b text-xs ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div>
                      <span className={`block ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>Transaction Reference</span>
                      <span className={`font-mono font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {activeOrder.paymentDetails.transactionRef}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`block ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>Simulated Payment Method</span>
                      <span className={`font-semibold ${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}`}>
                        {activeOrder.paymentDetails.label}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {activeOrder.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-xs sm:text-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}`}>
                              {it.quantity}x
                            </span>
                            <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {it.name}
                            </span>
                          </div>
                          {it.selectedOptions && it.selectedOptions.length > 0 && (
                            <p className={`text-[11px] pl-5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                              {it.selectedOptions.map((o) => o.choiceName).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          ${it.itemTotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className={`pt-3 border-t space-y-2 text-xs ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      <span>Subtotal</span>
                      <span>${activeOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      <span>Delivery Fee</span>
                      <span>${activeOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      <span>App Service</span>
                      <span>${activeOrder.serviceFee.toFixed(2)}</span>
                    </div>
                    {activeOrder.discount > 0 && (
                      <div className={`flex justify-between font-medium ${
                        isLight ? 'text-emerald-700' : 'text-emerald-400'
                      }`}>
                        <span>Discount</span>
                        <span>-${activeOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {activeOrder.tip > 0 && (
                      <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                        <span>Courier Tip</span>
                        <span>${activeOrder.tip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className={`flex justify-between text-base font-bold pt-2 border-t ${
                      isLight ? 'border-slate-200 text-slate-900' : 'border-white/10 text-white'
                    }`}>
                      <span>Total Paid (Simulated)</span>
                      <span className={isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]'}>
                        ${activeOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explicit Disclaimer */}
                <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                    : 'bg-black/40 border border-white/10 text-gray-400'
                }`}>
                  <span className={`font-semibold block ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>Demonstration Notice:</span>
                  <p>
                    This is an automated simulation of the client ordering lifecycle in NEXG App. No actual payment provider has been billed. Once connected to the live API gateway, genuine payments will be processed via M-Pesa or Stripe.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className={`p-5 sm:p-6 border-t flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121314] border-white/10'
          }`}>
            <button
              onClick={cancelOrder}
              className={`text-xs font-medium cursor-pointer ${
                isLight ? 'text-rose-600 hover:text-rose-700' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Cancel Order (Demo)
            </button>
            <button
              onClick={() => setIsTrackingOpen(false)}
              className={`px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-900 hover:bg-black text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Dismiss / Back to App
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
