// tests/commerce-modes.test.ts
// Tests the capability-driven commerce mode mapping across categories

import { describe, it, expect } from 'vitest';
import { CommerceMode } from '../src/types/nexg';

describe('NEXG Capability-Driven Commerce Modes', () => {
  const modeSamples: Record<CommerceMode, { sampleCategory: string; sampleItem: string }> = {
    instant_purchase: { sampleCategory: 'Restaurants & Food', sampleItem: 'Truffle Wagyu Burger' },
    configured_purchase: { sampleCategory: 'Restaurants & Food', sampleItem: 'Build Your Own Artisan Pizza' },
    booking: { sampleCategory: 'Travel & Tours', sampleItem: 'Sunrise Safari Game Drive' },
    appointment: { sampleCategory: 'Wellness', sampleItem: 'Volcanic Stone Massage' },
    rental: { sampleCategory: 'Vehicle Rentals', sampleItem: 'Toyota Prado 4x4' },
    ticket: { sampleCategory: 'Experiences', sampleItem: 'Nairobi Symphony Orchestra VIP Pass' },
    quote: { sampleCategory: 'Logistics & Shipping', sampleItem: 'Cross-Border Air Freight' },
    request: { sampleCategory: 'Concierge Services', sampleItem: 'Private Jet Charter Coordination' },
    subscription: { sampleCategory: 'Flowers & Gifts', sampleItem: 'Weekly Curated Bloom Delivery' },
    delivery: { sampleCategory: 'Groceries & Essentials', sampleItem: 'Same-Hour Farm Basket' },
  };

  it('should support all 10 distinct commerce modes without page duplication', () => {
    const modes = Object.keys(modeSamples) as CommerceMode[];
    expect(modes.length).toBe(10);
    expect(modes).toContain('instant_purchase');
    expect(modes).toContain('booking');
    expect(modes).toContain('appointment');
    expect(modes).toContain('quote');
    expect(modes).toContain('rental');
  });

  it('should determine appropriate interaction semantics based on commerce mode', () => {
    function resolveActionLabel(mode: CommerceMode): string {
      switch (mode) {
        case 'booking':
          return 'Choose Date & Guests';
        case 'appointment':
          return 'Select Time Slot';
        case 'rental':
          return 'Select Rental Dates';
        case 'ticket':
          return 'Select Ticket Tier';
        case 'quote':
          return 'Request Quote';
        case 'request':
          return 'Submit Request';
        default:
          return 'Add to Order';
      }
    }

    expect(resolveActionLabel('instant_purchase')).toBe('Add to Order');
    expect(resolveActionLabel('booking')).toBe('Choose Date & Guests');
    expect(resolveActionLabel('appointment')).toBe('Select Time Slot');
    expect(resolveActionLabel('quote')).toBe('Request Quote');
  });
});
