import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const dynamic = 'force-dynamic'

export type FeedItemType = 'win' | 'news' | 'task' | 'update'

export interface FeedItem {
  id: string
  ts: number
  sectionId: string
  type: FeedItemType
  text: string
  emoji?: string
}

const FEED_KEY = 'life:feed'
const MAX_ITEMS = 50

// Seed data — shows in dashboard even before user adds anything
const SEED_ITEMS: FeedItem[] = [
  {
    id: 'seed-1',
    ts: Date.now() - 1000 * 60 * 30,
    sectionId: 'admin',
    type: 'win',
    text: '爸妈签证成功获批！',
    emoji: '🎉',
  },
  {
    id: 'seed-2',
    ts: Date.now() - 1000 * 60 * 60 * 2,
    sectionId: 'silora-orient',
    type: 'news',
    text: 'Silora Orient Pop-up event 开放报名',
    emoji: '🌸',
  },
  {
    id: 'seed-3',
    ts: Date.now() - 1000 * 60 * 60 * 5,
    sectionId: 'silora-orient',
    type: 'win',
    text: 'Be My Model 私密邀请页上线 silora-orient.vercel.app/model.html',
    emoji: '✦',
  },
  {
    id: 'seed-4',
    ts: Date.now() - 1000 * 60 * 60 * 24,
    sectionId: 'silora-orient',
    type: 'win',
    text: '定价体系重构完成 + $6 推广码上线',
    emoji: '💰',
  },
  {
    id: 'seed-5',
    ts: Date.now() - 1000 * 60 * 60 * 36,
    sectionId: 'admin',
    type: 'news',
    text: 'Life OS v2 部署到 Vercel 生产环境',
    emoji: '🚀',
  },
]

export async function GET() {
  try {
    const raw = await kv.lrange(FEED_KEY, 0, MAX_ITEMS - 1)
    const items: FeedItem[] = raw.map(r => (typeof r === 'string' ? JSON.parse(r) : r))

    // Merge seed items if feed is empty or doesn't have them
    const existingIds = new Set(items.map(i => i.id))
    const seeds = SEED_ITEMS.filter(s => !existingIds.has(s.id))

    // Store seeds in KV so they persist
    if (seeds.length > 0) {
      for (const seed of seeds) {
        await kv.lpush(FEED_KEY, JSON.stringify(seed))
      }
      // Re-fetch
      const raw2 = await kv.lrange(FEED_KEY, 0, MAX_ITEMS - 1)
      const merged: FeedItem[] = raw2.map(r => (typeof r === 'string' ? JSON.parse(r) : r))
      merged.sort((a, b) => b.ts - a.ts)
      return NextResponse.json({ items: merged })
    }

    items.sort((a, b) => b.ts - a.ts)
    return NextResponse.json({ items })
  } catch {
    // KV unavailable — return seed data
    const sorted = [...SEED_ITEMS].sort((a, b) => b.ts - a.ts)
    return NextResponse.json({ items: sorted })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { sectionId, type, text, emoji, pin } = body

  // Simple PIN protection
  if (pin !== (process.env.LIFE_PIN ?? '9527')) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  if (!sectionId || !type || !text) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const item: FeedItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    sectionId,
    type,
    text: text.trim(),
    emoji: emoji || defaultEmoji(type),
  }

  try {
    await kv.lpush(FEED_KEY, JSON.stringify(item))
    await kv.ltrim(FEED_KEY, 0, MAX_ITEMS - 1)
    return NextResponse.json({ ok: true, item })
  } catch {
    return NextResponse.json({ error: 'KV unavailable' }, { status: 503 })
  }
}

function defaultEmoji(type: FeedItemType): string {
  const map: Record<FeedItemType, string> = {
    win: '✅',
    news: '📢',
    task: '📌',
    update: '🔄',
  }
  return map[type]
}
