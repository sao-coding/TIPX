import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'
import { Student } from '@prisma/client'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  let search = (searchParams.get('search') ?? '').toUpperCase()
  const id = searchParams.get('id') ?? '0'
  const limit = searchParams.get('limit') ?? '10'

  // prisma 尋找 user 資料表裡的 userid 若等於 session 裡的 user.studentID 則回傳 user 資料表裡的 id 若沒有則回傳 沒有權限
  // console.log(session?.user.studentID)
  let type = 'simple'
  // console.log(auth)
  // 判斷是否找到

  if (auth?.role === 'USER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 若包含有 + 就是詳細搜尋 格式 學號+性別+姓名

  // studentList 預設 三個空字串
  let studentList: string[] = ['', '', '']
  console.log(search)
  if (search.includes(' ')) {
    type = 'complex'
    for (let i = 0; i < studentList.length; i++) {
      studentList[i] = search.split(' ')[i]
    }
  }

  let student: Student[] = []

  if (search.length > 0) {
    if (type === 'simple') {
      search = `%${search}%`
      student =
        await prisma.$queryRaw`SELECT * FROM Student WHERE userid LIKE ${search} OR name LIKE ${search} ORDER BY FIELD(SUBSTRING(userid, 1,1), 'D', 'C', 'M', 'N','K'), userid ASC LIMIT ${id}, ${limit}`
    } else if (type === 'complex') {
      // 若有 undefined 則不加入搜尋條件
      console.log(studentList)
      for (let i = 0; i < studentList.length; i++) {
        if (studentList[i] === undefined || studentList[i] === '') {
          studentList[i] = '%'
        } else {
          studentList[i] = `%${studentList[i]}%`
        }
      }
      console.log(studentList)
      student =
        await prisma.$queryRaw`SELECT * FROM Student WHERE (userid LIKE ${studentList[0]} AND gender LIKE ${studentList[1]} AND name LIKE ${studentList[2]}) ORDER BY FIELD(SUBSTRING(userid, 1,1), 'D', 'C', 'M', 'N','K'), userid ASC LIMIT ${id}, ${limit}`
    }
  }

  return NextResponse.json(student)
}
