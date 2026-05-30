import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://crystaldetailing.com'),
  title: 'Crystal Detailing — Mobile Car Detailing in Allen, TX',
  description:
    "Allen, TX's 4.8-star mobile car detailing. We come to you. Interior, exterior & premium packages — $50 OFF your first detail. Book in seconds: (469) 653-8552.",
  keywords: [
    'car detailing Allen TX',
    'mobile detailing',
    'interior detailing',
    'exterior detailing',
    'ceramic wash',
    'Crystal Detailing',
  ],
  openGraph: {
    title: 'Crystal Detailing — Mobile Car Detailing in Allen, TX',
    description: 'We come to you. 4.8-star mobile detailing in Allen, TX. $50 OFF your first detail.',
    images: ['/work/hero-car.jpg'],
    type: 'website',
  },
}

export default function CrystalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
