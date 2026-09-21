// src/data/catalogData.ts
// Single typed interface accessing the seeded Excel catalog

import catalogJson from './seededCatalog.json';
import { NexGMerchant, NexGCatalogItem } from '../types/nexg';

export interface SeededCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    workflow?: string;
  }[];
  image_url: string;
  description?: string;
}

export const SEEDED_CATEGORIES: SeededCategory[] = (catalogJson.categories as any) || [];

export const SEEDED_MERCHANTS: NexGMerchant[] = ((catalogJson.merchants as any) || []).map(
  (m: any) => ({
    ...m,
    items: (m.items || []).map((it: any) => ({
      ...it,
      currency: 'KSh',
      commerceMode: it.commerceMode || 'instant_purchase',
    })),
  })
);

export const CATALOG_SUMMARY = catalogJson.summary;

export function getMerchantsByCategory(categoryId: string): NexGMerchant[] {
  const cat = categoryId.toLowerCase();
  return SEEDED_MERCHANTS.filter(
    (m) => m.categoryId.toLowerCase() === cat || m.category.toLowerCase() === cat
  );
}

export function getMerchantById(merchantId: string): NexGMerchant | undefined {
  return SEEDED_MERCHANTS.find((m) => m.id === merchantId || m.slug === merchantId);
}

export function searchMerchantsAndItems(query: string): {
  merchants: NexGMerchant[];
  items: NexGCatalogItem[];
} {
  const q = query.toLowerCase().trim();
  if (!q) return { merchants: [], items: [] };

  const matchedMerchants = SEEDED_MERCHANTS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.subcategory.toLowerCase().includes(q) ||
      m.nairobiArea.toLowerCase().includes(q)
  );

  const matchedItems = SEEDED_MERCHANTS.flatMap((m) => m.items || []).filter(
    (it) =>
      it.name.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      it.subcategory.toLowerCase().includes(q)
  );

  return {
    merchants: matchedMerchants.slice(0, 20),
    items: matchedItems.slice(0, 20),
  };
}
