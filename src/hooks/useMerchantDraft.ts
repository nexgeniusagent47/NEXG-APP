// src/hooks/useMerchantDraft.ts
//
// Draft persistence for the long merchant onboarding form.
//
// SNAPSHOT STYLE, NOT OWNED STATE
// The obvious shape for this hook is to own a single state object and hand back a
// setter. That suits a form written that way, and it is why an earlier generic hook in
// this repo went unused: MerchantOnboarding is 1,930 lines with twenty-odd independent
// `useState` calls, and collapsing those into one object purely to enable a save would
// be a large, risky refactor of the longest form in the product.
//
// So this inverts the arrangement: the caller keeps its own state and hands over a
// snapshot to save. Restoring happens once, at initialisation, through a plain read —
// which also means the first paint is already correct, rather than rendering an empty
// form and replacing it.
//
// The key and version are options because HostOnboarding also persists a draft. Two
// forms sharing one key would silently read each other's data, which is worse than
// either having no draft at all.
//
// New writes go to the Express API. `readMerchantDraft` remains as a one-time
// migration path for drafts saved by older builds in local storage.
//
// Transient view state stays in memory. The map modal, its Leaflet coordinates, live
// Nominatim search results, `isResolving` flags and active branch row are session-only.
//
// File inputs still only track names in this UI. Binary document upload is separate work.

import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteOnboardingDraft, saveOnboardingDraft } from '../lib/onboardingApi';

/** Bump when a persisted field changes shape.
 *
 * A stored draft from an older version is DISCARDED rather than merged. A partially
 * matching object fails in confusing ways — a field that is present but means something
 * else — whereas starting clean is merely annoying, and the applicant is still on the
 * first step either way.
 */
export const MERCHANT_DRAFT_VERSION = 1;

const DEFAULT_KEY = 'nexg_merchant_onboarding_draft';

interface StoredDraft<T> {
  version: number;
  savedAt: string;
  data: T;
}

/** Read a draft once, at initialisation. Never throws: storage access can fail. */
export function readMerchantDraft<T extends object>(
  fallback: T,
  options: { key?: string; version?: number } = {}
): { data: T; savedAt: Date | null } {
  const key = options.key ?? DEFAULT_KEY;
  const version = options.version ?? MERCHANT_DRAFT_VERSION;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { data: fallback, savedAt: null };

    const parsed = JSON.parse(raw) as Partial<StoredDraft<Partial<T>>>;
    if (parsed.version !== version || !parsed.data || typeof parsed.data !== 'object') {
      return { data: fallback, savedAt: null };
    }
    return {
      data: { ...fallback, ...parsed.data },
      savedAt: parsed.savedAt ? new Date(parsed.savedAt) : null,
    };
  } catch {
    // Corrupt JSON, a quota error, or storage disabled entirely. An empty form is right.
    return { data: fallback, savedAt: null };
  }
}

export interface MerchantDraftResult {
  /** Call with the current snapshot whenever the form changes. Debounced internally. */
  save: (snapshot: Record<string, unknown>) => void;
  /** Remove the draft. Call on successful submit, never before. */
  clear: () => void;
  /** When the draft was last written, for a "saved" indicator. */
  savedAt: Date | null;
  /** True once a draft was found and used. */
  restored: boolean;
  /** False when storage is unavailable, so the UI can warn instead of silently losing work. */
  available: boolean;
}

export function useMerchantDraft(
  restoredAt: Date | null,
  options: { key?: string; version?: number; debounceMs?: number } = {}
): MerchantDraftResult {
  const key = options.key ?? DEFAULT_KEY;
  const version = options.version ?? MERCHANT_DRAFT_VERSION;
  const debounceMs = options.debounceMs ?? 700;
  const [savedAt, setSavedAt] = useState<Date | null>(restoredAt);
  const [available, setAvailable] = useState(true);
  const [restored] = useState(restoredAt !== null);

  const timer = useRef<number | null>(null);
  const latest = useRef<Record<string, unknown> | null>(null);
  // Skip the write that would immediately re-save what was just read, which would make
  // a freshly opened form look like it had been edited.
  const armed = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      armed.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const save = useCallback(
    (snapshot: Record<string, unknown>) => {
      latest.current = snapshot;
      if (!armed.current) return;

      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        void saveOnboardingDraft('merchant', latest.current ?? {}, version)
          .then((result) => {
            setSavedAt(new Date(result.savedAt));
            setAvailable(true);
          })
          .catch(() => {
            // A failed API write must be visible as an unsaved draft. Do not silently
            // fall back to local storage for identity and payout details.
            setAvailable(false);
          });
      }, debounceMs);
    },
    [key, version, debounceMs]
  );

  const clear = useCallback(() => {
    void deleteOnboardingDraft('merchant').catch(() => setAvailable(false));
    try { window.localStorage.removeItem(key); } catch { /* legacy draft may be unavailable */ }
    setSavedAt(null);
  }, [key]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  return { save, clear, savedAt, restored, available };
}
