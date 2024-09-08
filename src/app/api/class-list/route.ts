import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getClassList from '@/utils/class-list'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const classList = await getClassList(userid ?? '')

  return NextResponse.json(classList)
}
