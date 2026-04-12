import { NextRequest, NextResponse } from 'next/server'
import { sections } from '@/lib/sections'
import { calculatePriority, sortByPriority } from '@/lib/priority'

export async function GET() {
  const sorted = sortByPriority(sections).map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.titleCN,
    score: calculatePriority(s),
    status: s.status,
    progress: s.progress,
    topTask: s.tasks[0],
  }))

  return NextResponse.json({ sections: sorted })
}

/**
 * POST /api/priority — recalculate with custom weights
 * Body: { deadlineWeight, impactWeight, visaWeight, costWeight }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const {
    deadlineWeight = 0.4,
    impactWeight = 0.3,
    visaWeight = 0.2,
    costWeight = 0.1,
  } = body as {
    deadlineWeight?: number
    impactWeight?: number
    visaWeight?: number
    costWeight?: number
  }

  const scored = sections
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.titleCN,
      score: Math.round(
        (deadlineWeight * s.deadline +
          impactWeight * s.impact +
          visaWeight * s.visa +
          costWeight * s.cost) *
          100
      ) / 10,
      status: s.status,
      topTask: s.tasks[0],
    }))
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ sections: scored })
}
