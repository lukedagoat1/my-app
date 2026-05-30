'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  slot: 'quiz' | 'analysis'
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdBanner({ slot: _slot }: AdBannerProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not loaded yet
    }
  }, [])

  return (
    <div className="w-full overflow-hidden" style={{ minHeight: '100px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8671336417372021"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
