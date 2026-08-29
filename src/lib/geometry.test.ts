import { describe, expect, it } from 'vitest';
import { interpolateLine } from './geometry';

describe('interpolateLine', () => {
  it('returns endpoints and midpoint', () => {
    const line: [number, number][] = [[0, 0], [10, 0]];
    expect(interpolateLine(line, 0)).toEqual([0, 0]);
    expect(interpolateLine(line, 0.5)).toEqual([5, 0]);
    expect(interpolateLine(line, 1)).toEqual([10, 0]);
  });
});
