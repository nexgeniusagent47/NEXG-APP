# scripts/parse_excel_to_db.py
# Parses NEXG_Nairobi_Merchant_Seed_Catalog.xlsx and generates:
# 1. src/db/seed_excel.sql (PostgreSQL insert script)
# 2. src/data/seededCatalog.json (High-speed client hydration & offline cache)

import zipfile
import xml.etree.ElementTree as ET
import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

XLSX_PATH = 'NEXG_Nairobi_Merchant_Seed_Catalog.xlsx'
OUTPUT_SQL_PATH = 'src/db/seed_excel.sql'
OUTPUT_JSON_PATH = 'src/data/seededCatalog.json'

def get_cell_val(c):
    t = c.attrib.get('t')
    if t == 'inlineStr':
        is_node = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
        if is_node is not None:
            return ''.join([t_node.text for t_node in is_node.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t_node.text])
    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
    return v.text if v is not None and v.text is not None else ''

def parse_price(price_str):
    if not price_str:
        return 1500, 500, 3000
    cleaned = price_str.replace('KSh', '').replace(',', '').strip()
    numbers = [int(n) for n in re.findall(r'\d+', cleaned)]
    if not numbers:
        return 1500, 500, 3000
    if len(numbers) == 1:
        val = numbers[0]
        return val, val, val
    val_min = numbers[0]
    val_max = numbers[1] if len(numbers) > 1 else numbers[0]
    val_default = val_min + int((val_max - val_min) * 0.35)
    return val_default, val_min, val_max

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

# High quality category and subcategory image mappings
CATEGORY_DEFAULT_IMAGES = {
    'Adults Only': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    'Airport Transfers': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    'Alcohol & Beverages': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    'Beauty': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'Concierge Services': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    'Experiences': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    'Fashion & Apparel': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    'Financial Services': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    'Flowers & Gifts': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    'Groceries & Essentials': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    'Health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    'Laundry & Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    'Logistics & Shipping': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    'Marketplace': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    'Pharmacy': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    'Restaurants & Food': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'Tech & Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'Travel & Tours': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    'Vehicle Rentals': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'Vehicle Services': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    'Wellness': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
}

HERO_IMAGE_COLLECTION = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
]

def main():
    print('Opening Excel catalog:', XLSX_PATH)
    with zipfile.ZipFile(XLSX_PATH) as z:
        # 1. Parse Taxonomy
        s_taxonomy = ET.fromstring(z.read('xl/worksheets/sheet4.xml'))
        taxonomy_rows = []
        for r in s_taxonomy.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            taxonomy_rows.append([get_cell_val(c) for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')])
        
        taxonomies = []
        categories_dict = {}
        for row in taxonomy_rows[1:]:
            if len(row) >= 2 and row[0]:
                cat = row[0].strip()
                subcat = row[1].strip() if len(row) > 1 else ''
                count_hint = row[2].strip() if len(row) > 2 else '30'
                workflow = row[3].strip() if len(row) > 3 else 'order'
                taxonomies.append({
                    'category': cat,
                    'subcategory': subcat,
                    'item_count_hint': count_hint,
                    'default_workflow': workflow
                })
                if cat not in categories_dict:
                    categories_dict[cat] = {
                        'id': slugify(cat),
                        'name': cat,
                        'slug': slugify(cat),
                        'subcategories': [],
                        'image_url': CATEGORY_DEFAULT_IMAGES.get(cat, HERO_IMAGE_COLLECTION[0])
                    }
                if subcat and subcat not in [s['name'] for s in categories_dict[cat]['subcategories']]:
                    categories_dict[cat]['subcategories'].append({
                        'id': f"{slugify(cat)}_{slugify(subcat)}",
                        'name': subcat,
                        'slug': slugify(subcat),
                        'workflow': workflow
                    })

        print(f'Taxonomy loaded: {len(taxonomies)} rules across {len(categories_dict)} categories')

        # 2. Parse Merchants
        s_merchants = ET.fromstring(z.read('xl/worksheets/sheet2.xml'))
        merchant_rows = []
        for r in s_merchants.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            merchant_rows.append([get_cell_val(c) for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')])
        
        merchants = []
        merchants_by_id = {}
        for idx, row in enumerate(merchant_rows[1:]):
            if len(row) >= 2 and row[0]:
                m_id = row[0].strip()
                m_name = row[1].strip()
                cat = row[2].strip() if len(row) > 2 else 'Restaurants & Food'
                subcat = row[3].strip() if len(row) > 3 else ''
                area = row[4].strip() if len(row) > 4 else 'Kilimani'
                archetype = row[5].strip() if len(row) > 5 else 'Modern Premium'
                palette = row[6].strip() if len(row) > 6 else 'obsidian, warm ivory, gold'
                mark_direction = row[7].strip() if len(row) > 7 else 'geometric monogram'
                photo_direction = row[8].strip() if len(row) > 8 else 'editorial lifestyle'
                workflow = row[9].strip() if len(row) > 9 else 'order'

                # Deterministic attributes
                rating = round(4.6 + ((idx % 39) / 100.0), 2)
                rating = min(rating, 4.99)
                review_count = 80 + ((idx * 17) % 650)
                delivery_min = 20 + ((idx * 3) % 25)
                delivery_max = delivery_min + 15
                delivery_fee = 0 if (idx % 3 == 0) else 150 + ((idx % 4) * 50)
                price_tier = 1 + (idx % 4)

                hero_img = HERO_IMAGE_COLLECTION[idx % len(HERO_IMAGE_COLLECTION)]
                logo_img = f"https://api.dicebear.com/7.x/shapes/svg?seed={slugify(m_name)}"

                m_data = {
                    'id': m_id,
                    'name': m_name,
                    'slug': slugify(m_name),
                    'category': cat,
                    'categoryId': slugify(cat),
                    'subcategory': subcat,
                    'subcategoryId': f"{slugify(cat)}_{slugify(subcat)}" if subcat else slugify(cat),
                    'nairobiArea': area,
                    'address': f"{area}, Nairobi, Kenya",
                    'brandArchetype': archetype,
                    'brandPalette': palette,
                    'logoDirection': mark_direction,
                    'photoDirection': photo_direction,
                    'workflow': workflow,
                    'rating': rating,
                    'ratingCount': review_count,
                    'deliveryTimeMin': delivery_min,
                    'deliveryTimeMax': delivery_max,
                    'deliveryTime': f"{delivery_min}-{delivery_max} min",
                    'deliveryFee': delivery_fee,
                    'priceLevel': price_tier,
                    'heroImage': hero_img,
                    'logoUrl': logo_img,
                    'badges': ['Top Rated' if rating >= 4.85 else 'Verified Merchant', 'Free Delivery' if delivery_fee == 0 else f"KSh {delivery_fee} Delivery"],
                    'isOpen': True,
                    'items': []
                }
                merchants.append(m_data)
                merchants_by_id[m_id] = m_data

        print(f'Merchants loaded: {len(merchants)} merchants')

        # 3. Parse Items
        s_items = ET.fromstring(z.read('xl/worksheets/sheet3.xml'))
        item_rows = []
        for r in s_items.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            item_rows.append([get_cell_val(c) for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')])
        
        items = []
        for idx, row in enumerate(item_rows[1:]):
            if len(row) >= 6 and row[0]:
                it_id = row[0].strip()
                m_id = row[1].strip()
                m_name = row[2].strip() if len(row) > 2 else ''
                cat = row[3].strip() if len(row) > 3 else ''
                subcat = row[4].strip() if len(row) > 4 else ''
                it_name = row[5].strip()
                price_hint = row[6].strip() if len(row) > 6 else ''
                img_brief = row[7].strip() if len(row) > 7 else ''
                wf_model = row[8].strip() if len(row) > 8 else ''

                p_default, p_min, p_max = parse_price(price_hint)
                item_img = HERO_IMAGE_COLLECTION[(idx * 7) % len(HERO_IMAGE_COLLECTION)]

                # Determine capability-based commerce mode
                commerce_mode = 'instant_purchase'
                cat_lower = cat.lower()
                if 'safari' in cat_lower or 'travel' in cat_lower or 'tour' in cat_lower:
                    commerce_mode = 'booking'
                elif 'wellness' in cat_lower or 'spa' in cat_lower or 'health' in cat_lower or 'beauty' in cat_lower:
                    commerce_mode = 'appointment'
                elif 'rent' in cat_lower or 'vehicle' in cat_lower:
                    commerce_mode = 'rental'
                elif 'ticket' in cat_lower or 'event' in cat_lower or 'concert' in cat_lower:
                    commerce_mode = 'ticket'
                elif 'logistics' in cat_lower or 'freight' in cat_lower or 'shipping' in cat_lower:
                    commerce_mode = 'quote'
                elif 'concierge' in cat_lower:
                    commerce_mode = 'request'
                elif 'pizza' in it_name.lower() or 'burger' in it_name.lower() or 'build' in it_name.lower():
                    commerce_mode = 'configured_purchase'

                it_data = {
                    'id': it_id,
                    'merchantId': m_id,
                    'merchantName': m_name,
                    'category': cat,
                    'categoryId': slugify(cat),
                    'subcategory': subcat,
                    'name': it_name,
                    'price': p_default,
                    'priceMin': p_min,
                    'priceMax': p_max,
                    'priceHint': price_hint,
                    'currency': 'KSh',
                    'image': item_img,
                    'imageBrief': img_brief,
                    'workflowModel': wf_model,
                    'commerceMode': commerce_mode,
                    'description': f"{it_name} offered by {m_name}. {img_brief[:120] if img_brief else ''}",
                    'rating': round(4.7 + ((idx % 30) / 100.0), 1),
                    'reviewCount': 20 + ((idx * 5) % 150)
                }
                items.append(it_data)
                if m_id in merchants_by_id:
                    merchants_by_id[m_id]['items'].append(it_data)

        print(f'Items loaded: {len(items)} items')

    # Save to JSON bundle for zero-latency client hydration
    catalog_bundle = {
        'version': '1.0.0',
        'generatedAt': '2026-09-21T14:00:00Z',
        'summary': {
            'totalCategories': len(categories_dict),
            'totalMerchants': len(merchants),
            'totalItems': len(items)
        },
        'categories': list(categories_dict.values()),
        'merchants': merchants[:120], # Provide 120 rich seeded merchants for instant client bundle
        'allMerchantSummaries': [
            {
                'id': m['id'],
                'name': m['name'],
                'slug': m['slug'],
                'category': m['category'],
                'categoryId': m['categoryId'],
                'subcategory': m['subcategory'],
                'nairobiArea': m['nairobiArea'],
                'rating': m['rating'],
                'ratingCount': m['ratingCount'],
                'deliveryTime': m['deliveryTime'],
                'deliveryFee': m['deliveryFee'],
                'priceLevel': m['priceLevel'],
                'heroImage': m['heroImage'],
                'itemCount': len(m['items'])
            }
            for m in merchants
        ]
    }

    os.makedirs('src/data', exist_ok=True)
    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog_bundle, f, ensure_ascii=False, indent=2)
    print(f'Saved JSON catalog to: {OUTPUT_JSON_PATH} ({os.path.getsize(OUTPUT_JSON_PATH)} bytes)')

    # Generate SQL seed file for PostgreSQL
    print(f'Generating PostgreSQL seed file: {OUTPUT_SQL_PATH}')
    os.makedirs('src/db', exist_ok=True)
    with open(OUTPUT_SQL_PATH, 'w', encoding='utf-8') as sql_file:
        sql_file.write('-- NEXG Concierge PostgreSQL Excel Seed Migration\n')
        sql_file.write('-- Generated from NEXG_Nairobi_Merchant_Seed_Catalog.xlsx\n')
        sql_file.write('BEGIN;\n\n')

        # Categories
        sql_file.write('-- 1. CATEGORIES\n')
        for cat in categories_dict.values():
            cat_name = cat['name'].replace("'", "''")
            cat_slug = cat['slug'].replace("'", "''")
            img = cat['image_url']
            sql_file.write(
                f"INSERT INTO categories (id, name, slug, description, image_url) "
                f"VALUES ('{cat['id']}', '{cat_name}', '{cat_slug}', 'NEXG {cat_name}', '{img}') "
                f"ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url;\n"
            )

        # Subcategories
        sql_file.write('\n-- 2. SUBCATEGORIES\n')
        for cat in categories_dict.values():
            for sub in cat['subcategories']:
                sub_name = sub['name'].replace("'", "''")
                sub_slug = sub['slug'].replace("'", "''")
                sql_file.write(
                    f"INSERT INTO subcategories (id, category_id, name, slug) "
                    f"VALUES ('{sub['id']}', '{cat['id']}', '{sub_name}', '{sub_slug}') "
                    f"ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n"
                )

        # Merchants (batch 640)
        sql_file.write('\n-- 3. MERCHANTS\n')
        for m in merchants:
            m_name = m['name'].replace("'", "''")
            m_slug = m['slug'].replace("'", "''")
            m_area = m['nairobiArea'].replace("'", "''")
            m_arch = m['brandArchetype'].replace("'", "''")
            m_pal = m['brandPalette'].replace("'", "''")
            m_wf = m['workflow'].replace("'", "''")
            sql_file.write(
                f"INSERT INTO merchants (id, primary_category_id, name, slug, city, address, rating, review_count, "
                f"delivery_time_min, delivery_time_max, delivery_fee, price_level, hero_image_url, logo_url, "
                f"metadata) "
                f"VALUES ('{m['id']}', '{m['categoryId']}', '{m_name}', '{m_slug}', 'Nairobi', '{m_area}, Nairobi', "
                f"{m['rating']}, {m['ratingCount']}, {m['deliveryTimeMin']}, {m['deliveryTimeMax']}, {m['deliveryFee']}, {m['priceLevel']}, "
                f"'{m['heroImage']}', '{m['logoUrl']}', "
                f"'{{\"area\": \"{m_area}\", \"archetype\": \"{m_arch}\", \"palette\": \"{m_pal}\", \"workflow\": \"{m_wf}\"}}'::jsonb) "
                f"ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, rating = EXCLUDED.rating, hero_image_url = EXCLUDED.hero_image_url;\n"
            )

        # Items (sample top 1000 for SQL seed script to keep fast execution)
        sql_file.write('\n-- 4. ITEMS SAMPLE SEED\n')
        for it in items[:1500]:
            it_name = it['name'].replace("'", "''")
            it_desc = it['description'].replace("'", "''")
            sql_file.write(
                f"INSERT INTO items (id, merchant_id, name, description, price, compare_at_price, image_url, is_featured) "
                f"VALUES ('{it['id']}', '{it['merchantId']}', '{it_name}', '{it_desc}', {it['price']}, {it['priceMax']}, '{it['image']}', TRUE) "
                f"ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, name = EXCLUDED.name;\n"
            )

        sql_file.write('\nCOMMIT;\n')

    print(f'Saved PostgreSQL seed SQL to: {OUTPUT_SQL_PATH} ({os.path.getsize(OUTPUT_SQL_PATH)} bytes)')
    print('Excel catalog parsing & seeding generation successfully completed!')

if __name__ == '__main__':
    main()
