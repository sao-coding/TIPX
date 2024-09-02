import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { FinalGradeRankClass } from '@/types'
import getDeptRank from '@/utils/dept-rank'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value

  const classid = searchParams.get('classid')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const deptRankList: FinalGradeRankClass[] = await getDeptRank(
    userid ?? '',
    year ?? '',
    sem ?? '',
    classid ?? '0'
  )

  return NextResponse.json(deptRankList)
}
