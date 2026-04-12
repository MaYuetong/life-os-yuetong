import type { Section } from './sections'

/**
 * Priority Score Formula:
 *   Score = 0.4×deadline + 0.3×impact + 0.2×visa + 0.1×cost
 *
 * If `deadlineDate` is set, the deadline component is computed
 * dynamically from days remaining — so the score auto-increases
 * as the date approaches.
 *
 * Output: 0–10
 */

function daysUntil(iso: string): number {
  const target = new Date(iso)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function computeDeadlineScore(section: Section): number {
  if (section.deadlineDate) {
    const days = daysUntil(section.deadlineDate)
    if (days <= 0)  return 1.0   // overdue
    if (days <= 2)  return 1.0
    if (days <= 5)  return 0.97
    if (days <= 7)  return 0.93
    if (days <= 14) return 0.85
    if (days <= 21) return 0.75
    if (days <= 30) return 0.65
    if (days <= 60) return 0.5
    if (days <= 90) return 0.35
    return 0.2
  }
  return section.deadline
}

export function calculatePriority(section: Section): number {
  const deadlineScore = computeDeadlineScore(section)
  const raw =
    0.4 * deadlineScore +
    0.3 * section.impact +
    0.2 * section.visa +
    0.1 * section.cost
  return Math.round(raw * 100) / 10
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
  if (score >= 8.5) return { label: '🔥 紧急', color: 'text-red-400' }
  if (score >= 7.0) return { label: '⚡ 高优', color: 'text-orange-400' }
  if (score >= 5.5) return { label: '📌 中等', color: 'text-yellow-400' }
  return { label: '💤 缓行', color: 'text-slate-400' }
}

export function getPriorityBarColor(score: number): string {
  if (score >= 8.5) return 'bg-gradient-to-r from-red-500 to-rose-400'
  if (score >= 7.0) return 'bg-gradient-to-r from-orange-500 to-amber-400'
  if (score >= 5.5) return 'bg-gradient-to-r from-yellow-500 to-amber-300'
  return 'bg-gradient-to-r from-slate-500 to-slate-400'
}

/** All upcoming deadlines across all sections, sorted by date */
export function getAllDeadlines(sections: Section[]) {
  const now = new Date()
  const items: {
    sectionId: string
    sectionIcon: string
    sectionTitleCN: string
    sectionSlug: string
    gradient: string
    date: string
    label: string
    daysLeft: number
    urgent: boolean
  }[] = []

  for (const s of sections) {
    const allDates = [
      ...(s.deadlines ?? []),
      ...(s.deadlineDate ? [{ date: s.deadlineDate, label: s.tasks[0] ?? s.titleCN }] : []),
    ]

    // deduplicate by date+label
    const seen = new Set<string>()
    for (const d of allDates) {
      const key = `${d.date}::${d.label}`
      if (seen.has(key)) continue
      seen.add(key)
      const days = daysUntil(d.date)
      if (days > 180) continue  // skip far-future items
      items.push({
        sectionId: s.id,
        sectionIcon: s.icon,
        sectionTitleCN: s.titleCN,
        sectionSlug: s.slug,
        gradient: s.gradient,
        date: d.date,
        label: d.label,
        daysLeft: days,
        urgent: d.urgent ?? days <= 7,
      })
    }
  }

  return items.sort((a, b) => a.daysLeft - b.daysLeft)
}
