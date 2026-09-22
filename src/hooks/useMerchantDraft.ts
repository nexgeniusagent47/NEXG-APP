// src/hooks/useMerchantDraft.ts
//
// Draft persistence for the merchant onboarding form.
//
// WHY THIS IS A SEPARATE HOOK FROM `useDraftPersistence`
// The generic hook owns a single state object, which suits a form written that way.
// MerchantOnboarding is 1,930 lines with twenty-odd independent `useState` calls, and
// collapsing those into one object to satisfy a hook would be a large, risky refactor of
// the longest form in the product purely to enable a save.
//
// So this inverts the arrangement: the caller keeps its own state and hands over a
// snapshot to save. Restoring happens once, at initialisation, through a plain read.
//
// WHAT IS PERSISTED, AND WHAT DELIBERATELY IS NOT
// Persisted: everything the applicant typed — step, category, profile, contacts,
// branches, hours, delivery, banking. That is the work that would otherwise be lost.
//
// Not persisted: transient view state. The map modal, its Leaflet coordinates, live
// Nominatim search results, `isResolving` flags and which branch row is active are all
// derived from a session, and restoring them would reopen a modal the user had closed
// and re-fire geocoding requests on load.
//
// Nor are uploaded files. A File cannot be serialised, base64 in localStorage would
// exhaust the ~5 MB quota immediately, and silently writing identity documents to disk
// is a privacy decision nobody asked for. The UI must re-prompt, and says so.

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'nexg_merchant_onboarding_draft';

/**
 * Bump when a persisted field changes shape.
 *
 * A stored draft from an older version is DISCARDED rather than merged. A partially
 * matching object fails in confusing ways — a field that is present but means something
 * else — whereas starting clean is merely annoying, and the applicant is still on the
 * first step either way.
 */
const DRAFT_VERSION = 1;

interface StoredDraft<T> {
  version: number;
  savedAt: string;
  data: T;
}

/** Read a draft once, at initialisation. Never throws: storage access can fail. */
export function readMerchantDraft<T extends object>(fallback: T): { data: T; savedAt: Date | null } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: fallback, savedAt: null };

    const parsed = JSON.parse(raw) as Partial<StoredDraft<Partial<T>>>;
    if (parsed.version !== DRAFT_VERSION || !parsed.data || typeof parsed.data !== 'object') {
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

export function useMerchantDraft(restoredAt: Date | null, debounceMs = 700): MerchantDraftResult {
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
        try {
          const payload: StoredDraft<Record<string, unknown>> = {
            version: DRAFT_VERSION,
            savedAt: new Date().toISOString(),
            data: latest.current ?? {},
          };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
          setSavedAt(new Date(payload.savedAt));
          setAvailable(true);
        } catch {
          // Quota exceeded, or storage blocked. Surface it so the UI can say the work is
          // not being kept: silently failing to save is the worst outcome, because the
          // applicant closes the tab believing it is safe.
          setAvailable(false);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Usually called while navigating away on success; nothing useful to do.
    }
    setSavedAt(null);
  }, []);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  return { save, clear, savedAt, restored, available };
}
