'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, Globe, Briefcase, FileText } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { sections } from '@/lib/sections'
import { getCategoryById } from '@/lib/categories'
import { calculatePriority } from '@/lib/priority'

const cat = getCategoryById('external')!
const extSections = sections.filter(s => cat.business.sectionIds.includes(s.id))

const PUBLIC_LINKS = [
  { label: '个人网站', url: 'https://mayuetong.github.io', desc: 'mayuetong.github.io', icon: Globe, color: 'text-violet-400' },
  { label: 'ZODIAC 平台', url: 'https://mayuetong.github.io/APH-IAEA-GIS-Platform', desc: 'IAEA/FAO GIS', icon: ExternalLink, color: 'text-lime-400' },
  { label: 'Silora Orient', url: 'https://silora-orient.vercel.app', desc: '珠宝品牌', icon: ExternalLink, color: 'text-orange-400' },
  { label: 'Met Tour', url: 'https://met-tour-business-system.vercel.app', desc: '导览系统', icon: ExternalLink, color: 'text-red-400' },
]

export default function ExternalPage() {
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
          <p className="section-label mb-2">External & Brand · 对外</p>
          <p className="text-sm text-[rgb(var(--text-2))] leading-relaxed">{cat.description}</p>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[rgb(var(--text-3))]" />
            <p className="section-label">个人品牌项目</p>
          </div>
          <div className="space-y-3">
            {extSections.map(section => {
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
                    <div className="mt-3 h-px bg-[rgb(var(--border))]">
                      <div className="h-px bg-violet-500" style={{ width: `${section.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-[rgb(var(--text-3))] mt-1">{section.progress}%</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Public links */}
        <div>
          <p className="section-label mb-4">所有公开链接</p>
          <div className="grid grid-cols-2 gap-3">
            {PUBLIC_LINKS.map(link => {
              const Icon = link.icon
              return (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-[rgb(var(--border))] p-4 hover:border-[rgb(var(--text-3))] transition-all group">
                  <Icon className={`w-4 h-4 shrink-0 ${link.color}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[rgb(var(--text))] truncate">{link.label}</p>
                    <p className="text-[10px] text-[rgb(var(--text-3))] truncate">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 ml-auto shrink-0 transition-opacity" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Quick tools */}
        <div>
          <p className="section-label mb-4">工具入口</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/job',   icon: Briefcase, label: '求职追踪',   sub: '投递 · 面试 · 跟进' },
              { href: '/brand', icon: FileText,  label: '品牌 CMS',   sub: '网站编辑 · 简历' },
            ].map(item => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}
                  className="group flex items-center gap-3 border border-[rgb(var(--border))] p-5 hover:border-[rgb(var(--text-3))] transition-all">
                  <Icon className="w-5 h-5 text-[rgb(var(--text-2))] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{item.label}</p>
                    <p className="text-xs text-[rgb(var(--text-3))] mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[rgb(var(--text-3))] opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
