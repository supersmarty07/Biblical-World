export function formatHistoricalYear(year: number): string {
  if (year === 0) return 'BC/AD transition';
  if (year === 1) return 'AD 1';
  return year < 0 ? `${Math.abs(year)} BC` : `AD ${year}`;
}

export function isActiveAtYear(
  year: number,
  validFrom?: number,
  validTo?: number
): boolean {
  const afterStart = validFrom === undefined || year >= validFrom;
  const beforeEnd = validTo === undefined || year <= validTo;
  return afterStart && beforeEnd;
}
