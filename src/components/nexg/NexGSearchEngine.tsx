import React, { useMemo } from 'react';
import { Search, Sparkles, Building2, MapPin, Tag, Utensils, Compass, ArrowRight, Star } from 'lucide-react';
import { CATEGORIES_21, CatalogCategory, CatalogMerchant, DynamicItem, getCategoryMerchants } from '../../data/categoryCatalog21';
import { useTheme } from '../../context/ThemeContext';
import { useNexGNavigation } from './NexGNavigationContext';
import { NexGItemCard } from './NexGItemCard';
import { NexGEntityCard } from './NexGEntityCard';
import { NexGInfiniteFeed } from './NexGInfiniteFeed';
import { cn } from '../../lib/utils';

interface NexGSearchEngineProps {
  query: string;
}

export const NexGSearchEngine: React.FC<NexGSearchEngineProps> = ({ query }) => {
  const { isLight } = useTheme();
  const { navigateToCategory, navigateToMerchant, openItemSheet } = useNexGNavigation();

  const cleanQ = query.trim().toLowerCase();

  // Search matches across categories
  const matchedCategories = useMemo(() => {
    if (!cleanQ) return [];
    return CATEGORIES_21.filter(
      (c) =>
        c.name.toLowerCase().includes(cleanQ) ||
        c.description.toLowerCase().includes(cleanQ) ||
        c.subcategories.some((s) => s.name.toLowerCase().includes(cleanQ))
    ).slice(0, 4);
  }, [cleanQ]);

  // Search matches across all merchants
  const allMerchants = useMemo(() => {
    const list: CatalogMerchant[] = [];
    CATEGORIES_21.forEach((c) => {
      const merchants = getCategoryMerchants(c.id);
      list.push(...merchants);
    });
    return list;
  }, []);

  const matchedMerchants = useMemo(() => {
    if (!cleanQ) return [];
    return allMerchants.filter(
      (m) =>
        m.name.toLowerCase().includes(cleanQ) ||
        m.cuisineOrType.toLowerCase().includes(cleanQ) ||
        m.address.toLowerCase().includes(cleanQ) ||
        m.subcategoryName?.toLowerCase().includes(cleanQ)
    );
  }, [allMerchants, cleanQ]);

  // Search matches across dynamic items
  const matchedItems = useMemo(() => {
    if (!cleanQ) return [];
    const items: { item: DynamicItem; merchant: CatalogMerchant }[] = [];
    allMerchants.forEach((m) => {
      m.items.forEach((it) => {
        if (
          it.name.toLowerCase().includes(cleanQ) ||
          it.description.toLowerCase().includes(cleanQ) ||
          it.subcategory.toLowerCase().includes(cleanQ)
        ) {
          items.push({ item: it, merchant: m });
        }
      });
    });
    return items;
  }, [allMerchants, cleanQ]);

  if (!cleanQ) return null;

  const totalResults = matchedCategories.length + matchedMerchants.length + matchedItems.length;

  return (
    <div className="w-full space-y-8 py-4">
      {/* Search Header Stats */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-white/10">
        <div>
          <h2 className={cn('text-xl sm:text-2xl font-black tracking-tight', isLight ? 'text-slate-900' : 'text-white')}>
            Search Results for <span className="text-[#B88728] dark:text-[#E5B65F]">"{query}"</span>
          </h2>
          <p className={cn('text-xs mt-1', isLight ? 'text-slate-500' : 'text-gray-400')}>
            Found {totalResults} matching categories, merchants, and curated offerings
          </p>
        </div>
      </div>

      {totalResults === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-[#B88728] dark:text-[#E5B65F] mx-auto flex items-center justify-center">
            <Search size={22} />
          </div>
          <h3 className="font-bold text-base">No direct matches found</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Try searching for "Spa", "Japanese", "Safari", "Cellar", "Wagyu", or "Chauffeur".
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Matched Categories */}
          {matchedCategories.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <Tag size={13} />
                <span>Relevant Categories ({matchedCategories.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matchedCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => navigateToCategory(cat, null, 'search')}
                    className={cn(
                      'p-3.5 rounded-2xl border flex items-center gap-3 transition hover:shadow-md cursor-pointer select-none',
                      isLight
                        ? 'bg-white border-slate-200 hover:border-[#B88728]'
                        : 'bg-[#181A1F] border-white/10 hover:border-[#E5B65F]'
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/30 flex-shrink-0">
                      <img src={cat.bannerImage} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs truncate group-hover:text-[#B88728]">{cat.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate block">
                        {cat.subcategories.length} subcategories
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Merchants */}
          {matchedMerchants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <Building2 size={13} />
                <span>Merchants & Providers ({matchedMerchants.length})</span>
              </h3>
              <NexGInfiniteFeed<CatalogMerchant>
                items={matchedMerchants}
                batchSize={6}
                itemTypeLabel="merchants"
                renderItem={(m: CatalogMerchant) => (
                  <NexGEntityCard
                    key={m.id}
                    entity={{
                      id: m.id,
                      title: m.name,
                      subtitle: `${m.cuisineOrType} • ${m.address}`,
                      category: m.subcategoryName || 'Partner',
                      image: m.heroImage,
                      rating: m.rating,
                      reviewsCount: m.ratingCount,
                      deliveryTime: m.deliveryTime,
                      badges: m.badges,
                      onClick: () => navigateToMerchant(m, 'search'),
                    }}
                    variant="vertical"
                  />
                )}
              />
            </div>
          )}

          {/* Matched Individual Items */}
          {matchedItems.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Curated Offerings & Experiences ({matchedItems.length})</span>
              </h3>
              <NexGInfiniteFeed<{ item: DynamicItem; merchant: CatalogMerchant }>
                items={matchedItems}
                batchSize={8}
                itemTypeLabel="offerings"
                renderItem={({ item, merchant }) => (
                  <NexGItemCard
                    key={item.id}
                    item={item}
                    merchant={merchant}
                    onOpenDetail={() => openItemSheet(item, merchant, 'search')}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
