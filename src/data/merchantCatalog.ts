export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  fulfillment_hint: string;
  workflow_hint: string;
  fields: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  desc: string;
  fulfillment_hint: string;
  workflow_hint: string;
  subcategories: Subcategory[];
}

export const CATALOG: Category[] = [
  {
    id: 'adults_only', name: 'Adults Only',
    icon: 'ShieldAlert', color: '#7c3aed', bg: '#f5f3ff',
    desc: 'Age-restricted products and adult wellness',
    fulfillment_hint: 'age_verified_delivery', workflow_hint: 'age_gate_required',
    subcategories: [
      { id: 'adult_products', name: 'Adult Products', icon: 'PackageOpen', fulfillment_hint: 'discreet_packaging', workflow_hint: 'age_verification_mandatory', fields: ['packaging_style', 'age_gate_method', 'signature_required', 'min_order'] },
      { id: 'adult_wellness', name: 'Adult Wellness', icon: 'HeartPulse', fulfillment_hint: 'discreet_packaging', workflow_hint: 'age_verification_mandatory', fields: ['packaging_style', 'age_gate_method', 'booking_required', 'home_service'] },
      { id: 'cigarettes', name: 'Cigarettes', icon: 'Flame', fulfillment_hint: 'standard_last_mile', workflow_hint: 'age_verification_mandatory', fields: ['license_number', 'age_gate_method', 'brands_stocked_text', 'min_order'] },
      { id: 'cigars', name: 'Cigars', icon: 'Flame', fulfillment_hint: 'standard_last_mile', workflow_hint: 'age_verification_mandatory', fields: ['license_number', 'age_gate_method', 'brands_stocked_text', 'gift_packaging'] },
      { id: 'vapes', name: 'Vapes', icon: 'Wind', fulfillment_hint: 'standard_last_mile', workflow_hint: 'age_verification_mandatory', fields: ['vape_device_types', 'age_gate_method', 'license_number', 'min_order'] },
      { id: 'adult_accessories', name: 'Adult Accessories', icon: 'Star', fulfillment_hint: 'discreet_packaging', workflow_hint: 'age_verification_mandatory', fields: ['packaging_style', 'age_gate_method', 'signature_required'] },
    ]
  },
  {
    id: 'airport_transfers', name: 'Airport Transfers',
    icon: 'Plane', color: '#0284c7', bg: '#f0f9ff',
    desc: 'Professional airport pickup, drop-off and executive transfers',
    fulfillment_hint: 'scheduled_transfer', workflow_hint: 'booking_dispatch',
    subcategories: [
      { id: 'airport_pickup', name: 'Airport Pickup', icon: 'ArrowDown', fulfillment_hint: 'scheduled_transfer', workflow_hint: 'booking_dispatch', fields: ['vehicle_types_transfer', 'fleet_size', 'available_24hr', 'advance_booking_hrs', 'flight_tracking', 'chauffeur_uniform', 'corporate_billing'] },
      { id: 'airport_dropoff', name: 'Airport Drop-off', icon: 'ArrowUp', fulfillment_hint: 'scheduled_transfer', workflow_hint: 'booking_dispatch', fields: ['vehicle_types_transfer', 'fleet_size', 'available_24hr', 'advance_booking_hrs', 'chauffeur_uniform', 'corporate_billing'] },
      { id: 'meet_greet', name: 'Meet & Greet', icon: 'Handshake', fulfillment_hint: 'scheduled_transfer', workflow_hint: 'booking_dispatch', fields: ['vehicle_types_transfer', 'fleet_size', 'meet_greet_signage', 'waiting_time_min', 'chauffeur_uniform', 'corporate_billing'] },
      { id: 'executive_transfer', name: 'Executive Transfer', icon: 'Car', fulfillment_hint: 'executive_transfer', workflow_hint: 'booking_dispatch_priority', fields: ['vehicle_types_transfer', 'fleet_size', 'available_24hr', 'advance_booking_hrs', 'corporate_billing', 'chauffeur_uniform', 'flight_tracking'] },
    ]
  },
  {
    id: 'alcohol_beverages', name: 'Alcohol & Beverages',
    icon: 'GlassWater', color: '#7e22ce', bg: '#faf5ff',
    desc: 'Licensed spirits, wines, beers and cocktail mixers',
    fulfillment_hint: 'age_verified_delivery', workflow_hint: 'age_gate_required',
    subcategories: [
      { id: 'wine', name: 'Wine', icon: 'GlassWater', fulfillment_hint: 'age_verified_last_mile', workflow_hint: 'age_gate_required', fields: ['liquor_license', 'wine_origins', 'cold_delivery', 'gift_wrapping', 'min_order'] },
      { id: 'spirits', name: 'Spirits', icon: 'GlassWater', fulfillment_hint: 'age_verified_last_mile', workflow_hint: 'age_gate_required', fields: ['liquor_license', 'brands_stocked_text', 'gift_wrapping', 'min_order'] },
      { id: 'beer', name: 'Beer', icon: 'Beer', fulfillment_hint: 'age_verified_last_mile', workflow_hint: 'age_gate_required', fields: ['liquor_license', 'cold_delivery', 'returnable_bottles', 'brands_stocked_text', 'min_order'] },
      { id: 'champagne', name: 'Champagne', icon: 'GlassWater', fulfillment_hint: 'age_verified_last_mile', workflow_hint: 'age_gate_required', fields: ['liquor_license', 'occasions_spec', 'cold_delivery', 'gift_wrapping'] },
      { id: 'cocktail_mixers', name: 'Cocktail Mixers', icon: 'GlassWater', fulfillment_hint: 'standard_last_mile', workflow_hint: 'age_gate_required', fields: ['liquor_license', 'gift_packaging', 'min_order'] },
      { id: 'liquor_stores', name: 'Liquor Stores', icon: 'Store', fulfillment_hint: 'age_verified_last_mile', workflow_hint: 'age_gate_required', fields: ['liquor_license', 'cold_delivery', 'min_order', 'corporate_billing'] },
    ]
  },
  {
    id: 'fashion_apparel', name: 'Fashion & Apparel',
    icon: 'Shirt', color: '#db2777', bg: '#fdf2f8',
    desc: "Clothing, shoes, bags, watches and fashion accessories",
    fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard',
    subcategories: [
      { id: 'mens_fashion', name: "Men's Fashion", icon: 'User', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'size_range_adults', 'has_physical_store', 'custom_tailoring', 'style_consultation', 'return_policy', 'packaging_fashion'] },
      { id: 'womens_fashion', name: "Women's Fashion", icon: 'User', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'size_range_adults', 'has_physical_store', 'custom_tailoring', 'style_consultation', 'return_policy', 'packaging_fashion'] },
      { id: 'kids_fashion', name: 'Kids Fashion', icon: 'Baby', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'kids_age_range', 'school_uniforms', 'return_policy', 'packaging_fashion'] },
      { id: 'shoes', name: 'Shoes', icon: 'Footprints', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'shoe_size_system', 'has_physical_store', 'return_policy', 'packaging_fashion'] },
      { id: 'bags', name: 'Bags', icon: 'ShoppingBag', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'authenticity_guarantee', 'warranty_offered', 'return_policy', 'packaging_fashion'] },
      { id: 'watches', name: 'Watches', icon: 'Watch', fulfillment_hint: 'secure_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'authenticity_guarantee', 'warranty_offered', 'return_policy', 'packaging_fashion'] },
      { id: 'accessories', name: 'Accessories', icon: 'Sparkles', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['brand_tier', 'has_physical_store', 'return_policy', 'packaging_fashion'] },
    ]
  },
  {
    id: 'beauty', name: 'Beauty',
    icon: 'Sparkles', color: '#be185d', bg: '#fdf2f8',
    desc: 'Makeup, skincare, haircare, fragrances and cosmetics',
    fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard',
    subcategories: [
      { id: 'makeup', name: 'Makeup', icon: 'Sparkles', fulfillment_hint: 'standard_last_mile', workflow_hint: 'booking_or_dispatch', fields: ['booking_required', 'professional_artists', 'bridal_packages', 'event_makeup', 'home_service', 'products_for_sale'] },
      { id: 'skincare', name: 'Skincare', icon: 'Droplet', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['skin_types_served', 'dermatologist_backed', 'custom_routine_consult', 'home_service', 'products_for_sale'] },
      { id: 'haircare', name: 'Haircare', icon: 'Scissors', fulfillment_hint: 'standard_last_mile', workflow_hint: 'booking_or_dispatch', fields: ['hair_types_served', 'home_visits', 'booking_required', 'products_for_sale'] },
      { id: 'fragrances', name: 'Fragrances', icon: 'Wind', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['fragrance_families', 'gift_wrapping', 'products_for_sale'] },
      { id: 'cosmetics_stores', name: 'Cosmetics Stores', icon: 'Store', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['own_brand', 'multi_brand', 'has_physical_store', 'min_order'] },
    ]
  },
  {
    id: 'vehicle_rentals', name: 'Vehicle Rentals',
    icon: 'Car', color: '#0369a1', bg: '#f0f9ff',
    desc: 'Short and long-term vehicle hire including cars and bikes',
    fulfillment_hint: 'self_collection_or_delivery', workflow_hint: 'booking_dispatch',
    subcategories: [
      { id: 'car_rental', name: 'Car Rental', icon: 'Car', fulfillment_hint: 'vehicle_dispatch', workflow_hint: 'booking_dispatch', fields: ['vehicle_types_rental', 'fleet_size', 'min_rental_duration', 'with_driver', 'insurance_included', 'fuel_policy', 'deposit_policy_text', 'corporate_billing'] },
      { id: 'self_drive', name: 'Self Drive', icon: 'Shield', fulfillment_hint: 'vehicle_dispatch', workflow_hint: 'booking_dispatch', fields: ['vehicle_types_rental', 'fleet_size', 'min_rental_duration', 'insurance_included', 'fuel_policy', 'deposit_policy_text', 'age_requirement'] },
      { id: 'corporate_rental', name: 'Corporate Rental', icon: 'Building', fulfillment_hint: 'vehicle_dispatch', workflow_hint: 'booking_dispatch_priority', fields: ['vehicle_types_rental', 'fleet_size', 'billing_cycle', 'dedicated_account_mgr', 'insurance_included', 'fuel_policy'] },
      { id: 'long_term_rental', name: 'Long-Term Rental', icon: 'Calendar', fulfillment_hint: 'vehicle_dispatch', workflow_hint: 'booking_dispatch', fields: ['vehicle_types_rental', 'fleet_size', 'min_rental_duration', 'insurance_included', 'fuel_policy', 'deposit_policy_text'] },
      { id: 'bike_rental', name: 'Bike Rental', icon: 'Bike', fulfillment_hint: 'vehicle_dispatch', workflow_hint: 'booking_dispatch', fields: ['bike_types', 'fleet_size', 'min_rental_duration', 'insurance_included', 'deposit_policy_text', 'with_driver'] },
    ]
  },
  {
    id: 'experiences', name: 'Experiences',
    icon: 'Ticket', color: '#ea580c', bg: '#fff7ed',
    desc: 'Events, workshops, photography, sports and recreational activities',
    fulfillment_hint: 'ticket_or_booking', workflow_hint: 'booking_dispatch',
    subcategories: [
      { id: 'concerts', name: 'Concerts', icon: 'Music', fulfillment_hint: 'ticket_delivery', workflow_hint: 'event_dispatch', fields: ['avg_attendees', 'ticket_delivery_method', 'vip_packages', 'advance_booking_hrs'] },
      { id: 'festivals', name: 'Festivals', icon: 'Sparkles', fulfillment_hint: 'ticket_delivery', workflow_hint: 'event_dispatch', fields: ['avg_attendees', 'ticket_delivery_method', 'vip_packages', 'advance_booking_hrs'] },
      { id: 'conferences', name: 'Conferences', icon: 'Mic', fulfillment_hint: 'ticket_delivery', workflow_hint: 'booking_dispatch', fields: ['capacity_range', 'av_equipment', 'catering_available', 'advance_booking_hrs'] },
      { id: 'private_events', name: 'Private Events', icon: 'GlassWater', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['event_planning_offered', 'venue_sourcing', 'min_headcount', 'max_headcount', 'advance_booking_hrs'] },
      { id: 'photography', name: 'Photography', icon: 'Camera', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['booking_required', 'session_duration_text', 'max_group_size', 'equipment_provided', 'home_service'] },
      { id: 'workshops', name: 'Workshops', icon: 'Presentation', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['booking_required', 'session_duration_text', 'max_group_size', 'equipment_provided'] },
      { id: 'classes', name: 'Classes', icon: 'BookOpen', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['booking_required', 'session_duration_text', 'max_group_size', 'recurring_sessions'] },
      { id: 'sports_activities', name: 'Sports Activities', icon: 'Activity', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['booking_required', 'max_group_size', 'equipment_provided', 'recurring_sessions'] },
      { id: 'recreation', name: 'Recreation', icon: 'Trees', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['booking_required', 'max_group_size', 'equipment_provided', 'advance_booking_hrs'] },
    ]
  },
  {
    id: 'financial_services', name: 'Financial Services',
    icon: 'Briefcase', color: '#059669', bg: '#f0fdf4',
    desc: 'Banking, forex, insurance, payments and Sacco services',
    fulfillment_hint: 'digital_or_in_branch', workflow_hint: 'appointment_or_digital',
    subcategories: [
      { id: 'banking', name: 'Banking', icon: 'DollarSign', fulfillment_hint: 'digital_or_in_branch', workflow_hint: 'appointment_or_digital', fields: ['regulatory_license', 'fin_services_offered_bank', 'physical_locations_count', 'digital_platform', 'operating_hours_text'] },
      { id: 'forex', name: 'Forex', icon: 'Coins', fulfillment_hint: 'in_branch', workflow_hint: 'appointment_or_digital', fields: ['regulatory_license', 'currencies_traded', 'physical_locations_count', 'digital_platform', 'operating_hours_text'] },
      { id: 'insurance', name: 'Insurance', icon: 'ShieldCheck', fulfillment_hint: 'digital_or_in_branch', workflow_hint: 'appointment_or_digital', fields: ['regulatory_license', 'insurance_types', 'physical_locations_count', 'digital_platform'] },
      { id: 'payments', name: 'Payments', icon: 'CreditCard', fulfillment_hint: 'digital', workflow_hint: 'digital_dispatch', fields: ['regulatory_license', 'payment_channels', 'digital_platform', 'physical_locations_count'] },
      { id: 'remittance', name: 'Remittance', icon: 'Send', fulfillment_hint: 'digital_or_in_branch', workflow_hint: 'digital_dispatch', fields: ['regulatory_license', 'remittance_corridors', 'digital_platform', 'physical_locations_count'] },
      { id: 'sacco_services', name: 'Sacco Services', icon: 'Users', fulfillment_hint: 'in_branch', workflow_hint: 'appointment', fields: ['regulatory_license', 'sacco_services_offered', 'physical_locations_count', 'operating_hours_text'] },
      { id: 'business_services', name: 'Business Services', icon: 'Briefcase', fulfillment_hint: 'digital_or_in_branch', workflow_hint: 'appointment_or_digital', fields: ['regulatory_license', 'biz_services_offered', 'physical_locations_count', 'digital_platform'] },
    ]
  },
  {
    id: 'flowers_gifts', name: 'Flowers & Gifts',
    icon: 'Gift', color: '#e11d48', bg: '#fff1f2',
    desc: 'Flowers, gift hampers, cakes, chocolates and occasion gifts',
    fulfillment_hint: 'same_day_last_mile', workflow_hint: 'order_dispatch_express',
    subcategories: [
      { id: 'flowers', name: 'Flowers', icon: 'Flower', fulfillment_hint: 'same_day_last_mile', workflow_hint: 'order_dispatch_express', fields: ['fresh_or_preserved', 'subscription_bouquets', 'same_day_delivery', 'custom_messages', 'advance_order_hrs'] },
      { id: 'gift_hampers', name: 'Gift Hampers', icon: 'Gift', fulfillment_hint: 'same_day_last_mile', workflow_hint: 'order_dispatch_express', fields: ['custom_curation', 'corporate_gifting', 'hamper_price_ranges', 'same_day_delivery', 'custom_messages'] },
      { id: 'cakes', name: 'Cakes', icon: 'Cake', fulfillment_hint: 'scheduled_last_mile', workflow_hint: 'order_dispatch_scheduled', fields: ['custom_cake_design', 'dietary_options_cake', 'min_advance_order_hrs', 'same_day_delivery'] },
      { id: 'chocolates', name: 'Chocolates', icon: 'Cookie', fulfillment_hint: 'same_day_last_mile', workflow_hint: 'order_dispatch_express', fields: ['gift_wrapping', 'custom_messages', 'same_day_delivery', 'min_order'] },
      { id: 'personalized_gifts', name: 'Personalized Gifts', icon: 'Sparkles', fulfillment_hint: 'scheduled_last_mile', workflow_hint: 'order_dispatch_scheduled', fields: ['custom_messages', 'advance_order_hrs', 'corporate_gifting'] },
      { id: 'occasion_gifts', name: 'Occasion Gifts', icon: 'Heart', fulfillment_hint: 'same_day_last_mile', workflow_hint: 'order_dispatch_express', fields: ['occasions_spec', 'same_day_delivery', 'custom_messages', 'gift_wrapping'] },
    ]
  },
  {
    id: 'restaurants_food', name: 'Restaurants & Food',
    icon: 'Utensils', color: '#d97706', bg: '#fffbeb',
    desc: 'Restaurants, fast food, cafés, cloud kitchens and catering',
    fulfillment_hint: 'last_mile_food', workflow_hint: 'order_dispatch_immediate',
    subcategories: [
      { id: 'restaurant', name: 'Restaurant', icon: 'Utensils', fulfillment_hint: 'last_mile_food_hot', workflow_hint: 'order_dispatch_immediate', fields: ['cuisine_types', 'table_service', 'avg_prep_time', 'has_physical_seating', 'reservation_system', 'min_order'] },
      { id: 'fast_food', name: 'Fast Food', icon: 'Beef', fulfillment_hint: 'last_mile_food_hot', workflow_hint: 'order_dispatch_immediate', fields: ['avg_prep_time', 'drive_through', 'family_meals', 'min_order'] },
      { id: 'cafe', name: 'Café', icon: 'Coffee', fulfillment_hint: 'last_mile_food_ambient', workflow_hint: 'order_dispatch_immediate', fields: ['brewing_methods', 'wifi_available', 'coworking_space', 'seated_capacity', 'food_menu'] },
      { id: 'bakery', name: 'Bakery', icon: 'CakeSlice', fulfillment_hint: 'last_mile_food_ambient', workflow_hint: 'order_dispatch_immediate', fields: ['bakery_specialties', 'custom_orders', 'advance_order_hrs', 'min_order'] },
      { id: 'desserts', name: 'Desserts', icon: 'IceCream', fulfillment_hint: 'last_mile_food_cold', workflow_hint: 'order_dispatch_immediate', fields: ['dessert_specialties', 'custom_orders', 'dietary_options_cake', 'min_order'] },
      { id: 'juice_bar', name: 'Juice Bar', icon: 'CupSoda', fulfillment_hint: 'last_mile_food_cold', workflow_hint: 'order_dispatch_immediate', fields: ['cold_pressed', 'smoothie_bowls', 'vegan_menu', 'detox_programs'] },
      { id: 'cloud_kitchen', name: 'Cloud Kitchen', icon: 'Flame', fulfillment_hint: 'last_mile_food_hot', workflow_hint: 'order_dispatch_immediate', fields: ['number_of_brands', 'cuisine_types', 'pickup_available', 'avg_prep_time'] },
      { id: 'catering', name: 'Catering', icon: 'CookingPot', fulfillment_hint: 'scheduled_bulk_delivery', workflow_hint: 'order_dispatch_scheduled', fields: ['cuisine_types', 'min_headcount', 'max_headcount', 'equipment_provided', 'staff_included', 'advance_booking_days'] },
    ]
  },
  {
    id: 'groceries_essentials', name: 'Groceries & Essentials',
    icon: 'ShoppingCart', color: '#16a34a', bg: '#f0fdf4',
    desc: 'Supermarkets, fresh produce, butcheries and organic stores',
    fulfillment_hint: 'last_mile_grocery', workflow_hint: 'order_dispatch_standard',
    subcategories: [
      { id: 'supermarket', name: 'Supermarket', icon: 'Store', fulfillment_hint: 'last_mile_grocery', workflow_hint: 'order_dispatch_standard', fields: ['min_order', 'express_delivery', 'pickup_available', 'operations_24hr', 'loyalty_program'] },
      { id: 'convenience_store', name: 'Convenience Store', icon: 'ShoppingBag', fulfillment_hint: 'last_mile_grocery_express', workflow_hint: 'order_dispatch_immediate', fields: ['min_order', 'operations_24hr', 'express_delivery'] },
      { id: 'fresh_produce', name: 'Fresh Produce', icon: 'Leaf', fulfillment_hint: 'last_mile_grocery_cold', workflow_hint: 'order_dispatch_standard', fields: ['organic_options', 'farm_direct', 'subscription_boxes', 'weekly_market'] },
      { id: 'butchery', name: 'Butchery', icon: 'Beef', fulfillment_hint: 'last_mile_grocery_cold', workflow_hint: 'order_dispatch_standard', fields: ['custom_cuts', 'halal_certified', 'vacuum_sealed', 'advance_order_required'] },
      { id: 'seafood', name: 'Seafood', icon: 'Fish', fulfillment_hint: 'last_mile_grocery_cold', workflow_hint: 'order_dispatch_standard', fields: ['live_seafood', 'on_site_processing', 'min_order'] },
      { id: 'organic_store', name: 'Organic Store', icon: 'Leaf', fulfillment_hint: 'last_mile_grocery', workflow_hint: 'order_dispatch_standard', fields: ['local_sourcing', 'zero_waste_packaging'] },
    ]
  },
  {
    id: 'laundry_cleaning', name: 'Laundry & Cleaning',
    icon: 'Sparkles', color: '#0891b2', bg: '#ecfeff',
    desc: 'Laundry, dry cleaning, ironing and home or office cleaning',
    fulfillment_hint: 'pickup_dropoff', workflow_hint: 'scheduled_dispatch',
    subcategories: [
      { id: 'laundry', name: 'Laundry', icon: 'Shirt', fulfillment_hint: 'pickup_dropoff', workflow_hint: 'scheduled_dispatch', fields: ['pickup_delivery', 'turnaround_time', 'per_kg_pricing', 'per_item_pricing', 'weight_limit'] },
      { id: 'dry_cleaning', name: 'Dry Cleaning', icon: 'Wind', fulfillment_hint: 'pickup_dropoff', workflow_hint: 'scheduled_dispatch', fields: ['pickup_delivery', 'turnaround_time', 'per_item_pricing', 'garment_types'] },
      { id: 'ironing', name: 'Ironing', icon: 'Shirt', fulfillment_hint: 'pickup_dropoff', workflow_hint: 'scheduled_dispatch', fields: ['pickup_delivery', 'turnaround_time', 'per_item_pricing'] },
      { id: 'home_cleaning', name: 'Home Cleaning', icon: 'Sparkles', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['one_time_bookings', 'recurring_sub', 'equipment_provided', 'eco_products', 'min_hours_session', 'coverage_area_text'] },
      { id: 'office_cleaning', name: 'Office Cleaning', icon: 'Building', fulfillment_hint: 'service_dispatch', workflow_hint: 'booking_dispatch', fields: ['one_time_bookings', 'recurring_sub', 'equipment_provided', 'eco_products', 'min_hours_session', 'coverage_area_text'] },
    ]
  },
  {
    id: 'marketplace', name: 'Marketplace',
    icon: 'Store', color: '#4f46e5', bg: '#eef2ff',
    desc: 'Home, furniture, appliances, books and general retail',
    fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard',
    subcategories: [
      { id: 'home_living', name: 'Home & Living', icon: 'Home', fulfillment_hint: 'bulky_last_mile', workflow_hint: 'order_dispatch_scheduled', fields: ['product_description', 'new_or_used', 'fragile_handling', 'return_policy'] },
      { id: 'furniture', name: 'Furniture', icon: 'Armchair', fulfillment_hint: 'bulky_last_mile', workflow_hint: 'order_dispatch_scheduled', fields: ['product_description', 'new_or_used', 'fragile_handling', 'installation_service'] },
      { id: 'appliances', name: 'Appliances', icon: 'Tv', fulfillment_hint: 'bulky_last_mile', workflow_hint: 'order_dispatch_scheduled', fields: ['product_description', 'warranty_offered', 'installation_service', 'fragile_handling', 'return_policy'] },
      { id: 'decor', name: 'Decor', icon: 'Palette', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'new_or_used', 'fragile_handling', 'gift_wrapping'] },
      { id: 'kitchenware', name: 'Kitchenware', icon: 'ChefHat', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'new_or_used', 'return_policy'] },
      { id: 'books', name: 'Books', icon: 'BookOpen', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['book_genres', 'new_or_used', 'custom_orders'] },
      { id: 'stationery', name: 'Stationery', icon: 'PenTool', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'min_order', 'corporate_billing'] },
      { id: 'office_supplies', name: 'Office Supplies', icon: 'Paperclip', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'min_order', 'corporate_billing'] },
      { id: 'general_retail', name: 'General Retail', icon: 'Store', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'new_or_used', 'min_order', 'return_policy'] },
    ]
  },
  {
    id: 'pharmacy', name: 'Pharmacy',
    icon: 'Pills', color: '#0d9488', bg: '#f0fdfa',
    desc: 'Pharmacy, medical supplies, baby products and supplements',
    fulfillment_hint: 'last_mile_pharmacy', workflow_hint: 'order_dispatch_standard',
    subcategories: [
      { id: 'pharmacy_retail', name: 'Pharmacy', icon: 'Pills', fulfillment_hint: 'last_mile_pharmacy', workflow_hint: 'order_dispatch_standard', fields: ['pharmacist_on_duty', 'operations_24hr', 'prescription_delivery', 'cold_chain_meds'] },
      { id: 'medical_supplies', name: 'Medical Supplies', icon: 'Briefcase', fulfillment_hint: 'last_mile_pharmacy', workflow_hint: 'order_dispatch_standard', fields: ['med_supply_types', 'corporate_billing'] },
      { id: 'baby_products', name: 'Baby Products', icon: 'Baby', fulfillment_hint: 'last_mile_grocery', workflow_hint: 'order_dispatch_standard', fields: ['baby_product_range', 'subscription_available', 'min_order'] },
      { id: 'supplements', name: 'Supplements', icon: 'Shield', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['supplement_categories', 'authenticity_guarantee'] },
    ]
  },
  {
    id: 'health', name: 'Health',
    icon: 'Heart', color: '#059669', bg: '#f0fdf4',
    desc: 'Clinics, telemedicine, labs, mental health and coaching',
    fulfillment_hint: 'service_dispatch_or_digital', workflow_hint: 'booking_dispatch',
    subcategories: [
      { id: 'clinics', name: 'Clinics', icon: 'Activity', fulfillment_hint: 'in_clinic_or_home_visit', workflow_hint: 'booking_dispatch', fields: ['clinic_specializations', 'appointment_booking', 'walk_in_available', 'home_visits', 'insurance_accepted'] },
      { id: 'telemedicine', name: 'Telemedicine', icon: 'Video', fulfillment_hint: 'digital', workflow_hint: 'booking_digital', fields: ['tele_platforms', 'clinic_specializations', 'available_24hr'] },
      { id: 'labs', name: 'Labs', icon: 'Droplet', fulfillment_hint: 'in_lab_or_home_sample', workflow_hint: 'booking_dispatch', fields: ['lab_test_types', 'home_sample_collection', 'results_turnaround_hrs'] },
      { id: 'mental_health', name: 'Mental Health (Therapy)', icon: 'User', fulfillment_hint: 'service_dispatch_or_digital', workflow_hint: 'booking_dispatch', fields: ['therapy_types', 'session_format', 'avg_session_duration'] },
      { id: 'coaching', name: 'Coaching', icon: 'MessageCircle', fulfillment_hint: 'service_dispatch_or_digital', workflow_hint: 'booking_dispatch', fields: ['coaching_areas', 'session_format', 'avg_session_duration', 'group_sessions'] },
    ]
  },
  {
    id: 'tech_electronics', name: 'Tech & Electronics',
    icon: 'Laptop', color: '#2563eb', bg: '#eff6ff',
    desc: 'Smartphones, computers, gaming, audio and telecom',
    fulfillment_hint: 'secure_last_mile', workflow_hint: 'order_dispatch_standard',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone', fulfillment_hint: 'secure_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['phone_brands', 'new_or_refurbished', 'warranty_months', 'repair_services', 'trade_in_program'] },
      { id: 'tech_accessories', name: 'Accessories', icon: 'Usb', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'warranty_offered', 'min_order'] },
      { id: 'computers', name: 'Computers', icon: 'Laptop', fulfillment_hint: 'secure_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['computer_brands', 'new_or_refurbished', 'warranty_months', 'repair_services'] },
      { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['console_types', 'pre_owned_games', 'gaming_accessories'] },
      { id: 'audio', name: 'Audio', icon: 'Volume2', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'warranty_offered', 'return_policy'] },
      { id: 'telecom_services', name: 'Telecom Services', icon: 'Wifi', fulfillment_hint: 'standard_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['telecom_services_offered', 'telecom_networks'] },
      { id: 'smart_devices', name: 'Smart Devices', icon: 'Cpu', fulfillment_hint: 'secure_last_mile', workflow_hint: 'order_dispatch_standard', fields: ['product_description', 'warranty_offered', 'installation_service'] },
    ]
  },
  {
    id: 'travel_tours', name: 'Travel & Tours',
    icon: 'Compass', color: '#b45309', bg: '#fffbeb',
    desc: 'Safaris, game drives, city tours, cultural and adventure packages',
    fulfillment_hint: 'booking_or_transfer', workflow_hint: 'booking_dispatch',
    subcategories: [
      { id: 'safaris', name: 'Safaris', icon: 'Compass', fulfillment_hint: 'safari_dispatch', workflow_hint: 'booking_dispatch', fields: ['parks_covered', 'accommodation_included', 'meal_plan', 'min_nights', 'max_group_size', 'private_vehicle'] },
      { id: 'game_drives', name: 'Game Drives', icon: 'Eye', fulfillment_hint: 'safari_dispatch', workflow_hint: 'booking_dispatch', fields: ['parks_covered', 'max_group_size', 'private_vehicle', 'advance_booking_hrs'] },
      { id: 'luxury_safaris', name: 'Luxury Safaris', icon: 'Gem', fulfillment_hint: 'luxury_safari_dispatch', workflow_hint: 'booking_dispatch_priority', fields: ['parks_covered', 'accommodation_included', 'meal_plan', 'min_nights', 'max_group_size', 'private_vehicle'] },
      { id: 'city_tours', name: 'City Tours', icon: 'Map', fulfillment_hint: 'tour_dispatch', workflow_hint: 'booking_dispatch', fields: ['tour_modes', 'max_group_size', 'duration_options', 'guide_included', 'tour_languages'] },
      { id: 'cultural_tours', name: 'Cultural Tours', icon: 'Users', fulfillment_hint: 'tour_dispatch', workflow_hint: 'booking_dispatch', fields: ['tour_modes', 'max_group_size', 'duration_options', 'guide_included', 'tour_languages'] },
      { id: 'adventure_tours', name: 'Adventure Tours', icon: 'Mountain', fulfillment_hint: 'tour_dispatch', workflow_hint: 'booking_dispatch', fields: ['tour_modes', 'max_group_size', 'duration_options', 'guide_included', 'equipment_provided'] },
      { id: 'travel_packages', name: 'Travel Packages', icon: 'Luggage', fulfillment_hint: 'booking_coordination', workflow_hint: 'booking_dispatch', fields: ['destinations_text', 'package_types', 'flight_included', 'visa_assistance', 'tour_languages'] },
    ]
  },
  {
    id: 'vehicle_services', name: 'Vehicle Services',
    icon: 'Wrench', color: '#475569', bg: '#f8fafc',
    desc: 'Car wash, tire service, battery, vehicle assistance and inspection',
    fulfillment_hint: 'service_dispatch_or_mobile', workflow_hint: 'booking_or_immediate',
    subcategories: [
      { id: 'car_wash', name: 'Car Wash', icon: 'Droplet', fulfillment_hint: 'in_location_or_mobile', workflow_hint: 'booking_or_immediate', fields: ['wash_types', 'mobile_service', 'subscription_plans', 'advance_booking_hrs'] },
      { id: 'tire_service', name: 'Tire Service', icon: 'Circle', fulfillment_hint: 'mobile_or_in_location', workflow_hint: 'booking_or_immediate', fields: ['tire_brands_text', 'mobile_service', 'emergency_callout', 'available_24hr'] },
      { id: 'battery_service', name: 'Battery Service', icon: 'Zap', fulfillment_hint: 'mobile_service', workflow_hint: 'booking_or_immediate', fields: ['mobile_service', 'emergency_callout', 'available_24hr', 'battery_brands_text'] },
      { id: 'vehicle_assistance', name: 'Vehicle Assistance', icon: 'ShieldAlert', fulfillment_hint: 'emergency_dispatch', workflow_hint: 'immediate_dispatch', fields: ['assistance_services', 'response_time_min', 'coverage_area_text', 'available_24hr'] },
      { id: 'vehicle_inspection', name: 'Vehicle Inspection', icon: 'ClipboardCheck', fulfillment_hint: 'mobile_or_in_location', workflow_hint: 'booking_dispatch', fields: ['inspection_types', 'mobile_inspection', 'report_provided', 'duration_min'] },
    ]
  },
  {
    id: 'wellness', name: 'Wellness',
    icon: 'Activity', color: '#7c3aed', bg: '#f5f3ff',
    desc: 'Spa, massage, gym, personal training and wellness coaching',
    fulfillment_hint: 'service_dispatch_or_in_location', workflow_hint: 'booking_dispatch',
    subcategories: [
      { id: 'spa', name: 'Spa', icon: 'Flower', fulfillment_hint: 'in_location_or_home', workflow_hint: 'booking_dispatch', fields: ['spa_services', 'session_durations', 'home_service', 'couples_packages', 'membership_available'] },
      { id: 'massage', name: 'Massage', icon: 'Sparkles', fulfillment_hint: 'in_location_or_home', workflow_hint: 'booking_dispatch', fields: ['massage_types', 'session_durations', 'home_service', 'couples_packages'] },
      { id: 'gym', name: 'Gym', icon: 'Dumbbell', fulfillment_hint: 'in_location', workflow_hint: 'membership_or_walk_in', fields: ['gym_facilities', 'available_24hr', 'personal_training_available', 'membership_types'] },
      { id: 'personal_training', name: 'Personal Training', icon: 'User', fulfillment_hint: 'service_dispatch_or_in_location', workflow_hint: 'booking_dispatch', fields: ['training_specializations', 'session_location', 'avg_session_duration', 'group_sessions'] },
    ]
  },
  {
    id: 'concierge_services', name: 'Concierge Services',
    icon: 'BellRing', color: '#b45309', bg: '#fffbeb',
    desc: 'Reservations, personal assistance, gift sourcing and VIP support',
    fulfillment_hint: 'service_coordination', workflow_hint: 'request_dispatch',
    subcategories: [
      { id: 'reservations', name: 'Reservations', icon: 'CalendarCheck', fulfillment_hint: 'service_coordination', workflow_hint: 'request_dispatch', fields: ['reservation_venue_types', 'advance_booking_hrs'] },
      { id: 'personal_assistance', name: 'Personal Assistance', icon: 'UserCheck', fulfillment_hint: 'service_dispatch', workflow_hint: 'request_dispatch', fields: ['response_time_hrs', 'corporate_clients', 'dedicated_account_mgr', 'retainer_ksh'] },
      { id: 'shopping_assistance', name: 'Shopping Assistance', icon: 'ShoppingCart', fulfillment_hint: 'service_dispatch', workflow_hint: 'request_dispatch', fields: ['response_time_hrs', 'corporate_clients'] },
      { id: 'gift_sourcing', name: 'Gift Sourcing', icon: 'Gift', fulfillment_hint: 'service_coordination', workflow_hint: 'request_dispatch', fields: ['advance_booking_hrs', 'corporate_clients', 'gift_wrapping'] },
      { id: 'travel_planning', name: 'Travel Planning', icon: 'Globe', fulfillment_hint: 'service_coordination', workflow_hint: 'request_dispatch', fields: ['destinations_coverage', 'visa_assistance', 'travel_insurance_assist'] },
      { id: 'property_coordination', name: 'Property Coordination', icon: 'Home', fulfillment_hint: 'service_coordination', workflow_hint: 'request_dispatch', fields: ['coverage_area_text', 'advance_booking_hrs', 'available_24hr'] },
      { id: 'moving_assistance', name: 'Moving Assistance', icon: 'Truck', fulfillment_hint: 'logistics_coordination', workflow_hint: 'booking_dispatch', fields: ['coverage_area_text', 'insurance_items', 'advance_booking_hrs', 'equipment_provided'] },
      { id: 'cleaning_coordination', name: 'Cleaning Coordination', icon: 'Brush', fulfillment_hint: 'service_coordination', workflow_hint: 'booking_dispatch', fields: ['coverage_area_text', 'recurring_sub', 'eco_products', 'advance_booking_hrs'] },
      { id: 'vip_assistance', name: 'VIP Assistance', icon: 'Crown', fulfillment_hint: 'priority_service_dispatch', workflow_hint: 'request_dispatch_priority', fields: ['vip_services_text', 'available_24hr', 'dedicated_account_mgr', 'retainer_model'] },
    ]
  },
  {
    id: 'logistics_shipping', name: 'Logistics & Shipping',
    icon: 'Ship', color: '#0d9488', bg: '#f0fdfa',
    desc: 'On-demand courier, cargo freight, container shipping and warehousing',
    fulfillment_hint: 'logistics_fulfillment', workflow_hint: 'logistics_dispatch',
    subcategories: [
      { id: 'sea_freight', name: 'Sea Freight', icon: 'Ship', fulfillment_hint: 'sea_cargo', workflow_hint: 'freight_dispatch', fields: ['shipping_ways', 'price_per_container', 'price_per_cbm', 'price_per_kg', 'port_to_warehouse_transport', 'warehouse_to_client_transport', 'shipping_times', 'insurance_included'] },
      { id: 'air_freight', name: 'Air Freight', icon: 'Plane', fulfillment_hint: 'air_cargo', workflow_hint: 'freight_dispatch', fields: ['shipping_ways', 'price_per_cbm', 'price_per_kg', 'port_to_warehouse_transport', 'warehouse_to_client_transport', 'shipping_times', 'custom_clearance', 'insurance_included'] },
      { id: 'road_freight', name: 'Road Freight & Trucking', icon: 'Truck', fulfillment_hint: 'road_cargo', workflow_hint: 'freight_dispatch', fields: ['shipping_ways', 'price_per_container', 'price_per_cbm', 'price_per_kg', 'port_to_warehouse_transport', 'warehouse_to_client_transport', 'shipping_times', 'fleet_size'] },
      { id: 'warehousing', name: 'Warehousing & Storage', icon: 'Warehouse', fulfillment_hint: 'storage_fulfillment', workflow_hint: 'storage_dispatch', fields: ['price_per_sqm', 'price_per_sqft', 'warehouse_capacity_sqft', 'insurance_included', 'operating_hours_text'] },
    ]
  },
];

export interface FieldDefinition {
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'toggle' | 'radio' | 'multicheck';
  placeholder?: string;
  hint?: string;
  options?: string[];
}

export const FIELD_DEFS: Record<string, FieldDefinition> = {
  price_per_container:          { label: 'Price per Container (KSh)', type: 'number', placeholder: 'e.g. 150000' },
  price_per_sqm:                { label: 'Price per Sq Metre (KSh)', type: 'number', placeholder: 'e.g. 1200' },
  price_per_sqft:               { label: 'Price per Square Foot (KSh)', type: 'number', placeholder: 'e.g. 150' },
  price_per_cbm:                { label: 'Price per Cubic Metre (CBM) (KSh)', type: 'number', placeholder: 'e.g. 8500' },
  price_per_kg:                 { label: 'Price per KG (KSh)', type: 'number', placeholder: 'e.g. 450' },
  shipping_times:               { label: 'Typical Shipping / Transit Time', type: 'text', placeholder: 'e.g. 5-7 business days, 14 days' },
  shipping_ways:                { label: 'Shipping Mode', type: 'radio', options: ['Air', 'Sea', 'Road'] },
  custom_clearance:             { label: 'Custom Clearance Assistance Offered?', type: 'toggle' },
  warehouse_capacity_sqft:      { label: 'Total Warehouse Capacity (sq ft)', type: 'number', placeholder: 'e.g. 15000' },
  port_to_warehouse_transport:  { label: 'Transport from Point of Entry to Warehouse', type: 'select', options: ['Road (Trucks)', 'Rail (SGR)', 'Air Cargo', 'None (Direct Delivery)'] },
  warehouse_to_client_transport: { label: 'Transport from Warehouse to Client', type: 'multicheck', options: ['Motorcycle (Boda Boda)', 'Van / Compact Car', '3-Ton Box Truck', '10-Ton Lorry', 'Rail / Other'] },

  // ── Common Delivery & Order ──
  delivery_radius:        { label: 'Delivery Radius (km)', type: 'number', placeholder: 'e.g. 10', hint: 'Maximum distance you deliver to' },
  min_order:              { label: 'Minimum Order (KSh)', type: 'number', placeholder: 'e.g. 500' },
  avg_prep_time:          { label: 'Average Preparation Time (minutes)', type: 'number', placeholder: 'e.g. 30' },
  advance_booking_hrs:    { label: 'Advance Booking Required (hours)', type: 'number', placeholder: 'e.g. 2' },
  advance_booking_days:   { label: 'Advance Booking Required (days)', type: 'number', placeholder: 'e.g. 3' },
  advance_order_hrs:      { label: 'Advance Order Window (hours)', type: 'number', placeholder: 'e.g. 24' },
  min_advance_order_hrs:  { label: 'Minimum Advance Order (hours)', type: 'number', placeholder: 'e.g. 48' },
  response_time_hrs:      { label: 'Response Time (hours)', type: 'number', placeholder: 'e.g. 1' },
  response_time_min:      { label: 'Target Response Time (minutes)', type: 'number', placeholder: 'e.g. 20' },
  coverage_area_text:     { label: 'Coverage Area', type: 'textarea', placeholder: 'List suburbs, towns or counties you serve...' },
  operating_hours_text:   { label: 'Operating Hours', type: 'textarea', placeholder: 'e.g. Mon-Fri 8am-5pm, Sat 9am-1pm' },

  // ── Age / Compliance ──
  age_gate_method:        { label: 'Age Verification Method', type: 'select', options: ['Digital ID Verification (App)', 'Physical ID Check on Delivery', 'Both'] },
  packaging_style:        { label: 'Packaging Style', type: 'select', options: ['Discreet / Plain Packaging', 'Standard Branded Packaging'] },
  signature_required:     { label: 'Require Signature on Delivery?', type: 'toggle' },
  liquor_license:         { label: 'Liquor License Number', type: 'text', placeholder: 'e.g. KE/LIC/XXXX' },
  license_number:         { label: 'Business / Product License Number', type: 'text', placeholder: 'License reference' },
  pharmacy_license_num:   { label: 'Pharmacy Regulatory License', type: 'text', placeholder: 'KMPDC / PPB License No.' },
  regulatory_license:     { label: 'Regulatory License / Authorization', type: 'text', placeholder: 'License / Approval Reference' },

  // ── Vehicles ──
  vehicle_types_transfer: { label: 'Vehicle Types Available', type: 'multicheck', options: ['Sedan', 'SUV', 'Van', 'Luxury Sedan', 'Minibus', 'Bus', 'Pickup'] },
  vehicle_types_rental:   { label: 'Vehicle Types in Fleet', type: 'multicheck', options: ['Sedan', 'SUV', '4×4', 'Van', 'Pickup', 'Minibus', 'Luxury'] },
  bike_types:             { label: 'Bike Types Available', type: 'multicheck', options: ['Scooter', 'Sports Bike', 'Cruiser', 'Mountain Bike', 'City Bike', 'Electric Bike'] },
  fleet_size:             { label: 'Total Fleet Size (units)', type: 'number', placeholder: 'e.g. 12' },
  min_rental_duration:    { label: 'Minimum Rental Duration', type: 'select', options: ['Hourly', 'Half Day', 'Full Day', 'Weekly', 'Monthly'] },
  with_driver:            { label: 'Option with Driver Available?', type: 'toggle' },
  insurance_included:     { label: 'Insurance Included in Rate?', type: 'toggle' },
  fuel_policy:            { label: 'Fuel Policy', type: 'select', options: ['Full-to-Full', 'Included in Rate', 'Pay per km'] },
  deposit_policy_text:    { label: 'Deposit / Security Policy', type: 'textarea', placeholder: 'Describe your deposit requirements...' },
  age_requirement:        { label: 'Minimum Driver Age', type: 'number', placeholder: 'e.g. 23' },
  billing_cycle:          { label: 'Billing Cycle', type: 'select', options: ['Monthly Invoice', 'Per-Trip Billing', 'Prepaid'] },
  flight_tracking:        { label: 'Flight Tracking Available?', type: 'toggle' },
  chauffeur_uniform:      { label: 'Chauffeur in Uniform?', type: 'toggle' },
  meet_greet_signage:     { label: 'Meet & Greet Signage Provided?', type: 'toggle' },
  waiting_time_min:       { label: 'Complimentary Waiting Time (minutes)', type: 'number', placeholder: 'e.g. 45' },

  // ── Food & Beverage ──
  cuisine_types:          { label: 'Cuisine Types', type: 'multicheck', options: ['African', 'Kenyan Traditional', 'Indian', 'Chinese', 'Italian', 'Grills & BBQ', 'Seafood', 'Continental', 'Mediterranean', 'Japanese', 'American', 'Middle Eastern', 'Vegan / Plant-Based'] },
  brewing_methods:        { label: 'Brewing Methods', type: 'multicheck', options: ['Espresso', 'Filter / Drip', 'Cold Brew', 'French Press', 'Pour Over', 'Aeropress', 'Chemex'] },
  table_service:          { label: 'Table Service Available?', type: 'toggle' },
  has_physical_seating:   { label: 'Physical Dine-in Seating?', type: 'toggle' },
  reservation_system:     { label: 'Online Reservations Available?', type: 'toggle' },
  drive_through:          { label: 'Drive-Through Available?', type: 'toggle' },
  family_meals:           { label: 'Family Meal Combos?', type: 'toggle' },
  wifi_available:         { label: 'Free Wi-Fi Available?', type: 'toggle' },
  coworking_space:        { label: 'Coworking / Work-Friendly Space?', type: 'toggle' },
  seated_capacity:        { label: 'Seated Capacity (persons)', type: 'number', placeholder: 'e.g. 40' },
  food_menu:              { label: 'Food Menu Available?', type: 'toggle' },
  bakery_specialties:     { label: 'Bakery Specialties', type: 'multicheck', options: ['Artisan Bread', 'Pastries', 'Cakes', 'Pies', 'Croissants', 'Gluten-Free', 'Vegan', 'Sourdough'] },
  dessert_specialties:    { label: 'Dessert Specialties', type: 'multicheck', options: ['Ice Cream', 'Gelato', 'Waffles', 'Crepes', 'Cheesecake', 'Puddings', 'Churros', 'Donuts'] },
  custom_orders:          { label: 'Custom Orders Accepted?', type: 'toggle' },
  cold_pressed:           { label: 'Cold-Pressed Juices?', type: 'toggle' },
  smoothie_bowls:         { label: 'Smoothie Bowls Available?', type: 'toggle' },
  vegan_menu:             { label: 'Fully Vegan / Plant-Based Menu?', type: 'toggle' },
  detox_programs:         { label: 'Detox / Cleanse Programs?', type: 'toggle' },
  number_of_brands:       { label: 'Number of Distinct Kitchen Brands', type: 'number', placeholder: 'e.g. 3' },
  pickup_available:       { label: 'Customer Self-Pickup Available?', type: 'toggle' },
  min_headcount:          { label: 'Minimum Headcount', type: 'number', placeholder: 'e.g. 20' },
  max_headcount:          { label: 'Maximum Headcount', type: 'number', placeholder: 'e.g. 500' },
  equipment_provided:     { label: 'Equipment / Setup Provided?', type: 'toggle' },
  staff_included:         { label: 'Service Staff Included?', type: 'toggle' },
  cold_delivery:          { label: 'Cold / Chilled Delivery Available?', type: 'toggle' },

  // ── Grocery ──
  express_delivery:       { label: 'Express / Same-Hour Delivery?', type: 'toggle' },
  operations_24hr:        { label: '24-Hour Operations?', type: 'toggle' },
  loyalty_program:        { label: 'Customer Loyalty Program?', type: 'toggle' },
  organic_options:        { label: 'Organic Options Available?', type: 'toggle' },
  farm_direct:            { label: 'Farm Direct / Farm-to-Table?', type: 'toggle' },
  subscription_boxes:     { label: 'Subscription Boxes Available?', type: 'toggle' },
  weekly_market:          { label: 'Weekly Market / Farmer\'s Market?', type: 'toggle' },
  custom_cuts:            { label: 'Custom Cuts on Request?', type: 'toggle' },
  halal_certified:        { label: 'Halal Certified?', type: 'toggle' },
  vacuum_sealed:          { label: 'Vacuum-Sealed Packaging?', type: 'toggle' },
  advance_order_required: { label: 'Advance Order Required?', type: 'toggle' },
  live_seafood:           { label: 'Live Seafood Available?', type: 'toggle' },
  on_site_processing:     { label: 'On-Site Processing?', type: 'toggle' },
  local_sourcing:         { label: 'Locally Sourced?', type: 'toggle' },
  zero_waste_packaging:   { label: 'Zero-Waste / Eco Packaging?', type: 'toggle' },

  // ── Fashion & Beauty ──
  brand_tier:             { label: 'Brand Positioning', type: 'select', options: ['Local / Kenyan Brand', 'Multi-Brand Store (Mixed)', 'International Brands Only', 'Mixed (Local + International)'] },
  size_range_adults:      { label: 'Size Range Offered', type: 'multicheck', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Plus Size', 'One Size'] },
  kids_age_range:         { label: 'Children\'s Age Range', type: 'multicheck', options: ['Newborn (0-3m)', 'Baby (3-12m)', 'Toddler (1-3yr)', 'Kids (3-7yr)', 'Tweens (7-14yr)'] },
  school_uniforms:        { label: 'School Uniforms Available?', type: 'toggle' },
  custom_tailoring:       { label: 'Custom Tailoring / Bespoke Available?', type: 'toggle' },
  style_consultation:     { label: 'Style Consultation Offered?', type: 'toggle' },
  return_policy:          { label: 'Return Policy', type: 'select', options: ['No Returns / All Sales Final', 'Exchange Only', 'Returns within 7 Days', 'Returns within 14 Days', 'Returns within 30 Days'] },
  packaging_fashion:      { label: 'Packaging & Presentation', type: 'select', options: ['Standard Packaging', 'Branded Gift Box', 'Gift Wrapping Available', 'Custom / Luxury Packaging'] },
  shoe_size_system:       { label: 'Shoe Size System', type: 'multicheck', options: ['UK Sizes', 'US Sizes', 'EU Sizes', 'African Sizes'] },
  authenticity_guarantee: { label: 'Authenticity Guarantee / Certificate?', type: 'toggle' },
  warranty_offered:       { label: 'Warranty Offered?', type: 'toggle' },
  warranty_months:        { label: 'Warranty Duration (months)', type: 'number', placeholder: 'e.g. 12' },
  has_physical_store:     { label: 'Physical Store Location?', type: 'toggle' },
  home_service:           { label: 'Home Service / Home Visits?', type: 'toggle' },
  home_visits:            { label: 'Home Visit Service Available?', type: 'toggle' },
  products_for_sale:      { label: 'Retail Products for Sale?', type: 'toggle' },
  booking_required:       { label: 'Prior Booking Required?', type: 'toggle' },
  professional_artists:   { label: 'Professional Artists on Staff?', type: 'toggle' },
  bridal_packages:        { label: 'Bridal / Wedding Packages?', type: 'toggle' },
  event_makeup:           { label: 'On-Location Event Makeup?', type: 'toggle' },
  skin_types_served:      { label: 'Skin Types Served', type: 'multicheck', options: ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive', 'All Skin Types'] },
  dermatologist_backed:   { label: 'Dermatologist-Formulated / Backed?', type: 'toggle' },
  custom_routine_consult: { label: 'Custom Skincare Routine Consultation?', type: 'toggle' },
  hair_types_served:      { label: 'Hair Types Served', type: 'multicheck', options: ['Natural / Afro', 'Relaxed', 'Braids / Twists', 'Locs', 'Extensions / Weaves', 'Wigs', 'Straight'] },
  fragrance_families:     { label: 'Fragrance Families', type: 'multicheck', options: ['Floral', 'Woody', 'Fresh / Aquatic', 'Oriental', 'Citrus', 'Spicy / Warm', 'Gourmand'] },
  own_brand:              { label: 'Own Proprietary Brand?', type: 'toggle' },
  multi_brand:            { label: 'Multi-Brand Store?', type: 'toggle' },

  // ── Alcohol ──
  wine_origins:           { label: 'Wine Origins / Regions', type: 'multicheck', options: ['Kenyan', 'South African', 'French', 'Italian', 'Spanish', 'Chilean', 'Australian', 'Argentinian', 'US'] },
  returnable_bottles:     { label: 'Returnable Bottle Program?', type: 'toggle' },
  brands_stocked_text:    { label: 'Key Brands / Products', type: 'text', placeholder: 'List your main brands...' },
  occasions_spec:         { label: 'Occasion Specializations', type: 'multicheck', options: ['Weddings', 'Birthdays', 'Corporate Events', 'Anniversaries', 'Valentine\'s', 'General / All'] },

  // ── Adults Only ──
  vape_device_types:      { label: 'Vape Device Types', type: 'multicheck', options: ['Disposables', 'Pod Systems', 'Box Mods', 'E-Liquids / E-Juices', 'Accessories'] },

  // ── Gifts & Flowers ──
  fresh_or_preserved:     { label: 'Flower Type', type: 'select', options: ['Fresh Only', 'Preserved / Dried Only', 'Both Fresh & Preserved'] },
  subscription_bouquets:  { label: 'Subscription Bouquets?', type: 'toggle' },
  same_day_delivery:      { label: 'Same-Day Delivery?', type: 'toggle' },
  custom_messages:        { label: 'Custom Message Cards?', type: 'toggle' },
  custom_curation:        { label: 'Custom / Bespoke Hamper Curation?', type: 'toggle' },
  corporate_gifting:      { label: 'Corporate Gifting / Bulk Orders?', type: 'toggle' },
  hamper_price_ranges:    { label: 'Hamper Price Ranges', type: 'multicheck', options: ['Under KSh 1,000', 'KSh 1,000–3,000', 'KSh 3,000–5,000', 'KSh 5,000–10,000', 'KSh 10,000+'] },
  custom_cake_design:     { label: 'Custom Cake Design Available?', type: 'toggle' },
  dietary_options_cake:   { label: 'Dietary Options', type: 'multicheck', options: ['Regular', 'Gluten-Free', 'Vegan', 'Sugar-Free / Diabetic-Friendly', 'Dairy-Free', 'Nut-Free'] },
  gift_wrapping:          { label: 'Gift Wrapping Available?', type: 'toggle' },
  gift_packaging:         { label: 'Discreet / Gift Packaging?', type: 'toggle' },
  subscription_available: { label: 'Subscription Service Available?', type: 'toggle' },

  // ── Experiences ──
  avg_attendees:          { label: 'Average Attendees per Event', type: 'number', placeholder: 'e.g. 500' },
  ticket_delivery_method: { label: 'Ticket Delivery Method', type: 'select', options: ['Digital / QR Code Only', 'Physical Tickets', 'Both'] },
  vip_packages:           { label: 'VIP Packages Available?', type: 'toggle' },
  capacity_range:         { label: 'Venue Capacity', type: 'select', options: ['Under 50 persons', '50–200 persons', '200–500 persons', '500–1,000 persons', '1,000+ persons'] },
  av_equipment:           { label: 'AV Equipment Included?', type: 'toggle' },
  catering_available:     { label: 'Catering Available / Partnered?', type: 'toggle' },
  event_planning_offered: { label: 'Event Planning Services?', type: 'toggle' },
  venue_sourcing:         { label: 'Venue Sourcing / Recommendations?', type: 'toggle' },
  session_duration_text:  { label: 'Session Duration Options', type: 'text', placeholder: 'e.g. 1hr, 2hr, Half-Day, Full-Day' },
  max_group_size:         { label: 'Maximum Group Size', type: 'number', placeholder: 'e.g. 20' },
  recurring_sessions:     { label: 'Recurring / Series Sessions?', type: 'toggle' },

  // ── Financial ──
  fin_services_offered_bank: { label: 'Banking Services Offered', type: 'multicheck', options: ['Savings Accounts', 'Current Accounts', 'Loans', 'Mortgages', 'Money Transfers', 'Fixed Deposits', 'Mobile Banking'] },
  currencies_traded:      { label: 'Currencies Traded', type: 'multicheck', options: ['USD', 'EUR', 'GBP', 'KES', 'TZS', 'UGX', 'RWF', 'INR', 'CNY', 'AED', 'ZAR'] },
  insurance_types:        { label: 'Insurance Types', type: 'multicheck', options: ['Motor', 'Life', 'Health', 'Property', 'Travel', 'Crop / Agricultural', 'Business / Commercial'] },
  payment_channels:       { label: 'Payment Channels', type: 'multicheck', options: ['M-Pesa', 'Airtel Money', 'Bank Transfer', 'Card (Visa/Mastercard)', 'Crypto', 'RTGS / EFT'] },
  remittance_corridors:   { label: 'Remittance Corridors', type: 'multicheck', options: ['Kenya–USA', 'Kenya–UK', 'Kenya–UAE', 'Kenya–Tanzania', 'Kenya–Uganda', 'Other Africa'] },
  sacco_services_offered: { label: 'Sacco Services', type: 'multicheck', options: ['Savings', 'Loans', 'Dividends', 'FOSA', 'Mobile Banking', 'Investment Products'] },
  biz_services_offered:   { label: 'Business Services', type: 'multicheck', options: ['Accounting', 'Legal', 'HR', 'Payroll', 'Tax Filing', 'Business Registration', 'Compliance'] },
  physical_locations_count: { label: 'Number of Physical Locations/Branches', type: 'number', placeholder: 'e.g. 3' },
  digital_platform:       { label: 'Digital Platform / App Available?', type: 'toggle' },

  // ── Laundry & Cleaning ──
  pickup_delivery:        { label: 'Pickup & Delivery Available?', type: 'toggle' },
  turnaround_time:        { label: 'Standard Turnaround Time', type: 'select', options: ['Same Day (Express)', '24 Hours', '48 Hours', '72 Hours', '5–7 Days'] },
  per_kg_pricing:         { label: 'Per-Kilogram Pricing?', type: 'toggle' },
  per_item_pricing:       { label: 'Per-Item Pricing?', type: 'toggle' },
  weight_limit:           { label: 'Maximum Weight per Order (kg)', type: 'number', placeholder: 'e.g. 20' },
  garment_types:          { label: 'Garment Types Accepted', type: 'multicheck', options: ['Everyday Clothing', 'Suits / Formal', 'Leather / Suede', 'Silk / Delicates', 'Curtains / Drapes', 'Bedding', 'Shoes'] },
  one_time_bookings:      { label: 'One-Time Bookings Accepted?', type: 'toggle' },
  recurring_sub:          { label: 'Recurring Subscription Available?', type: 'toggle' },
  eco_products:           { label: 'Eco-Friendly / Green Products Used?', type: 'toggle' },
  min_hours_session:      { label: 'Minimum Hours per Session', type: 'number', placeholder: 'e.g. 3' },

  // ── Marketplace ──
  product_description:    { label: 'Product Range Description', type: 'textarea', placeholder: 'Brief description of your main products...' },
  new_or_used:            { label: 'Condition', type: 'select', options: ['New Only', 'Used / Pre-Owned Only', 'Both New and Used'] },
  new_or_refurbished:     { label: 'Condition', type: 'select', options: ['New Only', 'Refurbished / Certified Pre-Owned', 'Both'] },
  fragile_handling:       { label: 'Fragile / Special Handling Required?', type: 'toggle' },
  installation_service:   { label: 'Installation / Assembly Service?', type: 'toggle' },
  book_genres:            { label: 'Book Genres / Categories', type: 'multicheck', options: ['Fiction', 'Non-Fiction', 'Academic', 'Children\'s', 'Self-Help', 'Business', 'Religion / Spirituality', 'Comics / Graphic Novels'] },
  corporate_billing:      { label: 'Corporate / Bulk Billing Available?', type: 'toggle' },

  // ── Pharmacy & Health ──
  pharmacist_on_duty:     { label: 'Qualified Pharmacist On-Duty?', type: 'toggle' },
  prescription_delivery:  { label: 'Prescription Delivery Available?', type: 'toggle' },
  cold_chain_meds:        { label: 'Cold-Chain Medicines Stocked?', type: 'toggle' },
  med_supply_types:       { label: 'Medical Supply Categories', type: 'multicheck', options: ['Surgical Supplies', 'Diagnostic Equipment', 'Mobility Aids', 'Hospital Furniture', 'Lab Consumables'] },
  baby_product_range:     { label: 'Baby Product Range', type: 'multicheck', options: ['Diapers / Nappies', 'Formula / Milk', 'Baby Clothing', 'Toys', 'Feeding Accessories', 'Safety Products', 'Baby Furniture'] },
  supplement_categories:  { label: 'Supplement Categories', type: 'multicheck', options: ['Vitamins & Minerals', 'Proteins & Amino Acids', 'Sports Nutrition', 'Herbal / Natural', 'Weight Management', 'General Wellness', 'Immune Support'] },
  clinic_specializations: { label: 'Medical Specializations', type: 'multicheck', options: ['General Practice', 'Pediatrics', 'Dermatology', 'Gynecology & Obstetrics', 'Ophthalmology', 'Orthopedics', 'Dental', 'ENT', 'Cardiology', 'Oncology', 'Psychiatry'] },
  appointment_booking:    { label: 'Online Appointment Booking?', type: 'toggle' },
  walk_in_available:      { label: 'Walk-In Patients Accepted?', type: 'toggle' },
  insurance_accepted:     { label: 'Medical Insurance Accepted', type: 'multicheck', options: ['SHA / NHIF', 'AAR Healthcare', 'Jubilee Insurance', 'Britam', 'CIC Insurance', 'APA Life', 'Madison Insurance', 'Self-Pay / Cash'] },
  tele_platforms:         { label: 'Telemedicine Platforms Used', type: 'multicheck', options: ['Mobile App', 'Web Portal', 'WhatsApp', 'Video Call (Zoom/Teams)', 'Phone Consultation'] },
  available_24hr:         { label: '24-Hour Availability?', type: 'toggle' },
  lab_test_types:         { label: 'Lab Test Types', type: 'multicheck', options: ['Full Blood Count', 'Urinalysis', 'Imaging (X-Ray / Ultrasound)', 'DNA Testing', 'Allergy Tests', 'Hormone Panels', 'COVID-19 / PCR', 'STI / STD Testing', 'Cancer Markers'] },
  home_sample_collection: { label: 'Home Sample Collection Available?', type: 'toggle' },
  results_turnaround_hrs: { label: 'Results Turnaround Time (hours)', type: 'number', placeholder: 'e.g. 24' },
  therapy_types:          { label: 'Therapy Modalities Offered', type: 'multicheck', options: ['Cognitive Behavioural (CBT)', 'Dialectical Behaviour (DBT)', 'Art Therapy', 'Talk / Psychotherapy', 'Group Therapy', 'Couples Therapy', 'Trauma-Focused', 'Mindfulness-Based'] },
  session_format:         { label: 'Session Format', type: 'multicheck', options: ['In-Person', 'Online (Video)', 'Phone', 'Group Session'] },
  avg_session_duration:   { label: 'Average Session Duration (minutes)', type: 'number', placeholder: 'e.g. 60' },
  coaching_areas:         { label: 'Coaching Specializations', type: 'multicheck', options: ['Life Coaching', 'Career Coaching', 'Business / Entrepreneurship', 'Executive Leadership', 'Wellness & Health', 'Relationship / Dating', 'Financial Coaching'] },
  group_sessions:         { label: 'Group Sessions Available?', type: 'toggle' },

  // ── Tech ──
  phone_brands:           { label: 'Phone Brands Stocked', type: 'multicheck', options: ['Apple (iPhone)', 'Samsung', 'Huawei', 'Tecno', 'Infinix', 'Oppo', 'Xiaomi', 'Nokia', 'Motorola'] },
  computer_brands:        { label: 'Computer Brands Stocked', type: 'multicheck', options: ['HP', 'Dell', 'Lenovo', 'Apple (Mac)', 'Asus', 'Acer', 'Microsoft Surface', 'MSI'] },
  repair_services:        { label: 'Repair Services Available?', type: 'toggle' },
  trade_in_program:       { label: 'Trade-In Program?', type: 'toggle' },
  console_types:          { label: 'Gaming Platforms', type: 'multicheck', options: ['PlayStation (PS5/PS4)', 'Xbox', 'Nintendo Switch', 'PC Gaming', 'Mobile Gaming', 'Retro / Classic'] },
  pre_owned_games:        { label: 'Pre-Owned Games?', type: 'toggle' },
  gaming_accessories:     { label: 'Gaming Accessories Stocked?', type: 'toggle' },
  telecom_services_offered: { label: 'Telecom Services', type: 'multicheck', options: ['SIM Cards', 'Airtime & Data', 'Handsets / Devices', 'Fibre / Home Internet', 'Business Lines', 'Roaming Packages'] },
  telecom_networks:       { label: 'Network Operators', type: 'multicheck', options: ['Safaricom', 'Airtel Kenya', 'Telkom Kenya', 'Faiba (JTL)', 'ZUKU', 'Starlink'] },

  // ── Travel ──
  parks_covered:          { label: 'National Parks / Reserves Covered', type: 'multicheck', options: ['Maasai Mara', 'Amboseli', 'Tsavo East & West', 'Samburu', 'Lake Nakuru', 'Ol Pejeta', 'Aberdares', 'Mount Kenya', 'Lake Naivasha', 'Diani / Coast'] },
  accommodation_included: { label: 'Accommodation Included?', type: 'toggle' },
  meal_plan:              { label: 'Meal Plan', type: 'select', options: ['Not Included', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive'] },
  min_nights:             { label: 'Minimum Nights', type: 'number', placeholder: 'e.g. 2' },
  private_vehicle:        { label: 'Private 4×4 Vehicle Option?', type: 'toggle' },
  tour_modes:             { label: 'Tour Modes', type: 'multicheck', options: ['Walking Tour', 'Vehicle Tour', 'Cycling / Bike', 'Hiking / Trekking', 'Boat / Water', 'Combination'] },
  duration_options:       { label: 'Duration Options', type: 'multicheck', options: ['2-Hour Tour', 'Half Day (4hrs)', 'Full Day (8hrs)', 'Multi-Day'] },
  guide_included:         { label: 'Professional Guide Included?', type: 'toggle' },
  tour_languages:         { label: 'Languages Available', type: 'multicheck', options: ['English', 'Swahili', 'French', 'German', 'Italian', 'Spanish', 'Chinese', 'Arabic'] },
  destinations_text:      { label: 'Destinations Covered', type: 'textarea', placeholder: 'List destinations, countries or regions...' },
  package_types:          { label: 'Package Types', type: 'multicheck', options: ['Honeymoon / Romantic', 'Family Holiday', 'Solo Traveller', 'Corporate / Team', 'Group Tours', 'Adventure', 'Luxury'] },
  flight_included:        { label: 'Flights Included?', type: 'toggle' },
  visa_assistance:        { label: 'Visa Assistance Offered?', type: 'toggle' },
  travel_insurance_assist: { label: 'Travel Insurance Assistance?', type: 'toggle' },
  destinations_coverage:  { label: 'Destinations Coverage', type: 'select', options: ['Kenya Only', 'East Africa', 'All of Africa', 'International (Worldwide)'] },

  // ── Vehicle Services ──
  wash_types:             { label: 'Wash Services Offered', type: 'multicheck', options: ['Exterior Wash', 'Interior Clean', 'Full Valet', 'Steam Clean', 'Engine Bay Clean', 'Hand Wax / Polish', 'Ceramic Coating'] },
  mobile_service:         { label: 'Mobile / On-Site Service Available?', type: 'toggle' },
  subscription_plans:     { label: 'Subscription Plans Available?', type: 'toggle' },
  tire_brands_text:       { label: 'Tire Brands Stocked', type: 'text', placeholder: 'e.g. Michelin, Bridgestone, Dunlop...' },
  battery_brands_text:    { label: 'Battery Brands Stocked', type: 'text', placeholder: 'e.g. Bosch, Exide, Amaron...' },
  emergency_callout:      { label: 'Emergency Call-Out Available?', type: 'toggle' },
  assistance_services:    { label: 'Assistance Services', type: 'multicheck', options: ['Vehicle Towing', 'Jump Start', 'Fuel Delivery', 'Flat Tyre Change', 'Lockout Assistance', 'Accident Support', 'Battery Service'] },
  inspection_types:       { label: 'Inspection Types', type: 'multicheck', options: ['Pre-Purchase Inspection', 'NTSA Roadworthiness', 'Insurance Inspection', 'General Maintenance Check'] },
  mobile_inspection:      { label: 'Mobile / On-Site Inspection?', type: 'toggle' },
  report_provided:        { label: 'Inspection Report Provided?', type: 'toggle' },
  duration_min:           { label: 'Typical Duration (minutes)', type: 'number', placeholder: 'e.g. 45' },

  // ── Wellness ──
  spa_services:           { label: 'Spa Services Offered', type: 'multicheck', options: ['Swedish Massage', 'Deep Tissue Massage', 'Hot Stone Therapy', 'Aromatherapy', 'Facial / Skin Treatment', 'Body Scrub / Wrap', 'Manicure & Pedicure', 'Reflexology', 'Waxing'] },
  massage_types:          { label: 'Massage Types', type: 'multicheck', options: ['Swedish / Relaxation', 'Deep Tissue', 'Sports Massage', 'Prenatal Massage', 'Hot Stone', 'Aromatherapy', 'Thai Massage', 'Reflexology'] },
  session_durations:      { label: 'Session Duration Options', type: 'multicheck', options: ['30 minutes', '60 minutes', '90 minutes', '120 minutes', 'Custom / Half-Day'] },
  couples_packages:       { label: 'Couples Packages?', type: 'toggle' },
  membership_available:   { label: 'Membership / Monthly Plans?', type: 'toggle' },
  gym_facilities:         { label: 'Gym Facilities Available', type: 'multicheck', options: ['Free Weights / Dumbbells', 'Cardio Machines', 'Swimming Pool', 'Sauna / Steam Room', 'Yoga Studio', 'Spin / Cycle Class', 'CrossFit', 'Boxing / Martial Arts', 'Pilates'] },
  personal_training_available: { label: 'Personal Training Available?', type: 'toggle' },
  membership_types:       { label: 'Membership Options', type: 'multicheck', options: ['Day Pass', 'Weekly', 'Monthly', 'Quarterly', 'Annual', 'Corporate'] },
  training_specializations: { label: 'Training Specializations', type: 'multicheck', options: ['Weight Loss', 'Muscle Building', 'Athletic / Sports Performance', 'Rehabilitation', 'Prenatal Fitness', 'Senior Fitness', 'Youth / Kids'] },
  session_location:       { label: 'Training Session Locations', type: 'multicheck', options: ['In Gym', 'Home Visit', 'Outdoor / Park', 'Online / Virtual'] },

  // ── Concierge ──
  reservation_venue_types: { label: 'Reservation Types', type: 'multicheck', options: ['Restaurant Reservations', 'Hotel Bookings', 'Event Tickets', 'Travel Bookings', 'Hospitality & Experiences', 'VIP Access'] },
  dedicated_account_mgr:  { label: 'Dedicated Account Manager?', type: 'toggle' },
  corporate_clients:      { label: 'Corporate Clients Served?', type: 'toggle' },
  retainer_ksh:           { label: 'Monthly Retainer (KSh)', type: 'number', placeholder: 'e.g. 10000' },
  retainer_model:         { label: 'Retainer / Subscription Model?', type: 'toggle' },
  vip_services_text:      { label: 'VIP Service Description', type: 'textarea', placeholder: 'Describe your VIP and exclusive services...' },
  insurance_items:        { label: 'Insurance for Items During Move?', type: 'toggle' },
};

export const SUGGESTED_SECTIONS: Record<string, string[]> = {
  adults_only: [
    "Adult Products", "Adult Wellness", "Cigarettes", "Cigars", "Vapes",
    "Adult Accessories", "E-Liquids", "Hookah & Shisha", "Rolling Papers",
    "Intimate Care", "Novelty Items", "Lighters & Cutters", "Gift Sets",
    "New Arrivals", "Best Sellers"
  ],
  airport_transfers: [
    "Airport Pickup", "Airport Drop-off", "Executive Transfers", "Meet & Greet",
    "VIP Lounge Access", "Group Shuttles", "Hourly Chauffeur", "Luxury Sedans",
    "Premium SUVs", "Coasters & Buses", "Luggage Services", "Child Seat Add-ons",
    "Corporate Accounts", "Last Minute Booking", "Round Trip Transfers"
  ],
  alcohol_beverages: [
    "Wine & Prosecco", "Spirits & Liquors", "Beer & Cider", "Champagne",
    "Cocktail Mixers", "Ice & Cups", "Soft Drinks & Juices", "Tonic & Club Soda",
    "Non-Alcoholic Drinks", "Bar Accessories", "Whisky & Bourbon", "Gin & Vodka",
    "Tequila & Liqueur", "Corporate Gift Packs", "Snack Pairings"
  ],
  fashion_apparel: [
    "New Arrivals", "Men's Apparel", "Women's Apparel", "Kids Fashion",
    "Footwear & Shoes", "Bags & Purses", "Watches & Clocks", "Accessories",
    "Jewelry", "Activewear", "Best Sellers", "Clearance Sale",
    "Gift Cards", "Matching Sets", "Seasonal Collections"
  ],
  beauty: [
    "Makeup & Cosmetics", "Skincare Products", "Haircare Essentials", "Fragrances",
    "Nail Care", "Body & Bath Care", "Grooming Tools", "Organic & Clean Beauty",
    "Bridal Packages", "Men's Grooming", "Bath & Shower", "Gift Sets",
    "Travel Minis", "Best Sellers", "Sunscreen & SPF"
  ],
  vehicle_rentals: [
    "Economy Cars", "Luxury Sedans", "SUVs & 4x4s", "Motorcycles & Bikes",
    "Scooters", "Vans & Buses", "Self-Drive Rentals", "Chauffeur Service",
    "Corporate Hire", "Wedding Car Hire", "Airport Shuttles", "Long-Term Rentals",
    "Camping Vehicles", "Child Seat Add-on", "Full Insurance Cover"
  ],
  experiences: [
    "Concerts & Gigs", "Festivals & Shows", "Conferences & Seminars", "Corporate Events",
    "Private Parties", "Photography Sessions", "Art Workshops", "Cooking Classes",
    "Outdoor Activities", "Hiking & Safaris", "Amusement Parks", "Spa Vouchers",
    "Weekend Getaways", "Food Tours", "Custom Itineraries"
  ],
  financial_services: [
    "Checking Accounts", "Savings Accounts", "Mobile Banking", "Forex & Exchange",
    "Business Loans", "Personal Insurance", "Life Insurance", "Mobile Payments",
    "Sacco Services", "Investment Funds", "Financial Consulting", "Tax Assistance",
    "Remittances", "Debit Cards", "Treasury Services"
  ],
  flowers_gifts: [
    "Birthday Bouquets", "Anniversary Flowers", "Gift Hampers", "Custom Cakes",
    "Chocolates & Sweets", "Plush Toys & Bears", "Personalized Cards", "Corporate Gifting",
    "Sympathy Flowers", "Romantic Arrangements", "Fruit Baskets", "Rose Bouquets",
    "Balloon Bouquets", "Newborn Gifts", "Get Well Soon"
  ],
  restaurants_food: [
    "Appetizers & Starters", "Main Course", "Chef's Specials", "Desserts",
    "Beverages & Drinks", "Fast Food & Burgers", "Combos & Family Deals", "Salads & Soups",
    "Vegetarian & Vegan", "Kids Menu", "Breakfast & Brunch", "Bakery & Bread",
    "Hot Coffees & Teas", "Fresh Juices", "Side Orders"
  ],
  groceries_essentials: [
    "Fresh Vegetables", "Fresh Fruits", "Bakery & Bread", "Milk & Dairy",
    "Meat & Poultry", "Fresh Seafood", "Pantry Staples", "Snacks & Sweets",
    "Beverages & Soft Drinks", "Personal Care & Toiletries", "Baby Care", "Pet Food & Care",
    "Household Cleaning", "Frozen Foods", "Health & Wellness"
  ],
  laundry_cleaning: [
    "Wash & Fold", "Wash & Iron", "Dry Cleaning", "Ironing Only",
    "Duvets & Bedding", "Carpet Cleaning", "Curtain Cleaning", "Shoe Cleaning",
    "Express Service", "Home Deep Cleaning", "Office Deep Cleaning", "Upholstery Wash",
    "Window Cleaning", "Post-Construction Clean", "Eco-Friendly Wash"
  ],
  marketplace: [
    "Living Room Furniture", "Bedroom Furniture", "Office Furniture", "Kitchen Appliances",
    "Home Decor", "Cookware & Tableware", "Books & Novels", "Stationery & Notebooks",
    "School Supplies", "Gardening Tools", "Lighting & Lamps", "Storage & Organization",
    "Smart Home Devices", "Toys & Hobbies", "Eco Products"
  ],
  pharmacy: [
    "Prescription Meds", "OTC Pain Relief", "Cold & Flu", "Vitamins & Supplements",
    "Baby Care & Formula", "Personal Hygiene", "First Aid & Bandages", "Sexual Health",
    "Skincare & Dermo", "Medical Devices", "Chronic Meds", "Hair Care Products",
    "Wellness Teas", "Immunity Boosters", "Travel Kits"
  ],
  health: [
    "General Consultation", "Specialist Check-up", "Telemedicine Consult", "Lab Blood Tests",
    "Rapid Diagnostic Tests", "Individual Therapy", "Couples Therapy", "Life Coaching",
    "Executive Coaching", "Nutritional Plans", "Virtual Fitness Sessions", "Vaccinations",
    "Medical Reports", "Home Care Visits", "Second Opinion Consults"
  ],
  tech_electronics: [
    "Smartphones", "Laptops & Computers", "Tablets & iPads", "Smartwatches",
    "Gaming Consoles", "Headphones & Earbuds", "Bluetooth Speakers", "Power Banks",
    "Chargers & Cables", "External Storage", "Keyboard & Mouse", "Monitors & Screens",
    "Smart Home Hubs", "Security Cameras", "Repair & Tech Services"
  ],
  travel_tours: [
    "Wildlife Safaris", "Day Trips & Excursions", "City Sightseeing", "Cultural Heritage",
    "Mountain Climbing", "Water Sports", "Honeymoon Packages", "Group Travel Deals",
    "Budget Holidays", "Luxury Escapes", "Flight Bookings", "Hotel Reservations",
    "Visa Consulting", "Travel Insurance", "Custom Itineraries"
  ],
  vehicle_services: [
    "Body Wash & Polish", "Interior Detailing", "Engine Wash", "Wheel Alignment",
    "Tire Changing & Balancing", "Battery Check & Service", "Jumpstart Assistance", "Engine Tune-up",
    "Brake Pads & Service", "Windscreen Repair", "Emergency Towing", "Pre-Purchase Inspection",
    "Paint Correction", "Headlight Restoration", "A/C Gas Refill"
  ],
  wellness: [
    "Deep Tissue Massage", "Aromatherapy", "Facial Treatment", "Body Scrub & Polish",
    "Gym Day Pass", "Monthly Gym Membership", "Personal Training", "Yoga Classes",
    "Meditation Sessions", "Nutritional Consulting", "Weight Loss Coaching", "Detox Programs",
    "Pilates", "Sports Massage", "Physiotherapy"
  ],
  concierge_services: [
    "Restaurant Booking", "Event Ticket Sourcing", "Personal Assistant Hire", "Shopping Errands",
    "Gift Selection", "Travel Coordination", "Moving & Relocation", "Home Deep Clean Coord.",
    "VIP Fast Track", "Document Delivery", "Pet Sitting & Walking", "Flower Delivery Arrangement",
    "Wine Selection Service", "Airport Meet & Greet", "Custom Concierge Request"
  ],
  logistics_shipping: [
    "FCL (Full Container)", "LCL (Less than Container)", "Air Cargo Express",
    "Sea Freight Cargo", "Road Haulage & Trucking", "Warehouse Storage Slots",
    "Pallet Storage", "Customs Clearance Services", "Cold Chain Logistics",
    "Last-Mile Dispatch", "Dangerous Goods Handling", "Documentation & Permits",
    "Cross-Border Shipping", "Insurance Cover", "Order Fulfillment"
  ]
};
