import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { CATALOG, FIELD_DEFS, SUGGESTED_SECTIONS, Category, Subcategory } from '../data/merchantCatalog';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { readMerchantDraft, useMerchantDraft } from '../hooks/useMerchantDraft';
import LanguageSwitcher from './LanguageSwitcher';
import { TimeStringField } from './forms/DateTimeField';

interface Branch {
  id: number;
  name: string;
  city: string;
  address: string;
  mapLink: string;
  contactName: string;
  contactPhone: string;
}

interface ForMerchantsProps {
  onNavigate?: (page: 'home' | 'merchants') => void;
}

export default function ForMerchants({ onNavigate }: ForMerchantsProps) {
  const { isLight } = useTheme();
  const { t } = useLanguage();

  /**
   * Restore the draft ONCE, synchronously, before any state is created.
   *
   * `useState(() => ...)` lazy initialisers read from this, so the first paint already
   * shows the restored form. Restoring in an effect instead would render an empty form
   * and then replace it, which flashes and moves the caret out from under anyone who
   * had already started typing.
   *
   * The read happens through a ref so it runs exactly once even under StrictMode's
   * double-invoke, and so no storage call happens on later renders.
   */
  const draftRef = useRef<ReturnType<typeof readMerchantDraft<Record<string, unknown>>> | null>(null);
  if (draftRef.current === null) {
    draftRef.current = readMerchantDraft<Record<string, unknown>>({});
  }
  const draft = (draftRef.current.data ?? {}) as Record<string, any>;

  const { save: saveDraft, clear: clearDraft, savedAt, restored, available: draftAvailable } =
    useMerchantDraft(draftRef.current.savedAt);



  // Stepper state
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const step = Number(draft.currentStep);
    return Number.isFinite(step) && step >= 1 && step <= 11 ? step : 1;
  });
  const totalSteps = 11;

  // Search filter for Category Grid
  const [categorySearch, setCategorySearch] = useState<string>('');

  // Selected Category and Subcategories.
  // Stored as IDS, not objects: the catalogue is static, so an id re-resolves to the
  // current record. Persisting the object would freeze a copy that silently diverges
  // the next time a category is renamed or its fields change.
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(() =>
    draft.selectedCategoryId ? CATALOG.find((c) => c.id === draft.selectedCategoryId) ?? null : null
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<Subcategory[]>(() => {
    if (!Array.isArray(draft.selectedSubcategoryIds) || !draft.selectedCategoryId) return [];
    const cat = CATALOG.find((c) => c.id === draft.selectedCategoryId);
    if (!cat) return [];
    const ids = new Set<string>(draft.selectedSubcategoryIds);
    return cat.subcategories.filter((s) => ids.has(s.id));
  });

  // Dynamic details state
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>(() => draft.dynamicFields ?? {});

  // Catalog Sections State
  const [selectedCatalogSections, setSelectedCatalogSections] = useState<
    Array<{ original: string | null; name: string; custom: boolean }>
  >(() => (Array.isArray(draft.selectedCatalogSections) ? draft.selectedCatalogSections : []));
  const [customSectionInput, setCustomSectionInput] = useState<string>('');

  // Business Profile
  const [profileData, setProfileData] = useState({
    legalName: '',
    tradingName: '',
    kraPin: '',
    website: '',
    shortDesc: '',
    ...(draft.profileData ?? {}),
  });

  // Locations & Branches
  const [branches, setBranches] = useState<Branch[]>(() =>
    Array.isArray(draft.branches) && draft.branches.length > 0
      ? draft.branches
      : [{ id: Date.now(), name: '', city: '', address: '', mapLink: '', contactName: '', contactPhone: '' }]
  );
  const [activeBranchMapId, setActiveBranchMapId] = useState<number | null>(null);

  // Maps Modal Leaflet state
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [mapCoords, setMapCoords] = useState<[number, number]>([-1.2833, 36.8219]);
  const [resolvedPlaceName, setResolvedPlaceName] = useState<string>('');
  const [isResolvingPlace, setIsResolvingPlace] = useState<boolean>(false);
  const [nominatimSearchResults, setNominatimSearchResults] = useState<Record<number, any[]>>({});
  const [searchingBranchId, setSearchingBranchId] = useState<number | null>(null);

  // Contacts & Socials
  const [contactData, setContactData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    ...(draft.contactData ?? {}),
  });

  // Operations & Delivery
  const [operatingDays, setOperatingDays] = useState<string[]>(() =>
    Array.isArray(draft.operatingDays) ? draft.operatingDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  );
  const [hoursMode, setHoursMode] = useState<'same' | 'split' | 'custom'>(() => draft.hoursMode ?? 'same');
  const [globalHours, setGlobalHours] = useState(() => ({
    opening: '08:00',
    closing: '20:00',
    ...(draft.globalHours ?? {}),
  }));
  const [groupHours, setGroupHours] = useState({
    Weekdays: { active: true, open: '08:00', close: '20:00' },
    Weekends: { active: true, open: '09:00', close: '16:00' }
  });
  const [dailyHours, setDailyHours] = useState<Record<string, { active: boolean; open: string; close: string }>>({
    Mon: { active: true, open: '08:00', close: '20:00' },
    Tue: { active: true, open: '08:00', close: '20:00' },
    Wed: { active: true, open: '08:00', close: '20:00' },
    Thu: { active: true, open: '08:00', close: '20:00' },
    Fri: { active: true, open: '08:00', close: '20:00' },
    Sat: { active: false, open: '09:00', close: '18:00' },
    Sun: { active: false, open: '09:00', close: '16:00' }
  });
  const [holidayMode, setHolidayMode] = useState<'closed' | 'same' | 'custom'>(() => draft.holidayMode ?? 'closed');
  const [holidayHours, setHolidayHours] = useState(() => ({
    open: '09:00',
    close: '16:00',
    ...(draft.holidayHours ?? {}),
  }));

  const [deliveryNexg, setDeliveryNexg] = useState<boolean>(() => draft.deliveryNexg ?? true);
  const [deliveryOwn, setDeliveryOwn] = useState<boolean>(() => draft.deliveryOwn ?? false);
  const [prepTime, setPrepTime] = useState<string>(() => draft.prepTime ?? '30 - 45 minutes');
  const [deliveryRadius, setDeliveryRadius] = useState<number>(() => draft.deliveryRadius ?? 15);

  // Payments
  const [paymentData, setPaymentData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    mpesaTill: '',
    mpesaPaybill: '',
    mpesaPaybillAcc: '',
    ...(draft.paymentData ?? {}),
  });

  // Documents & Branding
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({
    certFile: '',
    idFile: ''
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Agreement
  const [sigMode, setSigMode] = useState<'draw' | 'type'>(() => draft.sigMode ?? 'draw');
  const [signatoryName, setSignatoryName] = useState<string>(() => draft.signatoryName ?? '');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [signatureImage, setSignatureImage] = useState<string>('');

  // Drawing signature canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /**
   * Persist the applicant's work as they go.
   *
   * A fixed list, deliberately. Spreading all state would make any field added later
   * persist by default, including transient view state — and the failure mode is a
   * draft that restores with a modal open and a search term still in the box.
   *
   * `termsAccepted`, the signature image and the uploaded documents are NOT here:
   * consent to terms must be given in the session it applies to, a drawn signature is
   * an image payload that would exhaust the storage quota, and a File cannot be
   * serialised at all. The agreement step re-prompts, which is correct.
   */
  useEffect(() => {
    saveDraft({
      currentStep,
      selectedCategoryId: selectedCategory?.id ?? null,
      selectedSubcategoryIds: selectedSubcategories.map((s) => s.id),
      dynamicFields,
      selectedCatalogSections,
      profileData,
      branches,
      contactData,
      operatingDays,
      hoursMode,
      globalHours,
      holidayMode,
      holidayHours,
      deliveryNexg,
      deliveryOwn,
      prepTime,
      deliveryRadius,
      paymentData,
      sigMode,
      signatoryName,
      uploadedFiles,
      logoPreview,
    });
  }, [
    saveDraft,
    currentStep,
    selectedCategory,
    selectedSubcategories,
    dynamicFields,
    selectedCatalogSections,
    profileData,
    branches,
    contactData,
    operatingDays,
    hoursMode,
    globalHours,
    holidayMode,
    holidayHours,
    deliveryNexg,
    deliveryOwn,
    prepTime,
    deliveryRadius,
    paymentData,
    sigMode,
    signatoryName,
    uploadedFiles,
    logoPreview,
  ]);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Map initialization ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const mapMarkerRef = useRef<any>(null);

  // Dynamically import Leaflet assets if not loaded
  useEffect(() => {
    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    // Add Leaflet JS
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.body.appendChild(script);
    }
  }, []);

  // Sync signatory name with primary contact name initially
  useEffect(() => {
    if (contactData.fullName && !signatoryName) {
      setSignatoryName(contactData.fullName);
    }
  }, [contactData.fullName]);

  // Synchronize suggested catalog sections when category changes
  useEffect(() => {
    if (selectedCategory) {
      const suggestions = SUGGESTED_SECTIONS[selectedCategory.id] || [];
      setSelectedCatalogSections(
        suggestions.map(secName => ({
          original: secName,
          name: secName,
          custom: false
        }))
      );
    }
  }, [selectedCategory]);

  // Redraw Canvas Signature when moving to step 10
  useEffect(() => {
    if (currentStep === 10 && sigMode === 'draw') {
      setTimeout(() => {
        initSignatureCanvas();
      }, 200);
    }
  }, [currentStep, sigMode]);

  // Handle Dynamic Field inputs
  const handleDynamicFieldChange = (id: string, value: any) => {
    setDynamicFields(prev => ({ ...prev, [id]: value }));
  };

  // Helper to lookup Lucide Icon dynamically
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const IconComp = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComp className={className} />;
  };

  // Step 1 Filtering
  const filteredCategories = CATALOG.filter(cat => {
    const query = categorySearch.toLowerCase().trim();
    if (!query) return true;
    const matchCatName = cat.name.toLowerCase().includes(query);
    const matchCatDesc = cat.desc.toLowerCase().includes(query);
    const matchSub = cat.subcategories.some(sub => sub.name.toLowerCase().includes(query));
    return matchCatName || matchCatDesc || matchSub;
  });

  const selectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setSelectedSubcategories([]); // reset subcategories
    document.getElementById('chosenSubcategory')?.setAttribute('value', '');
  };

  const toggleSubcategory = (sub: Subcategory) => {
    setSelectedSubcategories(prev => {
      const exists = prev.some(s => s.id === sub.id);
      if (exists) {
        return prev.filter(s => s.id !== sub.id);
      } else {
        return [...prev, sub];
      }
    });
  };

  // Suggested sections toggling
  const toggleSuggestedSection = (secName: string) => {
    setSelectedCatalogSections(prev => {
      const exists = prev.some(s => s.name === secName);
      if (exists) {
        return prev.filter(s => s.name !== secName);
      } else {
        return [...prev, { original: secName, name: secName, custom: false }];
      }
    });
  };

  const addCustomSection = () => {
    const val = customSectionInput.trim();
    if (!val) return;
    if (selectedCatalogSections.some(s => s.name.toLowerCase() === val.toLowerCase())) {
      alert("A section with this name already exists.");
      return;
    }
    setSelectedCatalogSections(prev => [...prev, { original: null, name: val, custom: true }]);
    setCustomSectionInput('');
  };

  const removeSelectedSection = (idx: number) => {
    setSelectedCatalogSections(prev => prev.filter((_, i) => i !== idx));
  };

  const renameSelectedSection = (idx: number, newName: string) => {
    setSelectedCatalogSections(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], name: newName };
      return updated;
    });
  };

  // Branch operations
  const addBranch = () => {
    setBranches(prev => [
      ...prev,
      { id: Date.now(), name: '', city: '', address: '', mapLink: '', contactName: '', contactPhone: '' }
    ]);
  };

  const removeBranch = (id: number) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  const updateBranchField = (id: number, field: keyof Branch, value: string) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // Forward Nominatim Search
  const searchNominatimPlaces = async (query: string, branchId: number) => {
    if (!query || query.length < 2) {
      setNominatimSearchResults(prev => ({ ...prev, [branchId]: [] }));
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=ke&limit=5&addressdetails=1&accept-language=en`);
      if (response.ok) {
        const results = await response.json();
        setNominatimSearchResults(prev => ({ ...prev, [branchId]: results }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectNominatimResult = (res: any, branchId: number) => {
    const lat = parseFloat(res.lat);
    const lon = parseFloat(res.lon);
    const name = res.name || res.display_name.split(',')[0];
    const addr = res.display_name;
    const city = res.address?.city || res.address?.town || res.address?.county || res.address?.state || 'Nairobi';

    setBranches(prev => prev.map(b => b.id === branchId ? {
      ...b,
      name,
      address: addr,
      city,
      mapLink: `https://maps.google.com/?q=${lat.toFixed(5)},${lon.toFixed(5)}`
    } : b));

    // Clear results
    setNominatimSearchResults(prev => ({ ...prev, [branchId]: [] }));
    setSearchingBranchId(null);
  };

  // Reverse Geocoding Map
  const performReverseGeocode = async (lat: number, lng: number) => {
    setIsResolvingPlace(true);
    setResolvedPlaceName('Looking up location name...');
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&namedetails=1&accept-language=en`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        const name = data.namedetails?.name || data.name || data.display_name.split(',')[0] || '';
        const road = data.address?.road || '';
        const suburb = data.address?.suburb || data.address?.neighbourhood || '';
        const city = data.address?.city || data.address?.town || data.address?.county || 'Nairobi';
        const display = [name, road, suburb, city].filter(Boolean).join(', ');
        setResolvedPlaceName(display || 'Selected Coordinates');
        
        // Temporarily store resolved values for confirmation
        (leafletMapRef as any).currentResolved = {
          name: name || `Pin Point (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          address: display,
          city
        };
      }
    } catch (e) {
      setResolvedPlaceName('Selected Point');
    } finally {
      setIsResolvingPlace(false);
    }
  };

  // Setup Leaflet map inside Modal
  const initLeafletMap = (centerCoords: [number, number]) => {
    if (!(window as any).L) return;
    const L = (window as any).L;

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map('leafletMapContainer').setView(centerCoords, 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);

      mapMarkerRef.current = L.marker(centerCoords, { draggable: true }).addTo(leafletMapRef.current);

      mapMarkerRef.current.on('dragend', (e: any) => {
        const position = e.target.getLatLng();
        setMapCoords([position.lat, position.lng]);
        performReverseGeocode(position.lat, position.lng);
      });

      leafletMapRef.current.on('click', (e: any) => {
        const position = e.latlng;
        mapMarkerRef.current.setLatLng(position);
        setMapCoords([position.lat, position.lng]);
        performReverseGeocode(position.lat, position.lng);
      });
    } else {
      leafletMapRef.current.setView(centerCoords, 14);
      mapMarkerRef.current.setLatLng(centerCoords);
      leafletMapRef.current.invalidateSize();
    }

    performReverseGeocode(centerCoords[0], centerCoords[1]);
  };

  const handleOpenMapPicker = (branchId: number) => {
    setActiveBranchMapId(branchId);
    setShowMapModal(true);

    let startCoords: [number, number] = [-1.2833, 36.8219];
    const targetBranch = branches.find(b => b.id === branchId);
    if (targetBranch && targetBranch.mapLink) {
      const match = targetBranch.mapLink.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        startCoords = [parseFloat(match[1]), parseFloat(match[2])];
      }
    }
    setMapCoords(startCoords);

    setTimeout(() => {
      initLeafletMap(startCoords);
    }, 300);
  };

  const handleConfirmMapPin = () => {
    if (activeBranchMapId !== null) {
      const resolved = (leafletMapRef as any).currentResolved || {
        name: `Pin Point (${mapCoords[0].toFixed(5)}, ${mapCoords[1].toFixed(5)})`,
        address: `Coordinates: ${mapCoords[0].toFixed(5)}, ${mapCoords[1].toFixed(5)}`,
        city: 'Nairobi'
      };

      setBranches(prev => prev.map(b => b.id === activeBranchMapId ? {
        ...b,
        name: resolved.name,
        address: resolved.address,
        city: resolved.city,
        mapLink: `https://maps.google.com/?q=${mapCoords[0].toFixed(5)},${mapCoords[1].toFixed(5)}`
      } : b));
    }
    setShowMapModal(false);
    leafletMapRef.current = null; // force reload next time
  };

  // Init HTML5 Drawing Signature Pad
  const initSignatureCanvas = () => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b'; // slate-800

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const drawStart = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true);
      const pos = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      if ('touches' in e) e.preventDefault();
    };

    const drawMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const pos = getMousePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      if ('touches' in e) e.preventDefault();
    };

    const drawEnd = () => {
      setIsDrawing(false);
      ctx.beginPath();
      // Save signature to state image
      setSignatureImage(canvasEl.toDataURL());
    };

    canvasEl.onmousedown = drawStart;
    canvasEl.onmousemove = drawMove;
    canvasEl.onmouseup = drawEnd;

    canvasEl.ontouchstart = drawStart;
    canvasEl.ontouchmove = drawMove;
    canvasEl.ontouchend = drawEnd;
  };

  const clearSignatureCanvas = () => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    setSignatureImage('');
  };

  // Step Validation Logic
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedCategory) {
      alert("Please select a Business Category to continue.");
      return;
    }
    if (currentStep === 2 && selectedSubcategories.length === 0) {
      alert("Please select at least one Business Type to continue.");
      return;
    }
    if (currentStep === 4) {
      if (!profileData.legalName || !profileData.tradingName || !profileData.kraPin) {
        alert("Please fill in all required (*) profile details.");
        return;
      }
    }
    if (currentStep === 5) {
      const hasEmptyReq = branches.some(b => !b.name || !b.city || !b.address);
      if (hasEmptyReq) {
        alert("Please fill in the Name, City, and Address for all added branches.");
        return;
      }
    }
    if (currentStep === 6) {
      if (!contactData.fullName || !contactData.email || !contactData.phone) {
        alert("Please fill in the Primary Contact details.");
        return;
      }
    }
    if (currentStep === 7) {
      if (!deliveryNexg && !deliveryOwn) {
        alert("Please choose at least one Delivery Option.");
        return;
      }
    }
    if (currentStep === 9) {
      // Allow moving next, files are optional or recommended
    }
    if (currentStep === 10) {
      if (!termsAccepted) {
        alert("You must accept the Partnership Agreement terms to sign.");
        return;
      }
      if (!signatoryName) {
        alert("Please enter your Authorized Signatory Name.");
        return;
      }
      if (sigMode === 'draw' && !signatureImage) {
        alert("Please draw your signature to execute the contract.");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Print Agreement contract
  const triggerPrint = () => {
    window.print();
  };

  // File Upload base64 helpers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setter(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Build Operations schedule display text
  const getOperatingHoursStr = () => {
    if (hoursMode === 'same') {
      return `${globalHours.opening} to ${globalHours.closing} (${operatingDays.join(', ')})`;
    } else if (hoursMode === 'split') {
      const list = [];
      if (groupHours.Weekdays.active) list.push(`Weekdays: ${groupHours.Weekdays.open} - ${groupHours.Weekdays.close}`);
      if (groupHours.Weekends.active) list.push(`Weekends: ${groupHours.Weekends.open} - ${groupHours.Weekends.close}`);
      return list.join('; ');
    } else {
      return Object.entries(dailyHours)
        .filter(([_, val]) => (val as any).active)
        .map(([day, val]) => `${day}: ${(val as any).open}-${(val as any).close}`)
        .join('; ');
    }
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setDynamicFields({});
    setSelectedCatalogSections([]);
    setProfileData({ legalName: '', tradingName: '', kraPin: '', website: '', shortDesc: '' });
    setBranches([{ id: Date.now(), name: '', city: '', address: '', mapLink: '', contactName: '', contactPhone: '' }]);
    setContactData({ fullName: '', email: '', phone: '', whatsapp: '', instagram: '', facebook: '', tiktok: '' });
    setPaymentData({ bankName: '', accountName: '', accountNumber: '', mpesaTill: '', mpesaPaybill: '', mpesaPaybillAcc: '' });
    setUploadedFiles({ certFile: '', idFile: '' });
    setLogoPreview('');
    setBannerPreview('');
    setSignatoryName('');
    setTermsAccepted(false);
    setSignatureImage('');
  };

  return (
    <div className="onboarding-theme bg-slate-50 min-h-screen text-slate-800">
      
      {/* Dynamic Style Injection for Font Cursive in Agreement Preview */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        .font-cursive {
          font-family: 'Caveat', cursive;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #printAgreementArea, #printAgreementArea * {
            visibility: visible;
          }
          #printAgreementArea {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
            padding: 20px;
          }
          /* Pin the neutral tokens back to light for print. The screen theme may have
             inverted them, and an agreement that prints as pale text on white paper is
             unusable. Declared on the print container itself so it wins for the whole
             subtree by proximity, the same mechanism the screen theme uses. */
          #printAgreementArea {
            --color-white: #ffffff;
            --color-slate-50: #f8fafc;
            --color-slate-100: #f1f5f9;
            --color-slate-200: #e2e8f0;
            --color-slate-300: #cbd5e1;
            --color-slate-400: #94a3b8;
            --color-slate-500: #64748b;
            --color-slate-600: #475569;
            --color-slate-700: #334155;
            --color-slate-800: #1e293b;
            --color-slate-900: #0f172a;
            --color-slate-950: #020617;
            --color-gray-50: #f9fafb;
            --color-gray-100: #f3f4f6;
            --color-gray-200: #e5e7eb;
            --color-gray-300: #d1d5db;
            --color-gray-400: #9ca3af;
            --color-gray-500: #6b7280;
            --color-gray-600: #4b5563;
            --color-gray-700: #374151;
            --color-gray-800: #1f2937;
            --color-gray-900: #111827;
            --color-gray-950: #030712;
            --color-black: #000000;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate?.('home')}>
            <span className="font-extrabold text-2xl tracking-widest text-[#E5B65F] font-sans hover:text-amber-500 transition-colors">NEXG</span>
            <span className="text-slate-300 font-light">|</span>
            <span className="text-sm font-semibold tracking-wide uppercase text-slate-600 hover:text-slate-900 transition-colors">Merchant Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => onNavigate?.('home')}
              className="text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-[#B88728] transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 px-3 py-1.5 rounded-xl"
            >
              {renderIcon('ArrowLeft', 'w-3.5 h-3.5')} {t.partnersPortal.backToSite}
            </button>
            <div className="hidden sm:flex items-center gap-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <span>{t.partnersPortal.onboardingStatus}</span>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-extrabold">{t.partnersPortal.activeStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Progress Timeline Header */}
        <div className="mb-8 no-print">
          <div className="flex justify-between items-center mb-3 text-xs md:text-sm text-slate-500">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="cursor-pointer text-[#E5B65F] hover:underline" onClick={() => onNavigate?.('home')}>Home</span>
              {selectedCategory && (
                <>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-600">{selectedCategory.name}</span>
                </>
              )}
            </div>
            <span className="font-bold text-slate-700 text-sm">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#E5B65F] via-amber-500 to-orange-500 transition-colors duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
          
          {/* Main Card Hero/Title banner */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 px-8 py-8 md:px-10 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-tr from-[#E5B65F] to-amber-500 opacity-20 rounded-full blur-2xl"></div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-sans tracking-tight">Expand Your Business with NEXG</h1>
            <p className="text-slate-300 mt-2 text-xs md:text-sm">Provide premium white-glove deliveries & concierge orders to luxury customers in Kenya.</p>
          </div>

          <div className="px-6 py-8 md:px-10">

            {/* STEP 1: CATEGORY SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('Store', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Choose Category</h2>
                </div>
                <p className="text-slate-500 text-sm">Choose the category that best aligns with your merchant store operations. Use search or filter down instantly.</p>

                {/* Filter Search */}
                <div className="relative max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                    {renderIcon('Search', 'w-4 h-4')}
                  </span>
                  <input 
                    type="text" 
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#E5B65F] focus:outline-none focus:border-transparent transition-colors"
                    placeholder="Search categories e.g. Food, Safe, Spa, Flight..."
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredCategories.map(cat => {
                    const isSelected = selectedCategory?.id === cat.id;
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => selectCategory(cat)}
                        style={{ borderColor: isSelected ? cat.color : '#e2e8f0', backgroundColor: isSelected ? cat.bg : 'white' }}
                        className={`rounded-2xl p-5 border cursor-pointer hover:shadow-md hover:scale-[1.01] transition flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : cat.bg, color: cat.color }}>
                            {renderIcon(cat.icon, "w-5 h-5")}
                          </div>
                          {isSelected && (
                            <span className="text-xs bg-white text-slate-900 border px-2 py-0.5 rounded-full font-bold">Selected</span>
                          )}
                        </div>
                        <div className="mt-4">
                          <h3 className="font-extrabold text-slate-900 text-sm">{cat.name}</h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-1">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: SUBCATEGORIES SELECTION */}
            {currentStep === 2 && selectedCategory && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: selectedCategory.bg, color: selectedCategory.color }}>
                    {renderIcon(selectedCategory.icon, 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Select Business Type in {selectedCategory.name}</h2>
                </div>
                <p className="text-slate-500 text-sm">You can select multiple specific types if your outlet handles different luxury segments.</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedCategory.subcategories.map(sub => {
                    const isSelected = selectedSubcategories.some(s => s.id === sub.id);
                    return (
                      <div 
                        key={sub.id}
                        onClick={() => toggleSubcategory(sub)}
                        className={`rounded-2xl p-5 border cursor-pointer hover:shadow-md transition flex flex-col justify-between ${isSelected ? 'border-[#E5B65F] bg-amber-50/20 shadow-sm' : 'border-slate-200 bg-white'}`}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600">
                          {renderIcon(sub.icon, "w-5 h-5")}
                        </div>
                        <div className="mt-4">
                          <h3 className="font-extrabold text-slate-900 text-sm">{sub.name}</h3>
                          {isSelected ? (
                            <span className="text-[10px] text-amber-700 font-extrabold mt-1 block">✓ Added</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 mt-1 block">Click to add</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: BUSINESS SPECIFIC DETAILS & CATALOG SECTIONS */}
            {currentStep === 3 && selectedCategory && (
              <div className="space-y-8 no-print">
                {/* Context Category Block */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800 text-[#E5B65F]">
                      {renderIcon(selectedCategory.icon, "w-5 h-5")}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">You selected</p>
                      <h4 className="font-extrabold text-base">{selectedCategory.name}</h4>
                      <p className="text-xs text-amber-400 font-medium">{selectedSubcategories.map(s => s.name).join(', ')}</p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep(1)} className="text-xs bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5">
                    {renderIcon('Edit2', 'w-3 h-3')} Change
                  </button>
                </div>

                {/* Subcategory Fields */}
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 border-b pb-2 text-base flex items-center gap-2">
                    {renderIcon('Sparkles', 'w-4 h-4 text-amber-500')} Specific Details Setup
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gather fields required from selected subcategories */}
                    {(Array.from(new Set(selectedSubcategories.flatMap(s => s.fields || []))) as string[]).map(fieldId => {
                      const def = (FIELD_DEFS as any)[fieldId];
                      if (!def) return null;

                      return (
                        <div key={fieldId} className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">{def.label}</label>
                          {def.type === 'text' && (
                            <input 
                              type="text"
                              value={dynamicFields[fieldId] || ''}
                              onChange={(e) => handleDynamicFieldChange(fieldId, e.target.value)}
                              placeholder={def.placeholder}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                            />
                          )}
                          {def.type === 'number' && (
                            <input 
                              type="number"
                              value={dynamicFields[fieldId] || ''}
                              onChange={(e) => handleDynamicFieldChange(fieldId, e.target.value)}
                              placeholder={def.placeholder}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                            />
                          )}
                          {def.type === 'textarea' && (
                            <textarea 
                              value={dynamicFields[fieldId] || ''}
                              onChange={(e) => handleDynamicFieldChange(fieldId, e.target.value)}
                              placeholder={def.placeholder}
                              rows={2}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                            />
                          )}
                          {def.type === 'select' && (
                            <select 
                              value={dynamicFields[fieldId] || ''}
                              onChange={(e) => handleDynamicFieldChange(fieldId, e.target.value)}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                            >
                              <option value="">Select...</option>
                              {def.options?.map(o => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          )}
                          {def.type === 'toggle' && (
                            <div className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={() => handleDynamicFieldChange(fieldId, !dynamicFields[fieldId])}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${dynamicFields[fieldId] ? 'bg-amber-500' : 'bg-slate-200'}`}
                              >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${dynamicFields[fieldId] ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                              <span className="text-xs font-semibold text-slate-500">{dynamicFields[fieldId] ? 'Yes' : 'No'}</span>
                            </div>
                          )}
                          {def.type === 'radio' && (
                            <div className="flex flex-wrap gap-2">
                              {def.options?.map(o => (
                                <button
                                  type="button"
                                  key={o}
                                  onClick={() => handleDynamicFieldChange(fieldId, o)}
                                  className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-colors ${dynamicFields[fieldId] === o ? 'border-amber-500 bg-amber-50/20 text-amber-800' : 'border-slate-200 hover:border-amber-400 text-slate-600'}`}
                                >
                                  {o}
                                </button>
                              ))}
                            </div>
                          )}
                          {def.type === 'multicheck' && (
                            <div className="flex flex-wrap gap-2">
                              {def.options?.map(o => {
                                const currentList = dynamicFields[fieldId] || [];
                                const isChecked = currentList.includes(o);
                                return (
                                  <button
                                    type="button"
                                    key={o}
                                    onClick={() => {
                                      const next = isChecked ? currentList.filter((x: string) => x !== o) : [...currentList, o];
                                      handleDynamicFieldChange(fieldId, next);
                                    }}
                                    className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-colors ${isChecked ? 'border-amber-500 bg-amber-50/20 text-amber-800' : 'border-slate-200 hover:border-amber-400 text-slate-600'}`}
                                  >
                                    {o}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Catalog Sections Configuration */}
                <div className="border-t border-slate-100 pt-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {renderIcon('Briefcase', 'w-4 h-4 text-amber-500')} Catalog Sections Setup
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Based on your category, select common sections to organize your items or add custom ones.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Suggested Sections</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_SECTIONS[selectedCategory.id]?.map(secName => {
                          const isSelected = selectedCatalogSections.some(s => s.name === secName);
                          return (
                            <button
                              type="button"
                              key={secName}
                              onClick={() => toggleSuggestedSection(secName)}
                              className={`px-3 py-1.5 border rounded-full text-xs font-semibold transition-colors ${isSelected ? 'border-amber-500 bg-amber-50/40 text-amber-800 font-extrabold' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {secName}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Sections ({selectedCatalogSections.length})</h4>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                        {selectedCatalogSections.length === 0 ? (
                          <p className="text-xs italic text-slate-400">None selected yet. Choose suggestions or add a custom one below.</p>
                        ) : (
                          selectedCatalogSections.map((sec, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                              <input 
                                type="text"
                                value={sec.name}
                                onChange={(e) => renameSelectedSection(idx, e.target.value)}
                                className="flex-1 bg-transparent px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                              />
                              <button 
                                type="button"
                                onClick={() => removeSelectedSection(idx)}
                                className="w-6 h-6 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center"
                              >
                                {renderIcon('Trash2', 'w-3.5 h-3.5')}
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-2 flex gap-2">
                        <input 
                          type="text"
                          value={customSectionInput}
                          onChange={(e) => setCustomSectionInput(e.target.value)}
                          placeholder="e.g. Special Offers"
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
                        />
                        <button 
                          type="button"
                          onClick={addCustomSection}
                          className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-colors"
                        >
                          Add Section
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BUSINESS PROFILE */}
            {currentStep === 4 && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('Briefcase', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Business Profile</h2>
                </div>
                <p className="text-slate-500 text-sm">Please register the legal trading entities. Correct tax identifiers help guarantee smooth fast payouts.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Legal Business Name *</label>
                    <input 
                      type="text"
                      value={profileData.legalName}
                      onChange={(e) => setProfileData({ ...profileData, legalName: e.target.value })}
                      placeholder="e.g. Gourmet Bistro Nairobi Ltd"
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Trading Name *</label>
                    <input 
                      type="text"
                      value={profileData.tradingName}
                      onChange={(e) => setProfileData({ ...profileData, tradingName: e.target.value })}
                      placeholder="e.g. Gourmet Bistro Westlands"
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">KRA Tax PIN *</label>
                    <input 
                      type="text"
                      value={profileData.kraPin}
                      onChange={(e) => setProfileData({ ...profileData, kraPin: e.target.value })}
                      placeholder="e.g. P051234567Z"
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Website URL</label>
                    <input 
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      placeholder="https://www.gourmetbistro.co.ke"
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Short Business Description</label>
                  <textarea 
                    value={profileData.shortDesc}
                    onChange={(e) => setProfileData({ ...profileData, shortDesc: e.target.value })}
                    rows={3}
                    placeholder="Provide a brief summary of specialties, offerings, or history (max 150 characters)"
                    maxLength={150}
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B65F]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: LOCATIONS & BRANCHES */}
            {currentStep === 5 && (
              <div className="space-y-6 no-print">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                      {renderIcon('MapPin', 'w-4 h-4')}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-950">Store Branches & Location Map</h2>
                  </div>
                  <button 
                    type="button"
                    onClick={addBranch}
                    className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    {renderIcon('Plus', 'w-3.5 h-3.5')} Add Branch
                  </button>
                </div>
                <p className="text-slate-500 text-sm">Input branch parameters. You can search using Nominatim autocomplete finder or drop coordinates via the map.</p>

                <div className="space-y-6">
                  {branches.map((branch, idx) => (
                    <div key={branch.id} className="border border-slate-200 bg-white p-6 rounded-3xl relative space-y-4 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          Branch Location
                        </span>
                        {branches.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeBranch(branch.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                          >
                            {renderIcon('Trash2', 'w-3.5 h-3.5')} Remove
                          </button>
                        )}
                      </div>

                      {/* Search / Map Picker */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">Search Location Finder</label>
                        <div className="flex gap-2 relative">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              {renderIcon('Search', 'w-4 h-4')}
                            </span>
                            <input 
                              type="text"
                              placeholder="Type landmark e.g. Yaya Centre, Westlands, Sarit..."
                              onChange={(e) => {
                                setSearchingBranchId(branch.id);
                                searchNominatimPlaces(e.target.value, branch.id);
                              }}
                              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                            />
                            {searchingBranchId === branch.id && nominatimSearchResults[branch.id]?.length > 0 && (
                              <div className="absolute left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 z-50 max-h-48 overflow-y-auto">
                                {nominatimSearchResults[branch.id].map((res, ridx) => (
                                  <div 
                                    key={ridx}
                                    onClick={() => selectNominatimResult(res, branch.id)}
                                    className="px-4 py-2 hover:bg-amber-50 text-xs cursor-pointer border-b border-slate-100 last:border-0 truncate"
                                  >
                                    {res.display_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleOpenMapPicker(branch.id)}
                            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-black transition shadow-sm"
                          >
                            {renderIcon('MapPin', 'w-3.5 h-3.5 text-amber-400')} Pick Coordinates
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">Branch Name *</label>
                          <input 
                            type="text"
                            required
                            value={branch.name}
                            onChange={(e) => updateBranchField(branch.id, 'name', e.target.value)}
                            placeholder="e.g. Westlands Outlet"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">County / City *</label>
                          <input 
                            type="text"
                            required
                            value={branch.city}
                            onChange={(e) => updateBranchField(branch.id, 'city', e.target.value)}
                            placeholder="e.g. Nairobi"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">Physical Address Details *</label>
                        <input 
                          type="text"
                          required
                          value={branch.address}
                          onChange={(e) => updateBranchField(branch.id, 'address', e.target.value)}
                          placeholder="e.g. Peponi Road, Shell Building, 1st Floor"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">Coordinates Map Link</label>
                        <input 
                          type="text"
                          value={branch.mapLink}
                          readOnly
                          placeholder="Generated via map picker"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-500 cursor-default focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">Branch Manager / Contact Person</label>
                          <input 
                            type="text"
                            value={branch.contactName}
                            onChange={(e) => updateBranchField(branch.id, 'contactName', e.target.value)}
                            placeholder="e.g. George K."
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">Branch Contact Phone</label>
                          <input 
                            type="tel"
                            value={branch.contactPhone}
                            onChange={(e) => updateBranchField(branch.id, 'contactPhone', e.target.value)}
                            placeholder="e.g. +254 700 000 000"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: CONTACTS & SOCIAL MEDIA */}
            {currentStep === 6 && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('Users', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Contact &amp; Social Media</h2>
                </div>
                <p className="text-slate-500 text-sm">Register primary coordinates. Authorized officers receive system orders, accounts payouts auditing details, and alerts.</p>

                <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {renderIcon('User', 'w-4 h-4 text-slate-400')} Primary Contact Person
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">Full Name *</label>
                      <input 
                        type="text"
                        value={contactData.fullName}
                        onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">Email Address *</label>
                      <input 
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="e.g. jane.doe@gourmetbistro.co.ke"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">Phone Number *</label>
                      <input 
                        type="tel"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        placeholder="e.g. +254 711 000 000"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600">WhatsApp Dispatch No.</label>
                      <input 
                        type="tel"
                        value={contactData.whatsapp}
                        onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                        placeholder="e.g. +254 711 000 000"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {renderIcon('Globe', 'w-4 h-4 text-slate-400')} Social Media Handles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2.5 bg-white">
                      {renderIcon('Instagram', 'w-4 h-4 text-pink-500')}
                      <input 
                        type="text"
                        value={contactData.instagram}
                        onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                        placeholder="Instagram profile"
                        className="flex-1 bg-transparent border-none text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2.5 bg-white">
                      {renderIcon('Facebook', 'w-4 h-4 text-blue-600')}
                      <input 
                        type="text"
                        value={contactData.facebook}
                        onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
                        placeholder="Facebook page"
                        className="flex-1 bg-transparent border-none text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-4 py-2.5 bg-white">
                      {renderIcon('Music', 'w-4 h-4 text-slate-900')}
                      <input 
                        type="text"
                        value={contactData.tiktok}
                        onChange={(e) => setContactData({ ...contactData, tiktok: e.target.value })}
                        placeholder="TikTok profile"
                        className="flex-1 bg-transparent border-none text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: OPERATIONS & DELIVERY COUPLING */}
            {currentStep === 7 && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('Clock', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Operations &amp; Delivery Logistics</h2>
                </div>
                <p className="text-slate-500 text-sm">Fine-tune operations periods, holiday settings, and shipping dispatch carriage options.</p>

                {/* Operating Days */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Operating Days</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isChecked = operatingDays.includes(day);
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => {
                            setOperatingDays(prev => isChecked ? prev.filter(d => d !== day) : [...prev, day]);
                          }}
                          className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-colors ${isChecked ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Hours Scheduler */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <label className="text-sm font-semibold text-slate-700">Hours Configuration Template</label>
                    <div className="flex bg-slate-200 p-1 rounded-xl text-xs">
                      {(['same', 'split', 'custom'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setHoursMode(mode)}
                          className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${hoursMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                        >
                          {mode === 'same' ? 'Same Everyday' : mode === 'split' ? 'Split Weekends' : 'Custom Daily'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hoursMode === 'same' && (
                    <div className="grid grid-cols-2 gap-4">
                      <TimeStringField
                        label="Opening Time *"
                        value={globalHours.opening}
                        onChange={(v) => setGlobalHours({ ...globalHours, opening: v })}
                        timeFormat="12"
                      />
                      <TimeStringField
                        label="Closing Time *"
                        value={globalHours.closing}
                        onChange={(v) => setGlobalHours({ ...globalHours, closing: v })}
                        timeFormat="12"
                      />
                    </div>
                  )}

                  {hoursMode === 'split' && (
                    <div className="space-y-3">
                      {Object.entries(groupHours).map(([grp, val]) => {
                        const item = val as { active: boolean; open: string; close: string };
                        return (
                          <div key={grp} className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                            <label className="flex items-center gap-2 w-32">
                              <input 
                                type="checkbox" 
                                checked={item.active} 
                                onChange={(e) => setGroupHours({
                                  ...groupHours,
                                  [grp]: { ...item, active: e.target.checked }
                                })}
                                className="w-4 h-4 accent-amber-500"
                              />
                              <span className="text-xs font-bold text-slate-700">{grp}</span>
                            </label>
                            <div className="flex items-center gap-2 flex-1 max-w-xs">
                              <TimeStringField
                                value={item.open}
                                onChange={(v) => setGroupHours({ ...groupHours, [grp]: { ...item, open: v } })}
                                timeFormat="12"
                              />
                              <span className="text-xs text-slate-400">to</span>
                              <TimeStringField
                                value={item.close}
                                onChange={(v) => setGroupHours({ ...groupHours, [grp]: { ...item, close: v } })}
                                timeFormat="12"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {hoursMode === 'custom' && (
                    <div className="space-y-2">
                      {Object.entries(dailyHours).map(([day, val]) => {
                        const item = val as { active: boolean; open: string; close: string };
                        return (
                          <div key={day} className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                            <label className="flex items-center gap-2 w-28">
                              <input 
                                type="checkbox" 
                                checked={item.active} 
                                onChange={(e) => setDailyHours({
                                  ...dailyHours,
                                  [day]: { ...item, active: e.target.checked }
                                })}
                                className="w-4 h-4 accent-amber-500"
                              />
                              <span className="text-xs font-bold text-slate-700">{day}</span>
                            </label>
                            <div className="flex items-center gap-2 flex-1 max-w-xs">
                              <TimeStringField
                                value={item.open}
                                disabled={!item.active}
                                onChange={(v) => setDailyHours({ ...dailyHours, [day]: { ...item, open: v } })}
                                timeFormat="12"
                              />
                              <span className="text-xs text-slate-400">to</span>
                              <TimeStringField
                                value={item.close}
                                disabled={!item.active}
                                onChange={(v) => setDailyHours({ ...dailyHours, [day]: { ...item, close: v } })}
                                timeFormat="12"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Public Holidays */}
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Kenyan Public Holidays Availability</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['closed', 'same', 'custom'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setHolidayMode(mode)}
                          className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-colors ${holidayMode === mode ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600'}`}
                        >
                          {mode === 'closed' ? 'Closed' : mode === 'same' ? 'Regular Hours' : 'Custom Hours'}
                        </button>
                      ))}
                    </div>
                    {holidayMode === 'custom' && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <TimeStringField
                          label="Holiday Opening Time"
                          value={holidayHours.open}
                          onChange={(v) => setHolidayHours({ ...holidayHours, open: v })}
                          timeFormat="12"
                        />
                        <TimeStringField
                          label="Holiday Closing Time"
                          value={holidayHours.close}
                          onChange={(v) => setHolidayHours({ ...holidayHours, close: v })}
                          timeFormat="12"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Carriage Modes</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setDeliveryNexg(!deliveryNexg)}
                      className={`border p-5 rounded-3xl cursor-pointer transition ${deliveryNexg ? 'border-amber-500 bg-amber-50/25 shadow-sm' : 'border-slate-200 bg-white hover:border-amber-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">NEXG Riders Fleet</span>
                        <input 
                          type="checkbox" 
                          checked={deliveryNexg} 
                          onChange={() => {}} // handled by click
                          className="w-4 h-4 accent-amber-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">NEXG operates logistics carriage from your store using our background-checked professional couriers.</p>
                    </div>

                    <div 
                      onClick={() => setDeliveryOwn(!deliveryOwn)}
                      className={`border p-5 rounded-3xl cursor-pointer transition ${deliveryOwn ? 'border-amber-500 bg-amber-50/25 shadow-sm' : 'border-slate-200 bg-white hover:border-amber-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">Own Store Riders</span>
                        <input 
                          type="checkbox" 
                          checked={deliveryOwn} 
                          onChange={() => {}} // handled by click
                          className="w-4 h-4 accent-amber-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">You employ and coordinate your own dispatch riders; we provide order aggregation and dashboard details.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">Average Preparation Time</label>
                    <select 
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white focus:outline-none"
                    >
                      <option value="15 - 30 minutes">15 - 30 minutes</option>
                      <option value="30 - 45 minutes">30 - 45 minutes</option>
                      <option value="45 - 60 minutes">45 - 60 minutes</option>
                      <option value="Above 60 minutes">Above 60 minutes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">Max Delivery Radius Limit (km)</label>
                    <input 
                      type="number"
                      value={deliveryRadius}
                      onChange={(e) => setDeliveryRadius(parseInt(e.target.value) || 15)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: PAYMENT DETAILS */}
            {currentStep === 8 && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('CreditCard', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Payment Details</h2>
                </div>
                <p className="text-slate-500 text-sm">Nominate your payouts destinations. Weekly settlements are transferred directly every Monday morning.</p>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Bank Name</label>
                    <input 
                      type="text"
                      value={paymentData.bankName}
                      onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                      placeholder="e.g. NCBA Bank, Equity Bank, KCB..."
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Account Name</label>
                      <input 
                        type="text"
                        value={paymentData.accountName}
                        onChange={(e) => setPaymentData({ ...paymentData, accountName: e.target.value })}
                        placeholder="e.g. Gourmet Bistro Nairobi Ltd"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Account Number</label>
                      <input 
                        type="text"
                        value={paymentData.accountNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                        placeholder="e.g. 0123456789"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {renderIcon('Smartphone', 'w-4 h-4 text-amber-500')} M-PESA Till &amp; Paybill Integration (Optional)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Buy Goods Till No.</label>
                      <input 
                        type="text"
                        value={paymentData.mpesaTill}
                        onChange={(e) => setPaymentData({ ...paymentData, mpesaTill: e.target.value })}
                        placeholder="e.g. 543210"
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Business Paybill No.</label>
                      <input 
                        type="text"
                        value={paymentData.mpesaPaybill}
                        onChange={(e) => setPaymentData({ ...paymentData, mpesaPaybill: e.target.value })}
                        placeholder="e.g. 400222"
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Paybill Account Name</label>
                      <input 
                        type="text"
                        value={paymentData.mpesaPaybillAcc}
                        onChange={(e) => setPaymentData({ ...paymentData, mpesaPaybillAcc: e.target.value })}
                        placeholder="e.g. BISTRO"
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: DOCUMENTS & BRANDING */}
            {currentStep === 9 && (
              <div className="space-y-6 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('FileText', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Documents &amp; Brand Assets</h2>
                </div>
                <p className="text-slate-500 text-sm">Upload business certificates and company logos. These will be used to dynamically set up your store theme inside the NEXG customer application.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 bg-slate-50 p-5 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Certificate of Registration</p>
                      <p className="text-slate-500 text-xs mt-1">Upload business registration scan PDF or image.</p>
                    </div>
                    <div className="mt-4">
                      <label className={`w-full py-2.5 px-4 border text-center font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadedFiles.certFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-slate-50'}`}>
                        <input type="file" onChange={(e) => handleFileUpload(e, 'certFile')} className="hidden" />
                        {renderIcon(uploadedFiles.certFile ? 'CheckCircle2' : 'FileUp', 'w-4 h-4')}
                        {uploadedFiles.certFile ? `${uploadedFiles.certFile.slice(0, 20)}...` : 'Choose File'}
                      </label>
                    </div>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-5 rounded-3xl flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Director ID / Passport Scan</p>
                      <p className="text-slate-500 text-xs mt-1">Upload ID or passport of major primary director.</p>
                    </div>
                    <div className="mt-4">
                      <label className={`w-full py-2.5 px-4 border text-center font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${uploadedFiles.idFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-slate-50'}`}>
                        <input type="file" onChange={(e) => handleFileUpload(e, 'idFile')} className="hidden" />
                        {renderIcon(uploadedFiles.idFile ? 'CheckCircle2' : 'FileUp', 'w-4 h-4')}
                        {uploadedFiles.idFile ? `${uploadedFiles.idFile.slice(0, 20)}...` : 'Choose File'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-3xl p-6 space-y-6 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {renderIcon('Palette', 'w-4 h-4 text-amber-500')} Store Front Branding
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Business Logo (Square 1:1)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl aspect-square flex flex-col items-center justify-center p-4 bg-white relative cursor-pointer group hover:border-amber-400 transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoPreview)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        {logoPreview ? (
                          <img src={logoPreview} className="absolute inset-0 w-full h-full object-cover rounded-2xl z-10" alt="Logo preview" />
                        ) : (
                          <div className="text-center group-hover:scale-105 transition-transform">
                            {renderIcon('Camera', 'w-8 h-8 text-slate-300 mx-auto group-hover:text-amber-500')}
                            <p className="text-xs font-semibold text-slate-500 mt-2">Upload Logo (JPG/PNG)</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Store Front Banner (16:9 Landscape)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl aspect-[16/9] flex flex-col items-center justify-center p-4 bg-white relative cursor-pointer group hover:border-amber-400 transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setBannerPreview)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        {bannerPreview ? (
                          <img src={bannerPreview} className="absolute inset-0 w-full h-full object-cover rounded-2xl z-10" alt="Banner preview" />
                        ) : (
                          <div className="text-center group-hover:scale-105 transition-transform">
                            {renderIcon('Camera', 'w-8 h-8 text-slate-300 mx-auto group-hover:text-amber-500')}
                            <p className="text-xs font-semibold text-slate-500 mt-2">Upload Banner Image</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 10: PARTNERSHIP AGREEMENT EXECUTION */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 no-print">
                  <div className="w-8 h-8 rounded-lg bg-gold-tint text-gold flex items-center justify-center font-bold">
                    {renderIcon('ShieldCheck', 'w-4 h-4')}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-950">Partnership Agreement Contract</h2>
                </div>
                <p className="text-slate-500 text-sm no-print">Review the pre-drafted legal contract. Ensure all merchant parameters, locations, and banking details are correct.</p>

                {/* Agreement Layout Contract Area */}
                <div 
                  id="printAgreementArea" 
                  className="border border-slate-200 rounded-3xl p-6 md:p-8 bg-white shadow-inner max-h-[400px] overflow-y-auto text-sm text-slate-700 leading-relaxed font-sans"
                >
                  <div className="text-center mb-8 border-b pb-6">
                    <span className="font-extrabold text-2xl tracking-widest text-[#E5B65F]">NEXG</span>
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900 mt-2">NEXG APP LIMITED</h3>
                    <p className="text-[#E5B65F] font-bold text-xs tracking-wider uppercase">Merchant Partnership Agreement</p>
                    <p className="text-slate-400 text-xs mt-1">Effective Date: <span className="font-bold">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                  </div>

                  <div className="space-y-4 text-xs md:text-sm">
                    <p>This Merchant Partnership Agreement (the <strong>"Agreement"</strong>) is executed between:</p>
                    <p><strong>NEXG App Limited</strong> (hereinafter referred to as <strong>"NEXG"</strong> or <strong>"Platform"</strong>), registered in the Republic of Kenya with offices in Nairobi;</p>
                    <p>and</p>
                    <p>
                      <strong><span className="font-bold underline text-slate-900">{profileData.legalName || '[Legal Business Name]'}</span></strong>, 
                      trading as <strong><span className="font-bold underline text-slate-900">{profileData.tradingName || '[Trading Name]'}</span></strong> 
                      (hereinafter referred to as <strong>"Merchant"</strong> or <strong>"You"</strong>), with KRA Tax PIN <strong><span className="font-semibold">{profileData.kraPin || '[KRA PIN]'}</span></strong>, 
                      and primary office registered at <strong><span className="font-semibold">{branches[0]?.address || '[Principal Address]'}, {branches[0]?.city || ''}</span></strong>.
                    </p>

                    <h4 className="font-bold text-slate-950 mt-6 border-b pb-1">1. Recitals</h4>
                    <p>WHEREAS, NEXG operates a premier high-net-worth concierge, booking and logistics carrier network across Kenya; and</p>
                    <p>WHEREAS, the Merchant wishes to list its premium product catalog under the <strong><span className="font-semibold">{selectedCategory?.name || '[Category]'}</span></strong> segments of the platform;</p>
                    <p>NOW, THEREFORE, both parties execute the contract bound by the following clauses:</p>

                    {selectedCategory?.id === 'logistics_shipping' && (
                      <div className="mt-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl text-xs space-y-2">
                        <p className="font-bold text-slate-800">Special Logistics Carriage &amp; Warehousing Addendum:</p>
                        <p>1. <strong>Carriage Responsibility:</strong> The Merchant represents that they hold all valid licenses and permits required for shipping and logistics operations under the Laws of Kenya, including NTSA, KRA, and Kenya Ports Authority (KPA) approvals.</p>
                        <p>2. <strong>Cargo Insurance &amp; Liability:</strong> The Merchant agrees to maintain standard Goods In Transit (GIT) insurance and warehouse keepers liability insurance, and holds NEXG harmless against cargo losses, demurrage, or transit damage.</p>
                        <p>3. <strong>Customs and Tariff Compliance:</strong> The Merchant is solely responsible for clearing customs duties, port levies, and ensuring all shipping cargo meets international and local compliance standards.</p>
                      </div>
                    )}

                    <h4 className="font-bold text-slate-950 mt-6 border-b pb-1">2. Core Platform Service Delivery</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Interactive catalog listing on the premium NEXG Client App.</li>
                      <li>Collection and processing of accounts charges from guests, tourists, and corporate networks.</li>
                      <li>Logistics carriage orchestration based on requested parameters.</li>
                    </ul>

                    <h4 className="font-bold text-slate-950 mt-6 border-b pb-1">3. Merchant Standard Operating Times</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Maintain exact availability schedules, correct pricing, and stock sync lists.</li>
                      <li>Commit to operating readiness within the scheduled periods of: <strong>{getOperatingHoursStr()}</strong></li>
                    </ul>

                    <h4 className="font-bold text-slate-950 mt-6 border-b pb-1">4. Commissions &amp; Settlements</h4>
                    <p>The Merchant agrees to operate using: <strong>{deliveryNexg && deliveryOwn ? 'Hybrid Riders Model' : deliveryNexg ? 'NEXG Riders Fleet' : 'Own Store Riders'}</strong>.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Commission structure:</strong> {deliveryNexg && deliveryOwn ? '15% for orders fulfilled via NEXG Riders, and 7% for orders fulfilled via Own Store Riders.' : deliveryNexg ? 'Standard premium commission of 15% of the total order value.' : 'Standard carrier commission of 7% of the total order value.'}</li>
                      <li><strong>Disbursements:</strong> Consolidated bank transfer payouts made every Monday to:
                        <ul className="list-circle pl-5 mt-1 space-y-0.5 text-xs text-slate-600">
                          <li>Bank Name: <strong>{paymentData.bankName || '[Bank Name]'}</strong></li>
                          <li>Account Name: <strong>{paymentData.accountName || '[Account Name]'}</strong></li>
                          <li>Account Number: <strong>{paymentData.accountNumber || '[Account Number]'}</strong></li>
                          {paymentData.mpesaTill && <li>M-PESA Till: <strong>{paymentData.mpesaTill}</strong></li>}
                          {paymentData.mpesaPaybill && <li>M-PESA Paybill: <strong>{paymentData.mpesaPaybill} (Acc: {paymentData.mpesaPaybillAcc})</strong></li>}
                        </ul>
                      </li>
                    </ul>

                    <h4 className="font-bold text-slate-950 mt-6 border-b pb-1">5. Signature &amp; Execution</h4>
                    <p>IN WITNESS WHEREOF, the parties execute this digital Agreement via authorized officers:</p>

                    <div className="grid grid-cols-2 gap-6 mt-8 border-t pt-6">
                      <div>
                        <p className="font-bold text-slate-800 text-[11px] uppercase">For NEXG APP LIMITED</p>
                        <div className="h-12 flex items-end mb-2">
                          <span className="font-cursive text-xl text-slate-400 select-none">NEXG Legal Representative</span>
                        </div>
                        <div className="h-px bg-slate-300 w-full mb-1"></div>
                        <p className="text-[10px] text-slate-500">Authorized Officer Signature</p>
                        <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[11px] uppercase">For THE MERCHANT</p>
                        <div className="h-12 flex items-end mb-2 relative">
                          {sigMode === 'draw' && signatureImage ? (
                            <img src={signatureImage} className="h-12 max-w-[150px] object-contain" alt="Signature drawing" />
                          ) : sigMode === 'type' && signatoryName ? (
                            <span className="font-cursive text-2xl text-[#E5B65F]">{signatoryName}</span>
                          ) : (
                            <span className="text-[10px] text-slate-300 italic">[Awaiting signature verification]</span>
                          )}
                        </div>
                        <div className="h-px bg-slate-300 w-full mb-1"></div>
                        <p className="text-[10px] text-slate-500">Authorized Officer: <strong>{signatoryName || '[Signatory Name]'}</strong></p>
                        <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Pad Input Control */}
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-6 no-print">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      {renderIcon('PenTool', 'w-4 h-4 text-amber-500')} Digital Signature Authorization
                    </h3>
                    <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold">
                      {(['draw', 'type'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSigMode(mode)}
                          className={`px-3 py-1.5 rounded-lg transition ${sigMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                        >
                          {mode === 'draw' ? 'Draw Sign' : 'Type Sign'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">Authorized Officer Legal Name *</label>
                    <input 
                      type="text"
                      value={signatoryName}
                      onChange={(e) => setSignatoryName(e.target.value)}
                      placeholder="Type your full legal name"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white"
                    />
                  </div>

                  {sigMode === 'draw' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">Draw Signature below *</label>
                      <div className="border border-slate-300 bg-white rounded-2xl overflow-hidden relative shadow-inner">
                        <canvas 
                          ref={canvasRef} 
                          width={600}
                          height={160}
                          className="w-full h-40 cursor-crosshair block"
                        />
                        <button 
                          type="button" 
                          onClick={clearSignatureCanvas}
                          className="absolute right-4 bottom-4 px-3 py-1 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow hover:bg-black transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {sigMode === 'type' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase">Handwriting Style Preview</label>
                      <div className="border border-slate-200 bg-white p-6 rounded-2xl text-center shadow-inner">
                        <p className="font-cursive text-4xl text-[#E5B65F] select-none">
                          {signatoryName || '- Your Signature -'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 bg-amber-50/50 p-4 border border-amber-100 rounded-2xl">
                    <input 
                      type="checkbox" 
                      id="termsCheck" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-amber-500 rounded cursor-pointer" 
                    />
                    <label htmlFor="termsCheck" className="text-xs text-slate-600 select-none cursor-pointer">
                      I declare that I am authorized to bind <strong>{profileData.legalName || 'this merchant entity'}</strong>, and hereby execute this digital Partnership Agreement legally.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: SUCCESS SCREEN STATE */}
            {currentStep === 11 && (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-md success-settle">
                  {renderIcon('CheckCircle2', 'w-10 h-10')}
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Application Submitted Successfully!</h2>
                  <p className="text-slate-500 text-sm max-w-lg mx-auto">Your premium merchant onboarding is complete. Our partnership audit committee will complete verify checks and activate your store front within 24 hours.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl max-w-lg mx-auto border border-slate-100 text-left text-xs md:text-sm space-y-3 shadow-inner">
                  <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                    {renderIcon('Briefcase', 'w-4 h-4 text-[#E5B65F]')} Setup Summary highlights
                  </h4>
                  <p><strong className="text-slate-600">Trading Name:</strong> <span className="font-semibold text-slate-900">{profileData.tradingName}</span></p>
                  <p><strong className="text-slate-600">Store Outlet:</strong> <span className="font-semibold text-slate-900">{branches.length} Location(s) Registered ({branches.map(b => b.name).join(', ')})</span></p>
                  <p><strong className="text-slate-600">Operating hours:</strong> <span className="font-semibold text-slate-900">{getOperatingHoursStr()}</span></p>
                  <p><strong className="text-slate-600">Carriage Delivery:</strong> <span className="font-semibold text-slate-900">{deliveryNexg && deliveryOwn ? 'Hybrid model' : deliveryNexg ? 'NEXG Riders' : 'Own Riders'}</span></p>
                  <p><strong className="text-slate-600">Catalog Sections:</strong> <span className="font-semibold text-slate-900">{selectedCatalogSections.length > 0 ? selectedCatalogSections.map(s => s.name).join(', ') : 'Skipped / Default'}</span></p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-6 no-print">
                  <button 
                    type="button" 
                    onClick={triggerPrint}
                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-black transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    {renderIcon('Printer', 'w-4 h-4 text-amber-400')} Print Signed Contract
                  </button>
                  <button 
                    type="button" 
                    onClick={resetOnboarding}
                    className="px-6 py-3 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-2xl text-xs hover:bg-slate-200 transition-colors"
                  >
                    Onboard Another Store
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            {currentStep < totalSteps && (
              <div className="border-t border-slate-100 pt-6 mt-8 flex justify-between items-center bg-white no-print">
                {currentStep > 1 ? (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    {renderIcon('ChevronLeft', 'w-4 h-4')} Back
                  </button>
                ) : (
                  <div />
                )}

                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="bg-slate-950 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#E5B65F] hover:text-black transition-colors flex items-center gap-1.5"
                >
                  {currentStep === totalSteps - 1 ? 'Sign & Complete' : 'Next Step'} 
                  {renderIcon('ChevronRight', 'w-4 h-4')}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Map coordinates picker modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-4 bg-slate-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                {renderIcon('MapPin', 'w-4 h-4 text-amber-400')} Drop Location Coordinate Marker
              </h3>
              <button 
                type="button" 
                onClick={() => setShowMapModal(false)}
                className="text-slate-400 hover:text-white"
              >
                {renderIcon('X', 'w-5 h-5')}
              </button>
            </div>

            <div className="flex-1 w-full bg-slate-100 relative">
              <div id="leafletMapContainer" className="w-full h-full z-10" />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 block font-bold">Coords: {mapCoords[0].toFixed(5)}, {mapCoords[1].toFixed(5)}</span>
                <span className="text-slate-900 font-extrabold">Place: {resolvedPlaceName || 'Move marker pin to search...'}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmMapPin}
                  className="px-5 py-2 bg-gold-tint text-gold font-bold rounded-xl hover:bg-amber-600 shadow transition-colors"
                >
                  Confirm Coordinates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
