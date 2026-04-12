import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}
    >
      <span style={{ color: 'white', fontSize: 100, fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>
        L
      </span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, fontFamily: 'system-ui', letterSpacing: 4 }}>
        LIFE OS
      </span>
    </div>,
    { ...size }
  )
}
