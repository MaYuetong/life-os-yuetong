import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const LIFEOS_ROOT =
  process.env.LIFEOS_ROOT ??
  path.join(process.env.HOME ?? '', 'Desktop', 'life-os', 'life-os-yuetong')

/**
 * GET /api/serve-html?file=personal-resume-website/website/index.html
 *
 * Serves any HTML file from the lifeos-yuetong directory.
 * Path is sanitised to prevent directory traversal.
 */
export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('file') ?? ''

  if (!file) {
    return new NextResponse('Missing ?file= param', { status: 400 })
  }

  // Sanitise — resolve and confirm it stays inside LIFEOS_ROOT
  const resolved = path.resolve(LIFEOS_ROOT, file)
  if (!resolved.startsWith(LIFEOS_ROOT)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Only serve HTML files
  if (!resolved.endsWith('.html')) {
    return new NextResponse('Only .html files allowed', { status: 400 })
  }

  try {
    let html = await fs.readFile(resolved, 'utf-8')

    // Rewrite relative asset paths so they resolve correctly inside the iframe.
    // We inject a <base> tag pointing to the file's own directory via our proxy.
    const fileDir = path.dirname(file).replace(/\\/g, '/')
    const baseHref = `/api/serve-asset?dir=${encodeURIComponent(fileDir)}&file=`

    // Add base tag just after <head> (or at the start of <html>)
    if (html.includes('<head>')) {
      html = html.replace(
        '<head>',
        `<head><base href="${baseHref}">`
      )
    } else {
      html = `<base href="${baseHref}">` + html
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch {
    return new NextResponse('File not found', { status: 404 })
  }
}
