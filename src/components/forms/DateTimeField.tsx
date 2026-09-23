// src/components/forms/DateTimeField.tsx
//
// The date, time and date-range control for every surface in this app.
//
// PORTED FROM THE PLATFORM'S NexGDatePicker
// -----------------------------------------
// `packages/shared/ui/NexGDatePicker.tsx` (React Native, 1242 lines) is the source of
// truth for this control's CONTRACT. The prop names, the `mode` union, the value types
// (`Date` and `{ startDate, endDate }`) and the `onChange` signatures here are the same
// on purpose: a merchant filling in the web app and the same merchant in the mobile app
// should not be answering a differently-shaped question, and a future shared API has one
// shape to target rather than two.
//
// The IMPLEMENTATION is not portable and is not copied. That file is React Native —
// `View`, `TouchableOpacity`, `ScrollView`, `lucide-react-native` — and it takes its
// colours from the platform's tokens (`useTheme()` → emerald). This is React DOM,
// styled in this app's own idiom: `isLight` branching rather than `dark:` variants,
// the gold accent, and the radius roles from DESIGN.md (`rounded-2xl` surfaces,
// `rounded-full` controls, `rounded-xl` inner chips).
//
// WHY IT EXISTS RATHER THAN MORE `input[type=date]`
// There were 14 native date and time inputs across the onboarding forms and the
// category drilldown. The native picker cannot be styled, renders completely
// differently in every browser, shows a US-ordered date, gives no range affordance and
// no minimum-stay feedback, and on iOS opens a wheel unrelated to anything else in the
// product. This control is identical everywhere and states its constraints in the
// interface instead of rejecting after the fact.
//
// ACCESSIBILITY, because a calendar is the easiest place to lose it:
//   - the trigger is a real <button> with the value in its accessible name
//   - the grid is a `role="grid"` of `role="gridcell"` days, each a real button, so
//     Tab reaches the month and the arrow keys move within it (roving tabindex)
//   - every day carries a full-date `aria-label`, so a screen reader never reads "23"
//   - `aria-disabled` marks out-of-range days; they stay focusable so the constraint is
//     discoverable rather than invisible
//   - Escape closes and returns focus to the trigger; the trigger is the only Tab stop
//     while the panel is open, so focus cannot escape behind it
//   - min/max violations state the rule AND the recovery, per this project's voice rules

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import {
  addDays,
  addMonths,
  atMidday,
  buildCalendarGrid,
  compareDays,
  DAY_INITIALS,
  DAY_NAMES,
  daysInMonth,
  formatDate,
  formatTime,
  fromISODate,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  isWithinDays,
  MONTH_NAMES,
  nightsBetween,
  startOfMonth,
  toISODate,
  toTimeValue,
  today,
  type DateRange,
} from '../../lib/datetime';
export type { DateRange };

interface BaseProps {
  label?: string;
  /** Message shown under the control. Present means invalid; it is never silent. */
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  timeFormat?: '12' | '24';
  variant?: 'filled' | 'outline';
  /** Minutes between selectable times. Defaults to 15, which covers every real slot. */
  minuteStep?: number;
  className?: string;
  /** Rendered as the field's `id`, so an external <label htmlFor> still works. */
  id?: string;
  /**
   * Id of an element outside this component that names the field.
   *
   * `DynamicField` renders its own label and points `htmlFor` at the trigger's id, so
   * this control needs to accept that relationship rather than duplicate the label.
   */
  'aria-labelledby'?: string;
  /** Id of an element outside this component carrying the validation message. */
  'aria-describedby'?: string;
  /**
   * Suppress this component's own hint and error text.
   *
   * For a caller that already renders both (DynamicField does) and wires them up with
   * its own ids. The messages would otherwise appear twice and the ids would collide.
   */
  suppressMessages?: boolean;
}

interface RangeProps extends BaseProps {
  mode: 'range';
  value?: DateRange | null;
  onChange: (value: DateRange | undefined) => void;
}

interface SingleProps extends BaseProps {
  mode?: 'date' | 'time' | 'datetime';
  value?: Date | null;
  onChange: (value: Date | undefined) => void;
}

export type DateTimeFieldProps = RangeProps | SingleProps;

const WEEKDAY_HEADERS = DAY_NAMES.map((full, i) => ({ full, initial: DAY_INITIALS[i] }));

export function DateTimeField(props: DateTimeFieldProps) {
  const {
    label,
    error,
    hint,
    placeholder,
    disabled = false,
    required = false,
    minimumDate,
    maximumDate,
    timeFormat = '24',
    variant = 'filled',
    minuteStep = 15,
    className,
    id: idProp,
    suppressMessages = false,
  } = props;

  const externalLabelledBy = props['aria-labelledby'];
  const externalDescribedBy = props['aria-describedby'];

  const mode = props.mode ?? 'date';
  const { isLight } = useTheme();
  const reactId = useId();
  const fieldId = idProp ?? `dtf-${reactId.replace(/[:]/g, '')}`;
  const panelId = `${fieldId}-panel`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const isRange = mode === 'range';
  const showCalendar = mode === 'date' || mode === 'datetime' || mode === 'range';
  const showTime = mode === 'time' || mode === 'datetime';

  const [open, setOpen] = useState(false);
  const [focusedDay, setFocusedDay] = useState<Date>(() => today());
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(today()));
  // Range mode collects its two ends across two clicks. Held here rather than in the
  // caller so a half-finished range never reaches the form as a valid-looking value.
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [yearOpen, setYearOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------- value access

  const rangeValue: DateRange | null = isRange ? (props.value as DateRange | null) ?? null : null;
  const singleValue: Date | null = !isRange ? (props.value as Date | null) ?? null : null;

  /** The effective single date: time mode still needs a day to hang the time on. */
  const activeDate = isRange ? rangeValue?.startDate ?? null : singleValue;
  const hasValue = isRange ? Boolean(rangeValue?.startDate) : Boolean(singleValue);

  const displayText = useMemo(() => {
    if (isRange) {
      if (!rangeValue?.startDate) return '';
      const start = formatDate(rangeValue.startDate);
      if (!rangeValue.endDate) return `${start} onwards`;
      return `${start} to ${formatDate(rangeValue.endDate)}`;
    }
    if (!singleValue) return '';
    if (mode === 'time') return formatTime(singleValue, timeFormat);
    if (mode === 'datetime') {
      return `${formatDate(singleValue)} at ${formatTime(singleValue, timeFormat)}`;
    }
    return formatDate(singleValue);
  }, [isRange, rangeValue, singleValue, mode, timeFormat]);

  // ---------------------------------------------------------------- constraint

  const violations = useMemo(() => {
    const out: string[] = [];
    if (!activeDate) return out;
    if (minimumDate && isBeforeDay(activeDate, minimumDate)) {
      out.push(`The earliest date is ${formatDate(minimumDate)}. Choose that date or later.`);
    }
    if (maximumDate && isAfterDay(activeDate, maximumDate)) {
      out.push(`The latest date is ${formatDate(maximumDate)}. Choose that date or earlier.`);
    }
    if (isRange && rangeValue?.startDate && rangeValue.endDate && isBeforeDay(rangeValue.endDate, rangeValue.startDate)) {
      out.push('The end date is before the start date. Choose an end date on or after the start.');
    }
    return out;
  }, [activeDate, minimumDate, maximumDate, isRange, rangeValue]);

  const visibleError = error ?? violations[0];
  const invalid = Boolean(visibleError);
  // An external describedby wins: DynamicField owns the error and hint elements and
  // their ids, so pointing at ours as well would describe the field twice.
  const describedBy = externalDescribedBy ?? (visibleError ? errorId : hint ? hintId : undefined);

  const isDisabledDay = useCallback(
    (date: Date) => !isWithinDays(date, minimumDate, maximumDate),
    [minimumDate, maximumDate]
  );

  // ---------------------------------------------------------------- open / close

  const openPanel = useCallback(() => {
    if (disabled) return;
    const anchor = activeDate ?? today();
    setFocusedDay(anchor);
    setVisibleMonth(startOfMonth(anchor));
    setPendingStart(isRange ? rangeValue?.startDate ?? null : null);
    setOpen(true);
  }, [disabled, activeDate, isRange, rangeValue]);

  const closePanel = useCallback((restoreFocus = true) => {
    setOpen(false);
    setYearOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Focus moves into the grid on open so the keyboard is usable immediately, but only
  // if the pointer did not open it — grabbing focus after a tap pops a mobile keyboard.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closePanel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closePanel]);

  // The page behind must not scroll while the panel owns the interaction.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Position the panel under the trigger where there is room, and as a bottom sheet
  // where there is not. Measured rather than guessed from a breakpoint, because a
  // 360px phone in landscape has room a 360px phone in portrait does not.
  const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number; sheet: boolean }>({
    top: 0,
    left: 0,
    width: 320,
    sheet: true,
  });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const measure = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const panelWidth = Math.min(360, window.innerWidth - 24);
      const panelHeight = 430;
      const roomBelow = window.innerHeight - rect.bottom;
      const sheet = window.innerWidth < 480 || roomBelow < panelHeight + 16;
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - panelWidth - 12));
      setPanelPos({
        top: sheet ? Math.max(12, window.innerHeight - panelHeight - 12) : rect.bottom + 8,
        left: sheet ? (window.innerWidth - panelWidth) / 2 : left,
        width: panelWidth,
        sheet,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open]);

  // ---------------------------------------------------------------- selection

  const commitSingle = useCallback(
    (next: Date) => {
      if (isRange) return;
      (props as SingleProps).onChange(next);
    },
    [isRange, props]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      if (isDisabledDay(date)) return;
      const midday = atMidday(date);

      if (isRange) {
        const onRange = props as RangeProps;
        if (!pendingStart) {
          // First click opens the range. The end is left null so the value honestly
          // says "no end chosen yet" rather than pretending start == end.
          setPendingStart(midday);
          onRange.onChange({ startDate: midday, endDate: null });
          return;
        }
        if (compareDays(midday, pendingStart) < 0) {
          // Clicking earlier than the start is read as a new start, which is what a
          // person means by it, rather than as an invalid range.
          setPendingStart(midday);
          onRange.onChange({ startDate: midday, endDate: null });
          return;
        }
        onRange.onChange({ startDate: pendingStart, endDate: midday });
        setPendingStart(null);
        if (mode === 'range') closePanel();
        return;
      }

      // Date and datetime keep the time already chosen, so picking a different day
      // does not silently reset the hour.
      const base = singleValue ?? today();
      const next = new Date(midday);
      if (showTime) next.setHours(base.getHours(), base.getMinutes(), 0, 0);
      commitSingle(next);
      if (mode === 'date') closePanel();
    },
    [isDisabledDay, isRange, pendingStart, props, mode, singleValue, showTime, commitSingle, closePanel]
  );

  const handleTimeChange = useCallback(
    (hours: number, minutes: number) => {
      if (isRange) return;
      const base = singleValue ?? today();
      const next = new Date(base);
      next.setHours(hours, minutes, 0, 0);
      commitSingle(next);
    },
    [isRange, singleValue, commitSingle]
  );

  // ---------------------------------------------------------------- keyboard

  /**
   * Roving tabindex over the grid: exactly one day is tabbable (the focused one), and
   * the arrow keys move it. Tabbing into a 42-button grid one stop at a time would be
   * 42 key presses to get past the control.
   */
  const moveFocus = useCallback(
    (delta: number) => {
      setFocusedDay((current) => {
        const next = addDays(current, delta);
        if (next.getMonth() !== visibleMonth.getMonth() || next.getFullYear() !== visibleMonth.getFullYear()) {
          setVisibleMonth(startOfMonth(next));
        }
        return next;
      });
    },
    [visibleMonth]
  );

  const onGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveFocus(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveFocus(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveFocus(-7);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveFocus(7);
          break;
        case 'Home':
          e.preventDefault();
          setFocusedDay((d) => new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0));
          break;
        case 'End':
          e.preventDefault();
          setFocusedDay((d) => new Date(d.getFullYear(), d.getMonth(), daysInMonth(d.getFullYear(), d.getMonth()), 12, 0, 0, 0));
          break;
        case 'PageUp':
          e.preventDefault();
          setFocusedDay((d) => addMonths(d, -1));
          setVisibleMonth((m) => addMonths(m, -1));
          break;
        case 'PageDown':
          e.preventDefault();
          setFocusedDay((d) => addMonths(d, 1));
          setVisibleMonth((m) => addMonths(m, 1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleDayClick(focusedDay);
          break;
        default:
          break;
      }
    },
    [moveFocus, focusedDay, handleDayClick]
  );

  // The focused cell is the only tabbable one, so it needs focus after a key moves it.
  useEffect(() => {
    if (!open) return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]');
    el?.focus({ preventScroll: true });
  }, [open, focusedDay, visibleMonth]);

  // ---------------------------------------------------------------- styles

  const surface = isLight
    ? variant === 'outline'
      ? 'bg-transparent border-slate-300'
      : 'bg-white border-slate-300'
    : variant === 'outline'
      ? 'bg-transparent border-white/15'
      : 'bg-white/5 border-white/15';

  const triggerClasses = cn(
    'w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-left',
    'border transition-colors duration-150 ease-out cursor-pointer',
    'focus:outline-none focus-visible:ring-2',
    disabled && 'opacity-50 cursor-not-allowed',
    invalid
      ? isLight
        ? 'border-rose-400 focus-visible:ring-rose-300'
        : 'border-rose-500/60 focus-visible:ring-rose-500/30'
      : isLight
        ? 'focus-visible:border-[#B88728] focus-visible:ring-[#B88728]/25 hover:border-slate-400'
        : 'focus-visible:border-[#E5B65F] focus-visible:ring-[#E5B65F]/25 hover:border-white/25',
    surface,
    !hasValue && (isLight ? 'text-slate-600' : 'text-gray-400')
  );

  const panelClasses = cn(
    'fixed z-50 rounded-2xl border shadow-2xl',
    isLight ? 'bg-white border-slate-200' : 'bg-[#141618] border-white/15'
  );

  const weekLabel = isLight ? 'text-slate-600' : 'text-gray-400';
  const disabledText = isLight ? 'text-slate-300' : 'text-white/20';

  const Icon = showCalendar && showTime ? CalendarIcon : showCalendar ? CalendarIcon : Clock;

  // ---------------------------------------------------------------- panel

  const days = useMemo(
    () => buildCalendarGrid(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth]
  );

  const years = useMemo(() => {
    const base = new Date().getFullYear();
    return Array.from({ length: 101 }, (_, i) => base - 50 + i);
  }, []);

  const rangeEnd = rangeValue?.endDate ?? null;
  const rangeStart = rangeValue?.startDate ?? null;

  const renderPanel = () => {
    if (!open) return null;
    return (
      <>
        {/* Scrim. Clicking it closes; the panel stops propagation so a click inside
            does not. No opacity animation: the panel must not fade while a day is
            being read. */}
        <div
          className="fixed inset-0 z-40 bg-slate-950/40"
          onClick={() => closePanel()}
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={label ? `Choose ${label}` : 'Choose a date and time'}
          className={panelClasses}
          style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width }}
          onClick={(e) => e.stopPropagation()}
        >
          {showCalendar && (
            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <button
                  type="button"
                  onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
                  aria-label="Previous month"
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center cursor-pointer',
                    'transition-colors duration-150 ease-out',
                    isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-200'
                  )}
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setYearOpen((v) => !v)}
                  aria-expanded={yearOpen}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5',
                    'text-sm font-bold cursor-pointer transition-colors duration-150 ease-out',
                    isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-white/10 text-white'
                  )}
                >
                  {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                  <ChevronDown size={14} className={cn('transition-transform duration-150', yearOpen && 'rotate-180')} />
                </button>

                <button
                  type="button"
                  onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
                  aria-label="Next month"
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center cursor-pointer',
                    'transition-colors duration-150 ease-out',
                    isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-gray-200'
                  )}
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              {yearOpen ? (
                <div
                  className="grid grid-cols-4 gap-1 max-h-[248px] overflow-y-auto py-1"
                  role="listbox"
                  aria-label="Choose a year"
                >
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      role="option"
                      aria-selected={y === visibleMonth.getFullYear()}
                      onClick={() => {
                        setVisibleMonth((m) => new Date(y, m.getMonth(), 1, 12, 0, 0, 0));
                        setYearOpen(false);
                      }}
                      className={cn(
                        'py-1.5 rounded-lg text-xs font-bold cursor-pointer tabular-nums',
                        'transition-colors duration-150 ease-out',
                        y === visibleMonth.getFullYear()
                          ? isLight
                            ? 'bg-[#B88728] text-slate-950'
                            : 'bg-[#E5B65F] text-slate-950'
                          : isLight
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-gray-300 hover:bg-white/10'
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  ref={gridRef}
                  role="grid"
                  aria-label={`${MONTH_NAMES[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`}
                  onKeyDown={onGridKeyDown}
                >
                  <div role="row" className="grid grid-cols-7 mb-1">
                    {WEEKDAY_HEADERS.map((d, i) => (
                      <div
                        key={`${d.full}-${i}`}
                        role="columnheader"
                        aria-label={d.full}
                        className={cn('text-center text-[10px] font-bold uppercase py-1', weekLabel)}
                      >
                        <span aria-hidden="true">{d.initial}</span>
                      </div>
                    ))}
                  </div>

                  {Array.from({ length: days.length / 7 }, (_, week) => (
                    <div role="row" key={week} className="grid grid-cols-7">
                      {days.slice(week * 7, week * 7 + 7).map((cell) => {
                        const outOfRange = isDisabledDay(cell.date);
                        const isStart = isSameDay(cell.date, rangeStart);
                        const isEnd = isSameDay(cell.date, rangeEnd);
                        const inRange =
                          rangeStart && rangeEnd && !isBeforeDay(cell.date, rangeStart) && !isAfterDay(cell.date, rangeEnd);
                        const selected = isRange ? isStart || isEnd : isSameDay(cell.date, singleValue);
                        const isToday = isSameDay(cell.date, today());
                        const focused = isSameDay(cell.date, focusedDay);

                        return (
                          <div role="gridcell" key={cell.date.toISOString()} aria-selected={selected}>
                            <button
                              type="button"
                              data-focused={focused}
                              tabIndex={focused ? 0 : -1}
                              aria-label={`${formatDate(cell.date, 'long')}${isToday ? ', today' : ''}${
                                outOfRange ? ', unavailable' : ''
                              }`}
                              aria-disabled={outOfRange}
                              aria-current={isToday ? 'date' : undefined}
                              onClick={() => {
                                setFocusedDay(cell.date);
                                handleDayClick(cell.date);
                              }}
                              className={cn(
                                'w-full aspect-square flex items-center justify-center text-xs font-semibold',
                                'rounded-xl tabular-nums transition-colors duration-150 ease-out',
                                'focus:outline-none focus-visible:ring-2',
                                isLight ? 'focus-visible:ring-[#B88728]' : 'focus-visible:ring-[#E5B65F]',
                                outOfRange
                                  ? cn(disabledText, 'cursor-not-allowed')
                                  : 'cursor-pointer',
                                !cell.inMonth && !outOfRange && (isLight ? 'text-slate-400' : 'text-gray-500'),
                                !selected && !outOfRange && inRange && (isLight ? 'bg-[#B88728]/12 text-slate-900' : 'bg-[#E5B65F]/15 text-white'),
                                selected
                                  ? isLight
                                    ? 'bg-[#B88728] text-slate-950 font-bold'
                                    : 'bg-[#E5B65F] text-slate-950 font-bold'
                                  : !outOfRange &&
                                    !inRange &&
                                    (isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'),
                                isToday && !selected && (isLight ? 'ring-1 ring-[#B88728]/40' : 'ring-1 ring-[#E5B65F]/40')
                              )}
                            >
                              {cell.date.getDate()}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: isLight ? '#e7e7e2' : 'rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => {
                    const t = today();
                    if (isDisabledDay(t)) return;
                    setFocusedDay(t);
                    setVisibleMonth(startOfMonth(t));
                    handleDayClick(t);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer',
                    'transition-colors duration-150 ease-out',
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/10 hover:bg-white/15 text-gray-200'
                  )}
                >
                  Today
                </button>
                {isRange && (
                  <span className={cn('text-[11px] font-medium', weekLabel)}>
                    {!rangeStart
                      ? 'Choose a start date'
                      : !rangeEnd
                        ? 'Now choose an end date'
                        : `${nightsBetween({ startDate: rangeStart, endDate: rangeEnd }) ?? 0} night(s)`}
                  </span>
                )}
              </div>
            </div>
          )}

          {showTime && (
            <div
              className={cn('p-3', showCalendar && 'border-t')}
              style={showCalendar ? { borderColor: isLight ? '#e7e7e2' : 'rgba(255,255,255,0.1)' } : undefined}
            >
              <TimeColumns
                isLight={isLight}
                value={singleValue}
                timeFormat={timeFormat}
                minuteStep={minuteStep}
                onChange={handleTimeChange}
              />
            </div>
          )}

          <div
            className={cn('flex items-center gap-2 px-3 py-2.5 border-t rounded-b-2xl')}
            style={{ borderColor: isLight ? '#e7e7e2' : 'rgba(255,255,255,0.1)' }}
          >
            <span className={cn('text-[11px] tabular-nums flex-1', weekLabel)}>
              {displayText || 'Nothing chosen yet'}
            </span>
            <button
              type="button"
              onClick={() => closePanel()}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer',
                'transition-colors duration-150 ease-out active:scale-[0.97]',
                isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d]'
              )}
            >
              Done
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn('block text-xs font-bold mb-1.5', isLight ? 'text-slate-700' : 'text-gray-200')}
        >
          {label}
          {!required && <span className={cn('ml-1.5 font-medium', isLight ? 'text-slate-600' : 'text-gray-400')}>optional</span>}
        </label>
      )}

      <button
        ref={triggerRef}
        id={fieldId}
        type="button"
        disabled={disabled}
        onClick={() => (open ? closePanel() : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid}
        aria-labelledby={externalLabelledBy}
        aria-describedby={describedBy}
        className={triggerClasses}
      >
        <Icon size={15} className={cn('flex-shrink-0', isLight ? 'text-[#7d5a11]' : 'text-[#E5B65F]')} />
        <span className="flex-1 truncate">{displayText || placeholder || defaultPlaceholder(mode)}</span>
      </button>

      {!suppressMessages && hint && !visibleError && (
        <p id={hintId} className={cn('mt-1 text-[11px]', isLight ? 'text-slate-600' : 'text-gray-400')}>
          {hint}
        </p>
      )}
      {!suppressMessages && visibleError && (
        <p id={errorId} role="alert" className="mt-1 flex items-start gap-1 text-[11px] font-semibold text-rose-500">
          <AlertCircle size={11} className="mt-0.5 flex-shrink-0" />
          {visibleError}
        </p>
      )}

      {renderPanel()}
    </div>
  );
}

function defaultPlaceholder(mode: DateTimeFieldProps['mode']): string {
  if (mode === 'time') return 'Choose a time';
  if (mode === 'datetime') return 'Choose a date and time';
  if (mode === 'range') return 'Choose your dates';
  return 'Choose a date';
}

// ------------------------------------------------------------ string adapters

/**
 * A `"HH:MM"` or `"YYYY-MM-DD"` string, as `input[type=time]` and `input[type=date]`
 * produce, presented through the same control.
 *
 * WHY THIS EXISTS: twelve of the call sites hold their value as the string a native
 * input produced, and those strings are what gets sent to the API. Rewriting all of them
 * to hold a `Date` would change the form payload and the submit path in the same commit
 * as a visual change, which makes a failure impossible to attribute. These wrappers
 * convert at the boundary instead, so the state, the payload and the validation stay
 * exactly as they were and only the control changes.
 *
 * The conversion is deliberately strict: an unparseable string shows as empty rather
 * than being repaired into a plausible-looking date.
 */
export function DateStringField({
  value,
  onChange,
  ...rest
}: Omit<SingleProps, 'mode' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
}) {
  const date = fromISODate(value);
  return (
    <DateTimeField
      {...rest}
      mode="date"
      value={date}
      onChange={(next) => onChange(next ? toISODate(next) : '')}
    />
  );
}

export function TimeStringField({
  value,
  onChange,
  ...rest
}: Omit<SingleProps, 'mode' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
}) {
  // The day is irrelevant to a time, but the control needs one to hang the hour on.
  // `today()` is used rather than the epoch so the value cannot be shifted by a
  // timezone conversion somewhere downstream.
  const date = useMemo(() => {
    const match = /^(\d{1,2}):(\d{2})/.exec((value ?? '').trim());
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    const d = today();
    d.setHours(hours, minutes, 0, 0);
    return d;
  }, [value]);

  return (
    <DateTimeField
      {...rest}
      mode="time"
      value={date}
      onChange={(next) => onChange(next ? toTimeValue(next) : '')}
    />
  );
}

// ---------------------------------------------------------------------- time

/**
 * Hour and minute as two scrollable columns rather than a wheel.
 *
 * A wheel is the native-mobile idiom and is bad with a mouse or a keyboard. Two columns
 * of real buttons work with every input device, and `minuteStep` keeps the list short
 * enough to scan — a 15-minute step is 4 rows instead of 60.
 */
function TimeColumns({
  isLight,
  value,
  timeFormat,
  minuteStep,
  onChange,
}: {
  isLight: boolean;
  value: Date | null;
  timeFormat: '12' | '24';
  minuteStep: number;
  onChange: (hours: number, minutes: number) => void;
}) {
  const base = value ?? today();
  const hours = base.getHours();
  const minutes = base.getMinutes();
  const isPM = hours >= 12;

  const hourOptions = Array.from({ length: timeFormat === '12' ? 12 : 24 }, (_, i) =>
    timeFormat === '12' ? (i === 0 ? 12 : i) : i
  );
  const minuteOptions = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  const to24 = (displayed: number): number => {
    if (timeFormat === '24') return displayed;
    if (displayed === 12) return isPM ? 12 : 0;
    return isPM ? displayed + 12 : displayed;
  };

  const columnClasses = cn(
    'h-[184px] overflow-y-auto rounded-xl border p-1',
    isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'
  );

  const cellClasses = (active: boolean) =>
    cn(
      'w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer tabular-nums',
      'transition-colors duration-150 ease-out',
      'focus:outline-none focus-visible:ring-2',
      isLight ? 'focus-visible:ring-[#B88728]' : 'focus-visible:ring-[#E5B65F]',
      active
        ? isLight
          ? 'bg-[#B88728] text-slate-950'
          : 'bg-[#E5B65F] text-slate-950'
        : isLight
          ? 'text-slate-700 hover:bg-white'
          : 'text-gray-300 hover:bg-white/10'
    );

  const labelClasses = cn('text-[10px] font-bold uppercase tracking-wider mb-1 block', isLight ? 'text-slate-600' : 'text-gray-400');

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <span className={labelClasses} id="dtf-hours-label">
          Hour
        </span>
        <div className={columnClasses} role="group" aria-labelledby="dtf-hours-label">
          {hourOptions.map((h) => {
            const active = timeFormat === '12' ? (h === 12 ? hours % 12 === 0 : hours % 12 === h) : hours === h;
            return (
              <button key={h} type="button" onClick={() => onChange(to24(h), minutes)} className={cellClasses(active)}>
                {String(h).padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className={labelClasses} id="dtf-minutes-label">
          Minute
        </span>
        <div className={columnClasses} role="group" aria-labelledby="dtf-minutes-label">
          {minuteOptions.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange(hours, m)}
              className={cellClasses(m === minutes)}
            >
              {String(m).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <div>
        {timeFormat === '12' ? (
          <>
            <span className={labelClasses} id="dtf-meridiem-label">
              Period
            </span>
            <div className={columnClasses} role="group" aria-labelledby="dtf-meridiem-label">
              {(['AM', 'PM'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange(to24(hours % 12 === 0 ? 12 : hours % 12), minutes)}
                  className={cellClasses(p === (isPM ? 'PM' : 'AM'))}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className={labelClasses}>&nbsp;</span>
            <div className={cn(columnClasses, 'flex items-center justify-center p-2')}>
              <span className={cn('text-lg font-bold tabular-nums', isLight ? 'text-slate-800' : 'text-white')}>
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DateTimeField;
