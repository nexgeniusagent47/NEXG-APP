# Handoff — moved

**This document is out of date. Read [`HANDOFF-2026-09-22.md`](./HANDOFF-2026-09-22.md).**

It is kept only so that links to this filename do not dead-end.

---

## Why this one is stale

Three things changed after it was written, and each invalidates parts of it:

1. **The product was rebranded** from NEXG Concierge to **NEXG App**, and moved to
   `nexgapp.com`.
2. **The deployment model was replaced.** This document describes the managed-database path in
   `docker-compose.prod.yml`. The real deployment runs the base compose file with its own
   Postgres container, on a server that was not yet in use when this was written.
3. **The old application was removed.** It was Vue + Laravel + **MySQL**, at
   `/var/www/apps/projects/nexg/`. It no longer exists there: its compose file, Dockerfile,
   nginx vhost and images are gone, and the backups live only on the human's local machine at
   `C:\Users\limta\Downloads\nexg-old-backups\`.

## Still true from this document

- The catalogue is generated, not authored: **640 merchants, 6000 items** from
  `src/db/seed_excel.sql`. Giving it real authored menu sections remains the highest-value data
  fix outstanding.
- The typeface constraints, and why heading weight is capped at 700.
- Never run `docker compose down -v`; it deletes the catalogue volume.
- Two unrelated Postgres stacks exist on this machine. Ports **5432** and **8080** belong to the
  separate NEXG POS Go platform. Do not touch them.

## Read instead

| Question | Document |
| --- | --- |
| Where everything is, and the traps | [`HANDOFF-2026-09-22.md`](./HANDOFF-2026-09-22.md) |
| How to deploy | [`DEPLOY-STEP-BY-STEP.md`](./DEPLOY-STEP-BY-STEP.md) |
| How the app is built | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Auth, sessions, their limits | [`AUTH.md`](./AUTH.md) |
| Logs, traces, metrics, consent | [`OBSERVABILITY.md`](./OBSERVABILITY.md) |
| Rate limiting, security headers | [`SECURITY.md`](./SECURITY.md) |
| Which animation library where | [`ANIMATION.md`](./ANIMATION.md) |
| API contract | [`API.md`](./API.md) |
