import { authMiddleware, redirectToSignIn } from '@clerk/nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { i18nRouter } from 'next-i18n-router'

import { i18nConfig } from './i18nConfig'

export function intlMiddleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig)
}

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  afterAuth: (auth, req) => {
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next()
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({
        returnBackUrl: req.url
      })
    }

    return NextResponse.next()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
