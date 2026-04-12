import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const LIFEOS_ROOT =
  process.env.LIFEOS_ROOT ??
  path.join(process.env.HOME ?? '', 'Desktop', 'life-os', 'life-os-yuetong')

const MIME: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.JPG':  'image/jpeg',
  '.JPEG': 'image/jpeg',
  '.png':  'image/png',
  '.PNG':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.WEBP': 'image/webp',
}

/**
 * GET /api/serve-image?file=personal-resume-website/website/places/vienna1.png
 */
export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('file') ?? ''
  if (!file) return new NextResponse('Missing ?file=', { status: 400 })

  const resolved = path.resolve(LIFEOS_ROOT, file)
  if (!resolved.startsWith(LIFEOS_ROOT)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const ext = path.extname(resolved)
  const contentType = MIME[ext] ?? 'application/octet-stream'

  try {
    const buf = await fs.readFile(resolved)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
