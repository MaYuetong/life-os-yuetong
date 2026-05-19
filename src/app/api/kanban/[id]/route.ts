import { NextResponse } from 'next/server'
import { readKanbanTasks, isKanbanAvailable } from '@/lib/kanban'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!isKanbanAvailable()) {
    return NextResponse.json({ available: false, tasks: [] })
  }

  try {
    const tasks = await readKanbanTasks(id)
    return NextResponse.json({ available: true, tasks })
  } catch (err) {
    return NextResponse.json({ available: false, tasks: [], error: String(err) }, { status: 500 })
  }
}
