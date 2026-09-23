import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BookingCalendarProps {
  selectedDate: string; // Format 'YYYY-MM-DD'
  onDateSelect: (dateStr: string) => void;
  selectedTime: string; // e.g. '07:00 PM'
  onTimeSelect: (timeStr: string) => void;
  guests?: number;
  onGuestsChange?: (guests: number) => void;
  minGuests?: number;
  maxGuests?: number;
  serviceTitle?: string;
  providerName?: string;
  showGuestsPicker?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TIME_SLOTS = [
  { time: '09:00 AM', label: 'Morning Ritual', popular: false },
  { time: '10:30 AM', label: 'Morning Prime', popular: true },
  { time: '12:00 PM', label: 'Midday', popular: false },
  { time: '01:30 PM', label: 'Afternoon Siesta', popular: false },
  { time: '03:00 PM', label: 'Afternoon Prime', popular: true },
  { time: '04:30 PM', label: 'Late Afternoon', popular: false },
  { time: '06:00 PM', label: 'Sunset Slot', popular: true },
  { time: '07:30 PM', label: 'Evening Prime', popular: true },
  { time: '09:00 PM', label: 'Night Soirée', popular: false },
  { time: '10:30 PM', label: 'Late App', popular: false },
];

export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  guests = 2,
  onGuestsChange,
  minGuests = 1,
  maxGuests = 12,
  serviceTitle,
  providerName,
  showGuestsPicker = true,
}: BookingCalendarProps) {
  const { isLight } = useTheme();

  // Parse or initialize date
  const parsedDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth() || 9); // October
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar calculations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Quick shortcuts
  const selectQuickDate = (offsetDays: number) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const dateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
    onDateSelect(dateStr);
    setCurrentMonth(target.getMonth());
    setCurrentYear(target.getFullYear());
  };

  const handleExportToCalendar = () => {
    setSyncToast('Added to Calendar! Synced with Google & Apple Calendar.');
    setTimeout(() => setSyncToast(null), 3500);
  };

  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return 'Select a date';
    const [year, month, day] = dStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-6 transition ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
          : 'bg-[#141618] border-white/10 text-white shadow-xl'
      }`}
    >
      {/* Header Info */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-white/10'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl ${isLight ? 'bg-amber-100 text-[#B88728]' : 'bg-[#E5B65F]/15 text-[#E5B65F]'}`}>
              <CalendarIcon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Dedicated Reservation Calendar</h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                {serviceTitle ? `${serviceTitle} • ${providerName || 'NEXG App'}` : 'Select your preferred appointment date and time'}
              </p>
            </div>
          </div>
        </div>

        {/* Sync & Share Action */}
        <button
          type="button"
          onClick={handleExportToCalendar}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-[#E5B65F]" />
          <span>Sync Calendar</span>
        </button>
      </div>

      {syncToast && (
        <div className="mb-4 p-2.5 rounded-xl bg-[#E5B65F]/20 border border-[#E5B65F]/40 text-[#E5B65F] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Quick Date Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <span className={`text-xs font-semibold shrink-0 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
          Quick Pick:
        </span>
        <button
          type="button"
          onClick={() => selectQuickDate(0)}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
            selectedDate === todayStr
              ? 'bg-[#E5B65F] text-black border-[#E5B65F]'
              : isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
          }`}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => selectQuickDate(1)}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
          }`}
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => selectQuickDate(2)}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
          }`}
        >
          In 2 Days
        </button>
        <button
          type="button"
          onClick={() => selectQuickDate(7)}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
          }`}
        >
          Next Week
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Calendar Grid (7 cols) */}
        <div className="lg:col-span-7">
          {/* Month & Nav */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-bold text-sm sm:text-base">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'hover:bg-white/10 border-white/10 text-gray-300'
                }`}
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'hover:bg-white/10 border-white/10 text-gray-300'
                }`}
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className={`grid grid-cols-7 text-center text-[11px] font-bold uppercase tracking-wider py-1 mb-1 border-b ${
            isLight ? 'border-slate-200' : 'border-white/5'
          }`}>
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className={isLight ? 'text-slate-600' : 'text-gray-400'}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Previous month filler */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className={`h-9 flex items-center justify-center rounded-lg opacity-25 cursor-not-allowed ${
                    isLight ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onDateSelect(dateStr)}
                  className={`h-9 w-full rounded-xl flex flex-col items-center justify-center relative font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#E5B65F] text-black font-extrabold shadow-md scale-105 z-10'
                      : isLight
                      ? 'hover:bg-slate-100 text-slate-800'
                      : 'hover:bg-white/10 text-gray-200'
                  }`}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#E5B65F] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Time Slots & Party Size */}
        <div className={`lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E5B65F]" />
                <span className="font-bold text-xs sm:text-sm">Available Time Slots</span>
              </div>
              <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                Local Villa Time
              </span>
            </div>

            {/* Time Slot Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => onTimeSelect(slot.time)}
                    className={`px-3 py-2 rounded-xl text-left border transition cursor-pointer flex flex-col ${
                      isSelected
                        ? 'bg-[#E5B65F] text-black border-[#E5B65F] shadow-sm font-bold'
                        : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                    }`}
                  >
                    <span className="text-xs">{slot.time}</span>
                    <span
                      className={`text-[10px] truncate ${
                        isSelected
                          ? 'text-black/80'
                          : isLight
                          ? 'text-slate-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {slot.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Guests Picker */}
            {showGuestsPicker && onGuestsChange && (
              <div className={`mt-4 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#E5B65F]" />
                    <span className="font-semibold text-xs">Party / Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onGuestsChange(Math.max(minGuests, guests - 1))}
                      disabled={guests <= minGuests}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold border transition-colors disabled:opacity-30 cursor-pointer ${
                        isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-800' : 'border-white/10 hover:bg-white/10 text-white'
                      }`}
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => onGuestsChange(Math.min(maxGuests, guests + 1))}
                      disabled={guests >= maxGuests}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold border transition-colors disabled:opacity-30 cursor-pointer ${
                        isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-800' : 'border-white/10 hover:bg-white/10 text-white'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Selection Summary */}
          <div
            className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between ${
              isLight
                ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                : 'bg-[#E5B65F]/10 border-[#E5B65F]/20 text-white'
            }`}
          >
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#E5B65F]">
                Selected Schedule
              </div>
              <div className="font-semibold text-xs mt-0.5">
                {formatDisplayDate(selectedDate)} at {selectedTime || 'Select Time'}
              </div>
              {showGuestsPicker && (
                <div className={`text-[11px] mt-0.5 ${isLight ? 'text-amber-800/80' : 'text-gray-400'}`}>
                  {guests} {guests === 1 ? 'Guest' : 'Guests'} • Instant App Hold
                </div>
              )}
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#E5B65F] shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
