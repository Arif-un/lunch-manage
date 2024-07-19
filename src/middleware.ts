import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

import { getSession } from './lib/auth'

/**
 * Middleware function to handle authentication for protected routes.
 *
 * This function checks if there's an active session. If there's no session
 * and the requested path is not the login page, it redirects to the login page.
 * Otherwise, it allows the request to proceed.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const session = await getSession()
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const headers = new Headers(request.headers)
  headers.set('x-current-path', request.nextUrl.pathname)
  return NextResponse.next({
    request: {
      headers
    }
  })
}

/**
 * Configuration object for the middleware.
 *
 * This object specifies which routes the middleware should be applied to.
 * The current configuration applies the middleware to all routes except those
 * starting with 'api', '_next/static', '_next/image', or 'favicon.ico'.
 * @type {object}
 * @property {string[]} matcher - An array of path patterns to match.
 */
export const config: { matcher: string[] } = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
