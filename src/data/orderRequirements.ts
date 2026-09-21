// src/data/orderRequirements.ts
//
// Derives the ORDER REQUIREMENTS for an item, so one item modal can serve all 21
// verticals.
//
// Where the requirements come from
// --------------------------------
// 1. The merchant's COMMERCE ARC (src/data/workflowEngine.ts) decides the
//    structure: whether a date is needed, whether delivery or pickup applies,
//    whether compliance must be captured, whether a quantity is meaningful.
//    A chauffeur booking and a bag of groceries do not collect the same things.
// 2. The SUBCATEGORY's declared `fields` in src/data/merchantCatalog.ts name the
//    vertical-specific requirements ("Liquor license", "Minimum headcount",
//    "Vehicle types available"), and FIELD_DEFS gives each one a control type,
//    label, placeholder and options.
//
// Together these mean the modal is not hardcoded per vertical: it is assembled
// from the catalogue's own declarations plus the merchant's own workflow.
//
// Grouping matters. Rendering 12 controls as one flat list is unusable, so
// requirements are grouped into a small number of semantic sections and rendered
// top to bottom. Fields the catalogue does not know about are skipped rather
// than rendered as unlabelled garbage.

import { FIELD_DEFS, type FieldDefinition } from './merchantCatalog';
import { CATEGORIES_21 } from './categoryCatalog21';
import { resolveIntent, type CommerceArc } from './workflowEngine';

export type RequirementKind =
  | 'quantity'      // how many
  | 'schedule'      // when
  | 'fulfilment'    // where it goes / how it arrives
  | 'options'       // configuration the seller offers
  | 'compliance'    // legal or eligibility gates
  | 'notes';        // free text for the merchant

export interface OrderRequirement {
  /** Stable id, also the form field name. */
  id: string;
  label: string;
  kind: RequirementKind;
  control: FieldDefinition['type'];
  required: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  /** Where this requirement came from, used for debugging and tests. */
  source: 'arc' | 'catalogue' | 'universal';
}

export interface RequirementSection {
  kind: RequirementKind;
  title: string;
  /** One short line explaining why this section is here, where that is not obvious. */
  note?: string;
  requirements: OrderRequirement[];
}

// --------------------------------------------------------------------- helpers

/**
 * The catalogue uses underscored category ids (`restaurants_food`); the database
 * and API use hyphenated slugs (`restaurants-food`). Normalise before matching so
 * neither side has to know about the other's convention.
 */
function normaliseKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, '-');
}

function findCategory(categoryId?: string | null, categoryName?: string | null) {
  const wanted = normaliseKey(categoryId ?? categoryName ?? '');
  if (!wanted) return undefined;
  return CATEGORIES_21.find(
    (c) => normaliseKey(c.id) === wanted || normaliseKey(c.slug) === wanted || normaliseKey(c.name) === wanted
  );
}

function findSubcategory(
  categoryId?: string | null,
  subcategoryId?: string | null,
  subcategoryName?: string | null
) {
  const category = findCategory(categoryId, null);
  if (!category) return undefined;

  const wanted = normaliseKey(subcategoryId ?? subcategoryName ?? '');
  if (!wanted) return undefined;

  return category.subcategories.find(
    (s) => normaliseKey(s.id) === wanted || normaliseKey(s.name) === wanted
  );
}

/** Compliance-flavoured field ids. These are gates, not preferences. */
const COMPLIANCE_FIELD = /license|licence|regulatory|age_gate|age_requirement|eligibility|prescription|authenticity|certified|certificate/i;

/**
 * Display order of the requirement sections.
 *
 * This must list EVERY RequirementKind. Sections are assembled by filtering over
 * this order, so a kind missing here is dropped silently: the requirement stays in
 * `all` (and therefore still participates in validation) but never reaches the
 * screen. That is the worst failure mode, because the form rejects a submission
 * over a field the user was never shown. `quantity` was missing here and did
 * exactly that.
 *
 * The `Record<RequirementKind, ...>` type on SECTION_TITLES below cannot catch a
 * missing entry in an array, so there is a test asserting every kind is rendered.
 */
const SECTION_ORDER: RequirementKind[] = [
  'quantity',
  'options',
  'schedule',
  'fulfilment',
  'compliance',
  'notes',
];

const SECTION_TITLES: Record<RequirementKind, string> = {
  quantity: 'Quantity',
  schedule: 'When',
  fulfilment: 'Delivery',
  options: 'Options',
  compliance: 'Required to proceed',
  notes: 'Anything else',
};

// ---------------------------------------------------------------- arc handlers

/**
 * Requirements implied by the commerce arc. These are structural: the flow cannot
 * complete without them, regardless of vertical.
 */
function arcRequirements(arc: CommerceArc): OrderRequirement[] {
  const out: OrderRequirement[] = [];

  // Every arc can be delivered or collected, except pure digital/compliance flows
  // where the appointment location is the point.
  const fulfilmentApplies = arc !== 'compliance_appointment';

  if (fulfilmentApplies) {
    out.push({
      id: 'fulfilmentMethod',
      label: 'How would you like to receive this?',
      kind: 'fulfilment',
      control: 'radio',
      required: true,
      options:
        arc === 'browse_buy'
          ? ['Deliver to me', 'I will collect']
          : ['Send a provider to me', 'I will come to the location'],
      source: 'arc',
    });
  }

  switch (arc) {
    case 'book_slot':
      out.push(
        {
          id: 'bookingDate',
          label: 'Preferred date',
          kind: 'schedule',
          control: 'text',
          required: true,
          placeholder: 'e.g. Fri 26 Sep',
          source: 'arc',
        },
        {
          id: 'bookingTime',
          label: 'Preferred time',
          kind: 'schedule',
          control: 'text',
          required: true,
          placeholder: 'e.g. 19:30',
          source: 'arc',
        },
        {
          id: 'partySize',
          label: 'How many people?',
          kind: 'schedule',
          control: 'number',
          required: true,
          placeholder: 'e.g. 2',
          source: 'arc',
        }
      );
      break;

    case 'request_service':
      out.push(
        {
          id: 'serviceAddress',
          label: 'Service address',
          kind: 'fulfilment',
          control: 'textarea',
          required: true,
          placeholder: 'Building, street, area, and any access notes',
          source: 'arc',
        },
        {
          id: 'preferredWindow',
          label: 'Preferred time window',
          kind: 'schedule',
          control: 'text',
          required: false,
          placeholder: 'e.g. tomorrow morning',
          source: 'arc',
        }
      );
      break;

    case 'compliance_appointment':
      out.push({
        id: 'appointmentMode',
        label: 'How would you like to be served?',
        kind: 'fulfilment',
        control: 'radio',
        required: true,
        options: ['Digital / online', 'Visit a branch'],
        source: 'arc',
      });
      break;

    case 'get_quote':
      out.push(
        {
          id: 'origin',
          label: 'From',
          kind: 'fulfilment',
          control: 'text',
          required: true,
          placeholder: 'Origin city or port',
          source: 'arc',
        },
        {
          id: 'destination',
          label: 'To',
          kind: 'fulfilment',
          control: 'text',
          required: true,
          placeholder: 'Destination city or port',
          source: 'arc',
        }
      );
      break;

    case 'browse_buy':
    default:
      break;
  }

  return out;
}

/** Requirements every order has, adapted to the arc. */
function universalRequirements(arc: CommerceArc): OrderRequirement[] {
  const out: OrderRequirement[] = [];

  // Quantity is meaningful when buying units, and misleading when booking a
  // single appointment slot.
  if (arc === 'browse_buy' || arc === 'get_quote') {
    out.push({
      id: 'quantity',
      label: arc === 'get_quote' ? 'Number of units' : 'Quantity',
      kind: 'quantity',
      control: 'number',
      required: true,
      source: 'universal',
    });
  }

  out.push({
    id: 'notes',
    label: 'Notes for the merchant',
    kind: 'notes',
    control: 'textarea',
    required: false,
    placeholder: 'Allergies, access instructions, special requests',
    source: 'universal',
  });

  return out;
}

/** Requirements the catalogue declares for this subcategory. */
function catalogueRequirements(
  categoryId?: string | null,
  subcategoryId?: string | null,
  subcategoryName?: string | null
): OrderRequirement[] {
  const subcategory = findSubcategory(categoryId, subcategoryId, subcategoryName);
  if (!subcategory) return [];

  const out: OrderRequirement[] = [];

  for (const fieldId of subcategory.fields ?? []) {
    const def = FIELD_DEFS[fieldId];
    // Skip anything the schema does not describe: an unlabelled control is worse
    // than no control.
    if (!def) continue;

    const kind: RequirementKind = COMPLIANCE_FIELD.test(fieldId) ? 'compliance' : 'options';

    out.push({
      id: fieldId,
      label: def.label,
      kind,
      control: def.type,
      // Toggles and multichecks default to "no selection", which is a valid
      // answer, so they are never blocking. Text and numbers are.
      required: def.type === 'text' || def.type === 'number' || def.type === 'select',
      placeholder: def.placeholder,
      hint: def.hint,
      options: def.options,
      source: 'catalogue',
    });
  }

  return out;
}

// ------------------------------------------------------------------- public API

export interface BuildRequirementsInput {
  workflow?: string | null;
  categoryId?: string | null;
  category?: string | null;
  subcategoryId?: string | null;
  subcategory?: string | null;
}

export interface BuiltRequirements {
  arc: CommerceArc;
  arcLabel: string;
  primaryAction: string;
  /** Whether the arc needs a date before it can proceed. */
  needsSchedule: boolean;
  sections: RequirementSection[];
  /** Flat list, convenient for validation and tests. */
  all: OrderRequirement[];
}

/**
 * Build the full requirement set for an item, grouped for display.
 *
 * Sections that end up empty are dropped, so a restaurant does not render an
 * empty "Required to proceed" heading.
 */
export function buildRequirements(input: BuildRequirementsInput): BuiltRequirements {
  const intent = resolveIntent({
    workflow: input.workflow,
    categoryId: input.categoryId,
    category: input.category,
  });
  const arc = intent.arc.id;

  const all: OrderRequirement[] = [
    ...universalRequirements(arc),
    ...arcRequirements(arc),
    ...catalogueRequirements(input.categoryId, input.subcategoryId, input.subcategory),
  ];

  // De-duplicate by id, first definition wins (arc beats catalogue beats nothing).
  const seen = new Set<string>();
  const deduped = all.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  const sections: RequirementSection[] = [];
  for (const kind of SECTION_ORDER) {
    const requirements = deduped.filter((r) => r.kind === kind);
    if (requirements.length === 0) continue;

    sections.push({
      kind,
      title: SECTION_TITLES[kind],
      note:
        kind === 'compliance'
          ? 'This merchant is legally required to collect these before dispatch.'
          : undefined,
      requirements,
    });
  }

  return {
    arc,
    arcLabel: intent.arc.label,
    primaryAction: intent.arc.primaryAction,
    needsSchedule: intent.arc.needsSchedule,
    sections,
    all: deduped,
  };
}

/**
 * Validate a filled form against the requirements.
 * Returns a map of fieldId -> message. An empty object means valid.
 *
 * Messages name the problem and the recovery, per the craft floor's copy rule.
 * Labels are written to slot into the sentence: a label phrased as a question
 * ("How would you like to receive this?") reads correctly after "Choose", where
 * appending "is required" would produce "How would you like to receive this? is
 * required." That mistake was live before this was rewritten.
 */
export function validateRequirements(
  requirements: OrderRequirement[],
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const requirement of requirements) {
    if (!requirement.required) continue;

    const value = values[requirement.id];
    const label = requirement.label;

    if (requirement.control === 'multicheck') {
      if (!Array.isArray(value) || value.length === 0) {
        errors[requirement.id] = `Select at least one of the ${label.toLowerCase()} options.`;
      }
      continue;
    }

    if (
      requirement.control === 'radio' ||
      requirement.control === 'select' ||
      requirement.control === 'toggle'
    ) {
      if (value === undefined || value === null || String(value).trim() === '') {
        errors[requirement.id] = `Choose an option for “${label}”.`;
      }
      continue;
    }

    if (value === undefined || value === null || String(value).trim() === '') {
      errors[requirement.id] = `Enter ${label.toLowerCase()}.`;
      continue;
    }

    if (requirement.control === 'number') {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) {
        errors[requirement.id] = `Enter a number greater than zero for “${label}”.`;
      }
    }
  }

  return errors;
}
