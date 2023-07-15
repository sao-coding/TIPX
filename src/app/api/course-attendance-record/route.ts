import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import db from "@/db/timetable.json"
import { CourseAttendanceRecord } from "@/types"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const year = req.cookies.get("cookie_year")?.value
    const sem = req.cookies.get("cookie_sem")?.value
    const userid = req.cookies.get("cookie_userid")?.value
    const dept = req.cookies.get("cookie_dept")?.value
    const es = req.cookies.get("cookie_es")?.value

    const courseAttendanceRecord: CourseAttendanceRecord = {
        list: [],
        total: [],
    }

    let attendanceRecord: string[] = []
    let total: number[] = []

    let res
    if (!req.nextUrl.searchParams.has("id")) {
        res = await fetch("https://netinfo.takming.edu.tw/tip/stu_stg01.php", {
            headers: {
                cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
    } else {
        res = await fetch(
            `https://netinfo.takming.edu.tw/tip/list_course_absrec.php?opno=${req.nextUrl.searchParams.get(
                "id"
            )}`,
            {
                headers: {
                    cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
                    Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
                },
            }
        )
    }

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
            })
            courseAttendanceRecord.list.push({
                date: attendanceRecord[0],
                week: attendanceRecord[1],
                period: attendanceRecord[2],
                type: attendanceRecord[3],
                courseID: attendanceRecord[4],
                course: attendanceRecord[5],
            })
        } else {
            const cells = Array.from(row.querySelectorAll("td font"))
            cells.forEach((cell) => {
                const list = cell.textContent
                total.push(parseInt(list ?? "0"))
            })
            courseAttendanceRecord.total = total
        }
    })

    return NextResponse.json(courseAttendanceRecord)
}
