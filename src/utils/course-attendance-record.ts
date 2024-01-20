import { JSDOM } from "jsdom"

import {
  CourseAttendanceRecord,
  CourseAttendanceRecordCount,
  CourseAttendanceRecordList
} from "@/types"

const getCourseAttendanceRecord = async (
  userid: string,
  year: string,
  sem: string,
  type?: string,
  course?: string
) => {
  const courseAttendanceRecord: CourseAttendanceRecord = {
    list: [],
    total: []
  }

  let courseAttendanceRecordList: CourseAttendanceRecordList[] = []
  let total: CourseAttendanceRecordCount[] = []

  const resUrl = async (page_num?: number) => {
    const res = await fetch(
      `https://netinfo.takming.edu.tw/tip/stu_stg01.php?page_num=${page_num}&RgNo=${userid}`,
      {
        headers: {
          cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
          Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
        }
      }
    )
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    return document
  }

  let document
  document = await resUrl()
  const count = document
    .querySelector("table:nth-child(3) tr td font a:last-child")
    ?.getAttribute("href")
    ?.split("&")[0]
    .split("=")[1]
  // ?page_num=8&RgNo=D11019248
  // 取得總頁數
  console.log("count", count)

  for (let i = 1; i <= parseInt(count ?? "1"); i++) {
    document = await resUrl(i)
    // body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr
    // 第一個tr是標題

    const leaveListHTML = document.querySelectorAll(
      "body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:not(:first-child)"
    )

    for (let i = 0; i < leaveListHTML.length; i++) {
      const leaveListItemHTML = leaveListHTML[i]
      courseAttendanceRecordList.push({
        date: leaveListItemHTML.children[0].textContent ?? "",
        week: leaveListItemHTML.children[1].textContent ?? "",
        period: leaveListItemHTML.children[2].textContent ?? "",
        type: leaveListItemHTML.children[3].textContent ?? "",
        course: leaveListItemHTML.children[5].textContent ?? "",
        courseID: leaveListItemHTML.children[4].textContent ?? ""
      })
    }
    courseAttendanceRecord.list = courseAttendanceRecordList
  }

  const leaveNameList = [
    "曠課",
    "病假",
    "事假",
    "公假",
    "朝會不到",
    "朝會遲到",
    "遲到",
    "喪假",
    "婚假",
    "產假",
    "育嬰假",
    "哺育幼兒假",
    "生理假",
    "懷孕假",
    "新生定向"
  ]

  const getTotal = () => {
    total = []
    for (let i = 0; i < leaveNameList.length; i++) {
      const leaveName = leaveNameList[i]
      const leaveCount = courseAttendanceRecord.list.filter(
        (item) => item.type === leaveName
      ).length
      total.push({
        type: leaveName,
        count: leaveCount
      })
    }
    courseAttendanceRecord.total = total
  }
  getTotal()

  // 取得courseID的請假數
  // req.nextUrl.searchParams.get("course")

  if (course) {
    const courseID = course
    const courseAttendanceRecordFilter = courseAttendanceRecord.list.filter(
      (item) => item.courseID === courseID
    )

    courseAttendanceRecord.list = courseAttendanceRecordFilter

    // 取得 各種假別的總數 放入
    getTotal()

    return courseAttendanceRecord
  }

  if (type === "total") {
    //         // 平日
    // // 第一節 08:20~09:10
    // // 第二節 09:20~10:10
    // // 第三節 10:20~11:10
    // // 第四節 11:20~12:10
    // // 第五節 12:20~13:10 (午休)
    // // 第六節 13:20~14:10
    // // 第七節 14:20~15:10
    // // 第八節 15:20~16:10
    // // 第九節 16:20~17:00
    // // 第十節 17:00~18:30 (晚休)
    // // 第十一節 18:30~19:15
    // // 第十二節 19:20~20:05
    // // 第十三節 20:15~21:00
    // // 第十四節 21:05~21:45

    // // 假日
    // // 第一節 09:00~09:45
    // // 第二節 09:50~10:35
    // // 第三節 10:40~11:25
    // // 第四節 11:30~12:15
    // // 第五節 13:10~13:55
    // // 第六節 14:00~14:45
    // // 第七節 14:50~15:35
    // // 第八節 15:40~16:25
    // // 第九節 16:30~17:15
    // // 第十節 17:20~18:05 (晚休)
    // // 第十一節 18:10~18:55
    // // 第十二節 19:00~19:45
    // // 第十三節 19:50~20:35
    // // 第十四節 20:40~21:25

    // 平日每節上課時長
    const weekTime = [50, 50, 50, 50, 50, 50, 50, 50, 40, 90, 45, 45, 45, 40]
    // 假日每節上課時長
    const holidayTime = [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
    // 判斷每堂課是在平日還是假日 並計算總時數
    const weekTotal = courseAttendanceRecord.list
      .filter((item) => item.week !== "六" && item.week !== "日")
      .map((item) => {
        const period = parseInt(item.period)
        const index = period - 1
        const time = weekTime[index]
        return time
      })
      .reduce((a, b) => a + b, 0)
    const holidayTotal = courseAttendanceRecord.list
      .filter((item) => item.week === "六" || item.week === "日")
      .map((item) => {
        console.log("item", item)
        const period = parseInt(item.period)
        const index = period - 1
        const time = holidayTime[index]
        return time
      })
      .reduce((a, b) => a + b, 0)
    const time = weekTotal + holidayTotal
    const count = courseAttendanceRecord.total.reduce((a, b) => a + b.count, 0)
    return { count, time }
  }

  return courseAttendanceRecord
}

export default getCourseAttendanceRecord
