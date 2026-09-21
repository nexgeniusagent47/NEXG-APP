// src/data/categoryCatalog21.ts
// Single source of truth for the 21 strict categories and 134 subcategories,
// each equipped with its own relatable image and NEXG presentation.

import { CATALOG, Category, Subcategory } from './merchantCatalog';

export interface DynamicItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  deliveryTime: string;
  rating: number;
  reviewCount: number;
  image: string;
  quantity?: string;
  workflowType: 'order' | 'book' | 'quote';
  subcategory: string;
  description: string;
  dynamicAttributes: Record<string, string>;
}

export interface CatalogMerchant {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  subcategoryName?: string;
  name: string;
  cuisineOrType: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  heroImage: string;
  avatarImage: string;
  badges: string[];
  workflowType: 'order' | 'book' | 'quote';
  address: string;
  items: DynamicItem[];
  progressiveHighlights?: string[];
  specialty?: string;
}

export interface CatalogSubcategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  fulfillment_hint?: string;
  workflow_hint?: string;
  fields?: string[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  bannerImage: string;
  subcategories: CatalogSubcategory[];
  defaultWorkflow: 'order' | 'book' | 'quote';
  color?: string;
  bg?: string;
}

// Curated high-resolution relatable imagery for all 134 subcategories
export const SUBCATEGORY_IMAGES: Record<string, string> = {
  // adults_only
  adult_products: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
  adult_wellness: 'https://images.unsplash.com/photo-1608248597359-00913a401ce5?auto=format&fit=crop&w=400&q=80',
  cigarettes: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
  cigars: 'https://images.unsplash.com/photo-1528659546059-ff1656041300?auto=format&fit=crop&w=400&q=80',
  vapes: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
  adult_accessories: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',

  // airport_transfers
  airport_pickup: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80',
  airport_dropoff: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80',
  meet_greet: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80',
  executive_transfer: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80',

  // alcohol_beverages
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
  spirits: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
  beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80',
  champagne: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=400&q=80',
  cocktail_mixers: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
  liquor_stores: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=400&q=80',

  // fashion_apparel
  mens_fashion: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
  womens_fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
  kids_fashion: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80',
  shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
  bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
  watches: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
  accessories: 'https://images.unsplash.com/photo-1611591475839-72a784e138c7?auto=format&fit=crop&w=400&q=80',

  // beauty
  makeup: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  skincare: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  haircare: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=400&q=80',
  fragrances: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
  cosmetics_stores: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',

  // vehicle_rentals
  car_rental: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
  self_drive: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80',
  corporate_rental: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80',
  long_term_rental: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
  bike_rental: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80',

  // experiences
  concerts: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
  festivals: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
  conferences: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80',
  private_events: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80',
  photography: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
  workshops: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
  classes: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80',
  sports_activities: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
  recreation: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',

  // financial_services
  banking: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
  forex: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=400&q=80',
  insurance: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
  payments: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80',
  remittance: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
  sacco_services: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80',
  business_services: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',

  // flowers_gifts
  flowers: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80',
  gift_hampers: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
  cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
  chocolates: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=400&q=80',
  personalized_gifts: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80',
  occasion_gifts: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=400&q=80',

  // restaurants_food
  restaurant: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  fast_food: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
  juice_bar: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
  cloud_kitchen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
  catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80',

  // groceries_essentials
  supermarket: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
  convenience_store: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80',
  fresh_produce: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
  butchery: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
  seafood: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80',
  organic_store: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',

  // laundry_cleaning
  laundry: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80',
  dry_cleaning: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80',
  ironing: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=400&q=80',
  home_cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
  office_cleaning: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',

  // marketplace
  home_living: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
  furniture: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
  appliances: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
  decor: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  kitchenware: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=400&q=80',
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  stationery: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=400&q=80',
  office_supplies: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
  general_retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',

  // pharmacy
  pharmacy_retail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  medical_supplies: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80',
  baby_products: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
  supplements: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=400&q=80',

  // health
  clinics: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
  telemedicine: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
  labs: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
  mental_health: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  coaching: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',

  // tech_electronics
  smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  tech_accessories: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  computers: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  gaming: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80',
  audio: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
  telecom_services: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
  smart_devices: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80',

  // travel_tours
  safaris: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80',
  game_drives: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=400&q=80',
  luxury_safaris: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=400&q=80',
  city_tours: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80',
  cultural_tours: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=400&q=80',
  adventure_tours: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
  travel_packages: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80',

  // vehicle_services
  car_wash: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=400&q=80',
  tire_service: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=400&q=80',
  battery_service: 'https://images.unsplash.com/photo-1558441719-74d309224424?auto=format&fit=crop&w=400&q=80',
  vehicle_assistance: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
  vehicle_inspection: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',

  // wellness
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
  massage: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&q=80',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
  personal_training: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80',

  // concierge_services
  reservations: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
  personal_assistance: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  shopping_assistance: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
  gift_sourcing: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80',
  travel_planning: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
  property_coordination: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
  moving_assistance: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=400&q=80',
  cleaning_coordination: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
  vip_assistance: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',

  // logistics_shipping
  sea_freight: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80',
  air_freight: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
  road_freight: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80',
  warehousing: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=400&q=80',
};

// Default fallback image generator for safety
function getSubcategoryImage(subId: string, catId: string): string {
  if (SUBCATEGORY_IMAGES[subId]) {
    return SUBCATEGORY_IMAGES[subId];
  }
  return `https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80`;
}

// Map CATALOG's workflow hints to strict workflowType
function mapWorkflowHint(hint: string): 'order' | 'book' | 'quote' {
  if (hint.includes('booking') || hint.includes('appointment') || hint.includes('schedule')) {
    return 'book';
  }
  if (hint.includes('dispatch_immediate') || hint.includes('order_dispatch') || hint.includes('last_mile')) {
    return 'order';
  }
  return 'quote';
}

// High resolution banner images for the 21 categories
const CATEGORY_BANNERS: Record<string, string> = {
  adults_only: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
  airport_transfers: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  alcohol_beverages: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
  fashion_apparel: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  beauty: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  vehicle_rentals: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  experiences: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  financial_services: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  flowers_gifts: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80',
  restaurants_food: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  groceries_essentials: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
  laundry_cleaning: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80',
  marketplace: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
  pharmacy: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
  health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  tech_electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  travel_tours: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  vehicle_services: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
  wellness: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  concierge_services: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  logistics_shipping: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
};

// Build CATEGORIES_21 directly from CATALOG single source of truth
export const CATEGORIES_21: CatalogCategory[] = CATALOG.map((cat: Category) => {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.id.replace(/_/g, '-'),
    icon: cat.icon,
    description: cat.desc,
    bannerImage: CATEGORY_BANNERS[cat.id] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    color: cat.color,
    bg: cat.bg,
    defaultWorkflow: mapWorkflowHint(cat.workflow_hint),
    subcategories: cat.subcategories.map((sub: Subcategory) => ({
      id: sub.id,
      name: sub.name,
      icon: sub.icon,
      image: getSubcategoryImage(sub.id, cat.id),
      fulfillment_hint: sub.fulfillment_hint,
      workflow_hint: sub.workflow_hint,
      fields: sub.fields,
    })),
  };
});

// Helper to generate 5 merchants per category and 30 items per merchant
export function getCategoryMerchants(categoryId: string): CatalogMerchant[] {
  const cat = CATEGORIES_21.find((c) => c.id === categoryId) || CATEGORIES_21[0];

  const merchantNames: Record<string, string[]> = {
    adults_only: [
      'Velvet & Silk Private Boutique',
      'Botanical Intimacy Atelier',
      'The Discreet Cellar',
      'Sensory Boudoir Luxe',
      'Midnight Confidential Desk',
    ],
    airport_transfers: [
      'VIP Tarmac FastTrack Direct',
      'AeroLimo Diplomatic Transit',
      'Skyward Executive Chauffeurs',
      'Airside Escort & Baggage Hub',
      'CharterLink Helipad Transfers',
    ],
    alcohol_beverages: [
      'Sommelier Reserve Vault',
      'Grand Cru Cellars Nairobi',
      'Highland Malt & Cask Guild',
      'Champagne Room Direct',
      'Vintage & Rare Spirits Club',
    ],
    fashion_apparel: [
      'Savile & Co Bespoke Tailors',
      'Milano Leather & Silk Atelier',
      'Geneva Horology & Timepieces',
      'Haute Couture Evening Salon',
      'Cashmere & Heritage Knitwear',
    ],
    beauty: [
      'Maison de Parfum Olfactory',
      'Dermacare Aesthetic Clinic',
      'French Botanical Apothecary',
      'Silk Protein Hair Sanctuary',
      'Niche Cosmetic & Makeup Bar',
    ],
    vehicle_rentals: [
      'Apex Prestige Motors',
      'Nairobi Royal Chauffeur',
      'Serengeti Horizon 4x4 Fleet',
      'Karen Executive Supercars',
      'Maybach & Range Escorts',
    ],
    experiences: [
      'Nairobi Polo & Country Club',
      'Skyline Acoustic Lounge',
      'Master Watchmaker Academy',
      'Haute Gastronomy Studio',
      'Savannah Photographic Safari',
    ],
    financial_services: [
      'Crown Currencies FX Doorstep',
      'Swiss Vault Escrow & Settlement',
      'Private Wealth Family Office',
      'Precious Bullion & Coin Desk',
      'Diplomatic Courier Liquidity',
    ],
    flowers_gifts: [
      'Fleur Royale Haute Floristry',
      'Velvet Box Gift Concierge',
      'Ecuadorian Rose Atelier',
      'Artisan Confectionery & Hampers',
      'Botanical Orchid Haven',
    ],
    restaurants_food: [
      'Hemingways Brasserie',
      'Talisman Botanical Dining',
      'Inti Nikkei Penthouse',
      'Lord Erroll French Manor',
      'Seven Seafood & Ocean Grill',
    ],
    groceries_essentials: [
      'Artisan Grocers Pantry',
      'Prime Wagyu & Truffle Deli',
      'The Green Basket Organics',
      'La Fromagerie Nairobi',
      'Caviar & Ocean Harvest',
    ],
    laundry_cleaning: [
      'Couture Dry Cleaning Atelier',
      'Silk & Cashmere Specialists',
      'Leather & Suede Restoration',
      'Estate White-Glove Valeting',
      'Eco-Clean Garment Spa',
    ],
    marketplace: [
      'Carrara Marble & Living',
      'Egyptian Weavers Atelier',
      'Baccarat & Lalique Gallery',
      'Scandinavian Minimalist Studio',
      'Architectural Bronze & Oak',
    ],
    pharmacy: [
      'Apothecary Luxe & Rx Express',
      'Cold-Chain Swiss Vitamins',
      'Diplomatic Travel Immunity Pack',
      'Holistic Phytotherapy Hub',
      'DermaCare Clinical Dispensary',
    ],
    health: [
      'In-Suite Private Physician Group',
      'Revive Hydration & NAD+ IV Lounge',
      'Rapid Diagnostics Mobile Lab',
      'TeleHealth Harley Street Desk',
      'Cardio & Longevity Specialists',
    ],
    tech_electronics: [
      'Bang & Olufsen Acoustic Studio',
      'Apple Premium Flagship',
      'Leica Camera Atelier',
      'Devialet Audiophile Vault',
      'Smart Living Automation Hub',
    ],
    travel_tours: [
      'Governor’s Camp Expeditions',
      'Great Rift Aerial Charters',
      'Mara River Horizon Safaris',
      'Amboseli Crown Explorers',
      'Tsavo Wilderness Convoys',
    ],
    vehicle_services: [
      'XPEL Ceramic & Detailing Lab',
      'Mobile Valet In-Suite Fleet',
      'Motorsport Diagnostics Hub',
      'Concierge Supercar Care',
      'Titanium Paint Restoration',
    ],
    wellness: [
      'Entim Sidai Forest Sanctuary',
      'Kempinski Spa & Thermal Bath',
      'Sankara Rooftop Wellness Suite',
      'Tribe Sanctuary Hammam',
      'Zen Garden Body Alchemy',
    ],
    concierge_services: [
      'Royal Sovereign Lifestyle Desk',
      'Black Card VIP Access Hub',
      'Diplomatic Security Detachment',
      'Villa & Superyacht Curators',
      'Nairobi 24/7 Private Butler Co.',
    ],
    logistics_shipping: [
      'White-Glove Art Transit',
      'Air Cargo Charter JKIA',
      'Bonded Armored Parcel Courier',
      'Climate-Controlled Vault Logistics',
      'Global Expedited Diplomatic Pouch',
    ],
  };

  // Curated realistic merchant name databases per category and subcategory
  const UNIQUE_MERCHANT_NAMES: Record<string, string[]> = {
    restaurants_food: [
      'The Union Kitchen Østerbro',
      'Kødbyens Fiskebar',
      'Bæst Organic Sourdough & Mozzarella',
      'Granola Diner & Bistro',
      'Mad & Kaffe Vesterbro',
      'Pizzeria Luca',
      'Apollo Bar & Kantine',
      'Møller Kaffe & Køkken',
      'Gorm’s Nyhavn',
      'Sidecar Street Kitchen',
      'Wulff & Konstali Food Shop',
      'Mother Sourdough Pizzeria',
      'Democratic Coffee & Viennoiserie',
      'Original Coffee Illum',
      'Atelier September Organic Café',
      'Lille Bakery & Mill',
      'Hija de Sanchez Taqueria',
      'Slurp Ramen Joint',
      'Juno the Bakery',
      'Hart Bageri Holmen',
    ],
    vehicle_rentals: [
      'Maybach Sovereign Chauffeurs',
      'Karen Executive Fleet & Armor',
      'Velocità Supercar Exotics',
      'Silverstone Luxury Motoring',
      'Bespoke Range Rover Fleet',
      'Prestige Self-Drive VIP',
      'Grand Tourer European Rentals',
      'Apex Chauffeur Concierge',
      'Nairobi Safari Overland Exotics',
      'Riviera Luxury Convertible Club',
    ],
    alcohol_beverages: [
      'Sommelier Reserve & Grands Crus',
      'The Malt & Cask Vault',
      'Reims Champagne Cellar',
      'Bordeaux Primeur Distributing',
      'Highland Heritage Whisky Exchange',
      'Napa Valley Vineyard Curation',
      'Tokiwa Japanese Spirit House',
      'Epernay Grand Cru Reserve',
      'Artisan Botanical Gin Distillery',
      'Toscana Supertuscan Guild',
    ],
    groceries_organic: [
      'Green Gourmet Organic Larder',
      'The Artisan Farmhouse Pantry',
      'Tigoni Organic Valley Market',
      'Provençal Fine Foods & Oils',
      'Nairobi Farmers Premier Co-op',
      'Nordic Harvest Delicatessen',
      'The Butcher & Fishmonger Guild',
      'Whole Health Botanical Grocer',
    ],
    wellness: [
      'Sanctuary Spa & Thermal Baths',
      'Aromatherapy Associates Suite',
      'Banyan Tree Wellness Pavilions',
      'Six Senses Holistic Sanctuary',
      'Nordic Light Sauna & Hydrotherapy',
      'Zenith Aesthetic Dermatology',
    ],
    fashion_apparel: [
      'Maison de Haute Horlogerie',
      'Savile Row Bespoke Tailors',
      'Atelier Silk & Cashmere Guild',
      'Milano Leather & Shoe Works',
      'Avenue Montaigne Luxury Vault',
    ],
    flowers_gifts: [
      'Urban Leaf Florals & Botanicals',
      'Fleur de Luxe Botanical Atelier',
      'The Royal Florist & Gift Box',
      'Petals & Pearls Curations',
      'Valrhona & Bloom Confectionery',
    ],
  };

  // Distinct merchant imagery pool
  const MERCHANT_HERO_PHOTOS: Record<string, string[]> = {
    restaurants_food: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    ],
    vehicle_rentals: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    alcohol_beverages: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
    ],
    groceries_organic: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=800&q=80',
    ],
    wellness: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    ],
  };

  const AVATAR_PHOTOS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  ];

  // Each subcategory has its own 5 dedicated merchants with unique names!
  const allMerchants: CatalogMerchant[] = [];

  cat.subcategories.forEach((subcategory, subIdx) => {
    const categoryNameList = UNIQUE_MERCHANT_NAMES[categoryId] || [];
    
    for (let mIdx = 0; mIdx < 5; mIdx++) {
      const merchantId = `${categoryId}_${subcategory.id}_m${mIdx + 1}`;
      
      // Select realistic unique merchant name
      let merchantName = '';
      const poolIdx = (subIdx * 5 + mIdx) % Math.max(1, categoryNameList.length);
      if (categoryNameList.length > 0 && categoryNameList[poolIdx]) {
        merchantName = `${categoryNameList[poolIdx]}${mIdx > 0 && poolIdx === 0 ? ` (${subcategory.name})` : ''}`;
      } else {
        // Fallback realistic naming per subcategory
        const realisticDescriptors = ['Artisan', 'Atelier', 'Guild', 'Reserve', 'Maison', 'Boutique', 'Chamber', 'House'];
        const descriptor = realisticDescriptors[(subIdx + mIdx) % realisticDescriptors.length];
        const locations = ['Østerbro', 'Westlands', 'Karen Waterfront', 'Kødbyen', 'Nyhavn', 'Highland Reserve'];
        const location = locations[(subIdx * 3 + mIdx) % locations.length];
        merchantName = `${subcategory.name} ${descriptor} • ${location}`;
      }

      const progressiveHighlights = [
        'Certified Master Specialists (10+ Yrs Experience)',
        cat.defaultWorkflow === 'order' 
          ? 'White-Glove Temperature-Controlled Handover' 
          : 'Dedicated Private VIP Concierge Host',
        'Sealed Provenance & Discretion Guarantee',
      ];

      const heroPool = MERCHANT_HERO_PHOTOS[categoryId] || [subcategory.image || cat.bannerImage];
      const heroImage = heroPool[(subIdx * 2 + mIdx) % heroPool.length] || subcategory.image || cat.bannerImage;
      const avatarImage = AVATAR_PHOTOS[(subIdx + mIdx) % AVATAR_PHOTOS.length];

      allMerchants.push({
        id: merchantId,
        categoryId,
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name,
        name: merchantName,
        cuisineOrType: subcategory.name,
        rating: +(4.78 + ((subIdx * 7 + mIdx * 3) % 18) * 0.01).toFixed(1),
        ratingCount: 120 + (subIdx * 19 + mIdx * 27),
        deliveryTime: cat.defaultWorkflow === 'order'
          ? `${15 + (mIdx % 3) * 5}-${25 + (mIdx % 3) * 10} min`
          : 'Instant VIP Booking',
        deliveryFee: mIdx === 0 ? 0 : 150 + (mIdx % 3) * 50,
        minOrder: 1500 + mIdx * 500,
        heroImage,
        avatarImage,
        badges: [],
        workflowType: cat.defaultWorkflow,
        address: `${subcategory.name} District, Zone ${subIdx + 1}, Prime Quarter`,
        progressiveHighlights,
        specialty: `Specialized in curated ${subcategory.name.toLowerCase()} offerings and rapid white-glove delivery.`,
        items: generate30ItemsForMerchant(merchantId, categoryId, merchantName, cat.defaultWorkflow, [subcategory]),
      });
    }
  });

  return allMerchants;
}

function getMerchantHeroImage(categoryId: string, idx: number, fallback: string): string {
  const images: Record<string, string[]> = {
    vehicle_rentals: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
    restaurants_food: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    ],
    wellness: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    ],
  };

  const list = images[categoryId];
  if (list && list[idx]) return list[idx];
  return fallback;
}

// Generates 30 items per merchant with rich decision attributes
function generate30ItemsForMerchant(
  merchantId: string,
  categoryId: string,
  merchantName: string,
  workflow: 'order' | 'book' | 'quote',
  subcategories: CatalogSubcategory[]
): DynamicItem[] {
  const items: DynamicItem[] = [];

  for (let i = 1; i <= 30; i++) {
    const subcat = subcategories[(i - 1) % subcategories.length] || subcategories[0];
    const itemData = getItemSpecifics(categoryId, i, merchantName, subcat);

    items.push({
      id: `${merchantId}_item_${i}`,
      name: itemData.name,
      price: itemData.price,
      originalPrice: i % 4 === 0 ? Math.round(itemData.price * 1.2) : undefined,
      discount: i % 4 === 0 ? '15% OFF' : undefined,
      deliveryTime: workflow === 'order' ? `${15 + (i % 4) * 5} min` : 'Available Today',
      rating: +(4.7 + (i % 4) * 0.08).toFixed(1),
      reviewCount: 20 + i * 7,
      image: itemData.image,
      quantity: itemData.quantity,
      workflowType: workflow,
      subcategory: subcat.name,
      description: itemData.description,
      dynamicAttributes: itemData.dynamicAttributes,
    });
  }

  return items;
}

function getItemSpecifics(
  categoryId: string,
  index: number,
  merchantName: string,
  subcat: CatalogSubcategory
): {
  name: string;
  price: number;
  image: string;
  quantity: string;
  description: string;
  dynamicAttributes: Record<string, string>;
} {
  // Use the subcategory's tailored relatable image as base
  const baseImage = subcat.image;

  if (categoryId === 'vehicle_rentals') {
    const models = [
      'Mercedes-Maybach S680 V12 Executive',
      'Range Rover Autobiography LWB 4.4L',
      'Bentley Flying Spur Mulliner Edition',
      'Porsche 911 GT3 Touring Package',
      'Rolls-Royce Ghost Extended Wheelbase',
      'Toyota Land Cruiser 300 GR Sport Armor',
      'Lamborghini Urus Performante',
      'Aston Martin DBX707 Luxury SUV',
      'Audi RS e-tron GT Quattro',
      'Ferrari 296 GTB Hybrid Coupe',
    ];
    const model = models[(index - 1) % models.length];
    return {
      name: `${model} (2026)`,
      price: 45000 + (index % 10) * 12000,
      image: baseImage,
      quantity: 'Per 24h Hire • Concierge Handover',
      description: `Pristine condition ${model} serviced directly by certified master technicians. Chauffeured or insured self-drive.`,
      dynamicAttributes: {
        'Vehicle Color': index % 2 === 0 ? 'Obsidian Black Metallic' : 'Diamond White Pearl',
        'Engine Type': index % 3 === 0 ? '4.0L Twin-Turbo V8' : '6.0L Biturbo V12',
        'Current Mileage': `${(1200 + index * 340).toLocaleString()} km`,
        'Last Service Date': `March ${10 + (index % 10)}, 2026`,
        'Deposit Required': 'Zero Deposit with VIP Concierge Black Card',
        'Insurance Cover': 'Full Comprehensive Zero-Deductible Platinum Coverage',
        'Transmission': 'Automatic 9-Speed Dual-Clutch',
        'Fuel Policy': 'Full-to-Full Tank Guarantee',
      },
    };
  }

  if (categoryId === 'restaurants_food') {
    const dishes = [
      'Pan-Seared Wagyu A5 Tenderloin with Black Truffle Jus',
      'Wild Atlantic Turbot with Oscietra Caviar Cream',
      'Handmade Morel Mushroom & Duck Confit Tortelloni',
      'Crispy Skin Brittany Pigeon with Cherry Reduction',
      'Grand Plateau de Fruits de Mer with Brittany Oysters',
      'Aged Parmesan Risotto with White Alba Truffle',
      'Valrhona Dark Chocolate Soufflé with Bourbon Vanilla Gelato',
      'Woodfired Sourdough Bread with Cultured Normandy Butter',
    ];
    const dish = dishes[(index - 1) % dishes.length];
    return {
      name: `${dish}`,
      price: 3200 + (index % 8) * 1100,
      image: baseImage,
      quantity: 'Chef Signature Portion',
      description: `Crafted fresh by executive culinary masters at ${merchantName}. Prepared with sustainably harvested ingredients.`,
      dynamicAttributes: {
        'Course Type': index % 2 === 0 ? 'Signature Main' : 'Appetizer & Caviar',
        'Chef In Charge': 'Chef de Cuisine Marcus Dupont',
        'Allergens': 'Dairy, Shellfish (Optional Modification Available)',
        'Sommelier Pairing': '2018 Domaine de la Romanée-Conti',
        'Prep & Delivery': '25-35 min in thermal vacuum cloche',
      },
    };
  }

  if (categoryId === 'alcohol_beverages') {
    const bottles = [
      'Dom Pérignon Vintage Champagne 2013 Brut',
      'Château Margaux Premier Grand Cru Classé 2015',
      'The Macallan 25 Year Old Sherry Oak Single Malt',
      'Louis XIII de Rémy Martin Grande Champagne Cognac',
      'Sassicaia Tenuta San Guido Bolgheri 2019',
      'Krug Clos d’Ambonnay Champagne',
      'Yamazaki 18 Year Single Malt Japanese Whisky',
      'Clase Azul Reposado Tequila with Ceramic Decanter',
    ];
    const bottle = bottles[(index - 1) % bottles.length];
    return {
      name: bottle,
      price: 28000 + (index % 8) * 16000,
      image: baseImage,
      quantity: '750ml Bottle • Sealed & Verified Provenance',
      description: `Pristine cellar storage at optimal 12°C temperature. Guaranteed original cellar provenance.`,
      dynamicAttributes: {
        'Origin & Region': 'Reims / Bordeaux, France',
        'Vintage Year': `${2010 + (index % 12)}`,
        'ABV Content': '43.0% Vol',
        'Cellar Temperature': '12.4°C Constant Humidity',
        'Packaging': 'Collector Wooden Casket with Authenticity Hologram',
      },
    };
  }

  if (categoryId === 'wellness') {
    const therapies = [
      'Volcanic Warm Basalt Stone Full Body Massage',
      'Indonesian Deep Herbal Compress & Bamboo Therapy',
      'Cellular Anti-Aging Diamond Micro-Facial',
      'Couples Cedar Sauna & Thermal Flotation Journey',
      'Tibetan Singing Bowl Sound Bath & Reflexology',
      'Detoxifying Seaweed Body Wrap & Vichy Shower',
    ];
    const therapy = therapies[(index - 1) % therapies.length];
    return {
      name: therapy,
      price: 9500 + (index % 6) * 3500,
      image: baseImage,
      quantity: '90 Minutes Session • In-Suite or Sanctuary',
      description: `Administered by master certified wellness therapists using organic botanical oils.`,
      dynamicAttributes: {
        'Therapist Experience': 'Senior Aesthetician (10+ Yrs)',
        'Essential Oils Used': 'Madagascar Ylang-Ylang & Bergamot',
        'Session Location': 'Private Suite or Forest Sanctuary Treatment Room',
        'Customization': 'Pressure Level & Focus Areas Tailored to Preference',
      },
    };
  }

  // Default rich fallback for any other category
  return {
    name: `${subcat.name} Premium Curated Selection #${index}`,
    price: 4500 + (index % 10) * 1800,
    image: baseImage,
    quantity: 'Verified Quality • Concierge Guaranteed',
    description: `High-touch luxury offering curated by ${merchantName}. Full provenance and white-glove delivery guaranteed.`,
    dynamicAttributes: {
      'Category Group': subcat.name,
      'Fulfillment Speed': 'Direct VIP Dispatch',
      'Service Guarantee': '100% Satisfaction or Instant Replacement',
      'Concierge Notes': 'Special handling and tailored packaging available',
    },
  };
}
