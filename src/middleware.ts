import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// SITE env var tells each Vercel project which app to serve at root.
// Lumina is the natural root — no SITE var needed for that project.
// DO NOT CHANGE THESE ROUTES.
const SITE_ROUTES: Record<string, string> = {
  lucent:  '/lucent',
  gblendz: '/gblendz',
  crystal: '/crystal',
}

export function middleware(request: NextRequest) {
  const site = process.env.SITE
  if (site && SITE_ROUTES[site] && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL(SITE_ROUTES[site], request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
