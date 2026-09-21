import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MerchantAdCarousel from './components/MerchantAdCarousel';
import ScrollToTop from './components/ScrollToTop';
import HowItWorks from './components/HowItWorks';
import Promo from './components/Promo';
import Features from './components/Features';
import Footer from './components/Footer';
import ForMerchants from './components/ForMerchants';
import MerchantOnboarding from './components/MerchantOnboarding';
import Restaurants from './components/Restaurants';
import Experiences from './components/Experiences';
import SpaWellness from './components/SpaWellness';
import TransportPage from './components/TransportPage';
import GroceriesPage from './components/GroceriesPage';
import ForProperties from './components/ForProperties';
import ForCouriers from './components/ForCouriers';
import CourierOnboarding from './components/CourierOnboarding';

// NexG Flow Components
import NexGLandingHero from './components/NexGLandingHero';
import NexGDiscoveryView from './components/NexGDiscoveryView';
import NexGCategoryDrilldown from './components/NexGCategoryDrilldown';
import { CATEGORIES_21, CatalogCategory } from './data/categoryCatalog21';
import DatabaseSqlModal from './components/DatabaseSqlModal';

// Customer Lifecycle & Cart Modals
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import DishCustomizerModal from './components/DishCustomizerModal';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutSimulatedModal from './components/CheckoutSimulatedModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import { NexGNavigationProvider, useNexGNavigation } from './components/nexg/NexGNavigationContext';
import { NexGItemSheet } from './components/nexg/NexGItemSheet';
import FloatingCartBar from './components/FloatingCartBar';
import { NexGMerchant } from './types/nexg';
import DiscoveryScreen from './components/discovery/DiscoveryScreen';
import { MerchantPreviewSheet } from './components/discovery/MerchantPreviewSheet';
import type { ApiItem, ApiMerchant } from './lib/apiClient';
import MerchantRoute from './components/merchant/MerchantRoute';

export type AppCurrentPage =
  | 'home'
  | 'merchants'
  | 'restaurants'
  | 'experiences'
  | 'spa'
  | 'transport'
  | 'groceries'
  | 'merchant_onboarding'
  | 'properties'
  | 'couriers'
  | 'courier_onboarding';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<AppCurrentPage>('home');
  const [nexgStage, setNexgStage] = useState<'none' | 'discovery' | 'drilldown'>('none');
  const [selectedNexGCategory, setSelectedNexGCategory] = useState<CatalogCategory>(
    CATEGORIES_21[0]
  );
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<NexGMerchant | null>(null);

  // v2 discovery flow.
  // `isDiscoveryOpen` renders the merchant discovery surface; `previewMerchant`
  // holds the merchant whose PREVIEW SHEET is open. They are separate on purpose:
  // opening a preview must never replace the browse surface (requirement R3).
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [discoveryQuery, setDiscoveryQuery] = useState('');
  const [previewMerchant, setPreviewMerchant] = useState<ApiMerchant | null>(null);
  // Set when the journey into the merchant page came from the sheet's workflow CTA.
  const [focusOfferings, setFocusOfferings] = useState(false);

  const {
    customizingDish,
    setCustomizingDish,
    selectedRestaurant,
    setSelectedRestaurant,
    addToCart,
  } = useCart();

  const { isLight } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, nexgStage]);

  // Prompt for location immediately on entering the site
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Location granted
        },
        (err) => {
          console.log('Location prompt notice:', err.message);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }
  }, []);

  const isPartnerOrOnboarding = [
    'merchants',
    'properties',
    'couriers',
    'merchant_onboarding',
    'courier_onboarding',
  ].includes(currentPage);

  /**
   * Open the discovery surface, optionally pre-filled with a query.
   *
   * This is the single browse entry point, reached from the hero search box, the
   * "Explore Categories" cards and the header's Explore action.
   *
   * v2 requirement R1: it ALWAYS opens merchant discovery, with or without a
   * query. An earlier pass routed an empty query to the taxonomy explorer, so
   * clicking the search bar produced a category list with no merchants, results
   * or filters.
   *
   * v1 fix retained: `setIsCategoryExplorerOpen(true)` originally existed nowhere
   * in the app, so every one of these entry points was entirely inert (D-10).
   */
  const handleOpenNexGWorkflow = (query = '') => {
    setDiscoveryQuery(query.trim());
    setIsDiscoveryOpen(true);
    setNexgStage('none');
  };

  /** Alias so the header call site reads as its intent. */
  const handleOpenDiscovery = (query = '') => handleOpenNexGWorkflow(query);

  /**
   * A merchant card was activated in discovery.
   *
   * Requirement R3: this opens the PREVIEW SHEET and must never navigate to the
   * merchant page. Navigation happens only from the sheet's explicit "view full"
   * action, handled by `handleViewFullMerchant`.
   */
  const handlePreviewMerchant = (merchant: ApiMerchant) => {
    setPreviewMerchant(merchant);
  };

  /**
   * Explicit, user-initiated navigation to the full merchant screen.
   *
   * This is now the ONLY path to the merchant page. The merchant is held by id so
   * the route can re-fetch the complete record, with the list copy passed as a
   * fallback so the page paints immediately instead of flashing a loader.
   */
  const handleViewFullMerchant = (merchant: ApiMerchant, focusOfferings = false) => {
    setPreviewMerchant(null);
    setFocusOfferings(focusOfferings);
    setSelectedMerchant(merchant);
  };

  /** An order line was confirmed inside the item modal. */
  const handleAddedToCart = ({ item, quantity }: { item: ApiItem; quantity: number }) => {
    addToCart({ id: item.id, name: item.name, price: item.price, quantity });
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setNexgStage('none');
    }
    setCurrentPage(page as AppCurrentPage);
  };

  return (
    <div
      className={`font-sans min-h-screen selection:bg-[#E5B65F] selection:text-black relative flex flex-col justify-between transition-colors duration-500 ${
        isLight ? 'bg-[#f7f8fa] text-[#1a1d20]' : 'bg-[#111315] text-[#f2f2f2]'
      }`}
    >
      {/* Global Docked Header. Hidden while the discovery surface is open, which
          brings its own header with the search field. */}
      {!isPartnerOrOnboarding && !isDiscoveryOpen && (currentPage !== 'home' || nexgStage === 'none') && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          // "Explore" in the header used to be a no-op: it called
          // onNavigate('home'), which on the home page changed nothing (D-17).
          onExplore={() => handleOpenDiscovery()}
        />
      )}

      {/* Main View Router.
          Precedence matters. The merchant page must be reachable FROM discovery,
          so it is tested first: when a merchant is selected we render it whatever
          else is open, and only then fall through to discovery or the site. */}
      <main className="flex-grow">
        {selectedMerchant ? (
          <MerchantRoute
            merchantId={selectedMerchant.id}
            fallback={selectedMerchant}
            onBack={() => setSelectedMerchant(null)}
            onAddedToCart={handleAddedToCart}
            focusOfferings={focusOfferings}
          />
        ) : isDiscoveryOpen ? (
          <DiscoveryScreen
            initialQuery={discoveryQuery}
            onBack={() => setIsDiscoveryOpen(false)}
            onOpenMerchant={handlePreviewMerchant}
          />
        ) : (
          <>
        {currentPage === 'home' && (
          <>
            {/* NEXG DISCOVERY DEFAULT STATE */}
            {nexgStage === 'none' && (
              <>
                <Hero 
                  onNavigate={handleNavigate} 
                  onOpenCategories={handleOpenNexGWorkflow}
                />
                <MerchantAdCarousel 
                  onNavigate={handleNavigate} 
                  onOpenCategories={() => handleOpenNexGWorkflow('')}
                />
                <HowItWorks />
                <Promo onNavigate={handleNavigate} />
                <Features />
              </>
            )}

            {/* NEXG DISCOVERY WORKFLOW (legacy static-data flow) */}
            {nexgStage === 'discovery' && (
              <NexGDiscoveryView
                onSelectCategory={(category) => {
                  setSelectedNexGCategory(category);
                  setNexgStage('drilldown');
                }}
                onOpenStore={(restaurant) => {
                  setSelectedRestaurant(restaurant);
                }}
                onSelectMerchant={(merchant) => {
                  setSelectedMerchant(merchant);
                }}
                onBackToLanding={() => {
                  setNexgStage('none');
                }}
                onOpenDatabaseViewer={() => {
                  setIsSqlModalOpen(true);
                }}
              />
            )}

            {/* NEXG CATEGORY DRILLDOWN */}
            {nexgStage === 'drilldown' && (
              <NexGCategoryDrilldown
                category={selectedNexGCategory}
                onBackToDiscovery={() => {
                  setNexgStage('discovery');
                }}
              />
            )}
          </>
        )}

        {currentPage === 'restaurants' && (
          <Restaurants onNavigate={handleNavigate} />
        )}

        {currentPage === 'spa' && (
          <SpaWellness onNavigate={handleNavigate} />
        )}

        {currentPage === 'transport' && (
          <TransportPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'groceries' && (
          <GroceriesPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'experiences' && (
          <Experiences onNavigate={handleNavigate} />
        )}

        {currentPage === 'merchants' && (
          <ForMerchants onNavigate={handleNavigate} />
        )}

        {currentPage === 'properties' && (
          <ForProperties onNavigate={handleNavigate} />
        )}

        {currentPage === 'couriers' && (
          <ForCouriers onNavigate={handleNavigate} />
        )}

        {currentPage === 'merchant_onboarding' && (
          <MerchantOnboarding onNavigate={handleNavigate} />
        )}

        {currentPage === 'courier_onboarding' && (
          <CourierOnboarding onNavigate={handleNavigate} />
        )}
          </>
        )}
      </main>

      {/* Unified Global Footer (present on original site and sub-pages).
          Hidden while discovery is open: discovery owns the full viewport. */}
      {!isPartnerOrOnboarding && !isDiscoveryOpen && (currentPage !== 'home' || nexgStage === 'none') && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Customer Lifecycle Modals & Drawers */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />

      {/* v2 merchant PREVIEW.
          Requirement R3: activating a merchant card opens this sheet and never
          navigates to the merchant screen. `onViewFull` is the only path to
          MerchantPage, and it is an explicit user action. */}
      <MerchantPreviewSheet
        merchant={previewMerchant}
        onClose={() => setPreviewMerchant(null)}
        onViewFull={(m) => handleViewFullMerchant(m, false)}
        onPrimaryAction={(m) => handleViewFullMerchant(m, true)}
      />

      <DishCustomizerModal
        dish={customizingDish}
        restaurantName={selectedRestaurant?.name}
        onClose={() => setCustomizingDish(null)}
      />

      <CartDrawer />
      <CheckoutSimulatedModal />
      <OrderTrackingModal />
      <FloatingCartBar />
      <NexGItemSheet />

      {/* PostgreSQL DB Schema & Seed Viewer Modal */}
      <DatabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Floating Scroll-To-Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <NexGNavigationProvider>
            <AppContent />
          </NexGNavigationProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
