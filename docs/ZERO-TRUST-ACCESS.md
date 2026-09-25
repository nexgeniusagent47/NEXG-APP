# Cloudflare Zero Trust for NEXG App

**Status (2026-09-25):** HTTPS is live with Cloudflare Full (strict), but Zero Trust has not
been activated and no Access application or policy has been created. Until Access is designed
and tested, Nginx returns 404 for metrics/traces reads (including path variants) and 403 for
telemetry reads. Browser telemetry POSTs remain available. The operations dashboard cannot
load its private data during this interim.

## What Zero Trust does here

Cloudflare Zero Trust Access is an identity check in front of selected URLs. Before forwarding
a request, Cloudflare can ask an identity provider who the person is, check an allow policy, and
issue a short-lived signed token for the protected application.

HTTPS and Zero Trust solve different problems. HTTPS encrypts the connection and verifies the
site's certificate. It does not decide whether a visitor is allowed to read a route. Access
decides who may reach selected routes; it does not replace HTTPS. NEXG now has HTTPS on both
legs: visitor-to-Cloudflare and Cloudflare-to-origin. Access is a separate future gate for
staff-only diagnostics.

```text
Guest/customer  -> Cloudflare -> HTTPS origin -> public storefront and customer APIs
Operator        -> Access sign-in -> HTTPS origin -> protected diagnostic routes
```

The storefront, merchant catalogue, and customer APIs stay public. This is not a VPN and not a
replacement for customer sign-in. It is a narrow gate for a small staff-only operations surface.

## Why NEXG App needs it

The app currently has no durable operator role. Its existing customer authentication is not a
safe substitute: any signed-up customer could pass a generic signed-in check, and the user store
is in memory. The server exposes metrics and traces that are useful to operators but should not
be readable by anonymous visitors. Rate limiting reduces request volume; it does not decide who
is allowed to read the data.

Cloudflare Access alone is not enough if someone can reach the origin directly. The origin must
validate the signed `Cf-Access-Jwt-Assertion` token, including its signature, issuer, audience,
and expiry, or use a Cloudflare Tunnel configured to validate Access tokens. Trusting a header
because it is present would allow a caller to forge it.

## Planned scope

When this work resumes, protect only the operator metrics and traces reads:

- `GET /api/metrics`
- `GET /api/traces`

Allow the owner's chosen identity and deny everyone else. Keep the marketing pages, customer
APIs, catalogue, and mobile API outside the Access application. The metrics dashboard may need
a clean operator URL or a small UI adjustment so only its data requests, not the storefront,
are gated. Telemetry ingestion is `POST /api/telemetry`. Cloudflare documents Access application
scope in terms of host and URL path, with no HTTP-method selector for an application path. The
practical consequence is an inference from that path model: protecting `/api/telemetry` would
also put the public POST route behind Access. Move the read view to a separate operator-only path
before protecting it, and recheck Cloudflare's current path behavior when this work resumes.

The Zero Trust onboarding page showed a Free plan with a 50-seat limit and no base fee on
2026-09-25. It also offered a separate authorization to bill above free limits; that option was
left unchecked. The plan was not activated during the HTTPS work. Check current terms and
billing settings again if this work resumes.

## Safe implementation sequence

1. Confirm the identity provider and the exact owner email or group to allow.
2. Activate the Zero Trust Free plan only after reviewing its terms and billing controls.
3. Create a self-hosted Access application for the diagnostic paths only, with an allow policy
   for the selected operator identity and a deny-by-default result.
4. Add origin-side JWT validation using the account's Access team domain and application AUD.
   Fetch signing keys from Cloudflare's published key endpoint so key rotation is handled.
5. Keep the temporary Nginx deny in place until the app-side validator is deployed and verified.
   Then remove the deny only after anonymous requests fail and the allowed operator can use the
   dashboard.
6. Verify requests through Cloudflare and direct-to-origin. A forged header, missing token,
   wrong issuer, wrong audience, expired token, and non-allowlisted identity must all be denied.
   Confirm customer pages and APIs still work without Access.
7. Record the final policy, owner, recovery path, and test evidence in the handoff.

## Completion checks

- Anonymous requests to each diagnostic read endpoint are denied.
- Only the intended operator identity can read metrics and traces.
- Direct-origin requests cannot bypass the Access decision.
- Browser telemetry POST continues to work without collecting sensitive form values.
- Customer storefront and mobile API routes remain accessible.
- No Cloudflare over-limit billing authorization is enabled without owner approval.

References: [Cloudflare JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/),
[Cloudflare application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/).
