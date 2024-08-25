// 缺曠請假紀錄
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { CourseAttendanceRecord, CourseAttendanceRecordTotal } from '@/types'
import getCourseAttendanceRecord from '@/utils/course-attendance-record'
import getAuth from '@/lib/get-auth'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId
  const type = searchParams.get('type') ?? 'normal'
  const course = searchParams.get('course') ?? ''

  const courseAttendanceRecordAll: CourseAttendanceRecord | CourseAttendanceRecordTotal =
    await getCourseAttendanceRecord(userid ?? '', year ?? '', sem ?? '', type ?? '')

  // 取得courseID的請假數
  if (req.nextUrl.searchParams.get('course')) {
    const courseAttendanceRecord: CourseAttendanceRecord = (await getCourseAttendanceRecord(
      userid ?? '',
      year ?? '',
      sem ?? '',
      type ?? '',
      course
    )) as CourseAttendanceRecord
    return NextResponse.json(courseAttendanceRecord)
  }

  return NextResponse.json(courseAttendanceRecordAll)
}
