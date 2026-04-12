'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  Search,
  Filter,
  Edit3,
  X,
  Check,
} from 'lucide-react'
import { cn, STATUS_CONFIG, formatDate, todayISO, daysUntil } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  appliedDate: string
  status: keyof typeof STATUS_CONFIG
  followUpDate: string
  notes: string
  link: string
  salary: string
}

const EMPTY_APP: Omit<JobApplication, 'id'> = {
  company: '',
  role: '',
  location: '',
  appliedDate: todayISO(),
  status: 'applied',
  followUpDate: '',
  notes: '',
  link: '',
  salary: '',
}

const SEED_DATA: JobApplication[] = [
  {
    id: '1',
    company: 'UNESCO',
    role: 'JPO — GIS / Data Officer',
    location: 'Paris, France',
    appliedDate: '2026-04-01',
    status: 'pending',
    followUpDate: '2026-04-15',
    notes: '已提交申请，等待 HR 回复。截止日 4/15，需主动跟进。',
    link: 'https://careers.unesco.org',
    salary: '$55k–70k USD',
  },
  {
    id: '2',
    company: 'London School of Economics',
    role: 'Spatial Research Assistant',
    location: 'London, UK (Remote possible)',
    appliedDate: '2026-04-02',
    status: 'applied',
    followUpDate: '2026-04-20',
    notes: '已投递简历 + Cover Letter。GIS 数据分析岗，符合背景。',
    link: '',
    salary: '£28k–35k',
  },
  {
    id: '3',
    company: '深圳证监局',
    role: 'IPO Specialist',
    location: '深圳, 中国',
    appliedDate: '2026-04-02',
    status: 'rejected',
    followUpDate: '',
    notes: '已拒绝。不匹配 — 岗位要求金融背景。',
    link: '',
    salary: '¥20k–30k/月',
  },
  {
    id: '4',
    company: 'UNOCC',
    role: 'GIS Intern (Crisis Mapping)',
    location: 'New York, USA',
    appliedDate: '2026-03-15',
    status: 'interview',
    followUpDate: '2026-04-20',
    notes: '已通过初筛。UN Watchroom 地图项目经历相关。等待面试安排。',
    link: '',
    salary: 'G4 Stipend',
  },
]

function exportCSV(apps: JobApplication[]) {
  const headers = ['公司', '职位', '地点', '投递日', '状态', '跟进日', '薪资', '备注', '链接']
  const rows = apps.map((a) => [
    a.company,
    a.role,
    a.location,
    a.appliedDate,
    STATUS_CONFIG[a.status]?.label ?? a.status,
    a.followUpDate,
    a.salary,
    a.notes.replace(/,/g, '，'),
    a.link,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `job-applications-${todayISO()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function JobPage() {
  const [apps, setApps] = useState<JobApplication[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<JobApplication, 'id'>>(EMPTY_APP)

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lifeos-jobs')
    if (stored) {
      setApps(JSON.parse(stored))
    } else {
      setApps(SEED_DATA)
      localStorage.setItem('lifeos-jobs', JSON.stringify(SEED_DATA))
    }
  }, [])

  const save = useCallback((updated: JobApplication[]) => {
    setApps(updated)
    localStorage.setItem('lifeos-jobs', JSON.stringify(updated))
  }, [])

  const handleSubmit = () => {
    if (!form.company || !form.role) return
    if (editId) {
      save(apps.map((a) => (a.id === editId ? { ...form, id: editId } : a)))
    } else {
      save([...apps, { ...form, id: Date.now().toString() }])
    }
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_APP)
  }

  const handleEdit = (app: JobApplication) => {
    setForm({ ...app })
    setEditId(app.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('确认删除这条投递记录？')) save(apps.filter((a) => a.id !== id))
  }

  const filtered = apps.filter((a) => {
    const matchSearch =
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: apps.length,
    interview: apps.filter((a) => a.status === 'interview').length,
    offer: apps.filter((a) => a.status === 'offer').length,
    pending: apps.filter((a) => a.status === 'pending' || a.status === 'applied').length,
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-lg">💼</span>
          <h1 className="font-bold text-slate-900 dark:text-white">求职追踪台</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => exportCSV(apps)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              导出CSV
            </button>
            <button
              onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_APP) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              新增投递
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '总投递', value: stats.total, color: 'text-slate-700 dark:text-slate-200' },
            { label: '等待中', value: stats.pending, color: 'text-blue-600 dark:text-blue-400' },
            { label: '面试中', value: stats.interview, color: 'text-yellow-600 dark:text-yellow-400' },
            { label: '收到Offer', value: stats.offer, color: 'text-green-600 dark:text-green-400' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm"
            >
              <p className={cn('text-2xl font-bold tabular-nums', color)}>{value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索公司或职位…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            <Filter className="w-4 h-4 text-slate-400 mx-2" />
            {['all', ...Object.keys(STATUS_CONFIG)].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                  statusFilter === s
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                {s === 'all' ? '全部' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['公司', '职位', '地点', '投递日', '状态', '跟进日', '操作'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      暂无投递记录，点击右上角"新增投递"开始追踪
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => {
                    const sc = STATUS_CONFIG[app.status]
                    const followDays = daysUntil(app.followUpDate)
                    return (
                      <tr
                        key={app.id}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {app.company}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[200px]">
                          <div className="truncate">{app.role}</div>
                          {app.salary && (
                            <div className="text-xs text-slate-400 mt-0.5">{app.salary}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {app.location || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                          {formatDate(app.appliedDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                              sc.bg,
                              sc.color
                            )}
                          >
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {app.followUpDate ? (
                            <span
                              className={cn(
                                'text-xs tabular-nums',
                                followDays !== null && followDays <= 3
                                  ? 'text-red-500 font-medium'
                                  : 'text-slate-500 dark:text-slate-400'
                              )}
                            >
                              {formatDate(app.followUpDate)}
                              {followDays !== null && followDays <= 7 && followDays >= 0 && (
                                <span className="ml-1">({followDays}天后)</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {app.link && (
                              <a
                                href={app.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-colors"
                                title="打开链接"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleEdit(app)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-violet-500 transition-colors"
                              title="编辑"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {editId ? '编辑投递记录' : '新增投递记录'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { key: 'company', label: '公司名称 *', type: 'text', placeholder: 'UNESCO' },
                { key: 'role', label: '职位名称 *', type: 'text', placeholder: 'JPO — GIS Officer' },
                { key: 'location', label: '工作地点', type: 'text', placeholder: 'Paris, France' },
                { key: 'salary', label: '薪资范围', type: 'text', placeholder: '$50k–70k' },
                { key: 'appliedDate', label: '投递日期', type: 'date', placeholder: '' },
                { key: 'followUpDate', label: '跟进日期', type: 'date', placeholder: '' },
                { key: 'link', label: '职位链接', type: 'url', placeholder: 'https://...' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={(form as Record<string, string>)[key] ?? ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  状态
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as JobApplication['status'] })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  备注
                </label>
                <textarea
                  rows={3}
                  placeholder="面试情况、联系人、下一步行动…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.company || !form.role}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
                {editId ? '保存修改' : '添加记录'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
