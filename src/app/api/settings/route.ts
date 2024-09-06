import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const settings = await prisma.userSettings.findFirst({
    where: {
      userId: userid
    }
  })

  return NextResponse.json(settings)
}

export const PATCH = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const data = await req.json()

  const settings = await prisma.userSettings.upsert({
    where: {
      userId: userid
    },
    update: data,
    create: {
      ...data,
      userId: userid
    }
  })

  if (settings) {
    return NextResponse.json({ message: '更新成功' })
  } else {
    return NextResponse.json({ message: '更新失敗' }, { status: 400 })
  }
}
