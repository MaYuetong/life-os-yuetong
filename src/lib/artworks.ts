// ── Museum Art Library ──────────────────────────────────────────────
// Store artworks visited at museums with notes + photos

import { kv } from '@vercel/kv'

export interface Artwork {
  id: string
  museum: string        // "The Metropolitan Museum of Art"
  artworkName: string   // "Water Lilies"
  artist: string        // "Claude Monet"
  artistDates?: string  // "1840–1926"
  year?: string         // "1906"
  medium?: string       // "Oil on canvas"
  department?: string   // "European Paintings"
  dateVisited: string   // "2026-05-15"
  photoUrl?: string     // Vercel Blob URL or external URL
  notes: string         // Personal feelings / study notes
  tags: string[]        // ["impressionism", "landscape", "favorite"]
  rating: number        // 1–5
  createdAt: number     // timestamp
}

const LIST_KEY  = 'life:artworks'                          // sorted set by createdAt
const ITEM_KEY  = (id: string) => `life:artwork:${id}`

export async function getArtworks(): Promise<Artwork[]> {
  try {
    // Get all IDs sorted by score (timestamp) descending
    const ids = await kv.zrange(LIST_KEY, 0, -1, { rev: true })
    if (!ids.length) return SAMPLE_ARTWORKS

    const items = await Promise.all(
      ids.map(id => kv.get<Artwork>(ITEM_KEY(String(id))))
    )
    const valid = items.filter(Boolean) as Artwork[]
    return valid.length ? valid : SAMPLE_ARTWORKS
  } catch {
    return SAMPLE_ARTWORKS
  }
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  try {
    return await kv.get<Artwork>(ITEM_KEY(id))
  } catch {
    return null
  }
}

export async function saveArtwork(artwork: Artwork): Promise<void> {
  await kv.set(ITEM_KEY(artwork.id), artwork)
  await kv.zadd(LIST_KEY, { score: artwork.createdAt, member: artwork.id })
}

export async function deleteArtwork(id: string): Promise<void> {
  await kv.del(ITEM_KEY(id))
  await kv.zrem(LIST_KEY, id)
}

// ── Sample data (shown when KV is empty) ──────────────────────────────
export const SAMPLE_ARTWORKS: Artwork[] = [
  {
    id: 'sample-1',
    museum: 'The Metropolitan Museum of Art',
    artworkName: 'Madame X (Madame Pierre Gautreau)',
    artist: 'John Singer Sargent',
    artistDates: '1856–1925',
    year: '1883–84',
    medium: 'Oil on canvas',
    department: 'American Paintings and Sculpture',
    dateVisited: '2026-05-10',
    photoUrl: '',
    notes: '当时看到这幅画的第一感觉是一种难以言说的神秘感。那件黑色礼服和她傲慢的姿态，像是在挑衅整个社会规范。细看才发现肩带滑落——原来这正是当年引发丑闻的部分，Sargent 后来才把它修正。艺术史上的"scandal" 往往也是最动人的叙事。',
    tags: ['portraiture', 'american', 'scandal', 'fashion', 'sargent'],
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 11,
  },
  {
    id: 'sample-2',
    museum: 'The Metropolitan Museum of Art',
    artworkName: 'Washington Crossing the Delaware',
    artist: 'Emanuel Leutze',
    artistDates: '1816–1868',
    year: '1851',
    medium: 'Oil on canvas',
    department: 'American Wing',
    dateVisited: '2026-04-22',
    photoUrl: '',
    notes: '这幅画尺寸惊人，站在面前真的有一种被淹没的感觉。画面中的冰块和黑暗水面与英雄主义的构图形成强烈对比——战争从来不是壮丽的，但人们需要这样的图像来凝聚信念。有趣的是它其实是在德国画的，描绘美国历史。',
    tags: ['american history', 'large-scale', 'heroism', 'war'],
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 29,
  },
  {
    id: 'sample-3',
    museum: 'MoMA',
    artworkName: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    artistDates: '1904–1989',
    year: '1931',
    medium: 'Oil on canvas',
    department: 'Painting and Sculpture',
    dateVisited: '2026-03-15',
    photoUrl: '',
    notes: '比想象中小很多，但越近看越有震撼力。软化的时钟其实是对时间本质的质疑——时间是客观存在的还是我们主观建构的？作为 GIS 研究者，时间与空间的关系对我来说格外有共鸣。梦境里的逻辑是另一套坐标系。',
    tags: ['surrealism', 'dali', 'time', 'moma', 'famous'],
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 67,
  },
]

// Museums autocomplete list
export const MUSEUM_PRESETS = [
  'The Metropolitan Museum of Art',
  'MoMA – Museum of Modern Art',
  'The Frick Collection',
  'Guggenheim Museum',
  'Whitney Museum of American Art',
  'Brooklyn Museum',
  'The Cloisters',
  'New Museum',
  'The Morgan Library & Museum',
  'National Museum of Natural History',
  'The Smithsonian',
  'Louvre',
  'Musée d\'Orsay',
  'Centre Pompidou',
  'Tate Modern',
  'British Museum',
  'National Gallery (London)',
  'Uffizi Gallery',
]
