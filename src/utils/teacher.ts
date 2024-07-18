import * as cheerio from "cheerio"
import iconv from "iconv-lite"

import getClassName from "./class-name"
import getCourseTeacher from "./course-teacher"

const getTeacher = async (
  userid: string,
  year: string,
  sem: string,
  type?: string,
  course?: string
) => {
  const resUrl = async (url: string, method: string, body?: { [key: string]: string }) => {
    let res
    if (method === "POST" && body) {
      if (body.sname) {
        body.sname = iconv
          .encode(body.sname, "big5")
          .toString("hex")
          .replace(/(.{2})/g, "%$1")
      }
      const bodyContent = Object.entries(body)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
      // console.log(bodyContent)
      res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
          Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
        },
        body: bodyContent
      })
    } else {
      res = await fetch(url, {
        method,
        headers: {
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid};cookie_account=${userid}; cookie_year=${year}; cookie_sem=${sem};`,
          Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
        }
      })
    }
    const buffer = await res.arrayBuffer()
    const html = new TextDecoder("big5").decode(buffer)

    return cheerio.load(html)
  }

  let document: cheerio.CheerioAPI

  let teacherName = ""
  if (type === "course") {
    teacherName = await getCourseTeacher(userid ?? "", year ?? "", sem ?? "", course ?? "")
  } else {
    document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_guide.php", "POST", {
      Div: "5"
    })

    const teacherList = document(
      "body > table > tbody > tr:nth-child(3) > td > form > table:nth-child(2) > tbody > tr:not(:first-child)"
    )

    // 尋找學生班級
    const { class: className } = await getClassName(userid ?? "")

    // 對應的班導師
    // td:nth-child(1) > p > span > font
    // 印出所有班級名稱

    teacherName = teacherList
      .filter((_, element) => {
        return document(element).find("td:nth-child(1) > p > span > font").text() === className
      })
      .find("td:nth-child(2) > p > span > font")
      .text()

    // console.log(teacherName)

    // 先找到相同班級的元素，再找到老師名稱
  }

  document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teadept.php", "POST", {
    sname: teacherName
  })

  const teacherDeptLength = document(
    "#AutoNumber1 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:not(:first-child)"
  ).length

  // console.log({ teacherDeptLength })

  let teacherDept = document(
    `#AutoNumber1 > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(${
      teacherDeptLength + 1
    }) > td:nth-child(2)`
  ).text()

  // 通識教育中心 => 通識中心

  teacherDept === "通識教育中心" && (teacherDept = "通識中心")

  document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teach2.php", "GET")

  const selectDept = document(
    "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(1) > tbody > tr > td > p > select:nth-child(5)"
  )

  // 尋找 teacherDept 代碼
  // select 遍歷所有 option 的 value
  // 印出所有 option 的 value
  const teacherDeptId = selectDept
    .find("option")
    .filter((_, element) => {
      return document(element).text() === teacherDept
    })
    .val() as string

  document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teach2.php", "POST", {
    Year: year ?? "",
    Sem: sem ?? "",
    Dept: teacherDeptId ?? "",
    Teacher: "0310"
  })

  const selectTeacher = document(
    "body > table > tbody > tr:nth-child(2) > td > form > table:nth-child(1) > tbody > tr > td > p > select:nth-child(7)"
  )

  const teacherId = selectTeacher
    .find("option")
    .filter((_, element) => {
      return document(element).text() === teacherName
    })
    .val() as string

  document = await resUrl("https://netinfo.takming.edu.tw/tip/comm_teach2.php", "POST", {
    Year: year ?? "",
    Sem: sem ?? "",
    Dept: teacherDeptId ?? "",
    Skind: "0",
    Teacher: teacherId ?? ""
  })

  return {
    id: teacherId,
    name: teacherName
  }
}

export default getTeacher
