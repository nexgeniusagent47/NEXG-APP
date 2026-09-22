// scripts/device-presets.mjs
//
// The single list of device sizes this project reviews against.
//
// WHY SHARED: two things consume it — the audit
// (`logs/critique/_device-matrix.mjs`) and the visual room
// (`scripts/device-room/`). If each kept its own copy they would drift, and a
// "clean" audit would stop meaning anything about what was actually looked at.
//
// The phones are the real sizes people in this market use, not one generic
// "mobile" viewport. A layout that survives 390px can still break at 360px, which
// is the most common Android width here (Tecno, Infinix, older Samsung), and at
// 320px (iPhone SE, older Androids), which is where overflow and clipped text appear.
//
// `tier` records which of the app's own Tailwind breakpoints the width falls in
// (`sm` 640, `md` 768, `lg` 1024, `xl` 1280 — the only four the codebase uses).
// It is a label, not a rule: the point of the narrow tiers is that they show the
// un-broken base layout, which is where defects hide.

export const DEVICE_PRESETS = [
  // ---- xs: below the first breakpoint (640). Base layout, most fragile.
  { id: 'se1', name: 'iPhone SE (1st)', w: 320, h: 568, tier: 'xs', category: 'phone', critical: true },
  { id: 'fold', name: 'Galaxy Z Fold (outer)', w: 344, h: 882, tier: 'xs', category: 'phone', critical: true },
  { id: 's8', name: 'Galaxy S8/S9', w: 360, h: 740, tier: 'xs', category: 'phone', critical: true },
  { id: 'tecno', name: 'Tecno Spark', w: 360, h: 720, tier: 'xs', category: 'phone', critical: true },
  { id: 's21', name: 'Galaxy S21/S22/S23', w: 360, h: 780, tier: 'xs', category: 'phone', critical: true },
  { id: 'infinix', name: 'Infinix Hot', w: 360, h: 760, tier: 'xs', category: 'phone', critical: true },

  // ---- xs→sm: the common iPhone widths, all still below 640.
  { id: 'se3', name: 'iPhone SE (3rd)', w: 375, h: 667, tier: 'xs', category: 'phone' },
  { id: 'mini', name: 'iPhone 12/13 mini', w: 375, h: 812, tier: 'xs', category: 'phone' },
  { id: 'ip14', name: 'iPhone 14/15/16', w: 390, h: 844, tier: 'xs', category: 'phone' },
  { id: 'redmi', name: 'Xiaomi Redmi Note', w: 393, h: 851, tier: 'xs', category: 'phone' },
  { id: 'ip16pro', name: 'iPhone 16 Pro', w: 402, h: 874, tier: 'xs', category: 'phone' },
  { id: 's24u', name: 'Galaxy S23/S24 Ultra', w: 412, h: 915, tier: 'xs', category: 'phone' },
  { id: 'ip14pm', name: 'iPhone 14/15 Pro Max', w: 430, h: 932, tier: 'xs', category: 'phone' },
  { id: 'ip16pm', name: 'iPhone 16 Pro Max', w: 440, h: 956, tier: 'xs', category: 'phone' },

  // ---- tablet: first size at or above `sm` (640) and `md` (768).
  { id: 'ipad-mini', name: 'iPad mini', w: 744, h: 1133, tier: 'sm', category: 'tablet' },
  { id: 'ipad', name: 'iPad 10.9', w: 820, h: 1180, tier: 'md', category: 'tablet' },

  // ---- desktop: `lg` (1024) and `xl` (1280). The nav switches to its full
  // horizontal form at `xl`, which is why both are kept.
  { id: 'laptop', name: 'Laptop 1024', w: 1024, h: 768, tier: 'lg', category: 'desktop' },
  { id: 'desktop', name: 'Desktop 1280', w: 1280, h: 800, tier: 'xl', category: 'desktop' },
  { id: 'wide', name: 'Desktop 1440', w: 1440, h: 900, tier: 'xl', category: 'desktop' },
];

/**
 * The distinct widths that break most often, measured — not guessed. The audit found
 * 37 of 72 device x page combinations broken, and every one of them sat at 320, 344 or
 * 360.
 *
 * Derived from the `critical` flag rather than listed separately, so a new preset
 * cannot be added to one and forgotten in the other. Deduplicated because four
 * different 360px phones share it and a set of widths should not repeat itself.
 */
export const CRITICAL_WIDTHS = [...new Set(DEVICE_PRESETS.filter((d) => d.critical).map((d) => d.w))];

/**
 * Pages addressable with `?page=`, mirroring DEEP_LINK_PAGES in src/App.tsx.
 * A value outside that allow-list renders the home page with no error, so a typo
 * here would silently audit the wrong screen.
 *
 * `merchant` is appended as a query parameter rather than a page, and is what makes
 * the merchant page addressable at all (see merchantIdFromUrl in src/App.tsx).
 */
export const ROUTES = [
  { id: 'home', label: 'Home', page: 'home', path: '/' },
  { id: 'merchants', label: 'Merchants', page: 'merchants', path: '/?page=merchants' },
  { id: 'restaurants', label: 'Fine Dining', page: 'restaurants', path: '/?page=restaurants' },
  { id: 'spa', label: 'Spa & Wellness', page: 'spa', path: '/?page=spa' },
  { id: 'transport', label: 'VIP Mobility', page: 'transport', path: '/?page=transport' },
  { id: 'groceries', label: 'Fine Cellar', page: 'groceries', path: '/?page=groceries' },
  { id: 'experiences', label: 'Experiences', page: 'experiences', path: '/?page=experiences' },
  { id: 'properties', label: 'Properties', page: 'properties', path: '/?page=properties' },
  { id: 'couriers', label: 'Couriers', page: 'couriers', path: '/?page=couriers' },
  {
    id: 'merchant_onboarding',
    label: 'Merchant onboarding',
    page: 'merchant_onboarding',
    path: '/?page=merchant_onboarding',
  },
  {
    id: 'courier_onboarding',
    label: 'Courier onboarding',
    page: 'courier_onboarding',
    path: '/?page=courier_onboarding',
  },
  {
    id: 'host_onboarding',
    label: 'Host onboarding',
    page: 'host_onboarding',
    path: '/?page=host_onboarding',
  },
  { id: 'metrics', label: 'Metrics', page: 'metrics', path: '/?page=metrics' },
];
