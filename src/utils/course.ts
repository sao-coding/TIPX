// 課堂資訊
import { JSDOM } from "jsdom"

import redis from "@/lib/redis"
import { Course } from "@/types"
import getCourseTeacher from "@/utils/course-teacher"

const getCourse = async (
  userid: string,
  year: string,
  sem: string,

  courseID?: string
) => {
  const courselist: Course[] = []

  // 生成html 傳入 res 並回傳 document
  const generateHtml = async (res: Response) => {
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    return document
  }

  if (courseID === undefined) {
    const getData = async () => {
      const res = await fetch("https://netinfo.takming.edu.tw/tip/list_fun_stucourse.php", {
        headers: {
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
          Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
        }
      })
      const document = await generateHtml(res)
      const rows = Array.from(document.querySelectorAll("table tbody tr:not(:first-child)"))

      for (let i = 0; i < rows.length; i++) {
        const cells = Array.from(rows[i].querySelectorAll("td:not(:first-child) font span a"))
        for (let j = 0; j < cells.length; j++) {
          const list = cells[j].textContent
          const link = cells[j].getAttribute("href")
          const id = link?.split("=")[1]
          courselist.push({
            id: id ?? "",
            course: list ?? "",
            teacher: await getCourseTeacher(userid, year, sem, id ?? "")
          })
        }
      }
    }

    // 查詢課程清單 cache

    const cache = (await redis.call(`JSON.GET`, `courselist_${year}_${sem}_${userid}`)) as
      | string
      | null
    if (!cache) {
      console.log("no cache")
      await getData()
      await redis.call(
        "JSON.SET",
        `courselist_${year}_${sem}_${userid}`,
        "$",
        JSON.stringify(courselist)
      )
      // 假如是 5,6月 或 12,1月 快取時間為 1 小時 否則為 1 天
      const month = new Date().getMonth() + 1
      const expire =
        month === 5 || month === 6 || month === 12 || month === 1 ? 60 * 60 : 60 * 60 * 24
      await redis.expire(`courselist_${year}_${sem}_${userid}`, expire)
    } else {
      console.log("use cache")
      courselist.push(...JSON.parse(cache))
    }

    return courselist
  } else {
    const res = await fetch(
      `https://netinfo.takming.edu.tw/tip/list_course_new.php?opno=${courseID}`,
      {
        headers: {
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
          Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
        }
      }
    )
    const document = await generateHtml(res)
    const name = document
      .querySelector("font[color='#800000']")
      ?.textContent?.replace("目前無公告資訊!!", "")
    return {
      id: courseID,
      course: name ?? ""
    } as Course
  }
}

export default getCourse
