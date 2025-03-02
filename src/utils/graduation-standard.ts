import * as cheerio from 'cheerio'

import { Credit, GraduationStandard } from '@/types'
// import redis from '@/lib/redis'
import getCurrentYearSem from '@/utils/current-year-sem'

import getCredit from './credit'
import getSemGrade from './sem-grade'

// {
//     "minimum_required_credits": 135.0,
//     "minimum_elective_credits": 45.0,
//     "minimum_general_education_credits": 8,
//     "courses": [
//       {
//         "course_id": "C001",
//         "course_name": "中文悅讀與舒寫",
//         "exemptible_in_semester_id": "S1132",
//         "exemptible_in_semester": "1132",
//         "grade": 1,
//         "category": "共同科目",
//         "type": "必修",
//         "first_semester_credits": 2.0,
//         "first_semester_hours": 2.0,
//         "second_semester_credits": 2.0,
//         "second_semester_hours": 2.0
//       },
//     ]
//   }

const getGraduationStandard = async (userid: string) => {
  const { currentYear, currentSem } = getCurrentYearSem()

  // https://netinfo.takming.edu.tw/tip/stu_program.php

  const graduationStandard: GraduationStandard = {
    graduationRequirements: {
      minimumRequiredCredits: 0,
      minimumElectiveCredits: 0,
      minimumGeneralEducationCredits: 0
    },
    currentCredits: {
      totalCredits: 0,
      totalRequiredCredits: 0,
      totalElectiveCredits: 0,
      totalGeneralCredits: 0
    },
    semesterStats: [],
    courses: []
  }

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

        for (let grade of semGrade.grades) {
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
    const totalCredits = semesterStats.reduce((acc, cur) => acc + cur.totalCredits, 0)
    const totalRequiredCredits = semesterStats.reduce((acc, cur) => acc + cur.requiredCredits, 0)
    const totalElectiveCredits = semesterStats.reduce((acc, cur) => acc + cur.electiveCredits, 0)
    const totalGeneralCredits = semesterStats.reduce((acc, cur) => acc + cur.generalCredits, 0)

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
