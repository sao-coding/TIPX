import * as cheerio from 'cheerio'

import { Conduct } from '@/types'
import getClassName from '@/utils/class-name'
import getConduct from '@/utils/conduct'
import getCurrentYearSem from '@/utils/current-year-sem'
import getTeacher from '@/utils/teacher'
import getUser from '@/utils/user'

const getClassRank = async (userid: string, year: string, sem: string) => {
  const { currentYear, currentSem } = getCurrentYearSem()
  const teacherid = (await getTeacher(userid, currentYear, currentSem)).id

  const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
    let res
    if (method === 'POST' && body) {
      res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          cookie: `cookie_userid=${teacherid}; cookie_year=${currentYear}; cookie_sem=${currentSem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
          Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
        },
        body: new URLSearchParams(body)
      })
    } else {
      res = await fetch(url, {
        method,
        headers: {
          cookie: `cookie_userid=${teacherid}; cookie_year=${currentYear}; cookie_sem=${currentSem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
          Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
        }
      })
    }
    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)
    const $ = cheerio.load(html)

    return $
  }

  console.time('fetching-class-rank')

  const $ = await resUrl('https://netinfo.takming.edu.tw/tip/guide_ranklist.php', 'GET')

  const className = (await getClassName(userid)).class

  const classID = $(`option:contains(${className})`).attr('value')

  const classRank$ = await resUrl('https://netinfo.takming.edu.tw/tip/guide_ranklist.php', 'POST', {
    Class: classID ?? ''
  })

  const classRankList = Array.from(
    classRank$(
      'body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(3) > tbody > tr:not(:first-child)'
    )
  )

  console.log(`系排: ${className}的成績排名有 ${classRankList.length} 人`)

  const finalGradeRankClass = await Promise.all(
    Array.from(classRankList).map(async (element) => {
      const userid = classRank$(element).find('td:nth-child(2)').text() ?? ''
      const { img, name } = await getUser(userid)
      const conduct = (await getConduct(userid, year ?? '', sem ?? '', 'one')) as Conduct

      const SemRank = (classRank$(element).find('td:nth-child(10)').html() ?? '')
        .replace('<font size="2">', '')
        .replace('</font>', '')
        .replace(/<br>$/, '')
        .split('<br>')
      // console.log("name", name)
      // console.log("SemRank", SemRank)

      let avg = 0
      let rank = 0
      for (let i = 0; i < SemRank.length; i++) {
        const element = SemRank[i]
        const YearSem = element.split('學期')[0]

        if (YearSem === `${year}${sem}`) {
          avg = Number(element.split('平均成績:')[1].split('/')[0])
          rank = Number(element.split('名次:')[1])
        }
      }

      return {
        userid,
        img,
        name,
        data: {
          year,
          sem,
          conduct,
          avg,
          rank
        }
      }
    })
  )

  console.timeEnd('fetching-class-rank')

  return finalGradeRankClass
}

export default getClassRank
