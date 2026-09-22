// server/auth/crypto.ts
//
// Password hashing and JWT signing, built on `node:crypto` rather than a dependency.
//
// WHY NO LIBRARY
// The two things this needs — scrypt and HS256 — are both in Node's standard library.
// Adding bcrypt or jsonwebtoken would mean native builds and a supply-chain surface
// for functionality the runtime already ships. The risk with hand-rolled auth is
// getting the details wrong, so every decision below is the conservative one and the
// reasoning is recorded next to it.
//
// NODE 24 CONSTRAINT: this file is executed by `node` in STRIP-ONLY TypeScript mode.
// Types are erased but syntax is not transformed, so constructor parameter
// properties, enums, namespaces and decorators are all forbidden here. They throw
// ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX at import time and take the server down.

import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHmac,
} from 'node:crypto';

// ------------------------------------------------------------------ passwords

/**
 * scrypt cost parameters.
 *
 * N=16384 with r=8 and p=1 needs roughly 16 MB and a few tens of milliseconds per
 * hash. That is deliberately slow: it is what makes an offline attack on a stolen
 * database expensive. Raising N doubles both the memory and the time, so it is the
 * single knob to turn as hardware improves.
 *
 * `maxmem` must be raised alongside N, because Node's default 32 MB ceiling fails
 * the derivation rather than silently weakening it — which is the correct default.
 */
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;

const SALT_BYTES = 16;

/**
 * Hash a password into a self-describing string: `scrypt$N$r$p$salt$hash`.
 *
 * Storing the parameters with the hash is what allows them to be raised later
 * without invalidating existing passwords — an old hash still verifies with the
 * parameters it was created under, and can be re-hashed on next successful login.
 * A bare hash with global parameters cannot be migrated.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  });
  return [
    'scrypt',
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString('base64url'),
    derived.toString('base64url'),
  ].join('$');
}

/**
 * Verify a password against a stored hash.
 *
 * Uses `timingSafeEqual` rather than `===`. A byte-by-byte comparison returns as soon
 * as it finds a difference, so how long it takes leaks how many leading bytes were
 * correct — enough to reconstruct a hash one byte at a time. `timingSafeEqual`
 * requires equal-length buffers, so the length is checked first; that check leaks
 * only the length, which is fixed for a given algorithm.
 *
 * Returns false rather than throwing on a malformed stored hash: a corrupt row should
 * fail the login, not the process.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

    const salt = Buffer.from(parts[4], 'base64url');
    const expected = Buffer.from(parts[5], 'base64url');

    const actual = scryptSync(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem: SCRYPT_MAXMEM,
    });

    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/**
 * True when a stored hash was made with weaker parameters than the current policy,
 * so a successful login can transparently upgrade it.
 */
export function needsRehash(stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return true;
  return Number(parts[1]) < SCRYPT_N;
}

// ------------------------------------------------------------------ tokens

export type TokenPurpose = 'access' | 'refresh' | 'email_verify' | 'password_reset';

export interface TokenPayload {
  /** Subject: the user id. */
  sub: string;
  /** Purpose, so a refresh token can never be replayed as an access token. */
  pur: TokenPurpose;
  /** Issued at, seconds. */
  iat: number;
  /** Expires at, seconds. */
  exp: number;
  /** Unique token id, for revocation lists. */
  jti: string;
}

const b64url = (input: Buffer | string): string =>
  Buffer.from(input).toString('base64url');

const fromB64url = (input: string): Buffer => Buffer.from(input, 'base64url');

/**
 * The signing secret.
 *
 * There is deliberately NO fallback value. A default secret would mean every
 * deployment that forgot to set one shares the same key, so anyone could mint valid
 * tokens for it. Refusing to start is the safe failure: `assertAuthConfigured()`
 * below is called at boot so the misconfiguration surfaces immediately rather than
 * at the first login.
 */
function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      'AUTH_SECRET must be set to at least 32 characters. Generate one with: ' +
        "node -e \"console.log(require('node:crypto').randomBytes(32).toString('base64url'))\""
    );
  }
  return value;
}

/** Called once at startup so a missing secret fails the boot, not the first login. */
export function assertAuthConfigured(): void {
  secret();
}

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export function ttlFor(purpose: TokenPurpose): number {
  return purpose === 'access' ? ACCESS_TOKEN_TTL_SECONDS : REFRESH_TOKEN_TTL_SECONDS;
}

/**
 * Sign an HS256 JWT.
 *
 * HS256 because there is one issuer and one verifier — the same process. RS256 earns
 * its complexity when third parties must verify without being able to mint, which is
 * not the case here.
 */
export function signToken(sub: string, purpose: TokenPurpose, ttlSeconds?: number): string {
  const now = Math.floor(Date.now() / 1000);
  const ttl = ttlSeconds ?? ttlFor(purpose);

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: TokenPayload = {
    sub,
    pur: purpose,
    iat: now,
    exp: now + ttl,
    jti: randomUUID(),
  };

  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const signature = createHmac('sha256', secret()).update(unsigned).digest();
  return `${unsigned}.${b64url(signature)}`;
}

/**
 * `reason` is optional rather than a property of only the failure branch.
 *
 * As a strict discriminated union it reads better, but callers that record why a
 * token failed — which is all of them — then need the narrowing to survive an
 * intermediate `const status = ...` assignment, and it does not. Optional keeps the
 * shape honest (a success has no reason) while letting a caller log it directly.
 */
export type VerifyResult =
  | { ok: true; payload: TokenPayload; reason?: undefined }
  | { ok: false; reason: 'malformed' | 'bad-signature' | 'expired' | 'wrong-purpose' };

/**
 * Verify a JWT and, when a purpose is supplied, that the token is for that purpose.
 *
 * The purpose check is the detail that matters most: without it a 30-day refresh
 * token is accepted anywhere a 15-minute access token is, which turns a stolen
 * refresh token into permanent API access rather than a single refresh.
 */
export function verifyToken(token: string, expect?: TokenPurpose): VerifyResult {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed' };

  const [headerB64, payloadB64, signatureB64] = parts;

  let header: { alg?: string };
  let payload: TokenPayload;
  try {
    header = JSON.parse(fromB64url(headerB64).toString('utf8'));
    payload = JSON.parse(fromB64url(payloadB64).toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  // Reject an unexpected algorithm outright. Accepting whatever the header claims is
  // the classic JWT confusion bug: an attacker sets alg to "none", or swaps HS256 for
  // RS256 and signs with the public key.
  if (header.alg !== 'HS256') return { ok: false, reason: 'malformed' };

  const expectedSig = createHmac('sha256', secret())
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  const actualSig = fromB64url(signatureB64);

  if (actualSig.length !== expectedSig.length) return { ok: false, reason: 'bad-signature' };
  if (!timingSafeEqual(actualSig, expectedSig)) return { ok: false, reason: 'bad-signature' };

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= now) {
    return { ok: false, reason: 'expired' };
  }
  if (expect && payload.pur !== expect) return { ok: false, reason: 'wrong-purpose' };

  return { ok: true, payload };
}

/** A random opaque token, for email verification and password reset links. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}
