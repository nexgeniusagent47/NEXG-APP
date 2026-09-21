// src/hooks/useMerchantSearch.ts
//
// Debounced, abortable merchant search + pagination against /api/merchants.
//
// Two behaviours that matter and are easy to get wrong:
//
// 1. DEBOUNCE. Typing "champagne" fires 9 requests otherwise.
// 2. ABORT. Responses can arrive out of order. Without cancelling the previous
//    request, a slow response for "ch" can overwrite the fast one for
//    "champagne", and the grid shows results for a query the user has left.
//    We abort the in-flight request whenever the query changes.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchMerchants,
  type ApiMerchant,
  type MerchantQueryParams,
} from '../lib/apiClient';

export type SortKey = 'recommended' | 'rating' | 'delivery' | 'price_low' | 'price_high';

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'rating', label: 'Top rated' },
  { key: 'delivery', label: 'Fastest delivery' },
  { key: 'price_low', label: 'Price: low to high' },
  { key: 'price_high', label: 'Price: high to low' },
];

/**
 * Kept for callers that already hold a complete result set.
 *
 * The live search path deliberately does NOT use this. Sorting client-side over
 * the loaded page produced a control that appeared to work and did not: the first
 * page sorted correctly, then scrolling appended the next page in server order and
 * re-sorted the union, so the visible order silently changed under the user. The
 * API now accepts a `sort` parameter and orders in SQL (see SORT_CLAUSES in
 * server/repository.ts), which is also what makes the header total honest.
 */
export function sortMerchants(merchants: ApiMerchant[], key: SortKey): ApiMerchant[] {
  const copy = [...merchants];
  switch (key) {
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
    case 'delivery':
      return copy.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    case 'price_low':
      return copy.sort((a, b) => a.priceLevel - b.priceLevel || b.rating - a.rating);
    case 'price_high':
      return copy.sort((a, b) => b.priceLevel - a.priceLevel || b.rating - a.rating);
    case 'recommended':
    default:
      return copy;
  }
}

export interface UseMerchantSearchOptions {
  category?: string;
  subcategory?: string;
  area?: string;
  query?: string;
  sort?: SortKey;
  pageSize?: number;
}

export interface UseMerchantSearchResult {
  merchants: ApiMerchant[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}

const DEBOUNCE_MS = 280;

export function useMerchantSearch(options: UseMerchantSearchOptions): UseMerchantSearchResult {
  const { category, subcategory, area, query = '', sort = 'recommended', pageSize = 24 } = options;

  const [merchants, setMerchants] = useState<ApiMerchant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);

  const trimmedQuery = query.trim();
  const abortRef = useRef<AbortController | null>(null);

  // Any change to the filter set — INCLUDING the sort key — returns to page 1.
  // Without `sort` here, changing the sort kept the current offset and fetched an
  // arbitrary late page of the newly ordered set, which looks like a broken sort.
  useEffect(() => {
    setOffset(0);
  }, [category, subcategory, area, trimmedQuery, pageSize, sort]);

  useEffect(() => {
    const isFirstPage = offset === 0;

    const timer = setTimeout(
      () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (isFirstPage) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const params: MerchantQueryParams = {
          limit: pageSize,
          offset,
          category,
          subcategory,
          area,
          search: trimmedQuery || undefined,
          sort,
        };

        fetchMerchants(params, controller.signal)
          .then((page) => {
            setTotal(page.total);
            setMerchants((prev) => (isFirstPage ? page.merchants : [...prev, ...page.merchants]));
            setLoading(false);
            setLoadingMore(false);
          })
          .catch((err: any) => {
            if (err?.name === 'AbortError') return;
            setError(err?.message ?? 'Could not load merchants');
            setLoading(false);
            setLoadingMore(false);
          });
      },
      isFirstPage ? DEBOUNCE_MS : 0
    );

    return () => clearTimeout(timer);
  }, [category, subcategory, area, trimmedQuery, offset, pageSize, sort, reloadToken]);

  // Cancel any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const loadMore = useCallback(() => {
    setOffset((current) => current + pageSize);
  }, [pageSize]);

  const retry = useCallback(() => setReloadToken((n) => n + 1), []);

  return {
    // Already ordered by the API. No client-side re-sort, which is what used to
    // make the order change under the user as pages arrived.
    merchants,
    total,
    loading,
    loadingMore,
    error,
    hasMore: merchants.length > 0 && merchants.length < total,
    loadMore,
    retry,
  };
}
