// src/lib/adapters.ts
//
// Converts API payloads into the frontend's existing view models.
//
// The API returns a deliberately lean shape (`ApiMerchant`) while the legacy
// components (MerchantPage, MerchantCard, the item sheet) consume `NexGMerchant`.
// Rather than rewrite those components, we adapt at the boundary. This keeps the
// API honest about its own shape and keeps the view models stable.
//
// `commerceMode` is derived from the merchant's commerce arc rather than being
// invented per item, so an item's mode can never disagree with its merchant's
// workflow.

import type { ApiItem, ApiMerchant } from './apiClient';
import type { NexGCatalogItem, NexGMerchant, CommerceMode } from '../types/nexg';
import { resolveIntent } from '../data/workflowEngine';

/** Map an arc onto the item-level commerce mode the UI understands. */
function commerceModeForArc(arcId: string): CommerceMode {
  switch (arcId) {
    case 'book_slot':
      return 'booking';
    case 'request_service':
      return 'request';
    case 'compliance_appointment':
      return 'appointment';
    case 'get_quote':
      return 'quote';
    case 'browse_buy':
    default:
      return 'instant_purchase';
  }
}

export function adaptItem(
  item: ApiItem,
  merchant: Pick<ApiMerchant, 'id' | 'name' | 'category' | 'categoryId'>,
  commerceMode: CommerceMode
): NexGCatalogItem {
  return {
    id: item.id,
    merchantId: item.merchantId || merchant.id,
    merchantName: merchant.name,
    category: item.category || merchant.category,
    categoryId: item.categoryId || merchant.categoryId,
    subcategory: item.subcategory,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    currency: item.currency || 'KSh',
    image: item.image,
    commerceMode,
    description: item.description,
    rating: undefined,
    reviewCount: undefined,
  };
}

export function adaptMerchant(merchant: ApiMerchant): NexGMerchant {
  const intent = resolveIntent(merchant);
  const commerceMode = commerceModeForArc(intent.arc.id);

  return {
    id: merchant.id,
    name: merchant.name,
    slug: merchant.slug,
    category: merchant.category,
    categoryId: merchant.categoryId,
    subcategory: merchant.subcategory,
    subcategoryId: merchant.subcategoryId,
    nairobiArea: merchant.nairobiArea,
    address: merchant.address,
    brandArchetype: merchant.brandArchetype,
    brandPalette: merchant.brandPalette,
    workflow: merchant.workflow,
    rating: merchant.rating,
    ratingCount: merchant.ratingCount,
    deliveryTimeMin: merchant.deliveryTimeMin,
    deliveryTimeMax: merchant.deliveryTimeMax,
    deliveryTime: merchant.deliveryTime,
    deliveryFee: merchant.deliveryFee,
    priceLevel: merchant.priceLevel,
    heroImage: merchant.heroImage,
    logoUrl: merchant.logoUrl,
    badges: merchant.badges ?? [],
    isOpen: merchant.isOpen,
    specialOffer: merchant.specialOffer,
    items: (merchant.items ?? []).map((item) => adaptItem(item, merchant, commerceMode)),
  };
}
