import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MerchantAdCarousel from './components/MerchantAdCarousel';
import CategoryExplorerModal from './components/CategoryExplorerModal';
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
import { MerchantPage } from './components/nexg/MerchantPage';
import { NexGMerchant } from './types/nexg';

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
  const [isCategoryExplorerOpen, setIsCategoryExplorerOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<NexGMerchant | null>(null);

  const {
    customizingDish,
    setCustomizingDish,
    selectedRestaurant,
    setSelectedRestaurant,
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

  // Triggered when search bar or categories are clicked
  const handleOpenNexGWorkflow = (query?: string) => {
    if (query) {
      const q = query.toLowerCase();
      const matched = CATEGORIES_21.find(
        (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
      if (matched) {
        setSelectedNexGCategory(matched);
        setNexgStage('drilldown');
        return;
      }
    }
    setNexgStage('discovery');
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
      {/* Global Docked Header */}
      {!isPartnerOrOnboarding && (currentPage !== 'home' || nexgStage === 'none') && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Main View Router */}
      <main className="flex-grow">
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

            {/* SELECTED MERCHANT DETAIL PAGE */}
            {selectedMerchant ? (
              <MerchantPage
                merchant={selectedMerchant}
                onBack={() => setSelectedMerchant(null)}
                onSelectItem={(item, m) => {
                  setCustomizingDish({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    rating: item.rating || m.rating,
                    popular: true,
                  } as any);
                }}
              />
            ) : (
              <>
                {/* NEXG DISCOVERY WORKFLOW */}
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
      </main>

      {/* Unified Global Footer (present on original site and sub-pages) */}
      {!isPartnerOrOnboarding && (currentPage !== 'home' || nexgStage === 'none') && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Customer Lifecycle Modals & Drawers */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
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

      {/* 21 Categories & 134 Subcategories Merchant Hierarchy Modal */}
      <CategoryExplorerModal
        isOpen={isCategoryExplorerOpen}
        initialQuery={categorySearchQuery}
        onClose={() => setIsCategoryExplorerOpen(false)}
        onNavigate={(page) => {
          setIsCategoryExplorerOpen(false);
          if (page === 'restaurants' || page === 'groceries' || page === 'spa' || page === 'transport') {
            const foundCat = CATEGORIES_21.find((c) => c.slug === page);
            if (foundCat) {
              setSelectedNexGCategory(foundCat);
              setNexgStage('drilldown');
            } else {
              setCurrentPage(page as AppCurrentPage);
            }
          } else {
            setCurrentPage(page as AppCurrentPage);
          }
        }}
      />

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
