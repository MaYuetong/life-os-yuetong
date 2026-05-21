import { NextRequest, NextResponse } from 'next/server'
import { getArtworks, saveArtwork, deleteArtwork, type Artwork } from '@/lib/artworks'

export const dynamic = 'force-dynamic'

export async function GET() {
  const artworks = await getArtworks()
  return NextResponse.json({ artworks })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { pin, ...data } = body

  if (pin !== (process.env.LIFE_PIN ?? '0107')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const artwork: Artwork = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    museum: data.museum || '',
    artworkName: data.artworkName || '',
    artist: data.artist || '',
    artistDates: data.artistDates || '',
    year: data.year || '',
    medium: data.medium || '',
    department: data.department || '',
    dateVisited: data.dateVisited || new Date().toISOString().split('T')[0],
    photoUrl: data.photoUrl || '',
    notes: data.notes || '',
    tags: Array.isArray(data.tags) ? data.tags : (data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    rating: Number(data.rating) || 3,
    createdAt: Date.now(),
  }

  await saveArtwork(artwork)
  return NextResponse.json({ ok: true, artwork })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const pin = searchParams.get('pin')

  if (pin !== (process.env.LIFE_PIN ?? '0107')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await deleteArtwork(id)
  return NextResponse.json({ ok: true })
}
