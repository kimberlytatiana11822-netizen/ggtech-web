import { ImageResponse } from 'next/og'

export const alt = 'Artigas Shop'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0a09',
          color: '#fafaf9',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(600px circle at 20% 10%, rgba(56,189,248,0.35), transparent 60%), radial-gradient(600px circle at 90% 90%, rgba(255,255,255,0.12), transparent 60%)',
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: -2,
            display: 'flex',
          }}
        >
          Artigas<span style={{ color: '#f97316' }}> Shop</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#a8a29e',
            marginTop: 16,
            display: 'flex',
          }}
        >
          Tecnología, cocina y más en un solo lugar.
        </div>
      </div>
    ),
    size,
  )
}
