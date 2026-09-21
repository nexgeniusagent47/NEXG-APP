# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Four audiences, all real, deliberately served by one product:

1. **Hotel and villa guests** — visitors ordering to a room, suite or villa, often
   unfamiliar with Nairobi and often ordering through someone else. **This is the
   market entry point**, not the ceiling.
2. **Their concierges and front-desk staff**, ordering on a guest's behalf, usually
   against a room number and often under time pressure.
3. **Nairobi residents** — locals ordering for themselves who know the city, have
   existing habits, and judge the product on speed and reliability rather than
   novelty.
4. **Corporate and expat accounts** — companies and relocated staff with recurring
   needs, billing requirements and a named contact.

The job in every case is the same: get something done in Nairobi — a meal, a
pharmacy run, a spa booking, a chauffeur, a shipment — through one place that
already knows how that particular kind of thing is ordered.

## Product Purpose

NEXG Concierge is an on-demand marketplace covering **21 verticals**, from
restaurants and groceries to airport transfers, safaris, freight forwarding and
financial services. It exists so that a customer does not need a different app, a
different mental model and a different checkout for each kind of errand.

Success means a customer can go from intent to confirmed order in any vertical
without learning a new flow, and a merchant can be onboarded without rebuilding
their catalogue by hand.

## Positioning

**Vertical-native ordering flows.** Each vertical transacts the way that vertical
actually transacts, and the product models that difference rather than flattening
it. A restaurant order is a cart; a chauffeur booking is a date, a time, a party
size and a pickup point; a freight job is a quote with an origin, a destination and
a weight band; a bank is a compliance check followed by an appointment. Forcing all
of these through `Add to cart` is the thing this product refuses to do.

**Independence is an explicit goal.** The hotel and villa channel is the entry
point, not the identity: the intent is to be a general marketplace on the model of
Uber or Wolt, not a captive amenity inside someone else's property. No durable
product decision should make NEXG dependent on a single hotel group, property
manager or channel partner.

**Catalogue source flexibility.** The catalogue is served from NEXG's own database,
but a merchant's stock and pricing may originate in **their** system — an ERP, a
POS, or whatever they already run. The product must be able to render from our
database *or* connect to a merchant's existing system as the source of truth for
the data classes that system owns. Integration is a first-class capability, not a
one-off import.

## Operating Context

- **Geography:** Nairobi, Kenya. Merchants are described by neighbourhood
  (Kilimani, Westlands, Karen, Gigiri, Eastleigh, …) — 20 areas in the seed.
- **Currency:** Kenyan Shillings. Price bands differ by orders of magnitude between
  verticals; a coffee and a safari share no price scale.
- **Access context:** guests are often on hotel wifi, on a phone, one-handed,
  mid-interruption, and may not know the city. Residents are on mobile data and
  know exactly what they want. Concierges are on desktop, often handling several
  guests at once.
- **Fulfilment is real-world and mixed:** in-suite delivery, chauffeur, on-site
  booking, scheduled collection. A single order model cannot cover it.
- **Regulatory context:** alcohol, tobacco, vapes and adult products require
  verification before dispatch. Financial services require eligibility checks and
  fee disclosure.

## Capabilities and Constraints

**Confirmed.**

- 21 categories, 128 subcategories, 640 merchants in the seeded catalogue.
- Five commerce arcs drive the ordering flow: browse & buy, book a slot, request a
  service, compliance & appointment, get a quote. The arc is derived from the
  merchant's own declared workflow, with a per-category default.
- Requirements are derived from the arc **plus** the subcategory's declared fields,
  so an alcohol order collects a liquor licence and an adults-only order collects
  an age-gate method without either being hardcoded.
- Age-restricted goods **must** be gated before dispatch. This is implemented as a
  compliance section that blocks submission.
- Prices are in KSh and must be realistic within each vertical's declared band.
  Uniform or placeholder pricing is a defect, not a simplification.
- Catalogue is generated from the source Excel by
  `scripts/regenerate_catalog_seed.py`; the seed files are generated artefacts and
  are never hand-edited.
- **Catalogue data may come from NEXG's database or from a merchant's own ERP/POS
  system.** Which system owns which data class must be explicit per integration;
  an integration must not silently become the authority for data it does not own.

**Undecided, and deliberately not invented here.**

- Whether merchant ERP/POS connectivity is read-only sync or bidirectional.
- Which integration protocols are in scope (REST, webhook, file drop, direct DB).
- Commission, payout and settlement mechanics.
- Whether corporate accounts get consolidated billing and net terms.

## Brand Commitments

- The name **NEXG Concierge** is fixed.
- The visual identity is nocturne: near-black surfaces with a single gold accent.
  Recorded in `DESIGN.md`; not to be changed as a side effect of unrelated work.
- The voice is plain and factual. It states what a thing is and what happens next.
  Marketing language does not belong on operational surfaces.
- Concierge is part of the promise: human assistance is available, not only
  self-service.

## Evidence on Hand

- `NEXG_Nairobi_Merchant_Seed_Catalog.xlsx` — the authoritative source catalogue:
  640 merchants, 14,895 items, a 128-row taxonomy sheet with per-subcategory
  workflow hints.
- A seeded PostgreSQL database with a real schema: categories, subcategories,
  merchants, merchant↔subcategory links, items, reviews, and a storefront view.
- Rendered product: the discovery surface, one merchant page for all verticals,
  and one item modal that adapts per vertical.
- **Absences that must not be fabricated:** there are no real customers,
  testimonials, press mentions, logos, photography or performance benchmarks. All
  imagery currently comes from stock URLs and generated placeholders. Do not invent
  proof.

## Product Principles

1. **The vertical decides the flow.** Never route a booking, a quote or an
   appointment through a cart. If a vertical's real-world ordering steps are not
   modelled, that is unfinished work, not a simplification.
2. **Show the process before asking for commitment.** The customer should be able
   to see what an order will require — eligibility, deposit, lead time — before
   they start it.
3. **Be independent, and stay independent.** The hotel channel opens the door; it
   does not define the product. No architecture decision should make a single
   partner load-bearing.
4. **A merchant's existing system is a source, not an obstacle.** Meet merchants
   where their data already lives rather than demanding they re-enter it, while
   keeping clear which system owns which fact.
5. **Never promise what the interface does not do.** A button label is a contract;
   a step rail is a claim about the system. Both must be true.

## Accessibility & Inclusion

No product-specific standard has been established by the client. The working
baseline is **WCAG 2.1 AA** for the surfaces built so far: body text at 4.5:1,
large text at 3:1, keyboard-reachable controls with visible focus, and dialogs that
trap focus and dismiss on Escape. The incumbent palette meets AA in dark mode;
light-mode gold text required a darker token (`#8A6413`) to pass, recorded in
`DESIGN.md`.

Two contexts raise the bar beyond the baseline and are not yet fully served:
guests on poor hotel wifi (performance, and a usable offline or slow-network
state), and one-handed mobile use (primary actions within thumb reach).
