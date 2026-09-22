import React, { useState, useEffect, useRef, FormEvent, MouseEvent, TouchEvent, ChangeEvent } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle, 
  FileText, 
  Building, 
  User, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  FileCheck, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  CloudLightning, 
  Award, 
  Clock, 
  ChevronRight, 
  Eye, 
  Trash2, 
  Upload, 
  Download,
  AlertTriangle,
  Info,
  Sun,
  Moon
} from 'lucide-react';
import LogoIcon from './LogoIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { DateStringField } from './forms/DateTimeField';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface CourierOnboardingProps {
  onNavigate: (page: 'home' | 'merchants' | 'properties' | 'restaurants' | 'experiences' | 'merchant_onboarding' | 'properties' | 'couriers' | 'courier_onboarding') => void;
}

interface FleetRider {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  licenseNumber: string;
  vehicleType: string;
  plateNumber: string;
}

export default function CourierOnboarding({ onNavigate }: CourierOnboardingProps) {
  const { isLight } = useTheme();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<'independent' | 'dedicated' | 'fleet'>('independent');
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw');
  
  // Signature ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // General Form States
  const [formData, setFormData] = useState({
    // Ind & Ded Personal Details
    fullName: '',
    dob: '',
    gender: '',
    nationality: 'Kenyan',
    phone: '',
    altPhone: '',
    county: '',
    subCounty: '',
    address: '',
    
    // Dedicated Shift Preferences
    shift: 'Morning (6am–2pm)',
    zone: '',
    vehiclePref: 'Motorcycle',

    // Ind ID & Vehicle
    idNum: '',
    kraPin: '',
    dlNum: '',
    dlExpiry: '',
    vehicleType: 'Motorcycle',
    plateNum: '',
    vehicleModel: '',

    // Service checklist
    services: ['Ride-Hailing', 'Package Delivery'],
    payoutMode: 'M-Pesa',
    mpesaNum: '',
    bankName: '',
    accHolder: '',
    accNum: '',

    // Emergency Contact
    emergName: '',
    emergRel: '',
    emergPhone: '',

    // Digital signature name
    signatoryName: '',

    // Fleet Company Profile
    flName: '',
    flTradingName: '',
    flKraPIN: '',
    flRegNum: '',
    flAddress: '',
    flCity: 'Nairobi',
    flContactName: '',
    flContactTitle: '',
    flContactPhone: '',
    flContactEmail: '',
    flContactWa: '',

    // Fleet operational details
    flTotalRiders: '',
    flTotalVehicles: '',
    flExperience: '',
    flZones: '',
    flVehicleTypes: ['Motorcycles'],
    flCheckIns: true,
    flCheckRiderDl: true,
    flCheckLegal: true,
  });

  // Fleet Riders list
  const [fleetRiders, setFleetRiders] = useState<FleetRider[]>([]);
  const [csvRiders, setCsvRiders] = useState<FleetRider[]>([]);
  const [csvFileUploaded, setCsvFileUploaded] = useState<boolean>(false);
  const [csvFileName, setCsvFileName] = useState<string>('');

  // Uploaded Files Tracker (storing file names for display)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Setup signatures and dates
  const todayDateStr = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Dynamic route steps depending on selected Type
  const indSteps = ['Pathway', 'Personal Profile', 'ID & Vehicle', 'Documents', 'Payout & Contact', 'Agreement', 'Success'];
  const dedSteps = ['Pathway', 'Personal Profile', 'ID & Preferences', 'Documents', 'Payout & Contact', 'Agreement', 'Success'];
  const fleetSteps = ['Pathway', 'Company Profile', 'Fleet Operations', 'Add Riders', 'Verification Documents', 'Agreement', 'Success'];

  const getSteps = () => {
    if (selectedType === 'fleet') return fleetSteps;
    if (selectedType === 'dedicated') return dedSteps;
    return indSteps;
  };

  const steps = getSteps();

  // Draw on canvas setup
  useEffect(() => {
    if (currentStep === 6 && sigMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1a1c1c';
      }
    }
  }, [currentStep, sigMode]);

  // Handle drawing events on Canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    // Prevent scrolling on touch devices
    if (e.cancelable) e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Check if canvas is completely empty/unwritten
  const isCanvasBlank = () => {
    if (!canvasRef.current) return true;
    const canvas = canvasRef.current;
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  };

  // Change individual input value
  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle checklist values (such as services or vehicle types)
  const toggleCheckbox = (key: 'services' | 'flVehicleTypes', value: string) => {
    setFormData(prev => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(item => item !== value) };
      } else {
        return { ...prev, [key]: [...arr, value] };
      }
    });
  };

  // Handling file simulation uploads
  const handleFileUpload = (inputKey: string, fileName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [inputKey]: fileName
    }));
  };

  // CSV Parse implementation
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCsvFileUploaded(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      if (lines.length < 2) return;

      const parsedRiders: FleetRider[] = [];
      // Simple CSV row parser (assuming standard format: Name,Phone,ID,License,Vehicle,Plate)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handling basic split by commas (without nested complex quotes)
        const cols = line.split(',').map(c => c.trim());
        if (cols[0]) {
          parsedRiders.push({
            id: `csv-${Date.now()}-${i}`,
            name: cols[0] || '',
            phone: cols[1] || '',
            idNumber: cols[2] || '',
            licenseNumber: cols[3] || '',
            vehicleType: cols[4] || 'Motorcycle',
            plateNumber: cols[5] || ''
          });
        }
      }
      setCsvRiders(parsedRiders);
    };
    reader.readAsText(file);
  };

  // Add individual manual rider to Fleet List
  const addFleetRider = () => {
    const newRider: FleetRider = {
      id: `manual-${Date.now()}`,
      name: '',
      phone: '',
      idNumber: '',
      licenseNumber: '',
      vehicleType: 'Motorcycle',
      plateNumber: ''
    };
    setFleetRiders(prev => [...prev, newRider]);
  };

  // Update a field inside a specific fleet rider card
  const updateFleetRider = (id: string, field: keyof FleetRider, value: string) => {
    setFleetRiders(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Remove fleet rider card
  const removeFleetRider = (id: string) => {
    setFleetRiders(prev => prev.filter(r => r.id !== id));
  };

  // Download Mock CSV Template
  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Full Name,Phone,ID Number,License Number,Vehicle Type,Plate Number\n"
      + "John Kamau Maina,+254712345678,12345678,DL-55231X,Motorcycle,KMCA 123A\n"
      + "Mary Wanjiku Mwangi,+254722987654,87654321,DL-99432B,Motorcycle,KMCB 456C\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nexg_fleet_riders_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Validation before changing steps
  const validateStep = (): boolean => {
    // Step 1: Pathway
    if (currentStep === 1) return true;

    // Independent & Dedicated Personal Profile (Step 2)
    if (currentStep === 2 && selectedType !== 'fleet') {
      if (!formData.fullName || !formData.dob || !formData.gender || !formData.phone || !formData.county || !formData.address) {
        alert('Please fill out all required fields.');
        return false;
      }
      return true;
    }

    // Independent & Dedicated ID & Vehicle (Step 3)
    if (currentStep === 3 && selectedType !== 'fleet') {
      if (!formData.idNum || !formData.kraPin || !formData.dlNum || !formData.dlExpiry) {
        alert('Please complete identification requirements.');
        return false;
      }
      if (selectedType === 'independent' && !formData.plateNum) {
        alert('Independent riders must register their vehicle license plate.');
        return false;
      }
      return true;
    }

    // Documents upload stage (Step 4)
    if (currentStep === 4 && selectedType !== 'fleet') {
      if (!uploadedFiles['indIdFile'] || !uploadedFiles['indDlFile'] || !uploadedFiles['indPinFile']) {
        alert('Please upload all required identification documents.');
        return false;
      }
      if (selectedType === 'independent' && !uploadedFiles['indLogbookFile']) {
        alert('Independent riders must upload their vehicle logbook/insurance document.');
        return false;
      }
      return true;
    }

    // Services & Payout Stage (Step 5)
    if (currentStep === 5 && selectedType !== 'fleet') {
      if (!formData.emergName || !formData.emergRel || !formData.emergPhone) {
        alert('Please complete the emergency contact details.');
        return false;
      }
      if (formData.payoutMode === 'M-Pesa' && !formData.mpesaNum) {
        alert('Please input your payout M-Pesa number.');
        return false;
      }
      if (formData.payoutMode === 'Bank' && (!formData.bankName || !formData.accNum)) {
        alert('Please complete bank details for payment settlement.');
        return false;
      }
      return true;
    }

    // Company profile (Step 2) for Fleet Partner
    if (currentStep === 2 && selectedType === 'fleet') {
      if (!formData.flName || !formData.flKraPIN || !formData.flRegNum || !formData.flAddress || !formData.flContactName || !formData.flContactPhone || !formData.flContactEmail) {
        alert('Please fill out all mandatory company and contact details.');
        return false;
      }
      return true;
    }

    // Operational info (Step 3) for Fleet Partner
    if (currentStep === 3 && selectedType === 'fleet') {
      if (!formData.flTotalRiders || !formData.flTotalVehicles || !formData.flExperience || !formData.flZones) {
        alert('Please complete operational profiles.');
        return false;
      }
      return true;
    }

    // Riders upload (Step 4) for Fleet Partner
    if (currentStep === 4 && selectedType === 'fleet') {
      if (fleetRiders.length === 0 && csvRiders.length === 0) {
        alert('Please add at least one rider manually or import a valid riders CSV spreadsheet.');
        return false;
      }
      return true;
    }

    // Upload files (Step 5) for Fleet Partner
    if (currentStep === 5 && selectedType === 'fleet') {
      if (!uploadedFiles['flCertFile'] || !uploadedFiles['flPinFile'] || !uploadedFiles['flInsFile'] || !uploadedFiles['flDirectorIdFile']) {
        alert('Please upload all required business verification certificates.');
        return false;
      }
      return true;
    }

    // Signature agreements (Step 6)
    if (currentStep === 6) {
      if (!formData.signatoryName) {
        alert('Please sign with your authorized legal name.');
        return false;
      }
      if (sigMode === 'draw' && isCanvasBlank()) {
        alert('Please draw your digital signature on the signature pad.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setCurrentStep(7); // success page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic contract markup pre-fill for Independent / Dedicated
  const renderIndContract = () => {
    const isDed = selectedType === 'dedicated';
    const finalVehicle = isDed ? formData.vehiclePref : formData.vehicleType;
    const finalPlate = isDed ? 'NEXG-Provided and Maintained Vehicle' : (formData.plateNum || '[Register License Plate]');
    
    return (
      <div className="space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed font-sans">
        <div className="text-center border-b pb-6 mb-6">
          <LogoIcon className="w-12 h-12 text-[#7a5821] mx-auto mb-2" />
          <h3 className="font-bold text-lg text-gray-900 uppercase">NEXG APP LIMITED</h3>
          <p className="text-[#7a5821] text-xs font-bold tracking-widest uppercase">
            {isDed ? 'Dedicated Rider Partner Agreement' : 'Independent Rider Logistics Agreement'}
          </p>
          <p className="text-gray-400 text-[11px] mt-1">Date: <strong className="text-gray-600">{todayDateStr}</strong></p>
        </div>

        <p>This Services Agreement (the "Agreement") is executed on this date by and between:</p>
        
        <p className="pl-4 border-l-2 border-amber-300">
          <strong>NEXG APP LIMITED</strong>, a legal logistics platform company incorporated in Kenya (hereinafter referred to as "NEXG"); and
        </p>

        <p className="pl-4 border-l-2 border-amber-300">
          <strong>{formData.fullName || '[Your Full Name]'}</strong>, an authorized, adult logistics contractor holding Kenyan ID/Passport No. <strong>{formData.idNum || '[ID Number]'}</strong> (hereinafter referred to as "Rider").
        </p>

        <h4 className="font-bold text-gray-950 mt-6 text-sm">1. Scope of Fleet Services</h4>
        <p>The Rider agrees to provide premium logistics, transportation, and white-glove errand solutions on behalf of clients booking through the NEXG App Ecosystem. Active capabilities agreed upon include: <strong>{formData.services.join(', ') || 'Premium Errands'}</strong>.</p>
        
        <h4 className="font-bold text-gray-950 mt-4 text-sm">2. Equipment & Vehicles</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Pathway Selected:</strong> <span className="capitalize font-semibold text-[#7a5821]">{selectedType} Rider</span></li>
          <li><strong>Vehicle Standard:</strong> {finalVehicle}</li>
          <li><strong>License Plate registration:</strong> {finalPlate}</li>
          {isDed && (
            <li><strong>Preferred Shift:</strong> {formData.shift} in operations zone <strong>{formData.zone || '[Operating Zone]'}</strong></li>
          )}
        </ul>

        <h4 className="font-bold text-gray-950 mt-4 text-sm">3. Compensation, Rates & Settlements</h4>
        <p>
          {isDed ? (
            'The Rider shall be compensated with a guaranteed base salary on a shift completion model, plus progressive milestones and rating multiplier bonuses. Settlements are processed direct to the M-Pesa/Bank accounts registered in this form weekly.'
          ) : (
            'The Rider shall earn platform delivery commissions per successfully closed trip or package delivery. Settlements are compiled weekly and dispatched directly with a platform maintenance fee of 15% withheld by NEXG.'
          )}
        </p>

        <h4 className="font-bold text-gray-950 mt-4 text-sm">4. Standard Code of Conduct & Integrity</h4>
        <p>Rider agrees to strictly wear the customized NEXG apparel on duty, maintain exemplary clean vehicle hygiene, arrive within specified time slots, and respect international hospitality guests' absolute privacy. Failure to maintain a minimum 4.0/5.0 star rating may result in temporary profile deactivation.</p>

        <h4 className="font-bold text-gray-950 mt-4 text-sm">5. Termination Clause</h4>
        <p>This agreement begins immediately on approval and is valid for a period of 12 months. Either party may terminate with 7 days' written notice, or NEXG may block platform access instantly in cases of safety breach, driving license revocation, or fraudulent behavior.</p>

        <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-8 mt-8">
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">For NEXG App</p>
            <div className="h-10 flex items-end mb-1">
              <span className="font-mono text-xs text-gray-400 font-semibold italic">NEXG Fleet Operations</span>
            </div>
            <div className="h-0.5 bg-gray-200 w-full mb-1"></div>
            <p className="text-[11px] text-gray-500">Authorized Dispatch Committee</p>
          </div>

          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">Accepted & Agreed by Rider</p>
            <div className="h-10 flex items-end mb-1">
              {sigMode === 'type' ? (
                <span className="font-serif text-2xl text-[#7a5821] italic tracking-wide">{formData.signatoryName || '—'}</span>
              ) : (
                canvasRef.current && !isCanvasBlank() && (
                  <img src={canvasRef.current.toDataURL()} alt="Signature" className="h-12 max-w-[150px] object-contain opacity-90" />
                )
              )}
            </div>
            <div className="h-0.5 bg-gray-200 w-full mb-1"></div>
            <p className="text-[11px] text-gray-900 font-bold">{formData.fullName || '[Rider Signature Name]'}</p>
            <p className="text-[10px] text-gray-500">Rider Partner • Date: {todayDateStr}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="onboarding-theme bg-slate-50 text-slate-900 font-sans antialiased min-h-screen pt-[88px] pb-20 selection:bg-[#E5B65F] selection:text-black">
      
      {/* Top Header Navigation Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100">
        <div className="flex justify-between items-center w-full px-8 xl:px-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('couriers')}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
              title="Back to Couriers"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => onNavigate('couriers')}>
              <LogoIcon className="w-10 h-10 text-[#7a5821]" />
              <div className="flex flex-col ml-1">
                <span className="font-bold text-lg leading-none tracking-widest text-gray-900">NEXG</span>
                <span className="text-[8px] uppercase tracking-[0.25em] text-gray-500 mt-0.5">App</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest block">{t.partnersPortal.riderPortal}</span>
              <span className="text-[11px] text-[#7a5821] font-bold mt-0.5 block">{t.partnersPortal.eastAfricaSecure}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10 mt-6">
        
        {/* Progress Tracker Stepper Header */}
        {currentStep < 7 && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3 text-xs md:text-sm">
              <span className="font-bold text-gray-900">
                Step {currentStep} of {steps.length} • {steps[currentStep - 1]}
              </span>
              <span className="bg-[#7a5821]/10 text-[#7a5821] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedType === 'fleet' ? 'Fleet Partner' : selectedType === 'dedicated' ? 'Dedicated Rider' : 'Independent'}
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#7a5821] via-[#c49a5c] to-[#E5B65F] rounded-full transition-colors duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Banner Title */}
          <div className="bg-[#1a1c1c] px-8 py-8 md:px-12 md:py-10 text-white relative overflow-hidden border-b border-gray-800">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-[#c49a5c] to-[#E5B65F] opacity-15 rounded-full blur-2xl"></div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Join the Elite NEXG Rider Fleet
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
              Unlock premier delivery earnings, tailored branding, and unmatched support in Kenya’s luxury hospitality ecosystem.
            </p>
          </div>

          <form onSubmit={handleFinish} className="px-8 py-10 md:px-12 space-y-0">
            
            {/* =======================================
                STEP 1: PATHWAY SELECTION
                ======================================= */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Partnership model</h2>
                  <p className="text-gray-500 text-sm">
                    Select the model that aligns with your assets. We have personalized contracts and onboarding checklist steps for each path.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Option 1: Independent */}
                  <label 
                    onClick={() => setSelectedType('independent')}
                    className={`border-2 rounded-[28px] p-6 cursor-pointer block transition group relative select-none text-center ${
                      selectedType === 'independent' 
                        ? 'border-[#7a5821] bg-[#7a5821]/5 shadow-md' 
                        : 'border-gray-200 hover:border-[#7a5821] hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="riderType" 
                      value="independent" 
                      checked={selectedType === 'independent'}
                      onChange={() => setSelectedType('independent')}
                      className="absolute top-4 right-4 accent-[#7a5821] w-4 h-4 cursor-pointer"
                    />
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-colors ${
                      selectedType === 'independent' ? 'bg-[#7a5821] text-white' : 'bg-[#7a5821]/10 text-[#7a5821]'
                    }`}>
                      <Truck size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">Independent Rider</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      Drive your own motorcycle or scooter, set your flexible calendar hours, and take commissions per successfully completed errand.
                    </p>
                    <div className="space-y-2 text-left border-t border-gray-100 pt-4">
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        100% Own Calendar Flex
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Own Vehicle required
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Premium Commission Payout
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Dedicated */}
                  <label 
                    onClick={() => setSelectedType('dedicated')}
                    className={`border-2 rounded-[28px] p-6 cursor-pointer block transition group relative select-none text-center ${
                      selectedType === 'dedicated' 
                        ? 'border-[#7a5821] bg-[#7a5821]/5 shadow-md' 
                        : 'border-gray-200 hover:border-[#7a5821] hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="riderType" 
                      value="dedicated" 
                      checked={selectedType === 'dedicated'}
                      onChange={() => setSelectedType('dedicated')}
                      className="absolute top-4 right-4 accent-[#7a5821] w-4 h-4 cursor-pointer"
                    />
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-colors ${
                      selectedType === 'dedicated' ? 'bg-[#7a5821] text-white' : 'bg-[#7a5821]/10 text-[#7a5821]'
                    }`}>
                      <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">NEXG Dedicated Rider</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      Ride custom NEXG-branded premium logistics vehicles, operate consistent shifts, and enjoy a stable guaranteed base salary.
                    </p>
                    <div className="space-y-2 text-left border-t border-gray-100 pt-4">
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        NEXG Provides Vehicle
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Guaranteed Base Salary
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Structured Shift schedules
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Fleet Partner */}
                  <label 
                    onClick={() => setSelectedType('fleet')}
                    className={`border-2 rounded-[28px] p-6 cursor-pointer block transition group relative select-none text-center ${
                      selectedType === 'fleet' 
                        ? 'border-[#7a5821] bg-[#7a5821]/5 shadow-md' 
                        : 'border-gray-200 hover:border-[#7a5821] hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="riderType" 
                      value="fleet" 
                      checked={selectedType === 'fleet'}
                      onChange={() => setSelectedType('fleet')}
                      className="absolute top-4 right-4 accent-[#7a5821] w-4 h-4 cursor-pointer"
                    />
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-colors ${
                      selectedType === 'fleet' ? 'bg-[#7a5821] text-white' : 'bg-[#7a5821]/10 text-[#7a5821]'
                    }`}>
                      <Building size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">Fleet Partner</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      Onboard your registered Kenyan logistics agency and entire courier squad. Bulk upload riders and manage team-level settlements.
                    </p>
                    <div className="space-y-2 text-left border-t border-gray-100 pt-4">
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Company-Level Portal
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Bulk CSV Squad Import
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <Check size={12} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                        Consolidated Business payout
                      </div>
                    </div>
                  </label>

                </div>
              </div>
            )}

            {/* =======================================
                INDEPENDENT & DEDICATED PATH: PERSONAL PROFILE
                ======================================= */}
            {currentStep === 2 && selectedType !== 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <User className="text-[#7a5821]" size={20} />
                    Personal Profile Details
                  </h2>
                  <p className="text-gray-500 text-xs">Ensure your details correspond exactly with your National Identification Document.</p>
                </div>

                {selectedType === 'dedicated' && (
                  <div className="bg-[#FDF9F1] border border-[#F3E5C8] rounded-2xl p-4 flex gap-3 text-xs text-[#967C3B] leading-relaxed">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Dedicated Rider Note:</strong> You are applying for a scheduled, salaried position. NEXG provides custom branded bikes, gear, and fuel budgets. Below, you will also designate your operational preferences.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Full Name (as on National ID) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. John Kamau Maina"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <DateStringField
                    label="Date of Birth *"
                    value={formData.dob}
                    onChange={(v) => handleChange('dob', v)}
                    placeholder="Choose your date of birth"
                    // A date of birth cannot be in the future. Enforced in the calendar
                    // rather than by a validation message after submission, so the
                    // impossible choice is never offered.
                    maximumDate={new Date()}
                  />

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Gender <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821] appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Nationality <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.nationality}
                      onChange={(e) => handleChange('nationality', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">WhatsApp Mobile Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 text-gray-400" size={16} />
                      <input 
                        type="tel" 
                        required
                        placeholder="E.g. +254 712 345 678"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Alternative Contact Phone</label>
                    <input 
                      type="tel" 
                      placeholder="E.g. +254 700 111 222"
                      value={formData.altPhone}
                      onChange={(e) => handleChange('altPhone', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">Residential Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">County <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Nairobi"
                        value={formData.county}
                        onChange={(e) => handleChange('county', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Sub-County / Estate</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Westlands"
                        value={formData.subCounty}
                        onChange={(e) => handleChange('subCounty', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Estate Area / Street <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Kileleshwa, Block D"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =======================================
                INDEPENDENT & DEDICATED PATH: ID & PREFERENCES
                ======================================= */}
            {currentStep === 3 && selectedType !== 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <FileCheck className="text-[#7a5821]" size={20} />
                    Identification & Vehicle Setup
                  </h2>
                  <p className="text-gray-500 text-xs">Submit official identification and transit licensing details.</p>
                </div>

                {selectedType === 'dedicated' && (
                  <div className="bg-[#7a5821]/5 border border-[#7a5821]/15 rounded-2xl p-4 text-xs text-[#7a5821] leading-relaxed">
                    <strong>Note:</strong> Your premium motorbike is provided by NEXG. You do not need to register a personal motorbike logbook or license plate here.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">National ID / Passport Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. 12345678"
                      value={formData.idNum}
                      onChange={(e) => handleChange('idNum', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">KRA PIN Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. A001234567Z"
                      value={formData.kraPin}
                      onChange={(e) => handleChange('kraPin', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">NTSA Driver's License Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. DL-XXXXXX"
                      value={formData.dlNum}
                      onChange={(e) => handleChange('dlNum', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <DateStringField
                    label="Driver's License Expiry Date *"
                    value={formData.dlExpiry}
                    onChange={(v) => handleChange('dlExpiry', v)}
                    placeholder="Choose the expiry date"
                    // A licence that has already expired cannot be used to onboard, so the
                    // calendar does not offer it. The alternative is accepting the date and
                    // rejecting the courier at review, which wastes their time.
                    minimumDate={new Date()}
                  />
                </div>

                {/* Vehicle Setup section (Hidden/Dimmed for Dedicated, required for Independent) */}
                {selectedType === 'independent' ? (
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h3 className="font-bold text-gray-900 text-sm">Vehicle Registration details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Vehicle Type <span className="text-red-500">*</span></label>
                        <select
                          required
                          value={formData.vehicleType}
                          onChange={(e) => handleChange('vehicleType', e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821] appearance-none"
                        >
                          <option value="Motorcycle">Motorcycle / Scooter</option>
                          <option value="Executive Car">Executive Sedan / Van</option>
                          <option value="Bicycle">Bicycle</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">License Plate (NTSA) <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          placeholder="E.g. KMCA 123A"
                          value={formData.plateNum}
                          onChange={(e) => handleChange('plateNum', e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Vehicle Model & Color</label>
                        <input 
                          type="text" 
                          placeholder="E.g. Red Honda CB125F (Year 2023)"
                          value={formData.vehicleModel}
                          onChange={(e) => handleChange('vehicleModel', e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Dedicated shifts/zones
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h3 className="font-bold text-gray-900 text-sm">Shift & Operating Zones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Preferred Working Shift <span className="text-red-500">*</span></label>
                        <select
                          value={formData.shift}
                          onChange={(e) => handleChange('shift', e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821] appearance-none"
                        >
                          <option value="Morning (6am–2pm)">Morning Shift (6am – 2pm)</option>
                          <option value="Afternoon (2pm–10pm)">Afternoon Shift (2pm – 10pm)</option>
                          <option value="Night (10pm–6am)">Night Shift (10pm – 6am)</option>
                          <option value="Full Day">Flexible Shifts</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Preferred Operating Area Zone <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          placeholder="E.g. Westlands, Kilimani, Lavington"
                          value={formData.zone}
                          onChange={(e) => handleChange('zone', e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Preferred Transit Vehicle Assigned</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Motorcycle', 'TukTuk', 'Executive Car'].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => handleChange('vehiclePref', v)}
                              className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition-colors cursor-pointer ${
                                formData.vehiclePref === v
                                  ? 'border-[#7a5821] bg-[#7a5821]/5 text-[#7a5821]'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =======================================
                INDEPENDENT & DEDICATED PATH: DOCUMENTS
                ======================================= */}
            {currentStep === 4 && selectedType !== 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Upload className="text-[#7a5821]" size={20} />
                    Document Verification Uploads
                  </h2>
                  <p className="text-gray-500 text-xs">Upload crisp clear photo snapshots or PDF files under 5MB size limit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Document 1 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">National ID (Both sides) <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">Clear scanned copy of front and back face of your card.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="indIdFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('indIdFile', e.target.files?.[0]?.name || 'National_ID.pdf')}
                      />
                      <label 
                        htmlFor="indIdFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['indIdFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['indIdFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['indIdFile'] ? uploadedFiles['indIdFile'] : 'Upload National ID'}
                      </label>
                    </div>
                  </div>

                  {/* Document 2 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">NTSA Driving License <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">Both sides of your active, unexpired logistics driver license.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="indDlFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('indDlFile', e.target.files?.[0]?.name || 'NTSA_License.pdf')}
                      />
                      <label 
                        htmlFor="indDlFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['indDlFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['indDlFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['indDlFile'] ? uploadedFiles['indDlFile'] : 'Upload Driving License'}
                      </label>
                    </div>
                  </div>

                  {/* Document 3 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">KRA PIN Confirmation Certificate <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">Official KRA Pin certification document page from iTax portal.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="indPinFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('indPinFile', e.target.files?.[0]?.name || 'KRA_PIN.pdf')}
                      />
                      <label 
                        htmlFor="indPinFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['indPinFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['indPinFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['indPinFile'] ? uploadedFiles['indPinFile'] : 'Upload KRA PIN Page'}
                      </label>
                    </div>
                  </div>

                  {/* Document 4: (Only mandatory for Independent) */}
                  <div 
                    className={`border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm transition ${
                      selectedType === 'dedicated' ? 'opacity-40 select-none pointer-events-none' : ''
                    }`}
                  >
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        Vehicle Logbook & Third-Party Insurance <span className="text-red-500">*</span>
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">Proof of ownership and active public transit insurance coverage.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="indLogbookFile" 
                        disabled={selectedType === 'dedicated'}
                        className="hidden" 
                        onChange={(e) => handleFileUpload('indLogbookFile', e.target.files?.[0]?.name || 'Logbook_Insurance.pdf')}
                      />
                      <label 
                        htmlFor="indLogbookFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['indLogbookFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['indLogbookFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['indLogbookFile'] ? uploadedFiles['indLogbookFile'] : 'Upload Logbook & Cover'}
                      </label>
                    </div>
                  </div>

                </div>

                {/* Profile Photo Selfie */}
                <div className="border border-gray-200 bg-gray-50 p-6 rounded-[28px] mt-6">
                  <p className="font-bold text-gray-900 text-sm mb-1">Passport-Style Selfie Photo <span className="text-red-500">*</span></p>
                  <p className="text-gray-500 text-xs mb-5">Front-facing shot with clear neutral lighting. This is generated on your custom metal NEXG Ambassador ID Card.</p>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer relative group">
                      <input 
                        type="file" 
                        id="indSelfieFile" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload('indSelfieFile', e.target.files?.[0]?.name || 'Selfie.jpg')}
                      />
                      <label htmlFor="indSelfieFile" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                        {uploadedFiles['indSelfieFile'] ? (
                          <div className="absolute inset-0 bg-[#7a5821]/5 flex items-center justify-center text-xs font-bold text-[#7a5821]">
                            <CheckCircle size={20} />
                          </div>
                        ) : (
                          <Upload size={20} className="text-gray-300 group-hover:text-[#7a5821] transition-colors" />
                        )}
                      </label>
                    </div>
                    <div className="text-center sm:text-left text-xs text-gray-500 leading-relaxed">
                      <p className="font-bold text-gray-700">Recommended Image standard:</p>
                      <p>• Plain background with face fully uncovered.</p>
                      <p>• Clean resolution, minimum 400x400 pixels (JPG/PNG).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =======================================
                INDEPENDENT & DEDICATED PATH: PAYOUT & CONTACT
                ======================================= */}
            {currentStep === 5 && selectedType !== 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <CreditCard className="text-[#7a5821]" size={20} />
                    Services & Settlement Payout
                  </h2>
                  <p className="text-gray-500 text-xs">Configure how you receive settlements and who to contact in emergencies.</p>
                </div>

                {/* Service Offerings Checklist */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Which elite services are you interested to offer?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <label className="border-2 rounded-2xl p-4 flex flex-col items-center gap-2 bg-white cursor-pointer select-none transition-colors text-center">
                      <input 
                        type="checkbox" 
                        checked={formData.services.includes('Ride-Hailing')}
                        onChange={() => toggleCheckbox('services', 'Ride-Hailing')}
                        className="accent-[#7a5821] w-4.5 h-4.5 cursor-pointer mb-2"
                      />
                      <User className="text-[#7a5821] mb-1" size={24} />
                      <span className="text-sm font-bold text-gray-900">Ride-Hailing</span>
                      <span className="text-[11px] text-gray-400">Carry VIP guests to properties</span>
                    </label>

                    <label className="border-2 rounded-2xl p-4 flex flex-col items-center gap-2 bg-white cursor-pointer select-none transition-colors text-center">
                      <input 
                        type="checkbox" 
                        checked={formData.services.includes('Package Delivery')}
                        onChange={() => toggleCheckbox('services', 'Package Delivery')}
                        className="accent-[#7a5821] w-4.5 h-4.5 cursor-pointer mb-2"
                      />
                      <Truck className="text-[#7a5821] mb-1" size={24} />
                      <span className="text-sm font-bold text-gray-900">Package Delivery</span>
                      <span className="text-[11px] text-gray-400">Deliver premium retail items</span>
                    </label>

                    <label className="border-2 rounded-2xl p-4 flex flex-col items-center gap-2 bg-white cursor-pointer select-none transition-colors text-center">
                      <input 
                        type="checkbox" 
                        checked={formData.services.includes('Premium App')}
                        onChange={() => toggleCheckbox('services', 'Premium App')}
                        className="accent-[#7a5821] w-4.5 h-4.5 cursor-pointer mb-2"
                      />
                      <Award className="text-[#7a5821] mb-1" size={24} />
                      <span className="text-sm font-bold text-gray-900">Vip App</span>
                      <span className="text-[11px] text-gray-400">Handle high-end guest requests</span>
                    </label>

                  </div>
                </div>

                {/* Payout configurations */}
                <div className="border-t border-gray-100 pt-6 space-y-5">
                  <h3 className="font-bold text-gray-900 text-sm">Payout Settlement Configurations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Payout Method <span className="text-red-500">*</span></label>
                      <select
                        value={formData.payoutMode}
                        onChange={(e) => handleChange('payoutMode', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821] appearance-none"
                      >
                        <option value="M-Pesa">M-Pesa Mobile Money</option>
                        <option value="Bank">Bank Settlement Transfer</option>
                      </select>
                    </div>

                    {formData.payoutMode === 'M-Pesa' ? (
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">M-Pesa Number <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          required
                          placeholder="E.g. +254 712 345 678"
                          value={formData.mpesaNum}
                          onChange={(e) => handleChange('mpesaNum', e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 bg-gray-50 border border-gray-200 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Bank Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            required={formData.payoutMode === 'Bank'}
                            placeholder="E.g. Equity Bank"
                            value={formData.bankName}
                            onChange={(e) => handleChange('bankName', e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Account Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            required={formData.payoutMode === 'Bank'}
                            placeholder="E.g. John Kamau"
                            value={formData.accHolder}
                            onChange={(e) => handleChange('accHolder', e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Account Number <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            required={formData.payoutMode === 'Bank'}
                            placeholder="E.g. 12001234567"
                            value={formData.accNum}
                            onChange={(e) => handleChange('accNum', e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency contact */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">Emergency Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Full Legal Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Mary Jane"
                        value={formData.emergName}
                        onChange={(e) => handleChange('emergName', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Relationship <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Spouse / Parent"
                        value={formData.emergRel}
                        onChange={(e) => handleChange('emergRel', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Emergency Mobile Phone <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        required
                        placeholder="E.g. +254 711 000 000"
                        value={formData.emergPhone}
                        onChange={(e) => handleChange('emergPhone', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* =======================================
                FLEET PARTNER PATH: COMPANY PROFILE
                ======================================= */}
            {currentStep === 2 && selectedType === 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Building className="text-[#7a5821]" size={20} />
                    Fleet Partner Business Profile
                  </h2>
                  <p className="text-gray-500 text-xs">Configure your legal registered business details for logistics partnerships.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Company Legal Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. Swift Express Logistics Ltd"
                      value={formData.flName}
                      onChange={(e) => handleChange('flName', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Trading Name / Brand Name</label>
                    <input 
                      type="text" 
                      placeholder="E.g. Swift Deliveries"
                      value={formData.flTradingName}
                      onChange={(e) => handleChange('flTradingName', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Business KRA PIN <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. P051234567Z"
                      value={formData.flKraPIN}
                      onChange={(e) => handleChange('flKraPIN', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Certificate of Incorporation / Reg No. <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. CPR/2018/12345"
                      value={formData.flRegNum}
                      onChange={(e) => handleChange('flRegNum', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Company Office Headquarters <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. Corner House, 4th Floor, Kimathi St."
                      value={formData.flAddress}
                      onChange={(e) => handleChange('flAddress', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">City HQ Location <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.flCity}
                      onChange={(e) => handleChange('flCity', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>
                </div>

                {/* Primary Contact Person */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Authorized Primary Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Full Legal Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Albert Mwangi"
                        value={formData.flContactName}
                        onChange={(e) => handleChange('flContactName', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Corporate Job Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Fleet Manager"
                        value={formData.flContactTitle}
                        onChange={(e) => handleChange('flContactTitle', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Direct Mobile Number <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        required
                        placeholder="E.g. +254 700 987 654"
                        value={formData.flContactPhone}
                        onChange={(e) => handleChange('flContactPhone', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Contact Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        required
                        placeholder="E.g. operations@swiftlogistics.co.ke"
                        value={formData.flContactEmail}
                        onChange={(e) => handleChange('flContactEmail', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        placeholder="E.g. +254 700 987 654"
                        value={formData.flContactWa}
                        onChange={(e) => handleChange('flContactWa', e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =======================================
                FLEET PARTNER PATH: FLEET OPERATIONS
                ======================================= */}
            {currentStep === 3 && selectedType === 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <Truck className="text-[#7a5821]" size={20} />
                    Fleet Operational Scale & Coverage
                  </h2>
                  <p className="text-gray-500 text-xs">Outline your company’s transit capacities and target operating logistics zones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Total Active Riders <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="E.g. 15"
                      value={formData.flTotalRiders}
                      onChange={(e) => handleChange('flTotalRiders', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Total Registered Vehicles <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="E.g. 15"
                      value={formData.flTotalVehicles}
                      onChange={(e) => handleChange('flTotalVehicles', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Years in Logistics Sector <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      placeholder="E.g. 4"
                      value={formData.flExperience}
                      onChange={(e) => handleChange('flExperience', e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Operating Counties & Estates Coverage <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="List all cities and estates where your fleet currently has active coverage. E.g. Nairobi CBD, Westlands, Kilimani, Mombasa, Diani, etc."
                    value={formData.flZones}
                    onChange={(e) => handleChange('flZones', e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Active Vehicle types represented in Fleet</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Motorcycles', 'TukTuks', 'Cars/Vans', 'Bicycles'].map((vt) => (
                      <label 
                        key={vt}
                        className={`border rounded-xl p-3 flex items-center gap-2 cursor-pointer text-xs select-none hover:bg-gray-50 transition-colors ${
                          formData.flVehicleTypes.includes(vt) ? 'border-[#7a5821] bg-[#7a5821]/5 text-[#7a5821]' : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={formData.flVehicleTypes.includes(vt)}
                          onChange={() => toggleCheckbox('flVehicleTypes', vt)}
                          className="accent-[#7a5821] w-4 h-4 cursor-pointer"
                        />
                        {vt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Compliance Declarations */}
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-[28px] space-y-3 shadow-inner">
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Fleet Integrity Declarations</h3>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.flCheckIns}
                      onChange={(e) => handleChange('flCheckIns', e.target.checked)}
                      className="accent-[#7a5821] w-4.5 h-4.5 cursor-pointer mt-0.5"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed select-none">
                      We declare that our organization maintains comprehensive third-party logistics insurance and active public liability coverage across all active fleet operators.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.flCheckRiderDl}
                      onChange={(e) => handleChange('flCheckRiderDl', e.target.checked)}
                      className="accent-[#7a5821] w-4.5 h-4.5 cursor-pointer mt-0.5"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed select-none">
                      We certify that all couriers listed in our squad profiles hold valid, unexpired NTSA driving licenses and clean background clearance certifications.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.flCheckLegal}
                      onChange={(e) => handleChange('flCheckLegal', e.target.checked)}
                      className="accent-[#7a5821] w-4.5 h-4.5 cursor-pointer mt-0.5"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed select-none">
                      We declare absolute compliance with Kenyan corporate regulations, active tax filings, and legal road safety acts.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* =======================================
                FLEET PARTNER PATH: ADD RIDERS
                ======================================= */}
            {currentStep === 4 && selectedType === 'fleet' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                      <Users className="text-[#7a5821]" size={20} />
                      Register Active Couriers Squad
                    </h2>
                    <p className="text-gray-500 text-xs">Add individual active riders to your partnership ledger.</p>
                  </div>
                  
                  <div className="flex gap-2.5">
                    <button 
                      type="button" 
                      onClick={addFleetRider}
                      className="bg-[#7a5821] hover:bg-[#c49a5c] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95"
                    >
                      + Add Rider Card
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('csvUploadInput')?.click()}
                      className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95"
                    >
                      <Download size={12} className="text-[#E5B65F]" />
                      Import CSV Spreadsheet
                    </button>
                    <input 
                      type="file" 
                      id="csvUploadInput" 
                      className="hidden" 
                      accept=".csv"
                      onChange={handleCsvUpload}
                    />
                  </div>
                </div>

                <div className="bg-[#FDF9F1] border border-[#F3E5C8] rounded-2xl p-4 text-xs text-[#967C3B] flex gap-3 leading-relaxed">
                  <Info size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Two simple ways to add riders in bulk:</strong><br />
                    • Click <strong>Add Rider Card</strong> to manually key in individual rider records.<br />
                    • Or click <strong>Import CSV</strong> and upload a standard spreadsheet with columns matching exactly: 
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded ml-1 font-mono font-bold text-[#7a5821]">Full Name, Phone, ID Number, License Number, Vehicle Type, Plate Number</code>
                    <button 
                      type="button"
                      onClick={downloadCSVTemplate}
                      className="text-amber-700 underline font-bold ml-2 hover:text-[#7a5821] block sm:inline mt-1 sm:mt-0"
                    >
                      Download Standard CSV Template
                    </button>
                  </div>
                </div>

                {/* Fleet Manual Riders cards */}
                {fleetRiders.length > 0 && (
                  <div className="space-y-5">
                    {fleetRiders.map((rider, index) => (
                      <div 
                        key={rider.id}
                        className="border border-gray-200 bg-white rounded-2xl p-6 relative shadow-sm space-y-4"
                      >
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            Rider Record Card
                          </span>
                          <button 
                            type="button"
                            onClick={() => removeFleetRider(rider.id)}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} /> Remove Card
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Full Legal Name *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="E.g. John Kamau"
                              value={rider.name}
                              onChange={(e) => updateFleetRider(rider.id, 'name', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#7a5821]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">WhatsApp Phone *</label>
                            <input 
                              type="tel" 
                              required
                              placeholder="E.g. +254 711..."
                              value={rider.phone}
                              onChange={(e) => updateFleetRider(rider.id, 'phone', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#7a5821]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">National ID No. *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="ID Number"
                              value={rider.idNumber}
                              onChange={(e) => updateFleetRider(rider.id, 'idNumber', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#7a5821]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">NTSA License DL No. *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="DL-XXXXX"
                              value={rider.licenseNumber}
                              onChange={(e) => updateFleetRider(rider.id, 'licenseNumber', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#7a5821]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Vehicle Type *</label>
                            <select
                              value={rider.vehicleType}
                              onChange={(e) => updateFleetRider(rider.id, 'vehicleType', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#7a5821] bg-white"
                            >
                              <option value="Motorcycle">Motorcycle</option>
                              <option value="TukTuk">TukTuk</option>
                              <option value="Car">Car</option>
                              <option value="Bicycle">Bicycle</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Plate Number</label>
                            <input 
                              type="text" 
                              placeholder="E.g. KMCA 123A"
                              value={rider.plateNumber}
                              onChange={(e) => updateFleetRider(rider.id, 'plateNumber', e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#7a5821]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CSV Uploaded list preview */}
                {csvFileUploaded && csvRiders.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <FileText className="text-[#7a5821]" size={16} />
                      CSV Spreadsheet Uploaded: <span className="text-gray-500 font-semibold">{csvFileName}</span>
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Full Name</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">ID Number</th>
                            <th className="px-4 py-3">DL Number</th>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Plate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {csvRiders.map((r, i) => (
                            <tr key={r.id} className="hover:bg-gray-50 text-gray-700">
                              <td className="px-4 py-2.5 font-bold text-gray-400">{i + 1}</td>
                              <td className="px-4 py-2.5 font-bold text-gray-900">{r.name}</td>
                              <td className="px-4 py-2.5">{r.phone}</td>
                              <td className="px-4 py-2.5">{r.idNumber}</td>
                              <td className="px-4 py-2.5 font-mono">{r.licenseNumber}</td>
                              <td className="px-4 py-2.5">{r.vehicleType}</td>
                              <td className="px-4 py-2.5 font-mono text-[#7a5821]">{r.plateNumber || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {fleetRiders.length === 0 && !csvFileUploaded && (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-400">
                    <Users size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">No active couriers added yet</p>
                    <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">Click Add Rider Card above or upload your riders spreadsheet via CSV bulk import.</p>
                  </div>
                )}

              </div>
            )}

            {/* =======================================
                FLEET PARTNER PATH: DOCUMENTS & SETTLEMENT
                ======================================= */}
            {currentStep === 5 && selectedType === 'fleet' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-[#7a5821]" size={20} />
                    Company Business Verification Documents
                  </h2>
                  <p className="text-gray-500 text-xs">Verify your registered logistics enterprise. Only PDF files and scanned images up to 5MB size are accepted.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Company Doc 1 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">Certificate of Incorporation <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">Official business registration certificate page issued by the Registrar of Companies.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="flCertFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('flCertFile', e.target.files?.[0]?.name || 'Cert_Incorporation.pdf')}
                      />
                      <label 
                        htmlFor="flCertFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['flCertFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['flCertFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['flCertFile'] ? uploadedFiles['flCertFile'] : 'Upload Certificate'}
                      </label>
                    </div>
                  </div>

                  {/* Company Doc 2 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">Company KRA PIN Certificate <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">Company-level Tax PIN registration document copy.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="flPinFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('flPinFile', e.target.files?.[0]?.name || 'Company_KRA_PIN.pdf')}
                      />
                      <label 
                        htmlFor="flPinFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['flPinFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['flPinFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['flPinFile'] ? uploadedFiles['flPinFile'] : 'Upload KRA PIN Document'}
                      </label>
                    </div>
                  </div>

                  {/* Company Doc 3 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">Commercial Fleet Insurance Policy <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">Active public third-party or comprehensive fleet cover policy certificate.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="flInsFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('flInsFile', e.target.files?.[0]?.name || 'Fleet_Insurance.pdf')}
                      />
                      <label 
                        htmlFor="flInsFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['flInsFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['flInsFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['flInsFile'] ? uploadedFiles['flInsFile'] : 'Upload Fleet Cover Policy'}
                      </label>
                    </div>
                  </div>

                  {/* Company Doc 4 */}
                  <div className="border border-gray-200 bg-gray-50 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">Signatory Director's National ID <span className="text-red-500">*</span></p>
                      <p className="text-gray-500 text-xs leading-relaxed">ID of the legal officer executing the Fleet Partnership Agreement.</p>
                    </div>
                    <div className="mt-6">
                      <input 
                        type="file" 
                        id="flDirectorIdFile" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('flDirectorIdFile', e.target.files?.[0]?.name || 'Director_ID.pdf')}
                      />
                      <label 
                        htmlFor="flDirectorIdFile" 
                        className={`w-full py-3 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          uploadedFiles['flDirectorIdFile'] 
                            ? 'bg-green-50 border-green-300 text-green-700' 
                            : 'bg-white border-gray-300 hover:border-[#7a5821] text-gray-700'
                        }`}
                      >
                        {uploadedFiles['flDirectorIdFile'] ? <CheckCircle size={14} /> : <Upload size={14} />}
                        {uploadedFiles['flDirectorIdFile'] ? uploadedFiles['flDirectorIdFile'] : 'Upload Director ID Copy'}
                      </label>
                    </div>
                  </div>

                </div>

                {/* Bank Settlements */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">Corporate Bank Settlement Account</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">NEXG remits compiled client transport payout settlements directly to your corporate account weekly on Mondays.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-inner">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Corporate Bank Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Equity Bank"
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 w-full text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Account Holder Legal Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="Company Account Title"
                        value={formData.accHolder}
                        onChange={(e) => handleChange('accHolder', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 w-full text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Account Number <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        placeholder="Account Number"
                        value={formData.accNum}
                        onChange={(e) => handleChange('accNum', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 w-full text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* =======================================
                STEP 6: AGREEMENT & SIGN (ALL PATHS)
                ======================================= */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                    <FileText className="text-[#7a5821]" size={20} />
                    Execute Partnership Agreement Contract
                  </h2>
                  <p className="text-gray-500 text-xs">Review pre-filled contract agreement clauses and apply your electronic signature.</p>
                </div>

                {/* Pre-filled Contract viewport */}
                <div className="border border-gray-200 bg-white rounded-3xl p-6 md:p-10 shadow-inner max-h-[420px] overflow-y-auto leading-relaxed border-gray-100">
                  {selectedType === 'fleet' ? (
                    <div className="space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed font-sans">
                      <div className="text-center border-b pb-6 mb-6">
                        <LogoIcon className="w-12 h-12 text-[#7a5821] mx-auto mb-2" />
                        <h3 className="font-bold text-lg text-gray-900 uppercase">NEXG APP LIMITED</h3>
                        <p className="text-[#7a5821] text-xs font-bold tracking-widest uppercase">
                          Corporate Fleet Partner logistics Framework
                        </p>
                        <p className="text-gray-400 text-[11px] mt-1">Date: <strong className="text-gray-600">{todayDateStr}</strong></p>
                      </div>

                      <p>This logistics partnership framework is executed by and between:</p>
                      <p className="pl-4 border-l-2 border-amber-300">
                        <strong>NEXG APP LIMITED</strong>, a leading transport and logistics concierge company in Kenya; and
                      </p>
                      <p className="pl-4 border-l-2 border-amber-300">
                        <strong>{formData.flName || '[Company Legal Name]'}</strong>, a registered agency incorporated under registration number <strong>{formData.flRegNum || '[Reg No]'}</strong> situated at <strong>{formData.flAddress || '[Business Address]'}</strong> (hereinafter referred to as "Fleet Provider").
                      </p>

                      <h4 className="font-bold text-gray-950 mt-6 text-sm">1. Fleet Declarations & Capacity</h4>
                      <p>The Fleet Provider certifies that they actively manage and pay a squad of <strong>{formData.flTotalRiders || '[Rider Count]'} active couriers</strong> operating <strong>{formData.flTotalVehicles || '[Vehicle Count]'} vehicles</strong> under direct commercial contract. The primary coverage area of operations agreed upon includes: <strong>{formData.flZones || '[Coverage Zones]'}</strong>.</p>
                      
                      <h4 className="font-bold text-gray-950 mt-4 text-sm">2. Platform Commission & Remittances</h4>
                      <p>NEXG agrees to compile and settle client order payments to the Fleet Provider’s registered bank account weekly on Mondays, less a platform operations commission fee of <strong>12%</strong> per completed logistics job.</p>

                      <h4 className="font-bold text-gray-950 mt-4 text-sm">3. Compliance, Insurance & Licensing</h4>
                      <p>The Fleet Provider represents and warrants that all couriers and motorbikes comply with roadworthy rules, hold comprehensive insurance certifications, and observe Kenya's Data Protection Act 2019 standards.</p>

                      <h4 className="font-bold text-gray-950 mt-4 text-sm">4. Term & Termination</h4>
                      <p>This contract is binding for a term of 12 months. Either partner may exit the frame by providing 14 days' written notice to the other party.</p>

                      <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-8 mt-8">
                        <div>
                          <p className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">For NEXG App</p>
                          <div className="h-10 flex items-end mb-1">
                            <span className="font-mono text-xs text-gray-400 font-semibold italic">NEXG Operations Admin</span>
                          </div>
                          <div className="h-0.5 bg-gray-200 w-full mb-1"></div>
                          <p className="text-[11px] text-gray-500">Board Operations Committee</p>
                        </div>

                        <div>
                          <p className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-6">Accepted For Fleet Provider</p>
                          <div className="h-10 flex items-end mb-1">
                            {sigMode === 'type' ? (
                              <span className="font-serif text-2xl text-[#7a5821] italic tracking-wide">{formData.signatoryName || '—'}</span>
                            ) : (
                              canvasRef.current && !isCanvasBlank() && (
                                <img src={canvasRef.current.toDataURL()} alt="Signature" className="h-12 max-w-[150px] object-contain opacity-90" />
                              )
                            )}
                          </div>
                          <div className="h-0.5 bg-gray-200 w-full mb-1"></div>
                          <p className="text-[11px] text-gray-900 font-bold">{formData.signatoryName || '[Officer Signature Name]'}</p>
                          <p className="text-[10px] text-gray-500">{formData.flContactTitle || 'Fleet Manager'} • Date: {todayDateStr}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    renderIndContract()
                  )}
                </div>

                {/* Digital Signature execution controls */}
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-[28px] space-y-6">
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <FileCheck className="text-[#7a5821]" size={18} />
                      Authorized Signature Panel
                    </span>
                    
                    {/* Toggle draw / type */}
                    <div className="flex bg-gray-200 p-1 rounded-xl text-xs max-w-max self-start">
                      <button 
                        type="button" 
                        onClick={() => setSigMode('draw')} 
                        className={`px-4 py-1.5 rounded-lg font-bold transition ${sigMode === 'draw' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Draw Signature
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSigMode('type')} 
                        className={`px-4 py-1.5 rounded-lg font-bold transition ${sigMode === 'type' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Type Signature
                      </button>
                    </div>
                  </div>

                  {/* Signatory Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                      Authorized Officer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Name exactly as printed on legal ID card"
                      value={formData.signatoryName}
                      onChange={(e) => handleChange('signatoryName', e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-3 w-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7a5821]"
                    />
                  </div>

                  {/* Draw Signature Canvas Panel */}
                  {sigMode === 'draw' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-gray-500">
                        Draw digital signature with finger or pointer <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-gray-300 bg-white rounded-2xl overflow-hidden relative shadow-inner">
                        <canvas 
                          ref={canvasRef}
                          width={600}
                          height={160}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-40 cursor-crosshair block bg-white touch-none"
                        />
                        <button 
                          type="button" 
                          onClick={clearCanvas}
                          className="absolute right-3.5 bottom-3.5 px-3 py-1.5 bg-gray-900 text-white hover:bg-black rounded-lg text-[10px] font-bold transition tracking-wider uppercase active:scale-95"
                        >
                          Clear canvas
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Type Signature preview */}
                  {sigMode === 'type' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-gray-500">Typed Electronic Signature preview</label>
                      <div className="border border-gray-200 bg-white p-6 rounded-2xl text-center shadow-inner select-none">
                        <p className="font-serif text-3xl text-[#7a5821] italic tracking-wider">
                          {formData.signatoryName || '- Enter Legal Name above -'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Terms check */}
                  <div className="flex items-start gap-3 bg-[#FDF9F1] p-4 border border-[#F3E5C8] rounded-2xl">
                    <input 
                      type="checkbox" 
                      required
                      id="contract-check"
                      className="rounded border-gray-300 text-[#7a5821] focus:ring-[#7a5821] mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="contract-check" className="text-xs text-gray-600 leading-relaxed select-none cursor-pointer">
                      I declare that all submitted profiles, legal certifications, and documents are genuine. I agree to fully adhere to NexG’s Rider terms, platform rules, and Code of Conduct.
                    </label>
                  </div>

                </div>
              </div>
            )}

            {/* =======================================
                STEP 7: SUCCESS PAGE (ONCE SUBMITTED)
                ======================================= */}
            {currentStep === 7 && (
              <div className="py-12 text-center max-w-lg mx-auto space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-md success-settle">
                  <CheckCircle size={48} className="fill-current text-white bg-green-600 rounded-full" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Onboarding Dossier Submitted!</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                    Excellent! Your partnership documentation has been successfully received and dispatched to our compliance review committee.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 text-left border border-gray-100 space-y-3 shadow-md text-sm">
                  <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 text-center">ONBOARDING PROFILE SUMMARY</h4>
                  <p><strong className="text-gray-500">Selected Pathway:</strong> <span className="font-bold capitalize text-[#7a5821]">{selectedType} Rider Partner</span></p>
                  <p><strong className="text-gray-500">Registered Name:</strong> <span className="font-bold text-gray-900">{selectedType === 'fleet' ? formData.flName : formData.fullName}</span></p>
                  <p><strong className="text-gray-500">Contact Number:</strong> <span className="font-semibold text-gray-900">{selectedType === 'fleet' ? formData.flContactPhone : formData.phone}</span></p>
                  <p><strong className="text-gray-500">Onboarding Status:</strong> <span className="text-amber-600 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs">Pending Compliance Review</span></p>
                </div>

                <div className="bg-[#f0f0f0] rounded-2xl p-6 text-left text-xs text-gray-500 space-y-3.5 leading-relaxed">
                  <p className="font-bold text-gray-700 text-center uppercase tracking-wider border-b border-gray-200 pb-2">NEXT STEPS IN OUR VERIFICATION TIMELINE</p>
                  <div className="flex gap-3">
                    <span className="font-bold text-[#7a5821] text-sm leading-none">1.</span>
                    <span><strong>Compliance Auditing (Within 24 Hours):</strong> Our compliance officers verify your submitted National ID, license, PIN, and fleet logbooks directly against NTSA registers.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-[#7a5821] text-sm leading-none">2.</span>
                    <span><strong>Ambassador Training Dispatch:</strong> Upon document clearance, you'll receive a WhatsApp invitation to join our premium standard customer service and hospitality training.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-[#7a5821] text-sm leading-none">3.</span>
                    <span><strong>Starter Kit Collection:</strong> Pick up your high-end insulated delivery backpack, tailored NEXG jacket, and active login credentials, and start your premium deliveries!</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    type="button" 
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 bg-[#1a1c1c] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-md active:scale-95"
                  >
                    <FileText size={16} /> Print Agreement Document
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onNavigate('couriers')}
                    className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                  >
                    Return to Elite Fleet page
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            {currentStep < 7 && (
              <div className="border-t border-gray-100 pt-8 mt-10 flex justify-between items-center bg-gray-50 -mx-8 -mb-10 px-8 py-5">
                <button 
                  type="button" 
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    currentStep === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:text-gray-900 cursor-pointer'
                  }`}
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                {currentStep === 6 ? (
                  <button 
                    type="submit"
                    className="bg-[#7a5821] hover:bg-[#c49a5c] text-white px-8 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer active:scale-95"
                  >
                    Submit Portfolio Agreement
                    <CheckCircle size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="bg-[#7a5821] hover:bg-[#c49a5c] text-white px-8 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer active:scale-95"
                  >
                    Next Step
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}

          </form>

        </div>
      </div>

    </div>
  );
}
