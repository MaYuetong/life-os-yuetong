import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  FolderOpen,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Folder,
} from 'lucide-react'
import { sections, getSectionBySlug } from '@/lib/sections'
import { calculatePriority, getPriorityLabel, getPriorityBarColor } from '@/lib/priority'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const s = getSectionBySlug(section)
  if (!s) return { title: '未找到' }
  return { title: `${s.icon} ${s.titleCN} — Life OS`, description: s.description }
}

const FORMULA = [
  { label: '截止紧迫度', weight: '×0.4', key: 'deadline' as const },
  { label: '人生影响力', weight: '×0.3', key: 'impact' as const },
  { label: '签证相关性', weight: '×0.2', key: 'visa' as const },
  { label: '机会成本',   weight: '×0.1', key: 'cost' as const },
]

const STATUS_MAP = {
  active:    { icon: CheckCircle2, color: 'text-emerald-400', label: '进行中' },
  pending:   { icon: Clock,        color: 'text-yellow-400',  label: '待启动' },
  completed: { icon: CheckCircle2, color: 'text-blue-400',    label: '已完成' },
  blocked:   { icon: AlertCircle,  color: 'text-red-400',     label: '受阻'   },
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
  const { label: priorityLabel } = getPriorityLabel(score)
  const barColor = getPriorityBarColor(score)
  const { icon: StatusIcon, color: statusColor, label: statusLabel } = STATUS_MAP[section.status]

  const LIFEOS_ROOT = '~/Desktop/life-os/life-os-yuetong'

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[rgb(var(--bg))]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 md:px-10 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xl">{section.icon}</span>
          <h1 className="font-semibold text-[rgb(var(--text))] text-sm">{section.titleCN}</h1>
          {section.liveUrl && (
            <a
              href={section.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-orange-400 hover:underline ml-1"
            >
              <ExternalLink className="w-3 h-3" />
              线上
            </a>
          )}
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 md:px-10 pt-8 space-y-5">

        {/* ── Hero card ── */}
        <div className={cn(
          'relative rounded-3xl p-7 overflow-hidden',
          'bg-white/[0.02] border border-white/[0.06]',
        )}>
          <div className={cn('absolute inset-0 rounded-3xl bg-gradient-to-br opacity-20 pointer-events-none', section.cardGradient)} />

          <div className="relative flex flex-col md:flex-row md:items-start gap-5">
            {/* Icon */}
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 bg-gradient-to-br border border-white/10 shadow-lg', section.cardGradient)}>
              {section.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[rgb(var(--text))]">{section.titleCN}</h2>
                  <p className="text-[rgb(var(--text-2))] text-sm mt-1">{section.title} · {section.description}</p>
                </div>
                {/* Score */}
                <div className="text-right shrink-0">
                  <div className={cn('text-3xl font-bold tabular-nums bg-gradient-to-r bg-clip-text text-transparent', section.gradient)}>
                    {score.toFixed(1)}
                  </div>
                  <p className="text-xs text-[rgb(var(--text-2))] mt-0.5">优先级</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className={cn('flex items-center gap-1.5 text-xs', statusColor)}>
                  <StatusIcon className="w-3.5 h-3.5" />{statusLabel}
                </span>
                <span className="text-xs text-[rgb(var(--text-2))]">{priorityLabel}</span>
                {section.liveUrl && (
                  <a href={section.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-orange-400 hover:underline">
                    <ExternalLink className="w-3 h-3" />
                    {section.liveUrl.replace('https://', '')}
                  </a>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[rgb(var(--text-2))] mb-1.5">
                  <span>整体进度</span>
                  <span className="font-semibold text-[rgb(var(--text))] tabular-nums">{section.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', barColor)} style={{ width: `${section.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ── Pending tasks ── */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <h3 className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              待办任务
            </h3>
            <ul className="space-y-2.5">
              {section.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02]">
                  <span className={cn(
                    'mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br',
                    section.gradient
                  )}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-[rgb(var(--text-2))] leading-snug">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            {/* ── Completed tasks ── */}
            {section.completedTasks && section.completedTasks.length > 0 && (
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                <h3 className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  已完成
                </h3>
                <ul className="space-y-2">
                  {section.completedTasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400/70" />
                      <span className="text-xs text-[rgb(var(--text-2))] opacity-60 line-through leading-snug">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Priority breakdown ── */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
              <h3 className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                优先级分解
              </h3>
              <div className="space-y-3">
                {FORMULA.map(({ label, weight, key }) => {
                  const val = section[key]
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[rgb(var(--text-2))]">
                          {label} <span className="opacity-40">{weight}</span>
                        </span>
                        <span className="font-medium text-[rgb(var(--text))] tabular-nums">
                          {(val * 10).toFixed(1)}
                        </span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', barColor)} style={{ width: `${val * 100}%` }} />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-2 border-t border-white/[0.06] flex justify-between text-sm font-semibold">
                  <span className="text-[rgb(var(--text-2))]">综合得分</span>
                  <span className={cn('bg-gradient-to-r bg-clip-text text-transparent tabular-nums', section.gradient)}>
                    {score.toFixed(1)} / 10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Folders ── */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
          <h3 className="text-xs font-semibold text-[rgb(var(--text-2))] uppercase tracking-wider mb-4 flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            关联文件夹
          </h3>
          <div className="space-y-2">
            {/* Primary folder */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <code className="text-xs text-[rgb(var(--text-2))] font-mono flex-1 truncate">
                {LIFEOS_ROOT}/{section.folderName}
              </code>
              <span className="text-xs text-emerald-400/70 shrink-0">主目录</span>
            </div>
            {/* Sub-folders */}
            {section.subFolders?.map((sf) => (
              <div key={sf} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                <Folder className="w-4 h-4 text-[rgb(var(--text-2))] opacity-40 shrink-0" />
                <code className="text-xs text-[rgb(var(--text-2))] opacity-60 font-mono flex-1 truncate">
                  {LIFEOS_ROOT}/{sf}
                </code>
                <span className="text-xs text-[rgb(var(--text-2))] opacity-40 shrink-0">关联</span>
              </div>
            ))}
          </div>

          {/* Quick links */}
          {section.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.05]">
              {section.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.06] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] hover:bg-white/[0.07] transition-all"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
