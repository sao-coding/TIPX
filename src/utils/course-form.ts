import * as cheerio from 'cheerio'

import { CourseForm, CourseFormList, CourseFormSection } from '@/types'
import getCurrentYearSem from '@/utils/current-year-sem'

// {
//     courseId 科目代碼
//     courseName 科目名稱
//     className 修課班級
//     teacherName 教師姓名
//     form: [
//         {
//             id: 'section1',
//             title: '第一部份：學生自我評量',
//             questions: [
//             {
//                 id: 'q1',
//                 text: '我在本科目本學期缺課（含遲到）情形：',
//                 options: [
//                 { value: 'A', label: '從未缺課或遲到' },
//                 { value: 'B', label: '1-3 小時' },
//                 { value: 'C', label: '4-7 小時' },
//                 { value: 'D', label: '8-11 小時' },
//                 { value: 'E', label: '12 小時（含12）以上' }
//                 ]
//             }
//             ],
//             suggestion: 'suggestion1'
//         }
//     ]
// }

// const getGraduationStandard = async (userid: string) => {
const getCourseForm = async (userid: string, coursePk?: string) => {
  const { currentYear, currentSem } = getCurrentYearSem()
  // https://netinfo.takming.edu.tw/tip/grade/grade_course_ask.php?ver=c&flg=stu&rowid=3100015
  if (coursePk) {
    const res = await fetch(
      `https://netinfo.takming.edu.tw/tip/grade/grade_course_ask.php?ver=c&flg=stu&rowid=${coursePk}`,
      {
        method: 'GET',
        headers: {
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${currentYear}; cookie_sem=${currentSem};`,
          Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
        }
      }
    )
    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('utf-8').decode(buffer)
    const $ = cheerio.load(html)
    // 獲取課程基本信息
    // /html/body/table/tbody/tr/td/table[1]
    const courseDetailsTable = $('body > table > tbody > tr > td > table').first()
    const courseHiddenInputs = $('form[name="GcpaForm"]')
    const courseId = courseDetailsTable.find('td').eq(0).text().trim()
    const courseName = courseDetailsTable.find('td').eq(1).text().trim()
    const classId = courseHiddenInputs.find('input[name="CLASS_NO"]').attr('value')?.trim() || ''
    const className = courseDetailsTable.find('td').eq(2).text().trim()
    const teacherId = courseHiddenInputs.find('input[name="STAFF_ID"]').attr('value')?.trim() || ''
    const teacherName = courseDetailsTable.find('td').eq(3).text().trim()

    // 創建表單數據對象
    const courseForm: CourseForm = {
      id: coursePk,
      courseId,
      courseName,
      classId,
      className,
      teacherId,
      teacherName,
      form: []
    }

    // 選擇所有包含問卷部分的表格
    const formTables = $('fieldset')
    formTables.each((sectionIndex, sectionElement) => {
      const sectionTable = $(sectionElement)
      const titleText = sectionTable.find('legend span').text().trim()

      // 創建部分對象
      const section: CourseFormSection = {
        id: `section${sectionIndex + 1}`,
        title: titleText,
        questions: [],
        suggestion: `sec${sectionIndex + 1}_opinion`
      }

      // 查找所有行
      const rows = sectionTable.find('tr')

      for (let i = 0; i < rows.length; i++) {
        // 跳過標題行
        const row = $(rows[i])
        const cells = row.find('td')
        // 檢查第一個單元格是否包含問題編號
        const firstCellText = cells.first().text().trim()
        if (firstCellText.match(/^\d+\.$/)) {
          const questionNumber = firstCellText.replace('.', '')
          const questionText = cells.eq(1).text().trim()
          const questionId = `q${questionNumber}`
          const options = []
          const questionOptions = cells.eq(2)
          // 在該單元格內查找所有的 label 元素
          const labels = questionOptions.find('label.qlabel')

          // 遍歷每個 label
          for (let j = 0; j < labels.length; j++) {
            const label = $(labels[j])
            const input = label.find('input[type="radio"]')

            if (input.length > 0) {
              const value = input.attr('value')
              let labelText = label.text().trim()

              // 移除標籤前的選項標識（如"A."）和多餘空白
              labelText = labelText.replace(/^[A-E]\.\s*/, '').trim()

              if (value && labelText) {
                options.push({ value, label: labelText })
              }
            }
          }

          if (options.length > 0) {
            section.questions.push({
              id: questionId,
              text: questionText,
              options
            })
          }
        }
      }

      // 將部分添加到表單數據中
      courseForm.form.push(section)
    })

    // console.log('courseId', courseId)
    // console.log('courseName', courseName)
    // console.log('className', className)
    // console.log('teacherName', teacherName)
    // console.log('Form data:', JSON.stringify(formData, null, 2))

    return courseForm
  } else {
    // 取得課程問卷清單
    // https://netinfo.takming.edu.tw/tip/grade/grade_course_list.php
    const res = await fetch(
      `https://netinfo.takming.edu.tw/tip/grade/grade_course_list.php?ver=c&flg=stu`,
      {
        method: 'GET',
        headers: {
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${currentYear}; cookie_sem=${currentSem};`,
          Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
        }
      }
    )
    const buffer = await res.arrayBuffer()
    const html = new TextDecoder('big5').decode(buffer)
    const $ = cheerio.load(html)
    // 獲取課程問卷清單
    const courseFormList: CourseFormList[] = []

    // 從第二個tr開始遍歷
    // body > center > p:nth-child(2) > table > tbody > tr:nth-child(2)
    const rows = $('body > center > p:nth-child(2) > table > tbody > tr').slice(1)
    rows.each((index, element) => {
      const cells = $(element).find('td')
      if (cells.length >= 4) {
        const className = cells.eq(0).text().trim()
        const teacherName = cells.eq(1).text().trim()
        const courseId = cells.eq(2).text().trim()
        const courseName = cells.eq(3).text().trim()
        const id =
          cells
            .eq(4)
            .find('a')
            .attr('href')
            ?.match(/rowid=(\d+)/)?.[1] || ''

        const status = cells.eq(5).text().trim() === 'finish'
        courseFormList.push({
          id,
          courseId,
          courseName,
          className,
          teacherName,
          status
        })
      }
    })

    return courseFormList
  }
}

export default getCourseForm
