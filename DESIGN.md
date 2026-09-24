# Design

<!-- impeccable:design-schema 1 -->

Recorded from the incumbent implementation, not invented. Sources: `src/index.css`,
the token usage across `src/components/discovery`, `src/components/merchant` and
`src/components/forms`, and rendered captures. Where a value is a de-facto token
rather than a declared one, it is marked as such.

## Platform

web

## Mode

Operate. A visitor is completing a task — browse, evaluate, configure, order — not
being persuaded and not reading. Brand expression lives in precise details; the
interface should disappear into the task.

## Identity lock

> A nocturnal near-black surface (`#111315` page, `#181A1F` card, `#141618` sheet)
> carrying a single gold accent (`#E5B65F` on dark, `#B88728` as fill, `#8A6413`
> for gold *text* on light), Quicksand headings at supported weights, Inter for
> body copy, Cooper* as a warm accent, Adventor for the wordmark, and tabular numerals
> for prices. Surfaces use elliptical x/y radii while pill controls remain fully round,
> with hairline
> `border-white/10` separation, photographs as the only large colour field, and a
> plain, factual voice that states what a merchant does rather than selling it.

## Color

Two themes, both first-class. `ThemeContext` drives `isLight`; **there is no
`dark:` variant strategy** — components branch on `isLight` and pass explicit
classes. Follow that convention rather than introducing `dark:`.

| Role | Dark | Light | Notes |
| --- | --- | --- | --- |
| Page | `#111315` | `#f7f8fa` | |
| Card / panel | `#181A1F` | `#ffffff` | |
| Sheet / overlay panel | `#141618` | `#ffffff` | |
| Header (scrolled) | `#0c0e12` @ 92–94% | `#ffffff` @ 88–94% | translucent |
| Accent, fill | `#E5B65F` | `#B88728` | buttons, active chips |
| Accent, hover | `#d6a54d` | `#9e721d` | |
| **Accent as text** | `#E5B65F` (9.92:1) | **`#8A6413`** (5.37:1) | never `#B88728` for text on light — it is 3.21:1 |
| Primary text | `#f2f2f2` | `#1a1d20` | |
| Secondary text | `gray-400` `#9ca3af` (6.86:1) | `slate-600` `#475569` (7.13:1) | |
| Inverse on accent | `#0c0e12` / `slate-950` | `#ffffff` | |

**Rules.**

- One accent, used for primary actions, current selection and state indicators.
  Never decoration.
- Never `gray-500` (`#6b7280`) for text: 3.60:1 on card, 3.85:1 on page — both fail
  AA. `gray-400` is the dark-mode floor.
- On light, gold is a **fill** colour. Text that must read as gold uses `#8A6413`.
- Semantic colour is separate from the accent: amber for ratings, rose for errors,
  emerald for success. These are the only other hues in the system.

**Browser surfaces** carry the palette deliberately and are set in `index.css`:
`::selection` is gold on near-black, `caret-color` is `#B88728`, and
`:focus-visible` is a 2px `#B88728` outline at 2px offset. These are drawn by the
browser, so they are the cheapest signal that the page was built rather than
assembled.

## Typography

`src/index.css` is the source of truth for four type roles:

| Role | Face and use |
| --- | --- |
| Headings | Local Quicksand; the homepage and onboarding hierarchy use real weights through 700. |
| Body and controls | Inter, with system sans-serif fallbacks. |
| Wordmark/display | TeX Gyre Adventor. |
| Warm accent | Local Cooper* family. |
| Smoothing | Antialiased on `body`. |
| Weight ceiling | Quicksand stops at 700; do not request a heavier synthetic weight. |
| Numerals | Tabular numerals for prices, counts, and metrics. |
| Measure | Keep long-form prose to a readable line length. |

The home page's heading face is now shared by all three onboarding forms. The heading rule is
centralized on `.onboarding-theme`, so form titles, step headings, and review headings stay
consistent when a new step is added.

**Do not write class names as inline code in this file.** Tailwind v4 scans Markdown too and
emits a utility for every class-shaped token it finds, so quoting one here ships a dead CSS
rule. That is why the utilities above are described by role rather than quoted by name.

## Radius

`src/index.css` defines the app-wide radius scale as horizontal/vertical pairs. This creates
subtle elliptical corners on cards, panels, sheets, and controls; fully round pill controls
remain unchanged. The x/y pairs live in one `@theme` block and can be reverted there. A short
set of directional sheet/input rules preserves the intended open edge when a surface attaches
to the viewport or a neighboring control.

Keep nested corners visually concentric: the inner element should use a smaller x/y pair than
its containing surface, with enough padding to preserve a visible gap.

## Depth and surface treatment

- **Hairlines over shadows at rest.** Separation is `border-white/10` on dark,
  `border-slate-200` on light. This is the dominant treatment.
- Shadows appear only on ascending states: `hover:shadow-lg`/`xl` on a card,
  `shadow-2xl` on a sheet or modal. Never on the page surface itself.
- No glassmorphism as decoration. `backdrop-blur` is reserved for the two sticky
  headers and the modal scrim, where it does real work.
- No gradient text, no coloured left/right borders, no hard offset shadows, no
  icon-in-a-tile scaffolds. These are refusals, and they are deliberate.
- Photographs are the only large areas of colour in the interface.

## Motion

One authored moment per surface; everything else is a state transition.

| Context | Duration | Easing |
| --- | --- | --- |
| Colour, border, background state | 150 ms | `ease-out` |
| Transform: card lift, arrow nudge | 200–300 ms | `ease-out` |
| Sheets and modals | 400 ms spring, `bounce: 0.08` | Motion spring |
| Scrim fade | 180 ms | linear opacity |

- `useReducedMotion()` is honoured on both overlays and on the offerings scroll;
  motion collapses to instant rather than to a shorter animation.
- `AnimatePresence` uses `initial={false}` where a first-render animation would be
  noise rather than signal.
- Only `transform`, `opacity` and `filter` are animated.

## Components

Every interactive control ships **default, hover, focus-visible, active, disabled,
loading, error, empty**. `:active` uses `scale-[0.96]`–`scale-[0.99]`.

The control vocabulary is fixed by `src/components/forms/DynamicField.tsx`, which
renders all seven requirement kinds — `text`, `number`, `textarea`, `select`,
`toggle`, `radio`, `multicheck`. **New controls extend that file rather than
introducing another input style.** Grouped controls (`radio`, `multicheck`) carry
`aria-labelledby` pointing at a label element that owns a real `id`; labelable
controls use `htmlFor`.

Overlays use `src/hooks/useModalBehavior.ts`, which owns Escape, background scroll
lock, initial focus and focus restore. Any new overlay uses it.

## Voice

Plain, factual, specific. It states what a thing is and what happens next.

- Controls name their action: "Add to order", "Request booking", "See all
  offerings". A button must never carry a navigation verb on a commit action, or
  the reverse.
- Errors name the problem and the recovery: "Enter a number greater than zero for
  'Minimum Order'", "2 details still need your attention."
- Workflow is described in the product's own terms and shown before commitment:
  `Browse items → Choose options → Eligibility check → Add to cart → Pay →
  Dispatch → Delivered`.
- No marketing adjectives on operational surfaces. No exclamation marks.
- Prices are `KSh 7,325` with a thin space via `toLocaleString()`.

## Refusals

Recorded so they are not reintroduced:

- a kicker or eyebrow label above a heading
- nested cards, or a card inside a sheet
- metric cards where a line of text would do
- pill chips floating on photographs
- custom scrollbars on a browse surface
- `Add to cart` as a universal action across verticals that do not have a cart
- image-generator prompts in customer-facing copy
