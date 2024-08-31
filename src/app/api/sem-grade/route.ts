import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getSemGrade from '@/utils/sem-grade'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  const semGrade = await getSemGrade(userid ?? '', year ?? '', sem ?? '')
  // console.log({ semScore })

  return NextResponse.json(semGrade)
}
