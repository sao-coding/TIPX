import * as cheerio from 'cheerio'

import { Credit } from '@/types'
// import redis from '@/lib/redis'
import getCurrentYearSem from '@/utils/current-year-sem'

import getCredit from './credit'
import getSemGrade from './sem-grade'

const getGraduationStandard = async (userid: string) => {
  const { currentYear, currentSem } = getCurrentYearSem()

  // https://netinfo.takming.edu.tw/tip/stu_program.php

  // const graduationStandard: GraduationStandard = {
  //   graduationRequirements: {
  //     minimumRequiredCredits: 0,
  //     minimumElectiveCredits: 0,
  //     minimumGeneralEducationCredits: 0
  //   },
  //   currentCredits: {
  //     totalCredits: 0,
  //     totalRequiredCredits: 0,
  //     totalElectiveCredits: 0,
  //     totalGeneralCredits: 0
  //   },
  //   semesterStats: [],
  //   courses: []
  // }

  const getData = async () => {
    const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_program.php', {
      method: 'POST',
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${currentYear}; cookie_sem=${currentSem};`,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      },
      body: new URLSearchParams({
        R1: '1',
        B1: '查詢'
      })
    })
    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)
    const $ = cheerio.load(html)

    // console.log('html', html)

    const graduationCredits = $('td:contains("畢業應修最低學分總數")').next().text().trim()
    const electiveCredits = $('td:contains("選修應修最低學分總數")').next().text().trim()
    const generalCredits = $('td:contains("通識應修最低學分總數")').next().text().trim()

    // 打印結果
    console.log('畢業應修最低學分總數:', graduationCredits)
    console.log('選修應修最低學分總數:', electiveCredits)
    console.log('通識應修最低學分總數:', generalCredits)

    // 獲取所有學期
    const semList: Credit[] = await getCredit(userid, currentYear, currentSem)
    // console.log('semList', semList)

    // 獲取所有學期成績
    // 多線程
    const semGradeList = await Promise.all(
      semList.map(async (sem) => {
        return {
          year: sem.year,
          sem: sem.sem,
          grades: await getSemGrade(userid, sem.year, sem.sem)
        }
      })
    )
    console.log('semGradeList', semGradeList)

    // 統計每個學期的選修、必修和通識學分
    const semesterStats: {
      year: string
      sem: string
      requiredCredits: number
      electiveCredits: number
      generalCredits: number
      totalCredits: number
    }[] = []

    await Promise.all(
      semGradeList.map(async (semGrade) => {
        let requiredCredits = 0
        let electiveCredits = 0
        let generalCredits = 0

        for (const grade of semGrade.grades) {
          switch (grade.type) {
            case '必修':
              requiredCredits += grade.credit
              break
            case '選修':
              electiveCredits += grade.credit
              break
            case '通識':
              generalCredits += grade.credit
              break
          }
        }

        semesterStats.push({
          year: semGrade.year,
          sem: semGrade.sem,
          requiredCredits,
          electiveCredits,
          generalCredits,
          totalCredits: requiredCredits + electiveCredits + generalCredits
        })
      })
    )

    console.log('Semester Credits Statistics:', semesterStats)

    // 統計畢業應修了多少學分
    // 統計畢業應修了多少學分，只計算期末成績等於或大於60分的課程
    let totalCredits = 0
    let totalRequiredCredits = 0
    let totalElectiveCredits = 0
    let totalGeneralCredits = 0

    for (const semGrade of semGradeList) {
      for (const grade of semGrade.grades) {
        // 確保成績大於等於60分才計算學分
        if (grade.finalGrade >= 60) {
          switch (grade.type) {
            case '必修':
              totalRequiredCredits += grade.credit
              totalCredits += grade.credit
              break
            case '選修':
              totalElectiveCredits += grade.credit
              totalCredits += grade.credit
              break
            case '通識':
              totalGeneralCredits += grade.credit
              totalCredits += grade.credit
              break
          }
        }
      }
    }

    console.log('Total Credits:', totalCredits)
    console.log('Total Required Credits:', totalRequiredCredits)
    console.log('Total Elective Credits:', totalElectiveCredits)
    console.log('Total General Credits:', totalGeneralCredits)

    return {
      graduationRequirements: {
        minimumRequiredCredits: Number(graduationCredits),
        minimumElectiveCredits: Number(electiveCredits),
        minimumGeneralEducationCredits: Number(generalCredits)
      },
      currentCredits: {
        totalCredits,
        totalRequiredCredits,
        totalElectiveCredits,
        totalGeneralCredits
      },
      semesterStats,
      courses: semGradeList
    }
  }

  const data = await getData()
  console.log('data', data)
  return data
}

export default getGraduationStandard
