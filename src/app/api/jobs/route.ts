import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

const LIFEOS_ROOT = process.env.LIFEOS_ROOT ??
  path.join(process.env.HOME ?? '~', 'Desktop', 'life-os', 'life-os-yuetong')

const JOB_CSV = path.join(LIFEOS_ROOT, '08-job-hunting', 'applications.csv')

export async function GET() {
  try {
    const csv = await fs.readFile(JOB_CSV, 'utf-8')
    const lines = csv.trim().split('\n')
    const headers = lines[0].split(',').map((h) => h.trim())
    const rows = lines.slice(1).map((line, i) => {
      const values = line.split(',')
      return {
        id: String(i + 1),
        ...Object.fromEntries(headers.map((h, j) => [h, values[j]?.trim() ?? ''])),
      }
    })
    return NextResponse.json({ jobs: rows })
  } catch {
    return NextResponse.json({ jobs: [], message: 'CSV not found yet' })
  }
}

export async function POST(req: NextRequest) {
  const { jobs } = await req.json()
  const headers = ['公司', '职位', '投递日', '状态', '跟进', '链接']
  const rows = (jobs as Record<string, string>[]).map((j) =>
    [j['公司'], j['职位'], j['投递日'], j['状态'], j['跟进'], j['链接']].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')

  try {
    await fs.mkdir(path.dirname(JOB_CSV), { recursive: true })
    await fs.writeFile(JOB_CSV, csv, 'utf-8')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
