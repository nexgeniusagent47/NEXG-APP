-- ====================================================================
-- NEXG CONCIERGE PLATFORM - OPTIMIZED POSTGRESQL DATABASE SCHEMA
-- Designed for ultra-high throughput, millisecond query latency & full-text search.
-- Target: PostgreSQL 14+
-- ====================================================================

-- Enable UUID and Trigram Extensions for ultra-fast fuzzy search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- --------------------------------------------------------------------
-- 1. ENUMS
-- --------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE merchant_status AS ENUM ('active', 'pending_approval', 'suspended', 'offline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_fulfillment_type AS ENUM ('in_suite_delivery', 'vip_chauffeur', 'on_site_booking', 'scheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------------------
-- 2. CATEGORIES TABLE (21 Main Categories)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(64) DEFAULT 'Sparkles',
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order) WHERE is_active = TRUE;

-- --------------------------------------------------------------------
-- 3. SUBCATEGORIES TABLE (134 Granular Subcategories)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subcategories (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cat_subcat_slug UNIQUE (category_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_active_order ON subcategories(category_id, display_order) WHERE is_active = TRUE;

-- --------------------------------------------------------------------
-- 4. MERCHANTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchants (
    id VARCHAR(64) PRIMARY KEY,
    primary_category_id VARCHAR(64) NOT NULL REFERENCES categories(id),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    hero_image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.80 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT DEFAULT 0,
    delivery_time_min INT DEFAULT 20,
    delivery_time_max INT DEFAULT 35,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    price_level SMALLINT DEFAULT 2 CHECK (price_level BETWEEN 1 AND 4), -- 1: $, 2: $$, 3: $$$, 4: $$$$
    address TEXT,
    city VARCHAR(100) DEFAULT 'Nairobi',
    country VARCHAR(100) DEFAULT 'Kenya',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone VARCHAR(50),
    email VARCHAR(150),
    is_open BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    special_offer TEXT,
    status merchant_status DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_merchants_primary_category ON merchants(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_rating_featured ON merchants(rating DESC, is_featured) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_merchants_city_status ON merchants(city, status);
CREATE INDEX IF NOT EXISTS idx_merchants_name_trgm ON merchants USING gin (name gin_trgm_ops);

-- --------------------------------------------------------------------
-- 5. MERCHANT <-> SUBCATEGORIES MANY-TO-MANY
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchant_subcategories (
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subcategory_id VARCHAR(64) NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (merchant_id, subcategory_id)
);

CREATE INDEX IF NOT EXISTS idx_merch_subcat_subcat ON merchant_subcategories(subcategory_id, merchant_id);

-- --------------------------------------------------------------------
-- 6. ITEMS / PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    subcategory_id VARCHAR(64) REFERENCES subcategories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    compare_at_price NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    prep_time_minutes INT DEFAULT 15,
    calories INT,
    allergens TEXT[],
    dietary_tags TEXT[], -- e.g. ['halal', 'vegan', 'gluten-free']
    customization_options JSONB DEFAULT '[]'::jsonb, -- dynamic add-ons & options
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_items_merchant_available ON items(merchant_id, is_available);
CREATE INDEX IF NOT EXISTS idx_items_subcategory ON items(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_items_name_trgm ON items USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_items_featured ON items(merchant_id, is_featured) WHERE is_available = TRUE;

-- --------------------------------------------------------------------
-- 7. ONBOARDING APPLICATIONS
-- Payloads are encrypted by the API before they reach this table because
-- applications contain identity, contact, and payout information.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS onboarding_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_type VARCHAR(16) NOT NULL CHECK (application_type IN ('merchant', 'courier', 'host')),
    token_hash CHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('draft', 'submitted')),
    payload_version INTEGER NOT NULL DEFAULT 1 CHECK (payload_version BETWEEN 1 AND 20),
    payload_ciphertext BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_onboarding_application_token UNIQUE (application_type, token_hash),
    CONSTRAINT ck_onboarding_submission_time CHECK (
      (status = 'draft' AND submitted_at IS NULL) OR
      (status = 'submitted' AND submitted_at IS NOT NULL)
    ),
    CONSTRAINT ck_onboarding_expiry CHECK (
      (status = 'draft' AND expires_at IS NOT NULL) OR
      (status = 'submitted' AND expires_at IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_onboarding_drafts_expiry
  ON onboarding_applications(expires_at) WHERE status = 'draft';
CREATE INDEX IF NOT EXISTS idx_onboarding_submitted_type_date
  ON onboarding_applications(application_type, submitted_at DESC) WHERE status = 'submitted';

-- --------------------------------------------------------------------
-- 8. REVIEWS & RATINGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merchant_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    user_avatar_url TEXT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified_guest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_merchant ON merchant_reviews(merchant_id, created_at DESC);

-- --------------------------------------------------------------------
-- 9. ULTRA-FAST STOREFRONT SEARCH VIEW
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW v_merchant_storefront AS
SELECT 
    m.id AS merchant_id,
    m.name AS merchant_name,
    m.slug AS merchant_slug,
    m.tagline,
    m.logo_url,
    m.hero_image_url,
    m.rating,
    m.review_count,
    m.delivery_time_min,
    m.delivery_time_max,
    m.delivery_fee,
    m.currency,
    m.price_level,
    m.is_open,
    m.is_featured,
    m.special_offer,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', s.id,
                'name', s.name,
                'slug', s.slug
            )
        ) FILTER (WHERE s.id IS NOT NULL), 
        '[]'::jsonb
    ) AS subcategories
FROM merchants m
JOIN categories c ON m.primary_category_id = c.id
LEFT JOIN merchant_subcategories ms ON m.id = ms.merchant_id
LEFT JOIN subcategories s ON ms.subcategory_id = s.id
WHERE m.status = 'active'
GROUP BY m.id, c.id;
