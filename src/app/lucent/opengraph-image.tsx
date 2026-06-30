import { ImageResponse } from 'next/og'

// Branded Open Graph image for the Lucent Studio route. Generated at build
// time so every shared lucentstudio.co link shows a Lucent preview — not a
// stale/cached image from another site deployed to the same URL.
export const alt = 'Lucent Studio — Websites That Win You Customers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#070a12',
          backgroundImage:
            'radial-gradient(900px 500px at 78% 18%, rgba(56,189,248,0.22), transparent 60%), radial-gradient(700px 500px at 10% 100%, rgba(99,102,241,0.18), transparent 55%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              display: 'flex',
            }}
          />
          <div style={{ fontSize: '26px', letterSpacing: '6px', color: '#7dd3fc' }}>LUCENT STUDIO</div>
        </div>
        <div style={{ fontSize: '78px', fontWeight: 800, lineHeight: 1.05, maxWidth: '950px' }}>
          Websites that win you customers.
        </div>
        <div style={{ fontSize: '30px', color: '#9fb3c8', marginTop: '28px', maxWidth: '880px' }}>
          Fast, beautiful, conversion-focused web design for local businesses — built by Luke.
        </div>
        <div style={{ display: 'flex', marginTop: '46px', fontSize: '24px', color: '#38bdf8' }}>
          lucentstudio.co
        </div>
      </div>
    ),
    size
  )
}
