// src/datetime-gallery.tsx
//
// The surface that makes the date/time control reviewable.
//
// A control used only inside a 7-step wizard cannot be inspected: reaching it means
// filling in a form, and comparing its modes means doing that twice. This page mounts it
// once per mode and per state so each can be looked at directly, at any width, and driven
// by scripts/_verify-datetime-field.mjs.
//
// It is a development surface, not a product route: Vite builds only index.html into
// dist/, so datetime.html is never served in production.
//
// Every control here is the real component with real props. Nothing is mocked.

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { DateTimeField, DateStringField, TimeStringField, type DateRange } from './components/forms/DateTimeField';
import { addDays, toISODate, today } from './lib/datetime';

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  const { isLight } = useTheme();
  return (
    <section className="mb-10">
      <h2 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h2>
      {note && <p className={`text-[11px] mb-3 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{note}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{children}</div>
    </section>
  );
}

function Gallery() {
  const { isLight, theme, toggleTheme } = useTheme();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [dateTime, setDateTime] = useState<Date | undefined>(undefined);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [iso, setIso] = useState('');
  const [clock, setClock] = useState('09:30');

  const future = addDays(today(), 30);

  return (
    <div className={`min-h-[100dvh] px-5 py-8 ${isLight ? 'bg-[#f7f8fa]' : 'bg-[#111315]'}`}>
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Date and time controls
          </h1>
          <p className={`text-xs mt-1 max-w-[70ch] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            Every mode and state of the control the onboarding forms and the booking sheet use.
            Development surface, not a product page.
          </p>
        </div>
        <button
          type="button"
          id="theme-toggle"
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-colors duration-150 ease-out ${
            isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-[#E5B65F] text-slate-950 hover:bg-[#d6a54d]'
          }`}
        >
          {theme === 'light' ? 'Light' : 'Dark'}
        </button>
      </header>

      <Section title="Date" note="The default mode. Closes on selection.">
        <DateTimeField label="Delivery date" value={date} onChange={setDate} placeholder="Choose a date" />
        <DateTimeField
          label="Date of birth"
          value={date}
          onChange={setDate}
          maximumDate={today()}
          hint="No future dates. Enforced in the calendar, not after submission."
        />
        <DateTimeField
          label="Licence expiry"
          value={date}
          onChange={setDate}
          minimumDate={today()}
          hint="No past dates."
        />
      </Section>

      <Section title="Time" note="Hour and minute columns, so it works with a mouse and a keyboard.">
        <DateTimeField label="Opening time (12h)" mode="time" value={time} onChange={setTime} timeFormat="12" />
        <DateTimeField label="Opening time (24h)" mode="time" value={time} onChange={setTime} timeFormat="24" />
        <DateTimeField
          label="Appointment slot"
          mode="time"
          value={time}
          onChange={setTime}
          timeFormat="12"
          minuteStep={30}
          hint="Half-hour slots."
        />
      </Section>

      <Section title="Date and time" note="One control for a moment that matters to the minute.">
        <DateTimeField label="Pickup" mode="datetime" value={dateTime} onChange={setDateTime} timeFormat="12" />
        <DateTimeField label="Reservation" mode="datetime" value={dateTime} onChange={setDateTime} timeFormat="24" />
        <DateTimeField
          label="Check-in"
          mode="datetime"
          value={dateTime}
          onChange={setDateTime}
          timeFormat="12"
          minimumDate={today()}
          maximumDate={future}
          hint="Bookable from today up to 30 days ahead."
        />
      </Section>

      <Section title="Date range" note="Two clicks: start, then end. Shows the night count as you go.">
        <DateTimeField label="Stay" mode="range" value={range} onChange={setRange} />
        <DateTimeField
          label="Rental period"
          mode="range"
          value={range}
          onChange={setRange}
          minimumDate={today()}
          hint="From today onwards."
        />
        <DateTimeField label="Closed for maintenance" mode="range" value={range} onChange={setRange} disabled />
      </Section>

      <Section
        title="String adapters"
        note="For call sites that keep the value as the string a native input produced."
      >
        <DateStringField label="Date (YYYY-MM-DD)" value={iso} onChange={setIso} />
        <TimeStringField label="Time (HH:MM)" value={clock} onChange={setClock} timeFormat="12" />
        <TimeStringField label="Time, disabled" value={clock} onChange={setClock} disabled />
      </Section>

      <Section title="States" note="Every control ships default, focus, disabled and error.">
        <DateTimeField label="With value" value={today()} onChange={() => {}} />
        <DateTimeField label="Disabled" value={today()} onChange={() => {}} disabled />
        <DateTimeField label="Error" value={undefined} onChange={() => {}} error="Choose a date to continue." />
        <DateTimeField
          label="Out of range value"
          value={addDays(today(), 90)}
          onChange={() => {}}
          maximumDate={future}
          hint="The stored value is past the maximum, so the rule is stated with the recovery."
        />
        <DateTimeField
          label="Required"
          required
          value={undefined}
          onChange={() => {}}
          placeholder="Required field"
        />
      </Section>

      <Section title="Stored values" note="What the form actually holds. Read it while clicking.">
        <pre
          data-testid="stored"
          className={`col-span-full text-[11px] rounded-2xl border p-4 overflow-x-auto tabular-nums ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#181A1F] border-white/10 text-gray-300'
          }`}
        >{`date       ${date ? toISODate(date) : '(none)'}
time        ${time ? `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}` : '(none)'}
datetime    ${dateTime ? dateTime.toISOString() : '(none)'}
range       ${range?.startDate ? `${toISODate(range.startDate)} to ${range.endDate ? toISODate(range.endDate) : '(open)'}` : '(none)'}
iso string  ${iso || '(empty)'}
clock string${clock ? ` ${clock}` : ' (empty)'}`}</pre>
      </Section>
    </div>
  );
}

createRoot(document.getElementById('datetime-gallery')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <Gallery />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
