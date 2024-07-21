import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import authOptions from '@/lib/auth'
import { FinalGradeRank } from '@/types'
import getFinalGrade from '@/utils/final-grade'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? session?.user.studentID

  // type class or all

  // final-grade-rank?type=class&year=110&sem=1

  const finalGradeRankList: FinalGradeRank[] = await getFinalGrade(
    userid ?? '',
    year ?? '',
    sem ?? ''
  )

  return NextResponse.json(finalGradeRankList)
}
