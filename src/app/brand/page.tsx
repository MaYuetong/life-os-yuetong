'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  FileText,
  Code2,
  Palette,
  RefreshCw,
  Monitor,
  Smartphone,
  Maximize2,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const QUICK_FILES = [
  {
    label: '个人网站 index.html',
    file: 'personal-resume-website/website/index.html',
    icon: Globe,
    color: 'text-purple-400',
    desc: '主页面 · Apple风格单页',
  },
  {
    label: 'Silora Orient 网站',
    file: 'silora-orient/index.html',
    icon: Code2,
    color: 'text-orange-400',
    desc: '创业品牌主页 · NYC',
    externalUrl: 'https://silora-orient.vercel.app',
  },
  {
    label: '英文简历 resume.html',
    file: 'personal-resume-website/resume/resume.html',
    icon: FileText,
    color: 'text-blue-400',
    desc: '英文版 · PDF就绪',
  },
]

const BRAND_TIPS = [
  { done: false, tip: '网站加入 UNESCO/UN 项目经历' },
  { done: false, tip: '突出 GIS + AI + 数据可视化 技能栈' },
  { done: false, tip: '添加 Silora Orient 创业板块' },
  { done: true,  tip: 'Apple 风格单页设计已完成' },
  { done: true,  tip: '英文简历 HTML 版本已生成' },
]

type PreviewTarget = (typeof QUICK_FILES)[number]

export default function BrandPage() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [active, setActive] = useState<PreviewTarget>(QUICK_FILES[0])
  const [iframeKey, setIframeKey] = useState(0)

  const iframeSrc = `/api/serve-html?file=${encodeURIComponent(active.file)}`

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[rgb(var(--bg))]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Palette className="w-4 h-4 text-purple-400" />
          <h1 className="font-semibold text-[rgb(var(--text))] text-sm">个人品牌 CMS</h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Desktop / Mobile toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              {(['desktop', 'mobile'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all',
                    viewMode === m
                      ? 'bg-white/[0.08] text-[rgb(var(--text))]'
                      : 'text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]'
                  )}
                >
                  {m === 'desktop' ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                  {m === 'desktop' ? '桌面' : '移动'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIframeKey((k) => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.06] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:bg-white/[0.07] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              刷新
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

          {/* ── Left sidebar ── */}
          <aside className="space-y-4">
            {/* File switcher */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
              <p className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider mb-3">
                品牌文件
              </p>
              <div className="space-y-1.5">
                {QUICK_FILES.map((f) => (
                  <button
                    key={f.file}
                    onClick={() => { setActive(f); setIframeKey((k) => k + 1) }}
                    className={cn(
                      'group w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all',
                      active.file === f.file
                        ? 'bg-violet-500/10 border border-violet-500/20'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    )}
                  >
                    <f.icon className={cn('w-4 h-4 mt-0.5 shrink-0', f.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[rgb(var(--text))] truncate">{f.label}</p>
                      <p className="text-xs text-[rgb(var(--text-2))] mt-0.5">{f.desc}</p>
                    </div>
                    {f.externalUrl && (
                      <a
                        href={f.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/[0.08] text-[rgb(var(--text-2))] transition-all shrink-0"
                        title="在浏览器中打开"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand checklist */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
              <p className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider mb-3">
                品牌优化清单
              </p>
              <ul className="space-y-2.5">
                {BRAND_TIPS.map(({ done, tip }) => (
                  <li key={tip} className="flex items-start gap-2">
                    {done
                      ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                      : <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[rgb(var(--text-2))] opacity-40" />
                    }
                    <span className={cn(
                      'text-xs leading-relaxed',
                      done ? 'text-[rgb(var(--text-2))] line-through opacity-50' : 'text-[rgb(var(--text-2))]'
                    )}>
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VS Code shortcut */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 p-4">
              <p className="text-xs font-semibold text-purple-300 mb-2">用 VS Code 编辑</p>
              <code className="block text-xs bg-black/30 text-green-400 rounded-lg p-2.5 font-mono leading-relaxed break-all">
                {`code ~/Desktop/life-os/life-os-yuetong/${active.file}`}
              </code>
            </div>
          </aside>

          {/* ── Preview ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[rgb(var(--text-2))]">
                预览：<span className="text-[rgb(var(--text))]">{active.label}</span>
              </p>
              <div className="flex items-center gap-2">
                {active.externalUrl && (
                  <a
                    href={active.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-orange-400 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    线上地址
                  </a>
                )}
                <a
                  href={iframeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:underline"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  全屏打开
                </a>
              </div>
            </div>

            <div className={cn(
              'mx-auto rounded-2xl overflow-hidden border border-white/[0.07] shadow-2xl bg-white',
              viewMode === 'mobile' ? 'max-w-[390px]' : 'w-full'
            )}>
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-900 border-b border-white/5">
                <div className="flex gap-1.5">
                  {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((c) => (
                    <div key={c} className={`w-3 h-3 rounded-full ${c} opacity-70`} />
                  ))}
                </div>
                <div className="flex-1 mx-2 px-3 py-1 text-xs bg-zinc-800 rounded-md text-zinc-400 font-mono truncate">
                  {active.file}
                </div>
                <RefreshCw
                  className="w-3.5 h-3.5 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                  onClick={() => setIframeKey((k) => k + 1)}
                />
              </div>

              <iframe
                key={iframeKey}
                src={iframeSrc}
                className={cn('w-full border-none', viewMode === 'mobile' ? 'h-[700px]' : 'h-[620px]')}
                title={active.label}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>

            <p className="text-xs text-[rgb(var(--text-2))] opacity-50 text-center">
              编辑文件后点击刷新查看效果 · 本地服务实时读取
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
