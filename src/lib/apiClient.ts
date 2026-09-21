// src/lib/apiClient.ts
//
// Typed access to the NEXG API.
//
// Always call same-origin `/api/*`: Vite proxies it to the Express server in dev
// (see vite.config.ts) and the Express app serves the built SPA in production.
// That means no hardcoded host, and no CORS preflight.
//
// Every function accepts an AbortSignal so React effects can cancel in-flight
// requests — without this, fast typing produces out-of-order responses and the
// grid renders results for a stale query.

const JSON_HEADERS = { Accept: 'application/json' } as const;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { headers: JSON_HEADERS, signal });
  } catch (err: any) {
    // Abort is a normal control-flow event, not a failure to report.
    if (err?.name === 'AbortError') throw err;
    throw new ApiError(`Network error reaching ${path}`, 0);
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error ?? '';
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(detail || `Request failed (${res.status})`, res.status);
  }

  return (await res.json()) as T;
}

// ------------------------------------------------------------------ API shapes

export interface ApiSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  image_url?: string;
  subcategories: ApiSubcategory[];
}

export interface ApiItem {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  category: string;
  categoryId: string;
  subcategory: string;
  isAvailable?: boolean;
}

export interface ApiMerchant {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  subcategory: string;
  subcategoryId?: string;
  nairobiArea: string;
  address: string;
  brandArchetype?: string;
  brandPalette?: string;
  workflow: string;
  rating: number;
  ratingCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTime: string;
  deliveryFee: number;
  priceLevel: number;
  heroImage: string;
  logoUrl: string;
  badges: string[];
  isOpen: boolean;
  specialOffer?: string;
  items: ApiItem[];
}

export interface ApiHealth {
  status: string;
  source: 'postgres' | 'seeded_json_fallback';
  postgresConnected: boolean;
  totalCategories: number;
  totalSubcategories: number;
  totalMerchants: number;
  totalItems: number;
}

// ------------------------------------------------------------------- endpoints

export function fetchHealth(signal?: AbortSignal) {
  return getJson<ApiHealth>('/api/health', signal);
}

export async function fetchCategories(signal?: AbortSignal): Promise<ApiCategory[]> {
  const data = await getJson<{ categories: ApiCategory[] }>('/api/categories', signal);
  return data.categories ?? [];
}

export interface MerchantQueryParams {
  limit?: number;
  offset?: number;
  category?: string;
  subcategory?: string;
  area?: string;
  search?: string;
  /** Whitelisted server-side sort key. See SORT_CLAUSES in server/repository.ts. */
  sort?: string;
}

export interface MerchantPage {
  total: number;
  offset: number;
  limit: number;
  merchants: ApiMerchant[];
}

export function fetchMerchants(params: MerchantQueryParams = {}, signal?: AbortSignal) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    qs.set(key, String(value));
  }
  const suffix = qs.toString() ? `?${qs}` : '';
  return getJson<MerchantPage>(`/api/merchants${suffix}`, signal);
}

export function fetchMerchant(idOrSlug: string, signal?: AbortSignal) {
  return getJson<ApiMerchant>(`/api/merchants/${encodeURIComponent(idOrSlug)}`, signal);
}

export function fetchSearch(q: string, limit = 20, signal?: AbortSignal) {
  const qs = new URLSearchParams({ q, limit: String(limit) });
  return getJson<{ query: string; merchants: ApiMerchant[]; items: ApiItem[] }>(
    `/api/search?${qs}`,
    signal
  );
}

export async function fetchAreas(signal?: AbortSignal): Promise<string[]> {
  const data = await getJson<{ areas: string[] }>('/api/areas', signal);
  return data.areas ?? [];
}
