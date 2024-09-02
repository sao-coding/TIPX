// 操行成績
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getConduct from '@/utils/conduct'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

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
