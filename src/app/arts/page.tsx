'use client'

import Link from 'next/link'
import { ArrowLeft, ExternalLink, BookOpen, Briefcase, ArrowRight, Instagram } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { sections } from '@/lib/sections'
import { getCategoryById } from '@/lib/categories'
import { calculatePriority } from '@/lib/priority'
import { cn } from '@/lib/utils'

const cat = getCategoryById('arts')!
const artsSections = sections.filter(s => cat.business.sectionIds.includes(s.id))

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    desc: '@silora.orient',
    color: 'text-pink-400 border-pink-500/20 bg-pink-500/5',
  },
  {
    label: 'Silora 网站',
    icon: ExternalLink,
    url: 'https://silora-orient.vercel.app',
    desc: 'silora-orient.vercel.app',
    color: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
  },
  {
    label: '✦ Be My Model',
    icon: ExternalLink,
    url: 'https://silora-orient.vercel.app/model.html',
    desc: '私密邀请页 · NYC 模特',
    color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
  },
  {
    label: 'Met Tour 预约',
    icon: ExternalLink,
    url: 'https://met-tour-business-system.vercel.app',
    desc: '大都会导览系统',
    color: 'text-red-400 border-red-500/20 bg-red-500/5',
  },
]

export default function ArtsPage() {
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

        {/* ── Hero ── */}
        <div className={`border border-[rgb(var(--border))] p-6 relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient}`} />
          <p className="section-label mb-2">Arts & Craft · 艺术领域</p>
          <p className="text-sm text-[rgb(var(--text-2))] leading-relaxed">{cat.description}</p>
        </div>

        {/* ── 事业 (Business) ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[rgb(var(--text-3))]" />
            <p className="section-label">事业</p>
          </div>
          <div className="space-y-3">
            {artsSections.map(section => {
              const score = calculatePriority(section)
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

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-[rgb(var(--text-3))] mb-1">
                        <span>进度</span><span>{section.progress}%</span>
                      </div>
                      <div className="h-px bg-[rgb(var(--border))]">
                        <div className="h-px bg-[rgb(var(--text-2))]" style={{ width: `${section.progress}%` }} />
                      </div>
                    </div>

                    {/* Top tasks */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {section.tasks.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 border border-[rgb(var(--border))] text-[rgb(var(--text-3))] rounded-sm">
                          {t.replace(/^(🆕|✅)\s*/, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── 学习：博物馆 Library ── */}
        {cat.learning && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[rgb(var(--text-3))]" />
              <p className="section-label">学习</p>
            </div>
            <Link
              href={cat.learning.path}
              className="group flex items-center justify-between border border-[rgb(var(--border))] p-6 hover:border-[rgb(var(--text-3))] transition-all"
            >
              <div>
                <h3 className="font-bold text-[rgb(var(--text))] text-lg">🖼️ {cat.learning.label}</h3>
                <p className="text-sm text-[rgb(var(--text-2))] mt-1">{cat.learning.description}</p>
                <p className="text-xs text-[rgb(var(--text-3))] mt-2">
                  记录你看过的艺术作品 · 上传手机照片 · 写观展感受
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-[rgb(var(--text-3))] group-hover:translate-x-1 transition-transform shrink-0 ml-4" />
            </Link>
          </div>
        )}

        {/* ── 快速链接 ── */}
        <div>
          <p className="section-label mb-4">快速入口</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOCIAL_LINKS.map(link => {
              const Icon = link.icon
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex flex-col gap-2 p-4 border rounded-none transition-all hover:opacity-80',
                    link.color
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <div>
                    <p className="text-xs font-semibold">{link.label}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">{link.desc}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* ── 摄影 & 品牌 ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/memories', label: '摄影回忆', sub: '照片 · 旅行', emoji: '📸' },
            { href: '/brand',    label: '品牌 CMS',  sub: '网站编辑 · 简历', emoji: '✨' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between p-5 border border-[rgb(var(--border))] hover:border-[rgb(var(--text-3))] transition-all"
            >
              <div>
                <p className="text-xl mb-1">{item.emoji}</p>
                <p className="text-sm font-semibold text-[rgb(var(--text))]">{item.label}</p>
                <p className="text-xs text-[rgb(var(--text-3))] mt-0.5">{item.sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
