import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sharp & Co. Barbershop — Precision Cuts in Plano, TX',
  description:
    'Sharp & Co. Barbershop delivers precision fades, tapers and beard work in Plano, TX. Mobile and in-home services available. Call 111-111-1111.',
  openGraph: {
    title: 'Sharp & Co. Barbershop — Precision Cuts in Plano, TX',
    description: 'Precision fades, tapers and beard work. Mobile services available in Plano, TX.',
    type: 'website',
  },
}

export default function GblendzLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
