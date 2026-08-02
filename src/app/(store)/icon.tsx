import { ImageResponse } from 'next/og'

// Browser-tab favicon for the store — was falling back to Next.js's generic
// default icon. Matches Logo.tsx (wax-seal medallion, wine + gold).
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#7a2f43',
          border: '2px solid #e7d3a1',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: '34px',
            color: '#e7d3a1',
          }}
        >
          S
        </div>
      </div>
    ),
    size
  )
}
