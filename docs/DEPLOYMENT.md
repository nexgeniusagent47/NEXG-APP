# Managed-database deployment draft — retired

This was a separate deployment option that assumes PostgreSQL is managed outside
Docker. It does not match the current live-server notes, which describe an app and its
PostgreSQL database in the same Compose stack. Its commands and environment examples
are no longer maintained and must not be used to release this repository.

Use [deployment runbook status](DEPLOY-STEP-BY-STEP.md) for the current blocker and
[release readiness](RELEASE-READINESS.md) for the evidence required before deployment.
The managed-database model can be documented again if the owner adopts that topology.
