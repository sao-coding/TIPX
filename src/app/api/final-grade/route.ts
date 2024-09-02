import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { FinalGradeRank } from '@/types'
import getFinalGrade from '@/utils/final-grade'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  // type class or all

  // final-grade-rank?type=class&year=110&sem=1

  const finalGradeRankList: FinalGradeRank[] = await getFinalGrade(
    userid ?? '',
    year ?? '',
    sem ?? ''
  )

  return NextResponse.json(finalGradeRankList)
}
