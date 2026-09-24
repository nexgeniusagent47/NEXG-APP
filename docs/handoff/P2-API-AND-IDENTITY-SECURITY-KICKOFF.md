# Phase 2 kickoff — API and identity security

- **Date:** 2026-09-24
- **Status:** `PLANNING` — kickoff prepared; the detailed phase plan and owner decisions are still required.
**Source of truth:** [`../MASTER-BUILD-PLAN.md`](../MASTER-BUILD-PLAN.md), §§5–10, 14, 20–25, 28–32, 34.

## Phase objective

Define and implement a safe API and identity foundation before the guest ordering phase or partner
portals. An account UUID identifies a user record; it does not authenticate a person or isolate one
browser session from another. Each login must receive a separate server-recognized session with
server-side ownership and revocation checks.

No Phase 2 code or schema change is authorized by this kickoff. First prepare and review the
phase-specific 34-section plan, threat model, API exposure register, and ADR-0001 through ADR-0004.
Keep those decisions in `Proposed` until the owner records acceptance.

## In scope

1. Inventory every current `/api/*` method and path, including data classification, public/private
   intent, authentication, authorization, CORS, rate-limit class, input/output validation, and owner.
2. Define public catalogue policy separately from browser CORS. An `Origin` value is not proof of
   identity; non-browser clients can call public APIs directly.
3. Define durable UUID user identity and distinct unpredictable per-session credentials, with
   expiry, rotation, one-session revocation, all-session revocation, and resource ownership rules.
4. Define a one-time password-reset token: cryptographically random, hashed at rest, atomically
   consumed, and expired 15 minutes after issue. Specify enumeration-safe responses, rate limits,
   delivery, replay handling, link/referrer protections, and session invalidation.
5. Define route-specific abuse limits and trusted-proxy behavior. Do not assume in-process counters
   coordinate across app instances.
6. Review SQL parameterization and dynamic SQL allowlists, output-context XSS handling, CSRF/cookie
   requirements for the selected session transport, error payload minimization, and secret/PII-safe
   logs.
7. Separate customer, merchant, host, rider, operator, and machine-integration authority. A generic
   signed-in state must not grant operator or cross-tenant access.

## Inputs and dependencies

- Current API/auth source and the existing API contracts. Confirm the current implementation rather
  than treating older handoff observations as fresh evidence.
- Full route and data inventory, including `/api/metrics`, `/api/traces`, `/api/telemetry`, health,
  auth, onboarding, and any integration endpoints.
- PostgreSQL schema and migration/rollback conventions. Preserve existing catalogue data.
- Owner decisions for public catalogue access, session storage/transport, mail delivery, session
  invalidation on password reset, rate-limit backing store/proxy trust, and operator authority.
- Follow-up **F-002** (production API/CORS/authz/metrics/rate-limit evidence) is still open and is
  carried into this phase. **F-006** remains open for checkout/“instant records” semantics; take it
  into the P3 order contract rather than deciding it implicitly here.
- P0 source/release reconciliation remains separate and blocked. No production access, deployment,
  Cloudflare edit, or database mutation is part of this P2 kickoff.

## Proposed sub-phases

| Sub-phase | Work | Exit evidence |
|---|---|---|
| `P2.1 API inventory and threat model` | Enumerate routes/principals/data; map trust boundaries and abuse cases; verify existing behavior in an isolated local environment | Complete exposure register; reviewed threat model; baseline tests for anonymous, wrong-user, wrong-role, spoofed-Origin, and over-limit requests |
| `P2.2 identity and reset contracts` | Draft and review ADR-0001 through ADR-0004; specify user/session/reset/rate-limit contracts and migrations | Owner-accepted ADRs; detailed phase plan; migration and rollback design; no unresolved identity decision hidden in code |
| `P2.3 implementation` | Implement only the accepted contracts, with repository and API changes scoped to the phase | Contract tests, tenant/object ownership tests, independent session/revocation tests, reset expiry/replay tests, and endpoint-limit tests pass |
| `P2.4 security verification and acceptance` | Review every affected route and failure mode; test logs/errors and the selected deployment topology | Evidence matrix maps each requirement to behavior, command/test output, acceptance criterion, known limitation, and rollback; owner accepts P2 |

These are planning subdivisions, not permission to begin implementation. The detailed plan must use
the repository's required 34 sections: objective; scope; dependencies; boundaries; existing and new
contracts; entities; database; APIs; commands; events; state machines; capabilities;
authorization; offline/sync; hardware/integrations; UI impact; security; observability; tests and
CI; migrations; rollback; documentation; deliverables; acceptance; failure modes; risks; ADRs; exit
criteria; resolved decisions; and sub-phase breakdown. Write “None.” with a reason wherever a
section does not apply.

## Decisions that remain open

- Whether catalogue data is intentionally public to arbitrary API clients, and which response fields
  are safe to expose.
- Session transport and storage, token format, expiry/rotation rules, revocation scope, and the
  server-side principal/role model.
- Reset email provider and sender/domain readiness; whether successful reset revokes one or all
  existing sessions; exact enumeration-safe response and retry policy.
- Shared rate-limit store, route-specific budgets, identity/IP keys, trusted proxy chain, and
  emergency behavior if the store is unavailable.
- Operator/admin authority and audit trail; machine-to-machine credentials, scopes, and rotation.
- Which cross-origin browser clients need access. CORS must not be presented as API authentication.

The owner must resolve these through the ADR review before dependent implementation. Do not infer
that UUIDs alone prevent session sharing, and do not turn “sanitize every string” into the SQL/XSS
defense: use parameterized SQL and context-aware output handling.

## Acceptance criteria

- Every route has an explicit exposure and authorization decision, with anonymous access limited to
  intentionally public data.
- Two sessions for one account are distinguishable and independently revocable; a user/session ID
  supplied by a client cannot establish identity or ownership.
- Wrong-user, wrong-role, cross-tenant, spoofed-Origin, replay, expired-reset, and over-limit cases
  fail with the approved response and leave no unauthorized state change.
- Reset tokens are single use and expire at the 15-minute boundary; raw tokens and credentials never
  enter application logs or public errors.
- SQL values are parameterized; dynamic SQL structure uses explicit allowlists; output rendering
  preserves framework escaping and does not add unsafe HTML.
- Rate limits remain effective across the accepted deployment topology and emit the specified
  `429`/`Retry-After` behavior.
- Database migrations preserve existing catalogue rows and have a rehearsed rollback on staging.
- All local code, API, architecture, failure-path, and security checks have recorded command output.

## Current handoff

P2 begins with route inventory, threat-model confirmation, and the detailed 34-section plan. The
local release checks recorded in the parent handoff pass, but they do not verify production API
policy or accept P2. Current evidence is historical for production; perform a fresh authorized check
only when the phase plan defines its scope and safe method.
