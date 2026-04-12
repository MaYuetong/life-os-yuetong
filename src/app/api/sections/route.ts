import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { sections } from '@/lib/sections'

const LIFEOS_ROOT = process.env.LIFEOS_ROOT ??
  path.join(process.env.HOME ?? '~', 'Desktop', 'life-os', 'life-os-yuetong')

/**
 * GET /api/sections — returns sections with live folder info
 */
export async function GET() {
  const enriched = await Promise.all(
    sections.map(async (s) => {
      const folderPath = path.join(LIFEOS_ROOT, s.folderName)
      let fileCount = 0
      let exists = false
      try {
        const entries = await fs.readdir(folderPath)
        fileCount = entries.length
        exists = true
      } catch {
        // folder doesn't exist yet
      }

      return {
        ...s,
        folderPath,
        folderExists: exists,
        fileCount,
      }
    })
  )

  return NextResponse.json({ sections: enriched })
}
