'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Play, AlertCircle, Loader2 } from 'lucide-react'

interface KanbanTask {
  id: string
  title: string
  status: 'triage' | 'todo' | 'ready' | 'running' | 'blocked' | 'done' | 'archived'
  priority: number
}

const STATUS_ORDER = ['running', 'blocked', 'triage', 'todo', 'ready', 'done']

const STATUS_STYLE: Record<string, { icon: React.ReactNode; label: string; text: string }> = {
  running: {
    icon: <Play className="w-3 h-3" />,
    label: '进行中',
    text: 'text-blue-500',
  },
  blocked: {
    icon: <AlertCircle className="w-3 h-3" />,
    label: '受阻',
    text: 'text-red-500',
  },
  done: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    label: '完成',
    text: 'text-[rgb(var(--text-3))]',
  },
  triage:  { icon: <Circle className="w-3 h-3" />, label: '待分配', text: 'text-[rgb(var(--text-2))]' },
  todo:    { icon: <Circle className="w-3 h-3" />, label: '待办',   text: 'text-[rgb(var(--text-2))]' },
  ready:   { icon: <Circle className="w-3 h-3" />, label: '就绪',   text: 'text-[rgb(var(--text-2))]' },
}

interface Props {
  sectionId: string
  staticProgress: number
  staticTasks: string[]
  staticDone: string[]
}

export function LiveKanbanPanel({ sectionId, staticProgress, staticTasks, staticDone }: Props) {
  const [tasks, setTasks] = useState<KanbanTask[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/kanban/${sectionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.available && data.tasks.length > 0) setTasks(data.tasks)
      })
      .finally(() => setLoading(false))
  }, [sectionId])

  // ── Loading ──
  if (loading) {
    return (
      <div className="border border-[rgb(var(--border))] p-6 flex items-center gap-2 text-[rgb(var(--text-3))]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="text-xs">连接 Hermes…</span>
      </div>
    )
  }

  // ── Kanban offline — show static data ──
  if (!tasks) {
    return (
      <div className="border border-[rgb(var(--border))] p-6">
        <p className="section-label mb-5">待办任务</p>
        <ol className="space-y-3">
          {staticTasks.map((task, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-[10px] font-mono font-bold tabular-nums text-[rgb(var(--text-3))] w-4 shrink-0 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm text-[rgb(var(--text-2))] leading-snug">{task}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  // ── Live kanban data ──
  const sorted = [...tasks].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
  )
  const done = tasks.filter(t => t.status === 'done').length
  const total = tasks.length
  const progress = total > 0 ? Math.round((done / total) * 100) : staticProgress

  return (
    <div className="space-y-4">
      {/* Live progress */}
      <div className="border border-[rgb(var(--border))] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="section-label">Hermes Kanban</p>
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-500">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <span className="text-xs font-semibold tabular-nums text-[rgb(var(--text-2))]">
            {done} / {total} 完成
          </span>
        </div>
        <div className="h-px bg-[rgb(var(--border))]">
          <div
            className="h-px bg-[rgb(var(--text))] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Status summary chips */}
        <div className="flex flex-wrap gap-3 mt-3">
          {(['running', 'blocked', 'todo', 'done'] as const).map(s => {
            const count = tasks.filter(t =>
              s === 'todo' ? ['triage','todo','ready'].includes(t.status) : t.status === s
            ).length
            if (count === 0) return null
            const style = STATUS_STYLE[s]
            return (
              <span key={s} className={`flex items-center gap-1 text-[10px] font-mono ${style.text}`}>
                {style.icon} {count} {style.label}
              </span>
            )
          })}
        </div>
      </div>

      {/* Task list */}
      <div className="border border-[rgb(var(--border))] p-6">
        <p className="section-label mb-5">任务列表</p>
        <ul className="space-y-2.5">
          {sorted.map(task => {
            const style = STATUS_STYLE[task.status] ?? STATUS_STYLE.todo
            const isDone = task.status === 'done'
            return (
              <li key={task.id} className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 ${style.text}`}>{style.icon}</span>
                <span className={`text-sm leading-snug ${
                  isDone
                    ? 'text-[rgb(var(--text-3))] line-through'
                    : 'text-[rgb(var(--text-2))]'
                }`}>
                  {task.title}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
