// src/data/workflowEngine.ts
//
// Maps a merchant onto its intended COMMERCE ARC, and derives the concrete
// actions its card and preview sheet must offer.
//
// Why this exists
// ---------------
// Every merchant row carries a `workflow` string in `merchants.metadata`, seeded
// from the Excel catalogue. Extracting the real data shows exactly five distinct
// arcs across the 21 verticals:
//
//   Browse → item → variant/quantity → delivery or pickup → eligibility checks
//          → cart → payment → dispatch → delivery
//   Select offering → date/time → party/vehicle/group details → availability
//          → price → payment/deposit → confirmation → live status
//   Select service → address → scope/details → schedule → quote or fixed price
//          → confirmation → assigned provider → completion
//   Service selection → eligibility/compliance → customer details
//          → quote/fee disclosure → digital or branch appointment → confirmation
//   Shipment quote → route/cargo → weight/volume → price → booking → dispatch
//
// The failure this prevents: a single hardcoded "Add to cart" everywhere. Putting
// "Add to cart" on a freight forwarder, a bank, or a chauffeur company is the bug.
// A restaurant says Add to cart. A bank says Book appointment.

export type CommerceArc =
  | 'browse_buy'
  | 'book_slot'
  | 'request_service'
  | 'compliance_appointment'
  | 'get_quote';

export interface ArcStep {
  /** Stable key, useful for tests and analytics. */
  id: string;
  /** Human label shown in the sheet's step rail. */
  label: string;
}

export interface ArcDefinition {
  id: CommerceArc;
  /** Short name for the arc itself, e.g. "Order & deliver". */
  label: string;
  /** One-line description of what the user is actually doing. */
  intent: string;
  /** The end-to-end journey for this arc, in order. */
  steps: ArcStep[];
  /** Label for the primary CTA. Never a full sentence. */
  primaryAction: string;
  /** Verb used on the merchant card's quick action. */
  cardAction: string;
  /**
   * Whether a date/time choice is part of the flow. Drives whether the sheet
   * offers a scheduling affordance.
   */
  needsSchedule: boolean;
  /** Whether the flow can complete without leaving the sheet. */
  instant: boolean;
}

/**
 * The five arcs, with their step rails.
 *
 * Step rails are written in plain language on purpose: they are shown to the
 * user as "what happens next", not as internal state names.
 */
export const ARCS: Record<CommerceArc, ArcDefinition> = {
  browse_buy: {
    id: 'browse_buy',
    label: 'Order & deliver',
    intent: 'Pick items now and have them brought to you',
    steps: [
      { id: 'browse', label: 'Browse items' },
      { id: 'choose', label: 'Choose options' },
      { id: 'eligibility', label: 'Eligibility check' },
      { id: 'cart', label: 'Add to cart' },
      { id: 'pay', label: 'Pay' },
      { id: 'dispatch', label: 'Dispatch' },
      { id: 'deliver', label: 'Delivered' },
    ],
    primaryAction: 'View full menu',
    cardAction: 'View menu',
    needsSchedule: false,
    instant: true,
  },

  book_slot: {
    id: 'book_slot',
    label: 'Book a time',
    intent: 'Reserve a slot, seat, or vehicle for a specific time',
    steps: [
      { id: 'select', label: 'Select offering' },
      { id: 'when', label: 'Date and time' },
      { id: 'details', label: 'Party details' },
      { id: 'availability', label: 'Availability' },
      { id: 'price', label: 'Price' },
      { id: 'deposit', label: 'Payment or deposit' },
      { id: 'confirm', label: 'Confirmation' },
    ],
    primaryAction: 'Check availability',
    cardAction: 'Check dates',
    needsSchedule: true,
    instant: false,
  },

  request_service: {
    id: 'request_service',
    label: 'Request a service',
    intent: 'Describe what you need and get a provider assigned',
    steps: [
      { id: 'select', label: 'Select service' },
      { id: 'address', label: 'Address' },
      { id: 'scope', label: 'Scope and details' },
      { id: 'schedule', label: 'Schedule' },
      { id: 'quote', label: 'Quote or fixed price' },
      { id: 'assign', label: 'Provider assigned' },
      { id: 'complete', label: 'Completed' },
    ],
    primaryAction: 'Request this service',
    cardAction: 'Request',
    needsSchedule: true,
    instant: false,
  },

  compliance_appointment: {
    id: 'compliance_appointment',
    label: 'Compliance & appointment',
    intent: 'Confirm eligibility, then book an appointment',
    steps: [
      { id: 'select', label: 'Select service' },
      { id: 'eligibility', label: 'Eligibility and compliance' },
      { id: 'details', label: 'Your details' },
      { id: 'fees', label: 'Quote and fee disclosure' },
      { id: 'appointment', label: 'Digital or branch appointment' },
      { id: 'confirm', label: 'Confirmation' },
    ],
    primaryAction: 'Book appointment',
    cardAction: 'Book',
    needsSchedule: true,
    instant: false,
  },

  get_quote: {
    id: 'get_quote',
    label: 'Get a quote',
    intent: 'Price a shipment or bulk job before committing',
    steps: [
      { id: 'route', label: 'Route and cargo' },
      { id: 'weight', label: 'Weight and volume' },
      { id: 'price', label: 'Price' },
      { id: 'book', label: 'Book' },
      { id: 'dispatch', label: 'Dispatch' },
    ],
    primaryAction: 'Get shipping quote',
    cardAction: 'Get quote',
    needsSchedule: false,
    instant: false,
  },
};

/**
 * Categories whose vertical ALWAYS behaves a certain way, regardless of what the
 * seeded workflow string happens to say. Used as the fallback when the workflow
 * text is missing or unrecognised.
 */
const CATEGORY_DEFAULT_ARC: Record<string, CommerceArc> = {
  'logistics-shipping': 'get_quote',
  'financial-services': 'compliance_appointment',
  'concierge-services': 'request_service',
  'airport-transfers': 'book_slot',
  'travel-tours': 'book_slot',
  experiences: 'book_slot',
  'vehicle-rentals': 'book_slot',
  'vehicle-services': 'book_slot',
  'laundry-cleaning': 'request_service',
  'restaurants-food': 'browse_buy',
  'groceries-essentials': 'browse_buy',
  'alcohol-beverages': 'browse_buy',
  'adults-only': 'browse_buy',
  beauty: 'browse_buy',
  'fashion-apparel': 'browse_buy',
  'flowers-gifts': 'browse_buy',
  health: 'browse_buy',
  pharmacy: 'browse_buy',
  marketplace: 'browse_buy',
  'tech-electronics': 'browse_buy',
  wellness: 'browse_buy',
};

/**
 * How to detect an arc. Order matters: the first match wins.
 *
 * `book_slot` and `browse_buy` are the two "greedy" patterns, so the three more
 * specific arcs are tested before them.
 */
const ARC_DETECTORS: Array<{ arc: CommerceArc; test: RegExp }> = [
  // "Shipment quote → route/cargo → ..." (logistics)
  { arc: 'get_quote', test: /shipment\s+quote/i },
  // "Service selection → eligibility/compliance → ..." (financial)
  { arc: 'compliance_appointment', test: /eligibility\s*\/\s*compliance|fee\s+disclosure/i },
  // "Select service → address → scope/details → ..." (concierge, cleaning)
  { arc: 'request_service', test: /select\s+service|assigned\s+provider|scope\s*\/\s*details/i },
  // "Select offering → date/time → party/vehicle/group details → ..."
  { arc: 'book_slot', test: /select\s+offering|date\s*\/\s*time|payment\s*\/\s*deposit|availability/i },
  // "Browse → item → variant/quantity → delivery or pickup → ..."
  { arc: 'browse_buy', test: /^browse|variant\s*\/\s*quantity|delivery\s+or\s+pickup/i },
];

export interface MerchantIntent {
  arc: ArcDefinition;
  /** The first step the user takes, for display. */
  firstStep: ArcStep;
  /** A short line describing what the user can do here. */
  summary: string;
  /** True when the arc could not be detected and a category default was used. */
  inferred: boolean;
}

/** Minimal shape needed to resolve intent — keeps this testable without a full merchant. */
export interface IntentInput {
  workflow?: string | null;
  categoryId?: string | null;
  category?: string | null;
}

/**
 * Resolve a merchant's commerce arc.
 *
 * Strategy: detect from the seeded `workflow` text first (it is the catalogue's
 * own statement of intent); if that is missing or unrecognised, fall back to the
 * category default. Never throws, never returns undefined.
 */
export function resolveIntent(input: IntentInput): MerchantIntent {
  const workflow = (input.workflow ?? '').trim();

  let arcId: CommerceArc | null = null;
  let inferred = false;

  if (workflow) {
    for (const detector of ARC_DETECTORS) {
      if (detector.test.test(workflow)) {
        arcId = detector.arc;
        break;
      }
    }
  }

  if (!arcId) {
    const key = (input.categoryId ?? input.category ?? '').trim().toLowerCase();
    arcId = CATEGORY_DEFAULT_ARC[key] ?? 'browse_buy';
    inferred = true;
  }

  const arc = ARCS[arcId];
  return {
    arc,
    firstStep: arc.steps[0],
    summary: arc.intent,
    inferred,
  };
}

/** Convenience: the label for a merchant card's primary action. */
export function cardActionLabel(input: IntentInput): string {
  return resolveIntent(input).arc.cardAction;
}

/** Convenience: the full step rail for a merchant, as display labels. */
export function stepLabels(input: IntentInput): string[] {
  return resolveIntent(input).arc.steps.map((s) => s.label);
}
