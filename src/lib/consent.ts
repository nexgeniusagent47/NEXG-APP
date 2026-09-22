// src/lib/consent.ts
//
// The consent state machine, and the only place that answers "may this run?".
//
// WHY a cookie rather than localStorage: consent has to be readable by the
// server-side surface too (and by any future edge/CDN rule), and it has to
// expire. localStorage has no expiry and no SameSite semantics, so a decision
// made 180 days ago would silently outlive the notice it was made against.
//
// WHY versioned: a stored decision answers the question the user was asked. When
// the question changes — a new category, a new processor — the old answer is not
// an answer to the new question, so a version bump returns the state to
// `unknown` and the banner asks again. Without this, adding a category would
// silently opt every existing visitor into it on the strength of a decision they
// never made.
//
// The three states are deliberately not a boolean: `unknown` (never asked) is not
// `denied` (asked, said no). Nothing non-essential runs in either case, but only
// `unknown` may show the banner.

export type ConsentStatus = 'unknown' | 'granted' | 'denied';

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentState {
  status: ConsentStatus;
  categories: Record<ConsentCategory, boolean>;
  version: number;
  decidedAt: string | null;
}

export const CONSENT_COOKIE = 'nexg_consent';

/** Bump when the categories or the processors behind them change. */
export const CONSENT_VERSION = 1;

export const CONSENT_MAX_AGE_DAYS = 180;

/** Fired on `window` so non-React modules (telemetry) can react without a cycle. */
export const CONSENT_CHANGED_EVENT = 'nexg:consent-changed';

const COOKIE_MAX_AGE_SECONDS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

const CATEGORY_KEYS: ConsentCategory[] = ['necessary', 'analytics', 'marketing'];

export const CATEGORY_LABELS: Record<ConsentCategory, { title: string; description: string }> = {
  necessary: {
    title: 'Strictly necessary',
    description: 'Session, security and load-balancing cookies. The site cannot work without these.',
  },
  analytics: {
    title: 'Analytics',
    description: 'Aggregate page and API timings that tell us which screens are slow or broken.',
  },
  marketing: {
    title: 'Marketing',
    description: 'Campaign attribution and partner offers. Off unless you turn it on.',
  },
};

function unknownState(): ConsentState {
  return {
    status: 'unknown',
    categories: { necessary: true, analytics: false, marketing: false },
    version: CONSENT_VERSION,
    decidedAt: null,
  };
}

function hasDocument(): boolean {
  return typeof document !== 'undefined' && typeof document.cookie === 'string';
}

function readCookie(name: string): string | null {
  if (!hasDocument()) return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return null;
}

/**
 * `Secure` is keyed off the actual transport, not NODE_ENV: a Secure cookie is
 * silently dropped by the browser over http, which would make local development
 * look like a consent bug.
 */
function isSecureContext(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function writeCookie(value: string): void {
  if (!hasDocument()) return;
  const attributes = [
    `${CONSENT_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ];
  if (isSecureContext()) attributes.push('Secure');
  document.cookie = attributes.join('; ');
}

function parseStored(raw: string): ConsentState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState> & {
      categories?: Partial<Record<ConsentCategory, boolean>>;
    };
    if (!parsed || typeof parsed !== 'object') return null;
    // A decision recorded against an older notice is not a decision about this one.
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.status !== 'granted' && parsed.status !== 'denied') return null;

    const categories = {
      necessary: true,
      analytics: parsed.categories?.analytics === true,
      marketing: parsed.categories?.marketing === true,
    };
    return {
      status: parsed.status,
      categories,
      version: CONSENT_VERSION,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : null,
    };
  } catch {
    // A corrupted cookie is treated as "never asked", which is the safe direction.
    return null;
  }
}

let cached: ConsentState | null = null;
const listeners = new Set<(state: ConsentState) => void>();

export function getConsent(): ConsentState {
  if (cached) return cached;
  const raw = readCookie(CONSENT_COOKIE);
  cached = raw ? parseStored(raw) ?? unknownState() : unknownState();
  return cached;
}

/** Only `necessary` is unconditional; every other category needs an explicit yes. */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  const state = getConsent();
  return state.status === 'granted' && state.categories[category] === true;
}

export function isUndecided(): boolean {
  return getConsent().status === 'unknown';
}

export function subscribeConsent(listener: (state: ConsentState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(categories: Record<ConsentCategory, boolean>): ConsentState {
  // "Granted" means at least one non-essential category is on; a visitor who
  // keeps everything off has denied, and must not be shown the banner again.
  const anyOptional = categories.analytics || categories.marketing;
  const state: ConsentState = {
    status: anyOptional ? 'granted' : 'denied',
    categories: { necessary: true, analytics: !!categories.analytics, marketing: !!categories.marketing },
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
  cached = state;
  writeCookie(JSON.stringify(state));
  for (const listener of listeners) {
    try {
      listener(state);
    } catch {
      /* a broken listener must not block the others or the persistence */
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: state }));
  }
  return state;
}

export function setConsent(
  categories: Partial<Record<ConsentCategory, boolean>>
): ConsentState {
  return commit({
    necessary: true,
    analytics: categories.analytics === true,
    marketing: categories.marketing === true,
  });
}

export function acceptAll(): ConsentState {
  return setConsent({ analytics: true, marketing: true });
}

export function rejectAll(): ConsentState {
  return setConsent({ analytics: false, marketing: false });
}

/** Back to `unknown`, which re-asks on the next load. Used by "change my choice". */
export function resetConsent(): ConsentState {
  cached = unknownState();
  if (hasDocument()) {
    document.cookie = `${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: cached }));
  }
  for (const listener of listeners) listener(cached);
  return cached;
}

/** The persisted decision in the shape an audit or an export would need. */
export function consentRecord(): {
  status: ConsentStatus;
  categories: Record<ConsentCategory, boolean>;
  version: number;
  decidedAt: string | null;
} {
  const state = getConsent();
  return {
    status: state.status,
    categories: { ...state.categories },
    version: state.version,
    decidedAt: state.decidedAt,
  };
}

export const CONSENT_CATEGORIES = CATEGORY_KEYS;
