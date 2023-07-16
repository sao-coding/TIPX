import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { JSDOM } from "jsdom"
import db from "@/db/timetable.json"
import { TimeTable } from "@/types"

export const GET = async (req: NextRequest) => {
    const year = cookies().get("cookie_year")?.value
    const sem = cookies().get("cookie_sem")?.value
    const userid = cookies().get("cookie_userid")?.value
    const dept = cookies().get("cookie_dept")?.value
    const es = cookies().get("cookie_es")?.value
    const authToken = req.headers.get("Authorization")?.startsWith("Bearer ")

    if (
        authToken === false ||
        req.headers.get("Authorization")?.split(" ")[1] !== process.env.AUTHORIZATION
    ) {
        // Unauthorized
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        )
    }

    const timeTable: TimeTable = {
        星期一: [],
        星期二: [],
        星期三: [],
        星期四: [],
        星期五: [],
        星期六: [],
        星期日: [],
    }

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_weeklist.php", {
        headers: {
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; cookie_divcode=${dept}; cookie_programname=${es};`,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    const rows = Array.from(document.querySelectorAll(db.rows))

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll(db.cells))

        cells.forEach((cell, index) => {
            const day = Object.keys(timeTable)[index] as keyof TimeTable
            const daylist = cell.innerHTML.replace(/<font size="2">|<\/font>/g, "").split("<br>")
            if (daylist[0] === ".") {
                timeTable[day].push(["", "", "", ""])
            } else {
                timeTable[day].push(daylist)
            }
        })
    })

    // console.log(weekList)
    return NextResponse.json(timeTable)
    // }

    // fetchData()
}
