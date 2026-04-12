import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '7px',
        boxShadow: '0 2px 8px rgba(124,58,237,0.5)',
      }}
    >
      <span style={{ color: 'white', fontSize: 22, fontWeight: 800, fontFamily: 'system-ui' }}>
        L
      </span>
    </div>,
    { ...size }
  )
}
