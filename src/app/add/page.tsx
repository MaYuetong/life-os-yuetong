'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Send, Sparkles, Newspaper, ListTodo, RefreshCw, Lock } from 'lucide-react'
import { sections } from '@/lib/sections'
import type { FeedItem, FeedItemType } from '@/app/api/feed/route'
import { cn } from '@/lib/utils'

const TYPE_OPTIONS: { value: FeedItemType; label: string; emoji: string; color: string; icon: typeof CheckCircle2 }[] = [
  { value: 'win',    label: '完成了', emoji: '✅', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', icon: CheckCircle2 },
  { value: 'news',   label: '新进展', emoji: '📢', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',     icon: Newspaper   },
  { value: 'task',   label: '待办事项', emoji: '📌', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400',  icon: ListTodo    },
  { value: 'update', label: '进度更新', emoji: '🔄', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400', icon: RefreshCw   },
]

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60000)  return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  return `${Math.floor(diff / 86400000)} 天前`
}

const SECTION_OPTIONS = sections.map(s => ({ value: s.id, label: `${s.icon} ${s.titleCN}` }))

export default function AddPage() {
  const [pin, setPin]           = useState('')
  const [authed, setAuthed]     = useState(false)
  const [pinError, setPinError] = useState(false)

  const [sectionId, setSectionId] = useState(sections[0].id)
  const [type, setType]           = useState<FeedItemType>('win')
  const [text, setText]           = useState('')
  const [emoji, setEmoji]         = useState('')
  const [sending, setSending]     = useState(false)
  const [sent, setSent]           = useState(false)
  const [error, setError]         = useState('')

  const [feed, setFeed]         = useState<FeedItem[]>([])
  const [loadingFeed, setLoadingFeed] = useState(true)

  const textRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Check session PIN
    const saved = sessionStorage.getItem('life-pin')
    if (saved === '0107') setAuthed(true)
  }, [])

  useEffect(() => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(d => { setFeed(d.items ?? []); setLoadingFeed(false) })
      .catch(() => setLoadingFeed(false))
  }, [sent])

  function handlePinSubmit() {
    if (pin === '0107') {
      sessionStorage.setItem('life-pin', pin)
      setAuthed(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  async function handleSubmit() {
    if (!text.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, type, text, emoji, pin: '0107' }),
      })
      if (!res.ok) throw new Error('failed')
      setSent(v => !v)
      setText('')
      setEmoji('')
    } catch {
      setError('发送失败，请重试')
    } finally {
      setSending(false)
    }
  }

  // ── PIN Screen ──────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center px-6">
        <div className="w-full max-w-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-[rgb(var(--text-2))]" />
            </div>
            <h1 className="font-bold text-[rgb(var(--text))] text-lg">Life OS · 快速添加</h1>
            <p className="text-sm text-[rgb(var(--text-3))]">输入 PIN 解锁</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              placeholder="PIN"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(false) }}
              onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
              className={cn(
                'w-full px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-mono rounded-2xl border bg-white/[0.03] text-[rgb(var(--text))] outline-none',
                pinError
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/[0.08] focus:border-white/[0.2]'
              )}
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-red-400 text-center">PIN 不正确</p>
            )}
            <button
              onClick={handlePinSubmit}
              className="w-full py-3.5 rounded-2xl bg-[rgb(var(--text))] text-[rgb(var(--bg))] font-semibold text-sm transition-opacity active:opacity-70"
            >
              解锁
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main UI ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Life OS</span>
          </Link>
          <div className="h-4 w-px bg-[rgb(var(--border))]" />
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-[rgb(var(--text))]">快速添加</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-20">

        {/* ── Input Card ── */}
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-white/[0.01] overflow-hidden">

          {/* Section picker */}
          <div className="px-4 pt-4 pb-3 border-b border-[rgb(var(--border))]">
            <p className="text-xs text-[rgb(var(--text-3))] mb-2 font-medium uppercase tracking-wider">板块</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
              {SECTION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSectionId(opt.value)}
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                    sectionId === opt.value
                      ? 'bg-[rgb(var(--text))] text-[rgb(var(--bg))]'
                      : 'bg-white/[0.04] text-[rgb(var(--text-2))] hover:bg-white/[0.08]'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type picker */}
          <div className="px-4 pt-3 pb-3 border-b border-[rgb(var(--border))]">
            <p className="text-xs text-[rgb(var(--text-3))] mb-2 font-medium uppercase tracking-wider">类型</p>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border text-xs font-medium transition-all',
                      type === opt.value
                        ? opt.color
                        : 'border-transparent text-[rgb(var(--text-2))] hover:bg-white/[0.04]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="leading-none">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Text input */}
          <div className="px-4 pt-3">
            <textarea
              ref={textRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={
                type === 'win'    ? '例：完成了 MIT PI 联系邮件' :
                type === 'news'   ? '例：Silora 新客户询单 3 个' :
                type === 'task'   ? '例：需要更新简历中的 ZODIAC 经历' :
                                    '例：O-1 签证进度 10% → 15%'
              }
              rows={3}
              className="w-full bg-transparent text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Emoji + send */}
          <div className="px-4 pb-4 flex items-center gap-3">
            <input
              type="text"
              value={emoji}
              onChange={e => setEmoji(e.target.value.slice(0, 2))}
              placeholder="🎯"
              className="w-12 h-9 text-center text-lg bg-white/[0.04] rounded-xl border border-[rgb(var(--border))] outline-none"
            />
            <p className="text-xs text-[rgb(var(--text-3))] flex-1">可选 emoji</p>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || sending}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                text.trim() && !sending
                  ? 'bg-[rgb(var(--text))] text-[rgb(var(--bg))] active:scale-95'
                  : 'bg-white/[0.04] text-[rgb(var(--text-3))] cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
              {sending ? '发送中…' : '添加'}
            </button>
          </div>

          {error && (
            <p className="px-4 pb-3 text-xs text-red-400">{error}</p>
          )}
        </div>

        {/* ── Recent Feed ── */}
        <div>
          <p className="text-xs font-medium text-[rgb(var(--text-3))] uppercase tracking-wider mb-3">最近动态</p>
          {loadingFeed ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 rounded-2xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          ) : feed.length === 0 ? (
            <p className="text-sm text-[rgb(var(--text-3))] text-center py-8">暂无动态</p>
          ) : (
            <div className="space-y-2">
              {feed.slice(0, 15).map(item => {
                const sec = sections.find(s => s.id === item.sectionId)
                const typeOpt = TYPE_OPTIONS.find(t => t.value === item.type)
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-[rgb(var(--border))]"
                  >
                    <span className="text-xl leading-none mt-0.5 shrink-0">
                      {item.emoji || typeOpt?.emoji || '📝'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[rgb(var(--text))] leading-snug">{item.text}</p>
                      <p className="text-xs text-[rgb(var(--text-3))] mt-1">
                        {sec?.icon} {sec?.titleCN ?? item.sectionId}
                        <span className="mx-1.5">·</span>
                        {timeAgo(item.ts)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
