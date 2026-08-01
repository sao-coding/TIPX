import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getCredit from '@/utils/credit'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? (await cookies()).get('year')?.value
  const sem = searchParams.get('sem') ?? (await cookies()).get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  const credit = await getCredit(userid ?? '', year ?? '', sem ?? '')

  return NextResponse.json(credit)
}
