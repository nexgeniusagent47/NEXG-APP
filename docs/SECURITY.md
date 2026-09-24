# Security controls

Rate limiting, security headers, and client identity. Implemented in `server/security.ts`
and mounted in `server/index.ts`.

For production listener exposure, SSH/key rotation, Cloudflare/origin TLS, database credential
recovery, safe cleanup, and the acceptance gate, follow the [production security and cleanup
runbook](./SECURITY-HARDENING-AND-CLEANUP-PLAN.md). The runbook records the live snapshot and
distinguishes it from these source-level controls.

---

## Client identity

Every request is resolved to **an IP and a device id**, once, and both are recorded on the
span and every log line for that request.

| Field | Source | Notes |
| --- | --- | --- |
| `client.ip` | `req.ip`, honouring `trust proxy` | The real caller, not the proxy |
| `client.device_id` | `x-device-id` header, else a hash of the user agent | Prefixed `d_` when derived |
| `client.device_source` | `header` \| `derived` | Distinct so a client that omits the header is visible |
| `client.forwarded_chain` | `x-forwarded-for`, truncated | **Evidence only** — never used for a decision |

**Why `trust proxy` is load-bearing.** This app runs behind Cloudflare and then nginx.
Without trusting the proxy chain, `req.ip` is whatever spoke to us last — nginx or
Cloudflare's edge — so every request in the world shares one identity and any per-IP limit
becomes a global limit that locks out all users at once. That is the failure mode where
rate limiting is worse than having none.

It is set to `1`, not `true`. Trusting every hop lets a caller set `x-forwarded-for`
themselves and choose which rate-limit bucket they land in, which defeats the control
entirely.

**The forwarded chain is never an input to a decision.** It is attacker-supplied text and
can be any length, so it is logged as evidence and nothing else.

**The derived device id is hashed.** A user agent plus an IP is close to a fingerprint, and
it ends up in logs, which are retained far longer than the request that produced them.

---

## Rate limiting

Sliding window, keyed on **both** IP and device — a request passes only if both are under
their ceiling.

| Route family | Per device | Per IP | Window |
| --- | --- | --- | --- |
| `POST /api/auth/{login,signup,refresh}` | **10** | 100 | 15 min |
| `POST /api/leads/email` | 20 | 200 | 60 min |
| `POST /api/telemetry` | 120 | 1,200 | 60 min |
| `GET /api/{metrics,traces}` | 120 | 1,200 | 60 min |
| everything else under `/api/` | 300 | 3,000 | 60 min |

### Why the two ceilings differ

An earlier version used the same tight number for both, which is the obvious design and
wrong in production: **a single egress IP with ten users behind it locks out the
eleventh.** Shared egress is not an edge case — mobile carrier NAT, corporate networks and
campus wifi all put thousands of people behind one address. A login limit a real customer
can trip is an outage with an incident report, not a control.

So the device dimension carries the strict per-person number and the IP dimension is set an
order of magnitude higher, to catch volume that is clearly not human. Both must pass, so a
botnet rotating devices is still stopped by the IP ceiling, and one host rotating addresses
is still stopped by the device ceiling.

### Why both dimensions at all

IP alone is defeated by a botnet or by carrier NAT. Device alone is defeated by omitting
the header. Requiring both means an attacker must rotate addresses **and** identities
together.

### Sliding, not fixed-window

A fixed window lets a caller send the full allowance at 0:59 and again at 1:01 — twice the
intended rate, which is precisely the burst a credential attack wants. The window here
drops expired hits before counting. Buckets that have not been touched for an hour are
evicted, so a long uptime cannot grow the map without bound.

### Responses

A blocked request gets `429` with `Retry-After` and a JSON body carrying
`retryAfterSeconds`. Accepted requests carry `X-RateLimit-Limit` and
`X-RateLimit-Remaining`, so a well-behaved client can back off **before** being blocked.

The rejection is logged at `warn` with the dimension that tripped. A spike there is the
signal that something is being attacked, and knowing which axis was exhausted is what
distinguishes one noisy client from a distributed one.

### Verified

```
10 x 401  ->  429, 429, 429 ...        Retry-After: 898
different device, same IP  ->  401     (the fix for shared egress)
```

### Known limit — read before scaling

Counters are **in-memory**. Run two instances and the effective limit becomes
`max x instances`; run serverless and they may never fire. Both failures are silent.
Moving to a shared store is the fix, and the only function that changes is `hit()`.

---

## Security headers

Set on **every** response, including ones produced by a rejected body or a rate-limit
rejection — a 429 is still a response a browser renders.

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | see below |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self), payment=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-site` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` — **production only** |
| `X-Powered-By` | **removed** |

### The CSP, and the one deliberate concession

```
default-src 'self';  base-uri 'self';  object-src 'none';
frame-ancestors 'none';  form-action 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
img-src 'self' data: blob: https://images.unsplash.com https://api.dicebear.com ...
connect-src 'self' https://nominatim.openstreetmap.org ...;
frame-src https://maps.google.com https://www.openstreetmap.org;
upgrade-insecure-requests
```

**`style-src` allows `'unsafe-inline'`, deliberately.** Motion and react-spring set inline
styles on every frame, Vite injects its stylesheet at runtime, and Tailwind generates style
tags. Removing it would mean nonce-ing all of that or dropping the animation library, and a
policy that breaks the product gets switched off within a day.

**`script-src` does not get the same concession.** There is no inline script in the built
app, so it stays strict — and `script-src` is the directive that actually stops XSS.
Trading the weaker directive for a usable product while keeping the stronger one intact is
the right side of that trade.

**HSTS is production-only.** Sending it from a server that can still be reached over plain
HTTP pins browsers to a scheme that may not answer — a self-inflicted outage that outlasts
the mistake. It goes on when HTTPS is confirmed working.

`frame-ancestors 'none'` is the modern clickjacking control; `X-Frame-Options` is sent
alongside it for browsers that predate the directive.

### Verified

```
Content-Security-Policy    default-src 'self'; base-uri 'self'; object-src 'none'; fr...
X-Content-Type-Options     nosniff
X-Frame-Options            DENY
Referrer-Policy            strict-origin-when-cross-origin
Permissions-Policy         camera=(), microphone=(), geolocation=(self), payment=()
X-Powered-By               (absent)
Strict-Transport-Security  (absent in development, by design)
```

---

## Middleware order, and why it matters

```
securityHeaders   -> headers present even on a rejection
observability     -> must see every request, before anything can reject it
rateLimit         -> after observability, so a blocked request is still counted
client identity   -> resolved once, reused by later consumers
express.json      -> body parsing
routes
```

**Rate limiting sits after observability on purpose.** Ordered the other way, an attack
would be invisible in the metrics — which is exactly when you most want to see it.

**The identity middleware sits after the limiter** because the limiter must not depend on
work that could fail. Observability resolves identity independently from the request, for
the same reason: it has to record the requests that later middleware rejects.

---

## Still missing

1. **No rate limit on the SPA's static asset requests.** Deliberate — they are served from
   disk and rate limiting them would break first load on a slow connection.
2. **No distributed store.** See the known limit above.
3. **No alerting on the rate-limit warning.** The log line exists; nothing watches it.
4. **HTTPS is not enforced yet.** `upgrade-insecure-requests` is present and HSTS is ready,
   but the origin still speaks plain HTTP to Cloudflare. Until that leg is encrypted,
   session cookies can travel in the clear.
