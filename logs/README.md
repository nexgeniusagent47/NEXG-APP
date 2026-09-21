# logs/

Structured run logs for NEXG Concierge v1.

This directory is the durable audit trail the build process writes to. Every
phase (plan, build, test, handoff) appends a dated entry so a future session can
reconstruct exactly what was run, what broke, and what changed.

## Convention

```
logs/YYYY-MM-DD-<phase>.log
```

| Phase        | Written by                        | Contains                                                    |
| ------------ | --------------------------------- | ----------------------------------------------------------- |
| `build`      | dependency + database provisioning | installs, container setup, schema/seed application           |
| `test`       | verification runs                  | typecheck, unit tests, API contract checks, screenshot runs   |
| `session`    | the agent, at handoff              | decisions, blockers, approval escalations, follow-ups        |

## Rules

- Logs are append-only. Never edit history to make an earlier run look clean.
- Record the exact command, the exit code, and the observed output — including
  failures. A log that only contains successes is not useful for debugging.
- External constraints (sandbox denials, missing tooling, unreachable services)
  belong in the log, not only in chat, because chat scrolls away.
- Screenshots referenced by a test log live in `logs/screenshots/`.

## Current state

`v1` is under construction. See `/docs/` for the plan, architecture and handoff.
