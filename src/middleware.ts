import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (process.env.SITE === 'lucent' && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/lucent', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
