# NEXG App follow-up register

Track deferred work here until it is closed with command/result evidence or the owner explicitly
re-parks it. Items below are new from the master-plan review and are not claimed complete.

| ID | Item | Source | Parked at | Closer / exit evidence | Status |
|---|---|---|---|---|---|
| F-001 | Configure a release source and reconcile the dirty working tree before shipping the Postgres-only patch | 2026-09-24 session | P0 | Owner confirms remote or documented direct path; approved change set passes release gates and post-deploy checks | OPEN |
| F-002 | Revalidate production API exposure, CORS, authz, metrics/traces, and rate-limit behavior | Security runbook / master plan | P2 | Route inventory and controlled allow/deny evidence; production checks authorized and documented | OPEN |
| F-003 | Capture complete host/merchant/rider form-field and consent inventory | Owner requirement | P4 | Field-by-field mapping proves no requirement was lost in the adaptive form | OPEN |
| F-004 | Gather TempVault approved name, product specifications, and patent/trademark evidence | Owner requirement | P5 | Owner-approved source evidence and legal-approved public copy | OPEN |
| F-005 | Obtain approved mascot assets/brief for the error-state family | Owner requirement | P3 | Asset and usage guidance provided; keyboard/screen-reader treatment accepted | OPEN |
| F-006 | Clarify “instant records” and checkout/payment/order state requirements | Owner requirement | P2/P7 | Owner-approved transaction and release semantics in a phase spec/ADR | OPEN |

## Phase 2 planning triage — 2026-09-24

- **F-002 remains OPEN and is carried into P2.** Its exposure/authentication questions are still
  material; this session ran no production checks and closes no security finding.
- **F-006 remains OPEN.** The master plan still lists “instant records” and checkout/payment state
  as unresolved. Carry the owner decision into the P3 order contract and P7 portal boundaries; do
  not invent transaction semantics as part of P2 identity work.
- **F-001 remains OPEN at P0.** This pass confirmed there is no configured Git remote, a broad
  uncommitted worktree, and a mismatch between the documented server pull directory and the server
  project path recorded in the current handoff.
