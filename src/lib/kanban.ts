import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import path from 'path'

export type KanbanStatus =
  | 'triage' | 'todo' | 'ready' | 'running'
  | 'blocked' | 'done' | 'archived'

export interface KanbanTask {
  id: string
  title: string
  body: string | null
  status: KanbanStatus
  priority: number
  tenant: string | null
  created_at: number
  completed_at: number | null
}

export interface KanbanProjectSummary {
  total: number
  done: number
  running: number
  blocked: number
  todo: number    // triage + todo + ready combined
  progress: number  // 0–100
}

export type KanbanSummary = Record<string, KanbanProjectSummary>

function dbPath(): string {
  return (
    process.env.HERMES_KANBAN_DB ||
    path.join(homedir(), '.hermes', 'kanban.db')
  )
}

export function isKanbanAvailable(): boolean {
  return existsSync(dbPath())
}

export async function readKanbanSummary(): Promise<KanbanSummary | null> {
  const p = dbPath()
  if (!existsSync(p)) return null

  // sql.js is pure WASM — no native compilation needed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const initSqlJs = require('sql.js')
  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(process.cwd(), 'node_modules/sql.js/dist', file),
  })
  const buf = readFileSync(p)
  const db = new SQL.Database(buf)

  const rows: KanbanTask[] = []
  const res = db.exec(
    `SELECT id, title, body, status, priority, tenant, created_at, completed_at
     FROM tasks WHERE status != 'archived'`
  )

  if (res.length > 0) {
    const { columns, values } = res[0]
    for (const row of values) {
      const obj: Record<string, unknown> = {}
      columns.forEach((col: string, i: number) => { obj[col] = row[i] })
      rows.push(obj as unknown as KanbanTask)
    }
  }
  db.close()

  const summary: KanbanSummary = {}
  for (const task of rows) {
    const key = task.tenant ?? '__unassigned__'
    if (!summary[key]) {
      summary[key] = { total: 0, done: 0, running: 0, blocked: 0, todo: 0, progress: 0 }
    }
    const s = summary[key]
    s.total++
    if (task.status === 'done')    s.done++
    else if (task.status === 'running') s.running++
    else if (task.status === 'blocked') s.blocked++
    else                               s.todo++
  }

  for (const key of Object.keys(summary)) {
    const s = summary[key]
    s.progress = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0
  }

  return summary
}

export async function readKanbanTasks(tenant: string): Promise<KanbanTask[]> {
  const p = dbPath()
  if (!existsSync(p)) return []

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const initSqlJs = require('sql.js')
  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(process.cwd(), 'node_modules/sql.js/dist', file),
  })
  const buf = readFileSync(p)
  const db = new SQL.Database(buf)

  const rows: KanbanTask[] = []
  const res = db.exec(
    `SELECT id, title, body, status, priority, tenant, created_at, completed_at
     FROM tasks WHERE tenant = '${tenant.replace(/'/g, "''")}' AND status != 'archived'
     ORDER BY priority DESC, created_at ASC`
  )
  if (res.length > 0) {
    const { columns, values } = res[0]
    for (const row of values) {
      const obj: Record<string, unknown> = {}
      columns.forEach((col: string, i: number) => { obj[col] = row[i] })
      rows.push(obj as unknown as KanbanTask)
    }
  }
  db.close()
  return rows
}
