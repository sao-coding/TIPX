import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signJwtToken, verifyJwt } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  type RefreshToken = {
    type: 'refresh'
    userId: string
  }
  // 驗證 refresh token 是否有效
  const refreshToken = (await verifyJwt(
    req.cookies.get('refreshToken')?.value || ''
  )) as RefreshToken

  if (refreshToken) {
    // 重新簽
    console.log('refreshToken', refreshToken.userId)
    const accessTokenHeader = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    // 解析 accessToken
    type AccessTokenPayload = {
      type: 'access'
      provider: 'credentials' | 'google'
      userId: string
      role: string
    }

    const accessTokenSplit = accessTokenHeader.split('.')[1]

    const accessTokenPayload: AccessTokenPayload = JSON.parse(atob(accessTokenSplit))

    const accessToken = await signJwtToken(
      {
        type: 'access',
        provider: accessTokenPayload.provider,
        userId: refreshToken.userId,
        role: accessTokenPayload.role || 'USER'
      },
      {
        expiresIn: '10s'
      }
    )

    cookies().set('accessToken', accessToken)

    return NextResponse.json({ accessToken })
  } else {
    return NextResponse.json({ message: 'refresh token is invalid' }, { status: 401 })
  }
}
