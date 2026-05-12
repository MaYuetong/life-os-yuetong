'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Briefcase, Globe, Camera, CalendarClock, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SectionCard } from '@/components/SectionCard'
import { TopThree } from '@/components/TopThree'
import TourBriefingWidget from '@/components/TourBriefingWidget'
import { sections } from '@/lib/sections'
import { calculatePriority, sortByPriority } from '@/lib/priority'

const TODAY = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

type Filter = 'all' | 'active' | 'urgent'

export default function Dashboard() {
  const [filter, setFilter] = useState<Filter>('all')

  const sortedSections = useMemo(() => sortByPriority(sections), [])

  const filteredSections = useMemo(() => {
    if (filter === 'active') return sortedSections.filter(s => s.status === 'active')
    if (filter === 'urgent') return sortedSections.filter(s => calculatePriority(s) >= 7.5)
    return sortedSections
  }, [sortedSections, filter])

  const topThree = sortedSections.slice(0, 3)

  const stats = useMemo(() => ({
    avgProgress: Math.round(sections.reduce((s, x) => s + x.progress, 0) / sections.length),
    activeSections: sections.filter(s => s.status === 'active').length,
    urgentCount: sections.filter(s => calculatePriority(s) >= 7.5).length,
  }), [])

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center gap-5">
          {/* Logo */}
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="font-bold text-sm text-[rgb(var(--text))] tracking-tight">Life OS</span>
            <span className="text-[10px] text-[rgb(var(--text-3))] font-medium">v2.0</span>
          </div>

          <div className="h-4 w-px bg-[rgb(var(--border))]" />

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-6 flex-1">
            {[
              { href: '/deadlines', label: '截止日历' },
              { href: '/job',       label: '求职' },
              { href: '/brand',     label: '品牌 CMS' },
              { href: '/memories',  label: '摄影' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">

          {/* ── Hero ── */}
          <section className="animate-fade-up">
            <p className="section-label mb-4">Personal Operating System · {TODAY}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[rgb(var(--text))] tracking-[-0.03em] leading-tight">
              你好，跃瞳
            </h1>
            <p className="mt-3 text-sm text-[rgb(var(--text-2))]">
              <span className="text-[rgb(var(--text))] font-semibold">{stats.urgentCount} 项</span>
              {' '}高优任务 ·{' '}
              <span className="text-[rgb(var(--text))] font-semibold">{stats.activeSections} 个</span>
              {' '}板块进行中
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 border border-[rgb(var(--border))] divide-x divide-[rgb(var(--border))] mt-8">
              {[
                { label: '平均进度', value: `${stats.avgProgress}%`, alert: false },
                { label: '活跃板块', value: `${stats.activeSections}`, alert: false },
                { label: '高优任务', value: `${stats.urgentCount}`, alert: stats.urgentCount > 0 },
              ].map(({ label, value, alert }) => (
                <div key={label} className="p-6 md:p-8">
                  <p className="section-label mb-3">{label}</p>
                  <p className={`text-4xl font-bold tabular-nums tracking-tight ${
                    alert ? 'text-red-600 dark:text-red-400' : 'text-[rgb(var(--text))]'
                  }`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Top 3 ── */}
          <section className="animate-fade-up delay-100">
            <TopThree sections={topThree} />
          </section>

          <hr className="border-[rgb(var(--border))]" />

          {/* ── Projects grid ── */}
          <section className="animate-fade-up delay-200">
            <div className="flex items-center justify-between mb-6">
              <p className="section-label">
                8 Projects &nbsp;·&nbsp; Score = 0.4×截止 + 0.3×影响 + 0.2×签证 + 0.1×机会成本
              </p>

              {/* Filter tabs */}
              <div className="flex items-center border border-[rgb(var(--border))] divide-x divide-[rgb(var(--border))]">
                {([
                  { key: 'all',    label: '全部' },
                  { key: 'active', label: '进行中' },
                  { key: 'urgent', label: '紧急' },
                ] as { key: Filter; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                      filter === key
                        ? 'bg-[rgb(var(--text))] text-[rgb(var(--bg))]'
                        : 'text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSections.map((section, i) => (
                <div
                  key={section.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${200 + i * 40}ms`, animationFillMode: 'both' }}
                >
                  <SectionCard
                    section={section}
                    rank={sortedSections.findIndex(s => s.id === section.id) + 1}
                    score={calculatePriority(section)}
                  />
                </div>
              ))}
            </div>

            {filteredSections.length === 0 && (
              <div className="border border-[rgb(var(--border))] p-16 text-center">
                <p className="text-sm text-[rgb(var(--text-3))]">暂无匹配项目</p>
              </div>
            )}
          </section>

          <hr className="border-[rgb(var(--border))]" />

          {/* ── Met Tour Briefing ── */}
          <section className="animate-fade-up delay-300">
            <TourBriefingWidget />
          </section>

          <hr className="border-[rgb(var(--border))]" />

          {/* ── Quick access ── */}
          <section className="animate-fade-up delay-300 pb-12">
            <p className="section-label mb-6">Quick Access</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/deadlines', icon: CalendarClock, label: '截止日历',   sub: '全部截止日期' },
                { href: '/job',       icon: Briefcase,     label: '求职追踪',   sub: '投递 · 面试管理' },
                { href: '/brand',     icon: Globe,         label: '个人品牌',   sub: '网站 · 简历 CMS' },
                { href: '/memories',  icon: Camera,        label: '摄影回忆',   sub: '照片 · 旅行' },
              ].map(({ href, icon: Icon, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col gap-4 p-5 border border-[rgb(var(--border))] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <Icon className="w-5 h-5 text-[rgb(var(--text-2))]" />
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--text))] tracking-tight">{label}</p>
                    <p className="text-xs text-[rgb(var(--text-3))] mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity mt-auto self-end" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
