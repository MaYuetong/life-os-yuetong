'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Globe,
  Camera,
  TrendingUp,
  Zap,
  LayoutGrid,
  Flame,
  CalendarClock,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SectionCard } from '@/components/SectionCard'
import { TopThree } from '@/components/TopThree'
import { sections } from '@/lib/sections'
import { calculatePriority, sortByPriority } from '@/lib/priority'
import { cn } from '@/lib/utils'

const TODAY = new Date().toLocaleDateString('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

type Filter = 'all' | 'active' | 'urgent'

export default function Dashboard() {
  const [filter, setFilter] = useState<Filter>('all')

  const sortedSections = useMemo(() => sortByPriority(sections), [])

  const filteredSections = useMemo(() => {
    if (filter === 'active') return sortedSections.filter((s) => s.status === 'active')
    if (filter === 'urgent') return sortedSections.filter((s) => calculatePriority(s) >= 7.5)
    return sortedSections
  }, [sortedSections, filter])

  const topThree = sortedSections.slice(0, 3)

  const stats = useMemo(() => {
    const avgProgress = Math.round(sections.reduce((s, x) => s + x.progress, 0) / sections.length)
    const activeSections = sections.filter((s) => s.status === 'active').length
    const urgentCount = sections.filter((s) => calculatePriority(s) >= 8).length
    return { avgProgress, activeSections, urgentCount }
  }, [])

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] bg-mesh dark:bg-mesh bg-mesh-light relative">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 dark:bg-violet-600/8 blur-3xl animate-glow" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-pink-600/8 dark:bg-pink-600/6 blur-3xl animate-glow delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/5 dark:bg-blue-600/4 blur-3xl" />
      </div>

      {/* ── Top Nav ── */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14',
        'border-b border-white/5 dark:border-white/[0.04]',
        'bg-[rgb(var(--bg))]/80 backdrop-blur-xl',
      )}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-full flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <span className="text-white font-bold text-xs">L</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-400 to-pink-400 opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm text-[rgb(var(--text))]">Life OS</span>
              <span className="text-xs text-[rgb(var(--text-2))] font-medium">v2.0</span>
            </div>
          </div>

          {/* Date pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] dark:bg-white/[0.04] border border-white/[0.06] text-xs text-[rgb(var(--text-2))]">
            {TODAY}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Quick nav */}
            {[
              { href: '/deadlines', icon: CalendarClock, label: '截止', color: 'text-orange-400' },
              { href: '/job', icon: Briefcase, label: '求职', color: 'text-violet-400' },
              { href: '/brand', icon: Globe, label: '品牌', color: 'text-purple-400' },
              { href: '/memories', icon: Camera, label: '回忆', color: 'text-sky-400' },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                  'text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]',
                  'bg-white/[0.03] hover:bg-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-white/[0.05]',
                  'border border-white/[0.06] hover:border-white/10',
                  'transition-all duration-200'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', color)} />
                {label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative pt-14">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 space-y-10">

          {/* ── Hero ── */}
          <section className="animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[rgb(var(--text))]">
                  你好，跃瞳 ✦
                </h1>
                <p className="mt-2 text-[rgb(var(--text-2))] text-sm md:text-base">
                  {TODAY} ·{' '}
                  <span className="text-violet-400 font-medium">{stats.urgentCount} 项</span>
                  {' '}紧急任务，
                  <span className="text-emerald-400 font-medium">{stats.activeSections} 个</span>
                  {' '}板块进行中
                </p>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-2 md:ml-auto">
                {[
                  { icon: TrendingUp, value: `${stats.avgProgress}%`, label: '平均进度', from: 'from-emerald-500', to: 'to-teal-400' },
                  { icon: LayoutGrid, value: `${stats.activeSections}`, label: '活跃板块', from: 'from-violet-500', to: 'to-purple-400' },
                  { icon: Flame, value: `${stats.urgentCount}`, label: '紧急任务', from: 'from-orange-500', to: 'to-rose-400' },
                ].map(({ icon: Icon, value, label, from, to }) => (
                  <div
                    key={label}
                    className={cn(
                      'flex items-center gap-2.5 px-4 py-2.5 rounded-xl',
                      'bg-white/[0.03] dark:bg-white/[0.02]',
                      'border border-white/[0.06]',
                      'backdrop-blur-sm'
                    )}
                  >
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br shrink-0', from, to)}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold leading-none text-[rgb(var(--text))]">{value}</div>
                      <div className="text-xs text-[rgb(var(--text-2))] mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Top 3 ── */}
          <section className="animate-fade-up delay-100">
            <TopThree sections={topThree} />
          </section>

          {/* ── Section grid ── */}
          <section className="animate-fade-up delay-200">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-semibold text-[rgb(var(--text))] uppercase tracking-widest">
                  9 大板块
                </h2>
                <span className="text-xs text-[rgb(var(--text-2))] ml-1 hidden md:inline">
                  · Score = 0.4×截止 + 0.3×影响 + 0.2×签证 + 0.1×成本
                </span>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                {([
                  { key: 'all', label: '全部', count: sections.length },
                  { key: 'active', label: '进行中' },
                  { key: 'urgent', label: '紧急' },
                ] as { key: Filter; label: string; count?: number }[]).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={cn(
                      'px-3 py-1 rounded-md text-xs font-medium transition-all duration-200',
                      filter === key
                        ? 'bg-violet-500/20 text-violet-300 shadow-sm'
                        : 'text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]'
                    )}
                  >
                    {label}
                    {count !== undefined && (
                      <span className="ml-1 opacity-50">{count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSections.map((section, i) => (
                <div
                  key={section.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${200 + i * 50}ms`, animationFillMode: 'both' }}
                >
                  <SectionCard
                    section={section}
                    rank={sortedSections.findIndex((s) => s.id === section.id) + 1}
                    score={calculatePriority(section)}
                  />
                </div>
              ))}
            </div>

            {filteredSections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-[rgb(var(--text-2))]">
                <Zap className="w-10 h-10 opacity-20 mb-3" />
                <p className="text-sm">暂无匹配板块</p>
              </div>
            )}
          </section>

          {/* ── Bottom quick links ── */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up delay-400 pb-6">
            {[
              { href: '/deadlines', icon: CalendarClock, label: '截止日历', sub: '全部截止日期', color: 'from-orange-500 to-amber-500' },
              { href: '/job', icon: Briefcase, label: '求职追踪台', sub: '投递记录 · 面试管理', color: 'from-violet-500 to-indigo-500' },
              { href: '/brand', icon: Globe, label: '个人品牌 CMS', sub: '网站编辑 · 实时预览', color: 'from-purple-500 to-pink-500' },
              { href: '/memories', icon: Camera, label: '摄影回忆', sub: '照片 · 旅行 · 时刻', color: 'from-sky-500 to-blue-500' },
            ].map(({ href, icon: Icon, label, sub, color }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group relative flex flex-col items-center gap-2 p-5 rounded-2xl overflow-hidden',
                  'bg-white/[0.02] dark:bg-white/[0.02]',
                  'border border-white/[0.06]',
                  'hover:border-white/10 transition-all duration-300',
                  'hover:-translate-y-1 hover:shadow-xl'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg shrink-0', color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-[rgb(var(--text))]">{label}</div>
                  <div className="text-xs text-[rgb(var(--text-2))] mt-0.5">{sub}</div>
                </div>
                {/* Hover glow */}
                <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br pointer-events-none rounded-2xl', color, 'opacity-0 group-hover:opacity-[0.04]')} />
              </Link>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
