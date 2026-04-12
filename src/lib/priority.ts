import type { Section } from './sections'

/**
 * Priority Score Formula:
 *   Score = 0.4×deadline + 0.3×impact + 0.2×visa + 0.1×cost
 *
 * All inputs are 0–1 normalized.
 * Output is 0–10 (multiplied by 10 for readability).
 */
export function calculatePriority(section: Section): number {
  const raw =
    0.4 * section.deadline +
    0.3 * section.impact +
    0.2 * section.visa +
    0.1 * section.cost

  return Math.round(raw * 100) / 10 // e.g., 0.87 → 8.7
}

export function sortByPriority(sections: Section[]): Section[] {
  return [...sections].sort(
    (a, b) => calculatePriority(b) - calculatePriority(a)
  )
}

export function getPriorityLabel(score: number): {
  label: string
  color: string
} {
  if (score >= 8.5) return { label: '🔥 紧急', color: 'text-red-500' }
  if (score >= 7.0) return { label: '⚡ 高优', color: 'text-orange-500' }
  if (score >= 5.5) return { label: '📌 中等', color: 'text-yellow-500' }
  return { label: '💤 缓行', color: 'text-slate-400' }
}

export function getPriorityBarColor(score: number): string {
  if (score >= 8.5) return 'bg-gradient-to-r from-red-500 to-rose-400'
  if (score >= 7.0) return 'bg-gradient-to-r from-orange-500 to-amber-400'
  if (score >= 5.5) return 'bg-gradient-to-r from-yellow-500 to-amber-300'
  return 'bg-gradient-to-r from-slate-400 to-slate-300'
}
