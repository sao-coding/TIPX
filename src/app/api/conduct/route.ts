// 操行成績
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import authOptions from '@/lib/auth'
import getConduct from '@/utils/conduct'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? session?.user.studentID

  let conductList

  // 目前操行
  // req.nextUrl.searchParams.get("year")
  // req.nextUrl.searchParams.get("sem")
  if (req.nextUrl.searchParams.has('year') && req.nextUrl.searchParams.has('sem')) {
    conductList = await getConduct(
      userid ?? '',
      year ?? '',
      sem ?? '',

      'one'
    )
  } else {
    conductList = await getConduct(
      userid ?? '',
      year ?? '',
      sem ?? '',

      'all'
    )
  }

  return NextResponse.json(conductList)
}
