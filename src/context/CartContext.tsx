import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Order, OrderStatus, Restaurant } from '../types';
import { RESTAURANTS_DATA } from '../data/restaurantsData';

interface CartContextType {
  cart: CartItem[];
  cartRestaurantId: string | null;
  cartRestaurantName: string | null;
  addToCart: (item: CartItem) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  itemsCount: number;
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  appliedPromo: { code: string; discount: number; label: string } | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  finalTotal: number;
  
  // UI Triggers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  customizingDish: MenuItem | null;
  setCustomizingDish: (dish: MenuItem | null) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;

  // Order lifecycle
  activeOrder: Order | null;
  placeSimulatedOrder: (params: {
    address: string;
    unitOrRoom: string;
    instructions?: string;
    paymentMethod: 'mpesa' | 'card' | 'apple_pay' | 'cash';
    paymentLabel: string;
    phoneNumber?: string;
  }) => Promise<Order>;
  advanceOrderSimulation: () => void;
  cancelOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('nexg_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const [tipAmount, setTipAmount] = useState<number>(5.0);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('nexg_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('nexg_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('nexg_active_order');
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeOrder]);

  const cartRestaurantId = cart.length > 0 ? cart[0].restaurantId : null;
  const cartRestaurantName = cart.length > 0 ? cart[0].restaurantName : null;

  const addToCart = (rawItem: any) => {
    const newItem: CartItem = {
      id: rawItem.id || `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: rawItem.menuItemId || rawItem.id || `item-${Date.now()}`,
      restaurantId: rawItem.restaurantId || rawItem.merchantId || (cartRestaurantId || 'nexg-concierge'),
      restaurantName: rawItem.restaurantName || rawItem.merchantName || (cartRestaurantName || 'NEXG Concierge Partner'),
      name: rawItem.name,
      price: rawItem.price,
      image: rawItem.image || rawItem.imageUrl || '',
      quantity: rawItem.quantity || 1,
      selectedOptions: rawItem.selectedOptions || [],
      specialInstructions: rawItem.specialInstructions || '',
      itemTotal: rawItem.itemTotal || +(rawItem.price * (rawItem.quantity || 1)).toFixed(2),
    };

    setCart((prev) => {
      // If previous cart belongs to a completely different merchant/restaurant, ask or replace gracefully
      if (prev.length > 0 && prev[0].restaurantId !== newItem.restaurantId) {
        return [newItem];
      }

      // Check if identical item with identical options already exists
      const existingIdx = prev.findIndex(
        (it) =>
          it.menuItemId === newItem.menuItemId &&
          JSON.stringify(it.selectedOptions || []) === JSON.stringify(newItem.selectedOptions || []) &&
          (it.specialInstructions || '') === (newItem.specialInstructions || '')
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + newItem.quantity;
        const baseUnit = current.itemTotal / current.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          itemTotal: +(baseUnit * newQty).toFixed(2),
        };
        return updated;
      }

      return [...prev, newItem];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            const singleUnitPrice = item.itemTotal / item.quantity;
            return {
              ...item,
              quantity: nextQty,
              itemTotal: +(singleUnitPrice * nextQty).toFixed(2),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    try {
      localStorage.removeItem('nexg_cart');
    } catch {
      // ignore
    }
  };

  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = +cart.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2);

  // Delivery fee lookup from restaurant
  const matchedRest = RESTAURANTS_DATA.find((r) => r.id === cartRestaurantId);
  const deliveryFee = cart.length > 0 ? matchedRest?.deliveryFee ?? 4.99 : 0;
  const serviceFee = cart.length > 0 ? +(Math.max(1.75, subtotal * 0.05)).toFixed(2) : 0;

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NEXG20' || clean === 'WELCOME20') {
      const discountVal = +(subtotal * 0.2).toFixed(2);
      setAppliedPromo({ code: clean, discount: discountVal, label: '20% Welcome Concierge Discount' });
      return { success: true, message: `Applied! You saved $${discountVal.toFixed(2)}` };
    }
    if (clean === 'VIP10' || clean === 'CONCIERGE') {
      const discountVal = 10.0;
      setAppliedPromo({ code: clean, discount: discountVal, label: '$10 VIP Credit' });
      return { success: true, message: 'VIP Credit applied: -$10.00' };
    }
    return { success: false, message: 'Invalid promo code. Try "NEXG20" for 20% off.' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalTotal = +(Math.max(0, subtotal + deliveryFee + serviceFee + tipAmount - discountAmount)).toFixed(2);

  // Auto-progress simulated order every 18 seconds for lifelike tracking
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;

    const timer = setTimeout(() => {
      advanceOrderSimulation();
    }, 20000);

    return () => clearTimeout(timer);
  }, [activeOrder?.status]);

  const advanceOrderSimulation = () => {
    if (!activeOrder) return;
    const stages: OrderStatus[] = ['placed', 'preparing', 'courier_heading', 'out_for_delivery', 'delivered'];
    const currentIdx = stages.indexOf(activeOrder.status);
    if (currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      const updatedTimeline = activeOrder.timeline.map((step) => {
        if (step.key === nextStage) {
          return { ...step, completed: true, current: true, timestamp: 'Just now' };
        }
        if (stages.indexOf(step.key) < stages.indexOf(nextStage)) {
          return { ...step, completed: true, current: false };
        }
        return { ...step, completed: false, current: false };
      });

      const nextMinutes = nextStage === 'delivered' ? 0 : Math.max(0, activeOrder.estimatedMinutesLeft - 8);

      setActiveOrder({
        ...activeOrder,
        status: nextStage,
        estimatedMinutesLeft: nextMinutes,
        timeline: updatedTimeline,
        courier: {
          ...activeOrder.courier,
          lat: activeOrder.courier.lat + 0.003,
          lng: activeOrder.courier.lng - 0.002,
        },
      });
    }
  };

  const placeSimulatedOrder = async (params: {
    address: string;
    unitOrRoom: string;
    instructions?: string;
    paymentMethod: 'mpesa' | 'card' | 'apple_pay' | 'cash';
    paymentLabel: string;
    phoneNumber?: string;
  }): Promise<Order> => {
    const orderId = `NXG-${Math.floor(100000 + Math.random() * 900000)}`;
    const securityPin = `${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      restaurantId: cartRestaurantId || 'nobu-downtown',
      restaurantName: cartRestaurantName || 'NEXG Gourmet Partner',
      items: [...cart],
      subtotal,
      deliveryFee,
      serviceFee,
      tip: tipAmount,
      discount: discountAmount,
      total: finalTotal,
      status: 'placed',
      createdAt: formattedTime,
      estimatedDeliveryTime: `${30 - 5} - 35 min`,
      estimatedMinutesLeft: 32,
      deliveryAddress: params.address,
      unitOrRoom: params.unitOrRoom,
      deliveryInstructions: params.instructions,
      paymentMethod: params.paymentMethod,
      paymentDetails: {
        label: params.paymentLabel,
        accountMask: params.paymentMethod === 'mpesa' ? (params.phoneNumber || '254 7** ***') : '•••• 8492',
        transactionRef: `SIM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        isSimulated: true,
      },
      securityPin,
      courier: {
        name: 'Daniel Mwangi',
        phone: '+254 712 345 678',
        vehicle: 'Yamaha FZ • KDF 829X (Discreet thermal box)',
        rating: 4.96,
        deliveriesCount: 1840,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        lat: -1.286389,
        lng: 36.817223,
      },
      timeline: [
        {
          key: 'placed',
          title: 'Order Confirmed',
          description: 'Simulated payment approved. Kitchen received order ticket.',
          timestamp: formattedTime,
          completed: true,
          current: true,
        },
        {
          key: 'preparing',
          title: 'Kitchen Handcrafting Order',
          description: 'Executive chef is preparing your signature selections.',
          timestamp: 'In ~5 min',
          completed: false,
          current: false,
        },
        {
          key: 'courier_heading',
          title: 'Courier En Route to Restaurant',
          description: 'Dedicated concierge rider dispatched with climate pack.',
          timestamp: 'In ~15 min',
          completed: false,
          current: false,
        },
        {
          key: 'out_for_delivery',
          title: 'Out for Discreet Delivery',
          description: 'Rider is en route to your suite/villa location.',
          timestamp: 'In ~25 min',
          completed: false,
          current: false,
        },
        {
          key: 'delivered',
          title: 'Delivered',
          description: 'Handed over directly with security verification PIN.',
          timestamp: 'Estimated 35 min',
          completed: false,
          current: false,
        },
      ],
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsTrackingOpen(true);

    return newOrder;
  };

  const cancelOrder = () => {
    setActiveOrder(null);
    setIsTrackingOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartRestaurantId,
        cartRestaurantName,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemsCount,
        cartCount: itemsCount,
        subtotal,
        deliveryFee,
        serviceFee,
        tipAmount,
        setTipAmount,
        appliedPromo,
        applyPromo,
        removePromo,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        customizingDish,
        setCustomizingDish,
        selectedRestaurant,
        setSelectedRestaurant,
        activeOrder,
        placeSimulatedOrder,
        advanceOrderSimulation,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
