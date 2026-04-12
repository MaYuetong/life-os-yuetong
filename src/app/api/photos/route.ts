import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const LIFEOS_ROOT =
  process.env.LIFEOS_ROOT ??
  path.join(process.env.HOME ?? '', 'Desktop', 'life-os', 'life-os-yuetong')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'])

const PHOTO_FOLDERS = [
  { folder: 'personal-resume-website/website/places', label: '旅行', emoji: '✈️' },
  { folder: 'personal-resume-website/website',        label: '个人照片', emoji: '🪞' },
  { folder: 'Ballet',                                  label: '芭蕾', emoji: '🩰' },
]

export async function GET() {
  const results: {
    file: string
    name: string
    folder: string
    label: string
    emoji: string
  }[] = []

  for (const { folder, label, emoji } of PHOTO_FOLDERS) {
    const dir = path.join(LIFEOS_ROOT, folder)
    try {
      const entries = await fs.readdir(dir)
      for (const entry of entries) {
        const ext = path.extname(entry)
        if (!IMAGE_EXT.has(ext)) continue
        results.push({
          file: `${folder}/${entry}`,
          name: entry,
          folder,
          label,
          emoji,
        })
      }
    } catch {
      // folder missing — skip silently
    }
  }

  return NextResponse.json({ photos: results, total: results.length })
}
