import { JSDOM } from "jsdom"

import redis from "@/lib/redis"
import { Student } from "@/types"
import getClassName from "@/utils/class-name"
import getCurrentYearSem from "@/utils/current-year-sem"
import getTeacher from "@/utils/teacher"
import getUser from "@/utils/user"

const getClassList = async (userid: string) => {
  const { currentYear, currentSem } = await getCurrentYearSem()
  const teacherid = (await getTeacher(userid ?? "", currentYear ?? "", currentSem ?? "")).id

  const studentList: Student[] = []

  const getData = async () => {
    const resUrl = async (url: string, body?: { [key: string]: string }) => {
      const res = await fetch(`${url}?${new URLSearchParams(body)}`, {
        method: "GET",
        headers: {
          cookie: `cookie_userid=${teacherid}; cookie_year=${currentYear}; cookie_sem=${currentSem}; cookie_worktype=1; cookie_level=1; cookie_logintimes=2; cookie_type=4;`,
          Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
        }
      })

      const buffer = await res.arrayBuffer()
      const html = new TextDecoder("big5").decode(buffer)
      const dom = new JSDOM(html)
      const document = dom.window.document

      return document
    }

    console.time("fetching-student-list")

    let document = await resUrl("https://netinfo.takming.edu.tw/tip/guide_absrpt.php")

    let classList = document.querySelectorAll(
      "body > form > table > tbody > tr:nth-child(1) > td > p:nth-child(4) > font:nth-child(1) > select > option:not(:first-child)"
    )

    const className = (await getClassName(userid)).class

    const classID = Array.from(classList)
      .find((e) => e.textContent === className)
      ?.getAttribute("value")

    document = await resUrl("https://netinfo.takming.edu.tw/tip/guide_absrpt.php", {
      Class: classID ?? ""
    })

    classList = document.querySelectorAll(
      "body > form > table > tbody > tr:nth-child(1) > td > font > table > tbody > tr:not(:first-child)"
    )

    console.log("此班有", classList.length - 1, "名學生")

    await Promise.all(
      Array.from(classList).map(async (student) => {
        const id = student.querySelector("td:nth-child(2)")?.textContent ?? ""
        const { img, gender } = await getUser(id)
        const name = student.querySelector("td:nth-child(3)")?.textContent ?? ""

        studentList.push({
          id,
          img,
          gender,
          name
        })
      })
    )

    studentList.sort((a, b) => a.id.localeCompare(b.id))

    console.timeEnd("fetching-student-list")
  }

  // 尋找班級學生快取

  const cache = (await redis.call(
    "JSON.GET",
    `classlist_${currentYear}_${currentSem}_${userid}`
  )) as string | null

  if (!cache) {
    console.log("no cache")
    await getData()
    await redis.call(
      "JSON.SET",
      `classlist_${currentYear}_${currentSem}_${userid}`,
      "$",
      JSON.stringify(studentList)
    )
    // 設定快取時間為 4 個月
    await redis.call("EXPIRE", `classlist_${currentYear}_${currentSem}_${userid}`, 10368000)
  } else {
    console.log("cache")
    studentList.push(...JSON.parse(cache))
  }

  return studentList
}

export default getClassList
