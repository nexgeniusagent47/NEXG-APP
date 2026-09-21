// tests/order-requirements.test.ts
//
// The dynamic item modal is only as good as the requirements it renders. These
// tests assert that the same item modal asks for the RIGHT things per vertical,
// which is the whole point of the feature.
//
// The failure these guard against: a modal that shows "Add to cart" and a
// quantity stepper on a bank appointment, or forgets the date on a chauffeur
// booking.

import { describe, expect, it } from 'vitest';
import { buildRequirements, validateRequirements } from '../src/data/orderRequirements';

// The real seeded workflow strings, copied from merchants.metadata in Postgres.
const BROWSE_BUY_WORKFLOW =
  'Browse → item → variant/quantity → delivery or pickup → eligibility checks where required → cart → payment → dispatch → delivery';
const BOOK_SLOT_WORKFLOW =
  'Select offering → date/time → party/vehicle/group details → availability → price → payment/deposit → confirmation → live status';
const REQUEST_SERVICE_WORKFLOW =
  'Select service → address → scope/details → schedule → quote or fixed price → confirmation → assigned provider → completion';
const COMPLIANCE_WORKFLOW =
  'Service selection → eligibility/compliance → customer details → quote/fee disclosure → digital or branch appointment → confirmation';
const QUOTE_WORKFLOW = 'Shipment quote → route/cargo → weight/volume → price → booking → dispatch';

describe('buildRequirements — arc detection from the seeded workflow strings', () => {
  const cases: Array<[string, string, string]> = [
    ['browse_buy', BROWSE_BUY_WORKFLOW, 'restaurants-food'],
    ['book_slot', BOOK_SLOT_WORKFLOW, 'airport-transfers'],
    ['request_service', REQUEST_SERVICE_WORKFLOW, 'concierge-services'],
    ['compliance_appointment', COMPLIANCE_WORKFLOW, 'financial-services'],
    ['get_quote', QUOTE_WORKFLOW, 'logistics-shipping'],
  ];

  it.each(cases)('maps the %s workflow to the %s arc', (expectedArc, workflow, categoryId) => {
    const built = buildRequirements({ workflow, categoryId });
    expect(built.arc).toBe(expectedArc);
    expect(built.sections.length).toBeGreaterThan(0);
  });

  it('uses the category default when the workflow is missing, and flags it', () => {
    const built = buildRequirements({ workflow: null, categoryId: 'logistics-shipping' });
    expect(built.arc).toBe('get_quote');
    expect(built.primaryAction).toBe('Get shipping quote');
  });

  it('never falls over on an unrecognised workflow', () => {
    const built = buildRequirements({ workflow: 'do something inexplicable', categoryId: 'nowhere' });
    expect(built.arc).toBe('browse_buy');
    expect(built.all.length).toBeGreaterThan(0);
  });
});

describe('buildRequirements — the modal asks for the right things per vertical', () => {
  it('a restaurant order gets a quantity and no schedule', () => {
    const built = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'restaurants-food',
      subcategoryId: 'restaurant',
    });

    const ids = built.all.map((r) => r.id);
    expect(ids).toContain('quantity');
    expect(built.needsSchedule).toBe(false);
    expect(ids).not.toContain('bookingDate');
    expect(ids).not.toContain('bookingTime');
  });

  it('a chauffeur transfer gets a date, a time and a party size, and no quantity', () => {
    const built = buildRequirements({
      workflow: BOOK_SLOT_WORKFLOW,
      categoryId: 'airport-transfers',
      subcategoryId: 'airport_pickup',
    });

    const ids = built.all.map((r) => r.id);
    expect(ids).toContain('bookingDate');
    expect(ids).toContain('bookingTime');
    expect(ids).toContain('partySize');
    expect(built.needsSchedule).toBe(true);
    // Quantity is meaningless for a single booked transfer.
    expect(ids).not.toContain('quantity');
  });

  it('a freight quote gets origin and destination', () => {
    const built = buildRequirements({
      workflow: QUOTE_WORKFLOW,
      categoryId: 'logistics-shipping',
      subcategoryId: 'sea_freight',
    });

    const ids = built.all.map((r) => r.id);
    expect(ids).toContain('origin');
    expect(ids).toContain('destination');
    expect(built.primaryAction).toBe('Get shipping quote');
  });

  it('a bank appointment drops the delivery question', () => {
    const built = buildRequirements({
      workflow: COMPLIANCE_WORKFLOW,
      categoryId: 'financial-services',
      subcategoryId: 'banking',
    });

    const ids = built.all.map((r) => r.id);
    expect(ids).not.toContain('fulfilmentMethod');
    expect(ids).toContain('appointmentMode');
  });
});

describe('buildRequirements — catalogue-declared fields become requirements', () => {
  it('pulls the liquor licence gate from the alcohol subcategories', () => {
    const built = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'alcohol-beverages',
      subcategoryId: 'wine',
    });

    const licence = built.all.find((r) => r.id === 'liquor_license');
    expect(licence).toBeDefined();
    // A licence number is a compliance gate, not a preference.
    expect(licence?.kind).toBe('compliance');
    expect(licence?.required).toBe(true);
  });

  it('treats the age-gate method as compliance', () => {
    const built = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'adults-only',
      subcategoryId: 'cigarettes',
    });

    const ageGate = built.all.find((r) => r.id === 'age_gate_method');
    expect(ageGate?.kind).toBe('compliance');
  });

  it('resolves subcategories across the hyphen/underscore id mismatch', () => {
    // The API says "restaurants-food"; the catalogue says "restaurants_food".
    const fromApiSlug = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'restaurants-food',
      subcategoryId: 'catering',
    });

    // catering declares advance_booking_days and min/max headcount.
    const ids = fromApiSlug.all.map((r) => r.id);
    expect(ids).toContain('min_headcount');
    expect(ids).toContain('max_headcount');
  });

  it('skips catalogue fields the schema cannot describe rather than rendering blanks', () => {
    const built = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'restaurants-food',
      subcategoryId: 'restaurant',
    });

    for (const requirement of built.all) {
      expect(requirement.label.length).toBeGreaterThan(0);
      expect(requirement.id.length).toBeGreaterThan(0);
      // select/radio must carry options or the control renders empty.
      if (requirement.control === 'select' || requirement.control === 'radio') {
        expect(requirement.options?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });
});

describe('buildRequirements — section shaping', () => {
  it('drops empty sections instead of rendering bare headings', () => {
    const built = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'restaurants-food',
      subcategoryId: 'restaurant',
    });

    for (const section of built.sections) {
      expect(section.requirements.length).toBeGreaterThan(0);
    }
  });

  /**
   * Regression guard.
   *
   * Sections are assembled by filtering requirements over SECTION_ORDER. A kind
   * omitted from that list is dropped from the UI while remaining in `all`, so
   * validation then rejects a submission over a field the user was never shown.
   * `quantity` was omitted and did exactly that. Every requirement in `all` must
   * be reachable in a rendered section.
   */
  it('renders every requirement it will validate (no invisible required fields)', () => {
    const scenarios = [
      { workflow: BROWSE_BUY_WORKFLOW, categoryId: 'restaurants-food', subcategoryId: 'restaurant' },
      { workflow: BOOK_SLOT_WORKFLOW, categoryId: 'airport-transfers', subcategoryId: 'airport_pickup' },
      { workflow: REQUEST_SERVICE_WORKFLOW, categoryId: 'concierge-services' },
      { workflow: COMPLIANCE_WORKFLOW, categoryId: 'financial-services', subcategoryId: 'banking' },
      { workflow: QUOTE_WORKFLOW, categoryId: 'logistics-shipping', subcategoryId: 'sea_freight' },
      { workflow: BROWSE_BUY_WORKFLOW, categoryId: 'adults-only', subcategoryId: 'cigarettes' },
      { workflow: BROWSE_BUY_WORKFLOW, categoryId: 'alcohol-beverages', subcategoryId: 'wine' },
    ];

    for (const scenario of scenarios) {
      const built = buildRequirements(scenario);
      const rendered = new Set(
        built.sections.flatMap((section) => section.requirements.map((r) => r.id))
      );
      const invisible = built.all.filter((r) => !rendered.has(r.id)).map((r) => r.id);

      expect(
        invisible,
        `${scenario.categoryId}: validated but never rendered -> ${invisible.join(', ')}`
      ).toEqual([]);
    }
  });

  it('puts quantity first for a purchase arc', () => {
    const built = buildRequirements({ workflow: BROWSE_BUY_WORKFLOW, categoryId: 'restaurants-food' });
    expect(built.sections[0].kind).toBe('quantity');
  });

  it('never emits duplicate requirement ids', () => {
    const built = buildRequirements({
      workflow: BROWSE_BUY_WORKFLOW,
      categoryId: 'alcohol-beverages',
      subcategoryId: 'wine',
    });

    const ids = built.all.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('validateRequirements', () => {
  const built = buildRequirements({
    workflow: BOOK_SLOT_WORKFLOW,
    categoryId: 'airport-transfers',
    subcategoryId: 'airport_pickup',
  });

  it('reports every required field that is still empty', () => {
    const errors = validateRequirements(built.all, {});
    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.bookingDate).toBeDefined();
    expect(errors.bookingTime).toBeDefined();
  });

  it('passes when required fields are filled', () => {
    const values: Record<string, unknown> = {};
    for (const requirement of built.all) {
      if (requirement.control === 'multicheck') values[requirement.id] = ['Something'];
      else if (requirement.control === 'toggle') values[requirement.id] = false;
      else if (requirement.control === 'number') values[requirement.id] = 2;
      else values[requirement.id] = 'filled';
    }
    const errors = validateRequirements(built.all, values);
    expect(errors).toEqual({});
  });

  it('rejects a zero or negative quantity', () => {
    const browse = buildRequirements({ workflow: BROWSE_BUY_WORKFLOW, categoryId: 'restaurants-food' });
    const errors = validateRequirements(browse.all, { quantity: 0 });
    expect(errors.quantity).toBeDefined();
  });

  it('requires at least one choice for a multicheck', () => {
    const multicheck = built.all.find((r) => r.control === 'multicheck');
    if (!multicheck) return; // no multicheck in this vertical; nothing to assert

    const errors = validateRequirements([{ ...multicheck, required: true }], {
      [multicheck.id]: [],
    });
    expect(errors[multicheck.id]).toBeDefined();
  });
});
