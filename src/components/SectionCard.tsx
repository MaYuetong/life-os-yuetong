'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculatePriority, getPriorityLabel } from '@/lib/priority'
import type { Section } from '@/lib/sections'

const STATUS_DOT: Record<Section['status'], string> = {
  active: 'bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.6)]',
  pending: 'bg-yellow-400 shadow-[0_0_6px_1px_rgba(251,191,36,0.5)]',
  completed: 'bg-blue-400 shadow-[0_0_6px_1px_rgba(96,165,250,0.5)]',
  blocked: 'bg-red-400 shadow-[0_0_6px_1px_rgba(248,113,113,0.5)]',
}

const STATUS_LABEL: Record<Section['status'], string> = {
  active: '进行中',
  pending: '待启动',
  completed: '已完成',
  blocked: '受阻',
}

interface SectionCardProps {
  section: Section
  rank: number
  score: number
}

export function SectionCard({ section, rank, score }: SectionCardProps) {
  const { label: priorityLabel } = getPriorityLabel(score)
  const pct = (score / 10) * 100
  // circumference for SVG circle (r=18 → 2π*18 ≈ 113)
  const CIRC = 113.1
  const dash = (pct / 100) * CIRC

  return (
    <Link
      href={`/${section.slug}`}
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl p-5 overflow-hidden',
        'bg-white/[0.025] dark:bg-white/[0.02]',
        'border border-white/[0.07] dark:border-white/[0.05]',
        'hover:border-white/[0.14] dark:hover:border-white/[0.1]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-[3px]',
        'hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)]',
        'dark:hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]',
        // Light mode
        'light:bg-white light:border-black/[0.06] light:hover:shadow-xl',
      )}
    >
      {/* Gradient blob on hover */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-to-br',
          section.cardGradient,
        )}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-3">
        {/* Icon */}
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0',
          'bg-gradient-to-br',
          section.cardGradient,
          'border border-white/10',
          'shadow-md',
        )}>
          {section.icon}
        </div>

        {/* Score ring */}
        <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
          <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
            {/* Track */}
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2.5"
            />
            {/* Progress */}
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="url(#scoreGrad)"
              strokeDasharray={`${dash} ${CIRC}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className={cn(
            'absolute text-xs font-bold tabular-nums',
            `bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`,
          )}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Title row */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[rgb(var(--text))] leading-tight">
            {section.titleCN}
          </h3>
          {/* Status dot */}
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOT[section.status])} />
        </div>
        <p className="text-xs text-[rgb(var(--text-2))] leading-relaxed">
          {section.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[rgb(var(--text-2))]">进度</span>
          <span className="text-xs font-medium text-[rgb(var(--text))] tabular-nums">{section.progress}%</span>
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', section.gradient)}
            style={{ width: `${section.progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="relative space-y-1.5">
        {section.tasks.slice(0, 2).map((task, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={cn('mt-1.5 w-1 h-1 rounded-full shrink-0 bg-gradient-to-r', section.gradient)} />
            <span className="text-xs text-[rgb(var(--text-2))] line-clamp-1 leading-relaxed">{task}</span>
          </div>
        ))}
        {section.tasks.length > 2 && (
          <p className="text-xs text-[rgb(var(--text-2))] opacity-50 pl-3">
            +{section.tasks.length - 2} 更多
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            'bg-white/[0.05] text-[rgb(var(--text-2))]',
            'border border-white/[0.06]',
          )}>
            #{rank} · {priorityLabel.replace(/^[^\s]+ /, '')}
          </span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            'bg-white/[0.05] text-[rgb(var(--text-2))]',
            'border border-white/[0.06]',
          )}>
            {STATUS_LABEL[section.status]}
          </span>
        </div>
        <ArrowUpRight className={cn(
          'w-4 h-4 text-[rgb(var(--text-2))] opacity-0 group-hover:opacity-100',
          'transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
          `group-hover:text-violet-400`,
        )} />
      </div>
    </Link>
  )
}
