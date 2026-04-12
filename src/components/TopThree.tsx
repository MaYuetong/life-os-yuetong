'use client'

import Link from 'next/link'
import { ArrowUpRight, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calculatePriority } from '@/lib/priority'
import type { Section } from '@/lib/sections'

const RANK_CONFIG = [
  {
    bg: 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5',
    border: 'border-yellow-500/20 hover:border-yellow-400/40',
    glow: 'rgba(234,179,8,0.12)',
    badge: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black',
    ring: 'from-yellow-400 to-amber-400',
    rankLabel: '最高优先',
  },
  {
    bg: 'bg-gradient-to-br from-slate-500/8 to-slate-600/5',
    border: 'border-slate-500/15 hover:border-slate-400/30',
    glow: 'rgba(100,116,139,0.1)',
    badge: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
    ring: 'from-slate-300 to-slate-400',
    rankLabel: '次优先',
  },
  {
    bg: 'bg-gradient-to-br from-orange-500/8 to-rose-500/5',
    border: 'border-orange-500/15 hover:border-orange-400/30',
    glow: 'rgba(249,115,22,0.1)',
    badge: 'bg-gradient-to-br from-orange-400 to-rose-400 text-white',
    ring: 'from-orange-400 to-rose-400',
    rankLabel: '第三',
  },
]

interface TopThreeProps {
  sections: Section[]
}

export function TopThree({ sections }: TopThreeProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 shadow-md shadow-orange-500/30">
          <Flame className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="text-sm font-semibold text-[rgb(var(--text))] uppercase tracking-widest">
          今日 Top 3 聚焦
        </h2>
        <span className="ml-auto text-xs text-[rgb(var(--text-2))] opacity-60">
          由优先级算法排序
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sections.slice(0, 3).map((section, i) => {
          const cfg = RANK_CONFIG[i]
          const score = calculatePriority(section)
          const topTask = section.tasks[0]

          return (
            <Link
              key={section.id}
              href={`/${section.slug}`}
              style={{
                boxShadow: `0 4px 30px -8px ${cfg.glow}`,
              }}
              className={cn(
                'group relative flex items-center gap-3 p-4 rounded-2xl overflow-hidden',
                'border transition-all duration-300',
                cfg.bg, cfg.border,
                'hover:-translate-y-[2px]',
                'hover:shadow-xl',
              )}
            >
              {/* Rank badge */}
              <div className={cn(
                'flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold shrink-0 shadow-sm',
                cfg.badge,
              )}>
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base leading-none">{section.icon}</span>
                  <span className="text-sm font-semibold text-[rgb(var(--text))] truncate">
                    {section.titleCN}
                  </span>
                  {/* Score badge */}
                  <span className={cn(
                    'ml-auto shrink-0 text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-lg',
                    `bg-gradient-to-r ${cfg.ring} bg-clip-text text-transparent`,
                    'bg-white/[0.06] dark:bg-white/[0.04] border border-white/[0.08]',
                  )}>
                    {score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-[rgb(var(--text-2))] truncate leading-relaxed">
                  → {topTask}
                </p>
              </div>

              <ArrowUpRight className={cn(
                'w-4 h-4 shrink-0 text-[rgb(var(--text-2))] opacity-0 group-hover:opacity-100',
                'transition-all duration-200',
                'group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
              )} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
