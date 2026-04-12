'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Camera, MapPin, Calendar, Heart, Image as ImageIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

// Memory entries — update with real photos by placing images in /public/memories/
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
  imagePath?: string
  liked: boolean
}

const MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'DJI Farewell Reunion',
    titleCN: 'DJI离职合影',
    date: '2026-03',
    location: '深圳, 中国',
    emoji: '✈️',
    tags: ['同事', '深圳', '里程碑'],
    color: 'from-sky-500 to-blue-600',
    description: '在DJI的最后一段岁月，与同事们的珍贵合影，开启人生新章。',
    liked: true,
  },
  {
    id: '2',
    title: 'Ballet Performance',
    titleCN: '芭蕾演出',
    date: '2025-12',
    location: 'New York, USA',
    emoji: '🩰',
    tags: ['芭蕾', '艺术', '成就'],
    color: 'from-pink-500 to-rose-600',
    description: '舞台上的每一步都是心血的结晶，感谢芭蕾给予我的力量。',
    liked: true,
  },
  {
    id: '3',
    title: 'UN Mapping Project',
    titleCN: 'UN地图项目',
    date: '2026-02',
    location: 'Remote',
    emoji: '🗺️',
    tags: ['UN', 'GIS', '项目'],
    color: 'from-emerald-500 to-teal-600',
    description: '为联合国创建危机地图，数据可视化服务全球人道主义行动。',
    liked: false,
  },
  {
    id: '4',
    title: 'Travel Adventures',
    titleCN: '旅行探索',
    date: '2025',
    location: '多地',
    emoji: '🌍',
    tags: ['旅行', '探索', '摄影'],
    color: 'from-orange-500 to-amber-600',
    description: '用镜头记录每一段旅程，世界如此美丽值得探索。',
    liked: false,
  },
  {
    id: '5',
    title: 'Parent Visa Journey',
    titleCN: '爸妈来美',
    date: '2026',
    location: 'USA',
    emoji: '👨‍👩‍👧',
    tags: ['家庭', '签证', '爱'],
    color: 'from-violet-500 to-purple-600',
    description: '为爸妈申请签证来美国，希望他们能亲眼见证我的生活。',
    liked: true,
  },
  {
    id: '6',
    title: 'MIT Summer Research',
    titleCN: 'MIT暑期研究',
    date: '2026-Summer',
    location: 'Cambridge, MA',
    emoji: '🎓',
    tags: ['学术', 'MIT', '未来'],
    color: 'from-red-500 to-rose-600',
    description: '即将开始的MIT暑研，期待学术之旅的新篇章。',
    liked: false,
  },
]

const ALL_TAGS = Array.from(new Set(MEMORIES.flatMap((m) => m.tags)))

export default function MemoriesPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [likedOnly, setLikedOnly] = useState(false)
  const [memories, setMemories] = useState(MEMORIES)

  const toggleLike = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m))
    )
  }

  const filtered = memories.filter((m) => {
    if (likedOnly && !m.liked) return false
    if (activeTag && !m.tags.includes(activeTag)) return false
    return true
  })

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
          <Camera className="w-5 h-5 text-sky-500" />
          <h1 className="font-bold text-slate-900 dark:text-white">摄影回忆</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setLikedOnly(!likedOnly)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors',
                likedOnly
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', likedOnly && 'fill-current')} />
              收藏
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        {/* Hero */}
        <div className="text-center py-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            珍贵时刻 · 美好回忆
          </h2>
          <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">
            用照片记录生命中每一个值得铭记的瞬间
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              activeTag === null
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-400'
            )}
          >
            全部 ({memories.length})
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activeTag === tag
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-400'
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Memory grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((memory) => (
            <div
              key={memory.id}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            >
              {/* Color / image header */}
              <div
                className={cn(
                  'relative h-40 bg-gradient-to-br flex items-center justify-center',
                  memory.color
                )}
              >
                {memory.imagePath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={memory.imagePath}
                    alt={memory.titleCN}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl opacity-80">{memory.emoji}</div>
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
                  <Heart
                    className={cn('w-4 h-4', memory.liked && 'fill-current')}
                  />
                </button>

                {/* No photo placeholder */}
                {!memory.imagePath && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/20 text-white/70 text-xs">
                    <ImageIcon className="w-3 h-3" />
                    待添加照片
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {memory.titleCN}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mb-2">
                  {memory.title}
                </p>

                <div className="flex items-center gap-3 mb-3 text-xs text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {memory.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {memory.location}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {memory.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add photos instruction */}
        <div className="bg-gradient-to-br from-sky-500/5 to-blue-500/5 border border-sky-200/50 dark:border-sky-800/50 rounded-2xl p-6 text-center">
          <Camera className="w-10 h-10 text-sky-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
            导入更多回忆
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            将照片放入{' '}
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              public/memories/
            </code>{' '}
            文件夹，在上方 Memory 对象中添加{' '}
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              imagePath
            </code>{' '}
            字段即可展示
          </p>
          <p className="text-xs text-slate-400 mt-2">
            硬盘照片路径：
            <code className="font-mono">~/Desktop/life-os/life-os-yuetong/DJI离职合影</code>
          </p>
        </div>
      </div>
    </main>
  )
}
