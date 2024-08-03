import { NextRequest, NextResponse } from 'next/server'

import { verifyJwt } from '@/lib/jwt'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.split('Bearer ')[1]

  if (accessToken && verifyJwt(accessToken)) {
    return NextResponse.json({ message: '驗證成功' })
  } else {
    return NextResponse.json({ message: '驗證失敗' }, { status: 401 })
  }
}

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const accessToken = searchParams.get('accessToken')
  // 從 headers 取得 accessToken Bearer
  // const accessToken = headers(req).get('authorization')

  if (accessToken && verifyJwt(accessToken)) {
    return NextResponse.json({ message: '驗證成功' })
  }

  return NextResponse.json({ message: '驗證失敗' }, { status: 401 })
}
