import { NextResponse } from 'next/server'
import { readKanbanSummary, isKanbanAvailable } from '@/lib/kanban'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isKanbanAvailable()) {
    return NextResponse.json(
      { available: false, message: 'kanban.db not found — run `hermes setup` first' },
      { status: 200 }
    )
  }

  try {
    const summary = await readKanbanSummary()
    return NextResponse.json({ available: true, summary, lastSync: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json(
      { available: false, message: String(err) },
      { status: 500 }
    )
  }
}
