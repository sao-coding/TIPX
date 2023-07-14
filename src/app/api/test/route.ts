import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

import { TimeTable } from "@/types"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    // const fetchData = async () => {
    const year = "111" // 學年
    const sem = "2" // 學期
    const rgno = "D11019139" // 學號

    const res = await fetch(
        "https://netinfo.takming.edu.tw/tip/list_course_absrec.php?opno=D192108",
        {
            headers: {
                cookie: `cookie_year=${year}; cookie_sem=${sem}; cookie_rgno=${rgno}; cookie_userid=${rgno}`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        }
    )

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

    // console.log(weekList)
    return NextResponse.json(html)
    // }

    // fetchData()
}
