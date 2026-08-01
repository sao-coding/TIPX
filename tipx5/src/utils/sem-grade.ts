import * as cheerio from 'cheerio'

import redis from '@/lib/redis'
import { SemGrade } from '@/types'
import getCurrentYearSem from '@/utils/current-year-sem'

const getSemGrade = async (userid: string, year: string, sem: string) => {
  const semScoreList: SemGrade[] = []
  const getData = async () => {
    const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
      const { currentYear, currentSem } = getCurrentYearSem()
      let res
      if (method === 'POST' && body) {
        const bodyContent = new URLSearchParams(body).toString().replace(/%25/g, '%')

        res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${currentYear}; cookie_sem=${currentSem};`,
            Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
          },
          body: bodyContent
        })
      } else {
        res = await fetch(url, {
          method,
          headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
            Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
          }
        })
      }
      const buffer = await res.arrayBuffer()
      const html = new TextDecoder('big5').decode(buffer)
      const $ = cheerio.load(html)
      return $
    }

    let document: cheerio.CheerioAPI

    document = await resUrl('https://netinfo.takming.edu.tw/tip/stu_score.php', 'POST', {
      RgNo: userid,
      R1: '1'
      // B1: "%ACd%B8%DF"
    })

    const historySemGradeRows = Array.from(
      document(
        'body > form > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody  tr:not(:first-child)'
      )
    )

    const historySemGrade: SemGrade[] = []

    historySemGradeRows.forEach((row) => {
      const cells = document(row).find('td')
      // 獲取 年度 學期
      const historyYear = document(cells[0]).text() ?? ''
      const historySem = document(cells[1]).text() ?? ''
      // 若是 year, sem 等於 111, 2 就存學期成績

      if (historyYear == year && historySem == sem) {
        // 存課程 id 名稱 學期成績
        const semScore: SemGrade = {
          id: '',
          name: '',
          category: '',
          type: '',
          credit: 0,
          midtermGrade: 0,
          finalGrade: 0,
          class: ''
        }

        semScore.id = document(cells[2]).text() ?? ''
        semScore.name = document(cells[3]).text() ?? ''
        semScore.finalGrade = Number(document(cells[7]).text() ?? '')

        historySemGrade.push(semScore)
      }
    })

    document = await resUrl('https://netinfo.takming.edu.tw/tip/stu_semscore.php', 'GET')

    const rows = Array.from(document("table[bgcolor='#666666'] tr:not(:first-child)"))

    rows.forEach((row) => {
      const cells = Array.from(document(row).find('td'))
      const semScore: SemGrade = {
        id: '',
        name: '',
        category: '',
        type: '',
        credit: 0,
        midtermGrade: 0,
        finalGrade: 0,
        class: ''
      }
      cells.forEach((cell, i) => {
        // const list = cell.textContent
        const list = document(cell).text()
        switch (i) {
          case 0:
            semScore.id = list ?? ''
            break
          case 1:
            semScore.name = list ?? ''
            break
          case 2:
            semScore.category = list ?? ''
            break
          case 3:
            semScore.type = list ?? ''
            break
          case 4:
            semScore.credit = Number(list)
            break
          case 5:
            // 如果Number(list) 是 NaN 就給 0
            semScore.midtermGrade = Number.isNaN(Number(list)) ? 0 : Number(list)
            break
          case 6:
            // 如果Number(list) 是 NaN 去尋找 historySemGrade 的成績 如果沒有就給 0
            semScore.finalGrade = Number.isNaN(Number(list))
              ? (historySemGrade.find((e) => e.id === semScore.id)?.finalGrade ?? 0)
              : Number(list)
            break
          case 7:
            semScore.class = list ?? ''
            break
        }
      })
      semScoreList.push(semScore)
    })
  }

  // 計算快取過期時間的函數
  const calculateCacheExpireTime = (): number => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentDay = now.getDate()
    const { currentSem } = getCurrentYearSem()

    // 計算到指定日期的秒數
    const getSecondsTo = (targetMonth: number, targetDay: number): number => {
      const target = new Date(now.getFullYear(), targetMonth - 1, targetDay)
      if (target < now) {
        target.setFullYear(now.getFullYear() + 1)
      }
      return Math.floor((target.getTime() - now.getTime()) / 1000)
    }

    // 統一的期間判斷函數
    const isInPeriod = (
      periods: Array<{ start: [number, number]; end: [number, number] }>
    ): boolean => {
      return periods.some(({ start, end }) => {
        const [startMonth, startDay] = start
        const [endMonth, endDay] = end

        if (startMonth === endMonth) {
          // 同一個月內
          return currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay
        } else {
          // 跨月
          return (
            (currentMonth === startMonth && currentDay >= startDay) ||
            (currentMonth === endMonth && currentDay <= endDay) ||
            (currentMonth > startMonth && currentMonth < endMonth)
          )
        }
      })
    }

    // 定義各個期間的時間範圍
    const periods = {
      // 期中考成績消失期間
      midtermGradeDisappear:
        currentSem === '1'
          ? [{ start: [9, 25] as [number, number], end: [10, 24] as [number, number] }]
          : [{ start: [3, 15] as [number, number], end: [4, 14] as [number, number] }],

      // 期末考成績消失期間
      finalGradeDisappear:
        currentSem === '1'
          ? [{ start: [11, 11] as [number, number], end: [1, 14] as [number, number] }]
          : [{ start: [5, 1] as [number, number], end: [6, 14] as [number, number] }],

      // 期中考期間
      midtermExam:
        currentSem === '1'
          ? [{ start: [10, 25] as [number, number], end: [11, 10] as [number, number] }]
          : [{ start: [4, 15] as [number, number], end: [4, 30] as [number, number] }],

      // 期末考期間
      finalExam:
        currentSem === '1'
          ? [{ start: [1, 15] as [number, number], end: [1, 31] as [number, number] }]
          : [{ start: [6, 15] as [number, number], end: [6, 30] as [number, number] }]
    }

    // 根據當前時間和學期決定快取過期時間
    if (isInPeriod(periods.midtermGradeDisappear)) {
      // 期中考成績消失期間：延長快取到期中考結束
      return currentSem === '1' ? getSecondsTo(11, 11) : getSecondsTo(5, 1)
    } else if (isInPeriod(periods.finalGradeDisappear)) {
      // 期末考成績消失期間：延長快取到期末考結束
      return currentSem === '1' ? getSecondsTo(2, 1) : getSecondsTo(7, 1)
    } else if (isInPeriod(periods.midtermExam) || isInPeriod(periods.finalExam)) {
      // 考試期間：短期快取，成績可能更新
      return 3600 // 1小時
    } else {
      // 全部顯示期間：快取到下一個成績消失期間
      console.log('全部顯示期間，快取到下一個成績消失期間', currentSem)
      return currentSem === '1' ? getSecondsTo(3, 15) : getSecondsTo(9, 25)
    }
  }

  // 判斷是否為成績消失期間
  const isGradeDisappearPeriod = (): boolean => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentDay = now.getDate()
    const { currentSem } = getCurrentYearSem()

    // 期中考成績消失期間
    const midtermDisappear =
      currentSem === '1'
        ? (currentMonth === 9 && currentDay >= 25) || (currentMonth === 10 && currentDay <= 24)
        : (currentMonth === 3 && currentDay >= 15) || (currentMonth === 4 && currentDay <= 14)

    // 期末考成績消失期間
    const finalDisappear =
      currentSem === '1'
        ? (currentMonth === 11 && currentDay >= 11) ||
          currentMonth === 12 ||
          (currentMonth === 1 && currentDay <= 14)
        : currentMonth === 5 || (currentMonth === 6 && currentDay <= 14)

    return midtermDisappear || finalDisappear
  }

  const cache = (await redis.call('JSON.GET', `${userid}:${year}:${sem}:sem-grade`)) as
    | string
    | null

  if (!cache) {
    console.log('no cache')
    await getData()

    // 計算快取過期時間
    const expireTime = calculateCacheExpireTime()

    // 設定快取
    await redis.call(
      'JSON.SET',
      `${userid}:${year}:${sem}:sem-grade`,
      '$',
      JSON.stringify(semScoreList)
    )

    // 設定過期時間（秒）
    await redis.call('EXPIRE', `${userid}:${year}:${sem}:sem-grade`, expireTime)
  } else {
    console.log('use cache')

    // 如果是成績消失期間但有快取，延長快取時間以保留過往成績
    if (isGradeDisappearPeriod()) {
      console.log('成績消失期間，延長快取時間保留過往成績')
      const expireTime = calculateCacheExpireTime()
      await redis.call('EXPIRE', `${userid}:${year}:${sem}:sem-grade`, expireTime)
    }

    // 把快取的資料轉換成 JSON 格式
    return JSON.parse(cache) as SemGrade[]
  }

  return semScoreList
}

export default getSemGrade
