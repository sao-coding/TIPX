import { cookies as cookieStore } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signJwtToken, verifyJwt } from '@/lib/jwt'
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

  if (refreshToken) {
    // 重新簽
    console.log('refreshToken', refreshToken.userId)
    const user = await prisma.user.findUnique({
      where: {
        id: refreshToken.userId || ''
      }
    })

    const accessToken = await signJwtToken(
      {
        type: 'access',
        userId: refreshToken.userId,
        role: user?.role || 'USER'
      },
      {
        expiresIn: '10s'
      }
    )

    const cookies = await cookieStore()
    cookies.set('accessToken', accessToken)

    return NextResponse.json({ accessToken })
  } else {
    return NextResponse.json({ message: 'refresh token is invalid' }, { status: 401 })
  }
}
