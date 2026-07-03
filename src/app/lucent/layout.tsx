import type { Metadata } from 'next'
import { faqs } from './faq-data'

const SITE = 'https://www.lucent-studios.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Lucent Studio — Websites That Win You Customers | Web Designer',
  description:
    'Fast, high-converting websites for local businesses — custom sites, redesigns and landing pages built to turn visitors into customers. Free consult.',
  keywords: [
    'web designer',
    'website design',
    'freelance web developer',
    'small business website',
    'landing page design',
    'website redesign',
    'Next.js developer',
    'high converting website',
  ],
  alternates: { canonical: SITE },
  openGraph: {
    title: 'Lucent Studio — Websites That Win You Customers',
    description:
      'Fast, beautiful, conversion-focused websites for businesses and brands. Built by Luke.',
    url: SITE,
    siteName: 'Lucent Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucent Studio — Websites That Win You Customers',
    description: 'Conversion-focused web design by Luke.',
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE}#business`,
      name: 'Lucent Studio',
      description:
        'Conversion-focused web design and development for local businesses and brands.',
      url: SITE,
      image: `${SITE}/lucent/opengraph-image`,
      priceRange: '$$',
      areaServed: 'United States',
      founder: { '@type': 'Person', name: 'Luke' },
      serviceType: ['Web Design', 'Web Development', 'Landing Pages', 'SEO', 'Website Maintenance'],
      sameAs: ['https://www.instagram.com/lucentsites/'],
    },
    {
      '@type': 'FAQPage',
      // Generated from the same faqs array rendered on the page — keep these in sync
      // or Google can revoke FAQ rich-result eligibility for mismatched structured data.
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function LucentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
