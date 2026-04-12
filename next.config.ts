import type { NextConfig } from 'next'
import path from 'path'

const LIFEOS_ROOT = path.join(process.env.HOME ?? '', 'Desktop', 'life-os', 'life-os-yuetong')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  images: {
    unoptimized: true,
  },
  // Expose LIFEOS_ROOT to server-side code
  env: {
    LIFEOS_ROOT,
  },
}

export default nextConfig
