import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getLineID from '@/utils/lineid'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const lineid = await getLineID(userid ?? '')

  return NextResponse.json(lineid)
}
