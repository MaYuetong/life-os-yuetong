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
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const WEBSITE_PATH =
  '../personal-resume-website/website/index.html'

const QUICK_FILES = [
  {
    label: '个人网站 index.html',
    path: 'personal-resume-website/website/index.html',
    icon: Globe,
    color: 'text-purple-500',
    desc: '主页面 · Apple风格',
  },
  {
    label: '英文简历 resume.html',
    path: 'personal-resume-website/resume/resume.html',
    icon: FileText,
    color: 'text-blue-500',
    desc: '英文版简历 · PDF就绪',
  },
  {
    label: 'Silora Orient 网站',
    path: 'silora-orient/index.html',
    icon: Code2,
    color: 'text-orange-500',
    desc: '创业项目主页',
  },
]

const BRAND_TIPS = [
  { emoji: '✅', tip: '确保网站包含UN/UNESCO项目经历' },
  { emoji: '🎯', tip: '突出GIS + AI + 数据可视化技能' },
  { emoji: '🌍', tip: '多语言展示（英/中）增加可见度' },
  { emoji: '📊', tip: '量化成果：影响X人/节省Y小时' },
  { emoji: '🔗', tip: '所有社交媒体统一个人品牌' },
]

export default function BrandPage() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [iframeKey, setIframeKey] = useState(0)

  const iframeSrc = `/api/preview?path=${encodeURIComponent(WEBSITE_PATH)}`

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <Palette className="w-5 h-5 text-purple-500" />
          <h1 className="font-bold text-slate-900 dark:text-white">个人品牌 CMS</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all',
                  viewMode === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500'
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                桌面
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all',
                  viewMode === 'mobile'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500'
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                移动端
              </button>
            </div>
            <button
              onClick={() => setIframeKey((k) => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              刷新
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            {/* Files */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                品牌文件
              </h2>
              <div className="space-y-2">
                {QUICK_FILES.map(({ label, path, icon: Icon, color, desc }) => (
                  <div
                    key={path}
                    className="group flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {label}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {desc}
                      </p>
                      <p className="text-xs text-slate-300 dark:text-slate-600 font-mono truncate mt-1">
                        {path}
                      </p>
                    </div>
                    <a
                      href={`/api/open-file?path=${encodeURIComponent(path)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 transition-all"
                      title="在浏览器中打开"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand tips */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                品牌优化建议
              </h2>
              <ul className="space-y-2">
                {BRAND_TIPS.map(({ emoji, tip }) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="shrink-0">{emoji}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Edit with VS Code link */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 p-4">
              <h2 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                使用 VS Code 编辑
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                在终端运行以下命令，用 VS Code 直接编辑网站文件：
              </p>
              <code className="block text-xs bg-slate-900 text-green-400 rounded-lg p-2.5 font-mono leading-relaxed">
                {`code ~/Desktop/life-os/life-os-yuetong/personal-resume-website/website/index.html`}
              </code>
            </div>
          </div>

          {/* Preview area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                网站预览
              </h2>
              <a
                href="/api/preview?path=personal-resume-website/website/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                全屏打开
              </a>
            </div>

            <div
              className={cn(
                'mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg bg-white',
                viewMode === 'mobile' ? 'max-w-[390px]' : 'w-full'
              )}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-2 px-3 py-1 text-xs bg-white dark:bg-slate-700 rounded-md text-slate-400 font-mono">
                  personal-resume-website/website/index.html
                </div>
                <RefreshCw
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => setIframeKey((k) => k + 1)}
                />
              </div>

              <div
                className={cn(
                  viewMode === 'mobile' ? 'h-[700px]' : 'h-[600px]'
                )}
              >
                <iframe
                  key={iframeKey}
                  src={`/personal-resume-website/website/index.html`}
                  className="w-full h-full border-none"
                  title="Personal Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              预览来自本地文件 · 编辑后刷新查看效果
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
