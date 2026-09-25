// src/components/merchant/MerchantRoute.tsx
//
// Loads a merchant's full record and renders the consistent MerchantView.
//
// The discovery list returns merchants with a capped item preview, so the full
// page re-fetches by id to get the complete catalogue. That also means a page
// refresh or a shared link can render a merchant from an id alone.
//
// Loading and error states are real states, not afterthoughts: the page is
// reachable directly, so a failed fetch has to explain itself and offer a way out.

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { fetchMerchant, type ApiItem, type ApiMerchant } from '../../lib/apiClient';
import MerchantView from './MerchantView';

interface MerchantRouteProps {
  merchantId: string;
  /** Rendered immediately while the full record loads, avoiding a blank flash. */
  fallback?: ApiMerchant | null;
  onBack: () => void;
  onAddedToCart?: (summary: { item: ApiItem; quantity: number }) => void;
  /** Scroll the offerings into view — set when arriving from the sheet's workflow CTA. */
  focusOfferings?: boolean;
}

export default function MerchantRoute({
  merchantId,
  fallback = null,
  onBack,
  onAddedToCart,
  focusOfferings = false,
}: MerchantRouteProps) {
  const { t } = useLanguage();
  const { isLight } = useTheme();
  const [merchant, setMerchant] = useState<ApiMerchant | null>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchMerchant(merchantId, controller.signal)
      .then((full) => {
        setMerchant(full);
        setLoading(false);
      })
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        setError(err?.message ?? 'Could not load this merchant');
        setLoading(false);
      });

    return () => controller.abort();
  }, [merchantId, reloadToken]);

  if (error && !merchant) {
    return (
      <div className={cn('min-h-[100dvh] flex items-center justify-center px-4', isLight ? 'bg-gold-canvas' : 'bg-[#111315]')}>
        <div
          className={cn(
            'max-w-sm w-full rounded-2xl border p-8 text-center',
            isLight ? 'bg-white border-slate-200' : 'bg-[#181A1F] border-white/10'
          )}
        >
          <p className="text-sm font-bold text-rose-500">{error}</p>
          <p className={cn('text-xs mt-1.5', isLight ? 'text-slate-600' : 'text-gray-400')}>{t.ui.merchantRoute.s_176135}<code className="font-mono">npm run server</code>.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setReloadToken((n) => n + 1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d] active:scale-[0.98] transition-transform"
            >
              <RefreshCw size={13} />
              Try again
            </button>
            <button
              type="button"
              onClick={onBack}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-bold border transition-colors',
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  : 'bg-white/5 border-white/15 text-gray-100 hover:bg-white/10'
              )}
            >{t.ui.merchantRoute.s_e84712}</button>
          </div>
        </div>
      </div>
    );
  }

  // While the full record loads we already have the list copy, so render it rather
  // than a spinner. The item list fills in when the detail response lands.
  if (!merchant) {
    return (
      <div className={cn('min-h-[100dvh] flex items-center justify-center', isLight ? 'bg-gold-canvas' : 'bg-[#111315]')}>
        <div
          className={cn(
            'flex items-center gap-2 text-xs font-semibold',
            isLight ? 'text-slate-600' : 'text-gray-400'
          )}
        >
          <RefreshCw size={14} className="animate-spin" />{t.ui.merchantRoute.s_a1ca54}</div>
      </div>
    );
  }

  return (
    <MerchantView
      merchant={merchant}
      onBack={onBack}
      onAddedToCart={onAddedToCart}
      focusOfferings={focusOfferings}
    />
  );
}
