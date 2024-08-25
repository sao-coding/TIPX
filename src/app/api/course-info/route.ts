// 課程資訊
// TODO: 待優化
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
// import { JSDOM } from "jsdom"
import * as cheerio from 'cheerio'
import iconv from 'iconv-lite'

import { CourseInfo } from '@/types'
import getCourseTeacher from '@/utils/course-teacher'
import getAuth from '@/lib/get-auth'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  const searchParams = req.nextUrl.searchParams

  const year = searchParams.get('year') ?? cookies().get('year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('sem')?.value
  const userid = searchParams.get('userid') ?? auth?.userId

  const { data } = await axios.get(
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

  const html = data

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

  let required = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(5) > td:nth-child(4)'
  )
    .text()
    .trim()

  switch (required) {
    case '必':
      required = '必修'
      break
    case '選':
      required = '選修'
      break
    case '通':
      required = '通識'
      break
  }

  // 開課班級
  const classCode = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(4)'
  )
    .text()
    .trim()

  const credit = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(4)'
  )
    .text()
    .trim()

  const foreignLanguage = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(6) > td:nth-child(2)'
  )
    .text()
    .trim()

  const distanceLearning = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(7) > td:nth-child(2)'
  )
    .text()
    .trim()

  const teachingMethod = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(12) > td:nth-child(2) > font'
  )
    .text()
    .trim()

  const evaluationMethod = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(13) > td:nth-child(2) > font'
  )
    .text()
    .trim()

  // #AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(21) ~ #AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(last-1)

  const start = 20
  // #AutoNumber1 > tbody > tr > td > table > tbody

  const length = $('#AutoNumber1 > tbody > tr > td > table > tbody').children().length

  const contentList: CourseInfo['content'] = []

  for (let i = 1; i < length - start; i++) {
    const week = $(
      `#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(${start + i}) > td:nth-child(1)`
    )
      .text()
      .trim()

    const content = $(
      `#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(${start + i}) > td:nth-child(2)`
    )
      .text()
      .trim()

    const remark = $(
      `#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(${start + i}) > td:nth-child(3)`
    )
      .text()
      .trim()

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
