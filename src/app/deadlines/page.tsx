'use client'

import Link from 'next/link'
import { ArrowLeft, CalendarClock, Flame, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { sections } from '@/lib/sections'
import { getAllDeadlines } from '@/lib/priority'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

const TODAY_ISO = new Date().toISOString().split('T')[0]

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })
}

function UrgencyChip({ days }: { days: number }) {
  if (days < 0) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-400 font-medium">
      <AlertTriangle className="w-3 h-3" /> 已过期
    </span>
  )
  if (days === 0) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-400 font-medium">
      <Flame className="w-3 h-3" /> 今天
    </span>
  )
  if (days <= 3) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 font-medium">
      <Flame className="w-3 h-3" /> {days}天后
    </span>
  )
  if (days <= 7) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-500/10 text-orange-400 font-medium">
      <Clock className="w-3 h-3" /> {days}天后
    </span>
  )
  if (days <= 14) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400 font-medium">
      <Clock className="w-3 h-3" /> {days}天后
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 font-medium">
      <CheckCircle2 className="w-3 h-3" /> {days}天后
    </span>
  )
}

// Group deadlines by month
function groupByMonth(items: ReturnType<typeof getAllDeadlines>) {
  const groups: Record<string, typeof items> = {}
  for (const item of items) {
    const key = item.date.slice(0, 7) // '2026-04'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  return groups
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-')
  const d = new Date(Number(y), Number(m) - 1)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
}

export default function DeadlinesPage() {
  const allDeadlines = getAllDeadlines(sections)
  const grouped = groupByMonth(allDeadlines)
  const nearest = allDeadlines[0]

  const overdue  = allDeadlines.filter(d => d.daysLeft < 0).length
  const thisWeek = allDeadlines.filter(d => d.daysLeft >= 0 && d.daysLeft <= 7).length
  const total    = allDeadlines.length

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[rgb(var(--bg))]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <CalendarClock className="w-4 h-4 text-violet-400" />
          <h1 className="font-semibold text-[rgb(var(--text))] text-sm">截止日历</h1>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-8 space-y-7">

        {/* ── Stats row ── */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: '总计', value: total, color: 'text-[rgb(var(--text))]', bg: 'bg-white/[0.03]' },
            { label: '本周截止', value: thisWeek, color: 'text-orange-400', bg: 'bg-orange-500/[0.05]' },
            { label: '已过期', value: overdue, color: 'text-red-400', bg: 'bg-red-500/[0.05]' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={cn('rounded-2xl border border-white/[0.06] p-4 text-center', bg)}>
              <div className={cn('text-3xl font-bold tabular-nums', color)}>{value}</div>
              <div className="text-xs text-[rgb(var(--text-2))] mt-1">{label}</div>
            </div>
          ))}
        </section>

        {/* ── Nearest deadline spotlight ── */}
        {nearest && (
          <section className={cn(
            'relative rounded-2xl p-5 border overflow-hidden',
            nearest.daysLeft <= 3
              ? 'border-red-500/20 bg-red-500/[0.04]'
              : 'border-orange-500/15 bg-orange-500/[0.03]'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <Flame className={cn('w-4 h-4', nearest.daysLeft <= 3 ? 'text-red-400' : 'text-orange-400')} />
              <span className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider">
                最近截止
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{nearest.sectionIcon}</span>
                  <span className="font-semibold text-[rgb(var(--text))]">{nearest.sectionTitleCN}</span>
                </div>
                <p className="text-sm text-[rgb(var(--text-2))]">{nearest.label}</p>
              </div>
              <div className="text-right shrink-0">
                <div className={cn('text-2xl font-bold tabular-nums', nearest.daysLeft <= 3 ? 'text-red-400' : 'text-orange-400')}>
                  {nearest.daysLeft <= 0 ? '已过期' : `${nearest.daysLeft}天`}
                </div>
                <div className="text-xs text-[rgb(var(--text-2))] mt-0.5">{formatDate(nearest.date)}</div>
              </div>
            </div>
          </section>
        )}

        {/* ── Timeline by month ── */}
        {Object.entries(grouped).map(([ym, items]) => (
          <section key={ym}>
            <h2 className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-widest mb-3 flex items-center gap-2">
              <CalendarClock className="w-3.5 h-3.5 text-violet-400" />
              {monthLabel(ym)}
              <span className="text-[rgb(var(--text-2))] opacity-40 font-normal normal-case tracking-normal">
                · {items.length} 项
              </span>
            </h2>

            <div className="space-y-2">
              {items.map((item, i) => {
                const isPast = item.daysLeft < 0
                const isToday = item.date === TODAY_ISO
                const isUrgent = item.daysLeft >= 0 && item.daysLeft <= 3

                return (
                  <Link
                    key={`${item.sectionId}-${item.date}-${i}`}
                    href={`/${item.sectionSlug}`}
                    className={cn(
                      'group flex items-center gap-4 p-4 rounded-xl',
                      'border transition-all duration-200',
                      'hover:-translate-y-[1px] hover:shadow-lg',
                      isPast
                        ? 'border-white/[0.04] bg-white/[0.01] opacity-50'
                        : isUrgent
                          ? 'border-red-500/15 bg-red-500/[0.03] hover:border-red-500/25'
                          : 'border-white/[0.05] bg-white/[0.02] hover:border-white/[0.09]'
                    )}
                  >
                    {/* Date column */}
                    <div className="w-14 shrink-0 text-center">
                      <div className={cn(
                        'text-lg font-bold tabular-nums leading-none',
                        isPast ? 'text-[rgb(var(--text-2))]' : isUrgent ? 'text-red-400' : 'text-[rgb(var(--text))]'
                      )}>
                        {new Date(item.date).getDate()}
                      </div>
                      <div className="text-xs text-[rgb(var(--text-2))] opacity-60 mt-0.5">
                        {new Date(item.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                      </div>
                    </div>

                    {/* Divider dot */}
                    <div className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      isPast ? 'bg-white/10' : isUrgent ? 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]' : 'bg-violet-400'
                    )} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-base leading-none">{item.sectionIcon}</span>
                        <span className="text-xs text-[rgb(var(--text-2))] font-medium">{item.sectionTitleCN}</span>
                      </div>
                      <p className={cn(
                        'text-sm leading-snug',
                        isPast ? 'text-[rgb(var(--text-2))] line-through' : 'text-[rgb(var(--text))]'
                      )}>
                        {item.label}
                      </p>
                    </div>

                    {/* Urgency chip */}
                    <div className="shrink-0">
                      <UrgencyChip days={item.daysLeft} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}

        {allDeadlines.length === 0 && (
          <div className="text-center py-20 text-[rgb(var(--text-2))]">
            <CalendarClock className="w-10 h-10 opacity-20 mx-auto mb-3" />
            <p className="text-sm">暂无截止日期</p>
          </div>
        )}
      </div>
    </main>
  )
}
