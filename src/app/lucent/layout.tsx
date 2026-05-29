import type { Metadata } from 'next'

const SITE = 'https://lucentstudio.co'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Lucent Studio — Websites That Win You Customers | Web Designer',
  description:
    'Lucent Studio designs fast, beautiful, high-converting websites for local businesses and brands. Custom sites, redesigns & landing pages built to turn visitors into customers. Free consult.',
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
      priceRange: '$$',
      areaServed: 'United States',
      founder: { '@type': 'Person', name: 'Luke' },
      serviceType: ['Web Design', 'Web Development', 'Landing Pages', 'SEO', 'Website Maintenance'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why do I need a website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A website is the first place people check before they trust you with their money. It makes you look established, works as a 24/7 salesperson that books leads while you sleep, and lets you show up on Google when people search for what you do. Without one, those customers find your competitor instead.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does a website cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Basic plan is $300 to build plus $30/month for hosting, updates and support. The Pro plan is $900 to build plus $50/month for multi-page sites, advanced interaction and full SEO. The Premium plan is $1,400 plus $70/month for unlimited pages, e-commerce, custom integrations and ongoing growth.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between the plans?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Basic ($300, then $30/mo) is a single-page site to get online fast with a lead form and basic SEO. Pro ($900, then $50/mo) adds multiple pages, advanced animation, full SEO with schema and analytics. Premium ($1,400, then $70/mo) is the complete package with unlimited pages, e-commerce, custom booking integrations, A/B testing and same-day support.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to build a website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most sites launch in about one day. Larger projects depend on scope, but I keep timelines tight and communicate every step.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you handle hosting and maintenance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every plan includes hosting, security, uptime and content updates so you never have to think about it.',
          },
        },
      ],
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
