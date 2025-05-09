import * as cheerio from 'cheerio'

import getCurrentYearSem from './current-year-sem'

const getClassName = async (userid: string, year?: string) => {
  const res = await fetch('https://netinfo.takming.edu.tw/tip/newstu_sys/stu_main.php', {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid};`,
      Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
    }
  })

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('big5').decode(buffer)

  const judge = (year: string, currentYear: string, className: string) => {
    const gradeList = ['一', '二', '三', '四', '五', '六', '七', '八']
    // console.log(year, currentYear, className)
    // currentYear - year

    const yearDiff = Number(currentYear) - Number(year)
    const grade = gradeList[yearDiff]
    // console.log(grade)
    // 替換掉 className 中的 甲 乙 丙 丁 的前一個字
    // 例如: 科一甲 -> 科 甲
    // 例如: 豐富二丙 -> 豐富 丙
    const classNameArray = className.split('')
    // 替換掉 classNameArray 倒數第二個字
    classNameArray[classNameArray.length - 2] = grade
    // console.log(classNameArray)
    // 重新組合 className
    className = classNameArray.join('')

    return className
  }

  const className = judge(
    userid.slice(1, 4),
    year ?? (await getCurrentYearSem()).currentYear,
    cheerio.load(html)('#form1 > table > tbody > tr:nth-child(6) > td:nth-child(4)').text()
  )

  return {
    class: className
  }
}

export default getClassName
