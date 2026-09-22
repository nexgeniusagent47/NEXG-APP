// REBRAND: "Concierge" -> "App" in UI copy, plus the data template.
//
// Scope was measured first rather than guessed:
//   43    capitalised "NEXG Concierge" brand strings across 21 UI files
//   155   bare "Concierge" labels as UI text
//   55    constructed strings like "Concierge Partner"
//   9,300 lowercase "NEXG concierge" inside seed/generated catalogue copy
//
// The distinction that matters: "concierge" is ALSO an ordinary English noun in this
// product's voice ("enjoy swift concierge delivery"). Rewriting the noun would corrupt
// marketing copy, so lowercase occurrences are only touched where they name the brand.
import { readFileSync, writeFileSync } from 'node:fs';

/* ---------------------------------------------------------------- UI strings ---- */

// Ordered longest-first so "NEXG Concierge" is replaced before a bare "Concierge",
// otherwise the first rule would leave a stray "NEXG App".
const UI_REPLACEMENTS = [
  // Brand phrase, both cases.
  [/\bNEXG\s+CONCIERGE\b/g, 'NEXG APP'],
  [/\bNEXG\s+Concierge\b/g, 'NEXG App'],
  // Constructed UI strings.
  [/\bConcierge\s+Partner\b/g, 'App Partner'],
  [/\bConcierge\s+Request\b/g, 'App Request'],
  [/\bConcierge\s+Service\b/g, 'App Service'],
  [/\bConcierge\s+Team\b/g, 'App Team'],
  [/\bConcierge\s+Collection\b/g, 'App Collection'],
  [/\bVilla\s+Concierge\b/g, 'Villa App'],
  // Remaining UPPERCASE label forms.
  [/\bCONCIERGE\b/g, 'APP'],
  // Bare title-case label, but NOT when part of a sentence like "concierge delivery".
  // Title case is the signal: a mid-sentence common noun is lowercase.
  [/(?<![.\w])Concierge(?![a-z])/g, 'App'],
];

/* --------------------------------------------------------------- data files ---- */

// The generator template. Lowercase here because it names the brand inside a sentence:
// "...dispatched by the NEXG concierge team."
const DATA_REPLACEMENTS = [
  [/NEXG concierge team/g, 'NEXG App team'],
  [/NEXG concierge/g, 'NEXG App'],
  [/NEXG Concierge/g, 'NEXG App'],
];

const UI_FILES = [
  'src/data/translations.ts',
  'src/data/categoryCatalog21.ts',
  'src/data/merchantCatalog.ts',
  'src/data/experienceRegistry.ts',
  'src/components/BookingCalendar.tsx',
  'src/components/CheckoutSimulatedModal.tsx',
  'src/components/CourierOnboarding.tsx',
  'src/components/DatabaseSqlModal.tsx',
  'src/components/ForCouriers.tsx',
  'src/components/ForMerchants.tsx',
  'src/components/ForProperties.tsx',
  'src/components/GoogleReviewsModal.tsx',
  'src/components/HostOnboarding.tsx',
  'src/components/MerchantOnboarding.tsx',
  'src/components/NexGLandingHero.tsx',
  'src/components/OrderTrackingModal.tsx',
  'src/components/Promo.tsx',
  'src/components/UnifiedItemModal.tsx',
  'src/components/nexg/NexGItemSheet.tsx',
  'src/context/CartContext.tsx',
  'src/components/discovery/DiscoveryScreen.tsx',
  'src/components/merchant/MerchantView.tsx',
  'src/components/MerchantAdCarousel.tsx',
  'src/components/Footer.tsx',
  'index.html',
];

const DATA_FILES = ['src/db/seed_excel.sql', 'src/data/seededCatalog.json'];

let total = 0;
const report = [];

function apply(file, rules) {
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    return;
  }
  const before = src;
  let n = 0;
  for (const [re, to] of rules) {
    const m = src.match(re);
    if (m) n += m.length;
    src = src.replace(re, to);
  }
  if (src !== before) {
    writeFileSync(file, src, 'utf8');
    total += n;
    report.push([file, n]);
  }
}

for (const f of UI_FILES) apply(f, UI_REPLACEMENTS);
for (const f of DATA_FILES) apply(f, DATA_REPLACEMENTS);

console.log('=== changed files ===');
for (const [f, n] of report.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(5)}  ${f}`);
}
console.log(`\ntotal replacements: ${total}`);
