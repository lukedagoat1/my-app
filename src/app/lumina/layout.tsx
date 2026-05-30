import type { Metadata } from 'next'

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
  return <>{children}</>
}
