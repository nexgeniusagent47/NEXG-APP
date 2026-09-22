export interface MenuItemOptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect?: number;
  choices: MenuItemOptionChoice[];
}

export interface DishUserReview {
  id: string;
  dishId: string;
  authorName: string;
  authorRoom?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedDiner: boolean;
  tags?: string[];
  helpfulCount?: number;
}

export interface GoogleReview {
  id: string;
  authorName?: string;
  author?: string;
  authorPhoto?: string;
  avatar?: string;
  rating: number;
  relativeTimeDescription?: string;
  relativeTime?: string;
  text: string;
  isLocalGuide?: boolean;
  localGuideLevel?: number;
  reviewCount?: number;
  helpfulVotes?: number;
  likes?: number;
  verifiedGoogleDiner?: boolean;
  aspects?: {
    food?: number;
    service?: number;
    atmosphere?: number;
  };
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'popular' | 'starters' | 'mains' | 'desserts' | 'beverages';
  dietary?: ('vegetarian' | 'vegan' | 'gluten_free' | 'halal' | 'chef_special')[];
  rating?: number;
  reviewsCount?: number;
  userReviews?: DishUserReview[];
  calories?: number;
  prepTimeMinutes?: number;
  optionGroups?: MenuItemOptionGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  googleRating?: number;
  googleReviewsCount?: number;
  googleAspects?: {
    food: number;
    service: number;
    atmosphere: number;
  };
  googleReviews?: GoogleReview[];
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  heroImage: string;
  logoImage?: string;
  priceTier: '$' | '$$' | '$$$' | '$$$$';
  featured?: boolean;
  distanceKm: number;
  address: string;
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  menu: MenuItem[];
}

export interface CartSelectedOption {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedOptions: CartSelectedOption[];
  specialInstructions?: string;
  itemTotal: number;
}

/**
 * What a caller must supply to `addToCart`.
 *
 * Only `name` and `price` are genuinely required: the context derives an id, the
 * merchant lineage, the image, the option list and the line total, each with a
 * fallback. `quantity` defaults to 1.
 *
 * This type exists because the old signature demanded a complete `CartItem`, which
 * was both untrue — the implementation is deliberately tolerant — and actively
 * harmful. It forced callers into `as any`, and under `as any` two live bugs hid for
 * free: the merchant pages called a function that did not exist, and the modal's
 * `title`/`totalPrice` were read as `name`/`price`, so every cart line arrived blank
 * and the totals came out NaN. A type that describes what the code actually accepts
 * is what makes those mistakes visible.
 */
export type CartItemInput = Partial<Omit<CartItem, 'name' | 'price'>> &
  Pick<CartItem, 'name' | 'price'> & {
    // Aliases the cart accepts and normalises. They are declared rather than reached
    // through an index signature or a cast because they are a real part of the
    // contract: `UnifiedItemModal` emits both namings deliberately so a single payload
    // can feed the cart and the booking flow, and the legacy NEXG screens send
    // `merchantName`/`category`. Naming them means TypeScript checks the call sites.
    merchantId?: string;
    merchantName?: string;
    imageUrl?: string;
    /** Descriptive alias for `name`; the modal sends both. */
    title?: string;
    /** Gross line total before normalisation. */
    totalPrice?: number;
    /** Free-form product grouping, kept for display. */
    category?: string;
    /** Chosen add-ons, recorded alongside `selectedOptions`. */
    selectedAddons?: string[];
  };

export type OrderStatus = 'placed' | 'preparing' | 'courier_heading' | 'out_for_delivery' | 'delivered';

export interface OrderTimelineStep {
  key: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  estimatedMinutesLeft: number;
  deliveryAddress: string;
  unitOrRoom: string;
  deliveryInstructions?: string;
  paymentMethod: 'mpesa' | 'card' | 'apple_pay' | 'cash';
  paymentDetails: {
    label: string;
    accountMask: string;
    transactionRef: string;
    isSimulated: true;
  };
  securityPin: string;
  courier: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    deliveriesCount: number;
    photoUrl: string;
    lat: number;
    lng: number;
  };
  timeline: OrderTimelineStep[];
}

// Spa & Wellness (District by Zomato Workflow)
export type SpaServiceDuration = 30 | 45 | 60 | 75 | 90 | 105 | 120;
export type SpaLocationType = 'in_villa' | 'sanctuary_pavilion';

export interface SpaTreatmentAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface SpaTreatment {
  id: string;
  spaId: string;
  title: string;
  tagline: string;
  category: 'massages' | 'facials' | 'ayurvedic' | 'couples' | 'holistic';
  description: string;
  image: string;
  durations: {
    duration: SpaServiceDuration;
    price: number;
  }[];
  rating: number;
  reviewsCount: number;
  inVillaAvailable: boolean;
  availableOils: string[];
  addOns: SpaTreatmentAddOn[];
}

export interface SpaVenue {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  googleRating?: number;
  googleReviewsCount?: number;
  googleAspects?: {
    food: number;
    service: number;
    atmosphere: number;
  };
  googleReviews?: GoogleReview[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  image: string;
  location: string;
  distanceKm: number;
  operatingHours: string;
  treatments: SpaTreatment[];
}

export type SpaBookingStatus = 'confirmed' | 'preparing_oils' | 'therapist_en_route' | 'in_session' | 'completed';

export interface SpaBooking {
  id: string;
  treatmentId: string;
  treatmentTitle: string;
  spaName: string;
  duration: SpaServiceDuration;
  price: number;
  locationType: SpaLocationType;
  date: string;
  timeSlot: string;
  therapistGender: 'female' | 'male' | 'no_preference';
  pressureLevel: 'gentle' | 'medium' | 'firm' | 'sports';
  selectedOil: string;
  selectedAddOns: SpaTreatmentAddOn[];
  guestName: string;
  roomOrVilla: string;
  specialNotes?: string;
  totalPrice: number;
  status: SpaBookingStatus;
  therapist?: {
    name: string;
    photoUrl: string;
    rating: number;
    yearsExperience: number;
    phone: string;
  };
  createdAt: string;
}

// VIP Transport & Chauffeur Mobility
export interface TransportVehicle {
  id: string;
  providerId?: string;
  name: string;
  category: 'luxury_sedan' | 'suv' | 'limousine' | 'helicopter' | 'supercar';
  image: string;
  passengers: number;
  luggage: number;
  pricePerHour: number;
  priceAirportTransfer: number;
  features: string[];
  driverRating: number;
}

export interface TransportProvider {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  googleRating: number;
  googleReviewsCount: number;
  googleReviews?: GoogleReview[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  image: string;
  fleetCount: number;
  serviceAreas: string;
  vehicles: TransportVehicle[];
}

export interface CellarItem {
  id: string;
  purveyorId: string;
  name: string;
  vintage?: string;
  region?: string;
  category: 'champagne' | 'wine' | 'caviar' | 'fromagerie' | 'pantry';
  price: number;
  image: string;
  description: string;
  temperaturePreference?: 'cellar_cold' | 'ice_chilled' | 'room_temp';
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface CellarPurveyor {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  googleRating: number;
  googleReviewsCount: number;
  googleReviews?: GoogleReview[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  image: string;
  coldDeliverySpeed: string;
  deliveryTime?: string;
  origin: string;
  items: CellarItem[];
}

export interface ExperienceItem {
  id: string;
  outfitterId: string;
  title: string;
  tagline: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  capacity: string;
  included: string[];
  rating: number;
  reviewsCount: number;
}

export interface ExperienceOutfitter {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  googleRating: number;
  googleReviewsCount: number;
  googleReviews?: GoogleReview[];
  socials?: {
    instagram?: string;
    googleMaps?: string;
    website?: string;
    phone?: string;
  };
  image: string;
  location: string;
  guideLanguages: string[];
  experiences: ExperienceItem[];
}

export interface TransportBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  serviceType: 'airport_transfer' | 'hourly_chauffeur' | 'point_to_point';
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  hours?: number;
  flightNumber?: string;
  amenities: string[];
  guestName: string;
  roomOrVilla: string;
  totalPrice: number;
  status: 'confirmed' | 'assigned' | 'en_route' | 'arrived' | 'in_trip' | 'completed';
  driver?: {
    name: string;
    phone: string;
    vehiclePlate: string;
    rating: number;
    photoUrl: string;
  };
  createdAt: string;
}

