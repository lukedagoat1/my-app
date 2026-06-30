import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// SITE env var tells each Vercel project which app to serve at root.
// Sara's Trading Post (the (store) route group) is the natural root — its pages
// live at /, /shop, /cart, etc., so its Vercel project sets NO SITE var.
// Every OTHER brand is its own route segment and its Vercel project sets SITE=<key>
// so middleware rewrites that project's "/" to the right app. This keeps each
// client's domain isolated to its own site.
// DO NOT CHANGE THESE ROUTES.
const SITE_ROUTES: Record<string, string> = {
  lucent:  '/lucent',
  gblendz: '/gblendz',
  crystal: '/crystal',
  lumina:  '/lumina',
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
