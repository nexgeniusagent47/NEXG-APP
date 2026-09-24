# NEXG App — Master Build Plan

- **Plan version:** 1.3
- **Updated:** 2026-09-24
- **Status:** `ACTIVE — P0 release readiness blocked; P2 API/identity kickoff in planning`; production release remains gated
- **Scope:** the NEXG public website and the staged partner experience in this repository
- **Product owner:** NEXG owner

This is the initiative-level plan. Individual phases still need their own approved, detailed
specification and acceptance checklist before implementation. The operating loop is
**PLAN → IMPLEMENT → VERIFY → ACCEPT → PROCEED**. A deployment is a separate release gate.

## Executive sequence

1. Finish the local onboarding quality slice: use the owner's wordmark artwork with adaptive ink
   variants (original black/orange in light mode; pale ink/orange on transparent in dark mode),
   place each onboarding back control before its wordmark, align light/dark form tokens, use the
   same gold title-band treatment across merchant, rider, and host onboarding, use a motorcycle
   glyph for the independent rider, remove merchant-category icon tiles and the white selected state,
   prepare the complete 112-image Google Flow prompt set for the 21 category and 128 subcategory
   options, preserve every current role-specific field, and detect a supported device language
   while respecting a saved user choice.
2. Inventory and unify host, merchant, and rider onboarding behind one role-selecting intake before
   V1. Preserve existing inputs, agreements, validation, and submission behavior.
3. Complete release readiness for the local PostgreSQL-only catalogue change and establish the
   approved source/release path. The checkout has no Git remote and contains unrelated changes, so
   **there is no safe first push or production deploy today**.
4. Deliver the guest journey from discovery/search through merchant/item selection and the agreed
   V1 ordering outcome. Keep partner/product pages and portals outside the V1 launch scope.
5. Before V1 production traffic, re-check Cloudflare's edge and origin certificate state, install
   and validate HTTPS at the origin, move to Full (strict), and close API/WAF/rate-limit and
   monitoring launch gates. Re-check current state before changing Cloudflare settings.
6. Launch V1 only after the exact candidate passes its gates, production TLS/security is verified,
   rollback is rehearsed, and health plus guest/onboarding flows are accepted. Build the other public
   product/partner pages after V1; portals follow later.

The onboarding/logo/theme/language and partner-estimate changes are now present in the local
worktree. A **push date cannot be responsibly promised yet**: this checkout has no configured Git
remote, contains a broad mixed change set, and the documented server pull path does not match the
server project path recorded in the current handoff. The first push becomes schedulable once the
owner selects a release destination, the exact source/artifact is reconciled, and the candidate
passes its acceptance checklist. Pushing code and opening public V1 traffic are separate gates.

## Capability map and boundary

| Capability ID | Responsibility | Depends on | First release? |
|---|---|---|---|
| `release-safety` | Verify and release the already-prepared database-only catalogue behavior; establish a repeatable release gate | Existing app, production access and a usable release path | Yes, only after gates |
| `identity-security` | User identity, isolated sessions, authorization, password reset, API access policy, abuse controls | Current Express API and PostgreSQL | Security foundation before protected workflows |
| `guest-marketplace` | Public discovery, search, merchant/item detail, cart, checkout journey | Catalogue API, identity where required, order contract | First major UX product phase |
| `data-performance` | Workload-based query budgets, plans, indexes, pagination | PostgreSQL schema and guest API queries | Before accepting checkout/search scale |
| `experience-system` | Gold brand tokens, accessible forms, reusable loading/empty/error/offline states, mascot-ready slots | Guest UX flows and owner-provided mascot assets | Cross-cutting before UX acceptance |
| `category-illustrations` | Consistent, background-free 3D illustrations for every current category and subcategory option | 21 category images plus 91 reusable subcategory-symbol images, generated and reviewed in owner's Google Flow account | Onboarding quality slice; generated files still need integration |
| `adaptive-onboarding` | One role-selecting form rendering host, merchant, and rider-specific components without dropping existing inputs | Current onboarding forms and prototype field inventory | Required for V1 |
| `public-partner-products` | Partner-facing pages and public product pages | Approved product catalogue/copy and guest navigation | After the guest flow |
| `partner-portals` | Authenticated host/merchant/rider operational portals | Identity, authorization, onboarding contracts, and accepted guest flow | Later; not the first release |
| `operations` | Structured logs, metrics, alerting, migrations, release strategy and rollback | Security and release contracts | Begins with the foundation; matures by later phases |

## Product boundary and catalogue

The NEXG website should explain products people can use or buy, while keeping product
implementation boundaries honest:

| Product | Website treatment | Build boundary in this repository |
|---|---|---|
| NEXG marketplace | Guest discovery and checkout, then product/partner pages | In scope |
| NEXG POS | Present as a product and link to its owner-approved destination | POS implementation is a separate project; explicitly out of scope here |
| NEXG Voice Agent | Present as a planned/available product only when its readiness and capabilities are confirmed | Agent implementation is a separate product phase/repository |
| Temperature-controlled verified delivery container | Working product name: **NEXG TempVault**; describe the concept as temperature-managed delivery and order-verification hardware | This plan covers its website listing only; hardware, rider workflow, verification protocol, and operations need their own spec |
| Other merchant software | Add to the product catalogue after owner confirms product name, readiness, audience, and destination | Product-page/content work only unless separately approved |

Patent status, filing jurisdiction, grant number, and ownership evidence must be recorded before
the live website claims that TempVault is patented. Use only a substantiated “patented” or
“patent-pending” statement; otherwise describe it as a product concept. The working name also
needs trademark and domain checks before launch.

## Evidence baseline and limits

- `docs/HANDOFF-2026-09-22.md` records 21 categories, 128 subcategories, 640 merchants, and
  6,000 items in PostgreSQL. Those are the handoff's dated production observations, not a fresh
  production check in this planning pass.
- The local fail-closed change is documented as removing the bundled JSON catalogue fallback.
  The handoff records TypeScript and diff checks as passed, but full application tests/build and
  an outage simulation were not run. It is not accepted and is not deployed.
- Source/docs describe catalog GET APIs as public, a wildcard CORS response, in-process auth
  storage, and process-local rate limiting. These are code-level planning findings, not proof of
  current production behavior. Production configuration must be verified in the release phase.
- The current auth guide says that users are held in a process-local map, reset flow and mail
  transport are absent, and session revocation is absent. Confirm those statements against the
  current source at the start of the identity phase.
- Local release checks run on 2026-09-24: TypeScript check passed after adding the SVG `?url`
  declaration and excluding the ignored `vendor/` examples; Vitest passed 52/52; API contract
  passed 29/29 against a freshly initialized local source server and PostgreSQL; browser flow
  passed 18/18; merchant/order consistency passed 24/24; and the Vite production build passed.
  An isolated local invalid-loopback-DB simulation also returned HTTP 503 for health, categories,
  and merchants with no catalogue fallback. The npm/npx launchers on this workstation are broken,
  so repository-local Node binaries and scripts were invoked directly. No staging/production outage
  check, production configuration check, security acceptance, or deployment was performed. See the
  dated release handoff.
- Existing SQL repository code is documented as parameterized with an allowlisted sort path.
  That is useful baseline evidence, not a guarantee that every query and write path is safe.
- No external requests were sent to competitor systems. Their private website-origin allowlists
  cannot be inferred from public pages. Official Uber and Wolt partner API documentation shows
  OAuth/bearer-token integration for partner APIs; that is distinct from a customer website's
  browser-origin policy. No Glovo integration evidence was verified in this planning pass.

## 1. Objective

Make nexgapp.com a complete, trustworthy guest-to-checkout marketplace that directs consumers
through discovery and ordering; explains NEXG products and partner opportunities; and provides a
single adaptive intake form. Establish the identity, API, database, accessibility, observability,
and release foundations needed to add portals safely afterward.

Success means a visitor can use the mobile and desktop site to search, compare, select, and reach
the intended checkout outcome; a partner can find the relevant product and submit the correct
application through one role-aware form; and protected APIs enforce real identity/authorization
rather than relying on obscurity, a domain header, or a client-provided identifier.

## 2. Scope

**In scope:** the guest-facing website, its API contracts, public product/partner pages, the unified
host/merchant/rider onboarding experience, security improvements required by those flows, query
planning, UX error states, accessibility, monitoring, release strategy, documentation, ADRs, and
handoffs.

**Out of scope:** implementing the POS, voice-agent runtime, hardware/container, rider mobile app,
or partner/admin portals before the guest experience is accepted. The website may list these
products with approved, accurate status and links. No licensing purchase is assumed for benchmark
software; external references are learning material only.

## 3. Dependencies

- Owner approval of this plan and phase-specific plans.
- Current repo/spec/handoff, local vendor references where relevant, and existing onboarding
  prototypes/field inventories.
- A safe, documented deployment route; the repository currently reports no Git remote.
- Existing PostgreSQL data and a verified restore path for any schema migration.
- Owner-provided product details, product readiness, destinations, legal/patent evidence, and the
  mascot assets before those claims or illustrations are published.
- Mail delivery design and domain configuration before production password reset.
- Product decisions for checkout, payment provider, delivery coverage, and order states before the
  checkout API is specified.

## 4. Architectural boundaries

- Keep the current documented web stack as the **baseline to assess**, not a locked new commitment:
  React 19, Vite 6, Tailwind 4, Express 4, Node 24, and PostgreSQL 15. Record any version/runtime
  changes in ADRs after compatibility and support review.
- Keep the existing one-origin website/API model where practical. Do not introduce services,
  databases, queues, or validation libraries without a phase plan and ADR.
- PostgreSQL is the source of truth for production catalogue and future durable user/order state.
  Client caches may improve responsiveness but never become authority for price, ownership, stock,
  roles, or order state.
- Classify APIs by public catalogue, user-scoped, operator, integration/webhook, or health/telemetry
  purpose. Public browsing can be intentional; sensitive data and operations cannot be public.
- Preserve POS, voice-agent, and hardware implementation boundaries. Website product listings do
  not imply those systems are integrated or production-ready.

## 5. Existing contracts affected

- Existing public catalogue/search/category/merchant read contracts and their pagination/sort
  behavior.
- Auth endpoints, cookie names/attributes, login/signup/refresh/logout behavior, and current
  `requireAuth`/`optionalAuth` consumers.
- Existing merchant, courier/rider, and host onboarding fields, draft preservation, and submission
  expectations. Inventory every field before consolidation; do not silently remove one.
- Existing error payloads, health/readiness shape, metrics/traces access, CORS headers, and rate
  limits. Document compatibility before modifying a contract.
- Existing product copy and category navigation. Do not claim real inventory, partner status, or
  delivery guarantees for synthetic catalogue data.

## 6. New contracts required

- An API exposure register with method/path, data classification, authentication, authorization,
  CORS, rate-limit class, validation, and owner.
- Durable user/session contract: UUID user identity; a distinct per-session identifier; expiry,
  rotation, revocation, and ownership checks. Exact storage/token model is an ADR decision.
- Password-reset contract: generic account-safe response, secure random one-time token, hashed at
  rest, an absolute 15-minute expiry, rate limits, HTTPS-only delivery, and token/session
  invalidation behavior.
- Checkout/order contract: canonical server-priced request, idempotency, state transitions,
  inventory/availability rules, and safe retry semantics.
- Adaptive onboarding schema: shared common fields and role-specific host/merchant/rider sections,
  preserving the complete inventory of current requirements.
- UI state contract for loading, empty, no results, unavailable/closed, validation, permission,
  rate limit, offline/network, checkout failure, and unexpected errors.

## 7. Entities affected

Expected entities requiring schema review: user, session, password-reset token, role/tenant or
partner ownership, onboarding application, merchant/catalogue item, cart/checkout intent, order,
order line, idempotency record, audit event, and notification-delivery record. These are planning
names, not authorization to create tables. Avoid duplicate user/session/order concepts; use the
existing domain model where it is sound.

## 8. Database changes

- Keep existing production volume and rows. Never use a seed reset as a release step.
- Design migrations as additive/expand → backfill or dual-read/write where needed → validate →
  contract/remove later. Coordinate old and new app versions during blue/green overlap.
- Store password-reset token hashes, not raw tokens. Session persistence/revocation design is an
  ADR; secrets and tokens must never appear in logs.
- Add query indexes only after baseline query plans/workload measurements. Use `EXPLAIN (ANALYZE,
  BUFFERS)` on safe staging/representative data and inspect estimates, rows, timings, and buffers.
  Avoid blanket indexes on every input field; account for write cost and index size.
- Identify required uniqueness, foreign-key, check, and transaction constraints for order
  idempotency, inventory, and tenant ownership in their phase specs.

## 9. APIs affected

Inventory every `/api/*` route. Define separate policy classes:

1. **Public discovery:** only intended public fields; pagination, abuse controls, and no private
   merchant/order/user data.
2. **User session:** authenticated by server-verified credentials; resource ownership checked on
   every read/write.
3. **Partner/operator:** explicit role and scope checks; metrics/traces restricted and health
   responses minimized.
4. **Machine integrations/webhooks:** OAuth or signed credentials, audience/scope, replay defense,
   and rotation; never protected by CORS alone.
5. **Health/readiness:** minimum operational fields; no raw exception, database error, secret,
   connection string, stack, or customer content in public responses.

CORS should allow only the approved browser origins where cross-origin browser access is required.
The `Origin` header is not an authenticator: command-line clients can set it, and native apps do not
provide a trustworthy website origin. If a genuinely public catalogue API is callable from
anywhere, document that as intended and control scraping/abuse separately. See the OWASP CORS and
REST references below.

## 10. Commands affected

No database or production command is authorized by this plan. The existing repo verification
commands are recorded in `AGENTS.md`: `npx tsc --noEmit`, `npm test`, `npm run test:api`,
`npm run test:flow`, `npm run test:consistency`, and `npm run build`. Run them only in an approved,
isolated verification environment and record exact output. Boot the API after any `server/` change.
Use the current deployment handoff/runbook only after reconciling it with the actual release route.

## 11. Events affected

Potential events: sign-in/session-created/session-rotated/session-revoked; password-reset-requested/
consumed; onboarding-submitted; checkout-started/order-created/order-state-changed; payment
provider outcomes; rate-limit-triggered; database/readiness failure; and release/rollback. Define
event IDs, privacy, ordering, idempotency, retention, and ownership before implementing event
delivery. None is an authorization to add a broker.

## 12. State machines affected

- Session: active → rotated/revoked/expired.
- Password reset: issued → consumed/expired/revoked; one terminal transition only.
- Onboarding application: draft → submitted → review states → accepted/rejected/withdrawn (final
  states require owner approval in the detailed spec).
- Checkout/order: specify validated states, legal transitions, retries, cancellation and recovery
  before building checkout. Never infer payment success from a client redirect.
- Release: candidate → health-gated traffic shift → accepted or rollback.

## 13. Capability changes

Guest: search and browse without account friction; learn what each vertical offers; inspect
merchant/item availability and requirements; build a cart; reach checkout with clear price,
delivery, and next steps. Partners: understand products and choose host, merchant, or rider
onboarding in one form. Later portal users: see only their own tenant's resources and actions.

## 14. Authorization requirements

- User UUIDs identify records; they do **not** prove that the requester owns a record.
- Every authenticated request derives the principal and session from verified server credentials.
  Ignore or validate any client-supplied `userId`, `sessionId`, merchant/tenant ID, or role against
  server-side ownership and scope.
- Give each login/session a distinct unpredictable server-recognized session identifier. Support
  revoking one session and, where required, all sessions for a user. The storage and token choice
  remains an ADR.
- Apply object-level and function-level authorization to user, merchant, host, rider, and operator
  resources; protect against IDOR/BOLA and mass assignment.
- Use separate service credentials/scopes for integrations and least privilege for database roles.

## 15. Offline behavior

Public pages should distinguish cached catalogue from current availability and display a clear
retry state. Checkout, payment, session changes, onboarding submission, and order transitions
must not claim success while offline. Preserve safe, non-sensitive onboarding drafts only after a
privacy/storage review; never cache session secrets or payment credentials in local storage.

## 16. Synchronization behavior

Server owns price, inventory/availability, delivery fee, authorization, and order state. Checkout
revalidates at submit and returns conflicts with a recoverable UI when catalogue facts changed.
Retries use idempotency keys and deterministic outcomes. Blue/green releases share the same
database only under compatible schema contracts; avoid dual writers with conflicting state rules.

## 17. Hardware requirements

Website work does not implement hardware. TempVault's product page needs owner-confirmed supported
temperature range, insulation/thermal controls, power/battery, tamper/order verification, cleaning,
handoff, and operating limits before publishing specifications. Hardware, telemetry, rider
interactions, food safety, and certifications require a separate spec, safety review, and ADRs.

## 18. Integration requirements

List each email, payment, map/location, delivery, analytics, and partner integration with data
shared, credential owner, scopes, sandbox/test mode, retries, timeout, webhook signature/replay
controls, and failure UX. Never expose secrets in the browser bundle or public repository. For
third-party APIs use their documented authorization flow, not browser CORS rules. Partner API
references reviewed for this plan: Uber OAuth and Wolt OAuth bearer-token documentation. Glovo
integration policy remains unknown and must be researched from authorized docs before integration.

## 19. UI/application impact

### Guest journey (first major experience)

`landing/location → search or category → results → merchant → item/options → cart → delivery and
contact details → checkout/payment handoff → confirmation/status`. Map exact routes and preserve
search context/back navigation. Mobile-first patterns should learn from Uber Eats, Glovo, and Wolt
without copying their protected designs or implying a partnership. Define responsive behavior at
each step and keyboard/screen-reader operation.

### One adaptive onboarding experience

One entry point and shared progress shell; a user selects host, merchant, or rider and the form
renders the role-specific sections and controls. The intake must preserve all existing fields,
document requirements, validation meaning, draft behavior, and review/consent content. A source
field inventory is an acceptance artifact. Do not build three public entry forms that drift apart.
The immediate visual slice aligns the current role-specific views while the shared entry and
role-selection shell is implemented. It must not remove or rewrite existing field content.

### Language behavior and quality

For supported languages (English, Chinese, Swahili, Arabic), a new visitor starts in the first
supported language reported by the device/browser; an explicitly saved in-app choice takes
precedence. Unsupported device languages fall back to English. Set the document `lang` and Arabic
right-to-left direction with the selected language. Device detection does not guarantee perfect
translation. Current locale selection is in progress, and the translation catalogue still contains
English placeholders for Chinese, Swahili, and Arabic; the site is **not fully translated**.
Before multilingual V1 acceptance, audit every visible site string and error state, verify
translation-key parity, and have qualified language reviewers validate the copy.
Legal agreements need separate owner/legal review; do not machine-translate and treat them as
approved contract language.

The partner earnings estimators use localized KES amounts in English, Chinese, Kiswahili, and
Arabic. The courier estimate uses an owner-provided rate of **KES 95 per kilometre** and states
that riders receive at least **48 hours' notice** before a rate change. The property estimate uses
an **18% share of all order markup** and states a **14-day notice** before a share change. Both are
working commercial assumptions; the displayed estimates must explain their inputs and remain
clearly illustrative. Confirm final contract wording and operational policy before production use.

### Brand and error experience

Light mode uses NEXG gold as an accent with neutral surfaces and tested text/focus colors; do not
put small text in a low-contrast gold. Meet WCAG 2.2 AA contrast targets (4.5:1 normal text,
3:1 large text and relevant UI/focus boundaries) and verify with a reliable contrast checker.
Create a shared error-state inventory and design system. Reserve mascot illustration slots now;
use the real mascot for variants after the owner shares the approved asset/brief. Error copy must
explain what happened, what the user can do, and preserve safe work; never expose stack traces or
database details.

Required screen/state families: not found, service unavailable, no results, empty catalogue/cart,
merchant closed or item unavailable, form validation, upload failure, session expired/permission
denied, rate limited, offline/network, checkout/payment failure or pending, order status conflict,
and generic unexpected error. Each needs a design spec, localization/accessibility check, and
recoverability rule.

## 20. Security impact

- **Session isolation:** UUIDs are useful stable record identifiers, but session isolation requires
  separate per-session credentials and server-side authorization. Design a model that cannot
  treat one user's UUID or a caller-provided identifier as proof of identity.
- **Password reset:** one-time, cryptographically random, hashed-at-rest token; expires exactly
  15 minutes after issue; consume atomically; rate-limit issuance and attempts; keep responses
  enumeration-safe; invalidate/revoke affected sessions according to the approved policy. Avoid
  logging tokens and suppress referrer leakage from reset URLs.
- **SQL injection:** validate type/length/range, use parameterized statements for values, and
  allowlist any dynamic SQL structure (column names, sort direction, table/operation choices).
  “Sanitize every string” is not a substitute for parameterized SQL.
- **XSS:** render plain text using framework escaping and context-aware output rules; avoid unsafe
  HTML insertion. If rich HTML is a real requirement, use a well-maintained allowlist sanitizer
  and a separately tested policy. Validation reduces bad input but output context determines
  encoding.
- **Public APIs:** threat-model BOLA/IDOR, broken authentication/authorization, sensitive data
  exposure, resource exhaustion, scraping, spam, mass assignment, and abuse of sensitive business
  flows. Classify endpoints and test anonymous, wrong-user, wrong-role, spoofed-Origin, and
  over-limit requests in a controlled environment.
- **Rate limiting:** endpoint-specific limits for sign-in/reset, search, onboarding, checkout,
  uploads, metrics, and webhooks. Define `429`/`Retry-After`, identity/IP dimensions, proxy trust,
  bypass resistance, and distributed storage. Process-local in-memory counters do not coordinate
  replicas.
- Review dependency/supply-chain, secrets, CSP, cookies/CSRF, upload validation, logging/PII,
  database privileges, operator access, and Cloudflare/origin controls in a separate authorized
  security phase. No full security certification is implied by this plan.

## 21. Observability requirements

- Structured, correlated request logs and traces; use generated request/correlation IDs.
- Redact passwords, cookies, reset links/tokens, authorization headers, connection strings,
  payment data, and unnecessary personal data before log/trace/export.
- Measure API latency/error rate, DB pool and query failures, auth/reset abuse, `429`s, checkout
  state failures, onboarding completion, email/payment/webhook outcomes, and release health.
- Define alert owner, threshold, severity, runbook, notification path, and test signal for each
  critical alert. Alert on database unavailable, sustained elevated 5xx/latency, auth abuse,
  order/payment delivery failure, backup failure, and failed/rolled-back release.
- Keep operational telemetry private; public health responses return only the minimum needed.

## 22. Testing strategy

Each phase spec will define unit, API/contract, authorization matrix, database migration/query,
failure-mode, accessibility/keyboard, responsive, and browser-flow coverage as relevant. Include
positive and negative controls: allowed versus denied origin, owner versus other-user resource,
valid versus expired/reused reset token, in-limit versus over-limit request, parameterized SQL
input, escaped versus explicitly sanitized HTML, and database available versus unavailable.
Checkout requires duplicate/retry/concurrent-state tests. Verify using representative seeded data
without altering production. Manual acceptance records browser/device, viewport, result, and known
limits. A green build alone is not acceptance.

## 23. CI validation

CI must run the repository gates listed in `AGENTS.md`, migration checks, dependency/security
checks approved for the repo, API contracts, and any end-to-end gates added by phase. Require
checks before merge/release and preserve their logs. The current checkout has no remote and this
plan does not assume a CI provider. Decide provider/branch protections in an operations ADR.

## 24. Migration requirements

Every schema/data migration needs a reviewed SQL diff, backup/restore plan, forward and rollback
behavior, compatibility during overlap, lock/runtime estimate, representative-data rehearsal, and
post-migration invariant query. Deploy additive schema before code that depends on it; remove old
schema only after all blue and green instances no longer use it. No production seed/recreate/reset.

## 25. Rollback requirements

For every release, record immutable artifact/version, database migration state, health criteria,
traffic switch, rollback command/operator, data compatibility, and customer message if ordering is
affected. Blue/green is an application traffic strategy, not a rollback for incompatible or
destructive data writes. Prefer backward-compatible schema changes and feature flags. Test rollback
on staging; do not perform a production failure simulation.

## 26. Documentation changes

Maintain `SPEC.md`, this master plan, phase plans/specs, ADRs, API/auth/security docs, onboarding
field inventory, query/index decisions, accessibility/error-state specs, release/runbooks,
`CHANGELOG.md`, status matrix, current handoff, and dated session record. Every accepted release
includes exact verification evidence, deployed version, observed result, rollback route, and open
risks. Record skills used in the handoff.

## 27. Deliverables

1. Approved master plan and capability boundaries.
2. Proposed ADR register; each significant decision becomes an owner-reviewed ADR before the
   implementation it gates.
3. Current API exposure/authz inventory and threat model.
4. Accepted guest discovery-to-checkout journey and its contracts.
5. Accessible gold theme and complete shared error/loading/empty/offline state library.
6. Unified onboarding field inventory and role-rendering spec, followed by implementation.
7. Product/partner content inventory with accurate statuses and verified TempVault claims.
8. PostgreSQL query baseline, justifiable indexes, and transaction contracts.
9. Logging/monitoring/alert matrix and operational runbooks.
10. Verified CI/release/blue-green/rollback process.
11. Changelog, phase status, and handoff artifacts at every accepted boundary.

## 28. Acceptance criteria

- Guest can complete the agreed discovery-to-checkout journey on supported mobile and desktop
  viewports with keyboard-only operation, meaningful focus, accessible labels, and recovery from
  every defined failure state.
- Public API inventory labels every route and matches actual access policy; sensitive endpoint
  access is denied to anonymous/wrong-scope users, regardless of a spoofed Origin value.
- Two sessions for the same account are distinguishable and individually revocable under the
  accepted design; one user's credentials cannot access another user's resources.
- Password reset tokens expire at 15 minutes, are single-use, stored only in protected form, and
  do not reveal account existence in responses.
- All existing onboarding field requirements remain available through one host/merchant/rider
  experience; role-specific fields and validation render correctly and are keyboard accessible.
- Error states disclose no secrets or internals and let the user retry, recover, or contact support
  where appropriate; mascot art is only used after owner asset approval.
- Indexes and query changes have before/after plans and latency/row/buffer evidence on staging;
  no index is added solely by guess.
- Alerts, logs, and traces are tested with safe synthetic signals and contain no session/reset or
  credential secrets.
- Release and rollback are rehearsed on staging, migrations remain compatible, and live acceptance
  evidence is recorded before phase acceptance.

## 29. Failure modes

DB unavailable/stale; API route accidentally public; weak/incorrect CORS; session token replay or
cross-user access; reset token leak/reuse; rate-limit bypass behind proxy or across replicas;
database migration locks/downtime; stale price or inventory at checkout; duplicate order from
retry; mail/payment/webhook provider outage; upload abuse; inaccessible or nonrecoverable error
screen; gold contrast failure; logging of sensitive values; blue/green version/schema mismatch;
rollback after irreversible order writes; inaccurate product/patent claim.

## 30. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Large workstream tempts implementation before decisions | Phase-specific 34-section plan and owner gate before each implementation |
| UUID mistaken for session/authorization boundary | Separate session identity and server-side ownership checks; authorization matrix tests |
| Domain allowlist mistaken for API protection | Use CORS for browser policy; use credentials, scopes, authorization and abuse controls |
| Wildcard CORS on private data | Route-class policy and explicit browser origins; remove wildcard where not justified |
| “Sanitize every field” breaks data or leaves injection paths | Parameterized SQL and output-context escaping; field validation and allowlisted rich HTML |
| Rate limit works on one process only | Choose shared/distributed limiter in ADR and test multi-instance behavior |
| Over-indexing worsens writes/storage | Measure real workload and query plans before creating indexes |
| Checkout appears successful on client alone | Server-owned price/order state, idempotency, reconciliation and recovery contracts |
| Form consolidation drops an existing requirement | Capture all current fields/consent/docs before replacing any form |
| Product/patent claims are inaccurate | Owner supplies readiness, IP evidence, and approved copy before publication |
| Dirty checkout or no remote ships unintended code | Establish release source, isolate approved files/commit, verify gates, artifact and rollback |
| Mascot is unavailable during error-system work | Design reusable composition with placeholder illustration slot; integrate only approved assets |

## 31. Required ADRs

All are **PROPOSED / NOT ACCEPTED** until their context, options, consequences, and owner decision
are recorded in `docs/adr/`:

1. Public API classification, CORS and anonymous catalogue policy.
2. Durable UUID identity, session token/storage, rotation and revocation model.
3. 15-minute reset token, mail delivery and session invalidation.
4. Distributed rate-limit store, key dimensions, proxy trust, and emergency behavior.
5. Checkout/order consistency, idempotency, inventory/availability, and payment boundary.
6. Adaptive onboarding schema/validation/draft storage and role-specific sections.
7. PostgreSQL query/index budget and search strategy based on evidence.
8. Blue/green traffic switching, migration overlap, deployment source and rollback.
9. Error-state/mascot composition, asset licensing and accessibility.
10. NEXG gold tokens and contrast-safe light/dark theme rules.
11. Product catalogue readiness model and TempVault naming/IP claim process.

No ADR is accepted merely because this list recommends considering an option. Do not lock an
unreviewed stack or add new infrastructure while these decisions are unresolved.

## 32. Exit criteria

This initiative is complete only when each scoped phase is accepted, all phase ADRs are resolved
or explicitly deferred by the owner, guest journey and single onboarding form meet their criteria,
portal access is safe, query/observability/release evidence is stored, production acceptance is
recorded, docs/handoff are current, and open risks are explicitly accepted or tracked. The current
initiative is **not complete**.

## 33. Resolved decisions and owner review items

### Resolved from the owner's instructions

- Website guest journey comes first; partner portals follow it.
- POS is a product to present, not a POS implementation task in this repository.
- Voice agent and TempVault are products; their runtimes/hardware are not silently pulled into the
  website implementation scope.
- Host, merchant, and rider intake must be one adaptive form with distinct rendered sections and
  all existing input requirements retained.
- Use spec-driven, phased delivery with verification, logs, changelog, ADRs, and handoff.
- Password reset links must expire after 15 minutes; the owner asked for unique UUID identities and
  isolated user sessions.

### Decisions still required before dependent implementation

- What exactly “instant records” means: immediate order acceptance, inventory reservation, or
  deployment record visibility. Treat as unresolved until the order/release owner clarifies.
- Checkout/payment method, delivery-fee model, supported area, and final order-state machine.
- Whether public catalogue data is intentionally accessible to arbitrary API clients, or only
  discoverable through NEXG web/mobile clients. CORS alone cannot enforce that distinction.
- Session implementation and persistence; limiter storage; mail provider; release/CI provider.
- Approved mascot files, final light-mode gold values, product owners/readiness/destinations.
- TempVault patent filing/grant evidence, jurisdiction, and legal-approved public wording.
- Confirm the full role-specific onboarding field inventories against the latest prototypes/forms.

## 34. Sub-phase breakdown

Each numbered phase recurses through its own plan → implement → verify → accept record. A phase may
split further when its work spans independent contracts.

| Phase | Outcome | Dependencies / exit evidence |
|---|---|---|
| `P0 Release readiness` | Review and accept or revise the fail-closed Postgres catalogue change; establish a safe source/release artifact and rollback | Current checkout is dirty and has no Git remote; exact gates, API/flow checks, DB-outage test off production, approved artifact, release route, post-release health/source/counts |
| `P1 Onboarding quality slice` | Apply the owner's wordmark with theme-adaptive ink on transparent backgrounds; put back controls before the logo; use brand gold title bands with readable dark text across merchant, rider, and host onboarding; show a motorcycle for the independent rider path; align light/dark contrast; remove category/subcategory icon tiles and white selection; prepare the complete 112-image prompt set; preserve role fields; detect supported device language | Supplied logo; shared theme tokens; all 112 reviewed local image assets before integration; visual/accessibility review; locale preference and RTL checks; no dropped fields |
| `P1 partner estimator assumptions` | Show courier estimates in KES at KES 95/km with an adjustable distance input and 48-hour change notice; show property owners' 18% share of order markup with 14-day change notice; localize estimate copy for all four supported languages | Clear illustrative formula and inputs; localized KES display; final commercial terms and legal wording confirmed before production |
| `P2 API and identity security` | API inventory; browser CORS policy; route authorization; durable sessions; 15-minute reset; endpoint limits; input/output safety | ADRs 1–4; threat model; anonymous/wrong-user/spoofed-origin and expiry/replay checks |
| `P3 Guest discovery and V1 ordering` | Mobile-first search/category/results/merchant/item/cart and agreed V1 ordering outcome | P2 contracts; journey map; API contracts; responsive/accessibility/browser-flow checks and failure states |
| `P3.1 Database query evidence` | Baseline search/catalogue/ordering plans; add approved indexes/constraints only when measured | P3 query inventory; representative dataset; staged EXPLAIN/latency/buffer comparisons; migration/rollback rehearsal |
| `P4 Unified onboarding` | One public host/merchant/rider intake entry rendering the correct retained role-specific sections | Full current-field inventory; ADR 6; role/validation/draft/accessibility/language acceptance |
| `P5 V1 Cloudflare and production security gate` | Re-check edge/origin certificate state; serve verified HTTPS at origin; use Full (strict); verify exposed APIs, WAF/rate limits, monitoring, backup, and rollback gates | Fresh dashboard/server evidence; valid hostname certificate at origin on 443; strict-mode HTTPS checks; endpoint exposure register; reviewed launch checklist |
| `V1 Go-live` | Deploy approved guest journey and adaptive onboarding after P0–P5 exit evidence is accepted | Immutable candidate; complete repo gates; release/rollback rehearsal; Cloudflare/origin security confirmed; health, discovery, and onboarding acceptance |
| `P6 Public partner/product pages` | After V1, publish accurate partner pages and product catalogue (POS, voice agent, TempVault, and later products) | Approved product copy, destinations, readiness/IP evidence; mobile and link checks |
| `P7 Partner portals` | Role-scoped merchant/host/rider tools; admin/operator boundaries specified separately | P2 identity/authz accepted; guest experience accepted; portal specs/ADRs and tenant-isolation checks |
| `P8 Operability and progressive delivery` | Mature redacted telemetry, critical alerts, blue/green app release, compatible migrations, and rollback | ADRs 4/7/8; staging rehearsal; alert runbooks; release and rollback evidence |

Current gate state: **P0 remains open** until the release source/destination and exact candidate
are reconciled, outage/rollback evidence is complete, and a release route is verified. **P2 is in
planning only**; ADR-0001 through ADR-0004 are proposed, not accepted. See
[`docs/handoff/P2-API-AND-IDENTITY-SECURITY-KICKOFF.md`](handoff/P2-API-AND-IDENTITY-SECURITY-KICKOFF.md).
Passing local checks does not authorize production deployment or complete either phase.

## References and learning material

- OWASP: [CORS Origin header scrutiny](https://community.owasp.org/attacks/CORS_OriginHeaderScrutiny) — an Origin value is not authentication.
- OWASP: [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) and [HTML5/CORS guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).
- OWASP: [Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), and [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
- PostgreSQL 15: [Using EXPLAIN](https://www.postgresql.org/docs/15/sql-explain.html) — use measured plans on representative data before index changes.
- Integration examples: [Uber OAuth API](https://developer.uber.com/docs/riders/references/api/v2/token-post) and [Wolt authentication](https://developer.wolt.com/docs/authentication20). These describe partner API authentication; they do not establish whether a public customer site blocks all requests from other domains.
