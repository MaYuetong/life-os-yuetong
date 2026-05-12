'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { calculatePriority } from '@/lib/priority'
import type { Section } from '@/lib/sections'

interface TopThreeProps {
  sections: Section[]
}

export function TopThree({ sections }: TopThreeProps) {
  return (
    <div>
      <p className="section-label mb-5">Today&apos;s Focus</p>
      <div className="border border-[rgb(var(--border))] divide-y divide-[rgb(var(--border))]">
        {sections.slice(0, 3).map((section, i) => {
          const score = calculatePriority(section)
          return (
            <Link
              key={section.id}
              href={`/${section.slug}`}
              className="group flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              {/* Rank */}
              <span className="text-[11px] font-mono font-bold tabular-nums text-[rgb(var(--text-3))] w-5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Name + top task */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[rgb(var(--text))] tracking-tight">
                  {section.titleCN}
                </p>
                <p className="text-xs text-[rgb(var(--text-2))] truncate mt-0.5">
                  {section.tasks[0]}
                </p>
              </div>

              {/* Score */}
              <span className="text-sm font-bold tabular-nums text-[rgb(var(--text))] shrink-0 tracking-tight">
                {score.toFixed(1)}
              </span>

              {/* Arrow */}
              <ArrowUpRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
