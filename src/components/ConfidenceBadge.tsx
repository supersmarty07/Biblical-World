import type { ConfidenceLevel } from '../types/domain';

const labels: Record<ConfidenceLevel, string> = {
  established: 'Established',
  probable: 'Probable',
  possible: 'Possible',
  traditional: 'Traditional',
  disputed: 'Disputed',
  unknown: 'Unknown',
  symbolic: 'Visionary / symbolic'
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return <span className={`confidence confidence--${level}`}>{labels[level]}</span>;
}
