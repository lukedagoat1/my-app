import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Each Vercel project sets SITE to redirect the root to its own app.
// NO SITE var = root shows Crystal Detailing (default).
const SITE_ROUTES: Record<string, string> = {
  lucent:  '/lucent',
  gblendz: '/gblendz',
  crystal: '/crystal',
  lumina:  '/quiz',
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') return NextResponse.next()
  const site = process.env.SITE
  const target = (site && SITE_ROUTES[site]) ? SITE_ROUTES[site] : SITE_ROUTES.lumina
  return NextResponse.redirect(new URL(target, request.url))
}

export const config = {
  matcher: '/',
}
