// scripts/device-presets.mjs
//
// The single list of device sizes this project reviews against.
//
// TWO SIZES PER DEVICE, and the difference matters.
//
//   `w` / `h`   the LOGICAL viewport in CSS pixels. This is what the page inside a frame must
//               lay out to, and it is why 390 is right for an iPhone 14.
//   `mmW`/`mmH` the PHYSICAL size of the object in millimetres, from the manufacturer.
//
// Drawing a frame at its logical width makes it the wrong size on screen. 390 CSS pixels is
// about four inches on a normal monitor; the phone it represents is 2.81 inches wide. The room
// was therefore showing every device roughly 35% too large, which is what "stupidly big, so it
// loses the point" describes — the dimensions were right and the object was not.
//
// Actual size is possible because CSS fixes 96px to one inch and every browser honours it, so
// millimetres are a reliable unit: a 71.5mm phone renders at 270 CSS px and measures 2.81
// inches against a ruler on any display. The frame keeps its logical viewport and is scaled
// down to its physical width.

export const DEVICE_PRESETS = [
  // ---- xs: below the first breakpoint (640). Base layout, most fragile.
  { id: 'se1', name: 'iPhone SE (1st)', w: 320, h: 568, mmW: 58.6, mmH: 123.8, tier: 'xs', category: 'phone', critical: true },
  { id: 'fold', name: 'Galaxy Z Fold (outer)', w: 344, h: 882, mmW: 67.1, mmH: 154.9, tier: 'xs', category: 'phone', critical: true },
  { id: 's8', name: 'Galaxy S8/S9', w: 360, h: 740, mmW: 68.1, mmH: 148.9, tier: 'xs', category: 'phone', critical: true },
  { id: 'tecno', name: 'Tecno Spark', w: 360, h: 720, mmW: 76.5, mmH: 164, tier: 'xs', category: 'phone', critical: true },
  { id: 's21', name: 'Galaxy S21/S22/S23', w: 360, h: 780, mmW: 71.2, mmH: 151.7, tier: 'xs', category: 'phone', critical: true },
  { id: 'infinix', name: 'Infinix Hot', w: 360, h: 760, mmW: 76, mmH: 164, tier: 'xs', category: 'phone', critical: true },

  // ---- xs→sm: the common iPhone widths, all still below 640.
  { id: 'se3', name: 'iPhone SE (3rd)', w: 375, h: 667, mmW: 67.3, mmH: 138.4, tier: 'xs', category: 'phone' },
  { id: 'mini', name: 'iPhone 12/13 mini', w: 375, h: 812, mmW: 64.2, mmH: 131.5, tier: 'xs', category: 'phone' },
  { id: 'ip14', name: 'iPhone 14/15/16', w: 390, h: 844, mmW: 71.5, mmH: 146.7, tier: 'xs', category: 'phone' },
  { id: 'redmi', name: 'Xiaomi Redmi Note', w: 393, h: 851, tier: 'xs', category: 'phone' },
  { id: 'ip16pro', name: 'iPhone 16 Pro', w: 402, h: 874, mmW: 71.5, mmH: 149.6, tier: 'xs', category: 'phone' },
  { id: 's24u', name: 'Galaxy S23/S24 Ultra', w: 412, h: 915, mmW: 79, mmH: 162.3, tier: 'xs', category: 'phone' },
  { id: 'ip14pm', name: 'iPhone 14/15 Pro Max', w: 430, h: 932, mmW: 78.1, mmH: 160.8, tier: 'xs', category: 'phone' },
  { id: 'ip16pm', name: 'iPhone 16 Pro Max', w: 440, h: 956, mmW: 76.7, mmH: 163, tier: 'xs', category: 'phone' },

  // ---- Samsung Galaxy A series. The A series is what most Samsung owners in this
  // market actually hold, not the S or Ultra, and it is the brand the user named
  // explicitly. Widths differ from the S series at the same nominal size, so they
  // earn their own entries rather than being folded into the S rows.
  { id: 'a03', name: 'Galaxy A03/A04', w: 360, h: 800, mmW: 75.9, mmH: 164.2, tier: 'xs', category: 'phone', critical: true },
  { id: 'a13', name: 'Galaxy A13/A14', w: 360, h: 800, mmW: 76, mmH: 165.1, tier: 'xs', category: 'phone' },
  { id: 'a24', name: 'Galaxy A24/A25', w: 393, h: 873, mmW: 76.1, mmH: 162.1, tier: 'xs', category: 'phone' },
  { id: 'a34', name: 'Galaxy A34/A35', w: 393, h: 873, mmW: 76.1, mmH: 161.3, tier: 'xs', category: 'phone' },
  { id: 'a54', name: 'Galaxy A54/A55', w: 412, h: 915, mmW: 77.1, mmH: 158.2, tier: 'xs', category: 'phone' },

  // ---- Redmi and the wider Xiaomi family. Redmi Note and the POCO rebrands are the
  // highest-volume Android phones in Kenya, so they carry more weight here than any
  // flagship.
  { id: 'redmi9', name: 'Redmi 9/9A', w: 360, h: 800, mmW: 77, mmH: 164.9, tier: 'xs', category: 'phone', critical: true },
  { id: 'redmi10', name: 'Redmi 10/10A', w: 360, h: 800, mmW: 76.5, mmH: 164.5, tier: 'xs', category: 'phone' },
  { id: 'redmi12', name: 'Redmi 12/12C', w: 393, h: 851, mmW: 76, mmH: 168.6, tier: 'xs', category: 'phone' },
  { id: 'redmi13c', name: 'Redmi 13C', w: 360, h: 800, mmW: 77, mmH: 168, tier: 'xs', category: 'phone' },
  { id: 'note12', name: 'Redmi Note 12/13', w: 393, h: 873, mmW: 76, mmH: 162, tier: 'xs', category: 'phone' },
  { id: 'note13pro', name: 'Redmi Note 13 Pro', w: 412, h: 915, mmW: 74.2, mmH: 161.2, tier: 'xs', category: 'phone' },
  { id: 'poco', name: 'POCO M/X series', w: 393, h: 873, mmW: 76, mmH: 165, tier: 'xs', category: 'phone' },

  // ---- The other Android brands with real share here.
  { id: 'oppo', name: 'Oppo A series', w: 360, h: 800, mmW: 75, mmH: 163, tier: 'xs', category: 'phone' },
  { id: 'vivo', name: 'Vivo Y series', w: 360, h: 800, mmW: 75, mmH: 164, tier: 'xs', category: 'phone' },
  { id: 'realme', name: 'Realme C series', w: 360, h: 800, mmW: 76, mmH: 165, tier: 'xs', category: 'phone' },
  { id: 'nokia', name: 'Nokia G/C series', w: 360, h: 800, mmW: 75, mmH: 165, tier: 'xs', category: 'phone' },

  // ---- tablet: first size at or above `sm` (640) and `md` (768).
  { id: 'ipad-mini', name: 'iPad mini', w: 744, h: 1133, mmW: 134.8, mmH: 195.4, tier: 'sm', category: 'tablet' },
  { id: 'ipad', name: 'iPad 10.9', w: 820, h: 1180, mmW: 174.1, mmH: 250.6, tier: 'md', category: 'tablet' },
  { id: 'tab-a9', name: 'Galaxy Tab A9', w: 800, h: 1280, mmW: 124.7, mmH: 201, tier: 'md', category: 'tablet' },

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
