import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Bell,
  Boxes,
  Building,
  Building2,
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  ConciergeBell,
  Crosshair,
  DoorOpen,
  Ellipsis,
  FilePen,
  FileText,
  FileUp,
  Hotel,
  House,
  Image as ImageIcon,
  Images,
  Layers,
  LocateFixed,
  Lock,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  PhoneCall,
  Plus,
  Printer,
  Smartphone,
  Stamp,
  Trash2,
  TreePine,
  Umbrella,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* ---------------------------------------------------------------------------
   Host onboarding

   A ten-step property intake. Every control is controlled by React state; the
   only place the DOM is touched directly is the Leaflet map container and the
   signature canvas, which own their own imperative surfaces.

   Colours come from two sources, and nothing else:
     - neutral utilities (bg-white / text-slate-500 / border-slate-200 …) which
       resolve through the `.onboarding-theme` token block in src/index.css and
       therefore invert with the theme;
     - the amber / emerald / red families, which keep their meaning in both
       themes.

   That is why the root carries `onboarding-theme` and why no colour decision in
   this file branches on the active theme.
--------------------------------------------------------------------------- */

const TOTAL_STEPS = 10;
const ABOUT_STEP = 1;
const PROPERTY_STEP = 2;
const LOCATION_STEP = 3;
const SPACES_STEP = 4;
const ACCESS_STEP = 5;
const SERVICES_STEP = 6;
const OPERATIONS_STEP = 7;
const COMMERCE_STEP = 8;
const DOCUMENTS_STEP = 9;
const REVIEW_STEP = 10;

const PREVIEW_KEYS: readonly UploadKey[] = ['registration', 'permit', 'logo', 'cover'];

const STORAGE_KEY = 'nexg_host_onboarding_v2';
const DRAFT_VERSION = 1;

const NAIROBI: MapPin & { zoom: number } = { lat: -1.2921, lng: 36.8219, zoom: 12 };

const CARD = 'rounded-3xl border border-slate-200 bg-slate-50 p-5';
const CONTROL_BASE =
  'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400';
const CONTROL_VALID = 'border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25';
const CONTROL_INVALID = 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/25';
const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E5B65F] via-[#D2A24A] to-[#B88728] px-6 py-3 text-sm font-bold text-[#2b1e07] shadow-lg shadow-amber-500/10 transition hover:shadow-xl sm:px-8';

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */

type PropertyType =
  | 'Hotel'
  | 'Serviced Apartment'
  | 'Apartment'
  | 'Villa'
  | 'Resort'
  | 'Lodge'
  | 'Guesthouse'
  | 'Hostel'
  | 'Other';

type ChipGroupKey = 'amenities' | 'access' | 'services' | 'departments' | 'transactions';
type ChipSelections = Record<ChipGroupKey, string[]>;

type SignatureMode = 'draw' | 'type';

type UploadKey = 'registration' | 'permit' | 'logo' | 'cover';

interface MapPin {
  lat: number;
  lng: number;
}

interface HostFormState {
  contactName: string;
  hostRole: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
  preferredContact: string;
  portfolio: string;
  propertyName: string;
  legalEntity: string;
  propertyType: PropertyType | '';
  otherProperty: string;
  unitCount: string;
  floorCount: string;
  guestCapacity: string;
  yearOpened: string;
  propertyDescription: string;
  address: string;
  neighbourhood: string;
  city: string;
  region: string;
  directions: string;
  arrivalInstructions: string;
  guestId: string;
  nexgOpportunity: string;
  operatingModel: string;
  checkIn: string;
  checkOut: string;
  requestChannel: string;
  requestOwner: string;
  fulfillmentTime: string;
  currency: string;
  taxSetup: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  mpesa: string;
  website: string;
  signatoryName: string;
  termsAccepted: boolean;
}

type FieldKey = keyof HostFormState;

/** Field keys plus the two selection groups that are validated as a whole. */
type ValidationKey = FieldKey | 'services' | 'registration';

interface ValidationIssue {
  key: ValidationKey;
  message: string;
}

interface SpaceRow {
  id: string;
  type: string;
  name: string;
  count: string;
  capacity: string;
  notes: string;
}

interface RequestRow {
  id: string;
  name: string;
  owner: string;
  price: string;
  channel: string;
}

interface UploadedFile {
  name: string;
  previewUrl?: string;
}

type UploadMap = Partial<Record<UploadKey, UploadedFile>>;

interface PersistedDraft {
  version: number;
  form: HostFormState;
  chips: ChipSelections;
  spaces: SpaceRow[];
  requests: RequestRow[];
  pin: MapPin | null;
  step: number;
}

interface StepMeta {
  title: string;
  legend: string;
  blurb: string;
  icon: LucideIcon;
}

interface RadioOption {
  value: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
}

interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  hint: string;
  icon: LucideIcon;
}

/* ---------------------------------------------------------------------------
   Step definitions
--------------------------------------------------------------------------- */

const STEPS: readonly StepMeta[] = [
  {
    title: 'About you',
    legend: 'About you',
    blurb: 'First, tell us who will manage this relationship with NEXG.',
    icon: UserRound,
  },
  {
    title: 'Property profile',
    legend: 'Property',
    blurb: "Define the property itself. We'll use this as the foundation for everything else.",
    icon: Building2,
  },
  {
    title: 'Property location',
    legend: 'Location',
    blurb: 'Give guests and NEXG operations an accurate place to work from.',
    icon: MapPin,
  },
  {
    title: 'Spaces & inventory',
    legend: 'Spaces',
    blurb: 'NEXG needs to know what physically exists inside the property. Start with the important spaces and units.',
    icon: Boxes,
  },
  {
    title: 'Property access',
    legend: 'Access',
    blurb: 'Which areas can guests reach during a normal stay?',
    icon: DoorOpen,
  },
  {
    title: 'Services & guest requests',
    legend: 'Services',
    blurb: "Don't think about NEXG features yet. Just tell us what guests can already get, book, buy or request from you.",
    icon: ConciergeBell,
  },
  {
    title: 'Operations',
    legend: 'Operations',
    blurb: 'Map how your property actually operates so requests can reach the right people.',
    icon: Clock,
  },
  {
    title: 'Commerce & settlement',
    legend: 'Commerce',
    blurb: 'Only provide the commercial details needed to configure your property. Payment verification can happen separately.',
    icon: Wallet,
  },
  {
    title: 'Documents & brand',
    legend: 'Documents',
    blurb: 'Upload what NEXG needs to verify the property and create its guest-facing identity.',
    icon: FileUp,
  },
  {
    title: 'Review & authorization',
    legend: 'Agreement',
    blurb: 'Review the information, authorize the submission and send the property to NEXG for verification.',
    icon: FilePen,
  },
];

/* ---------------------------------------------------------------------------
   Option data
--------------------------------------------------------------------------- */

const HOST_ROLE_OPTIONS = [
  'Owner',
  'Property Manager',
  'General Manager',
  'Operations Manager',
  'Front Office / Guest Experience',
  'Authorized Representative',
  'Other',
] as const;

const CONTACT_METHOD_OPTIONS = ['WhatsApp', 'Phone call', 'Email', 'NEXG Portal'] as const;

const PORTFOLIO_OPTIONS: readonly RadioOption[] = [
  { value: 'one', label: 'One property', hint: "I'm setting up a single property." },
  { value: 'multiple', label: 'Multiple properties', hint: 'I manage a portfolio.' },
  { value: 'group', label: 'Property group', hint: 'Several properties under one organization.' },
];

const PROPERTY_TYPE_OPTIONS: readonly PropertyTypeOption[] = [
  { value: 'Hotel', label: 'Hotel', hint: 'Rooms + hospitality', icon: Hotel },
  { value: 'Serviced Apartment', label: 'Serviced apartment', hint: 'Managed residential stay', icon: Building2 },
  { value: 'Apartment', label: 'Apartment', hint: 'Short or long stay', icon: Building },
  { value: 'Villa', label: 'Villa', hint: 'Private property', icon: House },
  { value: 'Resort', label: 'Resort', hint: 'Destination property', icon: Umbrella },
  { value: 'Lodge', label: 'Lodge', hint: 'Nature / safari stay', icon: TreePine },
  { value: 'Guesthouse', label: 'Guesthouse', hint: 'Independent stay', icon: Bed },
  { value: 'Hostel', label: 'Hostel', hint: 'Shared accommodation', icon: Users },
  { value: 'Other', label: 'Other', hint: 'Tell us what it is', icon: Layers },
];

const AMENITY_OPTIONS = [
  'Wi-Fi',
  'Parking',
  'Reception',
  'Pool',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Conference / Events',
  'Laundry',
  'Airport Transfer',
  'Housekeeping',
] as const;

const ACCESS_OPTIONS = [
  'Guest rooms / units',
  'Lobby / reception',
  'Restaurant',
  'Pool',
  'Gym',
  'Spa',
  'Parking',
  'Events / meeting areas',
  'Outdoor areas',
  'Other',
] as const;

const SERVICE_OPTIONS = [
  'Accommodation',
  'Food & dining',
  'Room service',
  'Housekeeping',
  'Laundry',
  'Spa / wellness',
  'Gym / fitness',
  'Transport',
  'Airport transfer',
  'Tours / experiences',
  'Events / meetings',
  'Parking',
  'Maintenance',
  'Local recommendations',
  'Other',
] as const;

const DEPARTMENT_OPTIONS = [
  'Front office',
  'Housekeeping',
  'Food & beverage',
  'Maintenance',
  'Security',
  'Transport / drivers',
  'Spa / wellness',
  'Events',
  'Management',
  'Other',
] as const;

const TRANSACTION_OPTIONS = [
  'Room / unit booking',
  'Food & beverage',
  'Property services',
  'Experiences',
  'Transport',
  'Events / venues',
  'Other',
] as const;

const SPACE_TYPE_OPTIONS = [
  'Room',
  'Apartment',
  'Villa',
  'Suite',
  'Bed',
  'Restaurant',
  'Meeting room',
  'Pool / cabana',
  'Other',
] as const;

const REQUEST_ROW_CHANNEL_OPTIONS = ['Reception', 'WhatsApp', 'Phone', 'Portal', 'Other'] as const;

const GUEST_ID_OPTIONS: readonly RadioOption[] = [
  { value: 'room_number', label: 'Room / unit number', hint: 'Guests reference their assigned space.' },
  { value: 'name', label: 'Guest name', hint: 'Staff identify the guest by name.' },
  { value: 'booking', label: 'Booking / reservation ID', hint: 'Guests reference a reservation.' },
  { value: 'other', label: 'Other', hint: "We'll configure your workflow." },
];

const OPERATING_MODEL_OPTIONS = ['24/7 operation', 'Daytime + on-call', 'Fixed hours', 'Seasonal'] as const;

const REQUEST_CHANNEL_OPTIONS: readonly RadioOption[] = [
  { value: 'reception', label: 'Reception', icon: Bell },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'room_phone', label: 'Room phone', icon: PhoneCall },
  { value: 'app', label: 'App', icon: Smartphone },
  { value: 'other', label: 'Other', icon: Ellipsis },
];

const FULFILLMENT_OPTIONS = [
  'Under 15 minutes',
  '15–30 minutes',
  '30–60 minutes',
  '1–2 hours',
  'Varies by request',
] as const;

const CURRENCY_OPTIONS = [
  'KES — Kenyan Shilling',
  'UGX — Ugandan Shilling',
  'USD — US Dollar',
  'Other',
] as const;

const TAX_OPTIONS = [
  'Prices include tax',
  'Tax added at checkout',
  'Varies by item',
  'Not yet configured',
] as const;

interface RequiredField {
  key: FieldKey;
  label: string;
}

const REQUIRED_FIELDS: Record<number, readonly RequiredField[]> = {
  [ABOUT_STEP]: [
    { key: 'contactName', label: 'Full name' },
    { key: 'hostRole', label: 'Role' },
    { key: 'contactPhone', label: 'Phone number' },
    { key: 'contactEmail', label: 'Email address' },
  ],
  [PROPERTY_STEP]: [
    { key: 'propertyName', label: 'Property name' },
    { key: 'legalEntity', label: 'Legal / operating entity' },
  ],
  [LOCATION_STEP]: [
    { key: 'address', label: 'Address / street' },
    { key: 'neighbourhood', label: 'Area / neighbourhood' },
    { key: 'city', label: 'City' },
  ],
  [REVIEW_STEP]: [
    { key: 'signatoryName', label: 'Authorized signatory name' },
    { key: 'termsAccepted', label: 'Authorization consent' },
  ],
};

/* ---------------------------------------------------------------------------
   Initial state
--------------------------------------------------------------------------- */

const INITIAL_FORM: HostFormState = {
  contactName: '',
  hostRole: '',
  contactPhone: '',
  contactEmail: '',
  contactWhatsapp: '',
  preferredContact: 'WhatsApp',
  portfolio: '',
  propertyName: '',
  legalEntity: '',
  propertyType: '',
  otherProperty: '',
  unitCount: '',
  floorCount: '',
  guestCapacity: '',
  yearOpened: '',
  propertyDescription: '',
  address: '',
  neighbourhood: '',
  city: 'Nairobi',
  region: 'Nairobi County',
  directions: '',
  arrivalInstructions: '',
  guestId: '',
  nexgOpportunity: '',
  operatingModel: '24/7 operation',
  checkIn: '14:00',
  checkOut: '11:00',
  requestChannel: '',
  requestOwner: '',
  fulfillmentTime: 'Under 15 minutes',
  currency: 'KES — Kenyan Shilling',
  taxSetup: 'Prices include tax',
  bankName: '',
  accountName: '',
  accountNumber: '',
  mpesa: '',
  website: '',
  signatoryName: '',
  termsAccepted: false,
};

const INITIAL_CHIPS: ChipSelections = {
  amenities: [],
  access: [],
  services: [],
  departments: [],
  transactions: [],
};

let rowSequence = 0;
const nextRowId = (prefix: string): string => `${prefix}-${(rowSequence += 1)}`;

const createSpace = (): SpaceRow => ({
  id: nextRowId('space'),
  type: 'Room',
  name: '',
  count: '',
  capacity: '',
  notes: '',
});

const createRequest = (): RequestRow => ({
  id: nextRowId('request'),
  name: '',
  owner: '',
  price: '',
  channel: 'Reception',
});

/* ---------------------------------------------------------------------------
   Map marker

   A divIcon rather than Leaflet's default marker: the default icon resolves its
   PNG url from the stylesheet's own location, which a bundler rewrites, and the
   result is a broken image instead of a pin. Inline SVG has no asset to resolve
   and lets the pin carry the brand gold on any basemap.
--------------------------------------------------------------------------- */
const MAP_PIN_ICON = L.divIcon({
  className: '',
  html:
    '<svg width="30" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 1C5.9 1 1 5.9 1 12c0 8.2 11 19 11 19s11-10.8 11-19c0-6.1-4.9-11-11-11Z" fill="#B88728" stroke="#1a1206" stroke-width="1.6"/>' +
    '<circle cx="12" cy="12" r="4.4" fill="#ffffff"/></svg>',
  iconSize: [30, 40],
  iconAnchor: [15, 39],
});

/* ---------------------------------------------------------------------------
   Draft persistence
--------------------------------------------------------------------------- */

// Row ids travel through storage, so restored rows are re-keyed from this
// session's counter. Keeping the stored ids would collide with the first row
// added after a reload, and a duplicate key makes removal delete both rows.
const restoreSpaces = (rows: SpaceRow[] | undefined): SpaceRow[] =>
  rows && rows.length > 0 ? rows.map((row) => ({ ...row, id: nextRowId('space') })) : [createSpace()];

const restoreRequests = (rows: RequestRow[] | undefined): RequestRow[] =>
  rows && rows.length > 0 ? rows.map((row) => ({ ...row, id: nextRowId('request') })) : [createRequest()];

function loadDraft(): PersistedDraft | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedDraft>;
    if (parsed.version !== DRAFT_VERSION || !parsed.form) return null;
    const step = typeof parsed.step === 'number' ? parsed.step : 1;
    return {
      version: DRAFT_VERSION,
      form: { ...INITIAL_FORM, ...parsed.form },
      chips: { ...INITIAL_CHIPS, ...parsed.chips },
      spaces: restoreSpaces(parsed.spaces),
      requests: restoreRequests(parsed.requests),
      pin: parsed.pin ?? null,
      step: Math.min(Math.max(step, 1), TOTAL_STEPS),
    };
  } catch {
    return null;
  }
}

function removeDraft(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the form still works.
  }
}

/* ---------------------------------------------------------------------------
   Presentational helpers
--------------------------------------------------------------------------- */

const controlClass = (invalid: boolean): string =>
  `${CONTROL_BASE} ${invalid ? CONTROL_INVALID : CONTROL_VALID}`;

const choiceClass = (selected: boolean, invalid: boolean): string =>
  [
    'rounded-2xl border-2 p-4 text-left transition',
    selected
      ? 'border-amber-500 bg-amber-400/10 shadow-[0_0_0_3px_rgba(245,158,11,0.12)]'
      : 'border-slate-200 bg-white hover:-translate-y-px hover:border-amber-400',
    !selected && invalid ? 'border-red-400' : '',
  ]
    .filter(Boolean)
    .join(' ');

const chipClass = (checked: boolean): string =>
  [
    'inline-flex select-none items-center gap-1.5 rounded-full border-[1.5px] px-3 py-2 text-[0.76rem] font-bold transition',
    checked
      ? 'border-amber-500 bg-amber-400/15 text-slate-900'
      : 'border-slate-200 text-slate-600 hover:border-amber-400 hover:bg-amber-400/10',
  ].join(' ');

interface FieldProps {
  htmlFor: FieldKey;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}

const Field = ({
  htmlFor,
  label,
  required,
  error,
  hint,
  className,
  labelClassName,
  children,
}: FieldProps) => (
  <div className={className}>
    <label
      htmlFor={htmlFor}
      className={labelClassName ?? 'mb-2 block text-sm font-semibold text-slate-800'}
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    {error && (
      <p id={`${htmlFor}-error`} className="mt-1.5 text-xs font-semibold text-red-600">
        {error}
      </p>
    )}
  </div>
);

const COMPACT_LABEL = 'mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500';

interface StepHeadingProps {
  icon: LucideIcon;
  title: string;
  blurb: string;
}

const StepHeading = ({ icon: Icon, title, blurb }: StepHeadingProps) => (
  <div className="mb-7">
    <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-slate-950">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
        <Icon className="h-5 w-5" />
      </span>
      {title}
    </h2>
    <p className="mt-2 text-sm text-slate-500">{blurb}</p>
  </div>
);

interface ChipGroupProps {
  id: string;
  label: string;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (option: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

const ChipGroup = ({ id, label, options, selected, onToggle, error, hint, required }: ChipGroupProps) => (
  <div>
    <p id={id} className="text-sm font-semibold text-slate-800">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </p>
    {hint && <p className="mt-1 mb-3 text-xs text-slate-500">{hint}</p>}
    <div
      role="group"
      aria-labelledby={id}
      aria-describedby={error ? `${id}-error` : undefined}
      className={hint ? 'flex flex-wrap gap-2' : 'mt-3 flex flex-wrap gap-2'}
    >
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={checked}
            onClick={() => onToggle(option)}
            className={chipClass(checked)}
          >
            {checked && <Check className="h-3 w-3" strokeWidth={3} />}
            {option}
          </button>
        );
      })}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-2 text-xs font-semibold text-red-600">
        {error}
      </p>
    )}
  </div>
);

interface RadioGroupProps {
  id: string;
  label: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  gridClassName: string;
}

const RadioGroup = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required,
  gridClassName,
}: RadioGroupProps) => (
  <div>
    <p id={id} className="mb-3 text-sm font-semibold text-slate-800">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </p>
    <div
      role="radiogroup"
      aria-labelledby={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={gridClassName}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={choiceClass(selected, Boolean(error))}
          >
            {Icon && <Icon className="h-5 w-5 text-slate-400" />}
            <div className={Icon ? 'mt-2 text-sm font-bold' : 'text-sm font-bold'}>{option.label}</div>
            {option.hint && <div className="mt-1 text-xs text-slate-500">{option.hint}</div>}
          </button>
        );
      })}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-2 text-xs font-semibold text-red-600">
        {error}
      </p>
    )}
  </div>
);

/* ---------------------------------------------------------------------------
   Component
--------------------------------------------------------------------------- */

interface HostOnboardingProps {
  onNavigate: (page: string) => void;
}

export default function HostOnboarding({ onNavigate }: HostOnboardingProps) {
  const [initialDraft] = useState<PersistedDraft | null>(() => loadDraft());

  const [form, setForm] = useState<HostFormState>(() => initialDraft?.form ?? INITIAL_FORM);
  const [chips, setChips] = useState<ChipSelections>(() => initialDraft?.chips ?? INITIAL_CHIPS);
  const [spaces, setSpaces] = useState<SpaceRow[]>(() => initialDraft?.spaces ?? [createSpace()]);
  const [requests, setRequests] = useState<RequestRow[]>(() => initialDraft?.requests ?? [createRequest()]);
  const [pin, setPin] = useState<MapPin | null>(() => initialDraft?.pin ?? null);
  const [currentStep, setCurrentStep] = useState<number>(() => initialDraft?.step ?? 1);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  const [uploads, setUploads] = useState<UploadMap>({});
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('draw');
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [geoStatus, setGeoStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState(initialDraft ? 'Saved on this device' : 'Not saved');

  /* -- validation helpers ------------------------------------------------- */

  const invalid = (key: ValidationKey): boolean => issues.some((issue) => issue.key === key);
  const messageFor = (key: ValidationKey): string | undefined =>
    issues.find((issue) => issue.key === key)?.message;
  const fieldClass = (key: FieldKey): string => controlClass(invalid(key));
  const fieldProps = (key: FieldKey) => ({
    id: key,
    'aria-invalid': invalid(key) ? (true as const) : undefined,
    'aria-describedby': invalid(key) ? `${key}-error` : undefined,
  });

  // The explicit type argument matters: without it `useCallback` widens the
  // returned signature to `Function`, and every call site silently loses its
  // key check.
  const clearIssue = useCallback<(key: ValidationKey) => void>((key) => {
    setIssues((previous) =>
      previous.some((issue) => issue.key === key)
        ? previous.filter((issue) => issue.key !== key)
        : previous,
    );
  }, []);

  const collectIssues = (): ValidationIssue[] => {
    const found: ValidationIssue[] = [];
    const add = (key: ValidationKey, message: string) => {
      if (!found.some((issue) => issue.key === key)) found.push({ key, message });
    };

    (REQUIRED_FIELDS[currentStep] ?? []).forEach(({ key, label }) => {
      const value = form[key];
      const missing = typeof value === 'boolean' ? !value : value.trim().length === 0;
      if (missing) add(key, `${label} is required.`);
    });

    if (currentStep === PROPERTY_STEP) {
      if (!form.propertyType) add('propertyType', 'Select the kind of property.');
      else if (form.propertyType === 'Other' && form.otherProperty.trim().length === 0) {
        add('otherProperty', 'Describe your property type.');
      }
    }
    if (currentStep === SPACES_STEP && !form.guestId) {
      add('guestId', 'Choose how guests are identified.');
    }
    if (currentStep === SERVICES_STEP && chips.services.length === 0) {
      add('services', 'Select at least one service guests can access.');
    }
    if (currentStep === DOCUMENTS_STEP && !uploads.registration) {
      add('registration', 'Upload the business / registration document.');
    }

    return found;
  };

  /* -- field updates ------------------------------------------------------ */

  function updateField<K extends FieldKey>(key: K, value: HostFormState[K]): void {
    setForm((previous) => ({ ...previous, [key]: value }));
    clearIssue(key);
  }

  const updateSpace = (id: string, key: keyof Omit<SpaceRow, 'id'>, value: string): void => {
    setSpaces((previous) => previous.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const updateRequest = (id: string, key: keyof Omit<RequestRow, 'id'>, value: string): void => {
    setRequests((previous) => previous.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const toggleChip = (group: ChipGroupKey, option: string): void => {
    setChips((previous) => {
      const current = previous[group];
      const next = current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option];
      return { ...previous, [group]: next };
    });
    if (group === 'services') clearIssue('services');
  };

  /* -- files -------------------------------------------------------------- */

  // Object URLs are a manual allocation: nothing revokes them on navigation, so
  // each replaced preview is revoked here and the remainder on unmount.
  const previewUrls = useRef<Partial<Record<UploadKey, string>>>({});
  useEffect(
    () => () => {
      PREVIEW_KEYS.forEach((key) => {
        const url = previewUrls.current[key];
        if (url) URL.revokeObjectURL(url);
      });
    },
    [],
  );

  const handleFile = (key: UploadKey, file: File | undefined, withPreview = false): void => {
    if (!file) return;
    if (withPreview) {
      const previous = previewUrls.current[key];
      if (previous) URL.revokeObjectURL(previous);
      const url = URL.createObjectURL(file);
      previewUrls.current[key] = url;
      setUploads((previousUploads) => ({ ...previousUploads, [key]: { name: file.name, previewUrl: url } }));
    } else {
      setUploads((previousUploads) => ({ ...previousUploads, [key]: { name: file.name } }));
    }
    // Only the registration document is a required field, so it is the only
    // upload that can be carrying a validation issue.
    if (key === 'registration') clearIssue('registration');
  };

  /* -- persistence -------------------------------------------------------- */

  const hydrated = useRef(false);
  useEffect(() => {
    if (submitted) return;
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const draft: PersistedDraft = {
      version: DRAFT_VERSION,
      form,
      chips,
      spaces,
      requests,
      pin,
      step: currentStep,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaveStatus('Saved just now');
    } catch {
      setSaveStatus('Not saved');
    }
  }, [form, chips, spaces, requests, pin, currentStep, submitted]);

  /* -- map ---------------------------------------------------------------- */

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const focusPin = useRef<((lat: number, lng: number, zoom: number) => void) | null>(null);
  const pinRef = useRef<MapPin | null>(pin);

  useEffect(() => {
    pinRef.current = pin;
  }, [pin]);

  // Keyed on the step, not on the pin: re-running on every pin update would tear
  // the map down mid-drag. The marker is driven imperatively through the
  // instance this effect owns.
  useEffect(() => {
    if (currentStep !== LOCATION_STEP) return;
    const container = mapContainer.current;
    if (!container || mapInstance.current) return;

    const restored = pinRef.current;
    const map = L.map(container, { scrollWheelZoom: false }).setView(
      restored ? [restored.lat, restored.lng] : [NAIROBI.lat, NAIROBI.lng],
      restored ? 15 : NAIROBI.zoom,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker: L.Marker | null = null;
    const placeMarker = (lat: number, lng: number) => {
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng], { draggable: true, icon: MAP_PIN_ICON }).addTo(map);
        marker.on('dragend', () => {
          const position = marker?.getLatLng();
          if (position) setPin({ lat: position.lat, lng: position.lng });
        });
      }
      setPin({ lat, lng });
    };

    map.on('click', (event: L.LeafletMouseEvent) => {
      map.setView(event.latlng, Math.max(map.getZoom(), 15));
      placeMarker(event.latlng.lat, event.latlng.lng);
    });

    focusPin.current = (lat: number, lng: number, zoom: number) => {
      map.setView([lat, lng], zoom);
      placeMarker(lat, lng);
    };

    if (restored) placeMarker(restored.lat, restored.lng);

    // The container is measured before a sibling fade-in has settled, so the
    // first measurement can be wrong and Leaflet draws tiles for the wrong size.
    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    mapInstance.current = map;

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      focusPin.current = null;
      mapInstance.current = null;
      // React 19 StrictMode runs effects twice in development; without remove()
      // the second run throws "Map container is already initialized".
      map.remove();
    };
  }, [currentStep]);

  const locateMe = (): void => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('Location is not available in this browser.');
      return;
    }
    setGeoStatus('Locating…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoStatus('');
        setPin({ lat: latitude, lng: longitude });
        focusPin.current?.(latitude, longitude, 16);
      },
      () => setGeoStatus('We could not read your location. Pick the point on the map instead.'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  /* -- signature ---------------------------------------------------------- */

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const drew = useRef(false);

  useEffect(() => {
    if (currentStep !== REVIEW_STEP || signatureMode !== 'draw') return;
    const element = canvas.current;
    if (!element) return;

    // The canvas is scaled by devicePixelRatio so strokes stay crisp on retina
    // screens; resizing the backing store clears it, which is why the drawn flag
    // resets with it.
    const resize = () => {
      const rect = element.getBoundingClientRect();
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      element.width = Math.max(1, Math.round(rect.width * ratio));
      element.height = Math.max(1, Math.round(rect.height * ratio));
      const context = element.getContext('2d');
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#0f172a';
      drew.current = false;
      setSignatureDrawn(false);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [currentStep, signatureMode]);

  const canvasPoint = (event: ReactPointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const element = canvas.current;
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const startStroke = (event: ReactPointerEvent<HTMLCanvasElement>): void => {
    if (!canvas.current) return;
    drawing.current = true;
    lastPoint.current = canvasPoint(event);
  };

  const extendStroke = (event: ReactPointerEvent<HTMLCanvasElement>): void => {
    if (!drawing.current) return;
    const context = canvas.current?.getContext('2d');
    const from = lastPoint.current;
    if (!context || !from) return;
    const to = canvasPoint(event);
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    lastPoint.current = to;
    if (!drew.current) {
      drew.current = true;
      setSignatureDrawn(true);
    }
  };

  const endStroke = (): void => {
    drawing.current = false;
    lastPoint.current = null;
  };

  const clearSignature = (): void => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (element && context) context.clearRect(0, 0, element.width, element.height);
    drew.current = false;
    setSignatureDrawn(false);
  };

  /* -- navigation --------------------------------------------------------- */

  const goToStep = (step: number): void => {
    setCurrentStep(step);
    setIssues([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (): void => {
    const found = collectIssues();
    setIssues(found);
    if (found.length > 0) return;
    removeDraft();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = (): void => {
    const found = collectIssues();
    setIssues(found);
    if (found.length > 0) return;
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
    else submit();
  };

  const goPrevious = (): void => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const startAnother = (): void => {
    removeDraft();
    setForm(INITIAL_FORM);
    setChips(INITIAL_CHIPS);
    setSpaces([createSpace()]);
    setRequests([createRequest()]);
    setPin(null);
    setUploads({});
    setIssues([]);
    setCurrentStep(1);
    setSignatureMode('draw');
    setSignatureDrawn(false);
    setGeoStatus('');
    setSaveStatus('Not saved');
    setSubmitted(false);
  };

  /* -- derived ------------------------------------------------------------ */

  const activeStep = STEPS[currentStep - 1];
  const isLastStep = currentStep === TOTAL_STEPS;
  const progress = (currentStep / TOTAL_STEPS) * 100;

  const agreementDate = useMemo(
    () => new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }),
    [],
  );

  const review = useMemo(() => {
    const shown = (value: string): string => (value.trim().length > 0 ? value : '—');
    return {
      hostName: shown(form.contactName),
      hostMeta: `${shown(form.hostRole)} · ${shown(form.contactEmail)}`,
      propertyName: shown(form.propertyName),
      propertyMeta: `${shown(form.propertyType)} · ${shown(form.city)}`,
      spaceCount: spaces.length,
      capacity: shown(form.guestCapacity),
      services: chips.services,
      amenities: chips.amenities,
      location: `${shown(form.neighbourhood)}, ${shown(form.city)}`,
      coordinates: pin ? `${pin.lat.toFixed(7)}, ${pin.lng.toFixed(7)}` : 'Map pin not set',
    };
  }, [form, spaces, chips, pin]);

  const signatureLine =
    signatureMode === 'type' ? form.signatoryName : signatureDrawn ? 'Signed electronically' : '';

  /* -- success screen ----------------------------------------------------- */

  const renderSuccess = () => (
    <div className="success-settle rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-xl sm:p-12">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
        <Check className="h-9 w-9 text-emerald-600" strokeWidth={3} />
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Application received
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        You're ready for verification.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
        Your host application for <strong className="text-slate-800">{form.propertyName || 'your property'}</strong>{' '}
        has been captured. NEXG can now verify the property and configure the host workspace.
      </p>
      <div className="mx-auto mt-7 max-w-md space-y-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-left text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Property</span>
          <strong className="text-slate-900">{form.propertyName || '—'}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Type</span>
          <strong className="text-slate-900">{form.propertyType || '—'}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Location</span>
          <strong className="text-slate-900">
            {form.neighbourhood || '—'}, {form.city || '—'}
          </strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Status</span>
          <strong className="text-amber-600">Pending verification</strong>
        </div>
      </div>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
        >
          <Printer className="h-4 w-4" />
          Save / Print
        </button>
        <button
          type="button"
          onClick={startAnother}
          className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700"
        >
          Start another
        </button>
        <button
          type="button"
          onClick={() => onNavigate('properties')}
          className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900"
        >
          Back to host portal
        </button>
      </div>
    </div>
  );

  /* -- review step -------------------------------------------------------- */

  const renderReview = () => (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={CARD}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Host</div>
          <div className="mt-1 font-display font-extrabold text-slate-900">{review.hostName}</div>
          <div className="mt-1 text-xs text-slate-500">{review.hostMeta}</div>
        </div>
        <div className={CARD}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Property</div>
          <div className="mt-1 font-display font-extrabold text-slate-900">{review.propertyName}</div>
          <div className="mt-1 text-xs text-slate-500">{review.propertyMeta}</div>
        </div>
        <div className={CARD}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spaces</div>
          <div className="mt-1 font-display font-extrabold text-slate-900">{review.spaceCount} configured</div>
          <div className="mt-1 text-xs text-slate-500">{review.capacity} guest capacity</div>
        </div>
        <div className={CARD}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Services</div>
          <div className="mt-1 font-display font-extrabold text-slate-900">
            {review.services.length} selected
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {review.services.slice(0, 4).join(', ')}
            {review.services.length > 4 ? '…' : ''}
          </div>
        </div>
        <div className={CARD}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Property features</div>
          <div className="mt-2 text-xs text-slate-600">
            {review.amenities.slice(0, 8).join(' · ') || 'None selected'}
          </div>
        </div>
        <div className={CARD}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</div>
          <div className="mt-1 font-display font-extrabold text-slate-900">{review.location}</div>
          <div className="mt-1 text-xs text-slate-500">{review.coordinates}</div>
        </div>
      </div>

      <div className="mb-6 max-h-[390px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-inner sm:p-7">
        <div className="mb-6 border-b border-slate-200 pb-5 text-center">
          <div className="font-display text-2xl font-extrabold text-slate-950">NEXG</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-amber-600">
            Host Partnership &amp; Property Setup
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Effective date: <span>{agreementDate}</span>
          </div>
        </div>
        <p>
          This Host Partnership &amp; Property Setup Agreement is between{' '}
          <strong>NEXG Concierge Limited</strong> and the host / property represented in this submission.
        </p>
        <h4 className="mb-1 mt-5 font-bold text-slate-950">1. Property representation</h4>
        <p>
          The Host confirms that the information supplied about the property, its operating model,
          guest-accessible spaces and services is accurate to the best of their knowledge and that they are
          authorized to provide it.
        </p>
        <h4 className="mb-1 mt-5 font-bold text-slate-950">2. Property operations</h4>
        <p>
          The Host remains responsible for the operation, safety, licensing, staffing, availability, pricing and
          fulfillment of property services. NEXG may coordinate guest requests, transactions and related
          workflows according to the agreed configuration.
        </p>
        <h4 className="mb-1 mt-5 font-bold text-slate-950">3. Guest experience</h4>
        <p>
          The Host agrees to maintain accurate property information and reasonable service availability, and to
          notify NEXG of material changes that could affect guest fulfillment.
        </p>
        <h4 className="mb-1 mt-5 font-bold text-slate-950">4. Data &amp; verification</h4>
        <p>
          Submitted information may be reviewed for onboarding, verification, operations, support, settlement
          and guest-experience purposes. Additional verification may be requested before activation.
        </p>
        <h4 className="mb-1 mt-5 font-bold text-slate-950">5. Acceptance</h4>
        <p>
          By signing below, the authorized representative confirms that the submission is accurate and accepts
          the applicable NEXG host partnership terms presented during onboarding.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-500">For NEXG Concierge Limited</div>
            <div className="mt-7 font-warm text-2xl text-slate-400">NEXG Operations</div>
            <div className="mt-1 h-px bg-slate-300" />
            <div className="mt-1 text-[10px] text-slate-500">Authorized representative</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-500">For Host</div>
            <div className="mt-7 min-h-[32px] font-warm text-2xl text-amber-600">{signatureLine}</div>
            <div className="mt-1 h-px bg-slate-300" />
            <div className="mt-1 text-[10px] text-slate-500">
              Authorized signatory: <span>{form.signatoryName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${CARD} space-y-5`}>
        <Field
          htmlFor="signatoryName"
          label="Authorized signatory name"
          required
          error={messageFor('signatoryName')}
        >
          <input
            className={fieldClass('signatoryName')}
            placeholder="Full legal name"
            value={form.signatoryName}
            onChange={(event) => updateField('signatoryName', event.target.value)}
            {...fieldProps('signatoryName')}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-800">Signature method</span>
            <div role="group" aria-label="Signature method" className="flex rounded-xl bg-slate-200 p-1">
              {(['draw', 'type'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={signatureMode === mode}
                  onClick={() => {
                    setSignatureMode(mode);
                    drew.current = false;
                    setSignatureDrawn(false);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold capitalize transition ${
                    signatureMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs font-bold text-slate-500 transition hover:text-slate-900"
            >
              Clear signature
            </button>
          </div>
        </div>

        {signatureMode === 'draw' ? (
          <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white">
            <canvas
              ref={canvas}
              aria-label="Signature pad"
              className="block h-36 w-full cursor-crosshair touch-none"
              onPointerDown={startStroke}
              onPointerMove={extendStroke}
              onPointerUp={endStroke}
              onPointerLeave={endStroke}
            />
          </div>
        ) : (
          <div className="flex min-h-[90px] items-center justify-center rounded-2xl border border-slate-200 bg-white font-warm text-4xl text-amber-600">
            {form.signatoryName || 'Your Signature'}
          </div>
        )}

        <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-400/10 p-4">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-amber-500"
            checked={form.termsAccepted}
            onChange={(event) => updateField('termsAccepted', event.target.checked)}
            {...fieldProps('termsAccepted')}
          />
          <span className="text-xs text-slate-700 sm:text-sm">
            I confirm that I am authorized to represent this property and that the information submitted is
            accurate. I agree to the applicable NEXG host partnership terms.
          </span>
        </label>
        {invalid('termsAccepted') && (
          <p id="termsAccepted-error" className="text-xs font-semibold text-red-600">
            {messageFor('termsAccepted')}
          </p>
        )}
      </div>
    </>
  );

  /* -- wizard ------------------------------------------------------------- */

  const renderWizard = () => (
    <>
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-display text-xs font-bold text-amber-600 sm:text-sm">HOST SETUP</span>
            <span className="text-slate-300">/</span>
            <span className="truncate text-xs font-semibold text-slate-700 sm:text-sm">{activeStep.title}</span>
          </div>
          <span className="shrink-0 font-display text-xs font-bold text-slate-800 sm:text-sm">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 shadow-inner">
          {/* scaleX rather than width. Animating width relayouts the bar and
              everything beside it on every step; a transform is composited and
              costs nothing. The bar is drawn full width and scaled from the left. */}
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-[#E5B65F] via-[#D2A24A] to-[#B88728] transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` }}
          />
        </div>
        <div className="mt-3 hidden justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:flex">
          {STEPS.map((step) => (
            <span key={step.title}>{step.legend}</span>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-7 text-white sm:px-9 sm:py-8">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-gradient-to-tr from-[#E5B65F] to-[#B88728] opacity-20 blur-3xl" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              <House className="h-3.5 w-3.5" />
              Property partner
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Bring your property into NEXG.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Tell us what exists, what guests can access, and how your team operates. We'll use this to build
              your property profile and guest experience.
            </p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            goNext();
          }}
          className="px-4 py-7 sm:px-8 sm:py-9 lg:px-10"
        >
          <StepHeading icon={activeStep.icon} title={activeStep.title} blurb={activeStep.blurb} />

          {currentStep === ABOUT_STEP && (
            <div className={`${CARD} space-y-6`}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field htmlFor="contactName" label="Full name" required error={messageFor('contactName')}>
                  <input
                    className={fieldClass('contactName')}
                    placeholder="Your full name"
                    value={form.contactName}
                    onChange={(event) => updateField('contactName', event.target.value)}
                    {...fieldProps('contactName')}
                  />
                </Field>

                <Field htmlFor="hostRole" label="Role" required error={messageFor('hostRole')}>
                  <select
                    className={fieldClass('hostRole')}
                    value={form.hostRole}
                    onChange={(event) => updateField('hostRole', event.target.value)}
                    {...fieldProps('hostRole')}
                  >
                    <option value="">Select your role</option>
                    {HOST_ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field htmlFor="contactPhone" label="Phone number" required error={messageFor('contactPhone')}>
                  <input
                    type="tel"
                    className={fieldClass('contactPhone')}
                    placeholder="+254 7XX XXX XXX"
                    value={form.contactPhone}
                    onChange={(event) => updateField('contactPhone', event.target.value)}
                    {...fieldProps('contactPhone')}
                  />
                </Field>

                <Field htmlFor="contactEmail" label="Email address" required error={messageFor('contactEmail')}>
                  <input
                    type="email"
                    className={fieldClass('contactEmail')}
                    placeholder="you@example.com"
                    value={form.contactEmail}
                    onChange={(event) => updateField('contactEmail', event.target.value)}
                    {...fieldProps('contactEmail')}
                  />
                </Field>

                <Field htmlFor="contactWhatsapp" label="WhatsApp number">
                  <input
                    type="tel"
                    className={fieldClass('contactWhatsapp')}
                    placeholder="+254 7XX XXX XXX"
                    value={form.contactWhatsapp}
                    onChange={(event) => updateField('contactWhatsapp', event.target.value)}
                    {...fieldProps('contactWhatsapp')}
                  />
                </Field>

                <Field htmlFor="preferredContact" label="Preferred contact method">
                  <select
                    className={fieldClass('preferredContact')}
                    value={form.preferredContact}
                    onChange={(event) => updateField('preferredContact', event.target.value)}
                    {...fieldProps('preferredContact')}
                  >
                    {CONTACT_METHOD_OPTIONS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <RadioGroup
                  id="portfolio"
                  label="Are you onboarding more than one property?"
                  options={PORTFOLIO_OPTIONS}
                  value={form.portfolio}
                  onChange={(value) => updateField('portfolio', value)}
                  error={messageFor('portfolio')}
                  gridClassName="grid grid-cols-1 gap-3 sm:grid-cols-3"
                />
              </div>
            </div>
          )}

          {currentStep === PROPERTY_STEP && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field htmlFor="propertyName" label="Property name" required error={messageFor('propertyName')}>
                  <input
                    className={fieldClass('propertyName')}
                    placeholder="e.g. The River House"
                    value={form.propertyName}
                    onChange={(event) => updateField('propertyName', event.target.value)}
                    {...fieldProps('propertyName')}
                  />
                </Field>

                <Field
                  htmlFor="legalEntity"
                  label="Legal / operating entity"
                  required
                  error={messageFor('legalEntity')}
                >
                  <input
                    className={fieldClass('legalEntity')}
                    placeholder="Registered company or operating name"
                    value={form.legalEntity}
                    onChange={(event) => updateField('legalEntity', event.target.value)}
                    {...fieldProps('legalEntity')}
                  />
                </Field>
              </div>

              <div>
                <RadioGroup
                  id="propertyType"
                  label="What kind of property is it?"
                  required
                  options={PROPERTY_TYPE_OPTIONS}
                  value={form.propertyType}
                  onChange={(value) => {
                    const match = PROPERTY_TYPE_OPTIONS.find((option) => option.value === value);
                    updateField('propertyType', match ? match.value : '');
                  }}
                  error={messageFor('propertyType')}
                  gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                />
                {form.propertyType === 'Other' && (
                  <div className="mt-4">
                    <Field htmlFor="otherProperty" label="Property type" error={messageFor('otherProperty')}>
                      <input
                        className={fieldClass('otherProperty')}
                        placeholder="Describe your property type"
                        value={form.otherProperty}
                        onChange={(event) => updateField('otherProperty', event.target.value)}
                        {...fieldProps('otherProperty')}
                      />
                    </Field>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Field
                  htmlFor="unitCount"
                  label="Rooms / units"
                  labelClassName={COMPACT_LABEL}
                >
                  <input
                    type="number"
                    min={0}
                    className={fieldClass('unitCount')}
                    placeholder="0"
                    value={form.unitCount}
                    onChange={(event) => updateField('unitCount', event.target.value)}
                    {...fieldProps('unitCount')}
                  />
                </Field>
                <Field
                  htmlFor="floorCount"
                  label="Floors"
                  labelClassName={COMPACT_LABEL}
                >
                  <input
                    type="number"
                    min={0}
                    className={fieldClass('floorCount')}
                    placeholder="0"
                    value={form.floorCount}
                    onChange={(event) => updateField('floorCount', event.target.value)}
                    {...fieldProps('floorCount')}
                  />
                </Field>
                <Field
                  htmlFor="guestCapacity"
                  label="Guest capacity"
                  labelClassName={COMPACT_LABEL}
                >
                  <input
                    type="number"
                    min={0}
                    className={fieldClass('guestCapacity')}
                    placeholder="0"
                    value={form.guestCapacity}
                    onChange={(event) => updateField('guestCapacity', event.target.value)}
                    {...fieldProps('guestCapacity')}
                  />
                </Field>
                <Field
                  htmlFor="yearOpened"
                  label="Year opened"
                  labelClassName={COMPACT_LABEL}
                >
                  <input
                    type="number"
                    min={1800}
                    max={2100}
                    className={fieldClass('yearOpened')}
                    placeholder="2026"
                    value={form.yearOpened}
                    onChange={(event) => updateField('yearOpened', event.target.value)}
                    {...fieldProps('yearOpened')}
                  />
                </Field>
              </div>

              <ChipGroup
                id="amenityChips"
                label="What does the property include?"
                options={AMENITY_OPTIONS}
                selected={chips.amenities}
                onToggle={(option) => toggleChip('amenities', option)}
              />

              <Field htmlFor="propertyDescription" label="Tell guests about the property">
                <textarea
                  rows={3}
                  maxLength={500}
                  className={fieldClass('propertyDescription')}
                  placeholder="Short description of the property, atmosphere and what makes it distinctive..."
                  value={form.propertyDescription}
                  onChange={(event) => updateField('propertyDescription', event.target.value)}
                  {...fieldProps('propertyDescription')}
                />
              </Field>
            </div>
          )}

          {currentStep === LOCATION_STEP && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field htmlFor="address" label="Address / street" required error={messageFor('address')}>
                  <input
                    className={fieldClass('address')}
                    placeholder="Building, street or road"
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    {...fieldProps('address')}
                  />
                </Field>
                <Field
                  htmlFor="neighbourhood"
                  label="Area / neighbourhood"
                  required
                  error={messageFor('neighbourhood')}
                >
                  <input
                    className={fieldClass('neighbourhood')}
                    placeholder="e.g. Kilimani"
                    value={form.neighbourhood}
                    onChange={(event) => updateField('neighbourhood', event.target.value)}
                    {...fieldProps('neighbourhood')}
                  />
                </Field>
                <Field htmlFor="city" label="City" required error={messageFor('city')}>
                  <input
                    className={fieldClass('city')}
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    {...fieldProps('city')}
                  />
                </Field>
                <Field htmlFor="region" label="County / region">
                  <input
                    className={fieldClass('region')}
                    value={form.region}
                    onChange={(event) => updateField('region', event.target.value)}
                    {...fieldProps('region')}
                  />
                </Field>
              </div>

              <div className={CARD}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900">Pin the property</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Tap or click the map to set the exact property point.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={locateMe}
                      className="flex items-center gap-1 whitespace-nowrap text-xs font-bold text-slate-500 transition hover:text-slate-900"
                    >
                      <LocateFixed className="h-3.5 w-3.5" />
                      Use my location
                    </button>
                    <button
                      type="button"
                      onClick={() => focusPin.current?.(NAIROBI.lat, NAIROBI.lng, 15)}
                      className="flex items-center gap-1 whitespace-nowrap text-xs font-bold text-amber-600 transition hover:text-amber-700"
                    >
                      <Crosshair className="h-3.5 w-3.5" />
                      Nairobi
                    </button>
                  </div>
                </div>

                {/* Rendered only on this step so the container exists before the
                    map effect runs, and is measured at its final size. */}
                <div ref={mapContainer} className="h-[240px] w-full overflow-hidden rounded-2xl sm:h-[310px]" />

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Latitude</div>
                    <div className="text-sm font-bold text-slate-800">
                      {pin ? pin.lat.toFixed(7) : '—'}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Longitude</div>
                    <div className="text-sm font-bold text-slate-800">
                      {pin ? pin.lng.toFixed(7) : '—'}
                    </div>
                  </div>
                </div>
                {geoStatus && <p className="mt-3 text-xs font-semibold text-slate-500">{geoStatus}</p>}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field htmlFor="directions" label="How should guests find you?">
                  <textarea
                    rows={3}
                    className={fieldClass('directions')}
                    placeholder="Landmarks, gate instructions, building name, entrance, etc."
                    value={form.directions}
                    onChange={(event) => updateField('directions', event.target.value)}
                    {...fieldProps('directions')}
                  />
                </Field>
                <Field htmlFor="arrivalInstructions" label="Check-in / arrival instructions">
                  <textarea
                    rows={3}
                    className={fieldClass('arrivalInstructions')}
                    placeholder="Reception desk, access code process, security desk, host contact, etc."
                    value={form.arrivalInstructions}
                    onChange={(event) => updateField('arrivalInstructions', event.target.value)}
                    {...fieldProps('arrivalInstructions')}
                  />
                </Field>
              </div>
            </div>
          )}

          {currentStep === SPACES_STEP && (
            <div className="space-y-5">
              <div className="space-y-3">
                {spaces.map((space, index) => (
                  <div key={space.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-sm font-bold text-slate-800">{index + 1}. Space / unit type</div>
                      <button
                        type="button"
                        aria-label={`Remove space ${index + 1}`}
                        onClick={() => setSpaces((previous) => previous.filter((row) => row.id !== space.id))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <select
                        aria-label={`Space ${index + 1} type`}
                        className={controlClass(false)}
                        value={space.type}
                        onChange={(event) => updateSpace(space.id, 'type', event.target.value)}
                      >
                        {SPACE_TYPE_OPTIONS.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label={`Space ${index + 1} name`}
                        className={controlClass(false)}
                        placeholder="Name / label"
                        value={space.name}
                        onChange={(event) => updateSpace(space.id, 'name', event.target.value)}
                      />
                      <input
                        type="number"
                        min={0}
                        aria-label={`Space ${index + 1} number of units`}
                        className={controlClass(false)}
                        placeholder="Number"
                        value={space.count}
                        onChange={(event) => updateSpace(space.id, 'count', event.target.value)}
                      />
                      <input
                        type="number"
                        min={0}
                        aria-label={`Space ${index + 1} capacity`}
                        className={controlClass(false)}
                        placeholder="Capacity"
                        value={space.capacity}
                        onChange={(event) => updateSpace(space.id, 'capacity', event.target.value)}
                      />
                    </div>
                    <input
                      aria-label={`Space ${index + 1} notes`}
                      className={`${controlClass(false)} mt-3`}
                      placeholder="Optional notes, amenities or access details"
                      value={space.notes}
                      onChange={(event) => updateSpace(space.id, 'notes', event.target.value)}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSpaces((previous) => [...previous, createSpace()])}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-bold text-slate-600 transition-colors hover:border-amber-400 hover:bg-amber-400/10 hover:text-slate-900"
              >
                <Plus className="h-4 w-4" />
                Add a space / unit type
              </button>

              <div className={CARD}>
                <RadioGroup
                  id="guestId"
                  label="How are guests identified within the property?"
                  options={GUEST_ID_OPTIONS}
                  value={form.guestId}
                  onChange={(value) => updateField('guestId', value)}
                  error={messageFor('guestId')}
                  gridClassName="grid grid-cols-1 gap-3 sm:grid-cols-2"
                />
              </div>
            </div>
          )}

          {currentStep === ACCESS_STEP && (
            <div className={CARD}>
              <ChipGroup
                id="accessChips"
                label="Property access"
                hint="Which areas can guests access during a normal stay?"
                options={ACCESS_OPTIONS}
                selected={chips.access}
                onToggle={(option) => toggleChip('access', option)}
              />
            </div>
          )}

          {currentStep === SERVICES_STEP && (
            <div className="space-y-6">
              <ChipGroup
                id="serviceChips"
                label="What can guests access or request?"
                required
                options={SERVICE_OPTIONS}
                selected={chips.services}
                onToggle={(option) => toggleChip('services', option)}
                error={messageFor('services')}
              />

              <div className={CARD}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900">Examples of guest requests</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Add the requests your team actually handles today.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequests((previous) => [...previous, createRequest()])}
                    className="flex items-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {requests.map((request, index) => (
                    <div
                      key={request.id}
                      className="grid grid-cols-1 gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-2 lg:grid-cols-4"
                    >
                      <input
                        aria-label={`Request ${index + 1} name`}
                        className={controlClass(false)}
                        placeholder="Request / service"
                        value={request.name}
                        onChange={(event) => updateRequest(request.id, 'name', event.target.value)}
                      />
                      <input
                        aria-label={`Request ${index + 1} owner`}
                        className={controlClass(false)}
                        placeholder="Who fulfills it?"
                        value={request.owner}
                        onChange={(event) => updateRequest(request.id, 'owner', event.target.value)}
                      />
                      <input
                        aria-label={`Request ${index + 1} price`}
                        className={controlClass(false)}
                        placeholder="Price (optional)"
                        value={request.price}
                        onChange={(event) => updateRequest(request.id, 'price', event.target.value)}
                      />
                      <div className="flex gap-2">
                        <select
                          aria-label={`Request ${index + 1} channel`}
                          className={controlClass(false)}
                          value={request.channel}
                          onChange={(event) => updateRequest(request.id, 'channel', event.target.value)}
                        >
                          {REQUEST_ROW_CHANNEL_OPTIONS.map((channel) => (
                            <option key={channel} value={channel}>
                              {channel}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          aria-label={`Remove request ${index + 1}`}
                          onClick={() =>
                            setRequests((previous) => previous.filter((row) => row.id !== request.id))
                          }
                          className="flex w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Field
                htmlFor="nexgOpportunity"
                label="What would you like NEXG to help you expose to guests?"
              >
                <textarea
                  rows={3}
                  className={fieldClass('nexgOpportunity')}
                  placeholder="Anything you currently struggle to make visible, bookable, purchasable or easy for guests to request..."
                  value={form.nexgOpportunity}
                  onChange={(event) => updateField('nexgOpportunity', event.target.value)}
                  {...fieldProps('nexgOpportunity')}
                />
              </Field>
            </div>
          )}

          {currentStep === OPERATIONS_STEP && (
            <div className="space-y-6">
              <div className={CARD}>
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900">Operating model</h3>
                    <p className="mt-1 text-xs text-slate-500">How is the property staffed?</p>
                  </div>
                  <select
                    aria-label="Operating model"
                    className={`${controlClass(false)} sm:w-64`}
                    value={form.operatingModel}
                    onChange={(event) => updateField('operatingModel', event.target.value)}
                  >
                    {OPERATING_MODEL_OPTIONS.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field htmlFor="checkIn" label="Check-in time">
                    <input
                      type="time"
                      className={fieldClass('checkIn')}
                      value={form.checkIn}
                      onChange={(event) => updateField('checkIn', event.target.value)}
                      {...fieldProps('checkIn')}
                    />
                  </Field>
                  <Field htmlFor="checkOut" label="Check-out time">
                    <input
                      type="time"
                      className={fieldClass('checkOut')}
                      value={form.checkOut}
                      onChange={(event) => updateField('checkOut', event.target.value)}
                      {...fieldProps('checkOut')}
                    />
                  </Field>
                </div>
              </div>

              <ChipGroup
                id="departmentChips"
                label="Departments / teams available"
                options={DEPARTMENT_OPTIONS}
                selected={chips.departments}
                onToggle={(option) => toggleChip('departments', option)}
              />

              <div className={CARD}>
                <RadioGroup
                  id="requestChannel"
                  label="How do guest requests reach your team today?"
                  options={REQUEST_CHANNEL_OPTIONS}
                  value={form.requestChannel}
                  onChange={(value) => updateField('requestChannel', value)}
                  error={messageFor('requestChannel')}
                  gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field htmlFor="requestOwner" label="Who should receive NEXG requests?">
                  <input
                    className={fieldClass('requestOwner')}
                    placeholder="e.g. Front office, duty manager"
                    value={form.requestOwner}
                    onChange={(event) => updateField('requestOwner', event.target.value)}
                    {...fieldProps('requestOwner')}
                  />
                </Field>
                <Field htmlFor="fulfillmentTime" label="Typical request fulfillment time">
                  <select
                    className={fieldClass('fulfillmentTime')}
                    value={form.fulfillmentTime}
                    onChange={(event) => updateField('fulfillmentTime', event.target.value)}
                    {...fieldProps('fulfillmentTime')}
                  >
                    {FULFILLMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {currentStep === COMMERCE_STEP && (
            <div className="space-y-6">
              <div className={CARD}>
                <ChipGroup
                  id="transactionChips"
                  label="What do you want guests to transact for?"
                  options={TRANSACTION_OPTIONS}
                  selected={chips.transactions}
                  onToggle={(option) => toggleChip('transactions', option)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field htmlFor="currency" label="Currency">
                  <select
                    className={fieldClass('currency')}
                    value={form.currency}
                    onChange={(event) => updateField('currency', event.target.value)}
                    {...fieldProps('currency')}
                  >
                    {CURRENCY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field htmlFor="taxSetup" label="Tax / pricing setup">
                  <select
                    className={fieldClass('taxSetup')}
                    value={form.taxSetup}
                    onChange={(event) => updateField('taxSetup', event.target.value)}
                    {...fieldProps('taxSetup')}
                  >
                    {TAX_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className={CARD}>
                <h3 className="mb-4 font-display font-extrabold text-slate-900">Settlement account</h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field htmlFor="bankName" label="Bank name">
                    <input
                      className={fieldClass('bankName')}
                      placeholder="e.g. KCB, Equity, NCBA"
                      value={form.bankName}
                      onChange={(event) => updateField('bankName', event.target.value)}
                      {...fieldProps('bankName')}
                    />
                  </Field>
                  <Field htmlFor="accountName" label="Account name">
                    <input
                      className={fieldClass('accountName')}
                      placeholder="Account holder name"
                      value={form.accountName}
                      onChange={(event) => updateField('accountName', event.target.value)}
                      {...fieldProps('accountName')}
                    />
                  </Field>
                  <Field htmlFor="accountNumber" label="Account number">
                    <input
                      className={fieldClass('accountNumber')}
                      placeholder="Account number"
                      value={form.accountNumber}
                      onChange={(event) => updateField('accountNumber', event.target.value)}
                      {...fieldProps('accountNumber')}
                    />
                  </Field>
                  <Field htmlFor="mpesa" label="M-PESA Till / Paybill">
                    <input
                      className={fieldClass('mpesa')}
                      placeholder="Optional"
                      value={form.mpesa}
                      onChange={(event) => updateField('mpesa', event.target.value)}
                      {...fieldProps('mpesa')}
                    />
                  </Field>
                </div>
                <p className="mt-4 flex items-center gap-1 text-[11px] text-slate-400">
                  <Lock className="h-3 w-3" />
                  Settlement details should be verified before activation. Do not use this form for card or
                  wallet credentials.
                </p>
              </div>
            </div>
          )}

          {currentStep === DOCUMENTS_STEP && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label
                  className={`${CARD} block cursor-pointer transition hover:border-amber-300 ${
                    invalid('registration') ? 'border-red-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Business / registration document <span className="text-red-500">*</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">PDF, JPG or PNG</p>
                    </div>
                    <FileText className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="peer sr-only"
                    onChange={(event) => handleFile('registration', event.target.files?.[0])}
                  />
                  {uploads.registration && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <CircleCheck className="h-3.5 w-3.5" />
                      {uploads.registration.name}
                    </div>
                  )}
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-600 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400/40">
                    Choose file
                  </div>
                  {invalid('registration') && (
                    <p className="mt-2 text-xs font-semibold text-red-600">{messageFor('registration')}</p>
                  )}
                </label>

                <label className={`${CARD} block cursor-pointer transition hover:border-amber-300`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-800">Property / operating permit</div>
                      <p className="mt-1 text-xs text-slate-500">If applicable</p>
                    </div>
                    <Stamp className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="peer sr-only"
                    onChange={(event) => handleFile('permit', event.target.files?.[0])}
                  />
                  {uploads.permit && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <CircleCheck className="h-3.5 w-3.5" />
                      {uploads.permit.name}
                    </div>
                  )}
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-600 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400/40">
                    Choose file
                  </div>
                </label>
              </div>

              <div className={CARD}>
                <h3 className="mb-4 flex items-center gap-2 font-display font-extrabold text-slate-900">
                  <Palette className="h-4 w-4 text-amber-500" />
                  Guest-facing brand
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="cursor-pointer">
                    <span className="mb-2 block text-sm font-semibold text-slate-800">Property logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="peer sr-only"
                      onChange={(event) => handleFile('logo', event.target.files?.[0], true)}
                    />
                    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400/40 hover:border-amber-400">
                      {uploads.logo?.previewUrl && (
                        <img
                          src={uploads.logo.previewUrl}
                          alt={`${uploads.logo.name} preview`}
                          className="absolute inset-0 h-full w-full bg-white object-contain p-4"
                        />
                      )}
                      <div className="text-center text-slate-400">
                        <ImageIcon className="mx-auto h-8 w-8" />
                        <div className="mt-2 text-xs font-bold">Upload square logo</div>
                      </div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <span className="mb-2 block text-sm font-semibold text-slate-800">Property cover image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="peer sr-only"
                      onChange={(event) => handleFile('cover', event.target.files?.[0], true)}
                    />
                    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400/40 hover:border-amber-400">
                      {uploads.cover?.previewUrl && (
                        <img
                          src={uploads.cover.previewUrl}
                          alt={`${uploads.cover.name} preview`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                      <div className="text-center text-slate-400">
                        <Images className="mx-auto h-8 w-8" />
                        <div className="mt-2 text-xs font-bold">Upload 16:9 cover image</div>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="mt-5">
                  <Field htmlFor="website" label="Website / booking page">
                    <input
                      type="url"
                      className={fieldClass('website')}
                      placeholder="https://example.com"
                      value={form.website}
                      onChange={(event) => updateField('website', event.target.value)}
                      {...fieldProps('website')}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {currentStep === REVIEW_STEP && renderReview()}
        </form>

        <div className="sticky bottom-0 z-40 border-t border-slate-100 bg-slate-50/70 px-4 py-5 sm:static sm:px-8 print:hidden">
          {issues.length > 0 && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-3 rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3"
            >
              <CircleAlert className="mt-px h-4 w-4 shrink-0 text-red-500" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">
                  Please complete the highlighted fields before continuing.
                </p>
                <ul className="mt-1 list-inside list-disc space-y-0.5 font-medium text-slate-700">
                  {issues.map((issue) => (
                    <li key={issue.key}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={goPrevious}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:text-slate-900 sm:px-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
            ) : (
              <span />
            )}
            <div className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Your progress is saved locally on this device.
            </div>
            <button type="button" onClick={goNext} className={`ml-auto ${PRIMARY_BUTTON}`}>
              {isLastStep ? 'Submit Host Application' : 'Continue'}
              {isLastStep ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="onboarding-theme min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-[#E5B65F] selection:text-black">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('properties')}
              aria-label="Back to the host portal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-display text-lg font-extrabold tracking-tight text-white">
              N
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold tracking-tight text-slate-950">NEXG</div>
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
                Host onboarding
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs font-semibold text-slate-500 sm:flex">
            <span>Host Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Property setup</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <span>{saveStatus}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        {submitted ? renderSuccess() : renderWizard()}
      </main>
    </div>
  );
}
