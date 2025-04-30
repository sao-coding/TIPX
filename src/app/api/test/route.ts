import { cookies as cookieStore } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signJwtToken, verifyJwt } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  const cookies = await cookieStore()
  const refreshToken = await signJwtToken({ userId: 'D11019139' }, { expiresIn: '1d' })

  cookies.set('refreshToken', refreshToken)

  const accessToken = await signJwtToken({ userId: 'D11019139' }, { expiresIn: '9999d' })

  cookies.set('accessToken', accessToken)

  return NextResponse.json({ message: '給予token成功', refreshToken, accessToken })
}

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const accessToken = searchParams.get('accessToken')
  // 從 headers 取得 accessToken Bearer
  // const accessToken = headers(req).get('authorization')

  if (accessToken && (await verifyJwt(accessToken))) {
    return NextResponse.json({ message: '驗證成功' })
  }

  return NextResponse.json({ message: '驗證失敗' }, { status: 401 })
}
