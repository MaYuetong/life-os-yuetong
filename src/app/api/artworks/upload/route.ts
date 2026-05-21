import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const pin = req.headers.get('x-pin')
  if (pin !== (process.env.LIFE_PIN ?? '0107')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if Vercel Blob is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Blob not configured', hint: 'Add BLOB_READ_WRITE_TOKEN in Vercel dashboard → Storage → Blob' },
      { status: 503 }
    )
  }

  try {
    const { put } = await import('@vercel/blob')
    const form = await req.formData()
    const file = form.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    // Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `artworks/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
