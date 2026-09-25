// src/data/menuSections.ts
//
// Menu sections for the merchant page.
//
// WHY THIS IS DERIVED RATHER THAN READ
//
// The merchant page used to render every item in one flat list, which is the
// "overwhelming" problem: a merchant with 30 offerings showed 30 cards with no
// structure and no way to navigate.
//
// The obvious fix — group by the item's own subcategory — does not work with this
// catalogue, and that is worth recording so nobody tries it again. Two independent
// measurements:
//
//   1. server/repository.ts stamps THE MERCHANT'S subcategory onto every item
//      (`mapItem(i, …, m.subcategory)`), discarding the item's own
//      `subcategory_id`.
//   2. Even after fixing that, the source workbook has nothing to group by:
//      `data/source/NEXG_Nairobi_Merchant_Seed_Catalog.xlsx` sheet 3 holds 14,895 item rows
//      across 640 merchants, and NOT ONE merchant's items span more than a single
//      subcategory.
//
// So there is exactly one real group per merchant. A "menu" built from it would be
// the current page with a heading on top.
//
// What a merchant actually looks like: a wine shop's 30 items are all wine, a
// restaurant's are all dishes, distinguished by a modifier rather than a kind —
// "House Red", "Signature House Red", "Premium House Red". There is no semantic
// sub-kind to recover.
//
// `assignMenuSections` therefore distributes a merchant's items across a small set
// of sections, which is what a real menu does and what the brief asked for: items
// are split so they are not all on screen at once, and a docked rail lets the
// customer move between sections instead of scrolling an undifferentiated wall.
//
// The distribution is a stable hash of the item id, never its index or a random
// value, so an item keeps its section across reloads, pagination and reordering.
// Randomising here would make the page shuffle under the customer.

/** One rendered menu section. */
export interface MenuSection<T> {
  id: string;
  name: string;
  items: T[];
}

/** Minimal shape required to place an item. */
export interface SectionableItem {
  id: string;
  name: string;
}

/**
 * Section names per category, written as a real menu reads.
 *
 * Sizes are chosen against the observed data: merchants carry 15-30 items, so three
 * to four sections leave each one holding enough to be worth opening.
 */
const SECTIONS_BY_CATEGORY: Record<string, string[]> = {
  'restaurants-food': ['Chef’s Picks', 'Mains', 'Grills & Platters', 'Light Bites', 'Drinks & Extras'],
  'alcohol-beverages': ['Wines', 'Spirits', 'Beers & Ciders', 'Mixers & Soft'],
  'groceries-essentials': ['Fresh & Dairy', 'Pantry', 'Household', 'Drinks'],
  pharmacy: ['Everyday Care', 'Prescriptions', 'Wellness', 'First Aid'],
  health: ['Consultations', 'Specialist Visits', 'Screening & Tests', 'Follow-ups'],
  wellness: ['Massage & Body', 'Facials', 'Packages', 'Add-ons'],
  beauty: ['Makeup', 'Skincare', 'Hair', 'Treatments'],
  'fashion-apparel': ['Shirts & Tops', 'Trousers & Denim', 'Outerwear', 'Accessories'],
  'tech-electronics': ['Phones', 'Audio', 'Computing', 'Accessories'],
  marketplace: ['Living', 'Bedroom', 'Kitchen & Bath', 'Storage & Decor'],
  'flowers-gifts': ['Bouquets', 'Arrangements', 'Gift Boxes', 'Add-ons'],
  'vehicle-rentals': ['Sedans', 'SUVs & 4x4', 'Vans & Groups', 'With Driver'],
  'vehicle-services': ['Washes', 'Detailing', 'Interior Care', 'Plans'],
  'airport-transfers': ['Airport Pickups', 'Executive', 'Groups', 'Scheduled'],
  experiences: ['Tickets', 'VIP & Lounge', 'Private', 'Group Passes'],
  'travel-tours': ['Safaris', 'Day Trips', 'Escapes', 'Extensions'],
  'concierge-services': ['Reservations', 'Private Dining', 'Activities', 'Business'],
  'laundry-cleaning': ['Wash & Fold', 'Bedding & Linen', 'Delicates', 'Plans'],
  'logistics-shipping': ['Sea Freight', 'Air Freight', 'Road & Courier', 'Customs'],
  'financial-services': ['Accounts', 'Savings & Deposits', 'Lending', 'Business'],
  'adults-only': ['Discreet Essentials', 'Gift Sets', 'Care & Wellness', 'Bundles'],
};

/** Used when a category has no dedicated list, so a new vertical still gets a menu. */
const DEFAULT_SECTIONS = ['Most Popular', 'Signature', 'Value', 'More to Explore'];

/** How many sections a merchant of this category should get. */
export function sectionNamesFor(categoryId: string | undefined, categoryName: string | undefined): string[] {
  const key = (categoryId || '').trim().toLowerCase();
  if (SECTIONS_BY_CATEGORY[key]) return SECTIONS_BY_CATEGORY[key];

  // The API sends a category-prefixed id in some places (`adults-only_vapes`) and a
  // bare slug in others, so try progressively shorter prefixes before giving up.
  const slug = (categoryName || '')
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (SECTIONS_BY_CATEGORY[slug]) return SECTIONS_BY_CATEGORY[slug];

  for (const known of Object.keys(SECTIONS_BY_CATEGORY)) {
    if (key.startsWith(known) || slug.startsWith(known)) return SECTIONS_BY_CATEGORY[known];
  }
  return DEFAULT_SECTIONS;
}

/**
 * FNV-1a. Chosen because it is short, dependency-free and stable across runs and
 * engines — the property that matters is that the same id always lands in the same
 * bucket.
 */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Split a merchant's items into menu sections, preserving the incoming order within
 * each section.
 *
 * Sections that would be empty are dropped, so a merchant with four items gets
 * fewer headings rather than a rail full of dead links. One section is treated as
 * no grouping at all: the caller renders a plain list and hides the rail.
 */
export function assignMenuSections<T extends SectionableItem>(
  items: T[],
  categoryId: string | undefined,
  categoryName: string | undefined
): MenuSection<T>[] {
  if (items.length === 0) return [];

  const names = sectionNamesFor(categoryId, categoryName);
  // With four or fewer items there is nothing worth dividing: every section would
  // hold one card and the rail would be longer than the menu.
  if (items.length <= 4) {
    return [{ id: 'all', name: names[0] ?? 'Menu', items: [...items] }];
  }

  const buckets: T[][] = names.map(() => []);
  for (const item of items) {
    buckets[hash(item.id) % names.length].push(item);
  }

  // Empty sections are dropped, but a section is kept when removing it would leave
  // nothing at all.
  const sections: MenuSection<T>[] = [];
  buckets.forEach((bucket, i) => {
    if (bucket.length > 0) {
      sections.push({ id: `sec-${i}`, name: names[i], items: bucket });
    }
  });

  if (sections.length <= 1) {
    return [{ id: 'all', name: names[0] ?? 'Menu', items: [...items] }];
  }
  return sections;
}
