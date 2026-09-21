import { useState } from 'react';
import {
  X,
  Car,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Phone,
  Plane,
  Shield,
  Sparkles,
  Users,
  Briefcase,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TransportVehicle, TransportBooking } from '../types';

interface TransportBookingModalProps {
  vehicle: TransportVehicle | null;
  onClose: () => void;
  onBookingConfirmed?: (booking: TransportBooking) => void;
}

export default function TransportBookingModal({
  vehicle,
  onClose,
  onBookingConfirmed,
}: TransportBookingModalProps) {
  if (!vehicle) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [serviceType, setServiceType] = useState<'airport_transfer' | 'hourly_chauffeur' | 'point_to_point'>('airport_transfer');
  const [pickupLocation, setPickupLocation] = useState('Private Jet Terminal / VIP FBO');
  const [dropoffLocation, setDropoffLocation] = useState('Resort Presidential Villa 108');
  const [flightNumber, setFlightNumber] = useState('EK 704 (Direct Concierge Sync)');
  const [bookingDate, setBookingDate] = useState('Today');
  const [bookingTime, setBookingTime] = useState('06:30 PM');
  const [hours, setHours] = useState<number>(4);
  const [guestName, setGuestName] = useState('Lord Julian Sterling');
  const [roomOrVilla, setRoomOrVilla] = useState('Villa 108');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Laurent-Perrier Chilled Champagne on Ice',
    'High-Speed Wi-Fi Hotspot',
    'Chilled Fiji Water & Cold Towels'
  ]);

  const [confirmedBooking, setConfirmedBooking] = useState<TransportBooking | null>(null);
  const [simulationIndex, setSimulationIndex] = useState<number>(0);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const calculatedPrice =
    serviceType === 'airport_transfer'
      ? vehicle.priceAirportTransfer
      : vehicle.pricePerHour * hours;

  const handleConfirm = () => {
    const booking: TransportBooking = {
      id: `VIP-TR-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      serviceType,
      pickupLocation,
      dropoffLocation,
      date: bookingDate,
      time: bookingTime,
      hours: serviceType === 'hourly_chauffeur' ? hours : undefined,
      flightNumber: serviceType === 'airport_transfer' ? flightNumber : undefined,
      amenities: selectedAmenities,
      guestName,
      roomOrVilla,
      totalPrice: calculatedPrice,
      status: 'confirmed',
      driver: {
        name: 'Jean-Pierre Laurent (Executive Chauffeur)',
        phone: '+1 (800) 555-CHAUF',
        vehiclePlate: 'VIP-77-NXG',
        rating: 4.99,
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedBooking(booking);
    setStep(3);
    onBookingConfirmed?.(booking);
  };

  const simulationSteps = [
    { title: 'Chauffeur Reserved & Verified', desc: 'White-glove executive chauffeur allocated to your itinerary' },
    { title: 'Vehicle Detailing & Amenities Loaded', desc: 'Interior sanitized, chilled champagne and luggage racks prepared' },
    { title: 'En Route to Pickup Point', desc: `Chauffeur approaching ${pickupLocation} in ${vehicle.name}` },
    { title: 'Chauffeur On Standby at Curbside', desc: 'Holding digital name placard with luggage assistance ready' },
    { title: 'Journey Underway', desc: 'Gliding comfortably to destination with concierge dispatch active' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#141618] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] text-white"
        >
          {/* Header Banner */}
          <div className="relative h-44 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${vehicle.image})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-[#141618]/70 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="absolute bottom-4 left-6 right-6 z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B65F]/20 text-[#E5B65F] border border-[#E5B65F]/30 text-xs font-semibold mb-1 backdrop-blur-md">
                <Sparkles size={12} />
                <span>VIP Concierge Mobility</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{vehicle.name}</h2>
              <div className="flex items-center gap-4 text-xs text-gray-300 mt-0.5">
                <span className="flex items-center gap-1"><Users size={12} /> {vehicle.passengers} Guests</span>
                <span className="flex items-center gap-1"><Briefcase size={12} /> {vehicle.luggage} Luggage</span>
                <span className="text-[#E5B65F] font-bold">★ {vehicle.driverRating}</span>
              </div>
            </div>
          </div>

          {/* Stepper Indicator */}
          {step < 3 && (
            <div className="flex items-center justify-between px-6 py-2.5 bg-[#1a1d20] border-b border-white/10 text-xs text-gray-400">
              <span className={step === 1 ? 'text-[#E5B65F] font-bold' : 'text-gray-400'}>
                1. Service & Itinerary
              </span>
              <ChevronRight size={14} />
              <span className={step === 2 ? 'text-[#E5B65F] font-bold' : 'text-gray-400'}>
                2. Amenities & Guest
              </span>
            </div>
          )}

          {/* Content Area */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Service Type
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'airport_transfer', label: 'Airport VIP Transfer', badge: `$${vehicle.priceAirportTransfer}` },
                      { key: 'hourly_chauffeur', label: 'Hourly Chauffeur', badge: `$${vehicle.pricePerHour}/hr` },
                      { key: 'point_to_point', label: 'Point-to-Point City', badge: 'Direct' },
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setServiceType(s.key as any)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          serviceType === s.key
                            ? 'bg-[#E5B65F]/15 border-[#E5B65F] text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.label}</div>
                        <div className="text-xs text-[#E5B65F] font-semibold mt-0.5">{s.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {serviceType === 'hourly_chauffeur' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Dedicated Chauffeur Hours
                    </label>
                    <div className="flex gap-2">
                      {[3, 4, 6, 8, 12, 24].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHours(h)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            hours === h
                              ? 'bg-[#E5B65F] text-black border-[#E5B65F]'
                              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MapPin size={13} className="text-[#E5B65F]" />
                      <span>Pickup Location</span>
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Navigation size={13} className="text-[#E5B65F]" />
                      <span>Destination</span>
                    </label>
                    <input
                      type="text"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    />
                  </div>
                </div>

                {serviceType === 'airport_transfer' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Plane size={13} className="text-[#E5B65F]" />
                      <span>Flight Number / Departure Code</span>
                    </label>
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="e.g. EK 704 or VistaJet VJT-89"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Schedule Date
                    </label>
                    <select
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[#181a1d] border border-white/15 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Day After">Day After</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Pickup Time
                    </label>
                    <input
                      type="text"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Complimentary On-Board Amenities
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Laurent-Perrier Chilled Champagne on Ice',
                      'High-Speed Wi-Fi Hotspot',
                      'Chilled Fiji Water & Cold Towels',
                      'Executive Child Safety Seat',
                      'Luggage White-Glove Porter Service',
                    ].map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#E5B65F]/15 border-[#E5B65F] text-white'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{amenity}</span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected ? 'bg-[#E5B65F] border-[#E5B65F] text-black' : 'border-gray-500'
                            }`}
                          >
                            {isSelected && <CheckCircle2 size={13} className="text-black" />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Villa / Suite Room
                    </label>
                    <input
                      type="text"
                      value={roomOrVilla}
                      onChange={(e) => setRoomOrVilla(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#E5B65F] outline-none"
                    />
                  </div>
                </div>

                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>{vehicle.name} ({serviceType.replace('_', ' ').toUpperCase()})</span>
                    <span>${calculatedPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>VIP Meet & Greet + Airport Flight Sync</span>
                    <span className="text-emerald-400">Included</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm text-white">
                    <span>Total Concierge Fee</span>
                    <span className="text-[#E5B65F]">${calculatedPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && confirmedBooking && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Chauffeur Confirmed
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      Dispatch #{confirmedBooking.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Scheduled Departure</div>
                    <div className="text-sm font-bold text-[#E5B65F]">
                      {confirmedBooking.date} at {confirmedBooking.time}
                    </div>
                  </div>
                </div>

                {/* Assigned Chauffeur Card */}
                {confirmedBooking.driver && (
                  <div className="p-4 rounded-2xl bg-[#1d2023] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={confirmedBooking.driver.photoUrl}
                        alt="Chauffeur"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E5B65F]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs text-gray-400">Assigned Chauffeur</div>
                        <div className="font-bold text-sm text-white">{confirmedBooking.driver.name}</div>
                        <div className="text-[11px] text-[#E5B65F] flex items-center gap-2 mt-0.5">
                          <span>Plate: {confirmedBooking.driver.vehiclePlate}</span>
                          <span>•</span>
                          <span>★ {confirmedBooking.driver.rating}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${confirmedBooking.driver.phone}`}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                      title="Call Chauffeur"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                )}

                {/* Live Simulation Stepper */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Live Dispatch Status
                    </h4>
                    <button
                      type="button"
                      onClick={() => setSimulationIndex((prev) => Math.min(prev + 1, simulationSteps.length - 1))}
                      className="text-[11px] text-[#E5B65F] hover:underline font-semibold cursor-pointer"
                    >
                      Advance Simulation Step ({simulationIndex + 1}/{simulationSteps.length})
                    </button>
                  </div>

                  <div className="space-y-3 border-l-2 border-white/15 pl-4 ml-2">
                    {simulationSteps.map((s, idx) => {
                      const isDone = idx <= simulationIndex;
                      const isCurrent = idx === simulationIndex;
                      return (
                        <div key={idx} className="relative">
                          <div
                            className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                              isDone
                                ? 'bg-[#E5B65F] border-[#E5B65F]'
                                : 'bg-[#141618] border-gray-600'
                            }`}
                          />
                          <div className={`text-xs font-bold ${isCurrent ? 'text-[#E5B65F]' : isDone ? 'text-white' : 'text-gray-500'}`}>
                            {s.title}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#E5B65F] hover:bg-[#d6a54d] text-black font-bold text-sm transition-all cursor-pointer shadow-lg"
                  >
                    Done & Return to App
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {step < 3 && (
            <div className="p-4 sm:p-5 bg-[#171a1d] border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-400">Total Rate</div>
                <div className="text-lg sm:text-xl font-bold text-[#E5B65F]">${calculatedPrice}</div>
              </div>

              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-[#E5B65F] hover:bg-[#d6a54d] text-black text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
                  >
                    Continue to Amenities
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-6 py-2.5 rounded-xl bg-[#E5B65F] hover:bg-[#d6a54d] text-black text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-lg"
                  >
                    Confirm VIP Chauffeur
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
