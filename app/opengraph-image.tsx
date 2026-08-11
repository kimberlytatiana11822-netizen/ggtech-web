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
          background: '#000000',
          color: '#fafafa',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(600px circle at 20% 10%, rgba(255,255,255,0.15), transparent 60%), radial-gradient(600px circle at 90% 90%, rgba(255,255,255,0.06), transparent 60%)',
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
          ARTIGAS<span style={{ color: '#a3a3a3' }}>SHOP</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#a3a3a3',
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
