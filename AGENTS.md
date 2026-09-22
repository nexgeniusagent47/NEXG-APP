# AGENTS.md — NEXG Concierge

Durable instructions for any agent working in this repository. Read this before acting.

---

## 1. Skill discovery comes first

**Before choosing how to approach any non-trivial or ambiguous request, run the
`find-skills` skill.** The user set this as a standing instruction and it was not honoured
because it lived only in conversation history, which does not survive a session.

Do this:

1. Load `find-skills` and let it search for a skill matching the request.
2. Only then decide whether to use a skill, a mixture, or none.

Do **not** reach past it by guessing at a skill name, or by searching the filesystem for
one. There are **312 skills installed globally** in `~/.agents/skills`; a handful that
happen to be in context is not the catalogue.

### Two things worth knowing about the skill catalogue

- **312 directories on disk, all with a `SKILL.md`, so all are loadable.**
- **Only 91 are recorded in `~/.agents/.skill-lock.json`.** The other 221 were copied in
  rather than installed through the CLI, so `npx skills update` will not touch them — and
  will not tell you that. If a skill needs updating, check the lock file first.

---

## 2. Impeccable live mode — the contract

The user drives design changes through Impeccable's live mode, element by element. It is
their preferred way to "micro-manage and send bit-by-bit changes".

### The poll loop must be running BEFORE they act

An event sent while nothing polls `/poll` is queued and the browser shows a dimmed amber
mark. This has already cost the user several requests, including one they believed had
been delivered. Check first:

```bash
"$USERPROFILE/.agents/skills/impeccable/scripts/impeccable.cmd" live-status
```

`agentPolling: true` and `connectedClients: 1` are the two values that must both hold.
`connectedClients: 0` means their tab is not attached and **they must refresh the page**.

### `live-poll` blocks; do not break it with a pipe

It blocks for 600s by default and exits after one event. **Piping or wrapping it destroys
that**, and the symptom is a session that dies on the first event. For incremental
delivery use `--stream`, which prints one JSON line per event. Read a background job's
output incrementally rather than waiting for the job to settle.

### Deliver variants in ONE atomic write

The helper's own `_instructions` say this, and it is the single most common cause of
`0/N` failures: write the wrapper **and** all variants in a single edit. Two separate
writes reload the framework mid-publish and strand the browser with no variants.

On JSX targets the wrapper is `display: contents`, the `<style>` body must be a template
literal (CSS braces otherwise parse as JSX), and scoped rules must use a descendant
combinator — a bare `:scope` styles the shell, not the element.

### A visual state that lives only in live mode is not saved

**This has already caused a regression.** The hero's rotating subtitle existed only inside
a variant wrapper. Processing a `discard` removed the wrapper and deleted the visible
line, because there was no plain copy underneath.

Anything that must survive belongs in real source. After an **accept**, the carbonize step
exists to make that true — do not skip it, and always check for leftover
`data-impeccable-*` attributes and `impeccable-*-start/end` markers afterwards.

### Weight has a ceiling

Quicksand's `wght` axis stops at **700**, and headings are already there. `font-black`
(900) renders **synthetic** bold: smeared counters and an uneven stroke, which reads
lighter rather than heavier. When asked to go "bolder", buy weight optically — scale,
leading, ink — or propose a different typeface. Do not raise the weight number.

---

## 3. Deployment

Full sequence in `docs/DEPLOY-STEP-BY-STEP.md`. Three facts that cause silent failure:

- **`AUTH_SECRET` is required** (≥32 chars) or the container crash-loops. It is enforced
  at compose level so a missing value stops the deploy rather than looping.
- **Use the base `docker-compose.yml`, not `docker-compose.prod.yml`.** The override
  assumes a managed database and deletes the postgres service; the target server runs its
  own database container.
- **Never put `DATABASE_URL` in the server `.env`.** `127.0.0.1` inside the app container
  is the container itself, so the app silently serves the bundled JSON catalogue while
  reporting healthy. The compose service name is the correct hostname.

---

## 4. Local environment facts that cost real time

- **The API must be restarted after any `server/` change.** A stale process on 3001
  answered `/api/health` while 404-ing `/api/version` and `/api/metrics`, which made the
  metrics dashboard look broken when it was correct.
- **A file added to `public/` is not served until the dev server restarts.** Vite indexes
  that directory at startup; the new path returns the SPA fallback with status **200**, so
  it looks like success. This has broken fonts twice.
- **PowerShell 5.1 only.** `Set-Content`/`Out-File` are not UTF-8 — write through Node or
  `File.WriteAllText`. `<` redirection is unsupported. Its console renders valid UTF-8 as
  mojibake, so verify encoding at byte level rather than trusting the terminal.
- **Tailwind v4 does not generate opacity modifiers for custom theme colours.**
  `bg-gold/12` compiles to nothing, silently. Verify theme utilities by grepping the
  **built** CSS in `dist/assets/`, not the source.
- **Two unrelated Postgres stacks run on this machine.** This project's is on **5433**;
  ports 5432 and 8080 belong to the separate NEXG POS Go platform. Do not touch them.

---

## 5. Verification standard

The user has been burned by instruments that lie, so:

- **A clean scan is not evidence unless a known-bad input fails in the same run.** The
  Impeccable detector once timed out on every URL scan, exited 0, and printed `[]` — a
  failed scan was byte-identical to a clean one. Always run a control.
- **A green gate is not evidence of working software.** Installing `@types/react` exposed
  **19 live defects**, including add-to-cart being dead on five pages, while `tsc` reported
  a clean build throughout.
- Gates: `npx tsc --noEmit`, `npm test`, `npm run test:api`, `npm run test:flow`,
  `npm run test:consistency`, `npm run build`.
