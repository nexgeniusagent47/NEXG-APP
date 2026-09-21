import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CatalogCategory, CatalogMerchant, CatalogSubcategory, DynamicItem } from '../../data/categoryCatalog21';
import { CATEGORIES_21 } from '../../data/categoryCatalog21';

export type NexGDiscoveryStage =
  | 'home'
  | 'discovery'
  | 'category'
  | 'subcategory'
  | 'merchant'
  | 'collection'
  | 'search';

export type NexGNavigationSource =
  | 'home'
  | 'discovery'
  | 'category'
  | 'subcategory'
  | 'merchant'
  | 'collection'
  | 'search'
  | 'recommendation';

export interface NexGFilterState {
  sortBy: 'recommended' | 'rating' | 'delivery' | 'price_low' | 'price_high';
  rating45: boolean;
  fastDelivery: boolean;
  discountOnly: boolean;
  priceTier?: '$' | '$$' | '$$$' | '$$$$';
  duration?: string;
}

export interface NexGNavState {
  stage: NexGDiscoveryStage;
  activeCategory: CatalogCategory | null;
  activeSubcategory: CatalogSubcategory | null;
  activeMerchant: CatalogMerchant | null;
  activeItem: DynamicItem | null;
  activeCollectionId: string | null;
  source: NexGNavigationSource;
  searchQuery: string;
  filters: NexGFilterState;
  scrollPosition: number;
}

interface NexGNavigationContextType {
  state: NexGNavState;
  history: NexGNavState[];
  navigateToHome: () => void;
  navigateToCategory: (category: CatalogCategory, subcategory?: CatalogSubcategory | null, source?: NexGNavigationSource) => void;
  navigateToSubcategory: (subcategory: CatalogSubcategory) => void;
  navigateToMerchant: (merchant: CatalogMerchant, source?: NexGNavigationSource) => void;
  navigateToCollection: (collectionId: string) => void;
  openItemSheet: (item: DynamicItem, merchant?: CatalogMerchant | null, source?: NexGNavigationSource) => void;
  closeItemSheet: () => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<NexGFilterState>) => void;
  resetFilters: () => void;
  goBack: () => boolean; // returns true if backed, false if at root
  canGoBack: boolean;
}

const defaultFilters: NexGFilterState = {
  sortBy: 'recommended',
  rating45: false,
  fastDelivery: false,
  discountOnly: false,
};

const initialState: NexGNavState = {
  stage: 'home',
  activeCategory: null,
  activeSubcategory: null,
  activeMerchant: null,
  activeItem: null,
  activeCollectionId: null,
  source: 'home',
  searchQuery: '',
  filters: defaultFilters,
  scrollPosition: 0,
};

const NexGNavigationContext = createContext<NexGNavigationContextType | undefined>(undefined);

export const NexGNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NexGNavState>(initialState);
  const [history, setHistory] = useState<NexGNavState[]>([]);

  // Push new state while saving previous to history stack
  const pushState = useCallback((nextState: Partial<NexGNavState>) => {
    setState((prev) => {
      const currentScroll = typeof window !== 'undefined' ? window.scrollY : 0;
      const stateToSave: NexGNavState = { ...prev, scrollPosition: currentScroll };
      
      setHistory((hist) => [...hist, stateToSave]);
      
      return {
        ...prev,
        ...nextState,
        scrollPosition: 0,
      };
    });
  }, []);

  const navigateToHome = useCallback(() => {
    setHistory([]);
    setState(initialState);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const navigateToCategory = useCallback((category: CatalogCategory, subcategory?: CatalogSubcategory | null, source: NexGNavigationSource = 'home') => {
    pushState({
      stage: 'category',
      activeCategory: category,
      activeSubcategory: subcategory || null,
      activeMerchant: null,
      activeItem: null,
      source,
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pushState]);

  const navigateToSubcategory = useCallback((subcategory: CatalogSubcategory) => {
    pushState({
      stage: 'subcategory',
      activeSubcategory: subcategory,
      activeMerchant: null,
      activeItem: null,
    });
  }, [pushState]);

  const navigateToMerchant = useCallback((merchant: CatalogMerchant, source: NexGNavigationSource = 'category') => {
    pushState({
      stage: 'merchant',
      activeMerchant: merchant,
      activeItem: null,
      source,
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pushState]);

  const navigateToCollection = useCallback((collectionId: string) => {
    pushState({
      stage: 'collection',
      activeCollectionId: collectionId,
      activeMerchant: null,
      activeItem: null,
      source: 'home',
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pushState]);

  const openItemSheet = useCallback((item: DynamicItem, merchant?: CatalogMerchant | null, source: NexGNavigationSource = 'discovery') => {
    setState((prev) => ({
      ...prev,
      activeItem: item,
      activeMerchant: merchant || prev.activeMerchant,
      source: (source as any),
    }));
  }, []);

  const closeItemSheet = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeItem: null,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
      stage: query.trim().length > 0 && prev.stage === 'home' ? 'search' : prev.stage,
    }));
  }, []);

  const setFilters = useCallback((filtersPartial: Partial<NexGFilterState>) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filtersPartial,
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: defaultFilters,
    }));
  }, []);

  const goBack = useCallback(() => {
    // If item sheet is open, just close it first
    if (state.activeItem) {
      closeItemSheet();
      return true;
    }

    if (history.length === 0) {
      if (state.stage !== 'home') {
        navigateToHome();
        return true;
      }
      return false;
    }

    const previous = history[history.length - 1];
    setHistory((hist) => hist.slice(0, -1));
    setState(previous);

    // Restore scroll position
    if (typeof window !== 'undefined' && previous.scrollPosition) {
      setTimeout(() => {
        window.scrollTo({ top: previous.scrollPosition, behavior: 'smooth' });
      }, 50);
    }

    return true;
  }, [history, state.activeItem, closeItemSheet, navigateToHome]);

  const canGoBack = history.length > 0 || state.stage !== 'home' || state.activeItem !== null;

  const value = useMemo(
    () => ({
      state,
      history,
      navigateToHome,
      navigateToCategory,
      navigateToSubcategory,
      navigateToMerchant,
      navigateToCollection,
      openItemSheet,
      closeItemSheet,
      setSearchQuery,
      setFilters,
      resetFilters,
      goBack,
      canGoBack,
    }),
    [
      state,
      history,
      navigateToHome,
      navigateToCategory,
      navigateToSubcategory,
      navigateToMerchant,
      navigateToCollection,
      openItemSheet,
      closeItemSheet,
      setSearchQuery,
      setFilters,
      resetFilters,
      goBack,
      canGoBack,
    ]
  );

  return (
    <NexGNavigationContext.Provider value={value}>
      {children}
    </NexGNavigationContext.Provider>
  );
};

export const useNexGNavigation = () => {
  const context = useContext(NexGNavigationContext);
  if (!context) {
    throw new Error('useNexGNavigation must be used within a NexGNavigationProvider');
  }
  return context;
};
