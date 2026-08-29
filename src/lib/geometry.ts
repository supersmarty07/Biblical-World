export function interpolateLine(
  coordinates: [number, number][],
  progress: number
): [number, number] {
  if (coordinates.length === 0) return [0, 0];
  if (coordinates.length === 1) return coordinates[0];

  const clamped = Math.max(0, Math.min(1, progress));
  const lengths: number[] = [];
  let total = 0;

  for (let i = 1; i < coordinates.length; i += 1) {
    const [x1, y1] = coordinates[i - 1];
    const [x2, y2] = coordinates[i];
    const length = Math.hypot(x2 - x1, y2 - y1);
    lengths.push(length);
    total += length;
  }

  if (total === 0) return coordinates[0];

  let target = total * clamped;
  for (let i = 0; i < lengths.length; i += 1) {
    if (target <= lengths[i]) {
      const t = lengths[i] === 0 ? 0 : target / lengths[i];
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[i + 1];
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }
    target -= lengths[i];
  }

  return coordinates[coordinates.length - 1];
}
