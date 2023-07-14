import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"
import { TimeTable } from "@/types"
import row from "@/components/timetable/row"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const year = "112" // 學年
    const sem = "1" // 學期
    const rgno = "D11019139" // 學號

    const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_data_new.php", {
        headers: {
            cookie: `cookie_year=${year}; cookie_sem=${sem}; cookie_rgno=${rgno}; cookie_userid=${rgno};`,
            Referer:
                "https://netinfo.takming.edu.tw/tip/list_fun.php?flag=1&item=02&funitem=&Type=2",
        },
    })

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const verify = Array.from(document.querySelectorAll("script"))
    console.log(verify[0].innerHTML)
    // 去除 所有 \r, \n, \t
    const cap = verify[0].innerHTML.replace(/\r|\n|\t/g, "")
    html = html.replace(/\r|\n|\t/g, "")
    html = html.replace(cap, "")

    // rows.forEach((row) => {
    //     const cells = Array.from(row.querySelectorAll("td:not(:first-child)"))

    //     cells.forEach((cell, index) => {
    //         const day = Object.keys(timeTable)[index] as keyof TimeTable
    //         const daylist = cell.innerHTML.replace(/<font size="2">|<\/font>/g, "").split("<br>")
    //         if (daylist[0] === ".") {
    //             timeTable[day].push(["", "", "", ""])
    //         } else {
    //             timeTable[day].push(daylist)
    //         }
    //     })
    // })

    // console.log(weekList)
    return NextResponse.json(html)
}
