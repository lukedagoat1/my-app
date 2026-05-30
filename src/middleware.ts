import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Each Vercel project sets SITE so the root URL shows the right app.
// Lumina is the default root (no SITE var needed for that project).
const SITE_ROUTES: Record<string, string> = {
  lucent:  '/lucent',
  gblendz: '/gblendz',
  crystal: '/crystal',
}

export function middleware(request: NextRequest) {
  const site = process.env.SITE
  if (site && SITE_ROUTES[site] && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(SITE_ROUTES[site], request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
