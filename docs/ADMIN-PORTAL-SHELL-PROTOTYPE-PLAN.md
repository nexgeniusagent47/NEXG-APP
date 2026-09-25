# P7A — Admin sign-in shell prototype plan

- **Version:** 1.0
- **Date:** 2026-09-25
- **Status:** `APPROVED FOR STATIC PROTOTYPE IMPLEMENTATION`
- **Parent:** [`MASTER-BUILD-PLAN.md`](MASTER-BUILD-PLAN.md), capability `admin-portal-shell`
- **User direction:** begin admin portal work and follow the plan → find skills → plan → implement → test → push protocol
- **Prototype boundary:** one static sign-in screen; no actual operator access

This plan records the owner's request to start the admin portal early while preserving the parent
plan's identity and release gates. It follows the narrow UI-only exception used for the merchant
portal work: the prototype may establish the access screen's visual direction, but it must not
authenticate, call an API, read or write database data, or present a working operator dashboard.
The functional portal remains in P7, after P2 identity/authorization and guest experience acceptance.

## Skill discovery

- Ran `find-skills` first, as required by the repository. The search found
  `anthropics/skills@frontend-design` (919.9K installs) for dashboard UI.
- Applied the locally available `spec-driven-development` skill to define scope, gates, and
  acceptance before code.
- Applied the locally available `frontend-ui-ux-engineer` skill for the visual and accessibility
  criteria. No additional skill was installed because the local skill covers this prototype.

## 1. Objective

Create a polished, responsive NEXG admin sign-in visual prototype at `?page=admin_login`. It should
make the admin surface feel deliberate and trustworthy while clearly communicating that access is
not connected yet. Success means the screen is easy to reach, keyboard usable, readable on narrow
phones, and honest about its non-functional state.

## 2. Scope

In scope: one sign-in screen with email and password fields, password visibility control, a
non-functional password-help affordance, a submit control that shows an explicit prototype notice,
NEXG identity, responsive layout, and deep-link routing.

Out of scope: authenticated dashboard, user or merchant management, orders, catalog editing,
finance, analytics, moderation, roles, invitations, recovery delivery, and any operator workflow.

## 3. Dependencies

- Existing React 19, Vite, TypeScript, Tailwind v4, and NEXG shared brand assets.
- The owner-supplied `C:\Users\limta\Desktop\NEXG-PLATFORM\assets\NEXG WORD MARK LOGO.svg` is
  the source wordmark artwork; use the repository's cropped, theme-colored light/dark derivatives
  through `LogoIcon` rather than copying the portrait-viewBox source into the app.
- Existing URL query-page routing and theme context.
- The P2 identity/security phase is still in planning. Its accepted session and operator
  authorization contracts are prerequisites for functional access, not for this visual prototype.
- No new package, database, service, or design asset is required.

## 4. Architectural boundaries

- Keep the prototype in the existing single-origin web app and lazy-load its component.
- Keep the developer metrics surface separate; this route is not an alias for `metrics`.
- Do not create a separate PostgreSQL instance. No schema, data, or service boundary is introduced.
- Do not merge the prototype into the public landing-page navigation.

## 5. Existing contracts affected

- Extend the allowlisted `page` query route with `admin_login`.
- Follow the existing theme-aware logo and page-shell conventions.
- No auth, API, onboarding, order, or catalogue contract changes.

## 6. New contracts required

- `?page=admin_login` renders the prototype and survives refresh.
- The form is visual only. Submitting displays a clear “not connected” notice and makes no request.
- Password help displays an equally clear unavailable notice and makes no request.
- The screen never redirects to an authenticated or data-bearing route.

## 7. Entities affected

None. The prototype creates no user, session, role, application, or audit entity.

## 8. Database changes

None. Do not add migrations, seed data, database access, or a separate database instance.

## 9. APIs affected

None. The component must not call authentication, metrics, catalogue, or operator APIs. Verification
must confirm that submitting the form produces no network request.

## 10. Commands affected

Run the repository gates from the project root after implementation:

- `node node_modules/typescript/bin/tsc --noEmit`
- `npm test`
- `npm run test:api`
- `npm run test:flow`
- `npm run test:consistency`
- `npm run build`
- `node scripts/admin-portal-prototype-test.mjs http://127.0.0.1:3002`

Record each command's exact result. If a gate cannot run because its required local service is
unavailable, record that separately from a failure or pass. Do not touch ports 5432 or 8080.

## 11. Events affected

None. Do not emit sign-in, password-help, or admin activity events from the prototype.

## 12. State machines affected

None. Field values exist only in component memory while the page is mounted; there is no session,
submission, approval, or recovery state transition.

## 13. Capability changes

The app gains a public, static admin sign-in screen. It gains no operator capability and grants no
access to protected resources.

## 14. Authorization requirements

There is no authorization in this prototype. UI visibility, a hidden route, or a successful
form interaction must never be described as an access control. Every future admin API must have an
explicit role/scope policy and ownership checks in the P2/P7 contracts.

## 15. Offline behavior

The screen renders without a network connection because it has no remote data dependency. Form
interactions remain local and continue to state that access is not connected.

## 16. Synchronization behavior

None. No browser storage, background synchronization, cache, or retry behavior is added.

## 17. Hardware requirements

None.

## 18. Integration requirements

None. No mail delivery, identity provider, analytics, or external service is connected.

## 19. UI/application impact

- Add a dedicated, lazy-loaded admin sign-in component and a deep-link page value.
- Hide the public global header and footer on this route, consistent with a focused portal entry.
- Keep a single main landmark and label the sign-in region from its heading.
- Use NEXG's existing gold, dark, and light theme tokens and the supplied NEXG wordmark artwork
  through the existing theme-aware logo component. Avoid adding a generic
  dashboard or decorative data cards.
- Support widths from 320 px through desktop, keyboard operation, visible focus, reduced motion,
  and readable contrast.
- Follow the existing app-wide consent behavior. The focused browser test should seed a valid
  returning-user consent choice through the shared test helper; consent flow changes are out of
  scope for this prototype.
- Keep English copy explicit that sign-in and recovery are unavailable in this prototype.

## 20. Security impact

No credentials may leave the browser, appear in logs, enter local/session storage, or be retained
after unmount. No fake success state, demo account, hard-coded password, privileged sample data, or
dashboard preview is allowed. The submit notice must make clear that no sign-in was attempted.

## 21. Observability requirements

None. Do not add admin telemetry or log field values. Existing application health/metrics behavior
is unchanged.

## 22. Testing strategy

- Type-check and production-build the exact candidate.
- Run all six repository gates in §10 and record their outcomes.
- Verify the deep link directly and after refresh.
- Check layout at 320, 360, 640, 1024, and 1440 px; verify no horizontal overflow.
- Seed the existing consent choice with `scripts/test-support.mjs` before testing form interactions.
- Exercise direct and refreshed deep links, email/password fields, password visibility,
  password-help notice, submit notice, keyboard-only navigation, and visible keyboard focus.
- Verify the page makes zero requests on initial render and after either action; verify no admin
  data or authenticated destination is rendered.
- Measure foreground/background contrast for body text, field labels, and the primary action;
  target WCAG AA.

## 23. CI validation

The branch must pass the repository type check, Vitest suite, API/flow/consistency gates, and Vite
production build before it is pushed. A green check is not proof of real authentication; the
prototype acceptance explicitly excludes that capability.

## 24. Migration requirements

None.

## 25. Rollback requirements

Revert the isolated prototype commit or remove its route/component. The change has no persistent
data, schema, secret, or running-service impact. Do not deploy as part of rollback or acceptance.

## 26. Documentation changes

- Keep the master plan's full P7 access gates intact and record only this narrow P7A exception.
- Maintain this phase plan and a dated session record with test evidence and the pushed commit.
- Do not mark the functional admin portal complete or accepted.

## 27. Deliverables

1. This reviewed phase plan.
2. A standalone admin sign-in component and deep-link route.
3. Focused visual and interaction evidence plus full repository gate results.
4. A repeatable focused browser check for route, viewports, keyboard behavior, contrast, and no
   credential/network persistence.
5. A scoped commit pushed to `codex/admin-portal-shell`; no deployment.

## 28. Acceptance criteria

- The route renders only the sign-in prototype and deep-links consistently.
- The document exposes one main landmark and a labelled sign-in region.
- No global public navigation appears on the focused screen.
- Every form control is labelled, keyboard-operable, and has a visible focus state.
- The page works at the defined widths without horizontal scrolling and meets the stated contrast
  target.
- The browser interaction check uses the shared returning-user consent setup and does not alter the
  consent flow.
- Submit and password-help actions give honest unavailable notices and cause no network request.
- No credential is persisted, logged, or sent; no data-bearing screen is reachable from the form.
- The six repository gates have explicit pass/fail/not-run results.
- The change is pushed to the scoped branch only; no production deployment occurs.

## 29. Failure modes

- Unknown `page` value falls back to home: verify the route allowlist and page renderer together.
- A shared shell element leaks public navigation: explicitly classify the route as a portal entry.
- CSS or typography fails at small widths: re-check measured viewport widths and focus states.
- Form behavior accidentally submits or fetches: prevent default submission and verify browser
  network activity.
- Copy implies real access: use a visible prototype notice on every action path.

## 30. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Users mistake the screen for live authentication | Prominent disconnected-state copy; no success path |
| A password field encourages real credential entry | Submit is local-only and explicitly says no request was sent; do not advertise the route |
| Prototype is mistaken for permission to build operator functions | Keep P2/P7 gates and unresolved operator decisions explicit |
| Shared portal edits conflict | Implement in an isolated worktree and commit only this slice |

## 31. Required ADRs

None for a static prototype. Before functional access, resolve the existing identity ADRs and add an
operator authority/audit ADR that defines roles, scopes, sensitive actions, and review history.

## 32. Exit criteria

The visual prototype is ready for owner review when its scoped implementation passes §22 and the
changes are pushed to its dedicated branch. Owner review of the screen does not accept P2, P7, or
production access. Functional admin work requires a separate approved scope and authorization
matrix.

## 33. Resolved decisions and owner review items

### Resolved for this prototype

- The owner asked to start admin portal work on 2026-09-25 and explicitly named the plan/skills/
  implementation/test/push sequence.
- The merchant portal workflow established the narrow early-prototype pattern: record the
  governance exception first; keep real credentials, APIs, data, and workflows gated.
- This plan applies that pattern only to a static admin sign-in visual prototype.

### Decisions required before functional admin work

- Which operator jobs are in the first usable release: partner approvals, users, orders, catalogue,
  finance, support, reporting, or other capabilities.
- Operator roles, least-privilege scopes, step-up/MFA requirements, and audit retention.
- Which records each role may see or change and the approval/reversal rules for sensitive actions.
- Identity/session transport, reset delivery, trusted device policy, and operator account recovery.
- Whether a separate hostname is needed and what operational controls apply at release.

## 34. Sub-phase breakdown

| Sub-phase | Work | Gate |
|---|---|---|
| `P7A.0 Plan review` | Owner approved starting this scoped prototype in the current session | Plan and master-governance exception recorded before implementation |
| `P7A.1 Sign-in prototype` | Add the static screen and deep-link route in an isolated branch | No auth/API/data behavior; no more than the scoped route/component plus focused tests |
| `P7A.2 Verify` | Run all repo gates and the viewport, keyboard, contrast, and no-network checks | Record each exact outcome; investigate failures before push |
| `P7A.3 Push for visual review` | Commit with the repository's substantive-message convention and push the isolated branch | No deployment; functional access remains gated |
