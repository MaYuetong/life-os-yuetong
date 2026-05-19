'use client'

import Link from 'next/link'
import { Globe, FolderOpen, FileText, ArrowUpRight } from 'lucide-react'
import type { Section } from '@/lib/sections'

const STATUS_DOT: Record<Section['status'], string> = {
  active:    'bg-green-500',
  pending:   'bg-amber-400',
  completed: 'bg-blue-400',
  blocked:   'bg-red-500',
}

const STATUS_LABEL: Record<Section['status'], string> = {
  active:    '进行中',
  pending:   '待启动',
  completed: '已完成',
  blocked:   '受阻',
}

export interface KanbanProjectSummary {
  total: number
  done: number
  running: number
  blocked: number
  todo: number
  progress: number
}

function openLocal(rel: string) {
  fetch(`/api/open?path=${encodeURIComponent(rel)}`).catch(() => null)
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

interface SectionCardProps {
  section: Section
  rank: number
  score: number
  kanban?: KanbanProjectSummary
}

export function SectionCard({ section, rank, score, kanban }: SectionCardProps) {
  const progress = kanban ? kanban.progress : section.progress

  return (
    <div className="group relative flex flex-col gap-4 p-5 border border-[rgb(var(--border))] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-150">
      {/* Full-card link */}
      <Link href={`/${section.slug}`} className="absolute inset-0 z-0" aria-label={section.titleCN} />

      {/* Top: index badge + name + score */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 border border-[rgb(var(--border))] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-mono font-bold text-[rgb(var(--text-2))] tabular-nums">
              {String(rank).padStart(2, '0')}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--text))] tracking-tight leading-snug">
              {section.titleCN}
            </h3>
            <p className="text-[10px] text-[rgb(var(--text-3))] mt-0.5 line-clamp-1">
              {section.description}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold tabular-nums text-[rgb(var(--text))] leading-none tracking-tight">
            {score.toFixed(1)}
          </p>
          <p className="section-label mt-1">/ 10</p>
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="section-label">Progress</span>
            {kanban && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-500 dark:text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tabular-nums text-[rgb(var(--text-2))]">
            {progress}%
          </span>
        </div>
        <div className="h-px bg-[rgb(var(--border))]">
          <div
            className="h-px bg-[rgb(var(--text))] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Kanban task breakdown */}
        {kanban && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
              ✓ {kanban.done}
            </span>
            {kanban.running > 0 && (
              <span className="text-[9px] text-blue-500 tabular-nums font-mono">
                ▶ {kanban.running}
              </span>
            )}
            {kanban.blocked > 0 && (
              <span className="text-[9px] text-red-500 tabular-nums font-mono">
                ✕ {kanban.blocked}
              </span>
            )}
            <span className="text-[9px] text-[rgb(var(--text-3))] tabular-nums font-mono">
              · {kanban.todo} 待办
            </span>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="relative z-10 space-y-1.5">
        {section.tasks.slice(0, 2).map((task, i) => (
          <div key={i} className="flex gap-2 text-xs text-[rgb(var(--text-2))] leading-snug">
            <span className="shrink-0 text-[rgb(var(--text-3))] mt-0.5">—</span>
            <span className="line-clamp-1">{task}</span>
          </div>
        ))}
        {section.tasks.length > 2 && (
          <p className="text-[10px] text-[rgb(var(--text-3))] pl-4">+{section.tasks.length - 2} 项</p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-center gap-2 pt-3 mt-auto border-t border-[rgb(var(--border))]">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[section.status]}`} />
        <span className="section-label">{STATUS_LABEL[section.status]}</span>

        <div className="ml-auto flex items-center gap-2.5">
          {section.liveUrl && (
            <a href={section.liveUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()} title="打开网站"
              className="text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] transition-colors">
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
          {section.vaultPath && (
            <button onClick={e => { e.preventDefault(); e.stopPropagation(); openLocal(section.vaultPath!) }}
              title="打开 Vault"
              className="text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] transition-colors">
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
          )}
          {section.readmePath && (
            <button onClick={e => { e.preventDefault(); e.stopPropagation(); openLocal(section.readmePath!) }}
              title="打开 README"
              className="text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] transition-colors">
              <FileText className="w-3.5 h-3.5" />
            </button>
          )}
          {section.lastUpdated && (
            <span className="text-[9px] text-[rgb(var(--text-3))] font-mono tabular-nums">
              {fmtDate(section.lastUpdated)}
            </span>
          )}
          <ArrowUpRight className="w-3.5 h-3.5 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
