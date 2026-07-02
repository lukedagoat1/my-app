import type { MetadataRoute } from 'next'
import { siteBaseUrl, isDemoSite } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  if (isDemoSite()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  const base = siteBaseUrl()
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
