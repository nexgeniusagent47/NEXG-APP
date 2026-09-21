export type Language = 'en' | 'zh' | 'sw' | 'ar';

export interface TranslationSchema {
  nav: {
    home: string;
    explore: string;
    restaurants: string;
    spa: string;
    spaDistrict: string;
    transport: string;
    groceries: string;
    experiences: string;
    partners: string;
    forProperties: string;
    forCouriers: string;
    forMerchants: string;
    partnerOnboarding: string;
    applyFleet: string;
    listBusiness: string;
    track: string;
    viewCart: string;
    appearanceMode: string;
    lightMode: string;
    darkMode: string;
    selectLanguage: string;
    menu: string;
    close: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    popular: string;
    sugMichelin: string;
    sugMassage: string;
    sugMaybach: string;
    sugCaviar: string;
    sugYacht: string;
    btnFineDining: string;
    btnSpa: string;
    btnMobility: string;
    ambienceDaylight: string;
    ambienceTwilight: string;
  };
  categories: {
    heading: string;
    subtitle: string;
    groceriesTitle: string;
    groceriesDesc: string;
    transportTitle: string;
    transportDesc: string;
    spaTitle: string;
    spaDesc: string;
    restaurantsTitle: string;
    restaurantsDesc: string;
    experiencesTitle: string;
    experiencesDesc: string;
    essentialsTitle: string;
    essentialsDesc: string;
    viewAll: string;
  };
  howItWorks: {
    badge: string;
    heading: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  promo: {
    badge: string;
    heading: string;
    desc: string;
    cta: string;
    code: string;
    appHeading1: string;
    appHeading2: string;
    appSubtitle: string;
    downloadOn: string;
    appStore: string;
    getItOn: string;
    googlePlay: string;
    merchantsTitle: string;
    merchantsDesc: string;
    merchantsCta: string;
    couriersTitle: string;
    couriersDesc: string;
    couriersCta: string;
    propertiesTitle: string;
    propertiesDesc: string;
    propertiesCta: string;
  };
  features: {
    badge: string;
    heading: string;
    subtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  restaurants: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterJapanese: string;
    filterItalian: string;
    filterFrench: string;
    filterMediterranean: string;
    filterSteakhouse: string;
    filterDesserts: string;
    viewMenu: string;
    minOrder: string;
    deliveryTime: string;
    featuredDish: string;
    addToBag: string;
    closed: string;
    openNow: string;
  };
  spa: {
    title: string;
    subtitle: string;
    bookTreatment: string;
    duration: string;
    inVilla: string;
    sanctuary: string;
    therapistGender: string;
    anyTherapist: string;
    femaleTherapist: string;
    maleTherapist: string;
    reserveNow: string;
  };
  transport: {
    title: string;
    subtitle: string;
    chauffeurIncluded: string;
    perHour: string;
    airportTransfer: string;
    bookChauffeur: string;
    capacity: string;
    luggage: string;
    instantDispatch: string;
  };
  groceries: {
    title: string;
    subtitle: string;
    cellar: string;
    pantry: string;
    caviar: string;
    bakery: string;
    addToCart: string;
    inStock: string;
  };
  experiences: {
    title: string;
    subtitle: string;
    bookExperience: string;
    groupSize: string;
    duration: string;
    vipHostIncluded: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    subtotal: string;
    deliveryFee: string;
    conciergeService: string;
    total: string;
    checkoutBtn: string;
    villaPlaceholder: string;
    specialNotes: string;
    orderPlaced: string;
    items: string;
    clearCart: string;
  };
  tracking: {
    title: string;
    orderNumber: string;
    estimatedArrival: string;
    mins: string;
    statusConfirmed: string;
    statusPreparing: string;
    statusInTransit: string;
    statusDelivered: string;
    courierAssigned: string;
    contactConcierge: string;
    close: string;
  };
  footer: {
    brandDesc: string;
    exploreTitle: string;
    partnersTitle: string;
    legalTitle: string;
    privacy: string;
    terms: string;
    cookies: string;
    rightsReserved: string;
    language: string;
    craftedWith: string;
    aboutText: string;
    verticals: string;
    fineDining: string;
    spaWellness: string;
    vipMobility: string;
    gourmetCellar: string;
    experiences: string;
    partners: string;
    forMerchants: string;
    forCouriers: string;
    forProperties: string;
    legalSupport: string;
    conciergeDesk: string;
    termsOfService: string;
    privacyPolicy: string;
    safetyStandards: string;
    connect: string;
    rights: string;
    simulatedNotice: string;
  };
  partnerHeaders: {
    ecosystem: string;
    qrTech: string;
    revShareCalc: string;
    integrations: string;
    benefits: string;
    logistics: string;
    howItWorks: string;
    categories: string;
    earningsCalc: string;
    fleetPerks: string;
    standards: string;
    faq: string;
  };
  partnersPortal: {
    merchantTitle: string;
    merchantSubtitle: string;
    courierTitle: string;
    courierSubtitle: string;
    propertiesTitle: string;
    propertiesSubtitle: string;
    backHome: string;
    listBusiness: string;
    applyFleet: string;
    partnerNexg: string;
    onboardingActive: string;
    onboardingStatus: string;
    stepText: string;
    ofText: string;
    nextStep: string;
    prevStep: string;
    submitApplication: string;
    agreementTitle: string;
    agreementDesc: string;
    successTitle: string;
    successDesc: string;
    returnHome: string;
    downloadSummary: string;
    riderPortal: string;
    eastAfricaSecure: string;
    backToSite: string;
    activeStatus: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    nav: {
      home: 'Home',
      explore: 'Explore',
      restaurants: 'Fine Dining',
      spa: 'Spa & Wellness',
      spaDistrict: 'District',
      transport: 'VIP Mobility',
      groceries: 'Fine Cellar',
      experiences: 'Experiences',
      partners: 'Partners',
      forProperties: 'For Properties',
      forCouriers: 'For Couriers',
      forMerchants: 'For Merchants',
      partnerOnboarding: 'Partner Onboarding',
      applyFleet: 'Apply to Fleet',
      listBusiness: 'List Your Business',
      track: 'Track',
      viewCart: 'View Cart',
      appearanceMode: 'Appearance Mode',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      selectLanguage: 'Select Language',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      badge: 'Curated Hospitality Concierge',
      titleLine1: 'Everything you need,',
      titleLine2: 'right where you are.',
      subtitle: 'Order curated gourmet dishes, book sanctuary spa treatments, arrange VIP chauffeurs, and enjoy swift concierge delivery directly to your villa, room, or residence.',
      searchPlaceholder: 'Search Nobu, Wagyu, Balinese Spa, Maybach, Caviar...',
      searchBtn: 'Search',
      popular: 'Popular:',
      sugMichelin: 'Michelin Dining',
      sugMassage: 'Balinese Massage',
      sugMaybach: 'Maybach Chauffeur',
      sugCaviar: 'Caviar & Cellar',
      sugYacht: 'Yacht Charter',
      btnFineDining: 'Fine Dining',
      btnSpa: 'Spa & Wellness',
      btnMobility: 'VIP Mobility',
      ambienceDaylight: 'Daylight Sunlit Ambience',
      ambienceTwilight: 'Twilight Ambient View',
    },
    categories: {
      heading: 'Available Concierge Categories',
      subtitle: 'Tap any category below to browse curated in-villa dining, wellness, mobility & amenities.',
      groceriesTitle: 'Groceries',
      groceriesDesc: 'Fine cellar, caviar & fresh villa pantry',
      transportTitle: 'Transport',
      transportDesc: 'Airport Maybach, Rolls-Royce & Heli',
      spaTitle: 'Spa & Wellness',
      spaDesc: 'In-villa Balinese, facials & hydrothermal',
      restaurantsTitle: 'Restaurants',
      restaurantsDesc: 'Michelin & luxury dining room service',
      experiencesTitle: 'Experiences',
      experiencesDesc: 'Yacht charters, heli tours & polo clubs',
      essentialsTitle: 'Essentials',
      essentialsDesc: 'Personal care, wellness & hydration',
      viewAll: 'Explore All Categories',
    },
    howItWorks: {
      badge: 'Seamless Hospitality',
      heading: 'How NEXG Elevates Your Stay',
      subtitle: 'An effortless 4-step concierge journey crafted for luxury villas and private suites.',
      step1Title: 'Scan or Open',
      step1Desc: 'Scan the in-suite QR code or access our portal directly from any device without downloading apps.',
      step2Title: 'Curate Your Order',
      step2Desc: 'Browse verified Michelin partners, private cellar vintages, bespoke spa therapies, and executive rides.',
      step3Title: 'Discreet Preparation',
      step3Desc: 'Merchants craft your order with exacting temperature control and white-glove packaging.',
      step4Title: 'Villa Doorstep Delivery',
      step4Desc: 'Our vetted elite fleet delivers swiftly directly to your suite door or poolside lounger.',
    },
    promo: {
      badge: 'Exclusive Guest Privileges',
      heading: 'Complimentary Concierge Delivery on First Order',
      desc: 'Enjoy zero delivery surcharge across all Michelin partner dining and fine cellar collections with your room authorization.',
      cta: 'Explore Dining Now',
      code: 'Use code: VILLA2026',
      appHeading1: 'Take NEXG',
      appHeading2: 'everywhere',
      appSubtitle: 'The all-in-one app for guests, residents and travelers.',
      downloadOn: 'Download on the',
      appStore: 'App Store',
      getItOn: 'GET IT ON',
      googlePlay: 'Google Play',
      merchantsTitle: 'For Merchants',
      merchantsDesc: 'Grow your business with NEXG.',
      merchantsCta: 'Partner with us',
      couriersTitle: 'For Couriers',
      couriersDesc: 'Deliver excellence. Join our fleet.',
      couriersCta: 'Apply now',
      propertiesTitle: 'For Properties',
      propertiesDesc: 'Elevate your guest experience.',
      propertiesCta: 'List with us',
    },
    features: {
      badge: 'Excellence & Trust',
      heading: 'Standard of Luxury Hospitality',
      subtitle: 'Why top-tier resorts, private residences, and discerning guests rely on NEXG.',
      feat1Title: '24/7 Dedicated Concierge',
      feat1Desc: 'Instant multilingual support for custom dietary requests, private bookings, and timed delivery.',
      feat2Title: 'Michelin & Premier Partners',
      feat2Desc: 'Direct integration with city landmark restaurants, certified sommeliers, and accredited spa therapists.',
      feat3Title: 'Discreet Security & Privacy',
      feat3Desc: 'Encrypted room billing, contactless delivery protocols, and complete guest confidentiality.',
      feat4Title: 'Swift Temperature-Controlled Fleet',
      feat4Desc: 'Custom thermal carriers and pristine executive vehicles ensure every dish and beverage arrives in peak condition.',
      f1Title: 'Secure payments',
      f1Desc: 'Safe & encrypted',
      f2Title: 'Real-time tracking',
      f2Desc: 'Know where it is',
      f3Title: 'Multiple options',
      f3Desc: 'Card, M-Pesa & more',
      f4Title: 'Discreet delivery',
      f4Desc: 'Privacy guaranteed',
    },
    restaurants: {
      title: 'Fine Dining & Room Service',
      subtitle: 'Curated menus from premier culinary destinations delivered piping hot directly to your table.',
      searchPlaceholder: 'Search restaurants, sushi, wagyu, truffle pasta...',
      filterAll: 'All Cuisines',
      filterJapanese: 'Japanese / Omakase',
      filterItalian: 'Italian / Pasta',
      filterFrench: 'French Haute',
      filterMediterranean: 'Mediterranean',
      filterSteakhouse: 'Steakhouse & Grill',
      filterDesserts: 'Artisan Pastry',
      viewMenu: 'View Menu',
      minOrder: 'Min Order',
      deliveryTime: 'Est. Delivery',
      featuredDish: 'Signature Highlight',
      addToBag: 'Add to Bag',
      closed: 'Closed for Prep',
      openNow: 'Available Now',
    },
    spa: {
      title: 'Sanctuary Spa & Wellness',
      subtitle: 'Transform your villa into a private haven with world-class massage therapists and body treatments.',
      bookTreatment: 'Book Therapy',
      duration: 'Duration',
      inVilla: 'In-Villa / Suite',
      sanctuary: 'Resort Pavilion',
      therapistGender: 'Therapist Preference',
      anyTherapist: 'No Preference',
      femaleTherapist: 'Female Therapist',
      maleTherapist: 'Male Therapist',
      reserveNow: 'Reserve Session',
    },
    transport: {
      title: 'VIP Mobility & Executive Chauffeurs',
      subtitle: 'On-demand Maybach sedans, Range Rover VIP SUVs, and helicopter charter transfers.',
      chauffeurIncluded: 'White-Glove Chauffeur Included',
      perHour: '/ hour',
      airportTransfer: 'Airport VIP Transfer',
      bookChauffeur: 'Book Ride',
      capacity: 'Seats',
      luggage: 'Luggage capacity',
      instantDispatch: 'Priority Immediate Dispatch',
    },
    groceries: {
      title: 'Fine Cellar & Villa Pantry',
      subtitle: 'Grand cru champagnes, Beluga caviar, gourmet charcuterie, and organic fresh breakfast provisions.',
      cellar: 'Grand Cru Cellar',
      pantry: 'Gourmet Pantry',
      caviar: 'Caviar & Delicacies',
      bakery: 'Morning Bakery',
      addToCart: 'Add to Order',
      inStock: 'Ready for Immediate Dispatch',
    },
    experiences: {
      title: 'Curated VIP Experiences',
      subtitle: 'Unforgettable private yacht cruises, heli sky tours, desert glamping, and private polo lessons.',
      bookExperience: 'Inquire & Reserve',
      groupSize: 'Max Capacity',
      duration: 'Experience Length',
      vipHostIncluded: 'Dedicated Concierge Host',
    },
    cart: {
      title: 'Your Concierge Bag',
      emptyTitle: 'Your Bag is Empty',
      emptyDesc: 'Explore our fine dining, spa therapies, cellar vintages, or luxury rides to begin your order.',
      exploreBtn: 'Explore Culinary & Services',
      subtotal: 'Items Subtotal',
      deliveryFee: 'White-Glove Delivery',
      conciergeService: 'Concierge Hospitality Fee (5%)',
      total: 'Total Amount',
      checkoutBtn: 'Proceed to Villa Authorization',
      villaPlaceholder: 'Villa / Suite / Penthouse No.',
      specialNotes: 'Special chef instructions or delivery timing...',
      orderPlaced: 'Order Successfully Placed!',
      items: 'items',
      clearCart: 'Clear Bag',
    },
    tracking: {
      title: 'Live Concierge Tracking',
      orderNumber: 'Order ID',
      estimatedArrival: 'Estimated Arrival',
      mins: 'minutes',
      statusConfirmed: 'Order Confirmed by Concierge',
      statusPreparing: 'Kitchen / Merchant Preparation',
      statusInTransit: 'Elite Courier in Transit',
      statusDelivered: 'Delivered to Villa',
      courierAssigned: 'Assigned Courier',
      contactConcierge: 'Contact Concierge Desk',
      close: 'Minimize Tracker',
    },
    footer: {
      brandDesc: 'The ultimate luxury guest hospitality platform. Connecting five-star resorts, private villas, and high-net-worth travelers with the finest local culinary masters, wellness specialists, and executive mobility.',
      exploreTitle: 'Concierge Services',
      partnersTitle: 'Enterprise & Partners',
      legalTitle: 'Trust & Governance',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Preferences',
      rightsReserved: 'All Rights Reserved. NEXG Concierge International.',
      language: 'Language / Region',
      craftedWith: 'Crafted for five-star luxury hospitality',
      aboutText: 'Hospitality. Simplified. Elevating the curated delivery and private concierge experience across Kenya.',
      verticals: 'Verticals',
      fineDining: 'Fine Dining',
      spaWellness: 'Spa & Wellness',
      vipMobility: 'VIP Mobility',
      gourmetCellar: 'Gourmet Cellar',
      experiences: 'Experiences',
      partners: 'Partners',
      forMerchants: 'For Merchants',
      forCouriers: 'For Couriers',
      forProperties: 'For Properties',
      legalSupport: 'Legal & Support',
      conciergeDesk: 'Concierge Desk',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      safetyStandards: 'Safety Standards',
      connect: 'Connect',
      rights: '© 2026 NEXG Concierge. All rights reserved.',
      simulatedNotice: 'Simulated Payment Router Demo (Awaiting Live Gateway Connection)',
    },
    partnerHeaders: {
      ecosystem: 'Ecosystem',
      qrTech: 'QR Tech',
      revShareCalc: 'RevShare Calc',
      integrations: 'Integrations',
      benefits: 'Benefits',
      logistics: 'Logistics',
      howItWorks: 'How It Works',
      categories: 'Categories',
      earningsCalc: 'Earnings Calc',
      fleetPerks: 'Fleet Benefits',
      standards: 'Standards',
      faq: 'Fleet FAQ',
    },
    partnersPortal: {
      merchantTitle: 'Merchant Partners',
      merchantSubtitle: 'Expand your culinary and luxury business across five-star villas and suites.',
      courierTitle: 'Elite Fleet',
      courierSubtitle: 'Deliver luxury concierge orders. Earn premium fares and tips.',
      propertiesTitle: 'For Properties & Resorts',
      propertiesSubtitle: 'Zero-CapEx in-room guest amenity platform with integrated revenue share.',
      backHome: 'Return to Guest Concierge',
      listBusiness: 'List Your Business',
      applyFleet: 'Apply to Fleet',
      partnerNexg: 'Partner with NEXG',
      onboardingActive: 'Active',
      onboardingStatus: 'Onboarding Status',
      stepText: 'Step',
      ofText: 'of',
      nextStep: 'Next Step',
      prevStep: 'Previous',
      submitApplication: 'Submit Application',
      agreementTitle: 'Partner Service Agreement',
      agreementDesc: 'Please review terms and sign digitally below.',
      successTitle: 'Application Submitted Successfully!',
      successDesc: 'Our concierge onboarding committee will review your submission and contact you within 24 hours.',
      returnHome: 'Return to Portal Home',
      downloadSummary: 'Download Summary PDF',
      riderPortal: 'Rider Partner Portal',
      eastAfricaSecure: 'East Africa • Secure Onboarding',
      backToSite: 'Back to Site',
      activeStatus: 'Active',
    },
  },
  zh: {
    nav: {
      home: '首页',
      explore: '探索探索',
      restaurants: '米其林美馔',
      spa: '水疗与养生',
      spaDistrict: '尊享专区',
      transport: '贵宾专车',
      groceries: '名庄珍酿',
      experiences: '定制体验',
      partners: '合作伙伴',
      forProperties: '酒店与物业合作',
      forCouriers: '加入骑士车队',
      forMerchants: '商家入驻合作',
      partnerOnboarding: '合作申请入驻',
      applyFleet: '申请加入车队',
      listBusiness: '商家入驻申请',
      track: '实时追踪',
      viewCart: '礼宾账单',
      appearanceMode: '外观显示模式',
      lightMode: '日间明朗模式',
      darkMode: '夜间静谧模式',
      selectLanguage: '切换系统语言',
      menu: '主菜单',
      close: '关闭',
    },
    hero: {
      badge: '顶级奢华酒店管家礼宾系统',
      titleLine1: '您所需的一切尊享体验，',
      titleLine2: '皆在当下触手可得。',
      subtitle: '随时订购顶级名厨珍馐、预约别墅水疗理疗、召唤迈巴赫专车接送，享受白手套尊崇配送直达您的私享套房与泳池露台。',
      searchPlaceholder: '搜索 Nobu 日料、顶级和牛、巴厘岛 SPA、迈巴赫接送、鱼子酱...',
      searchBtn: '搜索服务',
      popular: '热门推荐：',
      sugMichelin: '米其林美馔',
      sugMassage: '巴厘岛精油水疗',
      sugMaybach: '迈巴赫礼宾车队',
      sugCaviar: '名庄鱼子酱酒窖',
      sugYacht: '私人游艇出海',
      btnFineDining: '米其林餐厅',
      btnSpa: '水疗与养生',
      btnMobility: '贵宾出行',
      ambienceDaylight: '日光朗照模式',
      ambienceTwilight: '暮色流光模式',
    },
    categories: {
      heading: '私享礼宾服务分类',
      subtitle: '点击以下专属分类，浏览直达别墅的顶级美馔、理疗SPA、豪华车队与尊崇礼遇。',
      groceriesTitle: '名酿与食品',
      groceriesDesc: '名庄佳酿、顶级鱼子酱与新鲜食材',
      transportTitle: '贵宾出行',
      transportDesc: '机场迈巴赫、劳斯莱斯与直升机包机',
      spaTitle: '水疗与养生',
      spaDesc: '套房巴厘岛按摩、面部护理与水疗',
      restaurantsTitle: '美馔佳肴',
      restaurantsDesc: '米其林星级客房送餐与私厨定制',
      experiencesTitle: '专属体验',
      experiencesDesc: '私人游艇巡航、直升机观光与马术',
      essentialsTitle: '奢享备品',
      essentialsDesc: '个人护理、高端补水与舒缓必备品',
      viewAll: '浏览全部礼宾类别',
    },
    howItWorks: {
      badge: '无缝尊享体验',
      heading: 'NEXG 如何尊崇升级您的度假时光',
      subtitle: '专为奢华度假村、私享别墅和总统套房定制的4步极简礼宾流程。',
      step1Title: '扫码即刻开启',
      step1Desc: '扫描房间专属二维码或在任何设备浏览器中一键打开，无需下载安装任何 App。',
      step2Title: '定制您的专属订单',
      step2Desc: '挑选米其林合作名厨菜单、顶级年份佳酿、私人水疗护理或贵宾专车。',
      step3Title: '严谨精细备餐',
      step3Desc: '合作商家严格控温制作，搭配专属白手套奢华保温礼盒包装。',
      step4Title: '直达套房门前',
      step4Desc: '经严格安全认证的专职礼宾员直接送达您的别墅套房门口或私家泳池旁。',
    },
    promo: {
      badge: '尊贵宾客专属礼遇',
      heading: '首单尊享免礼宾配送附加费',
      desc: '在所有米其林餐厅与名庄珍酿订单中，凭房号授权即可享受免收外送服务费特权。',
      cta: '立即探索顶级美馔',
      code: '尊享礼券码：VILLA2026',
      appHeading1: '随身携带 NEXG',
      appHeading2: '无处不在',
      appSubtitle: '为住客、居民与环球旅行者打造的一站式尊享 App。',
      downloadOn: '前往下载',
      appStore: 'App Store',
      getItOn: '立即获取',
      googlePlay: 'Google Play',
      merchantsTitle: '针对商家伙伴',
      merchantsDesc: '携手 NEXG 拓展您的尊贵业务。',
      merchantsCta: '与我们合作',
      couriersTitle: '针对专职骑手',
      couriersDesc: '传递卓越。加入我们的精英车队。',
      couriersCta: '立即申请',
      propertiesTitle: '针对酒店物业',
      propertiesDesc: '全面升级您的宾客度假体验。',
      propertiesCta: '入驻合作',
    },
    features: {
      badge: '卓越与信任',
      heading: '奢华酒店服务最高标准',
      subtitle: '为何全球顶奢度假村、私人豪宅与高端旅客始终信赖 NEXG。',
      feat1Title: '24/7 全天候多语种礼宾',
      feat1Desc: '专属客服即时响应私人忌口偏好、预约包场与精准定时配送。',
      feat2Title: '米其林名厨与顶级伙伴',
      feat2Desc: '直连当地地标餐厅、认证侍酒大师与高级认证芳疗师团队。',
      feat3Title: '绝对私密与安全保障',
      feat3Desc: '加密房账签单系统、无接触安全配送协议与严格的宾客隐私保密。',
      feat4Title: '恒温专用车队与极速送达',
      feat4Desc: '专业冷热温控箱与豪华商务座驾，确保每道珍馐与香槟处于最佳品鉴温度。',
      f1Title: '安全支付',
      f1Desc: '安全且全程加密',
      f2Title: '实时物流追踪',
      f2Desc: '随时掌握订单位置',
      f3Title: '多元支付方式',
      f3Desc: '支持信用卡、M-Pesa等',
      f4Title: '私密尊享送达',
      f4Desc: '绝对保障个人隐私',
    },
    restaurants: {
      title: '米其林星级美馔与客房送餐',
      subtitle: '顶级厨艺大师名菜直接热腾腾送达您的餐桌，尽享私密饕餮盛宴。',
      searchPlaceholder: '搜索餐厅、顶级寿司、和牛、黑松露意面...',
      filterAll: '全部风味',
      filterJapanese: '日料 / 厨师发办',
      filterItalian: '意式风味 / 手工意面',
      filterFrench: '法式高级料理',
      filterMediterranean: '地中海风味',
      filterSteakhouse: '顶级牛排馆与炭烤',
      filterDesserts: '名厨手工甜品',
      viewMenu: '查看完整菜单',
      minOrder: '起送金额',
      deliveryTime: '预计送达时间',
      featuredDish: '主厨招牌推荐',
      addToBag: '加入礼宾账单',
      closed: '准备中',
      openNow: '正在接单',
    },
    spa: {
      title: '私享水疗与养生护理',
      subtitle: '将您的私享别墅打造成专属疗愈绿洲，由资深理疗大师提供顶级水疗护理。',
      bookTreatment: '预约护理',
      duration: '理疗时长',
      inVilla: '别墅 / 套房内',
      sanctuary: '水疗专属亭',
      therapistGender: '理疗师偏好',
      anyTherapist: '不限偏好',
      femaleTherapist: '女性理疗师',
      maleTherapist: '男性理疗师',
      reserveNow: '立即确认预约',
    },
    transport: {
      title: '贵宾专车与行政司机接送',
      subtitle: '随叫随到的迈巴赫轿车、路虎揽胜行政 SUV 与私人直升机接驳服务。',
      chauffeurIncluded: '包含专职白手套司机',
      perHour: '/ 小时',
      airportTransfer: '机场 VIP 极速接送',
      bookChauffeur: '预订专车',
      capacity: '乘坐人数',
      luggage: '行李容量',
      instantDispatch: '优先即时派车',
    },
    groceries: {
      title: '名庄酒窖与私享食库',
      subtitle: '特级园香槟、俄罗斯顶级白鲟鱼子酱、黑松露熟食与当日有机新鲜早餐备品。',
      cellar: '特级园名庄酒窖',
      pantry: '高端美食专柜',
      caviar: '顶级鱼子酱与珍馐',
      bakery: '清晨现烤欧包点心',
      addToCart: '加入采购单',
      inStock: '现货即时配送',
    },
    experiences: {
      title: '量身定制的尊崇体验',
      subtitle: '难忘的私人豪华游艇出海、直升机高空俯瞰、沙漠星空露营与私人马术课程。',
      bookExperience: '咨询并预约',
      groupSize: '最大接待人数',
      duration: '体验总时长',
      vipHostIncluded: '配备专属礼宾向导',
    },
    cart: {
      title: '您的礼宾账单',
      emptyTitle: '您的礼宾袋为空',
      emptyDesc: '挑选米其林美食、预约水疗理疗、品鉴佳酿或呼叫专车以开始您的订单。',
      exploreBtn: '浏览餐饮与服务',
      subtotal: '商品小计',
      deliveryFee: '白手套专享配送费',
      conciergeService: '礼宾服务费 (5%)',
      total: '应付总额',
      checkoutBtn: '前往房账授权支付',
      villaPlaceholder: '别墅 / 总统套房房号',
      specialNotes: '主厨特殊制作要求或指定送达时间...',
      orderPlaced: '订单已成功下单！',
      items: '件商品',
      clearCart: '清空账单',
    },
    tracking: {
      title: '实时礼宾物流追踪',
      orderNumber: '订单编号',
      estimatedArrival: '预计送达时间',
      mins: '分钟',
      statusConfirmed: '礼宾部已确认订单',
      statusPreparing: '主厨 / 商家精心备货中',
      statusInTransit: '专职骑士正在送往您的套房',
      statusDelivered: '已送达别墅门口',
      courierAssigned: '负责配送礼宾员',
      contactConcierge: '致电礼宾服务台',
      close: '收起追踪器',
    },
    footer: {
      brandDesc: '全球领先的五星级酒店奢华礼宾平台。将顶级度假村、私享别墅与高净值旅客同当地顶尖名厨、健康养生大师和尊贵出行专车无缝连接。',
      exploreTitle: '礼宾服务导航',
      partnersTitle: '企业与合作伙伴',
      legalTitle: '信托与合规保障',
      privacy: '隐私权政策',
      terms: '服务条款',
      cookies: 'Cookie 偏好设置',
      rightsReserved: '版权所有。NEXG Concierge International 保留一切权利。',
      language: '语言 / 地区',
      craftedWith: '专为五星级奢华酒店服务定制',
      aboutText: '极简奢华款待。在肯尼亚打造独具品味的私享配送与专属礼宾体验。',
      verticals: '礼宾品类',
      fineDining: '米其林美馔',
      spaWellness: '水疗与养生',
      vipMobility: '贵宾出行',
      gourmetCellar: '名庄酒窖',
      experiences: '定制体验',
      partners: '合作伙伴',
      forMerchants: '商家合作',
      forCouriers: '骑手招募',
      forProperties: '酒店物业',
      legalSupport: '法律与支持',
      conciergeDesk: '礼宾服务台',
      termsOfService: '服务条款',
      privacyPolicy: '隐私政策',
      safetyStandards: '安全标准',
      connect: '联系与互动',
      rights: '© 2026 NEXG Concierge. 版权所有。',
      simulatedNotice: '模拟支付网关演示（等待接入实时网关）',
    },
    partnerHeaders: {
      ecosystem: '生态系统',
      qrTech: '二维码技术',
      revShareCalc: '分润计算器',
      integrations: '系统对接',
      benefits: '合作优势',
      logistics: '物流支持',
      howItWorks: '运作流程',
      categories: '入驻品类',
      earningsCalc: '收入测算',
      fleetPerks: '车队福利',
      standards: '服务标准',
      faq: '常见疑问',
    },
    partnersPortal: {
      merchantTitle: '商家入驻伙伴',
      merchantSubtitle: '将您的名厨料理与奢华备品拓展至五星级度假村别墅与总统套房。',
      courierTitle: '精英骑士车队',
      courierSubtitle: '配送奢华礼宾订单，享受丰厚基础单价与专属小费收益。',
      propertiesTitle: '酒店与物业合作',
      propertiesSubtitle: '零资本投入的客房私享礼宾服务系统与全自动收益分成。',
      backHome: '返回宾客礼宾中心',
      listBusiness: '商家入驻申请',
      applyFleet: '申请加入车队',
      partnerNexg: '与 NEXG 携手合作',
      onboardingActive: '进行中',
      onboardingStatus: '入驻申请状态',
      stepText: '步骤',
      ofText: '共',
      nextStep: '下一步',
      prevStep: '上一步',
      submitApplication: '提交申请',
      agreementTitle: '合作协议条款',
      agreementDesc: '请仔细阅读以下合作协议条款并在底部完成数字签署。',
      successTitle: '入驻申请已成功提交！',
      successDesc: '我们的礼宾审核委员会将在24小时内审核您的材料并与您取得联系。',
      returnHome: '返回门户首页',
      downloadSummary: '下载申请摘要 PDF',
      riderPortal: '骑手合作门户',
      eastAfricaSecure: '东非专区 • 安全入驻',
      backToSite: '返回主页',
      activeStatus: '进行中',
    },
  },
  sw: {
    nav: {
      home: 'Mwanzo',
      explore: 'Gundua',
      restaurants: 'Vyakula Bora',
      spa: 'Spa & Afya',
      spaDistrict: 'Kitengo',
      transport: 'Magari ya Kifahari',
      groceries: 'Vinywaji Bora',
      experiences: 'Matukio Maalum',
      partners: 'Washirika',
      forProperties: 'Kwa Hoteli & Majengo',
      forCouriers: 'Kwa Madereva wa Fleet',
      forMerchants: 'Kwa Wafanyabiashara',
      partnerOnboarding: 'Kujiunga na Ushirika',
      applyFleet: 'Omba Kujiunga na Fleet',
      listBusiness: 'Sajili Biashara Yako',
      track: 'Fuatilia',
      viewCart: 'Kikapu Changu',
      appearanceMode: 'Muonekano',
      lightMode: 'Mwangaza wa Mchana',
      darkMode: 'Giza la Usiku',
      selectLanguage: 'Chagua Lugha',
      menu: 'Menyu',
      close: 'Funga',
    },
    hero: {
      badge: 'Huduma Maalum ya Concierge ya Kifahari',
      titleLine1: 'Kila kitu unachohitaji,',
      titleLine2: 'pale pale ulipo sasa.',
      subtitle: 'Agiza vyakula bora kutoka kwa wapishi mashuhuri, weka miadi ya masaji ya utulivu wa hali ya juu, agiza madereva wa VIP Maybach, na ufurahie uwasilishaji wa haraka moja kwa moja kwenye villa au chumba chako.',
      searchPlaceholder: 'Tafuta Nobu, Nyama ya Wagyu, Spa ya Balinese, Maybach, Caviar...',
      searchBtn: 'Tafuta',
      popular: 'Maarufu:',
      sugMichelin: 'Vyakula vya Michelin',
      sugMassage: 'Masaji ya Balinese',
      sugMaybach: 'Dereva wa Maybach',
      sugCaviar: 'Caviar & Divai Nzuri',
      sugYacht: 'Kukodi Boti ya Kifahari',
      btnFineDining: 'Vyakula Bora',
      btnSpa: 'Spa & Afya',
      btnMobility: 'Usafiri wa VIP',
      ambienceDaylight: 'Mwonekano wa Mchana',
      ambienceTwilight: 'Mwonekano wa Jioni',
    },
    categories: {
      heading: 'Vitengo vya Huduma za Concierge',
      subtitle: 'Bofya kategoria yoyote hapa chini kuona vyakula vya chumbani, huduma za spa, usafiri na bidhaa maalum.',
      groceriesTitle: 'Vyakula & Vinywaji',
      groceriesDesc: 'Mvinyo bora, caviar & chakula safi cha villa',
      transportTitle: 'Usafiri wa VIP',
      transportDesc: 'Maybach ya Uwanja wa Ndege, Rolls-Royce & Helikopta',
      spaTitle: 'Spa & Afya',
      spaDesc: 'Masaji ya Balinese ndani ya villa, usoni & utulivu',
      restaurantsTitle: 'Migahawa Bora',
      restaurantsDesc: 'Huduma ya chumbani ya vyakula vya hadhi ya juu',
      experiencesTitle: 'Matukio ya Kipekee',
      experiencesDesc: 'Safari za boti, ziara za helikopta & mchezo wa polo',
      essentialsTitle: 'Mahitaji Muhimu',
      essentialsDesc: 'Huduma binafsi, afya & vinywaji vya kuburudisha',
      viewAll: 'Tazama Kategoria Zote',
    },
    howItWorks: {
      badge: 'Ukarimu Usio na Kikomo',
      heading: 'Jinsi NEXG Inavyoboresha Kukaa Kwako',
      subtitle: 'Hatua 4 rahisi za huduma ya concierge zilizoundwa kwa ajili ya villa za kifahari na vyumba vya hadhi ya juu.',
      step1Title: 'Skani au Fungua',
      step1Desc: 'Skani msimbo wa QR ndani ya chumba au fungua wavuti yetu moja kwa moja kwenye kifaa chochote bila kupakua programu.',
      step2Title: 'Chagua Agizo Lako',
      step2Desc: 'Gundua vyakula vya wapishi maarufu, mvinyo za miaka mingi, huduma za spa, na usafiri wa hadhi ya juu.',
      step3Title: 'Maandalizi ya Kipekee',
      step3Desc: 'Wafanyabiashara wanatayarisha agizo lako kwa udhibiti wa halijoto na vifungashio vya hadhi ya juu.',
      step4Title: 'Kufikishwa Mlangoni',
      step4Desc: 'Madereva wetu maalum wanaleta agizo lako haraka mlangoni mwa villa au kando ya bwawa.',
    },
    promo: {
      badge: 'Upendeleo Maalum wa Wageni',
      heading: 'Uwasilishaji wa Bure Kwenye Agizo la Kwanza',
      desc: 'Furahia bila tozo ya uwasilishaji kwenye migahawa yote washirika na mikusanyiko ya divai kwa kutumia nambari ya chumba chako.',
      cta: 'Gundua Vyakula Sasa',
      code: 'Tumia msimbo: VILLA2026',
      appHeading1: 'Nenda na NEXG',
      appHeading2: 'kila mahali',
      appSubtitle: 'Programu ya kila kitu kwa wageni, wakazi na wasafiri.',
      downloadOn: 'Pakua kwenye',
      appStore: 'App Store',
      getItOn: 'IPATE KWENYE',
      googlePlay: 'Google Play',
      merchantsTitle: 'Kwa Wafanyabiashara',
      merchantsDesc: 'Kuza biashara yako ukitumia NEXG.',
      merchantsCta: 'Shirikiana nasi',
      couriersTitle: 'Kwa Madereva',
      couriersDesc: 'Leta ubora. Jiunge na kundi letu.',
      couriersCta: 'Omba sasa',
      propertiesTitle: 'Kwa Hoteli & Majengo',
      propertiesDesc: 'Boresha uzoefu wa wageni wako.',
      propertiesCta: 'Jiunge nasi',
    },
    features: {
      badge: 'Ubora & Uaminifu',
      heading: 'Kiwango cha Ukarimu wa Kifahari',
      subtitle: 'Kwanini hoteli za hadhi ya juu, makazi binafsi na wageni mashuhuri wanaiamini NEXG.',
      feat1Title: 'Concierge wa Saa 24/7',
      feat1Desc: 'Msaada wa lugha mbalimbali kwa maombi maalum ya chakula, uhifadhi na uwasilishaji wa wakati maalum.',
      feat2Title: 'Wapishi & Washirika wa Hali ya Juu',
      feat2Desc: 'Ushirikiano wa moja kwa moja na migahawa mashuhuri na wataalamu walioidhinishwa wa masaji.',
      feat3Title: 'Faragha & Usalama Kamili',
      feat3Desc: 'Malipo yaliyolindwa kupitia chumba, uwasilishaji usio na mguso, na usiri kamili wa mgeni.',
      feat4Title: 'Usafirishaji wa Haraka wenye Halijoto Maalum',
      feat4Desc: 'Vifaa maalum vya kuhifadhi joto na magari safi ya kifahari kuhakikisha chakula kinawasili kikiwa tayari kuliwa.',
      f1Title: 'Malipo salama',
      f1Desc: 'Salama & yaliyolindwa',
      f2Title: 'Ufuatiliaji wa papo hapo',
      f2Desc: 'Jua mahali kilipo',
      f3Title: 'Chaguzi nyingi za malipo',
      f3Desc: 'Kadi, M-Pesa & zaidi',
      f4Title: 'Uwasilishaji wa siri',
      f4Desc: 'Faragha imehakikishwa',
    },
    restaurants: {
      title: 'Vyakula Bora & Huduma ya Chumbani',
      subtitle: 'Menyu maalum kutoka kwa wapishi mashuhuri zinazoletwa zikiwa moto moja kwa moja mezani kwako.',
      searchPlaceholder: 'Tafuta migahawa, sushi, nyama ya wagyu, pasta...',
      filterAll: 'Vyakula Vyote',
      filterJapanese: 'Kijapani / Omakase',
      filterItalian: 'Kiitaliano / Pasta',
      filterFrench: 'Kifaransa cha Kifahari',
      filterMediterranean: 'Bahari ya Mediterania',
      filterSteakhouse: 'Nyama ya Kuchoma',
      filterDesserts: 'Keki & Vitafunio',
      viewMenu: 'Tazama Menyu',
      minOrder: 'Kima cha Chini',
      deliveryTime: 'Muda wa Kufika',
      featuredDish: 'Chakula Maalum',
      addToBag: 'Weka Kwenye Mfuko',
      closed: 'Imefungwa kwa Maandalizi',
      openNow: 'Inapokea Maagizo',
    },
    spa: {
      title: 'Spa & Afya ya Utulivu',
      subtitle: 'Geuza villa yako kuwa kituo cha faragha cha mapumziko na wataalamu bora wa masaji na urembo.',
      bookTreatment: 'Weka Miadi ya Tiba',
      duration: 'Muda',
      inVilla: 'Ndani ya Villa / Chumba',
      sanctuary: 'Banda Maalum la Resort',
      therapistGender: 'Uchaguzi wa Mtaalamu',
      anyTherapist: 'Bila Upendeleo',
      femaleTherapist: 'Mtaalamu wa Kike',
      maleTherapist: 'Mtaalamu wa Kiume',
      reserveNow: 'Thibitisha Miadi',
    },
    transport: {
      title: 'Usafiri wa VIP & Madereva Binafsi',
      subtitle: 'Magari ya Maybach, SUV za Range Rover VIP, na huduma za helikopta zinazopatikana mara moja.',
      chauffeurIncluded: 'Dereva wa Hadhi ya Juu Amejumuishwa',
      perHour: '/ saa',
      airportTransfer: 'Usafiri wa VIP wa Uwanja wa Ndege',
      bookChauffeur: 'Agiza Gari',
      capacity: 'Viti',
      luggage: 'Uwezo wa Mizigo',
      instantDispatch: 'Kutuma Gari Mara Moja',
    },
    groceries: {
      title: 'Mkusanyiko wa Vinywaji & Vyakula vya Villa',
      subtitle: 'Champagne za kifahari, caviar ya Beluga, vitafunio vya kipekee, na vyakula freshi vya asubuhi.',
      cellar: 'Hifadhi ya Divai Nzuri',
      pantry: 'Vyakula vya Kifahari',
      caviar: 'Caviar & Ladha Adimu',
      bakery: 'Mkate Freshi wa Asubuhi',
      addToCart: 'Weka Kwenye Agizo',
      inStock: 'Tayari kwa Uwasilishaji',
    },
    experiences: {
      title: 'Matukio Maalum ya Kifahari',
      subtitle: 'Safari zisizosahaulika za boti za kifahari, ziara za helikopta angani, kambi jangwani na mafunzo ya polo.',
      bookExperience: 'Uliza & Weka Nafasi',
      groupSize: 'Uwezo wa Watu',
      duration: 'Muda wa Tukio',
      vipHostIncluded: 'Mwezeshaji Maalum wa Concierge',
    },
    cart: {
      title: 'Kikapu Chako cha Concierge',
      emptyTitle: 'Kikapu Chako Kiko Wazi',
      emptyDesc: 'Chagua vyakula bora, huduma za spa, vinywaji adimu, au usafiri wa kifahari ili kuanza agizo lako.',
      exploreBtn: 'Gundua Vyakula & Huduma',
      subtotal: 'Jumla Ndogo ya Bidhaa',
      deliveryFee: 'Ada ya Uwasilishaji wa Kifahari',
      conciergeService: 'Ada ya Huduma ya Concierge (5%)',
      total: 'Kiasi Kamili',
      checkoutBtn: 'Endelea na Idhini ya Chumba',
      villaPlaceholder: 'Nambari ya Villa / Chumba / Penthouse',
      specialNotes: 'Maelekezo maalum kwa mpishi au muda wa kufikisha...',
      orderPlaced: 'Agizo Limewekwa Kikamilifu!',
      items: 'vitu',
      clearCart: 'Futa Kikapu',
    },
    tracking: {
      title: 'Ufuatiliaji wa Moja kwa Moja',
      orderNumber: 'Nambari ya Agizo',
      estimatedArrival: 'Muda wa Kukadiriwa Kufika',
      mins: 'dakika',
      statusConfirmed: 'Agizo Limethibitishwa na Concierge',
      statusPreparing: 'Maandalizi ya Jikoni / Mfanyabiashara',
      statusInTransit: 'Dereva Maalum Yuko Njiani',
      statusDelivered: 'Limefikishwa Kwenye Villa',
      courierAssigned: 'Dereva Aliyepangiwa',
      contactConcierge: 'Wasiliana na Dawati la Concierge',
      close: 'Funga Kifuatiliaji',
    },
    footer: {
      brandDesc: 'Jukwaa kuu la ukarimu wa kifahari kwa wageni wa hoteli za nyota tano. Inaunganisha hoteli za hadhi ya juu, villa za kibinafsi, na wasafiri mashuhuri na wapishi bora, wataalamu wa afya na usafiri wa kifahari.',
      exploreTitle: 'Huduma za Concierge',
      partnersTitle: 'Biashara & Washirika',
      legalTitle: 'Sheria & Ulinzi',
      privacy: 'Sera ya Faragha',
      terms: 'Vigezo vya Huduma',
      cookies: 'Mipangilio ya Vidakuzi',
      rightsReserved: 'Haki Zote Zimehifadhiwa. NEXG Concierge International.',
      language: 'Lugha / Eneo',
      craftedWith: 'Imeundwa kwa ajili ya ukarimu wa hadhi ya nyota tano',
      aboutText: 'Ukarimu Uliorahisishwa. Kuboresha uzoefu wa uwasilishaji wa kipekee na concierge binafsi kote Kenya.',
      verticals: 'Huduma Zetu',
      fineDining: 'Vyakula Bora',
      spaWellness: 'Spa & Afya',
      vipMobility: 'Usafiri wa VIP',
      gourmetCellar: 'Vinywaji Bora',
      experiences: 'Matukio Maalum',
      partners: 'Washirika',
      forMerchants: 'Kwa Wafanyabiashara',
      forCouriers: 'Kwa Madereva',
      forProperties: 'Kwa Majengo & Hoteli',
      legalSupport: 'Sheria & Msaada',
      conciergeDesk: 'Dawati la Concierge',
      termsOfService: 'Masharti ya Huduma',
      privacyPolicy: 'Sera ya Faragha',
      safetyStandards: 'Viwango vya Usalama',
      connect: 'Wasiliana Nasi',
      rights: '© 2026 NEXG Concierge. Haki zote zimehifadhiwa.',
      simulatedNotice: 'Onyesho la Mfumo wa Malipo (Inasubiri Muunganisho wa Moja kwa Moja)',
    },
    partnerHeaders: {
      ecosystem: 'Mfumo Wetu',
      qrTech: 'Teknolojia ya QR',
      revShareCalc: 'Kikokotoo cha Mapato',
      integrations: 'Muunganisho',
      benefits: 'Faida',
      logistics: 'Usafirishaji',
      howItWorks: 'Jinsi Inavyofanya Kazi',
      categories: 'Makundi',
      earningsCalc: 'Kikokotoo cha Mapato',
      fleetPerks: 'Faida za Dereva',
      standards: 'Viwango vya Huduma',
      faq: 'Maswali ya Fleet',
    },
    partnersPortal: {
      merchantTitle: 'Washirika wa Biashara',
      merchantSubtitle: 'Panua biashara yako ya vyakula na ukarimu katika villa za nyota tano na vyumba vya kifahari.',
      courierTitle: 'Madereva wa Fleet',
      courierSubtitle: 'Wasilisha maagizo ya kifahari ya concierge. Pata malipo bora na zawadi za vidokezo.',
      propertiesTitle: 'Kwa Hoteli & Majengo',
      propertiesSubtitle: 'Jukwaa la ukarimu wa chumbani bila gharama za mtaji lenye mgawanyo wa moja kwa moja wa mapato.',
      backHome: 'Rudi Kwenye Concierge',
      listBusiness: 'Sajili Biashara Yako',
      applyFleet: 'Omba Kujiunga na Fleet',
      partnerNexg: 'Shirikiana na NEXG',
      onboardingActive: 'Inaendelea',
      onboardingStatus: 'Hali ya Usajili',
      stepText: 'Hatua',
      ofText: 'kati ya',
      nextStep: 'Hatua Inayofuata',
      prevStep: 'Iliyotangulia',
      submitApplication: 'Tuma Maombi',
      agreementTitle: 'Mkataba wa Huduma za Ushirika',
      agreementDesc: 'Tafadhali pitia masharti na uweke saini ya kidijitali hapa chini.',
      successTitle: 'Maombi Yametumwa Kikamilifu!',
      successDesc: 'Kamati yetu ya usajili wa washirika itapitia maombi yako na kuwasiliana nawe ndani ya saa 24.',
      returnHome: 'Rudi Kwenye Mwanzo wa Tovuti',
      downloadSummary: 'Pakua Muhtasari wa PDF',
      riderPortal: 'Tovuti ya Madereva',
      eastAfricaSecure: 'Afrika Mashariki • Usajili Salama',
      backToSite: 'Rudi Kwenye Tovuti',
      activeStatus: 'Inaendelea',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      explore: 'استكشف',
      restaurants: 'المأكولات الفاخرة',
      spa: 'السبا والعافية',
      spaDistrict: 'المنطقة الخاصة',
      transport: 'تنقل كبار الشخصيات',
      groceries: 'المشروبات والمؤن',
      experiences: 'تجارب حصرية',
      partners: 'الشركاء',
      forProperties: 'للفنادق والمنتجعات',
      forCouriers: 'انضم لأسطول النخبة',
      forMerchants: 'للمطاعم والمتاجر',
      partnerOnboarding: 'طلب انضمام الشركاء',
      applyFleet: 'انضم لأسطول النخبة',
      listBusiness: 'سجل نشاطك التجاري',
      track: 'تتبع الطلب',
      viewCart: 'حقيبة الكونسيرج',
      appearanceMode: 'وضع المظهر',
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي الهادئ',
      selectLanguage: 'اختر اللغة',
      menu: 'القائمة',
      close: 'إغلاق',
    },
    hero: {
      badge: 'كونسيرج الضيافة الفندقية الفاخرة',
      titleLine1: 'كل ما ترغب به،',
      titleLine2: 'في مكان إقامتك تماماً.',
      subtitle: 'اطلب أرقى أطباق الطهاة العالميين، احجز جلسات تدليك استرخائية في فيلتك، اطلب سيارات مايباخ مع سائق خاص، وتمتع بتوصيل فوري متميز مباشرة إلى باب جناحك أو مسبحك الخاص.',
      searchPlaceholder: 'ابحث عن نوبو، واغيو، سبا بالي، مايباخ، كافيار...',
      searchBtn: 'بحث',
      popular: 'الأكثر طلباً:',
      sugMichelin: 'أطباق ميشلان',
      sugMassage: 'مساج بالينيزي',
      sugMaybach: 'سائق مايباخ VIP',
      sugCaviar: 'كافيار ومشروبات نادرة',
      sugYacht: 'يخت خاص',
      btnFineDining: 'مطاعم فاخرة',
      btnSpa: 'السبا والاستجمام',
      btnMobility: 'تنقل كبار الشخصيات',
      ambienceDaylight: 'أجواء النهار المشرقة',
      ambienceTwilight: 'أجواء المساء الساحرة',
    },
    categories: {
      heading: 'فئات خدمات الكونسيرج المتاحة',
      subtitle: 'اختر أي فئة أدناه لتصفح خيارات تناول الطعام في الجناح، جلسات السبا، والسيارات الفاخرة.',
      groceriesTitle: 'المؤن والمشروبات',
      groceriesDesc: 'أرقى المشروبات والكافيار ومؤن الفيلا الطازجة',
      transportTitle: 'المواصلات الفاخرة',
      transportDesc: 'استقبال المطار بمايباخ، رولز رويس ومروحيات',
      spaTitle: 'السبا والاستجمام',
      spaDesc: 'تدليك بالينيزي داخل الفيلا وعناية بالبشرة',
      restaurantsTitle: 'المطاعم الراقية',
      restaurantsDesc: 'خدمة غرف مميزة من طهاة ميشلان العالميين',
      experiencesTitle: 'تجارب استثنائية',
      experiencesDesc: 'رحلات يخوت خاصة، جولات هليكوبتر وبولو',
      essentialsTitle: 'المستلزمات الفاخرة',
      essentialsDesc: 'عناية شخصية وصحة وترطيب فائق',
      viewAll: 'استكشف كافة الخدمات',
    },
    howItWorks: {
      badge: 'ضيافة سلسة ومطلقة',
      heading: 'كيف ترتقي NEXG بإقامتك الفاخرة',
      subtitle: 'تجربة كونسيرج راقية من 4 خطوات مصممة خصيصاً للفلل والأجنحة الملكية.',
      step1Title: 'امسح الرمز أو افتح الموقع',
      step1Desc: 'امسح رمز QR داخل الجناح أو افتح الموقع من أي جهاز دون الحاجة لتحميل تطبيقات.',
      step2Title: 'اختر طلبك المفضل',
      step2Desc: 'تصفح قوائم مطاعم ميشلان، المشروبات الفاخرة، جلسات السبا والسيارات التنفيذية.',
      step3Title: 'تحضير استثنائي بعناية',
      step3Desc: 'يقوم الشركاء بإعداد طلبك مع تحكم دقيق بدرجة الحرارة وتغليف فاخر بالقفازات البيضاء.',
      step4Title: 'توصيل لباب الفيلا مباشرة',
      step4Desc: 'يقوم أسطول النخبة بتسليم طلبك بسرعة إلى باب جناحك أو استراحة المسبح.',
    },
    promo: {
      badge: 'امتيازات النزلاء الحصرية',
      heading: 'توصيل كونسيرج مجاني على طلبك الأول',
      desc: 'تمتع بإعفاء كامل من رسوم التوصيل على جميع مطاعم ميشلان والمؤن الفاخرة باستخدام رقم غرفتك.',
      cta: 'استكشف المأكولات الآن',
      code: 'رمز الامتياز: VILLA2026',
      appHeading1: 'احمل NEXG',
      appHeading2: 'في كل مكان',
      appSubtitle: 'التطبيق الشامل المتكامل للنزلاء والمقيمين والمسافرين.',
      downloadOn: 'حمله من',
      appStore: 'App Store',
      getItOn: 'احصل عليه من',
      googlePlay: 'Google Play',
      merchantsTitle: 'للشركاء والتجار',
      merchantsDesc: 'نمّ أعمالك الفاخرة مع NEXG.',
      merchantsCta: 'كن شريكاً معنا',
      couriersTitle: 'للسائقين والمناديب',
      couriersDesc: 'قدّم التميز. انضم لأسطولنا الفاخر.',
      couriersCta: 'قدم طلبك الآن',
      propertiesTitle: 'للفنادق والمنتجعات',
      propertiesDesc: 'ارتقِ بتجربة ضيوفك الاستثنائية.',
      propertiesCta: 'سجل عقارك معنا',
    },
    features: {
      badge: 'التميز والموثوقية',
      heading: 'معايير الضيافة الفندقية العالمية',
      subtitle: 'لماذا تعتمد أفخم المنتجعات والقصور الخاصة والنزلاء المميزون على NEXG.',
      feat1Title: 'كونسيرج خاص على مدار الساعة 24/7',
      feat1Desc: 'دعم متعدد اللغات لتلبية التفضيلات الغذائية، الحجوزات الخاصة والتوصيل المجدول.',
      feat2Title: 'طهاة ميشلان ونخبة الشركاء',
      feat2Desc: 'ربط مباشر بأشهر معالم الضيافة وخبراء السبا المعتمدين دولياً.',
      feat3Title: 'أعلى درجات الخصوصية والأمان',
      feat3Desc: 'دفع مشفر على حساب الغرفة، توصيل آمن بدون تلامس وسرية تامة لبيانات النزلاء.',
      feat4Title: 'أسطول مجهز بحافظات حرارية ذكية',
      feat4Desc: 'مركبات فاخرة وصناديق حرارية متطورة تضمن وصول الأطباق والمشروبات في قمة جودتها.',
      f1Title: 'دفع آمن ومحمي',
      f1Desc: 'مشفر ومحمي بالكامل',
      f2Title: 'تتبع لحظي للطلب',
      f2Desc: 'اعرف موقعه بدقة',
      f3Title: 'خيارات دفع متعددة',
      f3Desc: 'بطاقات بنكية، M-Pesa والمزيد',
      f4Title: 'توصيل سري وفائق الخصوصية',
      f4Desc: 'خصوصية تامة مضمونة',
    },
    restaurants: {
      title: 'المطاعم الفاخرة وخدمة الغرف',
      subtitle: 'قوائم طعام منتقاة من أشهر المطابخ العالمية تُقدم ساخنة مباشرة إلى مائدتك.',
      searchPlaceholder: 'ابحث عن مطعم، سوشي، واغيو، باستا الكمأة...',
      filterAll: 'جميع المطابخ',
      filterJapanese: 'ياباني / أوماكاسي',
      filterItalian: 'إيطالي / باستا يدوية',
      filterFrench: 'فرنسي راقٍ',
      filterMediterranean: 'متوسطي',
      filterSteakhouse: 'ستيك هاوس ومشاوي',
      filterDesserts: 'حلويات فاخرة',
      viewMenu: 'عرض القائمة',
      minOrder: 'الحد الأدنى',
      deliveryTime: 'وقت التوصيل المتوقع',
      featuredDish: 'طبق الشيف المميز',
      addToBag: 'إضافة للحقيبة',
      closed: 'مغلق للتحضير',
      openNow: 'متاح للطلب الآن',
    },
    spa: {
      title: 'السبا والعافية في ملاذك الخاص',
      subtitle: 'حوّل فيلتك إلى واحة هادئة للاسترخاء مع أمهر أخصائيي التدليك والعناية بالعالم.',
      bookTreatment: 'حجز جلسة علاجية',
      duration: 'المدة',
      inVilla: 'داخل الفيلا / الجناح',
      sanctuary: 'جناح السبا بالمنتجع',
      therapistGender: 'تفضيل المعالج',
      anyTherapist: 'لا تفضيل محدد',
      femaleTherapist: 'أخصائية علاج',
      maleTherapist: 'أخصائي علاج',
      reserveNow: 'تأكيد الحجز فوراً',
    },
    transport: {
      title: 'تنقل كبار الشخصيات مع سائق خاص',
      subtitle: 'سيارات مايباخ، رينج روفر VIP، ومروحيات هليكوبتر جاهزة لنقلك فوراً.',
      chauffeurIncluded: 'يشمل سائقاً خاصاً بالقفازات البيضاء',
      perHour: '/ ساعة',
      airportTransfer: 'استقبال وتوديع المطار VIP',
      bookChauffeur: 'حجز سيارة',
      capacity: 'المقاعد',
      luggage: 'سعة الأمتعة',
      instantDispatch: 'إرسال فوري ذو أولوية',
    },
    groceries: {
      title: 'المشروبات الفاخرة ومؤن الفيلا',
      subtitle: 'كافيار بيلوغا الفاخر، مشروبات نادرة، أجبان فاخرة، ومخبوزات الصباح الطازجة.',
      cellar: 'المشروبات الفاخرة',
      pantry: 'مؤن الفيلا الراقية',
      caviar: 'الكافيار والمقبلات الملكية',
      bakery: 'مخبوزات الصباح الطازجة',
      addToCart: 'إضافة لقائمة الطلب',
      inStock: 'جاهز للتوصيل الفوري',
    },
    experiences: {
      title: 'تجارب كبار الشخصيات المصممة خصيصاً',
      subtitle: 'رحلات يخوت بحرية خاصة، جولات هليكوبتر في الأفق، تخييم صحراوي ملكي، ودروس بولو.',
      bookExperience: 'استفسار وحجز',
      groupSize: 'أقصى عدد للضيوف',
      duration: 'مدة التجربة',
      vipHostIncluded: 'مضيف كونسيرج خاص متواجد',
    },
    cart: {
      title: 'حقيبة طلبات الكونسيرج',
      emptyTitle: 'حقيبة الطلبات فارغة',
      emptyDesc: 'تصفح أشهى الأطباق، جلسات السبا، المشروبات الفاخرة أو السيارات الفارهة لبدء طلبك.',
      exploreBtn: 'استكشف الخدمات الفاخرة',
      subtotal: 'المجموع الفرعي',
      deliveryFee: 'رسوم التوصيل الفاخر',
      conciergeService: 'رسوم خدمة الكونسيرج (5%)',
      total: 'المبلغ الإجمالي',
      checkoutBtn: 'المتابعة لتفويض الدفع بالغرفة',
      villaPlaceholder: 'رقم الفيلا / الجناح / البنتهاوس',
      specialNotes: 'ملاحظات خاصة للشيف أو موعد التوصيل...',
      orderPlaced: 'تم تقديم طلبك بنجاح!',
      items: 'عناصر',
      clearCart: 'تفريغ الحقيبة',
    },
    tracking: {
      title: 'تتبع مسار الكونسيرج المباشر',
      orderNumber: 'رقم الطلب',
      estimatedArrival: 'الوقت المتوقع للوصول',
      mins: 'دقيقة',
      statusConfirmed: 'تم تأكيد الطلب من قبل الكونسيرج',
      statusPreparing: 'جارٍ التحضير بعناية فائقة',
      statusInTransit: 'المندوب في الطريق إلى فيلتك',
      statusDelivered: 'تم التسليم عند باب الفيلا',
      courierAssigned: 'مندوب التوصيل المخصص',
      contactConcierge: 'الاتصال بمكتب الكونسيرج',
      close: 'تصغير شاشة التتبع',
    },
    footer: {
      brandDesc: 'المنصة الرائدة لخدمات الكونسيرج والضيافة الفندقية الفاخرة. نربط منتجعات الخمس نجوم والفلل الخاصة والنزلاء المميزين بأرقى الطهاة وأخصائيي السبا وأساطيل التنقل الفارهة.',
      exploreTitle: 'خدمات الكونسيرج',
      partnersTitle: 'الشركات والشركاء',
      legalTitle: 'الضمان والخصوصية',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      cookies: 'إعدادات ملفات تعريف الارتباط',
      rightsReserved: 'جميع الحقوق محفوظة. NEXG كونسيرج الدولية.',
      language: 'اللغة / المنطقة',
      craftedWith: 'صُمم خصيصاً لضيافة فنادق الخمس نجوم الفاخرة',
      aboutText: 'الضيافة بأسلوب مبسط. نرتقي بتجربة التوصيل المنتقى والكونسيرج الخاص في كينيا.',
      verticals: 'خدماتنا',
      fineDining: 'المأكولات الفاخرة',
      spaWellness: 'السبا والعافية',
      vipMobility: 'تنقل كبار الشخصيات',
      gourmetCellar: 'المشروبات الفاخرة',
      experiences: 'تجارب استثنائية',
      partners: 'الشركاء',
      forMerchants: 'للشركاء والتجار',
      forCouriers: 'للسائقين',
      forProperties: 'للفنادق والمنتجعات',
      legalSupport: 'القانون والدعم',
      conciergeDesk: 'مكتب الكونسيرج',
      termsOfService: 'شروط الخدمة',
      privacyPolicy: 'سياسة الخصوصية',
      safetyStandards: 'معايير السلامة',
      connect: 'تواصل معنا',
      rights: '© 2026 NEXG كونسيرج. جميع الحقوق محفوظة.',
      simulatedNotice: 'عرض توضيحي لبوابة الدفع (في انتظار الربط المباشر)',
    },
    partnerHeaders: {
      ecosystem: 'المنظومة',
      qrTech: 'تقنية QR',
      revShareCalc: 'حاسبة الأرباح',
      integrations: 'التكامل التقني',
      benefits: 'المزايا',
      logistics: 'اللوجستيات',
      howItWorks: 'كيف نعمل',
      categories: 'الفئات',
      earningsCalc: 'حاسبة الدخل',
      fleetPerks: 'مزايا الأسطول',
      standards: 'المعايير',
      faq: 'الأسئلة الشائعة',
    },
    partnersPortal: {
      merchantTitle: 'شركاء الأعمال والمطاعم',
      merchantSubtitle: 'وسع نطاق أعمالك الفاخرة لتصل إلى نزلاء فلل الخمس نجوم والأجنحة الملكية.',
      courierTitle: 'أسطول النخبة',
      courierSubtitle: 'قدّم طلبات الكونسيرج الفاخرة واكسب أعلى العوائد والمكافآت السخية.',
      propertiesTitle: 'للفنادق والمنتجعات',
      propertiesSubtitle: 'منظومة ضيافة داخل الأجنحة بدون نفقات رأسمالية مع مشاركة فورية للأرباح.',
      backHome: 'العودة لكونسيرج الضيوف',
      listBusiness: 'سجل نشاطك التجاري',
      applyFleet: 'انضم لأسطول النخبة',
      partnerNexg: 'كن شريكاً مع NEXG',
      onboardingActive: 'نشط',
      onboardingStatus: 'حالة التسجيل',
      stepText: 'الخطوة',
      ofText: 'من',
      nextStep: 'الخطوة التالية',
      prevStep: 'السابق',
      submitApplication: 'إرسال طلب الانضمام',
      agreementTitle: 'اتفاقية شروط الشراكة',
      agreementDesc: 'يرجى مراجعة الشروط والأحكام والتوقيع الرقمي أدناه.',
      successTitle: 'تم إرسال طلب الانضمام بنجاح!',
      successDesc: 'ستقوم لجنة اعتماد الشركاء بمراجعة بياناتك والتواصل معك خلال 24 ساعة.',
      returnHome: 'العودة للرئيسية',
      downloadSummary: 'تحميل ملخص الطلب PDF',
      riderPortal: 'بوابة السائقين والمناديب',
      eastAfricaSecure: 'شرق أفريقيا • تسجيل آمن',
      backToSite: 'العودة للموقع',
      activeStatus: 'نشط',
    },
  },
};
