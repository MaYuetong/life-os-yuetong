import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const now = new Date()
  if (isNaN(target.getTime())) return null
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diff
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  applied: {
    label: '已投递',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  interview: {
    label: '面试中',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/40',
  },
  offer: {
    label: '收到Offer',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/40',
  },
  rejected: {
    label: '已拒绝',
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/40',
  },
  pending: {
    label: '等待中',
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
  withdrawn: {
    label: '已撤回',
    color: 'text-slate-400 dark:text-slate-500',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
}
