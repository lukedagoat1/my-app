// Known custom domains per SITE (only add once a domain is actually attached in Vercel).
const KNOWN_DOMAINS: Record<string, string> = {
  lucent: 'https://lucent-studios.com',
  crystal: 'https://crystaldetailing.com',
}

// Demo/scratch brands that should never be indexed.
const DEMO_SITES = new Set(['gblendz'])

export function siteBaseUrl(): string {
  const site = process.env.SITE
  if (site && KNOWN_DOMAINS[site]) return KNOWN_DOMAINS[site]
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`
  return 'http://localhost:3000'
}

export function isDemoSite(): boolean {
  return !!process.env.SITE && DEMO_SITES.has(process.env.SITE)
}
