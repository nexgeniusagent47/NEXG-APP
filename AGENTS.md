# AGENTS.md — NEXG App

Durable instructions for any agent working in this repository. Read this before acting.

**Start with [`docs/HANDOFF-2026-09-22.md`](docs/HANDOFF-2026-09-22.md).** It carries the
current state, the live server, six traps that have already cost real time, and the open
work in priority order. `docs/HANDOFF.md` is a redirect stub — the older handoffs describe
the pre-rebrand state and a deployment model that no longer exists.

The product was rebranded from **NEXG Concierge** to **NEXG App**. Only the lowercase common
noun "concierge" survives, deliberately, in copy like "swift concierge delivery".

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

Quicksand's `wght` axis stops at **700**. A request for 900 renders **synthetic** bold:
smeared counters and an uneven stroke, which reads lighter rather than heavier. When asked
to go "bolder", buy weight optically — scale, leading, ink — or propose a different
typeface. Do not raise the weight number.

Measured, and now fixed: the source asked for the 900-weight utility in **149 places
across 31 files**, against a face declaring `font-weight: 300 700`. At 40px a probe string
painted 637.69px at 700, 800 and 900 alike, while 400 painted 616.67px — 800 and 900
identical to 700 is the signature of a synthetic step. All 149 were changed to the
700-weight utility, which is visually identical and stops the dilation.

**Cooper ships a real 800 and 900**, so the 83 uses of the 800-weight utility on Cooper
elements are correct and were left alone. Only Quicksand and Inter-below-a-heading matter
here. To re-check after a typeface change:

```bash
node scripts/_diag-synthetic-weights.mjs /
```

It compares painted widths per family and lists every element asking for a weight its
family cannot supply.

**One consequence worth knowing:** Tailwind v4 emits a utility for every class-shaped token
in every file it scans — including this Markdown. Spelling a utility name in prose ships a
rule nothing uses. That is why the weight utilities above are described by their number
rather than quoted by name: writing one out here generated a dead CSS rule in the production
bundle even though no component used it. Verified with a control — an invented class-shaped
token in a comment was NOT emitted, so the cause is real occurrences in scanned files
(Markdown included), not comments.

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
- **`skip-worktree` hides a change from `git status` AND from `git archive`.** `index.html`
  carried the `S` flag, so a rebrand edit lived only in the working copy and **every deploy
  shipped stale HTML while all gates stayed green**. If a deploy serves the wrong content
  but the source looks correct, run `git ls-files -v <file>` first. Do not re-add the flag.
- **PowerShell's `>` re-encodes binary as UTF-16.** Streaming a tar through `pwsh >` produced
  `FF FE 1F 00` instead of `1F 8B 08` and inflated 63 MB to 120 MB. Use `cmd /c "... > file"`.
  Its `-m` also dies on em-dashes, arrows and nested quotes — **write commit messages to a
  file and use `git commit -F`.**
- **Node 24 runs `server/*.ts` in STRIP-ONLY mode.** Constructor parameter properties,
  `enum`, `namespace` and decorators throw at import time and **kill the process**, while
  `tsc --noEmit` passes happily. After any `server/` change, actually boot it.
- **Canvas returns opaque black for `oklch()`.** Two colour probes gave confidently wrong
  results this way. Read raw computed values instead of painting to a canvas.

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
