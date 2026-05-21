'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ExternalLink, ArrowRight, BookOpen, Briefcase } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { sections } from '@/lib/sections'
import { CATEGORIES } from '@/lib/categories'
import { calculatePriority, sortByPriority } from '@/lib/priority'
import type { FeedItem, FeedItemType } from '@/app/api/feed/route'

const TODAY = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
})

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60000)    return '刚刚'
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

const FEED_DOT: Record<FeedItemType, string> = {
  win: 'bg-emerald-500', news: 'bg-blue-500',
  task: 'bg-amber-500',  update: 'bg-purple-500',
}

export default function Dashboard() {
  const [feed, setFeed] = useState<FeedItem[]>([])

  useEffect(() => {
    fetch('/api/feed').then(r => r.json()).then(d => setFeed(d.items ?? [])).catch(() => null)
  }, [])

  const sortedSections = useMemo(() => sortByPriority(sections), [])

  const stats = useMemo(() => ({
    avgProgress: Math.round(sections.reduce((s, x) => s + x.progress, 0) / sections.length),
    activeSections: sections.filter(s => s.status === 'active').length,
    urgentCount: sections.filter(s => calculatePriority(s) >= 7.5).length,
  }), [])

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-full flex items-center gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm text-[rgb(var(--text))] tracking-tight">Life OS</span>
            <span className="text-[10px] text-[rgb(var(--text-3))] font-medium">v3.0</span>
          </div>
          <div className="h-4 w-px bg-[rgb(var(--border))]" />
          <span className="text-xs text-[rgb(var(--text-3))] hidden sm:block">{TODAY}</span>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/add" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgb(var(--text))] text-[rgb(var(--bg))] text-xs font-semibold hover:opacity-80 transition-opacity">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">添加动态</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-12 pb-20">

          {/* ── Hero ── */}
          <section>
            <p className="section-label mb-3">Personal Operating System</p>
            <h1 className="text-3xl md:text-5xl font-bold text-[rgb(var(--text))] tracking-[-0.03em]">
              你好，跃瞳 👋
            </h1>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--text))]">{stats.avgProgress}%</p>
                <p className="section-label mt-0.5">平均进度</p>
              </div>
              <div className="w-px bg-[rgb(var(--border))]" />
              <div>
                <p className="text-2xl font-bold text-[rgb(var(--text))]">{stats.activeSections}</p>
                <p className="section-label mt-0.5">活跃板块</p>
              </div>
              <div className="w-px bg-[rgb(var(--border))]" />
              <div>
                <p className={`text-2xl font-bold ${stats.urgentCount > 0 ? 'text-red-500' : 'text-[rgb(var(--text))]'}`}>
                  {stats.urgentCount}
                </p>
                <p className="section-label mt-0.5">高优任务</p>
              </div>
            </div>
          </section>

          {/* ── 4 Category Cards ── */}
          <section>
            <p className="section-label mb-4">四大领域</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map(cat => {
                const catSections = sections.filter(s => cat.business.sectionIds.includes(s.id))
                const topSection = sortedSections.find(s => cat.business.sectionIds.includes(s.id))
                const avgProg = catSections.length
                  ? Math.round(catSections.reduce((s, x) => s + x.progress, 0) / catSections.length)
                  : 0
                const catFeed = feed.filter(f => catSections.some(s => s.id === f.sectionId)).slice(0, 1)

                return (
                  <Link
                    key={cat.id}
                    href={`/${cat.id}`}
                    className="group relative border border-[rgb(var(--border))] p-6 hover:border-[rgb(var(--text-3))] transition-all overflow-hidden"
                  >
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient} opacity-60`} />

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-2xl mb-1">{cat.icon}</p>
                        <h2 className="text-lg font-bold text-[rgb(var(--text))] tracking-tight">{cat.label}</h2>
                        <p className="text-xs text-[rgb(var(--text-3))]">{cat.labelEN}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold tabular-nums text-[rgb(var(--text))]">{avgProg}%</p>
                        <p className="section-label">平均进度</p>
                      </div>
                    </div>

                    <p className="text-xs text-[rgb(var(--text-2))] mb-4 leading-relaxed">{cat.description}</p>

                    {/* Sub-items */}
                    <div className="space-y-1.5 mb-4">
                      {/* Business */}
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3 h-3 text-[rgb(var(--text-3))] shrink-0" />
                        <span className="text-[10px] text-[rgb(var(--text-3))]">
                          {catSections.length} 个项目
                          {topSection && (
                            <span className="ml-1 text-[rgb(var(--text-2))]">
                              · 最高优: {topSection.titleCN}
                            </span>
                          )}
                        </span>
                      </div>
                      {/* Learning */}
                      {cat.learning && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3 h-3 text-[rgb(var(--text-3))] shrink-0" />
                          <span className="text-[10px] text-[rgb(var(--text-2))]">{cat.learning.label}</span>
                        </div>
                      )}
                      {/* Recent feed item */}
                      {catFeed[0] && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${FEED_DOT[catFeed[0].type]}`} />
                          <span className="text-[10px] text-[rgb(var(--text-2))] truncate">{catFeed[0].text}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {catSections.slice(0, 4).map(s => (
                          <span key={s.id} className="text-sm" title={s.titleCN}>{s.icon}</span>
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* ── Recent Feed ── */}
          {feed.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="section-label">最近动态</p>
                <Link href="/add" className="text-[10px] text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] flex items-center gap-1">
                  <Plus className="w-3 h-3" /> 添加
                </Link>
              </div>
              <div className="border border-[rgb(var(--border))] divide-y divide-[rgb(var(--border))]">
                {feed.slice(0, 8).map(item => {
                  const sec = sections.find(s => s.id === item.sectionId)
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${FEED_DOT[item.type]}`} />
                      <span className="text-base shrink-0">{item.emoji || '📝'}</span>
                      <p className="text-sm text-[rgb(var(--text))] flex-1 truncate">{item.text}</p>
                      <div className="text-right shrink-0">
                        {sec && <p className="text-[10px] text-[rgb(var(--text-3))]">{sec.icon} {sec.titleCN}</p>}
                        <p className="text-[10px] text-[rgb(var(--text-3))]">{timeAgo(item.ts)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Top Priority Projects ── */}
          <section>
            <p className="section-label mb-4">本周最高优先级</p>
            <div className="space-y-2">
              {sortedSections.slice(0, 5).map((section, i) => {
                const score = calculatePriority(section)
                const cat = CATEGORIES.find(c => c.business.sectionIds.includes(section.id))
                return (
                  <Link
                    key={section.id}
                    href={`/${section.slug}`}
                    className="flex items-center gap-4 px-4 py-3 border border-[rgb(var(--border))] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <span className="text-xs text-[rgb(var(--text-3))] w-5 tabular-nums">#{i + 1}</span>
                    <span className="text-lg">{section.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[rgb(var(--text))] truncate">{section.titleCN}</p>
                      <p className="text-[10px] text-[rgb(var(--text-3))]">{cat?.label} · {section.tasks[0]}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold tabular-nums text-[rgb(var(--text))]">{score.toFixed(1)}</p>
                      <p className="section-label">score</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </div>
          </section>

        </div>
      </main>

      {/* Mobile FAB */}
      <Link href="/add" className="fixed bottom-6 right-6 sm:hidden z-40 w-14 h-14 rounded-full bg-[rgb(var(--text))] text-[rgb(var(--bg))] flex items-center justify-center shadow-xl active:scale-95 transition-transform">
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  )
}
