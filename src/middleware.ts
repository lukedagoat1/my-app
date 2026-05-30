import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Each Vercel project sets SITE to redirect the root to its own app.
// NO SITE var = root shows Crystal Detailing (default).
const SITE_ROUTES: Record<string, string> = {
  lucent:  '/lucent',
  gblendz: '/gblendz',
  crystal: '/crystal',
  lumina:  '/lumina',
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
