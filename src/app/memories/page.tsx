'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Camera, MapPin, Calendar, Heart, ImageOff, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

// Static memories (always shown)
interface Memory {
  id: string
  title: string
  titleCN: string
  date: string
  location: string
  emoji: string
  tags: string[]
  color: string
  description: string
  liked: boolean
  photoFile?: string   // file path for /api/serve-image
}

const STATIC_MEMORIES: Memory[] = [
  {
    id: 'dji',
    title: 'DJI Farewell',
    titleCN: 'DJI 离职合影',
    date: '2026-03',
    location: '深圳, 中国',
    emoji: '✈️',
    tags: ['同事', '里程碑', '深圳'],
    color: 'from-sky-500 to-blue-600',
    description: '在 DJI 的最后岁月，与同事们的珍贵合影。开启人生新章。',
    liked: true,
  },
  {
    id: 'un-map',
    title: 'UN Crisis Mapping',
    titleCN: 'UN 危机地图',
    date: '2026-02',
    location: 'Remote / New York',
    emoji: '🗺️',
    tags: ['UN', 'GIS', '项目'],
    color: 'from-emerald-500 to-teal-600',
    description: '为 UNOCC 创建危机地图，数据可视化服务全球人道主义行动。',
    liked: true,
  },
  {
    id: 'ballet',
    title: 'Ballet',
    titleCN: '芭蕾',
    date: '2025',
    location: 'New York, USA',
    emoji: '🩰',
    tags: ['芭蕾', '艺术', '坚持'],
    color: 'from-pink-500 to-rose-600',
    description: '舞台上的每一步都是心血的结晶。',
    liked: true,
  },
  {
    id: 'mit',
    title: 'MIT Summer Research (upcoming)',
    titleCN: 'MIT 暑研 (即将)',
    date: '2026-Summer',
    location: 'Cambridge, MA',
    emoji: '🎓',
    tags: ['学术', 'MIT', '未来'],
    color: 'from-red-500 to-rose-600',
    description: '即将开始的 MIT 暑研，期待学术旅程的新篇章。',
    liked: false,
  },
]

const PLACE_LABELS: Record<string, { titleCN: string; location: string; description: string; tags: string[] }> = {
  'vienna1.png':    { titleCN: '维也纳 · 城市', location: '维也纳, 奥地利', description: '欧洲艺术之都，音乐与建筑的完美融合。', tags: ['旅行', '欧洲', '建筑'] },
  'vienna2.gif':    { titleCN: '维也纳 · 夜晚', location: '维也纳, 奥地利', description: '维也纳夜色，灯光与古典建筑交织。',       tags: ['旅行', '欧洲', '夜景'] },
  'stockholm.png':  { titleCN: '斯德哥尔摩',    location: '斯德哥尔摩, 瑞典', description: '北欧设计之城，湖光水色间的宁静之美。', tags: ['旅行', '北欧', '设计'] },
  'US.PNG':         { titleCN: '美国',           location: 'USA',            description: '在美国的生活与冒险。',                  tags: ['生活', '美国'] },
  'beijing.png':    { titleCN: '北京',           location: '北京, 中国',      description: '故乡的记忆，历史与现代的交汇。',       tags: ['旅行', '中国', '故乡'] },
}

interface PhotoItem {
  file: string
  name: string
  folder: string
  label: string
  emoji: string
}

const ALL_TAGS = Array.from(new Set([
  ...STATIC_MEMORIES.flatMap(m => m.tags),
  '旅行', '欧洲', '北欧',
]))

export default function MemoriesPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [likedOnly, setLikedOnly] = useState(false)
  const [memories, setMemories] = useState<Memory[]>(STATIC_MEMORIES)
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then(({ photos: raw }: { photos: PhotoItem[] }) => {
        setPhotos(raw)

        // Turn travel photos into additional memories
        const placePhotos = raw.filter(p => p.folder.includes('places'))
        const extra: Memory[] = placePhotos.map(p => {
          const info = PLACE_LABELS[p.name] ?? {
            titleCN: p.name.replace(/\.[^.]+$/, ''),
            location: '未知地点',
            description: '',
            tags: ['旅行'],
          }
          return {
            id: `photo-${p.file}`,
            title: info.titleCN,
            titleCN: info.titleCN,
            date: '2024–2025',
            location: info.location,
            emoji: '📍',
            tags: info.tags,
            color: 'from-violet-500 to-indigo-600',
            description: info.description,
            liked: false,
            photoFile: p.file,
          }
        })
        setMemories(prev => {
          const ids = new Set(prev.map(m => m.id))
          return [...prev, ...extra.filter(e => !ids.has(e.id))]
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleLike = (id: string) =>
    setMemories(prev => prev.map(m => m.id === id ? { ...m, liked: !m.liked } : m))

  const filtered = memories.filter(m => {
    if (likedOnly && !m.liked) return false
    if (activeTag && !m.tags.includes(activeTag)) return false
    return true
  })

  const uniqueTags = Array.from(new Set(memories.flatMap(m => m.tags)))

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[rgb(var(--bg))]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 md:px-10 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Camera className="w-4 h-4 text-sky-400" />
          <h1 className="font-semibold text-[rgb(var(--text))] text-sm">摄影回忆</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setLikedOnly(!likedOnly)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors',
                likedOnly
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/[0.04] border border-white/[0.06] text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', likedOnly && 'fill-current')} />
              收藏
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-10 pt-7 space-y-6">

        {/* Hero */}
        <div className="text-center py-4">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            珍贵时刻 · 美好回忆
          </h2>
          <p className="text-[rgb(var(--text-2))] mt-2 text-sm">
            {loading
              ? '正在加载本地照片…'
              : `共 ${memories.length} 个回忆 · ${photos.length} 张照片`}
          </p>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              activeTag === null
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'bg-white/[0.04] border border-white/[0.06] text-[rgb(var(--text-2))] hover:border-sky-400/40'
            )}
          >
            全部 ({memories.length})
          </button>
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activeTag === tag
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-white/[0.04] border border-white/[0.06] text-[rgb(var(--text-2))] hover:border-sky-400/40'
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[rgb(var(--text-2))]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">读取本地照片…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(memory => (
              <div
                key={memory.id}
                className={cn(
                  'group relative bg-white/[0.02] rounded-2xl overflow-hidden',
                  'border border-white/[0.06] hover:border-white/[0.12]',
                  'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300'
                )}
              >
                {/* Image / gradient header */}
                <div className={cn(
                  'relative h-44 bg-gradient-to-br flex items-center justify-center',
                  !memory.photoFile && memory.color
                )}>
                  {memory.photoFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/serve-image?file=${encodeURIComponent(memory.photoFile)}`}
                      alt={memory.titleCN}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedPhoto(`/api/serve-image?file=${encodeURIComponent(memory.photoFile!)}`)}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <span className="text-6xl opacity-80">{memory.emoji}</span>
                  )}

                  {/* Like button */}
                  <button
                    onClick={() => toggleLike(memory.id)}
                    className={cn(
                      'absolute top-3 right-3 p-2 rounded-full transition-all',
                      memory.liked
                        ? 'bg-white/90 text-red-500'
                        : 'bg-black/20 text-white/70 hover:bg-white/90 hover:text-red-500'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', memory.liked && 'fill-current')} />
                  </button>

                  {/* No photo indicator */}
                  {!memory.photoFile && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/20 text-white/60 text-xs">
                      <ImageOff className="w-3 h-3" />
                      待添加
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-[rgb(var(--text))]">{memory.titleCN}</h3>
                  <div className="flex items-center gap-3 mt-1.5 mb-2.5 text-xs text-[rgb(var(--text-2))]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{memory.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{memory.location}
                    </span>
                  </div>
                  {memory.description && (
                    <p className="text-xs text-[rgb(var(--text-2))] leading-relaxed line-clamp-2 mb-3">
                      {memory.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {memory.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-white/[0.05] border border-white/[0.06] text-[rgb(var(--text-2))]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedPhoto}
            alt="全屏预览"
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  )
}
