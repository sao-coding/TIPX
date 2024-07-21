import * as cheerio from 'cheerio'

const getCourseTeacher = async (
  userid: string,
  year: string,
  sem: string,

  course: string
) => {
  const res = await fetch(
    `https://netinfo.takming.edu.tw/tip/teach/teach_classqry.php?opno=${course}`,
    {
      headers: {
        cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      }
    }
  )

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('big5').decode(buffer)

  const $ = cheerio.load(html)
  const teacher = $(
    '#AutoNumber1 > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2)'
  ).text()

  return teacher
}

export default getCourseTeacher
