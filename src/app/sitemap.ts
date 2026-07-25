import type { MetadataRoute } from 'next'
import { siteBaseUrl, isDemoSite } from '@/lib/seo'
import { products } from '@/lib/products'
import { readListings } from '@/lib/listings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isDemoSite()) return []

  const base = siteBaseUrl()
  const site = process.env.SITE
  const now = new Date()

  // Single-page marketing brands: just the home page.
  if (site === 'lucent' || site === 'crystal' || site === 'lumina') {
    return [{ url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 }]
  }

  // No SITE set = Sara's Trading Post (the store, natural root).
  const { custom, hidden } = await readListings()
  const productUrls: MetadataRoute.Sitemap = [
    ...products.filter((p) => !hidden.includes(p.id)),
    ...custom,
  ].map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ...productUrls,
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/policies`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
