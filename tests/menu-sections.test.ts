// tests/menu-sections.test.ts
//
// Covers the merchant menu grouping. The properties that matter are the ones a
// regression would break silently: every item must land in exactly one section, the
// placement must be stable across reloads, and small catalogues must not be carved
// into a rail longer than the menu it describes.

import { describe, it, expect } from 'vitest';
import { assignMenuSections, sectionNamesFor } from '../src/data/menuSections';

const item = (n: number) => ({ id: `M0001-I${String(n).padStart(4, '0')}`, name: `Item ${n}` });
const many = (count: number) => Array.from({ length: count }, (_, i) => item(i + 1));

describe('menu sections', () => {
  it('places every item in exactly one section', () => {
    const items = many(30);
    const sections = assignMenuSections(items, 'alcohol-beverages', 'Alcohol & Beverages');
    const placed = sections.flatMap((s) => s.items);
    expect(placed).toHaveLength(items.length);
    // No duplicates: a shared hash bucket must never emit an item twice.
    expect(new Set(placed.map((i) => i.id)).size).toBe(items.length);
  });

  it('is stable — the same item always lands in the same section', () => {
    const items = many(30);
    const first = assignMenuSections(items, 'alcohol-beverages', 'Alcohol & Beverages');
    // Same items in a different input order: section membership must not move.
    const shuffled = [...items].reverse();
    const second = assignMenuSections(shuffled, 'alcohol-beverages', 'Alcohol & Beverages');

    const sectionOf = (sections: ReturnType<typeof assignMenuSections>, id: string) =>
      sections.find((s) => s.items.some((i) => i.id === id))?.name;

    for (const i of items) {
      expect(sectionOf(second, i.id)).toBe(sectionOf(first, i.id));
    }
  });

  it('preserves the incoming order within a section', () => {
    const items = many(30);
    const sections = assignMenuSections(items, 'alcohol-beverages', 'Alcohol & Beverages');
    const originalIndex = new Map(items.map((i, idx) => [i.id, idx]));
    for (const section of sections) {
      const indices = section.items.map((i) => originalIndex.get(i.id) ?? -1);
      expect(indices).toEqual([...indices].sort((a, b) => a - b));
    }
  });

  it('does not split a small catalogue', () => {
    // Four or fewer would leave every section holding one card.
    const sections = assignMenuSections(many(4), 'wellness', 'Wellness');
    expect(sections).toHaveLength(1);
    expect(sections[0].items).toHaveLength(4);
  });

  it('returns nothing for an empty catalogue', () => {
    expect(assignMenuSections([], 'wellness', 'Wellness')).toEqual([]);
  });

  it('uses the section names written for the vertical', () => {
    expect(sectionNamesFor('wellness', 'Wellness')).toContain('Massage & Body');
    expect(sectionNamesFor('restaurants-food', 'Restaurants & Food')).toContain('Mains');
  });

  it('resolves a category-prefixed id as well as a bare slug', () => {
    // The API sends both shapes depending on the caller, and a missed lookup would
    // silently fall back to the generic menu.
    expect(sectionNamesFor('alcohol-beverages_wine', undefined)).toContain('Wines');
    expect(sectionNamesFor(undefined, 'Alcohol & Beverages')).toContain('Wines');
  });

  it('falls back to a generic menu for an unknown vertical', () => {
    const names = sectionNamesFor('brand-new-vertical', 'Brand New Vertical');
    expect(names.length).toBeGreaterThan(1);
    const sections = assignMenuSections(many(20), 'brand-new-vertical', 'Brand New Vertical');
    expect(sections.flatMap((s) => s.items)).toHaveLength(20);
  });
});
