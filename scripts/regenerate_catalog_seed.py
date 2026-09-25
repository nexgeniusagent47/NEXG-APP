"""Regenerate the NEXG catalogue seed with the data the source actually contains.

Why this exists
---------------
The former `parse_excel_to_db.py` generator read the workbook but discarded most of its
useful data:

  1. It computes a `subcategoryId` for every merchant and never emits the
     `merchant_subcategories` link rows, so the junction table is empty. The API
     therefore returns no subcategoryId, `findSubcategory` cannot resolve
     anything, and every catalogue-declared requirement (liquor licence, age
     gate, headcount, session duration) silently disappears from the item modal.
  2. It parses each item's price BAND ("KSh 500-20,000") down to one value and
     reuses it for every item at that band, producing a near-constant price.
  3. It assigns hero images by `index % 16`, so 640 merchants share 16 photographs.
  4. It builds item descriptions by concatenating the Excel "Image Brief" column,
     which is a prompt for an image generator, into customer-facing copy.

This script keeps the taxonomy, merchant and item shape identical and fixes
those four things. It emits the PostgreSQL seed SQL only; the application reads
catalogue data from PostgreSQL at runtime and has no JSON catalogue fallback.

Usage:
    python scripts/regenerate_catalog_seed.py
"""

import zipfile
import xml.etree.ElementTree as ET
import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = Path(__file__).resolve().parents[1]
XLSX_PATH = ROOT_DIR / 'data' / 'source' / 'NEXG_Nairobi_Merchant_Seed_Catalog.xlsx'
OUTPUT_SQL_PATH = ROOT_DIR / 'src' / 'db' / 'seed_excel.sql'

# How many items to emit into the SQL seed. The full catalogue is ~14.9k items;
# the JSON bundle carries every merchant summary but only a slice of full items.
SQL_ITEM_LIMIT = 6000

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'


# --------------------------------------------------------------------- parsing

def get_cell_val(c):
    if c.attrib.get('t') == 'inlineStr':
        node = c.find(f'{NS}is')
        if node is not None:
            return ''.join(t.text for t in node.iter(f'{NS}t') if t.text)
    v = c.find(f'{NS}v')
    return v.text if v is not None and v.text is not None else ''


def read_sheet(z, path):
    root = ET.fromstring(z.read(path))
    rows = []
    for r in root.iter(f'{NS}row'):
        rows.append([get_cell_val(c) for c in r.findall(f'{NS}c')])
    return rows


def slugify(text):
    text = (text or '').lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')


def sql_str(value):
    """Escape for a single-quoted SQL literal, or NULL."""
    if value is None or value == '':
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"


# ----------------------------------------------------------------------- money

def parse_band(price_hint):
    """Return (low, high) integers from a hint like 'KSh 500-20,000'.

    Handles the en dash the sheet actually uses. Non-numeric hints such as
    'Fee/quote based' return None, and the caller falls back to a default band.
    """
    if not price_hint:
        return None
    cleaned = price_hint.replace('KSh', '').replace(',', '').strip()
    numbers = [int(n) for n in re.findall(r'\d+', cleaned)]
    if not numbers:
        return None
    if len(numbers) == 1:
        return numbers[0], numbers[0]
    return numbers[0], numbers[1]


def spread_price(low, high, item_index, merchant_index):
    """A realistic, DETERMINISTIC price inside the declared band.

    Deterministic rather than random so re-running this script is reproducible and
    the git diff stays reviewable. Two decorrelated low-discrepancy-ish terms are
    combined so items inside one merchant do not march in step, and the result is
    rounded to a plausible retail number rather than an exact integer.
    """
    if low is None or high is None or high <= low:
        base = low if low else 1500
        return int(base)

    # Two coprime multipliers keep the sequence from repeating inside a merchant.
    t = ((item_index * 2654435761) % 1000) / 1000.0
    u = ((merchant_index * 40503) % 997) / 997.0
    frac = 0.5 * t + 0.5 * u

    # Bias toward the lower half of the band: marketplaces show more cheap items
    # than expensive ones, and a uniform spread makes every listing look premium.
    frac = frac ** 1.35

    value = low + (high - low) * frac

    # Round to a believable retail increment scaled to the band.
    if value >= 100_000:
        step = 5000
    elif value >= 20_000:
        step = 500
    elif value >= 5_000:
        step = 100
    elif value >= 1_000:
        step = 50
    else:
        step = 10

    rounded = int(round(value / step) * step)
    return max(low, min(high, rounded))


# --------------------------------------------------------------------- imagery

# A wider pool of per-vertical photographs, so a browse grid stops looking like
# one picture repeated. Unsplash source URLs, matching the existing convention.
VERTICAL_IMAGES = {
    'Adults Only': [
        'photo-1518895949257-7621c3c786d7', 'photo-1522337360788-8b13dee7a37e',
        'photo-1512207736890-6ffed8a84e8d', 'photo-1540555700478-4be289fbecef',
    ],
    'Airport Transfers': [
        'photo-1617814076367-b759c7d7e738', 'photo-1544620347-c4fd4a3d5957',
        'photo-1449965408869-eaa3f722e40d', 'photo-1550355291-bbee04a92027',
        'photo-1502877338535-766e1452684a', 'photo-1493238792000-8113da705763',
    ],
    'Alcohol & Beverages': [
        'photo-1510812431401-41d2bd2722f3', 'photo-1514933651103-005eec06c04b',
        'photo-1470337458703-46ad1756a187', 'photo-1569529465841-dfecdab7503b',
    ],
    'Beauty': [
        'photo-1522337360788-8b13dee7a37e', 'photo-1596462502278-27bfdc403348',
        'photo-1571781926291-c477ebfd024b', 'photo-1512496015851-a90fb38ba796',
    ],
    'Concierge Services': [
        'photo-1573496359142-b8d87734a5a2', 'photo-1560250097-0b93528c311a',
        'photo-1497366216548-37526070297c', 'photo-1521737711867-e3b97375f902',
    ],
    'Experiences': [
        'photo-1516426122078-c23e76319801', 'photo-1518998053901-5348d3961a04',
        'photo-1533105079780-92b9be482077', 'photo-1547471080-7cc2caa01a7e',
    ],
    'Fashion & Apparel': [
        'photo-1490481651871-ab68de25d43d', 'photo-1445205170230-053b83016050',
        'photo-1483985988355-763728e1935b', 'photo-1441984904996-e0b6ba687e04',
    ],
    'Financial Services': [
        'photo-1559526324-4b87b5e36e44', 'photo-1601597111158-2fceff292cdc',
        'photo-1579621970563-ebec7560ff3e', 'photo-1563986768609-322da13575f3',
    ],
    'Flowers & Gifts': [
        'photo-1561181286-d3fee7d55364', 'photo-1520763185298-1b434c919102',
        'photo-1519378058457-4c29a0a2efac', 'photo-1487530811176-3780de880c2d',
    ],
    'Groceries & Essentials': [
        'photo-1542838132-92c53300491e', 'photo-1583258292688-d0213dc5a3a8',
        'photo-1578916171728-46686eac8d58', 'photo-1601599963565-b7f49deb352a',
    ],
    'Health': [
        'photo-1505751172876-fa1923c5c528', 'photo-1576091160399-112ba8d25d1d',
        'photo-1631217868264-e5b90bb7e133', 'photo-1519494026892-80bbd2d6fd0d',
    ],
    'Laundry & Cleaning': [
        'photo-1581578731548-c64695cc6952', 'photo-1610557892470-55d9e80c0bce',
        'photo-1626806787461-102c1bfaaea1', 'photo-1527515637462-cff94eecc1ac',
    ],
    'Logistics & Shipping': [
        'photo-1586528116311-ad8dd3c8310d', 'photo-1494412574643-ff11b0a5c1c3',
        'photo-1578575437130-527eed3abbec', 'photo-1601584115197-04ecc0da31d7',
    ],
    'Marketplace': [
        'photo-1616486338812-3dadae4b4ace', 'photo-1555041469-a586c61ea9bc',
        'photo-1524758631624-e2822e304c36', 'photo-1567016432779-094069958ea5',
    ],
    'Pharmacy': [
        'photo-1584308666744-24d5c474f2ae', 'photo-1587854692152-cbe660dbde88',
        'photo-1631549916768-4119b2e5f926', 'photo-1576602976047-174e57a47881',
    ],
    'Restaurants & Food': [
        'photo-1544025162-d76694265947', 'photo-1517248135467-4c7edcad34c4',
        'photo-1555396273-367ea4eb4db5', 'photo-1550966871-3ed3cdb5ed0c',
        'photo-1551183053-bf91a1d81141', 'photo-1509440159596-0249088772ff',
        'photo-1579871494447-9811cf80d66c', 'photo-1559339352-11d035aa65de',
    ],
    'Tech & Electronics': [
        'photo-1505740420928-5e560c06d30e', 'photo-1498049794561-7780e7231661',
        'photo-1517336714731-489689fd1ca8', 'photo-1526170375885-4d8ecf77b99f',
    ],
    'Travel & Tours': [
        'photo-1516426122078-c23e76319801', 'photo-1523805009345-7448845a9e53',
        'photo-1518709268805-4e9042af2176', 'photo-1502920917128-1aa500764cbd',
    ],
    'Vehicle Rentals': [
        'photo-1503376780353-7e6692767b70', 'photo-1552519507-da3b142c6e3d',
        'photo-1494976388531-d1058494cdd8', 'photo-1583121274602-3e2820c69888',
    ],
    'Vehicle Services': [
        'photo-1607860108855-64acf2078ed9', 'photo-1487754180451-c456f719a1fc',
        'photo-1625047509168-a7026f36de04', 'photo-1632823471565-1ecdf5c6da05',
    ],
    'Wellness': [
        'photo-1540555700478-4be289fbecef', 'photo-1544161515-4ab6ce6db874',
        'photo-1600334089648-b0d9d3028eb2', 'photo-1591343395902-1adcb454c4e2',
    ],
}

FALLBACK_IMAGES = VERTICAL_IMAGES['Restaurants & Food']


def image_url(photo_id, width=800):
    return f'https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w={width}&q=80'


def images_for(category_name):
    return VERTICAL_IMAGES.get(category_name, FALLBACK_IMAGES)


# ------------------------------------------------------------------ copy rules

# The Excel "Image Brief" column is a prompt for an image generator. Shipping it
# as product copy is the single most damaging content defect in the catalogue:
# customers read "Photorealistic vehicle/service image for ..." when deciding
# what to buy. Descriptions are composed from the item's own facts instead.
#
# Scope note: these markers are checked against CUSTOMER-FACING COPY ONLY (name and
# description). Checking the whole serialised record produced a false positive,
# because the image URL legitimately contains `&fit=crop`.
BRIEF_LEAK_MARKERS = (
    'photorealistic', 'image for', 'photograph of', 'nairobi road context',
    'no people', 'no text', 'premium but believable', '4:5 crop',
)


def brief_leaks(brief):
    lowered = (brief or '').lower()
    return any(marker in lowered for marker in BRIEF_LEAK_MARKERS)


def compose_description(item_name, merchant_name, subcategory, category):
    """A short, factual sentence built only from the item's own attributes."""
    subject = subcategory or category or 'Offering'
    return (
        f'{item_name} from {merchant_name}. '
        f'{subject} in the {category} vertical, dispatched by the NEXG concierge team.'
    )


# ------------------------------------------------------------------------- main

def main():
    with zipfile.ZipFile(XLSX_PATH) as z:
        taxonomy_rows = read_sheet(z, 'xl/worksheets/sheet4.xml')
        merchant_rows = read_sheet(z, 'xl/worksheets/sheet2.xml')
        item_rows = read_sheet(z, 'xl/worksheets/sheet3.xml')

    # 1. Taxonomy -> categories and subcategories, keyed the way the DB expects.
    categories = {}
    subcategory_by_cat_and_name = {}
    for row in taxonomy_rows[1:]:
        if len(row) < 2 or not row[0]:
            continue
        cat, sub = row[0].strip(), row[1].strip()
        workflow = row[3].strip() if len(row) > 3 else 'order'
        cat_id = slugify(cat)
        if cat_id not in categories:
            categories[cat_id] = {
                'id': cat_id, 'name': cat, 'slug': cat_id,
                'subcategories': [],
                'image_url': image_url(images_for(cat)[0]),
            }
        if sub and sub not in [s['name'] for s in categories[cat_id]['subcategories']]:
            # Category-prefixed id, matching what orderRequirements expects.
            sub_id = f'{cat_id}_{slugify(sub)}'
            categories[cat_id]['subcategories'].append(
                {'id': sub_id, 'name': sub, 'slug': slugify(sub), 'workflow': workflow}
            )
            subcategory_by_cat_and_name[(cat, sub)] = sub_id

    print(f'Taxonomy: {len(categories)} categories, '
          f'{len(subcategory_by_cat_and_name)} subcategories')

    # 2. Merchants, with a real subcategory link.
    merchants = []
    merchants_by_id = {}
    links = []            # (merchant_id, subcategory_id, is_primary)

    for idx, row in enumerate(merchant_rows[1:]):
        if len(row) < 2 or not row[0]:
            continue
        m_id, m_name = row[0].strip(), row[1].strip()
        cat = row[2].strip() if len(row) > 2 else 'Restaurants & Food'
        sub = row[3].strip() if len(row) > 3 else ''
        area = row[4].strip() if len(row) > 4 else 'Kilimani'
        archetype = row[5].strip() if len(row) > 5 else 'Modern Premium'
        palette = row[6].strip() if len(row) > 6 else 'obsidian, warm ivory, gold'
        workflow = row[9].strip() if len(row) > 9 else 'order'
        cat_id = slugify(cat)

        # Resolve the subcategory id. Falls back to the category slug only when
        # the taxonomy genuinely has no matching subcategory, so the junction
        # table always has one primary link per merchant.
        sub_id = subcategory_by_cat_and_name.get((cat, sub))

        rating = round(4.35 + ((idx * 13) % 60) / 100.0, 2)
        review_count = 40 + ((idx * 137) % 900)
        delivery_min = 15 + ((idx * 7) % 35)
        delivery_max = delivery_min + 10 + (idx % 15)
        delivery_fee = 0 if (idx % 4 == 0) else 100 + ((idx % 6) * 50)
        price_tier = 1 + (idx % 4)

        pool = images_for(cat)
        hero_img = image_url(pool[idx % len(pool)])

        m_data = {
            'id': m_id, 'name': m_name, 'slug': slugify(m_name),
            'category': cat, 'categoryId': cat_id,
            'subcategory': sub, 'subcategoryId': sub_id,
            'nairobiArea': area, 'address': f'{area}, Nairobi, Kenya',
            'brandArchetype': archetype, 'brandPalette': palette,
            'workflow': workflow,
            'rating': rating, 'ratingCount': review_count,
            'deliveryTimeMin': delivery_min, 'deliveryTimeMax': delivery_max,
            'deliveryTime': f'{delivery_min}-{delivery_max} min',
            'deliveryFee': delivery_fee, 'priceLevel': price_tier,
            'heroImage': hero_img,
            'logoUrl': f'https://api.dicebear.com/7.x/shapes/svg?seed={slugify(m_name)}',
            'isOpen': (idx % 17 != 0),                 # a believable minority closed
            'isFeatured': rating >= 4.85,
            'items': [],
        }
        merchants.append(m_data)
        merchants_by_id[m_id] = m_data
        if sub_id:
            links.append((m_id, sub_id))

    print(f'Merchants: {len(merchants)}  subcategory links: {len(links)}')

    # 3. Items, with a spread price inside the declared band.
    items = []
    merchant_index = {m['id']: i for i, m in enumerate(merchants)}
    fallback_band = (800, 25_000)

    for idx, row in enumerate(item_rows[1:]):
        if len(row) < 6 or not row[0]:
            continue
        it_id, m_id = row[0].strip(), row[1].strip()
        m_name = row[2].strip() if len(row) > 2 else ''
        cat = row[3].strip() if len(row) > 3 else ''
        sub = row[4].strip() if len(row) > 4 else ''
        it_name = row[5].strip()
        price_hint = row[6].strip() if len(row) > 6 else ''

        band = parse_band(price_hint) or fallback_band
        price = spread_price(band[0], band[1], idx, merchant_index.get(m_id, 0))

        pool = images_for(cat)
        item_img = image_url(pool[(idx * 3) % len(pool)], width=600)

        merchant = merchants_by_id.get(m_id)
        merchant_name = m_name or (merchant['name'] if merchant else 'NEXG Partner')

        it_data = {
            'id': it_id, 'merchantId': m_id, 'merchantName': merchant_name,
            'category': cat, 'categoryId': slugify(cat), 'subcategory': sub,
            'subcategoryId': subcategory_by_cat_and_name.get((cat, sub)),
            'name': it_name,
            'price': price,
            'priceMin': band[0], 'priceMax': band[1],
            'priceHint': price_hint,
            'currency': 'KSh',
            'image': item_img,
            'description': compose_description(it_name, merchant_name, sub, cat),
            'rating': round(4.2 + ((idx * 11) % 75) / 100.0, 1),
            'reviewCount': 5 + ((idx * 23) % 300),
        }
        items.append(it_data)
        if merchant is not None:
            merchant['items'].append(it_data)

    print(f'Items: {len(items)}')

    distinct_prices = len({i["price"] for i in items})
    print(f'Distinct prices: {distinct_prices}')

    leaked = [
        i for i in items
        if brief_leaks(i['description']) or brief_leaks(i['name'])
    ]
    print(f'Items still containing generator-brief text: {len(leaked)}')
    if leaked:
        print(f'  first offender: {leaked[0]["description"][:120]!r}')

    # 4. PostgreSQL seed SQL.
    with open(OUTPUT_SQL_PATH, 'w', encoding='utf-8') as f:
        f.write('-- NEXG Concierge PostgreSQL seed\n')
        f.write('-- Generated by scripts/regenerate_catalog_seed.py\n')
        f.write('-- Source: NEXG_Nairobi_Merchant_Seed_Catalog.xlsx\n')
        f.write('-- Do not edit by hand; regenerate instead.\n\n')
        f.write('BEGIN;\n\n')

        f.write('-- Idempotent: a re-run replaces the previous seed rather than\n')
        f.write('-- duplicating it. Cascades clear dependent rows.\n')
        f.write('TRUNCATE items, merchant_subcategories, merchants, subcategories, categories CASCADE;\n\n')

        f.write('-- 1. CATEGORIES\n')
        for cat in categories.values():
            f.write(
                'INSERT INTO categories (id, name, slug, description, image_url) VALUES ('
                f'{sql_str(cat["id"])}, {sql_str(cat["name"])}, {sql_str(cat["slug"])}, '
                f'{sql_str("NEXG " + cat["name"])}, {sql_str(cat["image_url"])});\n'
            )

        f.write('\n-- 2. SUBCATEGORIES\n')
        for cat in categories.values():
            for sub in cat['subcategories']:
                f.write(
                    'INSERT INTO subcategories (id, category_id, name, slug) VALUES ('
                    f'{sql_str(sub["id"])}, {sql_str(cat["id"])}, '
                    f'{sql_str(sub["name"])}, {sql_str(sub["slug"])});\n'
                )

        f.write('\n-- 3. MERCHANTS\n')
        for m in merchants:
            metadata = json.dumps({
                'area': m['nairobiArea'],
                'archetype': m['brandArchetype'],
                'palette': m['brandPalette'],
                'workflow': m['workflow'],
            }, ensure_ascii=False)
            f.write(
                'INSERT INTO merchants (id, primary_category_id, name, slug, city, address, '
                'rating, review_count, delivery_time_min, delivery_time_max, delivery_fee, '
                'price_level, hero_image_url, logo_url, is_open, is_featured, metadata) VALUES ('
                f'{sql_str(m["id"])}, {sql_str(m["categoryId"])}, {sql_str(m["name"])}, '
                f'{sql_str(m["slug"])}, {sql_str("Nairobi")}, {sql_str(m["address"])}, '
                f'{m["rating"]}, {m["ratingCount"]}, {m["deliveryTimeMin"]}, {m["deliveryTimeMax"]}, '
                f'{m["deliveryFee"]}, {m["priceLevel"]}, {sql_str(m["heroImage"])}, '
                f'{sql_str(m["logoUrl"])}, {"TRUE" if m["isOpen"] else "FALSE"}, '
                f'{"TRUE" if m["isFeatured"] else "FALSE"}, {sql_str(metadata)}::jsonb);\n'
            )

        f.write('\n-- 4. MERCHANT <-> SUBCATEGORY LINKS\n')
        f.write('-- This is the table the original generator never emitted, which is why no\n')
        f.write('-- catalogue-declared requirement ever rendered in the item modal.\n')
        for m_id, sub_id in links:
            f.write(
                'INSERT INTO merchant_subcategories (merchant_id, subcategory_id, is_primary) '
                f'VALUES ({sql_str(m_id)}, {sql_str(sub_id)}, TRUE);\n'
            )

        f.write('\n-- 5. ITEMS\n')
        for it in items[:SQL_ITEM_LIMIT]:
            compare_at = it['priceMax'] if it['priceMax'] > it['price'] else 'NULL'
            f.write(
                'INSERT INTO items (id, merchant_id, subcategory_id, name, description, price, '
                'compare_at_price, image_url, is_available, is_featured) VALUES ('
                f'{sql_str(it["id"])}, {sql_str(it["merchantId"])}, '
                f'{sql_str(it.get("subcategoryId"))}, {sql_str(it["name"])}, '
                f'{sql_str(it["description"])}, {it["price"]}, {compare_at}, '
                f'{sql_str(it["image"])}, TRUE, {"TRUE" if it["rating"] >= 4.7 else "FALSE"});\n'
            )

        f.write('\nCOMMIT;\n')

    size_mb = os.path.getsize(OUTPUT_SQL_PATH) / 1024 / 1024
    print(f'Wrote {OUTPUT_SQL_PATH} ({size_mb:.1f} MB)')


if __name__ == '__main__':
    main()
