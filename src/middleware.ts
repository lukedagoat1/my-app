import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Each Vercel project sets SITE to its own value so the root URL
// redirects to the correct app. Existing paths (e.g. /gblendz, /lucent)
// always work regardless of this variable.
const SITE_ROUTES: Record<string, string> = {
  lucent:   '/lucent',
  gblendz:  '/gblendz',
  lumina:   '/quiz',
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
