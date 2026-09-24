# Partner earnings estimator update

- **Date:** 2026-09-24
- **Scope:** Existing courier and property earnings estimate cards only.
- **Status:** Source updated locally; not released.

## Owner-provided commercial assumptions

- Courier calculation rate: **KES 95 per kilometre**.
- Courier rate changes: riders receive **at least 48 hours' notice**.
- Property-owner share: **18% of all order markup**.
- Property share changes: property owners receive **at least 14 days' notice**.

## Implementation notes

- Added `src/data/partnerEconomics.ts` as the shared source for these displayed assumptions,
  localization strings, and KES formatting.
- Courier estimate is delivery count per day × adjustable average kilometres per delivery × KES
  95/km, plus the optional average tip input. Weekly and monthly projections use 5 and 22 active
  days respectively.
- Property estimate calculates estimated monthly orders from rooms, occupancy, and an assumed
  three-night stay (one order per estimated stay); it multiplies those orders by the adjustable
  average markup per order, then applies 18% to that markup total. This is an illustrative model,
  not a projection from production data.
- Both estimate cards render their labels, notices, and currency in the selected English, Chinese,
  Kiswahili, or Arabic locale. This small area does not complete site-wide translation or RTL review.

## Verification and release

- No typecheck, automated tests, build, browser review, commit, push, or deploy was run for this
  edit.
- Before public release, confirm the estimate assumptions, order eligibility/refund behavior, rider
  mileage measurement rules, and final partner-contract wording with the owner.
