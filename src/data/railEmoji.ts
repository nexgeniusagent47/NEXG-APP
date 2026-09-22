// src/data/railEmoji.ts
//
// Emoji for the category and subcategory rails.
//
// WHY THIS FILE EXISTS
// The catalogue looked like it already carried what the rails needed — every category has
// an `icon_name` and every subcategory has an `image_url`. Measured, both are empty of
// meaning: all 21 categories return `icon_name: "Sparkles"`, the same generic icon, and
// subcategory `image_url` is an empty string. So the rails rendered as plain text pills
// with nothing to show, which is why they do not read like the reference product.
//
// Emoji rather than images here, deliberately:
//   - they are already in the system font, so they cost nothing to load and cannot 404
//   - a rail is scanned, not studied; a recognisable glyph beats a 40px thumbnail at this
//     size for the same reason a flag beats a map
//   - they scale with font-size, so the rail adapts to any screen without a second asset
//     ladder — which matters on the 320-430px phones this has to work on
//
// Where a subcategory has no entry the rail falls back to the parent category's emoji
// rather than showing nothing, so no chip is ever blank.

/** Keyed by the ids the API actually returns. */
const CATEGORY_EMOJI: Record<string, string> = {
  'restaurants-food': '🍽️',
  'alcohol-beverages': '🍷',
  'groceries-essentials': '🛒',
  marketplace: '🏬',
  wellness: '💆',
  beauty: '💅',
  health: '🩺',
  pharmacy: '💊',
  'adults-only': '🔞',
  experiences: '🎟️',
  'travel-tours': '🧭',
  'airport-transfers': '✈️',
  'vehicle-rentals': '🚘',
  'vehicle-services': '🔧',
  'logistics-shipping': '📦',
  'laundry-cleaning': '🧺',
  'fashion-apparel': '👗',
  'tech-electronics': '💻',
  'flowers-gifts': '💐',
  'financial-services': '🏦',
  'concierge-services': '🛎️',
};

/**
 * Subcategories, matched on lowercased name because their ids are generated
 * (`adults-only_adult-accessories`) and would be brittle to key on.
 */
const SUBCATEGORY_EMOJI: Record<string, string> = {
  restaurants: '🍴', 'fine dining': '🍷', 'fast food': '🍔', cafes: '☕',
  'coffee & tea': '☕', bakery: '🥐', desserts: '🍰', 'street food': '🌮',
  'food delivery': '🛵', catering: '🍱', 'late night': '🌙', buffets: '🍲',
  'adult accessories': '🔞', 'adult wellness': '💆', 'private entertainment': '🎭',
  spa: '💆', massage: '💆', fitness: '🏋️', yoga: '🧘', 'hair salon': '💇',
  barber: '💈', nails: '💅', 'skin care': '🧴', sauna: '🧖',
  wines: '🍷', spirits: '🥃', beers: '🍺', champagne: '🍾', 'soft drinks': '🥤',
  groceries: '🛒', 'fresh produce': '🥬', butcher: '🥩', 'fish & seafood': '🐟',
  'dairy & eggs': '🥚', 'pantry staples': '🥫', 'snacks & sweets': '🍫',
  appliances: '🔌', furniture: '🛋️', 'home decor': '🖼️', 'kitchenware': '🍳',
  'cleaning supplies': '🧽', electronics: '📱', 'phone accessories': '🔌',
  'computers & laptops': '💻', 'audio & headphones': '🎧', gaming: '🎮',
  fashion: '👗', 'menswear': '👔', 'womenswear': '👚', shoes: '👟',
  'bags & accessories': '👜', jewellery: '💎', watches: '⌚', 'kids fashion': '🧒',
  flowers: '💐', gifts: '🎁', hampers: '🧺', 'gift cards': '💳',
  'pharmacy essentials': '💊', 'prescription': '📋', 'baby care': '🍼',
  'personal care': '🧼', 'first aid': '🩹', 'health supplements': '💊',
  'general consultation': '🩺', dental: '🦷', optical: '👓', physiotherapy: '🦴',
  'lab tests': '🧪', 'home nursing': '🏠',
  laundry: '🧺', 'dry cleaning': '👔', 'ironing': '🧷', 'home cleaning': '🧹',
  'office cleaning': '🏢', 'pest control': '🐜', 'car wash': '🚿',
  'car repair': '🔧', 'car detailing': '✨', 'tyres & batteries': '🛞',
  'car hire': '🚗', 'chauffeur service': '🧑‍✈️', 'bike rental': '🏍️',
  'airport pickup': '🛬', 'city transfers': '🚕', 'intercity': '🚌',
  courier: '📦', 'same day': '⚡', freight: '🚚', 'packaging services': '📮',
  safaris: '🦁', 'city tours': '🏙️', 'events': '🎪', 'concerts': '🎤',
  'adventure': '🧗', 'cultural experiences': '🎭', 'water sports': '🏄',
  'banking': '🏦', 'insurance': '🛡️', 'forex': '💱', 'mobile money': '📲',
  'personal assistant': '🛎️', 'errand running': '🏃', 'ticketing': '🎫',
  'translation services': '🗣️', 'notary & legal': '⚖️',
  'luxury travel': '🌍', 'visa services': '🛂', 'hotel bookings': '🏨',
  'flight booking': '✈️', 'holiday packages': '🏖️',
};

/**
 * Resolve an emoji for a category id, then a subcategory name, then anything.
 * Returns undefined only when both lookups miss, so callers can fall back deliberately
 * rather than rendering an empty box.
 */
export function emojiFor(categoryId?: string | null, subcategoryName?: string | null): string | undefined {
  if (subcategoryName) {
    const key = subcategoryName.trim().toLowerCase();
    if (SUBCATEGORY_EMOJI[key]) return SUBCATEGORY_EMOJI[key];
    // Partial match: "Fine Dining & Grill" should still find "fine dining".
    for (const [k, v] of Object.entries(SUBCATEGORY_EMOJI)) {
      if (key.includes(k)) return v;
    }
  }
  if (categoryId && CATEGORY_EMOJI[categoryId]) return CATEGORY_EMOJI[categoryId];
  return undefined;
}

/** The parent's emoji, used as the fallback so a chip is never blank. */
export function categoryEmoji(categoryId?: string | null): string | undefined {
  return categoryId ? CATEGORY_EMOJI[categoryId] : undefined;
}
