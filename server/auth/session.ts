// server/auth/session.ts
//
// Cookie handling and the user store.
//
// Sessions use TWO tokens with different lifetimes and different storage:
//
//   access token   15 min, httpOnly cookie   — sent on every request
//   refresh token  30 days, httpOnly cookie   — only exchanged at /api/auth/refresh
//
// Short access tokens bound the damage of a leaked one; the long refresh token is
// what stops the user being logged out constantly. Storing both in httpOnly cookies
// rather than localStorage is deliberate: localStorage is readable by any script on
// the page, so a single XSS exfiltrates the session. httpOnly is not reachable from
// JavaScript at all.
//
// CSRF: cookies are sent automatically, which is exactly what a cross-site request
// forgery relies on. `SameSite=Lax` blocks cross-site POSTs, which covers the
// practical cases, and the API additionally rejects state-changing requests whose
// Origin header does not match (see assertSameOrigin). SameSite alone is not treated
// as sufficient on its own.
//
// NODE 24: strip-only TypeScript. No parameter properties, enums, namespaces or
// decorators in this file — they throw at import time.

import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { hashPassword, verifyPassword, needsRehash, randomToken } from './crypto.ts';

export const ACCESS_COOKIE = 'nexg_at';
export const REFRESH_COOKIE = 'nexg_rt';

/** Only send cookies over HTTPS in production; local dev is plain http. */
const isProduction = (): boolean => process.env.NODE_ENV === 'production';

export interface CookieOptions {
  maxAgeSeconds: number;
}

/**
 * Set a cookie.
 *
 * `secure` is tied to NODE_ENV rather than hardcoded: hardcoding true would break
 * local development over http, and hardcoding false would ship session cookies over
 * plaintext in production where anyone on the network can read them.
 *
 * No `domain` attribute is set on purpose — omitting it scopes the cookie to the
 * exact host, which is tighter than listing one, and it means a subdomain cannot
 * read the session.
 */
export function setCookie(res: Response, name: string, value: string, opts: CookieOptions): void {
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: opts.maxAgeSeconds * 1000,
  });
}

export function clearCookie(res: Response, name: string): void {
  res.clearCookie(name, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
  });
}

export function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

/**
 * Reject a state-changing request whose Origin does not match the host.
 *
 * SameSite=Lax already blocks cross-site POSTs in current browsers, but it is a
 * browser-enforced control with historical gaps, and it does not apply to requests
 * from non-browser clients. This is the server-side half of the same defence: if an
 * Origin header is present and points somewhere else, refuse. A missing Origin is
 * allowed because same-origin fetches and curl do not always send one.
 */
export function assertSameOrigin(req: Request): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const host = req.headers.host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ------------------------------------------------------------------ user store

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  /** Set when the address has been confirmed; email is collected before this. */
  emailVerifiedAt?: string;
  createdAt: string;
}

/**
 * In-process user store.
 *
 * This exists so the auth flow is complete and testable without a migration, and it
 * is honest about its limits: it does not survive a restart and it does not work
 * across more than one process. `docs/AUTH.md` records the SQL to move this into
 * Postgres, which is the next step and is required before this is load-bearing in
 * production. Keeping the interface identical to the eventual repository means only
 * the four functions below change.
 */
const usersById = new Map<string, User>();
const userIdByEmail = new Map<string, string>();

/** Emails are stored case-insensitively — `A@x.com` and `a@x.com` are one account. */
const normaliseEmail = (email: string): string => email.trim().toLowerCase();

export interface PublicUser {
  id: string;
  email: string;
  displayName?: string;
  emailVerifiedAt?: string;
  createdAt: string;
}

export function toPublicUser(user: User): PublicUser {
  // Never spread the whole record: the password hash must not be able to leak into a
  // response by accident when a field is added later.
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
  };
}

export function findUserByEmail(email: string): User | undefined {
  const id = userIdByEmail.get(normaliseEmail(email));
  return id ? usersById.get(id) : undefined;
}

export function findUserById(id: string): User | undefined {
  return usersById.get(id);
}

export function createUser(email: string, password: string, displayName?: string): User {
  const normalised = normaliseEmail(email);
  if (userIdByEmail.has(normalised)) {
    throw new Error('EMAIL_TAKEN');
  }
  const user: User = {
    id: randomUUID(),
    email: normalised,
    passwordHash: hashPassword(password),
    displayName,
    createdAt: new Date().toISOString(),
  };
  usersById.set(user.id, user);
  userIdByEmail.set(normalised, user.id);
  return user;
}

/**
 * Check credentials.
 *
 * When the email is unknown this still performs a hash comparison against a dummy
 * value. Returning immediately would make an unknown email measurably faster than a
 * known one, which is a user-enumeration oracle: an attacker can discover which
 * addresses have accounts without ever guessing a password.
 */
const DUMMY_HASH = hashPassword(randomToken(16));

export function authenticate(email: string, password: string): User | undefined {
  const user = findUserByEmail(email);
  if (!user) {
    verifyPassword(password, DUMMY_HASH);
    return undefined;
  }
  if (!verifyPassword(password, user.passwordHash)) return undefined;

  // Transparently upgrade a hash made with weaker parameters than the current policy.
  if (needsRehash(user.passwordHash)) {
    user.passwordHash = hashPassword(password);
  }
  return user;
}

export function markEmailVerified(userId: string, token: string): boolean {
  const record = pendingVerifications.get(token);
  if (!record || record.userId !== userId) return false;
  const user = usersById.get(userId);
  if (!user) return false;
  user.emailVerifiedAt = new Date().toISOString();
  pendingVerifications.delete(token);
  return true;
}

/**
 * Email verification tokens, awaiting a mail transport.
 *
 * Kept in process because there is no mailer wired up yet; `docs/AUTH.md` says what
 * to replace this with. Tokens are single-use and time-boxed even here, so the shape
 * does not change when the store does.
 */
export const pendingVerifications = new Map<string, { userId: string; expiresAt: number }>();

export function issueVerificationToken(userId: string): string {
  const token = randomToken();
  pendingVerifications.set(token, {
    userId,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  return token;
}
