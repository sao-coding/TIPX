import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { verifyJwt } from '@/lib/jwt'

import { MiddlewareFactory } from './types'

export const withAuthorization: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const refreshToken = req.cookies.get('refreshToken')?.value || ''
    // const refreshToken = cookies().get('refreshToken')?.value || ''
    const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    let verifyAccessToken
    let verifyRefreshToken
    console.log(
      `middleware: ${req.nextUrl.pathname} refreshToken: ${refreshToken} accessToken: ${accessToken}`
    )

    verifyAccessToken = await verifyJwt(accessToken)

    // 例外位置
    const exception = [
      '/api/og',
      '/api/post',
      '/api/auth',
      '/api/refresh-token',
      '/api/git-log',
      '/api/analytics',
      '/api/test',
      '/api/get-img-color',
      '/api/download'
    ]

    if (req.nextUrl.pathname.startsWith('/api')) {
      console.log(`middleware: ${req.nextUrl.pathname} auth: ${JSON.stringify(verifyAccessToken)}`)
      if (exception.some((path) => req.nextUrl.pathname.startsWith(path))) {
        console.log(`middleware: 跳過 ${req.nextUrl.pathname}`)
      } else if (!verifyAccessToken) {
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

    verifyRefreshToken = await verifyJwt(refreshToken)
    verifyAccessToken = await verifyJwt(req.cookies.get('accessToken')?.value || '')

    if (
      req.nextUrl.pathname.startsWith('/timetable') ||
      req.nextUrl.pathname.startsWith('/forum') ||
      req.nextUrl.pathname.startsWith('/course') ||
      req.nextUrl.pathname.startsWith('/user') ||
      req.nextUrl.pathname.startsWith('/search') ||
      req.nextUrl.pathname === '/'
    ) {
      if (!verifyRefreshToken && !verifyAccessToken) {
        console.log('middleware: no token')
        return NextResponse.redirect(
          new URL(`/login?redirect=${req.nextUrl.pathname}`, req.nextUrl)
        )
      }
    }
    return next(req, _next)
  }
}
