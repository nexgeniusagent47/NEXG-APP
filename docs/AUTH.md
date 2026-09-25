# Auth

Session and JWT handling for NEXG App. Built on `node:crypto` with **no new
dependencies** — scrypt and HS256 are both in the standard library.

## Required environment

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Signs every JWT. **At least 32 characters. No default.** |
| `DATABASE_URL` | User records (see the migration note below) |
| `PORT` | API port |

There is deliberately **no fallback secret**. A default would mean every deployment
that forgot to set one shares the same key, so anyone could mint valid tokens for it.
`server/index.ts` calls `assertAuthConfigured()` at boot, so a missing secret fails
**startup** with a clear message rather than failing the first login.

Generate one:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

## The two-token model

| Token | Cookie | Lifetime | Where it is accepted |
| --- | --- | --- | --- |
| Access | `nexg_at` | 15 minutes | every authenticated request |
| Refresh | `nexg_rt` | 30 days | `/api/auth/refresh` only |

Both are `httpOnly`, `SameSite=Lax`, and `Secure` when `NODE_ENV=production`.

**Why cookies rather than localStorage.** `localStorage` is readable by any script on
the page, so one XSS exfiltrates the session. `httpOnly` is not reachable from
JavaScript at all.

**Why two lifetimes.** A short access token bounds the damage of a leaked one; the
long refresh token is what stops the user being logged out constantly.

**Why the purpose claim.** Every token carries `pur` (`access` / `refresh`), and each
endpoint demands the one it needs. Without that check a 30-day refresh token is
accepted anywhere a 15-minute access token is, which silently turns a stolen refresh
token into permanent API access. This is verified by test: a refresh token presented
as an access token returns `user: null`.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | 201, sets both cookies. 409 if the email exists. |
| `POST` | `/api/auth/login` | 200, sets both cookies. 401 on either bad email or bad password. |
| `POST` | `/api/auth/refresh` | Rotates both tokens. |
| `POST` | `/api/auth/logout` | Clears both cookies. |
| `GET` | `/api/auth/me` | `{ user }` or `{ user: null }`. Never 401s. |
| `POST` | `/api/leads/email` | Email capture for people not ready for an account. |

Guards: `requireAuth` (rejects) and `optionalAuth` (annotates only).

## Security decisions and why

- **scrypt, N=16384 r=8 p=1.** Deliberately slow, which is what makes an offline
  attack on a stolen database expensive. The parameters are stored *inside* each hash
  (`scrypt$N$r$p$salt$hash`) so they can be raised later without invalidating existing
  passwords; `needsRehash` upgrades a hash on next successful login.
- **`timingSafeEqual`, not `===`.** A byte-by-byte comparison returns as soon as it
  differs, so its duration leaks how many leading bytes were right — enough to
  reconstruct a hash byte by byte.
- **Unknown email still hashes.** `authenticate` runs a dummy verification against an
  unknown address. Returning early would make unknown emails measurably faster than
  known ones, which is a user-enumeration oracle.
- **Same message for both login failures.** The response never reveals whether an
  address exists.
- **`assertSameOrigin` on every state-changing route.** `SameSite=Lax` already blocks
  cross-site POSTs, but it is browser-enforced and has historical gaps. This is the
  server-side half of the same defence.
- **Algorithm is pinned to HS256.** Accepting whatever the token header claims is the
  classic JWT confusion bug (`alg: none`, or RS256 signed with the public key).
- **The password hash cannot leak.** `toPublicUser` builds an explicit object rather
  than spreading the record, so adding a field later cannot expose it by accident.
- **Password minimum is length, not composition.** 12 characters. Composition rules
  push people toward `Password1!` while making the password no harder to crack.

## Verified

`logs/critique/_verify-auth.mjs` runs the real flow over HTTP. All 13 checks pass:

```
signup wrong origin              403
signup bad email                 400
signup short password            400
signup                           201  cookies nexg_at(HttpOnly)(Lax) nexg_rt(HttpOnly)(Lax)
me with session                  200  identifies the user
refresh                          200  rotated: true
refresh-as-access rejected       200  user: null
duplicate signup                 409
login correct                    200
login wrong password             401
login unknown email              401
logout clears cookies            200  2 cleared
lead capture twice               202 / 202 (identical)
```

## Not done yet — read before shipping

1. **The user store is in-process.** `server/auth/session.ts` keeps users in a `Map`.
   It does not survive a restart and does not work across more than one process. The
   interface is written to match the eventual repository, so only the four functions
   in that file change. The table:

   ```sql
   CREATE TABLE users (
     id                uuid PRIMARY KEY,
     email             citext UNIQUE NOT NULL,
     password_hash     text NOT NULL,
     display_name      text,
     email_verified_at timestamptz,
     created_at        timestamptz NOT NULL DEFAULT now()
   );
   ```

   `citext` (or a lowercased unique index) matters: emails are case-insensitive, and a
   plain `text UNIQUE` would let `A@x.com` and `a@x.com` both register.

2. **No mail transport.** `issueVerificationToken` stores the token and signup
   *returns it in the response* so the flow is testable. **That must stop** once email
   delivery exists — returning a verification token to the caller defeats it.

3. **No revocation list.** Logout clears the cookies, but an already-issued access
   token stays valid until it expires (≤15 minutes, which is the point of the short
   TTL). A `jti` denylist would close the gap if instant revocation is ever needed.

4. **No rate limiting.** Login and signup are unthrottled. scrypt makes each attempt
   expensive, which is partial protection, but a real limiter belongs in front.

5. **No breach check at signup.** Worth adding (Have I Been Pwned's k-anonymity range
   API) so a known-pwned password is rejected at creation.
