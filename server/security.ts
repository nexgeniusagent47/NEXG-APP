// server/security.ts
//
// Rate limiting, security headers, and client identity (IP + device).
//
// WHY THESE LIVE TOGETHER
// All three answer the same question at the same point in the request: who is this, and
// should they be allowed to do this? Splitting them across files would mean parsing the
// client identity twice and risking the two views disagreeing.

import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import { logger } from './logger.ts';

/* ------------------------------------------------------------------ identity ---- */

/**
 * Trust the proxy chain, because this app runs behind Cloudflare and then nginx.
 *
 * Without this, `req.ip` is the address of whatever spoke to us last — nginx, or
 * Cloudflare's edge — so every request in the world shares one identity and any
 * per-IP limit becomes a global limit that locks out all users at once. That is the
 * failure mode where rate limiting is worse than none.
 *
 * `trust proxy` is set where the app is mounted (server/index.ts) rather than here, because
 * it is Express configuration, not policy. This module reads the result.
 */
export function clientIp(req: Request): string {
  // req.ip honours the trust-proxy setting and resolves X-Forwarded-For for us.
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * The full forwarding chain, for the log only.
 *
 * Kept separate from `clientIp` and never used for a decision: the chain is
 * attacker-supplied text and can be any length, so it is evidence, not authority.
 */
export function forwardedChain(req: Request): string {
  const raw = req.headers['x-forwarded-for'];
  const value = Array.isArray(raw) ? raw.join(',') : raw;
  if (!value) return '';
  return value.split(',').map((s) => s.trim()).slice(0, 6).join(' > ');
}

/**
 * A stable, non-reversible device identifier.
 *
 * The client sends `x-device-id` when it has one. When it does not, one is derived from
 * the user agent so that requests from a scripted client still aggregate into a single
 * identity rather than one per request — which is what makes device-based limiting
 * meaningful against a caller that simply omits the header.
 *
 * The derived value is HASHED, not raw. A user agent plus IP is close to a fingerprint,
 * and it ends up in logs, which are kept far longer than a request.
 */
export function deviceId(req: Request): { id: string; source: 'header' | 'derived' } {
  const raw = req.headers['x-device-id'];
  const provided = Array.isArray(raw) ? raw[0] : raw;

  if (typeof provided === 'string' && provided.trim().length >= 8 && provided.length <= 128) {
    // Validated for length before use: this string reaches logs and metrics labels, and an
    // unbounded attacker-controlled value there is a memory and cardinality problem.
    return { id: provided.trim(), source: 'header' };
  }

  const ua = req.headers['user-agent'] ?? '';
  return {
    id: 'd_' + createHash('sha256').update(String(ua)).digest('hex').slice(0, 16),
    source: 'derived',
  };
}

/* --------------------------------------------------------------- rate limiting -- */

interface Bucket {
  /** Timestamps of accepted requests inside the window. */
  hits: number[];
  /** When this bucket was last touched, for eviction. */
  seen: number;
}

interface Rule {
  windowMs: number;
  /** Applied per DEVICE. The strict number, because a device is a person. */
  max: number;
  /**
   * Applied per IP. Deliberately looser than `max`.
   *
   * This is the correction to an obvious-looking design that is wrong in production. Using
   * the same tight number for both dimensions means a single egress IP with ten users
   * behind it locks out the eleventh — and shared egress is not an edge case: mobile
   * carrier NAT, corporate networks, and campus wifi all put thousands of people behind one
   * address. A login limit that a real customer trips is an outage with an incident report,
   * not a security control.
   *
   * So the IP dimension is set to catch volume that is clearly not human (an order of
   * magnitude above the device allowance) while the device dimension carries the strict
   * per-person limit. Both must pass, so a botnet rotating devices is still stopped by the
   * IP ceiling and one host rotating IPs is still stopped by the device ceiling.
   */
  maxPerIp: number;
}

/**
 * Policy per route family.
 *
 * Auth endpoints are deliberately tight — the skill's guidance is roughly ten attempts per
 * fifteen minutes, and that is the number that makes credential stuffing uneconomical
 * while staying invisible to a human who mistyped their password twice.
 *
 * Read endpoints are generous because they are the product. A limit that a legitimate
 * browsing session can trip is a bug, not a control.
 */
const RULES: Array<{ test: (method: string, path: string) => boolean; rule: Rule; name: string }> = [
  // Credential endpoints: the ones worth attacking.
  {
    name: 'auth',
    test: (m, p) => m === 'POST' && /^\/api\/auth\/(login|signup|refresh)$/.test(p),
    rule: { windowMs: 15 * 60_000, max: 10, maxPerIp: 100 },
  },
  // Lead capture: unauthenticated and writes to the database, so it is an abuse target
  // even though it is not a credential.
  {
    name: 'leads',
    test: (m, p) => m === 'POST' && p === '/api/leads/email',
    rule: { windowMs: 60 * 60_000, max: 20, maxPerIp: 200 },
  },
  // Client telemetry: fires often by design, but still bounded.
  {
    name: 'telemetry',
    test: (m, p) => p === '/api/telemetry',
    rule: { windowMs: 60_000, max: 120, maxPerIp: 1200 },
  },
  // The developer dashboard polls every 5s per open tab.
  {
    name: 'observability',
    test: (m, p) => m === 'GET' && (p === '/api/metrics' || p === '/api/traces'),
    rule: { windowMs: 60_000, max: 120, maxPerIp: 1200 },
  },
  // Everything else under the API.
  {
    name: 'api',
    test: (_m, p) => p.startsWith('/api/'),
    rule: { windowMs: 60_000, max: 300, maxPerIp: 3000 },
  },
];

/**
 * In-memory sliding window.
 *
 * KNOWN LIMIT, and the reason it is written down: these counters live in this process. Run
 * two instances and the effective limit becomes max x instances; run serverless and they
 * may never fire at all. Both are silent. Moving to a shared store (Postgres or Redis) is
 * the fix, and the only thing that changes is `hit()`.
 *
 * Sliding rather than fixed-window because a fixed window lets a caller send the full
 * allowance at 0:59 and again at 1:01 — twice the intended rate, which is exactly the
 * burst a credential attack wants.
 */
class SlidingWindow {
  private buckets = new Map<string, Bucket>();
  private lastSweep = Date.now();

  hit(key: string, windowMs: number, max: number): { allowed: boolean; remaining: number; retryAfterSec: number } {
    const now = Date.now();
    this.sweep(now);

    const bucket = this.buckets.get(key) ?? { hits: [], seen: now };
    bucket.seen = now;

    // Drop anything that has fallen out of the window before counting.
    const cutoff = now - windowMs;
    bucket.hits = bucket.hits.filter((t) => t > cutoff);

    if (bucket.hits.length >= max) {
      this.buckets.set(key, bucket);
      const oldest = bucket.hits[0];
      const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return { allowed: false, remaining: 0, retryAfterSec };
    }

    bucket.hits.push(now);
    this.buckets.set(key, bucket);
    return { allowed: true, remaining: max - bucket.hits.length, retryAfterSec: 0 };
  }

  /** Drop buckets nobody has touched recently, so a long uptime cannot grow without bound. */
  private sweep(now: number) {
    if (now - this.lastSweep < 60_000) return;
    this.lastSweep = now;
    const stale = now - 60 * 60_000;
    for (const [key, bucket] of this.buckets) {
      if (bucket.seen < stale) this.buckets.delete(key);
    }
  }

  size() {
    return this.buckets.size;
  }
}

const limiter = new SlidingWindow();

/**
 * Apply the matching rule, keyed on BOTH the client IP and the device.
 *
 * Both, because either alone has a hole. IP-only is defeated by a botnet or a mobile
 * carrier NAT that puts thousands of real users behind one address; device-only is
 * defeated by simply omitting the header. Requiring both to be under the limit means an
 * attacker must rotate addresses AND identities together.
 */
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  const match = RULES.find((r) => r.test(req.method, path));
  if (!match) return next();

  const ip = clientIp(req);
  const device = deviceId(req).id;
  const { windowMs, max, maxPerIp } = match.rule;

  // Separate keys per dimension so the two counts cannot interfere.
  const byIp = limiter.hit(`ip:${match.name}:${ip}`, windowMs, maxPerIp);
  const byDevice = limiter.hit(`dev:${match.name}:${device}`, windowMs, max);

  const blocked = !byIp.allowed || !byDevice.allowed;
  const retryAfterSec = Math.max(byIp.retryAfterSec, byDevice.retryAfterSec);

  if (blocked) {
    // Logged at warn with the dimension that tripped, because a spike here is the signal
    // that something is being attacked, and knowing which axis was exhausted is what tells
    // you whether you are facing one noisy client or a distributed one.
    logger.warn('rate limit exceeded', {
      route: match.name,
      path,
      ip,
      deviceId: device,
      limitedBy: !byIp.allowed ? 'ip' : 'device',
      retryAfterSec,
    });

    res.setHeader('Retry-After', String(retryAfterSec));
    return res.status(429).json({
      error: 'Too many requests. Please slow down and try again shortly.',
      retryAfterSeconds: retryAfterSec,
    });
  }

  // Surfaced so a client can back off before being blocked rather than after.
  res.setHeader('X-RateLimit-Limit', String(max));
  res.setHeader('X-RateLimit-Remaining', String(Math.min(byIp.remaining, byDevice.remaining)));
  next();
}

/* ----------------------------------------------------------- security headers ---- */

/** Origins the app genuinely loads from. Anything absent here is blocked by default. */
const ASSET_ORIGINS = {
  images: [
    'https://images.unsplash.com', // catalogue photography, 4000+ records
    'https://api.dicebear.com', // generated merchant avatars
    'https://lh3.googleusercontent.com', // Google review avatars
    'https://unpkg.com', // Leaflet marker images
  ],
  connect: [
    'https://nominatim.openstreetmap.org', // address lookup in onboarding
    'https://unpkg.com',
  ],
  frames: ['https://maps.google.com', 'https://www.openstreetmap.org'],
};

/**
 * Content-Security-Policy.
 *
 * `style-src` needs 'unsafe-inline', and that is a deliberate, explained concession rather
 * than laziness. Motion and react-spring both set inline styles on every frame, Vite
 * injects its stylesheet at runtime, and Tailwind generates style tags. Removing
 * 'unsafe-inline' would mean nonce-ing every one of those or dropping the animation
 * library, and a policy that breaks the product gets switched off within a day.
 *
 * `script-src` does NOT get the same concession. There is no inline script in the built
 * app, so script-src stays strict — and script-src is the directive that actually stops
 * XSS. Trading the weaker directive for a usable product while keeping the stronger one
 * intact is the right side of that trade.
 *
 * `frame-ancestors 'none'` replaces X-Frame-Options and is the modern control; the older
 * header is sent as well for browsers that predate it.
 */
export function securityHeaders(isProduction: boolean) {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    // No inline scripts. The built bundle is external and there is no injected script in a
    // production build (the Impeccable live helper is stripped at build time).
    "script-src 'self'",
    `style-src 'self' 'unsafe-inline'`,
    "font-src 'self' data:",
    `img-src 'self' data: blob: ${ASSET_ORIGINS.images.join(' ')}`,
    `connect-src 'self' ${ASSET_ORIGINS.connect.join(' ')}`,
    `frame-src ${ASSET_ORIGINS.frames.join(' ')}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    // Upgrade any stray http:// subresource. Harmless where everything is already https,
    // and prevents a mixed-content downgrade if one is ever introduced.
    'upgrade-insecure-requests',
  ].join('; ');

  return function headers(_req: Request, res: Response, next: NextFunction) {
    res.setHeader('Content-Security-Policy', csp);

    // Only in production, and only once HTTPS is real. Sending HSTS from a server that
    // might still be reached over plain HTTP would pin browsers to a scheme that does not
    // answer, which is a self-inflicted outage that outlasts the mistake.
    if (isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    // `same-site` rather than `same-origin`: the SPA is served by this same server, so
    // nothing legitimately cross-origin is being allowed here, but the looser value avoids
    // breaking the image CDN responses if one ever needs reading.
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');

    // Express advertises itself by default, which tells an attacker the framework and
    // therefore which published exploits to try first.
    res.removeHeader('X-Powered-By');

    next();
  };
}

/** Exposed for the dashboard so the operator can see the limiter is alive. */
export function rateLimiterStats() {
  return { tracked: limiter.size() };
}
