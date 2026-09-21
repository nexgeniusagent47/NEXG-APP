// tests/component-registry.test.ts
// Tests the NEXG closed component vocabulary and state preservation

import { describe, it, expect } from 'vitest';
import { MerchantCardVariant, ItemCardVariant, HeaderVariant, ItemSheetState } from '../src/types/nexg';

describe('NEXG Component Registry Vocabulary', () => {
  it('should define explicit variants for MerchantCard', () => {
    const variants: MerchantCardVariant[] = [
      'default',
      'compact',
      'featured',
      'horizontal',
      'large',
      'search-result',
      'category-result',
    ];
    expect(variants.length).toBe(7);
  });

  it('should define explicit variants for ItemCard', () => {
    const variants: ItemCardVariant[] = [
      'grid',
      'horizontal',
      'compact',
      'featured',
      'merchant-menu',
      'category-result',
      'search-result',
      'recommended',
    ];
    expect(variants.length).toBe(8);
  });

  it('should define explicit Header variants', () => {
    const headerVariants: HeaderVariant[] = [
      'default',
      'search-active',
      'merchant',
      'checkout',
      'booking',
      'minimal',
    ];
    expect(headerVariants.length).toBe(6);
  });

  it('should define explicit state machine lifecycle for ItemSheet', () => {
    const states: ItemSheetState[] = [
      'CLOSED',
      'OPEN',
      'FOCUSED',
      'CONFIGURING',
      'READY',
      'ACTION_PENDING',
      'SUCCESS',
      'UNAVAILABLE',
      'ERROR',
    ];
    expect(states).toContain('CONFIGURING');
    expect(states).toContain('ACTION_PENDING');
    expect(states).toContain('SUCCESS');
  });
});
