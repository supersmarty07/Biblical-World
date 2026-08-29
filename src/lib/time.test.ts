import { describe, expect, it } from 'vitest';
import { formatHistoricalYear, isActiveAtYear } from './time';

describe('historical time helpers', () => {
  it('formats BC and AD labels', () => {
    expect(formatHistoricalYear(-586)).toBe('586 BC');
    expect(formatHistoricalYear(0)).toBe('BC/AD transition');
    expect(formatHistoricalYear(1)).toBe('AD 1');
    expect(formatHistoricalYear(70)).toBe('AD 70');
  });

  it('filters temporal records inclusively', () => {
    expect(isActiveAtYear(-900, -1000, -800)).toBe(true);
    expect(isActiveAtYear(-700, -1000, -800)).toBe(false);
  });
});
