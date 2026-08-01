import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getGraduationStandard from '@/utils/graduation-standard'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const graduationStandard = await getGraduationStandard(userid ?? '')

  return NextResponse.json({
    status: 'success',
    message: '獲取畢業標準成功',
    data: graduationStandard
  })
}
