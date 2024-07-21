import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { MiddlewareFactory } from './types'

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (req.nextUrl.pathname.startsWith('/api')) {
      console.log('middleware: api')
      if (
        // req.nextUrl.pathname.startsWith("/api/og") ||
        // req.nextUrl.pathname.startsWith("/api/post") ||
        // req.nextUrl.pathname.startsWith("/api/auth") ||
        // req.nextUrl.pathname.startsWith("/api/git-log")
        req.nextUrl.pathname.startsWith('/api')
      ) {
        // return 這個return會造成 withHeaders.ts 的設定無效
      } else if (!nextAuthToken) {
        return NextResponse.json(
          {
            error: 'Unauthorized'
          },
          {
            status: 401
          }
        )
      }
      // timetable course user
    } else if (
      req.nextUrl.pathname.startsWith('/timetable') ||
      req.nextUrl.pathname.startsWith('/forum') ||
      req.nextUrl.pathname.startsWith('/course') ||
      req.nextUrl.pathname.startsWith('/user')
    ) {
      if (!nextAuthToken) {
        console.log('middleware: no token')
        return NextResponse.redirect(
          new URL(`/login?redirect=${req.nextUrl.pathname}`, req.nextUrl)
        )
      }
    }
    return next(req, _next)
  }
}
