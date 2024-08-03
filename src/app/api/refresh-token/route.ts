import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signJwtAccessToken, verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  type RefreshToken = {
    type: 'refresh'
    userId: string
  }
  // 驗證 refresh token 是否有效
  const refreshToken = (await verifyJwt(
    req.cookies.get('refreshToken')?.value || ''
  )) as RefreshToken
  console.log('refreshToken', refreshToken.userId)

  if (refreshToken) {
    // 重新簽
    const user = await prisma.user.findUnique({
      where: {
        userId: refreshToken.userId || ''
      }
    })

    const accessToken = await signJwtAccessToken(
      {
        type: 'access',
        userId: refreshToken.userId,
        role: user?.role || 'USER'
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
