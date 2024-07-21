// 點名
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { JSDOM } from 'jsdom'

import authOptions from '@/lib/auth'
import { PostRollCall, RollCall } from '@/types'
import getTeacher from '@/utils/teacher'

const formatDate = (type: string, date: string) => {
  // 112.09.11(一) to 2023-09-11
  if (type === 'TIPX') {
    let [year, month, day] = date.split('.')
    // 去除 (X)
    try {
      day = day.replace(/\(.+\)/, '')
    } catch (error) {
      return ''
    }
    return `${Number(year) + 1911}-${month}-${day}`
  }
  if (type === 'TIP') {
    // 2023-09-11 to 1120911
    console.log(date)
    let [year, month, day] = date.split('-')
    // 2023 - 1911
    return `${Number(year) - 1911}${month}${day}`
  }
  return ''
}

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = (
    await getTeacher(
      session?.user.studentID ?? '',
      year ?? '',
      sem ?? '',
      'course',
      searchParams.get('course') ?? ''
    )
  ).id

  const res = await fetch('https://netinfo.takming.edu.tw/tip/tea_absrec.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: `cookie_userid=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
      Referer: 'https://netinfo.takming.edu.tw/tip/tea_absrec.php'
    },
    body: new URLSearchParams({
      TClass: searchParams.get('course') ?? '',
      TDate: formatDate('TIP', req.nextUrl.searchParams.get('date') ?? '')
    })
  })

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('big5').decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  const start = formatDate(
    'TIPX',
    document.querySelector(
      '#AutoNumber2 > tbody > tr > td:nth-child(2) > select > option:nth-child(2)'
    )?.textContent ?? ''
  )

  const end = formatDate(
    'TIPX',
    document.querySelector(
      '#AutoNumber2 > tbody > tr > td:nth-child(2) > select > option:last-child'
    )?.textContent ?? ''
  )

  const studentList: RollCall['students'] = []
  const studentListLength = Array.from(
    document.querySelectorAll('#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr')
  ).length

  for (let i = 2; i <= studentListLength; i++) {
    const id =
      document
        .querySelector(
          `#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > input[type=text]`
        )
        ?.getAttribute('name') ?? ''
    const stuID =
      document
        .querySelector(
          `#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > input[type=text]`
        )
        ?.getAttribute('value') ?? ''
    const name =
      document
        .querySelector(
          `#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > input[type=text]`
        )
        ?.getAttribute('value') ?? ''
    const gender =
      document
        .querySelector(
          `#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${i}) > td:nth-child(4) > input[type=text]`
        )
        ?.getAttribute('value') ?? ''

    const absenceListLength = Array.from(
      document.querySelectorAll(
        `#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${i}) > td > input[type=checkbox]`
      )
    ).length

    const absenceList = []

    for (let j = 0; j < absenceListLength; j++) {
      const absenceCheckbox = document.querySelector(
        `#AutoNumber4 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${i}) > td:nth-child(${
          j + 5
        }) > input[type=checkbox]`
      ) as HTMLInputElement | null
      const id = absenceCheckbox?.getAttribute('name') ?? ''
      const status = absenceCheckbox?.checked ? true : false
      const disabled = absenceCheckbox?.getAttribute('disabled') ? true : false

      absenceList.push({
        id,
        status,
        disabled
      })
    }

    studentList.push({
      id,
      stuID,
      name,
      gender,
      absence: absenceList
    })
  }

  return NextResponse.json({
    start,
    end,
    students: studentList
  })
}

export const POST = async (req: NextRequest) => {
  const { course, date, count, list } = (await req.json()) as PostRollCall
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = (
    await getTeacher(session?.user.studentID ?? '', year ?? '', sem ?? '', 'course', course)
  ).id

  const bodyContent = new URLSearchParams({
    TClass: course,
    TDate: formatDate('TIP', date),
    StuCount: count.toString()
  })

  for (const { id, stuID, absence } of list) {
    bodyContent.append(id, stuID)
    for (const { id: absenceID, status } of absence) {
      bodyContent.append(absenceID, status ? '1' : '')
    }
  }

  console.log(bodyContent.toString())

  const res = await fetch('https://netinfo.takming.edu.tw/tip/tea_absrec.php?mode=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: `cookie_userid=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
      Referer: 'https://netinfo.takming.edu.tw/tip/tea_absrec.php'
    },
    body: bodyContent
  })

  if (!res.ok) {
    return NextResponse.json({
      status: 'error',
      message: '點名失敗'
    })
  } else {
    return NextResponse.json({
      status: 'success',
      message: '點名成功'
    })
  }
}
