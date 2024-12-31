import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    const basicAuth = process.env.BASIC_AUTH

    if (!basicAuth) {
      console.error('BASIC_AUTH environment variable is not set')
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    if (!authHeader || authHeader !== `Basic ${basicAuth}`) {
      return new NextResponse('Auth required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-1/:path*', '/api/admin/:path*'],
}
