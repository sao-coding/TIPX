import { JSDOM } from "jsdom"
import { CourseAttendanceRecord } from "@/types"

const getCourseAttendanceRecord = async (
    userid: string,
    year: string,
    sem: string,
    dept: string,
    es: string,
    course?: string
) => {
    const courseAttendanceRecordAll: CourseAttendanceRecord = {
        list: [],
        total: [],
    }

    const courseAttendanceRecord: CourseAttendanceRecord = {
        list: [],
        total: [],
    }

    let attendanceRecord: string[] = []
    let total: number[] = []

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_stg01.php", {
        headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const count = document.querySelector("table:nth-child(3) tr td font a:last-child")
    // ?page_num=8&RgNo=D11019248
    // 取得總頁數
    // console.log("count", count?.getAttribute("href")?.split("&")[0].split("=")[1])

    for (let i = 1; i <= 8; i++) {
        const res = await fetch(
            `https://netinfo.takming.edu.tw/tip/stu_stg01.php?page_num=${i}&RgNo=${userid}`,
            {
                headers: {
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
            }
        )
        const buffer = await res.arrayBuffer()
        const html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document
        const rows = Array.from(
            document.querySelectorAll('table[bgcolor="#CCCCCC" ] tr:not(:first-child)')
        )
        rows.forEach((row, index) => {
            if (index !== rows.length - 1) {
                attendanceRecord = []
                const cells = Array.from(row.querySelectorAll("td font"))
                cells.forEach((cell) => {
                    const list = cell.textContent
                    attendanceRecord.push(list ?? "")
                    // console.log("list", list)
                })
                courseAttendanceRecordAll.list.push({
                    date: attendanceRecord[0],
                    week: attendanceRecord[1],
                    period: attendanceRecord[2],
                    type: attendanceRecord[3],
                    courseID: attendanceRecord[4],
                    course: attendanceRecord[5],
                })
            } else if (index === rows.length - 1 && i === 8) {
                const cells = Array.from(row.querySelectorAll("td font"))
                cells.forEach((cell) => {
                    const list = cell.textContent
                    // console.log("total", list)
                    total.push(parseInt(list ?? "0"))
                })
                courseAttendanceRecordAll.total = total
            }
        })
    }

    // 取得courseID的請假數
    // req.nextUrl.searchParams.get("course")

    if (course) {
        const courseID = course
        const courseAttendanceRecordFilter = courseAttendanceRecordAll.list.filter(
            (item) => item.courseID === courseID
        )

        courseAttendanceRecord.list = courseAttendanceRecordFilter

        // 計算total
        // 曠課	病假	事假	公假	朝會不到	朝會遲到	遲到	喪假	婚假	產假	育嬰假	哺育幼兒假	生理假	懷孕假
        total = []
        const title = [
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
        ]

        title.forEach((item) => {
            const count = courseAttendanceRecord.list.filter((list) => list.type === item)
            total.push(count.length)
        })
        courseAttendanceRecord.total = total
        return courseAttendanceRecord
    }
    return courseAttendanceRecordAll
}

export default getCourseAttendanceRecord
