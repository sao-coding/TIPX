import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { Teacher } from '@/types'
import getTeacher from '@/utils/teacher'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? (await cookies()).get('year')?.value
  const sem = searchParams.get('sem') ?? (await cookies()).get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  const teacher: Teacher = await getTeacher(
    userid ?? '',
    year ?? '',
    sem ?? '',
    req.nextUrl.searchParams.get('type') ?? '',
    req.nextUrl.searchParams.get('course') ?? ''
  )

  return NextResponse.json(teacher)
}
