import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FolderOpen, ExternalLink, CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react'
import { sections, getSectionBySlug } from '@/lib/sections'
import { calculatePriority, getPriorityLabel, getPriorityBarColor } from '@/lib/priority'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

// Generate static params for all sections
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
  return {
    title: `${s.icon} ${s.titleCN} — Life OS`,
    description: s.description,
  }
}

const FORMULA_BREAKDOWN = [
  { label: '截止紧迫度', weight: '×0.4', key: 'deadline' as const },
  { label: '人生影响', weight: '×0.3', key: 'impact' as const },
  { label: '签证相关', weight: '×0.2', key: 'visa' as const },
  { label: '机会成本', weight: '×0.1', key: 'cost' as const },
]

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section: slug } = await params
  const section = getSectionBySlug(slug)

  if (!section) notFound()

  const score = calculatePriority(section)
  const { label: priorityLabel, color: priorityColor } = getPriorityLabel(score)
  const barColor = getPriorityBarColor(score)

  const STATUS_MAP = {
    active: { icon: CheckCircle2, color: 'text-emerald-500', label: '进行中' },
    pending: { icon: Clock, color: 'text-yellow-500', label: '待启动' },
    completed: { icon: CheckCircle2, color: 'text-blue-500', label: '已完成' },
    blocked: { icon: AlertCircle, color: 'text-red-500', label: '受阻' },
  }
  const StatusIcon = STATUS_MAP[section.status].icon
  const statusColor = STATUS_MAP[section.status].color
  const statusLabel = STATUS_MAP[section.status].label

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xl">{section.icon}</span>
          <h1 className="font-bold text-slate-900 dark:text-white">{section.titleCN}</h1>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 space-y-6">
        {/* Hero */}
        <div
          className={cn(
            'relative rounded-3xl p-8 overflow-hidden',
            'bg-white dark:bg-slate-900',
            'border border-slate-200/60 dark:border-slate-800',
            'shadow-sm'
          )}
        >
          {/* Background gradient */}
          <div
            className={cn(
              'absolute inset-0 rounded-3xl opacity-30 dark:opacity-20 bg-gradient-to-br pointer-events-none',
              section.cardGradient
            )}
          />

          <div className="relative flex flex-col md:flex-row md:items-start gap-6">
            <div
              className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center text-5xl',
                'bg-gradient-to-br shadow-lg',
                section.cardGradient,
                'shrink-0'
              )}
            >
              {section.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {section.titleCN}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {section.title} · {section.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={cn(
                      'text-3xl font-bold tabular-nums',
                      `bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`
                    )}
                  >
                    {score.toFixed(1)}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">优先级得分</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <span className={cn('flex items-center gap-1.5 text-sm', priorityColor)}>
                  {priorityLabel}
                </span>
                <span className={cn('flex items-center gap-1.5 text-sm', statusColor)}>
                  <StatusIcon className="w-4 h-4" />
                  {statusLabel}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">整体进度</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {section.progress}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', barColor)}
                    style={{ width: `${section.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              当前任务
            </h3>
            <ul className="space-y-3">
              {section.tasks.map((task, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <span
                    className={cn(
                      'mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white',
                      `bg-gradient-to-br ${section.gradient}`
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              优先级分解
            </h3>
            <div className="space-y-3">
              {FORMULA_BREAKDOWN.map(({ label, weight, key }) => {
                const val = section[key]
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        {label}{' '}
                        <span className="text-slate-300 dark:text-slate-600">{weight}</span>
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                        {(val * 10).toFixed(1)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', barColor)}
                        style={{ width: `${val * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">综合得分</span>
                  <span
                    className={cn(
                      `bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent tabular-nums`
                    )}
                  >
                    {score.toFixed(1)} / 10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Folder info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-amber-500" />
            文件夹
          </h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <code className="text-sm text-slate-600 dark:text-slate-400 font-mono">
              ~/Desktop/life-os/life-os-yuetong/{section.folderName}
            </code>
            <a
              href={`/api/open-folder?name=${encodeURIComponent(section.folderName)}`}
              className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline ml-4 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              在Finder中打开
            </a>
          </div>
          {section.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {section.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
