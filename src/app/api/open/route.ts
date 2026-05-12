import { exec } from 'child_process'
import { NextResponse } from 'next/server'
import path from 'path'

const LIFEOS_ROOT = '/Users/mayuetong/Desktop/life-os/life-os-yuetong'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const rel = searchParams.get('path')
  if (!rel) return NextResponse.json({ error: 'missing path' }, { status: 400 })

  const fullPath = rel.startsWith('/') ? rel : path.join(LIFEOS_ROOT, rel)

  // Prevent path traversal outside LIFEOS_ROOT
  const resolved = path.resolve(fullPath)
  if (!resolved.startsWith(LIFEOS_ROOT) && !resolved.startsWith('/Users/mayuetong/Desktop')) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  exec(`open "${resolved}"`)
  return NextResponse.json({ ok: true, path: resolved })
}
