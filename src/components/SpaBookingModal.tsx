import { useState } from 'react';
import {
  X,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Phone,
  CalendarPlus,
  Compass,
  ArrowRight,
  Flame,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpaTreatment, SpaServiceDuration, SpaLocationType, SpaTreatmentAddOn, SpaBooking } from '../types';

interface SpaBookingModalProps {
  treatment: SpaTreatment | null;
  spaName?: string;
  onClose: () => void;
  onBookingConfirmed?: (booking: SpaBooking) => void;
}

export default function SpaBookingModal({
  treatment,
  spaName = 'Aura Coastal Sanctuary',
  onClose,
  onBookingConfirmed,
}: SpaBookingModalProps) {
  if (!treatment) return null;

  // Workflow steps: 1: Config (Duration, Location, Date, Time), 2: Personalization (Therapist, Pressure, Oil, Addons), 3: Guest details, 4: Active Tracker
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedDuration, setSelectedDuration] = useState<SpaServiceDuration>(treatment.durations[0]?.duration || 60);
  const [locationType, setLocationType] = useState<SpaLocationType>('in_villa');
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('04:30 PM');
  
  const [therapistGender, setTherapistGender] = useState<'female' | 'male' | 'no_preference'>('female');
  const [pressureLevel, setPressureLevel] = useState<'gentle' | 'medium' | 'firm' | 'sports'>('medium');
  const [selectedOil, setSelectedOil] = useState<string>(treatment.availableOils[0] || 'Organic French Lavender');
  const [selectedAddOns, setSelectedAddOns] = useState<SpaTreatmentAddOn[]>([]);

  // Guest Details
  const [guestName, setGuestName] = useState('Alexander Wright');
  const [roomOrVilla, setRoomOrVilla] = useState('Villa 204');
  const [specialNotes, setSpecialNotes] = useState('Focus on upper back and shoulders after long-haul flight.');

  // Confirmed booking state for active tracker
  const [confirmedBooking, setConfirmedBooking] = useState<SpaBooking | null>(null);
  const [simulationStatusIndex, setSimulationStatusIndex] = useState<number>(0);

  const durationObj = treatment.durations.find((d) => d.duration === selectedDuration) || treatment.durations[0];
  const basePrice = durationObj.price;
  const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
  const totalPrice = basePrice + addOnsTotal;

  const toggleAddOn = (addon: SpaTreatmentAddOn) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleConfirmBooking = () => {
    const booking: SpaBooking = {
      id: `SPA-${Math.floor(1000 + Math.random() * 9000)}`,
      treatmentId: treatment.id,
      treatmentTitle: treatment.title,
      spaName,
      duration: selectedDuration,
      price: basePrice,
      locationType,
      date: selectedDate === 'today' ? 'Today' : 'Tomorrow',
      timeSlot: selectedTimeSlot,
      therapistGender,
      pressureLevel,
      selectedOil,
      selectedAddOns,
      guestName,
      roomOrVilla,
      specialNotes,
      totalPrice,
      status: 'confirmed',
      therapist: {
        name: therapistGender === 'male' ? 'Master Kadek Wardana' : 'Master Maya Suryani',
        photoUrl: therapistGender === 'male'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        rating: 4.98,
        yearsExperience: 9,
        phone: '+1 (800) 555-SPA8',
      },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedBooking(booking);
    setStep(4);
    onBookingConfirmed?.(booking);
  };

  const timeSlots = [
    { time: '10:00 AM', status: 'available' },
    { time: '11:30 AM', status: 'available' },
    { time: '02:00 PM', status: 'filling_fast' },
    { time: '03:30 PM', status: 'available' },
    { time: '04:30 PM', status: 'popular' },
    { time: '06:00 PM', status: 'available' },
    { time: '07:30 PM', status: 'filling_fast' },
    { time: '09:00 PM', status: 'available' },
  ];

  const simulationSteps = [
    { title: 'Booking Confirmed', desc: 'Concierge locked your appointment slot & assigned master therapist' },
    { title: 'Preparing In-Villa Linens & Botanical Oils', desc: 'Heating organic massage table & blending fresh essential oils' },
    { title: 'Therapist Dispatched & En Route', desc: `On the way to ${roomOrVilla} (ETA 12 mins)` },
    { title: 'Treatment In Progress', desc: `${selectedDuration} min restorative ritual active` },
    { title: 'Ritual Completed', desc: 'Rejuvenation session finished with herbal hydration' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="onboarding-theme relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] text-white"
        >
          {/* Header Banner */}
          <div className="relative h-44 sm:h-52 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${treatment.image})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-[#141618]/70 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-slate-300 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="absolute bottom-4 left-6 right-6 z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-tint text-gold border border-gold-line text-xs font-semibold mb-1 backdrop-blur-md">
                <Sparkles size={12} />
                <span>District Wellness Experience</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{treatment.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-1">{spaName}</p>
            </div>
          </div>

          {/* Stepper Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
              <span className={step === 1 ? 'text-gold font-bold flex items-center gap-1' : 'text-slate-500'}>
                1. Duration & Time
              </span>
              <ChevronRight size={14} />
              <span className={step === 2 ? 'text-gold font-bold flex items-center gap-1' : 'text-slate-500'}>
                2. Oils & Add-ons
              </span>
              <ChevronRight size={14} />
              <span className={step === 3 ? 'text-gold font-bold flex items-center gap-1' : 'text-slate-500'}>
                3. Villa Details
              </span>
            </div>
          )}

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
            {/* STEP 1: Duration, Location, Date & Slot */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Select Ritual Duration
                  </h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {treatment.durations.map((d) => (
                      <button
                        key={d.duration}
                        type="button"
                        onClick={() => setSelectedDuration(d.duration)}
                        className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                          selectedDuration === d.duration
                            ? 'bg-gold-tint border-gold text-white shadow-md'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs text-slate-500 font-medium">{d.duration} Minutes</div>
                        <div className="text-base font-bold text-gold mt-0.5">${d.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Experience Setting
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLocationType('in_villa')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        locationType === 'in_villa'
                          ? 'bg-gold-tint border-gold text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MapPin size={20} className="text-gold shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">Private In-Villa Sanctuary</div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Therapist dispatches directly to your villa with heated table, organic linens & aromatherapy.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocationType('sanctuary_pavilion')}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        locationType === 'sanctuary_pavilion'
                          ? 'bg-gold-tint border-gold text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Compass size={20} className="text-gold shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">Resort Spa Pavilion</div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Private oceanfront cabana with thermal plunge pool & tranquil zen garden access.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Date & Time Slot Picker (District style) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Appointment Slot
                    </h3>
                    <div className="flex gap-1">
                      {(['today', 'tomorrow'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                            selectedDate === d
                              ? 'bg-gold text-slate-950'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          selectedTimeSlot === slot.time
                            ? 'bg-gold text-slate-950 font-bold border-gold shadow-lg'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs">{slot.time}</div>
                        {slot.status === 'popular' && (
                          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500 block">
                            Popular
                          </span>
                        )}
                        {slot.status === 'filling_fast' && (
                          <span className="text-[9px] uppercase font-bold tracking-wider text-rose-400 block">
                            1 Slot Left
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Therapist Gender, Pressure, Essential Oil, Add-ons */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Therapist Preference
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'female', label: 'Female Therapist' },
                      { key: 'male', label: 'Male Therapist' },
                      { key: 'no_preference', label: 'No Preference' },
                    ].map((pref) => (
                      <button
                        key={pref.key}
                        type="button"
                        onClick={() => setTherapistGender(pref.key as any)}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-colors cursor-pointer ${
                          therapistGender === pref.key
                            ? 'bg-gold text-slate-950 border-gold'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Massage Pressure Preference
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'gentle', label: 'Gentle / Relaxing' },
                      { key: 'medium', label: 'Medium Swedish' },
                      { key: 'firm', label: 'Firm Deep Tissue' },
                      { key: 'sports', label: 'Sports Recovery' },
                    ].map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setPressureLevel(p.key as any)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-colors cursor-pointer ${
                          pressureLevel === p.key
                            ? 'bg-gold-tint border-gold text-gold'
                            : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Signature Aromatherapy Oil
                  </h3>
                  <div className="space-y-2">
                    {treatment.availableOils.map((oil) => (
                      <label
                        key={oil}
                        onClick={() => setSelectedOil(oil)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedOil === oil
                            ? 'bg-gold-tint border-gold text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-medium">{oil}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedOil === oil ? 'border-gold bg-gold' : 'border-gray-500'
                          }`}
                        >
                          {selectedOil === oil && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Luxury Add-ons */}
                {treatment.addOns.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Enhance Your Ritual (Add-ons)
                    </h3>
                    <div className="space-y-2.5">
                      {treatment.addOns.map((addon) => {
                        const isAdded = selectedAddOns.some((a) => a.id === addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddOn(addon)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                              isAdded
                                ? 'bg-gold-tint border-gold'
                                : 'bg-slate-100 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                                <span>{addon.name}</span>
                                <span className="text-xs text-gold">+${addon.price}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">{addon.description}</p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                isAdded ? 'bg-gold border-gold text-slate-950' : 'border-gray-500'
                              }`}
                            >
                              {isAdded && <CheckCircle2 size={14} className="text-slate-950" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Guest & Room Details */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-gold-tint border border-gold-line text-xs text-gray-200">
                  <div className="font-bold text-gold mb-1 flex items-center gap-1.5 text-sm">
                    <UserCheck size={16} />
                    <span>Concierge In-Villa Service Protocol</span>
                  </div>
                  Our certified therapist will arrive 10 minutes prior with sanitized organic towels, ultrasonic mist diffuser, and a heated memory-foam bed.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Primary Guest Name
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Villa / Suite Number
                    </label>
                    <input
                      type="text"
                      value={roomOrVilla}
                      onChange={(e) => setRoomOrVilla(e.target.value)}
                      placeholder="e.g. Villa 204 or Ocean Suite 3"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Focus Areas & Medical Notes
                  </label>
                  <textarea
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Focus on neck and lower back; avoid intense pressure on left shoulder."
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold outline-none resize-none"
                  />
                </div>

                {/* Summary Order Card */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{treatment.title} ({selectedDuration} mins)</span>
                    <span>${basePrice}</span>
                  </div>
                  {selectedAddOns.map((addon) => (
                    <div key={addon.id} className="flex justify-between text-slate-500">
                      <span>Add-on: {addon.name}</span>
                      <span>+${addon.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-white">
                    <span>Total Concierge Charge</span>
                    <span className="text-gold">${totalPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: District Live Spa Status Tracker */}
            {step === 4 && confirmedBooking && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Appointment Confirmed
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      Booking #{confirmedBooking.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Slot Scheduled</div>
                    <div className="text-sm font-bold text-gold">
                      {confirmedBooking.date} at {confirmedBooking.timeSlot}
                    </div>
                  </div>
                </div>

                {/* Assigned Master Therapist Card */}
                {confirmedBooking.therapist && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={confirmedBooking.therapist.photoUrl}
                        alt="Therapist"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gold"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs text-slate-500">Assigned Master Therapist</div>
                        <div className="font-bold text-sm text-white">{confirmedBooking.therapist.name}</div>
                        <div className="text-[11px] text-gold flex items-center gap-1">
                          <span>★ {confirmedBooking.therapist.rating}</span>
                          <span>•</span>
                          <span>{confirmedBooking.therapist.yearsExperience} yrs wellness mastery</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${confirmedBooking.therapist.phone}`}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-white border border-slate-300 transition-colors cursor-pointer"
                      title="Contact Spa Concierge"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                )}

                {/* Live Simulation Stepper */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Live Dispatch Progress
                    </h4>
                    <button
                      type="button"
                      onClick={() => setSimulationStatusIndex((prev) => Math.min(prev + 1, simulationSteps.length - 1))}
                      className="text-[11px] text-gold hover:underline font-semibold cursor-pointer"
                    >
                      Advance Simulation Step ({simulationStatusIndex + 1}/{simulationSteps.length})
                    </button>
                  </div>

                  <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
                    {simulationSteps.map((s, idx) => {
                      const isDone = idx <= simulationStatusIndex;
                      const isCurrent = idx === simulationStatusIndex;
                      return (
                        <div key={idx} className="relative">
                          <div
                            className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                              isDone
                                ? 'bg-gold border-gold'
                                : 'bg-white border-gray-600'
                            }`}
                          />
                          <div className={`text-xs font-bold ${isCurrent ? 'text-gold' : isDone ? 'text-white' : 'text-slate-500'}`}>
                            {s.title}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Event for ${treatment.title} on ${confirmedBooking.date} at ${confirmedBooking.timeSlot} added to device calendar.`);
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CalendarPlus size={16} />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold hover:bg-gold-strong text-slate-950 text-xs font-bold transition cursor-pointer shadow-lg"
                  >
                    <span>Done</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls for Steps 1-3 */}
          {step < 4 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Total Experience Fee</div>
                <div className="text-lg sm:text-xl font-bold text-gold">${totalPrice}</div>
              </div>

              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev + 1) as any)}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-strong text-slate-950 text-xs sm:text-sm font-bold transition cursor-pointer shadow-md"
                  >
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-strong text-slate-950 text-xs sm:text-sm font-bold transition cursor-pointer shadow-lg"
                  >
                    <Sparkles size={15} />
                    <span>Confirm Spa Booking</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
