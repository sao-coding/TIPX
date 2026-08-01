import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { ClassName } from '@/types'
import getClassName from '@/utils/class-name'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? (await cookies()).get('year')?.value

  const className: ClassName = await getClassName(userid ?? '', year ?? '')

  return NextResponse.json(className)
}
