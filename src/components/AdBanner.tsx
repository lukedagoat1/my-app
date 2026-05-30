'use client'

// Replace this component's content with your Google AdSense ad unit code

interface AdBannerProps {
  slot: 'quiz' | 'analysis'
}

export function AdBanner({ slot }: AdBannerProps) {
  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4"
      style={{
        height: '64px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
      }}
      data-slot={slot}
    >
      <span
        className="text-xs font-semibold tracking-[0.2em] uppercase"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        Sponsored
      </span>
      <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Your ad could appear here
      </span>
    </div>
  )
}
