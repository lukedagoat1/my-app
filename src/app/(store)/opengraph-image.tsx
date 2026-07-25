import { ImageResponse } from 'next/og'

// Branded Open Graph image — without this, links shared to Sara's store
// (texts, Facebook, iMessage) show up as plain text with no preview at all.
export const alt = "Sara's Trading Post — Authentic Luxury Beauty, Resold with Love"
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
          backgroundColor: '#faf6f1',
          backgroundImage:
            'radial-gradient(900px 500px at 82% 15%, rgba(231,196,203,0.55), transparent 60%), radial-gradient(700px 500px at 8% 100%, rgba(231,211,161,0.40), transparent 55%)',
          color: '#2a211d',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '30px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '999px',
              background: '#7a2f43',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: '#e7d3a1',
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: '24px', letterSpacing: '5px', color: '#7a2f43', fontWeight: 700 }}>
            SARA&apos;S TRADING POST
          </div>
        </div>
        <div style={{ fontSize: '70px', fontWeight: 800, lineHeight: 1.08, maxWidth: '980px' }}>
          Luxury beauty, resold with love.
        </div>
        <div style={{ fontSize: '28px', color: '#6c5d54', marginTop: '26px', maxWidth: '880px' }}>
          100% authentic prestige makeup, skincare &amp; fragrance — 99.8% positive across 79,000+ orders.
        </div>
      </div>
    ),
    size
  )
}
