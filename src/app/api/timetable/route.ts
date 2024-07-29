// 課表
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { JSDOM } from 'jsdom'

import authOptions from '@/lib/auth'
import redis from '@/lib/redis'
import { TimeTable } from '@/types'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const session = await getServerSession(authOptions)
  const year = searchParams.get('year') ?? cookies().get('cookie_year')?.value
  const sem = searchParams.get('sem') ?? cookies().get('cookie_sem')?.value
  const userid = searchParams.get('userid') ?? session?.user.studentID
  const type = searchParams.get('type') ?? 'all'
  const time = searchParams.get('time') ?? ''

  // 平日
  // 第一節 08:20~09:10
  // 第二節 09:20~10:10
  // 第三節 10:20~11:10
  // 第四節 11:20~12:10
  // 第五節 12:20~13:10 (午休)
  // 第六節 13:20~14:10
  // 第七節 14:20~15:10
  // 第八節 15:20~16:10
  // 第九節 16:20~17:00
  // 第十節 17:00~18:30 (晚休)
  // 第十一節 18:30~19:15
  // 第十二節 19:20~20:05
  // 第十三節 20:15~21:00
  // 第十四節 21:05~21:45

  // 創建平日 時間表
  const weekdayTimeList = [
    { start: '08:20', end: '09:10' },
    { start: '09:20', end: '10:10' },
    { start: '10:20', end: '11:10' },
    { start: '11:20', end: '12:10' },
    { start: '12:20', end: '13:10' },
    { start: '13:20', end: '14:10' },
    { start: '14:20', end: '15:10' },
    { start: '15:20', end: '16:10' },
    { start: '16:20', end: '17:00' },
    { start: '17:00', end: '18:30' },
    { start: '18:30', end: '19:15' },
    { start: '19:20', end: '20:05' },
    { start: '20:15', end: '21:00' },
    { start: '21:05', end: '21:45' }
  ]

  // 假日
  // 第一節 09:00~09:45
  // 第二節 09:50~10:35
  // 第三節 10:40~11:25
  // 第四節 11:30~12:15
  // 第五節 13:10~13:55
  // 第六節 14:00~14:45
  // 第七節 14:50~15:35
  // 第八節 15:40~16:25
  // 第九節 16:30~17:15
  // 第十節 17:20~18:05 (晚休)
  // 第十一節 18:10~18:55
  // 第十二節 19:00~19:45
  // 第十三節 19:50~20:35
  // 第十四節 20:40~21:25

  const holidayTimeList = [
    { start: '09:00', end: '09:45' },
    { start: '09:50', end: '10:35' },
    { start: '10:40', end: '11:25' },
    { start: '11:30', end: '12:15' },
    { start: '13:10', end: '13:55' },
    { start: '14:00', end: '14:45' },
    { start: '14:50', end: '15:35' },
    { start: '15:40', end: '16:25' },
    { start: '16:30', end: '17:15' },
    { start: '17:20', end: '18:05' },
    { start: '18:10', end: '18:55' },
    { start: '19:00', end: '19:45' },
    { start: '19:50', end: '20:35' },
    { start: '20:40', end: '21:25' }
  ]

  let timeTable: TimeTable[] = [
    { week: '星期一', timetable: [] },
    { week: '星期二', timetable: [] },
    { week: '星期三', timetable: [] },
    { week: '星期四', timetable: [] },
    { week: '星期五', timetable: [] },
    { week: '星期六', timetable: [] },
    { week: '星期日', timetable: [] }
  ]

  const getData = async () => {
    const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_weeklist.php', {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      }
    })

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    const rows = Array.from(
      document.querySelectorAll('table[bgcolor="#CCCCCC"] tbody tr:not(:first-child)')
    )

    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td:not(:first-child)'))

      cells.forEach((cell, index) => {
        const daylist = cell.innerHTML.replace(/<font size="2">|<\/font>/g, '').split('<br>')
        if (daylist[0] === '.') {
          timeTable[index].timetable.push({
            id: '',
            course: '',
            classroom: '',
            teacher: ''
          })
        } else {
          timeTable[index].timetable.push({
            id: daylist[0],
            course: daylist[1],
            classroom: daylist[2],
            teacher: daylist[3]
          })
        }
      })
    })
  }

  // 若有快取則使用快取
  // 若沒有則發送請求
  const cache = (await redis.call('JSON.GET', `timetable_${year}_${sem}_${userid}`)) as
    | string
    | null
  if (!cache) {
    console.log('no cache')
    await getData()
    // 假如是 5,6月 或 12,1月 快取時間為 1 小時 否則為 1 天
    // 快取課表
    const month = new Date().getMonth()
    const expire = month === 5 || month === 6 || month === 11 || month === 0 ? 3600 : 86400
    await redis.call(
      'JSON.SET',
      `timetable_${year}_${sem}_${userid}`,
      '$',
      JSON.stringify(timeTable)
    )
    await redis.call('EXPIRE', `timetable_${year}_${sem}_${userid}`, expire)
  } else {
    console.log('use cache')
    // 把快取的資料轉換成 JSON 格式
    timeTable = JSON.parse(cache)
  }

  if (type === 'now') {
    // 輸出目前正在上課的課程
    // 轉換 time ISO格式 為 08:20 格式

    const date = time.split(' ')[0]
    // 取消秒數
    const now = time.split(' ')[1].slice(0, 5)
    // const now = "09:40"

    // 先比較日期是否是六日

    const day = new Date(date).getDay()

    // 若是平日 則使用平日時間表 比較 目前時間 輸出目前正在上課的課程 若沒有則輸出 行蹤不明
    // 若是假日 則使用假日時間表 比較 目前時間 輸出目前正在上課的課程 若沒有則輸出 行蹤不明
    const timeList = day === 0 || day === 6 ? holidayTimeList : weekdayTimeList

    // 比較目前時間 與 時間表
    const nowCourse = timeList.findIndex((time) => {
      const start = time.start
      const end = time.end
      return now >= start && now <= end
    })

    // 若有則輸出該課程
    // 若 timeTable[day - 1].timetable[nowCourse].classroom === "" 則輸出 行蹤不明

    if (nowCourse === -1) {
      return NextResponse.json({
        id: '',
        course: '沒有課程',
        classroom: '行蹤不明',
        teacher: '###'
      })
    }

    if (timeTable[day - 1].timetable[nowCourse].classroom === '') {
      return NextResponse.json({
        id: '',
        course: '沒有課程',
        classroom: '行蹤不明',
        teacher: '###'
      })
    }
    return NextResponse.json(timeTable[day - 1].timetable[nowCourse])
  }

  return NextResponse.json(timeTable)
}
