// tests/experience-engine.test.ts
// Tests the NEXG Experience Engine (Build · Plan · Coordinate · Personalize)

import { describe, it, expect } from 'vitest';
import { NEXG_EXPERIENCE_REGISTRY } from '../src/data/experienceRegistry';

describe('NEXG Experience Engine Registry', () => {
  it('should declare first-class curated experiences with steps', () => {
    expect(NEXG_EXPERIENCE_REGISTRY.length).toBeGreaterThanOrEqual(5);

    const dateNight = NEXG_EXPERIENCE_REGISTRY.find((e) => e.id === 'date_night');
    expect(dateNight).toBeDefined();
    expect(dateNight?.name).toContain('Date Night');
    expect(dateNight?.steps.length).toBe(4);
    expect(dateNight?.steps[0].category).toBe('Restaurants & Food');
    expect(dateNight?.steps[2].category).toBe('Alcohol & Beverages');
    expect(dateNight?.steps[3].category).toBe('Airport Transfers');
  });

  it('should verify all experiences have valid budgets, vibe tags, and Nairobi areas', () => {
    NEXG_EXPERIENCE_REGISTRY.forEach((exp) => {
      expect(exp.id).toBeDefined();
      expect(exp.estimatedBudget).toBeGreaterThan(0);
      expect(exp.vibeTags.length).toBeGreaterThan(0);
      expect(exp.suggestedAreas.length).toBeGreaterThan(0);
      expect(exp.steps.length).toBeGreaterThanOrEqual(3);
    });
  });
});
