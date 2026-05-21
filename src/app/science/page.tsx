'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Briefcase, BookOpen, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { sections } from '@/lib/sections'
import { getCategoryById } from '@/lib/categories'
import { calculatePriority } from '@/lib/priority'
import { cn } from '@/lib/utils'

const cat = getCategoryById('science')!
const sciSections = sections.filter(s => cat.business.sectionIds.includes(s.id))

const LEARNING_TRACKS = [
  { label: 'GIS & Cartography', icon: '🗺️', desc: 'ArcGIS · QGIS · Web maps · UN地图', status: 'active', progress: 70 },
  { label: 'AI & Machine Learning', icon: '🤖', desc: 'LLM · Prompt Engineering · RAG', status: 'active', progress: 45 },
  { label: 'Data Visualization', icon: '📊', desc: 'D3.js · Observable · Tableau', status: 'active', progress: 50 },
  { label: 'Web Development', icon: '💻', desc: 'Next.js · TypeScript · Vercel', status: 'active', progress: 65 },
  { label: 'Research Methods', icon: '📐', desc: '定量 · 定性 · Mixed methods', status: 'pending', progress: 30 },
]

export default function SciencePage() {
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
          <p className="section-label mb-2">Science & Technology · 科学领域</p>
          <p className="text-sm text-[rgb(var(--text-2))] leading-relaxed">{cat.description}</p>
        </div>

        {/* 事业 & 研究 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[rgb(var(--text-3))]" />
            <p className="section-label">事业 & 研究</p>
          </div>
          <div className="space-y-3">
            {sciSections.map(section => {
              const score = calculatePriority(section)
              const nextDeadline = section.deadlines?.[0]
              return (
                <Link
                  key={section.id}
                  href={`/${section.slug}`}
                  className="group flex items-start gap-4 border border-[rgb(var(--border))] p-5 hover:border-[rgb(var(--text-3))] transition-all"
                >
                  <span className="text-2xl shrink-0">{section.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[rgb(var(--text))]">{section.titleCN}</h3>
                        <p className="text-xs text-[rgb(var(--text-3))] mt-0.5">{section.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold tabular-nums text-[rgb(var(--text))]">{score.toFixed(1)}</p>
                        <p className="section-label">priority</p>
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-[rgb(var(--text-3))] mb-1">
                        <span>进度</span><span>{section.progress}%</span>
                      </div>
                      <div className="h-px bg-[rgb(var(--border))]">
                        <div className="h-px bg-emerald-500" style={{ width: `${section.progress}%` }} />
                      </div>
                    </div>
                    {/* Next deadline */}
                    {nextDeadline && (
                      <p className="text-[10px] text-amber-400 mt-2">⏰ {nextDeadline.date} — {nextDeadline.label}</p>
                    )}
                    {/* Quick links */}
                    {section.liveUrl && (
                      <a href={section.liveUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:underline mt-2">
                        <ExternalLink className="w-2.5 h-2.5" /> {section.liveUrl.replace('https://', '')}
                      </a>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* 学习追踪 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[rgb(var(--text-3))]" />
            <p className="section-label">学习追踪</p>
          </div>
          <div className="space-y-2">
            {LEARNING_TRACKS.map(track => (
              <div key={track.label} className="flex items-center gap-4 border border-[rgb(var(--border))] p-4">
                <span className="text-xl shrink-0">{track.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{track.label}</p>
                    <span className={cn(
                      'text-[9px] px-2 py-0.5 font-semibold uppercase tracking-wide',
                      track.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-[rgb(var(--border))] text-[rgb(var(--text-3))]'
                    )}>
                      {track.status === 'active' ? '进行中' : '待启动'}
                    </span>
                  </div>
                  <p className="text-xs text-[rgb(var(--text-3))] mb-2">{track.desc}</p>
                  <div className="h-px bg-[rgb(var(--border))]">
                    <div className="h-px bg-emerald-500/60" style={{ width: `${track.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-[rgb(var(--text-3))] mt-1">{track.progress}%</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[rgb(var(--text-3))] mt-3 text-center">
            💡 学习详情页即将上线 — 课程笔记 · 资源收藏 · 项目记录
          </p>
        </div>

      </div>
    </div>
  )
}
