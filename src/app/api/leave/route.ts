// 請假
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

import getAuth from '@/lib/get-auth'
import { Course, Leave, LeaveItem, LeaveItemCheck } from '@/types'
import getCourse from '@/utils/course'
import getCourseTeacher from '@/utils/course-teacher'
import getCurrentYearSem from '@/utils/current-year-sem'
import getGender from '@/utils/gender'

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
    let [year, month, day] = date.split('-')
    // 2023 - 1911
    return `${Number(year) - 1911}${month}${day}`
  }
  return ''
}

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value

  const leaveDate: Leave = {
    start: '',
    end: '',
    type: [],
    leave: {
      date: '',
      list: []
    }
  }

  const leaveItemCheck: LeaveItemCheck[] = []

  if (req.nextUrl.searchParams.has('date')) {
    // 判斷當前學期
    const { currentYear, currentSem } = getCurrentYearSem()

    // 過往學期無法請假
    if (currentYear !== year || currentSem !== sem) {
      return NextResponse.json(
        {
          status: 'error',
          message: '過往學期無法請假'
        },
        {
          status: 400
        }
      )
    }

    let bodyContent = `TDate=${formatDate('TIP', req.nextUrl.searchParams.get('date') ?? '')}`
    const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_absrec.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/stu_absrec.php'
      },
      body: bodyContent
    })

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)
    const $ = cheerio.load(html)

    leaveDate.start = formatDate(
      'TIPX',
      $(
        '#AutoNumber4 > tbody > tr:nth-child(2) > td > div > select > option:nth-child(2)'
      ).text() ?? ''
    )

    leaveDate.end = formatDate(
      'TIPX',
      $('#AutoNumber4 > tbody > tr:nth-child(2) > td > div > select > option:last-child').text() ??
        ''
    )

    // 判斷男女假別
    leaveDate.type =
      (await (await getGender(userid ?? '')).gender) === '男'
        ? ['病假', '事假']
        : ['病假', '事假', '生理假']

    // 請假日期
    leaveDate.leave.date = req.nextUrl.searchParams.get('date') ?? ''

    // 快取 課堂資訊和老師名稱 減少請求次數
    let cacheCourseTeacher = {
      courseId: '',
      courseName: '',
      teacher: ''
    }

    // 第一節 ~ 第十四節
    for (let i = 1; i <= 14; i++) {
      const item = $(
        `#AutoNumber4 > tbody > tr:nth-child(3) > td > div > p:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(${i + 2}) > font`
      )

      const name = item.find('input').attr('name') ?? ''
      const value = item.find('input').attr('value') ?? ''
      // 有 input 然後沒有 checked 屬性 等於 true
      // 沒有 input 等於 false
      const checked =
        item.find('input').length > 0 && item.find('input').attr('checked') === undefined
          ? true
          : false

      // ======================== 實作快取 ========================
      // console.log(
      //   'leave 目前的老師',
      //   cacheTeacher.courseId,
      //   cacheTeacher.courseName,
      //   cacheTeacher.teacher
      // )
      // 如果 cacheTeacher.course 與 course.id 不同，則重新取得課程及老師
      if (cacheCourseTeacher.courseId !== value && value !== '') {
        // console.log('leave 重新取得課程及老師')
        cacheCourseTeacher.courseId = value
        cacheCourseTeacher.courseName = (
          (await getCourse(userid ?? '', year ?? '', sem ?? '', value)) as Course
        ).course
        cacheCourseTeacher.teacher = await getCourseTeacher(
          userid ?? '',
          year ?? '',
          sem ?? '',
          value
        )
      }
      // ======================== 實作快取 ========================

      leaveDate.leave.list.push({
        status: checked,
        id: i,
        courseID: value,
        teacher: cacheCourseTeacher.teacher ?? '',
        name: cacheCourseTeacher.courseName ?? '',
        value: name
      })
    }

    // courseId 是空字串的 teacher 欄位清空
    leaveDate.leave.list.forEach((item) => {
      if (item.courseID === '') {
        item.teacher = ''
        item.name = ''
      }
    })

    // return NextResponse.json(html)
  }

  if (req.nextUrl.searchParams.has('month')) {
    const getMonthLeave = async (month: string) => {
      const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_absrec.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
          Referer: 'https://netinfo.takming.edu.tw/tip/stu_absrec.php'
        },
        body: 'StuDate=' + month
        // body: `StuDate=${i.toString().padStart(2, "0")}`,
      })

      const buffer = await res.arrayBuffer()
      const html = new TextDecoder('big5').decode(buffer)
      const $ = cheerio.load(html)

      const leaveLength = $('#AutoNumber4 > tbody > tr:nth-child(4) > td > table > tbody tr').length

      for (let i = 2; i <= leaveLength; i++) {
        const item = $(
          `#AutoNumber4 > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(${i})`
        )

        // const status = ['已核可', '審核中', '請來談', '退件']

        // 處理狀態並推入 leaveItemCheck 陣列
        if (item.find('td:nth-child(2)').length > 0) {
          leaveItemCheck.push({
            id: item.find('a').attr('href')?.split('rowid=')[1] ?? '',
            type: item.find('td:nth-child(2)').text().trim() ?? '',
            date: item.find('td:nth-child(3)').text().trim() ?? '',
            course: item.find('td:nth-child(4)').text().trim() ?? '',
            teacher: item.find('td:nth-child(5)').text().trim() ?? '',
            section: item.find('td:nth-child(6)').text().trim() ?? '',
            // TODO:請假證明文件 td:nth-child(7)
            status: item.find('td:nth-child(8)').text().trim() ?? ''
          })
        }
      }
    }
    if (req.nextUrl.searchParams.get('month') === 'all') {
      for (let i = 1; i <= 12; i++) {
        await getMonthLeave(i.toString().padStart(2, '0'))
      }
    } else {
      await getMonthLeave(req.nextUrl.searchParams.get('month') ?? '')
    }
    return NextResponse.json(leaveItemCheck)
  }
  return NextResponse.json(leaveDate)
}

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value

  const TypeList: { [key: string]: string } = {
    病假: '2',
    事假: '3',
    生理假: 'H'
  }

  const { type, date, leaveType, list } = await req.json()
  if (type === 'leave') {
    const bodyContent = `TDate=${formatDate('TIP', date)}&AbsType=${TypeList[leaveType]}&${list
      .map((item: LeaveItem) => `${item.id}=${item.value}`)
      .join('&')}`
    console.log(bodyContent)
    // application/x-www-form-urlencoded
    // const bodyContent =

    const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_absrec.php?mode=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/stu_absrec.php'
      },
      body: bodyContent
    })
    if (!res.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: '請假失敗'
        },
        {
          status: 400
        }
      )
    }

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)
    const $ = cheerio.load(html)

    // html 裡面若含有 請假日期有誤,請依正常程序請假!! 則回傳錯誤
    if (html.includes('請假日期有誤,請依正常程序請假!!')) {
      return NextResponse.json(
        {
          status: 'error',
          message: '超過可請假日期範圍'
        },
        {
          status: 400
        }
      )
    }

    return NextResponse.json({ status: 'success', message: '請假成功' })
  }
}

export const DELETE = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const userid = searchParams.get('userid') ?? auth?.userId
  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value

  const { id } = await req.json()
  const res = await fetch(
    `https://netinfo.takming.edu.tw/tip/stu_absrec.php?type=3&rgno=${userid}&rowid=${id}`,
    {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/stu_absrec.php'
      }
    }
  )
  if (!res.ok) {
    return NextResponse.error()
  }
  return NextResponse.json({ status: 'success' })
}
