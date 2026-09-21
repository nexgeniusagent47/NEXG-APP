// src/types/nexg.ts
// Single source of truth for NEXG Component Registry, Commerce Modes, Entities & Experience Engine

export type CommerceMode =
  | 'instant_purchase'
  | 'configured_purchase'
  | 'booking'
  | 'appointment'
  | 'request'
  | 'quote'
  | 'ticket'
  | 'rental'
  | 'subscription'
  | 'delivery';

export type ExperienceType = 'build' | 'plan' | 'coordinate' | 'personalize';

export type MerchantCardVariant =
  | 'default'
  | 'compact'
  | 'featured'
  | 'horizontal'
  | 'large'
  | 'search-result'
  | 'category-result';

export type ItemCardVariant =
  | 'grid'
  | 'horizontal'
  | 'compact'
  | 'featured'
  | 'merchant-menu'
  | 'category-result'
  | 'search-result'
  | 'recommended';

export type HeaderVariant =
  | 'default'
  | 'search-active'
  | 'merchant'
  | 'checkout'
  | 'booking'
  | 'minimal';

export type ItemSheetSource = 'discovery' | 'merchant' | 'search' | 'experience';

export type ItemSheetState =
  | 'CLOSED'
  | 'OPEN'
  | 'FOCUSED'
  | 'CONFIGURING'
  | 'READY'
  | 'ACTION_PENDING'
  | 'SUCCESS'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface OptionChoice {
  id: string;
  name: string;
  priceDelta?: number;
  isDefault?: boolean;
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  selection: 'single' | 'multiple';
  minSelections?: number;
  maxSelections?: number;
  choices: OptionChoice[];
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface AddOnGroup {
  id: string;
  name: string;
  items: AddOnItem[];
}

export interface NexGCatalogItem {
  id: string;
  merchantId: string;
  merchantName: string;
  category: string;
  categoryId: string;
  subcategory: string;
  name: string;
  price: number;
  priceMin?: number;
  priceMax?: number;
  priceHint?: string;
  originalPrice?: number;
  currency: string;
  image: string;
  imageBrief?: string;
  workflowModel?: string;
  commerceMode: CommerceMode;
  description: string;
  rating?: number;
  reviewCount?: number;
  options?: OptionGroup[];
  addOns?: AddOnGroup[];
  capabilities?: string[];
  duration?: string;
  location?: string;
}

export interface NexGMerchant {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  subcategory: string;
  subcategoryId?: string;
  nairobiArea: string;
  address: string;
  brandArchetype?: string;
  brandPalette?: string;
  logoDirection?: string;
  photoDirection?: string;
  workflow: string;
  rating: number;
  ratingCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTime: string;
  deliveryFee: number;
  priceLevel: number;
  heroImage: string;
  logoUrl: string;
  badges: string[];
  isOpen: boolean;
  items: NexGCatalogItem[];
  specialOffer?: string;
}

export interface ExperienceStep {
  stepNumber: number;
  stepName: string;
  category: string;
  categoryId: string;
  iconName: string;
  description: string;
  defaultTime?: string;
}

export interface NexGExperience {
  id: string;
  name: string;
  tagline: string;
  type: ExperienceType;
  version: string;
  occasions: string[];
  heroImage: string;
  estimatedBudget: number;
  estimatedDuration: string;
  steps: ExperienceStep[];
  vibeTags: string[];
  suggestedAreas: string[];
}
