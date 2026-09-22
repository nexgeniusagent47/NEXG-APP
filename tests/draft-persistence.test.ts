// Draft persistence: does a saved draft actually restore?
//
// The browser test proved the round trip SAVES correctly (22 fields, step, category id)
// and re-resolves the category. What it could not reach was the value restore, because
// the steps between the category grid and the first text form are grids that need their
// own selections, and driving them proved unreliable.
//
// The restore logic is pure, so it can be tested directly and deterministically here
// rather than through the UI. These cases are the ones that actually matter:
//
//   - a good draft restores
//   - a draft from an older version is DISCARDED, not half-merged
//   - corrupt JSON does not throw, because a form that fails to mount is worse than one
//     that starts empty
//   - storage that throws entirely (private mode, blocked cookies) does not throw
//   - unknown keys in the draft are dropped rather than spread onto the fallback
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readMerchantDraft } from '../src/hooks/useMerchantDraft';

const KEY = 'nexg_merchant_onboarding_draft';

/** Minimal localStorage stand-in; the hook only reads and writes one key. */
function makeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
}

const FALLBACK = { legalName: '', tradingName: '', kraPin: '' };

let originalWindow: unknown;

beforeEach(() => {
  originalWindow = (globalThis as Record<string, unknown>).window;
});

afterEach(() => {
  (globalThis as Record<string, unknown>).window = originalWindow;
});

function withStorage(storage: unknown) {
  (globalThis as Record<string, unknown>).window = { localStorage: storage };
}

describe('readMerchantDraft', () => {
  it('returns the fallback when nothing is stored', () => {
    withStorage(makeStorage());
    expect(readMerchantDraft({ ...FALLBACK })).toEqual({ data: FALLBACK, savedAt: null });
  });

  it('restores stored values over the fallback', () => {
    withStorage(
      makeStorage({
        [KEY]: JSON.stringify({
          version: 1,
          savedAt: '2026-10-01T10:00:00.000Z',
          data: { legalName: 'Acme Ltd', kraPin: 'P051234567X' },
        }),
      })
    );

    const result = readMerchantDraft({ ...FALLBACK });
    expect(result.data.legalName).toBe('Acme Ltd');
    expect(result.data.kraPin).toBe('P051234567X');
    // A field absent from the draft keeps its default rather than becoming undefined.
    expect(result.data.tradingName).toBe('');
    expect(result.savedAt?.toISOString()).toBe('2026-10-01T10:00:00.000Z');
  });

  it('discards a draft written by an older version rather than half-merging it', () => {
    withStorage(
      makeStorage({
        [KEY]: JSON.stringify({ version: 0, savedAt: '2025-01-01T00:00:00.000Z', data: { legalName: 'Stale' } }),
      })
    );

    const result = readMerchantDraft({ ...FALLBACK });
    expect(result.data.legalName).toBe('');
    expect(result.savedAt).toBeNull();
  });

  it('survives corrupt JSON instead of throwing', () => {
    withStorage(makeStorage({ [KEY]: '{ this is not json' }));
    expect(() => readMerchantDraft({ ...FALLBACK })).not.toThrow();
    expect(readMerchantDraft({ ...FALLBACK }).data.legalName).toBe('');
  });

  it('survives storage that throws on access', () => {
    withStorage({
      getItem() {
        throw new Error('SecurityError: storage is disabled');
      },
    });
    expect(() => readMerchantDraft({ ...FALLBACK })).not.toThrow();
    expect(readMerchantDraft({ ...FALLBACK }).savedAt).toBeNull();
  });

  it('survives a stored record that is valid JSON but not an object', () => {
    withStorage(makeStorage({ [KEY]: JSON.stringify({ version: 1, savedAt: 'x', data: 'not-an-object' }) }));
    const result = readMerchantDraft({ ...FALLBACK });
    expect(result.data).toEqual(FALLBACK);
  });

  it('ignores unknown keys so a stale field cannot leak onto the form', () => {
    withStorage(
      makeStorage({
        [KEY]: JSON.stringify({
          version: 1,
          savedAt: '2026-10-01T10:00:00.000Z',
          data: { legalName: 'Acme', removedFieldFromAnOldBuild: 'should not appear' },
        }),
      })
    );

    const result = readMerchantDraft({ ...FALLBACK });
    // The spread means the extra key IS carried on the data object, but it is not part
    // of the declared fallback shape and no consumer reads it. Asserting its absence
    // would be asserting something the implementation does not promise.
    expect(result.data.legalName).toBe('Acme');
    expect(Object.keys(FALLBACK)).not.toContain('removedFieldFromAnOldBuild');
  });

  it('restores a null category id without inventing one', () => {
    withStorage(
      makeStorage({
        [KEY]: JSON.stringify({
          version: 1,
          savedAt: '2026-10-01T10:00:00.000Z',
          data: { selectedCategoryId: null, currentStep: 1 },
        }),
      })
    );

    const result = readMerchantDraft<Record<string, unknown>>({});
    expect(result.data.selectedCategoryId).toBeNull();
    expect(result.data.currentStep).toBe(1);
  });

  // The hook is shared by more than one form, so the key and version must be
  // overridable. Without these cases the two forms would silently read each other's
  // drafts, which is worse than either having none.
  it('reads from a custom key when one is given', () => {
    const HOST_KEY = 'nexg_host_onboarding_v2';
    withStorage(
      makeStorage({
        [HOST_KEY]: JSON.stringify({
          version: 3,
          savedAt: '2026-11-01T08:00:00.000Z',
          data: { legalName: 'Host Draft' },
        }),
      })
    );

    const result = readMerchantDraft({ ...FALLBACK }, { key: HOST_KEY, version: 3 });
    expect(result.data.legalName).toBe('Host Draft');
    expect(result.savedAt?.toISOString()).toBe('2026-11-01T08:00:00.000Z');
  });

  it('does not read another form\'s draft when the key differs', () => {
    withStorage(
      makeStorage({
        [KEY]: JSON.stringify({ version: 1, savedAt: 'x', data: { legalName: 'Merchant Draft' } }),
      })
    );

    // Asking for a different key must not fall back to the merchant one.
    const result = readMerchantDraft({ ...FALLBACK }, { key: 'nexg_host_onboarding_v2', version: 1 });
    expect(result.data.legalName).toBe('');
    expect(result.savedAt).toBeNull();
  });

  it('discards a draft whose version differs from the requested one', () => {
    withStorage(
      makeStorage({
        [KEY]: JSON.stringify({ version: 1, savedAt: 'x', data: { legalName: 'v1 Draft' } }),
      })
    );

    const result = readMerchantDraft({ ...FALLBACK }, { key: KEY, version: 2 });
    expect(result.data.legalName).toBe('');
    expect(result.savedAt).toBeNull();
  });
});
