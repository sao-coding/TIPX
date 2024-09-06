import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { verifyJwt } from '@/lib/jwt'

import { MiddlewareFactory } from './types'

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const refreshToken = req.cookies.get('refreshToken')?.value || ''
    const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    let verify
    console.log(
      `middleware: ${req.nextUrl.pathname} refreshToken: ${refreshToken} accessToken: ${accessToken}`
    )

    verify = await verifyJwt(accessToken)

    // 例外位置
    // req.nextUrl.pathname.startsWith("/api/og") ||
    // req.nextUrl.pathname.startsWith("/api/post") ||
    // req.nextUrl.pathname.startsWith('/api/auth') ||
    // req.nextUrl.pathname.startsWith('/api/refresh-token')
    // req.nextUrl.pathname.startsWith("/api/git-log")
    // req.nextUrl.pathname.startsWith('/api')
    const exception = [
      '/api/og',
      '/api/post',
      '/api/auth',
      '/api/refresh-token',
      '/api/git-log',
      '/api/log',
      '/api/test',
      '/api/image-proxy',
      '/api/get-img-color'
    ]

    if (req.nextUrl.pathname.startsWith('/api')) {
      console.log(`middleware: ${req.nextUrl.pathname} auth: ${JSON.stringify(verify)}`)
      if (exception.some((path) => req.nextUrl.pathname.startsWith(path))) {
        console.log(`middleware: 跳過 ${req.nextUrl.pathname}`)
      } else if (!verify) {
        console.log('middleware: no token')
        return NextResponse.json(
          {
            error: 'Unauthorized'
          },
          {
            status: 401
          }
        )
      }
    }

    verify = await verifyJwt(refreshToken)

    if (
      req.nextUrl.pathname.startsWith('/timetable') ||
      req.nextUrl.pathname.startsWith('/forum') ||
      req.nextUrl.pathname.startsWith('/course') ||
      req.nextUrl.pathname.startsWith('/user')
    ) {
      if (!verify) {
        console.log('middleware: no token')
        return NextResponse.redirect(
          new URL(`/login?redirect=${req.nextUrl.pathname}`, req.nextUrl)
        )
      }
    }
    return next(req, _next)
  }
}
