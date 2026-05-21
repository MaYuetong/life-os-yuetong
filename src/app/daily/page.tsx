'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, CalendarClock, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { sections } from '@/lib/sections'
import { getCategoryById } from '@/lib/categories'
import { calculatePriority } from '@/lib/priority'
import { cn } from '@/lib/utils'

const cat = getCategoryById('daily')!
const dailySections = sections.filter(s => cat.business.sectionIds.includes(s.id))

const LIFE_WINS = [
  { text: '✅ 爸妈签证成功获批', date: '2026-05', done: true },
  { text: 'G4 签证续签确认', date: '待办', done: false },
  { text: '加拿大签证材料提交', date: '2026-06-01', done: false },
]

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

export default function DailyPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <header className="sticky top-0 z-50 h-14 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-full flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Life OS
          </Link>
          <div className="h-4 w-px bg-[rgb(var(--border))]" />
          <span className="text-lg">{cat.icon}</span>
          <h1 className="text-sm font-bold text-[rgb(var(--text))]">{cat.label}</h1>
          <span className="text-xs text-[rgb(var(--text-3))] hidden sm:block">— {cat.labelEN}</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-10">

        {/* Hero */}
        <div className="border border-[rgb(var(--border))] p-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient}`} />
          <p className="section-label mb-2">Daily Life · 日常管理</p>
          <p className="text-sm text-[rgb(var(--text-2))] leading-relaxed">{cat.description}</p>
        </div>

        {/* Life wins / major milestones */}
        <div>
          <p className="section-label mb-4">里程碑</p>
          <div className="space-y-2">
            {LIFE_WINS.map(item => (
              <div key={item.text} className={cn(
                'flex items-center gap-3 px-4 py-3 border',
                item.done
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-[rgb(var(--border))]'
              )}>
                {item.done
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <Circle className="w-4 h-4 text-[rgb(var(--text-3))] shrink-0" />
                }
                <p className={cn('text-sm flex-1', item.done ? 'text-emerald-300' : 'text-[rgb(var(--text))]')}>
                  {item.text}
                </p>
                <span className="text-[10px] text-[rgb(var(--text-3))]">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div>
          <p className="section-label mb-4">管理事项</p>
          <div className="space-y-3">
            {dailySections.map(section => {
              const score = calculatePriority(section)
              return (
                <Link
                  key={section.id}
                  href={`/${section.slug}`}
                  className="group flex items-start gap-4 border border-[rgb(var(--border))] p-5 hover:border-[rgb(var(--text-3))] transition-all"
                >
                  <span className="text-2xl shrink-0">{section.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[rgb(var(--text))]">{section.titleCN}</h3>
                        <p className="text-xs text-[rgb(var(--text-3))] mt-0.5">{section.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold tabular-nums text-[rgb(var(--text))]">{score.toFixed(1)}</p>
                        <p className="section-label">priority</p>
                      </div>
                    </div>

                    {/* Completed tasks */}
                    {section.completedTasks && section.completedTasks.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {section.completedTasks.slice(0, 3).map(t => (
                          <div key={t} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <p className="text-[10px] text-emerald-300">{t}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pending tasks */}
                    <div className="mt-2 space-y-1">
                      {section.tasks.slice(0, 2).map(t => (
                        <div key={t} className="flex items-center gap-1.5">
                          <Circle className="w-3 h-3 text-[rgb(var(--text-3))] shrink-0" />
                          <p className="text-[10px] text-[rgb(var(--text-2))]">{t}</p>
                        </div>
                      ))}
                    </div>

                    {/* Urgent deadlines */}
                    {section.deadlines?.filter(d => daysUntil(d.date) < 30).map(d => {
                      const days = daysUntil(d.date)
                      return (
                        <div key={d.date} className={cn(
                          'flex items-center gap-1.5 mt-2',
                          days < 7 ? 'text-red-400' : 'text-amber-400'
                        )}>
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <p className="text-[10px]">{days}天后 — {d.label}</p>
                        </div>
                      )
                    })}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick access */}
        <div>
          <p className="section-label mb-4">快速入口</p>
          <Link href="/deadlines"
            className="group flex items-center gap-3 border border-[rgb(var(--border))] p-5 hover:border-[rgb(var(--text-3))] transition-all">
            <CalendarClock className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text))]">截止日历</p>
              <p className="text-xs text-[rgb(var(--text-3))] mt-0.5">查看所有项目的截止日期</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
          </Link>
        </div>

      </div>
    </div>
  )
}
