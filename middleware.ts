import { NextRequest, NextResponse } from 'next/server'

const protectedPaths = ['/admin', '/studio']

function unauthorized(message = 'Authentication required') {
  return new NextResponse(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Cliniq Maastricht Admin", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (!isProtected) return NextResponse.next()

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse('Admin area is locked until ADMIN_USERNAME and ADMIN_PASSWORD are configured in Vercel.', {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }

  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Basic ')) return unauthorized()

  let username = ''
  let password = ''

  try {
    const encodedCredentials = authorization.slice('Basic '.length)
    const decodedCredentials = atob(encodedCredentials)
    const separatorIndex = decodedCredentials.indexOf(':')

    if (separatorIndex === -1) return unauthorized('Invalid admin credentials')

    username = decodedCredentials.slice(0, separatorIndex)
    password = decodedCredentials.slice(separatorIndex + 1)
  } catch {
    return unauthorized('Invalid admin credentials')
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return unauthorized('Invalid admin credentials')
  }

  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/studio/:path*'],
}
