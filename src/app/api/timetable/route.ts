// 課表
// TODO: 待優化
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { JSDOM } from "jsdom"
import { TimeTable } from "@/types"

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession(authOptions)
    const year = searchParams.get("year") ?? cookies().get("cookie_year")?.value
    const sem = searchParams.get("sem") ?? cookies().get("cookie_sem")?.value
    const userid = searchParams.get("userid") ?? session?.user.studentID

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
            cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
            Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
        },
    })

    const buffer = await res.arrayBuffer()
    const html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document

    const rows = Array.from(
        document.querySelectorAll('table[bgcolor="#CCCCCC"] tbody tr:not(:first-child)')
    )

    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll("td:not(:first-child)"))

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
