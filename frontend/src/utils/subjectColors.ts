export interface SubjectColor {
  color: string;
  dim: string;
  border: string;
}

const palette: SubjectColor[] = [
  { color: 'var(--teal)', dim: 'var(--teal-dim)', border: 'var(--teal-border)' },
  { color: 'var(--purple)', dim: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)' },
  { color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)' },
  { color: 'var(--red)', dim: 'var(--red-dim)', border: 'rgba(248,113,113,0.3)' },
  { color: 'var(--green)', dim: 'var(--green-dim)', border: 'rgba(52,211,153,0.3)' },
];

// Deterministic color by name hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getSubjectColor(name: string): SubjectColor {
  return palette[hashString(name) % palette.length];
}

export function getSubjectColorByIndex(index: number): SubjectColor {
  return palette[index % palette.length];
}
