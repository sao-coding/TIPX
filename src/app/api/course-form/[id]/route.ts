import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import getCourseForm from '@/utils/course-form'
// const CoursePage = (props: { params: Promise<{ id: string }> }) => {
export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const { id } = await params

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId

  const courseForm = await getCourseForm(userid ?? '', id)

  return NextResponse.json({
    status: 'success',
    message: '獲取課程問卷清單成功',
    data: courseForm
  })
}

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const body = await req.json()
  // https://netinfo.takming.edu.tw/tip/grade/grade_course_ans.php
  // body = {
  //     "CLASS_NO": "D1231",
  //     "STAFF_ID": "0003059",
  //     "OP_NO": "D123114",
  //     "RGNO": "D11150104",
  //     "DIVCODE": "1",
  //     "S_YEAR": "113",
  //     "S_SEM": "2",
  //     "rowid": "3065086",
  //     "q1": "B",
  //     "q2": "A",
  //     "q3": "B",
  //     "q4": "C",
  //     "q5": "C"
  // }
  // body 加上 RGNO 和 DIVCODE
  body.RGNO = auth?.userId || ''
  body.DIVCODE = 1

  console.log('body', new URLSearchParams(body).toString())
  const res = await fetch('https://netinfo.takming.edu.tw/tip/grade/grade_course_ans.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // body 迴圈輸出
    body: new URLSearchParams(body)
  })
  console.log('course-form res', await res.text())
  if (!res.ok) {
    return NextResponse.json(
      {
        status: 'error',
        message: '填寫課程問卷失敗'
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    status: 'success',
    message: '填寫課程問卷成功'
  })
}
