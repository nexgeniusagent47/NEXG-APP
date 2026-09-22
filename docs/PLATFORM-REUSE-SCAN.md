# What the NEXG platform already has that this site needs

**Scope:** a read-only scan of `C:\Users\limta\Desktop\NEXG-PLATFORM` — the first-party
platform monorepo (`nexg-consumer` in Expo/React Native, plus seven sibling apps,
`packages/shared` and `vendor/`) — for components, workflows and rules that this web app
should be using rather than reinventing.

**Status of everything below: proposal, not applied.** Nothing in this document has been
copied into this repo. Each item states what it would replace here and what it costs.

## How to read the source column

`nexg-consumer/theme/tokens.ts` and most of `utils/` open with
`// AUTO-SYNCED from packages/shared`. **`packages/shared` is the source of truth.** Do not
copy from the auto-synced file into this repo and then edit it here — that creates a third
copy that no sync will ever update. If a token or helper is worth using, read it from
`packages/shared` and record the provenance.

---

## 1. The one thing that is a decision, not a task

**The two codebases disagree about the brand accent, the neutral ramp and the typeface.**

| | This site (`nexg-concierge`) | The platform (`nexg-consumer`) |
| --- | --- | --- |
| Accent | Gold `#E5B65F` dark / `#B88728` fill / `#8A6413` text on light | Emerald `#2BD99F` dark / `#00A26B` light |
| Page, dark | `#111315` | `#0D0D10` |
| Card, dark | `#181A1F` | `#16161A` |
| Headings | Quicksand (local variable, `300 700`) | Nunito `700`/`900` |
| Accent's role | One gold accent, primary actions and selection | One emerald accent, same roles |

The *structure* is the same: one accent, a neutral ramp, semantic status colours, radius by
role. The *values* are different. Both are internally consistent and documented, so this is
not a bug in either — it is two brands, and which one a public site wears is a business
decision that should be made on purpose. **Do not converge them as a cleanup.** See §6 for
the smaller items in this area that are unambiguous.

---

## 2. Design tokens — the highest-value adoption

`packages/shared` → `theme/tokens.ts` defines a complete semantic token set that this app
currently expresses as literal hex values inside JSX. The platform's set:

- `background` primary/secondary/elevated
- `surface` primary/secondary/inverse
- `text` primary/secondary/muted/inverse/onAction
- `border` subtle/strong
- `action` primary/primaryPressed/secondary/ghost
- `accent` primary/soft
- `status` success/warning/error/info/neutral, each with a `Soft` companion
- `overlay`
- `spacing` xs 4 → xxxl 48
- `radii` small 10 / medium 14 / large 20 / sheet 24 / pill
- `typeScale` display/title/heading/body/label/caption/numeric, each with a line height

**Why it matters here:** this app's `DESIGN.md` already documents a token system, but the
values live as literals across ~90 components — `bg-[#181A1F]`, `text-[#E5B65F]`,
`border-white/10`. That is why `DESIGN.md` has already drifted: it records the *intended*
palette while 94 headings were asking for font-weight 900 against a font that stops at
700 (see §6).

**Proposed:** mirror the platform's *names* into `src/index.css` as CSS custom properties
under `@theme`, and add a Tailwind v4 theme block so `bg-surface`, `text-muted`,
`border-subtle` exist. Then migrate components mechanically, one surface at a time.

**Cost:** the token layer is an afternoon. The migration is the real work and must be
incremental — the `?page=metrics`-style deep links and the device room both make it
verifiable per screen.

**Trap, already hit in this repo:** Tailwind v4 does not generate opacity modifiers for
custom theme colours. `bg-gold/12` compiles to nothing, silently. Verify every new utility
by grepping the **built** CSS in `dist/assets/`, not the source.

---

## 3. Components — what the platform has that this site hand-rolls

`nexg-consumer/components/ui/index.ts` exports **40 components**, listed by the barrel file.
The ones with a direct counterpart here:

| Platform component | Replaces / relates to | Note |
| --- | --- | --- |
| `NexGStates` (`NexGEmptyState`, `NexGErrorState`) | ad-hoc empty and error markup | This app's `DESIGN.md` requires empty/loading/error on every control; the platform has the primitives already |
| `NexGSkeleton` + 12 named skeletons | `RouteFallback.tsx`, per-card skeletons | Named per shape (merchant row, product card, item detail) — matches the "skeletal loaders matching the final layout's shape" rule |
| `NexGToast` + provider | no toast system here | |
| `NexGConfirm` | ad-hoc confirm dialogs | Pairs with the escalation rule about destructive actions needing confirmation |
| `NexGBottomSheet` | `CartDrawer`, `MerchantPreviewSheet`, `UnifiedItemModal` | The four overlays here each re-implement sheet behaviour; `useModalBehavior.ts` is the shared piece already |
| `NexGCarousel` + indicators/arrows | `ui/product-carousel.tsx`, `ui/offer-carousel.tsx` | **See §6 — this app's two carousels were missing an accessibility fix that the platform's shape implies** |
| `NexGPrice` | `KSh {n.toLocaleString()}` inline in many places | One place to enforce `tabular-nums`, which `DESIGN.md` requires on every price |
| `NexGRating`, `NexGBadge`, `NexGChip` | inline equivalents | |
| `NexGInput`, `NexGOTPInput`, `NexGPicker`, `NexGDatePicker`, `NexGSwitch`, `NexGCheckbox`, `NexGRadio`, `NexGQuantitySelector` | `forms/DynamicField.tsx` (the seven requirement kinds) | **`DESIGN.md` freezes the control vocabulary in `DynamicField.tsx`** — extend that file, do not add a second input style |
| `NexGMedia`, `NexGMediaPicker` | `ResponsiveImage.tsx` | |
| `NexGCard` family | `nexg/NexGEntityCard`, `nexg/MerchantCard` | |
| `NexGTable` | `NexGCategoryDrilldown` tables | |
| `NexGAuthGate` | no equivalent | |
| `NexGErrorBoundary` | no equivalent here | Worth adopting on its own merits |

**None of this is copy-pasteable.** These are React Native components; this is React DOM.
What transfers is the *decomposition* and the *prop shape*, not the code. Treat the list as
a specification for what this app's component layer is missing, not as a source of files.

### On `vendor/`

`NEXG-PLATFORM/vendor/` holds 18 third-party checkouts (`ahmedbna-ui`, `panelui`, `kibo`,
`legend-list`, `boneyard`, `expo-skills`, a Wolt React Native clone, and others). They are
React Native / Expo ecosystem references. **Nothing in them is directly applicable to this
React DOM app**, and the two multi-megabyte Expo repos would be a maintenance liability if
vendored here. Their value is as reading material for RN work on `nexg-consumer` itself.

---

## 4. Utilities worth taking as behaviour, not code

| Platform source | Behaviour | This app today |
| --- | --- | --- |
| `utils/money.ts` | `KSh ${Math.round(amount).toLocaleString('en-KE')}`, plus a `compact` mode (`KSh 8.5k`) and a documented delivery-fee formula (KSh 150 within 3 km, +60/km) | Prices formatted inline; **no compact mode**, and no single fee formula |
| `utils/dates.ts` | `greetingForHour`, `timeOfDayForHour`, `formatDayLabel` (returns `Today` / `Tomorrow` / weekday), `formatTime` | No equivalent |
| `utils/images.ts` | `mediaFromKey`: `media://key` placeholders render a designed emoji tile until real media lands | `ResponsiveImage.tsx` has no placeholder contract — relevant because several catalogue images are unreachable and currently render as nothing |

`money.ts` is the strongest candidate: it is small, it encodes a real business rule (the fee
formula), and applying it would remove duplicated arithmetic. Note the platform's own header
says it is synced from `packages/shared`.

---

## 5. The anti-slop lint rules — portable, and the most interesting find

`nexg-consumer/tools/oxlint/anti-slop/` is a **local Oxlint plugin, 20 files, written for
this project.** The generic rules are language-level and not React-Native-specific:

`no-chained-type-assertions`, `no-conditional-empty-object-spread`,
`no-known-value-widening`, `no-module-mocking`, `no-object-parameters`,
`no-reflect-apply`, `no-reflect-get`, `no-runtime-typeof`, `no-shape-in-symbol-names`,
`no-unknown-parameters`, `no-unknown-returns`, `no-unknown-type-aliases`,
`no-unsafe-dictionary-type`, `no-widen-then-assert`, `require-safety-comment-for-type-assertion`

(`settings.json`, `shared/dictionary-types.ts` (459 lines) and
`shared/lexical-type-parameters.ts` support them.)

**Why this matters more than it looks.** This repo's handoff records that installing
`@types/react` exposed **19 live defects, including add-to-cart being dead on five pages,
while `tsc` reported a clean build throughout.** `no-widen-then-assert`,
`no-unsafe-dictionary-type` and `no-runtime-typeof` target exactly the class of code that
makes a type checker confident and the program wrong.

**Proposed:** the rules are plain TypeScript and do not import React Native. Copy the
`rules/` directory and `shared/` into this repo, wire Oxlint, and read the first run as a
survey rather than a gate. The `install-anti-slop` skill in this session's catalogue covers
installing these plugins — it is distinct from `design-taste-frontend`, which is the
*visual* anti-slop skill and is about layout, not types.

---

## 6. Two things this scan found in THIS repo, which are not proposals

Both were verified by measurement, both are already fixed, and both are recorded here
because the *class* of mistake will recur.

### 6.1 Every heading was rendering synthetic bold

`src/index.css` declares Quicksand as `font-weight: 300 700`. The source asked for
the 900-weight utility in **149 places across 31 files**. A request above a declared range does
not fail and does not warn — the browser sets the 700 outlines and **dilates them**.

Measured, same string at 48px: `700 → 595.69px`, `800 → 595.69px`, `900 → 595.69px`. 800 and
900 painting *identically* to 700 is the signature: there is no heavier master, so the extra
weight is synthetic. It reads muddier, not bolder, and it closes the counters.

Fixed by removing that utility entirely. **The trap is general:** a `@font-face` weight
range is a silent ceiling, and nothing in `tsc`, the linter, or a screenshot will tell you
you have crossed it. Check the declared range before asking for a weight.

### 6.2 The two carousels disagreed with each other

`offer-carousel.tsx` dropped a fixed `h-10` from its title and documented **why**: at 360px
a long title needed 77px against a 40px box, so two thirds of it was cut off mid-word. The
same fix was **never carried across to `product-carousel.tsx`**, which still pinned its
title to `h-10` and clipped the same way. Measured on the home page at 360px, the clipped
count was **19–20 elements**; after the fix it is **0**.

The pagination dots in both carousels measured **8×8px** — below the WCAG 2.2 2.5.8 minimum
of 24px for a target. Fixed with `min-h-6 min-w-6 p-2 bg-clip-content`, which grows the
target to 24×24 while the painted pill keeps its size. **A fixed `h-2` wins over padding**,
so the first attempt left the target 16px tall; `min-h` is what works.

**The lesson is the one worth keeping:** a fix applied to one of two sibling components is
not a fix. Both carousels render on the same page.

---

## 7. Suggested order

1. **Decide §1** — which brand the public site wears. Everything visual is blocked on it.
2. **Token layer from §2** (namespaced, additive, no visual change on its own).
3. **§6-style sweep** — one instrument, run across every route, for the classes of defect
   that a type checker and a screenshot both miss. The device room is that instrument.
4. **Lint rules from §5** as a survey.
5. **`money.ts` behaviour from §4.**
6. **Component gaps from §3**, one at a time, verified per screen.
