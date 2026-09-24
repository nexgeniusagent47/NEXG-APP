import type { ApiItem, ApiMerchant } from './apiClient';
import type { CatalogMerchant, DynamicItem } from '../data/categoryCatalog21';

function workflowType(value: string): CatalogMerchant['workflowType'] {
  const normalized = value.toLowerCase();
  if (normalized.includes('quote') || normalized.includes('request')) return 'quote';
  if (['booking', 'appointment', 'ticket', 'rental', 'subscription'].some((part) => normalized.includes(part))) {
    return 'book';
  }
  return 'order';
}

export function toDynamicItem(item: ApiItem, deliveryTime = ''): DynamicItem {
  const mode = workflowType(item.commerceMode);
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    discount: item.originalPrice && item.originalPrice > item.price
      ? `KSh ${item.originalPrice - item.price} off`
      : undefined,
    deliveryTime,
    rating: 0,
    reviewCount: 0,
    image: item.image,
    workflowType: mode,
    subcategory: item.subcategory,
    description: item.description,
    dynamicAttributes: {},
  };
}

export function toCatalogMerchant(merchant: ApiMerchant): CatalogMerchant {
  return {
    id: merchant.id,
    categoryId: merchant.categoryId,
    subcategoryId: merchant.subcategoryId,
    subcategoryName: merchant.subcategory,
    name: merchant.name,
    cuisineOrType: merchant.subcategory || merchant.category,
    rating: merchant.rating,
    ratingCount: merchant.ratingCount,
    deliveryTime: merchant.deliveryTime,
    deliveryFee: merchant.deliveryFee,
    minOrder: 0,
    heroImage: merchant.heroImage,
    avatarImage: merchant.logoUrl || merchant.heroImage,
    badges: merchant.badges,
    workflowType: workflowType(merchant.workflow),
    address: merchant.address,
    items: merchant.items.map((item) => ({
      ...toDynamicItem(item, merchant.deliveryTime),
      rating: merchant.rating,
      reviewCount: merchant.ratingCount,
    })),
    specialty: merchant.workflow,
  };
}

export function toCatalogMerchantForItem(item: ApiItem): CatalogMerchant {
  const merchant: ApiMerchant = {
    id: item.merchantId,
    name: item.merchantName,
    slug: item.merchantId,
    category: item.category,
    categoryId: item.categoryId,
    subcategory: item.subcategory,
    nairobiArea: '',
    address: '',
    workflow: item.commerceMode,
    rating: 0,
    ratingCount: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    deliveryTime: '',
    deliveryFee: 0,
    priceLevel: 0,
    heroImage: item.image,
    logoUrl: '',
    badges: [],
    isOpen: true,
    items: [item],
  };
  return toCatalogMerchant(merchant);
}
