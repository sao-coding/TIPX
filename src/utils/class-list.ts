import * as cheerio from 'cheerio'

import redis from '@/lib/redis'
import { Student } from '@/types'
import getClassName from '@/utils/class-name'
import getCurrentYearSem from '@/utils/current-year-sem'
import getTeacher from '@/utils/teacher'
import getUser from '@/utils/user'

const getClassList = async (userid: string) => {
  const { currentYear, currentSem } = getCurrentYearSem()
  const teacherid = (await getTeacher(userid ?? '', currentYear ?? '', currentSem ?? '')).id

  const classList: Student[] = []

  const getData = async () => {
    const resUrl = async (url: string, body?: { [key: string]: string }) => {
      const res = await fetch(`${url}?${new URLSearchParams(body)}`, {
        method: 'GET',
        headers: {
          cookie: `cookie_userid=${teacherid}; cookie_year=${currentYear}; cookie_sem=${currentSem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
          Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
        }
      })

      const buffer = await res.arrayBuffer()
      const html = new TextDecoder('big5').decode(buffer)
      const $ = cheerio.load(html)

      return $
    }

    console.time('fetching-student-list')

    let $ = await resUrl('https://netinfo.takming.edu.tw/tip/guide_absrpt.php')

    const className = (await getClassName(userid)).class

    const classID = $(`option:contains(${className})`).attr('value')
    console.log('班級ID', classID)

    $ = await resUrl('https://netinfo.takming.edu.tw/tip/guide_absrpt.php', {
      Class: classID ?? ''
    })

    let classListRows = Array.from(
      $(
        'body > form > table > tbody > tr:nth-child(1) > td > font > table > tbody > tr:not(:first-child)'
      )
    )

    console.log('此班有', classListRows.length - 1, '名學生')

    await Promise.all(
      Array.from(classListRows).map(async (student) => {
        // const id = student.querySelector("td:nth-child(2)")?.textContent ?? ""
        const userId = $(student).find('td:nth-child(2)').text() ?? ''
        const { img, gender } = await getUser(userId)
        // const name = student.querySelector("td:nth-child(3)")?.textContent ?? ""
        const name = $(student).find('td:nth-child(3)').text() ?? ''

        classList.push({
          userId,
          img,
          gender,
          name
        })
      })
    )

    classList.sort((a, b) => a.userId.localeCompare(b.userId))

    console.timeEnd('fetching-student-list')
  }

  // 尋找班級學生快取

  const cache = (await redis.call(
    'JSON.GET',
    `classlist_${currentYear}_${currentSem}_${userid}`
  )) as string | null

  if (!cache) {
    console.log('no cache')
    await getData()
    await redis.call(
      'JSON.SET',
      `classlist_${currentYear}_${currentSem}_${userid}`,
      '$',
      JSON.stringify(classList)
    )
    // 假如是 5,6月 或 12,1月 快取時間為 1 小時 否則為 4 個月
    const month = new Date().getMonth() + 1
    const expire =
      month === 5 || month === 6 || month === 12 || month === 1 ? 60 * 60 : 60 * 60 * 24 * 30 * 4
    await redis.expire(`classlist_${currentYear}_${currentSem}_${userid}`, expire)
  } else {
    console.log('use cache')
    classList.push(...JSON.parse(cache))
  }

  return classList
}

export default getClassList
