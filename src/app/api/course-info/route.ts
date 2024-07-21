// 課程資訊
// TODO: 待優化
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import axios from 'axios'
// import { JSDOM } from "jsdom"
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'

import authOptions from '@/lib/auth'
import { CourseInfo } from '@/types'
import getCourseTeacher from '@/utils/course-teacher'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? session?.user.studentID

  const res = await axios.get(
    `https://netinfo.takming.edu.tw/tip/teach/teach_classqry.php?opno=${req.nextUrl.searchParams.get(
      'course'
    )}`,
    {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      },
      responseType: 'arraybuffer',
      transformResponse: [
        (data) => {
          return iconv.decode(data, 'big5')
        }
      ]
    }
  )

  const html = res.data

  // const buffer = await res.arrayBuffer()
  // const html = new TextDecoder("big5").decode(buffer)
  // const dom = new JSDOM(html)
  // const document = dom.window.document

  const $ = cheerio.load(html)

  // 授課教師
  // 必選修別
  // 開課班級
  // 學分數/時數
  // 是否使用外語
  // 是否為遠距課程
  // 講授方法
  // 評量方式
  // 每週授課內容

  const teacher = await getCourseTeacher(
    userid ?? '',
    year ?? '',
    sem ?? '',
    req.nextUrl.searchParams.get('course') ?? ''
  )

  let required =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(5) > td:nth-child(4)'
    )?.textContent ?? ''

  if (required === '必') {
    required = '必修'
  }
  if (required === '選') {
    required = '選修'
  }
  if (required === '通') {
    required = '通識'
  }

  // 開課班級
  const classCode =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(4)'
    )?.textContent ?? ''

  const credit =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(4)'
    )?.textContent ?? ''

  const foreignLanguage =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(6) > td:nth-child(2)'
    )?.textContent ?? ''

  const distanceLearning =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(7) > td:nth-child(2)'
    )?.textContent ?? ''

  const teachingMethod =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(12) > td:nth-child(2) > font'
    )?.textContent ?? ''

  const evaluationMethod =
    document.querySelector(
      '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(13) > td:nth-child(2) > font'
    )?.textContent ?? ''

  // #AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(21) ~ #AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(last-1)

  const start = 20
  // #AutoNumber1 > tbody > tr > td > table > tbody
  const length =
    document.querySelector('#AutoNumber1 > tbody > tr > td > table > tbody')?.children.length ?? 0
  const contentList: CourseInfo['content'] = []

  for (let i = 1; i < length - start; i++) {
    const week =
      document
        .querySelector(
          `#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(${
            start + i
          }) > td:nth-child(1)`
        )
        ?.textContent?.trim() ?? ''
    const content =
      document
        .querySelector(
          `#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(${
            start + i
          }) > td:nth-child(2)`
        )
        ?.textContent?.trim() ?? ''
    const remark =
      document
        .querySelector(
          `#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(${
            start + i
          }) > td:nth-child(3)`
        )
        ?.textContent?.trim() ?? ''

    contentList.push({
      week,
      content,
      remark
    })
  }

  const courseInfo: CourseInfo = {
    teacher,
    required,
    class: classCode,
    credit,
    foreign: foreignLanguage,
    distance: distanceLearning,
    method: teachingMethod,
    assessment: evaluationMethod,
    content: contentList
  }

  return NextResponse.json(courseInfo)
}
