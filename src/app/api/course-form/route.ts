import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getCourseForm from '@/utils/course-form'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const courseFormList = await getCourseForm(userid ?? '')

  return NextResponse.json({
    status: 'success',
    message: '獲取課程問卷清單成功',
    data: courseFormList
  })
}
