// src/lib/datetime.ts
//
// Calendar arithmetic and formatting for the date/time controls.
//
// WHY A SEPARATE MODULE: every one of these functions has an off-by-one or a
// timezone trap in it, and the traps are the kind that look correct in review.
// They are isolated here so they can be reasoned about once, and so the component
// file reads as layout rather than as arithmetic.
//
// THE TIMEZONE RULE, which is the one that actually bites:
//   `new Date()` is an INSTANT, and `getFullYear()`/`getMonth()`/`getDate()` read it
//   back in the LOCAL zone. `toISOString()` converts to UTC. Mixing the two shifts
//   the calendar day by one for any timezone east or west of UTC — which includes
//   Nairobi (UTC+3), so a midnight-local date would render as the previous day.
//
//   Therefore: calendar days are handled as local dates built at midday, never at
//   midnight. Midday is at least 12 hours from either boundary in every timezone, so
//   no conversion can push it onto a neighbouring day. `toISODate` is the only place
//   a date becomes a string, and it reads local fields rather than converting.

/** Midnight local, used only for comparison keys. */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * A local date at midday. Use this whenever a value will be stored, compared across
 * days, or converted to a string — see the timezone rule above.
 */
export function atMidday(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Negative when `a` is earlier. Compares whole days, ignoring time of day. */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return compareDays(a, b) < 0;
}

export function isAfterDay(a: Date, b: Date): boolean {
  return compareDays(a, b) > 0;
}

/** Inclusive on both ends, which is what a `minimumDate`/`maximumDate` pair means. */
export function isWithinDays(date: Date, min?: Date | null, max?: Date | null): boolean {
  if (min && isBeforeDay(date, min)) return false;
  if (max && isAfterDay(date, max)) return false;
  return true;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  // Set the day to the 1st before shifting the month. Without this, moving from
  // 31 January to February lands on 3 March, because `setMonth` overflows a day
  // that does not exist rather than clamping to the last valid day.
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Sunday-first, matching `getDay()`. */
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export interface CalendarCell {
  date: Date;
  /** False for the leading/trailing days that pad the grid to whole weeks. */
  inMonth: boolean;
}

/**
 * The calendar grid for one month, padded to whole weeks.
 *
 * Built at midday so no cell can drift across a day boundary when it is formatted
 * or compared.
 */
export function buildCalendarGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month, 1, 12, 0, 0, 0);
  const leading = first.getDay(); // 0 = Sunday, so this is how many blanks precede it
  const total = daysInMonth(year, month);

  const cells: CalendarCell[] = [];

  for (let i = leading; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i, 12, 0, 0, 0), inMonth: false });
  }
  for (let day = 1; day <= total; day++) {
    cells.push({ date: new Date(year, month, day, 12, 0, 0, 0), inMonth: true });
  }
  // Pad to whole weeks so the grid height does not jump between months.
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: addDays(last, 1), inMonth: false });
  }

  return cells;
}

// ------------------------------------------------------------------ conversion

const pad = (n: number) => String(n).padStart(2, '0');

/** `YYYY-MM-DD` in LOCAL time. The only date-to-string conversion in the app. */
export function toISODate(date: Date | null | undefined): string {
  if (!date) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `HH:MM`, 24-hour, zero-padded. What `input[type=time]` produced. */
export function toTimeValue(date: Date | null | undefined): string {
  if (!date) return '';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Parse `YYYY-MM-DD` as a LOCAL date at midday. Returns null on anything malformed. */
export function fromISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0, 0);
  // Reject a date the calendar rolled over, e.g. 2026-02-31 becoming 3 March.
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(m) - 1 || date.getDate() !== Number(d)) {
    return null;
  }
  return date;
}

/**
 * Apply an `HH:MM` time to a date, keeping its calendar day.
 *
 * This is what lets the existing `opening`/`closing` string state keep working
 * unchanged while the control itself speaks in Dates.
 */
export function withTime(date: Date, time: string): Date {
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!match) return date;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return date;
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/** Today at midday, so "today" cannot drift when it is stored or compared. */
export function today(): Date {
  return atMidday(new Date());
}

// ------------------------------------------------------------------ formatting

/** `14:30` -> `2:30 PM`. */
export function formatTime(date: Date, timeFormat: '12' | '24' = '24'): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (timeFormat === '24') return `${pad(hours)}:${pad(minutes)}`;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${pad(minutes)} ${suffix}`;
}

/** `14:30` -> `2:30 PM`. Operates on the string form the onboarding forms store. */
export function formatTimeValue(value: string, timeFormat: '12' | '24' = '12'): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(value.trim());
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (timeFormat === '24') return `${pad(hours)}:${pad(minutes)}`;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${pad(minutes)} ${suffix}`;
}

/**
 * How a date reads in the trigger.
 *
 * Deliberately not `toLocaleDateString`: the locale default renders `9/23/2026` in
 * en-US and `23/09/2026` in en-GB, so the same build would look different to two
 * visitors and neither matches the day-month order this market reads. The format is
 * chosen here instead of delegated.
 */
export function formatDate(
  date: Date | null | undefined,
  style: 'short' | 'medium' | 'long' = 'medium'
): string {
  if (!date) return '';
  const day = date.getDate();
  const month = MONTH_SHORT[date.getMonth()];
  const year = date.getFullYear();
  if (style === 'short') return `${day} ${month}`;
  if (style === 'long') return `${DAY_NAMES[date.getDay()]}, ${day} ${MONTH_NAMES[date.getMonth()]} ${year}`;
  return `${day} ${month} ${year}`;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export function formatRange(range: DateRange | null | undefined, style: 'short' | 'medium' = 'medium'): string {
  if (!range?.startDate) return '';
  if (!range.endDate) return `${formatDate(range.startDate, style)} onwards`;
  return `${formatDate(range.startDate, style)} to ${formatDate(range.endDate, style)}`;
}

/** Inclusive night count, which is what a stay is priced on. */
export function nightsBetween(range: DateRange): number | null {
  if (!range.startDate || !range.endDate) return null;
  const diff = compareDays(range.endDate, range.startDate);
  return diff < 0 ? null : diff;
}
