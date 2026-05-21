'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Star, Camera, X, ChevronDown,
  Search, Lock, Upload, BookOpen, Calendar
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Artwork } from '@/lib/artworks'
import { MUSEUM_PRESETS } from '@/lib/artworks'
import { cn } from '@/lib/utils'

// ── Helpers ──────────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={cn('transition-colors', onChange ? 'cursor-pointer' : 'cursor-default')}
        >
          <Star className={cn('w-4 h-4', n <= value ? 'fill-amber-400 text-amber-400' : 'text-[rgb(var(--border))]')} />
        </button>
      ))}
    </div>
  )
}

// ── Artwork Card ─────────────────────────────────────────────────────
function ArtworkCard({ artwork, onDelete }: { artwork: Artwork; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('删除这条记录？')) return
    setDeleting(true)
    await fetch(`/api/artworks?id=${artwork.id}&pin=0107`, { method: 'DELETE' })
    onDelete(artwork.id)
  }

  return (
    <div className={cn('border border-[rgb(var(--border))] overflow-hidden transition-all', expanded && 'border-[rgb(var(--text-3))]')}>
      {/* Photo */}
      {artwork.photoUrl ? (
        <div className="aspect-[4/3] bg-[rgb(var(--border))] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork.photoUrl}
            alt={artwork.artworkName}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-white/[0.02] flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-[rgb(var(--border))]" />
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[rgb(var(--text))] text-sm leading-tight">{artwork.artworkName}</h3>
            <p className="text-xs text-[rgb(var(--text-2))] mt-0.5">
              {artwork.artist}
              {artwork.year && <span className="text-[rgb(var(--text-3))]"> · {artwork.year}</span>}
            </p>
          </div>
          <StarRating value={artwork.rating} />
        </div>

        {/* Museum + date */}
        <p className="text-[10px] text-[rgb(var(--text-3))] mb-3">
          🏛 {artwork.museum} · {artwork.dateVisited}
        </p>

        {/* Tags */}
        {artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artwork.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 border border-[rgb(var(--border))] text-[rgb(var(--text-3))]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Notes preview / expand */}
        {artwork.notes && (
          <div>
            <p className={cn('text-xs text-[rgb(var(--text-2))] leading-relaxed', !expanded && 'line-clamp-2')}>
              {artwork.notes}
            </p>
            {artwork.notes.length > 100 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-[10px] text-[rgb(var(--text-3))] mt-1 flex items-center gap-0.5 hover:text-[rgb(var(--text))] transition-colors"
              >
                {expanded ? '收起' : '展开'} <ChevronDown className={cn('w-3 h-3 transition-transform', expanded && 'rotate-180')} />
              </button>
            )}
          </div>
        )}

        {/* Delete */}
        {expanded && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-3 text-[10px] text-red-400 hover:text-red-300 transition-colors"
          >
            {deleting ? '删除中…' : '删除这条记录'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Add Form ─────────────────────────────────────────────────────────
function AddForm({ onAdded }: { onAdded: (a: Artwork) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [rating, setRating] = useState(3)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    museum: '', artworkName: '', artist: '', artistDates: '',
    year: '', medium: '', department: '', dateVisited: new Date().toISOString().split('T')[0],
    notes: '', tags: '',
  })

  function setField(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/artworks/upload', {
        method: 'POST',
        headers: { 'x-pin': '0107' },
        body: fd,
      })
      const data = await res.json()
      if (data.url) {
        setPhotoUrl(data.url)
      } else if (data.error === 'Blob not configured') {
        // Blob not set up — just use the preview URL (local only)
        alert('图片上传功能需要配置 Vercel Blob，暂时记录无图片。')
      }
    } catch {
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photoUrl, rating, pin: '0107' }),
    })
    const data = await res.json()
    if (data.artwork) {
      onAdded(data.artwork)
      setOpen(false)
      setForm({ museum: '', artworkName: '', artist: '', artistDates: '', year: '', medium: '', department: '', dateVisited: new Date().toISOString().split('T')[0], notes: '', tags: '' })
      setPhotoUrl('')
      setPhotoPreview('')
      setRating(3)
    }
    setSaving(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-[rgb(var(--text))] text-[rgb(var(--bg))] text-sm font-semibold shadow-xl active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
        <span>记录作品</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgb(var(--bg))]/95 backdrop-blur overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-[rgb(var(--text))] text-lg">记录艺术作品</h2>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors">
            <X className="w-5 h-5 text-[rgb(var(--text-2))]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Photo upload */}
          <div>
            <p className="text-xs text-[rgb(var(--text-3))] mb-2 font-medium uppercase tracking-wider">照片</p>
            <div
              onClick={() => fileRef.current?.click()}
              className={cn(
                'aspect-video border-2 border-dashed border-[rgb(var(--border))] flex flex-col items-center justify-center cursor-pointer hover:border-[rgb(var(--text-3))] transition-colors overflow-hidden',
                photoPreview && 'border-solid border-[rgb(var(--border))]'
              )}
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-[rgb(var(--text-3))] mx-auto mb-2" />
                  <p className="text-xs text-[rgb(var(--text-3))]">点击拍照或从相册选择</p>
                  {uploading && <p className="text-xs text-amber-400 mt-1">上传中…</p>}
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            {/* Or URL */}
            <input
              type="url"
              placeholder="或粘贴图片 URL（Instagram / Google Photos）"
              value={photoUrl}
              onChange={e => { setPhotoUrl(e.target.value); setPhotoPreview(e.target.value) }}
              className="mt-2 w-full px-3 py-2 text-xs bg-white/[0.03] border border-[rgb(var(--border))] text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none"
            />
          </div>

          {/* Museum */}
          <div>
            <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">博物馆 *</label>
            <input
              list="museum-presets"
              required
              value={form.museum}
              onChange={setField('museum')}
              placeholder="The Metropolitan Museum of Art"
              className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none focus:border-[rgb(var(--text-3))] transition-colors"
            />
            <datalist id="museum-presets">
              {MUSEUM_PRESETS.map(m => <option key={m} value={m} />)}
            </datalist>
          </div>

          {/* Artwork + Artist */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">作品名称 *</label>
              <input required value={form.artworkName} onChange={setField('artworkName')} placeholder="Water Lilies"
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">艺术家 *</label>
              <input required value={form.artist} onChange={setField('artist')} placeholder="Claude Monet"
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none" />
            </div>
          </div>

          {/* Year + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">创作年份</label>
              <input value={form.year} onChange={setField('year')} placeholder="1906"
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">参观日期 *</label>
              <input type="date" required value={form.dateVisited} onChange={setField('dateVisited')}
                className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] outline-none" />
            </div>
          </div>

          {/* Medium */}
          <div>
            <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">媒介 / 材料</label>
            <input value={form.medium} onChange={setField('medium')} placeholder="Oil on canvas"
              className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none" />
          </div>

          {/* Rating */}
          <div>
            <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-2">评分</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">观展感受 / 学习笔记</label>
            <textarea
              value={form.notes}
              onChange={setField('notes')}
              placeholder="第一眼看到这幅画的感觉，联想到什么，学到了什么…"
              rows={5}
              className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-[rgb(var(--text-3))] font-medium uppercase tracking-wider block mb-1.5">标签（逗号分隔）</label>
            <input value={form.tags} onChange={setField('tags')} placeholder="impressionism, landscape, favorite"
              className="w-full px-3 py-2.5 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none" />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-[rgb(var(--text))] text-[rgb(var(--bg))] text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {saving ? '保存中…' : '保存到 Library'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterMuseum, setFilterMuseum] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const loadArtworks = useCallback(async () => {
    const res = await fetch('/api/artworks')
    const data = await res.json()
    setArtworks(data.artworks ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadArtworks() }, [loadArtworks])

  const allMuseums = [...new Set(artworks.map(a => a.museum))].filter(Boolean)
  const allTags    = [...new Set(artworks.flatMap(a => a.tags))].filter(Boolean)

  const filtered = artworks.filter(a => {
    if (search && !`${a.artworkName} ${a.artist} ${a.museum} ${a.notes}`.toLowerCase().includes(search.toLowerCase())) return false
    if (filterMuseum !== 'all' && a.museum !== filterMuseum) return false
    if (filterTag !== 'all' && !a.tags.includes(filterTag)) return false
    return true
  })

  function handleAdded(artwork: Artwork) {
    setArtworks(prev => [artwork, ...prev])
  }

  function handleDeleted(id: string) {
    setArtworks(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-full flex items-center gap-3">
          <Link href="/arts" className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> 艺术
          </Link>
          <div className="h-4 w-px bg-[rgb(var(--border))]" />
          <BookOpen className="w-4 h-4 text-rose-400" />
          <h1 className="text-sm font-bold text-[rgb(var(--text))]">博物馆 Library</h1>
          <span className="text-xs text-[rgb(var(--text-3))] hidden sm:block">— {artworks.length} 件作品</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
              className="text-xs px-2.5 py-1 border border-[rgb(var(--border))] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors">
              {view === 'grid' ? '列表' : '网格'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-28">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgb(var(--text-3))]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索作品、艺术家、感受…"
              className="w-full pl-8 pr-3 py-2 bg-white/[0.03] border border-[rgb(var(--border))] text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-3))] outline-none"
            />
          </div>
          <select value={filterMuseum} onChange={e => setFilterMuseum(e.target.value)}
            className="px-3 py-2 bg-white/[0.03] border border-[rgb(var(--border))] text-xs text-[rgb(var(--text-2))] outline-none">
            <option value="all">所有博物馆</option>
            {allMuseums.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {allTags.length > 0 && (
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
              className="px-3 py-2 bg-white/[0.03] border border-[rgb(var(--border))] text-xs text-[rgb(var(--text-2))] outline-none">
              <option value="all">所有标签</option>
              {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mb-6">
          <div>
            <span className="text-lg font-bold text-[rgb(var(--text))]">{artworks.length}</span>
            <span className="text-xs text-[rgb(var(--text-3))] ml-1">件作品</span>
          </div>
          <div className="w-px bg-[rgb(var(--border))]" />
          <div>
            <span className="text-lg font-bold text-[rgb(var(--text))]">{allMuseums.length}</span>
            <span className="text-xs text-[rgb(var(--text-3))] ml-1">个博物馆</span>
          </div>
          {artworks.length > 0 && (
            <>
              <div className="w-px bg-[rgb(var(--border))]" />
              <div>
                <span className="text-lg font-bold text-[rgb(var(--text))]">
                  {(artworks.reduce((s, a) => s + a.rating, 0) / artworks.length).toFixed(1)}
                </span>
                <span className="text-xs text-[rgb(var(--text-3))] ml-1">平均评分</span>
              </div>
            </>
          )}
        </div>

        {/* Grid / List */}
        {loading ? (
          <div className={cn('gap-4', view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'space-y-3')}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={cn('bg-white/[0.02] animate-pulse', view === 'grid' ? 'aspect-[3/4]' : 'h-20')} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-[rgb(var(--border))] p-16 text-center">
            <BookOpen className="w-10 h-10 text-[rgb(var(--border))] mx-auto mb-3" />
            <p className="text-sm text-[rgb(var(--text-3))] mb-1">
              {artworks.length === 0 ? '还没有记录，点击下方按钮开始！' : '没有匹配的作品'}
            </p>
            <p className="text-xs text-[rgb(var(--text-3))]">
              {artworks.length === 0 && '手机拍下喜欢的作品，记录你的观展感受'}
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} onDelete={handleDeleted} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(artwork => (
              <div key={artwork.id} className="flex gap-4 border border-[rgb(var(--border))] p-4">
                {artwork.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={artwork.photoUrl} alt="" className="w-16 h-16 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-white/[0.03] shrink-0 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[rgb(var(--border))]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-[rgb(var(--text))]">{artwork.artworkName}</h3>
                      <p className="text-xs text-[rgb(var(--text-2))]">{artwork.artist} {artwork.year && `· ${artwork.year}`}</p>
                      <p className="text-[10px] text-[rgb(var(--text-3))] mt-0.5">🏛 {artwork.museum} · {artwork.dateVisited}</p>
                    </div>
                    <StarRating value={artwork.rating} />
                  </div>
                  {artwork.notes && (
                    <p className="text-xs text-[rgb(var(--text-2))] mt-1.5 line-clamp-2 leading-relaxed">{artwork.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <AddForm onAdded={handleAdded} />
    </div>
  )
}
