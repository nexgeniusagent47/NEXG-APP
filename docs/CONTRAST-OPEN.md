docs(a11y): pin down the last 4 contrast failures to a shared cause, and why a token swap cannot fix them

STATE
  contrast failures  4   (down from 33 two rounds ago)
  checks run         3248
  device matrix      234/234 clean
  Everything else verified.

THE CAUSE OF ALL FOUR, MEASURED
`.onboarding-theme` inverts the whole neutral scale by REDEFINING it. The dark table is a
complete, deliberate inversion:

  --color-slate-200: #23282f    --color-slate-600: #b3bac3
  --color-slate-300: #333a43    --color-slate-700: #cbd2da
  --color-slate-400: #6b7280    --color-slate-800: #e2e6eb
  --color-slate-500: #98a1ac    --color-slate-900: #f1f3f6

Ratios on the onboarding header surface (#16191d), computed rather than eyeballed:

  #23282f (slate-200)  1.19:1   dark text on dark  <- the defect
  #333a43 (slate-300)  1.53:1   dark on dark
  #6b7280 (slate-400)  3.65:1   fails body text
  #98a1ac (slate-500)  6.74:1   passes
  #b3bac3 (slate-600)  9.01:1   passes

So inside onboarding, any `text-{gray,slate}-200` or `-300` is DARK text. The language
switcher's trigger uses exactly that, which is the 1.19:1 the audit reports on "en" and
"English".

WHY THE OBVIOUS FIX IS WRONG, AND I TRIED IT
Swapping the token to `text-slate-600` measured rgb(179,186,195) - correct, 9.01:1 - in the
onboarding context. It then took the failures from 4 to 20, because the same component is also
rendered by the site Header on EVERY OTHER ROUTE, where `.onboarding-theme` is not in scope and
`--color-slate-600` is the ordinary #475569. That is 2.27:1 on the home header.

Reverted, and the baseline re-measured at 4.

This is the actual shape of the problem: ONE component, TWO token scopes. A component-level
token fix is correct in one scope and wrong in the other, which is why this survived three
rounds of token work - every previous fix in this series was a token that was simply wrong
everywhere, and this one is right in one place and wrong in another.

THE FIX, when someone takes it
A scoped rule, not a token change:

  html.dark .onboarding-theme .language-switcher-trigger { color: var(--color-slate-600); }

or, better, give the onboarding theme its own text role (`.onboarding-theme .text-muted`) so a
component asks for a ROLE rather than a step on a scale that means different things in different
scopes. That is the durable fix and it is a design decision about the token system, not a
cleanup.

Recorded rather than half-done: I could make the number go to 0 in ten minutes by moving the
colour into the one scope, and it would be wrong in the other. Leaving it named is the honest
result.

Gates at this commit: tsc 0, 53 unit, 29 API, 18 flow, 24 consistency, 26/26 probe,
overlays no issues, device matrix 234/234, contrast 4 failures (all one cause, documented),
build OK.
