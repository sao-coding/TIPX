import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getCredit from '@/utils/credit'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  const credit = await getCredit(userid ?? '', year ?? '', sem ?? '')

  return NextResponse.json(credit)
}
