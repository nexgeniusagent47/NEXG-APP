// src/hooks/useDraftPersistence.ts
//
// Keeps an in-progress form alive across a tab close, a reload, or a crash.
//
// WHY THIS EXISTS
// The merchant onboarding form is long — tax details, banking, locations, documents.
// Someone who leaves to fetch a document and comes back to an empty form does not
// start again; they abandon. Persisting the draft is the difference between a
// completed application and an empty one.
//
// This generalises the versioned draft handling already written inline in
// HostOnboarding so both forms behave identically rather than drifting apart.
//
// WHAT IT DELIBERATELY DOES NOT SAVE
// File uploads. A File object cannot be serialised, base64 in localStorage would blow
// the ~5 MB quota immediately, and silently persisting identity documents to disk is a
// privacy decision nobody asked for. The UI must re-prompt for those, and callers
// should say so rather than pretend the upload survived.

import { useCallback, useEffect, useRef, useState } from 'react';

export interface DraftOptions<T> {
  /** localStorage key. Namespace it, e.g. `nexg_merchant_onboarding`. */
  key: string;
  /**
   * Bump when the SHAPE of T changes. A stored draft from an older version is
   * discarded rather than merged: a half-matching object fails in confusing ways
   * (a field that is present but means something else), whereas starting clean is
   * merely annoying.
   */
  version: number;
  /** Applied over the stored values so a newly added field gets its default. */
  initial: T;
  /** Debounce before writing, in ms. */
  debounceMs?: number;
}

export interface DraftResult<T> {
  /** The value to render: initial, or the restored draft. */
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  /** True once a stored draft was found and used, so the UI can say so. */
  restored: boolean;
  /** When the draft was last written, for a "saved" indicator. */
  savedAt: Date | null;
  /** Clear the draft. Call on successful submit. */
  clear: () => void;
  /** False when storage is unavailable (private mode, blocked cookies). */
  available: boolean;
}

interface StoredDraft<T> {
  version: number;
  savedAt: string;
  value: T;
}

/**
 * Read a draft without ever throwing.
 *
 * Storage access throws in more situations than people expect — Safari private mode,
 * a blocked third-party context, a full quota — and a form that fails to mount because
 * a cache read threw is far worse than one that starts empty.
 */
function readDraft<T>(key: string, version: number, initial: T): { value: T; savedAt: Date | null } {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { value: initial, savedAt: null };

    const parsed = JSON.parse(raw) as Partial<StoredDraft<Partial<T>>>;
    if (parsed.version !== version || !parsed.value) return { value: initial, savedAt: null };

    // Spread over initial so a field added since the draft was written still gets a
    // default instead of arriving as undefined.
    return {
      value: { ...initial, ...parsed.value },
      savedAt: parsed.savedAt ? new Date(parsed.savedAt) : null,
    };
  } catch {
    // Corrupt JSON, a quota error, or storage disabled. An empty form is correct.
    return { value: initial, savedAt: null };
  }
}

export function useDraftPersistence<T>({
  key,
  version,
  initial,
  debounceMs = 600,
}: DraftOptions<T>): DraftResult<T> {
  // Read once, lazily, so the first render already has the restored value. Reading in
  // an effect would render the empty form first and then replace it, which flashes
  // and makes the cursor jump.
  const first = useRef<{ value: T; savedAt: Date | null } | null>(null);
  if (first.current === null) {
    first.current = readDraft(key, version, initial);
  }

  const [value, setValue] = useState<T>(first.current.value);
  const [savedAt, setSavedAt] = useState<Date | null>(first.current.savedAt);
  const [available, setAvailable] = useState(true);
  const [restored, setRestored] = useState(first.current.savedAt !== null);

  // Skip the first write: it would immediately re-save what was just read, touching
  // savedAt and making a freshly opened form look like it had been edited.
  const isFirstWrite = useRef(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }

    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        const payload: StoredDraft<T> = {
          version,
          savedAt: new Date().toISOString(),
          value,
        };
        window.localStorage.setItem(key, JSON.stringify(payload));
        setSavedAt(new Date(payload.savedAt));
        setAvailable(true);
      } catch {
        // Quota exceeded or storage blocked. Surface it once so the UI can warn the
        // user their work is not being kept — silently failing to save is the worst
        // outcome, because they will close the tab believing it is safe.
        setAvailable(false);
      }
    }, debounceMs);

    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [key, version, value, debounceMs]);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing useful to do; the caller is usually navigating away on success.
    }
    setSavedAt(null);
    setRestored(false);
  }, [key]);

  return { value, setValue, restored, savedAt, clear, available };
}
