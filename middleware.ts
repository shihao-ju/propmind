import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'

const PUBLIC_ROUTES = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes without auth
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Read session cookie
  const cookie = request.cookies.get('propmind-session')?.value
  const session = cookie ? decodeSession(cookie) : null

  // No valid session → redirect to login
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based redirects
  if (session.role === 'tenant' && pathname.startsWith('/dashboard')) {
    const tenantUrl = new URL(
      `/tenant/${session.tenantSlug}`,
      request.url,
    )
    return NextResponse.redirect(tenantUrl)
  }

  if (session.role === 'landlord' && pathname.startsWith('/tenant')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|images/.*|api/.*).*)',
  ],
}
