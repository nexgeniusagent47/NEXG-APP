-- ====================================================================
-- NEXG CONCIERGE PLATFORM - SEED DATA FOR POSTGRESQL
-- Contains 21 Categories, Subcategories, Verified Merchants & Menu Items
-- ====================================================================

-- Clean prior seed data if needed
TRUNCATE TABLE items CASCADE;
TRUNCATE TABLE merchant_subcategories CASCADE;
TRUNCATE TABLE merchants CASCADE;
TRUNCATE TABLE subcategories CASCADE;
TRUNCATE TABLE categories CASCADE;

-- 1. INSERT 21 MAIN CATEGORIES
INSERT INTO categories (id, name, slug, description, icon_name, image_url, display_order) VALUES
('restaurants', 'Restaurants & Fine Dining', 'restaurants', 'Michelin-standard culinary creations, private chef dining & beachfront bistros', 'UtensilsCrossed', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 1),
('groceries', 'Gourmet Groceries & Essentials', 'groceries', 'Artisanal provisions, fresh organic produce & imported gourmet ingredients', 'Apple', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', 2),
('alcohol_beverages', 'Cellar, Champagne & Spirits', 'alcohol-beverages', 'Rare vintages, single malt scotch, vintage Dom Pérignon & sommelier pairings', 'Wine', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', 3),
('wellness_spa', 'Wellness & Spa Treatments', 'wellness-spa', 'In-suite holistic massages, volcanic stone therapy & private aesthetic treatments', 'Flower2', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', 4),
('transport_vip', 'VIP Chauffeur & Transfers', 'transport-vip', 'Airport tarmac transfers, armored Maybach sedans & helicopter charters', 'Car', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', 5),
('pharmacy_health', 'Health, Pharmacy & Medical', 'pharmacy-health', '24/7 prescription medications, wellness drips & pediatric essentials', 'HeartPulse', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 6),
('beauty_care', 'Luxury Beauty & Cosmetics', 'beauty-care', 'High-end skincare, niche perfumes, hair styling & salon care', 'Sparkles', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 7),
('bakery_pastry', 'Artisan Bakery & Patisserie', 'bakery-pastry', 'Fresh French morning viennoiserie, sourdough loaves & handcrafted desserts', 'Coffee', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 8),
('flowers_gifts', 'Boutique Flowers & Gifting', 'flowers-gifts', 'Hand-tied fresh flower bouquets, luxury gift hampers & bespoke celebration items', 'Gift', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80', 9),
('tech_electronics', 'Tech, Electronics & Travel Gear', 'tech-electronics', 'Noise-canceling headphones, chargers, high-speed travel gadgets & drone accessories', 'Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 10),
('baby_kids', 'Baby & Kids Essentials', 'baby-kids', 'Premium organic baby nutrition, diapers, strollers & resort toy sets', 'Baby', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80', 11),
('pet_luxury', 'Pet Supply & Gourmet Treats', 'pet-supply', 'Nutritional organic pet delicacies, designer accessories & grooming kits', 'Dog', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', 12),
('home_living', 'Home, Villa Amenities & Living', 'home-living', 'Egyptian cotton linens, scented diffusers & resort accessories', 'Home', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', 13),
('fashion_apparel', 'Designer Fashion & Resortwear', 'fashion-apparel', 'Swimwear, silk kaftans, designer sunglasses & luxury leather goods', 'Shirt', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', 14),
('fitness_sports', 'Sports, Fitness & Gym Gear', 'fitness-sports', 'Yoga mats, resistance bands, private fitness trainers & supplements', 'Dumbbell', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', 15),
('art_jewelry', 'Fine Jewelry & Watches', 'fine-jewelry', 'Diamond statement pieces, certified pre-owned timepieces & bespoke creations', 'Gem', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 16),
('tobacco_cigars', 'Fine Cigars & Tobacco', 'fine-cigars', 'Cuban Cohiba cigars, Spanish cedar humidors & torch lighters', 'Flame', 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80', 17),
('books_stationery', 'Books, Journals & Stationery', 'books-stationery', 'International bestsellers, coffee table luxury books & fountain pens', 'BookOpen', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80', 18),
('events_experiences', 'Curated Experiences & Safaris', 'experiences', 'Hot air balloon safaris over the savannah, private yacht charters & wine tastings', 'Compass', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80', 19),
('office_print', 'Business Concierge & Printing', 'business-print', 'Same-hour confidential document printing, notarization & meeting gear', 'Briefcase', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 20),
('crafts_souvenirs', 'Local Crafts & African Heritage', 'heritage-crafts', 'Handmade soapstone carvings, beaded Maasai artwork & organic coffee beans', 'Crown', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', 21);

-- 2. INSERT SUBCATEGORIES FOR RESTAURANTS & GROCERIES
INSERT INTO subcategories (id, category_id, name, slug, description, image_url, display_order) VALUES
('sub_rest_seafood', 'restaurants', 'Fine Seafood & Raw Bar', 'seafood-raw-bar', 'Fresh coastal oysters, lobster thermidor & tiger prawns', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80', 1),
('sub_rest_japanese', 'restaurants', 'Japanese & Sushi Artistry', 'japanese-sushi', 'A5 Miyazaki Wagyu, Otoro nigiri & black cod miso', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80', 2),
('sub_rest_steak', 'restaurants', 'Steakhouse & Grill', 'steakhouse-grill', 'Dry-aged prime Tomahawk, chateaubriand & truffle jus', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', 3),
('sub_rest_french', 'restaurants', 'French Brasserie', 'french-brasserie', 'Foie gras, duck confit & classic French delicacies', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80', 4),
('sub_rest_italian', 'restaurants', 'Artisan Italian & Pasta', 'italian-pasta', 'Handmade tagliolini, fresh summer truffles & burrata', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80', 5),
('sub_rest_swahili', 'restaurants', 'Swahili & Coastal Cuisine', 'swahili-cuisine', 'Swahili coconut fish curry, fragrant biryani & coastal sambusas', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', 6),
('sub_groc_cellar', 'groceries', 'Caviar & Truffle Bar', 'caviar-truffle', 'Imperial Ossetra caviar, blinis & Périgord black truffles', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80', 1),
('sub_groc_cheese', 'groceries', 'Artisan Fromagerie', 'artisan-fromagerie', 'Aged Comté, French brie, Roquefort & artisanal preserves', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=400&q=80', 2),
('sub_groc_bakery', 'groceries', 'Morning Bakery & Pantry', 'morning-bakery', 'Warm almond croissants, sourdough loaves & cultured Normandy butter', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', 3);

-- 3. INSERT VERIFIED MERCHANTS
INSERT INTO merchants (
    id, primary_category_id, name, slug, tagline, description,
    logo_url, hero_image_url, rating, review_count, delivery_time_min, delivery_time_max,
    delivery_fee, currency, price_level, city, is_open, is_featured, special_offer
) VALUES
(
    'merch_tamarind', 'restaurants', 'Tamarind Dhow Restaurant', 'tamarind-dhow',
    'Legendary coastal seafood & ocean lobster delivered warm to your suite table.',
    'World-renowned Swahili coast fine dining established in 1977. Signature seafood platters, lobster thermidor, and chilled oysters dispatched with dedicated temperature-controlled carriers.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    4.95, 428, 25, 35, 5.00, 'USD', 4, 'Nairobi', TRUE, TRUE, 'Complimentary glass of chilled Moët & Chandon with 3-course villa order'
),
(
    'merch_nobu', 'restaurants', 'Nobu Modern Japanese', 'nobu-japanese',
    'Celebrated Japanese master dining by Chef Nobu Matsuhisa.',
    'Signature Black Cod with Miso, Yellowtail Jalapeño, and grade A5 Miyazaki Wagyu beef skewers delivered in handcrafted bento presentation cases.',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    4.98, 812, 30, 45, 7.50, 'USD', 4, 'Nairobi', TRUE, TRUE, '$25 Concierge Welcome Credit applied on orders over $150'
),
(
    'merch_hemingways', 'restaurants', 'Hemingways Brasserie & Butler', 'hemingways-brasserie',
    'Classic European fine dining with white-glove table plating.',
    'Michelin-trained culinary brigade presenting dry-aged Angus ribeye, Josper-grilled sea bass, and decadent chocolate fondant.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    4.92, 310, 35, 50, 6.00, 'USD', 4, 'Nairobi', TRUE, FALSE, 'Free table-side sommelier service included'
),
(
    'merch_cellar', 'alcohol_beverages', 'The Sommelier Vault & Cellar', 'sommelier-vault',
    'Rare grand cru vintages, vintage champagne & single malt scotch.',
    'Climate-controlled luxury spirits and fine wine inventory delivered in velvet-lined thermal cases with crystal glassware upon request.',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    4.89, 534, 15, 25, 0.00, 'USD', 3, 'Nairobi', TRUE, TRUE, 'Zero delivery surcharge on Dom Pérignon & Krug bottles'
);

-- 4. LINK MERCHANTS TO SUBCATEGORIES
INSERT INTO merchant_subcategories (merchant_id, subcategory_id, is_primary) VALUES
('merch_tamarind', 'sub_rest_seafood', TRUE),
('merch_tamarind', 'sub_rest_swahili', FALSE),
('merch_nobu', 'sub_rest_japanese', TRUE),
('merch_hemingways', 'sub_rest_steak', TRUE),
('merch_hemingways', 'sub_rest_french', FALSE),
('merch_cellar', 'sub_groc_cellar', TRUE);

-- 5. INSERT STORE ITEMS / MENU DISHES
INSERT INTO items (
    id, merchant_id, subcategory_id, name, description, price, compare_at_price,
    image_url, is_featured, prep_time_minutes, dietary_tags
) VALUES
(
    'item_tam_lobster', 'merch_tamarind', 'sub_rest_seafood',
    'Kilifi Ocean Whole Grilled Lobster',
    'Fresh Indian Ocean lobster flame-grilled with lime-garlic herb butter, served with roasted saffron baby potatoes and garden greens.',
    68.00, 75.00,
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    TRUE, 25, ARRAY['gluten-free', 'pescatarian']
),
(
    'item_tam_oysters', 'merch_tamarind', 'sub_rest_seafood',
    'Fresh Mombasa Rock Oysters (Dozen)',
    'Shucked upon order, served on crushed ice with shallot mignonette, fresh tabasco and lemon wedges.',
    38.00, NULL,
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    TRUE, 10, ARRAY['gluten-free', 'raw-bar']
),
(
    'item_nobu_cod', 'merch_nobu', 'sub_rest_japanese',
    'Nobu Signature Black Cod with Sweet Miso',
    'Alaskan black cod marinated for 72 hours in Den Miso sauce, broiled to a caramelized golden perfection.',
    56.00, NULL,
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    TRUE, 20, ARRAY['pescatarian']
),
(
    'item_nobu_wagyu', 'merch_nobu', 'sub_rest_japanese',
    'A5 Miyazaki Japanese Wagyu Beef Tataki',
    'Lightly seared A5 Japanese beef tenderloin sliced paper-thin, drizzled with tosazu and crispy garlic chips.',
    95.00, 110.00,
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    TRUE, 15, ARRAY['halal']
),
(
    'item_dom_perignon', 'merch_cellar', 'sub_groc_cellar',
    'Dom Pérignon Vintage Champagne Brut (750ml)',
    'Vintage 2013 champagne boasting intense aromas of citrus fruit, white flowers, and toasted brioche. Dispatched chilled.',
    340.00, 380.00,
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    TRUE, 5, ARRAY['vegan']
);
