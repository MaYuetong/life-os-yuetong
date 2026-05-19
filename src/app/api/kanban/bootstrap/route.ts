import { NextResponse } from 'next/server'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import path from 'path'
import { sections } from '@/lib/sections'

export const dynamic = 'force-dynamic'

function dbPath(): string {
  return (
    process.env.HERMES_KANBAN_DB ||
    path.join(homedir(), '.hermes', 'kanban.db')
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  assignee TEXT,
  status TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  completed_at INTEGER,
  workspace_kind TEXT NOT NULL DEFAULT 'scratch',
  workspace_path TEXT,
  claim_lock TEXT,
  claim_expires INTEGER,
  tenant TEXT,
  result TEXT,
  idempotency_key TEXT UNIQUE,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  worker_pid INTEGER,
  last_failure_error TEXT,
  max_runtime_seconds INTEGER,
  last_heartbeat_at INTEGER,
  current_run_id INTEGER,
  workflow_template_id TEXT,
  current_step_key TEXT,
  skills TEXT,
  max_retries INTEGER
);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON tasks(assignee, status);
`

export async function POST() {
  const p = dbPath()

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const initSqlJs = require('sql.js')
  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(process.cwd(), 'node_modules/sql.js/dist', file),
  })

  let db: InstanceType<typeof SQL.Database>
  if (existsSync(p)) {
    db = new SQL.Database(readFileSync(p))
  } else {
    db = new SQL.Database()
  }

  // Ensure schema exists
  db.run(SCHEMA)

  let created = 0
  let skipped = 0
  const now = Math.floor(Date.now() / 1000)

  for (const section of sections) {
    const activeTasks = section.tasks ?? []
    const doneTasks = section.completedTasks ?? []

    for (const task of activeTasks) {
      const ikey = `${section.id}:${slugify(task)}`
      const id = `lifeos-${ikey}`
      try {
        db.run(
          `INSERT OR IGNORE INTO tasks
           (id, title, status, priority, tenant, created_by, created_at, idempotency_key, workspace_kind)
           VALUES (?, ?, 'todo', 0, ?, 'lifeos', ?, ?, 'scratch')`,
          [id, task, section.id, now, ikey]
        )
        const changes = db.exec('SELECT changes()')[0]?.values?.[0]?.[0] as number
        if (changes > 0) created++
        else skipped++
      } catch {
        skipped++
      }
    }

    for (const task of doneTasks) {
      const ikey = `${section.id}:done:${slugify(task)}`
      const id = `lifeos-${ikey}`
      try {
        db.run(
          `INSERT OR IGNORE INTO tasks
           (id, title, status, priority, tenant, created_by, created_at, completed_at, idempotency_key, workspace_kind)
           VALUES (?, ?, 'done', 0, ?, 'lifeos', ?, ?, ?, 'scratch')`,
          [id, task, section.id, now, now, ikey]
        )
        const changes = db.exec('SELECT changes()')[0]?.values?.[0]?.[0] as number
        if (changes > 0) created++
        else skipped++
      } catch {
        skipped++
      }
    }
  }

  // Write back to disk
  const data = db.export()
  writeFileSync(p, Buffer.from(data))
  db.close()

  return NextResponse.json({
    ok: true,
    created,
    skipped,
    dbPath: p,
    message: `Seeded ${created} tasks across ${sections.length} projects`,
  })
}
