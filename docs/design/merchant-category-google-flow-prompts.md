# Merchant onboarding 3D icon prompt pack for Google Flow

**Updated:** 2026-09-24

**Status:** PROMPTS READY — generate and review assets in the owner’s Google Flow account before integration

**Coverage source:** src/data/merchantCatalog.ts — 21 top-level categories plus all 91 distinct subcategory icon keys (128 subcategory entries)

## How to run this pack

Use Google Flow’s **Image** mode to create each website icon as a still image; video generation is unnecessary for a category symbol. Set a square aspect ratio and one output per prompt so each asset can be reviewed before spending more credits. The first approved image can establish the visual reference; attach it to later prompts as a style reference only. Keep each category’s subject different.

Google’s current [Flow image help](https://support.google.com/flow/answer/16729550?hl=en) documents standalone image generation and adding an image to a prompt. It does not promise that image generations have a real alpha channel, so inspect transparency rather than trusting a prompt phrase. If Flow gives a flat background, remove it with an image editor and confirm the exported PNG really has transparent pixels before the icon is used on light and dark themes.

1. Open a Flow project and select **Image**, square aspect ratio, and **one** output. Check the model and credit cost in Flow before each generation.
2. Generate the Restaurants & Food icon first as a style sample, review its finish and scale, then attach it to other prompts as a style-only reference when the UI permits.
3. Copy one prompt at a time. Keep the generated subject identical to that category; do not let the reference image replace it.
4. Save category images by category ID (for example, adults_only.png) and reusable subcategory images by icon key (for example, activity.png). Keep an untouched original alongside each optimized web asset.
5. Review at 48 px on both light and dark surfaces. Reject any output with a baked square, white tile, fake checkerboard, text, logo, clipped silhouette, or faint edges.
6. Once the user supplies approved outputs, optimize them into local static assets, record source/prompt/date, and check visual contrast and file weight. Do not hotlink generated media.

**Background note:** true transparency is a requested output, not an assumed Flow capability. A simulated checkerboard is not transparency.

## Prompts — all 21 merchant categories

### 01. Adults Only — adults_only

Save as adults_only.png.

```text
Create one standalone NEXG merchant-category 3D icon for Adults Only. Subject: A small sealed privacy pouch beside a tasteful, unbranded adult-wellness package with a tiny closed-lock seal; discreet, non-explicit and suitable for a general marketplace interface. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 02. Airport Transfers — airport_transfers

Save as airport_transfers.png.

```text
Create one standalone NEXG merchant-category 3D icon for Airport Transfers. Subject: A sleek passenger jet silhouette paired with one elegant rolling carry-on suitcase; make airport pickup and transfer service immediately clear. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 03. Alcohol & Beverages — alcohol_beverages

Save as alcohol_beverages.png.

```text
Create one standalone NEXG merchant-category 3D icon for Alcohol & Beverages. Subject: One elegant unbranded amber glass bottle beside a simple stemmed glass; no label, lettering or recognizable beverage brand. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 04. Fashion & Apparel — fashion_apparel

Save as fashion_apparel.png.

```text
Create one standalone NEXG merchant-category 3D icon for Fashion & Apparel. Subject: A neatly folded premium jacket with one small unbranded handbag; refined fabric folds, clean and fashionable. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 05. Beauty — beauty

Save as beauty.png.

```text
Create one standalone NEXG merchant-category 3D icon for Beauty. Subject: A sculptural skincare dropper bottle and one cosmetic brush with a soft highlight; premium, unbranded beauty products. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 06. Vehicle Rentals — vehicle_rentals

Save as vehicle_rentals.png.

```text
Create one standalone NEXG merchant-category 3D icon for Vehicle Rentals. Subject: A modern compact rental car with one simple unbranded key fob beside it; clear vehicle-hire meaning. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 07. Experiences — experiences

Save as experiences.png.

```text
Create one standalone NEXG merchant-category 3D icon for Experiences. Subject: A dimensional event ticket with one raised star and a small music note; suggest concerts, activities and events without any printed text. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 08. Financial Services — financial_services

Save as financial_services.png.

```text
Create one standalone NEXG merchant-category 3D icon for Financial Services. Subject: A closed modern wallet, one plain coin and a protective shield; no currency symbol, number, card brand or text. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 09. Flowers & Gifts — flowers_gifts

Save as flowers_gifts.png.

```text
Create one standalone NEXG merchant-category 3D icon for Flowers & Gifts. Subject: A small fresh bouquet tied with a warm-gold ribbon beside one neatly wrapped gift box; elegant and celebratory. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 10. Restaurants & Food — restaurants_food

Save as restaurants_food.png.

```text
Create one standalone NEXG merchant-category 3D icon for Restaurants & Food. Subject: A refined serving cloche lifted slightly above a small plated meal; appetizing food, simple readable shapes, no restaurant name or packaging. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 11. Groceries & Essentials — groceries_essentials

Save as groceries_essentials.png.

```text
Create one standalone NEXG merchant-category 3D icon for Groceries & Essentials. Subject: A compact reusable market basket holding a few recognizable fresh groceries: leafy greens, bread and one orange; tidy and not crowded. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 12. Laundry & Cleaning — laundry_cleaning

Save as laundry_cleaning.png.

```text
Create one standalone NEXG merchant-category 3D icon for Laundry & Cleaning. Subject: Two folded clean towels beside one unbranded detergent bottle and a single sparkle; fresh, simple, household-cleaning service. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 13. Marketplace — marketplace

Save as marketplace.png.

```text
Create one standalone NEXG merchant-category 3D icon for Marketplace. Subject: One open parcel containing only three small generic product silhouettes: a home object, a simple phone and a folded shirt; organized, not cluttered. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 14. Pharmacy — pharmacy

Save as pharmacy.png.

```text
Create one standalone NEXG merchant-category 3D icon for Pharmacy. Subject: One unbranded medicine bottle and a single capsule beside a small neutral medical plus emblem; no dosage, label, brand or red-cross symbol. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 15. Health — health

Save as health.png.

```text
Create one standalone NEXG merchant-category 3D icon for Health. Subject: A stethoscope gently curved around a simple heart form with one pulse line; calm, professional and non-alarming. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 16. Tech & Electronics — tech_electronics

Save as tech_electronics.png.

```text
Create one standalone NEXG merchant-category 3D icon for Tech & Electronics. Subject: A clean smartphone beside one compact circuit chip; generic hardware, unbranded, no readable screen content. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 17. Travel & Tours — travel_tours

Save as travel_tours.png.

```text
Create one standalone NEXG merchant-category 3D icon for Travel & Tours. Subject: A small safari tour vehicle in front of one acacia tree and a rising sun; warm East African travel feeling, no people or text. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 18. Vehicle Services — vehicle_services

Save as vehicle_services.png.

```text
Create one standalone NEXG merchant-category 3D icon for Vehicle Services. Subject: A crisp vehicle tire and a single service wrench with one small bolt; imply repair and assistance, not a car-rental key. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 19. Wellness — wellness

Save as wellness.png.

```text
Create one standalone NEXG merchant-category 3D icon for Wellness. Subject: A rolled spa towel, two smooth massage stones and one fresh leaf; peaceful wellness and self-care, no person. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 20. App Services — concierge_services

Save as concierge_services.png.

```text
Create one standalone NEXG merchant-category 3D icon for App Services. Subject: A refined service bell with a small floating star; represent reservations and personal assistance, not a restaurant. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

### 21. Logistics & Shipping — logistics_shipping

Save as logistics_shipping.png.

```text
Create one standalone NEXG merchant-category 3D icon for Logistics & Shipping. Subject: A sealed shipping parcel with a small route pin and one directional route mark; clear delivery and freight meaning, no labels or tracking text. Render a premium, tactile product-style 3D illustration with smooth sculpted clay/resin forms, a mostly semi-matte finish and restrained polished highlights. Use the same NEXG palette on every icon: warm amber/golden orange, porcelain cream and restrained slate-neutral details. Use one consistent gentle three-quarter front view, soft upper-left studio lighting, matching object scale, centered composition and generous clear space. Make the main silhouette recognizable at 48 by 48 pixels; use only one or two main objects and avoid tiny detail. Isolate the object. Request a true transparent RGBA background; if the image model cannot make real transparency, use a perfectly uniform warm-white background with no floor, gradient, horizon, vignette, frame, card, tile, badge or checkerboard so it can be removed cleanly. Any contact shadow must stay tight to the object. No words, letters, numbers, labels, watermark or NEXG logo. No unrelated props or photographic scene.
```

## Subcategory symbol prompts — all 91 distinct icon keys

The catalog has 128 subcategory entries. These 91 prompts cover every distinct icon key used by those entries; subcategories that share an icon key share one generated image. Save these under subcategories using the exact icon key as the filename (for example, activity.png). Attach the approved Restaurants & Food sample as a style-only reference if available.



#### 01. Activity

Save as activity.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Activity. Subject: A single abstract figure taking a calm running step beside a small energy pulse; athletic, not medical. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 02. Armchair

Save as armchair.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Armchair. Subject: One inviting modern upholstered armchair with a simple rounded silhouette. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 03. ArrowDown

Save as arrowdown.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ArrowDown. Subject: A clean downward arrow meeting a small arrival marker; no airplane or letters. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 04. ArrowUp

Save as arrowup.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ArrowUp. Subject: A clean upward arrow rising from a small ground marker; no airplane or letters. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 05. Baby

Save as baby.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Baby. Subject: A small neutral baby rattle beside a folded baby blanket; gentle and family friendly. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 06. Beef

Save as beef.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Beef. Subject: One fresh cut of beef on a plain butcher board; no blood or label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 07. Beer

Save as beer.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Beer. Subject: A clear beer mug with a modest amber pour and simple foam; no brand or label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 08. Bike

Save as bike.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Bike. Subject: A clean city bicycle in three-quarter profile; no rider or brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 09. BookOpen

Save as bookopen.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key BookOpen. Subject: One open book with blank, unmarked pages; no readable writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 10. Briefcase

Save as briefcase.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Briefcase. Subject: A refined closed business briefcase with a simple handle and clasp. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 11. Brush

Save as brush.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Brush. Subject: A tidy household cleaning brush with visible bristles; no paint can. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 12. Building

Save as building.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Building. Subject: A small modern office building with a few clean window shapes; no signs. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 13. Cake

Save as cake.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Cake. Subject: A small whole celebration cake with one candle; no numerals or words. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 14. CakeSlice

Save as cakeslice.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key CakeSlice. Subject: One triangular slice of layered cake on a small plain plate. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 15. Calendar

Save as calendar.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Calendar. Subject: A small blank calendar page with empty squares; no dates or writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 16. CalendarCheck

Save as calendarcheck.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key CalendarCheck. Subject: A blank calendar page with one raised checkmark; no date or writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 17. Camera

Save as camera.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Camera. Subject: A compact premium camera with a simple lens; no logo or text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 18. Car

Save as car.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Car. Subject: A modern compact passenger car in three-quarter view, unbranded. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 19. ChefHat

Save as chefhat.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ChefHat. Subject: A sculpted chef toque with subtle fabric folds; no person. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 20. Circle

Save as circle.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Circle. Subject: A single clean rubber vehicle tire standing upright; no rim brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 21. ClipboardCheck

Save as clipboardcheck.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ClipboardCheck. Subject: A plain clipboard with a blank sheet and one raised checkmark; no words. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 22. Coffee

Save as coffee.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Coffee. Subject: A ceramic coffee cup with a small curl of steam; no café label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 23. Coins

Save as coins.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Coins. Subject: Three plain metallic coins stacked with no symbols, numbers or lettering. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 24. Compass

Save as compass.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Compass. Subject: A small navigation compass with a simple needle and no letters. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 25. Cookie

Save as cookie.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Cookie. Subject: One golden chocolate-chip cookie in a clean appetizing form. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 26. CookingPot

Save as cookingpot.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key CookingPot. Subject: A lidded cooking pot with one small curl of steam; no branding. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 27. Cpu

Save as cpu.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Cpu. Subject: A compact microprocessor chip with simple gold contacts; no letters or circuit board. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 28. CreditCard

Save as creditcard.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key CreditCard. Subject: One blank payment card with a small gold chip; no numbers, name or logo. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 29. Crown

Save as crown.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Crown. Subject: A simple elegant three-point crown with a warm gold finish. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 30. CupSoda

Save as cupsoda.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key CupSoda. Subject: A plain cold-drink cup with a straw and a few ice shapes; no label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 31. DollarSign

Save as dollarsign.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key DollarSign. Subject: A generic unmarked payment coin and folded banknote; no currency symbol or amount. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 32. Droplet

Save as droplet.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Droplet. Subject: One clear water droplet with a warm gold highlight; no splash. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 33. Dumbbell

Save as dumbbell.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Dumbbell. Subject: A single compact training dumbbell with sculpted weights; no numbers. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 34. Eye

Save as eye.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Eye. Subject: A calm stylized eye with a simple iris, non-humanistic and non-surveillance. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 35. Fish

Save as fish.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Fish. Subject: One fresh whole fish in a clean sculptural form; no hook, blood or label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 36. Flame

Save as flame.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Flame. Subject: One small controlled candle flame above a plain wax base; no smoke. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 37. Flower

Save as flower.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Flower. Subject: A single elegant open flower with a short stem and two leaves. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 38. Footprints

Save as footprints.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Footprints. Subject: A pair of clean shoe-sole impressions as simple sculptural forms; no text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 39. Gamepad2

Save as gamepad2.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Gamepad2. Subject: A compact modern game controller with blank buttons and no brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 40. Gem

Save as gem.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Gem. Subject: One faceted gemstone with warm amber reflections; no jewelry setting. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 41. Gift

Save as gift.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Gift. Subject: A small neatly wrapped gift box with a tied ribbon; no tag or writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 42. GlassWater

Save as glasswater.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key GlassWater. Subject: A clear drinking glass holding water with a subtle highlight; no label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 43. Globe

Save as globe.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Globe. Subject: A small globe with abstract unlabeled land shapes; no names or flags. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 44. Handshake

Save as handshake.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Handshake. Subject: Two simplified sculpted hands meeting in a respectful handshake; no faces or text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 45. Heart

Save as heart.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Heart. Subject: A clean, friendly heart form, not anatomical. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 46. HeartPulse

Save as heartpulse.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key HeartPulse. Subject: A simple heart shape with one crisp pulse line; calm clinical styling. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 47. Home

Save as home.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Home. Subject: A small contemporary house with a simple roof, door and one window; no sign. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 48. IceCream

Save as icecream.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key IceCream. Subject: One elegant ice-cream cone with two rounded scoops; no wrapper or brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 49. Laptop

Save as laptop.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Laptop. Subject: A slim open laptop with a blank screen and warm-metal hinge; no logo. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 50. Leaf

Save as leaf.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Leaf. Subject: One fresh curved leaf with a visible central vein. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 51. Luggage

Save as luggage.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Luggage. Subject: A compact upright travel suitcase with handle and wheels; no tags or logos. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 52. Map

Save as map.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Map. Subject: A folded blank map with one raised location pin; no routes or words. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 53. MessageCircle

Save as messagecircle.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key MessageCircle. Subject: One rounded blank speech bubble with nothing written or drawn inside. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 54. Mic

Save as mic.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Mic. Subject: A simple studio microphone on a short stand; no broadcaster or logo. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 55. Mountain

Save as mountain.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Mountain. Subject: A single sculpted mountain peak with a restrained snow cap; no landscape scene. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 56. Music

Save as music.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Music. Subject: One sculptural music note with a small sound ripple; no staff or text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 57. PackageOpen

Save as packageopen.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key PackageOpen. Subject: A small open parcel with two flaps and one neutral item inside. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 58. Palette

Save as palette.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Palette. Subject: An artist paint palette with three small warm-toned paint daubs; no writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 59. Paperclip

Save as paperclip.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Paperclip. Subject: One oversized sculptural metal paperclip with a clean single loop. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 60. PenTool

Save as pentool.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key PenTool. Subject: A premium fountain-pen nib with a single small ink drop; no writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 61. Pills

Save as pills.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Pills. Subject: One capsule and one round tablet, unmarked and medication-neutral. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 62. Plane

Save as plane.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Plane. Subject: A small passenger airplane in clean profile; no airline livery or text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 63. Presentation

Save as presentation.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Presentation. Subject: A small presentation board with abstract shapes and a pointer; no words or numbers. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 64. Scissors

Save as scissors.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Scissors. Subject: A compact pair of tailor scissors with closed blades; clean and unbranded. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 65. Send

Save as send.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Send. Subject: A simple folded paper plane pointing forward; no message or writing. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 66. Shield

Save as shield.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Shield. Subject: A smooth protective shield with no emblem or text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 67. ShieldAlert

Save as shieldalert.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ShieldAlert. Subject: A protective shield with one small raised warning triangle; no words. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 68. ShieldCheck

Save as shieldcheck.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ShieldCheck. Subject: A protective shield carrying one clear checkmark; no lettering. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 69. Ship

Save as ship.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Ship. Subject: A small modern cargo ship with a few simple containers; no markings. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 70. Shirt

Save as shirt.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Shirt. Subject: A neatly presented unbranded shirt with simple fabric folds. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 71. ShoppingBag

Save as shoppingbag.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ShoppingBag. Subject: A small reusable shopping bag with a clean handle and no logo. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 72. ShoppingCart

Save as shoppingcart.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key ShoppingCart. Subject: A compact empty wire shopping trolley with two wheels; no branding. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 73. Smartphone

Save as smartphone.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Smartphone. Subject: A modern blank-screen smartphone standing at a slight angle; no apps or logos. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 74. Sparkles

Save as sparkles.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Sparkles. Subject: Three warm luminous four-point sparkles grouped as one simple symbol. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 75. Star

Save as star.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Star. Subject: One softly beveled five-point star, warm gold with clean edges. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 76. Store

Save as store.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Store. Subject: A small welcoming storefront with an awning and blank sign panel; no text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 77. Trees

Save as trees.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Trees. Subject: A small pair of simple leafy trees with sculpted canopies; no landscape. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 78. Truck

Save as truck.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Truck. Subject: A compact delivery truck in three-quarter view with a plain cargo box; no brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 79. Tv

Save as tv.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Tv. Subject: A slim modern television with a completely blank screen and no logo. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 80. Usb

Save as usb.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Usb. Subject: A generic USB plug and short cable; no lettering or device brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 81. User

Save as user.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key User. Subject: A neutral abstract single-person bust without gender or face details. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 82. UserCheck

Save as usercheck.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key UserCheck. Subject: A neutral person silhouette beside one clear checkmark; no face or gender cues. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 83. Users

Save as users.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Users. Subject: Three small neutral person silhouettes grouped together; no faces or gender cues. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 84. Utensils

Save as utensils.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Utensils. Subject: A simple fork and spoon crossed neatly with a clean stainless look. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 85. Video

Save as video.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Video. Subject: A compact blank-screen video camera with a visible lens; no brand. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 86. Volume2

Save as volume2.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Volume2. Subject: A small speaker with two clean outward sound waves; no letters. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 87. Warehouse

Save as warehouse.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Warehouse. Subject: A simple warehouse with a roller door and one plain parcel; no sign. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 88. Watch

Save as watch.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Watch. Subject: A refined wristwatch displayed upright with a blank dial and no numerals. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 89. Wifi

Save as wifi.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Wifi. Subject: A small router with two antennae and three simple signal arcs; no label. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 90. Wind

Save as wind.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Wind. Subject: A clean airy spiral of three curved wind ribbons; no smoke or clouds. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

#### 91. Zap

Save as zap.png.

```text
Create one standalone NEXG merchant-onboarding 3D subcategory symbol for icon key Zap. Subject: One compact lightning bolt with smooth sculpted faces; no device or text. Render as one premium tactile 3D object with smooth sculpted clay/resin, mostly semi-matte material and restrained polished highlights; use warm amber/golden orange, porcelain cream and restrained slate-neutral details; consistent gentle three-quarter front view, soft upper-left light, centered composition, matching scale and generous clear space. Make the silhouette recognizable at 40 px. Request genuine transparent RGBA; if unsupported, use a uniform warm-white background without a floor, gradient, frame, card, tile, badge or fake checkerboard, with a tight shadow only. No text, letters, numbers, labels, brand logo or watermark. An attached approved NEXG category image is a style/material/light reference only; do not copy its subject.
```

The catalog currently defines 21 top-level categories and 128 subcategory entries. This pack provides 21 category-specific images and 91 reusable subcategory-symbol images: 112 prompts cover all 149 selectable category/subcategory cards. Repeated subcategory icon keys intentionally reuse one image. If the catalog changes, regenerate this inventory before importing assets. General action glyphs (search, back, check, upload, field status) remain compact interface icons rather than 3D art.

## Reference repositories

- [Langatme/3dicon](https://github.com/Langatme/3dicon) was cloned as a local reference only. It is a prompt-driven skill and is not being run here.
- [realvjy/3dicons](https://github.com/realvjy/3dicons) declares [CC0-1.0](https://github.com/realvjy/3dicons/blob/develop/LICENSE); its checked-in repository content is primarily site/source and previews, not an immediately usable merchant-category asset bundle. No assets from it are integrated. The downloaded references are ignored by Git so they cannot enter the app build.

## Acceptance before code integration

- Exactly 112 approved images exist: one for each of 21 top-level category IDs and one for each of 91 distinct subcategory icon keys; all 128 subcategory entries map to the correct reusable image.
- Files are locally bundled, optimized, have real transparency (or a reviewed clean removal), and have no tile/card background.
- Every silhouette remains distinguishable at the actual rendered size in both themes, with no text or brand mark baked into the illustration.
- The existing category cards use a theme-aware selected surface and keyboard-operable buttons; replacing the temporary line icons is a separate asset-integration step.
- Record the model used, generation date, prompt and human selection in the asset manifest/changelog.
