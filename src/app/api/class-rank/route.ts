import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { FinalGradeRankClass } from '@/types'
import getClassRank from '@/utils/class-rank'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? (await cookies()).get('year')?.value
  const sem = searchParams.get('sem') ?? (await cookies()).get('sem')?.value

  const classRankList: FinalGradeRankClass[] = await getClassRank(
    userid ?? '',
    year ?? '',
    sem ?? ''
  )

  return NextResponse.json(classRankList)
}
