import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Lumina — AI Skin Analysis',
  description: 'Personalized skin analysis powered by AI. Understand your skin and get tailored recommendations.',
  openGraph: {
    title: 'Lumina — AI Skin Analysis',
    description: 'Personalized skin analysis powered by AI.',
    type: 'website',
  },
}

export default function LuminaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Was in the root layout, loading on every brand including Sara's Trading
          Post's checkout pages — scoped to Lumina only, where it belongs. */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671336417372021"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {children}
    </>
  )
}
