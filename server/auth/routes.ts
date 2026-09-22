// server/auth/routes.ts
//
// The auth endpoints and the middleware that protects other routes.
//
// NODE 24: strip-only TypeScript. No parameter properties, enums, namespaces or
// decorators in this file.

import type { Express, Request, Response, NextFunction } from 'express';
import {
  signToken,
  verifyToken,
  assertAuthConfigured,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  type TokenPurpose,
} from './crypto.ts';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  setCookie,
  clearCookie,
  readCookie,
  assertSameOrigin,
  createUser,
  authenticate,
  findUserById,
  toPublicUser,
  issueVerificationToken,
  type User,
} from './session.ts';
import { logger } from '../logger.ts';

/** Attached by `requireAuth` so handlers can read the caller without re-verifying. */
export interface AuthedRequest extends Request {
  user?: User;
}

const log = logger.child({ component: 'auth' });

/**
 * Email validation.
 *
 * Deliberately permissive. The only authoritative test of an address is whether mail
 * to it arrives, so an elaborate regex mostly rejects valid addresses — and the real
 * gate is the verification email. This rejects the obviously malformed and nothing
 * more.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Minimum password length.
 *
 * Length is the property that matters; composition rules (a digit, a symbol) push
 * people toward predictable substitutions like `Password1!` while making the password
 * no harder to crack. 12 characters plus a breach check at signup would be better
 * still, and is noted in docs/AUTH.md as the next step.
 */
const MIN_PASSWORD_LENGTH = 12;

interface Credentials {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
}

function validateCredentials(body: Credentials): { email: string; password: string } | string {
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_RE.test(email) || email.length > 254) return 'Enter a valid email address.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > 1024) {
    // scrypt cost scales with input length; an unbounded password is a cheap way to
    // burn server CPU.
    return 'Password is too long.';
  }
  return { email, password };
}

function issueSession(res: Response, userId: string): void {
  setCookie(res, ACCESS_COOKIE, signToken(userId, 'access'), {
    maxAgeSeconds: ACCESS_TOKEN_TTL_SECONDS,
  });
  setCookie(res, REFRESH_COOKIE, signToken(userId, 'refresh'), {
    maxAgeSeconds: REFRESH_TOKEN_TTL_SECONDS,
  });
}

/**
 * Read a token from the cookie, falling back to an Authorization header.
 *
 * The header path exists for non-browser clients, which have no cookie jar. Both are
 * accepted; the cookie is preferred because it is the one that is httpOnly.
 */
function tokenFrom(req: Request, cookieName: string): string | undefined {
  const fromCookie = readCookie(req, cookieName);
  if (fromCookie) return fromCookie;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  return undefined;
}

/**
 * Gate a route on a valid ACCESS token.
 *
 * It asks for `'access'` specifically. Without that check a 30-day refresh token would
 * be accepted here, which would silently turn a short-lived credential into a
 * long-lived one.
 */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = tokenFrom(req, ACCESS_COOKIE);
  if (!token) {
    res.status(401).json({ error: 'Not signed in' });
    return;
  }
  const result = verifyToken(token, 'access');
  if (!result.ok) {
    // `expired` is distinguished so a client can refresh and retry rather than
    // bouncing the user to a login screen unnecessarily.
    const status = result.reason === 'expired' ? 401 : 403;
    res.status(status).json({ error: result.reason, refreshable: result.reason === 'expired' });
    return;
  }
  const user = findUserById(result.payload.sub);
  if (!user) {
    clearCookie(res, ACCESS_COOKIE);
    clearCookie(res, REFRESH_COOKIE);
    res.status(401).json({ error: 'Account no longer exists' });
    return;
  }
  req.user = user;
  next();
}

/** Attaches the user when a valid token is present, but never rejects. */
export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const token = tokenFrom(req, ACCESS_COOKIE);
  if (token) {
    const result = verifyToken(token, 'access');
    if (result.ok) {
      const user = findUserById(result.payload.sub);
      if (user) req.user = user;
    }
  }
  next();
}

export function registerAuthRoutes(app: Express): void {
  // Fails the boot rather than the first login if AUTH_SECRET is missing.
  assertAuthConfigured();

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    if (!assertSameOrigin(req)) {
      res.status(403).json({ error: 'Cross-origin request rejected' });
      return;
    }

    const checked = validateCredentials(req.body ?? {});
    if (typeof checked === 'string') {
      res.status(400).json({ error: checked });
      return;
    }

    let user: User;
    try {
      const displayName =
        typeof req.body?.displayName === 'string' ? req.body.displayName.slice(0, 80) : undefined;
      user = createUser(checked.email, checked.password, displayName);
    } catch (err) {
      if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
        // Deliberately explicit here. A signup form that says "check your email" for
        // an address that already exists is worse UX than the enumeration it avoids,
        // and the login flow already resists enumeration by timing.
        res.status(409).json({ error: 'An account with that email already exists.' });
        return;
      }
      throw err;
    }

    issueSession(res, user.id);
    const verificationToken = issueVerificationToken(user.id);
    log.info('account created', { userId: user.id });

    // The token is returned so the flow is testable before a mailer exists. It must
    // stop being returned once email delivery is wired up — see docs/AUTH.md.
    res.status(201).json({
      user: toPublicUser(user),
      verificationToken,
      mailDelivery: 'not_configured',
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    if (!assertSameOrigin(req)) {
      res.status(403).json({ error: 'Cross-origin request rejected' });
      return;
    }

    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    const user = authenticate(email, password);
    if (!user) {
      // One message for both "no such account" and "wrong password", so the response
      // itself does not reveal which addresses exist.
      log.warn('login failed', { email: email.slice(0, 3) + '***' });
      res.status(401).json({ error: 'Email or password is incorrect.' });
      return;
    }

    issueSession(res, user.id);
    log.info('login', { userId: user.id });
    res.json({ user: toPublicUser(user) });
  });

  app.post('/api/auth/refresh', (req: Request, res: Response) => {
    if (!assertSameOrigin(req)) {
      res.status(403).json({ error: 'Cross-origin request rejected' });
      return;
    }

    const token = tokenFrom(req, REFRESH_COOKIE);
    if (!token) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }
    const result = verifyToken(token, 'refresh');
    if (!result.ok) {
      clearCookie(res, ACCESS_COOKIE);
      clearCookie(res, REFRESH_COOKIE);
      res.status(401).json({ error: result.reason });
      return;
    }
    const user = findUserById(result.payload.sub);
    if (!user) {
      clearCookie(res, ACCESS_COOKIE);
      clearCookie(res, REFRESH_COOKIE);
      res.status(401).json({ error: 'Account no longer exists' });
      return;
    }

    // Rotate both tokens. Reusing the refresh token would let a stolen one stay valid
    // for its full 30 days; rotation shortens that window to one refresh interval.
    issueSession(res, user.id);
    res.json({ user: toPublicUser(user) });
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    clearCookie(res, ACCESS_COOKIE);
    clearCookie(res, REFRESH_COOKIE);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const token = tokenFrom(req, ACCESS_COOKIE);
    if (!token) {
      res.json({ user: null });
      return;
    }
    const result = verifyToken(token, 'access');
    if (!result.ok) {
      res.json({ user: null, reason: result.reason });
      return;
    }
    const user = findUserById(result.payload.sub);
    res.json({ user: user ? toPublicUser(user) : null });
  });

  /**
   * Email capture for people who are not ready to make an account.
   *
   * Stored separately from users: collecting an address for a newsletter is a
   * different consent from creating a login, and merging them would make the account
   * exist without a password.
   */
  const emailLeads = new Map<string, { email: string; source: string; capturedAt: string }>();

  app.post('/api/leads/email', (req: Request, res: Response) => {
    if (!assertSameOrigin(req)) {
      res.status(403).json({ error: 'Cross-origin request rejected' });
      return;
    }
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const source = typeof req.body?.source === 'string' ? req.body.source.slice(0, 60) : 'unknown';

    if (!EMAIL_RE.test(email) || email.length > 254) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }
    if (!emailLeads.has(email)) {
      emailLeads.set(email, { email, source, capturedAt: new Date().toISOString() });
      log.info('lead captured', { source });
    }
    // Always the same response, so this endpoint cannot be used to test whether an
    // address is already on the list.
    res.status(202).json({ ok: true });
  });

  log.info('auth routes registered');
}

export type { TokenPurpose };
