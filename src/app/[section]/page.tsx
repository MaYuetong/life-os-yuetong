import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Globe,
  FileText,
  CalendarDays,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Folder,
  FolderOpen,
  ExternalLink,
} from 'lucide-react'
import { sections, getSectionBySlug } from '@/lib/sections'
import { calculatePriority, sortByPriority } from '@/lib/priority'
import { ThemeToggle } from '@/components/ThemeToggle'
import { OpenLocalButton } from '@/components/OpenLocalButton'

export function generateStaticParams() {
  return sections.map(s => ({ section: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const s = getSectionBySlug(section)
  if (!s) return { title: '未找到' }
  return { title: `${s.titleCN} — Life OS`, description: s.description }
}

const STATUS_META = {
  active:    { icon: CheckCircle2, dot: 'bg-green-500', label: '进行中' },
  pending:   { icon: Clock,        dot: 'bg-amber-400', label: '待启动' },
  completed: { icon: CheckCircle2, dot: 'bg-blue-400',  label: '已完成' },
  blocked:   { icon: AlertCircle,  dot: 'bg-red-500',   label: '受阻'   },
}

const FORMULA = [
  { label: '截止紧迫度', weight: '×0.4', key: 'deadline' as const },
  { label: '人生影响力', weight: '×0.3', key: 'impact'   as const },
  { label: '签证相关性', weight: '×0.2', key: 'visa'     as const },
  { label: '机会成本',   weight: '×0.1', key: 'cost'     as const },
]

const LIFEOS_ROOT = '~/Desktop/life-os/life-os-yuetong'

function displayPath(p: string) {
  return p.startsWith('/') ? p.replace('/Users/mayuetong/', '~/') : `${LIFEOS_ROOT}/${p}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section: slug } = await params
  const section = getSectionBySlug(slug)
  if (!section) notFound()

  const score = calculatePriority(section)
  const { dot: statusDot, label: statusLabel } = STATUS_META[section.status]

  // Rank among all sections
  const sorted = sortByPriority(sections)
  const rank = sorted.findIndex(s => s.id === section.id) + 1

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 h-14 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Life OS
          </Link>

          <div className="h-4 w-px bg-[rgb(var(--border))]" />

          <span className="text-xs font-semibold text-[rgb(var(--text))] tracking-tight">
            {section.titleCN}
          </span>

          {section.liveUrl && (
            <a
              href={section.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] transition-colors ml-1"
            >
              <Globe className="w-3 h-3" />
              网站
            </a>
          )}

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* ── Hero ── */}
        <div className="border border-[rgb(var(--border))] p-8">
          {/* Eyebrow */}
          <p className="section-label mb-6">
            Project #{String(rank).padStart(2, '0')} &nbsp;·&nbsp; {section.title}
          </p>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Left: title + meta */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-[rgb(var(--text))] tracking-[-0.03em] leading-tight">
                {section.titleCN}
              </h1>
              <p className="text-sm text-[rgb(var(--text-2))] mt-2">{section.description}</p>

              {/* Status + actions */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                  <span className="section-label">{statusLabel}</span>
                </div>

                {section.liveUrl && (
                  <a
                    href={section.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[rgb(var(--border))] text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:border-[rgb(var(--text))] transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    打开网站
                  </a>
                )}
                {section.vaultPath && (
                  <OpenLocalButton path={section.vaultPath} label="Vault" icon="folder" />
                )}
                {section.readmePath && (
                  <OpenLocalButton path={section.readmePath} label="README" icon="file" />
                )}
              </div>

              {/* Dates */}
              {(section.startDate || section.lastUpdated) && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {section.startDate && (
                    <span className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--text-3))]">
                      <CalendarDays className="w-3 h-3" />
                      开始 {fmtDate(section.startDate)}
                    </span>
                  )}
                  {section.lastUpdated && (
                    <span className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--text-3))]">
                      <RefreshCw className="w-3 h-3" />
                      更新 {fmtDate(section.lastUpdated)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: score + progress */}
            <div className="shrink-0 md:text-right space-y-4 md:min-w-[140px]">
              <div>
                <p className="section-label mb-1">Priority Score</p>
                <p className="text-5xl font-bold tabular-nums text-[rgb(var(--text))] tracking-tight leading-none">
                  {score.toFixed(1)}
                </p>
                <p className="text-xs text-[rgb(var(--text-3))] mt-1">/ 10</p>
              </div>
              <div>
                <p className="section-label mb-2">Progress</p>
                <p className="text-2xl font-bold tabular-nums text-[rgb(var(--text))] tracking-tight">
                  {section.progress}%
                </p>
                <div className="h-px bg-[rgb(var(--border))] mt-2 md:w-[140px]">
                  <div className="h-px bg-[rgb(var(--text))]" style={{ width: `${section.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tasks + Priority breakdown ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pending tasks */}
          <div className="border border-[rgb(var(--border))] p-6">
            <p className="section-label mb-5">待办任务</p>
            <ol className="space-y-3">
              {section.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono font-bold tabular-nums text-[rgb(var(--text-3))] w-4 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[rgb(var(--text-2))] leading-snug">{task}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-6">
            {/* Completed tasks */}
            {section.completedTasks && section.completedTasks.length > 0 && (
              <div className="border border-[rgb(var(--border))] p-6">
                <p className="section-label mb-4">已完成</p>
                <ul className="space-y-2">
                  {section.completedTasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[rgb(var(--text-3))]" />
                      <span className="text-xs text-[rgb(var(--text-3))] line-through leading-snug">
                        {task}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Priority breakdown */}
            <div className="border border-[rgb(var(--border))] p-6">
              <p className="section-label mb-5">优先级分解</p>
              <div className="space-y-4">
                {FORMULA.map(({ label, weight, key }) => {
                  const val = section[key]
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[rgb(var(--text-2))]">
                          {label}
                          <span className="text-[rgb(var(--text-3))] ml-1.5">{weight}</span>
                        </span>
                        <span className="font-semibold tabular-nums text-[rgb(var(--text))]">
                          {(val * 10).toFixed(1)}
                        </span>
                      </div>
                      <div className="h-px bg-[rgb(var(--border))]">
                        <div className="h-px bg-[rgb(var(--text-2))]" style={{ width: `${val * 100}%` }} />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-3 border-t border-[rgb(var(--border))] flex justify-between text-sm font-bold">
                  <span className="text-[rgb(var(--text-2))]">综合得分</span>
                  <span className="text-[rgb(var(--text))] tabular-nums">{score.toFixed(1)} / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Folders ── */}
        <div className="border border-[rgb(var(--border))] p-6">
          <p className="section-label mb-5">关联文件夹</p>
          <div className="space-y-2">
            {/* Primary */}
            <div className="flex items-center gap-3 p-3 border border-[rgb(var(--border))]">
              <FolderOpen className="w-4 h-4 text-[rgb(var(--text-2))] shrink-0" />
              <code className="text-xs text-[rgb(var(--text-2))] font-mono flex-1 truncate">
                {displayPath(section.folderName)}
              </code>
              <span className="section-label shrink-0">主目录</span>
            </div>
            {/* Sub-folders */}
            {section.subFolders?.map(sf => (
              <div key={sf} className="flex items-center gap-3 p-3">
                <Folder className="w-4 h-4 text-[rgb(var(--text-3))] shrink-0" />
                <code className="text-xs text-[rgb(var(--text-3))] font-mono flex-1 truncate">
                  {displayPath(sf)}
                </code>
                <span className="section-label shrink-0">关联</span>
              </div>
            ))}
          </div>

          {/* Links */}
          {section.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[rgb(var(--border))]">
              {section.links.map(link => (
                <Link
                  key={link.url}
                  href={link.url}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[rgb(var(--border))] text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:border-[rgb(var(--text))] transition-colors"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
